import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle2,
  FlaskConical,
  GraduationCap,
  Languages,
  Pill,
  Play,
  School,
  ShieldCheck,
  Smile,
  Sparkles,
  Stethoscope,
  UserCheck,
} from "lucide-react";
import { EXAM_CATEGORIES, EXAMS } from "@/lib/seed/catalog";
import { getCurrentUser } from "@/lib/auth";
import { demoLoginAction } from "@/app/(auth)/actions";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  nursing: Stethoscope,
  medical: Activity,
  dental: Smile,
  pharmacy: Pill,
  "physician-assistant": UserCheck,
  english: Languages,
  college: GraduationCap,
  graduate: School,
  professional: Briefcase,
};

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Clean Enterprise Top Navigation */}
      <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur px-4 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span>QREXq</span>
          <span className="hidden sm:inline-block chip bg-accent-subtle text-accent border-accent/25 text-xs">
            International Exam Prep &amp; AUSTY Health Care
          </span>
        </Link>

        <div className="flex items-center gap-2.5">
          {user ? (
            <>
              <Link href="/dashboard" className="btn btn-primary btn-sm">
                Open Workspace
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/austy" className="btn btn-secondary btn-sm">
                AUSTY ERP
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Create Account
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section with Instant 1-Click Workspace Entry */}
      <section className="px-4 sm:px-8 py-14 sm:py-20 text-white" style={{ background: "var(--hero)" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              NCLEX-RN Flagship · 45+ International Exams · AUSTY Health Care ERP
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
              Simple, high-yield exam preparation and healthcare analytics.
            </h1>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-2xl">
              Practice original NCLEX-RN questions, unfolding 6-step NGN clinical case studies, 100-question assessments, and 45+ international exams — or manage pan-India healthcare operations in the AUSTY Health Care ERP.
            </p>

            {user ? (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/exam/nclex-rn"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-lg hover:bg-white/95"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Continue NCLEX-RN Prep
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20"
                >
                  Browse All 45+ Courses
                </Link>
                <Link
                  href="/austy"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20"
                >
                  <Award className="h-4 w-4" />
                  AUSTY Health Care ERP
                </Link>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-white/80">
                  Instant 1-Click Demo Access (No Password Required):
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <form action={demoLoginAction}>
                    <input type="hidden" name="role" value="student" />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-lg hover:bg-white/95 cursor-pointer"
                    >
                      <Play className="h-4 w-4 fill-current text-accent" />
                      Enter as Student (NCLEX &amp; IELTS)
                    </button>
                  </form>
                  <form action={demoLoginAction}>
                    <input type="hidden" name="role" value="admin" />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-5 py-3 text-sm font-semibold text-white hover:bg-white/25 cursor-pointer"
                    >
                      <Award className="h-4 w-4" />
                      Enter as Super Admin &amp; AUSTY ERP
                    </button>
                  </form>
                  <form action={demoLoginAction}>
                    <input type="hidden" name="role" value="reviewer" />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-medium text-white hover:bg-white/20 cursor-pointer"
                    >
                      Clinical Reviewer
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Clean 3-Card Product Summary */}
          <div className="lg:col-span-5 space-y-3">
            {[
              {
                icon: FlaskConical,
                title: "1. NCLEX-RN & NGN Clinical Simulator",
                desc: "All 12 question formats (Bow-Tie, Matrix, Cloze, Highlight, Dosage Calculations) + 8 unfolding 6-step NGN case studies.",
              },
              {
                icon: GraduationCap,
                title: "2. 45+ International Exam Courses",
                desc: "Dedicated syllabi & scoring models for USMLE, MCAT, IELTS, OET, PTE, TOEFL, DAT, NAPLEX, SAT, GRE, CPA, and CFA.",
              },
              {
                icon: ShieldCheck,
                title: "3. AUSTY Health Care Enterprise ERP",
                desc: "State-wise provider onboarding, 100-point Employee Performance Score (EPS), 7-category revenue ledger, and incentive approvals.",
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-4 flex items-start gap-3.5"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <Icon className="h-5 w-5 text-white" />
                  </span>
                  <div>
                    <div className="font-bold text-sm">{card.title}</div>
                    <p className="text-xs text-white/80 mt-0.5 leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9 International Examination Categories */}
      <section className="max-w-6xl w-full mx-auto px-4 sm:px-8 py-14 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              9 Examination Divisions · {EXAMS.length} Courses
            </h2>
            <p className="text-xs sm:text-sm muted">
              Each course includes its own syllabus mapping, question formats, mock exam timer, and practice score estimator.
            </p>
          </div>
          <Link href={user ? "/dashboard" : "/login"} className="text-xs font-semibold text-accent hover:underline">
            View Full Course Catalogue →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXAM_CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.slug] ?? Stethoscope;
            const courses = EXAMS.filter((e) => e.category === cat.slug);
            return (
              <div key={cat.slug} className="panel p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-subtle text-accent">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-bold text-sm">{cat.name}</h3>
                      <p className="text-xs muted">{courses.length} courses available</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {courses.slice(0, 6).map((c) => (
                      <span key={c.slug} className="chip text-xs bg-muted/60">
                        {c.shortName}
                      </span>
                    ))}
                    {courses.length > 6 && (
                      <span className="chip text-xs muted">+{courses.length - 6} more</span>
                    )}
                  </div>
                </div>
                <Link
                  href={user ? `/catalog/${cat.slug}` : "/login"}
                  className="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1 pt-2 border-t border-border"
                >
                  Open {cat.name}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer with Mandatory Independence Disclaimer */}
      <footer className="mt-auto border-t border-border bg-surface px-4 sm:px-8 py-6 text-xs muted">
        <div className="max-w-6xl mx-auto space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="font-semibold text-foreground">
              QREXq International Exam Preparation &amp; AUSTY Health Care Analytics
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="hover:underline">
                Sign In
              </Link>
              <Link href="/register" className="hover:underline">
                Register
              </Link>
              <Link href="/dashboard" className="hover:underline">
                Courses
              </Link>
              <Link href="/austy" className="hover:underline">
                AUSTY ERP
              </Link>
            </div>
          </div>
          <p className="faint leading-relaxed">
            Independent educational preparation platform. Not affiliated with or endorsed by NCSBN, NCLEX, Pearson VUE, NBME, USMLE, IELTS partners, OET, ETS, AAMC, ADA, NABP, NCCPA, College Board, ACT, GMAC, or AICPA.
          </p>
        </div>
      </footer>
    </div>
  );
}
