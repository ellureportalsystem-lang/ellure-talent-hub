import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { sendEmail, emailLayout, emailButton } from "../_shared/email.ts";
import { getServiceClient } from "../_shared/supabase-admin.ts";
import { createNotification } from "../_shared/notifications.ts";
import { jsonResponse, handleOptions } from "../_shared/cors.ts";

const SITE = Deno.env.get("SITE_URL") || "https://ellurenexhire.com";

const FREQ_INTERVALS: Record<string, number> = {
  daily: 1,
  weekly: 7,
  monthly: 30,
};

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  const supabase = getServiceClient();
  if (!supabase) return jsonResponse({ error: "Database not configured" }, 503);

  const { data: alerts } = await supabase
    .from("job_alerts")
    .select("*, applicants(email, name, user_id)")
    .eq("is_active", true);

  let sent = 0;
  for (const alert of alerts || []) {
    const freq = String(alert.frequency || "daily");
    const intervalDays = FREQ_INTERVALS[freq] ?? 1;
    const cutoff = new Date(Date.now() - intervalDays * 86400000).toISOString();
    const lastSent = alert.last_sent_at ? new Date(String(alert.last_sent_at)).toISOString() : null;
    if (lastSent && lastSent > cutoff) continue;

    const keywords: string[] = Array.isArray(alert.keywords) ? alert.keywords : [];
    const cities: string[] = Array.isArray(alert.cities) ? alert.cities : [];
    const minExp = alert.min_experience != null ? Number(alert.min_experience) : null;
    const maxExp = alert.max_experience != null ? Number(alert.max_experience) : null;
    const since = lastSent || new Date(0).toISOString();

    let query = supabase
      .from("jobs")
      .select("id, title, city, state, min_experience, max_experience, clients(company_name)")
      .eq("status", "active")
      .gt("created_at", since);

    const { data: jobs } = await query.limit(50);

    const matched = (jobs || []).filter((j) => {
      if (cities.length && !cities.some((c) => String(j.city || "").toLowerCase().includes(c.toLowerCase()))) {
        return false;
      }
      if (minExp != null && j.max_experience != null && Number(j.max_experience) < minExp) return false;
      if (maxExp != null && j.min_experience != null && Number(j.min_experience) > maxExp) return false;
      if (!keywords.length) return true;
      const title = String(j.title || "").toLowerCase();
      const blob = JSON.stringify(j).toLowerCase();
      return keywords.some((k) => title.includes(String(k).toLowerCase()) || blob.includes(String(k).toLowerCase()));
    });

    if (!matched.length) continue;

    const applicant = (alert as { applicants?: { email?: string; name?: string; user_id?: string } }).applicants;
    const email = applicant?.email;
    if (!email) continue;

    const list = matched.slice(0, 15).map((j) => {
      const co = (j as { clients?: { company_name?: string } }).clients?.company_name || "Company";
      const loc = [j.city, j.state].filter(Boolean).join(", ");
      return `<li style="margin-bottom:8px"><strong>${j.title}</strong> — ${co}${loc ? ` (${loc})` : ""} · <a href="${SITE}/dashboard/applicant/jobs/${j.id}" style="color:#0078db">View job</a></li>`;
    }).join("");

    const html = emailLayout(`
      <p>Hi ${applicant?.name || "there"},</p>
      <p>We found <strong>${matched.length}</strong> new job(s) matching your alert:</p>
      <ul style="padding-left:20px">${list}</ul>
      ${emailButton(`${SITE}/dashboard/applicant/jobs`, "Browse all jobs")}
    `, `${matched.length} new jobs matching your alert`);

    const r = await sendEmail(email, `${matched.length} new jobs matching your alert`, html);
    if ("success" in r) {
      await supabase.from("job_alerts").update({ last_sent_at: new Date().toISOString() }).eq("id", alert.id);
      if (applicant?.user_id) {
        await createNotification(
          supabase,
          applicant.user_id,
          "New jobs matching your alert",
          `${matched.length} new jobs found.`,
          "job_alert",
          `${SITE}/dashboard/applicant/jobs`,
        );
      }
      sent++;
    }
  }

  return jsonResponse({ success: true, alertsSent: sent });
});
