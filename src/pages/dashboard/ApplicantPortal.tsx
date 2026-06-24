import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { ApplicantNaukriShell } from "@/components/dashboard/applicant/ApplicantNaukriShell";
import { PORTAL_ROUTES } from "@/lib/portalRoutes";
import ApplicantJobsPage from "./applicant/ApplicantJobsPage";
import ApplicantJobDetail from "./applicant/ApplicantJobDetail";
import ApplicantApplicationsPage from "./applicant/ApplicantApplicationsPage";
import ApplicantSavedJobsPage from "./applicant/ApplicantSavedJobsPage";
import JobAlertsPage from "./applicant/JobAlertsPage";
import ApplicantMessagesPage from "./applicant/ApplicantMessagesPage";
import ApplicantProfileViewsPage from "./applicant/ApplicantProfileViewsPage";
import ApplicantProfilePage from "./applicant/ApplicantProfilePage";
import ApplicantProfileEditPage from "./applicant/ApplicantProfileEditPage";
import ApplicantSettings from "./applicant/ApplicantSettings";
import { useUnreadMessageCount } from "@/hooks/useUnreadMessageCount";

const ApplicantPortal = () => {
  const { profile, signOut } = useAuth();
  const { data: unreadTotal = 0 } = useUnreadMessageCount();
  const navigate = useNavigate();

  const displayName = profile?.full_name || profile?.email?.split("@")[0] || "Candidate";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await signOut();
    navigate(PORTAL_ROUTES.candidate.login);
  };

  return (
    <ApplicantNaukriShell
      settingsPath="/dashboard/applicant/settings"
      onLogout={handleLogout}
      displayName={displayName}
      email={profile?.email ?? undefined}
      initials={initials}
      headerBadge={
        unreadTotal > 0 ? (
          <Badge className="bg-[#0566CD] text-[10px]">{unreadTotal} new</Badge>
        ) : undefined
      }
    >
      <Routes>
        <Route index element={<ApplicantProfilePage />} />
        <Route path="profile/edit" element={<ApplicantProfileEditPage />} />
        <Route path="profile" element={<Navigate to="/dashboard/applicant" replace />} />
        <Route path="jobs" element={<ApplicantJobsPage />} />
        <Route path="jobs/:id" element={<ApplicantJobDetail />} />
        <Route path="applications" element={<ApplicantApplicationsPage />} />
        <Route path="saved-jobs" element={<ApplicantSavedJobsPage />} />
        <Route path="job-alerts" element={<JobAlertsPage />} />
        <Route path="messages" element={<ApplicantMessagesPage />} />
        <Route path="profile-views" element={<ApplicantProfileViewsPage />} />
        <Route path="settings" element={<ApplicantSettings />} />
      </Routes>
    </ApplicantNaukriShell>
  );
};

export default ApplicantPortal;
