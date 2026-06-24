import { Routes, Route, useNavigate, Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AdminPortalShell } from "@/components/dashboard/admin/AdminPortalShell";
import AdminHome from "./admin/AdminHome";
import ClientsManagement from "./admin/ClientsManagement";
import AdminSettings from "./admin/AdminSettings";
import ImportCandidatesPage from "./admin/ImportCandidatesPage";
import BulkResumeUpload from "./admin/BulkResumeUpload";
import AuditLogPage from "./admin/AuditLogPage";
import ReportsPage from "./admin/ReportsPage";
import SubscriptionsManagementPage from "./admin/SubscriptionsManagementPage";
import RecruiterDetailPage from "./admin/RecruiterDetailPage";
import PortalContentManagementPage from "./admin/PortalContentManagementPage";
import EnterpriseApplicantProfile from "./admin/EnterpriseApplicantProfile";
import ApplicantsManagement from "./admin/ApplicantsManagement";
import AdminMessagesPage from "./admin/AdminMessagesPage";
import UsersManagement from "./admin/UsersManagement";
import { fetchRecruitersNearExpiry } from "@/services/adminManagementService";
import { PORTAL_ROUTES } from "@/lib/portalRoutes";
import { usePendingClients } from "@/hooks/useDashboardStats";

function LegacyCandidateProfileRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={id ? `/dashboard/admin/applicants/${id}` : "/dashboard/admin/applicants"} replace />;
}

const AdminDashboard = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: pendingClients } = usePendingClients(50);
  const [expiringCount, setExpiringCount] = useState(0);

  useEffect(() => {
    fetchRecruitersNearExpiry(7)
      .then((rows) => setExpiringCount(rows.length))
      .catch(() => setExpiringCount(0));
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate(PORTAL_ROUTES.admin.login);
  };

  const displayName = profile?.full_name || profile?.display_name || profile?.email?.split("@")[0] || "Admin";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const pendingApprovals = pendingClients?.length ?? 0;

  return (
    <AdminPortalShell
      settingsPath="/dashboard/admin/settings"
      onLogout={handleLogout}
      displayName={displayName}
      email={profile?.email ?? undefined}
      initials={initials}
      pendingApprovals={pendingApprovals}
    >
      <Routes>
        <Route index element={<AdminHome expiringCount={expiringCount} />} />
        <Route path="data/import" element={<ImportCandidatesPage />} />
        <Route path="data/bulk-resumes" element={<BulkResumeUpload />} />
        <Route path="applicants" element={<ApplicantsManagement />} />
        <Route
          path="applicants/:id"
          element={<EnterpriseApplicantProfile viewMode="admin" applicantDisplayMode="view" />}
        />
        <Route path="candidates/:id" element={<LegacyCandidateProfileRedirect />} />
        <Route path="recruiters" element={<ClientsManagement />} />
        <Route path="messages" element={<AdminMessagesPage />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="recruiters/:id" element={<RecruiterDetailPage />} />
        <Route path="content" element={<PortalContentManagementPage />} />
        <Route path="subscriptions" element={<SubscriptionsManagementPage />} />
        <Route path="analytics" element={<ReportsPage />} />
        <Route path="audit-log" element={<AuditLogPage />} />
        <Route path="settings" element={<AdminSettings />} />
        {/* Legacy redirects — recruiter features moved to client dashboard */}
        <Route path="import" element={<Navigate to="/dashboard/admin/data/import" replace />} />
        <Route path="applicants/bulk-resumes" element={<Navigate to="/dashboard/admin/data/bulk-resumes" replace />} />
        <Route path="clients" element={<Navigate to="/dashboard/admin/recruiters" replace />} />
        <Route path="jobs/*" element={<Navigate to="/dashboard/client/jobs" replace />} />
        <Route path="folders" element={<Navigate to="/dashboard/client/shortlists" replace />} />
        <Route path="reports" element={<Navigate to="/dashboard/admin/analytics" replace />} />
      </Routes>
    </AdminPortalShell>
  );
};

export default AdminDashboard;
