import Link from "next/link";
import { asc, eq, sql } from "drizzle-orm";
import { ArrowLeft, CheckCircle2, GraduationCap, Layers, PlusCircle } from "lucide-react";
import { db } from "@/lib/db";
import { examCategories, exams, questions, taxonomy } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { createOrUpdateExamCourseAction } from "../actions";

export default async function AdminCoursesPage() {
  await requireUser(["admin", "reviewer"]);

  const categories = await db.select().from(examCategories).orderBy(asc(examCategories.displayOrder));
  const allExams = await db.select().from(exams).orderBy(asc(exams.displayOrder));
  const catById = new Map(categories.map((c) => [c.id, c]));

  const qCountsRaw = await db
    .select({ examId: questions.examId, n: sql<number>`count(*)::int` })
    .from(questions)
    .groupBy(questions.examId);
  const qCountByExam = new Map(qCountsRaw.map((r) => [r.examId, r.n]));

  const taxCountsRaw = await db
    .select({ examId: taxonomy.examId, n: sql<number>`count(*)::int` })
    .from(taxonomy)
    .groupBy(taxonomy.examId);
  const taxCountByExam = new Map(taxCountsRaw.map((r) => [r.examId, r.n]));

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
            <GraduationCap className="h-6 w-6 text-accent" />
            Exam Course &amp; Blueprint Management ({allExams.length} Courses)
          </h1>
          <p className="text-xs sm:text-sm muted">
            Add or configure international examination courses, syllabus taxonomy trees, study notes, duration, and publication status without code changes.
          </p>
        </div>
      </div>

      {/* Forms: Create New Examination Course / Add Taxonomy / Add Study Material */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <form action={createOrUpdateExamCourseAction} className="panel panel-pad space-y-3 text-xs">
          <input type="hidden" name="actionMode" value="create" />
          <h2 className="h-section flex items-center gap-1.5">
            <PlusCircle className="h-4 w-4 text-accent" />
            1. Create New Examination Course
          </h2>
          <div>
            <label className="label text-xs">Category Division</label>
            <select name="categoryId" className="field text-xs">
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label text-xs">Exam Full Name</label>
              <input name="name" required placeholder="e.g., CCRN Critical Care" className="field text-xs" />
            </div>
            <div>
              <label className="label text-xs">Short Name</label>
              <input name="shortName" required placeholder="e.g., CCRN" className="field text-xs" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label text-xs">Duration (Min)</label>
              <input name="durationMinutes" type="number" defaultValue={180} className="field text-xs" />
            </div>
            <div>
              <label className="label text-xs">Mock Questions</label>
              <input name="mockQuestionCount" type="number" defaultValue={125} className="field text-xs" />
            </div>
          </div>
          <div>
            <label className="label text-xs">Course Description</label>
            <textarea name="description" rows={2} placeholder="Syllabus coverage and question types…" className="field text-xs" />
          </div>
          <button type="submit" className="btn btn-primary btn-sm w-full">
            Create &amp; Publish Course
          </button>
        </form>

        <form action={createOrUpdateExamCourseAction} className="panel panel-pad space-y-3 text-xs">
          <input type="hidden" name="actionMode" value="add_taxonomy" />
          <h2 className="h-section flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-accent" />
            2. Add Subject / Section / System / Topic
          </h2>
          <div>
            <label className="label text-xs">Target Examination</label>
            <select name="examId" className="field text-xs">
              {allExams.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label text-xs">Node Type</label>
              <select name="kind" defaultValue="topic" className="field text-xs">
                <option value="category">Category</option>
                <option value="subject">Subject</option>
                <option value="section">Section</option>
                <option value="system">Body System</option>
                <option value="topic">Topic</option>
                <option value="subtopic">Subtopic</option>
              </select>
            </div>
            <div>
              <label className="label text-xs">Blueprint Weight %</label>
              <input name="weight" type="number" placeholder="Optional (e.g. 15)" className="field text-xs" />
            </div>
          </div>
          <div>
            <label className="label text-xs">Node Name</label>
            <input name="name" required placeholder="e.g., Hemodynamic Monitoring" className="field text-xs" />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm w-full">
            Add to Exam Syllabus Tree
          </button>
        </form>

        <form action={createOrUpdateExamCourseAction} className="panel panel-pad space-y-3 text-xs">
          <input type="hidden" name="actionMode" value="add_material" />
          <h2 className="h-section flex items-center gap-1.5">
            <PlusCircle className="h-4 w-4 text-accent" />
            3. Upload Study Note / Guide / Video
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label text-xs">Examination</label>
              <select name="examId" className="field text-xs">
                {allExams.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.shortName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label text-xs">Material Kind</label>
              <select name="kind" defaultValue="notes" className="field text-xs">
                <option value="notes">Topic-Wise Notes</option>
                <option value="guide">High-Yield Study Guide</option>
                <option value="video">Video Lecture</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label text-xs">Title</label>
            <input name="title" required placeholder="e.g., Cardiac Dysrhythmia Rapid Review" className="field text-xs" />
          </div>
          <div>
            <label className="label text-xs">Content Body / Outline</label>
            <textarea name="body" required rows={3} placeholder="Key clinical pearls, lab ranges, and nursing actions…" className="field text-xs" />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm w-full">
            Publish Study Material
          </button>
        </form>
      </div>

      {/* Catalogue Table */}
      <section className="panel panel-pad space-y-3">
        <h2 className="h-section">Configurable International Exam Catalogue ({allExams.length} Courses)</h2>
        <div className="table-wrapper" tabIndex={0} role="region" aria-label="Examination courses table">
          <table className="table text-xs">
            <thead>
              <tr>
                <th>Exam Name</th>
                <th>Category</th>
                <th>Questions</th>
                <th>Syllabus Nodes</th>
                <th>Mock Spec</th>
                <th>Blueprint Validation</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allExams.map((e) => (
                <tr key={e.id}>
                  <th className="text-left">
                    <Link href={`/exam/${e.slug}`} className="font-bold text-accent hover:underline">
                      {e.name}
                    </Link>
                    <div className="font-mono text-[10px] muted">{e.slug}</div>
                  </th>
                  <td>{catById.get(e.categoryId)?.name ?? "—"}</td>
                  <td className="font-bold">{qCountByExam.get(e.id) ?? 0}</td>
                  <td>{taxCountByExam.get(e.id) ?? 0}</td>
                  <td>
                    {e.mockQuestionCount} Q · {e.durationMinutes}m
                  </td>
                  <td>
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {e.blueprint?.version ?? "2026.1"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`chip text-[11px] capitalize ${
                        e.status === "published"
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : "bg-amber-500/15 text-amber-700"
                      }`}
                    >
                      {e.status}
                    </span>
                  </td>
                  <td>
                    <form action={createOrUpdateExamCourseAction}>
                      <input type="hidden" name="actionMode" value="toggle_status" />
                      <input type="hidden" name="examId" value={e.id} />
                      <input
                        type="hidden"
                        name="status"
                        value={e.status === "published" ? "disabled" : "published"}
                      />
                      <button type="submit" className="btn btn-secondary btn-sm">
                        {e.status === "published" ? "Disable" : "Publish"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
