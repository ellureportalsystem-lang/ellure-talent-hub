import { supabase } from "@/lib/supabase";
import { fetchClientByProfile } from "@/services/clientService";
import type { Profile } from "@/types/database.types";

export type PortalKind = "admin" | "client" | "applicant";

export interface PortalAccessResult {
  ok: boolean;
  profile: Profile | null;
  message?: string;
  redirectPath?: string;
}

/** Load or create profile for the active session. */
export async function ensureProfileForSession(): Promise<Profile | null> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", auth.user.id)
    .maybeSingle();

  if (existing) return existing as Profile;

  const { data: ensured, error } = await supabase.rpc("ensure_profile_from_auth");
  if (!error && ensured) return ensured as Profile;

  const { data: retry } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", auth.user.id)
    .maybeSingle();

  return (retry as Profile) ?? null;
}

export async function validatePortalAccess(
  profile: Profile,
  portal: PortalKind
): Promise<PortalAccessResult> {
  if (portal === "admin") {
    if (profile.role === "admin") {
      return { ok: true, profile, redirectPath: "/dashboard/admin" };
    }
    const portalHint =
      profile.role === "client"
        ? "This email is set up as a client. Use Client Login instead."
        : profile.role === "applicant"
          ? "This email is an applicant account. Use Applicant Login instead."
          : "This account does not have admin access.";
    return {
      ok: false,
      profile,
      message: portalHint,
      redirectPath:
        profile.role === "client"
          ? "/client/auth/login"
          : profile.role === "applicant"
            ? "/auth/applicant"
            : undefined,
    };
  }

  if (portal === "client") {
    const clientCtx = await fetchClientByProfile(profile.id);
    if (profile.role === "client" || (profile.role === "admin" && clientCtx)) {
      if (!clientCtx) {
        return {
          ok: false,
          profile,
          message:
            "Client company profile is missing. Finish client signup or contact support.",
        };
      }
      return { ok: true, profile, redirectPath: "/dashboard/client" };
    }
    if (profile.role === "admin") {
      return {
        ok: false,
        profile,
        message:
          "Admin account has no linked client company. Use Admin Login, or complete client signup with this email.",
        redirectPath: "/admin/auth/login",
      };
    }
    return {
      ok: false,
      profile,
      message:
        profile.role === "applicant"
          ? "This email is an applicant account. Use Applicant Login."
          : "No client access for this account.",
      redirectPath: profile.role === "applicant" ? "/auth/applicant" : undefined,
    };
  }

  if (profile.role === "applicant") {
    return { ok: true, profile, redirectPath: "/dashboard/applicant" };
  }
  if (profile.role === "admin") {
    return {
      ok: false,
      profile,
      message: "This email is an admin account. Use Admin Login instead.",
      redirectPath: "/admin/auth/login",
    };
  }
  if (profile.role === "client") {
    return {
      ok: false,
      profile,
      message: "This email is a client account. Use Client Login instead.",
      redirectPath: "/client/auth/login",
    };
  }

  return { ok: false, profile, message: "Unknown account type." };
}
