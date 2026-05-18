import { ReactNode, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Loader2, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: ("applicant" | "admin" | "client")[];
}

const DASHBOARD_BY_ROLE: Record<string, string> = {
  admin: "/dashboard/admin",
  client: "/dashboard/client",
  applicant: "/dashboard/applicant",
};

export const RoleBasedRoute = ({ children, allowedRoles }: RoleBasedRouteProps) => {
  const { profile, loading, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profileLoading, setProfileLoading] = useState(true);

  const isTestingMode = sessionStorage.getItem("testing_mode") === "true";
  const testingRole = sessionStorage.getItem("testing_role") as "applicant" | "admin" | "client" | null;

  useEffect(() => {
    if (!loading && user) {
      if (profile) {
        setProfileLoading(false);
        return;
      }

      const fetchProfile = async () => {
        try {
          const {
            data: { user: authUser },
          } = await supabase.auth.getUser();
          if (!authUser) {
            setProfileLoading(false);
            return;
          }

          await supabase.from("profiles").select("*").eq("id", authUser.id).single();
          setProfileLoading(false);
        } catch (error) {
          console.error("Error fetching profile:", error);
          setProfileLoading(false);
        }
      };

      void fetchProfile();
    } else if (!loading && !user) {
      setProfileLoading(false);
    }
  }, [loading, user, profile]);

  if (isTestingMode && testingRole && allowedRoles.includes(testingRole)) {
    return <>{children}</>;
  }

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user && !isTestingMode) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!profile && !isTestingMode) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <Shield className="h-6 w-6 text-destructive mx-auto mb-2" />
            <CardTitle className="text-2xl">Profile Not Found</CardTitle>
            <CardDescription>Your profile could not be loaded.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={async () => {
                await signOut();
                navigate("/auth/login");
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

  if (profile && !allowedRoles.includes(profile.role) && !isTestingMode) {
    return <Navigate to={DASHBOARD_BY_ROLE[profile.role] ?? "/auth/login"} replace />;
  }

  return <>{children}</>;
};

