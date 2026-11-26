import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { ArrowRight, CalendarDays, CheckCircle2, Target } from "lucide-react";
import { db } from "@/lib/db";
import { enrollments, exams } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { daysUntil, getLearningPath } from "@/lib/learning-path";
import { SectionHeading } from "../_ui";

type DayPlan = { day: number; date: Date; units: { id: number; name: string; questions: number }[]; questions: number; lessons: number; review?: boolean };

const fmt = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

export default async function StudySchedulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await requireUser();
  const [exam] = await db.select().from(exams).where(eq(exams.slug, slug)).limit(1);
  if (!exam) notFound();

  const [enrollment] = await db.select().from(enrollments).where(and(eq(enrollments.userId, user.id), eq(enrollments.examId, exam.id))).limit(1);
  const target = enrollment?.targetDate ?? user.targetExamDate;
  const left = daysUntil(target);
  const { units, bank } = await getLearningPath(user.id, exam);

  if (left === null || left <= 0) {
    return (
      <div className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Study schedule</h1>
          <p className="max-w-2xl text-sm muted">A day-by-day plan for {exam.name}, built from your exam date and what you have left to cover.</p>
        </header>
        <div className="panel panel-pad flex flex-col items-center gap-3 text-center">
          <CalendarDays className="h-8 w-8 text-accent" />
          <p className="text-sm font-semibold">{left !== null && left <= 0 ? "Your exam date has passed" : "Set your exam date to build a schedule"}</p>
          <ul className="space-y-1 text-xs muted">
            <li>Know exactly what to study every day</li>
            <li>Personalised to your exam date and progress</li>
            <li>Finishes a week early so you can review and sit readiness exams</li>
          </ul>
          <Link href="/profile" className="btn btn-primary btn-sm">
            Set exam date <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // Finish new content a week before the exam (or earlier on short timelines) and keep the last days for review.
  const reviewDays = Math.min(7, Math.max(1, Math.floor(left / 5)));
  const studyDays = Math.max(1, left - reviewDays);
  const remaining = units.map((u) => ({ ...u, left: Math.max(0, u.questionTotal - u.answered) }));
  const totalLeft = remaining.reduce((s, u) => s + u.left, 0);
  const perDay = Math.max(1, Math.ceil(totalLeft / studyDays));

  const plan: DayPlan[] = [];
  const queue = remaining.filter((u) => u.left > 0).map((u) => ({ id: u.id, name: u.name, left: u.left, lessons: u.lessons.length }));
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  for (let day = 1; day <= left; day++) {
    const date = new Date(start);
    date.setDate(start.getDate() + day - 1);
    if (day > studyDays) {
      plan.push({ day, date, units: [], questions: Math.min(perDay, 40), lessons: 0, review: true });
      continue;
    }
    let budget = perDay;
    const dayUnits: DayPlan["units"] = [];
    let lessons = 0;
    while (budget > 0 && queue.length) {
      const u = queue[0]!;
      const take = Math.min(budget, u.left);
      dayUnits.push({ id: u.id, name: u.name, questions: take });
      if (u.lessons) {
        lessons += Math.max(1, Math.round(u.lessons * (take / Math.max(1, u.left + take))));
      }
      u.left -= take;
      budget -= take;
      if (u.left <= 0) queue.shift();
    }
    plan.push({ day, date, units: dayUnits, questions: perDay - budget, lessons });
  }

  const weeks: DayPlan[][] = [];
  for (let i = 0; i < plan.length; i += 7) weeks.push(plan.slice(i, i + 7));

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Study schedule</h1>
        <p className="max-w-2xl text-sm muted">
          {left} days to your exam. About <strong>{perDay}</strong> new questions a day finishes the whole bank {reviewDays} day{reviewDays === 1 ? "" : "s"} early.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { l: "Days left", v: left },
          { l: "Questions to go", v: totalLeft, s: `of ${bank.total}` },
          { l: "Per day", v: perDay },
          { l: "Review days", v: reviewDays },
        ].map((c) => (
          <div key={c.l} className="panel p-4">
            <div className="text-xs font-medium muted">{c.l}</div>
            <div className="text-2xl font-bold tabular-nums">
              {c.v}
              {c.s && <span className="ml-1 text-sm font-normal muted">{c.s}</span>}
            </div>
          </div>
        ))}
      </section>

      {weeks.map((wk, i) => (
        <section key={i} className="space-y-2">
          <SectionHeading title={`Week ${i + 1}`} caption={`${fmt(wk[0]!.date)} – ${fmt(wk[wk.length - 1]!.date)}`} />
          <div className="panel divide-y divide-border overflow-hidden">
            {wk.map((d) => (
              <div key={d.day} className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-12 sm:items-center sm:gap-4">
                <div className="sm:col-span-3">
                  <div className="text-sm font-semibold">Day {d.day}</div>
                  <div className="text-[11px] muted">{fmt(d.date)}</div>
                </div>
                <div className="space-y-0.5 sm:col-span-7">
                  {d.review ? (
                    <div className="flex items-center gap-1.5 text-xs">
                      <Target className="h-3.5 w-3.5 text-accent" /> Review weak spots and sit a readiness exam
                    </div>
                  ) : (
                    d.units.map((u) => (
                      <Link key={u.id} href={`/exam/${exam.slug}/learn/${u.id}`} className="flex items-center gap-1.5 text-xs hover:underline">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                        <span className="font-medium">{u.name}</span>
                        <span className="muted">· {u.questions} questions</span>
                      </Link>
                    ))
                  )}
                </div>
                <div className="text-xs tabular-nums muted sm:col-span-2 sm:text-right">
                  {d.questions} Qs{d.lessons ? ` · ${d.lessons} lessons` : ""}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
