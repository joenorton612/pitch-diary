"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import db from "./db";
import {
  hashPassword,
  verifyPassword,
  signSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "./auth";
import { getCurrentUser, requireUser, requireAdmin } from "./session";
import { POSITIONS } from "./positions";
import { getCurrentSeason } from "./stats";
import type { User } from "./types";

export interface ActionState {
  error?: string;
  success?: boolean;
}

async function setSessionCookie(userId: number) {
  const token = await signSessionToken(userId);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

const signupSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function signupAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const { email, password } = parsed.data;

  const existing = await db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return { error: "An account with that email already exists" };
  }

  const passwordHash = await hashPassword(password);
  const result = await db
    .prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)")
    .run(email, passwordHash);
  const userId = Number(result.lastInsertRowid);

  await db
    .prepare("INSERT INTO seasons (user_id, label) VALUES (?, 'Season 1')")
    .run(userId);

  await setSessionCookie(userId);
  redirect("/onboarding");
}

const signinSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export async function signinAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = signinSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const { email, password } = parsed.data;

  const user = (await db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email)) as User | undefined;

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return { error: "Incorrect email or password" };
  }

  await setSessionCookie(user.id);
  redirect(user.onboarded ? "/dashboard/overview" : "/onboarding");
}

export async function signoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/");
}

const profileSchema = z.object({
  fullName: z.string().trim().min(1, "Enter your full name").max(100),
  age: z.coerce.number().int().min(5, "Enter a valid age").max(90, "Enter a valid age"),
  position: z.enum(POSITIONS, { message: "Choose a position" }),
  team: z.string().trim().min(1, "Enter your team").max(100),
});

export async function onboardingAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/signin");
  }

  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    age: formData.get("age"),
    position: formData.get("position"),
    team: formData.get("team"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const { fullName, age, position, team } = parsed.data;

  await db
    .prepare(
      `UPDATE users SET full_name = ?, age = ?, position = ?, team = ?, onboarded = 1 WHERE id = ?`
    )
    .run(fullName, age, position, team, user.id);

  redirect("/dashboard/overview");
}

export async function updateProfileAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    age: formData.get("age"),
    position: formData.get("position"),
    team: formData.get("team"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const { fullName, age, position, team } = parsed.data;

  await db
    .prepare(`UPDATE users SET full_name = ?, age = ?, position = ?, team = ? WHERE id = ?`)
    .run(fullName, age, position, team, user.id);

  revalidatePath("/dashboard/overview");
  revalidatePath("/dashboard/matches");
  revalidatePath("/dashboard/settings");
  return { success: true };
}

const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "New passwords don't match",
    path: ["confirmPassword"],
  });

export async function changePasswordAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = passwordChangeSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const { currentPassword, newPassword } = parsed.data;

  if (!(await verifyPassword(currentPassword, user.password_hash))) {
    return { error: "Your current password is incorrect" };
  }

  const newHash = await hashPassword(newPassword);
  await db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(newHash, user.id);

  return { success: true };
}

const deleteAccountSchema = z.object({
  password: z.string().min(1, "Enter your password to confirm"),
});

