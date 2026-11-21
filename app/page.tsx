import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  CheckCircle2,
  FlaskConical,
  GraduationCap,
  Languages,
  Pill,
  School,
  ShieldCheck,
  Smile,
  Sparkles,
  Stethoscope,
  UserCheck,
} from "lucide-react";
import { EXAM_CATEGORIES, EXAMS } from "@/lib/seed/catalog";
import { getCurrentUser } from "@/lib/auth";

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
      {/* Top Navbar */}
      <header className="sticky top-0 z-20 border-b border-border bg-surface/90 backdrop-blur px-4 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span>QREXq</span>
          <span className="hidden sm:inline-block chip bg-accent-subtle text-accent border-accent/25 text-xs">
            NCLEX-RN · Multi-Exam · AUSTY ERP
          </span>
        </Link>

        <div className="flex items-center gap-2.5">
          {user ? (
            <>
              <Link href="/dashboard" className="btn btn-primary btn-sm">
                Open Dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/austy" className="btn btn-secondary btn-sm">
                AUSTY Analytics
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary btn-sm">
                Sign In / Demo Roles
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Start Free Prep
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 sm:px-8 py-14 sm:py-20 text-white" style={{ background: "var(--hero)" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              International Multi-Exam Platform &amp; AUSTY Health Care Analytics
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
              Clinical Judgment, NGN Simulators &amp; 45+ International Exam Courses.
            </h1>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-2xl">
              Prepare for NCLEX-RN, NCLEX-PN, USMLE, IELTS, OET, MCAT, DAT, NAPLEX, SAT, GRE, and CPA with original, clinically reviewed question banks, unfolding 6-step NGN case studies, 100-question balanced assessments, and computerized adaptive (CAT) simulations.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href={user ? "/dashboard" : "/login"}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-lg hover:bg-white/95"
              >
                {user ? "Go to Multi-Exam Dashboard" : "Explore Platform & 1-Click Demo"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={user ? "/austy" : "/login?next=/austy"}
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20"
              >
                <Award className="h-4 w-4" />
                AUSTY Health Care ERP Module
              </Link>
            </div>
          </div>

          {/* Feature Highlight Card */}
          <div className="lg:col-span-5 rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-6 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-white/80">
              Platform Capabilities Ready Out of the Box
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {[
                "8 NCLEX-RN Client-Needs Categories + 7 Nursing Specialties + 13 Body Systems",
                "12 Interactive Question Formats: Bow-Tie, Matrix, Highlight, Cloze, Trend, Ordered, SATA, Numeric, Writing & Speaking",
                "8 Unfolding 6-Step NGN Clinical Judgment Case Studies with progressive chart reveal",
                "100-Question Practice Assessment, Full-Length Timed Mock & Rasch Adaptive (CAT) Simulator",
                "18-Point Post-Submission Clinical Rationale & 7-Day Personalized Study Plan",
                "AUSTY Health Care Employee Performance (EPS 100), Pan-India State Tracking & 7-Category Revenue ERP",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 9 International Examination Categories */}
      <section className="max-w-6xl w-full mx-auto px-4 sm:px-8 py-14 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            9 International Examination Divisions · {EXAMS.length} Dedicated Courses
          </h2>
          <p className="text-xs sm:text-sm muted">
            Every examination features its own syllabus taxonomy, question formats, scoring/band/scaled evaluation model, and dedicated preparation dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {EXAM_CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.slug] ?? BookOpen;
            const courses = EXAMS.filter((e) => e.category === cat.slug);
            return (
              <div key={cat.slug} className="panel panel-pad flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-subtle text-accent">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-bold text-base">{cat.name}</h3>
                      <p className="text-xs muted">{courses.length} examination courses</p>
                    </div>
                  </div>
                  <p className="text-xs muted">{cat.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {courses.map((c) => (
                      <span key={c.slug} className="chip text-xs bg-muted/60">
                        {c.shortName}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  href={user ? `/catalog/${cat.slug}` : "/login"}
                  className="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1 pt-2 border-t border-border"
                >
                  Explore {cat.name}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Modules Grid */}
      <section className="border-t border-border bg-muted/30 px-4 sm:px-8 py-14">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="panel panel-pad space-y-3">
            <FlaskConical className="h-7 w-7 text-accent" />
            <h3 className="text-lg font-bold">NGN Clinical Judgment &amp; Case Studies</h3>
            <p className="text-xs muted leading-relaxed">
              Realistic EHR tabs (Nurses&apos; Notes, Vital Signs, Laboratory Results, Orders, Progress Notes) that reveal progressively across all 6 NCJMM clinical judgment steps.
            </p>
          </div>
          <div className="panel panel-pad space-y-3">
            <BarChart3 className="h-7 w-7 text-accent" />
            <h3 className="text-lg font-bold">8-Stage Editorial &amp; AI Governance</h3>
            <p className="text-xs muted leading-relaxed">
              Administrators and clinical reviewers author items or generate AI drafts that progress through Initial, Clinical, and Editorial review with version history and SHA-256 duplicate protection.
            </p>
          </div>
          <div className="panel panel-pad space-y-3">
            <ShieldCheck className="h-7 w-7 text-accent" />
            <h3 className="text-lg font-bold">AUSTY Health Care Business Analytics</h3>
            <p className="text-xs muted leading-relaxed">
              Complete Super Admin &amp; Employee Performance Score (EPS / 100) system with state-wise provider tracking, 7 healthcare revenue categories, and monthly incentive approval workflow.
            </p>
          </div>
        </div>
      </section>

      {/* Footer with Mandatory Independence Disclaimer */}
      <footer className="border-t border-border bg-surface px-4 sm:px-8 py-8 text-xs muted">
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="font-bold text-foreground">
              QREXq — Complete Multi-Exam International Preparation Platform &amp; AUSTY Health Care Analytics
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="hover:underline">
                Sign In
              </Link>
              <Link href="/register" className="hover:underline">
                Register
              </Link>
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <Link href="/austy" className="hover:underline">
                AUSTY ERP
              </Link>
            </div>
          </div>
          <p className="faint leading-relaxed">
            <strong>Educational Independence Disclaimer:</strong> QREXq is an independent educational preparation platform and is not affiliated with, endorsed by, or sponsored by the National Council of State Boards of Nursing (NCSBN), NCLEX, Pearson VUE, NBME, USMLE, IELTS partners, OET, ETS, AAMC, ADA, NABP, NCCPA, College Board, ACT, GMAC, AICPA, CFA Institute, or any other examination organization. All practice questions, NGN case studies, rationales, and score/readiness estimates are original educational simulations.
          </p>
        </div>
      </footer>
    </div>
  );
}
