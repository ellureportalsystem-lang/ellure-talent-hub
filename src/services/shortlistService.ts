import { supabase } from "@/lib/supabase";

export interface ShortlistWithItems {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  is_shared: boolean | null;
  created_at: string | null;
  shortlist_items: { applicant_id: string; applicants: ApplicantSummary | null }[];
}

export interface ApplicantSummary {
  id: string;
  name: string;
  email: string;
  city: string | null;
  job_role: string | null;
  key_skills: string | null;
  current_designation: string | null;
  profile_complete_percent: number | null;
}

export async function fetchShortlists(ownerId: string, ownerType: "admin" | "client") {
  return supabase
    .from("shortlists")
    .select(
      `id, name, description, color, is_shared, created_at,
       shortlist_items(applicant_id, applicants(id, name, email, city, job_role, key_skills, current_designation, profile_complete_percent))`
    )
    .eq("owner_id", ownerId)
    .eq("owner_type", ownerType)
    .order("created_at", { ascending: false });
}

export async function createShortlist(
  ownerId: string,
  ownerType: "admin" | "client",
  name: string,
  description?: string,
  color?: string
) {
  return supabase
    .from("shortlists")
    .insert({ owner_id: ownerId, owner_type: ownerType, name, description, color: color ?? "blue" })
    .select()
    .single();
}

export async function deleteShortlist(id: string) {
  return supabase.from("shortlists").delete().eq("id", id);
}

export async function addApplicantToShortlist(shortlistId: string, applicantId: string) {
  return supabase.from("shortlist_items").insert({ shortlist_id: shortlistId, applicant_id: applicantId });
}

export async function removeApplicantFromShortlist(shortlistId: string, applicantId: string) {
  return supabase
    .from("shortlist_items")
    .delete()
    .eq("shortlist_id", shortlistId)
    .eq("applicant_id", applicantId);
}

export async function searchApplicantsForFolder(query: string, limit = 20) {
  let q = supabase
    .from("applicants")
    .select("id, name, email, city, job_role, key_skills, current_designation, profile_complete_percent")
    .eq("is_deleted", false)
    .limit(limit);
  if (query.trim()) {
    q = q.or(`name.ilike.%${query}%,email.ilike.%${query}%,key_skills.ilike.%${query}%`);
  }
  return q;
}
