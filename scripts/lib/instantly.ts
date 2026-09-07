/**
 * Instantly.ai API v2 client.
 *
 * Auth: `Authorization: Bearer <INSTANTLY_API_KEY>`
 * Base: https://api.instantly.ai/api/v2
 *
 * Only the endpoints the outreach pipeline needs are wrapped here:
 *   accounts (list), campaigns (list/get/create/activate), leads (create/list).
 */

const BASE = "https://api.instantly.ai/api/v2";

export interface InstantlyAccount {
  email: string;
  first_name?: string;
  last_name?: string;
  status: number; // 1 = active, 0 = paused, -1 = connection error, -2 = soft bounce error, -3 = sending error
  warmup_status: number; // 1 = active, 0 = paused, -1 = banned, -2 = spam folder, -3 = permanent suspension
  daily_limit?: number;
  provider_code?: number;
  organization?: string;
}

export interface InstantlyScheduleWindow {
  name: string;
  timing: { from: string; to: string };
  days: Record<string, boolean>;
  timezone: string;
}

export interface InstantlySequenceStep {
  type: "email";
  delay: number; // days after previous step
  variants: Array<{ subject: string; body: string; v_disabled?: boolean }>;
}

export interface InstantlyCampaign {
  id: string;
  name: string;
  status: number; // 0 draft, 1 active, 2 paused, 3 completed, 4 running subsequences, -99 account suspended, -1 accounts unhealthy, -2 bounce protect
  email_list?: string[];
  daily_limit?: number;
  custom_variables?: Record<string, boolean>;
  campaign_schedule?: { schedules: InstantlyScheduleWindow[] };
  sequences?: Array<{ steps: InstantlySequenceStep[] }>;
  timestamp_created?: string;
}

export interface CreateCampaignInput {
  name: string;
  campaign_schedule: { schedules: InstantlyScheduleWindow[] };
  sequences: Array<{ steps: InstantlySequenceStep[] }>;
  email_list: string[];
  daily_limit?: number;
  stop_on_reply?: boolean;
  stop_on_auto_reply?: boolean;
  link_tracking?: boolean;
  open_tracking?: boolean;
  text_only?: boolean;
  first_email_text_only?: boolean;
  email_gap?: number;
  random_wait_max?: number;
  insert_unsubscribe_header?: boolean;
  prioritize_new_leads?: boolean;
  stop_for_company?: boolean;
  pl_value?: number;
}

export interface CreateLeadInput {
  campaign: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  website?: string;
  phone?: string;
  custom_variables?: Record<string, string | number | boolean | null>;
  skip_if_in_workspace?: boolean;
  skip_if_in_campaign?: boolean;
  skip_if_in_list?: boolean;
  verify_leads_on_import?: boolean;
}

export interface InstantlyLead {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  campaign?: string;
  status?: number;
  email_reply_count?: number;
  email_open_count?: number;
  timestamp_last_reply?: string | null;
  timestamp_last_interest?: string | null;
  lt_interest_status?: number | null;
  payload?: Record<string, unknown>;
  custom_variables?: Record<string, unknown>;
  timestamp_created?: string;
}

export const CAMPAIGN_STATUS_LABEL: Record<number, string> = {
  0: "draft",
  1: "active",
  2: "paused",
  3: "completed",
  4: "running subsequences",
  [-99]: "account suspended",
  [-1]: "accounts unhealthy",
  [-2]: "bounce protect",
};

/** lt_interest_status values as used by Instantly's lead-interest labels. */
export const INTEREST_STATUS_LABEL: Record<number, string> = {
  0: "out of office",
  1: "interested",
  2: "meeting booked",
  3: "meeting completed",
  4: "closed",
  [-1]: "not interested",
  [-2]: "wrong person",
  [-3]: "lost",
};

