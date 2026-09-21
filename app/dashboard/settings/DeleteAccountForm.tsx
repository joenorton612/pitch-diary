"use client";

import { useActionState, useState } from "react";
import { deleteAccountAction, type ActionState } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";

const initialState: ActionState = {};

export function DeleteAccountForm() {
  const [confirming, setConfirming] = useState(false);
  const [state, formAction] = useActionState(deleteAccountAction, initialState);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
      >
        Delete Account
      </button>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <p className="text-sm text-ink/70">
        This permanently deletes your account, every match you&apos;ve logged, and all
        of your seasons. This can&apos;t be undone. Enter your password to confirm.
      </p>

      <div>
        <label htmlFor="deletePassword" className="block text-sm font-medium text-ink/80">
          Password
        </label>
        <input
          id="deletePassword"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1.5 w-full max-w-sm rounded-xl border border-cream-300 bg-field px-4 py-2.5 text-sm text-ink outline-none ring-red-400/30 focus:border-red-400 focus:ring-4"
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-full border border-cream-300 px-5 py-2.5 text-sm font-semibold text-ink/70 transition hover:bg-cream-300"
        >
          Cancel
        </button>
        <SubmitButton pendingText="Deleting…" variant="danger">
          Yes, Delete My Account
        </SubmitButton>
      </div>
    </form>
  );
}
