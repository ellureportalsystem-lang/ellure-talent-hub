import { useState } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, Users, FolderOpen, FileText, 
  Settings, UserCog, LogOut, BarChart3, Search, Briefcase,
  ChevronLeft, ChevronRight, Bell
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

// Import admin pages
import AdminHome from "./admin/AdminHome";
import ApplicantsManagement from "./admin/ApplicantsManagement";
import FoldersManagement from "./admin/FoldersManagement";
import ReportsPage from "./admin/ReportsPage";
import UsersManagement from "./admin/UsersManagement";
import AdminSettings from "./admin/AdminSettings";
import EnterpriseApplicantProfile from "./admin/EnterpriseApplicantProfile";

const AdminDashboard = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth/login");
  };

  const navItems = [
    { path: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/dashboard/admin/applicants", label: "Resume Search", icon: Search, badge: "AI" },
    { path: "/dashboard/admin/folders", label: "Folders", icon: FolderOpen },
    { path: "/dashboard/admin/jobs", label: "Jobs", icon: Briefcase },
    { path: "/dashboard/admin/reports", label: "Reports", icon: BarChart3 },
    { path: "/dashboard/admin/users", label: "Users", icon: UserCog },
    { path: "/dashboard/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle flex">
      {/* Sidebar */}
      <aside className={cn(
        "bg-card border-r transition-all duration-300 shadow-lg flex-shrink-0",
        sidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="flex flex-col h-screen">
          {/* Header */}
          <div className="p-4 border-b bg-primary/5">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">E</span>
                  </div>
                  <div>
                    <h1 className="text-base font-bold text-foreground">Ellure NexHire</h1>
                    <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                      {profile?.email || "Administrator"}
                    </p>
                  </div>
                </div>
              )}
              {!sidebarOpen && (
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center mx-auto">
                  <span className="text-primary-foreground font-bold text-lg">E</span>
                </div>
              )}
            </div>
          </div>

          {/* Toggle Button */}
          <div className="px-3 py-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={cn(
                "w-full flex items-center gap-2 text-muted-foreground hover:text-foreground",
                sidebarOpen ? "justify-end" : "justify-center"
              )}
            >
              {sidebarOpen ? (
                <>
                  <span className="text-xs">Collapse</span>
                  <ChevronLeft className="h-4 w-4" />
                </>
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path !== "/dashboard/admin" && location.pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 flex-shrink-0 transition-transform",
                    !isActive && "group-hover:scale-110"
                  )} />
                  {sidebarOpen && (
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                  )}
                  {sidebarOpen && item.badge && (
                    <Badge 
                      variant={isActive ? "secondary" : "outline"} 
                      className={cn(
                        "text-[10px] px-1.5 py-0",
                        isActive && "bg-primary-foreground/20 text-primary-foreground"
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t space-y-2">
            {sidebarOpen && (
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Notifications</span>
                </div>
                <Badge variant="destructive" className="text-[10px] px-1.5 py-0">3</Badge>
              </div>
            )}
            <Button
              variant="ghost"
              className={cn(
                "w-full rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                sidebarOpen ? "justify-start" : "justify-center"
              )}
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3 text-sm">Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-muted/30">
        <Routes>
          <Route index element={<AdminHome />} />
          <Route path="applicants" element={<ApplicantsManagement />} />
          <Route path="applicants/:id" element={<EnterpriseApplicantProfile viewMode="admin" />} />
          <Route path="folders" element={<FoldersManagement />} />
          <Route path="jobs" element={<div className="p-6"><h1 className="text-2xl font-bold">Jobs Management</h1><p className="text-muted-foreground mt-2">Coming soon...</p></div>} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="settings" element={<AdminSettings />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
