export const DEFAULT_FROM = "Ellure TalentHub <noreply@ellurenexhire.com>";

export type SendEmailResult = { success: true; id?: string } | { error: string };

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  options?: { replyTo?: string; from?: string },
): Promise<SendEmailResult> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — email skipped");
    return { error: "Email service not configured" };
  }

  try {
    const payload: Record<string, unknown> = {
      from: options?.from || DEFAULT_FROM,
      to: [to],
      subject,
      html,
    };
    if (options?.replyTo) payload.reply_to = options.replyTo;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Resend error:", data);
      return { error: typeof data?.message === "string" ? data.message : "Failed to send email" };
    }
    return { success: true, id: data?.id };
  } catch (e) {
    console.error("sendEmail exception:", e);
    return { error: e instanceof Error ? e.message : "Failed to send email" };
  }
}

export function emailLayout(body: string, preheader?: string): string {
  const pre = preheader
    ? `<span style="display:none;max-height:0;overflow:hidden">${preheader}</span>`
    : "";
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:'Segoe UI',system-ui,sans-serif;line-height:1.6;color:#1a1a1a;max-width:560px;margin:0 auto;padding:24px;background:#f8fafc">
${pre}
<div style="background:#fff;border-radius:8px;padding:28px;box-shadow:0 1px 3px rgba(0,0,0,.08)">
  <div style="border-bottom:2px solid #0566CD;padding-bottom:14px;margin-bottom:24px">
    <strong style="font-size:20px;color:#3D4853">Ellure </strong><strong style="font-size:20px;color:#0566CD">TalentHub</strong>
  </div>
  ${body}
</div>
<p style="margin-top:24px;font-size:12px;color:#94a3b8;text-align:center">© Ellure TalentHub · <a href="https://ellurenexhire.com" style="color:#0566CD">ellurenexhire.com</a></p>
</body></html>`;
}

export function emailButton(href: string, label: string): string {
  return `<p style="margin:24px 0"><a href="${href}" style="display:inline-block;background:#0566CD;color:#fff;text-decoration:none;padding:12px 28px;border-radius:6px;font-weight:600">${label}</a></p>`;
}
