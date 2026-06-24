import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Loader2, LogOut } from "lucide-react";
import type { UserRole } from "@/types/database.types";

import { LOGIN_BY_ROLE, DASHBOARD_BY_ROLE, loginPathForDashboard } from "@/lib/portalRoutes";

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: ("applicant" | "admin" | "client")[];
}

export const RoleBasedRoute = ({ children, allowedRoles }: RoleBasedRouteProps) => {
  const { profile, loading, user, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [verifiedProfile, setVerifiedProfile] = useState<typeof profile>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const verify = async () => {
      if (loading) {
        if (alive) setProfileLoading(true);
        return;
      }

      if (!user) {
        if (alive) {
          setVerifiedProfile(null);
          setProfileLoading(false);
        }
        return;
      }

      if (alive) setProfileLoading(true);
      try {
        const fresh = await refreshProfile();
        if (alive) setVerifiedProfile(fresh);
      } finally {
        if (alive) setProfileLoading(false);
      }
    };

    void verify();
    return () => {
      alive = false;
    };
  }, [loading, user?.id, refreshProfile]);

  const activeProfile = verifiedProfile ?? profile;
  const loginPath = loginPathForDashboard(location.pathname);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={loginPath} replace state={{ from: location.pathname }} />;
  }

  if (!activeProfile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <Shield className="h-6 w-6 text-destructive mx-auto mb-2" />
            <CardTitle className="text-2xl">Profile Not Found</CardTitle>
            <CardDescription>Your profile could not be loaded from the database.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={async () => {
                await signOut();
                navigate(loginPath);
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const role = activeProfile.role as UserRole;
  if (!allowedRoles.includes(role as "applicant" | "admin" | "client")) {
    const redirect = DASHBOARD_BY_ROLE[role] ?? loginPath;
    return <Navigate to={redirect} replace />;
  }

  return <>{children}</>;
};
