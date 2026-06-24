import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { RecruiterShell } from "@/components/dashboard/recruiter/RecruiterShell";
import RecruiterHomePage from "./recruiter/RecruiterHomePage";
import ResdexSearchPage from "./recruiter/ResdexSearchPage";
import ResdexResultsPage from "./recruiter/ResdexResultsPage";
import NvitePage from "./recruiter/NvitePage";
import NviteCampaignsPage from "./recruiter/NviteCampaignsPage";
import CandidateProfileView from "./client/CandidateProfileView";
import ClientFoldersManagement from "./client/ClientFoldersManagement";
import JobsPage from "./client/JobsPage";
import ClientSettings from "./client/ClientSettings";
import ClientBillingPage from "./client/ClientBillingPage";
import ClientTeamPage from "./client/ClientTeamPage";
import MessagesPage from "./client/MessagesPage";
import { PORTAL_ROUTES } from "@/lib/portalRoutes";
import RecruiterReportsPage from "./recruiter/RecruiterReportsPage";

const ClientDashboard = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate(PORTAL_ROUTES.recruiter.login);
  };

  const displayName = profile?.full_name || profile?.display_name || profile?.email?.split("@")[0] || "Recruiter";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <RecruiterShell
      settingsPath="/dashboard/client/settings"
      onLogout={handleLogout}
      displayName={displayName}
      email={profile?.email ?? undefined}
      initials={initials}
    >
      <Routes>
        <Route index element={<RecruiterHomePage />} />
        <Route path="resdex" element={<ResdexSearchPage />} />
        <Route path="resdex/results" element={<ResdexResultsPage />} />
        <Route path="nvite" element={<NvitePage />} />
        <Route path="nvite/campaigns" element={<NviteCampaignsPage />} />
        {/* Legacy paths → new structure */}
        <Route path="candidates" element={<Navigate to="/dashboard/client/resdex/results" replace />} />
        <Route path="candidates/:id" element={<CandidateProfileView />} />
        <Route path="resdex/candidates/:id" element={<CandidateProfileView />} />
        <Route path="folders" element={<ClientFoldersManagement />} />
        <Route path="shortlists" element={<ClientFoldersManagement />} />
        <Route path="jobs/*" element={<JobsPage />} />
        <Route path="reports" element={<RecruiterReportsPage />} />
        <Route path="billing" element={<ClientBillingPage />} />
        <Route path="team" element={<ClientTeamPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="settings" element={<ClientSettings />} />
        <Route path="*" element={<Navigate to="/dashboard/client" replace />} />
      </Routes>
    </RecruiterShell>
  );
};

export default ClientDashboard;
