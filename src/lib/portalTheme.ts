/** Portal dashboards are light-only (Naukri-style recruiter UI). */

export type PortalTheme = "light";

const PORTAL_THEME_KEY = "portal-theme";
const MARKETING_THEME_KEY = "ellure-ui-theme";

export function getStoredPortalTheme(): PortalTheme {
  return "light";
}

export function setStoredPortalTheme(_theme: PortalTheme = "light"): void {
  localStorage.setItem(PORTAL_THEME_KEY, "light");
}

export function applyPortalTheme(_theme: PortalTheme = "light"): void {
  const root = document.documentElement;
  root.classList.remove("dark");
  root.classList.add("light");
}

export function restoreMarketingTheme(): void {
  const stored = localStorage.getItem(MARKETING_THEME_KEY);
  const theme = stored === "dark" ? "dark" : stored === "light" ? "light" : null;
  if (theme) {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    return;
  }
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(systemDark ? "dark" : "light");
}

export function isDashboardPath(pathname: string): boolean {
  return pathname.startsWith("/dashboard/");
}

export function resolvePortalTheme(): PortalTheme {
  return "light";
}

/** Clears any legacy dark portal preference from localStorage. */
export function ensurePortalLightTheme(): void {
  localStorage.setItem(PORTAL_THEME_KEY, "light");
  applyPortalTheme("light");
}
