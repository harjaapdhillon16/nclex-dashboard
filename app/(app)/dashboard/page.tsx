import Link from "next/link";
import { asc, eq, sql } from "drizzle-orm";
import { ArrowRight, CheckCircle2, ChevronDown, Plus } from "lucide-react";
import { db } from "@/lib/db";
import { enrollments, examCategories, exams, questions, studyMaterials } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { enrollExamAction } from "../actions";

/** Below this many questions (or with no lessons) a course is shown as "early access". */
const EARLY_ACCESS_QUESTIONS = 50;

export default async function DashboardPage() {
  const user = await requireUser();

  const categories = await db.select().from(examCategories).orderBy(asc(examCategories.displayOrder));
  const allExams = await db.select().from(exams).where(eq(exams.status, "published")).orderBy(asc(exams.displayOrder));

  const userEnrollments = await db.select().from(enrollments).where(eq(enrollments.userId, user.id));
  const enrolledSet = new Set(userEnrollments.map((e) => e.examId));

  const qCounts = await db
    .select({ examId: questions.examId, n: sql<number>`count(*)::int` })
    .from(questions)
    .where(eq(questions.status, "published"))
    .groupBy(questions.examId);
  const qByExam = new Map(qCounts.map((r) => [r.examId, r.n]));

  const lessonCounts = await db
    .select({ examId: studyMaterials.examId, n: sql<number>`count(*)::int` })
    .from(studyMaterials)
    .where(eq(studyMaterials.status, "published"))
    .groupBy(studyMaterials.examId);
  const lessonsByExam = new Map(lessonCounts.map((r) => [r.examId, r.n]));

  const progressRaw = await db.execute<{ exam_id: number; answered: number; correct: number; attempts: number }>(sql`
    SELECT t.exam_id,
      count(DISTINCT ta.question_id) FILTER (WHERE ta.response IS NOT NULL)::int AS answered,
      count(*) FILTER (WHERE ta.is_correct = true)::int AS correct,
      count(*) FILTER (WHERE ta.response IS NOT NULL)::int AS attempts
    FROM test_answers ta
    JOIN tests t ON t.id = ta.test_id
    WHERE ta.user_id = ${user.id} AND ta.submitted = true
    GROUP BY t.exam_id`);
  const progressByExam = new Map(progressRaw.rows.map((r) => [Number(r.exam_id), r]));

  const myExams = allExams.filter((e) => enrolledSet.has(e.id));
  const isEarly = (examId: number) => (qByExam.get(examId) ?? 0) < EARLY_ACCESS_QUESTIONS || !(lessonsByExam.get(examId) ?? 0);
  const firstName = user.name.split(" ")[0];

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Hi {firstName}</h1>
        <p className="text-sm muted max-w-2xl">
          {myExams.length > 0
            ? "Pick up where you left off. Each course has its own learning path, practice questions and mock exams."
            : "Choose the exam you're preparing for. Each course has a learning path, practice questions and mock exams."}
        </p>
      </header>

      {/* My courses */}
      {myExams.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold">My courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myExams.map((exam) => {
              const total = qByExam.get(exam.id) ?? 0;
              const prog = progressByExam.get(exam.id);
              const answered = Number(prog?.answered ?? 0);
              const attempts = Number(prog?.attempts ?? 0);
              const correct = Number(prog?.correct ?? 0);
              const done = total ? Math.min(100, Math.round((answered / total) * 100)) : 0;
              const started = answered > 0;
              return (
                <div key={exam.id} className="panel panel-pad flex flex-col gap-4">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold leading-snug">{exam.name}</h3>
                      {isEarly(exam.id) && (
                        <span className="chip shrink-0 border border-amber-500/30 bg-amber-500/10 text-[11px] text-amber-700 dark:text-amber-300">
                          Early access
                        </span>
                      )}
                    </div>
                    <p className="text-xs muted line-clamp-2">{exam.description}</p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${Math.max(done, started ? 4 : 0)}%` }} />
                    </div>
                    <p className="text-xs muted">
                      {started
                        ? `${answered} of ${total} questions answered · ${attempts ? Math.round((correct / attempts) * 100) : 0}% correct`
                        : `Not started · ${total} questions, ${lessonsByExam.get(exam.id) ?? 0} lessons`}
                    </p>
                  </div>

                  <Link href={`/exam/${exam.slug}`} className="btn btn-primary btn-sm mt-auto">
                    {started ? "Continue" : "Start learning"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Add a course */}
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-bold">{myExams.length > 0 ? "Add another course" : "Choose your exam"}</h2>
          <p className="text-xs muted">Open a group to see its exams. “Early access” means the course is still being filled in.</p>
        </div>

        <div className="space-y-2">
          {categories.map((cat, i) => {
            const catExams = allExams.filter((e) => e.categoryId === cat.id);
            if (catExams.length === 0) return null;
            return (
              <details
                key={cat.id}
                open={myExams.length === 0 && i === 0}
                className="panel group overflow-hidden"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 select-none hover:bg-muted/40">
                  <div>
                    <div className="font-bold">{cat.name}</div>
                    <div className="text-xs muted">
                      {catExams.length} exam{catExams.length === 1 ? "" : "s"}
                      {" · "}
                      {catExams
                        .slice(0, 4)
                        .map((e) => e.shortName)
                        .join(", ")}
                      {catExams.length > 4 ? "…" : ""}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0 muted transition-transform group-open:rotate-180" />
                </summary>

                <ul className="divide-y divide-border border-t border-border">
                  {catExams.map((ex) => {
                    const enrolled = enrolledSet.has(ex.id);
                    return (
                      <li key={ex.id} className="flex items-center justify-between gap-3 px-4 py-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold">{ex.name}</span>
                            {isEarly(ex.id) && (
                              <span className="chip border border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-700 dark:text-amber-300">
                                Early access
                              </span>
                            )}
                          </div>
                          <div className="text-xs muted">
                            {qByExam.get(ex.id) ?? 0} questions · {lessonsByExam.get(ex.id) ?? 0} lessons
                          </div>
                        </div>
                        {enrolled ? (
                          <Link href={`/exam/${ex.slug}`} className="btn btn-secondary btn-sm shrink-0">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            Open
                          </Link>
                        ) : (
                          <form action={enrollExamAction} className="shrink-0">
                            <input type="hidden" name="slug" value={ex.slug} />
                            <button type="submit" className="btn btn-secondary btn-sm">
                              <Plus className="h-3.5 w-3.5" />
                              Add
                            </button>
                          </form>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </details>
            );
          })}
        </div>
      </section>
    </div>
  );
}
