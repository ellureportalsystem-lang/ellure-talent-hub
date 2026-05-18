import { createClient } from "jsr:@supabase/supabase-js@2";

export function getServiceClient() {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) {
    console.warn("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing");
    return null;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export type DbWebhookPayload = {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: Record<string, unknown>;
  old_record: Record<string, unknown> | null;
};

export function parseWebhook(req: Request): Promise<DbWebhookPayload | null> {
  return req.json().catch(() => null);
}
