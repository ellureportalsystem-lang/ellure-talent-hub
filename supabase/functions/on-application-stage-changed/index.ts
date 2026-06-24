import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { sendEmail, emailLayout, emailButton } from "../_shared/email.ts";
import { getServiceClient, parseWebhook, type DbWebhookPayload } from "../_shared/supabase-admin.ts";
import { createNotification } from "../_shared/notifications.ts";
import { formatIST } from "../_shared/dates.ts";
import { jsonResponse, handleOptions } from "../_shared/cors.ts";

const SITE = Deno.env.get("SITE_URL") || "https://ellurenexhire.com";

type StageEmail = { subject: string; body: string; preheader: string };

function stageEmail(stage: string, jobTitle: string, name: string, interviewDetails?: string): StageEmail {
  const appsUrl = `${SITE}/dashboard/applicant/applications`;

  switch (stage) {
    case "shortlisted":
      return {
        subject: `Good news! Shortlisted for ${jobTitle}`,
        preheader: `You've been shortlisted for ${jobTitle}`,
        body: `
          <p>Hi ${name},</p>
          <p>Good news! You've been <strong>shortlisted</strong> for <strong>${jobTitle}</strong>.</p>
          <p>The recruiter will be in touch with next steps. Keep an eye on your inbox.</p>
          ${emailButton(appsUrl, "View application status")}
        `,
      };
    case "rejected":
      return {
        subject: `Update on your application for ${jobTitle}`,
        preheader: `Application update for ${jobTitle}`,
        body: `
          <p>Hi ${name},</p>
          <p>Thank you for your interest in <strong>${jobTitle}</strong>.</p>
          <p>After careful review, the recruiter has decided not to move forward with your application at this time.</p>
          <p>We encourage you to keep your profile updated and apply to other matching roles on Ellure TalentHub.</p>
          ${emailButton(`${SITE}/dashboard/applicant/jobs`, "Browse more jobs")}
        `,
      };
    case "interview_scheduled":
      return {
        subject: `Interview scheduled — ${jobTitle}`,
        preheader: `Interview details for ${jobTitle}`,
        body: `
          <p>Hi ${name},</p>
          <p>Your interview for <strong>${jobTitle}</strong> has been scheduled.</p>
          ${interviewDetails ? `<div style="background:#f1f5f9;padding:16px;border-radius:6px;margin:16px 0">${interviewDetails}</div>` : ""}
          <p>Please confirm your availability and prepare accordingly.</p>
          ${emailButton(appsUrl, "View application details")}
        `,
      };
    default:
      return {
        subject: `Update on your application — ${jobTitle}`,
        preheader: `Application stage updated`,
        body: `
          <p>Hi ${name},</p>
          <p>There's an update on your application for <strong>${jobTitle}</strong>.</p>
          <p>New stage: <strong>${stage.replace(/_/g, " ")}</strong></p>
          ${emailButton(appsUrl, "View applications")}
        `,
      };
  }
}

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
  const { data: applicant } = await supabase
    .from("applicants")
    .select("name, email, user_id")
    .eq("id", payload.record.applicant_id)
    .single();

  if (!applicant?.email) return jsonResponse({ ok: true, skipped: true });

  const jobTitle = job?.title || "your application";
  const name = applicant.name || "there";

  let interviewDetails: string | undefined;
  if (newStage === "interview_scheduled") {
    const scheduledAt = payload.record.interview_scheduled_at || payload.record.scheduled_at;
    if (scheduledAt) {
      interviewDetails = `<p><strong>Date & time:</strong> ${formatIST(String(scheduledAt))} (IST)</p>`;
    }
    const location = payload.record.interview_location || payload.record.interview_mode;
    if (location) {
      interviewDetails = (interviewDetails || "") + `<p><strong>Mode / Location:</strong> ${location}</p>`;
    }
  }

  const { subject, body, preheader } = stageEmail(newStage, jobTitle, name, interviewDetails);
  const html = emailLayout(body, preheader);

  const result = await sendEmail(applicant.email, subject, html);
  if ("error" in result) return jsonResponse({ error: result.error }, 503);

  if (applicant.user_id) {
    await createNotification(
      supabase,
      String(applicant.user_id),
      subject,
      `Your application for ${jobTitle} is now at stage: ${newStage.replace(/_/g, " ")}.`,
      "application",
      `${SITE}/dashboard/applicant/applications`,
    );
  }

  return jsonResponse({ success: true });
});
