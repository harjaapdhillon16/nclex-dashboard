import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import {
  AlertCircle,
  Award,
  CheckCircle2,
  CheckSquare,
  FileSpreadsheet,
  GraduationCap,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";
import { db } from "@/lib/db";
import {
  auditLogs,
  caseStudies,
  enrollments,
  exams,
  questionReports,
  questions,
  tests,
  users,
} from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { resolveQuestionReportAction, updateUserRoleOrStatusAction } from "./actions";

export default async function AdminOverviewPage() {
  const staff = await requireUser(["admin", "reviewer", "instructor"]);

  const [{ totalUsers }] = await db.select({ totalUsers: sql<number>`count(*)::int` }).from(users);
  const [{ totalEnrollments }] = await db.select({ totalEnrollments: sql<number>`count(*)::int` }).from(enrollments);
  const [{ totalExams }] = await db.select({ totalExams: sql<number>`count(*)::int` }).from(exams);
  const [{ totalCases }] = await db.select({ totalCases: sql<number>`count(*)::int` }).from(caseStudies);
  const [{ totalTests }] = await db.select({ totalTests: sql<number>`count(*)::int` }).from(tests);

  const qByStatus = await db
    .select({ status: questions.status, n: sql<number>`count(*)::int` })
    .from(questions)
    .groupBy(questions.status);
  const statusMap = new Map(qByStatus.map((r) => [r.status, r.n]));
  const totalQuestions = qByStatus.reduce((s, r) => s + r.n, 0);

  const openReports = await db
    .select({
      id: questionReports.id,
      questionId: questionReports.questionId,
      reason: questionReports.reason,
      body: questionReports.body,
      status: questionReports.status,
      createdAt: questionReports.createdAt,
      code: questions.code,
      stem: questions.stem,
    })
    .from(questionReports)
    .leftJoin(questions, eq(questions.id, questionReports.questionId))
    .where(eq(questionReports.status, "open"))
    .orderBy(desc(questionReports.createdAt))
    .limit(15);

  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt)).limit(30);
  const recentAudit = await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(20);

  return (
    <div className="space-y-7">
      {/* Header & Navigation */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-subtle px-3 py-1 text-xs font-semibold text-accent mb-2">
            <ShieldAlert className="h-3.5 w-3.5" />
            QREXq Governance &amp; Content Review Console ({staff.role.toUpperCase()})
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Platform Administration &amp; Clinical Review
          </h1>
          <p className="text-xs sm:text-sm muted">
            Manage 45+ examination courses, 8-stage clinical question approval workflow, AI draft generation, import/export, users, and AUSTY Health Care analytics.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/admin/questions" className="btn btn-primary btn-sm">
            <CheckSquare className="h-4 w-4" />
            Question Bank &amp; Review Queue
          </Link>
          <Link href="/admin/ai" className="btn btn-secondary btn-sm">
            <Sparkles className="h-4 w-4 text-accent" />
            AI Question Generator
          </Link>
          <Link href="/admin/courses" className="btn btn-secondary btn-sm">
            <GraduationCap className="h-4 w-4 text-accent" />
            Exam Courses
          </Link>
          <Link href="/admin/import-export" className="btn btn-secondary btn-sm">
            <FileSpreadsheet className="h-4 w-4 text-accent" />
            Import / Export
          </Link>
          <Link href="/austy" className="btn btn-secondary btn-sm">
            <Award className="h-4 w-4 text-accent" />
            AUSTY Health Care ERP
          </Link>
        </div>
      </div>

      {/* Platform KPI Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="panel p-4 space-y-1">
          <div className="text-xs muted">Total Questions</div>
          <div className="text-2xl font-bold text-accent">{totalQuestions}</div>
          <div className="text-[11px] muted">{statusMap.get("published") ?? 0} published</div>
        </div>
        <div className="panel p-4 space-y-1">
          <div className="text-xs muted">Pending Review / Drafts</div>
          <div className="text-2xl font-bold text-amber-600">
            {(statusMap.get("draft") ?? 0) +
              (statusMap.get("initial_review") ?? 0) +
              (statusMap.get("clinical_review") ?? 0) +
              (statusMap.get("editorial_review") ?? 0)}
          </div>
          <div className="text-[11px] muted">{statusMap.get("approved") ?? 0} final-approved</div>
        </div>
        <div className="panel p-4 space-y-1">
          <div className="text-xs muted">NGN Case Studies</div>
          <div className="text-2xl font-bold">{totalCases}</div>
          <div className="text-[11px] muted">6 NCJMM steps each</div>
        </div>
        <div className="panel p-4 space-y-1">
          <div className="text-xs muted">Exam Courses</div>
          <div className="text-2xl font-bold">{totalExams}</div>
          <div className="text-[11px] muted">Across 9 divisions</div>
        </div>
        <div className="panel p-4 space-y-1">
          <div className="text-xs muted">Registered Users</div>
          <div className="text-2xl font-bold">{totalUsers}</div>
          <div className="text-[11px] muted">{totalEnrollments} course enrollments</div>
        </div>
        <div className="panel p-4 space-y-1">
          <div className="text-xs muted">Tests &amp; Open Reports</div>
          <div className="text-2xl font-bold">
            {totalTests} <span className="text-sm font-normal muted">/ {openReports.length}</span>
          </div>
          <div className="text-[11px] muted">Tests taken / Open reports</div>
        </div>
      </section>

      {/* 8-Stage Content Review Pipeline Summary */}
      <section className="panel panel-pad space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="h-section">8-Stage Content Review &amp; Clinical Approval Pipeline</h2>
          <Link href="/admin/questions" className="text-xs font-semibold text-accent hover:underline">
            Open Review Queue →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-xs">
          {(
            [
              ["draft", "1. Draft / AI"],
              ["initial_review", "2. Initial Review"],
              ["clinical_review", "3. Clinical Review"],
              ["editorial_review", "4. Editorial Review"],
              ["approved", "5. Final Approved"],
              ["published", "6. Published"],
              ["revision_requested", "7. Revision Req."],
              ["archived", "8. Archived"],
            ] as const
          ).map(([st, label]) => (
            <Link
              key={st}
              href={`/admin/questions?status=${st}`}
              className="rounded-xl border border-border bg-muted/40 p-3 hover:border-accent transition"
            >
              <div className="text-[11px] muted">{label}</div>
              <div className="text-lg font-bold mt-0.5">{statusMap.get(st) ?? 0}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Student-Reported Question Issues */}
      <section className="panel panel-pad space-y-3">
        <h2 className="h-section flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-rose-500" />
          Student-Reported Question Feedback Queue ({openReports.length} open)
        </h2>

        {openReports.length === 0 ? (
          <p className="text-xs muted">No open question error reports. All student reports have been triaged.</p>
        ) : (
          <div className="table-wrapper" tabIndex={0} role="region" aria-label="Open question reports">
            <table className="table text-xs">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Category</th>
                  <th>Details</th>
                  <th>Reported</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {openReports.map((r) => (
                  <tr key={r.id}>
                    <th className="font-mono text-left">
                      {r.code}
                      <div className="font-sans font-normal muted line-clamp-1 max-w-xs">{r.stem}</div>
                    </th>
                    <td>{r.reason}</td>
                    <td>{r.body ?? "—"}</td>
                    <td className="muted">{r.createdAt.toLocaleDateString()}</td>
                    <td>
                      <form action={resolveQuestionReportAction}>
                        <input type="hidden" name="reportId" value={r.id} />
                        <button type="submit" className="btn btn-secondary btn-sm">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          Resolve
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* User & Role Management + Audit Trail */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="panel panel-pad lg:col-span-2 space-y-3">
          <h2 className="h-section flex items-center gap-2">
            <Users className="h-4 w-4 text-accent" />
            User, Reviewer &amp; Subscription Access Control ({allUsers.length})
          </h2>

          <div className="table-wrapper" tabIndex={0} role="region" aria-label="User management table">
            <table className="table text-xs">
              <thead>
                <tr>
                  <th>Name &amp; Email</th>
                  <th>Role</th>
                  <th>Account Status</th>
                  <th>Plan</th>
                  <th>Save</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((u) => (
                  <tr key={u.id}>
                    <th className="text-left">
                      <div className="font-bold">{u.name}</div>
                      <div className="font-normal muted">{u.email}</div>
                    </th>
                    <td colSpan={4}>
                      <form action={updateUserRoleOrStatusAction} className="grid grid-cols-4 gap-2 items-center">
                        <input type="hidden" name="userId" value={u.id} />
                        <select name="role" defaultValue={u.role} className="field py-1 text-xs">
                          <option value="student">student</option>
                          <option value="reviewer">reviewer</option>
                          <option value="instructor">instructor</option>
                          <option value="admin">admin</option>
                        </select>
                        <select name="status" defaultValue={u.status} className="field py-1 text-xs">
                          <option value="active">active</option>
                          <option value="suspended">suspended</option>
                        </select>
                        <select name="subscriptionStatus" defaultValue={u.subscriptionStatus} className="field py-1 text-xs">
                          <option value="free">free</option>
                          <option value="single-course">single-course</option>
                          <option value="nclex-ielts-bundle">nclex-ielts-bundle</option>
                          <option value="all-access">all-access</option>
                          <option value="institution">institution</option>
                        </select>
                        <button type="submit" disabled={staff.role !== "admin"} className="btn btn-secondary btn-sm">
                          Update
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel panel-pad space-y-3">
          <h2 className="h-section">Security &amp; Editorial Audit Log</h2>
          <div className="divide-y divide-border text-xs max-h-[420px] overflow-y-auto">
            {recentAudit.map((a) => (
              <div key={a.id} className="py-2.5 space-y-0.5">
                <div className="flex items-center justify-between font-mono font-bold text-accent">
                  <span>{a.action}</span>
                  <span className="text-[10px] muted">{a.createdAt.toLocaleTimeString()}</span>
                </div>
                <div className="muted">
                  Entity: {a.entity ?? "system"} {a.entityId ? `(#${a.entityId})` : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
