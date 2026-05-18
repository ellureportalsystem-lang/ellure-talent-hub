import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { sendEmail, emailLayout } from "../_shared/email.ts";
import { getServiceClient } from "../_shared/supabase-admin.ts";
import { jsonResponse, handleOptions } from "../_shared/cors.ts";

const SITE = Deno.env.get("SITE_URL") || "https://ellurenexhire.com";

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  const supabase = getServiceClient();
  if (!supabase) return jsonResponse({ error: "Database not configured" }, 503);

  const weekAgo = new Date(Date.now() - 6 * 86400000).toISOString();

  const { data: alerts } = await supabase
    .from("job_alerts")
    .select("*, applicants(email, name)")
    .eq("is_active", true);

  let sent = 0;
  for (const alert of alerts || []) {
    const freq = String(alert.frequency || "daily");
    const lastSent = alert.last_sent_at ? new Date(String(alert.last_sent_at)).toISOString() : null;
    if (freq === "weekly" && lastSent && lastSent > weekAgo) continue;

    const keywords: string[] = Array.isArray(alert.keywords) ? alert.keywords : [];
    const since = lastSent || new Date(0).toISOString();

    let query = supabase.from("jobs").select("id, title, city, state, clients(company_name)").eq("status", "active").gt("created_at", since);

    const { data: jobs } = await query.limit(20);
    const matched = (jobs || []).filter((j) => {
      if (!keywords.length) return true;
      const title = String(j.title || "").toLowerCase();
      const skills = JSON.stringify(j).toLowerCase();
      return keywords.some((k) => title.includes(String(k).toLowerCase()) || skills.includes(String(k).toLowerCase()));
    });

    if (!matched.length) continue;

    const email = (alert as { applicants?: { email?: string; name?: string } }).applicants?.email;
    if (!email) continue;

    const list = matched.map((j) => {
      const co = (j as { clients?: { company_name?: string } }).clients?.company_name || "Company";
      const loc = [j.city, j.state].filter(Boolean).join(", ");
      return `<li><strong>${j.title}</strong> — ${co}${loc ? ` (${loc})` : ""} · <a href="${SITE}/dashboard/applicant/jobs/${j.id}">Apply</a></li>`;
    }).join("");

    const html = emailLayout(`<p>Hi ${(alert as { applicants?: { name?: string } }).applicants?.name || "there"},</p><p>New jobs matching your alert:</p><ul>${list}</ul>`);
    const r = await sendEmail(email, "New jobs matching your alert", html);
    if ("success" in r) {
      await supabase.from("job_alerts").update({ last_sent_at: new Date().toISOString() }).eq("id", alert.id);
      sent++;
    }
  }

  return jsonResponse({ success: true, alertsSent: sent });
});
