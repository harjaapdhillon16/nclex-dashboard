import type {
  QuestionType, QuestionResponse, QuestionContent, QuestionAnswer,
  McqAnswer, SataAnswer, OrderedAnswer, MatrixAnswer, BowtieAnswer, HighlightAnswer, ClozeAnswer, TrendAnswer, NumericAnswer,
  MatrixContent, ClozeContent, SataContent, McqContent, TrendContent,
} from "./types";

export type Grade = {
  /** null = not auto-gradable (writing/speaking) */
  isCorrect: boolean | null;
  score: number;
  maxScore: number;
};

const set = (a: string[] = []) => new Set(a);

/** Plus/minus scoring used for NGN multiple-response & highlight items: +1 per correct selection, -1 per incorrect, floor 0. */
function plusMinus(selected: string[], correct: string[]) {
  const c = set(correct);
  let s = 0;
  for (const v of new Set(selected)) s += c.has(v) ? 1 : -1;
  return Math.max(0, s);
}

export function grade(type: QuestionType, content: QuestionContent, answer: QuestionAnswer, response: QuestionResponse | null | undefined): Grade {
  switch (type) {
    case "mcq": {
      const a = answer as McqAnswer;
      const v = response?.kind === "single" ? response.value : null;
      const ok = v === a.correct;
      return { isCorrect: ok, score: ok ? 1 : 0, maxScore: 1 };
    }
    case "sata": {
      // classic SATA: all-or-nothing
      const a = answer as SataAnswer;
      const v = response?.kind === "multi" ? response.values : [];
      const ok = v.length === a.correct.length && a.correct.every((x) => v.includes(x));
      return { isCorrect: ok, score: ok ? 1 : 0, maxScore: 1 };
    }
    case "multiple_response":
    case "highlight": {
      const a = answer as SataAnswer | HighlightAnswer;
      const v = response?.kind === "multi" ? response.values : [];
      const s = plusMinus(v, a.correct);
      return { isCorrect: s === a.correct.length && v.length === a.correct.length, score: s, maxScore: a.correct.length };
    }
    case "trend": {
      const a = answer as TrendAnswer;
      if (Array.isArray(a.correct)) {
        const v = response?.kind === "multi" ? response.values : [];
        const s = plusMinus(v, a.correct);
        return { isCorrect: s === a.correct.length && v.length === a.correct.length, score: s, maxScore: a.correct.length };
      }
      const v = response?.kind === "single" ? response.value : response?.kind === "multi" ? response.values[0] : null;
      const ok = v === a.correct;
      return { isCorrect: ok, score: ok ? 1 : 0, maxScore: 1 };
    }
    case "ordered": {
      const a = answer as OrderedAnswer;
      const v = response?.kind === "order" ? response.order : [];
      const ok = v.length === a.order.length && a.order.every((x, i) => v[i] === x);
      return { isCorrect: ok, score: ok ? 1 : 0, maxScore: 1 };
    }
    case "matrix": {
      const a = answer as MatrixAnswer;
      const c = content as MatrixContent;
      const v = response?.kind === "matrix" ? response.map : {};
      let s = 0;
      let max = 0;
      for (const row of c.rows) {
        const key = a.map[row.id];
        const got = v[row.id];
        if (Array.isArray(key)) {
          max += key.length;
          s += plusMinus(Array.isArray(got) ? got : got ? [got] : [], key);
        } else {
          max += 1;
          if (got === key) s += 1;
        }
      }
      return { isCorrect: s === max, score: s, maxScore: max };
    }
    case "bowtie": {
      const a = answer as BowtieAnswer;
      const v = response?.kind === "bowtie" ? response : { condition: undefined, actions: [], parameters: [] };
      let s = v.condition === a.condition ? 1 : 0;
      s += v.actions.filter((x) => a.actions.includes(x)).length;
      s += v.parameters.filter((x) => a.parameters.includes(x)).length;
      const max = 1 + a.actions.length + a.parameters.length;
      return { isCorrect: s === max, score: s, maxScore: max };
    }
    case "cloze": {
      const a = answer as ClozeAnswer;
      const v = response?.kind === "cloze" ? response.blanks : {};
      const keys = Object.keys((content as ClozeContent).blanks);
      const s = keys.filter((k) => v[k] && v[k] === a.blanks[k]).length;
      return { isCorrect: s === keys.length, score: s, maxScore: keys.length };
    }
    case "numeric": {
      const a = answer as NumericAnswer;
      const raw = response?.kind === "numeric" ? response.value : "";
      const n = Number(String(raw).replace(/,/g, "").trim());
      const tol = a.tolerance ?? 0.01;
      const ok = raw !== "" && Number.isFinite(n) && Math.abs(n - a.value) <= tol + 1e-9;
      return { isCorrect: ok, score: ok ? 1 : 0, maxScore: 1 };
    }
    case "writing":
    case "speaking":
      return { isCorrect: null, score: 0, maxScore: 0 };
  }
}

export function isAnswered(response: QuestionResponse | null | undefined): boolean {
  if (!response) return false;
  switch (response.kind) {
    case "single": return !!response.value;
    case "multi": return response.values.length > 0;
    case "order": return response.order.length > 0;
    case "matrix": return Object.keys(response.map).length > 0;
    case "bowtie": return !!response.condition || response.actions.length > 0 || response.parameters.length > 0;
    case "cloze": return Object.values(response.blanks).some(Boolean);
    case "numeric": return response.value.trim() !== "";
    case "text": return response.text.trim() !== "";
  }
}

/** Shuffle option order for randomized delivery (does not change ids, so keys stay valid). */
export function shuffleContent(type: QuestionType, content: QuestionContent, seed: number): QuestionContent {
  const rng = mulberry32(seed);
  const shuf = <T,>(arr: T[]) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  if (type === "mcq" || type === "sata" || type === "multiple_response" || type === "trend") {
    const c = content as McqContent | SataContent | TrendContent;
    return { ...c, options: shuf(c.options) };
  }
  if (type === "ordered") {
    const c = content as { items: { id: string; text: string }[] };
    return { ...c, items: shuf(c.items) };
  }
  return content;
}

export function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
