import "server-only";
import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { results, tests } from "@/lib/db/schema";
import type { TestKind } from "@/lib/db/schema";
import type { Bucket } from "@/lib/scoring";

export type AssessmentKind = Extract<TestKind, "diagnostic" | "readiness" | "assessment">;
export const ASSESSMENT_KINDS: AssessmentKind[] = ["diagnostic", "readiness", "assessment"];

export type AssessmentDef = {
  kind: AssessmentKind;
  title: string;
  tagline: string;
  description: string;
  /** Questions requested (shorter if the bank is smaller). */
  questions: number;
  /** Minutes on the clock in timed mode (null = untimed). */
  minutes: number | null;
  mode: "exam" | "tutor";
};

export const ASSESSMENTS: AssessmentDef[] = [
  {
    kind: "diagnostic",
    title: "Diagnostic check",
    tagline: "Start here",
    description: "A short, blueprint-balanced set that shows which subjects to study first. Takes about 45 minutes.",
    questions: 30,
    minutes: 45,
    mode: "exam",
  },
  {
    kind: "readiness",
    title: "Readiness assessment",
    tagline: "Mid-preparation",
    description: "A longer mixed assessment to measure how far you have come and what is still weak.",
    questions: 60,
    minutes: 90,
    mode: "exam",
  },
  {
    kind: "assessment",
    title: "100-question assessment",
    tagline: "Full practice assessment",
    description:
      "A balanced practice assessment across every content area and question format, including case studies. Results and rationales appear after you submit.",
    questions: 100,
    minutes: 150,
    mode: "exam",
  },
];

export const ASSESSMENT_BY_KIND = Object.fromEntries(ASSESSMENTS.map((a) => [a.kind, a])) as Record<AssessmentKind, AssessmentDef>;

export const ASSESSMENT_DISCLAIMER =
  "These are original practice assessments written for QREXq. They are not official examinations and are not affiliated with or endorsed by any examination body. Levels are practice estimates only.";

export type PrepLevel = { label: string; tone: "weak" | "moderate" | "strong"; advice: string };

/** Plain-language preparation level from the percent score (difficulty-weighted when available). */
export function preparationLevel(percent: number): PrepLevel {
  // Cut-offs mirror the readiness bands in lib/scoring.ts so the two messages on a report never disagree.
  if (percent >= 72) return { label: "Exam-ready range", tone: "strong", advice: "Keep your edge with timed mixed tests and review every miss." };
  if (percent >= 63) return { label: "Approaching readiness", tone: "moderate", advice: "Close the gaps in your weakest areas, then retake an assessment." };
  if (percent >= 55) return { label: "Developing", tone: "moderate", advice: "Work through the learning path unit by unit, with practice after each." };
  return { label: "Building foundations", tone: "weak", advice: "Start with the lessons and cheat sheets, then practise in tutor mode." };
}

export type AssessmentRow = {
  testId: number;
  kind: AssessmentKind;
  name: string;
  completedAt: Date;
  total: number;
  correct: number;
  percent: number;
  totalTimeSec: number;
  headline: string;
  category: Record<string, Bucket>;
  subject: Record<string, Bucket>;
};

export async function assessmentHistory(userId: string, examId: number): Promise<AssessmentRow[]> {
  const rows = await db
    .select({ r: results, t: tests })
    .from(results)
    .innerJoin(tests, eq(tests.id, results.testId))
    .where(and(eq(results.userId, userId), eq(results.examId, examId), inArray(tests.kind, ASSESSMENT_KINDS)))
    .orderBy(asc(results.completedAt));
  return rows.map(({ r, t }) => {
    const bd = (r.breakdown ?? {}) as Record<string, Record<string, Bucket>>;
    return {
      testId: t.id,
      kind: t.kind as AssessmentKind,
      name: t.name,
      completedAt: r.completedAt,
      total: r.total,
      correct: r.correct,
      percent: r.percent,
      totalTimeSec: r.totalTimeSec,
      headline: ((r.estimate ?? {}) as { headline?: string }).headline ?? `${Math.round(r.percent)}%`,
      category: bd.category ?? {},
      subject: bd.subject ?? {},
    };
  });
}

export const bucketPct = (b: Bucket) => (b.max > 0 ? (b.points / b.max) * 100 : b.total > 0 ? (b.correct / b.total) * 100 : 0);
