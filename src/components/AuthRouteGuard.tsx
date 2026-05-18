import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

/** Redirects to force-change-password when profile requires it. */
export const ForcePasswordGuard = ({ children }: { children: ReactNode }) => {
  const { profile, loading, user } = useAuth();
  const location = useLocation();

  if (loading && user) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (
    profile?.must_change_password === true &&
    location.pathname !== "/auth/force-change-password"
  ) {
    if (location.pathname.startsWith("/dashboard")) {
      sessionStorage.setItem("post_password_redirect", location.pathname + location.search);
    }
    return <Navigate to="/auth/force-change-password" replace />;
  }

  return <>{children}</>;
};
