import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { sendEmail } from "../_shared/email.ts";
import { corsHeaders, handleOptions, jsonResponse } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const body = await req.json();
    const to = body?.to as string | undefined;
    const subject = body?.subject as string | undefined;
    const html = body?.html as string | undefined;
    const replyTo = body?.replyTo as string | undefined;

    if (!to || !subject || !html) {
      return jsonResponse({ error: "Missing to, subject, or html" }, 400);
    }

    const result = await sendEmail(to, subject, html, replyTo);
    if ("error" in result) {
      return jsonResponse({ error: result.error }, 503);
    }
    return jsonResponse({ success: true });
  } catch (e) {
    console.error(e);
    return jsonResponse({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
