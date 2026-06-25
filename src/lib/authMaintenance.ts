/**
 * Website-only mode: blocks portal logins and dashboards.
 *
 * Enabled by default until VITE_AUTH_MAINTENANCE_MODE=false in .env or Vercel.
 * Marketing pages (/, /about, /services, etc.) stay public.
 */
export const isAuthMaintenanceMode = import.meta.env.VITE_AUTH_MAINTENANCE_MODE !== "false";
