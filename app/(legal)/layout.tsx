import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex h-16 items-center justify-between border-b border-border px-4 sm:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white">
            <GraduationCap className="h-5 w-5" />
          </span>
          QREXq
        </Link>
        <Link href="/login" className="text-sm font-semibold text-accent hover:underline">
          Sign in
        </Link>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-8">{children}</main>
      <footer className="border-t border-border px-4 py-6 text-xs muted sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
          <span>Independent educational platform. Not affiliated with or endorsed by any examination body.</span>
          <nav aria-label="Legal" className="flex gap-4 font-semibold">
            <Link href="/privacy" className="hover:text-foreground hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground hover:underline">
              Terms &amp; Conditions
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
