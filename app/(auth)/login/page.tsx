"use client";

import { useActionState, useState, use } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
import { loginAction, demoLoginAction, type AuthActionState } from "../actions";

const initialState: AuthActionState = {};

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = use(searchParams);
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [oauthNotice, setOauthNotice] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Sign in to QREXq</h2>
        <p className="mt-1 text-sm muted">
          Access your exam courses, NGN case studies, analytics, and admin workspace.
        </p>
      </div>

      {state.error && (
        <div role="alert" className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {state.error}
        </div>
      )}

      <form action={formAction} className="panel panel-pad space-y-4">
        <input type="hidden" name="next" value={params.next ?? ""} />

        <div>
          <label htmlFor="email" className="label">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 faint" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              spellCheck={false}
              enterKeyHint="next"
              required
              placeholder="you@example.com"
              className="field pl-10"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="current-password" className="text-sm font-medium">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs font-medium text-accent hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 faint" />
            <input
              id="current-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              enterKeyHint="done"
              required
              placeholder="Enter your password"
              className="field pl-10 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2.5 top-2 rounded-lg p-1.5 text-xs muted hover:bg-muted"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={pending} className="btn btn-primary w-full">
          {pending ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <div className="panel panel-pad space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider faint">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          One-Click Demo Role Access
        </div>
        <p className="text-xs muted">
          Instantly explore the platform as a Student, Clinical Content Reviewer, or Super Admin (including AUSTY Health Care Analytics):
        </p>
        <div className="grid grid-cols-3 gap-2">
          <form action={demoLoginAction}>
            <input type="hidden" name="role" value="student" />
            <button type="submit" className="btn btn-secondary btn-sm w-full">
              Student
            </button>
          </form>
          <form action={demoLoginAction}>
            <input type="hidden" name="role" value="reviewer" />
            <button type="submit" className="btn btn-secondary btn-sm w-full">
              Reviewer
            </button>
          </form>
          <form action={demoLoginAction}>
            <input type="hidden" name="role" value="admin" />
            <button type="submit" className="btn btn-secondary btn-sm w-full">
              Super Admin
            </button>
          </form>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setOauthNotice("Google OAuth sign-in is ready to wire once GOOGLE_CLIENT_ID is added to .env.local.")}
            className="btn btn-secondary text-xs"
          >
            Continue with Google
          </button>
          <button
            type="button"
            onClick={() => setOauthNotice("Apple OAuth sign-in is ready to wire once APPLE_CLIENT_ID is added to .env.local.")}
            className="btn btn-secondary text-xs"
          >
            Continue with Apple
          </button>
        </div>
        {oauthNotice && <p className="text-xs muted text-center">{oauthNotice}</p>}
      </div>

      <p className="text-center text-sm muted">
        New to QREXq?{" "}
        <Link href="/register" className="font-semibold text-accent hover:underline">
          Create a student account
        </Link>
      </p>
    </div>
  );
}
