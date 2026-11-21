import "server-only";
import { and, eq, inArray, isNull, sql, desc, asc, type SQL } from "drizzle-orm";
import { db } from "@/lib/db";
import { exams, questions, tests, testAnswers, results, taxonomy, caseStudies, bookmarks, enrollments, notes } from "@/lib/db/schema";
import type { TestKind } from "@/lib/db/schema";
import { grade, isAnswered, shuffleContent } from "@/lib/questions/grade";
import type { QuestionResponse, QuestionType, CaseSection } from "@/lib/questions/types";
import { estimate, type Bucket, type Breakdown } from "@/lib/scoring";
import { initCat, updateCat, pickNext, readinessFromTheta, type CatState } from "@/lib/adaptive";
import type { ScoringModel } from "@/lib/seed/catalog";

export type Exam = typeof exams.$inferSelect;
type Q = typeof questions.$inferSelect;

export type TestConfig = {
  categoryIds?: number[];
  subjectIds?: number[];
  systemIds?: number[];
  topicIds?: number[];
  difficulties?: string[];
  types?: string[];
  tags?: string[];
  count: number;
  mode: "tutor" | "timed" | "exam";
  pool?: "all" | "unused" | "incorrect" | "marked" | "unanswered";
  includeCases?: boolean;
  randomizeOptions?: boolean;
  timeLimitMin?: number | null;
  adaptive?: boolean;
  caseStudyId?: number;
};

/* ------------------------------------------------------------------ */
/* Pool selection                                                      */
/* ------------------------------------------------------------------ */
function poolFilter(userId: string, pool: TestConfig["pool"]): SQL | undefined {
  switch (pool) {
    case "unused":
      return sql`${questions.id} NOT IN (SELECT question_id FROM test_answers WHERE user_id = ${userId} AND response IS NOT NULL)`;
    case "incorrect":
      return sql`${questions.id} IN (SELECT DISTINCT ON (question_id) question_id FROM test_answers WHERE user_id = ${userId} AND is_correct IS NOT NULL ORDER BY question_id, answered_at DESC NULLS LAST) AND ${questions.id} IN (SELECT question_id FROM (SELECT DISTINCT ON (question_id) question_id, is_correct FROM test_answers WHERE user_id = ${userId} AND is_correct IS NOT NULL ORDER BY question_id, answered_at DESC NULLS LAST) t WHERE t.is_correct = false)`;
    case "marked":
      return sql`(${questions.id} IN (SELECT question_id FROM bookmarks WHERE user_id = ${userId}) OR ${questions.id} IN (SELECT question_id FROM test_answers WHERE user_id = ${userId} AND marked = true))`;
    case "unanswered":
      return sql`${questions.id} IN (SELECT question_id FROM test_answers ta JOIN tests t ON t.id = ta.test_id WHERE ta.user_id = ${userId} AND ta.response IS NULL AND t.status = 'completed') AND ${questions.id} NOT IN (SELECT question_id FROM test_answers WHERE user_id = ${userId} AND response IS NOT NULL)`;
    default:
      return undefined;
  }
}

function baseConds(exam: Exam, cfg: TestConfig, userId: string, standalone = true) {
  const c: (SQL | undefined)[] = [eq(questions.examId, exam.id), eq(questions.status, "published")];
  if (standalone) c.push(isNull(questions.caseStudyId));
  if (cfg.categoryIds?.length) c.push(inArray(questions.categoryId, cfg.categoryIds));
  if (cfg.subjectIds?.length) c.push(inArray(questions.subjectId, cfg.subjectIds));
  if (cfg.systemIds?.length) c.push(inArray(questions.systemId, cfg.systemIds));
  if (cfg.topicIds?.length) c.push(inArray(questions.topicId, cfg.topicIds));
  if (cfg.difficulties?.length) c.push(inArray(questions.difficulty, cfg.difficulties));
  if (cfg.types?.length) c.push(inArray(questions.type, cfg.types));
  if (cfg.tags?.length) c.push(sql`${questions.tags} && ${sql.raw(`ARRAY[${cfg.tags.map((t) => `'${t.replace(/[^a-z0-9_]/gi, "")}'`).join(",")}]::text[]`)}`);
  c.push(poolFilter(userId, cfg.pool));
  return and(...c.filter(Boolean));
}

async function pickCaseQuestionIds(exam: Exam, cfg: TestConfig, n: number): Promise<number[][]> {
  if (n <= 0) return [];
  const conds: SQL[] = [eq(caseStudies.examId, exam.id), eq(caseStudies.status, "published")];
  if (cfg.categoryIds?.length) conds.push(inArray(caseStudies.categoryId, cfg.categoryIds));
  if (cfg.caseStudyId) conds.push(eq(caseStudies.id, cfg.caseStudyId));
  const cs = await db.select({ id: caseStudies.id }).from(caseStudies).where(and(...conds)).orderBy(sql`random()`).limit(n);
  const out: number[][] = [];
  for (const c of cs) {
    const qs = await db.select({ id: questions.id }).from(questions).where(and(eq(questions.caseStudyId, c.id), eq(questions.status, "published"))).orderBy(asc(questions.caseStep));
    if (qs.length) out.push(qs.map((q) => q.id));
  }
  return out;
}

