"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Briefcase,
  CheckSquare,
  ChevronRight,
  ClipboardList,
  CreditCard,
  FileSpreadsheet,
  FlaskConical,
  GraduationCap,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  PlusCircle,
  ShieldAlert,
  Sparkles,
  Sun,
  Type,
  User,
  Users,
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
};

const TEXT_SCALES = [
  { label: "A", value: "100%", title: "Standard text size" },
  { label: "A+", value: "108%", title: "Large text size" },
  { label: "A++", value: "115%", title: "Extra-large text size" },
];

export function AppShell({
  user,
  enrolledExams,
  activeExamSlug,
  unreadNotifications = 0,
  children,
}: {
  user: ShellUser;
  enrolledExams: ShellExam[];
  activeExamSlug?: string;
  unreadNotifications?: number;
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
    enrolledExams[0] ?? {
      id: 0,
      slug: "nclex-rn",
      name: "NCLEX-RN",
      shortName: "NCLEX-RN",
    };

  useEffect(() => {
    try {
      const savedScale = localStorage.getItem("qx-text") || "100%";
      setScale(savedScale);
      setIsDark(document.documentElement.dataset.theme === "dark");
    } catch {
      // ignore storage errors
    }
  }, []);

  /**
   * Two-state theme toggle following modern-web-guidance `dark-mode-toggle`:
   * computes target opposite of currently rendered scheme, removes stored value
   * when target matches OS preference, and syncs `<meta name="color-scheme">`.
   */
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
  const studentNav = [
    { href: "/dashboard", label: "All Exams & Courses", icon: LayoutDashboard },
    { href: `/exam/${slug}`, label: `${currentExam.shortName} Overview`, icon: Activity },
    { href: `/exam/${slug}/create`, label: "Create Custom Test", icon: PlusCircle },
    { href: `/exam/${slug}/tests`, label: "Tests & Mock Exams", icon: ClipboardList },
    { href: `/exam/${slug}/cases`, label: "NGN Case Studies", icon: FlaskConical },
    { href: `/exam/${slug}/review`, label: "Question Bank & Review", icon: CheckSquare },
    { href: `/exam/${slug}/analytics`, label: "Performance Analytics", icon: BarChart3 },
    { href: `/exam/${slug}/study`, label: "Notes, Guides & Videos", icon: BookOpen },
    { href: `/exam/${slug}/flashcards`, label: "Spaced Flashcards", icon: Layers },
    { href: `/exam/${slug}/assistant`, label: "AI Study Tutor", icon: Bot },
  ];

  const isStaff = user.role === "admin" || user.role === "reviewer" || user.role === "instructor";

  const staffNav = [
    { href: "/admin", label: "Admin & Review Console", icon: ShieldAlert },
    { href: "/admin/questions", label: "Question Bank & Workflow", icon: CheckSquare },
    { href: "/admin/ai", label: "AI Question Generator", icon: Sparkles },
    { href: "/admin/courses", label: "Exam Course Manager", icon: GraduationCap },
    { href: "/admin/import-export", label: "Import & Export", icon: FileSpreadsheet },
    { href: "/austy", label: "AUSTY Health Care ERP", icon: Briefcase },
  ];

  const accountNav = [
    { href: "/austy", label: "AUSTY Employee Portal", icon: Award },
    { href: "/plans", label: "Plans & Subscriptions", icon: CreditCard },
    { href: "/notifications", label: "Notifications", icon: Bell, badge: unreadNotifications },
    { href: "/profile", label: "Profile & Targets", icon: User },
  ];

  const renderSidebarContent = (onNavigate?: () => void) => (
    <div className="flex h-full flex-col justify-between text-sidebar-fg">
      <div className="space-y-5 overflow-y-auto px-3 py-5">
        <div className="flex items-center justify-between px-3">
          <Link href="/dashboard" onClick={onNavigate} className="flex items-center gap-2.5 text-lg font-bold text-white">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
              <GraduationCap className="h-5 w-5" />
            </span>
            <div>
              <div className="leading-none">QREXq</div>
              <div className="text-[11px] font-normal text-sidebar-muted mt-0.5">Multi-Exam &amp; AUSTY Suite</div>
            </div>
          </Link>
        </div>

        {/* Active course switcher */}
        <div className="px-2">
          <label htmlFor="sidebar-exam-switch" className="block px-1 mb-1 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">
            Active Course
          </label>
          <select
            id="sidebar-exam-switch"
            value={currentExam.slug}
            onChange={(e) => {
              onNavigate?.();
              router.push(`/exam/${e.target.value}`);
            }}
            className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white outline-none focus:border-white/40"
          >
            {enrolledExams.map((ex) => (
              <option key={ex.slug} value={ex.slug} className="text-slate-900">
                {ex.name}
              </option>
            ))}
          </select>
        </div>

        <nav aria-label="Study navigation" className="space-y-1">
          <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">
            Exam Preparation
          </div>
          {studentNav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                  active ? "bg-white/15 text-white font-semibold" : "text-sidebar-fg/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </span>
                {active && <ChevronRight className="h-3.5 w-3.5 opacity-75" />}
              </Link>
            );
          })}
        </nav>

        {isStaff && (
          <nav aria-label="Administration navigation" className="space-y-1 pt-2 border-t border-white/10">
            <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">
              Admin &amp; Enterprise
            </div>
            {staffNav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                    active ? "bg-white/15 text-white font-semibold" : "text-sidebar-fg/85 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </span>
                </Link>
              );
            })}
          </nav>
        )}

        <nav aria-label="Account navigation" className="space-y-1 pt-2 border-t border-white/10">
          <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">
            Account &amp; Modules
          </div>
          {accountNav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                  active ? "bg-white/15 text-white font-semibold" : "text-sidebar-fg/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </span>
                {item.badge ? (
                  <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2.5">
          <div className="min-w-0">
            <div className="truncate text-xs font-semibold text-white">{user.name}</div>
            <div className="truncate text-[11px] text-sidebar-muted capitalize">
              {user.role} · {user.subscriptionStatus}
            </div>
          </div>
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
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="no-print hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-sidebar">
        {renderSidebarContent()}
      </aside>

      {/* Mobile navigation drawer using native modal <dialog> */}
      <dialog
        ref={drawerRef}
        aria-label="Main navigation menu"
        className="m-0 h-full max-h-full w-72 max-w-[85vw] bg-sidebar p-0 text-sidebar-fg open:flex open:flex-col"
      >
        <div className="flex items-center justify-end p-2 border-b border-white/10">
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

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <header className="no-print sticky top-0 z-20 flex h-15 items-center justify-between gap-3 border-b border-border bg-surface/90 px-4 sm:px-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => drawerRef.current?.showModal()}
              aria-label="Open navigation menu"
              className="lg:hidden rounded-xl border border-border p-2 hover:bg-muted"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span className="hidden sm:inline text-xs font-medium muted">Course:</span>
              <Link href={`/exam/${currentExam.slug}`} className="chip bg-accent-subtle text-accent border-accent/25">
                {currentExam.name}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/exam/${currentExam.slug}/create`} className="btn btn-primary btn-sm hidden sm:inline-flex">
              <PlusCircle className="h-3.5 w-3.5" />
              Create Test
            </Link>

            <button
              type="button"
              onClick={cycleTextScale}
              title={`Text size (${scale}) — click to resize`}
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

            <Link
              href="/notifications"
              aria-label="Notifications"
              className="relative rounded-xl border border-border p-2 hover:bg-muted"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                  {unreadNotifications}
                </span>
              )}
            </Link>

            {isStaff && (
              <Link href="/admin" className="btn btn-secondary btn-sm hidden md:inline-flex">
                <Users className="h-3.5 w-3.5" />
                Admin
              </Link>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>

        <footer className="no-print border-t border-border px-4 py-4 sm:px-6 text-xs muted">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p>
              <strong>QREXq International Exam Preparation &amp; AUSTY Health Care Analytics</strong> — Independent educational platform.
            </p>
            <p className="faint">
              Not affiliated with or endorsed by NCSBN, Pearson VUE, NBME, IELTS, OET, ETS, AAMC, College Board, or AICPA.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
