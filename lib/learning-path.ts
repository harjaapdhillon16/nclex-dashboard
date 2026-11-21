import { and, asc, eq, isNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { flashcards, questions, studyMaterials, taxonomy, tests } from "@/lib/db/schema";

/**
 * The learning path is the answer to "what do I study, in what order?".
 *
 * A course (exam) is split into UNITS. A unit is a top-level blueprint area
 * (for NCLEX-RN: "Management of Care", "Pharmacological and Parenteral
 * Therapies", ...). Every unit has the same three kinds of material:
 *   1. LESSONS    - study notes / guides / video outlines (study_materials)
 *   2. FLASHCARDS - short recall cards (flashcards)
 *   3. PRACTICE   - questions (questions)
 * and we measure progress ONLY from practice answers, because that is the
 * one thing that actually proves a topic has been learned.
 */

export type UnitStage = "not_started" | "in_progress" | "needs_work" | "strong";

export const STAGE_LABEL: Record<UnitStage, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  needs_work: "Needs work",
  strong: "Strong",
};

export const STAGE_STYLE: Record<UnitStage, string> = {
  not_started: "bg-muted text-foreground/70 border-border",
  in_progress: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
  needs_work: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30",
  strong: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
};

/** Plain-language definition shown to the learner so the labels are never a mystery. */
export const STAGE_RULES: Record<UnitStage, string> = {
  not_started: "You haven't answered any practice questions here yet.",
  in_progress: "You've started, but haven't covered enough of the unit or reached 75% accuracy yet.",
  needs_work: "You've answered at least 5 questions and are scoring under 60%. Re-read the lessons, then practice again.",
  strong: "You've answered at least 60% of the unit's questions with 75% accuracy or better.",
};

export type Lesson = {
  id: number;
  kind: string;
  title: string;
  summary: string | null;
  body: string | null;
  durationMinutes: number | null;
  topicId: number | null;
  topicName: string | null;
  topicQuestionCount: number;
};

export type Unit = {
  id: number;
  name: string;
  description: string | null;
  /** Share of the real exam, when the blueprint publishes one (e.g. 18 = 18%). */
  weight: number | null;
  lessons: Lesson[];
  topicIds: number[];
  cardTotal: number;
  cardsToStudy: number;
  questionTotal: number;
  answered: number;
  attempts: number;
  correct: number;
  accuracy: number | null;
  stage: UnitStage;
};

export type NextStep = {
  kind: "resume" | "start" | "continue" | "mock";
  title: string;
  detail: string;
  cta: string;
  href: string;
};

export type LearningPath = {
  units: Unit[];
  /** Lessons that exist for the course but can't be tied to a unit. */
  looseLessons: Lesson[];
  totals: {
    lessons: number;
    cards: number;
    questions: number;
    unitsStrong: number;
    answered: number;
    attempts: number;
    correct: number;
  };
  /** True when the course is a thin preview (no lessons, or very few questions). */
  isEarlyAccess: boolean;
  nextStep: NextStep;
};

const UNIT_KINDS = ["category", "section"] as const;

function stageOf(u: Pick<Unit, "answered" | "questionTotal" | "attempts" | "correct">): UnitStage {
  if (u.answered === 0) return "not_started";
  const acc = u.attempts ? u.correct / u.attempts : 0;
  const coverage = u.questionTotal ? u.answered / u.questionTotal : 0;
  if (coverage >= 0.6 && acc >= 0.75) return "strong";
  if (u.answered >= 5 && acc < 0.6) return "needs_work";
  return "in_progress";
}

const KIND_ORDER: Record<string, number> = { notes: 0, guide: 1, video: 2, syllabus: 3 };

