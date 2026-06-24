import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { sendEmail, emailLayout, emailButton } from "../_shared/email.ts";
import { getServiceClient, parseWebhook, type DbWebhookPayload } from "../_shared/supabase-admin.ts";
import { createNotification } from "../_shared/notifications.ts";
import { formatISTDate } from "../_shared/dates.ts";
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

  const { data: job } = await supabase
    .from("jobs")
    .select("title, client_id, clients(company_name)")
    .eq("id", app.job_id)
    .single();

  const { data: applicant } = await supabase
    .from("applicants")
    .select("name, email, user_id")
    .eq("id", app.applicant_id)
    .single();

  const email = applicant?.email;
  if (!email) return jsonResponse({ ok: true, skipped: true });

  const jobTitle = job?.title || "the position";
  const company = (job as { clients?: { company_name?: string } })?.clients?.company_name || "the company";
  const appliedAt = formatISTDate(app.applied_at ? String(app.applied_at) : new Date().toISOString());

  const candidateHtml = emailLayout(`
    <p>Hi ${applicant?.name || "there"},</p>
    <p>Your application for <strong>${jobTitle}</strong> at <strong>${company}</strong> has been received.</p>
    <p>Applied on: <strong>${appliedAt}</strong> (IST)</p>
    ${emailButton(`${SITE}/dashboard/applicant/applications`, "View your applications")}
  `, `Application received for ${jobTitle}`);

  const candidateResult = await sendEmail(
    email,
    `Application received — ${jobTitle} at ${company}`,
    candidateHtml,
  );
  if ("error" in candidateResult) return jsonResponse({ error: candidateResult.error }, 503);

  if (applicant?.user_id) {
    await createNotification(
      supabase,
      String(applicant.user_id),
      "Application submitted",
      `Your application for ${jobTitle} at ${company} was submitted successfully.`,
      "application",
      `${SITE}/dashboard/applicant/applications`,
    );
  }

  const clientId = job?.client_id;
  if (clientId) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .eq("client_id", clientId);

    for (const p of profiles || []) {
      if (p.id) {
        await createNotification(
          supabase,
          p.id,
          "New application received",
          `New application for ${jobTitle} from ${applicant?.name || "a candidate"}.`,
          "application",
          `${SITE}/dashboard/client/jobs`,
        );
      }
      if (p.email) {
        await sendEmail(
          p.email,
          `New application for ${jobTitle}`,
          emailLayout(`
            <p>Hi ${p.full_name || "there"},</p>
            <p>A new application was received for <strong>${jobTitle}</strong>.</p>
            <p>Candidate: <strong>${applicant?.name || "—"}</strong></p>
            ${emailButton(`${SITE}/dashboard/client/jobs`, "Review applications")}
          `),
        );
      }
    }
  }

  return jsonResponse({ success: true });
});
