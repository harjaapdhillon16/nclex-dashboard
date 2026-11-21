import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  FlaskConical,
  Layers,
  Play,
  PlusCircle,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { db } from "@/lib/db";
import { enrollments, exams } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { examAnalytics } from "@/lib/tests";
import { estimate } from "@/lib/scoring";
import type { ScoringModel } from "@/lib/seed/catalog";
import { startCustomTestAction } from "../../actions";

export default async function ExamDashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await requireUser();

  const [exam] = await db.select().from(exams).where(eq(exams.slug, slug)).limit(1);
  if (!exam) notFound();

  // Auto-enroll on visit so the student can track progress seamlessly
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

  const stats = await examAnalytics(user.id, exam.id);
  const scoringModel = exam.scoring as ScoringModel;
  const est = estimate(scoringModel, stats.accuracy || 0, {
    difficultyWeighted: stats.readiness || stats.accuracy || 0,
  });

  const dailyGoal = enrollment?.dailyGoal ?? user.dailyGoal ?? 50;
  const dailyPct = Math.min(100, Math.round((stats.today / Math.max(1, dailyGoal)) * 100));
  const targetDateStr = enrollment?.targetDate ?? user.targetExamDate;
  const daysUntilTarget = targetDateStr
    ? Math.max(0, Math.ceil((new Date(targetDateStr).getTime() - Date.now()) / 86400000))
    : null;

  const accuracyPct = Math.round(stats.accuracy * 100);
  const completionPct =
    stats.totalQuestions > 0 ? Math.min(100, Math.round((stats.distinctAnswered / stats.totalQuestions) * 100)) : 0;

  const recommendedSession =
    stats.weakest.length > 0
      ? `Focus on ${stats.weakest.slice(0, 2).map((w) => w.name).join(" & ")} (${Math.round(stats.weakest[0]!.acc * 100)}% accuracy)`
      : stats.distinctAnswered === 0
        ? `Take a 25-question Tutor Mode diagnostic or practice set in ${exam.shortName}`
        : `Take a 100-Question Balanced Practice Assessment or timed mixed set`;

  const domainRows = stats.categories.length > 0 ? stats.categories : stats.subjects;

  return (
    <div className="space-y-7">
      {/* Header & Quick Launch Bar */}
      <section className="panel panel-pad space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip bg-accent-subtle text-accent border-accent/25 font-semibold">
                {exam.shortName}
              </span>
              {daysUntilTarget !== null && (
                <span className="chip">
                  <Calendar className="h-3.5 w-3.5 text-accent" />
                  {daysUntilTarget} days until target exam date ({targetDateStr})
                </span>
              )}
              <span className="chip">
                <Flame className="h-3.5 w-3.5 text-amber-500" />
                {stats.streak} day streak
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{exam.name} Preparation Dashboard</h1>
            <p className="text-xs sm:text-sm muted max-w-3xl">{exam.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link href={`/exam/${exam.slug}/create`} className="btn btn-primary">
              <PlusCircle className="h-4 w-4" />
              Create Custom Test
            </Link>
            {exam.features?.caseStudies && (
              <Link href={`/exam/${exam.slug}/cases`} className="btn btn-secondary">
                <FlaskConical className="h-4 w-4 text-accent" />
                NGN Case Studies
              </Link>
            )}
          </div>
        </div>

        {/* One-Click Standard Exam Modes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-border">
          <form action={startCustomTestAction}>
            <input type="hidden" name="examSlug" value={exam.slug} />
            <input type="hidden" name="kind" value="tutorial" />
            <input type="hidden" name="mode" value="tutor" />
            <input type="hidden" name="count" value="25" />
            <button type="submit" className="btn btn-secondary btn-sm w-full justify-start">
              <Play className="h-3.5 w-3.5 text-accent" />
              25-Q Tutor Practice
            </button>
          </form>

          <form action={startCustomTestAction}>
            <input type="hidden" name="examSlug" value={exam.slug} />
            <input type="hidden" name="kind" value="assessment" />
            <input type="hidden" name="mode" value="exam" />
            <input type="hidden" name="count" value="100" />
            <button type="submit" className="btn btn-secondary btn-sm w-full justify-start">
              <Award className="h-3.5 w-3.5 text-accent" />
              100-Q Assessment
            </button>
          </form>

          <form action={startCustomTestAction}>
            <input type="hidden" name="examSlug" value={exam.slug} />
            <input type="hidden" name="kind" value="mock" />
            <input type="hidden" name="mode" value="exam" />
            <input type="hidden" name="count" value={String(exam.mockQuestionCount)} />
            <button type="submit" className="btn btn-secondary btn-sm w-full justify-start">
              <Clock className="h-3.5 w-3.5 text-accent" />
              Full Mock Exam
            </button>
          </form>

          {exam.features?.adaptive && (
            <form action={startCustomTestAction}>
              <input type="hidden" name="examSlug" value={exam.slug} />
              <input type="hidden" name="kind" value="mock" />
              <input type="hidden" name="mode" value="exam" />
              <input type="hidden" name="adaptive" value="true" />
              <input type="hidden" name="count" value="85" />
              <button type="submit" className="btn btn-secondary btn-sm w-full justify-start">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                Adaptive CAT Sim
              </button>
            </form>
          )}

          <form action={startCustomTestAction}>
            <input type="hidden" name="examSlug" value={exam.slug} />
            <input type="hidden" name="kind" value="weak" />
            <input type="hidden" name="mode" value="tutor" />
            <input type="hidden" name="count" value="20" />
            <button type="submit" className="btn btn-secondary btn-sm w-full justify-start">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              Weak-Area Test
            </button>
          </form>

          <form action={startCustomTestAction}>
            <input type="hidden" name="examSlug" value={exam.slug} />
            <input type="hidden" name="kind" value="incorrect" />
            <input type="hidden" name="mode" value="tutor" />
            <input type="hidden" name="pool" value="incorrect" />
            <input type="hidden" name="count" value="20" />
            <button type="submit" className="btn btn-secondary btn-sm w-full justify-start">
              <Target className="h-3.5 w-3.5 text-rose-500" />
              Incorrect Review
            </button>
          </form>
        </div>
      </section>

      {/* Primary KPI Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="panel p-4 space-y-1">
          <div className="text-xs font-medium muted">Available Bank</div>
          <div className="text-2xl font-bold">{stats.totalQuestions}</div>
          <div className="text-[11px] muted">{completionPct}% bank covered</div>
        </div>
        <div className="panel p-4 space-y-1">
          <div className="text-xs font-medium muted">Attempted / Unique</div>
          <div className="text-2xl font-bold">
            {stats.attempted} <span className="text-sm font-normal muted">/ {stats.distinctAnswered}</span>
          </div>
          <div className="text-[11px] muted">{stats.unanswered} remaining unused</div>
        </div>
        <div className="panel p-4 space-y-1">
          <div className="text-xs font-medium muted">Correct / Incorrect</div>
          <div className="text-2xl font-bold">
            <span className="text-emerald-600 dark:text-emerald-400">{stats.correct}</span>{" "}
            <span className="text-sm font-normal muted">/</span>{" "}
            <span className="text-rose-600 dark:text-rose-400">{stats.incorrect}</span>
          </div>
          <div className="text-[11px] muted">{stats.marked} bookmarked items</div>
        </div>
        <div className="panel p-4 space-y-1">
          <div className="text-xs font-medium muted">Overall Accuracy</div>
          <div className="text-2xl font-bold text-accent">{accuracyPct}%</div>
          <div className="text-[11px] muted">Avg {Math.round(stats.avgTime)}s / question</div>
        </div>
        <div className="panel p-4 space-y-1">
          <div className="text-xs font-medium muted">Completed Today</div>
          <div className="text-2xl font-bold">
            {stats.today} <span className="text-sm font-normal muted">/ {dailyGoal}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted mt-1">
            <div className="h-full rounded-full bg-accent" style={{ width: `${dailyPct}%` }} />
          </div>
        </div>
        <div className="panel p-4 space-y-1">
          <div className="text-xs font-medium muted">{est.label}</div>
          <div className="text-xl font-bold text-accent truncate">{est.headline}</div>
          <div className="text-[10px] faint leading-tight">Practice estimate only</div>
        </div>
      </section>

      {/* Recommended Next Session + Readiness & Circular Breakdown */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="panel panel-pad lg:col-span-2 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="chip bg-accent-subtle text-accent border-accent/25">
                <TrendingUp className="h-3.5 w-3.5" />
                Personalized Recommendation
              </span>
              <span className="text-xs muted">{est.headline}</span>
            </div>
            <h2 className="text-lg font-bold">{recommendedSession}</h2>
            <p className="text-xs muted leading-relaxed">
              {est.detail ??
                "Consistent tutor-mode review combined with timed 100-question assessments builds both clinical judgment accuracy and exam-day pacing."}
            </p>
            <p className="text-[11px] faint italic">{est.disclaimer}</p>
          </div>

          {/* 14-day Activity Calendar Bar */}
          <div className="space-y-2 pt-3 border-t border-border">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold">Recent Daily Study Activity</span>
              <span className="muted">Daily Goal: {dailyGoal} questions</span>
            </div>
            {stats.daily.length === 0 ? (
              <p className="text-xs muted py-2">
                No questions submitted yet in this course. Start a practice set above to populate your daily activity chart.
              </p>
            ) : (
              <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 pt-1">
                {stats.daily.slice(-14).map((d) => {
                  const pct = d.n > 0 ? Math.round((d.c / d.n) * 100) : 0;
                  return (
                    <div key={d.d} className="rounded-xl border border-border bg-muted/40 p-2 text-center">
                      <div className="text-[10px] muted">{d.d.slice(5)}</div>
                      <div className="text-xs font-bold mt-0.5">{d.n} Q</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400">{pct}%</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Question Bank Utilization & Course Tools */}
        <div className="panel panel-pad flex flex-col justify-between space-y-4">
          <div>
            <h3 className="h-section">Question Bank Coverage</h3>
            <p className="text-xs muted mt-0.5">
              {stats.distinctAnswered} of {stats.totalQuestions} unique questions answered
            </p>
          </div>

          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-emerald-600 dark:text-emerald-400">Correct responses</span>
                <span>{stats.correct}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${stats.attempted ? Math.min(100, (stats.correct / stats.attempted) * 100) : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-rose-600 dark:text-rose-400">Incorrect responses</span>
                <span>{stats.incorrect}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-rose-500"
                  style={{ width: `${stats.attempted ? Math.min(100, (stats.incorrect / stats.attempted) * 100) : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium muted">Unused in bank</span>
                <span>{stats.unanswered}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-accent"
                  style={{
                    width: `${stats.totalQuestions ? Math.min(100, (stats.unanswered / stats.totalQuestions) * 100) : 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
            <Link href={`/exam/${exam.slug}/study`} className="btn btn-secondary btn-sm">
              <BookOpen className="h-3.5 w-3.5 text-accent" />
              Study Notes
            </Link>
            <Link href={`/exam/${exam.slug}/flashcards`} className="btn btn-secondary btn-sm">
              <Layers className="h-3.5 w-3.5 text-accent" />
              Flashcards
            </Link>
            <Link href={`/exam/${exam.slug}/review`} className="btn btn-secondary btn-sm">
              <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
              Review Bank
            </Link>
            <Link href={`/exam/${exam.slug}/assistant`} className="btn btn-secondary btn-sm">
              <Bot className="h-3.5 w-3.5 text-accent" />
              AI Tutor
            </Link>
          </div>
        </div>
      </section>

      {/* Subject / Category Performance & Weakest/Strongest Topics */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="panel panel-pad space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="h-section">Category &amp; Subject Performance</h2>
              <p className="text-xs muted">Accuracy across blueprint categories and domains</p>
            </div>
            <Link href={`/exam/${exam.slug}/analytics`} className="text-xs font-semibold text-accent hover:underline">
              Full Analytics →
            </Link>
          </div>

          {domainRows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-6 text-center space-y-2">
              <Activity className="mx-auto h-7 w-7 faint" />
              <p className="text-sm font-medium">No domain breakdown yet</p>
              <p className="text-xs muted">
                Complete a practice test to see your green/yellow/red category performance bars.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {domainRows.map((row) => {
                const pct = row.total > 0 ? Math.round((row.correct / row.total) * 100) : 0;
                const barColor =
                  pct >= 75 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "bg-rose-500";
                return (
                  <div key={row.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">{row.name}</span>
                      <span className="muted">
                        {row.correct}/{row.total} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Weakest & Strongest Topics + Recent Tests */}
        <div className="space-y-5">
          <div className="panel panel-pad space-y-4">
            <h2 className="h-section">Strengths &amp; Priority Weak Topics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Weakest Topics (&lt;65%)
                </div>
                {stats.weakest.length === 0 ? (
                  <p className="text-xs muted">Answer questions across topics to identify weak areas.</p>
                ) : (
                  <ul className="space-y-1.5 text-xs">
                    {stats.weakest.map((t) => (
                      <li key={t.name} className="flex items-center justify-between rounded-lg bg-rose-500/10 px-2.5 py-1.5">
                        <span className="font-medium truncate pr-2">{t.name}</span>
                        <span className="font-bold text-rose-600 dark:text-rose-400">
                          {Math.round(t.acc * 100)}%
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Strongest Topics
                </div>
                {stats.strongest.length === 0 ? (
                  <p className="text-xs muted">Your highest-performing topics will appear here.</p>
                ) : (
                  <ul className="space-y-1.5 text-xs">
                    {stats.strongest.map((t) => (
                      <li key={t.name} className="flex items-center justify-between rounded-lg bg-emerald-500/10 px-2.5 py-1.5">
                        <span className="font-medium truncate pr-2">{t.name}</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {Math.round(t.acc * 100)}%
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="panel panel-pad space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="h-section">Recent Tests &amp; Sessions</h2>
              <Link href={`/exam/${exam.slug}/tests`} className="text-xs font-semibold text-accent hover:underline">
                View All ({stats.recentTests.length}) →
              </Link>
            </div>
            {stats.recentTests.length === 0 ? (
              <p className="text-xs muted">No test sessions created yet.</p>
            ) : (
              <div className="divide-y divide-border text-xs">
                {stats.recentTests.slice(0, 5).map((t) => (
                  <div key={t.id} className="flex items-center justify-between py-2.5 gap-3">
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="muted capitalize">
                        {t.mode} mode · {t.n} questions · {t.status.replace("_", " ")}
                      </div>
                    </div>
                    <Link
                      href={t.status === "completed" ? `/test/${t.id}/results` : `/test/${t.id}`}
                      className="btn btn-secondary btn-sm"
                    >
                      {t.status === "completed" ? "Results" : "Resume"}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
