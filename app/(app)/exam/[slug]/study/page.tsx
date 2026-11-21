import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { ArrowLeft, BookOpen, Clock, FileText, Video } from "lucide-react";
import { db } from "@/lib/db";
import { exams, studyMaterials } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { taxonomyNames } from "@/lib/tests";

export default async function ExamStudyMaterialsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ kind?: string }>;
}) {
  const { slug } = await params;
  const { kind } = await searchParams;
  await requireUser();

  const [exam] = await db.select().from(exams).where(eq(exams.slug, slug)).limit(1);
  if (!exam) notFound();

  const taxMap = await taxonomyNames(exam.id);
  let mats = await db
    .select()
    .from(studyMaterials)
    .where(and(eq(studyMaterials.examId, exam.id), eq(studyMaterials.status, "published")))
    .orderBy(asc(studyMaterials.id));

  // If this course doesn't have dedicated materials yet, include general clinical/academic study guides
  if (mats.length === 0) {
    mats = await db
      .select()
      .from(studyMaterials)
      .where(eq(studyMaterials.status, "published"))
      .orderBy(asc(studyMaterials.id))
      .limit(20);
  }

  const filtered = kind ? mats.filter((m) => m.kind === kind) : mats;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/exam/${exam.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium muted hover:text-foreground mb-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to {exam.shortName} Dashboard
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">{exam.name} — Topic Notes, High-Yield Guides &amp; Videos</h1>
        <p className="text-xs sm:text-sm muted">
          Concise rapid-review clinical sheets, pharmacology tables, and structured video lecture outlines.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["", `All Resources (${mats.length})`],
            ["notes", `Topic-Wise Notes (${mats.filter((m) => m.kind === "notes").length})`],
            ["guide", `High-Yield Guides (${mats.filter((m) => m.kind === "guide").length})`],
            ["video", `Video Lectures (${mats.filter((m) => m.kind === "video").length})`],
          ] as const
        ).map(([k, label]) => (
          <Link
            key={k}
            href={k ? `/exam/${exam.slug}/study?kind=${k}` : `/exam/${exam.slug}/study`}
            className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
              (kind ?? "") === k ? "border-accent bg-accent text-white" : "border-border hover:bg-muted"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filtered.map((m) => {
          const topicName = m.topicId ? taxMap.get(m.topicId)?.name : null;
          return (
            <article key={m.id} className="panel panel-pad space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="chip bg-accent-subtle text-accent border-accent/25 capitalize font-semibold">
                  {m.kind === "video" ? (
                    <Video className="h-3.5 w-3.5" />
                  ) : m.kind === "guide" ? (
                    <BookOpen className="h-3.5 w-3.5" />
                  ) : (
                    <FileText className="h-3.5 w-3.5" />
                  )}
                  {m.kind}
                </span>
                <div className="flex items-center gap-2 muted">
                  {topicName && <span>{topicName}</span>}
                  {m.durationMinutes && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {m.durationMinutes}m
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-base font-bold">{m.title}</h2>
                {m.summary && <p className="text-xs muted mt-1">{m.summary}</p>}
              </div>

              {m.body && (
                <div className="rounded-xl bg-muted/40 border border-border p-3.5 text-xs leading-relaxed whitespace-pre-line">
                  {m.body}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
