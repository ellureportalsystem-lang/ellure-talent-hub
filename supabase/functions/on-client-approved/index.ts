import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { sendEmail, emailLayout, emailButton } from "../_shared/email.ts";
import { getServiceClient, parseWebhook, type DbWebhookPayload } from "../_shared/supabase-admin.ts";
import { createNotification } from "../_shared/notifications.ts";
import { formatISTDate } from "../_shared/dates.ts";
import { jsonResponse, handleOptions } from "../_shared/cors.ts";

const SITE = Deno.env.get("SITE_URL") || "https://ellurenexhire.com";
const LOGIN_URL = `${SITE}/client/auth/login`;

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
  const tempPassword = String(payload.record.temp_password || payload.record.notes || "").includes("temp:")
    ? String(payload.record.notes).replace(/^.*temp:/i, "").trim()
    : null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .eq("client_id", clientId)
    .limit(1)
    .maybeSingle();

  const email = profile?.email || String(payload.record.contact_email || payload.record.email || "");
  if (!email) return jsonResponse({ ok: true, skipped: true });

  const trialEnd = payload.record.subscription_end_date
    ? formatISTDate(String(payload.record.subscription_end_date))
    : "See your dashboard";

  const passwordBlock = tempPassword
    ? `<p>Your temporary password: <strong style="font-family:monospace;background:#f1f5f9;padding:4px 8px;border-radius:4px">${tempPassword}</strong><br><em>Please change it after your first login.</em></p>`
    : "";

  const html = emailLayout(`
    <p>Hi ${profile?.full_name || "there"},</p>
    <p>Your <strong>Ellure TalentHub</strong> recruiter account has been approved!</p>
    <p>Subscription valid until: <strong>${trialEnd}</strong></p>
    ${passwordBlock}
    ${emailButton(LOGIN_URL, "Log in to TalentHub")}
    ${emailButton(`${SITE}/dashboard/client`, "Go to dashboard")}
  `, "Your Ellure TalentHub recruiter account is approved");

  const result = await sendEmail(email, "Your Ellure TalentHub recruiter account has been approved", html);
  if ("error" in result) return jsonResponse({ error: result.error }, 503);

  if (profile?.id) {
    await createNotification(
      supabase,
      profile.id,
      "Account approved",
      "Your Ellure TalentHub recruiter account is now active. Log in to start searching candidates.",
      "account",
      LOGIN_URL,
    );
  }

  return jsonResponse({ success: true });
});
