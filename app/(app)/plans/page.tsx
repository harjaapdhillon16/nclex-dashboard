import { asc, eq } from "drizzle-orm";
import { CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";
import { db } from "@/lib/db";
import { plans, settings } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";

export default async function PlansPage() {
  const user = await requireUser();
  const planRows = await db.select().from(plans).where(eq(plans.active, true)).orderBy(asc(plans.displayOrder));
  const [paySetting] = await db.select().from(settings).where(eq(settings.key, "payments")).limit(1);
  const paymentsEnabled = Boolean((paySetting?.value as { enabled?: boolean } | undefined)?.enabled);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Flexible Multi-Course Subscription Plans</h1>
          <p className="text-xs sm:text-sm muted">
            Individual Examination Course, Nurse Abroad Bundle (NCLEX-RN + IELTS), All-Access Premium, and Institution Seat Licensing.
          </p>
        </div>
        <span className="chip bg-accent-subtle text-accent border-accent/25">
          Current Status: <strong className="capitalize ml-1">{user.subscriptionStatus}</strong>
        </span>
      </div>

      {!paymentsEnabled && (
        <div className="rounded-2xl border border-accent/30 bg-accent-subtle/50 p-4 text-xs flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-accent shrink-0" />
          <div>
            <strong>Payment Gateway Standby Mode:</strong> Live checkout is disabled by default per platform configuration. All courses, NGN case studies, 100-question assessments, and mock exams are unlocked for evaluation and administrator assignment.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {planRows.map((p) => {
          const lim = (p.limits ?? {}) as {
            questionsPerDay?: number;
            mockExams?: boolean;
            caseStudies?: boolean;
            analytics?: boolean;
            ai?: boolean;
            downloads?: boolean;
            seats?: number;
          };
          const isCurrent = user.subscriptionStatus === p.slug;
          return (
            <div
              key={p.id}
              className={`panel panel-pad flex flex-col justify-between space-y-5 ${
                p.slug === "all-access" ? "border-2 border-accent" : ""
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="chip text-[11px] uppercase">{p.kind.replace("_", " ")}</span>
                  {p.slug === "all-access" && (
                    <span className="chip bg-accent text-white text-[10px]">Most Popular</span>
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-bold">{p.name}</h2>
                  <p className="text-xs muted mt-1">{p.description}</p>
                </div>

                <div className="pt-1">
                  {p.kind === "institution" ? (
                    <div className="text-2xl font-bold">Custom Quote</div>
                  ) : (
                    <div className="text-2xl font-bold">
                      ${(p.priceCents / 100).toFixed(0)}
                      <span className="text-xs font-normal muted"> / {p.interval}</span>
                    </div>
                  )}
                </div>

                <ul className="space-y-2 text-xs pt-2 border-t border-border">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>{lim.questionsPerDay ? `${lim.questionsPerDay} questions/day` : "Unlimited question bank"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>{lim.caseStudies ? "Full NGN 6-step case studies" : "Sample case studies"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>{lim.mockExams ? "100-Q Assessments & Mock Exams" : "Practice sets"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>{lim.ai ? "AI Study Tutor & Writing/Speaking Rubric" : "Standard rationales"}</span>
                  </li>
                  {lim.seats && (
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Up to {lim.seats} student seats + Instructor Console</span>
                    </li>
                  )}
                </ul>
              </div>

              <button
                type="button"
                disabled={!paymentsEnabled || isCurrent}
                className={`btn btn-sm w-full ${isCurrent ? "btn-secondary" : "btn-primary"}`}
              >
                <CreditCard className="h-3.5 w-3.5" />
                {isCurrent ? "Active Plan" : paymentsEnabled ? "Select Plan" : "Checkout Disabled (Demo Free)"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
