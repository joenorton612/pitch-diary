"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction, type ActionState } from "@/lib/actions";
import { AuthShell } from "@/components/AuthShell";
import { SubmitButton } from "@/components/SubmitButton";

const initialState: ActionState = {};

export default function SignupPage() {
  const [state, formAction] = useActionState(signupAction, initialState);

  return (
    <AuthShell
      title="Join Pitch Diary"
      subtitle="Create your free account to start logging matches."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/signin" className="font-semibold text-gold-300 hover:underline">
            Sign in
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
            minLength={6}
            autoComplete="new-password"
            placeholder="At least 6 characters"
            className="mt-1.5 w-full rounded-xl border border-cream-300 bg-field px-4 py-2.5 text-sm text-ink outline-none ring-gold-500/30 focus:border-gold-500 focus:ring-4"
          />
        </div>

        {state.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <SubmitButton pendingText="Creating account…" className="mt-2 w-full">
          Create Account
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
