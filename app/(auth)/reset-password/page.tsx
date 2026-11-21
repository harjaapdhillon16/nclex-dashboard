"use client";

import { useActionState, useState, use } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock } from "lucide-react";
import { resetPasswordAction, type AuthActionState } from "../actions";

const initialState: AuthActionState = {};

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = use(searchParams);
  const [state, formAction, pending] = useActionState(resetPasswordAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Choose a new password</h2>
        <p className="mt-1 text-sm muted">Enter a strong new password of at least 8 characters.</p>
      </div>

      {state.error && (
        <div role="alert" className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {state.error}
        </div>
      )}

      {state.success ? (
        <div className="panel panel-pad space-y-4">
          <p className="text-sm font-medium text-success">{state.success}</p>
          <Link href="/login" className="btn btn-primary w-full">
            Sign In
          </Link>
        </div>
      ) : (
        <form action={formAction} className="panel panel-pad space-y-4">
          <input type="hidden" name="token" value={token} />
          <div>
            <label htmlFor="new-password" className="label">
              New password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 faint" />
              <input
                id="new-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                minLength={8}
                required
                placeholder="At least 8 characters"
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

          <button type="submit" disabled={pending || !token} className="btn btn-primary w-full">
            {pending ? "Updating password…" : "Update password"}
          </button>
        </form>
      )}
    </div>
  );
}
