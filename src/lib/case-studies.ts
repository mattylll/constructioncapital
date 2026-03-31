import { countyNameToSlug, loanTypeToServiceSlug } from "./location-content";

export interface CaseStudy {
  slug: string;
  title: string;
  location: string;
  county: string;
  projectType: string;
  gdv: string;
  loanAmount: string;
  loanType: string;
  ltv: string;
  description: string;
  isFeatured: boolean;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "residential-scheme-manchester",
    title: "12-Unit Residential Scheme",
    location: "Manchester",
    county: "Greater Manchester",
    projectType: "Ground-Up Development",
    gdv: "£3.2M",
    loanAmount: "£2.1M",
    loanType: "Development Finance",
    ltv: "65% LTGDV",
    description:
      "Structured senior debt for a ground-up residential scheme in South Manchester. Planning secured for 12 apartments across two blocks.",
    isFeatured: true,
  },
  {
    slug: "mixed-use-conversion-birmingham",
    title: "Mixed-Use Conversion",
    location: "Birmingham",
    county: "West Midlands",
    projectType: "Heavy Refurbishment",
    gdv: "£5.8M",
    loanAmount: "£4.2M",
    loanType: "Development + Mezzanine",
    ltv: "85% of Costs",
    description:
      "Combined senior and mezzanine structure for a commercial-to-residential conversion in Birmingham city centre. 24 apartments over ground-floor retail.",
    isFeatured: true,
  },
  {
    slug: "auction-purchase-london",
    title: "Auction Purchase & Refurb",
    location: "London",
    county: "Greater London",
    projectType: "Bridging + Refurbishment",
    gdv: "£1.8M",
    loanAmount: "£1.1M",
    loanType: "Bridging Loan",
    ltv: "70% LTV",
    description:
      "Rapid bridging finance for an auction purchase in Hackney. Funds drawn within 14 days to meet auction completion deadline, then refinanced into refurbishment facility.",
    isFeatured: false,
  },
  {
    slug: "jv-residential-bristol",
    title: "JV Equity Partnership",
    location: "Bristol",
    county: "Bristol",
    projectType: "Equity & Joint Venture",
    gdv: "£8.5M",
    loanAmount: "£6.8M",
    loanType: "Equity JV + Senior Debt",
    ltv: "100% of Costs",
    description:
      "Introduced a family office equity partner to fund 100% of project costs for a 30-unit scheme. Developer contributed land only, retaining 60% of profits.",
    isFeatured: true,
  },
  {
    slug: "hmo-conversion-leeds",
    title: "HMO Conversion Project",
    location: "Leeds",
    county: "West Yorkshire",
    projectType: "Refurbishment",
    gdv: "£950K",
    loanAmount: "£620K",
    loanType: "Refurbishment Finance",
    ltv: "75% LTV",
    description:
      "Refurbishment finance for converting a large Victorian property into a licensed 8-bed HMO near Leeds University. Completed in 5 months.",
    isFeatured: false,
  },
  {
    slug: "commercial-acquisition-edinburgh",
    title: "Office Block Acquisition",
    location: "Edinburgh",
    county: "Edinburgh",
    projectType: "Commercial Mortgage",
    gdv: "£4.2M",
    loanAmount: "£2.9M",
    loanType: "Commercial Mortgage",
    ltv: "70% LTV",
    description:
      "Long-term commercial mortgage for acquiring a multi-tenanted office building in Edinburgh's financial district. 15-year fixed rate secured.",
    isFeatured: false,
  },
];

/**
 * Get case studies matching a county slug.
 */
export function getCaseStudiesByCounty(countySlug: string): CaseStudy[] {
  return CASE_STUDIES.filter(
    (cs) => countyNameToSlug(cs.county) === countySlug
  );
}

/**
 * Get case studies matching a county slug AND service slug.
 */
export function getCaseStudiesByCountyAndService(
  countySlug: string,
  serviceSlug: string
): CaseStudy[] {
  return CASE_STUDIES.filter(
    (cs) =>
      countyNameToSlug(cs.county) === countySlug &&
      loanTypeToServiceSlug(cs.loanType) === serviceSlug
  );
}
