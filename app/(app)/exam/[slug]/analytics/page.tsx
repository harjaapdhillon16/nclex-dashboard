import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { exams } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { examAnalytics } from "@/lib/tests";
import { estimate } from "@/lib/scoring";
import { STAGE_LABEL, STAGE_STYLE, getLearningPath, pct } from "@/lib/learning-path";
import type { ScoringModel } from "@/lib/seed/catalog";
import { QUESTION_TYPE_LABELS, type QuestionType } from "@/lib/questions/types";
import { Bar, SectionHeading, accTone } from "../_ui";

type Row = { name: string; total: number; correct: number };

function AccuracyList({ rows, labelMap, empty }: { rows: Row[]; labelMap?: Record<string, string>; empty: string }) {
  if (rows.length === 0) return <p className="text-xs muted">{empty}</p>;
  return (
    <ul className="space-y-3">
      {rows.map((r) => {
        const acc = r.total ? r.correct / r.total : 0;
        const tone = accTone(acc);
        return (
          <li key={r.name} className="space-y-1">
            <div className="flex items-baseline justify-between gap-3 text-xs">
              <span className="font-medium">{labelMap?.[r.name] ?? r.name}</span>
              <span className="shrink-0 tabular-nums muted">
                <span className={`font-semibold ${tone.text}`}>{Math.round(acc * 100)}%</span> · {r.correct}/{r.total}
              </span>
            </div>
            <Bar value={acc * 100} className={tone.bar} />
          </li>
        );
      })}
    </ul>
  );
}

