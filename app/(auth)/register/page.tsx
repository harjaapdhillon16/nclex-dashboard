"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { registerAction, type AuthActionState } from "../actions";

const initialState: AuthActionState = {};

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Create your QREXq account</h2>
        <p className="mt-1 text-sm muted">
          Start preparing for NCLEX-RN, IELTS, USMLE, MCAT, and 40+ international exams.
        </p>
      </div>

      {state.error && (
        <div role="alert" className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {state.error}
        </div>
      )}

      <form action={formAction} className="panel panel-pad space-y-4">
        <div>
          <label htmlFor="full-name" className="label">
            Full name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 faint" />
            <input
              id="full-name"
              name="name"
              type="text"
              autoComplete="name"
              enterKeyHint="next"
              required
              placeholder="Alex Rivera"
              className="field pl-10"
            />
          </div>
        </div>

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
          <label htmlFor="new-password" className="label">
            Password (minimum 8 characters)
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 faint" />
            <input
              id="new-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              enterKeyHint="next"
              minLength={8}
              required
              placeholder="Create a strong password"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="studyLevel" className="label">
              Current study level
            </label>
            <select id="studyLevel" name="studyLevel" className="field" defaultValue="Final-year Nursing Student">
              <option value="Final-year Nursing Student">Final-year Nursing Student</option>
              <option value="Nursing Graduate / First-time Test Taker">Nursing Graduate / First-time</option>
              <option value="International Nurse (IEN)">International Nurse (IEN)</option>
              <option value="Repeat Test Taker">Repeat Test Taker</option>
              <option value="Medical / Allied Health Candidate">Medical / Allied Health</option>
              <option value="Graduate / Professional Candidate">Graduate / Professional</option>
            </select>
          </div>
          <div>
            <label htmlFor="targetExamDate" className="label">
              Target exam date (optional)
            </label>
            <input id="targetExamDate" name="targetExamDate" type="date" className="field" />
          </div>
        </div>

        <p className="text-xs leading-relaxed muted">
          By creating an account you agree to our{" "}
          <Link href="/terms" target="_blank" className="font-semibold text-accent underline">
            Terms &amp; Conditions
          </Link>{" "}
          and{" "}
          <Link href="/privacy" target="_blank" className="font-semibold text-accent underline">
            Privacy Policy
          </Link>
          .
        </p>

        <button type="submit" disabled={pending} className="btn btn-primary w-full">
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-center text-sm muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
