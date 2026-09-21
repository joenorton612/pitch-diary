"use client";

export type Contribution = "goal" | "assist";

const scoreInputClass =
  "h-12 w-16 rounded-xl border border-cream-300 bg-field text-center text-xl font-extrabold text-ink outline-none ring-gold-500/30 focus:border-gold-500 focus:ring-4";

export function ScoreEntry({
  venue,
  userTeam,
  opponent,
  onOpponentChange,
  teamScore,
  onTeamScoreChange,
  opponentScore,
  onOpponentScoreChange,
  contributions,
  onAdd,
  onRemove,
}: {
  venue: "Home" | "Away";
  userTeam: string;
  opponent: string;
  onOpponentChange: (v: string) => void;
  teamScore: string;
  onTeamScoreChange: (v: string) => void;
  opponentScore: string;
  onOpponentScoreChange: (v: string) => void;
  contributions: Contribution[];
  onAdd: (type: Contribution) => void;
  onRemove: (index: number) => void;
}) {
  const maxContributions = Number(teamScore) || 0;
  const atLimit = contributions.length >= maxContributions;

  const teamSide = (
    <span className="min-w-0 flex-1 truncate text-center text-sm font-bold text-ink sm:text-base">
      {userTeam}
    </span>
  );
  const teamScoreInput = (
    <input
      type="number"
      min={0}
      required
      value={teamScore}
      onChange={(e) => onTeamScoreChange(e.target.value)}
      className={scoreInputClass}
      aria-label={`${userTeam} score`}
    />
  );
  const opponentScoreInput = (
    <input
      type="number"
      min={0}
      required
      value={opponentScore}
      onChange={(e) => onOpponentScoreChange(e.target.value)}
      className={scoreInputClass}
      aria-label="Opponent score"
    />
  );
  const opponentSide = (
    <input
      type="text"
      required
      value={opponent}
      onChange={(e) => onOpponentChange(e.target.value)}
      placeholder="Opponent team name"
      className="min-w-0 flex-1 rounded-xl border border-cream-300 bg-field px-3 py-2.5 text-center text-sm font-semibold text-ink outline-none ring-gold-500/30 focus:border-gold-500 focus:ring-4 sm:text-base"
    />
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium text-ink/80">Score</p>
        <p className="mt-0.5 text-xs text-ink/40">
          {venue === "Home"
            ? "You're Home, so your team is shown first."
            : "You're Away, so the opponent is shown first."}
        </p>
        <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-cream-300 bg-cream-200 p-3">
          {venue === "Home" ? (
            <>
              {teamSide}
              {teamScoreInput}
              <span className="text-lg font-bold text-ink/30">–</span>
              {opponentScoreInput}
              {opponentSide}
            </>
          ) : (
            <>
              {opponentSide}
              {opponentScoreInput}
              <span className="text-lg font-bold text-ink/30">–</span>
              {teamScoreInput}
              {teamSide}
            </>
          )}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-ink/80">Your Goals &amp; Assists</p>
        <p className="mt-0.5 text-xs text-ink/40">
          Add one icon per goal or assist you had a part in — up to your team&apos;s{" "}
          {maxContributions} {maxContributions === 1 ? "goal" : "goals"} above.
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onAdd("goal")}
            disabled={atLimit}
            className="flex items-center gap-2 rounded-full border border-cream-300 bg-field px-4 py-2 text-sm font-semibold text-ink transition hover:border-gold-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="text-base">⚽</span> Add Goal
          </button>
          <button
            type="button"
            onClick={() => onAdd("assist")}
            disabled={atLimit}
            className="flex items-center gap-2 rounded-full border border-cream-300 bg-field px-4 py-2 text-sm font-semibold text-ink transition hover:border-gold-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="text-base">🥾</span> Add Assist
          </button>
        </div>

        <div className="mt-3 flex min-h-11 flex-wrap items-center gap-2 rounded-xl border border-dashed border-cream-300 p-2.5">
          {contributions.length === 0 ? (
            <span className="px-1 text-xs text-ink/40">
              No goals or assists added yet.
            </span>
          ) : (
            contributions.map((c, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onRemove(i)}
                title={`Remove this ${c === "goal" ? "goal" : "assist"}`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/15 text-lg transition hover:bg-red-100"
              >
                {c === "goal" ? "⚽" : "🥾"}
              </button>
            ))
          )}
        </div>

        <p className="mt-1.5 text-xs font-semibold text-ink/50">
          {contributions.length} of {maxContributions} team{" "}
          {maxContributions === 1 ? "goal" : "goals"} logged
          {atLimit && maxContributions > 0 ? " — that's the max" : ""}
          . Tap an icon to remove it.
        </p>
      </div>
    </div>
  );
}
