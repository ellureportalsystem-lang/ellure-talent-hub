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

  const now = new Date().toISOString();

  const { data: expired } = await supabase
    .from("clients")
    .select("id, company_name, subscription_end_date")
    .eq("subscription_status", "active")
    .lt("subscription_end_date", now);

  let expiredCount = 0;
  for (const c of expired || []) {
    await supabase.from("clients").update({ subscription_status: "expired" }).eq("id", c.id);

    const { data: profiles } = await supabase.from("profiles").select("id, email").eq("client_id", c.id);
    for (const p of profiles || []) {
      if (p.id) {
        await supabase.rpc("create_notification", {
          p_user_id: p.id,
          p_title: "Subscription expired",
          p_message: "Your subscription has expired. Renew to continue accessing candidates.",
          p_type: "billing",
        }).catch(() => {});
      }
      if (p.email) {
        await sendEmail(
          p.email,
          "Your Ellure NexHire subscription has expired",
          emailLayout(`<p>Your subscription has expired. <a href="${SITE}/dashboard/client/billing">Renew now</a> to continue accessing candidates.</p>`),
        );
      }
    }
    expiredCount++;
  }

  const weekAhead = new Date(Date.now() + 7 * 86400000).toISOString();
  const { data: reminders } = await supabase
    .from("clients")
    .select("id, subscription_end_date")
    .eq("subscription_status", "active")
    .gte("subscription_end_date", now)
    .lte("subscription_end_date", weekAhead);

  let reminderCount = 0;
  for (const c of reminders || []) {
    const days = Math.ceil((new Date(String(c.subscription_end_date)).getTime() - Date.now()) / 86400000);
    const { data: profiles } = await supabase.from("profiles").select("email").eq("client_id", c.id);
    for (const p of profiles || []) {
      if (p.email) {
        await sendEmail(
          p.email,
          `Your subscription expires in ${days} days`,
          emailLayout(`<p>Your Ellure NexHire subscription expires in <strong>${days}</strong> days. <a href="${SITE}/dashboard/client/billing">Renew early</a>.</p>`),
        );
        reminderCount++;
      }
    }
  }

  return jsonResponse({ success: true, expired: expiredCount, reminders: reminderCount });
});
