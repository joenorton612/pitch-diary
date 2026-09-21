import db from "./db";
import { getMatchResult } from "./matchResult";
import type { Competition, Match, Season, User } from "./types";

export { getMatchResult };

interface CoreStats {
  appearances: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  wins: number;
  draws: number;
  losses: number;
  yellowCards: number;
  redCards: number;
  mom: number;
  avgRating: number | null;
  minutesPlayedPct: number | null;
}

export interface OverviewStats extends CoreStats {
  home: CoreStats;
  away: CoreStats;
}

export async function getCurrentSeason(userId: number): Promise<Season> {
  const row = (await db
    .prepare("SELECT * FROM seasons WHERE user_id = ? AND ended_at IS NULL")
    .get(userId)) as Season | undefined;
  if (!row) {
    throw new Error(`No active season found for user ${userId}`);
  }
  return row;
}

export async function getPastSeasons(userId: number): Promise<Season[]> {
  return (await db
    .prepare(
      "SELECT * FROM seasons WHERE user_id = ? AND ended_at IS NOT NULL ORDER BY started_at DESC"
    )
    .all(userId)) as Season[];
}

export async function getSeasonById(seasonId: number): Promise<Season | null> {
  const row = (await db
    .prepare("SELECT * FROM seasons WHERE id = ?")
    .get(seasonId)) as Season | undefined;
  return row ?? null;
}

export async function getMatchesForSeason(seasonId: number): Promise<Match[]> {
  return (await db
    .prepare("SELECT * FROM matches WHERE season_id = ? ORDER BY played_on DESC, id DESC")
    .all(seasonId)) as Match[];
}

/** Matches in the user's current (active, not yet ended) season. */
export async function getMatchesForUser(userId: number): Promise<Match[]> {
  const season = await getCurrentSeason(userId);
  return getMatchesForSeason(season.id);
}

function aggregate(matches: Match[]): CoreStats {
  const appearances = matches.length;
  const goals = matches.reduce((sum, m) => sum + m.goals, 0);
  const assists = matches.reduce((sum, m) => sum + m.assists, 0);
  const cleanSheets = matches.filter((m) => m.clean_sheet).length;
  const yellowCards = matches.filter((m) => m.card === "Yellow").length;
  const redCards = matches.filter((m) => m.card === "Red").length;
  const mom = matches.filter((m) => m.man_of_match).length;

  let wins = 0;
  let draws = 0;
  let losses = 0;
  for (const m of matches) {
    const result = getMatchResult(m);
    if (result === "W") wins++;
    else if (result === "D") draws++;
    else losses++;
  }

  const avgRating =
    matches.length > 0
      ? matches.reduce((sum, m) => sum + m.rating, 0) / matches.length
      : null;

  const totalMinutes = matches.reduce((sum, m) => sum + m.minutes_played, 0);
  const totalGameLength = matches.reduce((sum, m) => sum + m.game_length_minutes, 0);
  const minutesPlayedPct =
    totalGameLength > 0 ? Math.round((totalMinutes / totalGameLength) * 100) : null;

  return {
    appearances,
    goals,
    assists,
    cleanSheets,
    wins,
    draws,
    losses,
    yellowCards,
    redCards,
    mom,
    avgRating,
    minutesPlayedPct,
  };
}

function statsFromMatches(matches: Match[], competition?: Competition): OverviewStats {
  const scoped = competition ? matches.filter((m) => m.competition === competition) : matches;
  return {
    ...aggregate(scoped),
    home: aggregate(scoped.filter((m) => m.venue === "Home")),
    away: aggregate(scoped.filter((m) => m.venue === "Away")),
  };
}

export async function getOverviewStats(
  userId: number,
  competition?: Competition
): Promise<OverviewStats> {
  return statsFromMatches(await getMatchesForUser(userId), competition);
}

export async function getSeasonOverviewStats(
  seasonId: number,
  competition?: Competition
): Promise<OverviewStats> {
  return statsFromMatches(await getMatchesForSeason(seasonId), competition);
}

export async function getAllUsers(): Promise<User[]> {
  return (await db
    .prepare("SELECT * FROM users ORDER BY created_at DESC")
    .all()) as User[];
}

export async function getUserById(userId: number): Promise<User | null> {
  const row = (await db
    .prepare("SELECT * FROM users WHERE id = ?")
    .get(userId)) as User | undefined;
  return row ?? null;
}
