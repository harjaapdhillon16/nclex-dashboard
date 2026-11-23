import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq, sql } from "drizzle-orm";
import { ArrowRight, Clock, Info, Play, Target, TrendingDown, TrendingUp } from "lucide-react";
import { db } from "@/lib/db";
import { exams, questions } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import {
  ASSESSMENTS,
  ASSESSMENT_DISCLAIMER,
  assessmentHistory,
  bucketPct,
  preparationLevel,
  type AssessmentRow,
} from "@/lib/assessments";
import { subjectLabel } from "@/lib/labels";
import { startCustomTestAction } from "../../../actions";
import { Bar, SectionHeading, accTone } from "../_ui";

const LEVEL_STYLE = {
  strong: "text-emerald-600 dark:text-emerald-400",
  moderate: "text-amber-600 dark:text-amber-400",
  weak: "text-rose-600 dark:text-rose-400",
} as const;

export default async function AssessmentsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await requireUser();

  const [exam] = await db.select().from(exams).where(eq(exams.slug, slug)).limit(1);
  if (!exam) notFound();

  const [{ bankSize }] = await db
    .select({ bankSize: sql<number>`count(*)::int` })
    .from(questions)
    .where(and(eq(questions.examId, exam.id), eq(questions.status, "published")));
  const history = await assessmentHistory(user.id, exam.id);
  const latest = history.at(-1);
  const previous = history.at(-2);
  const level = latest ? preparationLevel(latest.percent) : null;
  const delta = latest && previous ? latest.percent - previous.percent : null;

  // Strongest / weakest areas from the latest assessment. Prefer subjects (Medical-Surgical, Pediatrics…) when present.
  const areaSource = latest && Object.keys(latest.subject).length >= 2 ? latest.subject : (latest?.category ?? {});
  const areas = Object.entries(areaSource)
    .filter(([, b]) => b.total >= 2)
    .map(([name, b]) => ({ name: subjectLabel(name), pct: bucketPct(b), total: b.total }))
    .sort((a, b) => a.pct - b.pct);
  const weakest = areas.slice(0, 3);
  const strongest = [...areas].reverse().slice(0, 3);

  const lastByKind = new Map<string, AssessmentRow>();
  for (const h of history) lastByKind.set(h.kind, h);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Assessments</h1>
        <p className="max-w-2xl text-sm muted">
          Check where you stand. Each assessment is balanced across the exam blueprint, then reports your score, your strongest and weakest areas, and what to do next.
        </p>
      </header>

      {/* Where you stand */}
      {latest && level ? (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="panel panel-pad space-y-3 lg:col-span-1">
            <SectionHeading title="Your preparation level" caption={`From your ${latest.name.toLowerCase()}`} />
            <div className={`text-3xl font-bold ${LEVEL_STYLE[level.tone]}`}>{level.label}</div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="font-semibold tabular-nums">{Math.round(latest.percent)}% correct</span>
              {delta !== null && (
                <span className={`inline-flex items-center gap-1 text-xs font-semibold ${delta >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                  {delta >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  {delta >= 0 ? "+" : ""}
                  {delta.toFixed(0)} pts vs. previous
                </span>
              )}
            </div>
            <p className="text-sm muted">{level.advice}</p>
            <Link href={`/test/${latest.testId}/results`} className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline">
              Open full report <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="panel panel-pad space-y-3 lg:col-span-1">
            <SectionHeading title="Needs the most work" caption="Lowest scores in your latest assessment" />
            {weakest.length === 0 ? (
              <p className="text-xs muted">Answer a few more questions to see a breakdown.</p>
            ) : (
              <ul className="space-y-2.5">
                {weakest.map((a) => {
                  const tone = accTone(a.pct / 100);
                  return (
                    <li key={a.name} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{a.name}</span>
                        <span className={`font-bold tabular-nums ${tone.text}`}>{Math.round(a.pct)}%</span>
                      </div>
                      <Bar value={a.pct} className={tone.bar} />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="panel panel-pad space-y-3 lg:col-span-1">
            <SectionHeading title="Strongest areas" caption="Keep these fresh with occasional review" />
            {strongest.length === 0 ? (
              <p className="text-xs muted">Answer a few more questions to see a breakdown.</p>
            ) : (
              <ul className="space-y-2.5">
                {strongest.map((a) => {
                  const tone = accTone(a.pct / 100);
                  return (
                    <li key={a.name} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{a.name}</span>
                        <span className={`font-bold tabular-nums ${tone.text}`}>{Math.round(a.pct)}%</span>
                      </div>
                      <Bar value={a.pct} className={tone.bar} />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      ) : (
        <section className="panel panel-pad flex flex-col gap-3 border-accent/40 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-accent">Start here</div>
            <h2 className="text-lg font-bold">Find out where you stand</h2>
            <p className="max-w-2xl text-sm muted">
              Take the diagnostic check first. It is short, and it tells you which subjects to study first.
            </p>
          </div>
        </section>
      )}

      {/* The three assessments */}
      <section className="space-y-3">
        <SectionHeading title="Choose an assessment" caption="Timed like the real thing, with answers and reasoning after you submit" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {ASSESSMENTS.map((a) => {
            const count = Math.min(a.questions, bankSize);
            const short = bankSize < a.questions;
            const last = lastByKind.get(a.kind);
            const disabled = bankSize < 10;
            return (
              <div key={a.kind} className="panel panel-pad flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <span className="chip font-semibold">
                    <Target className="h-3.5 w-3.5 text-accent" />
                    {a.tagline}
                  </span>
                  <h2 className="text-lg font-bold">{a.title}</h2>
                  <p className="text-sm muted">{a.description}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs muted">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {count} questions{a.minutes ? ` · ${a.minutes} min` : ""}
                    </span>
                    {last && (
                      <span>
                        Last: <strong className="text-foreground">{Math.round(last.percent)}%</strong>
                      </span>
                    )}
                  </div>
                  {short && (
                    <p className="flex gap-1.5 text-[11px] text-amber-700 dark:text-amber-300">
                      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      This course has {bankSize} questions so far, so the assessment is shorter than the {a.questions} planned.
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <form action={startCustomTestAction}>
                    <input type="hidden" name="examSlug" value={exam.slug} />
                    <input type="hidden" name="kind" value={a.kind} />
                    <input type="hidden" name="mode" value={a.mode} />
                    <input type="hidden" name="count" value={String(count)} />
                    {a.minutes && <input type="hidden" name="timeLimitMin" value={String(a.minutes)} />}
                    <button type="submit" disabled={disabled} className="btn btn-primary">
                      <Play className="h-4 w-4 fill-current" />
                      Start timed
                    </button>
                  </form>
                  <form action={startCustomTestAction}>
                    <input type="hidden" name="examSlug" value={exam.slug} />
                    <input type="hidden" name="kind" value={a.kind} />
                    <input type="hidden" name="mode" value="tutor" />
                    <input type="hidden" name="count" value={String(count)} />
                    <button type="submit" disabled={disabled} className="btn btn-secondary">
                      Untimed practice
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* History */}
      <section className="space-y-3">
        <SectionHeading title="Your assessment history" caption={history.length ? `${history.length} completed` : undefined} />
        {history.length === 0 ? (
          <div className="panel panel-pad text-sm muted">Nothing here yet. Your finished assessments and their scores will show up in this list.</div>
        ) : (
          <>
            {history.length >= 2 && <ScoreTrend rows={history.slice(-8)} />}
            <div className="panel overflow-hidden">
              <div className="table-wrapper" tabIndex={0} role="region" aria-label="Assessment history">
                <table className="table text-xs">
                  <thead>
                    <tr>
                      <th>Assessment</th>
                      <th>Date</th>
                      <th className="text-right">Score</th>
                      <th>Level</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {[...history].reverse().slice(0, 10).map((h) => {
                      const lv = preparationLevel(h.percent);
                      return (
                        <tr key={h.testId}>
                          <th className="text-left font-semibold">{h.name}</th>
                          <td className="muted whitespace-nowrap">{h.completedAt.toLocaleDateString()}</td>
                          <td className="whitespace-nowrap text-right tabular-nums">
                            <span className="font-bold">{Math.round(h.percent)}%</span>{" "}
                            <span className="muted">
                              ({h.correct}/{h.total})
                            </span>
                          </td>
                          <td className={`font-semibold ${LEVEL_STYLE[lv.tone]}`}>{lv.label}</td>
                          <td className="text-right">
                            <Link href={`/test/${h.testId}/results`} className="btn btn-secondary btn-sm whitespace-nowrap">
                              Report <ArrowRight className="h-3 w-3" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </section>

      <p className="flex gap-2 text-[11px] leading-snug faint">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {ASSESSMENT_DISCLAIMER}
      </p>
    </div>
  );
}

/** Small score-over-time chart (pure SVG). The history table below carries the same data for screen readers. */
function ScoreTrend({ rows }: { rows: AssessmentRow[] }) {
  const W = 300;
  const H = 90;
  const px = (i: number) => 24 + (i / Math.max(1, rows.length - 1)) * (W - 36);
  const py = (v: number) => H - 14 - (Math.min(100, Math.max(0, v)) / 100) * (H - 26);
  const line = rows.map((r, i) => `${i ? "L" : "M"}${px(i).toFixed(1)} ${py(r.percent).toFixed(1)}`).join("");
  return (
    <div className="panel panel-pad">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Assessment scores over time: ${rows.map((r) => `${Math.round(r.percent)}%`).join(", ")}`} className="h-auto w-full">
        {[50, 65, 75].map((v) => (
          <g key={v}>
            <line x1="24" x2={W - 8} y1={py(v)} y2={py(v)} stroke="currentColor" strokeOpacity=".15" strokeDasharray="3 3" />
            <text x="20" y={py(v) + 2.5} textAnchor="end" fontSize="7" fill="currentColor" opacity=".6">{v}%</text>
          </g>
        ))}
        <path d={line} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" />
        {rows.map((r, i) => (
          <g key={r.testId}>
            <circle cx={px(i)} cy={py(r.percent)} r="3.5" fill="var(--accent)" />
            <text x={px(i)} y={py(r.percent) - 7} textAnchor="middle" fontSize="7.5" fontWeight="700" fill="currentColor">{Math.round(r.percent)}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
