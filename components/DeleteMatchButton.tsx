import { deleteMatchAction } from "@/lib/actions";

export function DeleteMatchButton({ matchId }: { matchId: number }) {
  return (
    <form action={deleteMatchAction}>
      <input type="hidden" name="matchId" value={matchId} />
      <button
        type="submit"
        className="text-xs font-semibold text-ink/40 hover:text-red-600"
        aria-label="Delete match"
      >
        Remove
      </button>
    </form>
  );
}
