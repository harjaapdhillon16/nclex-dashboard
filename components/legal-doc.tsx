import type { ReactNode } from "react";
import { LEGAL } from "@/lib/legal";

/** Shared typography for the legal pages. */
export function LegalDoc({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <article className="space-y-6">
      <header className="space-y-2 border-b border-border pb-5">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-xs muted">Last updated {LEGAL.updated}</p>
        <p className="text-sm leading-relaxed muted">{intro}</p>
      </header>
      {children}
    </article>
  );
}

export function LegalSection({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`s${n}`} className="space-y-2.5">
      <h2 id={`s${n}`} className="text-lg font-semibold">
        {n}. {title}
      </h2>
      <div className="space-y-2.5 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {items.map((i, k) => (
        <li key={k}>{i}</li>
      ))}
    </ul>
  );
}
