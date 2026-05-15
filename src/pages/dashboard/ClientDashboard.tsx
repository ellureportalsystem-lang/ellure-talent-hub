import { useState } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, Users, Briefcase, MessageSquare,
  Settings, LogOut, Building2, FolderKanban, Bell, Menu, X,
  ChevronDown, ChevronsLeft,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth/login");
  };

  const displayName = profile?.full_name || profile?.display_name || profile?.email?.split("@")[0] || "Client";
  const firstName = displayName.split(" ")[0];
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const navItems = [
    { path: "/dashboard/client", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { path: "/dashboard/client/candidates", label: "Candidates", icon: Users },
    { path: "/dashboard/client/folders", label: "My Shortlists", icon: FolderKanban },
    { path: "/dashboard/client/jobs", label: "Jobs", icon: Briefcase },
    { path: "/dashboard/client/messages", label: "Messages", icon: MessageSquare, badge: "2" },
    { path: "/dashboard/client/settings", label: "Settings", icon: Settings },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 h-16 flex-shrink-0", sidebarCollapsed && !mobile && "justify-center px-2")}>
        <img src="/ellure-logo.png" alt="Ellure NexHire" className="h-9 w-9 object-contain flex-shrink-0" />
        {(!sidebarCollapsed || mobile) && (
          <div className="overflow-hidden">
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-foreground whitespace-nowrap">Ellure</span>
              <span className="text-sm font-bold text-primary -mt-0.5 whitespace-nowrap">NexHire</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Client Portal</p>
          </div>
        )}
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path, item.exact);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => mobile && setMobileMenuOpen(false)}
              title={sidebarCollapsed && !mobile ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                sidebarCollapsed && !mobile && "justify-center px-2",
                active
                  ? "bg-info text-info-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className={cn("h-[18px] w-[18px] flex-shrink-0", active && "text-info-foreground")} />
              {(!sidebarCollapsed || mobile) && (
                <>
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <Badge
                      variant={active ? "secondary" : "destructive"}
                      className={cn(
                        "text-[10px] px-1.5 py-0 ml-auto",
                        active && "bg-info-foreground/20 text-info-foreground border-0"
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto px-3 pb-4 space-y-2">
        <ThemeToggle variant={sidebarCollapsed && !mobile ? "icon" : "sidebar"} />

        <Separator />

        <div className={cn(
          "flex items-center gap-3 p-2 rounded-lg",
          sidebarCollapsed && !mobile && "justify-center"
        )}>
          <div className="h-9 w-9 rounded-full bg-info/10 flex items-center justify-center flex-shrink-0 ring-2 ring-info/20">
            <span className="text-xs font-semibold text-info">{initials}</span>
          </div>
          {(!sidebarCollapsed || mobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-[10px] text-muted-foreground truncate">{profile?.email || "client@company.com"}</p>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10",
            sidebarCollapsed && !mobile ? "justify-center px-2" : "justify-start"
          )}
        >
          <LogOut className="h-4 w-4" />
          {(!sidebarCollapsed || mobile) && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r bg-card/50 backdrop-blur-sm transition-all duration-300 h-screen sticky top-0",
          sidebarCollapsed ? "w-[68px]" : "w-[260px]"
        )}
      >
        <SidebarContent />

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-card shadow-sm flex items-center justify-center hover:bg-muted transition-colors z-10"
        >
          <ChevronsLeft className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", sidebarCollapsed && "rotate-180")} />
        </button>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-[280px] bg-card shadow-xl h-full overflow-y-auto">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-muted flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent mobile />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-40 h-16 border-b bg-card/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Hi, {firstName}
              </h2>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Welcome to your client portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-[18px] w-[18px] text-muted-foreground" />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                5
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2 h-9">
                  <div className="h-8 w-8 rounded-full bg-info/10 flex items-center justify-center ring-2 ring-info/20">
                    <span className="text-xs font-semibold text-info">{initials}</span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden md:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {profile?.email || "client@company.com"}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/client/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
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
    </div>
  );
};

export default ClientDashboard;
