import Link from "next/link";
import { and, asc, desc, eq, ilike, inArray, or, sql, type SQL } from "drizzle-orm";
import { Check, Copy, PlusCircle, Trash2 } from "lucide-react";
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

/** Statuses that still need a human to do something. */
const QUEUE: QuestionStatus[] = [
  "draft",
  "initial_review",
  "clinical_review",
  "editorial_review",
  "approved",
  "revision_requested",
];

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  initial_review: "Initial review",
  clinical_review: "Clinical review",
  editorial_review: "Editorial review",
  approved: "Approved",
  published: "Live",
  revision_requested: "Needs changes",
  rejected: "Rejected",
  archived: "Archived",
};

/** Moves allowed from each status. `primary` marks the normal forward step. */
const MOVES: Record<QuestionStatus, { to: QuestionStatus; label: string; primary?: boolean; note?: boolean }[]> = {
  draft: [
    { to: "initial_review", label: "Send to review", primary: true },
    { to: "clinical_review", label: "Skip to clinical review" },
  ],
  initial_review: [
    { to: "clinical_review", label: "Pass to clinical review", primary: true },
    { to: "revision_requested", label: "Request changes", note: true },
  ],
  clinical_review: [
    { to: "editorial_review", label: "Pass to editorial", primary: true },
    { to: "revision_requested", label: "Request changes", note: true },
  ],
  editorial_review: [
    { to: "approved", label: "Approve", primary: true },
    { to: "revision_requested", label: "Request changes", note: true },
  ],
  approved: [
    { to: "published", label: "Publish", primary: true },
    { to: "editorial_review", label: "Back to editorial" },
  ],
  published: [
    { to: "archived", label: "Archive" },
    { to: "draft", label: "Unpublish" },
  ],
  revision_requested: [{ to: "initial_review", label: "Resubmit", primary: true }],
  rejected: [{ to: "draft", label: "Move to draft" }],
  archived: [{ to: "published", label: "Restore" }],
};

const PAGE_SIZE = 40;

type Opt = { id: string; text: string };

function Preview({ type, content, answer }: { type: string; content: unknown; answer: unknown }) {
  const c = (content ?? {}) as { options?: Opt[]; items?: Opt[] };
  const a = (answer ?? {}) as { correct?: string | string[]; order?: string[] };
  const correct = new Set(Array.isArray(a.correct) ? a.correct : a.correct ? [a.correct] : []);
  const list = c.options ?? c.items;
  if (!list?.length) {
    return (
      <p className="text-xs muted">
        {QUESTION_TYPE_LABELS[type as QuestionType] ?? type} items have a custom layout. Open the course to preview it.
      </p>
    );
  }
  return (
    <ul className="space-y-1">
      {list.map((o) => {
        const ok = correct.has(o.id);
        return (
          <li
            key={o.id}
            className={`flex gap-2 rounded-lg border px-2.5 py-1.5 text-xs ${
              ok ? "border-emerald-500/40 bg-emerald-500/10" : "border-border"
            }`}
          >
            <span className="font-mono font-bold uppercase">{o.id}</span>
            <span className="flex-1">{o.text}</span>
            {ok && <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-label="Correct answer" />}
          </li>
        );
      })}
    </ul>
  );
}

