import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getServiceClient } from "../_shared/supabase-admin.ts";
import { jsonResponse, handleOptions } from "../_shared/cors.ts";

// TODO: Replace with PDF generation when @react-pdf/renderer Edge Function is ready.

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const { transaction_id } = await req.json().catch(() => ({}));
  if (!transaction_id) return jsonResponse({ error: "transaction_id required" }, 400);

  const supabase = getServiceClient();
  if (!supabase) return jsonResponse({ error: "Database not configured" }, 503);

  const { data: txn, error } = await supabase
    .from("subscription_transactions")
    .select("*, clients(company_name, contact_email), subscription_plans(name)")
    .eq("id", transaction_id)
    .single();

  if (error || !txn) return jsonResponse({ error: error?.message || "Transaction not found" }, 404);

  const client = txn.clients as { company_name?: string; contact_email?: string } | null;
  const plan = txn.subscription_plans as { name?: string } | null;
  const invoiceNo = `INV-${String(txn.id).slice(0, 8).toUpperCase()}`;
  const date = txn.created_at ? new Date(String(txn.created_at)).toLocaleDateString("en-IN") : "—";
  const amount = Number(txn.amount || 0);
  const gst = Math.round(amount * 0.18);
  const total = amount + gst;

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice ${invoiceNo}</title>
<style>
body{font-family:system-ui,sans-serif;max-width:720px;margin:40px auto;padding:24px;color:#111}
.header{display:flex;justify-content:space-between;border-bottom:2px solid #0566cd;padding-bottom:16px;margin-bottom:24px}
.logo{font-size:22px;font-weight:700;color:#0566cd}
table{width:100%;border-collapse:collapse;margin:24px 0}
th,td{border:1px solid #ddd;padding:10px;text-align:left}
th{background:#f5f7fa}
.total{font-size:18px;font-weight:700;text-align:right;margin-top:16px}
</style></head><body>
<div class="header">
  <div class="logo">Ellure TalentHub</div>
  <div><strong>INVOICE</strong><br/>${invoiceNo}<br/>Date: ${date}</div>
</div>
<p><strong>Bill to:</strong><br/>${client?.company_name || "Client"}<br/>${client?.contact_email || ""}</p>
<table>
<tr><th>Description</th><th>Amount (INR)</th></tr>
<tr><td>${plan?.name || "Subscription"} — ${txn.billing_cycle || "monthly"}</td><td>₹${amount.toLocaleString("en-IN")}</td></tr>
<tr><td>GST (18%)</td><td>₹${gst.toLocaleString("en-IN")}</td></tr>
</table>
<p class="total">Total: ₹${total.toLocaleString("en-IN")}</p>
<p>Payment ID: ${txn.razorpay_payment_id || txn.id}<br/>Status: ${txn.status}</p>
<p style="font-size:12px;color:#666;margin-top:40px">Ellure TalentHub · This is a computer-generated invoice.</p>
</body></html>`;

  return jsonResponse({ html, invoiceNo });
});

