import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import {
  getMatchesForSeason,
  getMatchResult,
  getSeasonById,
  statsFromMatches,
} from "@/lib/stats";
import { formatDate } from "@/lib/week";
import { StatGrid } from "@/components/StatGrid";
import { DeleteSeasonButton } from "@/components/DeleteSeasonButton";

const CARD_EMOJI: Record<string, string> = { Yellow: "🟨", Red: "🟥" };

export default async function SeasonDetailPage({
  params,
}: {
  params: Promise<{ seasonId: string }>;
}) {
  const user = await requireUser();
  const { seasonId } = await params;
  const season = await getSeasonById(Number(seasonId));
  if (!season || season.user_id !== user.id) {
    notFound();
  }

  const matches = await getMatchesForSeason(season.id);
  const stats = statsFromMatches(matches);

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/dashboard/seasons"
        className="w-fit text-sm font-semibold text-ink/60 hover:text-ink"
      >
        ← Back to seasons
      </Link>

      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          {season.label}
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          {new Date(season.started_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
          {season.ended_at
            ? ` – ${new Date(season.ended_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}`
            : ""}
        </p>
      </div>

      <StatGrid stats={stats} matches={matches} />

      <div className="overflow-hidden rounded-2xl border border-cream-300 bg-cream-100">
        <div className="border-b border-cream-300 px-6 py-4">
          <h2 className="text-lg font-bold text-ink">Match History</h2>
        </div>
        {matches.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-ink/50">
            No matches were logged in this season.
          </p>
        ) : (
          <ul className="divide-y divide-cream-300">
            {matches.map((match) => {
              const positions = match.positions_played
                ? match.positions_played.split(",")
                : [];
              return (
                <li key={match.id} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div>
                    <p className="flex flex-wrap items-center gap-2 font-semibold text-ink">
                      vs {match.opponent}{" "}
                      <span className="text-ink/50">
                        ({match.team_score}–{match.opponent_score})
                      </span>
                      {match.man_of_match && <span className="text-sm">⭐</span>}
                      {match.card !== "None" && (
                        <span className="text-sm">{CARD_EMOJI[match.card]}</span>
                      )}
                    </p>
                    <p className="text-sm text-ink/50">
                      {formatDate(match.played_on)} · {match.competition} · {match.venue}
                      {positions.length > 0 ? ` · ${positions.join(", ")}` : ""}
                    </p>
                  </div>
                  <ResultBadge result={getMatchResult(match)} />
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {season.ended_at && (
        <div className="rounded-2xl border border-red-200 bg-red-50/40 p-6">
          <h2 className="text-lg font-bold text-red-700">Danger Zone</h2>
          <p className="mt-1 text-sm text-red-700/60">
            Permanently remove this season and its matches from your history.
          </p>
          <div className="mt-5">
            <DeleteSeasonButton seasonId={season.id} seasonLabel={season.label} />
          </div>
        </div>
      )}
    </div>
  );
}

function ResultBadge({ result }: { result: "W" | "D" | "L" }) {
  const styles = {
    W: "bg-win/10 text-win",
    D: "bg-cream-300 text-ink/60",
    L: "bg-red-50 text-red-600",
  } as const;
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${styles[result]}`}>
      {result}
    </span>
  );
}
