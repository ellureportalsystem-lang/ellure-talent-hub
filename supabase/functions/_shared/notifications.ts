import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";

export async function createNotification(
  supabase: SupabaseClient,
  userId: string,
  title: string,
  body: string,
  type: string,
  link?: string,
): Promise<void> {
  await supabase.rpc("create_notification", {
    p_user_id: userId,
    p_title: title,
    p_body: body,
    p_type: type,
    p_link: link ?? null,
  }).catch((e) => console.warn("create_notification failed:", e));
}
