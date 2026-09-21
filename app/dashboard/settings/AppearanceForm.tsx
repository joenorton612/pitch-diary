"use client";

import { useSyncExternalStore } from "react";
import { getDarkStyle, getLightStyle, setStyle, subscribeTheme } from "@/components/theme-store";
import {
  DARK_STYLES,
  DEFAULT_DARK_STYLE,
  DEFAULT_LIGHT_STYLE,
  LIGHT_STYLES,
  type ThemeStyle,
} from "@/lib/themeStyles";

export function AppearanceForm() {
  const lightStyle = useSyncExternalStore(
    subscribeTheme,
    getLightStyle,
    () => DEFAULT_LIGHT_STYLE
  );
  const darkStyle = useSyncExternalStore(subscribeTheme, getDarkStyle, () => DEFAULT_DARK_STYLE);

  return (
    <div className="flex flex-col gap-6">
      <StyleGroup
        title="Light Mode Style"
        styles={LIGHT_STYLES}
        selected={lightStyle}
        onSelect={(id) => setStyle("light", id)}
      />
      <StyleGroup
        title="Dark Mode Style"
        styles={DARK_STYLES}
        selected={darkStyle}
        onSelect={(id) => setStyle("dark", id)}
      />
    </div>
  );
}

function StyleGroup({
  title,
  styles,
  selected,
  onSelect,
}: {
  title: string;
  styles: ThemeStyle[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-ink/80">{title}</p>
      <div className="mt-2.5 flex flex-wrap gap-3">
        {styles.map((style) => {
          const isSelected = style.id === selected;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelect(style.id)}
              aria-pressed={isSelected}
              className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-2.5 transition ${
                isSelected
                  ? "border-gold-500 bg-gold-500/10"
                  : "border-transparent hover:bg-cream-200"
              }`}
            >
              <span
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 shadow-inner"
                style={{ background: style.swatch.bg }}
              >
                <span
                  className="h-5 w-5 rounded-full border border-black/10"
                  style={{ background: style.swatch.surface }}
                />
              </span>
              <span className="text-xs font-semibold text-ink/70">{style.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