export default async function ExamProgressPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await requireUser();

  const [exam] = await db.select().from(exams).where(eq(exams.slug, slug)).limit(1);
  if (!exam) notFound();

  const [stats, path] = await Promise.all([examAnalytics(user.id, exam.id), getLearningPath(user.id, exam)]);
  const est = estimate(exam.scoring as ScoringModel, stats.accuracy, {
    difficultyWeighted: stats.readiness || stats.accuracy,
  });

  const started = stats.attempted > 0;
  const weakestFirst = (rows: Row[]) =>
    [...rows].sort((a, b) => (a.total ? a.correct / a.total : 0) - (b.total ? b.correct / b.total : 0) || b.total - a.total);

  const days = stats.daily.slice(-30);
  const topics = weakestFirst(stats.topics);
  const units = [...path.units].sort((a, b) => {
    if ((a.stage === "not_started") !== (b.stage === "not_started")) return a.stage === "not_started" ? 1 : -1;
    return (a.accuracy ?? 1) - (b.accuracy ?? 1);
  });

  if (!started) {
    return (
      <div className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Progress</h1>
          <p className="max-w-2xl text-sm muted">Your scores, trends and weak spots for {exam.name}.</p>
        </header>
        <div className="panel panel-pad space-y-3 text-center">
          <p className="text-sm font-semibold">Nothing to show yet</p>
          <p className="mx-auto max-w-md text-xs muted">
            Answer some practice questions and this page fills in with your accuracy over time, your weakest units and topics, and a
            readiness estimate.
          </p>
          <div className="flex justify-center">
            <Link href={nextHref(exam.slug)} className="btn btn-primary btn-sm">
              Start practicing <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Progress</h1>
        <p className="max-w-2xl text-sm muted">Where you stand in {exam.name}, and where your next hour is best spent.</p>
      </header>

      {/* Headline numbers, each explained */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="panel space-y-1 p-4">
          <div className="text-xs font-medium muted">{est.label}</div>
          <div className="text-xl font-bold leading-tight text-accent">{est.headline}</div>
          <div className="text-[11px] leading-snug muted">{est.disclaimer}</div>
        </div>
        <div className="panel space-y-1 p-4">
          <div className="text-xs font-medium muted">Accuracy</div>
          <div className={`text-2xl font-bold ${accTone(stats.accuracy).text}`}>{Math.round(stats.accuracy * 100)}%</div>
          <div className="text-[11px] leading-snug muted">
            {stats.correct} right, {stats.incorrect} wrong across {stats.attempted} answers.
          </div>
        </div>
        <div className="panel space-y-1 p-4">
          <div className="text-xs font-medium muted">Questions seen</div>
          <div className="text-2xl font-bold">
            {path.bank.correct + path.bank.incorrect + path.bank.omitted}
            <span className="text-sm font-normal muted"> / {path.bank.total}</span>
          </div>
          <div className="text-[11px] leading-snug muted">{path.bank.unused} still unused.</div>
        </div>
        <div className="panel space-y-1 p-4">
          <div className="text-xs font-medium muted">Time per question</div>
          <div className="text-2xl font-bold">{Math.round(stats.avgTime)}s</div>
          <div className="text-[11px] leading-snug muted">Average across everything you&apos;ve answered.</div>
        </div>
      </section>

      {/* Accuracy over time */}
      <section className="panel panel-pad space-y-3">
        <SectionHeading
          title="Accuracy over time"
          caption={`Each bar is one study day (last ${days.length}). Height is the share you got right; hover for the count.`}
        />
        {days.length === 0 ? (
          <p className="text-xs muted">No daily history yet.</p>
        ) : (
          <div className="flex h-36 items-end gap-1" role="img" aria-label="Daily accuracy">
            {days.map((d) => {
              const acc = d.n ? d.c / d.n : 0;
              return (
                <div key={d.d} className="flex h-full flex-1 flex-col justify-end" title={`${d.d}: ${Math.round(acc * 100)}% of ${d.n} questions`}>
                  <div className={`w-full rounded-t ${accTone(acc).bar}`} style={{ height: `${Math.max(4, acc * 100)}%` }} />
                </div>
              );
            })}
          </div>
        )}
        {days.length > 0 && (
          <div className="flex justify-between text-[11px] muted">
            <span>{days[0]!.d}</span>
            <span>{days[days.length - 1]!.d}</span>
          </div>
        )}
      </section>

      {/* Units */}
      <section className="space-y-3">
        <SectionHeading
          title="By unit"
          caption="Weakest first. “Answered” counts different questions; accuracy counts every attempt."
        />
        <div className="panel divide-y divide-border overflow-hidden">
          {units.map((u) => {
            const tone = accTone(u.accuracy);
            return (
              <Link
                key={u.id}
                href={`/exam/${exam.slug}/learn/${u.id}`}
                className="grid grid-cols-1 gap-2 px-4 py-3 transition hover:bg-muted/50 sm:grid-cols-12 sm:items-center sm:gap-4"
              >
                <div className="sm:col-span-5">
                  <div className="text-sm font-semibold leading-snug">{u.name}</div>
                  <span className={`chip mt-0.5 border text-[10px] font-semibold ${STAGE_STYLE[u.stage]}`}>{STAGE_LABEL[u.stage]}</span>
                </div>
                <div className="sm:col-span-3">
                  <div className="mb-1 text-[11px] tabular-nums muted">
                    {u.answered} / {u.questionTotal} answered
                  </div>
                  <Bar value={u.questionTotal ? (u.answered / u.questionTotal) * 100 : 0} />
                </div>
                <div className="sm:col-span-4">
                  <div className={`mb-1 text-[11px] font-semibold tabular-nums ${tone.text}`}>
                    {u.accuracy == null ? "No answers yet" : `${pct(u.accuracy)}% · ${u.correct}/${u.attempts}`}
                  </div>
                  <Bar value={pct(u.accuracy)} className={tone.bar} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Topics */}
      <section className="panel panel-pad space-y-3">
        <SectionHeading
          title="Weakest topics"
          caption="Topics with only one or two answers swing wildly, so treat those as hints, not verdicts."
        />
        {topics.length === 0 ? (
          <p className="text-xs muted">No topic data yet.</p>
        ) : (
          <>
            <AccuracyList rows={topics.slice(0, 8)} empty="" />
            {topics.length > 8 && (
              <details className="group">
                <summary className="cursor-pointer text-xs font-semibold text-accent select-none">
                  Show all {topics.length} topics
                </summary>
                <div className="mt-3">
                  <AccuracyList rows={topics.slice(8)} empty="" />
                </div>
              </details>
            )}
          </>
        )}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="panel panel-pad space-y-3">
          <SectionHeading title="By question format" caption="Some formats are harder than others; this shows which are costing you marks." />
          <AccuracyList
            rows={weakestFirst(stats.types)}
            labelMap={QUESTION_TYPE_LABELS as Record<QuestionType, string>}
            empty="No answers yet."
          />
        </div>
        {stats.systems.length > 0 && (
          <div className="panel panel-pad space-y-3">
            <SectionHeading title="By body system" caption="The same performance, cut by organ system." />
            <AccuracyList rows={weakestFirst(stats.systems)} empty="No answers yet." />
          </div>
        )}
      </section>
    </div>
  );
}

function nextHref(slug: string) {
  return `/exam/${slug}/learn`;
}
