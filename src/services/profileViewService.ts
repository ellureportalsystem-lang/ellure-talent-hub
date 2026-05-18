import { supabase } from "@/lib/supabase";

export async function incrementProfileView(
  applicantId: string,
  viewerId: string,
  viewerType: "admin" | "client",
) {
  const { error } = await supabase.rpc("increment_profile_views", {
    p_applicant_id: applicantId,
    p_viewer_id: viewerId,
    p_viewer_type: viewerType,
  });
  if (error) {
    console.warn("increment_profile_views:", error.message);
    await supabase.from("profile_views").insert({
      applicant_id: applicantId,
      viewer_id: viewerId,
      viewer_type: viewerType,
      viewed_at: new Date().toISOString(),
    }).catch(() => {});
  }
}

export async function fetchApplicantProfileViews(applicantId: string, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from("profile_views")
    .select("id, viewed_at, viewer_type, viewer_id, profiles!profile_views_viewer_id_fkey(client_id, clients(company_name))")
    .eq("applicant_id", applicantId)
    .gte("viewed_at", since.toISOString())
    .order("viewed_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}
