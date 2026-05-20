import { useState } from "react";
import { Routes, Route, Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import {
  LayoutDashboard, Briefcase, FileText, Bookmark, Bell, LogOut, Menu, X, ChevronsLeft, MessageSquare, Eye,
  Settings as SettingsIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
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
import { Badge } from "@/components/ui/badge";

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
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayName = profile?.full_name || profile?.email?.split("@")[0] || "Applicant";
  const firstName = displayName.split(" ")[0];
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const pageTitle = navItems.find((n) => isActive(n.path, n.exact))?.label || "Applicant";

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn("flex flex-col h-full bg-[var(--surface-1)] border-r border-[var(--surface-border)]", collapsed && !mobile && "w-16", (!collapsed || mobile) && "w-[260px]")}>
      <div className="h-16 flex items-center gap-3 px-4 border-b border-[var(--surface-border)]">
        <img src="/ellure-logo.png" alt="" className="h-9 w-9" />
        {(!collapsed || mobile) && (
          <div className="leading-tight">
            <span className="text-sm font-bold block">Ellure NexHire</span>
            <span className="text-[10px] text-muted-foreground">Applicant</span>
          </div>
        )}
      </div>
      <nav className="flex-1 p-3 space-y-1">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-3 mb-2">Main Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path, item.exact);
          return (
              <Link key={item.path} to={item.path} onClick={() => mobile && setMobileOpen(false)}
              className={cn("flex items-center gap-3 h-10 px-3 rounded-lg text-sm font-medium transition-colors",
                active ? "bg-primary text-primary-foreground" : "hover:bg-[var(--surface-2)] text-[var(--text-secondary)]")}>
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {(!collapsed || mobile) && (
                <span className="flex-1 flex items-center justify-between gap-2 min-w-0">
                  <span className="truncate">{item.label}</span>
                  {item.path.includes("/messages") && unreadTotal > 0 && (
                    <Badge variant="destructive" className="h-5 min-w-5 px-1 justify-center text-[10px] shrink-0">
                      {unreadTotal > 99 ? "99+" : unreadTotal}
                    </Badge>
                  )}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[var(--surface-border)] space-y-3">
        {(!collapsed || mobile) && <p className="text-xs text-muted-foreground">Hi, {firstName}</p>}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold">{initials}</div>
          {(!collapsed || mobile) && <span className="text-sm truncate flex-1">{displayName}</span>}
        </div>
        <div className="flex gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={async () => { await signOut(); navigate("/auth/applicant"); }}><LogOut className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[var(--surface-2)]">
      <aside className="hidden lg:block sticky top-0 h-screen shrink-0 relative">
        <Sidebar />
        <button type="button" className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background shadow-sm flex items-center justify-center" onClick={() => setCollapsed(!collapsed)}>
          <ChevronsLeft className={cn("h-3 w-3 transition-transform", collapsed && "rotate-180")} />
        </button>
      </aside>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-10"><Sidebar mobile /></aside>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[60px] sticky top-0 z-40 flex items-center justify-between px-4 lg:px-6 bg-[var(--surface-1)] border-b border-[var(--surface-border)]">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}><Menu className="h-5 w-5" /></Button>
            <h1 className="text-lg font-semibold">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
          </div>
        </header>
        <main className="flex-1 min-h-0 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
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
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default ApplicantPortal;
