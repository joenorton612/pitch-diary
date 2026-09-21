import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { getMatchesForUser, getMatchResult, statsFromMatches, getUserById } from "@/lib/stats";
import { formatDate } from "@/lib/week";
import { StatGrid } from "@/components/StatGrid";
import { AdminDeleteUserButton } from "@/components/AdminDeleteUserButton";

const CARD_EMOJI: Record<string, string> = { Yellow: "🟨", Red: "🟥" };

export default async function AdminUserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const admin = await requireAdmin();
  const { userId } = await params;
  const user = await getUserById(Number(userId));
  if (!user) {
    notFound();
  }

  const matches = await getMatchesForUser(user.id);
  const stats = statsFromMatches(matches);

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/dashboard/admin"
        className="w-fit text-sm font-semibold text-ink/60 hover:text-ink"
      >
        ← Back to all accounts
      </Link>

      <div className="rounded-2xl border border-cream-300 bg-cream-100 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-pitch-900 text-lg font-bold text-gold-400">
            {(user.full_name || user.email).charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-ink">
              {user.full_name || "(No name set)"}
            </h1>
            <p className="text-sm text-ink/50">{user.email}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <InfoField label="Age" value={user.age ?? "—"} />
          <InfoField label="Position" value={user.position ?? "—"} />
          <InfoField label="Club" value={user.team ?? "—"} />
          <InfoField
            label="Joined"
            value={new Date(user.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          />
        </div>
      </div>

      <StatGrid stats={stats} matches={matches} />

      <div className="overflow-hidden rounded-2xl border border-cream-300 bg-cream-100">
        <div className="border-b border-cream-300 px-6 py-4">
          <h2 className="text-lg font-bold text-ink">Match History</h2>
        </div>
        {matches.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-ink/50">
            No matches logged yet.
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

      <div className="rounded-2xl border border-red-200 bg-red-50/40 p-6">
        <h2 className="text-lg font-bold text-red-700">Danger Zone</h2>
        <p className="mt-1 text-sm text-red-700/60">
          Permanently remove this account from Pitch Diary.
        </p>
        <div className="mt-5">
          <AdminDeleteUserButton
            userId={user.id}
            userLabel={user.full_name || user.email}
            isSelf={user.id === admin.id}
          />
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">
        {label}
      </p>
      <p className="mt-0.5 font-semibold text-ink">{value}</p>
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
