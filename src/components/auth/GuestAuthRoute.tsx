import { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DASHBOARD_BY_ROLE } from "@/lib/portalRoutes";
import type { UserRole } from "@/types/database.types";

type GuestAuthRouteProps = {
  children: ReactNode;
  /** Only allow guests, or redirect logged-in users to their dashboard */
  expectedRole?: UserRole;
};

/** Login/register pages — redirect authenticated users away from wrong portal logins */
export function GuestAuthRoute({ children, expectedRole }: GuestAuthRouteProps) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f5f7]">
        <Loader2 className="h-8 w-8 animate-spin text-[#0566CD]" />
      </div>
    );
  }

  if (user && profile?.role) {
    const role = profile.role as keyof typeof DASHBOARD_BY_ROLE;
    if (expectedRole && role !== expectedRole) {
      return <Navigate to={DASHBOARD_BY_ROLE[role]} replace />;
    }
    return <Navigate to={DASHBOARD_BY_ROLE[role]} replace />;
  }

  return <>{children}</>;
}
