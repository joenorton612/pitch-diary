export type Theme = "light" | "dark";

const THEME_EVENT = "pitchdiary-theme-change";

export function getTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export function getServerTheme(): Theme {
  return "light";
}

export function setTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // ignore (private browsing, storage disabled, etc.)
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}

export function subscribeTheme(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback);
  return () => window.removeEventListener(THEME_EVENT, callback);
}
