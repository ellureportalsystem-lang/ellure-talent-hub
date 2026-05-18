import { supabase } from "@/lib/supabase";

export async function fetchClientByProfile(userId: string) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("client_id, full_name, email")
    .eq("id", userId)
    .single();

  if (!profile?.client_id) return null;

  const { data: client, error } = await supabase
    .from("clients")
    .select("*, subscription_plans(*)")
    .eq("id", profile.client_id)
    .single();

  if (error) throw new Error(error.message);
  return { profile, client };
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

  const { data: client } = await supabase
    .from("clients")
    .select("cv_downloads_used_this_month, subscription_plans(cv_downloads_per_month)")
    .eq("id", clientId)
    .single();

  const used = (client?.cv_downloads_used_this_month || 0) + 1;
  await supabase.from("clients").update({ cv_downloads_used_this_month: used }).eq("id", clientId);

  const limit = (client as { subscription_plans?: { cv_downloads_per_month?: number } })
    ?.subscription_plans?.cv_downloads_per_month ?? 100;

  return { allowed: true as const, remaining: Math.max(0, limit - used) };
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
  const { data: client } = await supabase
    .from("clients")
    .select("subscription_plans(max_saved_searches)")
    .eq("id", clientId)
    .single();

  const maxSaved = (client as { subscription_plans?: { max_saved_searches?: number } })
    ?.subscription_plans?.max_saved_searches ?? 10;

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

export async function fetchSubscriptionPlans() {
  const { data, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("is_active", true)
    .order("price_monthly", { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
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
  const { data: client } = await supabase
    .from("clients")
    .select("company_name, subscription_plans(max_team_members)")
    .eq("id", clientId)
    .single();

  const maxTeam = (client as { subscription_plans?: { max_team_members?: number } })
    ?.subscription_plans?.max_team_members ?? 5;

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
      subject: `Invitation to join ${client?.company_name || "Ellure NexHire"}`,
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
