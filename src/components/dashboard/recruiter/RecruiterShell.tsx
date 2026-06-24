import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { NaukriTopNavShell } from "@/components/dashboard/naukri/NaukriTopNavShell";
import { CreditsRemainingBadge } from "@/components/dashboard/naukri/CreditsRemainingBadge";
import { recruiterPrimaryNav } from "@/components/dashboard/naukri/naukriShellStyles";
import { useClientContext } from "@/hooks/useClientContext";

type RecruiterShellProps = {
  settingsPath: string;
  onLogout: () => void | Promise<void>;
  displayName: string;
  email?: string;
  initials: string;
  children: ReactNode;
};

export function RecruiterShell({
  settingsPath,
  onLogout,
  displayName,
  email,
  initials,
  children,
}: RecruiterShellProps) {
  const { data: ctx } = useClientContext();
  const cvUsed = ctx?.client?.cv_downloads_used_this_month ?? 0;
  const cvLimit = ctx?.client?.subscription_plans?.cv_downloads_per_month ?? 100;

  return (
    <RecruiterShellInner
      settingsPath={settingsPath}
      onLogout={onLogout}
      displayName={displayName}
      email={email}
      initials={initials}
      cvUsed={cvUsed}
      cvLimit={cvLimit}
    >
      {children}
    </RecruiterShellInner>
  );
}

function RecruiterShellInner({
  settingsPath,
  onLogout,
  displayName,
  email,
  initials,
  cvUsed,
  cvLimit,
  children,
}: RecruiterShellProps & { cvUsed: number; cvLimit: number }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [impersonating, setImpersonating] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const flag = sessionStorage.getItem("admin_impersonation");
    if (flag) {
      try {
        setImpersonating(JSON.parse(flag));
      } catch {
        setImpersonating({ name: displayName });
      }
    } else {
      setImpersonating(null);
    }
  }, [displayName, location.pathname]);

  const exitImpersonation = async () => {
    sessionStorage.removeItem("admin_impersonation");
    await onLogout();
    navigate("/dashboard/admin/recruiters");
  };

  return (
    <NaukriTopNavShell
      portalLabel="Recruiter"
      primaryNav={recruiterPrimaryNav}
      settingsPath={settingsPath}
      onLogout={onLogout}
      displayName={displayName}
      email={email}
      initials={initials}
      globalSearchPath="/dashboard/client/resdex/results"
      globalSearchPlaceholder="Search candidates"
      megaMenuPortal="recruiter"
      headerBadge={
        <CreditsRemainingBadge used={cvUsed} limit={cvLimit} label="Resdex CV Access" compact />
      }
    >
      {impersonating && (
        <div className="bg-red-600 text-white text-sm px-4 py-2 flex items-center justify-between">
          <span>Admin view: You are viewing as {impersonating.name || displayName}</span>
          <Button size="sm" variant="secondary" className="h-7 text-xs" onClick={() => void exitImpersonation()}>
            Exit
          </Button>
        </div>
      )}
      {children}
    </NaukriTopNavShell>
  );
}
