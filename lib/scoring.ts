import type { ScoringModel } from "@/lib/seed/catalog";

export type Bucket = { correct: number; total: number; points: number; max: number; time: number };
export type Breakdown = Record<string, Record<string, Bucket>>;

export type Estimate = {
  model: ScoringModel["type"];
  headline: string; // e.g. "Band 6.5", "512", "High readiness"
  label: string; // e.g. "Estimated band score"
  sections?: { name: string; value: string; percent: number }[];
  level?: "strong" | "moderate" | "weak";
  pass?: boolean | null;
  detail?: string;
  disclaimer: string;
};

export const DISCLAIMER = "Practice estimate only — not an official score, prediction or examination result.";

const pct = (b?: Bucket) => (b && b.max > 0 ? b.points / b.max : b && b.total > 0 ? b.correct / b.total : null);
const roundTo = (v: number, step: number) => Math.round(v / step) * step;
const level = (p: number): Estimate["level"] => (p >= 0.7 ? "strong" : p >= 0.55 ? "moderate" : "weak");

const IELTS_TABLE: [number, number][] = [[0.97, 9], [0.9, 8.5], [0.84, 8], [0.77, 7.5], [0.7, 7], [0.62, 6.5], [0.55, 6], [0.46, 5.5], [0.38, 5], [0.3, 4.5], [0.22, 4], [0.15, 3.5], [0.08, 3], [0, 2.5]];
export const ieltsBand = (p: number) => IELTS_TABLE.find(([t]) => p >= t)![1];

/**
 * p = overall proportion of points earned (0..1)
 * difficultyWeighted = proportion with harder items weighted more (used for NCLEX readiness)
 * sectionBreakdown = breakdown keyed by section/category name
 * aiBands = band/score values from AI-evaluated writing/speaking responses (0..1 normalised)
 */
export function estimate(model: ScoringModel, p: number, opts: { difficultyWeighted?: number; sections?: Record<string, Bucket>; productive?: number[] } = {}): Estimate {
  const base = { disclaimer: DISCLAIMER, model: model.type } as const;
  // Blend auto-graded proportion with AI-assessed productive skills (writing/speaking) if present.
  const blended = opts.productive?.length ? (p + opts.productive.reduce((a, b) => a + b, 0) / opts.productive.length) / 2 : p;

  switch (model.type) {
    case "nclex": {
      const r = opts.difficultyWeighted ?? p;
      const lvl = r >= 0.72 ? "Very high" : r >= 0.63 ? "High" : r >= 0.55 ? "Borderline" : "Low";
      return {
        ...base,
        label: "Educational readiness",
        headline: `${lvl} readiness`,
        level: r >= 0.63 ? "strong" : r >= 0.55 ? "moderate" : "weak",
        detail: `Difficulty-weighted performance ${(r * 100).toFixed(0)}%. Readiness bands are an internal educational heuristic and do not use NCSBN scoring.`,
      };
    }
    case "percent": {
      const pass = model.passPercent != null ? blended * 100 >= model.passPercent : null;
      return { ...base, label: "Percent correct", headline: `${(blended * 100).toFixed(0)}%`, level: level(blended), pass, detail: model.passPercent ? `Internal practice target: ${model.passPercent}%` : undefined };
    }
    case "passfail": {
      const pass = blended * 100 >= model.passPercent;
      return { ...base, label: "Practice outcome", headline: pass ? "Above practice target" : "Below practice target", level: level(blended), pass, detail: `${(blended * 100).toFixed(0)}% vs internal target ${model.passPercent}%` };
    }
    case "band": {
      const sections = opts.sections
        ? Object.entries(opts.sections).map(([name, b]) => {
            const sp = pct(b) ?? blended;
            return { name, value: ieltsBand(sp).toFixed(1), percent: sp };
          })
        : undefined;
      const overall = sections?.length ? roundTo(sections.reduce((a, s) => a + Number(s.value), 0) / sections.length, 0.5) : ieltsBand(blended);
      return { ...base, label: "Estimated band score", headline: `Band ${overall.toFixed(1)}`, sections, level: level(blended) };
    }
    case "grade": {
      const score = Math.round(blended * model.max);
      const g = model.scale.find((s) => score >= s.min)?.grade ?? "E";
      const sections = opts.sections
        ? Object.entries(opts.sections).map(([name, b]) => {
            const sp = pct(b) ?? blended;
            const sc = Math.round(sp * model.max);
            return { name, value: `${model.scale.find((s) => sc >= s.min)?.grade ?? "E"} (${sc})`, percent: sp };
          })
        : undefined;
      return { ...base, label: "Estimated grade", headline: `Grade ${g} · ${score}/${model.max}`, sections, level: level(blended) };
    }
    case "scaled": {
      const step = model.step ?? 1;
      const map = (pp: number, min: number, max: number) => roundTo(min + (max - min) * Math.min(1, Math.max(0, pp)), step);
      let sections: Estimate["sections"];
      let total: number;
      if (model.sections?.length) {
        sections = model.sections.map((s) => {
          const sp = pct(opts.sections?.[s.name]) ?? blended;
          return { name: s.name, value: String(map(sp, s.min, s.max)), percent: sp };
        });
        total = model.totalFromSections ? sections.reduce((a, s) => a + Number(s.value), 0) : model.sections.length && model.label === "Composite" ? Math.round(sections.reduce((a, s) => a + Number(s.value), 0) / sections.length) : map(blended, model.min, model.max);
      } else {
        total = map(blended, model.min, model.max);
      }
      const pass = model.passMark != null ? total >= model.passMark : null;
      return { ...base, label: `Estimated ${model.label ?? "scaled score"}`, headline: String(total), sections, pass, level: level(blended), detail: model.passMark ? `Practice reference mark: ${model.passMark}` : undefined };
    }
  }
}
