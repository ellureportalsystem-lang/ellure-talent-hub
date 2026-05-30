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
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function restoreMarketingTheme(): void {
  const stored = localStorage.getItem(MARKETING_THEME_KEY);
  const theme = stored === "dark" ? "dark" : stored === "light" ? "light" : null;
  if (theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
    return;
  }
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", systemDark);
}

export function isDashboardPath(pathname: string): boolean {
  return pathname.startsWith("/dashboard/");
}
