import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, eq, inArray } from "drizzle-orm";
import {
  ArrowLeft,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { db } from "@/lib/db";
import { exams, questions, results, testAnswers, tests } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { finishTest, taxonomyNames } from "@/lib/tests";
import { ASSESSMENT_DISCLAIMER, ASSESSMENT_KINDS, assessmentHistory, preparationLevel } from "@/lib/assessments";
import type { Bucket, Estimate } from "@/lib/scoring";
import { QUESTION_TYPE_LABELS, type QuestionType } from "@/lib/questions/types";
import { startCustomTestAction } from "../../../actions";
import { ResultsReviewClient } from "./results-client";

export default async function TestResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const testId = Number(id);
  if (!Number.isFinite(testId)) notFound();

  const [test] = await db
    .select()
    .from(tests)
    .where(and(eq(tests.id, testId), eq(tests.userId, user.id)))
    .limit(1);
  if (!test) notFound();

  if (test.status !== "completed") {
    await finishTest(user.id, test.id);
  }

  const [res] = await db.select().from(results).where(eq(results.testId, test.id)).limit(1);
  if (!res) notFound();

  const [exam] = await db.select().from(exams).where(eq(exams.id, test.examId)).limit(1);
  const answers = await db
    .select()
    .from(testAnswers)
    .where(eq(testAnswers.testId, test.id))
    .orderBy(asc(testAnswers.position));
  const qs = test.questionIds.length
    ? await db.select().from(questions).where(inArray(questions.id, test.questionIds))
    : [];
  const qmap = new Map(qs.map((q) => [q.id, q]));
  const taxNames = await taxonomyNames(exam.id);

  const est = (res.estimate ?? {
    model: "percent",
    headline: `${Math.round(res.percent)}%`,
    label: "Percent correct",
    disclaimer: "Practice estimate only — not an official examination score.",
  }) as Estimate;

  const bd = (res.breakdown ?? {}) as Record<string, Record<string, Bucket>> & {
    timeline?: { pos: number; time: number; correct: boolean | null }[];
  };

  const recs = (res.recommendations ?? {
    weakTopics: [],
    strongTopics: [],
    nextTest: "Take a targeted practice set on missed topics",
    plan: [],
  }) as {
    weakTopics: string[];
    strongTopics: string[];
    nextTest: string;
    plan: { day: string; task: string; target: string }[];
  };

  // Assessment tests get a preparation-level banner and a comparison with the previous attempt.
  const isAssessment = (ASSESSMENT_KINDS as string[]).includes(test.kind);
  const prepLevel = isAssessment ? preparationLevel(res.percent) : null;
  let assessmentDelta: number | null = null;
  if (isAssessment) {
    const hist = await assessmentHistory(user.id, exam.id);
    const before = hist.filter((h) => h.testId !== test.id && h.completedAt <= res.completedAt).at(-1);
    if (before) assessmentDelta = res.percent - before.percent;
  }

  const reviewItems = answers.map((a, i) => {
    const q = qmap.get(a.questionId);
    return {
      position: i + 1,
      questionId: a.questionId,
      code: q?.code ?? `Q-${a.questionId}`,
      stem: q?.stem ?? "",
      type: (q?.type ?? "mcq") as QuestionType,
      difficulty: q?.difficulty ?? "moderate",
      category: q?.categoryId ? taxNames.get(q.categoryId)?.name ?? "" : "",
      topic: q?.topicId ? taxNames.get(q.topicId)?.name ?? "" : "",
      isCorrect: a.isCorrect,
      answered: a.response !== null,
      marked: a.marked,
      score: a.score ?? 0,
      maxScore: a.maxScore ?? 1,
      timeSpentSec: a.timeSpentSec,
      rationale: q?.rationale ?? "",
    };
  });

  const renderBucketList = (title: string, map: Record<string, Bucket> | undefined, labelMap?: Record<string, string>) => {
    const entries = Object.entries(map ?? {});
    if (entries.length === 0) return null;
    return (
      <div className="panel panel-pad space-y-3">
        <h3 className="h-section">{title}</h3>
        <div className="space-y-2.5">
          {entries.map(([key, b]) => {
            const pct = b.max > 0 ? Math.round((b.points / b.max) * 100) : b.total > 0 ? Math.round((b.correct / b.total) * 100) : 0;
            const color = pct >= 75 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "bg-rose-500";
            const badge =
              pct >= 75
                ? "text-emerald-700 bg-emerald-500/15 dark:text-emerald-300"
                : pct >= 60
                  ? "text-amber-700 bg-amber-500/15 dark:text-amber-300"
                  : "text-rose-700 bg-rose-500/15 dark:text-rose-300";
            return (
              <div key={key} className="space-y-1 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{labelMap?.[key] ?? key}</span>
                  <div className="flex items-center gap-2">
                    <span className="muted">
                      {b.correct}/{b.total} ({Math.round(b.time / Math.max(1, b.total))}s avg)
                    </span>
                    <span className={`rounded px-1.5 py-0.5 text-[11px] font-bold ${badge}`}>{pct}%</span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Link
            href={`/exam/${exam.slug}`}
            className="no-print inline-flex items-center gap-1.5 text-xs font-medium muted hover:text-foreground mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to {exam.shortName} Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {test.name} — Performance Report
          </h1>
          <p className="text-xs sm:text-sm muted">
            {exam.name} · Completed {res.completedAt.toLocaleDateString()} · Mode: {test.mode.toUpperCase()}
          </p>
        </div>

        <div className="no-print flex flex-wrap items-center gap-2">
          <Link href={`/test/${test.id}`} className="btn btn-secondary btn-sm">
            <Play className="h-3.5 w-3.5" />
            Interactive Item Walkthrough
          </Link>
          <form action={startCustomTestAction}>
            <input type="hidden" name="examSlug" value={exam.slug} />
            <input type="hidden" name="kind" value="incorrect" />
            <input type="hidden" name="mode" value="tutor" />
            <input type="hidden" name="pool" value="incorrect" />
            <input type="hidden" name="count" value="20" />
            <button type="submit" className="btn btn-primary btn-sm">
              <RotateCcw className="h-3.5 w-3.5" />
              Retest Missed Questions
            </button>
          </form>
        </div>
      </div>

      {prepLevel && (
        <section className="panel panel-pad flex flex-col gap-3 border-accent/40 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-accent">Assessment result</div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2
                className={`text-2xl font-bold ${prepLevel.tone === "strong" ? "text-emerald-600 dark:text-emerald-400" : prepLevel.tone === "moderate" ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"}`}
              >
                {prepLevel.label}
              </h2>
              {assessmentDelta !== null && (
                <span className="text-xs font-semibold muted">
                  {assessmentDelta >= 0 ? "+" : ""}
                  {assessmentDelta.toFixed(0)} points vs. your previous assessment
                </span>
              )}
            </div>
            <p className="max-w-2xl text-sm muted">{prepLevel.advice}</p>
            <p className="max-w-2xl text-[11px] leading-snug faint">{ASSESSMENT_DISCLAIMER}</p>
          </div>
          <Link href={`/exam/${exam.slug}/assessments`} className="no-print btn btn-secondary btn-sm shrink-0">
            All assessments
          </Link>
        </section>
      )}

      {/* Headline Score & Practice Estimate Card */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div
          className="rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between space-y-4"
          style={{ background: "var(--hero)" }}
        >
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-white/80">{est.label}</div>
            <div className="text-3xl sm:text-4xl font-bold mt-1">{est.headline}</div>
            {est.detail && <p className="text-xs text-white/85 mt-2 leading-relaxed">{est.detail}</p>}
          </div>

          {est.sections && est.sections.length > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/15 text-xs">
              {est.sections.map((s) => (
                <div key={s.name} className="rounded-xl bg-white/10 p-2">
                  <div className="text-[10px] text-white/75 truncate">{s.name}</div>
                  <div className="font-bold text-sm">{s.value}</div>
                </div>
              ))}
            </div>
          )}

          <p className="text-[11px] text-white/75 italic border-t border-white/15 pt-2">{est.disclaimer}</p>
        </div>

        {/* Summary KPI Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="panel p-4 space-y-1">
            <div className="text-xs muted">Percentage Score</div>
            <div className="text-2xl font-bold text-accent">{res.percent.toFixed(1)}%</div>
            <div className="text-[11px] muted">
              {res.pointsEarned.toFixed(1)} / {res.pointsPossible.toFixed(1)} points earned
            </div>
          </div>

          <div className="panel p-4 space-y-1">
            <div className="text-xs muted flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              Correct Answers
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{res.correct}</div>
            <div className="text-[11px] muted">of {res.total} total questions</div>
          </div>

          <div className="panel p-4 space-y-1">
            <div className="text-xs muted flex items-center gap-1">
              <XCircle className="h-3.5 w-3.5 text-rose-500" />
              Incorrect / Unanswered
            </div>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
              {res.incorrect} <span className="text-sm font-normal muted">/ {res.unanswered}</span>
            </div>
            <div className="text-[11px] muted">Incorrect / Skipped</div>
          </div>

          <div className="panel p-4 space-y-1">
            <div className="text-xs muted flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-accent" />
              Total Time Used
            </div>
            <div className="text-2xl font-bold">
              {Math.floor(res.totalTimeSec / 60)}m {res.totalTimeSec % 60}s
            </div>
            <div className="text-[11px] muted">Avg {Math.round(res.avgTimeSec)}s per question</div>
          </div>

          <div className="panel p-4 space-y-1 sm:col-span-2">
            <div className="text-xs muted flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-accent" />
              Recommended Next Action
            </div>
            <div className="text-sm font-bold">{recs.nextTest}</div>
            <div className="text-[11px] muted">
              {recs.weakTopics.length > 0
                ? `Priority weak areas: ${recs.weakTopics.join(", ")}`
                : "Strong performance across tested topics"}
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Axis Performance Breakdowns */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {renderBucketList("Category & Blueprint Section Performance", bd.category)}
        {renderBucketList("Subject Performance", bd.subject)}
        {renderBucketList("Body System Performance", bd.system)}
        {renderBucketList("Question Format Performance (NGN & Classic)", bd.type, QUESTION_TYPE_LABELS)}
        {renderBucketList("Clinical Focus Tag Performance (Pharmacology / Priority / Delegation)", bd.tag)}
        {renderBucketList("Difficulty & Case Study Performance", { ...(bd.difficulty ?? {}), ...(bd.caseStudy ?? {}) })}
      </section>

      {/* Strengths, Weaknesses & 7-Day Study Plan */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="panel panel-pad space-y-4">
          <h3 className="h-section flex items-center gap-2">
            <Target className="h-4 w-4 text-accent" />
            Strengths &amp; Priority Weaknesses
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1.5">
                Strongest Topics (≥80%)
              </div>
              {recs.strongTopics.length === 0 ? (
                <p className="muted">Complete more topic items to establish high-mastery areas.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {recs.strongTopics.map((t) => (
                    <span key={t} className="chip bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1.5">
                Weakest Topics (&lt;65%)
              </div>
              {recs.weakTopics.length === 0 ? (
                <p className="muted">No topics fell below the 65% remediation threshold in this test.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {recs.weakTopics.map((t) => (
                    <span key={t} className="chip bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="panel panel-pad lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="h-section flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent" />
              Personalized 7-Day Study Plan
            </h3>
            <span className="chip text-xs">Auto-generated from test diagnostic</span>
          </div>

          <div className="table-wrapper" tabIndex={0} role="region" aria-label="7-day study plan">
            <table className="table text-xs">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Recommended Study &amp; Practice Activity</th>
                  <th>Target</th>
                </tr>
              </thead>
              <tbody>
                {(recs.plan ?? []).map((p) => (
                  <tr key={p.day}>
                    <th className="font-bold text-left whitespace-nowrap">{p.day}</th>
                    <td>{p.task}</td>
                    <td>
                      <span className="chip bg-accent-subtle text-accent">{p.target}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Filterable Question Review & Printable Report */}
      <ResultsReviewClient testId={test.id} items={reviewItems} />
    </div>
  );
}
