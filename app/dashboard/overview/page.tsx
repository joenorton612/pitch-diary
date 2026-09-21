import Link from "next/link";
import { requireUser } from "@/lib/session";
import { getMatchesForUser, getMatchResult, statsFromMatches } from "@/lib/stats";
import { formatDate } from "@/lib/week";
import type { Match } from "@/lib/types";
import { CompetitionStatTabs } from "./CompetitionStatTabs";

export default async function OverviewPage() {
  const user = await requireUser();
  // Fetched once and reused for every competition tab below — statsFromMatches
  // is pure (no DB call), so this avoids five separate round trips to Turso.
  const matches = await getMatchesForUser(user.id);
  const recent = matches[0];

  const statsByTab = {
    All: statsFromMatches(matches),
    League: statsFromMatches(matches, "League"),
    Cup: statsFromMatches(matches, "Cup"),
    Friendly: statsFromMatches(matches, "Friendly"),
  };

  const matchesByTab = {
    All: matches,
    League: matches.filter((m) => m.competition === "League"),
    Cup: matches.filter((m) => m.competition === "Cup"),
    Friendly: matches.filter((m) => m.competition === "Friendly"),
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          Welcome back, {user.full_name?.split(" ")[0] || "there"}
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          Here&apos;s how your season is shaping up.
        </p>
      </div>

      <div className="rounded-2xl border border-cream-300 bg-cream-100 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">Recent Match</h2>
          <Link
            href="/dashboard/matches"
            className="text-sm font-semibold text-gold-600 hover:underline"
          >
            Log a match →
          </Link>
        </div>

        {recent ? (
          <RecentMatch match={recent} userTeam={user.team} />
        ) : (
          <p className="mt-4 text-sm text-ink/50">
            No matches logged yet.{" "}
            <Link href="/dashboard/matches" className="font-semibold text-gold-600 hover:underline">
              Add your first match
            </Link>{" "}
            to see it here.
          </p>
        )}
      </div>

      <CompetitionStatTabs statsByTab={statsByTab} matchesByTab={matchesByTab} />

      <div className="grid gap-4 sm:grid-cols-2">
        <QuickLink
          href="/dashboard/matches"
          title="Track Your Journey"
          description="Log every match and watch your career totals grow."
        />
        <QuickLink
          href="/dashboard/matches"
          title="Log Your Stats"
          description="Goals, assists, scorelines and ratings — all in one place."
        />
      </div>
    </div>
  );
}

function RecentMatch({ match, userTeam }: { match: Match; userTeam: string | null }) {
  const isHome = match.venue === "Home";
  const leftTeam = isHome ? userTeam || "You" : match.opponent;
  const leftScore = isHome ? match.team_score : match.opponent_score;
  const rightScore = isHome ? match.opponent_score : match.team_score;
  const rightTeam = isHome ? match.opponent : userTeam || "You";
  const result = getMatchResult(match);

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex flex-col items-center gap-1 rounded-xl bg-cream-200 py-6 text-center sm:flex-row sm:justify-center sm:gap-4">
        <span className="text-lg font-bold text-ink">{leftTeam}</span>
        <span className="flex items-center gap-2 text-2xl font-extrabold text-ink">
          {leftScore}
          <span className="text-base font-semibold text-ink/40">vs</span>
          {rightScore}
        </span>
        <span className="text-lg font-bold text-ink">{rightTeam}</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-ink/50 sm:justify-between">
        <span>
          {formatDate(match.played_on)} · {match.competition} · {match.venue}
        </span>
        <ResultBadge result={result} />
      </div>

      <div className="flex justify-center gap-8 border-t border-cream-300 pt-4 text-sm sm:justify-start">
        <div className="text-center">
          <p className="font-bold text-ink">{match.goals}</p>
          <p className="text-ink/50">Goals</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-ink">{match.assists}</p>
          <p className="text-ink/50">Assists</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-ink">{match.rating.toFixed(1)}</p>
          <p className="text-ink/50">Rating</p>
        </div>
      </div>
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
    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${styles[result]}`}>
      {result}
    </span>
  );
}

function QuickLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-cream-300 bg-pitch-900 p-6 text-white transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <h3 className="font-bold text-gold-400">{title}</h3>
      <p className="mt-2 text-sm text-white/70">{description}</p>
    </Link>
  );
}
