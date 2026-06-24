import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { isDashboardNavActive, type DashboardNavItem } from "@/lib/dashboardNav";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brand/BrandLogo";
import type { LucideIcon } from "lucide-react";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";

export type AdminNavItem = DashboardNavItem & {
  label: string;
  icon: LucideIcon;
};

export type AdminNavSection = {
  label: string;
  items: AdminNavItem[];
};

export type AdminShellProps = {
  navSections: AdminNavSection[];
  settingsPath: string;
  onLogout: () => void | Promise<void>;
  displayName: string;
  email?: string;
  initials: string;
  children: ReactNode;
};

function Breadcrumb({ pathname }: { pathname: string }) {
  const segments = pathname.replace("/dashboard/admin", "").split("/").filter(Boolean);
  const labels: Record<string, string> = {
    applicants: "Candidates",
    "bulk-resumes": "Bulk CV Upload",
    import: "Import Data",
    folders: "Folders",
    jobs: "Jobs",
    reports: "Reports",
    clients: "Clients",
    settings: "Settings",
    "audit-log": "Audit Log",
    messages: "Messages",
  };

  if (segments.length === 0) {
    return <span className="text-sm font-medium text-slate-700">Dashboard</span>;
  }

  return (
    <nav className="flex items-center gap-1.5 text-sm text-slate-500">
      <Link to="/dashboard/admin" className="hover:text-slate-700">
        Dashboard
      </Link>
      {segments.map((seg, i) => (
        <span key={seg} className="flex items-center gap-1.5">
          <span>/</span>
          <span className={i === segments.length - 1 ? "font-medium text-slate-700" : ""}>
            {labels[seg] ?? seg}
          </span>
        </span>
      ))}
    </nav>
  );
}

export function AdminShell({
  navSections,
  settingsPath,
  onLogout,
  displayName,
  email,
  initials,
  children,
}: AdminShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const flatNav = useMemo(() => navSections.flatMap((s) => s.items), [navSections]);

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/dashboard/admin/applicants?q=${encodeURIComponent(q)}` : "/dashboard/admin/applicants");
  };

  const renderNavLink = (item: AdminNavItem, inMobile = false) => {
    const Icon = item.icon;
    const active = isDashboardNavActive(location.pathname, item);
    const iconOnly = collapsed && !inMobile;

    return (
      <Link
        key={item.path}
        to={item.path}
        title={iconOnly ? item.label : undefined}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          iconOnly && "justify-center px-2",
          active
            ? "bg-slate-800 text-white"
            : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
        )}
      >
        <Icon className="h-[18px] w-[18px] shrink-0" />
        {!iconOnly && <span className="truncate">{item.label}</span>}
      </Link>
    );
  };

  const SidebarBody = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex h-full flex-col bg-slate-900 text-slate-100">
      <div
        className={cn(
          "flex h-16 shrink-0 items-center gap-3 border-b border-slate-800 px-4",
          collapsed && !mobile && "justify-center px-2"
        )}
      >
        {collapsed && !mobile ? (
          <BrandLogo size="sm" markOnly />
        ) : (
          <div className="min-w-0">
            <BrandLogo size="sm" />
            <p className="truncate text-[10px] text-slate-400">Admin Console</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {navSections.map((section) => (
          <div key={section.label} className="space-y-1">
            {(!collapsed || mobile) && (
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {section.label}
              </p>
            )}
            {section.items.map((item) => renderNavLink(item, mobile))}
          </div>
        ))}
      </nav>

      {!mobile && (
        <div className="border-t border-slate-800 p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed((c) => !c)}
            className="w-full justify-center text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col transition-[width] duration-200 md:flex",
          collapsed ? "w-16" : "w-[260px]"
        )}
      >
        <SidebarBody />
      </aside>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[min(88vw,280px)] gap-0 p-0">
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-300"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
          <SidebarBody mobile />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="hidden min-w-0 sm:block">
            <Breadcrumb pathname={location.pathname} />
          </div>

          <form onSubmit={handleGlobalSearch} className="ml-auto flex max-w-md flex-1 items-center gap-2">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidates..."
                className="h-9 pl-9 text-sm"
              />
            </div>
          </form>

          <NotificationBell />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-2 px-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                  {initials}
                </div>
                <span className="hidden max-w-[120px] truncate text-sm font-medium md:inline">{displayName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2">
                <p className="text-sm font-medium">{displayName}</p>
                {email && <p className="text-xs text-muted-foreground truncate">{email}</p>}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(settingsPath)}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(settingsPath)}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => void onLogout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
