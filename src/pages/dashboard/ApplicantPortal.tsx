import { Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Bookmark,
  Bell,
  MessageSquare,
  Eye,
  Settings as SettingsIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PortalDashboardLayout } from "@/components/portal/PortalDashboardLayout";
import { isDashboardNavActive } from "@/lib/dashboardNav";
import ApplicantDashboard from "./ApplicantDashboard";
import ApplicantJobsPage from "./applicant/ApplicantJobsPage";
import ApplicantJobDetail from "./applicant/ApplicantJobDetail";
import ApplicantApplicationsPage from "./applicant/ApplicantApplicationsPage";
import ApplicantSavedJobsPage from "./applicant/ApplicantSavedJobsPage";
import JobAlertsPage from "./applicant/JobAlertsPage";
import ApplicantMessagesPage from "./applicant/ApplicantMessagesPage";
import ApplicantProfileViewsPage from "./applicant/ApplicantProfileViewsPage";
import ApplicantSettings from "./applicant/ApplicantSettings";
import { useUnreadMessageCount } from "@/hooks/useUnreadMessageCount";

const navItems = [
  { path: "/dashboard/applicant", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { path: "/dashboard/applicant/applications", label: "Applications", icon: FileText },
  { path: "/dashboard/applicant/jobs", label: "Browse Jobs", icon: Briefcase },
  { path: "/dashboard/applicant/saved-jobs", label: "Saved Jobs", icon: Bookmark },
  { path: "/dashboard/applicant/job-alerts", label: "Job Alerts", icon: Bell },
  { path: "/dashboard/applicant/messages", label: "Messages", icon: MessageSquare },
  { path: "/dashboard/applicant/profile-views", label: "Profile Views", icon: Eye },
  { path: "/dashboard/applicant/settings", label: "Settings", icon: SettingsIcon },
];

const ApplicantPortal = () => {
  const { profile, signOut } = useAuth();
  const { data: unreadTotal = 0 } = useUnreadMessageCount();
  const location = useLocation();
  const navigate = useNavigate();

  const displayName = profile?.full_name || profile?.email?.split("@")[0] || "Applicant";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isHome = location.pathname === "/dashboard/applicant";
  const pageTitle =
    navItems.find((n) => isDashboardNavActive(location.pathname, n))?.label || "Applicant";

  const handleLogout = async () => {
    await signOut();
    navigate("/auth/applicant");
  };

  const bottomNavItems = [
    { path: "/dashboard/applicant", label: "Home", icon: LayoutDashboard, exact: true },
    { path: "/dashboard/applicant/jobs", label: "Jobs", icon: Briefcase },
    { path: "/dashboard/applicant/applications", label: "Apps", icon: FileText },
    { path: "/dashboard/applicant/messages", label: "Messages", icon: MessageSquare },
  ];

  return (
    <PortalDashboardLayout
      role="applicant"
      portalSuffix="Applicant"
      portalTagline="Your career workspace"
      navItems={navItems}
      bottomNavItems={bottomNavItems}
      settingsPath="/dashboard/applicant/settings"
      onLogout={handleLogout}
      displayName={displayName}
      email={profile?.email}
      initials={initials}
      headerMode={isHome ? "greeting" : "title"}
      headerTitle={isHome ? undefined : pageTitle}
      showUserMenu={false}
      animateMain
      unreadTotal={unreadTotal}
    >
      <Routes>
        <Route index element={<ApplicantDashboard embedded />} />
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
    </PortalDashboardLayout>
  );
};

export default ApplicantPortal;
