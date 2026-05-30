export type DashboardNavItem = {
  path: string;
  exact?: boolean;
  /** When set, only these paths match (for sibling routes under a parent prefix). */
  matchOnly?: string[];
};

/**
 * Sidebar active state — avoids highlighting both "Resume Search" and "Bulk CV upload"
 * when pathname is /applicants/bulk-resumes (prefix match on /applicants).
 */
export function isDashboardNavActive(pathname: string, item: DashboardNavItem): boolean {
  if (item.matchOnly?.length) {
    return item.matchOnly.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`)
    );
  }

  if (item.exact) {
    return pathname === item.path;
  }

  if (item.path === "/dashboard/admin/applicants") {
    return pathname === "/dashboard/admin/applicants";
  }

  if (item.path === "/dashboard/admin/applicants/bulk-resumes") {
    return (
      pathname === "/dashboard/admin/applicants/bulk-resumes" ||
      pathname.startsWith("/dashboard/admin/applicants/bulk-resumes/")
    );
  }

  if (item.path === "/dashboard/client/candidates") {
    return pathname === "/dashboard/client/candidates";
  }

  if (item.path === "/dashboard/applicant") {
    return pathname === "/dashboard/applicant";
  }

  return pathname === item.path || pathname.startsWith(`${item.path}/`);
}
