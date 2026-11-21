import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, desc, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { bookmarks, exams, notes, questions, testAnswers } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { taxonomyNames } from "@/lib/tests";
import type { QuestionExtras, QuestionType } from "@/lib/questions/types";
import { ReviewBankClient } from "./review-client";

export default async function ExamReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await requireUser();

  const [exam] = await db.select().from(exams).where(eq(exams.slug, slug)).limit(1);
  if (!exam) notFound();

  const taxMap = await taxonomyNames(exam.id);
  const allQuestions = await db
    .select()
    .from(questions)
    .where(and(eq(questions.examId, exam.id), eq(questions.status, "published")))
    .orderBy(asc(questions.id));

  const userAnswers = await db
    .select()
    .from(testAnswers)
    .where(and(eq(testAnswers.userId, user.id), eq(testAnswers.submitted, true)))
    .orderBy(desc(testAnswers.answeredAt));

  const latestByQ = new Map<number, (typeof userAnswers)[number]>();
  for (const a of userAnswers) {
    if (!latestByQ.has(a.questionId)) latestByQ.set(a.questionId, a);
  }

  const userBookmarks = await db.select().from(bookmarks).where(eq(bookmarks.userId, user.id));
  const bmSet = new Set(userBookmarks.map((b) => b.questionId));

  const userNotes = await db.select().from(notes).where(eq(notes.userId, user.id));
  const noteMap = new Map(userNotes.map((n) => [n.questionId, n.body]));

  const rows = allQuestions.map((q) => {
    const attempt = latestByQ.get(q.id);
    const extras = (q.extras ?? {}) as QuestionExtras;
    return {
      id: q.id,
      code: q.code,
      stem: q.stem,
      type: q.type as QuestionType,
      difficulty: q.difficulty,
      category: q.categoryId ? taxMap.get(q.categoryId)?.name ?? "" : "",
      subject: q.subjectId ? taxMap.get(q.subjectId)?.name ?? "" : "",
      system: q.systemId ? taxMap.get(q.systemId)?.name ?? "" : "",
      topic: q.topicId ? taxMap.get(q.topicId)?.name ?? "" : "",
      topicId: q.topicId,
      clinicalConcept: q.clinicalConcept ?? extras.keyTakeaway ?? "",
      isCaseStudy: q.caseStudyId !== null,
      isNgn: ["multiple_response", "ordered", "matrix", "bowtie", "highlight", "cloze", "trend"].includes(q.type) || q.caseStudyId !== null,
      tags: q.tags,
      attempted: !!attempt && attempt.response !== null,
      isCorrect: attempt?.isCorrect ?? null,
      marked: bmSet.has(q.id) || !!attempt?.marked,
      bookmarked: bmSet.has(q.id),
      note: noteMap.get(q.id) ?? "",
      // Only include rationale & key Explanations once attempted or for tutor study review
      rationale: q.rationale,
      keyTakeaway: extras.keyTakeaway ?? "",
      strategy: extras.strategy ?? "",
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/exam/${exam.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium muted hover:text-foreground mb-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to {exam.shortName} Dashboard
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">{exam.name} — Question Bank &amp; Review System</h1>
        <p className="text-xs sm:text-sm muted">
          Search and filter by keyword, question ID, topic, subject, body system, difficulty, question type, clinical concept, answered status, or NGN format.
        </p>
      </div>

      <ReviewBankClient examSlug={exam.slug} items={rows} />
    </div>
  );
}
