import Link from "next/link";
import { asc, desc, eq } from "drizzle-orm";
import { Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { aiJobs, exams, questions } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { aiEnabled } from "@/lib/ai";
import { DIFFICULTIES, DIFFICULTY_LABELS, QUESTION_TYPE_LABELS, QUESTION_TYPES } from "@/lib/questions/types";
import { runAiGeneratorAction } from "../actions";

export default async function GenerateDraftsPage() {
  await requireUser(["admin", "reviewer"]);
  const [allExams, jobs, drafts] = await Promise.all([
    db.select().from(exams).orderBy(asc(exams.displayOrder)),
    db.select().from(aiJobs).orderBy(desc(aiJobs.createdAt)).limit(8),
    db.select().from(questions).where(eq(questions.source, "ai")).orderBy(desc(questions.createdAt)).limit(8),
  ]);
  const examById = new Map(allExams.map((e) => [e.id, e]));
  const latest = jobs[0];
  const live = aiEnabled();

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Generate drafts</h1>
        <p className="text-sm muted max-w-2xl">
          Describe the topic and get original draft questions. Drafts are never published automatically. They land in the{" "}
          <Link href="/admin/questions?source=ai" className="text-accent underline">
            review queue
          </Link>{" "}
          and must be approved by a person.
        </p>
        {!live && (
          <p className="text-xs muted">
            No <code className="font-mono">ANTHROPIC_API_KEY</code> is set, so a basic template engine is used. Add a key for real
            generated questions.
          </p>
        )}
      </header>

      {/* Result of the last run, shown right where you submitted */}
      {latest && (
        <div
          role="status"
          className={`rounded-xl border px-4 py-3 text-xs ${
            latest.status === "failed"
              ? "border-rose-500/40 bg-rose-500/10"
              : "border-emerald-500/40 bg-emerald-500/10"
          }`}
        >
          <strong>Last run ({examById.get(latest.examId)?.shortName ?? "course"}):</strong>{" "}
          {latest.status === "failed"
            ? `failed — ${latest.error ?? "unknown error"}`
            : `${latest.createdCount} draft${latest.createdCount === 1 ? "" : "s"} created${
                latest.duplicateCount ? `, ${latest.duplicateCount} skipped as duplicates` : ""
              }.`}{" "}
          {latest.status !== "failed" && (
            <Link href="/admin/questions?source=ai" className="font-semibold text-accent underline">
              Review them →
            </Link>
          )}
        </div>
      )}

      <form action={runAiGeneratorAction} className="panel panel-pad space-y-4 text-xs">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label text-xs">Course</label>
            <select name="examSlug" defaultValue="nclex-rn" className="field text-xs">
              {allExams.map((e) => (
                <option key={e.id} value={e.slug}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label text-xs">Unit (blueprint category or section)</label>
            <input name="category" placeholder="e.g. Management of Care" className="field text-xs" />
          </div>
          <div className="sm:col-span-2">
            <label className="label text-xs">Topic</label>
            <input name="topic" required placeholder="e.g. Prioritizing care in septic shock" className="field text-xs" />
          </div>
          <div>
            <label className="label text-xs">Format</label>
            <select name="type" defaultValue="mcq" className="field text-xs">
              {QUESTION_TYPES.map((qt) => (
                <option key={qt} value={qt}>
                  {QUESTION_TYPE_LABELS[qt]}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label text-xs">Difficulty</label>
              <select name="difficulty" defaultValue="moderate" className="field text-xs">
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {DIFFICULTY_LABELS[d]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label text-xs">How many (1–10)</label>
              <input name="count" type="number" min={1} max={10} defaultValue={5} className="field text-xs" />
            </div>
          </div>
        </div>

        <details>
          <summary className="cursor-pointer select-none font-semibold text-accent">More options</summary>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label text-xs">Subject</label>
              <input name="subject" placeholder="e.g. Adult Health" className="field text-xs" />
            </div>
            <div>
              <label className="label text-xs">Body system</label>
              <input name="system" placeholder="e.g. Cardiovascular" className="field text-xs" />
            </div>
            <div>
              <label className="label text-xs">Patient age</label>
              <input name="patientAge" placeholder="e.g. 68-year-old" className="field text-xs" />
            </div>
            <div>
              <label className="label text-xs">Setting</label>
              <input name="setting" placeholder="e.g. Emergency department" className="field text-xs" />
            </div>
            <div className="sm:col-span-2">
              <label className="label text-xs">Instructions for the writer</label>
              <input name="notes" placeholder="e.g. Emphasize airway-first prioritization" className="field text-xs" />
            </div>
            <div className="flex flex-wrap gap-4 sm:col-span-2">
              <label className="inline-flex cursor-pointer items-center gap-2">
                <input type="checkbox" name="includeLabs" className="rounded" />
                Include lab values
              </label>
              <label className="inline-flex cursor-pointer items-center gap-2">
                <input type="checkbox" name="includeMeds" className="rounded" />
                Include medications
              </label>
              <label className="inline-flex cursor-pointer items-center gap-2">
                <input type="checkbox" name="clinicalJudgment" className="rounded" />
                Clinical-judgment cues
              </label>
            </div>
          </div>
        </details>

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary btn-sm">
            <Sparkles className="h-4 w-4" />
            Generate drafts
          </button>
        </div>
      </form>

      {drafts.length > 0 && (
        <section className="panel panel-pad space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="h-section">Recent generated drafts</h2>
            <Link href="/admin/questions?source=ai" className="text-xs font-semibold text-accent hover:underline">
              Open in review queue →
            </Link>
          </div>
          <ul className="divide-y divide-border text-xs">
            {drafts.map((q) => (
              <li key={q.id} className="space-y-0.5 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-accent">{q.code}</span>
                  <span className="chip capitalize">{q.status.replace("_", " ")}</span>
                </div>
                <p className="line-clamp-2 font-medium">{q.stem}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
