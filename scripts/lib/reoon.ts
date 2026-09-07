/**
 * Reoon Email Verifier client. Every address is verified in POWER mode
 * (SMTP inbox check) before it is pushed to Instantly.
 *
 * Env: REOON_API_KEY
 * Docs: https://www.reoon.com/email-verifier/api/
 *
 * Power-mode statuses: safe, invalid, disabled, disposable, inbox_full,
 * catch_all, role_account, spamtrap, unknown.
 */

const BASE = "https://emailverifier.reoon.com/api/v1";

export interface ReoonResult {
  email: string;
  status: string;
  is_safe_to_send?: boolean;
  is_deliverable?: boolean;
  is_catch_all?: boolean;
  is_disposable?: boolean;
  is_role_account?: boolean;
  is_disabled?: boolean;
  is_spamtrap?: boolean;
  has_inbox_full?: boolean;
  mx_accepts_mail?: boolean;
  overall_score?: number;
  verification_mode?: string;
  error?: string;
}

export type VerificationVerdict = "send" | "send_catch_all" | "reject";

export interface Verification {
  email: string;
  verdict: VerificationVerdict;
  status: string;
  score: number | null;
  reason: string;
  raw: ReoonResult | null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export class ReoonClient {
  readonly usage = { verified: 0, safe: 0, catchAll: 0, rejected: 0, errors: 0 };
  private readonly retrying = new Set<string>();

  constructor(
    private readonly apiKey: string,
    private readonly opts: { allowCatchAll: boolean } = { allowCatchAll: true }
  ) {
    if (!apiKey) throw new Error("ReoonClient: missing API key");
  }

  async balance(): Promise<{ remaining_daily_credits?: number; remaining_instant_credits?: number } | null> {
    try {
      const res = await fetch(`${BASE}/check-account-balance/?key=${encodeURIComponent(this.apiKey)}`);
      return res.ok ? ((await res.json()) as { remaining_daily_credits?: number; remaining_instant_credits?: number }) : null;
    } catch {
      return null;
    }
  }

  async verify(email: string, mode: "power" | "quick" = "power"): Promise<Verification> {
    const clean = email.trim().toLowerCase();
    let raw: ReoonResult | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const url = `${BASE}/verify?email=${encodeURIComponent(clean)}&key=${encodeURIComponent(this.apiKey)}&mode=${mode}`;
        const res = await fetch(url, { signal: AbortSignal.timeout(90_000) });
        if (res.status === 429 || res.status >= 500) {
          await sleep(3000 * (attempt + 1));
          continue;
        }
        raw = (await res.json()) as ReoonResult;
        break;
      } catch (err) {
        if (attempt === 2) {
          this.usage.errors++;
          return { email: clean, verdict: "reject", status: "error", score: null, reason: `verifier error: ${(err as Error).message}`, raw: null };
        }
        await sleep(2000);
      }
    }
    if (!raw) {
      this.usage.errors++;
      return { email: clean, verdict: "reject", status: "error", score: null, reason: "verifier unavailable", raw: null };
    }
    if (raw.error) {
      this.usage.errors++;
      return { email: clean, verdict: "reject", status: "error", score: null, reason: `verifier error: ${raw.error}`, raw };
    }

    // "unknown" usually means the mail server timed out or greylisted us; one retry
    // after a pause resolves most of them. Still unknown after that = reject.
    if ((raw.status ?? "unknown") === "unknown" && mode === "power" && !this.retrying.has(clean)) {
      this.retrying.add(clean);
      await sleep(8000);
      const second = await this.verify(clean, mode);
      this.retrying.delete(clean);
      return second;
    }

    this.usage.verified++;
    const status = raw.status ?? "unknown";
    const score = typeof raw.overall_score === "number" ? raw.overall_score : null;

    if (status === "safe" || raw.is_safe_to_send === true) {
      this.usage.safe++;
      return { email: clean, verdict: "send", status, score, reason: "safe to send", raw };
    }
    if (status === "catch_all" || raw.is_catch_all) {
      if (this.opts.allowCatchAll && !raw.is_disabled && !raw.is_disposable && !raw.is_spamtrap) {
        this.usage.catchAll++;
        return { email: clean, verdict: "send_catch_all", status, score, reason: "catch-all domain, inbox unconfirmed", raw };
      }
      this.usage.rejected++;
      return { email: clean, verdict: "reject", status, score, reason: "catch-all domain (excluded)", raw };
    }
    if (status === "inbox_full") {
      this.usage.rejected++;
      return { email: clean, verdict: "reject", status, score, reason: "inbox full", raw };
    }
    this.usage.rejected++;
    return { email: clean, verdict: "reject", status, score, reason: status.replace(/_/g, " "), raw };
  }
}
