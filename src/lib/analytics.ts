/**
 * GA4 Event Tracking Utilities
 *
 * Typed helpers for sending custom events to Google Analytics.
 * Only fires in production when GA is loaded.
 */

type GTagEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: string | number | undefined;
};

function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
   
  const w = window as any;
  if (typeof w.gtag === "function") {
    w.gtag(...args);
  }
}

/** Send a custom event to GA4 */
export function trackEvent({ action, category, label, value, ...rest }: GTagEvent) {
  gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
    ...rest,
  });
}

// ─── Deal Room Form Tracking ──────────────────────────────

export function trackDealRoomStep(step: number, direction: "forward" | "back") {
  trackEvent({
    action: "deal_room_step",
    category: "lead_generation",
    label: `step_${step}`,
    value: step,
    direction,
  });
}

export function trackDealRoomSubmit(
  loanType: string,
  loanAmount: number,
  source?: string
) {
  trackEvent({
    action: "deal_room_submit",
    category: "lead_generation",
    label: loanType,
    value: loanAmount,
    source: source || "direct",
  });
  trackEvent({
    action: "qualify_lead",
    category: "lead_generation",
    label: "borrower_deal_room",
    value: loanAmount,
    currency: "GBP",
    lead_type: "borrower",
    loan_type: loanType,
    source: source || "direct",
  });
}

export function trackDealRoomPrefill(source: string) {
  trackEvent({
    action: "deal_room_prefill",
    category: "lead_generation",
    label: source,
  });
}

export function trackFormStart(form: "quick_enquiry" | "deal_room") {
  trackEvent({
    action: "form_start",
    category: "lead_generation",
    label: form,
  });
}

export function trackFormAbandon(form: "quick_enquiry" | "deal_room", lastStep: number) {
  trackEvent({
    action: "form_abandon",
    category: "lead_generation",
    label: form,
    value: lastStep,
  });
}

export function trackFormPartialSaved(step: number) {
  trackEvent({
    action: "form_partial_saved",
    category: "lead_generation",
    label: `step_${step}`,
    value: step,
  });
}

// ─── Calculator Tracking ──────────────────────────────────

export function trackCalculatorUse(calculatorSlug: string) {
  trackEvent({
    action: "calculator_use",
    category: "engagement",
    label: calculatorSlug,
  });
}

export function trackCalculatorCTA(calculatorSlug: string) {
  trackEvent({
    action: "calculator_cta_click",
    category: "lead_generation",
    label: calculatorSlug,
  });
}

// ─── CTA Tracking ─────────────────────────────────────────

export function trackCTAClick(label: string, page: string) {
  trackEvent({
    action: "cta_click",
    category: "lead_generation",
    label,
    page,
  });
}

// ─── FAQ Tracking ─────────────────────────────────────────

export function trackFAQOpen(question: string) {
  trackEvent({
    action: "faq_open",
    category: "engagement",
    label: question.slice(0, 100),
  });
}

// ─── Enquiry Form Tracking ────────────────────────────────

export function trackEnquirySubmit(sourcePage: string) {
  trackEvent({
    action: "enquiry_submit",
    category: "lead_generation",
    label: sourcePage,
  });
  trackEvent({
    action: "qualify_lead",
    category: "lead_generation",
    label: "quick_enquiry",
    source_page: sourcePage,
    lead_type: "borrower",
  });
}

export function trackIntroducerSubmit(partnerType: string) {
  trackEvent({
    action: "introducer_enquiry_submit",
    category: "lead_generation",
    label: partnerType,
    lead_type: "introducer",
  });
  trackEvent({
    action: "qualify_lead",
    category: "lead_generation",
    label: "introducer_partner",
    partner_type: partnerType,
    lead_type: "introducer",
  });
}
