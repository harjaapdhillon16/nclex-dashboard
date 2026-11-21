/**
 * Educational computerized-adaptive-testing simulation (1-parameter logistic / Rasch).
 * NOT an official NCLEX/NCSBN scoring algorithm — clearly labelled as a simulation in the UI.
 */
export const DIFFICULTY_B: Record<string, number> = { easy: -1.5, moderate: -0.5, difficult: 0.4, advanced: 1.1, challenge: 1.8 };

export type CatState = {
  theta: number;
  se: number;
  passingStandard: number;
  min: number;
  max: number;
  history: { qid: number; b: number; x: number }[];
  categoryCounts: Record<string, number>;
  done: boolean;
  decision?: "above" | "below" | "undetermined";
};

const p = (theta: number, b: number) => 1 / (1 + Math.exp(-(theta - b)));

export function initCat(min: number, max: number, passingStandard = 0): CatState {
  return { theta: 0, se: 99, passingStandard, min, max, history: [], categoryCounts: {}, done: false };
}

/** Update ability with a Newton-Raphson MLE step (bounded), falling back to a gentle step while responses are all-correct/all-wrong. */
export function updateCat(state: CatState, qid: number, difficulty: string, x: number, category?: string): CatState {
  const b = DIFFICULTY_B[difficulty] ?? 0;
  const history = [...state.history, { qid, b, x }];
  const allSame = history.every((h) => h.x === history[0].x);
  let theta = state.theta;
  if (allSame) {
    theta += x ? 0.6 : -0.6;
  } else {
    for (let i = 0; i < 20; i++) {
      let g = 0;
      let info = 0;
      for (const h of history) {
        const ph = p(theta, h.b);
        g += h.x - ph;
        info += ph * (1 - ph);
      }
      const step = g / Math.max(info, 1e-6);
      theta += Math.max(-1, Math.min(1, step));
      if (Math.abs(step) < 1e-3) break;
    }
  }
  theta = Math.max(-4, Math.min(4, theta));
  const info = history.reduce((a, h) => a + p(theta, h.b) * (1 - p(theta, h.b)), 0);
  const se = 1 / Math.sqrt(Math.max(info, 1e-6));
  const categoryCounts = { ...state.categoryCounts };
  if (category) categoryCounts[category] = (categoryCounts[category] ?? 0) + 1;

  const n = history.length;
  const confident = Math.abs(theta - state.passingStandard) > 1.96 * se;
  let done = false;
  let decision: CatState["decision"];
  if (n >= state.max) {
    done = true;
    decision = confident ? (theta > state.passingStandard ? "above" : "below") : theta > state.passingStandard ? "above" : "below";
  } else if (n >= state.min && confident) {
    done = true;
    decision = theta > state.passingStandard ? "above" : "below";
  }
  return { ...state, theta, se, history, categoryCounts, done, decision };
}

/** Pick the next item: most under-represented category vs blueprint weight, then closest difficulty to theta. */
export function pickNext<T extends { id: number; difficulty: string; categoryId: number | null }>(
  state: CatState,
  pool: T[],
  weights: Record<string, number>,
): T | null {
  const used = new Set(state.history.map((h) => h.qid));
  const avail = pool.filter((q) => !used.has(q.id));
  if (!avail.length) return null;
  const totalW = Object.values(weights).reduce((a, b) => a + b, 0) || 1;
  const n = state.history.length + 1;
  const deficit = (cat: string) => (weights[cat] ?? 0) / totalW * n - (state.categoryCounts[cat] ?? 0);
  const cats = [...new Set(avail.map((q) => String(q.categoryId)))].sort((a, b) => deficit(b) - deficit(a));
  const target = cats[0];
  const inCat = avail.filter((q) => String(q.categoryId) === target);
  inCat.sort((a, b) => Math.abs((DIFFICULTY_B[a.difficulty] ?? 0) - state.theta) - Math.abs((DIFFICULTY_B[b.difficulty] ?? 0) - state.theta) || Math.random() - 0.5);
  return inCat[0];
}

export function readinessFromTheta(theta: number, se: number, passing = 0) {
  // Probability ability exceeds passing standard under normal approx — educational indicator only.
  const z = (theta - passing) / Math.max(se, 0.05);
  const prob = 0.5 * (1 + erf(z / Math.SQRT2));
  return { probability: prob, level: prob >= 0.9 ? "Very high" : prob >= 0.7 ? "High" : prob >= 0.4 ? "Borderline" : "Low" };
}

function erf(x: number) {
  const s = Math.sign(x);
  x = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return s * y;
}