const shuffle = <T,>(a: T[]) => {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
};

/** Interleave case-study blocks (kept contiguous) among standalone ids. */
function interleave(standalone: number[], blocks: number[][]) {
  const out = [...standalone];
  for (const b of blocks) {
    const at = Math.floor(Math.random() * (out.length + 1));
    out.splice(at, 0, ...b);
  }
  return out;
}

export async function availableCount(exam: Exam, cfg: TestConfig, userId: string) {
  const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(questions).where(baseConds(exam, cfg, userId));
  return n;
}

/* ------------------------------------------------------------------ */
/* Test creation                                                       */
/* ------------------------------------------------------------------ */
export async function createTest(userId: string, exam: Exam, kind: TestKind, cfg: TestConfig, name?: string) {
  let ids: number[] = [];
  let timeLimitSec: number | null = cfg.mode === "tutor" ? null : cfg.timeLimitMin ? cfg.timeLimitMin * 60 : null;
  let adaptive: CatState | null = null;

  if (kind === "case_study") {
    const blocks = await pickCaseQuestionIds(exam, { ...cfg, categoryIds: undefined }, 1);
    ids = blocks.flat();
  } else if (kind === "assessment") {
    ids = await buildBalanced(exam, userId, 100, true);
    timeLimitSec = cfg.mode === "tutor" ? null : (cfg.timeLimitMin ?? 150) * 60;
  } else if (kind === "mock" && cfg.adaptive && exam.questionTypes.length) {
    const pool = await db.select({ id: questions.id, difficulty: questions.difficulty, categoryId: questions.categoryId }).from(questions).where(baseConds(exam, { ...cfg, count: 0 }, userId));
    const maxQ = Math.min(exam.mockQuestionCount, pool.length);
    const minQ = Math.min(Math.max(Math.round(maxQ * 0.55), 10), maxQ);
    adaptive = initCat(minQ, maxQ, (exam.scoring as { passingStandard?: number }).passingStandard ?? 0);
    const weights = await categoryWeights(exam);
    const first = pickNext(adaptive, pool, weights);
    ids = first ? [first.id] : [];
    timeLimitSec = exam.durationMinutes * 60;
  } else if (kind === "mock") {
    ids = await buildBalanced(exam, userId, exam.mockQuestionCount, !!exam.features?.caseStudies);
    timeLimitSec = exam.durationMinutes * 60;
  } else if (kind === "diagnostic" || kind === "readiness") {
    ids = await buildBalanced(exam, userId, kind === "diagnostic" ? 30 : 60, false);
    timeLimitSec = cfg.mode === "tutor" ? null : ids.length * 90;
  } else {
    if (kind === "weak") {
      const weak = await weakTopicIds(userId, exam.id);
      cfg = { ...cfg, topicIds: weak.length ? weak : cfg.topicIds };
    }
    const caseBlocks = cfg.includeCases && cfg.count >= 10 ? await pickCaseQuestionIds(exam, cfg, Math.max(1, Math.floor(cfg.count / 25))) : [];
    const caseN = caseBlocks.reduce((a, b) => a + b.length, 0);
    const rows = await db.select({ id: questions.id }).from(questions).where(baseConds(exam, cfg, userId)).orderBy(sql`random()`).limit(Math.max(0, cfg.count - caseN));
    ids = interleave(rows.map((r) => r.id), caseBlocks);
    if (cfg.mode === "timed" && !timeLimitSec) timeLimitSec = Math.max(ids.length, 1) * 90;
  }

  if (!ids.length) return null;
  const label =
    name ??
    ({ custom: "Custom test", tutorial: "Practice set", topic: "Topic test", system: "System test", incorrect: "Incorrect questions", marked: "Marked questions", unanswered: "Unanswered questions", weak: "Weak-area test", assessment: "100-Question Assessment", mock: cfg.adaptive ? "Adaptive mock exam" : "Full-length mock exam", adaptive: "Adaptive test", diagnostic: "Diagnostic assessment", readiness: "Readiness assessment", case_study: "Case study" } as Record<TestKind, string>)[kind];

  const [row] = await db.insert(tests).values({ userId, examId: exam.id, name: label, kind, mode: cfg.mode, config: cfg, questionIds: ids, timeLimitSec, adaptive }).returning();
  await db.insert(testAnswers).values(ids.map((qid, i) => ({ testId: row.id, userId, questionId: qid, position: i })));
  await db.update(enrollments).set({ lastActiveAt: new Date() }).where(and(eq(enrollments.userId, userId), eq(enrollments.examId, exam.id)));
  return row;
}

