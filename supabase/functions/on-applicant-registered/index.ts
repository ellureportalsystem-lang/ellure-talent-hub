import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { sendEmail, emailLayout, emailButton } from "../_shared/email.ts";
import { getServiceClient, parseWebhook, type DbWebhookPayload } from "../_shared/supabase-admin.ts";
import { createNotification } from "../_shared/notifications.ts";
import { jsonResponse, handleOptions } from "../_shared/cors.ts";

const SITE = Deno.env.get("SITE_URL") || "https://ellurenexhire.com";

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  const payload = (await parseWebhook(req)) as DbWebhookPayload | null;
  if (!payload?.record) return jsonResponse({ ok: true, skipped: true });

  const record = payload.record;
  if (payload.type === "UPDATE") {
    const old = payload.old_record;
    if (old?.status === "submitted" || record.status !== "submitted") {
      return jsonResponse({ ok: true, skipped: true });
    }
  } else if (record.status !== "submitted") {
    return jsonResponse({ ok: true, skipped: true });
  }

  const email = String(record.email || "");
  const name = String(record.name || "there");
  const pct = record.profile_complete_percent ?? 0;
  const userId = String(record.user_id || "");

  if (!email) return jsonResponse({ error: "No applicant email" }, 400);

  const loginUrl = `${SITE}/auth/applicant`;
  const html = emailLayout(`
    <p>Hi ${name},</p>
    <p>Welcome to <strong>Ellure TalentHub</strong> — your profile is now live and visible to recruiters!</p>
    <p>Profile completion: <strong>${pct}%</strong></p>
    ${emailButton(loginUrl, "Log in to your dashboard")}
    <p>Complete your profile to get more interview calls.</p>
    <p>Questions? Email <a href="mailto:support@ellurenexhire.com" style="color:#0566CD">support@ellurenexhire.com</a></p>
  `, "Welcome to Ellure TalentHub — your profile is live");

  const result = await sendEmail(email, "Welcome to Ellure TalentHub — Your profile is live!", html);
  if ("error" in result) return jsonResponse({ error: result.error }, 503);

  const supabase = getServiceClient();
  if (supabase && userId) {
    await createNotification(
      supabase,
      userId,
      "Welcome to Ellure TalentHub!",
      "Your profile is live. Complete it to attract more recruiters.",
      "welcome",
      `${SITE}/dashboard/applicant`,
    );
  }

  return jsonResponse({ success: true });
});
