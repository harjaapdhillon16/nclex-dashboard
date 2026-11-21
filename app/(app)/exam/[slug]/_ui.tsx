import type { ReactNode } from "react";

/** Colour for an accuracy value (0..1). Same thresholds the unit stages use. */
export function accTone(acc: number | null | undefined) {
  if (acc == null) return { bar: "bg-muted", text: "muted" };
  if (acc >= 0.75) return { bar: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" };
  if (acc >= 0.6) return { bar: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" };
  return { bar: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" };
}

export function Bar({ value, className = "bg-accent", height = "h-1.5" }: { value: number; className?: string; height?: string }) {
  const w = Math.max(0, Math.min(100, value));
  return (
    <div className={`${height} w-full overflow-hidden rounded-full bg-muted`}>
      <div className={`h-full rounded-full ${className}`} style={{ width: `${w}%` }} />
    </div>
  );
}

export type DonutSegment = { label: string; value: number; stroke: string; dot: string };

/** Segmented ring. Segments are drawn in order, clockwise from 12 o'clock. */
export function Donut({
  segments,
  center,
  sub,
  size = 132,
}: {
  segments: DonutSegment[];
  center: ReactNode;
  sub?: ReactNode;
  size?: number;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = 46;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img" aria-label="Question bank usage">
        <circle cx="60" cy="60" r={r} fill="none" strokeWidth="14" className="stroke-muted" />
        {total > 0 &&
          segments.map((s) => {
            if (s.value <= 0) return null;
            const len = (s.value / total) * c;
            const el = (
              <circle
                key={s.label}
                cx="60"
                cy="60"
                r={r}
                fill="none"
                strokeWidth="14"
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
                className={s.stroke}
              />
            );
            offset += len;
            return el;
          })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-2xl font-bold leading-none">{center}</div>
        {sub && <div className="mt-1 text-[11px] muted">{sub}</div>}
      </div>
    </div>
  );
}

export function SectionHeading({ title, caption, right }: { title: string; caption?: string; right?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <h2 className="text-base font-bold">{title}</h2>
        {caption && <p className="text-xs muted">{caption}</p>}
      </div>
      {right}
    </div>
  );
}
