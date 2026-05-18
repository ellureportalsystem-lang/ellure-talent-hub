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

  const app = payload.record;
  const supabase = getServiceClient();
  if (!supabase) return jsonResponse({ error: "Database not configured" }, 503);

  const { data: job } = await supabase.from("jobs").select("title, client_id, clients(company_name)").eq("id", app.job_id).single();
  const { data: applicant } = await supabase.from("applicants").select("name, email, user_id").eq("id", app.applicant_id).single();

  const email = applicant?.email;
  if (!email) return jsonResponse({ ok: true, skipped: true });

  const jobTitle = job?.title || "the position";
  const company = (job as { clients?: { company_name?: string } })?.clients?.company_name || "the company";
  const appliedAt = app.applied_at ? new Date(String(app.applied_at)).toLocaleDateString() : new Date().toLocaleDateString();

  const html = emailLayout(`
    <p>Hi ${applicant?.name || "there"},</p>
    <p>Your application for <strong>${jobTitle}</strong> at <strong>${company}</strong> was submitted successfully.</p>
    <p>Applied on: ${appliedAt}</p>
    <p><a href="${SITE}/dashboard/applicant/applications" style="color:#0566cd">View your applications →</a></p>
  `);

  const result = await sendEmail(email, `Application submitted for ${jobTitle}`, html);
  if ("error" in result) return jsonResponse({ error: result.error }, 503);
  return jsonResponse({ success: true });
});
