import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { jsonResponse, handleOptions } from "../_shared/cors.ts";

const MAX_ATTEMPTS = 3;
const WINDOW_SECONDS = 15 * 60;

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const redisUrl = Deno.env.get("UPSTASH_REDIS_REST_URL") || Deno.env.get("UPSTASH_REDIS_URL");
  const redisToken = Deno.env.get("UPSTASH_REDIS_REST_TOKEN") || Deno.env.get("UPSTASH_REDIS_TOKEN");

  if (!redisUrl || !redisToken) {
    return jsonResponse({ blocked: false, attempts: 0, retry_after_seconds: 0, fallback: true });
  }

  try {
    const { ip, action } = await req.json();
    if (!ip || !action) return jsonResponse({ error: "Missing ip or action" }, 400);

    const key = `rate_limit:${action}:${ip}`;

    const incrRes = await fetch(`${redisUrl}/incr/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${redisToken}` },
    });
    const incrData = await incrRes.json();
    const count = Number(incrData?.result ?? 1);

    if (count === 1) {
      await fetch(`${redisUrl}/expire/${encodeURIComponent(key)}/${WINDOW_SECONDS}`, {
        headers: { Authorization: `Bearer ${redisToken}` },
      });
    }

    const ttlRes = await fetch(`${redisUrl}/ttl/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${redisToken}` },
    });
    const ttlData = await ttlRes.json();
    const retryAfter = Math.max(0, Number(ttlData?.result ?? WINDOW_SECONDS));

    const blocked = count > MAX_ATTEMPTS;

    return jsonResponse({
      blocked,
      attempts: count,
      retry_after_seconds: blocked ? retryAfter : 0,
    });
  } catch (e) {
    console.error("rate limit error:", e);
    return jsonResponse({ blocked: false, attempts: 0, retry_after_seconds: 0, fallback: true });
  }
});
