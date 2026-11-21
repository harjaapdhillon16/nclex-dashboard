import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { ArrowRight, BookOpen, Calendar, ClipboardList, Flame, Info, PenLine, Target } from "lucide-react";
import { db } from "@/lib/db";
import { enrollments, exams } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { examAnalytics } from "@/lib/tests";
import { estimate } from "@/lib/scoring";
import { STAGE_LABEL, STAGE_STYLE, daysUntil, getLearningPath, pct, type Unit } from "@/lib/learning-path";
import type { ScoringModel } from "@/lib/seed/catalog";
import { Bar, Donut, SectionHeading, accTone } from "./_ui";

const LEVEL_TEXT = {
  strong: "text-emerald-600 dark:text-emerald-400",
  moderate: "text-amber-600 dark:text-amber-400",
  weak: "text-rose-600 dark:text-rose-400",
} as const;

export default async function ExamHomePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await requireUser();

  const [exam] = await db.select().from(exams).where(eq(exams.slug, slug)).limit(1);
  if (!exam) notFound();

  // Opening a course enrols you in it so progress is tracked from the first question.
  const [enrollment] = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.userId, user.id), eq(enrollments.examId, exam.id)))
    .limit(1);
  if (!enrollment) {
    await db
      .insert(enrollments)
      .values({ userId: user.id, examId: exam.id, dailyGoal: user.dailyGoal, targetDate: user.targetExamDate })
      .onConflictDoNothing();
  }

  const [stats, path] = await Promise.all([examAnalytics(user.id, exam.id), getLearningPath(user.id, exam)]);
  const { units, totals, nextStep, bank } = path;

  const est = estimate(exam.scoring as ScoringModel, stats.accuracy || 0, {
    difficultyWeighted: stats.readiness || stats.accuracy || 0,
  });

  const dailyGoal = enrollment?.dailyGoal ?? user.dailyGoal ?? 50;
  const dailyPct = Math.min(100, Math.round((stats.today / Math.max(1, dailyGoal)) * 100));
  const targetDateStr = enrollment?.targetDate ?? user.targetExamDate;
  const daysUntilTarget = daysUntil(targetDateStr);

  const started = totals.attempts > 0;
  const used = bank.correct + bank.incorrect + bank.omitted;

  // Weakest first among units you've touched, then the ones still to start, in blueprint order.
  const touched = units.filter((u) => u.stage !== "not_started").sort((a, b) => (a.accuracy ?? 1) - (b.accuracy ?? 1));
  const untouched = units.filter((u) => u.stage === "not_started");
  const rankedUnits: Unit[] = [...touched, ...untouched];

  const recent = stats.recentTests.slice(0, 3);

  return (
    <div className="space-y-6">
      <header className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {daysUntilTarget !== null && (
            <span className="chip">
              <Calendar className="h-3.5 w-3.5 text-accent" />
              {daysUntilTarget} days to your exam
            </span>
          )}
          {stats.streak > 0 && (
            <span className="chip">
              <Flame className="h-3.5 w-3.5 text-amber-500" />
              {stats.streak}-day streak
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{exam.name}</h1>
      </header>

      {path.isEarlyAccess && (
        <div className="flex gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs">
          <Info className="h-4 w-4 shrink-0 text-amber-600" />
          <p>
            <strong>Early-access course.</strong> {totals.lessons} lesson{totals.lessons === 1 ? "" : "s"} and {bank.total} practice
            question{bank.total === 1 ? "" : "s"} so far; more are being added.
          </p>
        </div>
      )}

      {/* The one thing to do now */}
      <section className="panel panel-pad flex flex-col gap-4 border-accent/40 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-accent">Your next step</div>
          <h2 className="text-xl font-bold">{nextStep.title}</h2>
          <p className="max-w-2xl text-sm muted">{nextStep.detail}</p>
        </div>
        <Link href={nextStep.href} className="btn btn-primary shrink-0">
          {nextStep.cta}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {!started ? (
        /* New learner: explain the loop instead of showing empty charts */
        <section className="space-y-3">
          <SectionHeading
            title={`How ${exam.shortName} works here`}
            caption={`${bank.total} questions · ${totals.lessons} lessons · ${totals.cards} flashcards`}
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Link href={`/exam/${exam.slug}/learn`} className="panel space-y-2 p-4 transition hover:border-accent/50">
              <div className="flex items-center gap-2 font-bold">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs text-white">1</span>
                <BookOpen className="h-4 w-4 text-accent" />
                Learn
              </div>
              <p className="text-xs muted">
                {units.length} unit{units.length === 1 ? "" : "s"}, each with lessons, flashcards and practice questions.
              </p>
              <div className="text-xs font-semibold text-accent">Open the learning path →</div>
            </Link>
            <Link href={`/exam/${exam.slug}/create`} className="panel space-y-2 p-4 transition hover:border-accent/50">
              <div className="flex items-center gap-2 font-bold">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs text-white">2</span>
                <PenLine className="h-4 w-4 text-accent" />
                Practice
              </div>
              <p className="text-xs muted">Build a test from any units and get the answer and reasoning after every question.</p>
              <div className="text-xs font-semibold text-accent">Create a test →</div>
            </Link>
            <Link href={`/exam/${exam.slug}/tests`} className="panel space-y-2 p-4 transition hover:border-accent/50">
              <div className="flex items-center gap-2 font-bold">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs text-white">3</span>
                <ClipboardList className="h-4 w-4 text-accent" />
                Test yourself
              </div>
              <p className="text-xs muted">
                A timed mock exam: {exam.mockQuestionCount} questions in {exam.durationMinutes} minutes, answers at the end.
              </p>
              <div className="text-xs font-semibold text-accent">See mock exams →</div>
            </Link>
          </div>
        </section>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Question bank usage */}
            <div className="panel panel-pad space-y-4">
              <SectionHeading title="Question bank" caption={`${used} of ${bank.total} questions used`} />
              <div className="flex items-center gap-5">
                <Donut
                  segments={[
                    { label: "Correct", value: bank.correct, stroke: "stroke-emerald-500", dot: "bg-emerald-500" },
                    { label: "Incorrect", value: bank.incorrect, stroke: "stroke-rose-500", dot: "bg-rose-500" },
                    { label: "Omitted", value: bank.omitted, stroke: "stroke-amber-500", dot: "bg-amber-500" },
                  ]}
                  center={`${bank.total ? Math.round((used / bank.total) * 100) : 0}%`}
                  sub="used"
                />
                <ul className="flex-1 space-y-1.5 text-xs">
                  {[
                    { l: "Correct", v: bank.correct, d: "bg-emerald-500" },
                    { l: "Incorrect", v: bank.incorrect, d: "bg-rose-500" },
                    { l: "Omitted", v: bank.omitted, d: "bg-amber-500" },
                    { l: "Unused", v: bank.unused, d: "bg-muted border border-border" },
                  ].map((r) => (
                    <li key={r.l} className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${r.d}`} />
                        {r.l}
                      </span>
                      <span className="font-semibold tabular-nums">{r.v}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-[11px] leading-snug muted">
                Each question counts once, by your most recent answer. Omitted means you skipped it in a finished test.
              </p>
            </div>

            {/* Readiness */}
            <div className="panel panel-pad flex flex-col justify-between space-y-3">
              <SectionHeading title={est.label} caption="Practice estimate" />
              <div>
                <div className={`text-3xl font-bold ${est.level ? LEVEL_TEXT[est.level] : "text-accent"}`}>{est.headline}</div>
                <p className="mt-1 text-xs muted">
                  {totals.attempts < 30
                    ? `Based on only ${totals.attempts} answer${totals.attempts === 1 ? "" : "s"}. Answer at least 30 for a steadier read.`
                    : (est.detail ?? `Based on ${totals.attempts} answers.`)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 border-t border-border pt-3 text-xs">
                <div>
                  <div className={`text-lg font-bold ${accTone(stats.accuracy).text}`}>{Math.round(stats.accuracy * 100)}%</div>
                  <div className="muted">overall accuracy</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{Math.round(stats.avgTime)}s</div>
                  <div className="muted">per question</div>
                </div>
              </div>
              <p className="text-[11px] leading-snug faint">{est.disclaimer}</p>
            </div>

            {/* Today */}
            <div className="panel panel-pad space-y-4">
              <SectionHeading title="Today" caption="Questions answered vs. your daily goal" />
              <div>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-bold tabular-nums">
                    {stats.today}
                    <span className="text-base font-normal muted"> / {dailyGoal}</span>
                  </div>
                  <span className="text-xs muted">{dailyPct}%</span>
                </div>
                <div className="mt-2">
                  <Bar value={dailyPct} height="h-2" />
                </div>
              </div>
              <ul className="space-y-2 border-t border-border pt-3 text-xs">
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Flame className="h-3.5 w-3.5 text-amber-500" /> Streak
                  </span>
                  <span className="font-semibold">
                    {stats.streak} day{stats.streak === 1 ? "" : "s"}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-accent" /> Exam date
                  </span>
                  <span className="font-semibold">
                    {daysUntilTarget !== null ? (
                      `${daysUntilTarget} days`
                    ) : (
                      <Link href="/profile" className="text-accent underline">
                        Set a date
                      </Link>
                    )}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Target className="h-3.5 w-3.5 text-accent" /> Daily goal
                  </span>
                  <Link href="/profile" className="font-semibold text-accent underline">
                    {dailyGoal} questions
                  </Link>
                </li>
              </ul>
            </div>
          </section>

          {/* Performance by unit */}
          <section className="space-y-3">
            <SectionHeading
              title="Performance by unit"
              caption="Weakest first. Open a unit to read, memorise and practice it."
              right={
                <Link href={`/exam/${exam.slug}/analytics`} className="text-xs font-semibold text-accent hover:underline">
                  Full progress →
                </Link>
              }
            />
            <div className="panel divide-y divide-border overflow-hidden">
              {rankedUnits.map((u) => {
                const tone = accTone(u.accuracy);
                return (
                  <Link
                    key={u.id}
                    href={`/exam/${exam.slug}/learn/${u.id}`}
                    className="grid grid-cols-1 gap-2 px-4 py-3 transition hover:bg-muted/50 sm:grid-cols-12 sm:items-center sm:gap-4"
                  >
                    <div className="sm:col-span-5">
                      <div className="text-sm font-semibold leading-snug">{u.name}</div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                        <span className={`chip border text-[10px] font-semibold ${STAGE_STYLE[u.stage]}`}>{STAGE_LABEL[u.stage]}</span>
                        {u.weight != null && <span className="text-[11px] muted">{u.weight}% of exam</span>}
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <div className="mb-1 text-[11px] muted tabular-nums">
                        {u.answered} / {u.questionTotal} answered
                      </div>
                      <Bar value={u.questionTotal ? (u.answered / u.questionTotal) * 100 : 0} />
                    </div>
                    <div className="sm:col-span-3">
                      <div className={`mb-1 text-[11px] font-semibold tabular-nums ${tone.text}`}>
                        {u.accuracy == null ? "No answers yet" : `${pct(u.accuracy)}% correct`}
                      </div>
                      <Bar value={pct(u.accuracy)} className={tone.bar} />
                    </div>
                    <ArrowRight className="hidden h-4 w-4 justify-self-end muted sm:col-span-1 sm:block" />
                  </Link>
                );
              })}
            </div>
          </section>
        </>
      )}

      {recent.length > 0 && (
        <section className="space-y-3">
          <SectionHeading
            title="Recent tests"
            right={
              <Link href={`/exam/${exam.slug}/tests`} className="text-xs font-semibold text-accent hover:underline">
                All tests →
              </Link>
            }
          />
          <div className="panel divide-y divide-border">
            {recent.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{t.name}</div>
                  <div className="text-xs muted">
                    {t.n} questions · {t.status === "completed" ? "Finished" : "In progress"}
                  </div>
                </div>
                <Link
                  href={t.status === "completed" ? `/test/${t.id}/results` : `/test/${t.id}`}
                  className="btn btn-secondary btn-sm shrink-0"
                >
                  {t.status === "completed" ? "Review" : "Resume"}
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
