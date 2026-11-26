"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bookmark,
  Calculator,
  CheckCircle2,
  Clock,
  Compass,
  Eye,
  EyeOff,
  Flag,
  FlaskConical,
  Grid,
  HelpCircle,
  Lightbulb,
  LogOut,
  Mic,
  NotebookPen,
  Play,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Tag,
  X,
  XCircle,
} from "lucide-react";
import type { ClientCase, ClientQuestion, Reveal } from "@/lib/tests";
import {
  DIFFICULTY_LABELS,
  NCJMM_LABELS,
  QUESTION_TYPE_LABELS,
  type BowtieAnswer,
  type BowtieContent,
  type ClozeAnswer,
  type ClozeContent,
  type Difficulty,
  type Exhibit,
  type HighlightAnswer,
  type HighlightContent,
  type MatrixAnswer,
  type MatrixContent,
  type McqAnswer,
  type McqContent,
  type NcjmmStep,
  type NumericAnswer,
  type NumericContent,
  type OrderedAnswer,
  type OrderedContent,
  type PatientInfo,
  type QuestionExtras,
  type QuestionResponse,
  type SataAnswer,
  type SataContent,
  type SpeakingContent,
  type TrendAnswer,
  type TrendContent,
  type WritingContent,
} from "@/lib/questions/types";
import type { ProductiveFeedback } from "@/lib/ai";
import { MarkdownText, renderInlineMarkdown } from "@/components/markdown-text";

type RunnerItem = {
  position: number;
  question: ClientQuestion;
  response: QuestionResponse | null;
  submitted: boolean;
  marked: boolean;
  timeSpentSec: number;
  bookmarked: boolean;
  note: string;
  reveal: Reveal | null;
};

type ConfidenceFlag = "learning" | "reviewing" | "mastered";

const CONFIDENCE_FLAGS: { key: ConfidenceFlag; label: string; idle: string; active: string }[] = [
  { key: "learning", label: "Learning", idle: "bg-[#e8856f]/25 text-[#ffd9d1]", active: "bg-[#e8856f] text-white" },
  { key: "reviewing", label: "Reviewing", idle: "bg-[#f1c84b]/25 text-[#fff1bf]", active: "bg-[#f1c84b] text-[#3b2f00]" },
  { key: "mastered", label: "Mastered", idle: "bg-[#59b86f]/25 text-[#d4f5dc]", active: "bg-[#59b86f] text-white" },
];

type LabRow = {
  id: number;
  grp: string;
  name: string;
  range: string;
  unit: string;
  note: string | null;
};

