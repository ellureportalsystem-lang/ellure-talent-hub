import { supabase } from "@/lib/supabase";

export async function fetchPublicApplicantCount(): Promise<number> {
  const { count, error } = await supabase
    .from("applicants")
    .select("*", { count: "exact", head: true })
    .eq("is_deleted", false);
  if (error) {
    console.warn("fetchPublicApplicantCount:", error.message);
    return 0;
  }
  return count || 0;
}
