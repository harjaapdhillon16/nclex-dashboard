import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardList, GraduationCap, PenLine } from "lucide-react";
import { EXAM_CATEGORIES, EXAMS } from "@/lib/seed/catalog";
import { getCurrentUser } from "@/lib/auth";
import { demoLoginAction } from "@/app/(auth)/actions";

/** Categories not advertised on the landing page. */
const HIDDEN_CATEGORIES: ReadonlySet<string> = new Set(["medical", "college", "graduate", "professional"]);

const STEPS = [
  {
    icon: BookOpen,
    title: "Learn",
    text: "The exam is split into units. Each one has short lessons and flashcards, so you always know what to study next.",
  },
  {
    icon: PenLine,
    title: "Practice",
    text: "Exam-style questions with the answer and the reasoning after each one. Build a test from exactly the topics you pick.",
  },
  {
    icon: ClipboardList,
    title: "Test yourself",
    text: "Timed mock exams under real conditions, then a clear breakdown of what to fix before exam day.",
  },
];

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex h-16 items-center justify-between border-b border-border px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white">
            <GraduationCap className="h-5 w-5" />
          </span>
          QREXq
        </Link>
        <div className="flex items-center gap-2">
          {user ? (
            <Link href="/dashboard" className="btn btn-primary btn-sm">
              Open my courses
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary btn-sm">
                Sign in
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Create account
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="px-4 py-16 sm:px-8 sm:py-24" style={{ background: "var(--hero)" }}>
        <div className="mx-auto max-w-3xl space-y-6 text-center text-white">
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            Pass your exam. Always know what to study next.
          </h1>
          <p className="mx-auto max-w-xl text-base text-white/85">
            Lessons, a question bank and mock exams for NCLEX-RN, USMLE, IELTS, MCAT and {EXAMS.length - 4} more exams, with
            one clear next step every day.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-lg hover:bg-white/95"
              >
                Continue studying
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <form action={demoLoginAction}>
                  <input type="hidden" name="role" value="student" />
                  <button
                    type="submit"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-lg hover:bg-white/95"
                  >
                    Try it now (no sign-up)
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20"
                >
                  Create a free account
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-8">
        <h2 className="mb-6 text-center text-2xl font-bold tracking-tight">How it works</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="panel panel-pad space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs text-white">{i + 1}</span>
                <s.icon className="h-4 w-4 text-accent" />
                {s.title}
              </div>
              <p className="text-sm muted">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-8">
        <h2 className="mb-1 text-center text-2xl font-bold tracking-tight">Courses</h2>
        <p className="mb-6 text-center text-sm muted">Pick your exam when you sign in.</p>
        <div className="space-y-3">
          {EXAM_CATEGORIES.filter((cat) => !HIDDEN_CATEGORIES.has(cat.slug)).map((cat) => {
            const courses = EXAMS.filter((e) => e.category === cat.slug);
            return (
              <div key={cat.slug} className="flex flex-col gap-2 border-b border-border pb-3 sm:flex-row sm:items-baseline sm:gap-6">
                <div className="text-sm font-semibold sm:w-56 sm:shrink-0">{cat.name}</div>
                <div className="flex flex-wrap gap-1.5">
                  {courses.map((c) => (
                    <span key={c.slug} className="chip bg-muted/60 text-xs">
                      {c.shortName}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="mt-auto border-t border-border px-4 py-6 text-xs muted sm:px-8">
        <p className="mx-auto max-w-5xl leading-relaxed">
          Independent practice platform. Not affiliated with or endorsed by NCSBN, NCLEX, Pearson VUE, NBME, USMLE, IELTS partners,
          OET, ETS, AAMC, ADA, NABP, NCCPA, College Board, ACT, GMAC, or AICPA.
        </p>
        <nav aria-label="Legal" className="mx-auto mt-3 flex max-w-5xl gap-4 font-semibold">
          <Link href="/privacy" className="hover:text-foreground hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground hover:underline">
            Terms &amp; Conditions
          </Link>
        </nav>
      </footer>
    </div>
  );
}
