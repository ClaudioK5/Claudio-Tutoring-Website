"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/admin/actions";

export function LoginForm({ configured }: { configured: boolean }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, undefined);

  return (
    <div className="admin-card admin-rise w-full max-w-sm p-8 sm:p-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0B1E3F] via-[#1D3F8F] to-[#10B981] text-white shadow-lg shadow-emerald-500/20">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
          <rect x="4" y="10.5" width="16" height="10" rx="2.5" />
          <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" strokeLinecap="round" />
        </svg>
      </div>

      <h1 className="mt-6 text-center text-2xl font-bold">Private dashboard</h1>
      <p className="mt-2 text-center text-sm text-slate-500">Enter your PIN to continue.</p>

      {configured ? (
        <form action={formAction} className="mt-8 space-y-4">
          <label htmlFor="pin" className="sr-only">
            PIN
          </label>
          <input
            id="pin"
            name="pin"
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            autoFocus
            required
            placeholder="••••"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-center text-2xl font-semibold tracking-[0.5em] text-[#0B1E3F] outline-none transition placeholder:text-slate-300 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
          />

          {state?.error && (
            <p role="alert" className="admin-fade text-center text-sm font-medium text-rose-600">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-2xl bg-gradient-to-r from-[#0B1E3F] to-[#1D3F8F] px-5 py-4 text-base font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:translate-y-0 disabled:opacity-60"
          >
            {pending ? "Checking…" : "Unlock"}
          </button>
        </form>
      ) : (
        <p className="mt-8 rounded-2xl bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-800">
          Login is not configured yet. Set <code className="font-semibold">ADMIN_PIN_HASH</code> and{" "}
          <code className="font-semibold">ADMIN_SESSION_SECRET</code> in the environment variables.
        </p>
      )}
    </div>
  );
}