export async function getLearningPath(
  userId: string,
  exam: { id: number; slug: string; shortName: string },
): Promise<LearningPath> {
  const taxRows = await db
    .select()
    .from(taxonomy)
    .where(and(eq(taxonomy.examId, exam.id), eq(taxonomy.status, "active")))
    .orderBy(asc(taxonomy.displayOrder), asc(taxonomy.id));

  const unitRows = taxRows.filter((t) => (UNIT_KINDS as readonly string[]).includes(t.kind));
  const unitIds = new Set(unitRows.map((u) => u.id));
  const topicRows = taxRows.filter((t) => t.kind === "topic");
  const topicName = new Map(topicRows.map((t) => [t.id, t.name]));

  // Questions: standalone practice items per unit and per topic.
  const qByUnit = new Map<number, number>();
  const qByTopic = new Map<number, number>();
  const topicToUnitVotes = new Map<number, Map<number, number>>();
  const qGroups = await db
    .select({
      categoryId: questions.categoryId,
      topicId: questions.topicId,
      n: sql<number>`count(*)::int`,
    })
    .from(questions)
    .where(and(eq(questions.examId, exam.id), eq(questions.status, "published"), isNull(questions.caseStudyId)))
    .groupBy(questions.categoryId, questions.topicId);
  for (const g of qGroups) {
    if (g.categoryId != null) qByUnit.set(g.categoryId, (qByUnit.get(g.categoryId) ?? 0) + g.n);
    if (g.topicId != null) qByTopic.set(g.topicId, (qByTopic.get(g.topicId) ?? 0) + g.n);
  }

  // To place a topic in a unit we also look at case-study questions, so a topic that only has
  // case-study questions (e.g. maternal topics) still lands in the right unit.
  const voteRows = await db
    .select({
      categoryId: questions.categoryId,
      topicId: questions.topicId,
      n: sql<number>`count(*)::int`,
    })
    .from(questions)
    .where(and(eq(questions.examId, exam.id), eq(questions.status, "published")))
    .groupBy(questions.categoryId, questions.topicId);
  for (const g of voteRows) {
    if (g.topicId == null || g.categoryId == null) continue;
    const votes = topicToUnitVotes.get(g.topicId) ?? new Map<number, number>();
    votes.set(g.categoryId, (votes.get(g.categoryId) ?? 0) + g.n);
    topicToUnitVotes.set(g.topicId, votes);
  }

  // Which unit does a topic belong to? Its taxonomy parent if that is a unit,
  // otherwise the unit most of its questions are filed under.
  const topicUnit = new Map<number, number>();
  for (const t of topicRows) {
    if (t.parentId != null && unitIds.has(t.parentId)) {
      topicUnit.set(t.id, t.parentId);
      continue;
    }
    const votes = topicToUnitVotes.get(t.id);
    if (votes) {
      const best = [...votes.entries()].sort((a, b) => b[1] - a[1])[0];
      if (best) topicUnit.set(t.id, best[0]);
    }
  }

  // Lessons
  const mats = await db
    .select()
    .from(studyMaterials)
    .where(and(eq(studyMaterials.examId, exam.id), eq(studyMaterials.status, "published")))
    .orderBy(asc(studyMaterials.id));
  const lessonsByUnit = new Map<number, Lesson[]>();
  const looseLessons: Lesson[] = [];
  for (const m of mats) {
    const lesson: Lesson = {
      id: m.id,
      kind: m.kind,
      title: m.title,
      summary: m.summary,
      body: m.body,
      durationMinutes: m.durationMinutes,
      topicId: m.topicId,
      topicName: m.topicId ? (topicName.get(m.topicId) ?? null) : null,
      topicQuestionCount: m.topicId ? (qByTopic.get(m.topicId) ?? 0) : 0,
    };
    const unitId = m.topicId != null ? topicUnit.get(m.topicId) : undefined;
    if (unitId != null) lessonsByUnit.set(unitId, [...(lessonsByUnit.get(unitId) ?? []), lesson]);
    else looseLessons.push(lesson);
  }
  for (const list of lessonsByUnit.values()) {
    list.sort((a, b) => (KIND_ORDER[a.kind] ?? 9) - (KIND_ORDER[b.kind] ?? 9));
  }

  // Flashcards (per unit via topic)
  const cardRows = await db.execute<{ topic_id: number | null; total: number; to_study: number }>(sql`
    SELECT f.topic_id,
      count(*)::int AS total,
      count(*) FILTER (WHERE fp.flashcard_id IS NULL OR fp.due_at <= now())::int AS to_study
    FROM flashcards f
    LEFT JOIN flashcard_progress fp ON fp.flashcard_id = f.id AND fp.user_id = ${userId}
    WHERE f.exam_id = ${exam.id} AND f.status = 'published'
    GROUP BY f.topic_id`);
  const cardsByUnit = new Map<number, { total: number; toStudy: number }>();
  for (const r of cardRows.rows) {
    const unitId = r.topic_id != null ? topicUnit.get(Number(r.topic_id)) : undefined;
    if (unitId == null) continue;
    const cur = cardsByUnit.get(unitId) ?? { total: 0, toStudy: 0 };
    cur.total += Number(r.total);
    cur.toStudy += Number(r.to_study);
    cardsByUnit.set(unitId, cur);
  }
  const [{ allCards }] = await db
    .select({ allCards: sql<number>`count(*)::int` })
    .from(flashcards)
    .where(and(eq(flashcards.examId, exam.id), eq(flashcards.status, "published")));

  // Practice progress per unit
  const progRows = await db.execute<{ unit_id: number | null; answered: number; attempts: number; correct: number }>(sql`
    SELECT q.category_id AS unit_id,
      count(DISTINCT ta.question_id)::int AS answered,
      count(*)::int AS attempts,
      count(*) FILTER (WHERE ta.is_correct)::int AS correct
    FROM test_answers ta
    JOIN questions q ON q.id = ta.question_id
    WHERE ta.user_id = ${userId} AND q.exam_id = ${exam.id}
      AND ta.submitted = true AND ta.response IS NOT NULL
    GROUP BY q.category_id`);
  const progByUnit = new Map(progRows.rows.filter((r) => r.unit_id != null).map((r) => [Number(r.unit_id), r]));

  const topicsByUnit = new Map<number, number[]>();
  for (const [tid, uid] of topicUnit) topicsByUnit.set(uid, [...(topicsByUnit.get(uid) ?? []), tid]);

  const units: Unit[] = unitRows
    .map((u) => {
      const p = progByUnit.get(u.id);
      const lessons = lessonsByUnit.get(u.id) ?? [];
      const cards = cardsByUnit.get(u.id) ?? { total: 0, toStudy: 0 };
      const base = {
        answered: Number(p?.answered ?? 0),
        attempts: Number(p?.attempts ?? 0),
        correct: Number(p?.correct ?? 0),
        questionTotal: qByUnit.get(u.id) ?? 0,
      };
      return {
        id: u.id,
        name: u.name,
        description: u.description,
        weight: u.weight,
        lessons,
        topicIds: topicsByUnit.get(u.id) ?? [],
        cardTotal: cards.total,
        cardsToStudy: cards.toStudy,
        ...base,
        accuracy: base.attempts ? base.correct / base.attempts : null,
        stage: stageOf(base),
      } satisfies Unit;
    })
    // Hide empty shells so the learner never lands on a unit with nothing in it.
    .filter((u) => u.lessons.length > 0 || u.questionTotal > 0 || u.cardTotal > 0);

  const totals = {
    lessons: mats.length,
    cards: allCards,
    questions: units.reduce((s, u) => s + u.questionTotal, 0),
    unitsStrong: units.filter((u) => u.stage === "strong").length,
    answered: units.reduce((s, u) => s + u.answered, 0),
    attempts: units.reduce((s, u) => s + u.attempts, 0),
    correct: units.reduce((s, u) => s + u.correct, 0),
  };

  // Resume an unfinished test before suggesting anything else.
  const [open] = await db
    .select({ id: tests.id, name: tests.name })
    .from(tests)
    .where(and(eq(tests.userId, userId), eq(tests.examId, exam.id), eq(tests.status, "in_progress")))
    .orderBy(sql`${tests.startedAt} desc`)
    .limit(1);

  const nextStep = pickNextStep(exam, units, totals, open);

  return {
    units,
    looseLessons,
    totals,
    isEarlyAccess: totals.lessons === 0 || totals.questions < 50,
    nextStep,
  };
}

