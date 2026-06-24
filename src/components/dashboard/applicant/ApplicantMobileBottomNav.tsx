import { Link, useLocation } from "react-router-dom";
import { Briefcase, FileText, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/dashboard/applicant", label: "Profile", icon: User, exact: true },
  { to: "/dashboard/applicant/jobs", label: "Jobs", icon: Briefcase },
  { to: "/dashboard/applicant/applications", label: "Apps", icon: FileText },
  { to: "/dashboard/applicant/messages", label: "Inbox", icon: MessageSquare },
] as const;

export function ApplicantMobileBottomNav() {
  const location = useLocation();

  const isActive = (to: string, exact?: boolean) => {
    if (exact) return location.pathname === to;
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#e8e8e8] bg-white lg:hidden safe-area-pb"
      aria-label="Applicant navigation"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around">
        {ITEMS.map(({ to, label, icon: Icon, exact }) => {
          const active = isActive(to, exact);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-[10px] font-medium transition-colors",
                active ? "text-[#0566CD]" : "text-[#666]"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "stroke-[2.5px]")} />
              <span>{label}</span>
              {active && <span className="h-0.5 w-6 rounded-full bg-[#e84444]" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