export class InstantlyError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: string,
    message?: string
  ) {
    super(message ?? `Instantly ${status}: ${body.slice(0, 300)}`);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export class InstantlyClient {
  constructor(private readonly apiKey: string) {
    if (!apiKey) throw new Error("InstantlyClient: missing API key");
  }

  private async request<T>(
    method: "GET" | "POST" | "PATCH" | "DELETE",
    endpoint: string,
    body?: unknown,
    query?: Record<string, string | number | undefined>
  ): Promise<T> {
    const url = new URL(`${BASE}${endpoint}`);
    for (const [k, v] of Object.entries(query ?? {})) {
      if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
    }

    for (let attempt = 0; attempt < 4; attempt++) {
      const headers: Record<string, string> = { Authorization: `Bearer ${this.apiKey}`, Accept: "application/json" };
      if (body !== undefined) headers["Content-Type"] = "application/json";
      const res = await fetch(url, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      });

      if (res.status === 429 || res.status >= 500) {
        const wait = 2000 * (attempt + 1);
        await sleep(wait);
        continue;
      }

      const text = await res.text();
      if (!res.ok) throw new InstantlyError(res.status, text);
      return (text ? JSON.parse(text) : {}) as T;
    }

    throw new InstantlyError(429, "rate limited after retries");
  }

  // ── Accounts ─────────────────────────────────────────────────────────────

  async listAccounts(): Promise<InstantlyAccount[]> {
    const items: InstantlyAccount[] = [];
    let startingAfter: string | undefined;
    for (;;) {
      const page = await this.request<{ items: InstantlyAccount[]; next_starting_after?: string }>(
        "GET",
        "/accounts",
        undefined,
        { limit: 100, starting_after: startingAfter }
      );
      items.push(...(page.items ?? []));
      if (!page.next_starting_after || (page.items ?? []).length === 0) break;
      startingAfter = page.next_starting_after;
    }
    return items;
  }

  /**
   * Active, warmed sending accounts whose domain matches one of `domains`
   * (substring match, so "constructioncapital" matches both
   * theconstructioncapital.co.uk and myconstructioncapital.co.uk).
   */
  async listSendingAccounts(domains: string[]): Promise<InstantlyAccount[]> {
    const all = await this.listAccounts();
    const wanted = domains.map((d) => d.toLowerCase().trim()).filter(Boolean);
    return all.filter((a) => {
      if (a.status !== 1) return false;
      const domain = a.email.split("@")[1]?.toLowerCase() ?? "";
      return wanted.length === 0 || wanted.some((w) => domain.includes(w));
    });
  }

  // ── Campaigns ────────────────────────────────────────────────────────────

  async listCampaigns(): Promise<InstantlyCampaign[]> {
    const items: InstantlyCampaign[] = [];
    let startingAfter: string | undefined;
    for (;;) {
      const page = await this.request<{ items: InstantlyCampaign[]; next_starting_after?: string }>(
        "GET",
        "/campaigns",
        undefined,
        { limit: 100, starting_after: startingAfter }
      );
      items.push(...(page.items ?? []));
      if (!page.next_starting_after || (page.items ?? []).length === 0) break;
      startingAfter = page.next_starting_after;
    }
    return items;
  }

  getCampaign(id: string): Promise<InstantlyCampaign> {
    return this.request<InstantlyCampaign>("GET", `/campaigns/${id}`);
  }

  createCampaign(input: CreateCampaignInput): Promise<InstantlyCampaign> {
    return this.request<InstantlyCampaign>("POST", "/campaigns", input);
  }

  updateCampaign(id: string, patch: Partial<CreateCampaignInput>): Promise<InstantlyCampaign> {
    return this.request<InstantlyCampaign>("PATCH", `/campaigns/${id}`, patch);
  }

  activateCampaign(id: string): Promise<InstantlyCampaign> {
    return this.request<InstantlyCampaign>("POST", `/campaigns/${id}/activate`, {});
  }

  // ── Leads ────────────────────────────────────────────────────────────────

  createLead(input: CreateLeadInput): Promise<InstantlyLead> {
    return this.request<InstantlyLead>("POST", "/leads", {
      skip_if_in_workspace: true,
      skip_if_in_campaign: true,
      ...input,
    });
  }

  updateLead(id: string, patch: Partial<Omit<CreateLeadInput, "campaign">>): Promise<InstantlyLead> {
    return this.request<InstantlyLead>("PATCH", `/leads/${id}`, patch);
  }

  deleteLead(id: string): Promise<unknown> {
    return this.request<unknown>("DELETE", `/leads/${id}`);
  }

  /** Paginates POST /leads/list for a campaign. */
  async listLeads(campaignId: string, opts: { limit?: number } = {}): Promise<InstantlyLead[]> {
    const items: InstantlyLead[] = [];
    let startingAfter: string | undefined;
    for (;;) {
      const page = await this.request<{ items: InstantlyLead[]; next_starting_after?: string }>(
        "POST",
        "/leads/list",
        { campaign: campaignId, limit: opts.limit ?? 100, starting_after: startingAfter }
      );
      items.push(...(page.items ?? []));
      if (!page.next_starting_after || (page.items ?? []).length === 0) break;
      startingAfter = page.next_starting_after;
    }
    return items;
  }
}

/** Custom variables on a v2 lead live under `payload`; older exports used `custom_variables`. */
export function leadVariables(lead: InstantlyLead): Record<string, string> {
  const src = (lead.payload ?? lead.custom_variables ?? {}) as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(src)) {
    if (v === null || v === undefined) continue;
    if (typeof v === "object") continue;
    out[k] = String(v);
  }
  return out;
}
