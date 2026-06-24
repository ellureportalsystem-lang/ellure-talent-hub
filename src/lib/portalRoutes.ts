/** Canonical portal entry paths — single source of truth */

export const PORTAL_ROUTES = {
  hub: "/login",
  candidate: {
    login: "/candidate/login",
    register: "/candidate/register",
    dashboard: "/dashboard/applicant",
    legacyLogin: "/auth/login",
    legacyApplicant: "/auth/applicant",
  },
  recruiter: {
    login: "/recruiter/login",
    signup: "/recruiter/signup",
    dashboard: "/dashboard/client",
    legacyLogin: "/client/auth/login",
    legacySignup: "/client/auth/signup",
    shortcut: "/recruiter",
  },
  admin: {
    login: "/admin/login",
    signup: "/admin/signup",
    dashboard: "/dashboard/admin",
    legacyLogin: "/admin/auth/login",
    legacySignup: "/admin/auth/signup",
    shortcut: "/admin",
  },
} as const;

export const LOGIN_BY_ROLE: Record<"applicant" | "admin" | "client", string> = {
  applicant: PORTAL_ROUTES.candidate.login,
  client: PORTAL_ROUTES.recruiter.login,
  admin: PORTAL_ROUTES.admin.login,
};

export const DASHBOARD_BY_ROLE: Record<"applicant" | "admin" | "client", string> = {
  applicant: PORTAL_ROUTES.candidate.dashboard,
  client: PORTAL_ROUTES.recruiter.dashboard,
  admin: PORTAL_ROUTES.admin.dashboard,
};

export function loginPathForDashboard(pathname: string): string {
  if (pathname.startsWith("/dashboard/admin")) return PORTAL_ROUTES.admin.login;
  if (pathname.startsWith("/dashboard/client")) return PORTAL_ROUTES.recruiter.login;
  return PORTAL_ROUTES.candidate.login;
}
