import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { sendEmail, emailLayout, emailButton } from "../_shared/email.ts";
import { getServiceClient } from "../_shared/supabase-admin.ts";
import { createNotification } from "../_shared/notifications.ts";
import { jsonResponse, handleOptions } from "../_shared/cors.ts";

const SITE = Deno.env.get("SITE_URL") || "https://ellurenexhire.com";

type Question = { question: string; type: "text" | "mcq"; options?: string[] };

type SendNviteBody = {
  recruiter_id: string;
  candidate_ids: string[];
  job_id?: string | null;
  subject: string;
  message_html: string;
  questions?: Question[];
  schedule_at?: string | null;
  reply_to_email?: string | null;
};

function personalize(text: string, vars: Record<string, string>): string {
  let out = text;
  for (const [k, v] of Object.entries(vars)) {
    out = out.replace(new RegExp(`\\{${k}\\}`, "gi"), v);
  }
  return out;
}

function wrapNviteEmail(messageHtml: string, ctaUrl: string, unsubscribeUrl: string, trackingPixel: string): string {
  return emailLayout(`
    ${messageHtml}
    ${emailButton(ctaUrl, "Respond to this opportunity")}
    <p style="font-size:12px;color:#94a3b8;margin-top:32px">
      <a href="${unsubscribeUrl}" style="color:#94a3b8">Unsubscribe</a> from future NVites
    </p>
    <img src="${trackingPixel}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;border:0" />
  `);
}

async function canSendNvite(
  supabase: NonNullable<ReturnType<typeof getServiceClient>>,
  clientId: string,
): Promise<boolean> {
  const { data: client } = await supabase.from("clients").select("subscription_plan").eq("id", clientId).single();
  if (!client?.subscription_plan) return false;

  const { data: plan } = await supabase
    .from("subscription_plans")
    .select("features")
    .eq("name", client.subscription_plan)
    .maybeSingle();

  const features = (plan?.features ?? {}) as Record<string, boolean>;
  return features.can_send_nvite === true;
}

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const supabase = getServiceClient();
  if (!supabase) return jsonResponse({ error: "Database not configured" }, 503);

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return jsonResponse({ error: "Unauthorized" }, 401);

  const { data: { user } } = await supabase.auth.getUser(authHeader.slice(7));
  if (!user) return jsonResponse({ error: "Unauthorized" }, 401);

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, client_id, full_name, email")
    .eq("id", user.id)
    .single();

  if (!profile?.client_id) return jsonResponse({ error: "Not a recruiter account" }, 403);

  const body = (await req.json()) as SendNviteBody;
  const recruiterId = body.recruiter_id || profile.client_id;

  if (recruiterId !== profile.client_id) {
    return jsonResponse({ error: "Cannot send on behalf of another recruiter" }, 403);
  }

  const allowed = await canSendNvite(supabase, recruiterId);
  if (!allowed) {
    return jsonResponse({ error: "NVite is not available on your plan. Upgrade to send mass mail." }, 403);
  }

  const candidateIds = body.candidate_ids ?? [];
  if (!candidateIds.length) return jsonResponse({ error: "No candidates selected" }, 400);
  if (!body.subject?.trim()) return jsonResponse({ error: "Subject is required" }, 400);

  const { data: clientRow } = await supabase.from("clients").select("company_name").eq("id", recruiterId).single();
  const companyName = clientRow?.company_name || "Company";
  const recruiterName = profile.full_name || profile.email || "Recruiter";

  let jobTitle = "";
  if (body.job_id) {
    const { data: job } = await supabase.from("jobs").select("title").eq("id", body.job_id).single();
    jobTitle = job?.title || "";
  }

  const { data: campaign, error: campErr } = await supabase
    .from("nvite_campaigns")
    .insert({
      recruiter_id: recruiterId,
      job_id: body.job_id || null,
      subject: body.subject,
      message_template: body.message_html,
      questions: body.questions ?? [],
      scheduled_at: body.schedule_at || null,
      status: body.schedule_at ? "scheduled" : "sending",
    })
    .select("id")
    .single();

  if (campErr || !campaign) return jsonResponse({ error: campErr?.message || "Failed to create campaign" }, 500);

  if (body.schedule_at) {
    await supabase.from("nvite_scheduled").insert({
      campaign_id: campaign.id,
      recruiter_id: recruiterId,
      payload: body,
      schedule_at: body.schedule_at,
      status: "pending",
    });
    await supabase.from("nvite_campaigns").update({ status: "scheduled" }).eq("id", campaign.id);
    return jsonResponse({ sent: 0, failed: 0, scheduled: true, campaign_id: campaign.id, errors: [] });
  }

  const fnUrl = Deno.env.get("SUPABASE_URL");
  const trackingBase = fnUrl ? `${fnUrl}/functions/v1/track-nvite-open` : `${SITE}/api/track-nvite-open`;

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  const { data: candidates } = await supabase
    .from("applicants")
    .select("id, name, email, user_id, profile_visibility")
    .in("id", candidateIds);

  for (const candidate of candidates || []) {
    if (candidate.profile_visibility === "private") {
      failed++;
      errors.push(`${candidate.name || candidate.id}: profile is hidden`);
      continue;
    }
    if (!candidate.email) {
      failed++;
      errors.push(`${candidate.name || candidate.id}: no email`);
      continue;
    }

    const responseToken = crypto.randomUUID();
    const vars = {
      candidate_name: candidate.name || "Candidate",
      job_title: jobTitle || "the role",
      company_name: companyName,
      recruiter_name: recruiterName,
    };

    const subject = personalize(body.subject, vars);
    const messageHtml = personalize(body.message_html, vars);
    const respondUrl = `${SITE}/respond?token=${responseToken}`;
    const unsubscribeUrl = `${SITE}/unsubscribe?token=${responseToken}`;
    const trackingPixel = `${trackingBase}?token=${responseToken}`;
    const html = wrapNviteEmail(messageHtml, respondUrl, unsubscribeUrl, trackingPixel);

    const { error: insertErr } = await supabase.from("candidate_invites").insert({
      recruiter_id: recruiterId,
      candidate_id: candidate.id,
      job_id: body.job_id || null,
      campaign_id: campaign.id,
      subject,
      message_text: messageHtml,
      questions: body.questions ?? [],
      response_token: responseToken,
      sent_at: new Date().toISOString(),
    });

    if (insertErr) {
      failed++;
      errors.push(`${candidate.name}: ${insertErr.message}`);
      continue;
    }

    const emailResult = await sendEmail(candidate.email, subject, html, {
      replyTo: body.reply_to_email || profile.email || undefined,
    });

    if ("error" in emailResult) {
      failed++;
      errors.push(`${candidate.name}: ${emailResult.error}`);
      continue;
    }

    if (candidate.user_id) {
      await createNotification(
        supabase,
        candidate.user_id,
        subject,
        `${recruiterName} from ${companyName} sent you an opportunity.`,
        "nvite",
        respondUrl,
      );
    }

    sent++;
  }

  await supabase
    .from("nvite_campaigns")
    .update({
      total_sent: sent,
      sent_at: new Date().toISOString(),
      status: failed === candidateIds.length ? "failed" : "sent",
    })
    .eq("id", campaign.id);

  return jsonResponse({ sent, failed, errors, campaign_id: campaign.id });
});
