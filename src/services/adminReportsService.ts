import { supabase } from "@/lib/supabase";

export type ReportRange = "7" | "30" | "90";

function rangeStart(days: ReportRange): string {
  const d = new Date();
  d.setDate(d.getDate() - Number(days));
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export type AdminReportOverview = {
  newCandidates: number;
  newClients: number;
  applicationsSubmitted: number;
  activeJobs: number;
};

export async function fetchAdminReportOverview(range: ReportRange): Promise<AdminReportOverview> {
  const since = rangeStart(range);

  const [candidates, clients, applications, jobs] = await Promise.all([
    supabase
      .from("applicants")
      .select("*", { count: "exact", head: true })
      .eq("is_deleted", false)
      .gte("created_at", since),
    supabase.from("clients").select("*", { count: "exact", head: true }).gte("created_at", since),
    supabase.from("job_applications").select("*", { count: "exact", head: true }).gte("applied_at", since),
    supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
  ]);

  return {
    newCandidates: candidates.count ?? 0,
    newClients: clients.count ?? 0,
    applicationsSubmitted: applications.count ?? 0,
    activeJobs: jobs.count ?? 0,
  };
}

export async function fetchRegistrationTrend(range: ReportRange) {
  const days = Number(range);
  const since = rangeStart(range);
  const { data, error } = await supabase
    .from("applicants")
    .select("created_at")
    .eq("is_deleted", false)
    .gte("created_at", since)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  const grouped: Record<string, number> = {};
  data?.forEach((r) => {
    const key = new Date(r.created_at!).toISOString().split("T")[0];
    grouped[key] = (grouped[key] || 0) + 1;
  });

  const result: { date: string; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    result.push({
      date: d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      count: grouped[key] || 0,
    });
  }
  return result;
}

export async function fetchTopJobRoles(limit = 10) {
  const { data, error } = await supabase
    .from("applicants")
    .select("job_role")
    .eq("is_deleted", false)
    .not("job_role", "is", null);

  if (error) throw new Error(error.message);

  const counts: Record<string, number> = {};
  data?.forEach((r) => {
    const role = r.job_role?.trim();
    if (role) counts[role] = (counts[role] || 0) + 1;
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, value]) => ({ name, value }));
}

export async function fetchApplicationFunnel() {
  const { data, error } = await supabase.from("job_applications").select("current_stage");
  if (error) throw new Error(error.message);

  const counts: Record<string, number> = {};
  data?.forEach((r) => {
    const s = r.current_stage || "applied";
    counts[s] = (counts[s] || 0) + 1;
  });

  return Object.entries(counts).map(([stage, count]) => ({ stage, count }));
}

export async function fetchClientPlanDistribution() {
  const { data, error } = await supabase
    .from("clients")
    .select("subscription_plan")
    .eq("is_active", true);

  if (error) throw new Error(error.message);

  const counts: Record<string, number> = {};
  data?.forEach((r) => {
    const p = r.subscription_plan || "unknown";
    counts[p] = (counts[p] || 0) + 1;
  });

  return Object.entries(counts).map(([plan, count]) => ({ plan, count }));
}

export async function fetchTopSkillsDemand(limit = 20) {
  const { data, error } = await supabase.from("applicant_skills").select("skill_name");
  if (error) throw new Error(error.message);

  const counts: Record<string, number> = {};
  data?.forEach((r) => {
    const s = r.skill_name?.trim();
    if (s) counts[s] = (counts[s] || 0) + 1;
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, value]) => ({ name, value }));
}

export function toCsv(rows: Record<string, string | number>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = rows.map((r) => headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","));
  return [headers.join(","), ...lines].join("\n");
}
