import { useState } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, Users, Briefcase, MessageSquare, 
  Settings, LogOut, Building2, FolderKanban, ChevronLeft, ChevronRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

// Import client pages
import ClientHome from "./client/ClientHome";
import CandidatesPage from "./client/CandidatesPage";
import CandidateProfileView from "./client/CandidateProfileView";
import ClientFoldersManagement from "./client/ClientFoldersManagement";
import JobsPage from "./client/JobsPage";
import MessagesPage from "./client/MessagesPage";
import ClientSettings from "./client/ClientSettings";

const ClientDashboard = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth/login");
  };

  const navItems = [
    { path: "/dashboard/client", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { path: "/dashboard/client/candidates", label: "Candidates", icon: Users },
    { path: "/dashboard/client/folders", label: "My Shortlists", icon: FolderKanban },
    { path: "/dashboard/client/jobs", label: "Jobs", icon: Briefcase },
    { path: "/dashboard/client/messages", label: "Messages", icon: MessageSquare },
    { path: "/dashboard/client/settings", label: "Settings", icon: Settings },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex w-full">
      {/* Sidebar */}
      <aside className={cn(
        "bg-background border-r transition-all duration-300 flex-shrink-0",
        sidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="flex flex-col h-screen sticky top-0">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-info/20 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-info" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold">Client Portal</h1>
                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                      {profile?.email || "Client"}
                    </p>
                  </div>
                </div>
              )}
              {!sidebarOpen && (
                <div className="h-10 w-10 rounded-lg bg-info/20 flex items-center justify-center mx-auto">
                  <Building2 className="h-6 w-6 text-info" />
                </div>
              )}
            </div>
          </div>

          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-16 h-6 w-6 rounded-full border bg-background shadow-sm hover:bg-muted z-10"
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative group",
                    active
                      ? "bg-info text-info-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                  {!sidebarOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground rounded-md shadow-md text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-muted-foreground hover:text-foreground",
                !sidebarOpen && "justify-center px-0"
              )}
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route index element={<ClientHome />} />
          <Route path="candidates" element={<CandidatesPage />} />
          <Route path="candidates/:id" element={<CandidateProfileView />} />
          <Route path="folders" element={<ClientFoldersManagement />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="settings" element={<ClientSettings />} />
        </Routes>
      </main>
    </div>
  );
};

export default ClientDashboard;
