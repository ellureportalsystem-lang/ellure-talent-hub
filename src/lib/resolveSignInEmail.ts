import { supabase } from "@/lib/supabase";

export function normalizeLoginEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Last 10 digits for Indian numbers; full digits otherwise. */
export function normalizePhoneDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

/**
 * Resolve the email stored on the account when the user types an alias
 * (e.g. applicants.email_address vs auth email on profiles).
 */
export async function resolveSignInEmail(rawEmail: string): Promise<string> {
  const normalized = normalizeLoginEmail(rawEmail);
  if (!normalized) return normalized;

  const { data: profile } = await supabase
    .from("profiles")
    .select("email")
    .ilike("email", normalized)
    .maybeSingle();

  if (profile?.email) {
    return normalizeLoginEmail(profile.email);
  }

  const { data: applicant } = await supabase
    .from("applicants")
    .select("email_address, email")
    .or(`email_address.ilike.${normalized},email.ilike.${normalized}`)
    .maybeSingle();

  const applicantEmail = applicant?.email_address || applicant?.email;
  if (applicantEmail) {
    return normalizeLoginEmail(applicantEmail);
  }

  return normalized;
}

/** Find auth email for password login via phone (profiles + applicants). */
export async function resolveEmailFromPhone(
  rawPhone: string
): Promise<{ email: string } | { error: string }> {
  const last10 = normalizePhoneDigits(rawPhone);
  if (!last10 || last10.length < 10) {
    return { error: "Enter a valid 10-digit phone number" };
  }

  const pattern = `%${last10}`;

  const { data: profiles } = await supabase
    .from("profiles")
    .select("email, phone")
    .ilike("phone", pattern)
    .limit(5);

  const profileEmails = (profiles ?? [])
    .map((p) => p.email)
    .filter((e): e is string => Boolean(e));

  if (profileEmails.length === 1) {
    return { email: normalizeLoginEmail(profileEmails[0]) };
  }
  if (profileEmails.length > 1) {
    return { error: "Multiple accounts match this phone. Sign in with email instead." };
  }

  const { data: applicants } = await supabase
    .from("applicants")
    .select("email_address, email, user_id")
    .or(`mobile_number.ilike.${pattern},phone.ilike.${pattern}`)
    .limit(5);

  if (!applicants?.length) {
    return { error: "No account found with this phone number" };
  }

  const emails = applicants
    .map((a) => a.email_address || a.email)
    .filter((e): e is string => Boolean(e))
    .map(normalizeLoginEmail);

  const unique = [...new Set(emails)];
  if (unique.length === 1) {
    return { email: unique[0] };
  }
  if (unique.length > 1) {
    return { error: "Multiple accounts match this phone. Sign in with email instead." };
  }

  const userId = applicants[0]?.user_id;
  if (userId) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .maybeSingle();
    if (profile?.email) {
      return { email: normalizeLoginEmail(profile.email) };
    }
  }

  return { error: "No email associated with this phone number" };
}
