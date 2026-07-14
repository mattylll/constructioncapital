export const SITE_NAME = "Construction Capital";
export const SITE_URL = "https://constructioncapital.co.uk";
export const SITE_DESCRIPTION =
  "Independent UK development finance brokerage led by Matt Lenzie — 25+ years arranging senior debt, mezzanine, bridging and equity for property developers.";

export const CONTACT = {
  email: "matt.lenzie@construction-capital.co.uk",
  phone: "+44 20 3816 3693",
  phoneRaw: "+442038163693",
  address: "London, United Kingdom",
  /**
   * Optional direct-to-Matt channels — set NEXT_PUBLIC_WHATSAPP_URL (e.g.
   * https://wa.me/44…) and NEXT_PUBLIC_BOOKING_URL (Calendly/Cal.com) in
   * Netlify env and redeploy to activate. Render sites gate on presence.
   */
  whatsappUrl: process.env.NEXT_PUBLIC_WHATSAPP_URL || undefined,
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || undefined,
} as const;

export const LEGAL_ENTITY = {
  name: "Lenzie Consulting Ltd",
  companyNumber: "08174104",
  tradingAs: "Construction Capital",
  registeredOffice: "Lynch Farm, Kensworth, Dunstable, LU6 3QZ",
  jurisdiction: "England & Wales",
} as const;

export const STATS = {
  yearsExperience: "25+",
  fundsArranged: "500M+",
  lenderPanel: "100+",
  coverage: "Nationwide",
} as const;

export const UK_REGIONS = [
  "London",
  "South East",
  "South West",
  "East of England",
  "East Midlands",
  "West Midlands",
  "North West",
  "North East",
  "Yorkshire and the Humber",
  "Scotland",
  "Wales",
  "Northern Ireland",
] as const;

export type UKRegion = (typeof UK_REGIONS)[number];
