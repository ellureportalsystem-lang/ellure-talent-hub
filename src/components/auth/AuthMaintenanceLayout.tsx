import { Outlet } from "react-router-dom";
import { ForceLightTheme } from "@/components/ThemeProvider";
import { isAuthMaintenanceMode } from "@/lib/authMaintenance";
import AuthMaintenancePage from "@/pages/auth/AuthMaintenancePage";

/** Blocks all nested auth / portal entry routes when maintenance mode is on. */
export function AuthMaintenanceLayout() {
  if (isAuthMaintenanceMode) {
    return (
      <ForceLightTheme>
        <AuthMaintenancePage />
      </ForceLightTheme>
    );
  }

  return <Outlet />;
}
