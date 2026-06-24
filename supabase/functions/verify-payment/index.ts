import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { sendEmail, emailLayout, emailButton } from "../_shared/email.ts";
import { formatISTDate } from "../_shared/dates.ts";
import { jsonResponse, handleOptions } from "../_shared/cors.ts";

const SITE = Deno.env.get("SITE_URL") || "https://ellurenexhire.com";

async function hmacSha256(secret: string, body: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function invokeSendEmail(to: string, subject: string, html: string) {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return;
  await fetch(`${url}/functions/v1/send-email`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ to, subject, html }),
  }).catch((e) => console.warn("send-email invoke failed:", e));
}

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  if (!keySecret) {
    return jsonResponse({ error: "Payment gateway not enabled", enabled: false }, 501);
  }

  try {
    const body = await req.json();
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      plan_id,
      client_id,
      billing_cycle,
      amount,
    } = body;

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = await hmacSha256(keySecret, payload);

    if (expected !== razorpay_signature) {
      return jsonResponse({ error: "Invalid signature" }, 400);
    }

    const supabase = createClient(supabaseUrl, serviceKey);
    const days = billing_cycle === "yearly" ? 365 : 30;
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + days);

    const { data: plan } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("id", plan_id)
      .single();

    await supabase
      .from("clients")
      .update({
        subscription_plan: plan?.name || null,
        subscription_status: "active",
        subscription_start_date: start.toISOString(),
        subscription_end_date: end.toISOString(),
        max_cv_downloads_per_month: plan?.max_cv_downloads ?? null,
        max_job_postings: plan?.max_job_postings ?? null,
        is_active: true,
      })
      .eq("id", client_id);

    await supabase.from("subscription_transactions").insert({
      client_id,
      plan_id,
      amount: amount || 0,
      currency: "INR",
      status: "success",
      payment_id: razorpay_payment_id,
      period_start: start.toISOString(),
      period_end: end.toISOString(),
    });

    const { data: profiles } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("client_id", client_id)
      .limit(1);

    const profile = profiles?.[0];
    if (profile?.email) {
      const invoiceHtml = emailLayout(`
        <p>Hi ${profile.full_name || "there"},</p>
        <p>Thank you for your payment. Your <strong>${plan?.display_name || plan?.name || "subscription"}</strong> plan is now active.</p>
        <ul style="list-style:none;padding:0">
          <li>Amount: <strong>₹${amount || 0}</strong></li>
          <li>Valid from: <strong>${formatISTDate(start.toISOString())}</strong></li>
          <li>Valid until: <strong>${formatISTDate(end.toISOString())}</strong></li>
          <li>Payment ID: <code>${razorpay_payment_id}</code></li>
        </ul>
        ${emailButton(`${SITE}/dashboard/client/billing`, "View billing")}
      `, "Payment confirmation");
      await invokeSendEmail(profile.email, "Ellure TalentHub — Payment confirmation", invoiceHtml);
    }

    return jsonResponse({ ok: true });
  } catch (e) {
    return jsonResponse({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
