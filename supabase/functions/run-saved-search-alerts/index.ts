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

  const { data: searches } = await supabase
    .from("saved_searches")
    .select("*, clients(id)")
    .neq("alert_frequency", "none");

  let sent = 0;
  for (const s of searches || []) {
    const freq = String(s.alert_frequency || "none");
    if (freq === "none") continue;
    const lastRun = s.last_run_at ? new Date(String(s.last_run_at)).toISOString() : null;
    if (freq === "weekly" && lastRun && lastRun > weekAgo) continue;

    const filters = (s.filters as Record<string, unknown>) || {};
    const { data: results, error } = await supabase.rpc("search_applicants", {
      p_query: s.search_query || "",
      p_filters: filters,
      p_limit: 50,
      p_offset: 0,
    });

    if (error) {
      console.warn("search_applicants failed", s.id, error.message);
      continue;
    }

    const rows = (results as { id?: string; created_at?: string }[]) || [];
    const since = lastRun ? new Date(lastRun) : new Date(0);
    const newProfiles = rows.filter((r) => r.created_at && new Date(r.created_at) > since);

    if (!newProfiles.length) {
      await supabase.from("saved_searches").update({ last_run_at: new Date().toISOString() }).eq("id", s.id);
      continue;
    }

    const { data: profile } = await supabase.from("profiles").select("email").eq("client_id", s.client_id).limit(1).maybeSingle();
    if (!profile?.email) continue;

    const html = emailLayout(`
      <p>${newProfiles.length} new candidate${newProfiles.length === 1 ? "" : "s"} match your saved search "<strong>${s.name}</strong>".</p>
      <p><a href="${SITE}/dashboard/client/candidates" style="color:#0566cd">View new candidates →</a></p>
    `);

    const r = await sendEmail(profile.email, `${newProfiles.length} new candidates for "${s.name}"`, html);
    if ("success" in r) {
      await supabase.from("saved_searches").update({ last_run_at: new Date().toISOString() }).eq("id", s.id);
      sent++;
    }
  }

  return jsonResponse({ success: true, emailsSent: sent });
});
