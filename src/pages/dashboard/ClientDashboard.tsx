import { Routes, Route, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  MessageSquare,
  Settings,
  FolderKanban,
  Bell,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PortalDashboardLayout } from "@/components/portal/PortalDashboardLayout";
import { cn } from "@/lib/utils";
import ClientHome from "./client/ClientHome";
import CandidatesPage from "./client/CandidatesPage";
import CandidateProfileView from "./client/CandidateProfileView";
import ClientFoldersManagement from "./client/ClientFoldersManagement";
import JobsPage from "./client/JobsPage";
import ClientSettings from "./client/ClientSettings";
import ClientBillingPage from "./client/ClientBillingPage";
import ClientTeamPage from "./client/ClientTeamPage";
import MessagesPage from "./client/MessagesPage";
import { useClientContext } from "@/hooks/useClientContext";
import { useUnreadMessageCount } from "@/hooks/useUnreadMessageCount";

const ClientDashboard = () => {
  const { profile, signOut } = useAuth();
  const { data: clientCtx } = useClientContext();
  const { data: unreadTotal = 0 } = useUnreadMessageCount();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth/login");
  };

  const displayName = profile?.full_name || profile?.display_name || profile?.email?.split("@")[0] || "Client";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const navSections = [
    {
      label: "Main menu",
      items: [
        { path: "/dashboard/client", label: "Dashboard", icon: LayoutDashboard, exact: true },
        { path: "/dashboard/client/candidates", label: "Candidates", icon: Users },
        { path: "/dashboard/client/folders", label: "My Shortlists", icon: FolderKanban },
        { path: "/dashboard/client/jobs", label: "Jobs", icon: Briefcase },
        { path: "/dashboard/client/messages", label: "Emails", icon: MessageSquare },
      ],
    },
    {
      label: "Management",
      items: [
        { path: "/dashboard/client/billing", label: "Billing", icon: Settings },
        { path: "/dashboard/client/team", label: "Team", icon: Users },
      ],
    },
    {
      label: "Settings",
      items: [{ path: "/dashboard/client/settings", label: "Settings", icon: Settings }],
    },
  ];

  const bottomNavItems = [
    { path: "/dashboard/client", label: "Home", icon: LayoutDashboard, exact: true },
    { path: "/dashboard/client/candidates", label: "Candidates", icon: Users },
    { path: "/dashboard/client/folders", label: "Shortlists", icon: FolderKanban },
    { path: "/dashboard/client/messages", label: "Emails", icon: MessageSquare },
  ];

  const cvUsed = clientCtx?.client?.cv_downloads_used_this_month ?? 0;
  const cvLimit = clientCtx?.client?.subscription_plans?.cv_downloads_per_month ?? 100;
  const cvAtLimit = cvUsed >= cvLimit;
  const cvWarning = cvUsed > cvLimit * 0.75;

  const headerExtra =
    clientCtx?.client ? (
      <span
        className={cn(
          "hidden rounded-full border px-2.5 py-1 text-xs font-medium sm:inline",
          cvAtLimit
            ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
            : cvWarning
              ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300"
              : "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
        )}
      >
        CVs: {cvUsed}/{cvLimit}
      </span>
    ) : null;

  return (
    <PortalDashboardLayout
      role="client"
      portalSuffix="Client"
      portalTagline="Hiring workspace"
      navSections={navSections}
      bottomNavItems={bottomNavItems}
      settingsPath="/dashboard/client/settings"
      onLogout={handleLogout}
      displayName={displayName}
      email={profile?.email || "client@company.com"}
      initials={initials}
      unreadTotal={unreadTotal}
      headerExtra={headerExtra}
    >
      <Routes>
        <Route index element={<ClientHome />} />
        <Route path="candidates" element={<CandidatesPage />} />
        <Route path="candidates/:id" element={<CandidateProfileView />} />
        <Route path="folders" element={<ClientFoldersManagement />} />
        <Route path="jobs/*" element={<JobsPage />} />
        <Route path="billing" element={<ClientBillingPage />} />
        <Route path="team" element={<ClientTeamPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="settings" element={<ClientSettings />} />
      </Routes>
    </PortalDashboardLayout>
  );
};

export default ClientDashboard;
