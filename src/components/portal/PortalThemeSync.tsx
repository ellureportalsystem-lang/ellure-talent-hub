import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  applyPortalTheme,
  isDashboardPath,
  resolvePortalTheme,
  restoreMarketingTheme,
} from "@/lib/portalTheme";
import { useTheme } from "@/components/ThemeProvider";

/** Applies portal light/dark tokens on dashboard routes; restores marketing theme elsewhere. */
export function PortalThemeSync() {
  const { pathname } = useLocation();
  const { forcedLight } = useTheme();

  useEffect(() => {
    if (forcedLight) return;

    if (isDashboardPath(pathname)) {
      applyPortalTheme(resolvePortalTheme());
    } else {
      restoreMarketingTheme();
    }
  }, [pathname, forcedLight]);

  return null;
}
