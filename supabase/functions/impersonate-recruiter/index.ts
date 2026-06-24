import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { jsonResponse, handleOptions } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const siteUrl = Deno.env.get("SITE_URL") || "https://ellurenexhire.com";

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return jsonResponse({ error: "Unauthorized" }, 401);

  const supabase = createClient(supabaseUrl, serviceKey);
  const { data: { user: caller } } = await supabase.auth.getUser(authHeader.slice(7));
  if (!caller) return jsonResponse({ error: "Unauthorized" }, 401);

  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", caller.id)
    .single();

  if (callerProfile?.role !== "admin") {
    return jsonResponse({ error: "Admin access required" }, 403);
  }

  const { recruiter_user_id } = await req.json();
  if (!recruiter_user_id) return jsonResponse({ error: "recruiter_user_id required" }, 400);

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, full_name, client_id")
    .eq("id", recruiter_user_id)
    .single();

  if (!profile?.email) return jsonResponse({ error: "Recruiter profile not found" }, 404);

  const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email: profile.email,
    options: { redirectTo: `${siteUrl}/dashboard/client` },
  });

  if (linkErr || !linkData) {
    return jsonResponse({ error: linkErr?.message || "Failed to generate link" }, 500);
  }

  const magicLink =
    linkData.properties?.action_link ||
    (linkData as { action_link?: string }).action_link ||
    null;

  return jsonResponse({
    magic_link: magicLink,
    recruiter_name: profile.full_name,
    recruiter_email: profile.email,
  });
});
