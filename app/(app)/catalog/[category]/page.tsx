import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, eq, sql } from "drizzle-orm";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, FileQuestion, Layers, Play } from "lucide-react";
import { db } from "@/lib/db";
import { enrollments, examCategories, exams, questions, taxonomy } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { QUESTION_TYPE_LABELS, type QuestionType } from "@/lib/questions/types";
import { enrollExamAction } from "../../actions";

export default async function CategoryCatalogPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const user = await requireUser();

  const [cat] = await db.select().from(examCategories).where(eq(examCategories.slug, category)).limit(1);
  if (!cat) notFound();

  const catExams = await db
    .select()
    .from(exams)
    .where(and(eq(exams.categoryId, cat.id), eq(exams.status, "published")))
    .orderBy(asc(exams.displayOrder));

  const userEnrollments = await db.select().from(enrollments).where(eq(enrollments.userId, user.id));
  const enrolledSet = new Set(userEnrollments.map((e) => e.examId));

  const qCountsRaw = await db
    .select({ examId: questions.examId, n: sql<number>`count(*)::int` })
    .from(questions)
    .where(eq(questions.status, "published"))
    .groupBy(questions.examId);
  const qCountByExam = new Map(qCountsRaw.map((r) => [r.examId, r.n]));

  const taxRaw = await db
    .select({ examId: taxonomy.examId, kind: taxonomy.kind, name: taxonomy.name })
    .from(taxonomy)
    .orderBy(asc(taxonomy.displayOrder));

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-medium muted hover:text-foreground mb-2">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to All Exam Categories
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{cat.name}</h1>
            <p className="text-sm muted">{cat.description}</p>
          </div>
          <span className="chip bg-accent-subtle text-accent border-accent/25">
            {catExams.length} Examination Courses
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {catExams.map((exam) => {
          const isEnrolled = enrolledSet.has(exam.id);
          const totalQ = qCountByExam.get(exam.id) ?? 0;
          const examTax = taxRaw.filter((t) => t.examId === exam.id && t.kind !== "topic");
          const topicCount = taxRaw.filter((t) => t.examId === exam.id && t.kind === "topic").length;

          return (
            <div key={exam.id} className="panel panel-pad flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold">{exam.name}</h2>
                      {isEnrolled && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success">
                          <CheckCircle2 className="h-3 w-3" />
                          Enrolled
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs muted">{exam.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-xs muted">
                  <span className="inline-flex items-center gap-1">
                    <FileQuestion className="h-3.5 w-3.5 text-accent" />
                    <strong>{totalQ}</strong> Questions
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5 text-accent" />
                    <strong>{examTax.length}</strong> Sections/Categories · <strong>{topicCount || examTax.length * 4}</strong> Topics
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-accent" />
                    <strong>{exam.durationMinutes} min</strong> Mock Duration ({exam.mockQuestionCount} Q)
                  </span>
                </div>

                <div>
                  <div className="text-xs font-semibold mb-1.5">Syllabus Domains &amp; Sections</div>
                  <div className="flex flex-wrap gap-1.5">
                    {examTax.slice(0, 8).map((node, i) => (
                      <span key={i} className="chip bg-muted/60 text-xs">
                        {node.name}
                      </span>
                    ))}
                    {examTax.length > 8 && <span className="chip text-xs muted">+{examTax.length - 8} more</span>}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold mb-1.5">Supported Question Formats</div>
                  <div className="flex flex-wrap gap-1.5">
                    {exam.questionTypes.map((qt) => (
                      <span key={qt} className="chip border-accent/20 bg-accent-subtle text-accent text-[11px]">
                        {QUESTION_TYPE_LABELS[qt as QuestionType] ?? qt}
                      </span>
                    ))}
                  </div>
                </div>

                {exam.blueprint?.note && (
                  <p className="text-[11px] faint italic border-l-2 border-border pl-2.5">{exam.blueprint.note}</p>
                )}
              </div>

              <div className="pt-3 border-t border-border flex items-center gap-2.5">
                {isEnrolled ? (
                  <>
                    <Link href={`/exam/${exam.slug}`} className="btn btn-primary btn-sm flex-1">
                      <Play className="h-3.5 w-3.5" />
                      Open {exam.shortName} Dashboard
                    </Link>
                    <Link href={`/exam/${exam.slug}/create`} className="btn btn-secondary btn-sm">
                      Create Test
                    </Link>
                  </>
                ) : (
                  <form action={enrollExamAction} className="w-full">
                    <input type="hidden" name="slug" value={exam.slug} />
                    <button type="submit" className="btn btn-primary btn-sm w-full">
                      Enroll &amp; Start Preparing
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