async function categoryWeights(exam: Exam) {
  const kind = exam.axes.includes("category") ? "category" : "section";
  const cats = await db.select().from(taxonomy).where(and(eq(taxonomy.examId, exam.id), eq(taxonomy.kind, kind)));
  return Object.fromEntries(cats.map((c) => [String(c.id), c.weight ?? 1]));
}

/** Blueprint-balanced selection across categories/sections, with a type mix and optional case studies. */
async function buildBalanced(exam: Exam, userId: string, total: number, withCases: boolean) {
  const caseBlocks = withCases ? await pickCaseQuestionIds(exam, { count: 0, mode: "exam" }, total >= 100 ? 2 : 1) : [];
  const caseN = caseBlocks.reduce((a, b) => a + b.length, 0);
  const need = Math.max(0, total - caseN);
  const weights = await categoryWeights(exam);
  const pool = await db.select({ id: questions.id, categoryId: questions.categoryId, type: questions.type }).from(questions).where(and(eq(questions.examId, exam.id), eq(questions.status, "published"), isNull(questions.caseStudyId))).orderBy(sql`random()`);
  const byCat = new Map<string, typeof pool>();
  for (const q of pool) byCat.set(String(q.categoryId), [...(byCat.get(String(q.categoryId)) ?? []), q]);
  const totalW = Object.values(weights).reduce((a, b) => a + b, 0) || 1;
  const chosen = new Set<number>();
  for (const [cat, w] of Object.entries(weights)) {
    const quota = Math.round((w / totalW) * need);
    // prefer type variety: round-robin across types inside the category
    const qs = byCat.get(cat) ?? [];
    const byType = new Map<string, number[]>();
    for (const q of qs) byType.set(q.type, [...(byType.get(q.type) ?? []), q.id]);
    const lanes = [...byType.values()];
    let taken = 0;
    while (taken < quota && lanes.some((l) => l.length)) {
      for (const l of lanes) {
        if (taken >= quota) break;
        const id = l.shift();
        if (id != null) {
          chosen.add(id);
          taken++;
        }
      }
    }
  }
  for (const q of pool) if (chosen.size < need && !chosen.has(q.id)) chosen.add(q.id); // top-up when a category is short
  return interleave(shuffle([...chosen]).slice(0, need), caseBlocks);
}

export async function weakTopicIds(userId: string, examId: number) {
  const rows = await db.execute<{ topic_id: number }>(sql`
    SELECT q.topic_id FROM test_answers ta JOIN questions q ON q.id = ta.question_id
    WHERE ta.user_id = ${userId} AND q.exam_id = ${examId} AND ta.is_correct IS NOT NULL AND q.topic_id IS NOT NULL
    GROUP BY q.topic_id HAVING count(*) >= 1 AND avg(CASE WHEN ta.is_correct THEN 1.0 ELSE 0 END) < 0.65
    ORDER BY avg(CASE WHEN ta.is_correct THEN 1.0 ELSE 0 END) ASC LIMIT 8`);
  return rows.rows.map((r) => Number(r.topic_id));
}

/* ------------------------------------------------------------------ */
/* Delivery (sanitised — never leaks answer keys before reveal)       */
/* ------------------------------------------------------------------ */
export type ClientQuestion = {
  id: number;
  code: string;
  type: QuestionType;
  difficulty: string;
  stem: string;
  scenario: string | null;
  patient: unknown;
  exhibit: unknown;
  imageUrl: string | null;
  content: unknown;
  category?: string;
  topic?: string;
  caseStudyId: number | null;
  caseStep: number | null;
  ncjmmStep: string | null;
};
export type Reveal = {
  answer: unknown;
  rationale: string;
  optionExplanations: unknown;
  extras: unknown;
  isCorrect: boolean | null;
  score: number | null;
  maxScore: number | null;
  feedback?: unknown;
};
export type ClientCase = { id: number; title: string; summary: string; patient: unknown; sections: CaseSection[] };

export async function taxonomyNames(examId: number) {
  const rows = await db.select({ id: taxonomy.id, name: taxonomy.name, kind: taxonomy.kind }).from(taxonomy).where(eq(taxonomy.examId, examId));
  return new Map(rows.map((r) => [r.id, r]));
}

