import { useState } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, Users, Briefcase, MessageSquare, 
  Settings, LogOut, Building2 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

// Import client pages
import ClientHome from "./client/ClientHome";
import CandidatesPage from "./client/CandidatesPage";
import CandidateProfileView from "./client/CandidateProfileView";
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
    { path: "/dashboard/client", label: "Home", icon: LayoutDashboard },
    { path: "/dashboard/client/candidates", label: "Candidates", icon: Users },
    { path: "/dashboard/client/jobs", label: "Jobs", icon: Briefcase },
    { path: "/dashboard/client/messages", label: "Messages", icon: MessageSquare },
    { path: "/dashboard/client/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle flex">
      {/* Sidebar */}
      <aside className={cn(
        "bg-background border-r transition-all duration-300",
        sidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="flex flex-col h-screen">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-8 w-8 rounded-lg bg-info/20 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-info" />
                    </div>
                    <h1 className="text-lg font-bold">Client Portal</h1>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {profile?.email || "Client"}
                  </p>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="ml-auto"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {sidebarOpen ? (
                    <path d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  ) : (
                    <path d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  )}
                </svg>
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path !== "/dashboard/client" && location.pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-info text-info-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              {sidebarOpen && <span>Logout</span>}
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
          <Route path="jobs" element={<JobsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="settings" element={<ClientSettings />} />
        </Routes>
      </main>
    </div>
  );
};

export default ClientDashboard;
