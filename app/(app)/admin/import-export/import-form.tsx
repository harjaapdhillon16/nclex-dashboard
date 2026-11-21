"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

type Report = {
  totalRows: number;
  created: number;
  duplicates: number;
  invalid: { index: number; reason: string }[];
  error?: string;
};

export function ImportForm({ exams }: { exams: { slug: string; name: string }[] }) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setReport(null);
    try {
      const res = await fetch("/api/admin/import", { method: "POST", body: new FormData(e.currentTarget) });
      setReport((await res.json()) as Report);
    } catch {
      setReport({ totalRows: 0, created: 0, duplicates: 0, invalid: [], error: "The upload failed. Check your connection and try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="panel panel-pad space-y-4 text-xs">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="label text-xs" htmlFor="imp-exam">
            Course
          </label>
          <select id="imp-exam" name="examSlug" defaultValue="nclex-rn" className="field text-xs">
            {exams.map((e) => (
              <option key={e.slug} value={e.slug}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label text-xs" htmlFor="imp-file">
            File (.csv, .xlsx or .json)
          </label>
          <input id="imp-file" name="file" type="file" accept=".csv,.xlsx,.xls,.json" className="field py-2 text-xs" />
        </div>
      </div>

      <details>
        <summary className="cursor-pointer select-none font-semibold text-accent">Or paste JSON</summary>
        <textarea
          name="rawJson"
          rows={5}
          placeholder='[{"topic":"Prioritization","type":"mcq","stem":"…","content":{"options":[{"id":"a","text":"…"},{"id":"b","text":"…"}]},"answer":{"correct":"a"},"rationale":"…"}]'
          className="field mt-2 font-mono text-xs"
        />
      </details>

      <button type="submit" disabled={loading} className="btn btn-primary btn-sm">
        {loading ? "Importing…" : "Import as drafts"}
      </button>

      {report && (
        <div role="status" className="space-y-2 rounded-xl border border-border bg-muted/40 p-3">
          {report.error ? (
            <p className="font-medium text-rose-600">{report.error}</p>
          ) : (
            <>
              <p className="font-semibold">
                <CheckCircle2 className="mr-1 inline h-4 w-4 text-emerald-500" />
                {report.created} imported as drafts · {report.duplicates} duplicate{report.duplicates === 1 ? "" : "s"} skipped ·{" "}
                {report.invalid?.length ?? 0} rejected (of {report.totalRows} rows)
              </p>
              {report.invalid?.length > 0 && (
                <ul className="max-h-40 space-y-1 overflow-y-auto text-rose-600">
                  {report.invalid.map((inv, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <XCircle className="mt-0.5 h-3 w-3 shrink-0" />
                      Row {inv.index + 1}: {inv.reason}
                    </li>
                  ))}
                </ul>
              )}
              {report.created > 0 && (
                <a href="/admin/questions?source=import" className="font-semibold text-accent underline">
                  Review the imported drafts →
                </a>
              )}
            </>
          )}
        </div>
      )}
    </form>
  );
}