export function sanitize(q: Q, names: Map<number, { name: string }>, randomize: boolean, seed: number): ClientQuestion {
  return {
    id: q.id, code: q.code, type: q.type as QuestionType, difficulty: q.difficulty, stem: q.stem, scenario: q.scenario, patient: q.patient, exhibit: q.exhibit, imageUrl: q.imageUrl,
    content: randomize ? shuffleContent(q.type as QuestionType, q.content as never, seed) : q.content,
    category: q.categoryId ? names.get(q.categoryId)?.name : undefined,
    topic: q.topicId ? names.get(q.topicId)?.name : undefined,
    caseStudyId: q.caseStudyId, caseStep: q.caseStep, ncjmmStep: q.ncjmmStep,
  };
}
export const revealOf = (q: Q, a?: { isCorrect: boolean | null; score: number | null; maxScore: number | null; feedback?: unknown }): Reveal => ({
  answer: q.answer, rationale: q.rationale, optionExplanations: q.optionExplanations, extras: q.extras,
  isCorrect: a?.isCorrect ?? null, score: a?.score ?? null, maxScore: a?.maxScore ?? null, feedback: a?.feedback,
});

/** Case sections visible at a given step — progressive disclosure enforced server-side. */
export async function caseFor(caseStudyId: number, upToStep: number): Promise<ClientCase | null> {
  const [cs] = await db.select().from(caseStudies).where(eq(caseStudies.id, caseStudyId));
  if (!cs) return null;
  return { id: cs.id, title: cs.title, summary: cs.summary, patient: cs.patient, sections: (cs.sections as CaseSection[]).filter((s) => s.revealAt <= upToStep) };
}

export async function loadRunner(testId: number, userId: string) {
  const [t] = await db.select().from(tests).where(and(eq(tests.id, testId), eq(tests.userId, userId)));
  if (!t) return null;
  const [exam] = await db.select().from(exams).where(eq(exams.id, t.examId));
  const answers = await db.select().from(testAnswers).where(eq(testAnswers.testId, t.id)).orderBy(asc(testAnswers.position));
  const qs = t.questionIds.length ? await db.select().from(questions).where(inArray(questions.id, t.questionIds)) : [];
  const qmap = new Map(qs.map((q) => [q.id, q]));
  const names = await taxonomyNames(exam.id);
  const cfg = t.config as TestConfig;
  const done = t.status === "completed";
  const bm = await db.select({ q: bookmarks.questionId }).from(bookmarks).where(eq(bookmarks.userId, userId));
  const bms = new Set(bm.map((b) => b.q));
  const ns = t.questionIds.length ? await db.select().from(notes).where(and(eq(notes.userId, userId), inArray(notes.questionId, t.questionIds))) : [];
  const nmap = new Map(ns.map((n) => [n.questionId, n.body]));

  const items = t.questionIds.map((qid, i) => {
    const q = qmap.get(qid)!;
    const a = answers.find((x) => x.questionId === qid);
    const show = done || (t.mode === "tutor" && a?.submitted);
    return {
      position: i,
      question: sanitize(q, names, cfg.randomizeOptions !== false, t.id * 7919 + qid),
      response: (a?.response as QuestionResponse | null) ?? null,
      submitted: !!a?.submitted,
      marked: !!a?.marked,
      timeSpentSec: a?.timeSpentSec ?? 0,
      bookmarked: bms.has(qid),
      note: nmap.get(qid) ?? "",
      reveal: show ? revealOf(q, a ? { isCorrect: a.isCorrect, score: a.score, maxScore: a.maxScore, feedback: a.feedback } : undefined) : null,
    };
  });
  // case data per case id, revealed up to the furthest step the student has reached (or all once done)
  const caseIds = [...new Set(items.map((x) => x.question.caseStudyId).filter((x): x is number => x != null))];
  const cases: Record<number, ClientCase> = {};
  for (const cid of caseIds) {
    const steps = items.filter((x) => x.question.caseStudyId === cid);
    const reached = done ? 99 : Math.max(...steps.filter((s) => s.position <= t.currentIndex).map((s) => s.question.caseStep ?? 1), 1);
    const c = await caseFor(cid, reached);
    if (c) cases[cid] = c;
  }
  return { test: t, exam, items, cases };
}

