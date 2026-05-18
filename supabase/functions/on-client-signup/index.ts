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

  const client = payload.record;
  const supabase = getServiceClient();
  if (!supabase) return jsonResponse({ error: "Database not configured" }, 503);

  const { data: admins } = await supabase.from("profiles").select("email, full_name").eq("role", "admin");
  const company = String(client.company_name || "New client");
  const contactEmail = String(client.contact_email || client.email || "—");

  let planName = "Trial";
  if (client.subscription_plan_id) {
    const { data: plan } = await supabase.from("subscription_plans").select("name").eq("id", client.subscription_plan_id).single();
    planName = plan?.name || planName;
  }

  const html = emailLayout(`
    <p>A new client has signed up on Ellure NexHire.</p>
    <ul>
      <li><strong>Company:</strong> ${company}</li>
      <li><strong>Contact:</strong> ${contactEmail}</li>
      <li><strong>Plan:</strong> ${planName}</li>
    </ul>
    <p><a href="${SITE}/dashboard/admin/users" style="color:#0566cd">Review in admin →</a></p>
  `);

  const results: string[] = [];
  for (const admin of admins || []) {
    if (!admin.email) continue;
    const r = await sendEmail(admin.email, `New client signup: ${company}`, html);
    if ("error" in r) results.push(r.error);
  }

  if (results.length && results.length === (admins?.length || 0)) {
    return jsonResponse({ error: results[0] }, 503);
  }
  return jsonResponse({ success: true });
});