export default async function ReviewQueuePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; exam?: string; q?: string; source?: string }>;
}) {
  const sp = await searchParams;
  const staff = await requireUser(["admin", "reviewer", "instructor"]);

  const allExams = await db.select().from(exams).orderBy(asc(exams.displayOrder));
  const examById = new Map(allExams.map((e) => [e.id, e]));
  const selectedExam = sp.exam ? allExams.find((e) => e.slug === sp.exam) : undefined;
  const status = sp.status ?? "queue";
  const search = sp.q?.trim();

  const base: SQL[] = [];
  if (selectedExam) base.push(eq(questions.examId, selectedExam.id));
  if (sp.source) base.push(eq(questions.source, sp.source));
  if (search) base.push(or(ilike(questions.stem, `%${search}%`), ilike(questions.code, `%${search}%`))!);

  const conds = [...base];
  if (status === "queue") conds.push(inArray(questions.status, QUEUE));
  else if ((QUESTION_STATUSES as readonly string[]).includes(status)) conds.push(eq(questions.status, status as QuestionStatus));
  const where = conds.length ? and(...conds) : undefined;

  const [qList, [{ total }], stageCounts, recentReviews] = await Promise.all([
    db.select().from(questions).where(where).orderBy(desc(questions.updatedAt), desc(questions.id)).limit(PAGE_SIZE),
    db.select({ total: sql<number>`count(*)::int` }).from(questions).where(where),
    db
      .select({ status: questions.status, n: sql<number>`count(*)::int` })
      .from(questions)
      .where(base.length ? and(...base) : undefined)
      .groupBy(questions.status),
    db
      .select({
        id: questionReviews.id,
        code: questions.code,
        fromStatus: questionReviews.fromStatus,
        toStatus: questionReviews.toStatus,
        comments: questionReviews.comments,
        createdAt: questionReviews.createdAt,
      })
      .from(questionReviews)
      .leftJoin(questions, eq(questions.id, questionReviews.questionId))
      .orderBy(desc(questionReviews.createdAt))
      .limit(15),
  ]);
  const stage = new Map(stageCounts.map((r) => [r.status, r.n]));
  const queueCount = QUEUE.reduce((s, st) => s + (stage.get(st) ?? 0), 0);

  const href = (over: { status?: string }) => {
    const p = new URLSearchParams();
    if (sp.exam) p.set("exam", sp.exam);
    if (search) p.set("q", search);
    if (over.status && over.status !== "queue") p.set("status", over.status);
    const s = p.toString();
    return `/admin/questions${s ? `?${s}` : ""}`;
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Review queue</h1>
        <p className="text-sm muted max-w-2xl">
          Each question moves draft → initial review → clinical review → editorial review → approved → live. Open one to read it as a
          learner would, then move it forward or send it back.
        </p>
      </header>

      {/* Filters */}
      <form method="get" className="panel panel-pad flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="sm:w-56">
          <label className="label text-xs" htmlFor="f-exam">
            Course
          </label>
          <select id="f-exam" name="exam" defaultValue={sp.exam ?? ""} className="field text-xs">
            <option value="">All courses</option>
            {allExams.map((e) => (
              <option key={e.id} value={e.slug}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:w-48">
          <label className="label text-xs" htmlFor="f-status">
            Show
          </label>
          <select id="f-status" name="status" defaultValue={status} className="field text-xs">
            <option value="queue">Needs attention</option>
            {QUESTION_STATUSES.map((st) => (
              <option key={st} value={st}>
                {STATUS_LABEL[st]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="label text-xs" htmlFor="f-q">
            Search
          </label>
          <input id="f-q" name="q" defaultValue={search ?? ""} placeholder="Question text or code" className="field text-xs" />
        </div>
        {sp.source && <input type="hidden" name="source" value={sp.source} />}
        <button type="submit" className="btn btn-primary btn-sm">
          Apply
        </button>
      </form>

      {/* Stage tabs */}
      <div className="flex flex-wrap gap-1.5 text-xs">
        <Link
          href={href({ status: "queue" })}
          className={`rounded-xl border px-3 py-1.5 font-semibold ${
            status === "queue" ? "border-accent bg-accent text-white" : "border-border hover:bg-muted"
          }`}
        >
          Needs attention ({queueCount})
        </Link>
        {(["draft", "initial_review", "clinical_review", "editorial_review", "approved", "revision_requested", "published"] as const).map(
          (st) => (
            <Link
              key={st}
              href={href({ status: st })}
              className={`rounded-xl border px-3 py-1.5 font-medium ${
                status === st ? "border-accent bg-accent text-white" : "border-border hover:bg-muted"
              }`}
            >
              {STATUS_LABEL[st]} ({stage.get(st) ?? 0})
            </Link>
          ),
        )}
      </div>

      {/* Questions */}
      <section className="space-y-3">
        <p className="text-xs muted">
          {total === 0
            ? "Nothing here."
            : total > PAGE_SIZE
              ? `Showing the ${PAGE_SIZE} most recently updated of ${total}. Narrow the filters to see others.`
              : `${total} question${total === 1 ? "" : "s"}`}
        </p>

        {qList.map((q) => {
          const ex = examById.get(q.examId);
          const moves = MOVES[q.status] ?? [];
          const ownItem = staff.role === "reviewer" && q.createdBy === staff.id;
          const content = q.content as { options?: Opt[] } | null;
          return (
            <details key={q.id} className="panel group overflow-hidden">
              <summary className="flex cursor-pointer list-none flex-col gap-1.5 p-4 select-none hover:bg-muted/40">
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="font-mono font-bold text-accent">{q.code}</span>
                  <span className="chip">{ex?.shortName ?? "—"}</span>
                  <span className="chip">{QUESTION_TYPE_LABELS[q.type as QuestionType] ?? q.type}</span>
                  <span
                    className={`chip font-semibold ${
                      q.status === "published"
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                        : q.status === "revision_requested"
                          ? "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                          : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                    }`}
                  >
                    {STATUS_LABEL[q.status]}
                  </span>
                  {q.source !== "seed" && <span className="chip muted">{q.source}</span>}
                </div>
                <p className="text-sm font-medium leading-snug line-clamp-2">{q.stem}</p>
              </summary>

              <div className="space-y-4 border-t border-border bg-muted/20 p-4 text-sm">
                {q.scenario && <p className="rounded-xl border border-border bg-surface p-3 text-xs leading-relaxed">{q.scenario}</p>}
                <p className="font-medium leading-relaxed">{q.stem}</p>
                <Preview type={q.type} content={content} answer={q.answer} />
                {q.rationale && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold uppercase tracking-wider muted">Rationale</div>
                    <p className="text-xs leading-relaxed">{q.rationale}</p>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
                  {moves.map((m) => {
                    if (m.to === "published" && ownItem) {
                      return (
                        <span key={m.to} className="text-xs muted">
                          You wrote this, so someone else must publish it.
                        </span>
                      );
                    }
                    return (
                      <form key={m.to} action={transitionQuestionWorkflowAction} className="flex items-center gap-2">
                        <input type="hidden" name="questionId" value={q.id} />
                        <input type="hidden" name="toStatus" value={m.to} />
                        <input type="hidden" name="decision" value={m.to} />
                        <input type="hidden" name="clinicalValidation" value="true" />
                        <input type="hidden" name="editorialValidation" value="true" />
                        {m.note && (
                          <input name="comments" placeholder="What needs to change?" className="field py-1 text-xs w-44" />
                        )}
                        <button type="submit" className={`btn btn-sm ${m.primary ? "btn-primary" : "btn-secondary"}`}>
                          {m.label}
                        </button>
                      </form>
                    );
                  })}
                  <span className="flex-1" />
                  <form action={duplicateQuestionAction}>
                    <input type="hidden" name="questionId" value={q.id} />
                    <button type="submit" className="btn btn-secondary btn-sm" title="Duplicate as a new draft">
                      <Copy className="h-3.5 w-3.5" />
                      Duplicate
                    </button>
                  </form>
                  {staff.role === "admin" && (
                    <form action={deleteQuestionAction}>
                      <input type="hidden" name="questionId" value={q.id} />
                      <button type="submit" className="btn btn-secondary btn-sm text-rose-600" title="Delete permanently">
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </details>
          );
        })}

        {qList.length === 0 && (
          <div className="panel panel-pad text-sm muted">
            {status === "queue"
              ? "The queue is clear. Import questions or generate drafts to add more."
              : "No questions match these filters."}
          </div>
        )}
      </section>

      {/* Author a question */}
      <details className="panel panel-pad">
        <summary className="flex cursor-pointer select-none items-center gap-2 text-sm font-bold text-accent">
          <PlusCircle className="h-4 w-4" />
          Write a question
        </summary>
        <form action={createQuestionAction} className="mt-4 space-y-4 text-xs">
          <p className="muted">Saved as a draft. It goes live only after it passes review.</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <div>
              <label className="label text-xs">Course</label>
              <select name="examSlug" defaultValue={selectedExam?.slug ?? "nclex-rn"} className="field text-xs">
                {allExams.map((e) => (
                  <option key={e.id} value={e.slug}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label text-xs">Format</label>
              <select name="type" defaultValue="mcq" className="field text-xs">
                <option value="mcq">Single best answer</option>
                <option value="sata">Select all that apply</option>
                <option value="multiple_response">Extended multiple response</option>
                <option value="numeric">Numeric calculation</option>
              </select>
            </div>
            <div>
              <label className="label text-xs">Difficulty</label>
              <select name="difficulty" defaultValue="moderate" className="field text-xs">
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d} className="capitalize">
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label text-xs">Topic</label>
              <input name="topic" required placeholder="e.g. Sepsis" className="field text-xs" />
            </div>
          </div>

          <div>
            <label className="label text-xs">Unit (blueprint category or section)</label>
            <input name="category" placeholder="e.g. Management of Care" className="field text-xs" />
          </div>
          <div>
            <label className="label text-xs">Scenario (optional)</label>
            <textarea name="scenario" rows={2} className="field text-xs" />
          </div>
          <div>
            <label className="label text-xs">Question</label>
            <textarea name="stem" required rows={2} className="field text-xs" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(["A", "B", "C", "D"] as const).map((L) => (
              <div key={L} className="space-y-1.5">
                <input name={`opt${L}`} placeholder={`Option ${L}`} className="field text-xs" />
                <input name={`exp${L}`} placeholder={`Why ${L} is right or wrong`} className="field text-xs" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="label text-xs">Correct option (a–d, or “a,c” for select-all)</label>
              <input name="correctKey" defaultValue="a" className="field text-xs font-mono" />
            </div>
            <div>
              <label className="label text-xs">Numeric answer (calculations only)</label>
              <input name="numericValue" type="number" step="0.1" className="field text-xs font-mono" />
            </div>
            <div>
              <label className="label text-xs">Unit of answer</label>
              <input name="numericUnit" placeholder="mL/hr" className="field text-xs" />
            </div>
          </div>

          <div>
            <label className="label text-xs">Rationale</label>
            <textarea name="rationale" required rows={3} placeholder="Why the answer is correct and the others are not." className="field text-xs" />
          </div>
          <button type="submit" className="btn btn-primary btn-sm">
            Save draft
          </button>
        </form>
      </details>

      <details className="panel panel-pad">
        <summary className="cursor-pointer select-none text-sm font-bold">Recent review decisions</summary>
        {recentReviews.length === 0 ? (
          <p className="mt-3 text-xs muted">No decisions yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border text-xs">
            {recentReviews.map((rv) => (
              <li key={rv.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <span>
                  <span className="font-mono font-semibold">{rv.code ?? "—"}</span>{" "}
                  <span className="muted">{STATUS_LABEL[rv.fromStatus ?? ""] ?? rv.fromStatus}</span> →{" "}
                  <strong>{STATUS_LABEL[rv.toStatus] ?? rv.toStatus}</strong>
                  {rv.comments && <span className="muted"> — {rv.comments}</span>}
                </span>
                <span className="muted">{rv.createdAt.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </details>
    </div>
  );
}
