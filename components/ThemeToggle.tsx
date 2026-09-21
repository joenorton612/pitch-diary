"use client";

import { useSyncExternalStore } from "react";
import { getMode, getServerMode, setMode, subscribeTheme } from "./theme-store";

export function ThemeToggle({
  className = "",
  variant = "onLight",
}: {
  className?: string;
  /** "onLight" for cream/card backgrounds, "onDark" for the permanently-dark hero. */
  variant?: "onLight" | "onDark";
}) {
  // Renders the server's "light" snapshot on the initial client render too, so
  // hydration always matches — then reconciles to the real value right after,
  // without the loud mismatch warning a plain useState/useEffect pair would cause.
  const mode = useSyncExternalStore(subscribeTheme, getMode, getServerMode);
  const next = mode === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setMode(next)}
      aria-label={`Switch to ${next} mode`}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${
        variant === "onDark"
          ? "border-white/25 text-white/80 hover:bg-white/10"
          : "border-cream-300 text-ink/70 hover:bg-cream-300"
      } ${className}`}
    >
      {mode === "dark" ? (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path
            d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