/* ------------------------------------------------------------------ */
/* Answering                                                           */
/* ------------------------------------------------------------------ */
export async function saveAnswer(userId: string, testId: number, questionId: number, input: { response?: QuestionResponse | null; timeSpentSec?: number; marked?: boolean; submit?: boolean; currentIndex?: number; elapsedSec?: number }) {
  const [t] = await db.select().from(tests).where(and(eq(tests.id, testId), eq(tests.userId, userId)));
  if (!t || t.status !== "in_progress") throw new Error("Test is not active");
  if (!t.questionIds.includes(questionId)) throw new Error("Question not in test");
  const [a] = await db.select().from(testAnswers).where(and(eq(testAnswers.testId, testId), eq(testAnswers.questionId, questionId)));
  if (a?.submitted && input.response !== undefined && t.mode === "tutor") throw new Error("Already submitted");
  const cfg = t.config as TestConfig;
  if (cfg.adaptive && a?.submitted && input.response !== undefined) throw new Error("Adaptive tests do not allow changing answers");

  const patch: Partial<typeof testAnswers.$inferInsert> = {};
  if (input.response !== undefined) {
    patch.response = input.response;
    patch.answeredAt = new Date();
  }
  if (input.timeSpentSec !== undefined) patch.timeSpentSec = Math.max(0, Math.min(input.timeSpentSec, 60 * 60 * 3));
  if (input.marked !== undefined) patch.marked = input.marked;

  let reveal: Reveal | null = null;
  let appended: ClientQuestion | null = null;
  let finished = false;
  const [q] = await db.select().from(questions).where(eq(questions.id, questionId));

  if (input.submit) {
    const resp = input.response !== undefined ? input.response : (a?.response as QuestionResponse | null);
    const g = grade(q.type as QuestionType, q.content as never, q.answer as never, resp);
    Object.assign(patch, { submitted: true, isCorrect: isAnswered(resp) ? g.isCorrect : g.isCorrect === null ? null : false, score: g.score, maxScore: g.maxScore });
    if ((q.type === "writing" || q.type === "speaking") && resp?.kind === "text" && resp.text.trim()) {
      patch.feedback = await productiveFeedback(t.examId, q, resp.text);
    }
    if (t.mode === "tutor") reveal = revealOf(q, { isCorrect: patch.isCorrect ?? null, score: patch.score ?? null, maxScore: patch.maxScore ?? null, feedback: patch.feedback });

    // adaptive: update ability and append next item
    if (cfg.adaptive && t.adaptive) {
      let state = updateCat(t.adaptive as CatState, q.id, q.difficulty, (patch.maxScore ?? 1) > 0 && (patch.score ?? 0) / (patch.maxScore ?? 1) >= 0.999 ? 1 : 0, String(q.categoryId));
      const [exam] = await db.select().from(exams).where(eq(exams.id, t.examId));
      let ids = t.questionIds;
      if (!state.done) {
        const pool = await db.select({ id: questions.id, difficulty: questions.difficulty, categoryId: questions.categoryId }).from(questions).where(baseConds(exam, { ...cfg, pool: "all", count: 0 }, userId));
        const next = pickNext(state, pool, await categoryWeights(exam));
        if (next) {
          ids = [...ids, next.id];
          await db.insert(testAnswers).values({ testId, userId, questionId: next.id, position: ids.length - 1 });
          const [nq] = await db.select().from(questions).where(eq(questions.id, next.id));
          appended = sanitize(nq, await taxonomyNames(exam.id), cfg.randomizeOptions !== false, t.id * 7919 + nq.id);
        } else state = { ...state, done: true, decision: state.decision ?? (state.theta > state.passingStandard ? "above" : "below") };
      }
      await db.update(tests).set({ adaptive: state, questionIds: ids }).where(eq(tests.id, testId));
      finished = state.done;
    }
  }
  if (Object.keys(patch).length) await db.update(testAnswers).set(patch).where(and(eq(testAnswers.testId, testId), eq(testAnswers.questionId, questionId)));
  const tp: Partial<typeof tests.$inferInsert> = {};
  if (input.currentIndex !== undefined) tp.currentIndex = input.currentIndex;
  if (input.elapsedSec !== undefined) tp.elapsedSec = input.elapsedSec;
  if (Object.keys(tp).length) await db.update(tests).set(tp).where(eq(tests.id, testId));

  // reveal more of a case study as the student advances
  let caseUpdate: ClientCase | null = null;
  if (q.caseStudyId && input.currentIndex !== undefined) {
    const nextQid = t.questionIds[input.currentIndex];
    const [nq] = nextQid ? await db.select({ caseStudyId: questions.caseStudyId, caseStep: questions.caseStep }).from(questions).where(eq(questions.id, nextQid)) : [];
    if (nq?.caseStudyId === q.caseStudyId) caseUpdate = await caseFor(q.caseStudyId, nq.caseStep ?? 1);
  }
  return { reveal, appended, finished, caseUpdate };
}

async function productiveFeedback(examId: number, q: Q, text: string) {
  const { evaluateProductive } = await import("@/lib/ai");
  const [exam] = await db.select().from(exams).where(eq(exams.id, examId));
  const c = q.content as { prompt?: string; rubric?: string[]; minWords?: number };
  try {
    return await evaluateProductive({ examName: exam.name, scoringType: (exam.scoring as ScoringModel).type, kind: q.type as "writing" | "speaking", prompt: `${q.stem}\n${c.prompt ?? ""}\n${q.scenario ?? ""}`, rubric: c.rubric, response: text, minWords: c.minWords });
  } catch (e) {
    return { engine: "error", error: (e as Error).message };
  }
}

