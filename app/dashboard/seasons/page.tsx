import Link from "next/link";
import { requireUser } from "@/lib/session";
import { getCurrentSeason, getPastSeasons, getSeasonOverviewStats } from "@/lib/stats";

function formatSeasonDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function SeasonsPage() {
  const user = await requireUser();
  const current = await getCurrentSeason(user.id);
  const past = await getPastSeasons(user.id);
  const pastStats = await Promise.all(past.map((season) => getSeasonOverviewStats(season.id)));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">Seasons</h1>
        <p className="mt-1 text-sm text-ink/60">
          Your current season plus everything saved from past seasons.
        </p>
      </div>

      <div className="rounded-2xl border border-gold-500 bg-gold-500/10 p-5">
        <span className="w-fit rounded-full bg-gold-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-pitch-950">
          Current
        </span>
        <p className="mt-2 font-bold text-ink">{current.label}</p>
        <p className="text-sm text-ink/60">Started {formatSeasonDate(current.started_at)}</p>
      </div>

      {past.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-cream-300 bg-cream-100 px-6 py-12 text-center">
          <p className="font-semibold text-ink">No past seasons yet</p>
          <p className="mt-1 text-sm text-ink/50">
            Start a new season from the Matches tab and your current stats will be
            saved here.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {past.map((season, i) => {
            const stats = pastStats[i];
            return (
              <li key={season.id}>
                <Link
                  href={`/dashboard/seasons/${season.id}`}
                  className="block rounded-2xl border border-cream-300 bg-cream-100 p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <p className="font-bold text-ink">{season.label}</p>
                  <p className="text-sm text-ink/50">
                    {formatSeasonDate(season.started_at)}
                    {season.ended_at ? ` – ${formatSeasonDate(season.ended_at)}` : ""}
                  </p>
                  <div className="mt-4 flex gap-6 text-sm">
                    <div>
                      <p className="font-bold text-ink">{stats.appearances}</p>
                      <p className="text-ink/50">Apps</p>
                    </div>
                    <div>
                      <p className="font-bold text-ink">{stats.goals}</p>
                      <p className="text-ink/50">Goals</p>
                    </div>
                    <div>
                      <p className="font-bold text-ink">{stats.assists}</p>
                      <p className="text-ink/50">Assists</p>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
