import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { PortalBrand } from "@/components/portal/PortalBrand";
import {
  portalMobileNavLinkClass,
  portalNavGroupClass,
  portalNavLinkActive,
  portalNavLinkBase,
} from "@/components/portal/portalStyles";
import { isDashboardNavActive, type DashboardNavItem } from "@/lib/dashboardNav";
import {
  flattenPortalNavItems,
  getPortalOverflowNavItems,
} from "@/lib/portalMobileNav";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  ChevronDown,
  ChevronsLeft,
  LogOut,
  MoreHorizontal,
  Settings,
  X,
} from "lucide-react";

export type PortalNavItemConfig = DashboardNavItem & {
  label: string;
  icon: LucideIcon;
  badge?: string;
};

export type PortalNavSectionConfig = {
  label: string;
  items: PortalNavItemConfig[];
};

export type PortalRole = "admin" | "client" | "applicant";

export type PortalBottomNavItem = {
  path: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

export type PortalDashboardLayoutProps = {
  role: PortalRole;
  portalSuffix: string;
  portalTagline?: string;
  navSections?: PortalNavSectionConfig[];
  navItems?: PortalNavItemConfig[];
  bottomNavItems?: PortalBottomNavItem[];
  settingsPath: string;
  onLogout: () => void | Promise<void>;
  displayName: string;
  email?: string;
  initials: string;
  headerMode?: "greeting" | "title";
  headerTitle?: string;
  headerExtra?: ReactNode;
  showUserMenu?: boolean;
  animateMain?: boolean;
  unreadTotal?: number;
  children: ReactNode;
};

function isNavActive(pathname: string, item: DashboardNavItem): boolean {
  return isDashboardNavActive(pathname, item);
}

function hasUnread(item: PortalNavItemConfig, unreadTotal: number): boolean {
  return unreadTotal > 0 && (item.path.endsWith("/messages") || item.label === "Messages");
}

export function PortalDashboardLayout({
  role,
  portalSuffix,
  portalTagline,
  navSections,
  navItems,
  bottomNavItems,
  settingsPath,
  onLogout,
  displayName,
  email,
  initials,
  headerMode = "greeting",
  headerTitle,
  headerExtra,
  showUserMenu = true,
  animateMain = false,
  unreadTotal = 0,
  children,
}: PortalDashboardLayoutProps) {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [overflowSheetOpen, setOverflowSheetOpen] = useState(false);

  const firstName = displayName.split(" ")[0];
  const allNavItems = useMemo(
    () => flattenPortalNavItems(navSections, navItems),
    [navSections, navItems]
  );

  const pinnedPaths = useMemo(
    () => bottomNavItems?.map((item) => item.path) ?? [],
    [bottomNavItems]
  );

  const overflowNavItems = useMemo(
    () => getPortalOverflowNavItems(allNavItems, pinnedPaths),
    [allNavItems, pinnedPaths]
  );

  const showBottomNav = Boolean(bottomNavItems?.length);
  const showOverflowMenuTab = overflowNavItems.length > 0;

  useEffect(() => {
    setOverflowSheetOpen(false);
  }, [location.pathname]);

  const renderNavLink = (item: PortalNavItemConfig, mobile: boolean, inSheet = false) => {
    const Icon = item.icon;
    const active = isNavActive(location.pathname, item);
    const collapsed = sidebarCollapsed && !mobile && !inSheet;

    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={() => inSheet && setOverflowSheetOpen(false)}
        title={collapsed ? item.label : undefined}
        className={cn(
          portalNavLinkBase,
          inSheet && portalMobileNavLinkClass,
          collapsed && "justify-center px-2",
          active ? portalNavLinkActive : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
        )}
      >
        <Icon className={cn("h-[18px] w-[18px] shrink-0", active && "text-[hsl(var(--portal-accent))]")} />
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {item.badge ? (
              <Badge variant="outline" className="shrink-0 px-1.5 py-0 text-[10px]">
                {item.badge}
              </Badge>
            ) : null}
            {hasUnread(item, unreadTotal) ? (
              <Badge variant="destructive" className="h-5 min-w-5 shrink-0 justify-center px-1 text-[10px]">
                {unreadTotal > 99 ? "99+" : unreadTotal}
              </Badge>
            ) : null}
          </>
        )}
      </Link>
    );
  };

  const SidebarContent = ({ mobile = false, inSheet = false }: { mobile?: boolean; inSheet?: boolean }) => (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex h-16 shrink-0 items-center gap-3 px-4",
          sidebarCollapsed && !mobile && !inSheet && "justify-center px-2"
        )}
      >
        <img src="/ellure-logo.png" alt="" className="h-9 w-9 shrink-0 object-contain" />
        {(!sidebarCollapsed || mobile || inSheet) && (
          <PortalBrand portalSuffix={portalSuffix} tagline={portalTagline} size="sm" />
        )}
      </div>

      <Separator className="opacity-60" />

      <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
        {inSheet ? (
          overflowNavItems.length > 0 ? (
            <div className="space-y-1">
              <p className={cn(portalNavGroupClass, "mb-2")}>More</p>
              {overflowNavItems.map((item) => renderNavLink(item, true, true))}
            </div>
          ) : (
            <p className="px-3 text-sm text-muted-foreground">All sections are on the bar below.</p>
          )
        ) : (
          <>
            {navSections
              ? navSections.map((section) => (
                  <div key={section.label} className="space-y-1">
                    {(!sidebarCollapsed || mobile) && (
                      <p className={cn(portalNavGroupClass, "mb-1")}>{section.label}</p>
                    )}
                    {section.items.map((item) => renderNavLink(item, mobile))}
                  </div>
                ))
              : null}
            {navItems ? navItems.map((item) => renderNavLink(item, mobile)) : null}
          </>
        )}
      </nav>

      {!inSheet && (
        <div className="mt-auto space-y-2 px-3 pb-4">
          <ThemeToggle
            variant={sidebarCollapsed && !mobile ? "icon" : "sidebar"}
            usePortalTheme
          />
          <Separator className="opacity-60" />
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg p-2",
              sidebarCollapsed && !mobile && "justify-center"
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--portal-accent)/0.12)] ring-2 ring-[hsl(var(--portal-accent)/0.2)]">
              <span className="text-xs font-semibold text-[hsl(var(--portal-accent))]">{initials}</span>
            </div>
            {(!sidebarCollapsed || mobile) && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{displayName}</p>
                {email ? (
                  <p className="truncate text-[10px] text-muted-foreground">{email}</p>
                ) : null}
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            onClick={() => void onLogout()}
            className={cn(
              "w-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive max-md:h-11",
              sidebarCollapsed && !mobile ? "justify-center px-2" : "justify-start"
            )}
          >
            <LogOut className="h-4 w-4" />
            {(!sidebarCollapsed || mobile) && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      )}
    </div>
  );

  const mainContent = animateMain ? (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
      className="portal-animate-in min-h-0"
    >
      {children}
    </motion.div>
  ) : (
    <div className="portal-animate-in min-h-0">{children}</div>
  );

  const headerIconButtonClass =
    "touch-target h-11 w-11 min-h-[44px] min-w-[44px] md:h-9 md:w-9 md:min-h-0 md:min-w-0";

  return (
    <div
      className={cn(
        "portal-dashboard portal-shell-bg flex min-h-screen text-foreground",
        `portal-dashboard--${role}`
      )}
    >
      <aside
        className={cn(
          "portal-glass-sidebar relative sticky top-0 hidden h-screen shrink-0 flex-col transition-[width] duration-300 ease-out md:flex",
          sidebarCollapsed ? "w-20" : "w-[280px]"
        )}
      >
        <SidebarContent />
        <button
          type="button"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-colors hover:bg-muted"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronsLeft
            className={cn(
              "h-3.5 w-3.5 text-muted-foreground transition-transform",
              sidebarCollapsed && "rotate-180"
            )}
          />
        </button>
      </aside>

      <Sheet open={overflowSheetOpen} onOpenChange={setOverflowSheetOpen}>
        <SheetContent
          side="left"
          className="w-[min(88vw,320px)] gap-0 p-0 md:hidden"
        >
          <SheetTitle className="sr-only">More navigation</SheetTitle>
          <button
            type="button"
            onClick={() => setOverflowSheetOpen(false)}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-muted"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
          <SidebarContent mobile inSheet />
          <div className="border-t border-border px-3 py-4 md:hidden">
            <ThemeToggle variant="sidebar" usePortalTheme />
            <Button
              variant="ghost"
              className="mt-2 w-full max-md:h-11 text-muted-foreground hover:text-destructive"
              onClick={() => void onLogout()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden">
        <header
          className={cn(
            "portal-glass-header sticky top-0 z-40 px-4 pt-[env(safe-area-inset-top,0px)] md:px-6",
            headerExtra
              ? "grid grid-cols-[1fr_auto] gap-x-3 gap-y-2 py-3 md:flex md:min-h-16 md:items-center md:justify-between md:py-0"
              : "flex min-h-16 items-center justify-between gap-3"
          )}
        >
          <div className="flex min-w-0 items-center gap-2 md:gap-3">
            {headerMode === "title" ? (
              <h2 className="truncate text-lg font-semibold tracking-tight md:text-xl">
                {headerTitle}
              </h2>
            ) : (
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold tracking-[-0.02em] md:text-xl">
                  Hi, {firstName}
                </h2>
                <p className="hidden text-xs text-muted-foreground sm:block">
                  Welcome back to your workspace
                </p>
              </div>
            )}
          </div>

          {headerExtra ? (
            <div className="col-span-2 flex justify-center md:col-span-1 md:order-3 md:justify-end">
              {headerExtra}
            </div>
          ) : null}

          <div
            className={cn(
              "flex shrink-0 items-center gap-1 md:gap-2",
              headerExtra && "col-start-2 row-start-1"
            )}
          >
            <ThemeToggle usePortalTheme />
            <NotificationBell />
            {showUserMenu ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={cn("gap-2 px-2", headerIconButtonClass)}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--portal-accent)/0.12)] ring-2 ring-[hsl(var(--portal-accent)/0.2)]">
                      <span className="text-xs font-semibold text-[hsl(var(--portal-accent))]">
                        {initials}
                      </span>
                    </div>
                    <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground lg:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 max-md:max-h-[85dvh] overflow-y-auto">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{displayName}</p>
                    {email ? (
                      <p className="truncate text-xs text-muted-foreground">{email}</p>
                    ) : null}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={settingsPath} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => void onLogout()}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </header>

        <main
          className={cn(
            "min-h-0 flex-1 overflow-auto",
            showBottomNav
              ? "pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-6"
              : "md:pb-6"
          )}
        >
          {mainContent}
        </main>

        {showBottomNav && bottomNavItems ? (
          <nav
            className="portal-bottom-nav fixed inset-x-0 bottom-0 z-40 md:hidden"
            aria-label="Primary"
          >
            <div className="flex items-stretch justify-around border-t border-border bg-card/95 px-1 pt-1 backdrop-blur-md">
              {bottomNavItems.map((item) => {
                const Icon = item.icon;
                const active = isNavActive(location.pathname, item);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "portal-bottom-nav-item touch-target relative flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-medium active:scale-95 transition-transform",
                      active ? "text-[hsl(var(--portal-accent))]" : "text-muted-foreground"
                    )}
                  >
                    <Icon className={cn("h-5 w-5 shrink-0", active && "stroke-[2.25]")} />
                    <span className="max-w-[4.5rem] truncate">{item.label}</span>
                  </Link>
                );
              })}
              {showOverflowMenuTab ? (
                <button
                  type="button"
                  onClick={() => setOverflowSheetOpen(true)}
                  aria-label="Open menu"
                  className="portal-bottom-nav-item touch-target relative flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-medium text-muted-foreground active:scale-95 transition-transform"
                >
                  <MoreHorizontal className="h-5 w-5" />
                  <span className="max-w-[4.5rem] truncate">Menu</span>
                </button>
              ) : null}
            </div>
          </nav>
        ) : null}
      </div>
    </div>
  );
}
