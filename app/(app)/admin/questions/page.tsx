import Link from "next/link";
import { and, asc, desc, eq, type SQL } from "drizzle-orm";
import { ArrowLeft, CheckCircle2, Copy, PlusCircle, ShieldCheck, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { exams, questionReviews, questions, QUESTION_STATUSES, type QuestionStatus } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { DIFFICULTIES, QUESTION_TYPE_LABELS, type QuestionType } from "@/lib/questions/types";
import {
  createQuestionAction,
  deleteQuestionAction,
  duplicateQuestionAction,
  transitionQuestionWorkflowAction,
} from "../actions";

const NEXT_STAGE_MAP: Record<QuestionStatus, { to: QuestionStatus; label: string }[]> = {
  draft: [
    { to: "initial_review", label: "Submit to Initial Review" },
    { to: "clinical_review", label: "Advance to Clinical Review" },
  ],
  initial_review: [
    { to: "clinical_review", label: "Pass to Clinical Review" },
    { to: "revision_requested", label: "Request Revision" },
  ],
  clinical_review: [
    { to: "editorial_review", label: "Pass Clinical → Editorial" },
    { to: "revision_requested", label: "Request Clinical Revision" },
  ],
  editorial_review: [
    { to: "approved", label: "Final Approve" },
    { to: "revision_requested", label: "Request Editorial Revision" },
  ],
  approved: [
    { to: "published", label: "Publish to Live Bank" },
    { to: "editorial_review", label: "Return to Editorial" },
  ],
  published: [
    { to: "archived", label: "Archive Question" },
    { to: "draft", label: "Unpublish to Draft" },
  ],
  revision_requested: [{ to: "initial_review", label: "Resubmit for Review" }],
  rejected: [{ to: "draft", label: "Move to Draft" }],
  archived: [{ to: "published", label: "Restore to Published" }],
};

export default async function AdminQuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; exam?: string; source?: string }>;
}) {
  const sp = await searchParams;
  const staff = await requireUser(["admin", "reviewer", "instructor"]);

  const allExams = await db.select().from(exams).orderBy(asc(exams.displayOrder));
  const examById = new Map(allExams.map((e) => [e.id, e]));
  const selectedExam = sp.exam ? allExams.find((e) => e.slug === sp.exam) : undefined;

  const conds: SQL[] = [];
  if (sp.status) conds.push(eq(questions.status, sp.status as QuestionStatus));
  if (selectedExam) conds.push(eq(questions.examId, selectedExam.id));
  if (sp.source) conds.push(eq(questions.source, sp.source));

  const qList = await db
    .select()
    .from(questions)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(desc(questions.updatedAt), desc(questions.id))
    .limit(60);

  const recentReviews = await db
    .select()
    .from(questionReviews)
    .orderBy(desc(questionReviews.createdAt))
    .limit(20);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-medium muted hover:text-foreground mb-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Admin Console
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            Question Bank Authoring &amp; 8-Stage Review Workflow
          </h1>
          <p className="text-xs sm:text-sm muted">
            Draft → Initial Review → Clinical Review → Editorial Review → Final Approval → Published → Archived.
          </p>
        </div>
        <Link href="/admin/ai" className="btn btn-primary btn-sm">
          AI Question Generator →
        </Link>
      </div>

      {/* Create New Question Collapsible Panel */}
      <details className="panel panel-pad">
        <summary className="cursor-pointer font-bold text-sm flex items-center gap-2 text-accent select-none">
          <PlusCircle className="h-4 w-4" />
          Author New Original Question (Saved as Draft for Clinical Review)
        </summary>

        <form action={createQuestionAction} className="mt-4 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="label text-xs">Examination Course</label>
              <select name="examSlug" defaultValue={selectedExam?.slug ?? "nclex-rn"} className="field text-xs">
                {allExams.map((e) => (
                  <option key={e.id} value={e.slug}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label text-xs">Question Format</label>
              <select name="type" defaultValue="mcq" className="field text-xs">
                <option value="mcq">Single Best Answer (MCQ)</option>
                <option value="sata">Select All That Apply (SATA)</option>
                <option value="multiple_response">NGN Extended Multiple Response</option>
                <option value="numeric">Dosage / Numeric Calculation</option>
              </select>
            </div>
            <div>
              <label className="label text-xs">Difficulty</label>
              <select name="difficulty" defaultValue="moderate" className="field text-xs">
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label text-xs">Topic</label>
              <input name="topic" required placeholder="e.g., Sepsis & Prioritization" className="field text-xs" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="label text-xs">Client-Needs Category / Section</label>
              <input name="category" placeholder="e.g., Management of Care" className="field text-xs" />
            </div>
            <div>
              <label className="label text-xs">Subject</label>
              <input name="subject" placeholder="e.g., Adult Health" className="field text-xs" />
            </div>
            <div>
              <label className="label text-xs">Body System</label>
              <input name="system" placeholder="e.g., Cardiovascular" className="field text-xs" />
            </div>
          </div>

          <div>
            <label className="label text-xs">Patient Scenario / Clinical Context (Optional)</label>
            <textarea name="scenario" rows={2} placeholder="Vital signs, history, laboratory findings…" className="field text-xs" />
          </div>

          <div>
            <label className="label text-xs">Question Stem (Required)</label>
            <textarea name="stem" required rows={2} placeholder="Write an original, unambiguous clinical stem…" className="field text-xs" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <input name="optA" placeholder="Option A text" className="field text-xs" />
              <input name="expA" placeholder="Why Option A is correct/incorrect" className="field text-xs" />
            </div>
            <div className="space-y-1.5">
              <input name="optB" placeholder="Option B text" className="field text-xs" />
              <input name="expB" placeholder="Why Option B is correct/incorrect" className="field text-xs" />
            </div>
            <div className="space-y-1.5">
              <input name="optC" placeholder="Option C text" className="field text-xs" />
              <input name="expC" placeholder="Why Option C is correct/incorrect" className="field text-xs" />
            </div>
            <div className="space-y-1.5">
              <input name="optD" placeholder="Option D text" className="field text-xs" />
              <input name="expD" placeholder="Why Option D is correct/incorrect" className="field text-xs" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="label text-xs">Correct Key (e.g. &quot;a&quot; or &quot;a,c&quot; for SATA)</label>
              <input name="correctKey" defaultValue="a" className="field text-xs font-mono" />
            </div>
            <div>
              <label className="label text-xs">Numeric Value (if Calculation type)</label>
              <input name="numericValue" type="number" step="0.1" placeholder="125" className="field text-xs font-mono" />
            </div>
            <div>
              <label className="label text-xs">Numeric Unit</label>
              <input name="numericUnit" placeholder="mL/hr" className="field text-xs" />
            </div>
          </div>

          <div>
            <label className="label text-xs">Comprehensive Clinical Rationale (Required)</label>
            <textarea name="rationale" required rows={3} placeholder="Explain pathophysiology, priority nursing action, and why distractors are wrong…" className="field text-xs" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input name="priorityAction" placeholder="Priority Nursing Action" className="field text-xs" />
            <input name="safety" placeholder="Safety Considerations" className="field text-xs" />
            <input name="education" placeholder="Patient Education" className="field text-xs" />
            <input name="strategy" placeholder="NCLEX Test-Taking Strategy" className="field text-xs" />
            <input name="keyTakeaway" placeholder="Key Takeaway" className="field text-xs" />
            <input name="references" placeholder="Internal Validation Reference" className="field text-xs" />
          </div>

          <button type="submit" className="btn btn-primary btn-sm">
            Save Question as Draft
          </button>
        </form>
      </details>

      {/* Filter Bar */}
      <div className="panel panel-pad space-y-3">
        <div className="flex flex-wrap gap-1.5">
          <Link
            href="/admin/questions"
            className={`rounded-xl border px-3 py-1.5 text-xs font-semibold ${
              !sp.status ? "border-accent bg-accent text-white" : "border-border hover:bg-muted"
            }`}
          >
            All Statuses
          </Link>
          {QUESTION_STATUSES.map((st) => (
            <Link
              key={st}
              href={`/admin/questions?status=${st}${sp.exam ? `&exam=${sp.exam}` : ""}`}
              className={`rounded-xl border px-3 py-1.5 text-xs font-semibold capitalize ${
                sp.status === st ? "border-accent bg-accent text-white" : "border-border hover:bg-muted"
              }`}
            >
              {st.replace("_", " ")}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border">
          <Link
            href={`/admin/questions${sp.status ? `?status=${sp.status}` : ""}`}
            className={`chip text-xs ${!sp.exam ? "bg-accent text-white" : ""}`}
          >
            All Exams
          </Link>
          {allExams.slice(0, 12).map((e) => (
            <Link
              key={e.id}
              href={`/admin/questions?exam=${e.slug}${sp.status ? `&status=${sp.status}` : ""}`}
              className={`chip text-xs ${sp.exam === e.slug ? "bg-accent text-white" : ""}`}
            >
              {e.shortName}
            </Link>
          ))}
        </div>
      </div>

      {/* Questions List with Workflow Transitions */}
      <div className="panel panel-pad space-y-4">
        <h2 className="h-section">Showing {qList.length} Items</h2>

        <div className="divide-y divide-border">
          {qList.map((q) => {
            const ex = examById.get(q.examId);
            const transitions = NEXT_STAGE_MAP[q.status] ?? [];
            return (
              <div key={q.id} className="py-4 space-y-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-mono font-bold text-accent">{q.code}</span>
                    <span className="chip bg-accent-subtle text-accent">{ex?.shortName ?? "Exam"}</span>
                    <span className="chip">{QUESTION_TYPE_LABELS[q.type as QuestionType] ?? q.type}</span>
                    <span className="chip capitalize">{q.difficulty}</span>
                    <span className="chip uppercase font-mono text-[10px]">Source: {q.source}</span>
                    <span
                      className={`chip font-bold capitalize ${
                        q.status === "published"
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : q.status === "draft"
                            ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                            : "bg-accent-subtle text-accent"
                      }`}
                    >
                      {q.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <form action={duplicateQuestionAction}>
                      <input type="hidden" name="questionId" value={q.id} />
                      <button type="submit" className="btn btn-secondary btn-sm" title="Duplicate question">
                        <Copy className="h-3.5 w-3.5" />
                        Duplicate
                      </button>
                    </form>
                    {staff.role === "admin" && (
                      <form action={deleteQuestionAction}>
                        <input type="hidden" name="questionId" value={q.id} />
                        <button type="submit" className="btn btn-secondary btn-sm text-rose-600" title="Delete question">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                <p className="text-sm font-medium leading-relaxed">{q.stem}</p>
                <p className="muted line-clamp-2">{q.rationale}</p>

                {/* Workflow Transition Controls */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {transitions.map((tr) => (
                    <form key={tr.to} action={transitionQuestionWorkflowAction} className="inline-flex items-center gap-2">
                      <input type="hidden" name="questionId" value={q.id} />
                      <input type="hidden" name="toStatus" value={tr.to} />
                      <input type="hidden" name="decision" value={tr.to} />
                      <input type="hidden" name="clinicalValidation" value="true" />
                      <input type="hidden" name="editorialValidation" value="true" />
                      <button
                        type="submit"
                        className={`btn btn-sm ${
                          tr.to === "published" || tr.to === "approved" ? "btn-primary" : "btn-secondary"
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {tr.label}
                      </button>
                    </form>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review & Approval History Table */}
      <section className="panel panel-pad space-y-3">
        <h2 className="h-section flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-accent" />
          Recent Clinical &amp; Editorial Review Log ({recentReviews.length})
        </h2>
        {recentReviews.length === 0 ? (
          <p className="text-xs muted">Advance or approve any question above to record a review audit entry.</p>
        ) : (
          <div className="table-wrapper" tabIndex={0} role="region" aria-label="Question review history">
            <table className="table text-xs">
              <thead>
                <tr>
                  <th>Question ID</th>
                  <th>Transition</th>
                  <th>Clinical Validation</th>
                  <th>Editorial Validation</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {recentReviews.map((rv) => (
                  <tr key={rv.id}>
                    <th className="font-mono text-left">#{rv.questionId}</th>
                    <td>
                      <span className="capitalize">{rv.fromStatus?.replace("_", " ")}</span> →{" "}
                      <strong className="capitalize text-accent">{rv.toStatus.replace("_", " ")}</strong>
                    </td>
                    <td>{rv.clinicalValidation ? "Verified ✓" : "—"}</td>
                    <td>{rv.editorialValidation ? "Verified ✓" : "—"}</td>
                    <td className="muted">{rv.createdAt.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
