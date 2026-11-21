import React from "react";

/**
 * Renders inline markdown (**bold**, *italic*, `code`) into clean React nodes
 * so raw markdown characters never appear in the UI.
 */
export function renderInlineMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*)/g);
  return tokens.filter(Boolean).map((tok, idx) => {
    if (tok.startsWith("**") && tok.endsWith("**") && tok.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-foreground">
          {tok.slice(2, -2)}
        </strong>
      );
    }
    if (tok.startsWith("`") && tok.endsWith("`") && tok.length > 2) {
      return (
        <code key={idx} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]">
          {tok.slice(1, -1)}
        </code>
      );
    }
    if (tok.startsWith("*") && tok.endsWith("*") && tok.length > 2) {
      return <em key={idx}>{tok.slice(1, -1)}</em>;
    }
    return <React.Fragment key={idx}>{tok}</React.Fragment>;
  });
}

/**
 * Full block + inline Markdown renderer supporting headings (#, ##, ###),
 * blockquotes (>), unordered lists (- / *), ordered lists (1.), GFM tables (|...|),
 * and paragraphs with inline formatting.
 */
export function MarkdownText({
  text,
  className = "",
}: {
  text: string | null | undefined;
  className?: string;
}) {
  if (!text) return null;

  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i]!;
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Headings
    if (trimmed.startsWith("### ")) {
      blocks.push(
        <h4 key={`h3-${i}`} className="text-sm font-bold tracking-tight mt-4 mb-1.5 text-foreground">
          {renderInlineMarkdown(trimmed.slice(4))}
        </h4>,
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      blocks.push(
        <h3 key={`h2-${i}`} className="text-base font-bold tracking-tight mt-5 mb-2 text-foreground">
          {renderInlineMarkdown(trimmed.slice(3))}
        </h3>,
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("# ")) {
      blocks.push(
        <h2 key={`h1-${i}`} className="text-lg font-bold tracking-tight mt-2 mb-2.5 text-foreground">
          {renderInlineMarkdown(trimmed.slice(2))}
        </h2>,
      );
      i++;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i]!.trim().startsWith(">")) {
        quoteLines.push(lines[i]!.trim().replace(/^>\s?/, ""));
        i++;
      }
      blocks.push(
        <blockquote
          key={`bq-${i}`}
          className="my-3 rounded-xl border-l-3 border-accent bg-accent-subtle/60 px-4 py-2.5 text-xs sm:text-sm leading-relaxed"
        >
          {renderInlineMarkdown(quoteLines.join(" "))}
        </blockquote>,
      );
      continue;
    }

    // Markdown table
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i]!.trim().startsWith("|")) {
        tableLines.push(lines[i]!.trim());
        i++;
      }
      const parsedRows = tableLines
        .filter((l) => !/^\|[\s\-:|]+\|$/.test(l))
        .map((l) =>
          l
            .replace(/^\||\|$/g, "")
            .split("|")
            .map((cell) => cell.trim()),
        );
      if (parsedRows.length > 0) {
        const header = parsedRows[0]!;
        const bodyRows = parsedRows.slice(1);
        blocks.push(
          <div key={`tbl-${i}`} className="table-wrapper my-3 rounded-xl border border-border" tabIndex={0} role="region" aria-label="Study reference table">
            <table className="table text-xs">
              <thead>
                <tr>
                  {header.map((h, hi) => (
                    <th key={hi}>{renderInlineMarkdown(h)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci}>{renderInlineMarkdown(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        );
      }
      continue;
    }

    // Unordered list
    if (/^[-*•]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*•]\s+/.test(lines[i]!.trim())) {
        items.push(lines[i]!.trim().replace(/^[-*•]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={`ul-${i}`} className="my-2 list-disc pl-5 space-y-1.5 text-xs sm:text-sm leading-relaxed">
          {items.map((it, idx) => (
            <li key={idx}>{renderInlineMarkdown(it)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i]!.trim())) {
        items.push(lines[i]!.trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push(
        <ol key={`ol-${i}`} className="my-2 list-decimal pl-5 space-y-1.5 text-xs sm:text-sm leading-relaxed">
          {items.map((it, idx) => (
            <li key={idx}>{renderInlineMarkdown(it)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    // Standard paragraph
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i]!.trim() !== "" &&
      !lines[i]!.trim().startsWith("#") &&
      !lines[i]!.trim().startsWith(">") &&
      !lines[i]!.trim().startsWith("|") &&
      !/^[-*•]\s+/.test(lines[i]!.trim()) &&
      !/^\d+\.\s+/.test(lines[i]!.trim())
    ) {
      paraLines.push(lines[i]!.trim());
      i++;
    }
    blocks.push(
      <p key={`p-${i}`} className="my-2 text-xs sm:text-sm leading-relaxed">
        {renderInlineMarkdown(paraLines.join(" "))}
      </p>,
    );
  }

  return <div className={`space-y-1 ${className}`}>{blocks}</div>;
}
