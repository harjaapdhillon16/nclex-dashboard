import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowRight, BookOpen, CheckCircle2, Info, Layers, PenLine } from "lucide-react";
import { db } from "@/lib/db";
import { exams } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { STAGE_LABEL, STAGE_RULES, STAGE_STYLE, getLearningPath, pct, type UnitStage } from "@/lib/learning-path";

export default async function LearnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await requireUser();

  const [exam] = await db.select().from(exams).where(eq(exams.slug, slug)).limit(1);
  if (!exam) notFound();

  const path = await getLearningPath(user.id, exam);
  const { units, totals, nextStep } = path;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Learn {exam.name}</h1>
        <p className="text-sm muted max-w-3xl">
          {exam.shortName} is split into <strong>{units.length} units</strong>. Work through them in order, or jump to any one.
          Each unit has the same three steps:
        </p>
      </header>

      {/* The 3-step method, stated once, plainly */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { n: 1, icon: BookOpen, title: "Read", text: "Short lessons that explain the topic and the traps the exam sets." },
          { n: 2, icon: Layers, title: "Memorise", text: "Flashcards for the facts you have to recall instantly (labs, drugs, doses)." },
          { n: 3, icon: PenLine, title: "Practice", text: "Exam-style questions with the answer and reasoning after each one. This is what tracks your progress." },
        ].map((s) => (
          <div key={s.n} className="panel p-4 flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white text-sm font-bold">
              {s.n}
            </span>
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-sm">
                <s.icon className="h-4 w-4 text-accent" />
                {s.title}
              </div>
              <p className="mt-0.5 text-xs muted">{s.text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Recommended next step */}
      <section className="panel panel-pad flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-accent/40">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-accent">Recommended next</div>
          <h2 className="text-lg font-bold">{nextStep.title}</h2>
          <p className="text-sm muted">{nextStep.detail}</p>
        </div>
        <Link href={nextStep.href} className="btn btn-primary shrink-0">
          {nextStep.cta}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {path.isEarlyAccess && (
        <div className="flex gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs">
          <Info className="h-4 w-4 shrink-0 text-amber-600" />
          <p>
            <strong>{exam.shortName} is an early-access course.</strong> It currently has {totals.lessons} lesson
            {totals.lessons === 1 ? "" : "s"} and {totals.questions} practice question{totals.questions === 1 ? "" : "s"}. More are
            being added. NCLEX-RN is the most complete course today.
          </p>
        </div>
      )}

      {/* Units */}
      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-lg font-bold">
            Units{" "}
            <span className="text-sm font-normal muted">
              ({totals.unitsStrong} of {units.length} strong)
            </span>
          </h2>
        </div>

        <ol className="space-y-3">
          {units.map((u, i) => {
            const covered = u.questionTotal ? Math.min(100, Math.round((u.answered / u.questionTotal) * 100)) : 0;
            return (
              <li key={u.id}>
                <Link
                  href={`/exam/${exam.slug}/learn/${u.id}`}
                  className="panel panel-pad flex flex-col gap-3 transition hover:border-accent/50 sm:flex-row sm:items-center"
                >
                  <div className="flex items-start gap-3 sm:w-[44%]">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-sm font-bold">
                      {u.stage === "strong" ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : i + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-bold leading-snug">{u.name}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <span
                          title={STAGE_RULES[u.stage]}
                          className={`chip border text-[11px] font-semibold ${STAGE_STYLE[u.stage]}`}
                        >
                          {STAGE_LABEL[u.stage]}
                        </span>
                        {u.weight != null && (
                          <span className="text-[11px] muted">{u.weight}% of the real exam</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="muted">
                        {u.answered} of {u.questionTotal} questions answered
                        {u.accuracy != null && ` · ${pct(u.accuracy)}% correct`}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${Math.max(covered, u.answered > 0 ? 4 : 0)}%` }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] muted">
                      <span>
                        <BookOpen className="mr-1 inline h-3 w-3" />
                        {u.lessons.length} lesson{u.lessons.length === 1 ? "" : "s"}
                      </span>
                      <span>
                        <Layers className="mr-1 inline h-3 w-3" />
                        {u.cardTotal} flashcard{u.cardTotal === 1 ? "" : "s"}
                      </span>
                      <span>
                        <PenLine className="mr-1 inline h-3 w-3" />
                        {u.questionTotal} question{u.questionTotal === 1 ? "" : "s"}
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="hidden h-4 w-4 shrink-0 muted sm:block" />
                </Link>
              </li>
            );
          })}
        </ol>

        {units.length === 0 && (
          <div className="panel panel-pad text-sm muted">
            No units have been published for {exam.shortName} yet. You can still{" "}
            <Link className="text-accent underline" href={`/exam/${exam.slug}/create`}>
              practice with questions
            </Link>
            .
          </div>
        )}
      </section>

      {path.looseLessons.length > 0 && (
        <section className="panel panel-pad space-y-2">
          <h2 className="text-sm font-bold">More reading, not tied to one unit</h2>
          <ul className="space-y-1 text-sm">
            {path.looseLessons.map((l) => (
              <li key={l.id}>
                <Link href={`/exam/${exam.slug}/study`} className="text-accent hover:underline">
                  {l.title}
                </Link>
                <span className="muted"> · {l.kind}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Legend: what the labels mean */}
      <section className="panel panel-pad space-y-2">
        <h2 className="text-sm font-bold">What the labels mean</h2>
        <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2 text-xs">
          {(Object.keys(STAGE_LABEL) as UnitStage[]).map((s) => (
            <div key={s} className="flex gap-2">
              <dt className={`chip border text-[11px] font-semibold h-fit shrink-0 ${STAGE_STYLE[s]}`}>{STAGE_LABEL[s]}</dt>
              <dd className="muted">{STAGE_RULES[s]}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
