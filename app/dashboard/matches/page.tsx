import { requireUser } from "@/lib/session";
import { getCurrentSeason, getMatchesForUser, getMatchResult } from "@/lib/stats";
import { formatDate } from "@/lib/week";
import { DeleteMatchButton } from "@/components/DeleteMatchButton";
import { NewSeasonButton } from "@/components/NewSeasonButton";
import { AddMatchForm } from "./AddMatchForm";

const CARD_EMOJI: Record<string, string> = { Yellow: "🟨", Red: "🟥" };

export default async function MatchesPage() {
  const user = await requireUser();
  const season = await getCurrentSeason(user.id);
  const matches = await getMatchesForUser(user.id);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">
            Matches
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            {season.label} · every match you&apos;ve logged this season.
          </p>
        </div>
        <NewSeasonButton />
      </div>

      <AddMatchForm userTeam={user.team ?? "Your Team"} />

      <div className="rounded-2xl border border-cream-300 bg-cream-100">
        <div className="border-b border-cream-300 px-6 py-4">
          <h2 className="text-lg font-bold text-ink">Match History</h2>
        </div>

        {matches.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-ink/50">
            No matches logged yet — add your first one above.
          </p>
        ) : (
          <ul className="divide-y divide-cream-300">
            {matches.map((match) => {
              const result = getMatchResult(match);
              const pct = Math.round(
                (match.minutes_played / match.game_length_minutes) * 100
              );
              const positions = match.positions_played
                ? match.positions_played.split(",")
                : [];
              return (
                <li key={match.id} className="flex flex-col gap-3 px-6 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="flex flex-wrap items-center gap-2 font-semibold text-ink">
                        vs {match.opponent}
                        <span className="text-ink/50">
                          ({match.team_score}–{match.opponent_score})
                        </span>
                        <ResultBadge result={result} />
                        <Tag>{match.competition}</Tag>
                        <Tag>{match.venue}</Tag>
                        {match.clean_sheet ? (
                          <span className="rounded-full bg-gold-500/15 px-2 py-0.5 text-xs font-semibold text-gold-600">
                            Clean sheet
                          </span>
                        ) : null}
                        {match.man_of_match ? (
                          <span className="rounded-full bg-gold-500/15 px-2 py-0.5 text-xs font-semibold text-gold-600">
                            ⭐ MOM
                          </span>
                        ) : null}
                        {match.card !== "None" && (
                          <span className="text-sm">{CARD_EMOJI[match.card]}</span>
                        )}
                      </p>
                      <p className="text-sm text-ink/50">
                        {formatDate(match.played_on)}
                        {positions.length > 0 ? ` · ${positions.join(", ")}` : ""}
                      </p>
                      {match.notes && (
                        <p className="mt-1 text-sm text-ink/60">{match.notes}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-6">
                      <MiniStat label="G" value={match.goals} />
                      <MiniStat label="A" value={match.assists} />
                      <MiniStat label="Rating" value={match.rating.toFixed(1)} />
                      <MiniStat
                        label="Mins"
                        value={`${match.minutes_played}/${match.game_length_minutes} (${pct}%)`}
                      />
                      <DeleteMatchButton matchId={match.id} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center">
      <p className="font-bold text-ink">{value}</p>
      <p className="text-xs text-ink/50">{label}</p>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-cream-300 px-2 py-0.5 text-xs font-semibold text-ink/70">
      {children}
    </span>
  );
}

function ResultBadge({ result }: { result: "W" | "D" | "L" }) {
  const styles = {
    W: "bg-win/10 text-win",
    D: "bg-cream-300 text-ink/60",
    L: "bg-red-50 text-red-600",
  } as const;
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${styles[result]}`}>
      {result}
    </span>
  );
}