export function TestRunnerClient({
  initialTest,
  exam,
  initialItems,
  initialCases,
  labs,
}: {
  initialTest: {
    id: number;
    name: string;
    kind: string;
    mode: "tutor" | "timed" | "exam";
    status: string;
    timeLimitSec: number | null;
    elapsedSec: number;
    currentIndex: number;
    adaptive: boolean;
  };
  exam: {
    id: number;
    slug: string;
    name: string;
    shortName: string;
    features: Record<string, boolean>;
  };
  initialItems: RunnerItem[];
  initialCases: Record<number, ClientCase>;
  labs: LabRow[];
}) {
  const router = useRouter();
  const [items, setItems] = useState<RunnerItem[]>(initialItems);
  const [cases, setCases] = useState<Record<number, ClientCase>>(initialCases);
  const [idx, setIdx] = useState<number>(Math.min(initialTest.currentIndex, Math.max(0, initialItems.length - 1)));
  const [elapsedSec, setElapsedSec] = useState<number>(initialTest.elapsedSec);
  const [qTimerSec, setQTimerSec] = useState<number>(initialItems[idx]?.timeSpentSec ?? 0);
  const [hideTimer, setHideTimer] = useState(false);
  const [busy, setBusy] = useState(false);
  const [caseTab, setCaseTab] = useState<string>("");
  const [noteDraft, setNoteDraft] = useState<string>(initialItems[idx]?.note ?? "");
  const [noteSavedMsg, setNoteSavedMsg] = useState(false);
  const [reportReason, setReportReason] = useState("Clinical / answer accuracy");
  const [reportBody, setReportBody] = useState("");
  const [reportSent, setReportSent] = useState(false);
  const [calcExpr, setCalcExpr] = useState("");
  const [calcResult, setCalcResult] = useState("0");
  const [labSearch, setLabSearch] = useState("");
  const [speakTimer, setSpeakTimer] = useState<number | null>(null);
  const [isRecordingSim, setIsRecordingSim] = useState(false);
  /** Self-rated confidence per item (Learning / Reviewing / Mastered). Kept on this device only. */
  const [confidence, setConfidence] = useState<Record<number, ConfidenceFlag>>({});
  const confidenceKey = `qx-confidence-${initialTest.id}`;
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(confidenceKey);
      if (raw) setConfidence(JSON.parse(raw) as Record<number, ConfidenceFlag>);
    } catch {
      /* storage unavailable: flags simply start empty */
    }
  }, [confidenceKey]);
  function setConfidenceFlag(position: number, flag: ConfidenceFlag) {
    setConfidence((prev) => {
      const next = { ...prev };
      if (next[position] === flag) delete next[position];
      else next[position] = flag;
      try {
        window.localStorage.setItem(confidenceKey, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  const calcDialogRef = useRef<HTMLDialogElement>(null);
  const labDialogRef = useRef<HTMLDialogElement>(null);
  const navDialogRef = useRef<HTMLDialogElement>(null);
  const confirmDialogRef = useRef<HTMLDialogElement>(null);
  const reportDialogRef = useRef<HTMLDialogElement>(null);
  const noteDialogRef = useRef<HTMLDialogElement>(null);

  const isCompleted = initialTest.status === "completed";
  const current = items[idx]!;
  const q = current.question;
  const activeCase = q.caseStudyId ? cases[q.caseStudyId] : null;
  const isLocked = isCompleted || (initialTest.mode === "tutor" && current.submitted) || (initialTest.adaptive && current.submitted);

  // Set default case tab or Ordered response initial order when switching questions
  useEffect(() => {
    setQTimerSec(items[idx]?.timeSpentSec ?? 0);
    setNoteDraft(items[idx]?.note ?? "");
    setNoteSavedMsg(false);
    setReportSent(false);
    setSpeakTimer(null);
    setIsRecordingSim(false);
    if (activeCase?.sections.length) {
      setCaseTab(activeCase.sections[activeCase.sections.length - 1]!.tab);
    }
    // Initialize ordered response default order if unanswered
    if (q.type === "ordered" && !items[idx]?.response) {
      const c = q.content as OrderedContent;
      updateLocalResponse({ kind: "order", order: c.items.map((x) => x.id) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, q.id]);

  // Countdown & elapsed timer
  useEffect(() => {
    if (isCompleted) return;
    const t = setInterval(() => {
      setElapsedSec((prev) => {
        const next = prev + 1;
        if (initialTest.timeLimitSec && next >= initialTest.timeLimitSec) {
          clearInterval(t);
          void handleFinishTest(next);
        }
        return next;
      });
      setQTimerSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCompleted, initialTest.timeLimitSec]);

  // Speaking task timer
  useEffect(() => {
    if (speakTimer === null || speakTimer <= 0) return;
    const id = setTimeout(() => setSpeakTimer((s) => (s && s > 0 ? s - 1 : 0)), 1000);
    return () => clearTimeout(id);
  }, [speakTimer]);

  function updateLocalResponse(response: QuestionResponse | null) {
    if (isLocked) return;
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, response } : it)));
  }

  async function syncAnswer(opts: {
    submit?: boolean;
    nextIndex?: number;
    overrideResponse?: QuestionResponse | null;
    overrideMarked?: boolean;
  }) {
    if (isCompleted) {
      if (opts.nextIndex !== undefined) setIdx(opts.nextIndex);
      return;
    }
    setBusy(true);
    try {
      const resp = opts.overrideResponse !== undefined ? opts.overrideResponse : current.response;
      const marked = opts.overrideMarked !== undefined ? opts.overrideMarked : current.marked;
      const res = await fetch(`/api/tests/${initialTest.id}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: q.id,
          response: resp,
          timeSpentSec: qTimerSec,
          marked,
          submit: opts.submit,
          currentIndex: opts.nextIndex ?? idx,
          elapsedSec,
        }),
      });
      const data = (await res.json()) as {
        reveal?: Reveal | null;
        appended?: ClientQuestion | null;
        finished?: boolean;
        caseUpdate?: ClientCase | null;
      };

      if (data.caseUpdate && q.caseStudyId) {
        setCases((prev) => ({ ...prev, [q.caseStudyId!]: data.caseUpdate! }));
      }

      setItems((prev) => {
        const updated = prev.map((it, i) =>
          i === idx
            ? {
                ...it,
                response: resp,
                marked,
                timeSpentSec: qTimerSec,
                submitted: opts.submit ? true : it.submitted,
                reveal: data.reveal ?? it.reveal,
              }
            : it,
        );
        if (data.appended && !updated.some((x) => x.question.id === data.appended!.id)) {
          updated.push({
            position: updated.length,
            question: data.appended,
            response: null,
            submitted: false,
            marked: false,
            timeSpentSec: 0,
            bookmarked: false,
            note: "",
            reveal: null,
          });
        }
        return updated;
      });

      if (data.finished) {
        router.push(`/test/${initialTest.id}/results`);
        return;
      }

      if (opts.nextIndex !== undefined) {
        setIdx(opts.nextIndex);
      } else if (initialTest.adaptive && opts.submit && data.appended) {
        setIdx(items.length);
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleFinishTest(finalElapsed = elapsedSec) {
    setBusy(true);
    try {
      // Save current response first
      await fetch(`/api/tests/${initialTest.id}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: q.id,
          response: current.response,
          timeSpentSec: qTimerSec,
          marked: current.marked,
          elapsedSec: finalElapsed,
        }),
      });
      await fetch(`/api/tests/${initialTest.id}/answer`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elapsedSec: finalElapsed }),
      });
      router.push(`/test/${initialTest.id}/results`);
    } finally {
      setBusy(false);
    }
  }

  async function toggleBookmark() {
    const res = await fetch("/api/tests/tools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "bookmark", questionId: q.id }),
    });
    const data = (await res.json()) as { bookmarked?: boolean };
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, bookmarked: !!data.bookmarked } : it)));
  }

  async function savePersonalNote() {
    await fetch("/api/tests/tools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "note", questionId: q.id, body: noteDraft }),
    });
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, note: noteDraft } : it)));
    setNoteSavedMsg(true);
  }

  async function sendQuestionReport() {
    await fetch("/api/tests/tools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "report", questionId: q.id, reason: reportReason, body: reportBody }),
    });
    setReportSent(true);
    setReportBody("");
  }

  function evalCalculator(expr: string) {
    try {
      const clean = expr.replace(/[^0-9+\-*/(). ]/g, "");
      if (!clean.trim()) {
        setCalcResult("0");
        return;
      }
      const val = Function(`"use strict"; return (${clean})`)() as number;
      setCalcResult(Number.isFinite(val) ? String(Math.round(val * 10000) / 10000) : "Error");
    } catch {
      setCalcResult("Error");
    }
  }

  const formatSec = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0
      ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
      : `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const remainingSec = initialTest.timeLimitSec ? Math.max(0, initialTest.timeLimitSec - elapsedSec) : null;
  const answeredCount = items.filter((it) => it.response !== null).length;
  const markedCount = items.filter((it) => it.marked).length;
  const progressPct = items.length ? Math.round(((idx + 1) / items.length) * 100) : 0;

  const caseTabs = activeCase ? [...new Set(activeCase.sections.map((s) => s.tab))] : [];
  const currentTabName = caseTabs.includes(caseTab as never) ? caseTab : caseTabs[0] ?? "";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Simulator Bar */}
      <header className="sticky top-0 z-30 border-b border-[#144a85] bg-[#1b5ea8] text-white px-4 py-2.5 shadow">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={isCompleted ? `/test/${initialTest.id}/results` : `/exam/${exam.slug}`}
              onClick={() => {
                if (!isCompleted) void syncAnswer({});
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {isCompleted ? "Results" : "Save & Exit"}
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-bold text-white truncate">
                <span className="uppercase tracking-wide">{exam.shortName} Test</span>
                <span className="opacity-60">·</span>
                <span className="truncate font-medium opacity-90">{initialTest.name}</span>
                <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] uppercase">{initialTest.mode}</span>
                {initialTest.adaptive && (
                  <span className="rounded bg-amber-400/25 text-amber-100 px-1.5 py-0.5 text-[10px]">
                    CAT Adaptive
                  </span>
                )}
              </div>
              <div className="text-[13px] font-semibold text-white truncate">
                Item {idx + 1} of {items.length}
                <span className="ml-2 text-[11px] font-normal text-white/70">
                  {q.code} · {q.category ?? exam.name}
                  {q.topic ? ` › ${q.topic}` : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Timers & Simulator Utilities */}
          <div className="flex flex-wrap items-center gap-2">
            {!hideTimer ? (
              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-mono text-white">
                <Clock className="h-3.5 w-3.5 text-amber-300" />
                {remainingSec !== null ? (
                  <span title="Remaining test time">Rem: {formatSec(remainingSec)}</span>
                ) : (
                  <span title="Total elapsed time">Total: {formatSec(elapsedSec)}</span>
                )}
                <span className="opacity-50">|</span>
                <span title="Time on this question">Item: {formatSec(qTimerSec)}</span>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => setHideTimer((v) => !v)}
              className="rounded-lg bg-white/10 px-2 py-1.5 text-xs hover:bg-white/20"
              title={hideTimer ? "Show timer" : "Hide timer"}
              aria-label={hideTimer ? "Show timer" : "Hide timer"}
            >
              {hideTimer ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </button>

            {exam.features?.calculator !== false && (
              <button
                type="button"
                onClick={() => calcDialogRef.current?.showModal()}
                className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-white/20"
              >
                <Calculator className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Calculator</span>
              </button>
            )}

            {exam.features?.labReference !== false && (
              <button
                type="button"
                onClick={() => labDialogRef.current?.showModal()}
                className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-white/20"
              >
                <FlaskConical className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Lab Values</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => noteDialogRef.current?.showModal()}
              className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-white/20"
            >
              <NotebookPen className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Note</span>
            </button>

            {!initialTest.adaptive && (
              <button
                type="button"
                onClick={() => navDialogRef.current?.showModal()}
                className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-white/20"
              >
                <Grid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Navigator</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-7xl mx-auto mt-2">
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/15">
            <div className="h-full bg-amber-400 transition-all" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </header>

      {/* Sub-header metadata & flags */}
      <div className="border-b border-border bg-surface px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip bg-accent-subtle text-accent border-accent/25 font-semibold">
              {QUESTION_TYPE_LABELS[q.type]}
            </span>
            <span className="chip">
              Difficulty: {DIFFICULTY_LABELS[q.difficulty as Difficulty] ?? q.difficulty}
            </span>
            {q.ncjmmStep && (
              <span className="chip border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300">
                NGN Step {q.caseStep}/6: {NCJMM_LABELS[q.ncjmmStep as NcjmmStep] ?? q.ncjmmStep}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void syncAnswer({ overrideMarked: !current.marked })}
              className={`btn btn-sm ${
                current.marked ? "bg-amber-500 text-white" : "btn-secondary"
              }`}
            >
              <Flag className="h-3.5 w-3.5" />
              {current.marked ? "Marked for Review" : "Mark for Review"}
            </button>

            <button
              type="button"
              onClick={() => void toggleBookmark()}
              className={`btn btn-sm ${
                current.bookmarked ? "bg-accent text-white" : "btn-secondary"
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" />
              {current.bookmarked ? "Saved" : "Bookmark"}
            </button>

            <button
              type="button"
              onClick={() => reportDialogRef.current?.showModal()}
              className="btn btn-secondary btn-sm"
              title="Report an issue with this question"
            >
              <AlertCircle className="h-3.5 w-3.5" />
              Report
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Workspace (Left: Progressive Case Study or Clinical Exhibit; Right: Stem, Answer Controls & 18-point Rationale) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: NGN Progressive Case Study or Exhibit if present */}
        {(activeCase || q.exhibit != null || q.patient != null || q.scenario) && (
          <section className="lg:col-span-5 space-y-4">
            {activeCase && (
              <div className="panel overflow-hidden">
                <div className="bg-sidebar text-white p-4 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-sidebar-muted">
                    <span>NGN Clinical Case Study · Progressive Chart</span>
                    <span>Step {q.caseStep ?? 1} of 6</span>
                  </div>
                  <h2 className="text-base font-bold">{activeCase.title}</h2>
                  <p className="text-xs text-white/85">{activeCase.summary}</p>
                </div>

                {/* EHR Tabs */}
                <div className="flex flex-wrap border-b border-border bg-muted/50 px-2 pt-2 gap-1">
                  {caseTabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setCaseTab(tab)}
                      className={`rounded-t-xl px-3 py-2 text-xs font-semibold transition ${
                        currentTabName === tab
                          ? "bg-surface text-accent border-t border-x border-border"
                          : "muted hover:text-foreground"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="p-4 space-y-4 max-h-[540px] overflow-y-auto text-xs leading-relaxed">
                  {activeCase.sections
                    .filter((s) => s.tab === currentTabName)
                    .map((sec, i) => (
                      <div key={i} className="space-y-2 border-b border-border last:border-b-0 pb-3 last:pb-0">
                        <div className="flex items-center justify-between">
                          {sec.title && <div className="font-bold text-sm">{sec.title}</div>}
                          {sec.time && <span className="chip text-[11px] font-mono">{sec.time}</span>}
                        </div>
                        {sec.text && <p className="whitespace-pre-line">{sec.text}</p>}
                        {sec.table && (
                          <div className="table-wrapper" tabIndex={0} role="region" aria-label={sec.title || sec.tab}>
                            <table className="table text-xs">
                              <thead>
                                <tr>
                                  {sec.table.columns.map((col, ci) => (
                                    <th key={ci}>{col}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {sec.table.rows.map((r, ri) => (
                                  <tr key={ri}>
                                    {r.map((cell, ci) => (
                                      <td key={ci}>{cell}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Standalone Patient Profile */}
            {!activeCase && q.patient != null && (
              <PatientCard patient={q.patient as PatientInfo} />
            )}

            {/* Standalone Scenario */}
            {q.scenario && (
              <div className="panel panel-pad space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider muted">Clinical / Exam Scenario</div>
                <p className="text-sm leading-relaxed whitespace-pre-line">{q.scenario}</p>
              </div>
            )}

            {/* Standalone Exhibit (Passage, Trend Table, ECG, Audio) */}
            {q.exhibit != null && <ExhibitCard exhibit={q.exhibit as Exhibit} />}
          </section>
        )}

        {/* Right Column: Question Stem, Interactive Renderer, Action Buttons, and 18-Section Rationale */}
        <section
          className={
            activeCase || q.exhibit != null || q.patient != null || q.scenario
              ? "lg:col-span-7 space-y-5"
              : "lg:col-span-12 max-w-4xl mx-auto w-full space-y-5"
          }
        >
          <div className="panel panel-pad space-y-5">
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                Question {idx + 1} of {items.length}
              </div>
              <h1 className="text-base sm:text-lg font-semibold leading-relaxed whitespace-pre-line">{q.stem}</h1>
            </div>

            {/* Type-specific Question Renderer */}
            <QuestionTypeRenderer
              question={q}
              response={current.response}
              locked={isLocked}
              reveal={current.reveal}
              onChange={updateLocalResponse}
              speakTimer={speakTimer}
              setSpeakTimer={setSpeakTimer}
              isRecordingSim={isRecordingSim}
              setIsRecordingSim={setIsRecordingSim}
            />

            {/* Question Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                {!isLocked && current.response !== null && (
                  <button
                    type="button"
                    onClick={() => updateLocalResponse(null)}
                    className="btn btn-secondary btn-sm"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Clear Answer
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {!isCompleted && initialTest.mode === "tutor" && !current.submitted && (
                  <button
                    type="button"
                    disabled={busy || current.response === null}
                    onClick={() => void syncAnswer({ submit: true })}
                    className="btn btn-primary btn-sm"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Submit Answer &amp; View Rationale
                  </button>
                )}

                {initialTest.adaptive && !isCompleted && !current.submitted ? (
                  <button
                    type="button"
                    disabled={busy || current.response === null}
                    onClick={() => void syncAnswer({ submit: true })}
                    className="btn btn-primary btn-sm"
                  >
                    Submit &amp; Next Adaptive Item
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : idx < items.length - 1 ? null : !isCompleted ? (
                  <button
                    type="button"
                    onClick={() => confirmDialogRef.current?.showModal()}
                    className="btn btn-primary btn-sm"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Finish &amp; Submit Test
                  </button>
                ) : (
                  <Link href={`/test/${initialTest.id}/results`} className="btn btn-primary btn-sm">
                    Back to Full Results Report
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* 18-Section Comprehensive Post-Submission Rationale Panel */}
          {current.reveal && (
            <RationalePanel
              question={q}
              response={current.response}
              reveal={current.reveal}
              examSlug={exam.slug}
              onOpenNote={() => noteDialogRef.current?.showModal()}
            />
          )}
        </section>
      </main>

      {/* Bottom Sticky Navigation Bar */}
      <footer className="no-print sticky bottom-0 z-30 border-t border-[#144a85] bg-[#1b5ea8] px-3 py-2 text-white shadow-[0_-2px_8px_rgba(0,0,0,.15)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs">
          <div className="flex items-center gap-3">
            {!isCompleted ? (
              <button
                type="button"
                onClick={() => confirmDialogRef.current?.showModal()}
                className="inline-flex items-center gap-1.5 rounded-md bg-white/15 px-3 py-1.5 font-semibold hover:bg-white/25"
              >
                <LogOut className="h-3.5 w-3.5" />
                End
              </button>
            ) : (
              <Link
                href={`/test/${initialTest.id}/results`}
                className="inline-flex items-center gap-1.5 rounded-md bg-white/15 px-3 py-1.5 font-semibold hover:bg-white/25"
              >
                <LogOut className="h-3.5 w-3.5" />
                Results
              </Link>
            )}
            <span className="hidden text-white/80 md:inline">
              Answered <strong className="text-white">{answeredCount}</strong>/{items.length} · Marked{" "}
              <strong className="text-white">{markedCount}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1" role="group" aria-label="How well do you know this item?">
            {CONFIDENCE_FLAGS.map((f) => {
              const on = confidence[current.position] === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setConfidenceFlag(current.position, f.key)}
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 font-semibold transition ${on ? f.active : f.idle} hover:brightness-110`}
                >
                  <Tag className="h-3.5 w-3.5" />
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1">
            {!initialTest.adaptive && (
              <>
                <button
                  type="button"
                  disabled={idx === 0 || busy}
                  onClick={() => void syncAnswer({ nextIndex: Math.max(0, idx - 1) })}
                  className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-semibold hover:bg-white/15 disabled:opacity-40"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => navDialogRef.current?.showModal()}
                  className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-semibold hover:bg-white/15"
                >
                  <Compass className="h-3.5 w-3.5" />
                  Navigate
                </button>
                <button
                  type="button"
                  disabled={idx >= items.length - 1 || busy}
                  onClick={() => void syncAnswer({ nextIndex: idx + 1 })}
                  className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-semibold hover:bg-white/15 disabled:opacity-40"
                >
                  Next
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </footer>

      {/* 1. Native Modal Dialog: Calculator */}
      <dialog
        ref={calcDialogRef}
        aria-labelledby="calc-dialog-title"
        className="m-auto w-full max-w-sm rounded-2xl border border-border bg-surface p-5 text-foreground shadow-2xl"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 id="calc-dialog-title" className="text-base font-bold flex items-center gap-2">
            <Calculator className="h-4 w-4 text-accent" />
            Dosage &amp; Exam Calculator
          </h2>
          <form method="dialog">
            <button type="submit" aria-label="Close calculator" className="rounded-lg p-1 hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </form>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={calcExpr}
            onChange={(e) => {
              setCalcExpr(e.target.value);
              evalCalculator(e.target.value);
            }}
            placeholder="e.g., (250 / 50) * 15"
            className="field font-mono text-sm"
          />
          <div className="rounded-xl bg-muted p-3 text-right font-mono text-xl font-bold">
            = {calcResult}
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "(", "+", ")", "C"].map((btn) => (
              <button
                key={btn}
                type="button"
                onClick={() => {
                  if (btn === "C") {
                    setCalcExpr("");
                    setCalcResult("0");
                  } else {
                    const next = calcExpr + btn;
                    setCalcExpr(next);
                    evalCalculator(next);
                  }
                }}
                className="btn btn-secondary btn-sm font-mono"
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      </dialog>

      {/* 2. Native Modal Dialog: Lab Reference Values */}
      <dialog
        ref={labDialogRef}
        aria-labelledby="lab-dialog-title"
        className="m-auto w-full max-w-2xl rounded-2xl border border-border bg-surface p-5 text-foreground shadow-2xl"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 id="lab-dialog-title" className="text-base font-bold flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-accent" />
            Normal Laboratory Reference Values ({labs.length})
          </h2>
          <form method="dialog">
            <button type="submit" aria-label="Close lab values" className="rounded-lg p-1 hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </form>
        </div>

        <input
          type="search"
          value={labSearch}
          onChange={(e) => setLabSearch(e.target.value)}
          placeholder="Search lab value (e.g., Potassium, INR, pH, Troponin, Lithium)…"
          className="field mb-3 text-xs"
        />

        <div className="table-wrapper max-h-96" tabIndex={0} role="region" aria-labelledby="lab-dialog-title">
          <table className="table text-xs">
            <thead>
              <tr>
                <th>Panel</th>
                <th>Parameter</th>
                <th>Reference Range</th>
                <th>Unit</th>
                <th>Clinical Note</th>
              </tr>
            </thead>
            <tbody>
              {labs
                .filter((l) =>
                  !labSearch.trim()
                    ? true
                    : `${l.grp} ${l.name} ${l.note ?? ""}`.toLowerCase().includes(labSearch.toLowerCase()),
                )
                .map((l) => (
                  <tr key={l.id}>
                    <td className="font-medium muted">{l.grp}</td>
                    <th className="font-semibold text-left">{l.name}</th>
                    <td className="font-mono font-bold text-accent">{l.range}</td>
                    <td className="font-mono">{l.unit}</td>
                    <td className="muted">{l.note ?? "—"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </dialog>

      {/* 3. Native Modal Dialog: Question Navigator */}
      <dialog
        ref={navDialogRef}
        aria-labelledby="nav-dialog-title"
        className="m-auto w-full max-w-lg rounded-2xl border border-border bg-surface p-5 text-foreground shadow-2xl"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 id="nav-dialog-title" className="text-base font-bold">
            Question Navigator ({items.length} items)
          </h2>
          <form method="dialog">
            <button type="submit" aria-label="Close navigator" className="rounded-lg p-1 hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </form>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 max-h-80 overflow-y-auto p-1">
          {items.map((it, i) => {
            const answered = it.response !== null;
            return (
              <button
                key={it.question.id}
                type="button"
                onClick={() => {
                  navDialogRef.current?.close();
                  void syncAnswer({ nextIndex: i });
                }}
                className={`rounded-xl border px-2 py-2 text-xs font-bold transition ${
                  i === idx
                    ? "border-accent bg-accent text-white"
                    : it.marked
                      ? "border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300"
                      : answered
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : "border-border hover:bg-muted"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </dialog>

      {/* 4. Native Modal Dialog: Personal Study Note */}
      <dialog
        ref={noteDialogRef}
        aria-labelledby="note-dialog-title"
        className="m-auto w-full max-w-md rounded-2xl border border-border bg-surface p-5 text-foreground shadow-2xl"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 id="note-dialog-title" className="text-base font-bold flex items-center gap-2">
            <NotebookPen className="h-4 w-4 text-accent" />
            Personal Study Note ({q.code})
          </h2>
          <form method="dialog">
            <button type="submit" aria-label="Close personal note" className="rounded-lg p-1 hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </form>
        </div>
        <div className="space-y-3">
          <textarea
            rows={4}
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder="Write your clinical takeaway, memory hook, or pharmacology note for this item…"
            className="field text-xs"
          />
          {noteSavedMsg && <p className="text-xs font-medium text-emerald-600">Personal note saved to your review bank.</p>}
          <div className="flex justify-end gap-2">
            <form method="dialog">
              <button type="submit" className="btn btn-secondary btn-sm">
                Close
              </button>
            </form>
            <button type="button" onClick={() => void savePersonalNote()} className="btn btn-primary btn-sm">
              Save Note
            </button>
          </div>
        </div>
      </dialog>

      {/* 5. Native Modal Dialog: Report Question */}
      <dialog
        ref={reportDialogRef}
        aria-labelledby="report-dialog-title"
        className="m-auto w-full max-w-md rounded-2xl border border-border bg-surface p-5 text-foreground shadow-2xl"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 id="report-dialog-title" className="text-base font-bold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-danger" />
            Report Question ({q.code})
          </h2>
          <form method="dialog">
            <button type="submit" aria-label="Close report dialog" className="rounded-lg p-1 hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </form>
        </div>
        <div className="space-y-3">
          <div>
            <label htmlFor="report-reason" className="label text-xs">
              Issue Category
            </label>
            <select
              id="report-reason"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="field text-xs"
            >
              <option value="Clinical / answer accuracy">Clinical / answer accuracy</option>
              <option value="Typo or formatting">Typo or formatting</option>
              <option value="Exhibit or lab value unclear">Exhibit or lab value unclear</option>
              <option value="Rationale improvement">Rationale improvement</option>
            </select>
          </div>
          <div>
            <label htmlFor="report-body" className="label text-xs">
              Description
            </label>
            <textarea
              id="report-body"
              rows={3}
              value={reportBody}
              onChange={(e) => setReportBody(e.target.value)}
              placeholder="Describe the concern for the clinical review team…"
              className="field text-xs"
            />
          </div>
          {reportSent && <p className="text-xs font-medium text-emerald-600">Thank you — sent to the Clinical Review Queue.</p>}
          <div className="flex justify-end gap-2">
            <form method="dialog">
              <button type="submit" className="btn btn-secondary btn-sm">
                Close
              </button>
            </form>
            <button type="button" onClick={() => void sendQuestionReport()} className="btn btn-primary btn-sm">
              Submit Report
            </button>
          </div>
        </div>
      </dialog>

      {/* 6. Native Modal Dialog: Submit Test Confirmation */}
      <dialog
        ref={confirmDialogRef}
        aria-labelledby="confirm-submit-title"
        className="m-auto w-full max-w-md rounded-2xl border border-border bg-surface p-6 text-foreground shadow-2xl"
      >
        <div className="space-y-4">
          <h2 id="confirm-submit-title" className="text-lg font-bold">
            Submit {initialTest.name}?
          </h2>
          <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted p-3 text-center text-xs">
            <div>
              <div className="text-base font-bold text-emerald-600">{answeredCount}</div>
              <div className="muted">Answered</div>
            </div>
            <div>
              <div className="text-base font-bold text-rose-600">{items.length - answeredCount}</div>
              <div className="muted">Unanswered</div>
            </div>
            <div>
              <div className="text-base font-bold text-amber-600">{markedCount}</div>
              <div className="muted">Marked</div>
            </div>
          </div>
          <p className="text-xs muted">
            Submitting this test will grade all responses, generate your exam-specific score estimate, category/subject breakdown, and 7-day personalized study plan.
          </p>
          <div className="flex items-center justify-end gap-2">
            <form method="dialog">
              <button type="submit" autoFocus className="btn btn-secondary btn-sm">
                Continue Testing
              </button>
            </form>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                confirmDialogRef.current?.close();
                void handleFinishTest();
              }}
              className="btn btn-primary btn-sm"
            >
              {busy ? "Scoring…" : "Confirm & Submit Test"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Patient & Exhibit Renderers                                         */
/* ------------------------------------------------------------------ */
function PatientCard({ patient }: { patient: PatientInfo }) {
  return (
    <div className="panel panel-pad space-y-3 text-xs">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="font-bold uppercase tracking-wider text-accent">Client Profile &amp; Chart</span>
        <span className="font-semibold">
          {[patient.age ? `Age: ${patient.age}` : null, patient.gender].filter(Boolean).join(" · ")}
        </span>
      </div>
      {patient.history && (
        <div>
          <span className="font-semibold">History: </span>
          <span className="muted">{patient.history}</span>
        </div>
      )}
      {patient.allergies && (
        <div>
          <span className="font-semibold text-rose-600">Allergies: </span>
          <span>{patient.allergies}</span>
        </div>
      )}
      {patient.vitals && Object.keys(patient.vitals).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 rounded-xl bg-muted/60 p-2.5">
          {Object.entries(patient.vitals).map(([k, v]) => (
            <div key={k}>
              <div className="text-[10px] muted uppercase">{k}</div>
              <div className="font-mono font-bold">{v}</div>
            </div>
          ))}
        </div>
      )}
      {patient.labs && patient.labs.length > 0 && (
        <div className="table-wrapper" tabIndex={0} role="region" aria-label="Client laboratory results">
          <table className="table text-xs">
            <thead>
              <tr>
                <th>Lab</th>
                <th>Result</th>
                <th>Flag</th>
              </tr>
            </thead>
            <tbody>
              {patient.labs.map((l, i) => (
                <tr key={i}>
                  <th className="text-left font-medium">{l.name}</th>
                  <td className="font-mono font-bold">
                    {l.value} {l.unit}
                  </td>
                  <td>
                    {l.flag ? (
                      <span className="rounded bg-rose-500/15 px-1.5 py-0.5 text-[10px] font-bold text-rose-600">
                        {l.flag}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {patient.meds && patient.meds.length > 0 && (
        <div>
          <div className="font-semibold mb-1">Active Medications:</div>
          <div className="flex flex-wrap gap-1">
            {patient.meds.map((m, i) => (
              <span key={i} className="chip text-[11px]">
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ExhibitCard({ exhibit }: { exhibit: Exhibit }) {
  return (
    <div className="panel panel-pad space-y-3">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">
          {exhibit.title ?? `Clinical / Academic Exhibit (${exhibit.kind})`}
        </span>
        <span className="chip text-[10px] uppercase">{exhibit.kind}</span>
      </div>
      {exhibit.text && <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">{exhibit.text}</div>}
      {exhibit.columns && exhibit.rows && (
        <div className="table-wrapper" tabIndex={0} role="region" aria-label={exhibit.title || "Exhibit data table"}>
          <table className="table text-xs">
            <thead>
              <tr>
                {exhibit.columns.map((c, i) => (
                  <th key={i}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {exhibit.rows.map((r, ri) => (
                <tr key={ri}>
                  {r.map((cell, ci) => (
                    <td key={ci}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* All 12 Question Type Renderers                                      */
/* ------------------------------------------------------------------ */
function QuestionTypeRenderer({
  question,
  response,
  locked,
  reveal,
  onChange,
  speakTimer,
  setSpeakTimer,
  isRecordingSim,
  setIsRecordingSim,
}: {
  question: ClientQuestion;
  response: QuestionResponse | null;
  locked: boolean;
  reveal: Reveal | null;
  onChange: (r: QuestionResponse) => void;
  speakTimer: number | null;
  setSpeakTimer: (n: number | null) => void;
  isRecordingSim: boolean;
  setIsRecordingSim: (b: boolean) => void;
}) {
  const type = question.type;

  // 1. Single-best-answer MCQ & single-answer Trend
  if (type === "mcq" || (type === "trend" && !(question.content as TrendContent).multi)) {
    const content = question.content as McqContent;
    const selected = response?.kind === "single" ? response.value : "";
    const correctId = (reveal?.answer as McqAnswer | TrendAnswer | undefined)?.correct;

    return (
      <div role="radiogroup" aria-label="Answer choices" className="space-y-2.5">
        {content.options.map((opt, idx) => {
          const isSelected = selected === opt.id;
          const isCorrectKey = typeof correctId === "string" && correctId === opt.id;
          return (
            <label
              key={opt.id}
              className={`flex items-start gap-3 rounded-xl border p-3.5 text-sm transition cursor-pointer ${
                reveal
                  ? isCorrectKey
                    ? "border-emerald-500 bg-emerald-500/10"
                    : isSelected
                      ? "border-rose-500 bg-rose-500/10"
                      : "border-border opacity-80"
                  : isSelected
                    ? "border-accent bg-accent-subtle"
                    : "border-border hover:bg-muted/50"
              }`}
            >
              <input
                type="radio"
                name={`q-${question.id}`}
                value={opt.id}
                checked={isSelected}
                disabled={locked}
                onChange={() => onChange({ kind: "single", value: opt.id })}
                className="mt-1"
              />
              <span className="font-mono text-xs font-bold uppercase muted mt-0.5">{String.fromCharCode(65 + idx)}.</span>
              <span className="flex-1 leading-relaxed">{opt.text}</span>
              {reveal && isCorrectKey && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />}
              {reveal && isSelected && !isCorrectKey && <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />}
            </label>
          );
        })}
      </div>
    );
  }

  // 2. SATA, Extended Multiple Response, or multi-choice Trend
  if (type === "sata" || type === "multiple_response" || type === "trend") {
    const content = question.content as SataContent;
    const selected = response?.kind === "multi" ? response.values : [];
    const correctArr = ((reveal?.answer as SataAnswer | undefined)?.correct ?? []) as string[];

    return (
      <div className="space-y-2.5">
        <div className="text-xs font-medium muted">
          {type === "multiple_response"
            ? "Select all options that apply (NGN +/- partial credit scoring):"
            : "Select all options that apply:"}
        </div>
        {content.options.map((opt, idx) => {
          const isSelected = selected.includes(opt.id);
          const isCorrectKey = correctArr.includes(opt.id);
          return (
            <label
              key={opt.id}
              className={`flex items-start gap-3 rounded-xl border p-3.5 text-sm transition cursor-pointer ${
                reveal
                  ? isCorrectKey
                    ? "border-emerald-500 bg-emerald-500/10"
                    : isSelected
                      ? "border-rose-500 bg-rose-500/10"
                      : "border-border opacity-80"
                  : isSelected
                    ? "border-accent bg-accent-subtle"
                    : "border-border hover:bg-muted/50"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                disabled={locked}
                onChange={() => {
                  const next = isSelected ? selected.filter((x) => x !== opt.id) : [...selected, opt.id];
                  onChange({ kind: "multi", values: next });
                }}
                className="mt-1 rounded"
              />
              <span className="font-mono text-xs font-bold uppercase muted mt-0.5">{String.fromCharCode(65 + idx)}.</span>
              <span className="flex-1 leading-relaxed">{opt.text}</span>
              {reveal && isCorrectKey && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />}
              {reveal && isSelected && !isCorrectKey && <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />}
            </label>
          );
        })}
      </div>
    );
  }

  // 3. Ordered Response (Drag / Keyboard Up-Down Reordering)
  if (type === "ordered") {
    const content = question.content as OrderedContent;
    const currentOrder =
      response?.kind === "order" && response.order.length === content.items.length
        ? response.order
        : content.items.map((x) => x.id);
    const byId = new Map(content.items.map((x) => [x.id, x.text]));
    const correctOrder = (reveal?.answer as OrderedAnswer | undefined)?.order ?? [];

    const move = (fromIdx: number, dir: -1 | 1) => {
      const toIdx = fromIdx + dir;
      if (toIdx < 0 || toIdx >= currentOrder.length) return;
      const copy = [...currentOrder];
      [copy[fromIdx], copy[toIdx]] = [copy[toIdx]!, copy[fromIdx]!];
      onChange({ kind: "order", order: copy });
    };

    return (
      <div className="space-y-2.5">
        <div className="text-xs font-medium muted">
          Place the steps in the correct sequence from top (1) to bottom ({currentOrder.length}) using the up/down buttons:
        </div>
        {currentOrder.map((id, i) => {
          const isMatch = reveal ? correctOrder[i] === id : false;
          return (
            <div
              key={id}
              className={`flex items-center justify-between gap-3 rounded-xl border p-3 text-sm ${
                reveal
                  ? isMatch
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-rose-500 bg-rose-500/10"
                  : "border-border bg-surface"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent-subtle text-xs font-bold text-accent">
                  {i + 1}
                </span>
                <span>{byId.get(id)}</span>
              </div>
              {!locked && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                    aria-label={`Move step ${i + 1} up`}
                    className="btn btn-secondary btn-sm px-2"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={i === currentOrder.length - 1}
                    onClick={() => move(i, 1)}
                    aria-label={`Move step ${i + 1} down`}
                    className="btn btn-secondary btn-sm px-2"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // 4. Matrix / Grid
  if (type === "matrix") {
    const content = question.content as MatrixContent;
    const map = response?.kind === "matrix" ? response.map : {};
    const keyMap = (reveal?.answer as MatrixAnswer | undefined)?.map ?? {};

    return (
      <div className="table-wrapper" tabIndex={0} role="region" aria-label="Matrix question grid">
        <table className="table text-xs sm:text-sm">
          <thead>
            <tr>
              <th>Finding / Row</th>
              {content.columns.map((col) => (
                <th key={col.id} className="text-center">
                  {col.text}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.rows.map((row) => {
              const rowVal = map[row.id];
              const rowKey = keyMap[row.id];
              return (
                <tr key={row.id}>
                  <th className="font-medium text-left">{row.text}</th>
                  {content.columns.map((col) => {
                    const checked = Array.isArray(rowVal) ? rowVal.includes(col.id) : rowVal === col.id;
                    const isKey = Array.isArray(rowKey) ? rowKey.includes(col.id) : rowKey === col.id;
                    return (
                      <td
                        key={col.id}
                        className={`text-center ${
                          reveal && isKey ? "bg-emerald-500/15" : reveal && checked && !isKey ? "bg-rose-500/15" : ""
                        }`}
                      >
                        <input
                          type={content.multi ? "checkbox" : "radio"}
                          name={`matrix-${question.id}-${row.id}`}
                          aria-label={`${row.text} — ${col.text}`}
                          checked={checked}
                          disabled={locked}
                          onChange={() => {
                            if (content.multi) {
                              const cur = Array.isArray(rowVal) ? rowVal : rowVal ? [rowVal] : [];
                              const next = checked ? cur.filter((x) => x !== col.id) : [...cur, col.id];
                              onChange({ kind: "matrix", map: { ...map, [row.id]: next } });
                            } else {
                              onChange({ kind: "matrix", map: { ...map, [row.id]: col.id } });
                            }
                          }}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  // 5. NGN Bow-Tie
  if (type === "bowtie") {
    const content = question.content as BowtieContent;
    const cur =
      response?.kind === "bowtie"
        ? response
        : { kind: "bowtie" as const, condition: undefined, actions: [], parameters: [] };
    const key = reveal?.answer as BowtieAnswer | undefined;

    const toggleList = (list: string[], id: string, limit = 2) => {
      if (list.includes(id)) return list.filter((x) => x !== id);
      if (list.length >= limit) return [...list.slice(1), id];
      return [...list, id];
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Wing: Actions to take (pick 2) */}
        <div className="rounded-2xl border border-border bg-muted/30 p-3.5 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-accent">
            {content.actionsLabel ?? "Actions to Take (Select 2)"}
          </div>
          {content.actions.map((a) => {
            const on = cur.actions.includes(a.id);
            const isKey = key?.actions.includes(a.id);
            return (
              <label
                key={a.id}
                className={`flex items-start gap-2 rounded-xl border p-2.5 text-xs cursor-pointer transition ${
                  reveal
                    ? isKey
                      ? "border-emerald-500 bg-emerald-500/10"
                      : on
                        ? "border-rose-500 bg-rose-500/10"
                        : "border-border"
                    : on
                      ? "border-accent bg-accent-subtle font-semibold"
                      : "border-border bg-surface hover:bg-muted"
                }`}
              >
                <input
                  type="checkbox"
                  checked={on}
                  disabled={locked}
                  onChange={() => onChange({ ...cur, actions: toggleList(cur.actions, a.id, 2) })}
                  className="mt-0.5 rounded"
                />
                <span>{a.text}</span>
              </label>
            );
          })}
        </div>

        {/* Center Knot: Potential Condition (pick 1) */}
        <div className="rounded-2xl border-2 border-accent/40 bg-accent-subtle/40 p-3.5 space-y-2 flex flex-col justify-center">
          <div className="text-xs font-bold uppercase tracking-wider text-accent text-center">
            {content.conditionLabel ?? "Condition Most Likely Experiencing (Select 1)"}
          </div>
          {content.conditions.map((c) => {
            const on = cur.condition === c.id;
            const isKey = key?.condition === c.id;
            return (
              <label
                key={c.id}
                className={`flex items-start gap-2 rounded-xl border p-2.5 text-xs cursor-pointer transition ${
                  reveal
                    ? isKey
                      ? "border-emerald-500 bg-emerald-500/10 font-bold"
                      : on
                        ? "border-rose-500 bg-rose-500/10"
                        : "border-border bg-surface"
                    : on
                      ? "border-accent bg-accent text-white font-semibold"
                      : "border-border bg-surface hover:bg-muted"
                }`}
              >
                <input
                  type="radio"
                  name={`bowtie-cond-${question.id}`}
                  checked={on}
                  disabled={locked}
                  onChange={() => onChange({ ...cur, condition: c.id })}
                  className="mt-0.5"
                />
                <span>{c.text}</span>
              </label>
            );
          })}
        </div>

        {/* Right Wing: Parameters to monitor (pick 2) */}
        <div className="rounded-2xl border border-border bg-muted/30 p-3.5 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-accent">
            {content.parametersLabel ?? "Parameters to Monitor (Select 2)"}
          </div>
          {content.parameters.map((p) => {
            const on = cur.parameters.includes(p.id);
            const isKey = key?.parameters.includes(p.id);
            return (
              <label
                key={p.id}
                className={`flex items-start gap-2 rounded-xl border p-2.5 text-xs cursor-pointer transition ${
                  reveal
                    ? isKey
                      ? "border-emerald-500 bg-emerald-500/10"
                      : on
                        ? "border-rose-500 bg-rose-500/10"
                        : "border-border"
                    : on
                      ? "border-accent bg-accent-subtle font-semibold"
                      : "border-border bg-surface hover:bg-muted"
                }`}
              >
                <input
                  type="checkbox"
                  checked={on}
                  disabled={locked}
                  onChange={() => onChange({ ...cur, parameters: toggleList(cur.parameters, p.id, 2) })}
                  className="mt-0.5 rounded"
                />
                <span>{p.text}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  // 6. Highlight Text
  if (type === "highlight") {
    const content = question.content as HighlightContent;
    const selected = response?.kind === "multi" ? response.values : [];
    const correctIds = (reveal?.answer as HighlightAnswer | undefined)?.correct ?? [];

    const toggleSeg = (id: string) => {
      if (locked) return;
      const next = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
      onChange({ kind: "multi", values: next });
    };

    return (
      <div className="space-y-2">
        <div className="text-xs font-medium muted">
          Click or press Enter/Space on the clinical findings in the text below to highlight them:
        </div>
        <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm leading-8">
          {content.segments.map((seg) => {
            if (!seg.selectable) {
              return <span key={seg.id}>{seg.text}</span>;
            }
            const isOn = selected.includes(seg.id);
            const isKey = reveal ? correctIds.includes(seg.id) : false;
            return (
              <span
                key={seg.id}
                role="button"
                tabIndex={locked ? -1 : 0}
                aria-pressed={isOn}
                data-selectable="true"
                data-on={isOn ? "true" : "false"}
                data-key={isKey ? "true" : "false"}
                onClick={() => toggleSeg(seg.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleSeg(seg.id);
                  }
                }}
                className="hl-seg mx-0.5 px-1 border-b border-dashed border-accent/50"
              >
                {seg.text}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  // 7. Drop-Down Cloze
  if (type === "cloze") {
    const content = question.content as ClozeContent;
    const blanks = response?.kind === "cloze" ? response.blanks : {};
    const keyBlanks = (reveal?.answer as ClozeAnswer | undefined)?.blanks ?? {};
    const parts = content.template.split(/(\{\{[a-zA-Z0-9_]+\}\})/g);

    return (
      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm leading-9">
        {parts.map((part, i) => {
          const m = part.match(/^\{\{([a-zA-Z0-9_]+)\}\}$/);
          if (!m) return <span key={i}>{part}</span>;
          const blankId = m[1]!;
          const opts = content.blanks[blankId] ?? [];
          const val = blanks[blankId] ?? "";
          const keyVal = keyBlanks[blankId];
          return (
            <select
              key={i}
              aria-label={`Select option for blank ${blankId}`}
              value={val}
              disabled={locked}
              onChange={(e) => onChange({ kind: "cloze", blanks: { ...blanks, [blankId]: e.target.value } })}
              className={`mx-1.5 inline-block rounded-lg border px-2.5 py-1 text-xs font-semibold ${
                reveal
                  ? val === keyVal
                    ? "border-emerald-500 bg-emerald-500/15"
                    : "border-rose-500 bg-rose-500/15"
                  : "border-accent bg-surface"
              }`}
            >
              <option value="">— Select —</option>
              {opts.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.text}
                </option>
              ))}
            </select>
          );
        })}
      </div>
    );
  }

  // 8. Numeric Calculation Entry
  if (type === "numeric") {
    const content = question.content as NumericContent;
    const val = response?.kind === "numeric" ? response.value : "";

    return (
      <div className="space-y-2 max-w-sm">
        <label htmlFor={`num-${question.id}`} className="label text-xs">
          Enter numeric answer{content.decimals !== undefined ? ` (round to ${content.decimals} decimal places)` : ""}:
        </label>
        <div className="flex items-center gap-2">
          <input
            id={`num-${question.id}`}
            type="text"
            inputMode="decimal"
            value={val}
            disabled={locked}
            onChange={(e) => onChange({ kind: "numeric", value: e.target.value })}
            placeholder="Enter value"
            className="field font-mono text-base font-bold"
          />
          {content.unit && <span className="text-sm font-semibold muted shrink-0">{content.unit}</span>}
        </div>
      </div>
    );
  }

  // 9. Writing Task (IELTS, OET, PTE, TOEFL, GRE AWA, AP)
  if (type === "writing") {
    const content = question.content as WritingContent;
    const text = response?.kind === "text" ? response.text : "";
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;

    return (
      <div className="space-y-3">
        <div className="rounded-xl border border-border bg-muted/40 p-3.5 space-y-2 text-xs">
          {content.taskLabel && <div className="font-bold text-accent uppercase">{content.taskLabel}</div>}
          <p className="text-sm font-medium whitespace-pre-line">{content.prompt}</p>
          {content.rubric && content.rubric.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {content.rubric.map((r, i) => (
                <span key={i} className="chip text-[11px]">
                  Criterion: {r}
                </span>
              ))}
            </div>
          )}
        </div>
        <textarea
          rows={10}
          value={text}
          disabled={locked}
          onChange={(e) => onChange({ kind: "text", text: e.target.value })}
          placeholder="Type your complete essay, letter, or analytical response here…"
          className="field text-sm leading-relaxed"
        />
        <div className="flex items-center justify-between text-xs muted">
          <span>
            Word count: <strong>{words}</strong>
            {content.minWords ? ` (recommended minimum: ${content.minWords} words)` : ""}
          </span>
          <span>Evaluated with structured rubric feedback on submission</span>
        </div>
      </div>
    );
  }

  // 10. Speaking Task (IELTS, OET, PTE, TOEFL)
  if (type === "speaking") {
    const content = question.content as SpeakingContent;
    const text = response?.kind === "text" ? response.text : "";
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;

    return (
      <div className="space-y-3">
        <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-accent uppercase">Speaking Prompt &amp; Cue Card</span>
            <span className="muted">
              Prep: {content.prepSeconds ?? 60}s · Speak: {content.speakSeconds ?? 120}s
            </span>
          </div>
          <p className="text-sm font-semibold">{content.prompt}</p>
          {content.cueCard && content.cueCard.length > 0 && (
            <ul className="list-disc pl-5 space-y-1 text-xs">
              {content.cueCard.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={locked}
            onClick={() => setSpeakTimer(content.prepSeconds ?? 60)}
            className="btn btn-secondary btn-sm"
          >
            <Clock className="h-3.5 w-3.5" />
            Start {content.prepSeconds ?? 60}s Prep Timer
          </button>
          <button
            type="button"
            disabled={locked}
            onClick={() => {
              setIsRecordingSim(!isRecordingSim);
              if (!isRecordingSim) setSpeakTimer(content.speakSeconds ?? 120);
            }}
            className={`btn btn-sm ${isRecordingSim ? "btn-danger" : "btn-primary"}`}
          >
            <Mic className="h-3.5 w-3.5" />
            {isRecordingSim ? "Stop Speaking Timer" : `Start ${content.speakSeconds ?? 120}s Speaking Timer`}
          </button>
          {speakTimer !== null && (
            <span className="chip font-mono font-bold text-accent">Timer: {speakTimer}s</span>
          )}
        </div>

        <textarea
          rows={6}
          value={text}
          disabled={locked}
          onChange={(e) => onChange({ kind: "text", text: e.target.value })}
          placeholder="Enter or dictate your spoken response transcript here for rubric evaluation…"
          className="field text-sm leading-relaxed"
        />
        <div className="text-xs muted">Transcript words: {words}</div>
      </div>
    );
  }

  return null;
}

/* ------------------------------------------------------------------ */
/* 18-Section Post-Submission Rationale Panel                          */
/* ------------------------------------------------------------------ */
function RationalePanel({
  question,
  response,
  reveal,
  examSlug,
  onOpenNote,
}: {
  question: ClientQuestion;
  response: QuestionResponse | null;
  reveal: Reveal;
  examSlug: string;
  onOpenNote: () => void;
}) {
  const extras = (reveal.extras ?? {}) as QuestionExtras;
  const optExp = (reveal.optionExplanations ?? {}) as Record<string, string>;
  const fb = reveal.feedback as ProductiveFeedback | undefined;

  const formatCorrectAnswer = () => {
    const a = reveal.answer as Record<string, unknown>;
    if (!a) return "See rationale";
    if (typeof a.correct === "string") return `Option ${a.correct.toUpperCase()}`;
    if (Array.isArray(a.correct)) return a.correct.map((x) => String(x).toUpperCase()).join(", ");
    if (Array.isArray(a.order)) return a.order.map((x) => String(x).toUpperCase()).join(" → ");
    if (a.value !== undefined) return `${a.value}${a.tolerance ? ` (±${a.tolerance})` : ""}`;
    if (a.condition) {
      const bt = a as unknown as BowtieAnswer;
      return `Condition: ${bt.condition.toUpperCase()} | Actions: ${bt.actions.join(", ").toUpperCase()} | Parameters: ${bt.parameters.join(", ").toUpperCase()}`;
    }
    if (a.blanks) return JSON.stringify(a.blanks);
    if (a.map) return JSON.stringify(a.map);
    if (a.sample) return "Model response provided below";
    return "Verified key";
  };

  const formatStudentResponse = () => {
    if (!response) return "Unanswered";
    switch (response.kind) {
      case "single":
        return `Option ${response.value.toUpperCase()}`;
      case "multi":
        return response.values.map((v) => v.toUpperCase()).join(", ") || "None";
      case "order":
        return response.order.map((v) => v.toUpperCase()).join(" → ");
      case "numeric":
        return response.value;
      case "bowtie":
        return `Condition: ${response.condition?.toUpperCase() ?? "—"} | Actions: ${response.actions.join(", ").toUpperCase()} | Parameters: ${response.parameters.join(", ").toUpperCase()}`;
      case "cloze":
        return JSON.stringify(response.blanks);
      case "matrix":
        return JSON.stringify(response.map);
      case "text":
        return `${response.text.trim().split(/\s+/).filter(Boolean).length} words submitted`;
    }
  };

  return (
    <div className="panel panel-pad space-y-5 border-2 border-accent/30">
      {/* 1 & 2: Outcome Banner, Correct Answer & Student's Selected Answer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-2.5">
          {reveal.isCorrect === true ? (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/15 px-3 py-1.5 text-sm font-bold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              Correct ({reveal.score ?? 1}/{reveal.maxScore ?? 1} pts)
            </span>
          ) : reveal.isCorrect === false ? (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500/15 px-3 py-1.5 text-sm font-bold text-rose-700 dark:text-rose-300">
              <XCircle className="h-4 w-4" />
              Incorrect / Partial ({reveal.score ?? 0}/{reveal.maxScore ?? 1} pts)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-accent-subtle px-3 py-1.5 text-sm font-bold text-accent">
              <Sparkles className="h-4 w-4" />
              Rubric Evaluated Task
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="muted">1. Correct Answer</div>
            <div className="font-bold text-emerald-600 dark:text-emerald-400">{formatCorrectAnswer()}</div>
          </div>
          <div>
            <div className="muted">2. Your Selected Answer</div>
            <div className="font-bold">{formatStudentResponse()}</div>
          </div>
        </div>
      </div>

      {/* Productive Writing / Speaking AI Feedback if present */}
      {fb && (
        <div className="rounded-xl border border-accent/30 bg-accent-subtle/40 p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-accent">Examiner Rubric Estimate: {fb.overall}</span>
            <span className="chip text-[10px]">Engine: {fb.engine}</span>
          </div>
          {fb.criteria?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {fb.criteria.map((c, i) => (
                <div key={i} className="rounded-lg bg-surface p-2.5 border border-border">
                  <div className="flex justify-between font-semibold">
                    <span>{c.name}</span>
                    <span className="text-accent">
                      {c.score} / {c.max}
                    </span>
                  </div>
                  <p className="muted mt-1">{c.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Detailed Clinical / Exam Rationale */}
      <div className="space-y-1.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-accent">Clinical &amp; Educational Rationale</h3>
        <MarkdownText text={reveal.rationale} />
      </div>

      {/* 4. Why the Correct Answer is Correct */}
      {extras.whyCorrect && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/25 p-3.5 text-xs space-y-1">
          <div className="font-bold text-emerald-700 dark:text-emerald-300">Why the Correct Answer is Correct</div>
          <p className="leading-relaxed">{renderInlineMarkdown(extras.whyCorrect)}</p>
        </div>
      )}

      {/* 16. Key Takeaway & Strategy (Prominent) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="rounded-xl bg-accent-subtle border border-accent/25 p-3.5 space-y-1">
          <div className="font-bold text-accent">Key Takeaway</div>
          <p className="font-medium">{renderInlineMarkdown(extras.keyTakeaway || reveal.rationale.split(".")[0] + ".")}</p>
        </div>
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 space-y-1">
          <div className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
            <Lightbulb className="h-3.5 w-3.5" />
            NCLEX &amp; Exam Test-Taking Strategy
          </div>
          <p>{renderInlineMarkdown(extras.strategy || "Eliminate options that delay urgent care or delegate RN-only assessment/evaluation/teaching tasks.")}</p>
        </div>
      </div>

      {/* 5. Why Every Option is Right or Wrong */}
      {Object.keys(optExp).length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider muted">
            Option-by-Option Explanations
          </div>
          <div className="space-y-1.5 text-xs">
            {Object.entries(optExp).map(([optId, explanation]) => (
              <div key={optId} className="rounded-xl border border-border bg-muted/30 p-2.5">
                <span className="font-mono font-bold uppercase text-accent mr-2">Option {optId}:</span>
                <span>{renderInlineMarkdown(explanation)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6 through 14: Collapsible Clinical Deep-Dive (Progressive Disclosure) */}
      <details className="rounded-xl border border-border bg-muted/20 p-3.5 text-xs group">
        <summary className="cursor-pointer font-bold text-accent select-none flex items-center justify-between">
          <span>Clinical Judgment Breakdown (Priority Action, Safety, Assessment, Labs, Meds &amp; Education)</span>
          <span className="text-[11px] muted">Click to expand</span>
        </summary>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-border">
          <div className="rounded-xl border border-border bg-surface p-3 space-y-1">
            <div className="font-bold text-accent">Priority Nursing / Clinical Action</div>
            <p className="muted">{extras.priorityAction || "Assess client stability using ABCs, vital signs, and immediate safety cues before secondary interventions."}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-3 space-y-1">
            <div className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <ShieldAlert className="h-3.5 w-3.5" />
              Safety Considerations
            </div>
            <p className="muted">{extras.safety || "Verify client identity, allergies, contraindications, and high-alert parameters prior to intervention."}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-3 space-y-1">
            <div className="font-bold">Key Assessment Findings</div>
            <p className="muted">{extras.assessmentFindings || "Monitor baseline versus trending vital signs, organ perfusion cues, and target laboratory markers."}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-3 space-y-1">
            <div className="font-bold">Expected Outcomes</div>
            <p className="muted">{extras.expectedOutcomes || "Resolution of acute physiological instability, maintenance of target parameters, and verbalized client understanding."}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-3 space-y-1">
            <div className="font-bold">Nursing &amp; Clinical Interventions</div>
            <p className="muted">{extras.interventions || extras.priorityAction || "Implement evidence-based care, document findings accurately, and escalate unexpected deterioration promptly."}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-3 space-y-1">
            <div className="font-bold">Patient &amp; Family Education</div>
            <p className="muted">{extras.education || "Educate on warning signs to report immediately, medication adherence, and preventive self-care measures."}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-3 space-y-1">
            <div className="font-bold">Important Laboratory Values</div>
            <p className="muted">{extras.labs || "Correlate serum electrolytes, CBC, coagulation, renal/hepatic panels, and ABGs with clinical presentation."}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-3 space-y-1">
            <div className="font-bold">Medication &amp; Pathophysiology</div>
            <p className="muted">{extras.medications || extras.diseaseProcess || `${question.category ?? "Core domain"} — ${question.topic ?? "Pathophysiology & clinical judgment"}`}</p>
          </div>
        </div>
      </details>

      {/* 17 & 18: Add Personal Note + Practice Similar Question */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border">
        <button type="button" onClick={onOpenNote} className="btn btn-secondary btn-sm">
          <NotebookPen className="h-3.5 w-3.5 text-accent" />
          Add / Edit Personal Note
        </button>
        <Link href={`/exam/${examSlug}/create`} className="btn btn-primary btn-sm">
          <HelpCircle className="h-3.5 w-3.5" />
          Practice Similar Question in {question.topic ?? examSlug}
        </Link>
      </div>
    </div>
  );
}
