/** Naukri-inspired portal chrome tokens (light theme) */



export const NAUKRI_NAV_HEIGHT = "h-14";

export const NAUKRI_PAGE_BG = "bg-[#f4f5f7]";

export const NAUKRI_CARD_BG = "bg-white";

export const NAUKRI_PRIMARY = "#0566CD";

export const NAUKRI_PRIMARY_HOVER = "#0066c0";

export const NAUKRI_ACTIVE_BORDER = "border-[#e84444]";

export const NAUKRI_BORDER = "border-[#e8e8e8]";

export const NAUKRI_TEXT = "text-[#333]";

export const NAUKRI_TEXT_MUTED = "text-[#666]";



/** Naukri recruiter content width (~1180px) */

export const NAUKRI_CONTENT_MAX = "max-w-[1180px]";

export const NAUKRI_CONTENT_WRAP = `mx-auto w-full ${NAUKRI_CONTENT_MAX} px-4`;

/** Dashboard top nav — full width with edge padding (Naukri-style) */
export const NAUKRI_NAV_WRAP = "w-full px-4 sm:px-6 lg:px-8";



export const naukriCardClass =

  "rounded border border-[#e8e8e8] bg-white text-[#333] shadow-[0_1px_4px_rgba(0,0,0,0.06)]";



export const naukriButtonPrimary =

  "bg-[#0566CD] text-white hover:bg-[#0066c0] rounded text-sm font-medium h-9 px-4";



export const naukriButtonOutline =

  "border border-[#0566CD] text-[#0566CD] bg-white hover:bg-[#f0f7ff] rounded text-sm font-medium h-9 px-4";



export const naukriNavLinkClass =
  "relative inline-flex h-14 shrink-0 items-center whitespace-nowrap px-2 lg:px-2.5 xl:px-3 text-[13px] font-medium text-[#333] transition-colors hover:text-[#0566CD]";

export const naukriNavLinkActiveClass =
  "text-[#0566CD] after:absolute after:bottom-0 after:left-2 after:right-2 lg:after:left-2.5 lg:after:right-2.5 after:h-[2px] after:bg-[#e84444] after:content-['']";



export type NaukriNavMenuLink = { label: string; to: string; description?: string };



export const recruiterPrimaryNav = [

  { label: "Home", path: "/dashboard/client", exact: true },

  { label: "Jobs & Responses", path: "/dashboard/client/jobs", matchPrefix: "/dashboard/client/jobs" },

  { label: "Resdex", path: "/dashboard/client/resdex", matchPrefix: "/dashboard/client/resdex" },

  { label: "Reports", path: "/dashboard/client/reports", matchPrefix: "/dashboard/client/reports" },

] as const;



export const recruiterNavMenus: Record<string, NaukriNavMenuLink[]> = {

  "Jobs & Responses": [

    { label: "Post a Hot Vacancy", to: "/dashboard/client/jobs/post?type=hot" },

    { label: "Post a SMB Job", to: "/dashboard/client/jobs/post?type=smb" },

    { label: "Post an Internship", to: "/dashboard/client/jobs/post?type=internship" },

    { label: "Manage Jobs & Responses", to: "/dashboard/client/jobs/responses" },

  ],

  Resdex: [

    { label: "Search Candidates", to: "/dashboard/client/resdex" },

    { label: "Search Results", to: "/dashboard/client/resdex/results" },

    { label: "Send NVite", to: "/dashboard/client/nvite", description: "Email via Resend (configure in Supabase secrets)" },

    { label: "NVite Campaigns", to: "/dashboard/client/nvite/campaigns" },

  ],

  Reports: [

    { label: "Hiring Reports", to: "/dashboard/client/reports" },

    { label: "Resdex Usage", to: "/dashboard/client/reports" },

    { label: "Export History", to: "/dashboard/client/reports" },

  ],

};



