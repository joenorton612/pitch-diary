import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import db from "./db";
import { SESSION_COOKIE_NAME, verifySessionToken } from "./auth";
import type { User } from "./types";

// Wrapped in React's cache() so the dashboard layout and every page under it
// share one lookup per request instead of each re-querying the database.
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await verifySessionToken(token);
  if (!session) return null;

  const user = (await db
    .prepare("SELECT * FROM users WHERE id = ?")
    .get(session.uid)) as User | undefined;

  return user ?? null;
});

export function isAdmin(user: User | null): boolean {
  if (!user) return false;
  const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();
  return user.email.toLowerCase() === adminEmail;
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/signin");
  }
  if (!user.onboarded) {
    redirect("/onboarding");
  }
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await requireUser();
  if (!isAdmin(user)) {
    redirect("/dashboard/overview");
  }
  return user;
}
