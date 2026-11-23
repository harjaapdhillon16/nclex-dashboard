import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, desc, eq } from "drizzle-orm";
import { ArrowLeft, CheckCircle2, FlaskConical, Play, RotateCcw, Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { caseStudies, exams, results, tests } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { NCJMM_LABELS, NCJMM_STEPS, type CaseSection, type PatientInfo } from "@/lib/questions/types";
import { startCustomTestAction } from "../../../actions";

export default async function ExamCaseStudiesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await requireUser();

  const [exam] = await db.select().from(exams).where(eq(exams.slug, slug)).limit(1);
  if (!exam) notFound();

  const cases = await db
    .select()
    .from(caseStudies)
    .where(and(eq(caseStudies.examId, exam.id), eq(caseStudies.status, "published")))
    .orderBy(asc(caseStudies.id));

  // Your latest attempt at each case (any mode).
  const attempts = await db
    .select({ id: tests.id, status: tests.status, config: tests.config, percent: results.percent })
    .from(tests)
    .leftJoin(results, eq(results.testId, tests.id))
    .where(and(eq(tests.userId, user.id), eq(tests.examId, exam.id), eq(tests.kind, "case_study")))
    .orderBy(desc(tests.startedAt));
  const latestByCase = new Map<number, (typeof attempts)[number]>();
  for (const a of attempts) {
    const cid = (a.config as { caseStudyId?: number } | null)?.caseStudyId;
    if (cid && !latestByCase.has(cid)) latestByCase.set(cid, a);
  }
  const doneCount = [...latestByCase.values()].filter((a) => a.status === "completed").length;

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">NGN Clinical Judgment Case Studies</h1>
            <p className="text-xs sm:text-sm muted">
              Progressive-reveal 6-step clinical scenarios aligned with the NCSBN Clinical Judgment Measurement Model (NCJMM).
            </p>
          </div>
          <span className="chip bg-accent-subtle text-accent border-accent/25">
            {doneCount} of {cases.length} cases completed
          </span>
        </div>
      </div>

      {/* 6-Step NCJMM Banner */}
      <div className="panel panel-pad space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent">
          <Sparkles className="h-3.5 w-3.5" />
          NCSBN Clinical Judgment Measurement Model (6 Connected Steps per Case)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          {NCJMM_STEPS.map((step, i) => (
            <div key={step} className="rounded-xl border border-border bg-muted/40 p-2.5">
              <div className="text-[10px] font-bold text-accent">Step {i + 1}</div>
              <div className="font-semibold mt-0.5">{NCJMM_LABELS[step]}</div>
            </div>
          ))}
        </div>
      </div>

      {cases.length === 0 ? (
        <div className="panel panel-pad text-center space-y-2 py-10">
          <FlaskConical className="mx-auto h-8 w-8 faint" />
          <div className="font-bold">No unfolding case studies configured for {exam.name}</div>
          <p className="text-xs muted">
            Switch to NCLEX-RN to practice all 8 progressive 6-step NGN clinical judgment case studies.
          </p>
          <Link href="/exam/nclex-rn/cases" className="btn btn-primary btn-sm mt-2">
            Open NCLEX-RN Case Studies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cases.map((cs) => {
            const patient = (cs.patient ?? {}) as PatientInfo & { setting?: string; chiefComplaint?: string };
            const sections = (cs.sections ?? []) as CaseSection[];
            const tabs = [...new Set(sections.map((s) => s.tab))];

            return (
              <div key={cs.id} className="panel panel-pad flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="chip bg-accent-subtle text-accent border-accent/25 capitalize">
                      {cs.difficulty} · 6 NGN Items
                    </span>
                    {patient.setting && <span className="text-xs muted">{patient.setting}</span>}
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">{cs.title}</h2>
                    <p className="text-xs muted mt-1 leading-relaxed">{cs.summary}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {tabs.map((tab) => (
                      <span key={tab} className="chip text-[11px] bg-muted/60">
                        {tab}
                      </span>
                    ))}
                  </div>
                </div>

                {(() => {
                  const att = latestByCase.get(cs.id);
                  if (!att) return null;
                  const done = att.status === "completed";
                  return (
                    <div className="flex items-center justify-between gap-2 rounded-xl bg-muted/50 px-3 py-2 text-xs">
                      <span className="inline-flex items-center gap-1.5 font-semibold">
                        {done ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <RotateCcw className="h-3.5 w-3.5 text-amber-500" />}
                        {done ? `Completed · ${Math.round(att.percent ?? 0)}%` : "In progress"}
                      </span>
                      <Link href={done ? `/test/${att.id}/results` : `/test/${att.id}`} className="font-semibold text-accent hover:underline">
                        {done ? "Review results" : "Resume"}
                      </Link>
                    </div>
                  );
                })()}

                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <form action={startCustomTestAction} className="flex-1">
                    <input type="hidden" name="examSlug" value={exam.slug} />
                    <input type="hidden" name="kind" value="case_study" />
                    <input type="hidden" name="mode" value="tutor" />
                    <input type="hidden" name="caseStudyId" value={cs.id} />
                    <input type="hidden" name="count" value="6" />
                    <input type="hidden" name="name" value={`Case Study: ${cs.title}`} />
                    <button type="submit" className="btn btn-primary btn-sm w-full">
                      <Play className="h-3.5 w-3.5" />
                      Launch in Tutor Mode
                    </button>
                  </form>

                  <form action={startCustomTestAction}>
                    <input type="hidden" name="examSlug" value={exam.slug} />
                    <input type="hidden" name="kind" value="case_study" />
                    <input type="hidden" name="mode" value="exam" />
                    <input type="hidden" name="caseStudyId" value={cs.id} />
                    <input type="hidden" name="count" value="6" />
                    <input type="hidden" name="name" value={`Case Study (Exam): ${cs.title}`} />
                    <button type="submit" className="btn btn-secondary btn-sm">
                      Exam Mode
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
