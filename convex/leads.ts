import { mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { Resend } from "resend";

export const submit = mutation({
  args: {
    project_location: v.string(),
    project_postcode: v.optional(v.string()),
    gdv: v.number(),
    total_cost: v.number(),
    loan_amount: v.number(),
    loan_type: v.string(),
    project_type: v.optional(v.string()),
    units: v.optional(v.number()),
    additional_info: v.optional(v.string()),
    full_name: v.string(),
    email: v.string(),
    phone: v.string(),
    company: v.optional(v.string()),
    source_page: v.string(),
    utm_source: v.optional(v.string()),
    utm_medium: v.optional(v.string()),
    utm_campaign: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("leads", {
      ...args,
      submitted_at: Date.now(),
      status: "new",
    });

    await ctx.scheduler.runAfter(0, api.leads.notifyNewLead, {
      leadId: id,
      full_name: args.full_name,
      email: args.email,
      phone: args.phone,
      company: args.company,
      loan_amount: args.loan_amount,
      loan_type: args.loan_type,
      project_location: args.project_location,
      project_postcode: args.project_postcode,
      project_type: args.project_type,
      gdv: args.gdv,
      total_cost: args.total_cost,
      units: args.units,
      additional_info: args.additional_info,
      source_page: args.source_page,
    });

    return id;
  },
});

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const notifyNewLead = action({
  args: {
    leadId: v.id("leads"),
    full_name: v.string(),
    email: v.string(),
    phone: v.string(),
    company: v.optional(v.string()),
    loan_amount: v.number(),
    loan_type: v.string(),
    project_location: v.string(),
    project_postcode: v.optional(v.string()),
    project_type: v.optional(v.string()),
    gdv: v.number(),
    total_cost: v.number(),
    units: v.optional(v.number()),
    additional_info: v.optional(v.string()),
    source_page: v.string(),
  },
  handler: async (_ctx, args) => {
    // Send email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const notificationEmail = process.env.LEAD_NOTIFICATION_EMAIL;

    if (resendApiKey && notificationEmail) {
      const resend = new Resend(resendApiKey);
      const submittedAt = new Date().toLocaleString("en-GB", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Europe/London",
      });

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Construction Capital <leads@resend.dev>",
        to: notificationEmail,
        subject: `New Lead: ${args.full_name} — ${args.loan_type} ${formatCurrency(args.loan_amount)}`,
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
                  <td style="padding: 8px 0; font-size: 14px; font-weight: 600;">${args.full_name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">Email</td>
                  <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${args.email}" style="color: #2d2d5e;">${args.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">Phone</td>
                  <td style="padding: 8px 0; font-size: 14px;"><a href="tel:${args.phone}" style="color: #2d2d5e;">${args.phone}</a></td>
                </tr>
                ${args.company ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px;">Company</td><td style="padding: 8px 0; font-size: 14px;">${args.company}</td></tr>` : ""}
              </table>

              <h2 style="font-size: 16px; color: #1a1a2e; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #c9a84c; padding-bottom: 8px;">Deal Details</h2>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px; width: 140px;">Loan Type</td>
                  <td style="padding: 8px 0; font-size: 14px; font-weight: 600;">${args.loan_type}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">Loan Amount</td>
                  <td style="padding: 8px 0; font-size: 14px; font-weight: 600;">${formatCurrency(args.loan_amount)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">GDV</td>
                  <td style="padding: 8px 0; font-size: 14px;">${formatCurrency(args.gdv)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">Total Cost</td>
                  <td style="padding: 8px 0; font-size: 14px;">${formatCurrency(args.total_cost)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">Location</td>
                  <td style="padding: 8px 0; font-size: 14px;">${args.project_location}${args.project_postcode ? ` (${args.project_postcode})` : ""}</td>
                </tr>
                ${args.project_type ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px;">Project Type</td><td style="padding: 8px 0; font-size: 14px;">${args.project_type}</td></tr>` : ""}
                ${args.units ? `<tr><td style="padding: 8px 0; color: #666; font-size: 14px;">Units</td><td style="padding: 8px 0; font-size: 14px;">${args.units}</td></tr>` : ""}
              </table>

              ${args.additional_info ? `
              <h2 style="font-size: 16px; color: #1a1a2e; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #c9a84c; padding-bottom: 8px;">Additional Information</h2>
              <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 0 0 24px; padding: 16px; background: #f8f8fa; border-radius: 8px;">${args.additional_info}</p>
              ` : ""}

              <div style="padding: 16px; background: #f8f8fa; border-radius: 8px; font-size: 13px; color: #888;">
                <p style="margin: 0;">Source: ${args.source_page}</p>
              </div>
            </div>

            <div style="background: #1a1a2e; padding: 20px 32px; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0;">Construction Capital — Deal Room Lead Notification</p>
            </div>
          </div>
        `,
      });
    }

    // Optional webhook (kept for Zapier/Make integrations)
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: args.leadId,
          full_name: args.full_name,
          email: args.email,
          phone: args.phone,
          loan_amount: args.loan_amount,
          loan_type: args.loan_type,
          project_location: args.project_location,
          submitted_at: new Date().toISOString(),
        }),
      });
    }
  },
});
