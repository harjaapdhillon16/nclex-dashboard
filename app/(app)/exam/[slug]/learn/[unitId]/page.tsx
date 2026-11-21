import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft, ArrowRight, BookOpen, ChevronDown, Clock, FileText, Layers, PenLine, Video } from "lucide-react";
import { db } from "@/lib/db";
import { exams } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { STAGE_LABEL, STAGE_RULES, STAGE_STYLE, getLearningPath, pct, unitFieldName } from "@/lib/learning-path";
import { MarkdownText } from "@/components/markdown-text";
import { startCustomTestAction } from "../../../../actions";

export default async function UnitPage({ params }: { params: Promise<{ slug: string; unitId: string }> }) {
  const { slug, unitId } = await params;
  const user = await requireUser();

  const [exam] = await db.select().from(exams).where(eq(exams.slug, slug)).limit(1);
  if (!exam) notFound();

  const path = await getLearningPath(user.id, exam);
  const idx = path.units.findIndex((u) => String(u.id) === unitId);
  if (idx === -1) notFound();
  const unit = path.units[idx]!;
  const next = path.units[idx + 1];
  const prev = path.units[idx - 1];

  const practiceCount = Math.min(10, unit.questionTotal);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/exam/${exam.slug}/learn`}
          className="inline-flex items-center gap-1.5 text-xs font-medium muted hover:text-foreground mb-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All {exam.shortName} units
        </Link>
        <div className="flex flex-wrap items-center gap-2 text-xs muted">
          <span>
            Unit {idx + 1} of {path.units.length}
          </span>
          {unit.weight != null && <span>· {unit.weight}% of the real exam</span>}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{unit.name}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span title={STAGE_RULES[unit.stage]} className={`chip border text-[11px] font-semibold ${STAGE_STYLE[unit.stage]}`}>
            {STAGE_LABEL[unit.stage]}
          </span>
          <span className="text-xs muted">
            {unit.answered} of {unit.questionTotal} questions answered
            {unit.accuracy != null && ` · ${pct(unit.accuracy)}% correct`}
          </span>
        </div>
        {unit.description && <p className="mt-2 text-sm muted max-w-3xl">{unit.description}</p>}
      </div>

      {/* Step 1: Read */}
      <section className="space-y-3">
        <StepHeading n={1} icon={BookOpen} title="Read" sub={unit.lessons.length ? "Open a lesson to read it here." : undefined} />
        {unit.lessons.length === 0 ? (
          <div className="panel panel-pad text-sm muted">
            There are no written lessons for this unit yet. Skip to flashcards or practice questions below. Every answer comes with
            an explanation.
          </div>
        ) : (
          <div className="space-y-3">
            {unit.lessons.map((l, i) => (
              <details key={l.id} open={i === 0} className="panel group overflow-hidden">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-4 hover:bg-muted/40 select-none">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="chip bg-accent-subtle text-accent border-accent/25 capitalize font-semibold">
                        {l.kind === "video" ? (
                          <Video className="h-3.5 w-3.5" />
                        ) : l.kind === "guide" ? (
                          <BookOpen className="h-3.5 w-3.5" />
                        ) : (
                          <FileText className="h-3.5 w-3.5" />
                        )}
                        {l.kind === "guide" ? "Guide" : l.kind === "video" ? "Video outline" : "Notes"}
                      </span>
                      {l.durationMinutes && (
                        <span className="inline-flex items-center gap-1 muted">
                          <Clock className="h-3 w-3" />
                          {l.durationMinutes} min
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold">{l.title}</h3>
                    {l.summary && <p className="text-xs muted">{l.summary}</p>}
                  </div>
                  <ChevronDown className="mt-1 h-4 w-4 shrink-0 muted transition-transform group-open:rotate-180" />
                </summary>
                {l.body && (
                  <div className="border-t border-border bg-muted/20 px-5 py-4 space-y-4">
                    <MarkdownText text={l.body} />
                    {l.topicId && l.topicQuestionCount > 0 && (
                      <form action={startCustomTestAction} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3">
                        <input type="hidden" name="examSlug" value={exam.slug} />
                        <input type="hidden" name="kind" value="tutorial" />
                        <input type="hidden" name="mode" value="tutor" />
                        <input type="hidden" name="count" value={String(Math.min(5, l.topicQuestionCount))} />
                        <input type="hidden" name="topicIds" value={l.topicId} />
                        <input type="hidden" name="name" value={`${l.topicName ?? l.title} quick check`} />
                        <p className="text-xs">
                          <strong>Finished reading?</strong>{" "}
                          <span className="muted">Check you got it with {Math.min(5, l.topicQuestionCount)} questions on this topic.</span>
                        </p>
                        <button type="submit" className="btn btn-primary btn-sm shrink-0">
                          Quick check
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </details>
            ))}
          </div>
        )}
      </section>

      {/* Step 2: Memorise */}
      <section className="space-y-3">
        <StepHeading n={2} icon={Layers} title="Memorise" />
        <div className="panel panel-pad flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {unit.cardTotal > 0 ? (
            <>
              <p className="text-sm">
                <strong>{unit.cardsToStudy}</strong> of {unit.cardTotal} flashcards are ready to study now.
                <span className="block text-xs muted">Cards you rate “hard” come back sooner; ones you know come back later.</span>
              </p>
              <Link href={`/exam/${exam.slug}/flashcards?unit=${unit.id}`} className="btn btn-secondary btn-sm shrink-0">
                Study flashcards
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          ) : (
            <p className="text-sm muted">No flashcards for this unit yet.</p>
          )}
        </div>
      </section>

      {/* Step 3: Practice */}
      <section className="space-y-3">
        <StepHeading n={3} icon={PenLine} title="Practice" sub="This is what moves your progress bar." />
        <div className="panel panel-pad flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {unit.questionTotal > 0 ? (
            <>
              <p className="text-sm">
                <strong>{unit.questionTotal}</strong> questions in this unit. You&apos;ll see the answer and why after each one.
                <span className="block text-xs muted">
                  Questions you haven&apos;t seen yet are picked first. Once you&apos;ve seen them all, you&apos;ll get them again.
                </span>
              </p>
              <form action={startCustomTestAction} className="shrink-0">
                <input type="hidden" name="examSlug" value={exam.slug} />
                <input type="hidden" name="kind" value="tutorial" />
                <input type="hidden" name="mode" value="tutor" />
                <input type="hidden" name="pool" value="unused" />
                <input type="hidden" name="count" value={String(practiceCount)} />
                <input type="hidden" name={unitFieldName(path.unitKind)} value={unit.id} />
                <input type="hidden" name="name" value={`${unit.name} practice`} />
                <button type="submit" className="btn btn-primary btn-sm">
                  Practice {practiceCount} questions
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            </>
          ) : (
            <p className="text-sm muted">No practice questions for this unit yet.</p>
          )}
        </div>
      </section>

      {/* Prev / next */}
      <nav className="flex items-center justify-between gap-3 border-t border-border pt-4 text-sm">
        {prev ? (
          <Link href={`/exam/${exam.slug}/learn/${prev.id}`} className="inline-flex items-center gap-1.5 muted hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            {prev.name}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/exam/${exam.slug}/learn/${next.id}`} className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline">
            Next unit: {next.name}
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <Link href={`/exam/${exam.slug}/tests`} className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline">
            Finished all units — take a mock exam
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </nav>
    </div>
  );
}

function StepHeading({
  n,
  icon: Icon,
  title,
  sub,
}: {
  n: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  sub?: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white text-xs font-bold">{n}</span>
      <h2 className="flex items-center gap-1.5 text-lg font-bold">
        <Icon className="h-4 w-4 text-accent" />
        {title}
      </h2>
      {sub && <span className="text-xs muted">{sub}</span>}
    </div>
  );
}
