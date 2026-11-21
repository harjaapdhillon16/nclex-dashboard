import Link from "next/link";
import { asc, eq, sql } from "drizzle-orm";
import {
  Activity,
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Languages,
  Pill,
  Play,
  School,
  Smile,
  Sparkles,
  Stethoscope,
  UserCheck,
} from "lucide-react";
import { db } from "@/lib/db";
import { enrollments, examCategories, exams, questions, taxonomy, testAnswers, tests } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { enrollExamAction } from "../actions";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  nursing: Stethoscope,
  medical: Activity,
  dental: Smile,
  pharmacy: Pill,
  "physician-assistant": UserCheck,
  english: Languages,
  college: GraduationCap,
  graduate: School,
  professional: Briefcase,
};

export default async function DashboardPage() {
  const user = await requireUser();

  const categories = await db.select().from(examCategories).orderBy(asc(examCategories.displayOrder));
  const allExams = await db
    .select()
    .from(exams)
    .where(eq(exams.status, "published"))
    .orderBy(asc(exams.displayOrder));

  const userEnrollments = await db
    .select()
    .from(enrollments)
    .where(eq(enrollments.userId, user.id));
  const enrolledSet = new Set(userEnrollments.map((e) => e.examId));

  // Per-exam question counts
  const qCountsRaw = await db
    .select({ examId: questions.examId, n: sql<number>`count(*)::int` })
    .from(questions)
    .where(eq(questions.status, "published"))
    .groupBy(questions.examId);
  const qCountByExam = new Map(qCountsRaw.map((r) => [r.examId, r.n]));

  // Per-exam topic counts
  const topicCountsRaw = await db
    .select({ examId: taxonomy.examId, n: sql<number>`count(*)::int` })
    .from(taxonomy)
    .where(eq(taxonomy.kind, "topic"))
    .groupBy(taxonomy.examId);
  const topicCountByExam = new Map(topicCountsRaw.map((r) => [r.examId, r.n]));

  // Student progress per exam
  const progressRaw = await db.execute<{
    exam_id: number;
    distinct_answered: number;
    correct: number;
    total_answered: number;
  }>(sql`
    SELECT t.exam_id,
      count(DISTINCT ta.question_id) FILTER (WHERE ta.response IS NOT NULL)::int AS distinct_answered,
      count(*) FILTER (WHERE ta.is_correct = true)::int AS correct,
      count(*) FILTER (WHERE ta.response IS NOT NULL)::int AS total_answered
    FROM test_answers ta
    JOIN tests t ON t.id = ta.test_id
    WHERE ta.user_id = ${user.id} AND ta.submitted = true
    GROUP BY t.exam_id
  `);
  const progressByExam = new Map(progressRaw.rows.map((r) => [Number(r.exam_id), r]));

  const catById = new Map(categories.map((c) => [c.id, c]));
  const enrolledExams = allExams.filter((e) => enrolledSet.has(e.id));

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <section
        className="rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        style={{ background: "var(--hero)" }}
      >
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            QREXq International Multi-Exam Platform
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-sm text-white/85 leading-relaxed">
            Access your enrolled courses with independent question engines, syllabus mappings, adaptive mock exams, NGN clinical judgment case studies, and personalized analytics.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/exam/nclex-rn"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow hover:bg-white/95"
          >
            <Play className="h-4 w-4 fill-current" />
            NCLEX-RN Flagship Course
          </Link>
          <Link
            href="/austy"
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
          >
            <Award className="h-4 w-4" />
            AUSTY Health Care Analytics
          </Link>
        </div>
      </section>

      {/* Enrolled Courses */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight">My Enrolled Examination Courses</h2>
            <p className="text-xs muted">
              Separate progress, scores, study schedules, and readiness analytics are maintained for each enrolled exam.
            </p>
          </div>
          <span className="chip bg-accent-subtle text-accent border-accent/20">
            {enrolledExams.length} Enrolled
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {enrolledExams.map((exam) => {
            const cat = catById.get(exam.categoryId);
            const totalQ = qCountByExam.get(exam.id) ?? 0;
            const totalTopics = topicCountByExam.get(exam.id) || exam.axes.length * 8;
            const prog = progressByExam.get(exam.id);
            const distinctAnswered = Number(prog?.distinct_answered ?? 0);
            const totalAnswered = Number(prog?.total_answered ?? 0);
            const correct = Number(prog?.correct ?? 0);
            const completionPct = totalQ > 0 ? Math.min(100, Math.round((distinctAnswered / totalQ) * 100)) : 0;
            const accuracyPct = totalAnswered > 0 ? Math.round((correct / totalAnswered) * 100) : 0;
            const hasStarted = distinctAnswered > 0;

            return (
              <div key={exam.id} className="panel panel-pad flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="chip bg-accent-subtle text-accent border-accent/25">
                      {cat?.name ?? "Examination"}
                    </span>
                    <span className="text-xs font-medium muted">{exam.durationMinutes}m exam</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold">{exam.name}</h3>
                    <p className="mt-1 text-xs muted line-clamp-2">{exam.description}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted/60 p-3 text-center">
                    <div>
                      <div className="text-sm font-bold">{totalQ}</div>
                      <div className="text-[11px] muted">Questions</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold">{totalTopics}</div>
                      <div className="text-[11px] muted">Topics</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold">{exam.features?.mock ? "3 Full" : "Timed"}</div>
                      <div className="text-[11px] muted">Mock Exams</div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">Course Completion ({completionPct}%)</span>
                      <span className="muted">
                        {distinctAnswered}/{totalQ} Q · {accuracyPct}% accuracy
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-accent transition-all"
                        style={{ width: `${Math.max(completionPct, hasStarted ? 6 : 0)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <Link href={`/exam/${exam.slug}`} className="btn btn-primary btn-sm flex-1">
                    {hasStarted ? "Continue Learning" : "Start Learning"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link href={`/exam/${exam.slug}/create`} className="btn btn-secondary btn-sm">
                    Practice
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 9 Main Dashboard Exam Categories */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight">International Examination Categories (9 Divisions)</h2>
          <p className="text-xs muted">
            Explore dedicated category dashboards or enroll directly in any examination course with one click.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.slug] ?? BookOpen;
            const catExams = allExams.filter((e) => e.categoryId === cat.id);
            const totalCatQuestions = catExams.reduce((sum, e) => sum + (qCountByExam.get(e.id) ?? 0), 0);

            return (
              <div key={cat.id} className="panel panel-pad flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-subtle text-accent">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-bold text-base leading-snug">{cat.name}</h3>
                        <p className="text-xs muted">
                          {catExams.length} courses · {totalCatQuestions} active items
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs muted">{cat.description}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {catExams.map((ex) => {
                      const isEnrolled = enrolledSet.has(ex.id);
                      return isEnrolled ? (
                        <Link
                          key={ex.id}
                          href={`/exam/${ex.slug}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-accent/30 bg-accent-subtle px-2.5 py-1 text-xs font-semibold text-accent hover:bg-accent/20"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          {ex.shortName}
                        </Link>
                      ) : (
                        <form key={ex.id} action={enrollExamAction} className="inline">
                          <input type="hidden" name="slug" value={ex.slug} />
                          <button
                            type="submit"
                            title={`Enroll in ${ex.name}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium hover:bg-muted"
                          >
                            + {ex.shortName}
                          </button>
                        </form>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <Link
                    href={`/catalog/${cat.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
                  >
                    Open {cat.name} Dashboard
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
