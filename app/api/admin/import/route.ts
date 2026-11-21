import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { db } from "@/lib/db";
import { exams } from "@/lib/db/schema";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { importQuestions } from "@/lib/seed/importer";
import type { Difficulty, QuestionType, SeedQuestion } from "@/lib/questions/types";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const examSlug = String(formData.get("examSlug") ?? "nclex-rn");
    const file = formData.get("file") as File | null;
    const rawJson = String(formData.get("rawJson") ?? "").trim();

    const [exam] = await db.select().from(exams).where(eq(exams.slug, examSlug)).limit(1);
    if (!exam) return NextResponse.json({ error: "Unknown examination course" }, { status: 400 });

    let rawRows: Record<string, unknown>[] = [];

    if (rawJson) {
      const parsed = JSON.parse(rawJson);
      rawRows = Array.isArray(parsed) ? parsed : [parsed];
    } else if (file) {
      const name = file.name.toLowerCase();
      if (name.endsWith(".json")) {
        const text = await file.text();
        const parsed = JSON.parse(text);
        rawRows = Array.isArray(parsed) ? parsed : [parsed];
      } else if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
        const ab = await file.arrayBuffer();
        const wb = XLSX.read(ab, { type: "array" });
        const sheet = wb.Sheets[wb.SheetNames[0]!];
        rawRows = sheet ? (XLSX.utils.sheet_to_json(sheet) as Record<string, unknown>[]) : [];
      } else {
        const text = await file.text();
        const parsed = Papa.parse<Record<string, unknown>>(text, { header: true, skipEmptyLines: true });
        rawRows = parsed.data;
      }
    }

    const candidates: SeedQuestion[] = rawRows.map((r) => {
      if (r.content && typeof r.content === "object" && r.answer && typeof r.answer === "object") {
        return {
          ...(r as unknown as SeedQuestion),
          exam: String(r.exam ?? exam.slug),
        };
      }
      const opts = ["A", "B", "C", "D"]
        .map((letter) => ({
          id: letter.toLowerCase(),
          text: String(r[`opt${letter}`] ?? r[letter.toLowerCase()] ?? "").trim(),
        }))
        .filter((o) => o.text.length > 0);

      const type = (String(r.type ?? "mcq").trim() as QuestionType) || "mcq";
      const correctStr = String(r.correct ?? "").trim().toLowerCase();

      return {
        exam: String(r.exam ?? exam.slug),
        category: r.category ? String(r.category) : undefined,
        subject: r.subject ? String(r.subject) : undefined,
        system: r.system ? String(r.system) : undefined,
        topic: String(r.topic ?? "").trim(),
        type,
        difficulty: (String(r.difficulty ?? "moderate") as Difficulty) || "moderate",
        stem: String(r.stem ?? "").trim(),
        content: { options: opts },
        answer:
          type === "sata" || type === "multiple_response"
            ? { correct: correctStr.split(",").map((s) => s.trim()).filter(Boolean) }
            : { correct: correctStr },
        rationale: String(r.rationale ?? "").trim(),
      };
    });

    const report = await importQuestions(exam, candidates, {
      status: "draft",
      source: "import",
      createdBy: user.id,
    });

    return NextResponse.json({
      totalRows: candidates.length,
      created: report.created,
      duplicates: report.duplicates,
      invalid: report.invalid,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
