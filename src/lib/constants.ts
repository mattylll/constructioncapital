export const SITE_NAME = "Construction Capital";
export const SITE_URL = "https://constructioncapital.co.uk";
export const SITE_DESCRIPTION =
  "Expert development finance brokerage with 25+ years experience. Access senior debt, mezzanine, bridging loans and equity for property developments across the UK.";

export const CONTACT = {
  email: "info@constructioncapital.co.uk",
  phone: "+44 (0) 20 0000 0000",
  address: "London, United Kingdom",
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
