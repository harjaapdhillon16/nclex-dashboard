import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background text-foreground">
      <div
        className="lg:w-[44%] p-8 lg:p-12 flex flex-col justify-between text-white"
        style={{ background: "var(--hero)" }}
      >
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5 text-xl font-bold tracking-tight">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <GraduationCap className="h-6 w-6" />
            </span>
            <span>QREXq</span>
          </Link>
        </div>

        <div className="my-10 space-y-4 max-w-md">
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">Pass your exam. Know exactly what to study next.</h1>
          <p className="text-sm sm:text-base text-white/85 leading-relaxed">
            Learn each topic, practice with exam-style questions, then test yourself with timed mock exams.
          </p>
        </div>

        <div className="text-xs text-white/75 space-y-1 border-t border-white/15 pt-4">
          <p>
            Independent educational preparation platform. Not affiliated with or endorsed by NCSBN, Pearson VUE, NBME, IELTS partners, OET, ETS, AAMC, College Board, or AICPA.
          </p>
          <p className="flex gap-4 pt-1 font-semibold text-white/90">
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms &amp; Conditions
            </Link>
          </p>
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
