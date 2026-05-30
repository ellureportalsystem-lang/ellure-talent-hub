import { supabase } from "@/lib/supabase";

/** Plan row from subscription_plans + aliases used across the client UI */
export type ClientSubscriptionPlan = {
  id: string;
  name: string;
  display_name: string | null;
  price_monthly?: number | null;
  price_yearly?: number | null;
  max_cv_downloads?: number | null;
  max_job_postings?: number | null;
  max_team_members?: number | null;
  max_saved_searches?: number | null;
  can_see_contact_details?: boolean | null;
  can_export_excel?: boolean | null;
  can_bulk_download?: boolean | null;
  /** UI alias for max_cv_downloads */
  cv_downloads_per_month: number;
  /** UI alias for max_job_postings */
  max_active_jobs: number;
};

type ClientRow = Record<string, unknown> & {
  subscription_plan?: string | null;
  max_cv_downloads_per_month?: number | null;
};

export type ClientWithPlan = ClientRow & {
  subscription_plans: ClientSubscriptionPlan | null;
};

export function enrichSubscriptionPlan(row: Record<string, unknown>): ClientSubscriptionPlan {
  const maxCv = Number(row.max_cv_downloads ?? 0);
  const maxJobs = Number(row.max_job_postings ?? 0);
  return {
    ...(row as unknown as ClientSubscriptionPlan),
    cv_downloads_per_month: maxCv,
    max_active_jobs: maxJobs,
  };
}

function enrichPlan(row: Record<string, unknown> | null): ClientSubscriptionPlan | null {
  if (!row) return null;
  return enrichSubscriptionPlan(row);
}

export async function loadSubscriptionPlanByName(
  planName: string | null | undefined
): Promise<ClientSubscriptionPlan | null> {
  if (!planName?.trim()) return null;
  const { data, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("name", planName.trim())
    .maybeSingle();
  if (error || !data) return null;
  return enrichPlan(data as Record<string, unknown>);
}

/** Resolve CV download limit from client row overrides or plan defaults */
export function resolveCvDownloadLimit(
  client: ClientRow,
  plan: ClientSubscriptionPlan | null
): number {
  const override = client.max_cv_downloads_per_month;
  if (override != null && Number(override) > 0) return Number(override);
  return plan?.cv_downloads_per_month ?? 100;
}

export async function attachSubscriptionPlan(client: ClientRow): Promise<ClientWithPlan> {
  const plan = await loadSubscriptionPlanByName(client.subscription_plan as string);
  return {
    ...client,
    subscription_plans: plan,
  };
}

export async function fetchClientRecord(clientId: string): Promise<ClientWithPlan> {
  const { data: client, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .single();

  if (error) throw new Error(error.message);
  return attachSubscriptionPlan(client as ClientRow);
}
