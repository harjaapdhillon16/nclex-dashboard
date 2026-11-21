"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, CheckCircle2, HelpCircle, NotebookPen, Search, XCircle } from "lucide-react";
import { DIFFICULTY_LABELS, QUESTION_TYPE_LABELS, type Difficulty, type QuestionType } from "@/lib/questions/types";
import { MarkdownText } from "@/components/markdown-text";

type BankRow = {
  id: number;
  code: string;
  stem: string;
  type: QuestionType;
  difficulty: string;
  category: string;
  subject: string;
  system: string;
  topic: string;
  topicId: number | null;
  clinicalConcept: string;
  isCaseStudy: boolean;
  isNgn: boolean;
  tags: string[];
  attempted: boolean;
  isCorrect: boolean | null;
  marked: boolean;
  bookmarked: boolean;
  note: string;
  rationale: string;
  keyTakeaway: string;
  strategy: string;
};

export function ReviewBankClient({ examSlug, items }: { examSlug: string; items: BankRow[] }) {
  const [rows, setRows] = useState<BankRow[]>(items);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "attempted" | "unanswered" | "correct" | "incorrect" | "marked">("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [systemFilter, setSystemFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [diffFilter, setDiffFilter] = useState("");
  const [ngnOnly, setNgnOnly] = useState(false);
  const [caseOnly, setCaseOnly] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  const categories = [...new Set(rows.map((r) => r.category).filter(Boolean))].sort();
  const subjects = [...new Set(rows.map((r) => r.subject).filter(Boolean))].sort();
  const systems = [...new Set(rows.map((r) => r.system).filter(Boolean))].sort();
  const types = [...new Set(rows.map((r) => r.type))].sort();

  const filtered = rows.filter((r) => {
    if (statusFilter === "attempted" && !r.attempted) return false;
    if (statusFilter === "unanswered" && r.attempted) return false;
    if (statusFilter === "correct" && r.isCorrect !== true) return false;
    if (statusFilter === "incorrect" && (!r.attempted || r.isCorrect !== false)) return false;
    if (statusFilter === "marked" && !r.marked) return false;
    if (categoryFilter && r.category !== categoryFilter) return false;
    if (subjectFilter && r.subject !== subjectFilter) return false;
    if (systemFilter && r.system !== systemFilter) return false;
    if (typeFilter && r.type !== typeFilter) return false;
    if (diffFilter && r.difficulty !== diffFilter) return false;
    if (ngnOnly && !r.isNgn) return false;
    if (caseOnly && !r.isCaseStudy) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      const hay = `${r.code} ${r.stem} ${r.topic} ${r.category} ${r.subject} ${r.system} ${r.clinicalConcept} ${r.note}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  async function toggleBookmark(id: number) {
    const res = await fetch("/api/tests/tools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "bookmark", questionId: id }),
    });
    const data = (await res.json()) as { bookmarked?: boolean };
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, bookmarked: !!data.bookmarked, marked: !!data.bookmarked || r.marked } : r)),
    );
  }

  async function saveNote(id: number) {
    await fetch("/api/tests/tools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "note", questionId: id, body: noteDraft }),
    });
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, note: noteDraft } : r)));
    setEditingNoteId(null);
  }

  return (
    <div className="space-y-4">
      {/* Multi-axis Search & Filter Panel */}
      <div className="panel panel-pad space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 faint" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by keyword, question ID, topic, clinical concept, or personal note…"
              className="field pl-10 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <label className="inline-flex items-center gap-1.5 cursor-pointer font-medium">
              <input type="checkbox" checked={ngnOnly} onChange={(e) => setNgnOnly(e.target.checked)} className="rounded" />
              <span>NGN Formats Only</span>
            </label>
            <label className="inline-flex items-center gap-1.5 cursor-pointer font-medium">
              <input type="checkbox" checked={caseOnly} onChange={(e) => setCaseOnly(e.target.checked)} className="rounded" />
              <span>Case Studies Only</span>
            </label>
          </div>
        </div>

        {/* Status pills */}
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ["all", `All Questions (${rows.length})`],
              ["attempted", `Completed (${rows.filter((x) => x.attempted).length})`],
              ["incorrect", `Incorrect (${rows.filter((x) => x.attempted && x.isCorrect === false).length})`],
              ["correct", `Correct (${rows.filter((x) => x.isCorrect === true).length})`],
              ["unanswered", `Unanswered (${rows.filter((x) => !x.attempted).length})`],
              ["marked", `Bookmarked / Marked (${rows.filter((x) => x.marked).length})`],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setStatusFilter(k)}
              className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === k ? "border-accent bg-accent text-white" : "border-border hover:bg-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Taxonomy & format dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="field py-1.5 text-xs">
            <option value="">All Categories / Sections</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="field py-1.5 text-xs">
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select value={systemFilter} onChange={(e) => setSystemFilter(e.target.value)} className="field py-1.5 text-xs">
            <option value="">All Body Systems</option>
            {systems.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="field py-1.5 text-xs">
            <option value="">All Question Types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {QUESTION_TYPE_LABELS[t] ?? t}
              </option>
            ))}
          </select>

          <select value={diffFilter} onChange={(e) => setDiffFilter(e.target.value)} className="field py-1.5 text-xs">
            <option value="">All Difficulties</option>
            {Object.entries(DIFFICULTY_LABELS).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filtered Results */}
      <div className="panel panel-pad space-y-3">
        <div className="flex items-center justify-between text-xs muted">
          <span>
            Showing <strong>{filtered.length}</strong> of {rows.length} questions
          </span>
          <Link href={`/exam/${examSlug}/create`} className="font-semibold text-accent hover:underline">
            Build Custom Test from Filters →
          </Link>
        </div>

        <div className="divide-y divide-border">
          {filtered.slice(0, 80).map((r) => {
            const expanded = expandedId === r.id;
            const editingNote = editingNoteId === r.id;
            return (
              <div key={r.id} className="py-4 space-y-2.5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-mono font-bold text-accent">{r.code}</span>
                    <span className="chip">{QUESTION_TYPE_LABELS[r.type] ?? r.type}</span>
                    <span className="chip">{DIFFICULTY_LABELS[r.difficulty as Difficulty] ?? r.difficulty}</span>
                    {r.category && <span className="chip bg-muted/60">{r.category}</span>}
                    {r.topic && <span className="chip bg-accent-subtle text-accent">{r.topic}</span>}
                    {r.isCaseStudy && <span className="chip border-amber-500/40 text-amber-600">NGN Case</span>}
                  </div>

                  <div className="flex items-center gap-2">
                    {r.attempted ? (
                      r.isCorrect ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-bold text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Correct
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2.5 py-0.5 font-bold text-rose-700 dark:text-rose-300">
                          <XCircle className="h-3.5 w-3.5" />
                          Incorrect
                        </span>
                      )
                    ) : (
                      <span className="chip muted">Unused</span>
                    )}

                    <button
                      type="button"
                      onClick={() => void toggleBookmark(r.id)}
                      className={`btn btn-sm ${r.bookmarked ? "bg-accent text-white" : "btn-secondary"}`}
                    >
                      <Bookmark className="h-3.5 w-3.5" />
                      {r.bookmarked ? "Saved" : "Save"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : r.id)}
                      className="btn btn-secondary btn-sm"
                    >
                      {expanded ? "Hide Study Guide" : "Study Rationale"}
                    </button>
                  </div>
                </div>

                <p className="text-sm font-medium leading-relaxed">{r.stem}</p>

                {r.note && !editingNote && (
                  <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-2.5 text-xs">
                    <span className="font-bold text-amber-700 dark:text-amber-300">My Note: </span>
                    <span>{r.note}</span>
                  </div>
                )}

                {expanded && (
                  <div className="rounded-xl border border-accent/25 bg-accent-subtle/40 p-4 space-y-2.5 text-xs leading-relaxed">
                    <div>
                      <div className="font-bold text-accent">Detailed Clinical Rationale:</div>
                      <MarkdownText text={r.rationale} />
                    </div>
                    {r.keyTakeaway && (
                      <div>
                        <span className="font-bold text-accent">Key Takeaway: </span>
                        <span>{r.keyTakeaway}</span>
                      </div>
                    )}
                    {r.strategy && (
                      <div>
                        <span className="font-bold">Test-Taking Strategy: </span>
                        <span>{r.strategy}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingNoteId(r.id);
                          setNoteDraft(r.note);
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        <NotebookPen className="h-3.5 w-3.5" />
                        {r.note ? "Edit Note" : "Add Personal Note"}
                      </button>

                      <Link
                        href={`/exam/${examSlug}/create${r.topicId ? `?topicId=${r.topicId}` : ""}`}
                        className="btn btn-primary btn-sm"
                      >
                        <HelpCircle className="h-3.5 w-3.5" />
                        Practice Similar Topic Questions
                      </Link>
                    </div>
                  </div>
                )}

                {editingNote && (
                  <div className="rounded-xl border border-border bg-surface p-3 space-y-2">
                    <textarea
                      rows={3}
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      placeholder="Add your personal study note for this question…"
                      className="field text-xs"
                    />
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setEditingNoteId(null)} className="btn btn-secondary btn-sm">
                        Cancel
                      </button>
                      <button type="button" onClick={() => void saveNote(r.id)} className="btn btn-primary btn-sm">
                        Save Note
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
