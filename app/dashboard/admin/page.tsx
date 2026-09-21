import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { getAllUsers, getOverviewStats } from "@/lib/stats";

export default async function AdminPage() {
  await requireAdmin();
  const users = await getAllUsers();
  const userStats = await Promise.all(users.map((u) => getOverviewStats(u.id)));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          Admin
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          Every account that has ever signed up — {users.length} in total.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-cream-300 bg-cream-100">
        <ul className="divide-y divide-cream-300">
          {users.map((u, i) => {
            const stats = userStats[i];
            const initial = (u.full_name || u.email).charAt(0).toUpperCase();
            return (
              <li key={u.id}>
                <Link
                  href={`/dashboard/admin/${u.id}`}
                  className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-cream-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pitch-900 text-sm font-bold text-gold-400">
                      {initial}
                    </div>
                    <div>
                      <p className="font-semibold text-ink">
                        {u.full_name || "(No name set)"}
                      </p>
                      <p className="text-sm text-ink/50">
                        {u.email}
                        {u.team ? ` · ${u.team}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="hidden shrink-0 gap-5 text-sm sm:flex">
                    <MiniStat label="Apps" value={stats.appearances} />
                    <MiniStat label="Goals" value={stats.goals} />
                    <MiniStat label="Assists" value={stats.assists} />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        {users.length === 0 && (
          <p className="px-6 py-8 text-center text-sm text-ink/50">
            No accounts yet.
          </p>
        )}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="font-bold text-ink">{value}</p>
      <p className="text-xs text-ink/50">{label}</p>
    </div>
  );
}
