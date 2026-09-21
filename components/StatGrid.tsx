import { StatCard } from "./StatCard";
import type { OverviewStats } from "@/lib/stats";
import type { Match } from "@/lib/types";

function record(s: { wins: number; draws: number; losses: number }): string {
  return `${s.wins}-${s.draws}-${s.losses}`;
}

function pct(v: number | null): string {
  return v === null ? "—" : `${v}%`;
}

function rating(v: number | null): string {
  return v === null ? "—" : v.toFixed(1);
}

function perGame(total: number, appearances: number): string {
  return appearances > 0 ? (total / appearances).toFixed(2) : "—";
}

function pointsPerGame(s: { wins: number; draws: number; losses: number }): string {
  const games = s.wins + s.draws + s.losses;
  return games > 0 ? ((s.wins * 3 + s.draws) / games).toFixed(2) : "—";
}

function avgMinutesPct(matches: Match[]): string {
  if (matches.length === 0) return "—";
  const total = matches.reduce(
    (sum, m) => sum + (m.minutes_played / m.game_length_minutes) * 100,
    0
  );
  return `${Math.round(total / matches.length)}%`;
}

export function StatGrid({ stats, matches }: { stats: OverviewStats; matches: Match[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <StatCard
        label="Appearances"
        value={stats.appearances}
        home={stats.home.appearances}
        away={stats.away.appearances}
      />
      <StatCard
        label="Goals"
        value={stats.goals}
        home={stats.home.goals}
        away={stats.away.goals}
        avgPerGame={perGame(stats.goals, stats.appearances)}
      />
      <StatCard
        label="Assists"
        value={stats.assists}
        home={stats.home.assists}
        away={stats.away.assists}
        avgPerGame={perGame(stats.assists, stats.appearances)}
      />
      <StatCard
        label="Clean Sheets"
        value={stats.cleanSheets}
        home={stats.home.cleanSheets}
        away={stats.away.cleanSheets}
        avgPerGame={perGame(stats.cleanSheets, stats.appearances)}
      />
      <StatCard
        label="Record (W-D-L)"
        value={record(stats)}
        home={record(stats.home)}
        away={record(stats.away)}
        avgPerGame={`${pointsPerGame(stats)} pts`}
      />
      <StatCard
        label="Man of the Match"
        value={stats.mom}
        home={stats.home.mom}
        away={stats.away.mom}
        avgPerGame={perGame(stats.mom, stats.appearances)}
      />
      <StatCard
        label="Yellow Cards 🟨"
        value={stats.yellowCards}
        home={stats.home.yellowCards}
        away={stats.away.yellowCards}
        avgPerGame={perGame(stats.yellowCards, stats.appearances)}
      />
      <StatCard
        label="Red Cards 🟥"
        value={stats.redCards}
        home={stats.home.redCards}
        away={stats.away.redCards}
        avgPerGame={perGame(stats.redCards, stats.appearances)}
      />
      <StatCard
        label="Minutes Played %"
        value={pct(stats.minutesPlayedPct)}
        home={pct(stats.home.minutesPlayedPct)}
        away={pct(stats.away.minutesPlayedPct)}
        avgPerGame={avgMinutesPct(matches)}
      />
      <StatCard
        label="Avg Rating"
        value={rating(stats.avgRating)}
        home={rating(stats.home.avgRating)}
        away={rating(stats.away.avgRating)}
      />
    </div>
  );
}
