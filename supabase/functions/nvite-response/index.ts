import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { sendEmail, emailLayout, emailButton } from "../_shared/email.ts";
import { getServiceClient } from "../_shared/supabase-admin.ts";
import { createNotification } from "../_shared/notifications.ts";
import { corsHeaders, handleOptions, jsonResponse } from "../_shared/cors.ts";

const SITE = Deno.env.get("SITE_URL") || "https://ellurenexhire.com";

type Question = { question: string; type: "text" | "mcq"; options?: string[] };

function personalize(text: string, vars: Record<string, string>): string {
  let out = text;
  for (const [k, v] of Object.entries(vars)) {
    out = out.replace(new RegExp(`\\{${k}\\}`, "gi"), v);
  }
  return out;
}

async function verifyRecruiter(supabase: NonNullable<ReturnType<typeof getServiceClient>>, authHeader: string | null) {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, client_id, role, full_name, email")
    .eq("id", user.id)
    .single();

  if (!profile?.client_id || profile.role !== "client") return null;
  return { user, profile };
}

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  const supabase = getServiceClient();
  if (!supabase) return jsonResponse({ error: "Database not configured" }, 503);

  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (req.method === "GET" && token) {
    const { data: invite } = await supabase
      .from("candidate_invites")
      .select(`
        id, subject, message_text, questions, responded_at, response_token,
        jobs(id, title),
        clients:recruiter_id(company_name),
        applicants:candidate_id(name)
      `)
      .eq("response_token", token)
      .maybeSingle();

    if (!invite) return jsonResponse({ error: "Invite not found" }, 404);

    return jsonResponse({
      invite: {
        subject: invite.subject,
        message: invite.message_text,
        questions: invite.questions,
        responded: !!invite.responded_at,
        job_title: (invite.jobs as { title?: string } | null)?.title,
        company_name: (invite.clients as { company_name?: string } | null)?.company_name,
        candidate_name: (invite.applicants as { name?: string } | null)?.name,
      },
    });
  }

  if (req.method === "POST" && token && !req.headers.get("authorization")) {
    const body = await req.json();
    const answers = body?.answers ?? [];

    const { data: invite } = await supabase
      .from("candidate_invites")
      .select("id, campaign_id, recruiter_id, responded_at")
      .eq("response_token", token)
      .maybeSingle();

    if (!invite) return jsonResponse({ error: "Invite not found" }, 404);
    if (invite.responded_at) return jsonResponse({ error: "Already responded" }, 409);

    await supabase
      .from("candidate_invites")
      .update({ answers, responded_at: new Date().toISOString(), email_clicked_at: new Date().toISOString() })
      .eq("id", invite.id);

    if (invite.campaign_id) {
      const { data: camp } = await supabase.from("nvite_campaigns").select("total_responded").eq("id", invite.campaign_id).single();
      await supabase
        .from("nvite_campaigns")
        .update({ total_responded: (camp?.total_responded ?? 0) + 1 })
        .eq("id", invite.campaign_id);
    }

    const { data: profiles } = await supabase.from("profiles").select("id, email, full_name").eq("client_id", invite.recruiter_id);
    for (const p of profiles || []) {
      if (p.id) {
        await createNotification(supabase, p.id, "NVite response received", "A candidate responded to your NVite.", "nvite", `${SITE}/dashboard/client/nvite/campaigns`);
      }
      if (p.email) {
        await sendEmail(p.email, "NVite response received", emailLayout(`
          <p>Hi ${p.full_name || "there"},</p>
          <p>A candidate has responded to your NVite campaign.</p>
          ${emailButton(`${SITE}/dashboard/client/nvite/campaigns`, "View responses")}
        `));
      }
    }

    return jsonResponse({ success: true });
  }

  return jsonResponse({ error: "Invalid request" }, 400);
});
