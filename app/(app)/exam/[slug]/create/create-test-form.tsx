"use client";

import { useState } from "react";
import { DIFFICULTIES, DIFFICULTY_LABELS, QUESTION_TYPE_LABELS, type QuestionType } from "@/lib/questions/types";
import { startCustomTestAction } from "../../../actions";

type TaxNode = {
  id: number;
  name: string;
  kind: string;
  weight?: number | null;
  parentId?: number | null;
};

const SIZE_PRESETS = [10, 25, 50, 75, 100, 150];
const FOCUS_TAGS = [
  { id: "priority", label: "Prioritization" },
  { id: "delegation", label: "Delegation & Assignment" },
  { id: "pharmacology", label: "Pharmacology" },
  { id: "calculation", label: "Dosage Calculations" },
  { id: "safety", label: "Patient Safety" },
  { id: "education", label: "Patient Education" },
  { id: "clinical_judgment", label: "NGN Clinical Judgment" },
];

export function CreateTestForm({
  examSlug,
  examName,
  questionTypes,
  supportsCases,
  categories,
  subjects,
  systems,
  topics,
  initialTopicId,
  initialSystemId,
}: {
  examSlug: string;
  examName: string;
  questionTypes: string[];
  supportsCases: boolean;
  categories: TaxNode[];
  subjects: TaxNode[];
  systems: TaxNode[];
  topics: TaxNode[];
  initialTopicId?: number;
  initialSystemId?: number;
}) {
  const [mode, setMode] = useState<"tutor" | "timed" | "exam">("tutor");
  const [pool, setPool] = useState<"all" | "unused" | "incorrect" | "marked" | "unanswered">("all");
  const [count, setCount] = useState<number>(25);
  const [topicFilter, setTopicFilter] = useState("");

  const filteredTopics = topics.filter((t) =>
    !topicFilter.trim() ? true : t.name.toLowerCase().includes(topicFilter.toLowerCase()),
  );

  return (
    <form action={startCustomTestAction} className="panel panel-pad space-y-6">
      <input type="hidden" name="examSlug" value={examSlug} />
      <input
        type="hidden"
        name="kind"
        value={
          initialTopicId
            ? "topic"
            : initialSystemId
              ? "system"
              : pool === "incorrect"
                ? "incorrect"
                : pool === "marked"
                  ? "marked"
                  : pool === "unanswered"
                    ? "unanswered"
                    : "custom"
        }
      />

      {/* Mode & Pool */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="label">1. Select Test Mode</div>
          <div className="grid grid-cols-3 gap-2.5">
            {(
              [
                ["tutor", "Tutor Mode", "Immediate answer feedback & full rationale after each item."],
                ["timed", "Timed Mode", "Countdown timer with auto-submit & pacing report."],
                ["exam", "Exam Mode", "No answers or rationales shown until test completion."],
              ] as const
            ).map(([val, title, desc]) => (
              <label
                key={val}
                className={`cursor-pointer rounded-xl border p-3 transition ${
                  mode === val ? "border-accent bg-accent-subtle" : "border-border hover:bg-muted/50"
                }`}
              >
                <input
                  type="radio"
                  name="mode"
                  value={val}
                  checked={mode === val}
                  onChange={() => setMode(val)}
                  className="sr-only"
                />
                <div className="text-xs font-bold">{title}</div>
                <div className="text-[11px] muted mt-1 leading-snug">{desc}</div>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="label">2. Question Pool</div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(
              [
                ["all", "All Questions"],
                ["unused", "Unused Only"],
                ["incorrect", "Incorrect"],
                ["marked", "Bookmarked"],
                ["unanswered", "Unanswered"],
              ] as const
            ).map(([val, label]) => (
              <label
                key={val}
                className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-xs font-semibold transition ${
                  pool === val ? "border-accent bg-accent-subtle text-accent" : "border-border hover:bg-muted/50"
                }`}
              >
                <input
                  type="radio"
                  name="pool"
                  value={val}
                  checked={pool === val}
                  onChange={() => setPool(val)}
                  className="sr-only"
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Categories & Subjects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-4 border-t border-border">
        {categories.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="label mb-0">3. Categories / Sections</span>
              <span className="text-[11px] muted">Leave unchecked for all</span>
            </div>
            <div className="max-h-56 overflow-y-auto rounded-xl border border-border p-3 space-y-1.5">
              {categories.map((c) => (
                <label key={c.id} className="flex items-center justify-between gap-2 text-xs cursor-pointer py-0.5">
                  <span className="flex items-center gap-2">
                    <input type="checkbox" name="categoryIds" value={c.id} className="rounded" />
                    <span>{c.name}</span>
                  </span>
                  {c.weight ? <span className="text-[10px] muted">{c.weight}%</span> : null}
                </label>
              ))}
            </div>
          </div>
        )}

        {subjects.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="label mb-0">4. Nursing / Exam Subjects</span>
              <span className="text-[11px] muted">All if none selected</span>
            </div>
            <div className="max-h-56 overflow-y-auto rounded-xl border border-border p-3 space-y-1.5">
              {subjects.map((s) => (
                <label key={s.id} className="flex items-center gap-2 text-xs cursor-pointer py-0.5">
                  <input type="checkbox" name="subjectIds" value={s.id} className="rounded" />
                  <span>{s.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {systems.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="label mb-0">5. Body Systems</span>
              <span className="text-[11px] muted">System-wise filter</span>
            </div>
            <div className="max-h-56 overflow-y-auto rounded-xl border border-border p-3 space-y-1.5">
              {systems.map((sys) => (
                <label key={sys.id} className="flex items-center gap-2 text-xs cursor-pointer py-0.5">
                  <input
                    type="checkbox"
                    name="systemIds"
                    value={sys.id}
                    defaultChecked={initialSystemId === sys.id}
                    className="rounded"
                  />
                  <span>{sys.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Topics */}
      {topics.length > 0 && (
        <div className="space-y-2 pt-4 border-t border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="label mb-0">6. Specific Topics ({topics.length} available)</span>
            <input
              type="search"
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              placeholder="Filter topics (e.g., Prioritization, Insulin, Sepsis)…"
              className="field max-w-xs py-1.5 text-xs"
            />
          </div>
          <div className="max-h-48 overflow-y-auto rounded-xl border border-border p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5">
            {filteredTopics.slice(0, 140).map((t) => (
              <label key={t.id} className="flex items-center gap-2 text-xs cursor-pointer truncate py-0.5">
                <input
                  type="checkbox"
                  name="topicIds"
                  value={t.id}
                  defaultChecked={initialTopicId === t.id}
                  className="rounded shrink-0"
                />
                <span className="truncate" title={t.name}>
                  {t.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Question Formats, Difficulty & Focus Tags */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-4 border-t border-border">
        <div className="space-y-2">
          <div className="label">7. Question Formats (NGN &amp; Classic)</div>
          <div className="flex flex-wrap gap-1.5">
            {questionTypes.map((qt) => (
              <label
                key={qt}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs cursor-pointer hover:bg-muted/50"
              >
                <input type="checkbox" name="types" value={qt} className="rounded" />
                <span>{QUESTION_TYPE_LABELS[qt as QuestionType] ?? qt}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="label">8. Difficulty Level</div>
          <div className="flex flex-wrap gap-1.5">
            {DIFFICULTIES.map((d) => (
              <label
                key={d}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs cursor-pointer hover:bg-muted/50"
              >
                <input type="checkbox" name="difficulties" value={d} className="rounded" />
                <span>{DIFFICULTY_LABELS[d]}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="label">9. Clinical Focus Tags</div>
          <div className="flex flex-wrap gap-1.5">
            {FOCUS_TAGS.map((tag) => (
              <label
                key={tag.id}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs cursor-pointer hover:bg-muted/50"
              >
                <input type="checkbox" name="tags" value={tag.id} className="rounded" />
                <span>{tag.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Test Size, Timer, Options */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-4 border-t border-border items-end">
        <div className="space-y-2">
          <label htmlFor="question-count" className="label">
            10. Number of Questions (Presets: 10 / 25 / 50 / 75 / 100 / 150)
          </label>
          <div className="flex flex-wrap items-center gap-1.5">
            {SIZE_PRESETS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCount(n)}
                className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                  count === n ? "border-accent bg-accent text-white" : "border-border hover:bg-muted"
                }`}
              >
                {n}
              </button>
            ))}
            <input
              id="question-count"
              name="count"
              type="number"
              min={1}
              max={250}
              value={count}
              onChange={(e) => setCount(Number(e.target.value) || 10)}
              className="field w-20 py-1.5 text-xs font-bold text-center"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="custom-test-name" className="label">
            Test Title (optional)
          </label>
          <input
            id="custom-test-name"
            name="name"
            type="text"
            placeholder={`${examName} Custom Practice`}
            className="field py-2 text-xs"
          />
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap gap-4 text-xs">
            {supportsCases && (
              <label className="inline-flex items-center gap-2 cursor-pointer font-medium">
                <input type="checkbox" name="includeCases" defaultChecked className="rounded" />
                <span>Include 6-step NGN Case Studies</span>
              </label>
            )}
            <label className="inline-flex items-center gap-2 cursor-pointer font-medium">
              <input type="checkbox" name="randomizeOptions" value="true" defaultChecked className="rounded" />
              <span>Randomize questions &amp; options</span>
            </label>
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Generate &amp; Start {count}-Question Test
          </button>
        </div>
      </div>
    </form>
  );
}
