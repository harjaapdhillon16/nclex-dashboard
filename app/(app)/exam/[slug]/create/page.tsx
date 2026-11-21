import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, eq, sql } from "drizzle-orm";
import { ArrowLeft, Award, Clock, Sparkles, Target } from "lucide-react";
import { db } from "@/lib/db";
import { caseStudies, exams, questions, taxonomy } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { startCustomTestAction } from "../../../actions";
import { CreateTestForm } from "./create-test-form";

export default async function CreateTestPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ empty?: string; topicId?: string; systemId?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  await requireUser();

  const [exam] = await db.select().from(exams).where(eq(exams.slug, slug)).limit(1);
  if (!exam) notFound();

  const taxNodes = await db
    .select()
    .from(taxonomy)
    .where(eq(taxonomy.examId, exam.id))
    .orderBy(asc(taxonomy.displayOrder), asc(taxonomy.name));

  const [{ totalQuestions }] = await db
    .select({ totalQuestions: sql<number>`count(*)::int` })
    .from(questions)
    .where(and(eq(questions.examId, exam.id), eq(questions.status, "published")));

  const casesList = await db
    .select({ id: caseStudies.id, title: caseStudies.title, difficulty: caseStudies.difficulty })
    .from(caseStudies)
    .where(and(eq(caseStudies.examId, exam.id), eq(caseStudies.status, "published")));

  const categories = taxNodes.filter((n) => n.kind === "category" || n.kind === "section");
  const subjects = taxNodes.filter((n) => n.kind === "subject");
  const systems = taxNodes.filter((n) => n.kind === "system");
  const topics = taxNodes.filter((n) => n.kind === "topic");

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/exam/${exam.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium muted hover:text-foreground mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to {exam.shortName} Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create {exam.name} Practice Test</h1>
            <p className="text-xs sm:text-sm muted">
              Configure question pool, tutor/timed/exam mode, blueprint categories, body systems, difficulty, and NGN item formats.
            </p>
          </div>
          <span className="chip bg-accent-subtle text-accent border-accent/25">
            {totalQuestions} Active Questions · {casesList.length} Case Studies
          </span>
        </div>
      </div>

      {sp.empty && (
        <div role="alert" className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-xs font-medium">
          No published questions matched that exact filter combination. Try broadening your category, difficulty, or question-pool selection below.
        </div>
      )}

      {/* One-Click Preset Exams */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <form action={startCustomTestAction} className="panel p-4 flex flex-col justify-between space-y-3">
          <input type="hidden" name="examSlug" value={exam.slug} />
          <input type="hidden" name="kind" value="assessment" />
          <input type="hidden" name="mode" value="exam" />
          <input type="hidden" name="count" value="100" />
          <div>
            <div className="flex items-center gap-2 font-bold text-sm">
              <Award className="h-4 w-4 text-accent" />
              100-Question Assessment
            </div>
            <p className="text-xs muted mt-1">
              Original balanced assessment across all client-needs categories, subjects, NGN items, and case studies.
            </p>
          </div>
          <button type="submit" className="btn btn-primary btn-sm w-full">
            Start 100-Q Assessment
          </button>
        </form>

        <form action={startCustomTestAction} className="panel p-4 flex flex-col justify-between space-y-3">
          <input type="hidden" name="examSlug" value={exam.slug} />
          <input type="hidden" name="kind" value="mock" />
          <input type="hidden" name="mode" value="exam" />
          <input type="hidden" name="count" value={String(exam.mockQuestionCount)} />
          <div>
            <div className="flex items-center gap-2 font-bold text-sm">
              <Clock className="h-4 w-4 text-accent" />
              Full-Length Mock ({exam.mockQuestionCount} Q)
            </div>
            <p className="text-xs muted mt-1">
              Timed {exam.durationMinutes}-minute simulated examination with no rationale reveal until final submission.
            </p>
          </div>
          <button type="submit" className="btn btn-secondary btn-sm w-full">
            Launch Full Mock
          </button>
        </form>

        <form action={startCustomTestAction} className="panel p-4 flex flex-col justify-between space-y-3">
          <input type="hidden" name="examSlug" value={exam.slug} />
          <input type="hidden" name="kind" value="mock" />
          <input type="hidden" name="mode" value="exam" />
          <input type="hidden" name="adaptive" value="true" />
          <input type="hidden" name="count" value="85" />
          <div>
            <div className="flex items-center gap-2 font-bold text-sm">
              <Sparkles className="h-4 w-4 text-accent" />
              Adaptive (CAT) Simulation
            </div>
            <p className="text-xs muted mt-1">
              Rasch ability estimation with dynamic difficulty adjustment, content balancing, and readiness probability.
            </p>
          </div>
          <button type="submit" className="btn btn-secondary btn-sm w-full">
            Start Adaptive CAT
          </button>
        </form>

        <form action={startCustomTestAction} className="panel p-4 flex flex-col justify-between space-y-3">
          <input type="hidden" name="examSlug" value={exam.slug} />
          <input type="hidden" name="kind" value="readiness" />
          <input type="hidden" name="mode" value="timed" />
          <input type="hidden" name="count" value="60" />
          <div>
            <div className="flex items-center gap-2 font-bold text-sm">
              <Target className="h-4 w-4 text-accent" />
              Readiness &amp; Diagnostic (60 Q)
            </div>
            <p className="text-xs muted mt-1">
              Blueprint-weighted readiness check generating a personalized 7-day study plan and topic breakdown.
            </p>
          </div>
          <button type="submit" className="btn btn-secondary btn-sm w-full">
            Start Readiness Test
          </button>
        </form>
      </section>

      {/* Custom Test Builder Form */}
      <CreateTestForm
        examSlug={exam.slug}
        examName={exam.name}
        questionTypes={exam.questionTypes}
        supportsCases={!!exam.features?.caseStudies}
        categories={categories}
        subjects={subjects}
        systems={systems}
        topics={topics}
        initialTopicId={sp.topicId ? Number(sp.topicId) : undefined}
        initialSystemId={sp.systemId ? Number(sp.systemId) : undefined}
      />
    </div>
  );
}
