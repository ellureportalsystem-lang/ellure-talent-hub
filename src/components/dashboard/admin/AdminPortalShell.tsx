import type { ReactNode } from "react";
import { NaukriTopNavShell } from "@/components/dashboard/naukri/NaukriTopNavShell";
import { adminPrimaryNav } from "@/components/dashboard/naukri/naukriShellStyles";
import { NaukriPageContainer } from "@/components/dashboard/naukri/NaukriPageContainer";
import { Badge } from "@/components/ui/badge";

type AdminPortalShellProps = {
  settingsPath: string;
  onLogout: () => void | Promise<void>;
  displayName: string;
  email?: string;
  initials: string;
  children: ReactNode;
  pendingApprovals?: number;
};

export function AdminPortalShell({
  settingsPath,
  onLogout,
  displayName,
  email,
  initials,
  children,
  pendingApprovals = 0,
}: AdminPortalShellProps) {
  return (
    <NaukriTopNavShell
      portalLabel="Admin"
      primaryNav={adminPrimaryNav}
      settingsPath={settingsPath}
      onLogout={onLogout}
      displayName={displayName}
      email={email}
      initials={initials}
      globalSearchPath="/dashboard/admin/applicants"
      globalSearchPlaceholder="Search candidates by name or email"
      megaMenuPortal="admin"
      headerBadge={
        pendingApprovals > 0 ? (
          <Badge variant="destructive" className="text-xs font-semibold">
            {pendingApprovals} pending
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs text-slate-600 border-slate-200 bg-slate-50">
            Portal ops
          </Badge>
        )
      }
    >
      <NaukriPageContainer>{children}</NaukriPageContainer>
    </NaukriTopNavShell>
  );
}