/* ------------------------------------------------------------------ */
/* Finishing & results                                                 */
/* ------------------------------------------------------------------ */
const bump = (m: Record<string, Bucket>, k: string | undefined, ok: boolean, pts: number, max: number, time: number) => {
  if (!k) return;
  const b = (m[k] ??= { correct: 0, total: 0, points: 0, max: 0, time: 0 });
  b.total++;
  if (ok) b.correct++;
  b.points += pts;
  b.max += max;
  b.time += time;
};

export async function finishTest(userId: string, testId: number, elapsedSec?: number) {
  const [t] = await db.select().from(tests).where(and(eq(tests.id, testId), eq(tests.userId, userId)));
  if (!t) throw new Error("Not found");
  if (t.status === "completed") return t.id;
  const [exam] = await db.select().from(exams).where(eq(exams.id, t.examId));
  const answers = await db.select().from(testAnswers).where(eq(testAnswers.testId, testId)).orderBy(asc(testAnswers.position));
  const qs = await db.select().from(questions).where(inArray(questions.id, answers.map((a) => a.questionId)));
  const qmap = new Map(qs.map((q) => [q.id, q]));
  const names = await taxonomyNames(exam.id);
  const nm = (id: number | null) => (id ? names.get(id)?.name : undefined);

  const bd: Breakdown = { category: {}, subject: {}, system: {}, topic: {}, type: {}, difficulty: {}, tag: {}, ncjmm: {}, caseStudy: {} };
  let correct = 0, incorrect = 0, unanswered = 0, pts = 0, maxPts = 0, totalTime = 0, wPts = 0, wMax = 0;
  const productive: number[] = [];
  const timeline: { pos: number; time: number; correct: boolean | null }[] = [];
  const DW: Record<string, number> = { easy: 0.7, moderate: 1, difficult: 1.3, advanced: 1.6, challenge: 2 };

  for (const a of answers) {
    const q = qmap.get(a.questionId);
    if (!q) continue;
    let { isCorrect, score, maxScore, feedback } = a;
    const resp = a.response as QuestionResponse | null;
    if (!a.submitted) {
      const g = grade(q.type as QuestionType, q.content as never, q.answer as never, resp);
      isCorrect = isAnswered(resp) ? g.isCorrect : g.isCorrect === null ? null : false;
      score = g.score;
      maxScore = g.maxScore;
      if ((q.type === "writing" || q.type === "speaking") && resp?.kind === "text" && resp.text.trim()) feedback = await productiveFeedback(exam.id, q, resp.text);
      await db.update(testAnswers).set({ submitted: true, isCorrect, score, maxScore, feedback }).where(eq(testAnswers.id, a.id));
    }
    const answered = isAnswered(resp);
    if (!answered) unanswered++;
    else if (isCorrect) correct++;
    else if (isCorrect === false) incorrect++;
    const fbN = (feedback as { normalized?: number } | null)?.normalized;
    if (typeof fbN === "number") {
      productive.push(fbN);
      if (fbN >= 0.6) correct++;
      else incorrect++;
    }
    const p = score ?? 0, m = maxScore ?? 0;
    pts += p;
    maxPts += m;
    wPts += p * (DW[q.difficulty] ?? 1);
    wMax += m * (DW[q.difficulty] ?? 1);
    totalTime += a.timeSpentSec;
    const ok = !!isCorrect || (typeof fbN === "number" && fbN >= 0.6);
    const effP = typeof fbN === "number" ? fbN : p;
    const effM = typeof fbN === "number" ? 1 : m;
    bump(bd.category, nm(q.categoryId), ok, effP, effM, a.timeSpentSec);
    bump(bd.subject, nm(q.subjectId), ok, effP, effM, a.timeSpentSec);
    bump(bd.system, nm(q.systemId), ok, effP, effM, a.timeSpentSec);
    bump(bd.topic, nm(q.topicId), ok, effP, effM, a.timeSpentSec);
    bump(bd.type, q.type, ok, effP, effM, a.timeSpentSec);
    bump(bd.difficulty, q.difficulty, ok, effP, effM, a.timeSpentSec);
    for (const tag of q.tags) bump(bd.tag, tag, ok, effP, effM, a.timeSpentSec);
    if (q.ncjmmStep) bump(bd.ncjmm, q.ncjmmStep, ok, effP, effM, a.timeSpentSec);
    bump(bd.caseStudy, q.caseStudyId ? "Case study items" : "Standalone items", ok, effP, effM, a.timeSpentSec);
    timeline.push({ pos: a.position, time: a.timeSpentSec, correct: answered ? isCorrect : null });
  }
  const total = answers.length;
  const percent = maxPts > 0 ? (pts / maxPts) * 100 : total ? (correct / total) * 100 : 0;
  const model = exam.scoring as ScoringModel;
  const sectionKey = exam.axes.includes("category") ? bd.category : Object.keys(bd.category).length ? bd.category : bd.subject;
  const est = estimate(model, percent / 100, { difficultyWeighted: wMax ? wPts / wMax : undefined, sections: sectionKey, productive });
  if (t.adaptive) {
    const s = t.adaptive as CatState;
    const r = readinessFromTheta(s.theta, s.se, s.passingStandard);
    est.detail = `Adaptive simulation: ${s.history.length} items, ability estimate ${s.theta.toFixed(2)} (SE ${s.se.toFixed(2)}). ${s.decision === "above" ? "Performance stayed above" : "Performance stayed below"} the simulated passing standard — estimated likelihood ${(r.probability * 100).toFixed(0)}%. Educational simulation only.`;
    est.headline = `${r.level} readiness`;
  }
  const topics = Object.entries(bd.topic).map(([name, b]) => ({ name, pct: b.max ? b.points / b.max : b.correct / b.total, total: b.total }));
  const weak = topics.filter((x) => x.pct < 0.65).sort((a, b) => a.pct - b.pct).slice(0, 5);
  const strong = topics.filter((x) => x.pct >= 0.8).sort((a, b) => b.pct - a.pct).slice(0, 5);
  const recommendations = {
    weakTopics: weak.map((w) => w.name),
    strongTopics: strong.map((s) => s.name),
    nextTest: weak.length ? "Weak-area test focusing on: " + weak.map((w) => w.name).slice(0, 3).join(", ") : percent >= 75 ? "Take a timed mixed test or full-length mock exam" : "Repeat a tutor-mode practice set on missed topics",
    plan: buildPlan(weak.map((w) => w.name), percent),
  };
  await db.update(tests).set({ status: "completed", completedAt: new Date(), elapsedSec: elapsedSec ?? t.elapsedSec }).where(eq(tests.id, testId));
  await db.insert(results).values({
    testId, userId, examId: exam.id, total, correct, incorrect, unanswered, percent, pointsEarned: pts, pointsPossible: maxPts,
    totalTimeSec: totalTime, avgTimeSec: total ? totalTime / total : 0, breakdown: { ...bd, timeline }, estimate: est, recommendations,
  }).onConflictDoNothing();
  return testId;
}

