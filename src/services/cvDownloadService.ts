import { supabase } from "@/lib/supabase";
import { checkAndLogCvDownload } from "@/services/clientService";

export async function downloadCandidateCv(params: {
  clientId: string;
  applicantId: string;
  downloadedBy: string;
  resumeUrl?: string | null;
  fileName?: string;
}): Promise<{ ok: true } | { ok: false; limitReached: true } | { ok: false; error: string }> {
  const limitCheck = await checkAndLogCvDownload(params.clientId, params.applicantId, params.downloadedBy);
  if (!limitCheck.allowed) {
    return { ok: false, limitReached: true };
  }

  const { data, error } = await supabase.functions.invoke("get-cloudinary-url", {
    body: {
      client_id: params.clientId,
      applicant_id: params.applicantId,
      resume_url: params.resumeUrl,
    },
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  if (data?.limit_reached) {
    return { ok: false, limitReached: true };
  }
  if (data?.error) {
    return { ok: false, error: String(data.error) };
  }

  const signedUrl = data?.signed_url as string | undefined;
  if (!signedUrl) {
    return { ok: false, error: "Could not generate download URL" };
  }

  const link = document.createElement("a");
  link.href = signedUrl;
  link.download = params.fileName || "resume.pdf";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return { ok: true };
}
