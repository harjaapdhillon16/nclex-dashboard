"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { Search } from "lucide-react";

export type ImageCard = { id: number; title: string; summary: string; category: string; tags: string[]; thumb: ReactNode };

export function ImageBrowser({ examSlug, items, categories }: { examSlug: string; items: ImageCard[]; categories: { name: string; count: number }[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((i) => (!cat || i.category === cat) && (!needle || `${i.title} ${i.summary} ${i.tags.join(" ")} ${i.category}`.toLowerCase().includes(needle)));
  }, [q, cat, items]);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <label className="relative block">
          <span className="sr-only">Search medical images</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 faint" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search, e.g. atrial fibrillation, seizure, late decelerations…" className="field pl-9" />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <Chip active={cat === ""} onClick={() => setCat("")}>
            All ({items.length})
          </Chip>
          {categories.map((c) => (
            <Chip key={c.name} active={cat === c.name} onClick={() => setCat(cat === c.name ? "" : c.name)}>
              {c.name} ({c.count})
            </Chip>
          ))}
        </div>
      </div>

      <p className="text-xs muted" aria-live="polite">
        {filtered.length} image{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <div className="panel panel-pad text-sm muted">No images match that search. Try a shorter word or clear the filter.</div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((i) => (
            <li key={i.id}>
              <Link href={`/exam/${examSlug}/images/${i.id}`} className="panel flex h-full flex-col overflow-hidden transition hover:border-accent/60">
                <div className="flex aspect-[3/2] items-center justify-center overflow-hidden border-b border-border bg-white [&>svg]:h-full! [&>svg]:w-full!">{i.thumb}</div>
                <div className="flex flex-1 flex-col gap-1.5 p-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-accent">{i.category}</span>
                  <span className="text-base font-bold leading-snug">{i.title}</span>
                  <span className="text-xs leading-relaxed muted">{i.summary}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
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
