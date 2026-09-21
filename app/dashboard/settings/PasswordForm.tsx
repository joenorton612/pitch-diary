"use client";

import { useActionState } from "react";
import { changePasswordAction, type ActionState } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";

const initialState: ActionState = {};
const inputClass =
  "mt-1.5 w-full rounded-xl border border-cream-300 bg-field px-4 py-2.5 text-sm text-ink outline-none ring-gold-500/30 focus:border-gold-500 focus:ring-4";

export function PasswordForm() {
  const [state, formAction] = useActionState(changePasswordAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4" key={state.success ? "reset" : "form"}>
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-ink/80">
          Current password
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-ink/80">
          New password
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-ink/80">
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          className={inputClass}
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      {state.success && (
        <p className="rounded-lg bg-win/10 px-3 py-2 text-sm text-win">
          Password updated.
        </p>
      )}

      <SubmitButton pendingText="Updating…" className="w-fit">
        Update Password
      </SubmitButton>
    </form>
  );
}
