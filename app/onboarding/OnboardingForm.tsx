"use client";

import { useActionState } from "react";
import { onboardingAction, type ActionState } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { POSITIONS } from "@/lib/positions";

const initialState: ActionState = {};

export function OnboardingForm() {
  const [state, formAction] = useActionState(onboardingAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-ink/80">
          What&apos;s your full name?
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          required
          placeholder="e.g. Jamie Carter"
          className="mt-1.5 w-full rounded-xl border border-cream-300 bg-field px-4 py-2.5 text-sm text-ink outline-none ring-gold-500/30 focus:border-gold-500 focus:ring-4"
        />
      </div>

      <div>
        <label htmlFor="age" className="block text-sm font-medium text-ink/80">
          How old are you?
        </label>
        <input
          id="age"
          name="age"
          type="number"
          required
          min={5}
          max={90}
          placeholder="e.g. 24"
          className="mt-1.5 w-full rounded-xl border border-cream-300 bg-field px-4 py-2.5 text-sm text-ink outline-none ring-gold-500/30 focus:border-gold-500 focus:ring-4"
        />
      </div>

      <div>
        <label htmlFor="position" className="block text-sm font-medium text-ink/80">
          What position do you play?
        </label>
        <select
          id="position"
          name="position"
          required
          defaultValue=""
          className="mt-1.5 w-full rounded-xl border border-cream-300 bg-field px-4 py-2.5 text-sm text-ink outline-none ring-gold-500/30 focus:border-gold-500 focus:ring-4"
        >
          <option value="" disabled>
            Choose a position
          </option>
          {POSITIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="team" className="block text-sm font-medium text-ink/80">
          What team do you play for?
        </label>
        <input
          id="team"
          name="team"
          type="text"
          required
          placeholder="e.g. Riverside FC"
          className="mt-1.5 w-full rounded-xl border border-cream-300 bg-field px-4 py-2.5 text-sm text-ink outline-none ring-gold-500/30 focus:border-gold-500 focus:ring-4"
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <SubmitButton pendingText="Saving…" className="mt-2 w-full">
        Finish Setup
      </SubmitButton>
    </form>
  );
}
