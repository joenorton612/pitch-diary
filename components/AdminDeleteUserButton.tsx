"use client";

import { useState } from "react";
import { adminDeleteUserAction } from "@/lib/actions";

export function AdminDeleteUserButton({
  userId,
  userLabel,
  isSelf,
}: {
  userId: number;
  userLabel: string;
  isSelf: boolean;
}) {
  const [confirming, setConfirming] = useState(false);

  if (isSelf) {
    return (
      <p className="text-sm text-ink/50">
        You can&apos;t delete your own account here — use Settings instead.
      </p>
    );
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
      >
        Delete This Account
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-ink/70">
        Permanently delete {userLabel}&apos;s account, matches and seasons? This can&apos;t
        be undone.
      </p>
      <form action={adminDeleteUserAction} className="flex gap-2">
        <input type="hidden" name="userId" value={userId} />
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
          Yes, Delete Account
        </button>
      </form>
    </div>
  );
}
