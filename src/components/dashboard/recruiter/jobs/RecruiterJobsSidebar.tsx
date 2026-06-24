import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const JOBS_LINKS = [
  { label: "Post a Hot Vacancy", path: "/dashboard/client/jobs/post?type=hot" },
  { label: "Post an Internship", path: "/dashboard/client/jobs/post?type=internship" },
  { label: "Manage Jobs & Responses", path: "/dashboard/client/jobs/responses" },
  { label: "All Jobs", path: "/dashboard/client/jobs" },
] as const;

/** Jobs area sidebar — jobs only (ResDex lives in top nav hover menu). */
export function RecruiterJobsSidebar() {
  const location = useLocation();

  return (
    <aside className="w-[220px] shrink-0 border-r border-slate-200 bg-white hidden lg:block">
      <nav className="py-3">
        <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Jobs & Responses
        </p>
        <ul className="pb-2">
          {JOBS_LINKS.map((link) => {
            const active =
              location.pathname === link.path ||
              (link.path.includes("responses") && location.pathname.includes("/jobs/responses")) ||
              (link.path.endsWith("/jobs") && location.pathname === "/dashboard/client/jobs");
            return (
              <li key={link.label}>
                <Link
                  to={link.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm",
                    active
                      ? "text-[#0566CD] bg-blue-50/50 font-medium"
                      : "text-slate-700 hover:text-[#0566CD] hover:bg-slate-50"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
