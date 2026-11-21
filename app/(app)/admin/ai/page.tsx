import Link from "next/link";
import { asc, desc, eq } from "drizzle-orm";
import { ArrowLeft, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { aiJobs, exams, questions } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { aiEnabled } from "@/lib/ai";
import { DIFFICULTIES, DIFFICULTY_LABELS, QUESTION_TYPE_LABELS, QUESTION_TYPES } from "@/lib/questions/types";
import { runAiGeneratorAction } from "../actions";

export default async function AdminAiGeneratorPage() {
  await requireUser(["admin", "reviewer"]);
  const allExams = await db.select().from(exams).orderBy(asc(exams.displayOrder));
  const examById = new Map(allExams.map((e) => [e.id, e]));
  const jobs = await db.select().from(aiJobs).orderBy(desc(aiJobs.createdAt)).limit(20);
  const aiDrafts = await db
    .select()
    .from(questions)
    .where(eq(questions.source, "ai"))
    .orderBy(desc(questions.createdAt))
    .limit(15);

  const liveAi = aiEnabled();

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
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent" />
            Smart AI Question Generator
          </h1>
          <p className="text-xs sm:text-sm muted">
            Generate original examination-style questions, rationales, distractor explanations, and teaching points.
          </p>
        </div>

        <span className="chip bg-accent-subtle text-accent border-accent/25">
          Engine: {liveAi ? "Claude Opus 5.5 (Live API)" : "Template Draft Engine (Set ANTHROPIC_API_KEY for live LLM)"}
        </span>
      </div>

      {/* Mandatory Clinical Governance Banner */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-amber-800 dark:text-amber-300">
            Clinical Safety &amp; Editorial Governance Guardrail
          </div>
          <p className="muted">
            AI-generated items are <strong>always saved as Drafts</strong> (`status = &quot;draft&quot;`), never published automatically, checked against content-hash duplicate detection, and must pass Initial, Clinical, and Editorial review before publication.
          </p>
        </div>
      </div>

      {/* Generator Form */}
      <form action={runAiGeneratorAction} className="panel panel-pad space-y-5 text-xs">
        <h2 className="h-section">Configure Generation Parameters</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="label text-xs">1. Examination Course</label>
            <select name="examSlug" defaultValue="nclex-rn" className="field text-xs">
              {allExams.map((e) => (
                <option key={e.id} value={e.slug}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label text-xs">2. Category / Blueprint Section</label>
            <input
              name="category"
              defaultValue="Management of Care"
              placeholder="e.g., Management of Care / Listening"
              className="field text-xs"
            />
          </div>

          <div>
            <label className="label text-xs">3. Subject</label>
            <input
              name="subject"
              defaultValue="Adult Health"
              placeholder="e.g., Adult Health / Pharmacology"
              className="field text-xs"
            />
          </div>

          <div>
            <label className="label text-xs">4. Body System</label>
            <input
              name="system"
              defaultValue="Cardiovascular"
              placeholder="e.g., Cardiovascular / Respiratory"
              className="field text-xs"
            />
          </div>

          <div>
            <label className="label text-xs">5. Nursing / Exam Topic (Required)</label>
            <input
              name="topic"
              required
              defaultValue="Prioritization & Septic Shock"
              className="field text-xs"
            />
          </div>

          <div>
            <label className="label text-xs">6. Subtopic</label>
            <input
              name="subtopic"
              placeholder="e.g., Fluid resuscitation & vasopressors"
              className="field text-xs"
            />
          </div>

          <div>
            <label className="label text-xs">7. Patient Age</label>
            <input name="patientAge" placeholder="e.g., 68-year-old older adult" className="field text-xs" />
          </div>

          <div>
            <label className="label text-xs">8. Clinical Setting</label>
            <input name="setting" placeholder="e.g., Emergency Department / ICU" className="field text-xs" />
          </div>

          <div>
            <label className="label text-xs">9. Question Format</label>
            <select name="type" defaultValue="mcq" className="field text-xs">
              {QUESTION_TYPES.map((qt) => (
                <option key={qt} value={qt}>
                  {QUESTION_TYPE_LABELS[qt]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label text-xs">10. Difficulty Level</label>
            <select name="difficulty" defaultValue="difficult" className="field text-xs">
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {DIFFICULTY_LABELS[d]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label text-xs">11. Number of Questions (1–10)</label>
            <input name="count" type="number" min={1} max={10} defaultValue={2} className="field text-xs" />
          </div>

          <div>
            <label className="label text-xs">12. Author Instructions</label>
            <input name="notes" placeholder="Emphasize ABC prioritization…" className="field text-xs" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 pt-2 border-t border-border">
          <label className="inline-flex items-center gap-2 cursor-pointer font-medium">
            <input type="checkbox" name="includeLabs" defaultChecked className="rounded" />
            <span>Include Laboratory Values</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer font-medium">
            <input type="checkbox" name="includeMeds" defaultChecked className="rounded" />
            <span>Include Medications</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer font-medium">
            <input type="checkbox" name="clinicalJudgment" defaultChecked className="rounded" />
            <span>Include NGN Clinical Judgment Cues</span>
          </label>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary btn-sm">
            <Sparkles className="h-4 w-4" />
            Generate Original Draft Questions
          </button>
        </div>
      </form>

      {/* Recent AI Drafts & AI Generation Job Log */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="panel panel-pad space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="h-section">Generated AI Drafts Pending Review ({aiDrafts.length})</h2>
            <Link href="/admin/questions?source=ai" className="text-xs font-semibold text-accent hover:underline">
              Review &amp; Approve in Queue →
            </Link>
          </div>
          {aiDrafts.length === 0 ? (
            <p className="text-xs muted">Run the generator above to create draft questions for review.</p>
          ) : (
            <div className="divide-y divide-border text-xs">
              {aiDrafts.map((q) => (
                <div key={q.id} className="py-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-accent">{q.code}</span>
                    <span className="chip capitalize">{q.status.replace("_", " ")}</span>
                  </div>
                  <p className="font-medium line-clamp-2">{q.stem}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel panel-pad space-y-3">
          <h2 className="h-section">AI Generation Audit Jobs ({jobs.length})</h2>
          {jobs.length === 0 ? (
            <p className="text-xs muted">No AI generation jobs recorded yet.</p>
          ) : (
            <div className="table-wrapper" tabIndex={0} role="region" aria-label="AI generation jobs">
              <table className="table text-xs">
                <thead>
                  <tr>
                    <th>Exam</th>
                    <th>Engine</th>
                    <th>Created</th>
                    <th>Dupes</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((j) => (
                    <tr key={j.id}>
                      <th className="text-left">{examById.get(j.examId)?.shortName ?? j.examId}</th>
                      <td className="font-mono">{j.engine ?? "—"}</td>
                      <td className="font-bold text-emerald-600">+{j.createdCount}</td>
                      <td>{j.duplicateCount}</td>
                      <td>
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                          <CheckCircle2 className="h-3 w-3" />
                          {j.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
