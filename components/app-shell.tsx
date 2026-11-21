"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Bot,
  BookOpen,
  CheckSquare,
  ClipboardList,
  FileSpreadsheet,
  FlaskConical,
  GraduationCap,
  Layers,
  LogOut,
  Menu,
  Moon,
  PenLine,
  ShieldAlert,
  Sparkles,
  Sun,
  Type,
  User,
  X,
} from "lucide-react";
import { logoutAction } from "@/app/(auth)/actions";

export type ShellUser = {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin" | "reviewer" | "instructor";
  dailyGoal: number;
  subscriptionStatus: string;
};

export type ShellExam = {
  id: number;
  slug: string;
  name: string;
  shortName: string;
  categorySlug?: string;
  /** Whether this exam has case studies (controls the "Case studies" tool link). */
  hasCases?: boolean;
};

const TEXT_SCALES = [
  { label: "A", value: "100%" },
  { label: "A+", value: "108%" },
  { label: "A++", value: "115%" },
];

const ADD_COURSE = "__add__";

export function AppShell({
  user,
  enrolledExams,
  activeExamSlug,
  children,
}: {
  user: ShellUser;
  enrolledExams: ShellExam[];
  activeExamSlug?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const drawerRef = useRef<HTMLDialogElement>(null);
  const [scale, setScale] = useState("100%");
  const [isDark, setIsDark] = useState(false);

  const currentExam =
    enrolledExams.find((e) => e.slug === activeExamSlug) ??
    enrolledExams.find((e) => pathname.includes(`/exam/${e.slug}`)) ??
    enrolledExams[0] ?? { id: 0, slug: "nclex-rn", name: "NCLEX-RN", shortName: "NCLEX-RN" };

  const isStaff = user.role === "admin" || user.role === "reviewer" || user.role === "instructor";
  const inAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    try {
      setScale(localStorage.getItem("qx-text") || "100%");
      setIsDark(document.documentElement.dataset.theme === "dark");
    } catch {
      // ignore storage errors
    }
  }, []);

  function toggleTheme() {
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const stored = localStorage.getItem("qx-theme");
    const currentlyDark = stored ? stored === "dark" : systemDark;
    const target = currentlyDark ? "light" : "dark";
    const systemScheme = systemDark ? "dark" : "light";

    const meta = document.querySelector('meta[name="color-scheme"]') as HTMLMetaElement | null;
    if (target === systemScheme) {
      localStorage.removeItem("qx-theme");
      if (meta) meta.content = "light dark";
    } else {
      localStorage.setItem("qx-theme", target);
      if (meta) meta.content = target;
    }

    if (target === "dark") {
      document.documentElement.dataset.theme = "dark";
      setIsDark(true);
    } else {
      delete document.documentElement.dataset.theme;
      setIsDark(false);
    }
  }

  function cycleTextScale() {
    const idx = TEXT_SCALES.findIndex((s) => s.value === scale);
    const next = TEXT_SCALES[(idx + 1) % TEXT_SCALES.length]!;
    setScale(next.value);
    document.documentElement.style.setProperty("--qx-text-scale", next.value);
    try {
      localStorage.setItem("qx-text", next.value);
    } catch {
      // ignore
    }
  }

  const slug = currentExam.slug;

  // The learner's whole product: five places, in the order they are used.
  const mainNav = [
    { href: `/exam/${slug}`, label: "Today", hint: "Your next step", icon: Activity },
    { href: `/exam/${slug}/learn`, label: "Learn", hint: "Lessons, flashcards, practice by unit", icon: BookOpen },
    { href: `/exam/${slug}/create`, label: "Practice", hint: "Questions with instant feedback", icon: PenLine },
    { href: `/exam/${slug}/tests`, label: "Mock exams", hint: "Timed tests and your history", icon: ClipboardList },
    { href: `/exam/${slug}/analytics`, label: "Progress", hint: "Scores and weak spots", icon: BarChart3 },
  ];
  const toolsNav = [
    { href: `/exam/${slug}/flashcards`, label: "Flashcards", icon: Layers },
    ...(currentExam.hasCases ? [{ href: `/exam/${slug}/cases`, label: "Case studies", icon: FlaskConical }] : []),
    { href: `/exam/${slug}/review`, label: "Review my answers", icon: CheckSquare },
    { href: `/exam/${slug}/assistant`, label: "Ask the AI tutor", icon: Bot },
  ];
  const adminNav = [
    { href: "/admin", label: "Content", icon: ShieldAlert },
    { href: "/admin/questions", label: "Review queue", icon: CheckSquare },
    { href: "/admin/ai", label: "Generate drafts", icon: Sparkles },
    { href: "/admin/courses", label: "Courses", icon: GraduationCap },
    { href: "/admin/import-export", label: "Import & export", icon: FileSpreadsheet },
  ];

  const renderSidebarContent = (onNavigate?: () => void) => (
    <div className="flex h-full flex-col justify-between text-sidebar-fg">
      <div className="space-y-5 overflow-y-auto px-3 py-5">
        <div className="px-2">
          <Link href="/dashboard" onClick={onNavigate} className="flex items-center gap-2.5 text-lg font-bold text-white">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
              <GraduationCap className="h-5 w-5" />
            </span>
            <div>
              <div className="leading-none">QREXq</div>
              <div className="mt-0.5 text-[11px] font-normal text-sidebar-muted">
                {inAdmin ? "Content admin" : "Exam preparation"}
              </div>
            </div>
          </Link>
        </div>

        {inAdmin ? (
          <>
            <Link
              href={`/exam/${slug}`}
              onClick={onNavigate}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-sidebar-fg/80 hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to learning
            </Link>
            <nav aria-label="Administration" className="space-y-1">
              {adminNav.map((item) => {
                const Icon = item.icon;
                const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      active ? "bg-white/15 text-white" : "text-sidebar-fg/85 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </>
        ) : (
          <>
            <div className="px-1">
              <label
                htmlFor="sidebar-exam-switch"
                className="mb-1 block px-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-muted"
              >
                Course
              </label>
              <select
                id="sidebar-exam-switch"
                value={currentExam.slug}
                onChange={(e) => {
                  onNavigate?.();
                  router.push(e.target.value === ADD_COURSE ? "/dashboard" : `/exam/${e.target.value}`);
                }}
                className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white outline-none focus:border-white/40"
              >
                {enrolledExams.map((ex) => (
                  <option key={ex.slug} value={ex.slug} className="text-slate-900">
                    {ex.name}
                  </option>
                ))}
                <option value={ADD_COURSE} className="text-slate-900">
                  + Add or switch course…
                </option>
              </select>
            </div>

            <nav aria-label="Exam preparation" className="space-y-1">
              {mainNav.map((item) => {
                const Icon = item.icon;
                const active = item.href === `/exam/${slug}` ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                      active ? "bg-white/15 text-white" : "text-sidebar-fg/85 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold leading-tight">{item.label}</span>
                      <span className="block truncate text-[11px] font-normal text-sidebar-muted">{item.hint}</span>
                    </span>
                  </Link>
                );
              })}
            </nav>

            <nav aria-label="Study tools" className="space-y-0.5">
              <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-muted">Tools</div>
              {toolsNav.map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      active ? "bg-white/15 text-white" : "text-sidebar-fg/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </>
        )}
      </div>

      <div className="space-y-1 border-t border-white/10 p-3">
        {isStaff && !inAdmin && (
          <Link
            href="/admin"
            onClick={onNavigate}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-sidebar-fg/80 hover:bg-white/10 hover:text-white"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            Content admin
          </Link>
        )}
        <div className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2">
          <Link href="/profile" onClick={onNavigate} className="flex min-w-0 items-center gap-2 text-white" title="Profile & goals">
            <User className="h-4 w-4 shrink-0" />
            <span className="truncate text-xs font-semibold">{user.name}</span>
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              title="Sign out"
              aria-label="Sign out"
              className="rounded-lg p-1.5 text-sidebar-fg hover:bg-white/15 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="no-print hidden bg-sidebar lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        {renderSidebarContent()}
      </aside>

      <dialog
        ref={drawerRef}
        aria-label="Main navigation menu"
        className="m-0 h-full max-h-full w-72 max-w-[85vw] bg-sidebar p-0 text-sidebar-fg open:flex open:flex-col"
      >
        <div className="flex items-center justify-end border-b border-white/10 p-2">
          <button
            type="button"
            onClick={() => drawerRef.current?.close()}
            aria-label="Close navigation menu"
            className="rounded-lg p-2 text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{renderSidebarContent(() => drawerRef.current?.close())}</div>
      </dialog>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="no-print sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => drawerRef.current?.showModal()}
              aria-label="Open navigation menu"
              className="rounded-xl border border-border p-2 hover:bg-muted lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            {!inAdmin && (
              <Link href={`/exam/${currentExam.slug}`} className="text-sm font-semibold hover:underline">
                {currentExam.name}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={cycleTextScale}
              title={`Text size (${scale}) — click to change`}
              aria-label={`Change text size, current ${scale}`}
              className="btn btn-secondary btn-sm font-mono"
            >
              <Type className="h-3.5 w-3.5" />
              <span>{TEXT_SCALES.find((s) => s.value === scale)?.label ?? "A"}</span>
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              title={isDark ? "Switch to light theme" : "Switch to dark theme"}
              className="btn btn-secondary btn-sm"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-6 lg:p-8">{children}</main>

        <footer className="no-print border-t border-border px-4 py-4 text-xs muted sm:px-6">
          <p className="mx-auto max-w-5xl">
            Independent practice platform. Not affiliated with or endorsed by NCSBN, Pearson VUE, NBME, IELTS, OET, ETS, AAMC,
            College Board, or AICPA.
          </p>
        </footer>
      </div>
    </div>
  );
}
