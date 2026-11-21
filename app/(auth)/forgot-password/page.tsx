"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { forgotPasswordAction, type AuthActionState } from "../actions";

const initialState: AuthActionState = {};

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, initialState);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-medium muted hover:text-foreground mb-3">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">Reset your password</h2>
        <p className="mt-1 text-sm muted">
          Enter the email address associated with your account and we&apos;ll generate a one-time password reset link.
        </p>
      </div>

      {state.error && (
        <div role="alert" className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {state.error}
        </div>
      )}

      {state.success && (
        <div role="status" className="rounded-xl border border-success/40 bg-success/10 px-4 py-3 text-sm space-y-2">
          <p className="font-medium">{state.success}</p>
          {state.previewUrl && (
            <p className="text-xs break-all">
              Development reset link:{" "}
              <Link href={state.previewUrl} className="font-semibold text-accent underline">
                {state.previewUrl}
              </Link>
            </p>
          )}
        </div>
      )}

      <form action={formAction} className="panel panel-pad space-y-4">
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
              required
              placeholder="you@example.com"
              className="field pl-10"
            />
          </div>
        </div>

        <button type="submit" disabled={pending} className="btn btn-primary w-full">
          {pending ? "Sending reset link…" : "Send reset link"}
        </button>
      </form>
    </div>
  );
}
