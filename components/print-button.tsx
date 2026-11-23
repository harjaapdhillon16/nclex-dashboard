"use client";

import { Printer } from "lucide-react";

/** Opens the browser print dialog (which also offers "Save as PDF"). */
export function PrintButton({ label = "Print / save as PDF" }: { label?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="no-print btn btn-secondary btn-sm">
      <Printer className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
