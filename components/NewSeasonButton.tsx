"use client";

import { useState, useTransition } from "react";
import { newSeasonAction } from "@/lib/actions";

export function NewSeasonButton() {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (confirming) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-cream-300 bg-cream-100 py-1 pl-4 pr-1 text-sm">
        <span className="text-ink/70">Save this season and start fresh?</span>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-full px-3 py-1.5 font-semibold text-ink/60 transition hover:bg-cream-300"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(() => {
              newSeasonAction();
            })
          }
          className="rounded-full bg-pitch-900 px-3 py-1.5 font-semibold text-white transition hover:bg-pitch-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Starting…" : "Confirm"}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="rounded-full border border-cream-300 px-4 py-2 text-sm font-semibold text-ink/70 transition hover:bg-cream-300"
    >
      New Season
    </button>
  );
}
