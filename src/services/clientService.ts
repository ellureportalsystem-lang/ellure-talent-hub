import { supabase } from "@/lib/supabase";
import {
  enrichSubscriptionPlan,
  fetchClientRecord,
  loadSubscriptionPlanByName,
  resolveCvDownloadLimit,
} from "@/services/clientPlanHelper";

/** Link profiles.client_id after clients row is created (signup / admin provision). */
export async function linkProfileToClient(
  userId: string,
  clientId: string,
  options?: { keepAdminRole?: boolean }
) {
  const patch: { client_id: string; role?: "client" } = { client_id: clientId };
  if (!options?.keepAdminRole) {
    patch.role = "client";
  }
  const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
  if (error) throw new Error(error.message);
}

export async function fetchClientByProfile(userId: string) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("client_id, full_name, email, role")
    .eq("id", userId)
    .single();

  if (!profile) return null;

  let clientId = profile.client_id as string | null;
  if (!clientId) {
    const { data: byUser } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    clientId = byUser?.id ?? null;
  }

  if (!clientId && profile.email) {
    const { data: byEmail } = await supabase
      .from("clients")
      .select("id")
      .eq("email", profile.email.trim().toLowerCase())
      .maybeSingle();
    clientId = byEmail?.id ?? null;
  }

  if (clientId && !profile.client_id) {
    await supabase.from("profiles").update({ client_id: clientId }).eq("id", userId);
  }

  if (!clientId) return null;

  const client = await fetchClientRecord(clientId);
  return { profile, client };
}

export async function fetchResdexApplicantProfile(applicantId: string) {
  const { data, error } = await supabase.rpc("get_resdex_applicant_profile", {
    p_applicant_id: applicantId,
  });
  if (error) throw new Error(error.message);
  if (!data) return null;
  return data as Record<string, unknown>;
}

export async function checkAndLogCvDownload(clientId: string, applicantId: string, downloadedBy: string) {
  const { data: allowed, error: checkErr } = await supabase.rpc("check_cv_download_limit", {
    p_client_id: clientId,
  });

  if (checkErr) throw new Error(checkErr.message);
  if (!allowed) return { allowed: false as const, remaining: 0 };

  await supabase.from("cv_download_log").insert({
    client_id: clientId,
    applicant_id: applicantId,
    downloaded_by: downloadedBy,
  });

  await supabase.from("client_applicant_access").upsert(
    {
      client_id: clientId,
      applicant_id: applicantId,
      granted_by: downloadedBy,
      created_at: new Date().toISOString(),
    },
    { onConflict: "client_id,applicant_id" }
  );

  const client = await fetchClientRecord(clientId);
  const used = ((client.cv_downloads_used_this_month as number) || 0) + 1;
  await supabase.from("clients").update({ cv_downloads_used_this_month: used }).eq("id", clientId);

  const limit = resolveCvDownloadLimit(client, client.subscription_plans);

  return { allowed: true as const, remaining: Math.max(0, limit - used) };
}

export async function fetchClientUnlockedApplicantIds(clientId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from("client_applicant_access")
    .select("applicant_id")
    .eq("client_id", clientId);
  if (error) throw new Error(error.message);
  return new Set((data ?? []).map((r) => r.applicant_id));
}

