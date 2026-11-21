"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Download, FileSpreadsheet, Upload, XCircle } from "lucide-react";

type ValidationReport = {
  totalRows: number;
  created: number;
  duplicates: number;
  invalid: { index: number; reason: string }[];
  error?: string;
};

export default function AdminImportExportPage() {
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleImport(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setReport(null);
    try {
      const fd = new FormData(e.currentTarget);
      const res = await fetch("/api/admin/import", { method: "POST", body: fd });
      const data = (await res.json()) as ValidationReport;
      setReport(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-medium muted hover:text-foreground mb-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Admin Console
        </Link>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FileSpreadsheet className="h-6 w-6 text-accent" />
          Bulk Import &amp; Export Center (Excel, CSV &amp; JSON)
        </h1>
        <p className="text-xs sm:text-sm muted">
          Validate and import question banks or case study templates, and export approved content, test results, and student analytics.
        </p>
      </div>

      {/* Export Cards */}
      <section className="panel panel-pad space-y-4">
        <div>
          <h2 className="h-section">1. Export Question Banks, Results, Case Studies &amp; Templates</h2>
          <p className="text-xs muted">Download structured datasets in CSV, Excel (.xlsx), or JSON format.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {(
            [
              ["template", "Import Template", "Sample question bank template with column headers"],
              ["questions", "Full Question Bank", "All questions with status, source, stem & rationales"],
              ["approved", "Approved & Published", "Validated production question bank"],
              ["cases", "NGN Case Studies", "All 6-step unfolding clinical case studies"],
              ["results", "Student Test Results", "Score reports, accuracy & completion time analytics"],
            ] as const
          ).map(([entity, title, desc]) => (
            <div key={entity} className="rounded-xl border border-border p-3.5 flex flex-col justify-between space-y-3">
              <div>
                <div className="font-bold text-sm">{title}</div>
                <p className="muted mt-1">{desc}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <a href={`/api/admin/export?entity=${entity}&format=csv`} className="btn btn-secondary btn-sm flex-1">
                  <Download className="h-3 w-3" />
                  CSV
                </a>
                <a href={`/api/admin/export?entity=${entity}&format=xlsx`} className="btn btn-secondary btn-sm flex-1">
                  Excel
                </a>
                <a href={`/api/admin/export?entity=${entity}&format=json`} className="btn btn-secondary btn-sm flex-1">
                  JSON
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Import Form with Validation Rules */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <form onSubmit={handleImport} className="panel panel-pad lg:col-span-2 space-y-4 text-xs">
          <h2 className="h-section flex items-center gap-2">
            <Upload className="h-4 w-4 text-accent" />
            2. Validate &amp; Import Questions (CSV, Excel .xlsx, or JSON)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label text-xs">Target Examination Course</label>
              <select name="examSlug" defaultValue="nclex-rn" className="field text-xs">
                <option value="nclex-rn">NCLEX-RN</option>
                <option value="nclex-pn">NCLEX-PN</option>
                <option value="usmle-step-1">USMLE Step 1</option>
                <option value="usmle-step-2-ck">USMLE Step 2 CK</option>
                <option value="ielts-academic">IELTS Academic</option>
                <option value="oet-nursing">OET Nursing</option>
                <option value="mcat">MCAT</option>
                <option value="sat">SAT</option>
                <option value="cpa">CPA Exam</option>
              </select>
            </div>

            <div>
              <label className="label text-xs">Upload File (.csv, .xlsx, .json)</label>
              <input name="file" type="file" accept=".csv,.xlsx,.xls,.json" className="field text-xs py-2" />
            </div>
          </div>

          <div>
            <label className="label text-xs">Or Paste JSON Array Directly</label>
            <textarea
              name="rawJson"
              rows={5}
              placeholder='[{"topic":"Prioritization","type":"mcq","difficulty":"moderate","stem":"...","content":{"options":[{"id":"a","text":"..."},{"id":"b","text":"..."}]},"answer":{"correct":"a"},"rationale":"..."}]'
              className="field font-mono text-xs"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-sm">
            {loading ? "Validating & Importing…" : "Run Validation & Import as Drafts"}
          </button>
        </form>

        <div className="panel panel-pad space-y-3 text-xs">
          <h3 className="h-section">Automated Validation Checks</h3>
          <ul className="space-y-2 muted">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Rejects missing question stem text</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Rejects missing or out-of-range answer keys</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Rejects invalid question format types</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Rejects missing topic assignment</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Validates minimum option counts per format</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>SHA-256 content-hash duplicate prevention</span>
            </li>
          </ul>

          {report && (
            <div className="rounded-xl border border-border bg-muted/40 p-3 space-y-2 mt-3">
              <div className="font-bold text-sm">Import Validation Report</div>
              {report.error ? (
                <p className="text-rose-600">{report.error}</p>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-emerald-500/15 p-2">
                      <div className="font-bold text-emerald-700">+{report.created}</div>
                      <div className="text-[10px]">Created</div>
                    </div>
                    <div className="rounded-lg bg-amber-500/15 p-2">
                      <div className="font-bold text-amber-700">{report.duplicates}</div>
                      <div className="text-[10px]">Duplicates</div>
                    </div>
                    <div className="rounded-lg bg-rose-500/15 p-2">
                      <div className="font-bold text-rose-700">{report.invalid?.length ?? 0}</div>
                      <div className="text-[10px]">Invalid</div>
                    </div>
                  </div>
                  {report.invalid?.length > 0 && (
                    <ul className="space-y-1 text-rose-600 max-h-32 overflow-y-auto">
                      {report.invalid.map((inv, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <XCircle className="h-3 w-3 shrink-0" />
                          Row #{inv.index + 1}: {inv.reason}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
