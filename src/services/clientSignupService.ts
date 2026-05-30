import { supabase } from "@/lib/supabase";
import { waitForOrEnsureProfile } from "@/services/profileService";

export interface ClientSignupDetails {
  companyName: string;
  contactPerson?: string;
  phone?: string;
}

export interface FinalizeClientResult {
  clientId: string;
  profileId: string;
}

/** Creates clients row + links profile (requires active session). */
export async function finalizeClientSignup(
  details: ClientSignupDetails
): Promise<{ data: FinalizeClientResult | null; error: string | null }> {
  const { data, error } = await supabase.rpc("finalize_client_signup", {
    p_company_name: details.companyName.trim(),
    p_contact_person: details.contactPerson?.trim() || null,
    p_phone: details.phone?.trim() || null,
  });

  if (error) return { data: null, error: error.message };

  const row = data as { client_id?: string; profile_id?: string } | null;
  if (!row?.client_id) {
    return { data: null, error: "Client account was not created" };
  }

  return {
    data: {
      clientId: row.client_id,
      profileId: row.profile_id || "",
    },
    error: null,
  };
}

export async function completeClientRegistration(
  userId: string,
  email: string,
  details: ClientSignupDetails,
  contactPerson?: string
): Promise<{ ok: boolean; error: string | null }> {
  const { profile, error: profileError } = await waitForOrEnsureProfile({
    userId,
    email,
    fullName: contactPerson,
    phone: details.phone,
    role: "client",
  });

  if (profileError || !profile) {
    return { ok: false, error: profileError || "Profile setup failed" };
  }

  const { error: finalizeError } = await finalizeClientSignup(details);
  if (finalizeError) {
    return { ok: false, error: finalizeError };
  }

  return { ok: true, error: null };
}
