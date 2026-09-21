"use client";

import { useState } from "react";
import { deleteSeasonAction } from "@/lib/actions";

export function DeleteSeasonButton({
  seasonId,
  seasonLabel,
}: {
  seasonId: number;
  seasonLabel: string;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
      >
        Delete Season
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-ink/70">
        Permanently delete {seasonLabel} and every match logged in it? This can&apos;t be
        undone.
      </p>
      <form action={deleteSeasonAction} className="flex gap-2">
        <input type="hidden" name="seasonId" value={seasonId} />
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-full border border-cream-300 px-5 py-2.5 text-sm font-semibold text-ink/70 transition hover:bg-cream-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Yes, Delete Season
        </button>
      </form>
    </div>
  );
}
