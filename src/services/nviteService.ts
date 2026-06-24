import { supabase } from "@/lib/supabase";

export type NviteQuestion = {
  question: string;
  type: "text" | "mcq";
  options?: string[];
};

export type SendNvitePayload = {
  recruiter_id: string;
  candidate_ids: string[];
  job_id?: string | null;
  subject: string;
  message_html: string;
  questions?: NviteQuestion[];
  schedule_at?: string | null;
  reply_to_email?: string | null;
};

export type SendNviteResult = {
  sent: number;
  failed: number;
  errors: string[];
  campaign_id?: string;
  scheduled?: boolean;
};

export async function sendNviteCampaign(payload: SendNvitePayload): Promise<SendNviteResult> {
  const { data, error } = await supabase.functions.invoke("send-nvite", { body: payload });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(String(data.error));
  return data as SendNviteResult;
}

export type NviteCampaignRow = {
  id: string;
  subject: string;
  message_template: string;
  total_sent: number;
  total_opened: number;
  total_responded: number;
  sent_at: string | null;
  scheduled_at: string | null;
  status: string;
  created_at: string;
  job_id: string | null;
  jobs?: { title: string } | null;
};

export async function fetchNviteCampaigns(clientId: string) {
  const { data, error } = await supabase
    .from("nvite_campaigns")
    .select("*, jobs(title)")
    .eq("recruiter_id", clientId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as NviteCampaignRow[];
}

export type NviteInviteRow = {
  id: string;
  candidate_id: string;
  sent_at: string | null;
  email_opened_at: string | null;
  responded_at: string | null;
  answers: unknown;
  applicants?: { name: string; email: string } | null;
};

export async function fetchCampaignInvites(campaignId: string) {
  const { data, error } = await supabase
    .from("candidate_invites")
    .select("id, candidate_id, sent_at, email_opened_at, responded_at, answers, applicants(name, email)")
    .eq("campaign_id", campaignId)
    .order("sent_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as NviteInviteRow[];
}

export async function fetchCandidateInviteStatus(clientId: string, applicantIds: string[]) {
  if (!applicantIds.length) return new Map<string, { sent_at: string }>();
  const { data } = await supabase
    .from("candidate_invites")
    .select("candidate_id, sent_at")
    .eq("recruiter_id", clientId)
    .in("candidate_id", applicantIds)
    .order("sent_at", { ascending: false });

  const map = new Map<string, { sent_at: string }>();
  for (const row of data ?? []) {
    if (!map.has(row.candidate_id) && row.sent_at) {
      map.set(row.candidate_id, { sent_at: row.sent_at });
    }
  }
  return map;
}

export async function fetchDownloadedApplicantIds(clientId: string, applicantIds: string[]) {
  if (!applicantIds.length) return new Set<string>();
  const { data } = await supabase
    .from("cv_download_log")
    .select("applicant_id")
    .eq("client_id", clientId)
    .in("applicant_id", applicantIds);
  return new Set((data ?? []).map((r) => r.applicant_id));
}
