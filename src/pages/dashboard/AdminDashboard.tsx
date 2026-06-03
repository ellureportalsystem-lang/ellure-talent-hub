import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  Settings,
  UserCog,
  BarChart3,
  Search,
  Briefcase,
  Bell,
  Upload,
  FileSpreadsheet,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PortalDashboardLayout } from "@/components/portal/PortalDashboardLayout";
import AdminHome from "./admin/AdminHome";
import ApplicantsManagement from "./admin/ApplicantsManagement";
import FoldersManagement from "./admin/FoldersManagement";
import ReportsPage from "./admin/ReportsPage";
import UsersManagement from "./admin/UsersManagement";
import AdminSettings from "./admin/AdminSettings";
import EnterpriseApplicantProfile from "./admin/EnterpriseApplicantProfile";
import BulkResumeUpload from "./admin/BulkResumeUpload";
import ImportCandidatesPage from "./admin/ImportCandidatesPage";
import AdminJobsPage from "./admin/AdminJobsPage";
import AdminMessagesPage from "./admin/AdminMessagesPage";
import { useUnreadMessageCount } from "@/hooks/useUnreadMessageCount";
import { isDashboardNavActive } from "@/lib/dashboardNav";

const AdminDashboard = () => {
  const { profile, signOut } = useAuth();
  const { data: unreadTotal = 0 } = useUnreadMessageCount();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth/login");
  };

  const displayName = profile?.full_name || profile?.display_name || profile?.email?.split("@")[0] || "Admin";
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
        { path: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
        { path: "/dashboard/admin/applicants", label: "Resume Search", icon: Search, badge: "AI" },
        { path: "/dashboard/admin/applicants/bulk-resumes", label: "Bulk CV upload", icon: Upload },
        { path: "/dashboard/admin/import", label: "Import Data", icon: FileSpreadsheet },
        { path: "/dashboard/admin/folders", label: "Folders", icon: FolderOpen },
      ],
    },
    {
      label: "Management",
      items: [
        { path: "/dashboard/admin/jobs", label: "Jobs", icon: Briefcase },
        { path: "/dashboard/admin/reports", label: "Reports", icon: BarChart3 },
        { path: "/dashboard/admin/users", label: "Users", icon: UserCog },
        { path: "/dashboard/admin/messages", label: "Emails", icon: Bell },
      ],
    },
    {
      label: "Settings",
      items: [{ path: "/dashboard/admin/settings", label: "Settings", icon: Settings }],
    },
  ];

  const bottomNavItems = [
    { path: "/dashboard/admin", label: "Home", icon: LayoutDashboard, exact: true },
    { path: "/dashboard/admin/applicants", label: "Search", icon: Search },
    { path: "/dashboard/admin/applicants/bulk-resumes", label: "Upload", icon: Upload },
    { path: "/dashboard/admin/messages", label: "Emails", icon: Bell },
  ];

  const isHome = location.pathname === "/dashboard/admin";
  const flatNav = navSections.flatMap((s) => s.items);
  const pageTitle =
    flatNav.find((n) => isDashboardNavActive(location.pathname, n))?.label || "Admin";

  return (
    <PortalDashboardLayout
      role="admin"
      portalSuffix="Admin"
      portalTagline="Recruitment operations workspace"
      navSections={navSections}
      bottomNavItems={bottomNavItems}
      settingsPath="/dashboard/admin/settings"
      onLogout={handleLogout}
      displayName={displayName}
      email={profile?.email || "admin@ellure.com"}
      initials={initials}
      headerMode="brand"
      headerShowBack={!isHome}
      headerTitle={!isHome ? pageTitle : undefined}
      unreadTotal={unreadTotal}
    >
      <Routes>
        <Route index element={<AdminHome />} />
        <Route path="applicants" element={<ApplicantsManagement />} />
        <Route path="applicants/bulk-resumes" element={<BulkResumeUpload />} />
        <Route path="import" element={<ImportCandidatesPage />} />
        <Route
          path="applicants/:id"
          element={<EnterpriseApplicantProfile key={location.pathname} viewMode="admin" />}
        />
        <Route path="folders" element={<FoldersManagement />} />
        <Route path="jobs/*" element={<AdminJobsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="messages" element={<AdminMessagesPage />} />
        <Route path="settings" element={<AdminSettings />} />
      </Routes>
    </PortalDashboardLayout>
  );
};

export default AdminDashboard;
