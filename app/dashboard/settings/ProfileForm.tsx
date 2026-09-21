"use client";

import { useActionState } from "react";
import { updateProfileAction, type ActionState } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { POSITIONS } from "@/lib/positions";
import type { User } from "@/lib/types";

const initialState: ActionState = {};
const inputClass =
  "mt-1.5 w-full rounded-xl border border-cream-300 bg-field px-4 py-2.5 text-sm text-ink outline-none ring-gold-500/30 focus:border-gold-500 focus:ring-4";

export function ProfileForm({ user }: { user: User }) {
  const [state, formAction] = useActionState(updateProfileAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-ink/80">
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          required
          defaultValue={user.full_name ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="age" className="block text-sm font-medium text-ink/80">
          Age
        </label>
        <input
          id="age"
          name="age"
          type="number"
          required
          min={5}
          max={90}
          defaultValue={user.age ?? undefined}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="position" className="block text-sm font-medium text-ink/80">
          Position
        </label>
        <select
          id="position"
          name="position"
          required
          defaultValue={user.position ?? ""}
          className={inputClass}
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
          Club
        </label>
        <input
          id="team"
          name="team"
          type="text"
          required
          defaultValue={user.team ?? ""}
          className={inputClass}
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      {state.success && (
        <p className="rounded-lg bg-win/10 px-3 py-2 text-sm text-win">
          Profile updated.
        </p>
      )}

      <SubmitButton pendingText="Saving…" className="w-fit">
        Save Profile
      </SubmitButton>
    </form>
  );
}
