import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  CalendarDays,
  FileText,
  Gauge,
  GraduationCap,
  Layers,
  PenLine,
  Sparkles,
} from "lucide-react";
import { EXAM_CATEGORIES, EXAMS } from "@/lib/seed/catalog";
import { getCurrentUser } from "@/lib/auth";
import { demoLoginAction } from "@/app/(auth)/actions";

/** Categories not advertised on the landing page. */
const HIDDEN_CATEGORIES: ReadonlySet<string> = new Set(["college", "graduate", "professional"]);

const topicsOf = (e: (typeof EXAMS)[number]) => e.taxonomy.reduce((n, t) => n + (t.children?.length ?? 0), 0);
const fmt = (n: number) => n.toLocaleString("en-US");

const FEATURES = [
  {
    icon: PenLine,
    title: "Build any test in seconds",
    text: "Pick subjects, body systems or single topics, draw from unused, incorrect or marked questions, and choose Tutor, Timed or Exam mode.",
    span: "md:col-span-2",
  },
  { icon: Gauge, title: "Readiness exams", text: "Full-length assessments that show whether you are on track to pass, with pass targets you can see.", span: "" },
  { icon: FileText, title: "Cheat sheets", text: "One-page high-yield summaries, filterable by subject and body system.", span: "" },
  { icon: Layers, title: "Flashcards", text: "Spaced-repetition cards for every unit, so facts stay put.", span: "" },
  { icon: CalendarDays, title: "Study schedule", text: "Enter your exam date and get a day-by-day plan that finishes early enough to review.", span: "" },
  { icon: Bot, title: "AI tutor", text: "Ask why an answer is wrong, or for a topic explained another way, right next to the question.", span: "md:col-span-3" },
];

const STEPS = [
  { n: "01", title: "Pick your exam", text: "Choose from nursing, medical, pharmacy, PA, dental and English exams." },
  { n: "02", title: "Practice with feedback", text: "Exam-style questions with the answer and the reasoning after each one." },
  { n: "03", title: "Test yourself", text: "Timed mocks and readiness exams, then a clear breakdown of what to fix." },
];

/** White pill button with a dark arrow chip, as used for the main calls to action. */
const ctaClass =
  "group inline-flex cursor-pointer items-center gap-3 rounded-xl bg-white py-2 pl-5 pr-2 text-sm font-semibold text-black transition hover:bg-white/90";
const chip = (
  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white transition group-hover:translate-x-0.5">
    <ArrowUpRight className="h-4 w-4" />
  </span>
);

