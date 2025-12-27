import { useState } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, Users, Briefcase, MessageSquare, 
  Settings, LogOut, Building2, FolderKanban, Bell, Menu, X, ChevronDown
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth/login");
  };

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

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col w-full">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Logo */}
          <Link to="/dashboard/client" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-info flex items-center justify-center">
              <Building2 className="h-5 w-5 text-info-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-foreground leading-tight">Client Portal</h1>
              <p className="text-[10px] text-muted-foreground">Ellure NexHire</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-info text-info-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant={active ? "secondary" : "destructive"} 
                      className={cn(
                        "text-[10px] px-1.5 py-0",
                        active && "bg-info-foreground/20 text-info-foreground border-0"
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
              >
                5
              </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <div className="h-8 w-8 rounded-full bg-info/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-info">
                      {profile?.email?.[0]?.toUpperCase() || "C"}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium leading-tight">Client</p>
                    <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                      {profile?.email || "client@company.com"}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">Client Account</p>
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

            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t bg-card px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    active
                      ? "bg-info text-info-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
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
                </Link>
              );
            })}
          </nav>
        )}
      </header>

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
