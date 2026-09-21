import { signoutAction } from "@/lib/actions";

export function SignOutButton() {
  return (
    <form action={signoutAction}>
      <button
        type="submit"
        className="rounded-full border border-pitch-950/15 px-4 py-2 text-sm font-semibold text-ink/70 transition hover:bg-cream-300"
      >
        Sign Out
      </button>
    </form>
  );
}