function pickNextStep(
  exam: { slug: string; shortName: string },
  units: Unit[],
  totals: LearningPath["totals"],
  open?: { id: number; name: string },
): NextStep {
  if (open) {
    return {
      kind: "resume",
      title: "Finish the test you started",
      detail: `"${open.name}" is still open. Pick up exactly where you left off.`,
      cta: "Resume test",
      href: `/test/${open.id}`,
    };
  }

  if (units.length === 0) {
    return {
      kind: "mock",
      title: "Take a practice test",
      detail: `${exam.shortName} doesn't have a unit-by-unit path yet, but you can still practice.`,
      cta: "Start practice",
      href: `/exam/${exam.slug}/create`,
    };
  }

  if (totals.answered === 0) {
    const first = units.find((u) => u.lessons.length > 0) ?? units[0]!;
    const lesson = first.lessons[0];
    return {
      kind: "start",
      title: `Start with ${first.name}`,
      detail: lesson
        ? `Read “${lesson.title}”${lesson.durationMinutes ? ` (${lesson.durationMinutes} min)` : ""}, then answer a few practice questions on it.`
        : `Answer a short set of practice questions to see where you stand.`,
      cta: "Start unit 1",
      href: `/exam/${exam.slug}/learn/${first.id}`,
    };
  }

  const needsWork = units
    .filter((u) => u.stage === "needs_work")
    .sort((a, b) => (a.accuracy ?? 1) - (b.accuracy ?? 1))[0];
  if (needsWork) {
    return {
      kind: "continue",
      title: `Strengthen ${needsWork.name}`,
      detail: `You're at ${Math.round((needsWork.accuracy ?? 0) * 100)}% here. Re-read the lessons, then retry the questions.`,
      cta: "Review this unit",
      href: `/exam/${exam.slug}/learn/${needsWork.id}`,
    };
  }

  const inProgress = units.find((u) => u.stage === "in_progress");
  const notStarted = units.find((u) => u.stage === "not_started");
  const target = inProgress ?? notStarted;
  if (target) {
    return {
      kind: "continue",
      title: target.stage === "in_progress" ? `Keep going in ${target.name}` : `Next up: ${target.name}`,
      detail:
        target.stage === "in_progress"
          ? `${target.answered} of ${target.questionTotal} questions answered so far.`
          : `You haven't opened this unit yet. ${target.lessons.length} lesson${target.lessons.length === 1 ? "" : "s"} and ${target.questionTotal} practice questions.`,
      cta: target.stage === "in_progress" ? "Continue unit" : "Start unit",
      href: `/exam/${exam.slug}/learn/${target.id}`,
    };
  }

  return {
    kind: "mock",
    title: "You're strong in every unit — test yourself",
    detail: "Take a full-length mock exam to check you can hold it together under real exam conditions.",
    cta: "Start mock exam",
    href: `/exam/${exam.slug}/tests`,
  };
}

export function pct(n: number | null | undefined) {
  return n == null ? 0 : Math.round(n * 100);
}
