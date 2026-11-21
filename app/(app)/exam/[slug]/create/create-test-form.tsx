"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Play } from "lucide-react";
import { DIFFICULTIES, DIFFICULTY_LABELS, QUESTION_TYPE_LABELS, type QuestionType } from "@/lib/questions/types";
import { startCustomTestAction } from "../../../actions";

type Counts = { all: number; unused: number; incorrect: number; marked: number };
type PoolKey = keyof Counts;
type Mode = "tutor" | "timed" | "exam";

const MODES: { id: Mode; title: string; sub: string }[] = [
  { id: "tutor", title: "Tutor", sub: "See the answer and why after every question." },
  { id: "timed", title: "Timed", sub: "A countdown timer. Answers appear at the end." },
  { id: "exam", title: "Exam", sub: "Like test day: no feedback until you finish." },
];

const POOLS: { id: PoolKey; title: string; sub: string }[] = [
  { id: "all", title: "All questions", sub: "Everything in the selected units" },
  { id: "unused", title: "Unused", sub: "Never answered before" },
  { id: "incorrect", title: "Incorrect", sub: "Your last answer was wrong" },
  { id: "marked", title: "Marked", sub: "Flagged or bookmarked" },
];

export function CreateTestForm({
  examSlug,
  questionTypes,
  supportsCases,
  supportsAdaptive,
  unitField,
  unitLabel,
  units,
  totals,
  systems,
  subjects,
  initialTopicId,
  initialSystemId,
}: {
  examSlug: string;
  questionTypes: string[];
  supportsCases: boolean;
  supportsAdaptive: boolean;
  unitField: string;
  unitLabel: string;
  units: { id: number; name: string; weight?: number | null; counts: Counts }[];
  totals: Counts;
  systems: { id: number; name: string }[];
  subjects: { id: number; name: string }[];
  initialTopicId?: number;
  initialSystemId?: number;
}) {
  const [mode, setMode] = useState<Mode>("tutor");
  const [pool, setPool] = useState<PoolKey>("all");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [wanted, setWanted] = useState(20);
  const [adaptive, setAdaptive] = useState(false);
  const [timeLimit, setTimeLimit] = useState("");
  const [filtersUsed, setFiltersUsed] = useState(false);

  const allSelected = selected.size === 0; // nothing ticked means "every unit"

  // Live counts: for each pool, how many questions the current unit selection offers.
  const poolCounts: Counts = useMemo(() => {
    if (allSelected) return totals;
    return units
      .filter((u) => selected.has(u.id))
      .reduce<Counts>(
        (acc, u) => ({
          all: acc.all + u.counts.all,
          unused: acc.unused + u.counts.unused,
          incorrect: acc.incorrect + u.counts.incorrect,
          marked: acc.marked + u.counts.marked,
        }),
        { all: 0, unused: 0, incorrect: 0, marked: 0 },
      );
  }, [allSelected, selected, totals, units]);

  const available = poolCounts[pool];
  const maxCount = Math.max(1, Math.min(250, available));
  const count = Math.max(1, Math.min(wanted, maxCount));
  const suggestedMinutes = Math.ceil(count * 1.5);
  const canStart = available > 0;

  function toggle(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const kind = adaptive
    ? "mock"
    : initialTopicId
      ? "topic"
      : initialSystemId
        ? "system"
        : pool === "incorrect"
          ? "incorrect"
          : pool === "marked"
            ? "marked"
            : "custom";

  return (
    <form action={startCustomTestAction} className="space-y-5">
      <input type="hidden" name="examSlug" value={examSlug} />
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="mode" value={adaptive ? "exam" : mode} />
      <input type="hidden" name="pool" value={pool} />
      <input type="hidden" name="count" value={adaptive ? 85 : count} />
      <input type="hidden" name="randomizeOptions" value="true" />
      {adaptive && <input type="hidden" name="adaptive" value="true" />}
      {initialTopicId && <input type="hidden" name="topicIds" value={initialTopicId} />}
      {initialSystemId && <input type="hidden" name="systemIds" value={initialSystemId} />}
      {mode === "timed" && !adaptive && timeLimit && <input type="hidden" name="timeLimitMin" value={timeLimit} />}

      {/* 1. Mode */}
      <fieldset className="panel panel-pad space-y-3">
        <legend className="sr-only">Test mode</legend>
        <StepLabel n={1} title="Mode" />
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3" role="radiogroup" aria-label="Test mode">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={mode === m.id}
              onClick={() => setMode(m.id)}
              className={`rounded-xl border p-3 text-left transition ${
                mode === m.id ? "border-accent bg-accent-subtle" : "border-border hover:bg-muted/50"
              }`}
            >
              <div className="text-sm font-bold">{m.title}</div>
              <div className="mt-0.5 text-xs muted">{m.sub}</div>
            </button>
          ))}
        </div>
      </fieldset>

      {/* 2. Pool */}
      <fieldset className="panel panel-pad space-y-3">
        <legend className="sr-only">Question pool</legend>
        <StepLabel n={2} title="Questions to draw from" />
        <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4" role="radiogroup" aria-label="Question pool">
          {POOLS.map((p) => {
            const n = poolCounts[p.id];
            const on = pool === p.id;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={on}
                disabled={n === 0 && !on}
                onClick={() => setPool(p.id)}
                className={`rounded-xl border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-45 ${
                  on ? "border-accent bg-accent-subtle" : "border-border enabled:hover:bg-muted/50"
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-bold">{p.title}</span>
                  <span className="text-lg font-bold tabular-nums text-accent">{n}</span>
                </div>
                <div className="mt-0.5 text-xs muted">{p.sub}</div>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* 3. Units */}
      <fieldset className="panel panel-pad space-y-3">
        <legend className="sr-only">{unitLabel}</legend>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <StepLabel n={3} title={unitLabel} />
          <div className="flex items-center gap-3 text-xs">
            <span className="muted">{allSelected ? "All included" : `${selected.size} of ${units.length} selected`}</span>
            <button type="button" className="font-semibold text-accent hover:underline" onClick={() => setSelected(new Set(units.map((u) => u.id)))}>
              Select all
            </button>
            <button type="button" className="font-semibold text-accent hover:underline" onClick={() => setSelected(new Set())}>
              Clear
            </button>
          </div>
        </div>
        {units.length === 0 ? (
          <p className="text-xs muted">This course isn&apos;t split into units yet. Your test will draw from every question.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-1.5 md:grid-cols-2">
            {units.map((u) => {
              const on = selected.has(u.id);
              const n = u.counts[pool];
              return (
                <li key={u.id}>
                  <label
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm transition ${
                      on ? "border-accent bg-accent-subtle" : "border-border hover:bg-muted/50"
                    } ${n === 0 ? "opacity-60" : ""}`}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <input
                        type="checkbox"
                        name={unitField}
                        value={u.id}
                        checked={on}
                        onChange={() => toggle(u.id)}
                        className="rounded"
                      />
                      <span className="truncate font-medium">{u.name}</span>
                    </span>
                    <span className="shrink-0 text-xs tabular-nums muted">{n}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
        <p className="text-[11px] muted">Tick nothing to include every unit. Numbers show questions available in the chosen pool.</p>
      </fieldset>

      {/* 4. How many */}
      <div className="panel panel-pad space-y-3">
        <StepLabel n={4} title="How many questions" />
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={maxCount}
            value={count}
            disabled={adaptive}
            onChange={(e) => setWanted(Number(e.target.value) || 1)}
            aria-label="Number of questions"
            className="field w-24"
          />
          <span className="text-xs muted">
            {adaptive ? "Adaptive tests choose their own length." : `of ${available} available${filtersUsed ? " (before extra filters)" : ""}`}
          </span>
          <div className="flex gap-1.5">
            {[10, 20, 40].map((n) => (
              <button
                key={n}
                type="button"
                disabled={adaptive || n > maxCount}
                onClick={() => setWanted(n)}
                className="btn btn-secondary btn-sm disabled:opacity-40"
              >
                {n}
              </button>
            ))}
            <button type="button" disabled={adaptive} onClick={() => setWanted(maxCount)} className="btn btn-secondary btn-sm disabled:opacity-40">
              Max
            </button>
          </div>
        </div>
        {mode === "timed" && !adaptive && (
          <label className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold">Time limit (minutes)</span>
            <input
              type="number"
              min={1}
              max={600}
              value={timeLimit}
              placeholder={String(suggestedMinutes)}
              onChange={(e) => setTimeLimit(e.target.value)}
              className="field w-24"
            />
            <span className="muted">Leave blank for {suggestedMinutes} min (90 seconds each).</span>
          </label>
        )}
      </div>

      {/* More filters */}
      <details
        className="panel group overflow-hidden"
        onToggle={(e) => {
          if (!(e.currentTarget as HTMLDetailsElement).open) return;
          setFiltersUsed(true);
        }}
      >
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold select-none hover:bg-muted/40">
          More filters
          <ChevronDown className="h-4 w-4 muted transition-transform group-open:rotate-180" />
        </summary>
        <div className="space-y-5 border-t border-border p-4 text-xs">
          <CheckGroup title="Difficulty" name="difficulties" options={DIFFICULTIES.map((d) => ({ value: d, label: DIFFICULTY_LABELS[d] }))} />
          <CheckGroup
            title="Question format"
            name="types"
            options={questionTypes.map((qt) => ({ value: qt, label: QUESTION_TYPE_LABELS[qt as QuestionType] ?? qt }))}
          />
          {subjects.length > 0 && <CheckGroup title="Subject" name="subjectIds" options={subjects.map((s) => ({ value: String(s.id), label: s.name }))} />}
          {systems.length > 0 && <CheckGroup title="Body system" name="systemIds" options={systems.map((s) => ({ value: String(s.id), label: s.name }))} />}
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {supportsCases && (
              <label className="flex items-center gap-2">
                <input type="checkbox" name="includeCases" defaultChecked className="rounded" />
                Include case studies
              </label>
            )}
            {supportsAdaptive && (
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={adaptive} onChange={(e) => setAdaptive(e.target.checked)} className="rounded" />
                Adaptive (CAT) simulation — difficulty adjusts to you
              </label>
            )}
          </div>
        </div>
      </details>

      {/* Start */}
      <div className="sticky bottom-3 z-10">
        <button type="submit" disabled={!canStart} className="btn btn-primary w-full py-3 text-base shadow-lg disabled:opacity-50">
          <Play className="h-4 w-4 fill-current" />
          {canStart
            ? adaptive
              ? "Start adaptive test"
              : `Start ${mode} test · ${count} question${count === 1 ? "" : "s"}`
            : "No questions match this selection"}
        </button>
      </div>
    </form>
  );
}

function StepLabel({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">{n}</span>
      <h2 className="text-sm font-bold">{title}</h2>
    </div>
  );
}

function CheckGroup({ title, name, options }: { title: string; name: string; options: { value: string; label: string }[] }) {
  if (options.length === 0) return null;
  return (
    <div className="space-y-2">
      <div className="font-semibold">{title}</div>
      <div className="flex flex-wrap gap-x-5 gap-y-1.5">
        {options.map((o) => (
          <label key={o.value} className="flex items-center gap-2">
            <input type="checkbox" name={name} value={o.value} className="rounded" />
            {o.label}
          </label>
        ))}
      </div>
    </div>
  );
}
