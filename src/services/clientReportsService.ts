import { supabase } from "@/lib/supabase";

export type ClientReportRange = "7" | "30" | "90";

function rangeStart(days: ClientReportRange): string {
  const d = new Date();
  d.setDate(d.getDate() - Number(days));
  return d.toISOString();
}

export async function fetchClientJobPerformance(clientId: string) {
  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("id, title, views_count, applications_count, status")
    .eq("client_id", clientId)
    .order("applications_count", { ascending: false });

  if (error) throw new Error(error.message);

  const enriched = await Promise.all(
    (jobs ?? []).map(async (job) => {
      const { count: shortlisted } = await supabase
        .from("job_applications")
        .select("*", { count: "exact", head: true })
        .eq("job_id", job.id)
        .in("current_stage", ["shortlisted", "interview_scheduled", "interviewed", "offer"]);

      const { count: hired } = await supabase
        .from("job_applications")
        .select("*", { count: "exact", head: true })
        .eq("job_id", job.id)
        .eq("current_stage", "offer");

      return {
        id: job.id,
        title: job.title,
        views: job.views_count ?? 0,
        applications: job.applications_count ?? 0,
        shortlisted: shortlisted ?? 0,
        hired: hired ?? 0,
        status: job.status,
      };
    })
  );

  return enriched;
}

export async function fetchClientPipeline(clientId: string) {
  const { data: jobs, error: jobErr } = await supabase
    .from("jobs")
    .select("id")
    .eq("client_id", clientId);
  if (jobErr) throw new Error(jobErr.message);

  const jobIds = (jobs ?? []).map((j) => j.id);
  const stages = ["applied", "screening", "shortlisted", "interview_scheduled", "interviewed", "offer", "rejected"];
  if (!jobIds.length) {
    return stages.map((stage) => ({ stage, count: 0 }));
  }

  const { data, error } = await supabase
    .from("job_applications")
    .select("current_stage")
    .in("job_id", jobIds);

  if (error) throw new Error(error.message);

  const counts: Record<string, number> = {};
  stages.forEach((s) => (counts[s] = 0));

  data?.forEach((r) => {
    const s = r.current_stage || "applied";
    counts[s] = (counts[s] || 0) + 1;
  });

  return stages.map((stage) => ({ stage, count: counts[stage] || 0 }));
}

export async function fetchClientCvDownloadHistory(clientId: string, range: ClientReportRange = "30") {
  const since = rangeStart(range);
  const { data, error } = await supabase
    .from("cv_download_log")
    .select("downloaded_at, downloaded_by, applicants(name, job_role)")
    .eq("client_id", clientId)
    .gte("downloaded_at", since)
    .order("downloaded_at", { ascending: false })
    .limit(100);

  if (error) throw new Error(error.message);

  const userIds = [...new Set((data ?? []).map((r) => r.downloaded_by).filter(Boolean))];
  let profileNames: Record<string, string> = {};
  if (userIds.length) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", userIds);
    profileNames = Object.fromEntries((profiles ?? []).map((p) => [p.id, p.full_name || "—"]));
  }

  return (data ?? []).map((row) => {
    const applicant = row.applicants as { name: string; job_role: string | null } | null;
    return {
      candidateName: applicant?.name ?? "—",
      role: applicant?.job_role ?? "—",
      downloadedAt: row.downloaded_at,
      downloadedBy: profileNames[row.downloaded_by] ?? "—",
    };
  });
}

export async function fetchClientSavedSearches(clientId: string) {
  const { data, error } = await supabase
    .from("saved_searches")
    .select("id, name, last_run_at, created_at")
    .eq("client_id", clientId)
    .order("last_run_at", { ascending: false, nullsFirst: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchClientProfileViewsCount(clientId: string, userId: string, range: ClientReportRange = "30") {
  const since = rangeStart(range);
  const { count, error } = await supabase
    .from("profile_views")
    .select("*", { count: "exact", head: true })
    .eq("viewer_id", userId)
    .gte("viewed_at", since);

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export function toCsv(rows: Record<string, string | number>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = rows.map((r) => headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","));
  return [headers.join(","), ...lines].join("\n");
}

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportCsv(filename: string, rows: Record<string, string | number>[]) {
  downloadCsv(filename, toCsv(rows));
}
