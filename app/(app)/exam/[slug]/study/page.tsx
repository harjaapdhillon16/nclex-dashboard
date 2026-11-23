import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, eq, ne } from "drizzle-orm";
import { ArrowLeft, BookOpen, ChevronDown, Clock, FileText, Video } from "lucide-react";
import { db } from "@/lib/db";
import { exams, studyMaterials } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { taxonomyNames } from "@/lib/tests";
import { MarkdownText } from "@/components/markdown-text";

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
  const mats = await db
    .select()
    .from(studyMaterials)
    .where(and(eq(studyMaterials.examId, exam.id), eq(studyMaterials.status, "published"), ne(studyMaterials.kind, "cheatsheet")))
    .orderBy(asc(studyMaterials.id));

  const filtered = kind ? mats.filter((m) => m.kind === kind) : mats;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/exam/${exam.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium muted hover:text-foreground mb-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to {exam.shortName} Home
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">{exam.shortName} — all study notes</h1>
        <p className="text-xs sm:text-sm muted max-w-2xl">
          Every lesson for this course in one list. If you&apos;re not sure where to begin, the{" "}
          <Link href={`/exam/${exam.slug}/learn`} className="text-accent underline">
            learning path
          </Link>{" "}
          puts them in order for you.
        </p>
      </div>

      {/* Category Filter Tabs */}
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
            className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
              (kind ?? "") === k ? "border-accent bg-accent text-white" : "border-border bg-surface hover:bg-muted"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Progressive Disclosure Accordion List */}
      {filtered.length === 0 && (
        <div className="panel panel-pad text-sm muted">There are no study notes for {exam.shortName} yet.</div>
      )}
      <div className="space-y-3">
        {filtered.map((m, idx) => {
          const topicName = m.topicId ? taxMap.get(m.topicId)?.name : null;
          return (
            <details key={m.id} open={idx === 0} className="panel group overflow-hidden">
              <summary className="cursor-pointer list-none p-5 flex items-start justify-between gap-4 hover:bg-muted/40 transition select-none">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
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
                    {topicName && <span className="chip bg-muted/60">{topicName}</span>}
                    {m.durationMinutes && (
                      <span className="inline-flex items-center gap-1 muted">
                        <Clock className="h-3 w-3" />
                        {m.durationMinutes} min read
                      </span>
                    )}
                  </div>
                  <h2 className="text-base font-bold">{m.title}</h2>
                  {m.summary && <p className="text-xs muted">{m.summary}</p>}
                </div>
                <span className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold muted group-open:bg-accent-subtle group-open:text-accent shrink-0">
                  <span>Read Guide</span>
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
                </span>
              </summary>

              {m.body && (
                <div className="border-t border-border bg-muted/20 px-5 py-4">
                  <MarkdownText text={m.body} />
                </div>
              )}
            </details>
          );
        })}
      </div>
    </div>
  );
}
