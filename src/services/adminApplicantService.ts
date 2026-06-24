import { supabase } from "@/lib/supabase";

export async function softDeleteApplicants(
  applicantIds: string[],
  actorId?: string | null
): Promise<{ ok: boolean; error?: string }> {
  if (!applicantIds.length) return { ok: false, error: "No applicants selected" };

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("applicants")
    .update({ is_deleted: true, updated_at: now })
    .in("id", applicantIds);

  if (error) return { ok: false, error: error.message };

  const { error: auditError } = await supabase.from("audit_logs").insert({
    action: "applicant_soft_delete",
    entity_type: "applicant",
    entity_id: applicantIds.length === 1 ? applicantIds[0] : `bulk-${applicantIds.length}`,
    actor_id: actorId ?? null,
    new_data: { applicant_ids: applicantIds, count: applicantIds.length },
  });

  if (auditError) console.warn("audit log:", auditError.message);

  return { ok: true };
}

export function openApplicantResume(url: string | null | undefined, fileName?: string) {
  if (!url?.trim()) return false;
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  if (fileName) link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
}
