import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  ensurePortalLightTheme,
  isDashboardPath,
  restoreMarketingTheme,
} from "@/lib/portalTheme";
import { useTheme } from "@/components/ThemeProvider";

/** Forces light theme on dashboard routes; restores marketing theme elsewhere. */
export function PortalThemeSync() {
  const { pathname } = useLocation();
  const { forcedLight } = useTheme();

  useEffect(() => {
    if (forcedLight) return;

    if (isDashboardPath(pathname)) {
      ensurePortalLightTheme();
    } else {
      restoreMarketingTheme();
    }
  }, [pathname, forcedLight]);

  return null;
}
