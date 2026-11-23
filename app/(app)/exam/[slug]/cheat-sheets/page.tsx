import { notFound } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { exams, studyMaterials, taxonomy } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { CheatSheetBrowser, type SheetCard } from "./browser";

export const metadata = { title: "Cheat sheets" };

export default async function CheatSheetsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await requireUser();

  const [exam] = await db.select().from(exams).where(eq(exams.slug, slug)).limit(1);
  if (!exam) notFound();

  const [rows, tax] = await Promise.all([
    db
      .select()
      .from(studyMaterials)
      .where(and(eq(studyMaterials.examId, exam.id), eq(studyMaterials.kind, "cheatsheet"), eq(studyMaterials.status, "published")))
      .orderBy(asc(studyMaterials.id)),
    db.select({ id: taxonomy.id, name: taxonomy.name, parentId: taxonomy.parentId }).from(taxonomy).where(eq(taxonomy.examId, exam.id)),
  ]);
  const byId = new Map(tax.map((t) => [t.id, t]));

  const sheets: SheetCard[] = rows.map((r) => {
    const topic = r.topicId ? byId.get(r.topicId) : undefined;
    const parent = topic?.parentId ? byId.get(topic.parentId) : undefined;
    return { id: r.id, title: r.title, summary: r.summary ?? "", category: parent?.name ?? "General", topic: topic?.name ?? "", minutes: r.durationMinutes ?? 2 };
  });
  const counts = new Map<string, number>();
  for (const s of sheets) counts.set(s.category, (counts.get(s.category) ?? 0) + 1);
  const categories = [...counts].map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Cheat sheets</h1>
        <p className="max-w-2xl text-sm muted">
          One-page, high-yield summaries for fast revision: tables, mnemonics and the nursing priorities that come up again and again. Print any sheet or save it as a PDF.
        </p>
      </header>
      {sheets.length === 0 ? (
        <div className="panel panel-pad text-sm muted">There are no cheat sheets for {exam.shortName} yet.</div>
      ) : (
        <CheatSheetBrowser examSlug={exam.slug} sheets={sheets} categories={categories} />
      )}
    </div>
  );
}
