import { NextResponse } from "next/server";
import { Resend } from "resend";
import { pushLeadToGHL } from "@/lib/ghl";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { full_name, email, phone, message, source_page } = body;

    if (!full_name || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Push to GHL as a quick enquiry
    await pushLeadToGHL({
      full_name,
      email,
      phone,
      project_location: "TBC",
      gdv: 0,
      total_cost: 0,
      loan_amount: 0,
      loan_type: "TBC - Quick Enquiry",
      additional_info: message || undefined,
      source_page: source_page || "Quick Enquiry",
    });

    // Send email notification if Resend is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    const notificationEmail = process.env.LEAD_NOTIFICATION_EMAIL;

    if (resendApiKey && notificationEmail) {
      try {
        const resend = new Resend(resendApiKey);
        const submittedAt = new Date().toLocaleString("en-GB", {
          dateStyle: "full",
          timeStyle: "short",
          timeZone: "Europe/London",
        });

        await resend.emails.send({
          from:
            process.env.RESEND_FROM_EMAIL ||
            "Construction Capital <onboarding@resend.dev>",
          to: notificationEmail,
          subject: `Quick Enquiry: ${full_name}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a2e;">
              <div style="background: linear-gradient(135deg, #1a1a2e, #2d2d5e); padding: 32px; border-radius: 12px 12px 0 0;">
                <h1 style="color: #c9a84c; margin: 0; font-size: 22px; font-weight: 700;">Quick Enquiry</h1>
                <p style="color: rgba(255,255,255,0.6); margin: 8px 0 0; font-size: 14px;">${submittedAt}</p>
              </div>
              <div style="background: #ffffff; padding: 32px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 8px 0; color: #666; font-size: 14px; width: 100px;">Name</td><td style="padding: 8px 0; font-size: 14px; font-weight: 600;">${full_name}</td></tr>
                  <tr><td style="padding: 8px 0; color: #666; font-size: 14px;">Email</td><td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #2d2d5e;">${email}</a></td></tr>
                  <tr><td style="padding: 8px 0; color: #666; font-size: 14px;">Phone</td><td style="padding: 8px 0; font-size: 14px;"><a href="tel:${phone}" style="color: #2d2d5e;">${phone}</a></td></tr>
                </table>
                ${message ? `<div style="margin-top: 20px; padding: 16px; background: #f8f8fa; border-radius: 8px;"><p style="margin: 0 0 4px; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.05em;">Message</p><p style="margin: 0; font-size: 14px; line-height: 1.6; color: #333;">${message}</p></div>` : ""}
                <div style="margin-top: 20px; font-size: 13px; color: #888;"><p style="margin: 0;">Source: ${source_page || "unknown"}</p></div>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Email notification failed (non-blocking):", emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Quick enquiry error:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}
