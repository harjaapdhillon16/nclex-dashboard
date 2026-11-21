import { NextResponse } from "next/server";
import { asc, desc, eq } from "drizzle-orm";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { db } from "@/lib/db";
import { caseStudies, questions, results } from "@/lib/db/schema";
import { getCurrentUser, isStaff } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  // Exports include every learner's results, so staff only.
  if (!user || !isStaff(user.role)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const entity = url.searchParams.get("entity") ?? "questions";
  const format = url.searchParams.get("format") ?? "csv";

  let rows: Record<string, unknown>[] = [];
  const filename = `qrexq-${entity}`;

  if (entity === "template") {
    rows = [
      {
        exam: "nclex-rn",
        category: "Management of Care",
        subject: "Leadership and Management",
        system: "Cardiovascular",
        topic: "Prioritization",
        type: "mcq",
        difficulty: "moderate",
        stem: "Which client should the nurse assess first after change-of-shift report?",
        optA: "Client with acute stridor and restlessness",
        optB: "Client with stable chronic hypertension",
        optC: "Client requesting routine PRN stool softener",
        optD: "Client awaiting discharge education",
        correct: "a",
        rationale: "Acute stridor indicates airway compromise and takes highest priority under the ABC framework.",
      },
    ];
  } else if (entity === "questions" || entity === "approved") {
    const qRows = await db
      .select()
      .from(questions)
      .where(entity === "approved" ? eq(questions.status, "published") : undefined)
      .orderBy(asc(questions.id))
      .limit(1000);
    rows = qRows.map((q) => ({
      code: q.code,
      examId: q.examId,
      type: q.type,
      difficulty: q.difficulty,
      status: q.status,
      source: q.source,
      stem: q.stem,
      rationale: q.rationale,
      content: JSON.stringify(q.content),
      answer: JSON.stringify(q.answer),
    }));
  } else if (entity === "cases") {
    const cRows = await db.select().from(caseStudies).orderBy(asc(caseStudies.id));
    rows = cRows.map((c) => ({
      id: c.id,
      examId: c.examId,
      title: c.title,
      difficulty: c.difficulty,
      status: c.status,
      summary: c.summary,
    }));
  } else if (entity === "results") {
    const rRows = await db.select().from(results).orderBy(desc(results.completedAt)).limit(500);
    rows = rRows.map((r) => ({
      id: r.id,
      testId: r.testId,
      examId: r.examId,
      total: r.total,
      correct: r.correct,
      incorrect: r.incorrect,
      unanswered: r.unanswered,
      percent: Math.round(r.percent * 10) / 10,
      totalTimeSec: r.totalTimeSec,
      completedAt: r.completedAt.toISOString(),
    }));
  }

  if (format === "json") {
    return new NextResponse(JSON.stringify(rows, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}.json"`,
      },
    });
  }

  if (format === "xlsx") {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}.xlsx"`,
      },
    });
  }

  const csv = Papa.unparse(rows);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}.csv"`,
    },
  });
}
