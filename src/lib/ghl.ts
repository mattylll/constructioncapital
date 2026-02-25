const GHL_BASE = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";

// Max Capital Pipeline
const PIPELINE_ID = "MLI45UJOs037pZdAEK0P";
const ENQUIRY_STAGE_ID = "2b7de044-0bfe-4165-a9e6-ced7a8e54616";

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

interface LeadData {
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
}

/**
 * Upsert a contact in GHL (creates or updates based on email).
 * Returns the contact ID.
 */
async function upsertContact(lead: LeadData): Promise<string> {
  const locationId = getLocationId();
  const nameParts = lead.full_name.trim().split(/\s+/);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const tags = [
    "Website Lead",
    `Loan: ${lead.loan_type}`,
  ];
  if (lead.project_type) tags.push(`Project: ${lead.project_type}`);
  if (lead.source_page) tags.push(`Source: ${lead.source_page}`);
  if (lead.utm_source) tags.push(`UTM: ${lead.utm_source}`);

  // Build deal summary for the custom field
  const dealLines = [
    `Loan Type: ${lead.loan_type}`,
    `Loan Amount: ${formatGBP(lead.loan_amount)}`,
    `GDV: ${formatGBP(lead.gdv)}`,
    lead.total_cost ? `Total Cost: ${formatGBP(lead.total_cost)}` : null,
    `Location: ${lead.project_location}${lead.project_postcode ? ` (${lead.project_postcode})` : ""}`,
    lead.project_type ? `Project Type: ${lead.project_type}` : null,
    lead.units ? `Units: ${lead.units}` : null,
    lead.additional_info ? `\nAdditional Info:\n${lead.additional_info}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const body = {
    locationId,
    firstName,
    lastName,
    email: lead.email,
    phone: lead.phone,
    companyName: lead.company || undefined,
    address1: lead.project_location,
    postalCode: lead.project_postcode || undefined,
    tags,
    source: "Website - Deal Room",
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
 * Create an opportunity in the Max Capital Pipeline at the Enquiry stage.
 */
async function createOpportunity(
  contactId: string,
  lead: LeadData
): Promise<string> {
  const locationId = getLocationId();

  const name = `${lead.full_name} — ${lead.loan_type} ${formatGBP(lead.loan_amount)}`;

  const body = {
    pipelineId: PIPELINE_ID,
    locationId,
    name,
    status: "open",
    pipelineStageId: ENQUIRY_STAGE_ID,
    contactId,
    monetaryValue: lead.loan_amount,
    source: lead.source_page || "Website",
  };

  const res = await fetch(`${GHL_BASE}/opportunities/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GHL opportunity creation failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.opportunity?.id;
}

/**
 * Push a lead into GHL: creates/updates contact + creates opportunity.
 * Returns { contactId, opportunityId }.
 * Non-blocking — errors are logged but don't fail the lead submission.
 */
export async function pushLeadToGHL(
  lead: LeadData
): Promise<{ contactId?: string; opportunityId?: string }> {
  try {
    const contactId = await upsertContact(lead);
    if (!contactId) {
      console.error("GHL: contact upsert returned no ID");
      return {};
    }

    const opportunityId = await createOpportunity(contactId, lead);
    console.log(
      `GHL: Created contact ${contactId} + opportunity ${opportunityId}`
    );
    return { contactId, opportunityId };
  } catch (error) {
    console.error("GHL integration error:", error);
    return {};
  }
}
