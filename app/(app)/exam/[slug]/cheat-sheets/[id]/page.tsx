import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { ArrowLeft, ArrowRight, Clock, PenLine } from "lucide-react";
import { db } from "@/lib/db";
import { exams, studyMaterials, taxonomy } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { MarkdownText } from "@/components/markdown-text";
import { PrintButton } from "@/components/print-button";

export default async function CheatSheetPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  await requireUser();
  const sheetId = Number(id);
  if (!Number.isFinite(sheetId)) notFound();

  const [exam] = await db.select().from(exams).where(eq(exams.slug, slug)).limit(1);
  if (!exam) notFound();

  const all = await db
    .select({ id: studyMaterials.id, title: studyMaterials.title })
    .from(studyMaterials)
    .where(and(eq(studyMaterials.examId, exam.id), eq(studyMaterials.kind, "cheatsheet"), eq(studyMaterials.status, "published")))
    .orderBy(asc(studyMaterials.id));
  const idx = all.findIndex((s) => s.id === sheetId);
  if (idx < 0) notFound();
  const [sheet] = await db.select().from(studyMaterials).where(eq(studyMaterials.id, sheetId)).limit(1);

  let topicName: string | undefined;
  let categoryName: string | undefined;
  if (sheet.topicId) {
    const [t] = await db.select().from(taxonomy).where(eq(taxonomy.id, sheet.topicId)).limit(1);
    topicName = t?.name;
    if (t?.parentId) categoryName = (await db.select().from(taxonomy).where(eq(taxonomy.id, t.parentId)).limit(1))[0]?.name;
  }
  const prev = all[idx - 1];
  const next = all[idx + 1];

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link href={`/exam/${exam.slug}/cheat-sheets`} className="no-print inline-flex items-center gap-1.5 text-xs font-medium muted hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" />
        All cheat sheets
      </Link>

      <article className="panel panel-pad space-y-4">
        <header className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {categoryName && <span className="chip bg-accent-subtle font-semibold text-accent">{categoryName}</span>}
            {topicName && <span className="chip">{topicName}</span>}
            <span className="inline-flex items-center gap-1 muted">
              <Clock className="h-3 w-3" />
              {sheet.durationMinutes ?? 2} min
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{sheet.title}</h1>
          {sheet.summary && <p className="text-sm muted">{sheet.summary}</p>}
        </header>
        <div className="border-t border-border pt-3">
          <MarkdownText text={sheet.body} />
        </div>
        <p className="border-t border-border pt-3 text-[11px] leading-snug faint">
          Quick-revision summary for exam preparation. Always follow your facility&apos;s policies and current guidelines in practice. {exam.name} study material from QREXq, an independent
          education platform.
        </p>
      </article>

      <div className="no-print flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <PrintButton />
          {sheet.topicId && (
            <Link href={`/exam/${exam.slug}/create?topicId=${sheet.topicId}`} className="btn btn-primary btn-sm">
              <PenLine className="h-3.5 w-3.5" />
              Practice this topic
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2">
          {prev && (
            <Link href={`/exam/${exam.slug}/cheat-sheets/${prev.id}`} className="btn btn-secondary btn-sm" title={prev.title}>
              <ArrowLeft className="h-3.5 w-3.5" /> Previous
            </Link>
          )}
          {next && (
            <Link href={`/exam/${exam.slug}/cheat-sheets/${next.id}`} className="btn btn-secondary btn-sm" title={next.title}>
              Next <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
