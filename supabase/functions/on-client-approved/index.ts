import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { sendEmail, emailLayout } from "../_shared/email.ts";
import { getServiceClient, parseWebhook, type DbWebhookPayload } from "../_shared/supabase-admin.ts";
import { jsonResponse, handleOptions } from "../_shared/cors.ts";

const SITE = Deno.env.get("SITE_URL") || "https://ellurenexhire.com";

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  const payload = (await parseWebhook(req)) as DbWebhookPayload | null;
  if (!payload || payload.type !== "UPDATE" || !payload.record) {
    return jsonResponse({ ok: true, skipped: true });
  }

  const wasActive = payload.old_record?.is_active === true;
  const isActive = payload.record.is_active === true;
  if (wasActive || !isActive) return jsonResponse({ ok: true, skipped: true });

  const supabase = getServiceClient();
  if (!supabase) return jsonResponse({ error: "Database not configured" }, 503);

  const clientId = String(payload.record.id);
  const { data: profile } = await supabase.from("profiles").select("email, full_name").eq("client_id", clientId).limit(1).maybeSingle();

  const email = profile?.email || String(payload.record.contact_email || "");
  if (!email) return jsonResponse({ ok: true, skipped: true });

  const trialEnd = payload.record.subscription_end_date
    ? new Date(String(payload.record.subscription_end_date)).toLocaleDateString()
    : "See your dashboard";

  const html = emailLayout(`
    <p>Hi ${profile?.full_name || "there"},</p>
    <p>Your <strong>Ellure NexHire</strong> account has been approved!</p>
    <p>Trial ends: <strong>${trialEnd}</strong></p>
    <p><a href="${SITE}/client/auth/login" style="color:#0566cd">Log in to your portal →</a></p>
    <p><a href="${SITE}/dashboard/client" style="color:#0566cd">Go to dashboard →</a></p>
  `);

  const result = await sendEmail(email, "Your Ellure NexHire account is approved!", html);
  if ("error" in result) return jsonResponse({ error: result.error }, 503);
  return jsonResponse({ success: true });
});
