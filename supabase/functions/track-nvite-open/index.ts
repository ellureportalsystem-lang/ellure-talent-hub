import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders, handleOptions, jsonResponse } from "../_shared/cors.ts";

const PIXEL = Uint8Array.from(
  atob("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"),
  (c) => c.charCodeAt(0),
);

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (token) {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (supabaseUrl && serviceKey) {
      const { createClient } = await import("jsr:@supabase/supabase-js@2");
      const supabase = createClient(supabaseUrl, serviceKey);

      const { data: invite } = await supabase
        .from("candidate_invites")
        .select("id, campaign_id, email_opened_at")
        .eq("response_token", token)
        .maybeSingle();

      if (invite && !invite.email_opened_at) {
        await supabase
          .from("candidate_invites")
          .update({ email_opened_at: new Date().toISOString() })
          .eq("id", invite.id);

        if (invite.campaign_id) {
          const { data: camp } = await supabase
            .from("nvite_campaigns")
            .select("total_opened")
            .eq("id", invite.campaign_id)
            .single();
          await supabase
            .from("nvite_campaigns")
            .update({ total_opened: (camp?.total_opened ?? 0) + 1 })
            .eq("id", invite.campaign_id);
        }
      }
    }
  }

  return new Response(PIXEL, {
    headers: {
      ...corsHeaders,
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
});
