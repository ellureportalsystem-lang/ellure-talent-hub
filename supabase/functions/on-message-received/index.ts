import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { sendEmail, emailLayout } from "../_shared/email.ts";
import { getServiceClient, parseWebhook, type DbWebhookPayload } from "../_shared/supabase-admin.ts";
import { jsonResponse, handleOptions } from "../_shared/cors.ts";

const SITE = Deno.env.get("SITE_URL") || "https://ellurenexhire.com";

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  const payload = (await parseWebhook(req)) as DbWebhookPayload | null;
  if (!payload || payload.type !== "INSERT" || !payload.record) {
    return jsonResponse({ ok: true, skipped: true });
  }

  const msg = payload.record;
  const supabase = getServiceClient();
  if (!supabase) return jsonResponse({ error: "Database not configured" }, 503);

  const toUserId = String(msg.to_user_id || "");
  const fromUserId = String(msg.from_user_id || "");
  if (!toUserId || toUserId === fromUserId) return jsonResponse({ ok: true, skipped: true });

  const { data: recipient } = await supabase.from("profiles").select("email, full_name, role").eq("id", toUserId).single();
  const { data: sender } = await supabase.from("profiles").select("full_name, display_name, email").eq("id", fromUserId).single();

  if (!recipient?.email) return jsonResponse({ ok: true, skipped: true });

  const senderName = sender?.full_name || sender?.display_name || sender?.email || "Someone";
  const preview = String(msg.message || "").slice(0, 100);
  const role = recipient.role || "applicant";
  const messagesPath = role === "admin" ? "/dashboard/admin/messages" : role === "client" ? "/dashboard/client/messages" : "/dashboard/applicant/messages";

  const html = emailLayout(`
    <p>Hi ${recipient.full_name || "there"},</p>
    <p><strong>${senderName}</strong> sent you a message on Ellure TalentHub:</p>
    <blockquote style="border-left:3px solid #0566CD;padding-left:12px;color:#444">${preview}${String(msg.message || "").length > 100 ? "…" : ""}</blockquote>
    <p><a href="${SITE}${messagesPath}" style="color:#0566CD">Open messages →</a></p>
  `);

  const result = await sendEmail(recipient.email, "New message on Ellure TalentHub", html);
  if ("error" in result) return jsonResponse({ error: result.error }, 503);
  return jsonResponse({ success: true });
});
