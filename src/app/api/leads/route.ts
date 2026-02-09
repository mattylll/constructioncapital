import { NextResponse } from "next/server";
import { Resend } from "resend";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      project_location,
      project_postcode,
      gdv,
      total_cost,
      loan_amount,
      loan_type,
      project_type,
      units,
      additional_info,
      full_name,
      email,
      phone,
      company,
      source_page,
    } = body;

    // Validate required fields
    if (!full_name || !email || !phone || !loan_amount || !loan_type || !project_location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const notificationEmail = process.env.LEAD_NOTIFICATION_EMAIL;

    if (!resendApiKey || !notificationEmail) {
      console.error("Missing RESEND_API_KEY or LEAD_NOTIFICATION_EMAIL environment variables");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const resend = new Resend(resendApiKey);
    const submittedAt = new Date().toLocaleString("en-GB", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Europe/London",
    });

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Construction Capital <onboarding@resend.dev>",
      to: notificationEmail,
      subject: `New Lead: ${full_name} — ${loan_type} ${formatCurrency(loan_amount)}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a2e;">
          <div style="background: linear-gradient(135deg, #1a1a2e, #2d2d5e); padding: 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #c9a84c; margin: 0; font-size: 22px; font-weight: 700;">New Deal Room Enquiry</h1>
            <p style="color: rgba(255,255,255,0.6); margin: 8px 0 0; font-size: 14px;">${submittedAt}</p>
          </div>

          <div style="background: #ffffff; padding: 32px; border: 1px solid #e5e5e5; border-top: none;">
            <h2 style="font-size: 16px; color: #1a1a2e; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #c9a84c; padding-bottom: 8px;">Contact Details</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 14px; width: 140px;">Name</td>
                <td style="padding: 8px 0; font-size: 14px; font-weight: 600;">${full_name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 14px;">Email</td>
                <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #2d2d5e;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 14px;">Phone</td>
                <td style="padding: 8px 0; font-size: 14px;"><a href="tel:${phone}" style="color: #2d2d5e;">${phone}</a></td>
              </tr>
              ${company ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px;">Company</td><td style="padding: 8px 0; font-size: 14px;">${company}</td></tr>` : ""}
            </table>

            <h2 style="font-size: 16px; color: #1a1a2e; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #c9a84c; padding-bottom: 8px;">Deal Details</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 14px; width: 140px;">Loan Type</td>
                <td style="padding: 8px 0; font-size: 14px; font-weight: 600;">${loan_type}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 14px;">Loan Amount</td>
                <td style="padding: 8px 0; font-size: 14px; font-weight: 600;">${formatCurrency(loan_amount)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 14px;">GDV</td>
                <td style="padding: 8px 0; font-size: 14px;">${formatCurrency(gdv)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 14px;">Total Cost</td>
                <td style="padding: 8px 0; font-size: 14px;">${formatCurrency(total_cost)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 14px;">Location</td>
                <td style="padding: 8px 0; font-size: 14px;">${project_location}${project_postcode ? ` (${project_postcode})` : ""}</td>
              </tr>
              ${project_type ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px;">Project Type</td><td style="padding: 8px 0; font-size: 14px;">${project_type}</td></tr>` : ""}
              ${units ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px;">Units</td><td style="padding: 8px 0; font-size: 14px;">${units}</td></tr>` : ""}
            </table>

            ${additional_info ? `
            <h2 style="font-size: 16px; color: #1a1a2e; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #c9a84c; padding-bottom: 8px;">Additional Information</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 0 0 24px; padding: 16px; background: #f8f8fa; border-radius: 8px;">${additional_info}</p>
            ` : ""}

            <div style="padding: 16px; background: #f8f8fa; border-radius: 8px; font-size: 13px; color: #888;">
              <p style="margin: 0;">Source: ${source_page || "unknown"}</p>
            </div>
          </div>

          <div style="background: #1a1a2e; padding: 20px 32px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0;">Construction Capital — Deal Room Lead Notification</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit lead" },
      { status: 500 }
    );
  }
}