export default async function LandingPage() {
  const user = await getCurrentUser();

  const visibleCategories = EXAM_CATEGORIES.filter((c) => !HIDDEN_CATEGORIES.has(c.slug));
  const visibleExams = EXAMS.filter((e) => !HIDDEN_CATEGORIES.has(e.category));
  const totalTopics = visibleExams.reduce((n, e) => n + topicsOf(e), 0);
  const deepest = [...visibleExams].sort((a, b) => topicsOf(b) - topicsOf(a)).slice(0, 8);
  const maxTopics = topicsOf(deepest[0]!);

  const primaryCta = user ? (
    <Link href="/dashboard" className={ctaClass}>
      Continue studying {chip}
    </Link>
  ) : (
    <form action={demoLoginAction}>
      <input type="hidden" name="role" value="student" />
      <button type="submit" className={ctaClass}>
        Try it now, no sign-up {chip}
      </button>
    </form>
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#07070b] text-white">
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="qx-pixels pointer-events-none absolute -bottom-24 -left-24 -z-10 h-[620px] w-[900px] opacity-90" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-[#7c3aed]/10 to-transparent" />

        <header className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-semibold tracking-tight">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
              <GraduationCap className="h-5 w-5" />
            </span>
            QREXq
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-8 text-[15px] font-medium text-white/60 md:flex">
            <a href="#features" className="border-b border-white pb-1 text-white">Features</a>
            <a href="#syllabus" className="pb-1 hover:text-white">Syllabus</a>
            <a href="#courses" className="pb-1 hover:text-white">Courses</a>
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <Link href="/dashboard" className="rounded-xl border border-white/80 px-5 py-2.5 text-sm font-semibold hover:bg-white hover:text-black">
                My courses
              </Link>
            ) : (
              <>
                <Link href="/login" className="rounded-xl border border-white/80 px-5 py-2.5 text-sm font-semibold transition hover:bg-white hover:text-black">
                  Sign in
                </Link>
                <Link href="/register" className="hidden rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-white/90 sm:inline-block">
                  Get started
                </Link>
              </>
            )}
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-24 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-12 lg:pb-32">
          <div className="lg:col-span-7">
            <a
              href="#syllabus"
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1.5 pl-3 pr-4 text-xs font-medium text-white/80 hover:bg-white/10"
            >
              <Sparkles className="h-3.5 w-3.5 text-violet-300" />
              New: {fmt(totalTopics)} syllabus topics across {visibleExams.length} exams
            </a>
            <h1 className="text-[2.6rem] font-medium leading-[1.04] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
              Your boards, mapped topic by topic.
            </h1>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              {primaryCta}
              <a
                href="#courses"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                Browse exams
              </a>
            </div>
            <p className="mt-24 max-w-md text-lg leading-snug text-white/80 sm:text-xl">
              A question bank, lessons and readiness exams for NCLEX, USMLE, COMLEX, PANCE, NAPLEX and more, with one clear next step every
              day.
            </p>
          </div>

          {/* Product preview */}
          <div aria-hidden className="relative hidden lg:col-span-5 lg:block">
            <div className="qx-float absolute right-0 top-0 w-[340px] overflow-hidden rounded-2xl border border-white/15 bg-white text-slate-900 shadow-[0_30px_80px_-20px_rgba(124,58,237,.55)]" style={{ ["--r" as string]: "0deg" }}>
              <div className="bg-[#1b5ea8] px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-white">NCLEX-RN Test · Item 5 of 6</div>
              <div className="space-y-2 p-4 text-[11px] leading-snug">
                <div className="h-2 w-11/12 rounded bg-slate-200" />
                <div className="h-2 w-10/12 rounded bg-slate-200" />
                <div className="h-2 w-6/12 rounded bg-slate-200" />
                <div className="mt-3 space-y-1.5">
                  {["Reassess airway and breathing", "Administer prescribed diuretic", "Notify the charge nurse"].map((o, i) => (
                    <div key={o} className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 ${i === 1 ? "border-[#1b5ea8] bg-[#1b5ea8]/10" : "border-slate-200"}`}>
                      <span className={`h-3 w-3 rounded-full border ${i === 1 ? "border-[#1b5ea8] bg-[#1b5ea8]" : "border-slate-300"}`} />
                      {o}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between bg-[#1b5ea8] px-3 py-2 text-[10px] font-semibold text-white">
                <span>End</span>
                <span className="flex gap-1">
                  <span className="rounded bg-[#e8856f] px-1.5 py-0.5">Learning</span>
                  <span className="rounded bg-[#f1c84b] px-1.5 py-0.5 text-black">Reviewing</span>
                  <span className="rounded bg-[#59b86f] px-1.5 py-0.5">Mastered</span>
                </span>
                <span>Prev · Next</span>
              </div>
            </div>

            <div className="qx-float absolute -bottom-10 left-0 w-[260px] rounded-2xl border border-white/15 bg-[#12121a]/90 p-4 shadow-2xl backdrop-blur" style={{ ["--r" as string]: "0deg", animationDelay: "1.4s" }}>
              <div className="text-xs font-semibold text-white/90">Pass targets</div>
              <div className="mt-3 space-y-3">
                {[
                  ["Your score", 71],
                  ["Question bank used", 58],
                  ["Readiness exams", 100],
                ].map(([l, v]) => (
                  <div key={l as string}>
                    <div className="mb-1 flex justify-between text-[11px] text-white/70">
                      <span>{l}</span>
                      <span>{v}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-300" style={{ width: `${v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-[10px] text-white/40">Sample data for illustration</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stat strip */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4">
          {[
            [fmt(totalTopics), "syllabus topics mapped"],
            [String(visibleExams.length), "exams in six categories"],
            ["3", "test modes: tutor, timed, exam"],
            ["NGN", "case studies, bow-tie, matrix and trend items"],
          ].map(([v, l]) => (
            <div key={l}>
              <div className="text-3xl font-medium tracking-tight">{v}</div>
              <div className="mt-1 text-sm text-white/50">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
        <p className="text-sm font-medium text-violet-300">One platform</p>
        <h2 className="mt-3 max-w-2xl text-4xl font-medium tracking-[-0.03em] sm:text-5xl">Everything you need to pass, in one place</h2>
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className={`group space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-violet-400/40 hover:bg-white/[0.05] ${f.span}`}>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-semibold tracking-tight">{f.title}</h3>
              <p className="max-w-xl text-sm leading-relaxed text-white/55">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Syllabus depth */}
      <section id="syllabus" className="border-t border-white/10">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <p className="text-sm font-medium text-violet-300">Syllabus depth</p>
            <h2 className="text-4xl font-medium tracking-[-0.03em] sm:text-5xl">Every subject, system and topic mapped</h2>
            <p className="text-base leading-relaxed text-white/55">
              Each exam is broken into subjects, organ systems and specific topics, so you can drill exactly the area you are weakest in.
            </p>
          </div>
          <div className="space-y-3 lg:col-span-3">
            {deepest.map((e) => (
              <div key={e.slug} className="grid grid-cols-12 items-center gap-3 text-sm">
                <span className="col-span-4 truncate font-medium text-white/80 sm:col-span-3">{e.shortName}</span>
                <div className="col-span-6 h-2.5 rounded-full bg-white/10 sm:col-span-7">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-300" style={{ width: `${(topicsOf(e) / maxTopics) * 100}%` }} />
                </div>
                <span className="col-span-2 text-right tabular-nums text-white/70">{fmt(topicsOf(e))}</span>
              </div>
            ))}
            <p className="pt-2 text-xs text-white/35">Topics per exam, from the live course catalog.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <p className="text-sm font-medium text-violet-300">How it works</p>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="text-4xl font-medium tracking-tight text-violet-300">{s.n}</div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-white/55">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <p className="text-sm font-medium text-violet-300">Courses</p>
          <h2 className="mt-3 text-4xl font-medium tracking-[-0.03em] sm:text-5xl">Pick your exam</h2>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            {visibleCategories.map((cat) => {
              const courses = EXAMS.filter((e) => e.category === cat.slug);
              const topics = courses.reduce((n, e) => n + topicsOf(e), 0);
              return (
                <div key={cat.slug} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-lg font-semibold tracking-tight">{cat.name}</h3>
                    <span className="shrink-0 text-xs text-white/40">
                      {courses.length} exams · {fmt(topics)} topics
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {courses.map((c) => (
                      <span key={c.slug} className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-white/75">
                        {c.shortName}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-24 sm:px-6">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#2e1065] via-[#4c1d95] to-[#6d28d9] p-8 sm:p-14">
          <div aria-hidden className="qx-pixels pointer-events-none absolute -bottom-32 -right-24 h-[420px] w-[620px] opacity-40" />
          <h2 className="relative max-w-xl text-3xl font-medium tracking-[-0.03em] sm:text-5xl">Start with a five-question warm-up today.</h2>
          <div className="relative mt-8 flex flex-wrap gap-3">
            {user ? (
              <Link href="/dashboard" className={ctaClass}>
                Open my courses {chip}
              </Link>
            ) : (
              <>
                <Link href="/register" className={ctaClass}>
                  Create a free account {chip}
                </Link>
                <Link href="/login" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3.5 text-sm font-semibold hover:bg-white/10">
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <footer className="mt-auto border-t border-white/10 px-4 py-8 text-xs text-white/45 sm:px-6">
        <p className="mx-auto max-w-6xl leading-relaxed">
          Independent practice platform. Not affiliated with or endorsed by NCSBN, NCLEX, Pearson VUE, NBME, USMLE, IELTS partners, OET,
          ETS, AAMC, ADA, NABP, NCCPA, College Board, ACT, GMAC, or AICPA.
        </p>
        <nav aria-label="Legal" className="mx-auto mt-3 flex max-w-6xl gap-5 font-semibold">
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white">Terms &amp; Conditions</Link>
        </nav>
      </footer>
    </div>
  );
}
