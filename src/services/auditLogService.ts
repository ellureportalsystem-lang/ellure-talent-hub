import { supabase } from "@/lib/supabase";
import type { AuditLog } from "@/types/database.types";

export type AuditLogRow = AuditLog & {
  actor_name: string | null;
};

export type AuditLogFilters = {
  actorId?: string;
  entityType?: string;
  action?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
};

export async function fetchAuditLogs(filters: AuditLogFilters = {}) {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 50;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("audit_logs")
    .select(
      "id, created_at, actor_id, action, entity_type, entity_id, ip_address, profiles!audit_logs_actor_id_fkey(full_name, email)",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters.actorId) query = query.eq("actor_id", filters.actorId);
  if (filters.entityType) query = query.eq("entity_type", filters.entityType);
  if (filters.action) query = query.ilike("action", `%${filters.action}%`);
  if (filters.dateFrom) query = query.gte("created_at", filters.dateFrom);
  if (filters.dateTo) query = query.lte("created_at", filters.dateTo);

  const { data, error, count } = await query;

  if (error) return { data: null, error, count: 0 };

  const rows: AuditLogRow[] = (data ?? []).map((row) => {
    const profile = row.profiles as { full_name: string | null; email: string | null } | null;
    const { profiles: _p, ...rest } = row as AuditLog & {
      profiles: { full_name: string | null; email: string | null } | null;
    };
    return {
      ...rest,
      actor_name: profile?.full_name ?? profile?.email ?? null,
    };
  });

  return { data: rows, error: null, count: count ?? 0 };
}

export async function exportAuditLogsCsv(filters: AuditLogFilters = {}) {
  let query = supabase
    .from("audit_logs")
    .select("created_at, action, entity_type, entity_id, ip_address, profiles!audit_logs_actor_id_fkey(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(5000);

  if (filters.actorId) query = query.eq("actor_id", filters.actorId);
  if (filters.entityType) query = query.eq("entity_type", filters.entityType);
  if (filters.action) query = query.ilike("action", `%${filters.action}%`);
  if (filters.dateFrom) query = query.gte("created_at", filters.dateFrom);
  if (filters.dateTo) query = query.lte("created_at", filters.dateTo);

  const { data, error } = await query;
  if (error) return { csv: null, error };

  const header = "Timestamp,Actor,Action,Entity Type,Entity ID,IP Address";
  const lines = (data ?? []).map((row) => {
    const profile = row.profiles as { full_name: string | null; email: string | null } | null;
    const actor = profile?.full_name ?? profile?.email ?? "";
    const ts = row.created_at ?? "";
    const ip = row.ip_address != null ? String(row.ip_address) : "";
    return `"${ts}","${actor}","${row.action}","${row.entity_type}","${row.entity_id}","${ip}"`;
  });

  return { csv: [header, ...lines].join("\n"), error: null };
}