function buildPlan(weak: string[], percent: number) {
  const days = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];
  const focus = weak.length ? weak : ["Mixed review"];
  return days.map((d, i) => ({
    day: d,
    task: i === 6 ? "Timed mixed test (50 questions) and review every rationale" : i % 3 === 2 ? `Flashcards + notes: ${focus[i % focus.length]}` : `Tutor-mode set (25 Q): ${focus[i % focus.length]}`,
    target: percent < 60 ? "Accuracy ≥ 60%" : "Accuracy ≥ 75%",
  }));
}

/* ------------------------------------------------------------------ */
/* Analytics                                                           */
/* ------------------------------------------------------------------ */
export async function examAnalytics(userId: string, examId: number) {
  const [{ totalQ }] = await db.select({ totalQ: sql<number>`count(*)::int` }).from(questions).where(and(eq(questions.examId, examId), eq(questions.status, "published")));
  const stats = await db.execute<{ attempted: number; answered: number; correct: number; incorrect: number; avg_time: number; today: number; distinct_q: number }>(sql`
    SELECT count(*)::int attempted,
      count(*) FILTER (WHERE ta.response IS NOT NULL)::int answered,
      count(*) FILTER (WHERE ta.is_correct)::int correct,
      count(*) FILTER (WHERE ta.is_correct = false AND ta.response IS NOT NULL)::int incorrect,
      coalesce(avg(ta.time_spent_sec) FILTER (WHERE ta.response IS NOT NULL), 0)::float avg_time,
      count(*) FILTER (WHERE ta.answered_at::date = current_date)::int today,
      count(DISTINCT ta.question_id) FILTER (WHERE ta.response IS NOT NULL)::int distinct_q
    FROM test_answers ta JOIN tests t ON t.id = ta.test_id
    WHERE ta.user_id = ${userId} AND t.exam_id = ${examId} AND ta.submitted = true`);
  const s = stats.rows[0];
  const daily = await db.execute<{ d: string; n: number; c: number }>(sql`
    SELECT to_char(ta.answered_at::date, 'YYYY-MM-DD') d, count(*)::int n, count(*) FILTER (WHERE ta.is_correct)::int c
    FROM test_answers ta JOIN tests t ON t.id = ta.test_id
    WHERE ta.user_id = ${userId} AND t.exam_id = ${examId} AND ta.answered_at > now() - interval '60 days'
    GROUP BY 1 ORDER BY 1`);
  const byKind = async (col: "category_id" | "subject_id" | "topic_id" | "system_id") =>
    (await db.execute<{ name: string; total: number; correct: number }>(sql`
      SELECT tx.name, count(*)::int total, count(*) FILTER (WHERE ta.is_correct)::int correct
      FROM test_answers ta JOIN questions q ON q.id = ta.question_id JOIN taxonomy tx ON tx.id = ${sql.raw("q." + col)}
      WHERE ta.user_id = ${userId} AND q.exam_id = ${examId} AND ta.submitted = true AND ta.response IS NOT NULL
      GROUP BY tx.name ORDER BY tx.name`)).rows;
  const byType = (await db.execute<{ name: string; total: number; correct: number }>(sql`
      SELECT q.type name, count(*)::int total, count(*) FILTER (WHERE ta.is_correct)::int correct
      FROM test_answers ta JOIN questions q ON q.id = ta.question_id
      WHERE ta.user_id = ${userId} AND q.exam_id = ${examId} AND ta.submitted = true AND ta.response IS NOT NULL GROUP BY q.type`)).rows;
  const readinessRow = (await db.execute<{ w: number }>(sql`
      SELECT coalesce(sum(coalesce(ta.score,0) * (CASE q.difficulty WHEN 'easy' THEN 0.7 WHEN 'moderate' THEN 1 WHEN 'difficult' THEN 1.3 WHEN 'advanced' THEN 1.6 ELSE 2 END)) / nullif(sum(coalesce(ta.max_score,0) * (CASE q.difficulty WHEN 'easy' THEN 0.7 WHEN 'moderate' THEN 1 WHEN 'difficult' THEN 1.3 WHEN 'advanced' THEN 1.6 ELSE 2 END)),0), 0)::float w
      FROM (SELECT * FROM test_answers WHERE user_id = ${userId} AND submitted = true AND response IS NOT NULL ORDER BY answered_at DESC NULLS LAST LIMIT 300) ta JOIN questions q ON q.id = ta.question_id WHERE q.exam_id = ${examId}`)).rows[0];
  const recent = await db.select().from(results).where(and(eq(results.userId, userId), eq(results.examId, examId))).orderBy(desc(results.completedAt)).limit(10);
  const recentTests = await db.select({ id: tests.id, name: tests.name, kind: tests.kind, mode: tests.mode, status: tests.status, startedAt: tests.startedAt, n: sql<number>`array_length(${tests.questionIds},1)` }).from(tests).where(and(eq(tests.userId, userId), eq(tests.examId, examId))).orderBy(desc(tests.startedAt)).limit(12);
  const [{ marked }] = await db.select({ marked: sql<number>`count(*)::int` }).from(bookmarks).innerJoin(questions, eq(questions.id, bookmarks.questionId)).where(and(eq(bookmarks.userId, userId), eq(questions.examId, examId)));

  // streak (consecutive days up to today/yesterday with activity, across all exams)
  const days = (await db.execute<{ d: string }>(sql`SELECT DISTINCT answered_at::date::text d FROM test_answers WHERE user_id = ${userId} AND answered_at IS NOT NULL ORDER BY 1 DESC LIMIT 400`)).rows.map((r) => r.d);
  let streak = 0;
  const cur = new Date();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  if (days[0] !== fmt(cur)) cur.setDate(cur.getDate() - 1);
  for (const d of days) {
    if (d === fmt(cur)) {
      streak++;
      cur.setDate(cur.getDate() - 1);
    } else break;
  }
  const categories = await byKind("category_id");
  const topics = await byKind("topic_id");
  const acc = (r: { total: number; correct: number }) => (r.total ? r.correct / r.total : 0);
  const ranked = topics.filter((t) => t.total >= 1).map((t) => ({ ...t, acc: acc(t) }));
  return {
    totalQuestions: totalQ,
    attempted: Number(s?.answered ?? 0),
    distinctAnswered: Number(s?.distinct_q ?? 0),
    correct: Number(s?.correct ?? 0),
    incorrect: Number(s?.incorrect ?? 0),
    unanswered: Math.max(0, totalQ - Number(s?.distinct_q ?? 0)),
    accuracy: Number(s?.answered) ? Number(s.correct) / Number(s.answered) : 0,
    avgTime: Number(s?.avg_time ?? 0),
    today: Number(s?.today ?? 0),
    streak,
    marked,
    daily: daily.rows.map((r) => ({ d: r.d, n: Number(r.n), c: Number(r.c) })),
    categories,
    subjects: await byKind("subject_id"),
    systems: await byKind("system_id"),
    topics,
    types: byType,
    weakest: [...ranked].sort((a, b) => a.acc - b.acc).slice(0, 5),
    strongest: [...ranked].sort((a, b) => b.acc - a.acc).slice(0, 5),
    readiness: Number(readinessRow?.w ?? 0),
    recent,
    recentTests,
  };
}
