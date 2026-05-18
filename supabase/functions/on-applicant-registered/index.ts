import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { sendEmail, emailLayout } from "../_shared/email.ts";
import { getServiceClient, parseWebhook, type DbWebhookPayload } from "../_shared/supabase-admin.ts";
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

  if (!email) return jsonResponse({ error: "No applicant email" }, 400);

  const html = emailLayout(`
    <p>Hi ${name},</p>
    <p>Welcome to <strong>Ellure NexHire</strong> — your profile is now live!</p>
    <p>Profile completion: <strong>${pct}%</strong></p>
    <p><a href="${SITE}/dashboard/applicant/profile" style="color:#0566cd">Complete your profile →</a></p>
    <p>Questions? Email <a href="mailto:support@ellurenexhire.com">support@ellurenexhire.com</a></p>
  `);

  const result = await sendEmail(email, "Welcome to Ellure NexHire — Your profile is live!", html);
  if ("error" in result) return jsonResponse({ error: result.error }, 503);
  return jsonResponse({ success: true });
});
