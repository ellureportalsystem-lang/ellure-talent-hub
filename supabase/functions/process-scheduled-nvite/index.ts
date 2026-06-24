import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getServiceClient } from "../_shared/supabase-admin.ts";
import { jsonResponse, handleOptions } from "../_shared/cors.ts";

/** Cron: process scheduled NVite campaigns whose schedule_at has passed. */
Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  const supabase = getServiceClient();
  if (!supabase) return jsonResponse({ error: "Database not configured" }, 503);

  const now = new Date().toISOString();
  const { data: pending } = await supabase
    .from("nvite_scheduled")
    .select("id, payload, campaign_id, recruiter_id")
    .eq("status", "pending")
    .lte("schedule_at", now)
    .limit(20);

  const fnUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  let processed = 0;

  for (const row of pending || []) {
    if (!fnUrl || !serviceKey) break;

    const res = await fetch(`${fnUrl}/functions/v1/send-nvite`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...(row.payload as Record<string, unknown>), schedule_at: null }),
    });

    await supabase
      .from("nvite_scheduled")
      .update({ status: res.ok ? "sent" : "failed", processed_at: new Date().toISOString() })
      .eq("id", row.id);

    if (res.ok) processed++;
  }

  return jsonResponse({ success: true, processed });
});
