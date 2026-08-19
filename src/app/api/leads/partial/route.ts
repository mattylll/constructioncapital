import { NextResponse } from "next/server";
import { pushPartialLeadToGHL } from "@/lib/ghl";

/**
 * Saves an in-progress Deal Room application as a contact-only CRM upsert.
 * Fire-and-forget from the client on step transitions — never blocks the
 * form, never emails (a weekly check of the "Partial - Deal Room" tags in
 * GHL is the chase list).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, step } = body;

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }
    const stepNum = Number(step);
    if (!Number.isInteger(stepNum) || stepNum < 1 || stepNum > 3) {
      return NextResponse.json({ error: "Invalid step" }, { status: 400 });
    }

    const result = await pushPartialLeadToGHL(
      {
        email: email.trim(),
        project_location: str(body.project_location),
        project_postcode: str(body.project_postcode),
        project_type: str(body.project_type),
        units: num(body.units),
        gdv: num(body.gdv),
        total_cost: num(body.total_cost),
        loan_amount: num(body.loan_amount),
        loan_type: str(body.loan_type),
        additional_info: str(body.additional_info),
        source_page: str(body.source_page),
        lead_source: str(body.lead_source),
      },
      stepNum
    );

    // Partial capture is best-effort; a CRM hiccup shouldn't surface to the
    // visitor mid-form. The failure is already logged for inspection.
    return NextResponse.json({ success: result.ok });
  } catch (error) {
    console.error("Partial lead error:", error);

    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim().slice(0, 500) : undefined;
}

function num(v: unknown): number | undefined {
  const n = Number(v);

  return Number.isFinite(n) && n > 0 ? n : undefined;
}
