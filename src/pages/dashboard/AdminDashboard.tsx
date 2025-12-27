import { useState } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, Users, FolderOpen, FileText, 
  Settings, UserCog, LogOut, BarChart3, Search, Briefcase,
  Bell, Menu, X, ChevronDown
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth/login");
  };

  const navItems = [
    { path: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { path: "/dashboard/admin/applicants", label: "Resume Search", icon: Search, badge: "AI" },
    { path: "/dashboard/admin/folders", label: "Folders", icon: FolderOpen },
    { path: "/dashboard/admin/jobs", label: "Jobs", icon: Briefcase },
    { path: "/dashboard/admin/reports", label: "Reports", icon: BarChart3 },
    { path: "/dashboard/admin/users", label: "Users", icon: UserCog },
    { path: "/dashboard/admin/settings", label: "Settings", icon: Settings },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Logo */}
          <Link to="/dashboard/admin" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">E</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-foreground leading-tight">Ellure NexHire</h1>
              <p className="text-[10px] text-muted-foreground">Admin Portal</p>
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
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant={active ? "secondary" : "outline"} 
                      className={cn(
                        "text-[10px] px-1.5 py-0",
                        active && "bg-primary-foreground/20 text-primary-foreground border-0"
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
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {profile?.email?.[0]?.toUpperCase() || "A"}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium leading-tight">Administrator</p>
                    <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                      {profile?.email || "admin@ellure.com"}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">Administrator</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {profile?.email || "admin@ellure.com"}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/admin/settings" className="cursor-pointer">
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
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant={active ? "secondary" : "outline"} 
                      className={cn(
                        "text-[10px] px-1.5 py-0 ml-auto",
                        active && "bg-primary-foreground/20 text-primary-foreground border-0"
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
