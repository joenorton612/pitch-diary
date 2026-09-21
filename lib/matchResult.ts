import type { Match } from "./types";

// Pure, no server dependencies — safe to import from client-reachable code
// (unlike lib/stats.ts, which pulls in the DB client and fs via lib/db.ts).
export function getMatchResult(match: Match): "W" | "D" | "L" {
  if (match.team_score > match.opponent_score) return "W";
  if (match.team_score < match.opponent_score) return "L";
  return "D";
}
