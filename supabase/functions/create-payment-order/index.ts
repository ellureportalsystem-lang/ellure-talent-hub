import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { jsonResponse, handleOptions } from "../_shared/cors.ts";

/** Payment gateway deferred — returns 501 until Razorpay is configured. */
Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  const keyId = Deno.env.get("RAZORPAY_KEY_ID");
  const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

  if (!keyId || !keySecret) {
    return jsonResponse({
      error: "Payment gateway not enabled. Contact admin to activate billing.",
      enabled: false,
    }, 501);
  }

  try {
    const { plan_id, client_id, billing_cycle, amount } = await req.json();
    const receipt = `rcpt_${client_id}_${Date.now()}`;
    const auth = btoa(`${keyId}:${keySecret}`);

    const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round((amount || 0) * 100),
        currency: "INR",
        receipt,
        notes: { plan_id, client_id, billing_cycle },
      }),
    });

    const order = await orderRes.json();
    if (!orderRes.ok) {
      return jsonResponse({ error: order }, 400);
    }

    return jsonResponse({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId,
    });
  } catch (e) {
    return jsonResponse({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
