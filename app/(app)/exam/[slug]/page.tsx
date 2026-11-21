import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { ArrowRight, BookOpen, Calendar, ClipboardList, Flame, Info, PenLine, Target } from "lucide-react";
import { db } from "@/lib/db";
import { enrollments, exams } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { examAnalytics } from "@/lib/tests";
import { estimate } from "@/lib/scoring";
import { getLearningPath, pct } from "@/lib/learning-path";
import type { ScoringModel } from "@/lib/seed/catalog";
import { startCustomTestAction } from "../../actions";

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
  const { units, totals, nextStep } = path;

  const est = estimate(exam.scoring as ScoringModel, stats.accuracy || 0, {
    difficultyWeighted: stats.readiness || stats.accuracy || 0,
  });

  const dailyGoal = enrollment?.dailyGoal ?? user.dailyGoal ?? 50;
  const dailyPct = Math.min(100, Math.round((stats.today / Math.max(1, dailyGoal)) * 100));
  const targetDateStr = enrollment?.targetDate ?? user.targetExamDate;
  const daysUntilTarget = targetDateStr
    ? Math.max(0, Math.ceil((new Date(targetDateStr).getTime() - Date.now()) / 86400000))
    : null;

  const started = totals.answered > 0;
  const unitPct = units.length ? Math.round((totals.unitsStrong / units.length) * 100) : 0;
  const attention = units
    .filter((u) => u.stage === "needs_work" || u.stage === "in_progress")
    .sort((a, b) => (a.accuracy ?? 1) - (b.accuracy ?? 1))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <header className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {daysUntilTarget !== null && (
            <span className="chip">
              <Calendar className="h-3.5 w-3.5 text-accent" />
              {daysUntilTarget} days to your exam ({targetDateStr})
            </span>
          )}
          {stats.streak > 0 && (
            <span className="chip">
              <Flame className="h-3.5 w-3.5 text-amber-500" />
              {stats.streak}-day streak
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {started ? `Welcome back — ${exam.name}` : `Welcome to ${exam.name}`}
        </h1>
        <p className="text-sm muted max-w-3xl">{exam.description}</p>
      </header>

      {path.isEarlyAccess && (
        <div className="flex gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs">
          <Info className="h-4 w-4 shrink-0 text-amber-600" />
          <p>
            <strong>Early-access course.</strong> {exam.shortName} has {totals.lessons} lesson{totals.lessons === 1 ? "" : "s"} and{" "}
            {totals.questions} practice question{totals.questions === 1 ? "" : "s"} so far; more are being added. NCLEX-RN is the most
            complete course today.
          </p>
        </div>
      )}

      {/* THE one thing to do now */}
      <section className="panel panel-pad border-accent/40 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-accent">Your next step</div>
          <h2 className="text-xl font-bold">{nextStep.title}</h2>
          <p className="text-sm muted max-w-2xl">{nextStep.detail}</p>
        </div>
        <Link href={nextStep.href} className="btn btn-primary shrink-0">
          {nextStep.cta}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* How this course works */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">How {exam.shortName} works here</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link href={`/exam/${exam.slug}/learn`} className="panel p-4 space-y-2 transition hover:border-accent/50">
            <div className="flex items-center gap-2 font-bold">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white text-xs">1</span>
              <BookOpen className="h-4 w-4 text-accent" />
              Learn
            </div>
            <p className="text-xs muted">
              {units.length} unit{units.length === 1 ? "" : "s"}, each with lessons, flashcards and practice questions. Go in order.
            </p>
            <div className="text-xs font-semibold text-accent">Open the learning path →</div>
          </Link>

          <div className="panel p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white text-xs">2</span>
              <PenLine className="h-4 w-4 text-accent" />
              Practice
            </div>
            <p className="text-xs muted">Answer questions with instant feedback and an explanation. Pick a topic, or just go.</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <form action={startCustomTestAction}>
                <input type="hidden" name="examSlug" value={exam.slug} />
                <input type="hidden" name="kind" value="tutorial" />
                <input type="hidden" name="mode" value="tutor" />
                <input type="hidden" name="pool" value="unused" />
                <input type="hidden" name="count" value="10" />
                <button type="submit" className="btn btn-secondary btn-sm" disabled={totals.questions === 0}>
                  10 quick questions
                </button>
              </form>
              <Link href={`/exam/${exam.slug}/create`} className="btn btn-secondary btn-sm">
                Choose topics
              </Link>
            </div>
          </div>

          <div className="panel p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white text-xs">3</span>
              <ClipboardList className="h-4 w-4 text-accent" />
              Test yourself
            </div>
            <p className="text-xs muted">
              A full mock exam: {exam.mockQuestionCount} questions in {exam.durationMinutes} minutes. Answers are shown at the end,
              like the real thing.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <form action={startCustomTestAction}>
                <input type="hidden" name="examSlug" value={exam.slug} />
                <input type="hidden" name="kind" value="mock" />
                <input type="hidden" name="mode" value="exam" />
                <input type="hidden" name="count" value={String(exam.mockQuestionCount)} />
                <button type="submit" className="btn btn-secondary btn-sm" disabled={totals.questions === 0}>
                  Start mock exam
                </button>
              </form>
              <Link href={`/exam/${exam.slug}/tests`} className="btn btn-secondary btn-sm">
                Past tests
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Progress snapshot: 4 numbers, each explained */}
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold">Your progress</h2>
          <Link href={`/exam/${exam.slug}/analytics`} className="text-xs font-semibold text-accent hover:underline">
            Detailed progress →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Stat
            label="Units strong"
            value={`${totals.unitsStrong} / ${units.length}`}
            note="Units where you've answered most questions with 75%+ accuracy."
            bar={unitPct}
          />
          <Stat
            label="Questions answered"
            value={`${stats.distinctAnswered} / ${stats.totalQuestions}`}
            note="Different questions you've answered at least once."
            bar={stats.totalQuestions ? Math.round((stats.distinctAnswered / stats.totalQuestions) * 100) : 0}
          />
          <Stat
            label="Accuracy"
            value={started ? `${Math.round(stats.accuracy * 100)}%` : "—"}
            note={started ? `${stats.correct} right, ${stats.incorrect} wrong overall.` : "Appears after your first practice."}
          />
          <Stat
            label="Today"
            value={`${stats.today} / ${dailyGoal}`}
            note="Questions answered today vs. your daily goal."
            bar={dailyPct}
          />
        </div>
        {started && (
          <p className="text-xs muted">
            {est.label}: <strong>{est.headline}</strong> — a rough practice estimate, not a prediction of your real score.
          </p>
        )}
      </section>

      {attention.length > 0 && (
        <section className="panel panel-pad space-y-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-accent" />
            <h2 className="text-lg font-bold">Where to spend your time</h2>
          </div>
          <ul className="divide-y divide-border text-sm">
            {attention.map((u) => (
              <li key={u.id} className="flex items-center justify-between gap-3 py-2.5">
                <div>
                  <div className="font-semibold">{u.name}</div>
                  <div className="text-xs muted">
                    {u.stage === "needs_work" ? "Needs work" : "In progress"} · {pct(u.accuracy)}% correct · {u.answered} of{" "}
                    {u.questionTotal} answered
                  </div>
                </div>
                <Link href={`/exam/${exam.slug}/learn/${u.id}`} className="btn btn-secondary btn-sm shrink-0">
                  Open unit
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {stats.recentTests.length > 0 && (
        <section className="panel panel-pad space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Recent tests</h2>
            <Link href={`/exam/${exam.slug}/tests`} className="text-xs font-semibold text-accent hover:underline">
              All tests →
            </Link>
          </div>
          <div className="divide-y divide-border text-sm">
            {stats.recentTests.slice(0, 3).map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-3 py-2.5">
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs muted">
                    {t.n} questions · {t.status === "completed" ? "Finished" : "In progress"}
                  </div>
                </div>
                <Link
                  href={t.status === "completed" ? `/test/${t.id}/results` : `/test/${t.id}`}
                  className="btn btn-secondary btn-sm shrink-0"
                >
                  {t.status === "completed" ? "See results" : "Resume"}
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value, note, bar }: { label: string; value: string; note: string; bar?: number }) {
  return (
    <div className="panel p-4 space-y-1">
      <div className="text-xs font-medium muted">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
      {bar !== undefined && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-accent" style={{ width: `${bar}%` }} />
        </div>
      )}
      <div className="text-[11px] muted leading-snug">{note}</div>
    </div>
  );
}