export async function deleteAccountAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = deleteAccountSchema.safeParse({
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  if (!(await verifyPassword(parsed.data.password, user.password_hash))) {
    return { error: "Incorrect password" };
  }

  await db.prepare("DELETE FROM users WHERE id = ?").run(user.id);

  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/");
}

export async function adminDeleteUserAction(formData: FormData) {
  const admin = await requireAdmin();
  const targetId = Number(formData.get("userId"));
  if (!targetId || targetId === admin.id) return;

  await db.prepare("DELETE FROM users WHERE id = ?").run(targetId);

  revalidatePath("/dashboard/admin");
  redirect("/dashboard/admin");
}

export async function deleteSeasonAction(formData: FormData) {
  const user = await requireUser();
  const seasonId = Number(formData.get("seasonId"));
  if (!seasonId) return;

  await db
    .prepare("DELETE FROM seasons WHERE id = ? AND user_id = ? AND ended_at IS NOT NULL")
    .run(seasonId, user.id);

  revalidatePath("/dashboard/seasons");
  redirect("/dashboard/seasons");
}

const COMPETITIONS = ["League", "Cup", "Friendly"] as const;
const VENUES = ["Home", "Away"] as const;
const CARDS = ["None", "Yellow", "Red"] as const;

const matchSchema = z
  .object({
    playedOn: z.string().min(1, "Pick a date"),
    opponent: z.string().trim().min(1, "Enter the opponent").max(100),
    competition: z.enum(COMPETITIONS, { message: "Choose a competition" }),
    venue: z.enum(VENUES, { message: "Choose home or away" }),
    teamScore: z.coerce.number().int().min(0).max(99),
    opponentScore: z.coerce.number().int().min(0).max(99),
    goals: z.coerce.number().int().min(0).max(99),
    assists: z.coerce.number().int().min(0).max(99),
    positionsPlayed: z
      .array(z.enum(POSITIONS))
      .min(1, "Select at least one position played"),
    manOfMatch: z.coerce.boolean(),
    cleanSheet: z.coerce.boolean(),
    card: z.enum(CARDS, { message: "Choose a card status" }),
    minutesPlayed: z.coerce.number().int().min(0).max(300),
    gameLengthMinutes: z.coerce.number().int().min(1).max(300),
    rating: z.coerce.number({ message: "Enter a rating" }).min(0).max(10),
    notes: z.string().trim().max(500).optional(),
  })
  .refine((data) => data.minutesPlayed <= data.gameLengthMinutes, {
    message: "Minutes played can't be more than the game length",
    path: ["minutesPlayed"],
  })
  .refine((data) => data.goals + data.assists <= data.teamScore, {
    message: "Goals + assists can't be more than your team's score",
    path: ["goals"],
  });

export async function addMatchAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = matchSchema.safeParse({
    playedOn: formData.get("playedOn"),
    opponent: formData.get("opponent"),
    competition: formData.get("competition"),
    venue: formData.get("venue"),
    teamScore: formData.get("teamScore"),
    opponentScore: formData.get("opponentScore"),
    goals: formData.get("goals") || 0,
    assists: formData.get("assists") || 0,
    positionsPlayed: formData.getAll("positionsPlayed"),
    manOfMatch: formData.get("manOfMatch") === "true",
    cleanSheet: formData.get("cleanSheet") === "true",
    card: formData.get("card"),
    minutesPlayed: formData.get("minutesPlayed"),
    gameLengthMinutes: formData.get("gameLengthMinutes"),
    rating: formData.get("rating"),
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const {
    playedOn,
    opponent,
    competition,
    venue,
    teamScore,
    opponentScore,
    goals,
    assists,
    positionsPlayed,
    manOfMatch,
    cleanSheet,
    card,
    minutesPlayed,
    gameLengthMinutes,
    rating,
    notes,
  } = parsed.data;

  const season = await getCurrentSeason(user.id);

  await db
    .prepare(
      `INSERT INTO matches (
        user_id, season_id, played_on, opponent, competition, venue, team_score, opponent_score,
        goals, assists, clean_sheet, positions_played, man_of_match, card,
        minutes_played, game_length_minutes, rating, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      user.id,
      season.id,
      playedOn,
      opponent,
      competition,
      venue,
      teamScore,
      opponentScore,
      goals,
      assists,
      cleanSheet ? 1 : 0,
      positionsPlayed.join(","),
      manOfMatch ? 1 : 0,
      card,
      minutesPlayed,
      gameLengthMinutes,
      rating,
      notes ?? null
    );

  revalidatePath("/dashboard/overview");
  revalidatePath("/dashboard/matches");
  redirect("/dashboard/matches");
}

export async function deleteMatchAction(formData: FormData) {
  const user = await requireUser();
  const matchId = Number(formData.get("matchId"));
  if (!matchId) return;

  await db
    .prepare("DELETE FROM matches WHERE id = ? AND user_id = ?")
    .run(matchId, user.id);

  revalidatePath("/dashboard/overview");
  revalidatePath("/dashboard/matches");
}

const startNewSeason = db.transaction(async (tx, userId: number) => {
  const current = (await tx
    .prepare("SELECT * FROM seasons WHERE user_id = ? AND ended_at IS NULL")
    .get(userId)) as { id: number } | undefined;
  if (!current) {
    throw new Error(`No active season found for user ${userId}`);
  }

  await tx
    .prepare("UPDATE seasons SET ended_at = datetime('now') WHERE id = ?")
    .run(current.id);

  const { count } = (await tx
    .prepare("SELECT COUNT(*) as count FROM seasons WHERE user_id = ?")
    .get(userId)) as { count: number };

  await tx
    .prepare("INSERT INTO seasons (user_id, label) VALUES (?, ?)")
    .run(userId, `Season ${count + 1}`);
});

export async function newSeasonAction() {
  const user = await requireUser();

  // Runs as a single atomic transaction so no other request can ever observe
  // the user with zero active seasons between the end of the old one and the
  // start of the new one.
  await startNewSeason(user.id);

  revalidatePath("/dashboard/overview");
  revalidatePath("/dashboard/matches");
  revalidatePath("/dashboard/seasons");
  redirect("/dashboard/matches");
}
