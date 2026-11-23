import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { AlertTriangle, ClipboardList, Target, Zap } from "lucide-react";
import { db } from "@/lib/db";
import { exams, taxonomy } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { getLearningPath, unitFieldName } from "@/lib/learning-path";
import { focusTagCounts, subjectPoolMatrix } from "@/lib/tests";
import { FOCUS_TAGS, subjectHint, subjectLabel } from "@/lib/labels";
import { startCustomTestAction } from "../../../actions";
import { CreateTestForm } from "./create-test-form";

type Preset = {
  title: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  fields: Record<string, string>;
};

export default async function CreateTestPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ empty?: string; topicId?: string; systemId?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const user = await requireUser();

  const [exam] = await db.select().from(exams).where(eq(exams.slug, slug)).limit(1);
  if (!exam) notFound();

  const path = await getLearningPath(user.id, exam);
  const { units, poolTotals, unitKind } = path;

  // Extra filters that are not the unit axis.
  const taxNodes = await db
    .select({ id: taxonomy.id, name: taxonomy.name, kind: taxonomy.kind })
    .from(taxonomy)
    .where(and(eq(taxonomy.examId, exam.id), eq(taxonomy.status, "active")))
    .orderBy(asc(taxonomy.displayOrder), asc(taxonomy.name));
  const systems = taxNodes.filter((n) => n.kind === "system");
  const subjects = unitKind === "subject" ? [] : taxNodes.filter((n) => n.kind === "subject");

  const noData = poolTotals.all === 0;
  const [matrix, tagCounts] = await Promise.all([subjectPoolMatrix(user.id, exam.id), focusTagCounts(exam.id)]);
  const subjectsWithQuestions = subjects.filter((s) => matrix.some((m) => m.subjectId === s.id && m.counts.all > 0));
  const focusTags = FOCUS_TAGS.map((t) => ({ ...t, count: tagCounts.get(t.tag) ?? 0 })).filter((t) => t.count > 0);

  const presets: Preset[] = [
    {
      title: "Quick 10",
      sub: poolTotals.unused > 0 ? "10 new questions, answers shown as you go" : "10 questions, answers shown as you go",
      icon: Zap,
      disabled: noData,
      fields: { kind: "tutorial", mode: "tutor", pool: "unused", count: String(Math.min(10, poolTotals.all)) },
    },
    {
      title: "Weak areas",
      sub: path.totals.attempts === 0 ? "Answer a few questions first" : "20 questions from the topics you miss most",
      icon: Target,
      disabled: noData || path.totals.attempts === 0,
      fields: { kind: "weak", mode: "tutor", pool: "all", count: "20" },
    },
    {
      title: "Fix my mistakes",
      sub: poolTotals.incorrect > 0 ? `Redo ${Math.min(20, poolTotals.incorrect)} you got wrong` : "Nothing wrong yet",
      icon: AlertTriangle,
      disabled: poolTotals.incorrect === 0,
      fields: { kind: "incorrect", mode: "tutor", pool: "incorrect", count: String(Math.min(20, Math.max(poolTotals.incorrect, 1))) },
    },
    {
      title: "Mock exam",
      sub: `${exam.mockQuestionCount} questions · ${exam.durationMinutes} min, answers at the end`,
      icon: ClipboardList,
      disabled: noData,
      fields: { kind: "mock", mode: "exam", count: String(exam.mockQuestionCount) },
    },
  ];

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Practice</h1>
        <p className="max-w-2xl text-sm muted">
          Pick a ready-made set, or build your own test below by choosing the subjects and topics you want to practise. Not sure what to study? Start from the{" "}
          <Link href={`/exam/${exam.slug}/learn`} className="text-accent underline">
            learning path
          </Link>
          .
        </p>
      </header>

      {sp.empty && (
        <div role="alert" className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-xs font-medium">
          No questions matched that combination. Try a bigger pool or fewer filters.
        </div>
      )}

      {/* Presets */}
      <section aria-label="Quick starts" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {presets.map((p) => (
          <form key={p.title} action={startCustomTestAction}>
            <input type="hidden" name="examSlug" value={exam.slug} />
            {Object.entries(p.fields).map(([k, v]) => (
              <input key={k} type="hidden" name={k} value={v} />
            ))}
            <button
              type="submit"
              disabled={p.disabled}
              className="panel flex h-full w-full flex-col items-start gap-1.5 p-4 text-left transition enabled:hover:border-accent/60 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="flex items-center gap-2 text-sm font-bold">
                <p.icon className="h-4 w-4 text-accent" />
                {p.title}
              </span>
              <span className="text-xs leading-snug muted">{p.sub}</span>
            </button>
          </form>
        ))}
      </section>

      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider faint">
        <span className="h-px flex-1 bg-border" />
        Or build your own
        <span className="h-px flex-1 bg-border" />
      </div>

      <CreateTestForm
        examSlug={exam.slug}
        questionTypes={exam.questionTypes}
        supportsCases={!!exam.features?.caseStudies}
        supportsAdaptive={!!exam.features?.adaptive}
        unitField={unitFieldName(unitKind)}
        unitLabel={unitKind === "subject" ? "Subjects" : exam.axes.includes("category") ? "Categories" : "Sections"}
        units={units.map((u) => ({ id: u.id, name: u.name, weight: u.weight, counts: u.pool }))}
        totals={poolTotals}
        systems={systems.map((s) => ({ id: s.id, name: s.name }))}
        subjects={subjectsWithQuestions.map((s) => ({ id: s.id, name: s.name, label: subjectLabel(s.name), hint: subjectHint(s.name) }))}
        matrix={matrix}
        focusTags={focusTags}
        initialTopicId={sp.topicId ? Number(sp.topicId) : undefined}
        initialSystemId={sp.systemId ? Number(sp.systemId) : undefined}
      />
    </div>
  );
}
