import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/database.types";

export type UserRole = "applicant" | "admin" | "client";

export interface EnsureProfileInput {
  userId: string;
  email: string;
  fullName?: string;
  phone?: string;
  role?: UserRole;
}

const PROFILE_RETRY_MS = 500;
const PROFILE_MAX_ATTEMPTS = 12;

/** Wait for trigger-created profile, then RPC/manual fallback when session exists. */
export async function waitForOrEnsureProfile(
  input: EnsureProfileInput
): Promise<{ profile: Profile | null; error: string | null }> {
  const { userId, email, fullName, phone, role = "applicant" } = input;

  for (let attempt = 0; attempt < PROFILE_MAX_ATTEMPTS; attempt++) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (data) return { profile: data as Profile, error: null };
    if (error && error.code !== "PGRST116") {
      return { profile: null, error: error.message };
    }
    await new Promise((r) => setTimeout(r, PROFILE_RETRY_MS));
  }

  const { data: rpcProfile, error: rpcError } = await supabase.rpc("ensure_profile_from_auth");
  if (!rpcError && rpcProfile) {
    return { profile: rpcProfile as Profile, error: null };
  }

  const { data: inserted, error: insertError } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      email: email.trim().toLowerCase(),
      full_name: fullName || null,
      phone: phone || null,
      role,
    })
    .select()
    .single();

  if (inserted) return { profile: inserted as Profile, error: null };
  if (insertError) {
    const msg = rpcError?.message || insertError.message;
    return { profile: null, error: msg };
  }

  return { profile: null, error: "Profile could not be created" };
}
