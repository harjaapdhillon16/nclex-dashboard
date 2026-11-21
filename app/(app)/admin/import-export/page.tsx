import { asc } from "drizzle-orm";
import { Download } from "lucide-react";
import { db } from "@/lib/db";
import { exams } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { ImportForm } from "./import-form";

const EXPORTS = [
  ["template", "Import template", "One example row with the right columns."],
  ["questions", "All questions", "Every question with its status."],
  ["approved", "Live questions", "Only what learners can see."],
  ["cases", "Case studies", "All unfolding case studies."],
  ["results", "Learner results", "Scores and completion times."],
] as const;

export default async function ImportExportPage() {
  await requireUser(["admin", "reviewer", "instructor"]);
  const allExams = await db.select({ slug: exams.slug, name: exams.name }).from(exams).orderBy(asc(exams.displayOrder));

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Import &amp; export</h1>
        <p className="text-sm muted">Bring questions in from a spreadsheet, or take your data out.</p>
      </header>

      <section className="space-y-3">
        <h2 className="h-section">Import questions</h2>
        <div className="panel panel-pad text-xs space-y-1">
          <p>
            <strong>Required columns:</strong> <code className="font-mono">topic, type, stem, correct, rationale</code> and the options{" "}
            <code className="font-mono">optA…optD</code>.
          </p>
          <p>
            <strong>Optional:</strong> <code className="font-mono">category</code> (the unit), <code className="font-mono">subject</code>,{" "}
            <code className="font-mono">system</code>, <code className="font-mono">difficulty</code>. For select-all, list several in{" "}
            <code className="font-mono">correct</code> (a,c).
          </p>
          <p className="muted">
            Everything imports as a draft. Rows with missing text, a bad answer key or a duplicate are skipped and listed below.
          </p>
        </div>
        <ImportForm exams={allExams} />
      </section>

      <section className="panel panel-pad space-y-3">
        <h2 className="h-section">Export</h2>
        <ul className="divide-y divide-border text-xs">
          {EXPORTS.map(([entity, title, desc]) => (
            <li key={entity} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-semibold">{title}</div>
                <div className="muted">{desc}</div>
              </div>
              <div className="flex gap-1.5">
                {(["csv", "xlsx", "json"] as const).map((f) => (
                  <a key={f} href={`/api/admin/export?entity=${entity}&format=${f}`} className="btn btn-secondary btn-sm">
                    <Download className="h-3 w-3" />
                    {f === "xlsx" ? "Excel" : f.toUpperCase()}
                  </a>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
