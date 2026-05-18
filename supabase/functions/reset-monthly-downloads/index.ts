import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getServiceClient } from "../_shared/supabase-admin.ts";
import { jsonResponse, handleOptions } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  const supabase = getServiceClient();
  if (!supabase) return jsonResponse({ error: "Database not configured" }, 503);

  const { error } = await supabase.from("clients").update({ cv_downloads_used_this_month: 0 }).neq("subscription_status", "cancelled");
  if (error) return jsonResponse({ error: error.message }, 500);

  const { data: clients } = await supabase.from("clients").select("id").in("subscription_status", ["active", "trial"]);

  for (const c of clients || []) {
    const { data: profiles } = await supabase.from("profiles").select("id").eq("client_id", c.id);
    for (const p of profiles || []) {
      await supabase.rpc("create_notification", {
        p_user_id: p.id,
        p_title: "CV downloads reset",
        p_message: "Your CV download limit has been reset for this month.",
        p_type: "billing",
      }).catch(() => {});
    }
  }

  return jsonResponse({ success: true, clients: clients?.length || 0 });
});
