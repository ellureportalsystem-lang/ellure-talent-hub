import { supabase } from "@/lib/supabase";

export async function fetchRecruiterNotes(recruiterId: string, applicantId: string) {
  const { data, error } = await supabase
    .from("recruiter_candidate_notes")
    .select("*, profiles(full_name)")
    .eq("recruiter_id", recruiterId)
    .eq("applicant_id", applicantId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function addRecruiterNote(
  recruiterId: string,
  applicantId: string,
  note: string,
  createdBy: string
) {
  const { data, error } = await supabase
    .from("recruiter_candidate_notes")
    .insert({ recruiter_id: recruiterId, applicant_id: applicantId, note, created_by: createdBy })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchRecruiterTags(recruiterId: string, applicantId: string) {
  const { data, error } = await supabase
    .from("recruiter_candidate_tags")
    .select("*")
    .eq("recruiter_id", recruiterId)
    .eq("applicant_id", applicantId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function addRecruiterTag(
  recruiterId: string,
  applicantId: string,
  tag: string,
  color = "blue"
) {
  const { data, error } = await supabase
    .from("recruiter_candidate_tags")
    .insert({ recruiter_id: recruiterId, applicant_id: applicantId, tag, color })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function removeRecruiterTag(tagId: string) {
  const { error } = await supabase.from("recruiter_candidate_tags").delete().eq("id", tagId);
  if (error) throw new Error(error.message);
}

export async function fetchRecruiterTagsForApplicants(recruiterId: string, applicantIds: string[]) {
  if (!applicantIds.length) return new Map<string, { tag: string; color: string }[]>();
  const { data } = await supabase
    .from("recruiter_candidate_tags")
    .select("applicant_id, tag, color")
    .eq("recruiter_id", recruiterId)
    .in("applicant_id", applicantIds);

  const map = new Map<string, { tag: string; color: string }[]>();
  for (const row of data ?? []) {
    const list = map.get(row.applicant_id) ?? [];
    list.push({ tag: row.tag, color: row.color ?? "blue" });
    map.set(row.applicant_id, list);
  }
  return map;
}

export async function fetchLastInviteForApplicant(recruiterId: string, applicantId: string) {
  const { data } = await supabase
    .from("candidate_invites")
    .select("sent_at")
    .eq("recruiter_id", recruiterId)
    .eq("candidate_id", applicantId)
    .order("sent_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data?.sent_at ?? null;
}
