"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Flag, Printer, Search, XCircle } from "lucide-react";
import { QUESTION_TYPE_LABELS, type QuestionType } from "@/lib/questions/types";
import { MarkdownText } from "@/components/markdown-text";

type ReviewRow = {
  position: number;
  questionId: number;
  code: string;
  stem: string;
  type: QuestionType;
  difficulty: string;
  category: string;
  topic: string;
  isCorrect: boolean | null;
  answered: boolean;
  marked: boolean;
  score: number;
  maxScore: number;
  timeSpentSec: number;
  rationale: string;
};

export function ResultsReviewClient({ testId, items }: { testId: number; items: ReviewRow[] }) {
  const [filter, setFilter] = useState<"all" | "incorrect" | "correct" | "unanswered" | "marked">("all");
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = items.filter((it) => {
    if (filter === "incorrect" && (it.isCorrect !== false || !it.answered)) return false;
    if (filter === "correct" && it.isCorrect !== true) return false;
    if (filter === "unanswered" && it.answered) return false;
    if (filter === "marked" && !it.marked) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return `${it.code} ${it.stem} ${it.category} ${it.topic}`.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <section className="panel panel-pad space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="h-section">Item-by-Item Review &amp; Rationale Inspector</h2>
          <p className="text-xs muted">Filter by outcome or click any question to expand its full clinical rationale.</p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="no-print btn btn-secondary btn-sm"
        >
          <Printer className="h-3.5 w-3.5" />
          Download / Print Report (PDF)
        </button>
      </div>

      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ["all", `All (${items.length})`],
              ["incorrect", `Incorrect (${items.filter((x) => x.answered && x.isCorrect === false).length})`],
              ["correct", `Correct (${items.filter((x) => x.isCorrect === true).length})`],
              ["unanswered", `Unanswered (${items.filter((x) => !x.answered).length})`],
              ["marked", `Marked (${items.filter((x) => x.marked).length})`],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k)}
              className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                filter === k ? "border-accent bg-accent text-white" : "border-border hover:bg-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stem, topic, or ID…"
            className="field pl-8 py-1.5 text-xs"
          />
        </div>
      </div>

      <div className="table-wrapper" tabIndex={0} role="region" aria-label="Test item review list">
        <table className="table text-xs">
          <thead>
            <tr>
              <th>#</th>
              <th>Status</th>
              <th>Question &amp; Topic</th>
              <th>Format</th>
              <th>Points</th>
              <th>Time</th>
              <th className="no-print">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((it) => {
              const isExpanded = expandedId === it.questionId;
              return (
                <tr key={it.questionId}>
                  <th className="font-mono text-left">{it.position}</th>
                  <td>
                    {!it.answered ? (
                      <span className="chip text-[11px] muted">Unanswered</span>
                    ) : it.isCorrect ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" />
                        Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2 py-0.5 text-[11px] font-bold text-rose-700 dark:text-rose-300">
                        <XCircle className="h-3 w-3" />
                        Incorrect
                      </span>
                    )}
                    {it.marked && <Flag className="inline ml-1.5 h-3 w-3 text-amber-500" />}
                  </td>
                  <td className="max-w-md">
                    <div className="font-semibold line-clamp-2">{it.stem}</div>
                    <div className="text-[11px] muted mt-0.5">
                      {it.code} · {it.category}
                      {it.topic ? ` › ${it.topic}` : ""} · {it.difficulty}
                    </div>
                    {isExpanded && (
                      <div className="mt-2 rounded-xl border border-accent/25 bg-accent-subtle/40 p-3 text-xs leading-relaxed">
                        <div className="font-bold text-accent mb-1">Clinical Rationale:</div>
                        <MarkdownText text={it.rationale} />
                      </div>
                    )}
                  </td>
                  <td>{QUESTION_TYPE_LABELS[it.type] ?? it.type}</td>
                  <td className="font-mono">
                    {it.score}/{it.maxScore}
                  </td>
                  <td className="font-mono">{it.timeSpentSec}s</td>
                  <td className="no-print">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : it.questionId)}
                        className="btn btn-secondary btn-sm"
                      >
                        {isExpanded ? "Hide" : "Rationale"}
                      </button>
                      <Link href={`/test/${testId}`} className="btn btn-secondary btn-sm">
                        Open
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
