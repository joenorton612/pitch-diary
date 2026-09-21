export interface User {
  id: number;
  email: string;
  password_hash: string;
  full_name: string | null;
  age: number | null;
  position: string | null;
  team: string | null;
  onboarded: number;
  created_at: string;
}

export type Competition = "League" | "Cup" | "Friendly";
export type Venue = "Home" | "Away";
export type Card = "None" | "Yellow" | "Red";

export interface Season {
  id: number;
  user_id: number;
  label: string;
  started_at: string;
  ended_at: string | null;
}

export interface Match {
  id: number;
  user_id: number;
  season_id: number;
  played_on: string;
  opponent: string;
  competition: string;
  venue: string;
  team_score: number;
  opponent_score: number;
  goals: number;
  assists: number;
  clean_sheet: number;
  positions_played: string;
  man_of_match: number;
  card: string;
  minutes_played: number;
  game_length_minutes: number;
  rating: number;
  notes: string | null;
  created_at: string;
}