export const candidatePrimaryNav = [

  { label: "Profile", path: "/dashboard/applicant", exact: true, matchPrefix: "/dashboard/applicant/profile" },

  { label: "Jobs", path: "/dashboard/applicant/jobs", matchPrefix: "/dashboard/applicant/jobs" },

  { label: "Applications", path: "/dashboard/applicant/applications", matchPrefix: "/dashboard/applicant/applications" },

  { label: "Messages", path: "/dashboard/applicant/messages", matchPrefix: "/dashboard/applicant/messages" },

] as const;



export const candidateNavMenus: Record<string, NaukriNavMenuLink[]> = {

  Jobs: [

    { label: "Browse Jobs", to: "/dashboard/applicant/jobs" },

    { label: "Saved Jobs", to: "/dashboard/applicant/saved-jobs" },

    { label: "Job Alerts", to: "/dashboard/applicant/job-alerts" },

  ],

  Applications: [

    { label: "My Applications", to: "/dashboard/applicant/applications" },

    { label: "Profile Views", to: "/dashboard/applicant/profile-views" },

  ],

  Profile: [

    { label: "View Profile", to: "/dashboard/applicant" },

    { label: "Update Profile", to: "/dashboard/applicant/profile/edit" },

    { label: "Resume", to: "/dashboard/applicant/profile/edit#resume" },

    { label: "Settings", to: "/dashboard/applicant/settings" },

  ],

};



export const adminPrimaryNav = [

  { label: "Dashboard", path: "/dashboard/admin", exact: true },

  { label: "Candidates", path: "/dashboard/admin/applicants", matchPrefix: "/dashboard/admin/applicants" },

  { label: "Data", path: "/dashboard/admin/data/import", matchPrefix: "/dashboard/admin/data" },

  { label: "Recruiters", path: "/dashboard/admin/recruiters", matchPrefix: "/dashboard/admin/recruiters" },

  { label: "Content", path: "/dashboard/admin/content", matchPrefix: "/dashboard/admin/content" },

  { label: "Subscriptions", path: "/dashboard/admin/subscriptions", matchPrefix: "/dashboard/admin/subscriptions" },

  { label: "Analytics", path: "/dashboard/admin/analytics", matchPrefix: "/dashboard/admin/analytics" },

  { label: "Audit", path: "/dashboard/admin/audit-log", matchPrefix: "/dashboard/admin/audit-log" },

] as const;



export const adminNavMenus: Record<string, NaukriNavMenuLink[]> = {

  Candidates: [

    { label: "Search ResDex", to: "/dashboard/admin/applicants" },

    { label: "Import Excel", to: "/dashboard/admin/data/import" },

    { label: "Bulk Resumes", to: "/dashboard/admin/data/bulk-resumes" },

  ],

  Data: [

    { label: "Import Excel", to: "/dashboard/admin/data/import" },

    { label: "Bulk Resumes", to: "/dashboard/admin/data/bulk-resumes" },

  ],

  Recruiters: [

    { label: "All Recruiters", to: "/dashboard/admin/recruiters" },

    { label: "Pending Approvals", to: "/dashboard/admin/recruiters?status=pending" },

    { label: "Users & roles", to: "/dashboard/admin/users" },

  ],

  Content: [

    { label: "Banners & FAQs", to: "/dashboard/admin/content" },

  ],

  Subscriptions: [

    { label: "Subscription plans", to: "/dashboard/admin/subscriptions" },

  ],

  Analytics: [

    { label: "Platform Analytics", to: "/dashboard/admin/analytics" },

    { label: "Reports", to: "/dashboard/admin/analytics" },

  ],

  Audit: [

    { label: "Audit Log", to: "/dashboard/admin/audit-log" },

    { label: "Messages", to: "/dashboard/admin/messages" },

  ],

};



export function isNavActive(

  pathname: string,

  item: { path: string; exact?: boolean; matchPrefix?: string }

): boolean {

  if (item.exact) {
    if (pathname === item.path || pathname === `${item.path}/`) return true;
    if (item.matchPrefix) return pathname.startsWith(item.matchPrefix);
    return false;
  }

  if (item.matchPrefix) return pathname.startsWith(item.matchPrefix);

  return pathname === item.path || pathname.startsWith(`${item.path}/`);

}


