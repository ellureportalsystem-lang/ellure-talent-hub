import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { sendEmail, emailLayout } from "../_shared/email.ts";
import { getServiceClient, parseWebhook, type DbWebhookPayload } from "../_shared/supabase-admin.ts";
import { jsonResponse, handleOptions } from "../_shared/cors.ts";

const SITE = Deno.env.get("SITE_URL") || "https://ellurenexhire.com";

const STAGE_LABELS: Record<string, string> = {
  screening: "Screening",
  interview_scheduled: "Interview",
  offered: "Offer",
  hired: "Hired",
  rejected: "Rejected",
};

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  const payload = (await parseWebhook(req)) as DbWebhookPayload | null;
  if (!payload || payload.type !== "UPDATE" || !payload.record) {
    return jsonResponse({ ok: true, skipped: true });
  }

  const newStage = String(payload.record.current_stage || "");
  const oldStage = String(payload.old_record?.current_stage || "");
  if (newStage === oldStage || newStage === "applied") {
    return jsonResponse({ ok: true, skipped: true });
  }

  const supabase = getServiceClient();
  if (!supabase) return jsonResponse({ error: "Database not configured" }, 503);

  const { data: job } = await supabase.from("jobs").select("title").eq("id", payload.record.job_id).single();
  const { data: applicant } = await supabase.from("applicants").select("name, email").eq("id", payload.record.applicant_id).single();

  if (!applicant?.email) return jsonResponse({ ok: true, skipped: true });

  const jobTitle = job?.title || "your application";
  const stageLabel = STAGE_LABELS[newStage] || newStage.replace(/_/g, " ");

  const html = emailLayout(`
    <p>Hi ${applicant.name || "there"},</p>
    <p>There's an update on your application for <strong>${jobTitle}</strong>.</p>
    <p>New stage: <strong>${stageLabel}</strong></p>
    <p><a href="${SITE}/dashboard/applicant/applications" style="color:#0566cd">View applications →</a></p>
  `);

  const result = await sendEmail(applicant.email, `Update on your application — ${jobTitle}`, html);
  if ("error" in result) return jsonResponse({ error: result.error }, 503);
  return jsonResponse({ success: true });
});
