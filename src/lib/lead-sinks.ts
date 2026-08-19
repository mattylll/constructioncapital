import { Resend } from "resend";
import { pushLeadToGHL, type GhlPushResult , LeadData } from "@/lib/ghl";

export interface LeadDelivery {
  /** true if at least one sink (CRM or email) accepted the lead */
  delivered: boolean;
  ghl: GhlPushResult;
  emailSent: boolean;
}

/**
 * Deliver a lead to both sinks: GHL CRM first, then the notification email.
 * The email is sent regardless of the CRM outcome — and when the CRM push
 * failed, the subject is prefixed with a loud banner so a dead token or API
 * change surfaces in Matt's inbox within one lead instead of silently
 * dropping enquiries behind a success screen.
 */
export async function deliverLead(
  lead: LeadData,
  email: { subject: string; html: string }
): Promise<LeadDelivery> {
  const ghl = await pushLeadToGHL(lead);

  let emailSent = false;
  const resendApiKey = process.env.RESEND_API_KEY;
  const notificationEmail = process.env.LEAD_NOTIFICATION_EMAIL;

  if (resendApiKey && notificationEmail) {
    try {
      const resend = new Resend(resendApiKey);
      const subject = ghl.ok
        ? email.subject
        : `⚠ GHL FAILED — ${email.subject}`;
      const html = ghl.ok
        ? email.html
        : `<div style="background:#b91c1c;color:#fff;padding:12px 16px;border-radius:8px;margin-bottom:16px;font-family:sans-serif;font-size:14px;"><strong>CRM push failed</strong> — this lead is NOT in GoHighLevel. Error: ${escapeHtml(ghl.ok === false ? ghl.error : "")}. Follow up manually from this email.</div>${email.html}`;

      await resend.emails.send({
        from:
          process.env.RESEND_FROM_EMAIL ||
          "Construction Capital <onboarding@resend.dev>",
        to: notificationEmail,
        subject,
        html,
      });
      emailSent = true;
    } catch (emailError) {
      console.error(
        JSON.stringify({
          event: "resend_failed",
          error:
            emailError instanceof Error
              ? emailError.message
              : String(emailError),
          lead_email: lead.email,
        })
      );
    }
  }

  return { delivered: ghl.ok || emailSent, ghl, emailSent };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
