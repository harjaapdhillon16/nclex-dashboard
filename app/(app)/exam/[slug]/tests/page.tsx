import Link from "next/link";
import { notFound } from "next/navigation";
import { and, desc, eq, sql } from "drizzle-orm";
import { ArrowRight, Clock, Play, Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { exams, questions, results, tests } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { startCustomTestAction } from "../../../actions";
import { accTone } from "../_ui";

export default async function ExamTestsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await requireUser();

  const [exam] = await db.select().from(exams).where(eq(exams.slug, slug)).limit(1);
  if (!exam) notFound();

  const [{ bankSize }] = await db
    .select({ bankSize: sql<number>`count(*)::int` })
    .from(questions)
    .where(and(eq(questions.examId, exam.id), eq(questions.status, "published")));

  const testRows = await db
    .select({
      id: tests.id,
      name: tests.name,
      kind: tests.kind,
      mode: tests.mode,
      status: tests.status,
      startedAt: tests.startedAt,
      n: sql<number>`coalesce(array_length(${tests.questionIds}, 1), 0)::int`,
    })
    .from(tests)
    .where(and(eq(tests.userId, user.id), eq(tests.examId, exam.id)))
    .orderBy(desc(tests.startedAt));

  const resRows = await db
    .select()
    .from(results)
    .where(and(eq(results.userId, user.id), eq(results.examId, exam.id)));
  const resByTest = new Map(resRows.map((r) => [r.testId, r]));

  const mockQuestions = Math.min(exam.mockQuestionCount, bankSize);
  const supportsAdaptive = !!exam.features?.adaptive;
  const hours = Math.floor(exam.durationMinutes / 60);
  const mins = exam.durationMinutes % 60;
  const duration = hours ? `${hours} h${mins ? ` ${mins} min` : ""}` : `${mins} min`;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Mock exams</h1>
        <p className="max-w-2xl text-sm muted">
          Timed, test-day conditions with no feedback until you finish. Do one when you&apos;ve worked through most units.
        </p>
      </header>

      <section className={`grid grid-cols-1 gap-4 ${supportsAdaptive ? "md:grid-cols-2" : ""}`}>
        <div className="panel panel-pad flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <span className="chip font-semibold">
              <Clock className="h-3.5 w-3.5 text-accent" />
              {mockQuestions} questions · {duration}
            </span>
            <h2 className="text-lg font-bold">Full-length mock exam</h2>
            <p className="text-sm muted">
              A blueprint-balanced set drawn across every unit, with a countdown timer. Your answers, explanations and a readiness
              report appear once you submit.
              {bankSize < exam.mockQuestionCount && ` This course only has ${bankSize} questions so far, so the exam is shorter than the real one.`}
            </p>
          </div>
          <form action={startCustomTestAction}>
            <input type="hidden" name="examSlug" value={exam.slug} />
            <input type="hidden" name="kind" value="mock" />
            <input type="hidden" name="mode" value="exam" />
            <input type="hidden" name="count" value={String(exam.mockQuestionCount)} />
            <button type="submit" disabled={bankSize === 0} className="btn btn-primary w-full sm:w-auto">
              <Play className="h-4 w-4 fill-current" />
              Start mock exam
            </button>
          </form>
        </div>

        {supportsAdaptive && (
          <div className="panel panel-pad flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <span className="chip border-amber-500/30 bg-amber-500/10 font-semibold text-amber-700 dark:text-amber-300">
                <Sparkles className="h-3.5 w-3.5" />
                Adaptive (CAT)
              </span>
              <h2 className="text-lg font-bold">Adaptive simulation</h2>
              <p className="text-sm muted">
                Each question is chosen from how you answered the last one, and the test ends once it is confident whether you are
                above or below the passing standard. Length varies.
              </p>
            </div>
            <form action={startCustomTestAction}>
              <input type="hidden" name="examSlug" value={exam.slug} />
              <input type="hidden" name="kind" value="mock" />
              <input type="hidden" name="mode" value="exam" />
              <input type="hidden" name="adaptive" value="true" />
              <input type="hidden" name="count" value="85" />
              <button type="submit" disabled={bankSize === 0} className="btn btn-secondary w-full sm:w-auto">
                Start adaptive simulation
              </button>
            </form>
          </div>
        )}
      </section>

      {/* Previous tests */}
      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-base font-bold">Previous tests ({testRows.length})</h2>
            <p className="text-xs muted">Every test you&apos;ve started in {exam.shortName}: practice sets and mock exams.</p>
          </div>
          <Link href={`/exam/${exam.slug}/create`} className="text-xs font-semibold text-accent hover:underline">
            New practice test →
          </Link>
        </div>

        {testRows.length === 0 ? (
          <div className="panel panel-pad text-sm muted">Nothing here yet. Your finished tests and their scores will show up in this list.</div>
        ) : (
          <div className="panel overflow-hidden">
            <div className="table-wrapper" tabIndex={0} role="region" aria-label="Previous tests">
              <table className="table text-xs">
                <thead>
                  <tr>
                    <th>Test</th>
                    <th>Date</th>
                    <th>Mode</th>
                    <th className="text-right">Questions</th>
                    <th className="text-right">Score</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {testRows.map((t) => {
                    const res = resByTest.get(t.id);
                    const done = t.status === "completed";
                    const tone = accTone(res ? res.percent / 100 : null);
                    return (
                      <tr key={t.id}>
                        <th className="text-left font-semibold">{t.name}</th>
                        <td className="muted whitespace-nowrap">{t.startedAt.toLocaleDateString()}</td>
                        <td className="capitalize">{t.mode}</td>
                        <td className="text-right tabular-nums">{t.n}</td>
                        <td className="text-right whitespace-nowrap tabular-nums">
                          {res ? (
                            <span className={`font-bold ${tone.text}`}>
                              {res.percent.toFixed(0)}%{" "}
                              <span className="font-normal muted">
                                ({res.correct}/{res.total})
                              </span>
                            </span>
                          ) : (
                            <span className="muted">—</span>
                          )}
                        </td>
                        <td>
                          <span
                            className={`chip text-[11px] ${
                              done
                                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                                : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                            }`}
                          >
                            {done ? "Finished" : t.status === "abandoned" ? "Abandoned" : "In progress"}
                          </span>
                        </td>
                        <td className="text-right">
                          <Link
                            href={done ? `/test/${t.id}/results` : `/test/${t.id}`}
                            className="btn btn-secondary btn-sm whitespace-nowrap"
                          >
                            {done ? (
                              <>
                                Review <ArrowRight className="h-3 w-3" />
                              </>
                            ) : (
                              <>
                                <Play className="h-3 w-3" /> Resume
                              </>
                            )}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
