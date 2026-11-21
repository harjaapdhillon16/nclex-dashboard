import Link from "next/link";
import { notFound } from "next/navigation";
import { and, desc, eq, sql } from "drizzle-orm";
import { ArrowLeft, ArrowRight, Award, Clock, Play, PlusCircle, Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { exams, results, tests } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { startCustomTestAction } from "../../../actions";

export default async function ExamTestsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await requireUser();

  const [exam] = await db.select().from(exams).where(eq(exams.slug, slug)).limit(1);
  if (!exam) notFound();

  const testRows = await db
    .select({
      id: tests.id,
      name: tests.name,
      kind: tests.kind,
      mode: tests.mode,
      status: tests.status,
      startedAt: tests.startedAt,
      completedAt: tests.completedAt,
      elapsedSec: tests.elapsedSec,
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Link
            href={`/exam/${exam.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium muted hover:text-foreground mb-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to {exam.shortName} Dashboard
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{exam.name} — Tests &amp; Mock Exams</h1>
          <p className="text-xs sm:text-sm muted">
            Launch a full-length mock exam, 100-question assessment, adaptive CAT simulation, or resume an existing session.
          </p>
        </div>

        <Link href={`/exam/${exam.slug}/create`} className="btn btn-primary btn-sm">
          <PlusCircle className="h-4 w-4" />
          New Custom Test
        </Link>
      </div>

      {/* Featured Exam Simulators */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="panel panel-pad flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="chip bg-accent-subtle text-accent border-accent/25 font-semibold">
              <Award className="h-3.5 w-3.5" />
              Original Practice Assessment
            </span>
            <h2 className="text-base font-bold">100-Question Comprehensive Assessment</h2>
            <p className="text-xs muted">
              Balanced blueprint coverage across all client-needs categories, subjects, NGN clinical judgment formats, and case studies.
            </p>
          </div>
          <form action={startCustomTestAction}>
            <input type="hidden" name="examSlug" value={exam.slug} />
            <input type="hidden" name="kind" value="assessment" />
            <input type="hidden" name="mode" value="exam" />
            <input type="hidden" name="count" value="100" />
            <button type="submit" className="btn btn-primary btn-sm w-full">
              Start 100-Question Assessment
            </button>
          </form>
        </div>

        <div className="panel panel-pad flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="chip font-semibold">
              <Clock className="h-3.5 w-3.5 text-accent" />
              {exam.durationMinutes} Minutes · {exam.mockQuestionCount} Questions
            </span>
            <h2 className="text-base font-bold">Full-Length {exam.shortName} Mock Exam</h2>
            <p className="text-xs muted">
              Realistic exam-mode simulation with countdown timer, on-screen lab reference values, calculator, and post-exam readiness report.
            </p>
          </div>
          <form action={startCustomTestAction}>
            <input type="hidden" name="examSlug" value={exam.slug} />
            <input type="hidden" name="kind" value="mock" />
            <input type="hidden" name="mode" value="exam" />
            <input type="hidden" name="count" value={String(exam.mockQuestionCount)} />
            <button type="submit" className="btn btn-secondary btn-sm w-full">
              Start Full-Length Mock Exam
            </button>
          </form>
        </div>

        <div className="panel panel-pad flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="chip border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              Computerized Adaptive (CAT)
            </span>
            <h2 className="text-base font-bold">Adaptive Testing Simulation</h2>
            <p className="text-xs muted">
              Educational CAT simulation: item difficulty adapts dynamically after every answer with Rasch theta and passing-standard confidence rule.
            </p>
          </div>
          <form action={startCustomTestAction}>
            <input type="hidden" name="examSlug" value={exam.slug} />
            <input type="hidden" name="kind" value="mock" />
            <input type="hidden" name="mode" value="exam" />
            <input type="hidden" name="adaptive" value="true" />
            <input type="hidden" name="count" value="85" />
            <button type="submit" className="btn btn-secondary btn-sm w-full">
              Start Adaptive CAT Simulation
            </button>
          </form>
        </div>
      </section>

      {/* Session History */}
      <section className="panel panel-pad space-y-4">
        <h2 className="h-section">Your Test Sessions ({testRows.length})</h2>
        {testRows.length === 0 ? (
          <p className="text-xs muted py-4">No test sessions started yet. Choose a simulator above to begin.</p>
        ) : (
          <div className="table-wrapper" tabIndex={0} role="region" aria-label="Test session history">
            <table className="table text-xs">
              <thead>
                <tr>
                  <th>Test Name</th>
                  <th>Type</th>
                  <th>Mode</th>
                  <th>Questions</th>
                  <th>Score / Estimate</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {testRows.map((t) => {
                  const res = resByTest.get(t.id);
                  const est = res?.estimate as { headline?: string } | undefined;
                  return (
                    <tr key={t.id}>
                      <th className="font-bold text-left">{t.name}</th>
                      <td className="capitalize">{t.kind.replace("_", " ")}</td>
                      <td className="uppercase font-mono">{t.mode}</td>
                      <td>{t.n}</td>
                      <td>
                        {res ? (
                          <span className="font-bold text-accent">
                            {res.percent.toFixed(0)}% {est?.headline ? `· ${est.headline}` : ""}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="muted">{t.startedAt.toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`chip text-[11px] capitalize ${
                            t.status === "completed"
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                              : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                          }`}
                        >
                          {t.status.replace("_", " ")}
                        </span>
                      </td>
                      <td>
                        <Link
                          href={t.status === "completed" ? `/test/${t.id}/results` : `/test/${t.id}`}
                          className="btn btn-secondary btn-sm"
                        >
                          {t.status === "completed" ? (
                            <>
                              View Report <ArrowRight className="h-3 w-3" />
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
        )}
      </section>
    </div>
  );
}