export async function fetchSavedSearches(clientId: string) {
  const { data, error } = await supabase
    .from("saved_searches")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function saveClientSearch(
  clientId: string,
  userId: string,
  name: string,
  query: string,
  filters: Record<string, unknown>
) {
  const client = await fetchClientRecord(clientId);
  const maxSaved = client.subscription_plans?.max_saved_searches ?? 10;

  const { count } = await supabase
    .from("saved_searches")
    .select("*", { count: "exact", head: true })
    .eq("client_id", clientId);

  if ((count || 0) >= maxSaved) {
    throw new Error(`Maximum ${maxSaved} saved searches allowed on your plan`);
  }

  const { data, error } = await supabase
    .from("saved_searches")
    .insert({
      client_id: clientId,
      created_by: userId,
      name,
      search_query: query,
      filters,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteSavedSearch(searchId: string) {
  const { error } = await supabase.from("saved_searches").delete().eq("id", searchId);
  if (error) throw new Error(error.message);
}

export async function updateSavedSearchLastRun(searchId: string) {
  const { error } = await supabase
    .from("saved_searches")
    .update({ last_run_at: new Date().toISOString() })
    .eq("id", searchId);
  if (error) throw new Error(error.message);
}

export async function countNewProfilesSinceLastRun(
  lastRunAt: string | null | undefined,
  searchQuery?: string
): Promise<number> {
  const since = lastRunAt || new Date(0).toISOString();
  let query = supabase
    .from("applicants")
    .select("*", { count: "exact", head: true })
    .gt("registration_date", since)
    .eq("status", "submitted");

  if (searchQuery?.trim()) {
    query = query.or(
      `name.ilike.%${searchQuery}%,key_skills.ilike.%${searchQuery}%,current_designation.ilike.%${searchQuery}%`
    );
  }

  const { count, error } = await query;
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function fetchSubscriptionPlans() {
  const { data, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("is_active", true)
    .order("price_monthly", { ascending: true });
  if (error) throw new Error(error.message);
  return (data || []).map((row) => enrichSubscriptionPlan(row as Record<string, unknown>));
}

export async function fetchSubscriptionTransactions(clientId: string) {
  const { data, error } = await supabase
    .from("subscription_transactions")
    .select("*, subscription_plans(name)")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function fetchTeamMembers(clientId: string) {
  const { data, error } = await supabase
    .from("client_team_members")
    .select("*, profiles(full_name, email)")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function inviteTeamMember(
  clientId: string,
  email: string,
  role: string,
  invitedBy: string
) {
  const { data: clientRow } = await supabase
    .from("clients")
    .select("company_name, subscription_plan")
    .eq("id", clientId)
    .single();

  const plan = await loadSubscriptionPlanByName(clientRow?.subscription_plan);
  const maxTeam = plan?.max_team_members ?? 5;
  const client = { company_name: clientRow?.company_name };

  const { count } = await supabase
    .from("client_team_members")
    .select("*", { count: "exact", head: true })
    .eq("client_id", clientId)
    .neq("status", "inactive");

  if ((count || 0) >= maxTeam) {
    throw new Error(`Team member limit (${maxTeam}) reached. Upgrade your plan.`);
  }

  const token = crypto.randomUUID();
  const { data, error } = await supabase
    .from("client_team_members")
    .insert({
      client_id: clientId,
      email: email.toLowerCase(),
      role,
      status: "invited",
      invited_by: invitedBy,
      invite_token: token,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  const inviteUrl = `${window.location.origin}/client/accept-invite?token=${token}`;
  await supabase.functions.invoke("send-email", {
    body: {
      to: email,
      subject: `Invitation to join ${client?.company_name || "Ellure TalentHub"}`,
      html: `<p>You've been invited to join the team. <a href="${inviteUrl}">Accept invitation</a></p>`,
    },
  }).catch(() => {
    console.warn("Invite email not sent — configure RESEND_API_KEY");
  });

  return data;
}

export async function acceptTeamInvite(token: string, userId: string) {
  const { data: invite, error } = await supabase
    .from("client_team_members")
    .select("*")
    .eq("invite_token", token)
    .eq("status", "invited")
    .single();

  if (error || !invite) throw new Error("Invalid or expired invitation");

  await supabase
    .from("client_team_members")
    .update({
      user_id: userId,
      status: "active",
      joined_at: new Date().toISOString(),
    })
    .eq("id", invite.id);

  await supabase
    .from("profiles")
    .update({ client_id: invite.client_id, role: "client" })
    .eq("id", userId);

  return invite;
}
