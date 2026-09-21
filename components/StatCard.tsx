"use client";

import { useState } from "react";

export function StatCard({
  label,
  value,
  home,
  away,
  avgPerGame,
  highlight = false,
}: {
  label: string;
  value: string | number;
  home?: string | number;
  away?: string | number;
  avgPerGame?: string | number;
  highlight?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const hasSplit = home !== undefined && away !== undefined;

  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlight
          ? "border-gold-500 bg-gold-500"
          : "border-cream-300 bg-cream-100"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p
            className={`text-2xl font-extrabold tracking-tight ${
              highlight ? "text-pitch-950" : "text-ink"
            }`}
          >
            {value}
          </p>
          <p
            className={`mt-1 text-sm font-medium ${
              highlight ? "text-pitch-950/70" : "text-ink/50"
            }`}
          >
            {label}
          </p>
        </div>

        {hasSplit && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={`${open ? "Hide" : "Show"} details for ${label}`}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition ${
              highlight
                ? "text-pitch-950/60 hover:bg-pitch-950/10"
                : "text-ink/40 hover:bg-cream-300 hover:text-ink"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      {hasSplit && open && (
        <div
          className={`mt-3 grid gap-2 border-t pt-3 ${
            avgPerGame !== undefined ? "grid-cols-3" : "grid-cols-2"
          } ${highlight ? "border-pitch-950/15" : "border-cream-300"}`}
        >
          <SplitBox label="Home" value={home} highlight={highlight} />
          <SplitBox label="Away" value={away} highlight={highlight} />
          {avgPerGame !== undefined && (
            <SplitBox label="Avg/Game" value={avgPerGame} highlight={highlight} />
          )}
        </div>
      )}
    </div>
  );
}

function SplitBox({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number | undefined;
  highlight: boolean;
}) {
  return (
    <div
      className={`rounded-lg px-2 py-1.5 text-center ${
        highlight ? "bg-pitch-950/10" : "bg-cream-200"
      }`}
    >
      <p className={`text-sm font-bold ${highlight ? "text-pitch-950" : "text-ink"}`}>
        {value}
      </p>
      <p
        className={`text-[10px] font-semibold uppercase tracking-wide ${
          highlight ? "text-pitch-950/60" : "text-ink/40"
        }`}
      >
        {label}
      </p>
    </div>
  );
}
