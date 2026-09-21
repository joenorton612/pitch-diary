"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signinAction, type ActionState } from "@/lib/actions";
import { AuthShell } from "@/components/AuthShell";
import { SubmitButton } from "@/components/SubmitButton";

const initialState: ActionState = {};

export default function SigninPage() {
  const [state, formAction] = useActionState(signinAction, initialState);

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to keep your diary up to date."
      footer={
        <>
          New to Pitch Diary?{" "}
          <Link href="/signup" className="font-semibold text-gold-300 hover:underline">
            Join now
          </Link>
        </>
      }
    >
      <form action={formAction} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink/80">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="mt-1.5 w-full rounded-xl border border-cream-300 bg-field px-4 py-2.5 text-sm text-ink outline-none ring-gold-500/30 focus:border-gold-500 focus:ring-4"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-ink/80">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Your password"
            className="mt-1.5 w-full rounded-xl border border-cream-300 bg-field px-4 py-2.5 text-sm text-ink outline-none ring-gold-500/30 focus:border-gold-500 focus:ring-4"
          />
        </div>

        {state.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <SubmitButton pendingText="Signing in…" className="mt-2 w-full">
          Sign In
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
