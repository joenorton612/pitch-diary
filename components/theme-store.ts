import { DEFAULT_DARK_STYLE, DEFAULT_LIGHT_STYLE } from "@/lib/themeStyles";

export type Mode = "light" | "dark";

const THEME_EVENT = "pitchdiary-theme-change";
const MODE_KEY = "theme";
const LIGHT_STYLE_KEY = "themeStyleLight";
const DARK_STYLE_KEY = "themeStyleDark";

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore (private browsing, storage disabled, etc.)
  }
}

/** The mode ("light"/"dark") baked into the current data-theme attribute, e.g. "dark-ocean" → "dark". */
export function getMode(): Mode {
  const attr = document.documentElement.getAttribute("data-theme") || "";
  return attr.startsWith("dark") ? "dark" : "light";
}

export function getServerMode(): Mode {
  return "light";
}

export function getLightStyle(): string {
  return safeGet(LIGHT_STYLE_KEY) || DEFAULT_LIGHT_STYLE;
}

export function getDarkStyle(): string {
  return safeGet(DARK_STYLE_KEY) || DEFAULT_DARK_STYLE;
}

function applyDataTheme(mode: Mode, styleId: string) {
  document.documentElement.setAttribute("data-theme", `${mode}-${styleId}`);
}

/** Switches light/dark, keeping whichever style was last chosen for that mode. */
export function setMode(mode: Mode) {
  applyDataTheme(mode, mode === "dark" ? getDarkStyle() : getLightStyle());
  safeSet(MODE_KEY, mode);
  window.dispatchEvent(new Event(THEME_EVENT));
}

/** Picks a named style (e.g. "ocean") for a given mode, applying it immediately if that mode is active. */
export function setStyle(mode: Mode, styleId: string) {
  safeSet(mode === "dark" ? DARK_STYLE_KEY : LIGHT_STYLE_KEY, styleId);
  if (getMode() === mode) {
    applyDataTheme(mode, styleId);
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}

export function subscribeTheme(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback);
  return () => window.removeEventListener(THEME_EVENT, callback);
}
