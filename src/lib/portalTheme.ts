/** Portal dashboards use separate theme storage from the marketing site. */

export type PortalTheme = "light" | "dark";

const PORTAL_THEME_KEY = "portal-theme";
const MARKETING_THEME_KEY = "ellure-ui-theme";

export function getStoredPortalTheme(): PortalTheme {
  const stored = localStorage.getItem(PORTAL_THEME_KEY);
  return stored === "dark" ? "dark" : "light";
}

export function setStoredPortalTheme(theme: PortalTheme): void {
  localStorage.setItem(PORTAL_THEME_KEY, theme);
}

export function applyPortalTheme(theme: PortalTheme): void {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
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
  const portalStored = localStorage.getItem(PORTAL_THEME_KEY);
  if (portalStored === "dark" || portalStored === "light") return portalStored;

  // If portal theme has never been set, mirror the user's main theme preference.
  const marketingStored = localStorage.getItem(MARKETING_THEME_KEY);
  if (marketingStored === "dark" || marketingStored === "light") return marketingStored;

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
