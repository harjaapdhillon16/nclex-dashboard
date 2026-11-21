import Link from "next/link";
import { asc, desc, eq, sql } from "drizzle-orm";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/db";
import {
  auditLogs,
  examCategories,
  exams,
  flashcards,
  questionReports,
  questions,
  studyMaterials,
  users,
} from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { resolveQuestionReportAction, updateUserRoleOrStatusAction } from "./actions";

/** A course is "Ready" once it has enough questions AND at least one lesson. */
const READY_QUESTIONS = 50;
const IN_REVIEW = ["draft", "initial_review", "clinical_review", "editorial_review", "approved", "revision_requested"];

function health(published: number, lessons: number): { label: "Ready" | "Thin" | "Empty"; cls: string } {
  if (published === 0) return { label: "Empty", cls: "bg-rose-500/15 text-rose-700 dark:text-rose-300" };
  if (published < READY_QUESTIONS || lessons === 0)
    return { label: "Thin", cls: "bg-amber-500/15 text-amber-700 dark:text-amber-300" };
  return { label: "Ready", cls: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" };
}

export default async function AdminHomePage() {
  const staff = await requireUser(["admin", "reviewer", "instructor"]);

  const [allExams, categories, qStatus, lessonRows, cardRows, openReports, userRows, recentAudit] = await Promise.all([
    db.select().from(exams).orderBy(asc(exams.displayOrder)),
    db.select().from(examCategories).orderBy(asc(examCategories.displayOrder)),
    db
      .select({ examId: questions.examId, status: questions.status, n: sql<number>`count(*)::int` })
      .from(questions)
      .groupBy(questions.examId, questions.status),
    db
      .select({ examId: studyMaterials.examId, n: sql<number>`count(*)::int` })
      .from(studyMaterials)
      .where(eq(studyMaterials.status, "published"))
      .groupBy(studyMaterials.examId),
    db
      .select({ examId: flashcards.examId, n: sql<number>`count(*)::int` })
      .from(flashcards)
      .where(eq(flashcards.status, "published"))
      .groupBy(flashcards.examId),
    db
      .select({
        id: questionReports.id,
        reason: questionReports.reason,
        body: questionReports.body,
        createdAt: questionReports.createdAt,
        code: questions.code,
        stem: questions.stem,
      })
      .from(questionReports)
      .leftJoin(questions, eq(questions.id, questionReports.questionId))
      .where(eq(questionReports.status, "open"))
      .orderBy(desc(questionReports.createdAt))
      .limit(10),
    db.select().from(users).orderBy(desc(users.createdAt)).limit(50),
    db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(15),
  ]);

  const catById = new Map(categories.map((c) => [c.id, c.name]));
  const published = new Map<number, number>();
  const inReview = new Map<number, number>();
  for (const r of qStatus) {
    if (r.status === "published") published.set(r.examId, (published.get(r.examId) ?? 0) + r.n);
    else if (IN_REVIEW.includes(r.status)) inReview.set(r.examId, (inReview.get(r.examId) ?? 0) + r.n);
  }
  const lessons = new Map(lessonRows.map((r) => [r.examId, r.n]));
  const cards = new Map(cardRows.map((r) => [r.examId, r.n]));

  const queueTotal = [...inReview.values()].reduce((a, b) => a + b, 0);
  const roleCounts = userRows.reduce<Record<string, number>>((m, u) => ({ ...m, [u.role]: (m[u.role] ?? 0) + 1 }), {});

  // Weakest courses first, so the gaps are the first thing you see.
  const order = { Empty: 0, Thin: 1, Ready: 2 } as const;
  const rows = [...allExams].sort(
    (a, b) =>
      order[health(published.get(a.id) ?? 0, lessons.get(a.id) ?? 0).label] -
        order[health(published.get(b.id) ?? 0, lessons.get(b.id) ?? 0).label] || a.displayOrder - b.displayOrder,
  );
  const counts = { Empty: 0, Thin: 0, Ready: 0 };
  for (const e of allExams) counts[health(published.get(e.id) ?? 0, lessons.get(e.id) ?? 0).label]++;

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Content</h1>
          <p className="text-sm muted">
            {counts.Ready} of {allExams.length} courses are ready for learners · {counts.Thin} thin · {counts.Empty} empty.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/questions" className="btn btn-primary btn-sm">
            Review queue ({queueTotal})
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link href="/admin/import-export" className="btn btn-secondary btn-sm">
            Import questions
          </Link>
          <Link href="/admin/ai" className="btn btn-secondary btn-sm">
            Generate drafts
          </Link>
        </div>
      </header>

      {/* Per-course content health */}
      <section className="panel panel-pad space-y-3">
        <div className="flex items-end justify-between gap-3">
          <h2 className="h-section">Courses</h2>
          <Link href="/admin/courses" className="text-xs font-semibold text-accent hover:underline">
            Manage courses →
          </Link>
        </div>
        <div className="table-wrapper" tabIndex={0} role="region" aria-label="Content by course">
          <table className="table text-xs">
            <thead>
              <tr>
                <th>Course</th>
                <th>Status</th>
                <th className="text-right">Live questions</th>
                <th className="text-right">In review</th>
                <th className="text-right">Lessons</th>
                <th className="text-right">Flashcards</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => {
                const p = published.get(e.id) ?? 0;
                const l = lessons.get(e.id) ?? 0;
                const h = health(p, l);
                const r = inReview.get(e.id) ?? 0;
                return (
                  <tr key={e.id}>
                    <th className="text-left">
                      <Link href={`/admin/questions?exam=${e.slug}`} className="font-semibold hover:text-accent hover:underline">
                        {e.name}
                      </Link>
                      <div className="font-normal muted">
                        {catById.get(e.categoryId)}
                        {e.status !== "published" && ` · ${e.status}`}
                      </div>
                    </th>
                    <td>
                      <span className={`chip text-[11px] font-semibold ${h.cls}`}>{h.label}</span>
                    </td>
                    <td className="text-right font-semibold tabular-nums">{p}</td>
                    <td className="text-right tabular-nums">
                      {r > 0 ? (
                        <Link href={`/admin/questions?exam=${e.slug}`} className="text-accent hover:underline">
                          {r}
                        </Link>
                      ) : (
                        <span className="muted">0</span>
                      )}
                    </td>
                    <td className="text-right tabular-nums">{l}</td>
                    <td className="text-right tabular-nums">{cards.get(e.id) ?? 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] muted">
          Ready = at least {READY_QUESTIONS} live questions and one lesson. Thin = some questions but below that. Empty = no live questions.
          “In review” counts drafts through approved, waiting to be published.
        </p>
      </section>

      {/* Learner-reported problems */}
      <section className="panel panel-pad space-y-3">
        <h2 className="h-section">Reported questions ({openReports.length} open)</h2>
        {openReports.length === 0 ? (
          <p className="text-xs muted">Nothing reported. Learners can flag a question while reviewing an answer.</p>
        ) : (
          <ul className="divide-y divide-border text-xs">
            {openReports.map((r) => (
              <li key={r.id} className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0 space-y-0.5">
                  <div>
                    <span className="font-mono font-bold text-accent">{r.code}</span>{" "}
                    <span className="chip">{r.reason}</span>
                  </div>
                  <p className="line-clamp-1 font-medium">{r.stem}</p>
                  {r.body && <p className="muted">{r.body}</p>}
                </div>
                <form action={resolveQuestionReportAction} className="shrink-0">
                  <input type="hidden" name="reportId" value={r.id} />
                  <button type="submit" className="btn btn-secondary btn-sm">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Resolve
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* People */}
      <section className="panel panel-pad space-y-3">
        <div>
          <h2 className="h-section">People</h2>
          <p className="text-xs muted">
            {userRows.length} accounts
            {Object.entries(roleCounts).map(([role, n]) => ` · ${n} ${role}${n === 1 ? "" : "s"}`)}
          </p>
        </div>
        <details>
          <summary className="cursor-pointer select-none text-xs font-semibold text-accent">Manage roles and access</summary>
          <div className="table-wrapper mt-3" tabIndex={0} role="region" aria-label="Users">
            <table className="table text-xs">
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Role &amp; status</th>
                </tr>
              </thead>
              <tbody>
                {userRows.map((u) => (
                  <tr key={u.id}>
                    <th className="text-left">
                      <div className="font-semibold">{u.name}</div>
                      <div className="font-normal muted">{u.email}</div>
                    </th>
                    <td>
                      <form action={updateUserRoleOrStatusAction} className="flex flex-wrap items-center gap-2">
                        <input type="hidden" name="userId" value={u.id} />
                        <input type="hidden" name="subscriptionStatus" value={u.subscriptionStatus} />
                        <select name="role" defaultValue={u.role} className="field py-1 text-xs" aria-label="Role">
                          <option value="student">student</option>
                          <option value="reviewer">reviewer</option>
                          <option value="instructor">instructor</option>
                          <option value="admin">admin</option>
                        </select>
                        <select name="status" defaultValue={u.status} className="field py-1 text-xs" aria-label="Status">
                          <option value="active">active</option>
                          <option value="suspended">suspended</option>
                        </select>
                        <button type="submit" disabled={staff.role !== "admin"} className="btn btn-secondary btn-sm">
                          Save
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {staff.role !== "admin" && <p className="mt-2 text-[11px] muted">Only admins can change roles.</p>}
        </details>
      </section>

      <details className="panel panel-pad">
        <summary className="cursor-pointer select-none text-sm font-bold">Recent activity</summary>
        <ul className="mt-3 divide-y divide-border text-xs">
          {recentAudit.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-3 py-2">
              <span>
                <span className="font-mono font-semibold text-accent">{a.action}</span>
                <span className="muted">
                  {" "}
                  {a.entity ?? "system"}
                  {a.entityId ? ` #${a.entityId}` : ""}
                </span>
              </span>
              <span className="muted shrink-0">{a.createdAt.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
