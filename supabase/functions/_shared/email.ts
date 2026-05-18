const FROM = "Ellure NexHire <noreply@ellurenexhire.com>";

export type SendEmailResult = { success: true } | { error: string };

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  replyTo?: string,
): Promise<SendEmailResult> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — email skipped");
    return { error: "Email service not configured" };
  }

  try {
    const payload: Record<string, unknown> = {
      from: FROM,
      to: [to],
      subject,
      html,
    };
    if (replyTo) payload.reply_to = replyTo;

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
    return { success: true };
  } catch (e) {
    console.error("sendEmail exception:", e);
    return { error: e instanceof Error ? e.message : "Failed to send email" };
  }
}

export function emailLayout(body: string): string {
  return `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.6;color:#1a1a1a;max-width:560px;margin:0 auto;padding:24px">
    <div style="border-bottom:2px solid #0566cd;padding-bottom:12px;margin-bottom:24px">
      <strong style="font-size:18px;color:#0566cd">Ellure NexHire</strong>
    </div>
    ${body}
    <p style="margin-top:32px;font-size:12px;color:#666">© Ellure NexHire · <a href="https://ellurenexhire.com">ellurenexhire.com</a></p>
  </body></html>`;
}
