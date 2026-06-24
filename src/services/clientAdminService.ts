import { supabase } from "@/lib/supabase";
import type { Client } from "@/types/database.types";

export type ClientListRow = Pick<
  Client,
  | "id"
  | "company_name"
  | "contact_person_name"
  | "contact_email"
  | "email"
  | "subscription_plan"
  | "is_active"
  | "subscription_start_date"
  | "subscription_end_date"
  | "cv_downloads_used_this_month"
  | "max_cv_downloads_per_month"
  | "job_postings_used"
  | "max_job_postings"
  | "approved_at"
  | "subscription_status"
>;

export type ClientFilters = {
  plan?: string;
  status?: "active" | "inactive" | "pending";
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  pageSize?: number;
};

export async function fetchClients(filters: ClientFilters = {}) {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("clients")
    .select(
      "id, company_name, contact_person_name, contact_email, email, subscription_plan, is_active, subscription_start_date, subscription_end_date, cv_downloads_used_this_month, max_cv_downloads_per_month, job_postings_used, max_job_postings, approved_at, subscription_status",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters.plan) query = query.eq("subscription_plan", filters.plan);
  if (filters.status === "active") query = query.eq("is_active", true).not("approved_at", "is", null);
  if (filters.status === "inactive") query = query.eq("is_active", false);
  if (filters.status === "pending") query = query.is("approved_at", null);
  if (filters.dateFrom) query = query.gte("created_at", filters.dateFrom);
  if (filters.dateTo) query = query.lte("created_at", filters.dateTo);
  if (filters.search) {
    query = query.or(
      `company_name.ilike.%${filters.search}%,contact_email.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
    );
  }

  const { data, error, count } = await query;
  return { data: (data ?? []) as ClientListRow[], error, count: count ?? 0 };
}

export async function suspendClient(clientId: string) {
  const { error } = await supabase.from("clients").update({ is_active: false }).eq("id", clientId);
  return { error };
}

/** Archive recruiter account (deactivate + mark subscription cancelled) */
export async function archiveClient(clientId: string, actorId?: string | null) {
  const { error } = await supabase
    .from("clients")
    .update({
      is_active: false,
      subscription_status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", clientId);

  if (!error) {
    await supabase.from("audit_logs").insert({
      action: "client_archived",
      entity_type: "client",
      entity_id: clientId,
      actor_id: actorId ?? null,
    });
  }

  return { error };
}

export async function updateClientPlan(
  clientId: string,
  updates: {
    subscription_plan: string;
    max_cv_downloads_per_month: number;
    max_job_postings: number;
    subscription_end_date?: string | null;
  }
) {
  const { error } = await supabase.from("clients").update(updates).eq("id", clientId);
  return { error };
}

export async function createClientRecord(input: {
  company_name: string;
  contact_person_name: string;
  contact_email: string;
  contact_phone?: string;
  subscription_plan: string;
}) {
  const { data, error } = await supabase
    .from("clients")
    .insert({
      company_name: input.company_name,
      contact_person_name: input.contact_person_name,
      contact_email: input.contact_email,
      contact_phone: input.contact_phone ?? null,
      email: input.contact_email,
      subscription_plan: input.subscription_plan,
      is_active: true,
      subscription_status: "trial",
    })
    .select("id")
    .single();

  if (error) return { data: null, error };

  const { error: rpcError } = await supabase.rpc("finalize_client_signup", {
    p_client_id: data.id,
  });

  return { data, error: rpcError };
}
