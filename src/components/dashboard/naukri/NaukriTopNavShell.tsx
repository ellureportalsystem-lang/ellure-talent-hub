import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { EllureBrandLogo } from "@/components/auth/EllureBrandLogo";
import { cn } from "@/lib/utils";
import { Bookmark, Clock, LogOut, Menu, Search, Settings, User, X } from "lucide-react";
import {
  adminNavMenus,
  candidateNavMenus,
  NAUKRI_NAV_HEIGHT,
  NAUKRI_NAV_WRAP,
  NAUKRI_PAGE_BG,
  recruiterNavMenus,
  type NaukriNavMenuLink,
} from "./naukriShellStyles";
import { NaukriPrimaryNav } from "./NaukriPrimaryNav";
import { NaukriTalentCloudButton, NaukriMegaMenu } from "./NaukriMegaMenu";

export type NaukriNavItem = {
  label: string;
  path: string;
  exact?: boolean;
  matchPrefix?: string;
};

export type NaukriTopNavShellProps = {
  portalLabel: string;
  primaryNav: readonly NaukriNavItem[];
  settingsPath: string;
  onLogout: () => void | Promise<void>;
  displayName: string;
  email?: string;
  initials: string;
  children: ReactNode;
  headerBadge?: ReactNode;
  globalSearchPath?: string;
  globalSearchPlaceholder?: string;
  subNav?: ReactNode;
  megaMenuPortal?: "recruiter" | "admin" | "candidate";
  savedJobsPath?: string;
  hideRecentButton?: boolean;
};

function navMenusForPortal(portal?: "recruiter" | "admin" | "candidate"): Record<string, NaukriNavMenuLink[]> {
  if (portal === "recruiter") return recruiterNavMenus;
  if (portal === "admin") return adminNavMenus;
  if (portal === "candidate") return candidateNavMenus;
  return {};
}

export function NaukriTopNavShell({
  portalLabel,
  primaryNav,
  settingsPath,
  onLogout,
  displayName,
  email,
  initials,
  children,
  headerBadge,
  globalSearchPath,
  globalSearchPlaceholder = "Search",
  subNav,
  megaMenuPortal,
  savedJobsPath,
  hideRecentButton,
}: NaukriTopNavShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navMenus = navMenusForPortal(megaMenuPortal);
  const homePath = primaryNav[0]?.path ?? "/";

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!globalSearchPath) return;
    const q = searchQuery.trim();
    navigate(q ? `${globalSearchPath}?q=${encodeURIComponent(q)}` : globalSearchPath);
  };

  return (
    <div className={cn("naukri-portal flex min-h-screen flex-col text-sm text-[#333]", NAUKRI_PAGE_BG)}>
      <header className="sticky top-0 z-40 border-b border-[#e8e8e8] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className={NAUKRI_NAV_WRAP}>
          <div
            className={cn(
              "grid w-full items-center gap-x-2 sm:gap-x-4 lg:gap-x-6",
              NAUKRI_NAV_HEIGHT,
              "grid-cols-[auto_minmax(0,1fr)_auto]"
            )}
          >
            {/* Left — logo pinned to corner */}
            <div className="flex min-w-0 items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 lg:hidden h-9 w-9"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5 text-[#333]" />
              </Button>
              <EllureBrandLogo to={homePath} variant="nav" className="min-w-0" />
            </div>

            {/* Center — primary nav links */}
            <div className="hidden min-w-0 lg:block">
              <div className="flex h-14 items-stretch overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <NaukriPrimaryNav primaryNav={primaryNav} navMenus={navMenus} />
              </div>
            </div>

            {/* Right — utilities */}
            <div className="flex shrink-0 items-center justify-end gap-0.5 sm:gap-1 xl:gap-2">
              {headerBadge && (
                <div className="hidden 2xl:block shrink-0">{headerBadge}</div>
              )}

              {!hideRecentButton && (
              <Button
                variant="ghost"
                size="sm"
                className="hidden h-9 shrink-0 px-2 text-xs text-[#666] xl:inline-flex gap-1.5 hover:text-[#0566CD]"
                onClick={() =>
                  navigate(primaryNav.find((n) => n.label.includes("Resdex"))?.path ?? homePath)
                }
              >
                <Clock className="h-3.5 w-3.5" />
                <span className="hidden 2xl:inline">Recent</span>
              </Button>
              )}

              {globalSearchPath && (
                <form onSubmit={handleSearch} className="hidden shrink-0 md:block">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#999]" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={globalSearchPlaceholder}
                      className="h-9 w-28 lg:w-32 xl:w-40 pl-8 text-xs border-[#e8e8e8] bg-white rounded focus-visible:ring-[#0566CD]"
                    />
                  </div>
                </form>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 hidden lg:inline-flex hover:text-[#0566CD]"
                aria-label="Saved jobs"
                onClick={() => savedJobsPath && navigate(savedJobsPath)}
              >
                <Bookmark className="h-4 w-4 text-[#666]" />
              </Button>

              <div className="shrink-0">
                <NotificationBell />
              </div>

              {megaMenuPortal === "recruiter" && <NaukriTalentCloudButton />}
              {megaMenuPortal === "admin" && <NaukriMegaMenu portal="admin" />}
              {megaMenuPortal === "candidate" && <NaukriMegaMenu portal="candidate" />}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 shrink-0 gap-2 px-1 hover:bg-[#f4f5f7]">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0566CD] text-[10px] font-bold text-white">
                      {initials}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-[#e8e8e8]">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-[#333]">{displayName}</p>
                    {email && <p className="text-xs text-[#666] truncate">{email}</p>}
                    <p className="text-[10px] text-[#999] mt-0.5">{portalLabel} · Ellure TalentHub</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(settingsPath)} className="text-sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(settingsPath)} className="text-sm">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive text-sm"
                    onClick={() => void onLogout()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {subNav && (
          <div className="border-t border-[#f0f0f0] bg-white">
            <div className={NAUKRI_NAV_WRAP}>{subNav}</div>
          </div>
        )}
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[min(88vw,300px)] p-0 bg-white">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#f4f5f7]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="border-b border-[#e8e8e8] px-4 py-4 pt-5">
            <EllureBrandLogo to={homePath} size="sm" portalLabel={portalLabel} />
            <p className="mt-3 text-sm font-medium text-[#333]">{displayName}</p>
            {email && <p className="text-xs text-[#666] truncate">{email}</p>}
          </div>
          <NaukriPrimaryNav primaryNav={primaryNav} navMenus={navMenus} mobile />
        </SheetContent>
      </Sheet>

      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
