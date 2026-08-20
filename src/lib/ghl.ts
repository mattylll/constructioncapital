const GHL_BASE = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";

// Max Capital Pipeline
const DEFAULT_PIPELINE_ID = "MLI45UJOs037pZdAEK0P";
const DEFAULT_ENQUIRY_STAGE_ID = "2b7de044-0bfe-4165-a9e6-ced7a8e54616";

type LeadKind =
  | "borrower"
  | "introducer"
  | "planning_outreach"
  | "content_lead"
  | "quick_enquiry";

function getHeaders() {
  const token = process.env.GHL_API_KEY;
  if (!token) throw new Error("GHL_API_KEY environment variable not set");
  
return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
    Version: GHL_VERSION,
  };
}

function getLocationId() {
  const id = process.env.GHL_LOCATION_ID;
  if (!id) throw new Error("GHL_LOCATION_ID environment variable not set");
  
return id;
}

function formatGBP(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export interface LeadData {
  full_name: string;
  email: string;
  phone: string;
  company?: string;
  project_location: string;
  project_postcode?: string;
  project_type?: string;
  units?: number;
  gdv: number;
  total_cost: number;
  loan_amount: number;
  loan_type: string;
  additional_info?: string;
  source_page?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  facility_size?: number;
  fee_rate?: number;
  expected_fee?: number;
  probability?: number;
  pipeline_stage?: string;
  lead_source?: string;
  product_stack?: string[];
  planning_reference?: string;
  article_url?: string;
  lender_shortlist?: string[];
  expected_close_month?: string;
  next_action_at?: number;
  owner?: string;
  lead_kind?: LeadKind;
}

function classifyLead(lead: LeadData): LeadKind {
  if (
    lead.lead_kind ||
    lead.product_stack?.includes("introducer_programme") ||
    lead.lead_source === "referral_partner"
  ) {
    return lead.lead_kind ?? "introducer";
  }
  if (lead.lead_source === "planning_outreach" || lead.source_page?.includes("Planning Data")) {
    return "planning_outreach";
  }
  if (lead.loan_amount === 0 && lead.loan_type.includes("Quick Enquiry")) {
    return "quick_enquiry";
  }
  if (lead.lead_source === "seo" || lead.utm_source || lead.source_page?.startsWith("/guides")) {
    return "content_lead";
  }

  return "borrower";
}

function getPipelineId(lead: LeadData): string {
  const kind = classifyLead(lead);
  if (kind === "introducer") {
    return (
      process.env.GHL_INTRODUCER_PIPELINE_ID ||
      process.env.GHL_PIPELINE_ID ||
      DEFAULT_PIPELINE_ID
    );
  }

  return process.env.GHL_PIPELINE_ID || DEFAULT_PIPELINE_ID;
}

function getStageId(lead: LeadData): string {
  const kind = classifyLead(lead);
  const stageByKind: Record<LeadKind, string | undefined> = {
    borrower: process.env.GHL_BORROWER_STAGE_ID,
    introducer: process.env.GHL_INTRODUCER_STAGE_ID,
    planning_outreach: process.env.GHL_PLANNING_OUTREACH_STAGE_ID,
    content_lead: process.env.GHL_CONTENT_LEAD_STAGE_ID,
    quick_enquiry: process.env.GHL_QUICK_ENQUIRY_STAGE_ID,
  };

  return (
    stageByKind[kind] ||
    process.env.GHL_ENQUIRY_STAGE_ID ||
    DEFAULT_ENQUIRY_STAGE_ID
  );
}

function getGhlSource(lead: LeadData): string {
  const kind = classifyLead(lead);
  if (kind === "introducer") return "Website - Introducer Programme";
  if (kind === "planning_outreach") return "Planning Outreach";
  if (kind === "quick_enquiry") return "Website - Quick Enquiry";
  if (lead.utm_source) return `Website - ${lead.utm_source}`;

  return "Website - Deal Room";
}

/**
 * Upsert a contact in GHL (creates or updates based on email).
 * Returns the contact ID.
 */
async function upsertContact(
  lead: LeadData,
  extraTags: string[] = []
): Promise<string> {
  const locationId = getLocationId();
  const nameParts = lead.full_name.trim().split(/\s+/);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const tags = [
    "Construction Capital",
    `CC Type: ${classifyLead(lead)}`,
    "Website Lead",
    `Loan: ${lead.loan_type}`,
    ...extraTags,
  ];
  if (lead.project_type) tags.push(`Project: ${lead.project_type}`);
  if (lead.source_page) tags.push(`Source: ${lead.source_page}`);
  if (lead.utm_source) tags.push(`UTM: ${lead.utm_source}`);
  if (lead.lead_source) tags.push(`CC Source: ${lead.lead_source}`);
  if (lead.pipeline_stage) tags.push(`CC Stage: ${lead.pipeline_stage}`);
  if (lead.planning_reference) tags.push("Planning Trigger");
  if (lead.product_stack?.includes("introducer_programme")) {
    tags.push("Introducer Programme");
  }

  // Build deal summary for the custom field
  const dealLines = [
    `Loan Type: ${lead.loan_type}`,
    `Loan Amount: ${formatGBP(lead.loan_amount)}`,
    lead.expected_fee ? `Expected 1% Fee: ${formatGBP(lead.expected_fee)}` : null,
    lead.probability ? `Probability: ${Math.round(lead.probability * 100)}%` : null,
    lead.pipeline_stage ? `Pipeline Stage: ${lead.pipeline_stage}` : null,
    lead.lead_source ? `Lead Source: ${lead.lead_source}` : null,
    `GHL Lead Type: ${classifyLead(lead)}`,
    lead.expected_close_month ? `Expected Close Month: ${lead.expected_close_month}` : null,
    lead.owner ? `Owner: ${lead.owner}` : null,
    `GDV: ${formatGBP(lead.gdv)}`,
    lead.total_cost ? `Total Cost: ${formatGBP(lead.total_cost)}` : null,
    `Location: ${lead.project_location}${lead.project_postcode ? ` (${lead.project_postcode})` : ""}`,
    lead.project_type ? `Project Type: ${lead.project_type}` : null,
    lead.units ? `Units: ${lead.units}` : null,
    lead.product_stack?.length ? `Product Stack: ${lead.product_stack.join(", ")}` : null,
    lead.planning_reference ? `Planning Reference: ${lead.planning_reference}` : null,
    lead.article_url ? `Article URL: ${lead.article_url}` : null,
    lead.lender_shortlist?.length ? `Lender Shortlist: ${lead.lender_shortlist.join(", ")}` : null,
    lead.additional_info ? `\nAdditional Info:\n${lead.additional_info}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const body = {
    locationId,
    firstName,
    lastName,
    email: lead.email,
    phone: lead.phone || undefined,
    companyName: lead.company || undefined,
    address1: lead.project_location,
    postalCode: lead.project_postcode || undefined,
    tags,
    source: getGhlSource(lead),
    customFields: [
      {
        key: "contact.project_description",
        field_value: dealLines,
      },
    ],
  };

  const res = await fetch(`${GHL_BASE}/contacts/upsert`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GHL contact upsert failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  
return data.contact?.id;
}

/**
 * Create an opportunity in the configured GHL pipeline/stage.
 */
async function createOpportunity(
  contactId: string,
  lead: LeadData
): Promise<string> {
  const locationId = getLocationId();

  const kind = classifyLead(lead);
  const displayValue =
    (lead.facility_size ?? lead.loan_amount) > 0
      ? ` ${formatGBP(lead.facility_size ?? lead.loan_amount)}`
      : "";
  const name =
    kind === "introducer"
      ? `Introducer - ${lead.company || lead.full_name}`
      : `${lead.full_name} - ${lead.loan_type}${displayValue}`;

  const body = {
    pipelineId: getPipelineId(lead),
    locationId,
    name,
    status: "open",
    pipelineStageId: getStageId(lead),
    contactId,
    monetaryValue: lead.facility_size ?? lead.loan_amount,
    source: getGhlSource(lead),
  };

  const res = await fetch(`${GHL_BASE}/opportunities/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();

    // GHL refuses a second open opportunity on the same contact. This is the
    // "quick enquiry first, full application second" journey — the warmest
    // leads. Upgrade the existing opportunity instead of dropping the deal.
    if (res.status === 400 && text.includes("duplicate opportunity")) {
      let existingId: string | undefined;
      try {
        existingId = JSON.parse(text)?.meta?.existingId;
      } catch {
        // fall through to the throw below
      }
      if (existingId) {
        const updateRes = await fetch(
          `${GHL_BASE}/opportunities/${existingId}`,
          {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify({
              name,
              monetaryValue: lead.facility_size ?? lead.loan_amount,
              source: getGhlSource(lead),
            }),
          }
        );
        if (!updateRes.ok) {
          const updateText = await updateRes.text();
          throw new Error(
            `GHL opportunity update failed (${updateRes.status}): ${updateText}`
          );
        }
        console.log(`GHL: Updated existing opportunity ${existingId}`);

        return existingId;
      }
    }

    throw new Error(`GHL opportunity creation failed (${res.status}): ${text}`);
  }

  const data = await res.json();

return data.opportunity?.id;
}

export interface PartialLeadData {
  email: string;
  project_location?: string;
  project_postcode?: string;
  project_type?: string;
  units?: number;
  gdv?: number;
  total_cost?: number;
  loan_amount?: number;
  loan_type?: string;
  additional_info?: string;
  source_page?: string;
  lead_source?: string;
}

/**
 * Capture an in-progress Deal Room form as a contact-only upsert (no
 * opportunity). The visitor gave their email on step 1 with explicit "so
 * Matt can save your progress" microcopy — this is that promise being kept,
 * plus a chase list for abandoned applications. The eventual full submit
 * upserts the same email so nothing duplicates.
 */
export async function pushPartialLeadToGHL(
  partial: PartialLeadData,
  step: number
): Promise<GhlPushResult> {
  const lead: LeadData = {
    full_name: partial.email.split("@")[0],
    email: partial.email,
    phone: "",
    project_location: partial.project_location || "TBC",
    project_postcode: partial.project_postcode,
    project_type: partial.project_type,
    units: partial.units,
    lead_source: partial.lead_source,
    gdv: partial.gdv ?? 0,
    total_cost: partial.total_cost ?? 0,
    loan_amount: partial.loan_amount ?? 0,
    loan_type: partial.loan_type || "TBC - Partial Application",
    additional_info: partial.additional_info,
    source_page: partial.source_page,
    lead_kind: "borrower",
  };

  try {
    const contactId = await upsertContact(lead, [
      `Partial - Deal Room Step ${step}`,
    ]);
    if (!contactId) {
      return { ok: false, error: "contact upsert returned no ID" };
    }
    console.log(`GHL: Saved partial lead (step ${step}) contact ${contactId}`);

    return { ok: true, contactId };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      JSON.stringify({ event: "ghl_partial_failed", error: message, lead_email: partial.email })
    );

    return { ok: false, error: message };
  }
}

export type GhlPushResult =
  | { ok: true; contactId: string; opportunityId?: string }
  | { ok: false; error: string };

/**
 * Push a lead into GHL: creates/updates contact + creates/updates opportunity.
 * Never throws — returns a discriminated result so callers can decide how to
 * respond (e.g. still 200 if the email sink worked, alert Matt if not).
 */
export async function pushLeadToGHL(lead: LeadData): Promise<GhlPushResult> {
  try {
    const contactId = await upsertContact(lead);
    if (!contactId) {
      console.error(
        JSON.stringify({ event: "ghl_push_failed", error: "contact upsert returned no ID", lead_email: lead.email })
      );

      return { ok: false, error: "contact upsert returned no ID" };
    }

    const opportunityId = await createOpportunity(contactId, lead);
    console.log(
      `GHL: Created contact ${contactId} + opportunity ${opportunityId}`
    );

    return { ok: true, contactId, opportunityId };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      JSON.stringify({ event: "ghl_push_failed", error: message, lead_email: lead.email })
    );

    return { ok: false, error: message };
  }
}
