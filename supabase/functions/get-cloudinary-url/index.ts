import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { jsonResponse, handleOptions } from "../_shared/cors.ts";

function extractPublicId(resumeUrl: string): string | null {
  if (!resumeUrl) return null;
  try {
    const u = new URL(resumeUrl);
    if (u.hostname.includes("cloudinary.com")) {
      const parts = u.pathname.split("/");
      const uploadIdx = parts.indexOf("upload");
      if (uploadIdx >= 0) {
        let rest = parts.slice(uploadIdx + 1);
        if (rest[0]?.startsWith("v")) rest = rest.slice(1);
        const joined = rest.join("/");
        return joined.replace(/\.[^/.]+$/, "") || joined;
      }
    }
    if (resumeUrl.startsWith("ellure/")) return resumeUrl.replace(/\.[^/.]+$/, "");
  } catch {
    /* fall through */
  }
  return resumeUrl.includes("/") ? resumeUrl.replace(/\.[^/.]+$/, "") : null;
}

async function signCloudinaryUrl(publicId: string, resourceType: "raw" | "image", expiresAt: number): Promise<string | null> {
  const cloudName = Deno.env.get("CLOUDINARY_CLOUD_NAME");
  const apiSecret = Deno.env.get("CLOUDINARY_API_SECRET");
  if (!cloudName || !apiSecret) return null;

  const toSign = `public_id=${publicId}&timestamp=${expiresAt}${apiSecret}`;
  const hashBuffer = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(toSign));
  const signature = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const apiKey = Deno.env.get("CLOUDINARY_API_KEY") || "";
  const base = `https://res.cloudinary.com/${cloudName}/${resourceType}/upload`;
  return `${base}/s--${signature.slice(0, 8)}--/fl_attachment/${publicId}?expires_at=${expiresAt}&signature=${signature}&api_key=${apiKey}`;
}

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return jsonResponse({ error: "Unauthorized" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const { createClient } = await import("jsr:@supabase/supabase-js@2");
  const supabase = createClient(supabaseUrl, serviceKey);

  const { data: { user } } = await supabase.auth.getUser(authHeader.slice(7));
  if (!user) return jsonResponse({ error: "Unauthorized" }, 401);

  const { resume_url, applicant_id, client_id } = await req.json();
  if (!resume_url && !applicant_id) return jsonResponse({ error: "resume_url or applicant_id required" }, 400);

  let url = resume_url as string | undefined;
  if (!url && applicant_id) {
    const { data: app } = await supabase.from("applicants").select("resume_file").eq("id", applicant_id).single();
    url = app?.resume_file || undefined;
  }

  if (!url) return jsonResponse({ error: "No resume on file" }, 404);

  if (client_id) {
    const { data: allowed } = await supabase.rpc("check_cv_download_limit", { p_client_id: client_id });
    if (!allowed) return jsonResponse({ error: "CV download limit reached", limit_reached: true }, 403);
  }

  if (url.includes("cloudinary.com") || url.startsWith("ellure/")) {
    const publicId = extractPublicId(url);
    if (!publicId) return jsonResponse({ error: "Could not parse Cloudinary URL" }, 400);

    const expiresAt = Math.floor(Date.now() / 1000) + 60;
    const signed = await signCloudinaryUrl(publicId, "raw", expiresAt);

    if (signed) {
      return jsonResponse({ signed_url: signed, expires_in: 60, provider: "cloudinary" });
    }

    return jsonResponse({ signed_url: url, expires_in: 60, provider: "cloudinary_public" });
  }

  return jsonResponse({ signed_url: url, expires_in: 60, provider: "direct" });
});
