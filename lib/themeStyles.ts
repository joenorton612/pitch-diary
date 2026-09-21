export interface ThemeStyle {
  id: string;
  label: string;
  /** Swatch colors shown in the picker — bg is the page background, surface the card fill. */
  swatch: { bg: string; surface: string };
}

export const LIGHT_STYLES: ThemeStyle[] = [
  {
    id: "classic",
    label: "Classic",
    swatch: { bg: "#f6f5ef", surface: "#fdfcf9" },
  },
  {
    id: "sunrise",
    label: "Sunrise",
    swatch: { bg: "#fdf3ea", surface: "#fffaf5" },
  },
  {
    id: "mint",
    label: "Mint",
    swatch: { bg: "#eef7f0", surface: "#f8fdf9" },
  },
];

export const DARK_STYLES: ThemeStyle[] = [
  {
    id: "forest",
    label: "Forest",
    swatch: { bg: "#0a1410", surface: "#142019" },
  },
  {
    id: "ocean",
    label: "Deep Ocean",
    swatch: { bg: "#0a1420", surface: "#13212f" },
  },
  {
    id: "midnight",
    label: "Midnight",
    swatch: { bg: "#111113", surface: "#1c1c1f" },
  },
];

export const DEFAULT_LIGHT_STYLE = "classic";
export const DEFAULT_DARK_STYLE = "forest";
