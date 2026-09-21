"use client";

import { useState } from "react";
import { StatGrid } from "@/components/StatGrid";
import type { OverviewStats } from "@/lib/stats";
import type { Match } from "@/lib/types";

const TAB_KEYS = ["All", "League", "Cup", "Friendly"] as const;
type TabKey = (typeof TAB_KEYS)[number];

export function CompetitionStatTabs({
  statsByTab,
  matchesByTab,
}: {
  statsByTab: Record<TabKey, OverviewStats>;
  matchesByTab: Record<TabKey, Match[]>;
}) {
  const [active, setActive] = useState<TabKey>("All");
  const stats = statsByTab[active];
  const matches = matchesByTab[active];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/40">
          Filter stats by competition
        </p>
        <div className="inline-flex gap-1 rounded-full border border-cream-300 bg-cream-100 p-1">
          {TAB_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              aria-pressed={active === key}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                active === key
                  ? "bg-pitch-900 text-white shadow-sm"
                  : "text-ink/50 hover:text-ink"
              }`}
            >
              {key === "All" ? "All Stats" : `${key} Stats`}
            </button>
          ))}
        </div>
      </div>

      <StatGrid stats={stats} matches={matches} />
    </div>
  );
}
