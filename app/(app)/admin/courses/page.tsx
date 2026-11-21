import Link from "next/link";
import { asc } from "drizzle-orm";
import { PlusCircle } from "lucide-react";
import { db } from "@/lib/db";
import { examCategories, exams } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { createOrUpdateExamCourseAction } from "../actions";

export default async function CoursesPage() {
  const staff = await requireUser(["admin", "reviewer"]);
  const [categories, allExams] = await Promise.all([
    db.select().from(examCategories).orderBy(asc(examCategories.displayOrder)),
    db.select().from(exams).orderBy(asc(exams.displayOrder)),
  ]);
  const catById = new Map(categories.map((c) => [c.id, c.name]));
  const canEdit = staff.role === "admin";

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Courses</h1>
        <p className="text-sm muted max-w-2xl">
          Turn a course on or off for learners, and add courses, units, topics or lessons. See how much content each course has on the{" "}
          <Link href="/admin" className="text-accent underline">
            Content
          </Link>{" "}
          page.
        </p>
        {!canEdit && <p className="text-xs muted">Only admins can change courses.</p>}
      </header>

      <section className="panel panel-pad">
        <ul className="divide-y divide-border">
          {allExams.map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <Link href={`/exam/${e.slug}`} className="text-sm font-semibold hover:text-accent hover:underline">
                  {e.name}
                </Link>
                <div className="text-xs muted">
                  {catById.get(e.categoryId)} · mock exam {e.mockQuestionCount} questions in {e.durationMinutes} min
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`chip text-[11px] font-semibold ${
                    e.status === "published"
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                      : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                  }`}
                >
                  {e.status === "published" ? "Visible" : "Hidden"}
                </span>
                <form action={createOrUpdateExamCourseAction}>
                  <input type="hidden" name="actionMode" value="toggle_status" />
                  <input type="hidden" name="examId" value={e.id} />
                  <input type="hidden" name="status" value={e.status === "published" ? "disabled" : "published"} />
                  <button type="submit" disabled={!canEdit} className="btn btn-secondary btn-sm">
                    {e.status === "published" ? "Hide" : "Show"}
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {canEdit && (
        <div className="space-y-3">
          <details className="panel panel-pad">
            <summary className="flex cursor-pointer select-none items-center gap-2 text-sm font-bold text-accent">
              <PlusCircle className="h-4 w-4" />
              Add a course
            </summary>
            <form action={createOrUpdateExamCourseAction} className="mt-4 space-y-3 text-xs">
              <input type="hidden" name="actionMode" value="create" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="label text-xs">Group</label>
                  <select name="categoryId" className="field text-xs">
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label text-xs">Name</label>
                  <input name="name" required placeholder="e.g. CCRN Critical Care" className="field text-xs" />
                </div>
                <div>
                  <label className="label text-xs">Short name</label>
                  <input name="shortName" required placeholder="e.g. CCRN" className="field text-xs" />
                </div>
                <div>
                  <label className="label text-xs">Mock exam length (minutes)</label>
                  <input name="durationMinutes" type="number" defaultValue={180} className="field text-xs" />
                </div>
                <div>
                  <label className="label text-xs">Mock exam questions</label>
                  <input name="mockQuestionCount" type="number" defaultValue={100} className="field text-xs" />
                </div>
              </div>
              <div>
                <label className="label text-xs">Description</label>
                <textarea name="description" rows={2} className="field text-xs" />
              </div>
              <button type="submit" className="btn btn-primary btn-sm">
                Create and show course
              </button>
            </form>
          </details>

          <details className="panel panel-pad">
            <summary className="flex cursor-pointer select-none items-center gap-2 text-sm font-bold text-accent">
              <PlusCircle className="h-4 w-4" />
              Add a unit or topic
            </summary>
            <form action={createOrUpdateExamCourseAction} className="mt-4 space-y-3 text-xs">
              <input type="hidden" name="actionMode" value="add_taxonomy" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                <div>
                  <label className="label text-xs">Course</label>
                  <select name="examId" className="field text-xs">
                    {allExams.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label text-xs">Type</label>
                  <select name="kind" defaultValue="category" className="field text-xs">
                    <option value="category">Unit (blueprint category)</option>
                    <option value="section">Unit (exam section)</option>
                    <option value="topic">Topic</option>
                    <option value="subject">Subject</option>
                    <option value="system">Body system</option>
                  </select>
                </div>
                <div>
                  <label className="label text-xs">Name</label>
                  <input name="name" required className="field text-xs" />
                </div>
                <div>
                  <label className="label text-xs">Exam weight % (optional)</label>
                  <input name="weight" type="number" step="0.5" className="field text-xs" />
                </div>
              </div>
              <button type="submit" className="btn btn-secondary btn-sm">
                Add
              </button>
            </form>
          </details>

          <details className="panel panel-pad">
            <summary className="flex cursor-pointer select-none items-center gap-2 text-sm font-bold text-accent">
              <PlusCircle className="h-4 w-4" />
              Add a lesson
            </summary>
            <form action={createOrUpdateExamCourseAction} className="mt-4 space-y-3 text-xs">
              <input type="hidden" name="actionMode" value="add_material" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="label text-xs">Course</label>
                  <select name="examId" className="field text-xs">
                    {allExams.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label text-xs">Kind</label>
                  <select name="kind" defaultValue="notes" className="field text-xs">
                    <option value="notes">Notes</option>
                    <option value="guide">Guide</option>
                    <option value="video">Video outline</option>
                  </select>
                </div>
                <div>
                  <label className="label text-xs">Title</label>
                  <input name="title" required className="field text-xs" />
                </div>
              </div>
              <div>
                <label className="label text-xs">One-line summary</label>
                <input name="summary" className="field text-xs" />
              </div>
              <div>
                <label className="label text-xs">Lesson text (Markdown)</label>
                <textarea name="body" required rows={6} className="field text-xs" />
              </div>
              <div>
                <label className="label text-xs">Topic (optional)</label>
                <input name="topic" placeholder="Exact name of an existing topic, e.g. Delegation" className="field text-xs" />
                <p className="mt-1 muted">
                  Linking a topic places the lesson under the right unit on the learning path. Without one it appears under “More
                  reading”.
                </p>
              </div>
              <button type="submit" className="btn btn-secondary btn-sm">
                Publish lesson
              </button>
            </form>
          </details>
        </div>
      )}
    </div>
  );
}
