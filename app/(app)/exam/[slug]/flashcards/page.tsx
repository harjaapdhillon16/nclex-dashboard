import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { ArrowLeft, Layers } from "lucide-react";
import { db } from "@/lib/db";
import { exams, flashcardProgress, flashcards } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { getLearningPath } from "@/lib/learning-path";
import { gradeFlashcardAction } from "../../../actions";
import { MarkdownText, renderInlineMarkdown } from "@/components/markdown-text";

export default async function ExamFlashcardsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ unit?: string }>;
}) {
  const { slug } = await params;
  const { unit: unitParam } = await searchParams;
  const user = await requireUser();

  const [exam] = await db.select().from(exams).where(eq(exams.slug, slug)).limit(1);
  if (!exam) notFound();

  let cards = await db
    .select()
    .from(flashcards)
    .where(and(eq(flashcards.examId, exam.id), eq(flashcards.status, "published")))
    .orderBy(asc(flashcards.id));

  // Optional filter: only the cards that belong to one learning-path unit.
  const path = await getLearningPath(user.id, exam);
  const unit = unitParam ? path.units.find((u) => String(u.id) === unitParam) : undefined;
  if (unit) {
    const topicSet = new Set(unit.topicIds);
    cards = cards.filter((c) => c.topicId != null && topicSet.has(c.topicId));
  }

  const progRows = await db.select().from(flashcardProgress).where(eq(flashcardProgress.userId, user.id));
  const progByCard = new Map(progRows.map((p) => [p.flashcardId, p]));

  const boxCounts = [0, 1, 2, 3, 4].map((b) => cards.filter((c) => (progByCard.get(c.id)?.box ?? 0) === b).length);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={unit ? `/exam/${exam.slug}/learn/${unit.id}` : `/exam/${exam.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium muted hover:text-foreground mb-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {unit ? `Back to ${unit.name}` : `Back to ${exam.shortName} Home`}
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">
          {unit ? `${unit.name} — Flashcards` : `${exam.shortName} Flashcards`}
        </h1>
        <p className="text-xs sm:text-sm muted max-w-2xl">
          Read the front, try to answer in your head, then flip the card. Tap <strong>Again</strong> if you missed it (it comes back in
          minutes), <strong>Good</strong> if you got it (it comes back in a day or more), <strong>Easy</strong> to push it further out.
          {unit && (
            <>
              {" "}
              <Link href={`/exam/${exam.slug}/flashcards`} className="text-accent underline">
                Show all {exam.shortName} cards
              </Link>
            </>
          )}
        </p>
      </div>

      {cards.length === 0 && (
        <div className="panel panel-pad text-sm muted">
          There are no flashcards for {unit ? "this unit" : exam.shortName} yet.
        </div>
      )}

      {/* Leitner Box Summary */}
      <div className="grid grid-cols-5 gap-3">
        {["New", "Learning", "Reviewing", "Almost there", "Mastered"].map((label, b) => (
          <div key={label} className="panel p-3.5 text-center">
            <div className="text-xl font-bold text-accent">{boxCounts[b]}</div>
            <div className="text-[11px] muted mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card) => {
          const prog = progByCard.get(card.id);
          const box = prog?.box ?? 0;
          return (
            <div key={card.id} className="panel panel-pad flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="chip bg-accent-subtle text-accent">
                    <Layers className="h-3 w-3" />
                    Box {box}
                  </span>
                  {prog?.dueAt && <span className="muted">Next review: {prog.dueAt.toLocaleDateString()}</span>}
                </div>

                <div className="font-bold text-sm leading-relaxed">{renderInlineMarkdown(card.front)}</div>

                <details className="rounded-xl border border-border bg-muted/40 p-3 text-xs">
                  <summary className="cursor-pointer font-semibold text-accent select-none">
                    Flip Card &amp; View Answer
                  </summary>
                  <div className="mt-2 pt-2 border-t border-border">
                    <MarkdownText text={card.back} />
                  </div>
                </details>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border">
                {(
                  [
                    ["again", "Again", "btn-secondary text-rose-600"],
                    ["good", "Good (+1)", "btn-secondary"],
                    ["easy", "Easy (+2)", "btn-primary"],
                  ] as const
                ).map(([rating, label, cls]) => (
                  <form key={rating} action={gradeFlashcardAction} className="flex-1">
                    <input type="hidden" name="flashcardId" value={card.id} />
                    <input type="hidden" name="rating" value={rating} />
                    <input type="hidden" name="examSlug" value={exam.slug} />
                    <button type="submit" className={`btn btn-sm w-full ${cls}`}>
                      {label}
                    </button>
                  </form>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
