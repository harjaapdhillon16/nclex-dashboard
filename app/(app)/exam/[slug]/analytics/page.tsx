import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft, BarChart3, Flame, Target, TrendingUp } from "lucide-react";
import { db } from "@/lib/db";
import { exams } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { examAnalytics } from "@/lib/tests";
import { estimate } from "@/lib/scoring";
import type { ScoringModel } from "@/lib/seed/catalog";
import { QUESTION_TYPE_LABELS, type QuestionType } from "@/lib/questions/types";

export default async function ExamAnalyticsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await requireUser();

  const [exam] = await db.select().from(exams).where(eq(exams.slug, slug)).limit(1);
  if (!exam) notFound();

  const stats = await examAnalytics(user.id, exam.id);
  const est = estimate(exam.scoring as ScoringModel, stats.accuracy, {
    difficultyWeighted: stats.readiness || stats.accuracy,
  });

  const renderSection = (
    title: string,
    rows: { name: string; total: number; correct: number }[],
    labelMap?: Record<string, string>,
  ) => (
    <div className="panel panel-pad space-y-3">
      <h2 className="h-section">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-xs muted">No answered questions recorded in this axis yet.</p>
      ) : (
        <div className="space-y-2.5 text-xs">
          {rows.map((r) => {
            const pct = r.total ? Math.round((r.correct / r.total) * 100) : 0;
            const color = pct >= 75 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "bg-rose-500";
            return (
              <div key={r.name} className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium">{labelMap?.[r.name] ?? r.name}</span>
                  <span className="muted">
                    {r.correct}/{r.total} ({pct}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

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
        <h1 className="text-2xl font-bold tracking-tight">{exam.name} — Performance &amp; Readiness Analytics</h1>
        <p className="text-xs sm:text-sm muted">
          Detailed subject, category, body-system, topic, and question-format analytics with educational readiness tracking.
        </p>
      </div>

      {/* Summary KPIs */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="panel p-4 space-y-1">
          <div className="text-xs muted flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-accent" />
            {est.label}
          </div>
          <div className="text-2xl font-bold text-accent">{est.headline}</div>
          <div className="text-[11px] faint">{est.disclaimer}</div>
        </div>
        <div className="panel p-4 space-y-1">
          <div className="text-xs muted flex items-center gap-1">
            <Target className="h-3.5 w-3.5 text-accent" />
            Overall Accuracy
          </div>
          <div className="text-2xl font-bold">{Math.round(stats.accuracy * 100)}%</div>
          <div className="text-[11px] muted">
            {stats.correct} correct · {stats.incorrect} incorrect
          </div>
        </div>
        <div className="panel p-4 space-y-1">
          <div className="text-xs muted flex items-center gap-1">
            <BarChart3 className="h-3.5 w-3.5 text-accent" />
            Bank Utilization
          </div>
          <div className="text-2xl font-bold">
            {stats.distinctAnswered} / {stats.totalQuestions}
          </div>
          <div className="text-[11px] muted">{stats.unanswered} unused questions</div>
        </div>
        <div className="panel p-4 space-y-1">
          <div className="text-xs muted flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 text-amber-500" />
            Study Streak &amp; Pacing
          </div>
          <div className="text-2xl font-bold">{stats.streak} Days</div>
          <div className="text-[11px] muted">Avg {Math.round(stats.avgTime)}s per question</div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {renderSection("Client-Needs Categories & Blueprint Sections", stats.categories)}
        {renderSection("Nursing & Exam Subjects", stats.subjects)}
        {renderSection("Body Systems", stats.systems)}
        {renderSection("Question Formats (NGN & Classic)", stats.types, QUESTION_TYPE_LABELS as Record<QuestionType, string>)}
      </section>

      {/* Topic-wise Table */}
      <section className="panel panel-pad space-y-3">
        <h2 className="h-section">Topic-Wise Mastery Breakdown ({stats.topics.length} tested topics)</h2>
        {stats.topics.length === 0 ? (
          <p className="text-xs muted">Complete a practice test to populate your topic-wise performance table.</p>
        ) : (
          <div className="table-wrapper" tabIndex={0} role="region" aria-label="Topic performance table">
            <table className="table text-xs">
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Answered</th>
                  <th>Correct</th>
                  <th>Accuracy</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.topics.map((t) => {
                  const pct = t.total ? Math.round((t.correct / t.total) * 100) : 0;
                  return (
                    <tr key={t.name}>
                      <th className="font-semibold text-left">{t.name}</th>
                      <td>{t.total}</td>
                      <td>{t.correct}</td>
                      <td className="font-bold">{pct}%</td>
                      <td>
                        <span
                          className={`chip text-[11px] ${
                            pct >= 75
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                              : pct >= 60
                                ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                                : "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                          }`}
                        >
                          {pct >= 75 ? "Strong" : pct >= 60 ? "Moderate" : "Needs Review"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
