"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Clock, Search } from "lucide-react";

export type SheetCard = { id: number; title: string; summary: string; category: string; topic: string; minutes: number };

export function CheatSheetBrowser({ examSlug, sheets, categories }: { examSlug: string; sheets: SheetCard[]; categories: { name: string; count: number }[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return sheets.filter(
      (s) => (!cat || s.category === cat) && (!needle || `${s.title} ${s.summary} ${s.topic} ${s.category}`.toLowerCase().includes(needle)),
    );
  }, [q, cat, sheets]);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <label className="relative block">
          <span className="sr-only">Search cheat sheets</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 faint" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by topic, e.g. potassium, delegation, insulin…"
            className="field pl-9"
          />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <Chip active={cat === ""} onClick={() => setCat("")}>
            All ({sheets.length})
          </Chip>
          {categories.map((c) => (
            <Chip key={c.name} active={cat === c.name} onClick={() => setCat(cat === c.name ? "" : c.name)}>
              {c.name} ({c.count})
            </Chip>
          ))}
        </div>
      </div>

      <p className="text-xs muted" aria-live="polite">
        {filtered.length} cheat sheet{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <div className="panel panel-pad text-sm muted">No cheat sheets match that search. Try a shorter word or clear the filter.</div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((s) => (
            <li key={s.id}>
              <Link href={`/exam/${examSlug}/cheat-sheets/${s.id}`} className="panel flex h-full flex-col gap-2 p-4 transition hover:border-accent/60">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-accent">{s.category}</span>
                <span className="text-base font-bold leading-snug">{s.title}</span>
                <span className="text-xs leading-relaxed muted">{s.summary}</span>
                <span className="mt-auto inline-flex items-center gap-1 pt-1 text-[11px] faint">
                  <Clock className="h-3 w-3" />
                  {s.minutes} min · {s.topic}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${active ? "border-accent bg-accent text-white" : "border-border bg-surface hover:bg-muted"}`}
    >
      {children}
    </button>
  );
}
