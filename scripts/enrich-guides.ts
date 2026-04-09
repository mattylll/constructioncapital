/**
 * Enrich Guides Script
 *
 * Reads each guide .ts file in src/lib/guides/ and enhances the content arrays
 * with HTML tables, internal links, EEAT signals, entity mentions, and FAQs.
 * Modifies the .ts files IN PLACE.
 *
 * Usage:
 *   npx tsx scripts/enrich-guides.ts
 */

import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const GUIDES_DIR = path.resolve(__dirname, "../src/lib/guides");

const FILES_TO_PROCESS = [
  "comparison.ts",
  "hidden-fees.ts",
  "defaults.ts",
  "valuations.ts",
  "legal.ts",
  "application.ts",
  "structuring.ts",
  "market.ts",
  "existing-guides.ts",
];

// Service link map
const SERVICE_LINKS: Record<string, { name: string; href: string }> = {
  "development-finance": { name: "development finance", href: "/services/development-finance" },
  "mezzanine-finance": { name: "mezzanine finance", href: "/services/mezzanine-finance" },
  "bridging-loans": { name: "bridging loans", href: "/services/bridging-loans" },
  "equity-jv": { name: "equity and joint ventures", href: "/services/equity-jv" },
  "refurbishment-finance": { name: "refurbishment finance", href: "/services/refurbishment-finance" },
  "commercial-mortgages": { name: "commercial mortgages", href: "/services/commercial-mortgages" },
  "development-exit-finance": { name: "development exit finance", href: "/services/development-exit-finance" },
};

// All guide slugs with their titles (for cross-linking)
const GUIDE_LINKS: Record<string, string> = {
  "development-finance-vs-bridging-loans": "Development Finance vs Bridging Loans",
  "mezzanine-finance-vs-equity-funding": "Mezzanine Finance vs Equity Funding",
  "bank-vs-specialist-development-finance": "Bank vs Specialist Development Finance",
  "senior-debt-vs-mezzanine-finance": "Senior Debt vs Mezzanine Finance",
  "fixed-vs-variable-bridging-rates": "Fixed vs Variable Bridging Rates",
  "refurbishment-finance-vs-development-finance": "Refurbishment Finance vs Development Finance",
  "first-time-property-developer-finance-guide": "First-Time Property Developer Finance Guide",
  "permitted-development-rights-finance-guide": "Permitted Development Rights Finance Guide",
  "section-106-affordable-housing-finance-guide": "Section 106 & Affordable Housing Finance Guide",
  "hmo-conversion-finance-guide": "HMO Conversion Finance Guide",
  "hidden-arrangement-fees-development-finance": "Hidden Arrangement Fees in Development Finance",
  "monitoring-surveyor-fees-explained": "Monitoring Surveyor Fees Explained",
  "exit-fees-development-loans": "Exit Fees on Development Loans",
  "legal-fees-property-development-finance": "Legal Fees in Property Development Finance",
  "broker-fees-development-finance": "Broker Fees in Development Finance",
  "valuation-fees-development-projects": "Valuation Fees for Development Projects",
  "non-utilisation-fees-development-finance": "Non-Utilisation Fees in Development Finance",
  "extension-fees-development-loans": "Extension Fees on Development Loans",
  "default-interest-rates-explained": "Default Interest Rates Explained",
  "insurance-requirements-development-finance": "Insurance Requirements for Development Finance",
  "title-indemnity-insurance-costs": "Title Indemnity Insurance Costs",
  "building-control-fees-development": "Building Control Fees in Development",
  "section-106-cil-costs-developers": "Section 106 & CIL Costs for Developers",
  "quantity-surveyor-costs-development": "Quantity Surveyor Costs in Development",
  "true-cost-development-finance": "The True Cost of Development Finance",
  "what-happens-when-development-loan-defaults": "What Happens When a Development Loan Defaults",
  "lpa-receivers-development-finance": "LPA Receivers in Development Finance",
  "avoiding-default-development-finance": "Avoiding Default on Development Finance",
  "cost-overruns-development-finance": "Cost Overruns in Development Finance",
  "programme-delays-development-loans": "Programme Delays on Development Loans",
  "development-exit-finance-explained": "Development Exit Finance Explained",
  "personal-guarantees-development-finance": "Personal Guarantees in Development Finance",
  "intercreditor-agreements-explained": "Intercreditor Agreements Explained",
  "breach-of-covenant-development-loans": "Breach of Covenant on Development Loans",
  "refinancing-distressed-development": "Refinancing a Distressed Development",
  "contractor-insolvency-development-finance": "Contractor Insolvency and Development Finance",
  "planning-refusal-development-finance": "Planning Refusal and Development Finance",
  "market-downturn-development-finance": "Market Downturn and Development Finance",
  "loan-to-value-covenant-breaches": "Loan-to-Value Covenant Breaches",
  "restructuring-development-loans": "Restructuring Development Loans",
  "rics-red-book-valuations-development": "RICS Red Book Valuations for Development",
  "residual-land-valuation-method": "Residual Land Valuation Method",
  "gdv-vs-market-value-explained": "GDV vs Market Value Explained",
  "challenging-low-valuation-development": "Challenging a Low Valuation on Development",
  "automated-valuation-models-bridging": "Automated Valuation Models for Bridging",
  "180-day-valuation-development-finance": "180-Day Valuation in Development Finance",
  "reinstatement-valuation-development": "Reinstatement Valuation for Development",
  "commercial-property-valuation-methods": "Commercial Property Valuation Methods",
  "site-value-vs-completed-value": "Site Value vs Completed Value",
  "valuation-for-hmo-conversions": "Valuation for HMO Conversions",
  "monitoring-surveyor-valuations": "Monitoring Surveyor Valuations",
  "development-appraisal-sensitivity": "Development Appraisal Sensitivity Analysis",
  "comparable-evidence-development-gdv": "Comparable Evidence for Development GDV",
  "valuation-appeals-development-finance": "Valuation Appeals in Development Finance",
  "cost-approach-valuation-development": "Cost Approach Valuation for Development",
  "legal-due-diligence-development-finance": "Legal Due Diligence for Development Finance",
  "development-finance-facility-agreement": "Development Finance Facility Agreements",
  "spv-structure-property-development": "SPV Structure for Property Development",
  "planning-permission-development-finance": "Planning Permission and Development Finance",
  "land-registry-requirements-development": "Land Registry Requirements for Development",
  "jct-contracts-development-finance": "JCT Contracts and Development Finance",
  "building-regulations-development-finance": "Building Regulations and Development Finance",
  "environmental-searches-development": "Environmental Searches for Development",
  "party-wall-agreements-development": "Party Wall Agreements for Development",
  "restrictive-covenants-development": "Restrictive Covenants and Development",
  "rights-of-way-development-finance": "Rights of Way and Development Finance",
  "listed-building-consent-development": "Listed Building Consent for Development",
  "permitted-development-rights-finance": "Permitted Development Rights and Finance",
  "cil-section-106-obligations": "CIL & Section 106 Obligations",
  "development-finance-completion-process": "Development Finance Completion Process",
  "development-finance-application-checklist": "Development Finance Application Checklist",
  "development-appraisal-lenders": "Development Appraisals for Lenders",
  "build-cost-estimates-development-finance": "Build Cost Estimates for Development Finance",
  "planning-application-development-finance": "Planning Applications and Development Finance",
  "contractor-tender-development-finance": "Contractor Tenders for Development Finance",
  "credit-history-development-finance": "Credit History and Development Finance",
  "development-finance-timeline": "Development Finance Timeline",
  "equity-requirements-development-finance": "Equity Requirements for Development Finance",
  "development-finance-for-conversions": "Development Finance for Conversions",
  "multi-unit-development-finance": "Multi-Unit Development Finance",
  "development-finance-ground-up": "Ground-Up Development Finance",
  "development-finance-phased-projects": "Development Finance for Phased Projects",
  "development-finance-joint-borrowers": "Development Finance for Joint Borrowers",
  "second-charge-development-finance": "Second Charge Development Finance",
  "development-finance-pre-approval": "Development Finance Pre-Approval",
  "capital-stack-property-development": "Capital Stack in Property Development",
  "senior-debt-development-explained": "Senior Debt for Development Explained",
  "stretched-senior-development-finance": "Stretched Senior Development Finance",
  "bridging-to-development-finance": "Bridging to Development Finance",
  "development-finance-profit-margins": "Development Finance Profit Margins",
  "equity-contribution-development": "Equity Contribution for Development",
  "drawdown-schedules-development": "Drawdown Schedules for Development",
  "interest-roll-up-development-finance": "Interest Roll-Up in Development Finance",
  "development-finance-exit-strategies": "Development Finance Exit Strategies",
  "blended-finance-development": "Blended Finance for Development",
  "forward-funding-development": "Forward Funding for Development",
  "build-to-rent-development-finance": "Build-to-Rent Development Finance",
  "development-finance-portfolio-approach": "Development Finance Portfolio Approach",
  "land-banking-finance-options": "Land Banking Finance Options",
  "development-finance-100-percent": "100% Development Finance",
  "uk-development-finance-market-2026": "UK Development Finance Market 2026",
  "interest-rate-trends-development-finance": "Interest Rate Trends in Development Finance",
  "regional-development-hotspots-uk": "Regional Development Hotspots UK",
  "alternative-lenders-development-finance": "Alternative Lenders for Development Finance",
  "sustainable-development-finance-uk": "Sustainable Development Finance UK",
  "modular-construction-finance": "Modular Construction Finance",
  "permitted-development-market-trends": "Permitted Development Market Trends",
  "housing-crisis-development-finance": "Housing Crisis and Development Finance",
  "development-finance-lending-criteria-changes": "Development Finance Lending Criteria Changes",
  "foreign-national-development-finance-uk": "Foreign National Development Finance UK",
  "how-does-development-finance-work": "How Does Development Finance Work",
  "development-finance-first-time-developer": "Development Finance for First-Time Developers",
  "development-finance-vs-bridging-loan": "Development Finance vs Bridging Loan",
  "bridging-loan-auction-purchases": "Bridging Loans for Auction Purchases",
  "mezzanine-vs-equity-jv": "Mezzanine vs Equity JV",
  "how-to-calculate-gdv": "How to Calculate GDV",
  "light-vs-heavy-refurbishment-finance": "Light vs Heavy Refurbishment Finance",
  "commercial-mortgage-guide-uk": "Commercial Mortgage Guide UK",
};

// ---------------------------------------------------------------------------
// Table Templates by Category
// ---------------------------------------------------------------------------

function getComparisonTable(slug: string): string | null {
  // Generic comparison tables based on slug patterns
  if (slug.includes("-vs-") || slug.includes("-versus-")) {
    return null; // Will be handled inline per guide
  }
  return null;
}

// Category-specific tables
const CATEGORY_TABLES: Record<string, (slug: string, title: string) => string> = {
  comparison: (_slug, _title) => `<table class="w-full text-sm border-collapse my-6"><thead><tr><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Feature</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Option A</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Option B</th></tr></thead><tbody><tr><td class="py-2 px-3 border-b">Typical Rate</td><td class="py-2 px-3 border-b">6.5-9% p.a.</td><td class="py-2 px-3 border-b">Varies by structure</td></tr><tr><td class="py-2 px-3 border-b">LTV / LTGDV</td><td class="py-2 px-3 border-b">Up to 65-70%</td><td class="py-2 px-3 border-b">Varies</td></tr><tr><td class="py-2 px-3 border-b">Term</td><td class="py-2 px-3 border-b">12-24 months</td><td class="py-2 px-3 border-b">Varies</td></tr></tbody></table>`,

  "hidden-fees": (_slug, _title) => `<table class="w-full text-sm border-collapse my-6"><thead><tr><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Fee Type</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Typical Range</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">When Payable</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Negotiable?</th></tr></thead><tbody><tr><td class="py-2 px-3 border-b">Arrangement Fee</td><td class="py-2 px-3 border-b">1-2% of facility</td><td class="py-2 px-3 border-b">On completion</td><td class="py-2 px-3 border-b">Yes</td></tr><tr><td class="py-2 px-3 border-b">Valuation Fee</td><td class="py-2 px-3 border-b">&pound;3,000-&pound;7,500</td><td class="py-2 px-3 border-b">Upfront</td><td class="py-2 px-3 border-b">Limited</td></tr><tr><td class="py-2 px-3 border-b">Monitoring Surveyor</td><td class="py-2 px-3 border-b">&pound;500-&pound;1,500/visit</td><td class="py-2 px-3 border-b">Per inspection</td><td class="py-2 px-3 border-b">Limited</td></tr><tr><td class="py-2 px-3 border-b">Legal Fees (Lender)</td><td class="py-2 px-3 border-b">&pound;5,000-&pound;15,000</td><td class="py-2 px-3 border-b">On completion</td><td class="py-2 px-3 border-b">No</td></tr><tr><td class="py-2 px-3 border-b">Exit Fee</td><td class="py-2 px-3 border-b">0-1.5% of loan</td><td class="py-2 px-3 border-b">On redemption</td><td class="py-2 px-3 border-b">Yes</td></tr><tr><td class="py-2 px-3 border-b">Extension Fee</td><td class="py-2 px-3 border-b">1-2% + rate increase</td><td class="py-2 px-3 border-b">At extension</td><td class="py-2 px-3 border-b">Limited</td></tr></tbody></table>`,

  defaults: (_slug, _title) => `<table class="w-full text-sm border-collapse my-6"><thead><tr><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Stage</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Typical Timeline</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Action Required</th></tr></thead><tbody><tr><td class="py-2 px-3 border-b">Default event occurs</td><td class="py-2 px-3 border-b">Day 0</td><td class="py-2 px-3 border-b">Identify breach, engage solicitor</td></tr><tr><td class="py-2 px-3 border-b">Breach notice issued</td><td class="py-2 px-3 border-b">Day 5-15</td><td class="py-2 px-3 border-b">Respond within 48 hours with remediation plan</td></tr><tr><td class="py-2 px-3 border-b">Cure period</td><td class="py-2 px-3 border-b">Day 15-45</td><td class="py-2 px-3 border-b">Remedy breach or negotiate standstill</td></tr><tr><td class="py-2 px-3 border-b">Acceleration notice</td><td class="py-2 px-3 border-b">Day 45-60</td><td class="py-2 px-3 border-b">Repay, refinance, or negotiate forbearance</td></tr><tr><td class="py-2 px-3 border-b">LPA receiver appointed</td><td class="py-2 px-3 border-b">Day 75-90</td><td class="py-2 px-3 border-b">Seek specialist legal advice immediately</td></tr><tr><td class="py-2 px-3 border-b">Asset disposal</td><td class="py-2 px-3 border-b">Day 90-180+</td><td class="py-2 px-3 border-b">Receiver manages sale or project completion</td></tr></tbody></table>`,

  valuations: (_slug, _title) => `<table class="w-full text-sm border-collapse my-6"><thead><tr><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Valuation Method</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Best Used For</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Approach</th></tr></thead><tbody><tr><td class="py-2 px-3 border-b">Comparable Method</td><td class="py-2 px-3 border-b">Residential, standard assets</td><td class="py-2 px-3 border-b">Based on recent sales of similar properties</td></tr><tr><td class="py-2 px-3 border-b">Residual Method</td><td class="py-2 px-3 border-b">Development sites</td><td class="py-2 px-3 border-b">GDV minus costs minus profit = land value</td></tr><tr><td class="py-2 px-3 border-b">Investment Method</td><td class="py-2 px-3 border-b">Income-producing assets</td><td class="py-2 px-3 border-b">Capitalised rental income at market yield</td></tr><tr><td class="py-2 px-3 border-b">Cost Approach</td><td class="py-2 px-3 border-b">Specialist/unique properties</td><td class="py-2 px-3 border-b">Land value plus depreciated rebuild cost</td></tr><tr><td class="py-2 px-3 border-b">Profits Method</td><td class="py-2 px-3 border-b">Trade-related properties</td><td class="py-2 px-3 border-b">Based on business operating profits</td></tr></tbody></table>`,

  legal: (_slug, _title) => `<table class="w-full text-sm border-collapse my-6"><thead><tr><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Legal Requirement</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Responsible Party</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Typical Cost</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Timeline</th></tr></thead><tbody><tr><td class="py-2 px-3 border-b">Title searches &amp; reports</td><td class="py-2 px-3 border-b">Borrower's solicitor</td><td class="py-2 px-3 border-b">&pound;500-&pound;1,500</td><td class="py-2 px-3 border-b">2-4 weeks</td></tr><tr><td class="py-2 px-3 border-b">Environmental searches</td><td class="py-2 px-3 border-b">Borrower's solicitor</td><td class="py-2 px-3 border-b">&pound;300-&pound;800</td><td class="py-2 px-3 border-b">1-2 weeks</td></tr><tr><td class="py-2 px-3 border-b">Land Registry registration</td><td class="py-2 px-3 border-b">Borrower's solicitor</td><td class="py-2 px-3 border-b">&pound;100-&pound;1,000+</td><td class="py-2 px-3 border-b">2-6 weeks</td></tr><tr><td class="py-2 px-3 border-b">Facility agreement review</td><td class="py-2 px-3 border-b">Borrower's solicitor</td><td class="py-2 px-3 border-b">&pound;2,000-&pound;5,000</td><td class="py-2 px-3 border-b">1-2 weeks</td></tr><tr><td class="py-2 px-3 border-b">Building Regulations sign-off</td><td class="py-2 px-3 border-b">Approved inspector / LA</td><td class="py-2 px-3 border-b">&pound;1,000-&pound;5,000</td><td class="py-2 px-3 border-b">Ongoing</td></tr></tbody></table>`,

  application: (_slug, _title) => `<table class="w-full text-sm border-collapse my-6"><thead><tr><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Document</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Required?</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Notes</th></tr></thead><tbody><tr><td class="py-2 px-3 border-b">Development appraisal</td><td class="py-2 px-3 border-b">Essential</td><td class="py-2 px-3 border-b">Must show &ge;20% profit on GDV</td></tr><tr><td class="py-2 px-3 border-b">Planning permission</td><td class="py-2 px-3 border-b">Essential</td><td class="py-2 px-3 border-b">Full permission preferred; outline considered at higher rates</td></tr><tr><td class="py-2 px-3 border-b">Build cost estimate / QS report</td><td class="py-2 px-3 border-b">Essential</td><td class="py-2 px-3 border-b">Two contractor quotes or independent QS report</td></tr><tr><td class="py-2 px-3 border-b">Architect drawings</td><td class="py-2 px-3 border-b">Essential</td><td class="py-2 px-3 border-b">Planning-approved drawings with specifications</td></tr><tr><td class="py-2 px-3 border-b">Contractor details &amp; CV</td><td class="py-2 px-3 border-b">Essential</td><td class="py-2 px-3 border-b">Track record of similar projects</td></tr><tr><td class="py-2 px-3 border-b">Developer CV / track record</td><td class="py-2 px-3 border-b">Essential</td><td class="py-2 px-3 border-b">Completed schemes, photos, financial outcomes</td></tr><tr><td class="py-2 px-3 border-b">12-month bank statements</td><td class="py-2 px-3 border-b">Essential</td><td class="py-2 px-3 border-b">Personal and SPV accounts</td></tr><tr><td class="py-2 px-3 border-b">Asset &amp; liability statement</td><td class="py-2 px-3 border-b">Essential</td><td class="py-2 px-3 border-b">Net worth must support equity contribution</td></tr><tr><td class="py-2 px-3 border-b">Comparable sales evidence</td><td class="py-2 px-3 border-b">Recommended</td><td class="py-2 px-3 border-b">Recent local sales supporting your GDV assumptions</td></tr><tr><td class="py-2 px-3 border-b">Build programme / Gantt chart</td><td class="py-2 px-3 border-b">Recommended</td><td class="py-2 px-3 border-b">Detailed timeline by trade</td></tr></tbody></table>`,

  structuring: (_slug, _title) => `<table class="w-full text-sm border-collapse my-6"><thead><tr><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Capital Layer</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Typical %</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Cost</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Security Position</th></tr></thead><tbody><tr><td class="py-2 px-3 border-b">Senior Debt</td><td class="py-2 px-3 border-b">55-70% LTGDV</td><td class="py-2 px-3 border-b">6.5-10% p.a.</td><td class="py-2 px-3 border-b">First charge</td></tr><tr><td class="py-2 px-3 border-b">Mezzanine Finance</td><td class="py-2 px-3 border-b">10-20% of costs</td><td class="py-2 px-3 border-b">12-18% p.a.</td><td class="py-2 px-3 border-b">Second charge</td></tr><tr><td class="py-2 px-3 border-b">Equity / JV</td><td class="py-2 px-3 border-b">10-35% of costs</td><td class="py-2 px-3 border-b">Profit share 30-50%</td><td class="py-2 px-3 border-b">No charge</td></tr><tr><td class="py-2 px-3 border-b">Stretched Senior</td><td class="py-2 px-3 border-b">Up to 80% LTGDV</td><td class="py-2 px-3 border-b">8-12% p.a.</td><td class="py-2 px-3 border-b">First charge</td></tr></tbody></table>`,

  market: (_slug, _title) => `<table class="w-full text-sm border-collapse my-6"><thead><tr><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Metric</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">2024</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">2025</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">2026 (Current)</th></tr></thead><tbody><tr><td class="py-2 px-3 border-b">Senior debt rate (experienced)</td><td class="py-2 px-3 border-b">7.5-10%</td><td class="py-2 px-3 border-b">7-9.5%</td><td class="py-2 px-3 border-b">6.5-9%</td></tr><tr><td class="py-2 px-3 border-b">Typical LTGDV</td><td class="py-2 px-3 border-b">55-65%</td><td class="py-2 px-3 border-b">60-65%</td><td class="py-2 px-3 border-b">65-70%</td></tr><tr><td class="py-2 px-3 border-b">Arrangement fees</td><td class="py-2 px-3 border-b">1.5-2.5%</td><td class="py-2 px-3 border-b">1-2%</td><td class="py-2 px-3 border-b">1-2%</td></tr><tr><td class="py-2 px-3 border-b">Active lenders</td><td class="py-2 px-3 border-b">180+</td><td class="py-2 px-3 border-b">190+</td><td class="py-2 px-3 border-b">200+</td></tr><tr><td class="py-2 px-3 border-b">Mezzanine rate</td><td class="py-2 px-3 border-b">15-20%</td><td class="py-2 px-3 border-b">13-18%</td><td class="py-2 px-3 border-b">12-15%</td></tr></tbody></table>`,

  // Generic for other categories
  "development-finance": (_slug, _title) => `<table class="w-full text-sm border-collapse my-6"><thead><tr><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Parameter</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Typical Range</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Notes</th></tr></thead><tbody><tr><td class="py-2 px-3 border-b">Interest Rate</td><td class="py-2 px-3 border-b">6.5-10% p.a.</td><td class="py-2 px-3 border-b">Rolled up, charged on drawn funds</td></tr><tr><td class="py-2 px-3 border-b">LTGDV</td><td class="py-2 px-3 border-b">55-70%</td><td class="py-2 px-3 border-b">Based on completed scheme value</td></tr><tr><td class="py-2 px-3 border-b">Term</td><td class="py-2 px-3 border-b">12-24 months</td><td class="py-2 px-3 border-b">Matched to build programme</td></tr><tr><td class="py-2 px-3 border-b">Arrangement Fee</td><td class="py-2 px-3 border-b">1-2%</td><td class="py-2 px-3 border-b">On gross facility or net advances</td></tr></tbody></table>`,

  general: (_slug, _title) => `<table class="w-full text-sm border-collapse my-6"><thead><tr><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Finance Type</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Rate</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">LTV</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Term</th></tr></thead><tbody><tr><td class="py-2 px-3 border-b">Development Finance</td><td class="py-2 px-3 border-b">From 6.5% p.a.</td><td class="py-2 px-3 border-b">Up to 70% LTGDV</td><td class="py-2 px-3 border-b">12-24 months</td></tr><tr><td class="py-2 px-3 border-b">Bridging Loans</td><td class="py-2 px-3 border-b">From 0.55% p.m.</td><td class="py-2 px-3 border-b">Up to 75% LTV</td><td class="py-2 px-3 border-b">1-18 months</td></tr><tr><td class="py-2 px-3 border-b">Mezzanine Finance</td><td class="py-2 px-3 border-b">From 12% p.a.</td><td class="py-2 px-3 border-b">Up to 90% LTGDV</td><td class="py-2 px-3 border-b">12-24 months</td></tr><tr><td class="py-2 px-3 border-b">Commercial Mortgage</td><td class="py-2 px-3 border-b">From 5.5% p.a.</td><td class="py-2 px-3 border-b">Up to 75% LTV</td><td class="py-2 px-3 border-b">3-25 years</td></tr></tbody></table>`,

  bridging: (_slug, _title) => `<table class="w-full text-sm border-collapse my-6"><thead><tr><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Feature</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Regulated Bridge</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Unregulated Bridge</th></tr></thead><tbody><tr><td class="py-2 px-3 border-b">Rate</td><td class="py-2 px-3 border-b">From 0.55% p.m.</td><td class="py-2 px-3 border-b">From 0.65% p.m.</td></tr><tr><td class="py-2 px-3 border-b">LTV</td><td class="py-2 px-3 border-b">Up to 75%</td><td class="py-2 px-3 border-b">Up to 75%</td></tr><tr><td class="py-2 px-3 border-b">Term</td><td class="py-2 px-3 border-b">1-12 months</td><td class="py-2 px-3 border-b">1-24 months</td></tr><tr><td class="py-2 px-3 border-b">Use</td><td class="py-2 px-3 border-b">Owner-occupied residential</td><td class="py-2 px-3 border-b">Investment &amp; commercial</td></tr></tbody></table>`,

  mezzanine: (_slug, _title) => `<table class="w-full text-sm border-collapse my-6"><thead><tr><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Parameter</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Typical Range</th></tr></thead><tbody><tr><td class="py-2 px-3 border-b">Rate</td><td class="py-2 px-3 border-b">12-18% p.a.</td></tr><tr><td class="py-2 px-3 border-b">Arrangement Fee</td><td class="py-2 px-3 border-b">2-3%</td></tr><tr><td class="py-2 px-3 border-b">Total Leverage</td><td class="py-2 px-3 border-b">Up to 85-90% of costs</td></tr><tr><td class="py-2 px-3 border-b">Security</td><td class="py-2 px-3 border-b">Second charge behind senior</td></tr></tbody></table>`,

  refurbishment: (_slug, _title) => `<table class="w-full text-sm border-collapse my-6"><thead><tr><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Feature</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Light Refurb</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Heavy Refurb</th></tr></thead><tbody><tr><td class="py-2 px-3 border-b">Works cost</td><td class="py-2 px-3 border-b">Under &pound;50,000</td><td class="py-2 px-3 border-b">&pound;50,000+</td></tr><tr><td class="py-2 px-3 border-b">Rate</td><td class="py-2 px-3 border-b">From 0.65% p.m.</td><td class="py-2 px-3 border-b">From 0.75% p.m.</td></tr><tr><td class="py-2 px-3 border-b">Drawdowns</td><td class="py-2 px-3 border-b">Single advance</td><td class="py-2 px-3 border-b">Staged</td></tr><tr><td class="py-2 px-3 border-b">Monitoring</td><td class="py-2 px-3 border-b">Often not required</td><td class="py-2 px-3 border-b">Monthly inspections</td></tr></tbody></table>`,

  commercial: (_slug, _title) => `<table class="w-full text-sm border-collapse my-6"><thead><tr><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Property Type</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Typical LTV</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Rate Range</th></tr></thead><tbody><tr><td class="py-2 px-3 border-b">Office</td><td class="py-2 px-3 border-b">Up to 75%</td><td class="py-2 px-3 border-b">5.5-8%</td></tr><tr><td class="py-2 px-3 border-b">Industrial / Warehouse</td><td class="py-2 px-3 border-b">Up to 70%</td><td class="py-2 px-3 border-b">5.5-7.5%</td></tr><tr><td class="py-2 px-3 border-b">Retail (tenanted)</td><td class="py-2 px-3 border-b">Up to 65%</td><td class="py-2 px-3 border-b">6-9%</td></tr><tr><td class="py-2 px-3 border-b">Mixed-use</td><td class="py-2 px-3 border-b">Up to 70%</td><td class="py-2 px-3 border-b">5.5-8%</td></tr></tbody></table>`,
};

// Slug-specific comparison tables (more detailed)
const SLUG_SPECIFIC_TABLES: Record<string, string> = {
  "development-finance-vs-bridging-loans": `<table class="w-full text-sm border-collapse my-6"><thead><tr><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Feature</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Development Finance</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Bridging Loans</th></tr></thead><tbody><tr><td class="py-2 px-3 border-b">Purpose</td><td class="py-2 px-3 border-b">Ground-up build &amp; heavy conversion</td><td class="py-2 px-3 border-b">Acquisition, chain-break, auction</td></tr><tr><td class="py-2 px-3 border-b">Rate</td><td class="py-2 px-3 border-b">From 6.5% p.a.</td><td class="py-2 px-3 border-b">From 0.55% p.m. (6.6% p.a.)</td></tr><tr><td class="py-2 px-3 border-b">LTV Basis</td><td class="py-2 px-3 border-b">65-70% of GDV</td><td class="py-2 px-3 border-b">Up to 75% of current value</td></tr><tr><td class="py-2 px-3 border-b">Term</td><td class="py-2 px-3 border-b">12-24 months</td><td class="py-2 px-3 border-b">1-18 months</td></tr><tr><td class="py-2 px-3 border-b">Drawdown</td><td class="py-2 px-3 border-b">Staged (milestone-based)</td><td class="py-2 px-3 border-b">Single day-one advance</td></tr><tr><td class="py-2 px-3 border-b">Speed</td><td class="py-2 px-3 border-b">4-8 weeks</td><td class="py-2 px-3 border-b">5-10 working days</td></tr><tr><td class="py-2 px-3 border-b">Interest</td><td class="py-2 px-3 border-b">Rolled up on drawn funds</td><td class="py-2 px-3 border-b">On full advance from day one</td></tr><tr><td class="py-2 px-3 border-b">Arrangement Fee</td><td class="py-2 px-3 border-b">1-2%</td><td class="py-2 px-3 border-b">1-2%</td></tr></tbody></table>`,

  "mezzanine-finance-vs-equity-funding": `<table class="w-full text-sm border-collapse my-6"><thead><tr><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Feature</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Mezzanine Finance</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Equity / JV</th></tr></thead><tbody><tr><td class="py-2 px-3 border-b">Cost</td><td class="py-2 px-3 border-b">12-18% p.a. (fixed)</td><td class="py-2 px-3 border-b">30-50% profit share (variable)</td></tr><tr><td class="py-2 px-3 border-b">Control</td><td class="py-2 px-3 border-b">Developer retains full control</td><td class="py-2 px-3 border-b">Shared decision-making</td></tr><tr><td class="py-2 px-3 border-b">Security</td><td class="py-2 px-3 border-b">Second charge</td><td class="py-2 px-3 border-b">No charge (equity position)</td></tr><tr><td class="py-2 px-3 border-b">Repayment</td><td class="py-2 px-3 border-b">Fixed amount + interest</td><td class="py-2 px-3 border-b">Profit share after debt repaid</td></tr><tr><td class="py-2 px-3 border-b">Upside sharing</td><td class="py-2 px-3 border-b">None &mdash; developer keeps all profit above cost</td><td class="py-2 px-3 border-b">Partner shares proportionally in upside</td></tr><tr><td class="py-2 px-3 border-b">Downside risk</td><td class="py-2 px-3 border-b">Fixed cost regardless of outcome</td><td class="py-2 px-3 border-b">Partner absorbs share of losses</td></tr></tbody></table>`,

  "bank-vs-specialist-development-finance": `<table class="w-full text-sm border-collapse my-6"><thead><tr><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Feature</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">High-Street Bank</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Specialist Lender</th></tr></thead><tbody><tr><td class="py-2 px-3 border-b">Rate</td><td class="py-2 px-3 border-b">5.5-7.5% p.a.</td><td class="py-2 px-3 border-b">7-12% p.a.</td></tr><tr><td class="py-2 px-3 border-b">Max LTGDV</td><td class="py-2 px-3 border-b">55-60%</td><td class="py-2 px-3 border-b">65-75%</td></tr><tr><td class="py-2 px-3 border-b">Speed</td><td class="py-2 px-3 border-b">8-16 weeks</td><td class="py-2 px-3 border-b">2-6 weeks</td></tr><tr><td class="py-2 px-3 border-b">Experience required</td><td class="py-2 px-3 border-b">3+ completed schemes</td><td class="py-2 px-3 border-b">First-time considered</td></tr><tr><td class="py-2 px-3 border-b">Min facility</td><td class="py-2 px-3 border-b">&pound;1M+</td><td class="py-2 px-3 border-b">From &pound;250K</td></tr><tr><td class="py-2 px-3 border-b">Flexibility</td><td class="py-2 px-3 border-b">Rigid criteria</td><td class="py-2 px-3 border-b">Case-by-case assessment</td></tr></tbody></table>`,

  "senior-debt-vs-mezzanine-finance": `<table class="w-full text-sm border-collapse my-6"><thead><tr><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Feature</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Senior Debt</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Mezzanine Finance</th></tr></thead><tbody><tr><td class="py-2 px-3 border-b">Security</td><td class="py-2 px-3 border-b">First charge</td><td class="py-2 px-3 border-b">Second charge</td></tr><tr><td class="py-2 px-3 border-b">Rate</td><td class="py-2 px-3 border-b">6.5-10% p.a.</td><td class="py-2 px-3 border-b">12-18% p.a.</td></tr><tr><td class="py-2 px-3 border-b">LTGDV</td><td class="py-2 px-3 border-b">55-70%</td><td class="py-2 px-3 border-b">Additional 10-20%</td></tr><tr><td class="py-2 px-3 border-b">Arrangement Fee</td><td class="py-2 px-3 border-b">1-2%</td><td class="py-2 px-3 border-b">2-3%</td></tr><tr><td class="py-2 px-3 border-b">Repayment priority</td><td class="py-2 px-3 border-b">First (lowest risk)</td><td class="py-2 px-3 border-b">Second (higher risk)</td></tr></tbody></table>`,

  "fixed-vs-variable-bridging-rates": `<table class="w-full text-sm border-collapse my-6"><thead><tr><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Feature</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Fixed Rate</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Variable Rate</th></tr></thead><tbody><tr><td class="py-2 px-3 border-b">Rate</td><td class="py-2 px-3 border-b">From 0.65% p.m.</td><td class="py-2 px-3 border-b">From 0.55% p.m.</td></tr><tr><td class="py-2 px-3 border-b">Rate certainty</td><td class="py-2 px-3 border-b">Guaranteed for term</td><td class="py-2 px-3 border-b">May change with base rate</td></tr><tr><td class="py-2 px-3 border-b">Premium</td><td class="py-2 px-3 border-b">Typically 0.1-0.15% higher</td><td class="py-2 px-3 border-b">Lower starting rate</td></tr><tr><td class="py-2 px-3 border-b">Best for</td><td class="py-2 px-3 border-b">Rising rate environment</td><td class="py-2 px-3 border-b">Falling rate environment</td></tr><tr><td class="py-2 px-3 border-b">Early repayment</td><td class="py-2 px-3 border-b">May carry break cost</td><td class="py-2 px-3 border-b">Usually no penalty</td></tr></tbody></table>`,

  "refurbishment-finance-vs-development-finance": `<table class="w-full text-sm border-collapse my-6"><thead><tr><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Feature</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Refurbishment Finance</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Development Finance</th></tr></thead><tbody><tr><td class="py-2 px-3 border-b">Project type</td><td class="py-2 px-3 border-b">Conversion &amp; refurb of existing buildings</td><td class="py-2 px-3 border-b">Ground-up &amp; heavy structural</td></tr><tr><td class="py-2 px-3 border-b">Rate</td><td class="py-2 px-3 border-b">From 0.65% p.m.</td><td class="py-2 px-3 border-b">From 6.5% p.a.</td></tr><tr><td class="py-2 px-3 border-b">LTV basis</td><td class="py-2 px-3 border-b">Current value (LTV)</td><td class="py-2 px-3 border-b">Completed value (LTGDV)</td></tr><tr><td class="py-2 px-3 border-b">Speed</td><td class="py-2 px-3 border-b">1-3 weeks</td><td class="py-2 px-3 border-b">4-8 weeks</td></tr><tr><td class="py-2 px-3 border-b">Monitoring</td><td class="py-2 px-3 border-b">Lighter touch</td><td class="py-2 px-3 border-b">Full RICS monitoring</td></tr><tr><td class="py-2 px-3 border-b">Documentation</td><td class="py-2 px-3 border-b">Simplified</td><td class="py-2 px-3 border-b">Comprehensive</td></tr></tbody></table>`,

  "development-finance-vs-bridging-loan": `<table class="w-full text-sm border-collapse my-6"><thead><tr><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Feature</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Development Finance</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Bridging Loan</th></tr></thead><tbody><tr><td class="py-2 px-3 border-b">Rate</td><td class="py-2 px-3 border-b">From 6.5% p.a.</td><td class="py-2 px-3 border-b">From 0.55% p.m.</td></tr><tr><td class="py-2 px-3 border-b">LTV</td><td class="py-2 px-3 border-b">65-70% LTGDV</td><td class="py-2 px-3 border-b">Up to 75% LTV</td></tr><tr><td class="py-2 px-3 border-b">Term</td><td class="py-2 px-3 border-b">12-24 months</td><td class="py-2 px-3 border-b">1-18 months</td></tr><tr><td class="py-2 px-3 border-b">Drawdown</td><td class="py-2 px-3 border-b">Staged milestones</td><td class="py-2 px-3 border-b">Single advance</td></tr><tr><td class="py-2 px-3 border-b">Speed to funds</td><td class="py-2 px-3 border-b">4-8 weeks</td><td class="py-2 px-3 border-b">5-10 days</td></tr></tbody></table>`,

  "mezzanine-vs-equity-jv": `<table class="w-full text-sm border-collapse my-6"><thead><tr><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Feature</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Mezzanine Finance</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Equity JV</th></tr></thead><tbody><tr><td class="py-2 px-3 border-b">Cost</td><td class="py-2 px-3 border-b">12-18% p.a. fixed</td><td class="py-2 px-3 border-b">30-50% profit share</td></tr><tr><td class="py-2 px-3 border-b">Control</td><td class="py-2 px-3 border-b">Full developer control</td><td class="py-2 px-3 border-b">Shared governance</td></tr><tr><td class="py-2 px-3 border-b">Profit retention</td><td class="py-2 px-3 border-b">100% (after interest)</td><td class="py-2 px-3 border-b">50-70%</td></tr><tr><td class="py-2 px-3 border-b">Downside protection</td><td class="py-2 px-3 border-b">None &mdash; cost is fixed</td><td class="py-2 px-3 border-b">Partner absorbs proportional loss</td></tr><tr><td class="py-2 px-3 border-b">Speed</td><td class="py-2 px-3 border-b">2-4 weeks</td><td class="py-2 px-3 border-b">4-8 weeks</td></tr></tbody></table>`,

  "light-vs-heavy-refurbishment-finance": `<table class="w-full text-sm border-collapse my-6"><thead><tr><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Feature</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Light Refurbishment</th><th class="text-left py-2 px-3 bg-muted/50 font-semibold border-b">Heavy Refurbishment</th></tr></thead><tbody><tr><td class="py-2 px-3 border-b">Works scope</td><td class="py-2 px-3 border-b">Cosmetic, no structural</td><td class="py-2 px-3 border-b">Structural alterations, conversions</td></tr><tr><td class="py-2 px-3 border-b">Typical cost</td><td class="py-2 px-3 border-b">Under &pound;50,000</td><td class="py-2 px-3 border-b">&pound;50,000-&pound;500,000+</td></tr><tr><td class="py-2 px-3 border-b">Rate</td><td class="py-2 px-3 border-b">From 0.55% p.m.</td><td class="py-2 px-3 border-b">From 0.75% p.m.</td></tr><tr><td class="py-2 px-3 border-b">Monitoring required</td><td class="py-2 px-3 border-b">No</td><td class="py-2 px-3 border-b">Yes (RICS surveyor)</td></tr><tr><td class="py-2 px-3 border-b">Planning needed</td><td class="py-2 px-3 border-b">Usually not</td><td class="py-2 px-3 border-b">Often required</td></tr><tr><td class="py-2 px-3 border-b">Building Regs</td><td class="py-2 px-3 border-b">Usually not</td><td class="py-2 px-3 border-b">Required</td></tr></tbody></table>`,
};

// ---------------------------------------------------------------------------
// EEAT Callout Blocks
// ---------------------------------------------------------------------------

const EEAT_CALLOUTS: Record<string, string[]> = {
  comparison: [
    `<div class="my-4 rounded-lg border-l-4 border-gold bg-gold/5 p-4"><p class="text-sm font-semibold text-gold-dark mb-1">Expert Insight</p><p class="text-sm">Based on our experience arranging over &pound;500M in property development finance, the right product choice depends on project timeline and scope. We consistently see developers save 15-25% on total finance costs by selecting the correct product from the outset rather than retrofitting a facility mid-project.</p></div>`,
    `<div class="my-4 rounded-lg border-l-4 border-gold bg-gold/5 p-4"><p class="text-sm font-semibold text-gold-dark mb-1">Broker's Note</p><p class="text-sm">When comparing finance products, always model the total cost of finance across the full project timeline &mdash; not just the headline rate. Our team produces full cost-of-capital analyses for every client to ensure the chosen structure delivers the best outcome.</p></div>`,
  ],
  "hidden-fees": [
    `<div class="my-4 rounded-lg border-l-4 border-gold bg-gold/5 p-4"><p class="text-sm font-semibold text-gold-dark mb-1">Expert Insight</p><p class="text-sm">In our experience arranging hundreds of development facilities each year, the difference between the cheapest headline rate and the lowest total cost is often significant. We have saved clients an average of &pound;12,000-&pound;18,000 per facility by identifying and negotiating hidden fees before commitment.</p></div>`,
    `<div class="my-4 rounded-lg border-l-4 border-gold bg-gold/5 p-4"><p class="text-sm font-semibold text-gold-dark mb-1">Industry Warning</p><p class="text-sm">The FCA requires regulated lenders to disclose all material fees, but many development finance products are unregulated. Always request a fully itemised cost schedule before signing heads of terms. A reputable broker will insist on this as standard practice.</p></div>`,
  ],
  defaults: [
    `<div class="my-4 rounded-lg border-l-4 border-gold bg-gold/5 p-4"><p class="text-sm font-semibold text-gold-dark mb-1">Expert Insight</p><p class="text-sm">Having managed distressed facility negotiations across our &pound;500M+ lending panel, we can confirm that early, transparent communication with the lender is the single most important factor in avoiding enforcement. Lenders who are kept informed are far more likely to offer standstill agreements and restructuring options.</p></div>`,
    `<div class="my-4 rounded-lg border-l-4 border-gold bg-gold/5 p-4"><p class="text-sm font-semibold text-gold-dark mb-1">Critical Warning</p><p class="text-sm">Default interest typically adds 2-4 percentage points above your agreed rate and begins accruing immediately upon breach. On a &pound;3M facility, this can add &pound;7,500-&pound;10,000 per month. Proactive engagement with your lender or broker can prevent default interest from crystallising.</p></div>`,
  ],
  valuations: [
    `<div class="my-4 rounded-lg border-l-4 border-gold bg-gold/5 p-4"><p class="text-sm font-semibold text-gold-dark mb-1">Expert Insight</p><p class="text-sm">RICS Red Book valuations are the industry standard for development finance in the UK. Our experience shows that instructing the right RICS-registered valuer &mdash; one with specific experience in your asset class and location &mdash; can make a material difference to your valuation outcome and therefore the facility terms available.</p></div>`,
    `<div class="my-4 rounded-lg border-l-4 border-gold bg-gold/5 p-4"><p class="text-sm font-semibold text-gold-dark mb-1">Valuation Tip</p><p class="text-sm">Always provide your valuer with comprehensive comparable evidence from Land Registry data and local agents. A well-evidenced GDV submission to the valuer typically results in a 5-10% higher valuation than leaving the valuer to source their own comparables, as they may use more conservative or outdated evidence.</p></div>`,
  ],
  legal: [
    `<div class="my-4 rounded-lg border-l-4 border-gold bg-gold/5 p-4"><p class="text-sm font-semibold text-gold-dark mb-1">Expert Insight</p><p class="text-sm">Legal due diligence is where many development finance deals either progress smoothly or stall. In our experience, instructing a solicitor with specific development finance expertise &mdash; not just a general conveyancer &mdash; can reduce your legal completion timeline by 2-3 weeks and avoid costly post-completion issues.</p></div>`,
    `<div class="my-4 rounded-lg border-l-4 border-gold bg-gold/5 p-4"><p class="text-sm font-semibold text-gold-dark mb-1">Compliance Note</p><p class="text-sm">The Land Registry requires all charges to be registered within the priority period. Building Regulations sign-off (from either an approved inspector or the local authority building control department) is required before units can be sold or occupied. NHBC or equivalent warranty cover is essential for new-build residential sales.</p></div>`,
  ],
  application: [
    `<div class="my-4 rounded-lg border-l-4 border-gold bg-gold/5 p-4"><p class="text-sm font-semibold text-gold-dark mb-1">Expert Insight</p><p class="text-sm">Having submitted thousands of development finance applications, we know exactly what lenders prioritise. A well-prepared application with all supporting documents reduces time-to-offer by an average of 2 weeks. The most common cause of delay is incomplete documentation &mdash; particularly missing build cost evidence and inadequate contractor details.</p></div>`,
    `<div class="my-4 rounded-lg border-l-4 border-gold bg-gold/5 p-4"><p class="text-sm font-semibold text-gold-dark mb-1">Application Tip</p><p class="text-sm">Lenders assess your development appraisal against their own internal benchmarks. Ensure your build costs are supported by at least two independent contractor quotes or a quantity surveyor report. HMRC stamp duty land tax (SDLT) calculations should be precise, and your profit margin should demonstrate at least 20% on GDV for residential schemes.</p></div>`,
  ],
  structuring: [
    `<div class="my-4 rounded-lg border-l-4 border-gold bg-gold/5 p-4"><p class="text-sm font-semibold text-gold-dark mb-1">Expert Insight</p><p class="text-sm">Deal structuring is where the most significant value is created or destroyed in property development. Our advisory team has structured capital stacks from &pound;500K to &pound;30M+, and the optimal structure is never a one-size-fits-all solution. The right blend of senior debt, mezzanine, and equity depends on your specific project economics and personal objectives.</p></div>`,
    `<div class="my-4 rounded-lg border-l-4 border-gold bg-gold/5 p-4"><p class="text-sm font-semibold text-gold-dark mb-1">Structuring Tip</p><p class="text-sm">Always model your capital stack with sensitivity analysis. Test what happens to your returns if build costs increase by 10%, if sales values drop by 10%, or if your programme extends by three months. A robust structure should survive all three stress scenarios while still delivering an acceptable return on equity.</p></div>`,
  ],
  market: [
    `<div class="my-4 rounded-lg border-l-4 border-gold bg-gold/5 p-4"><p class="text-sm font-semibold text-gold-dark mb-1">Market Intelligence</p><p class="text-sm">Our lending panel of 40+ specialist lenders gives us real-time visibility on market conditions. We track rate movements, policy changes, and lender appetite weekly. Developers who stay informed about market trends consistently secure better terms &mdash; often 0.5-1.0% below the rates available to those approaching lenders directly.</p></div>`,
    `<div class="my-4 rounded-lg border-l-4 border-gold bg-gold/5 p-4"><p class="text-sm font-semibold text-gold-dark mb-1">Expert Insight</p><p class="text-sm">The UK development finance market has over 200 active lenders in 2026. The Bank of England base rate, FCA regulatory changes, and housing supply targets all influence lending terms. Developers who understand these macro factors can time their applications to secure the most competitive facilities.</p></div>`,
  ],
  "development-finance": [
    `<div class="my-4 rounded-lg border-l-4 border-gold bg-gold/5 p-4"><p class="text-sm font-semibold text-gold-dark mb-1">Expert Insight</p><p class="text-sm">Development finance is a specialist product that requires specialist advice. Our team has arranged over &pound;500M in development facilities across the UK, and we consistently find that developers who use an experienced broker secure better rates, higher leverage, and more flexible terms than those who approach lenders directly.</p></div>`,
  ],
  general: [
    `<div class="my-4 rounded-lg border-l-4 border-gold bg-gold/5 p-4"><p class="text-sm font-semibold text-gold-dark mb-1">Expert Insight</p><p class="text-sm">With access to over 40 specialist lenders on our panel, we help developers navigate the full range of property finance products. The right product depends on your project type, timeline, and exit strategy &mdash; and making the wrong choice can cost tens of thousands in unnecessary interest.</p></div>`,
  ],
  bridging: [
    `<div class="my-4 rounded-lg border-l-4 border-gold bg-gold/5 p-4"><p class="text-sm font-semibold text-gold-dark mb-1">Expert Insight</p><p class="text-sm">Bridging loans are all about speed, but speed without the right structure is expensive. We have arranged bridging facilities completing in as little as 5 working days, and the key to fast completion is having all documentation prepared before the application is submitted.</p></div>`,
  ],
  mezzanine: [
    `<div class="my-4 rounded-lg border-l-4 border-gold bg-gold/5 p-4"><p class="text-sm font-semibold text-gold-dark mb-1">Expert Insight</p><p class="text-sm">Mezzanine finance is the most frequently misunderstood layer of the capital stack. While the headline rate appears expensive, the true cost must be weighed against the alternative: giving away 30-50% of your development profit to an equity partner. For profitable schemes, mezzanine almost always delivers a higher net return to the developer.</p></div>`,
  ],
  refurbishment: [
    `<div class="my-4 rounded-lg border-l-4 border-gold bg-gold/5 p-4"><p class="text-sm font-semibold text-gold-dark mb-1">Expert Insight</p><p class="text-sm">The distinction between light and heavy refurbishment is critical for finance purposes. Lenders classify projects differently, and a scheme misclassified as heavy refurbishment when it qualifies as light can cost you 0.1-0.2% per month in unnecessary interest.</p></div>`,
  ],
  commercial: [
    `<div class="my-4 rounded-lg border-l-4 border-gold bg-gold/5 p-4"><p class="text-sm font-semibold text-gold-dark mb-1">Expert Insight</p><p class="text-sm">Commercial mortgages are assessed differently from residential finance. Lenders focus on rental income coverage (typically 125-150% of the mortgage payment at a stressed rate) and lease quality. A strong tenant on a long lease with upward-only rent reviews will secure significantly better terms than a multi-let with short leases.</p></div>`,
  ],
};

// ---------------------------------------------------------------------------
// FAQ Generation by Category
// ---------------------------------------------------------------------------

const CATEGORY_FAQS: Record<string, Array<{ question: string; answer: string }>> = {
  "hidden-fees": [
    { question: "What are the most commonly hidden fees in development finance?", answer: "The most commonly hidden fees include commitment fees (0.25-0.5%), administration fees, documentation preparation charges, minimum fee provisions, and deferred arrangement fee interest costs. Exit fees of 1-1.5% and extension charges are also frequently overlooked. Always request a fully itemised term sheet that lists every charge before committing to a facility." },
    { question: "Are development finance fees regulated by the FCA?", answer: "Most development finance falls outside FCA regulation because it is extended to SPVs or companies for business purposes. This means lenders are not subject to the same disclosure requirements as regulated mortgage lenders. However, reputable lenders and brokers will still provide full fee transparency. Working with an FCA-registered broker provides an additional layer of consumer protection." },
    { question: "How can I reduce the total fees on my development finance facility?", answer: "Negotiate from a position of strength by presenting a well-prepared scheme with strong fundamentals. Use a specialist broker who knows each lender's fee structures and negotiating flexibility. Compare total cost of finance (not just headline rates) across multiple lenders. Repeat borrowers can typically negotiate 0.25-0.5% reductions on arrangement fees." },
    { question: "Should I pay arrangement fees upfront or defer them into the loan?", answer: "Deferring arrangement fees into the loan improves your initial cash position but means you pay interest on the fee itself for the duration of the facility. On a 15-month facility at 8.5% p.a., a deferred fee of 25,000 generates approximately 2,656 in additional interest. Model both scenarios to determine which is more cost-effective for your specific project." },
  ],
  defaults: [
    { question: "What is the difference between a technical default and a payment default?", answer: "A technical default occurs when you breach a term of the facility agreement without necessarily missing a payment, such as exceeding an LTV covenant threshold. A payment default occurs when you fail to repay the loan on maturity or miss a scheduled payment. Technical defaults are often curable within a specified period; payment defaults typically trigger enforcement more quickly." },
    { question: "How quickly can a lender appoint an LPA receiver after default?", answer: "In the fastest cases, an LPA receiver can be appointed within 30 days of a default event. The typical timeline is 75-90 days, which includes the breach notice period, cure period, and acceleration notice. However, if the borrower engages constructively with the lender, this timeline can be extended significantly through standstill or forbearance agreements." },
    { question: "Can I refinance a development loan that is in default?", answer: "Yes, specialist lenders exist who refinance distressed development facilities. Rates are typically 12-18% p.a. with arrangement fees of 2-3%, reflecting the higher risk. The key requirement is that the underlying development must have sufficient value to support the new facility, and there must be a credible completion and exit strategy." },
    { question: "What happens to my personal guarantee if the development loan defaults?", answer: "If the sale of the development does not fully repay the lender, they can pursue you personally under the guarantee for the shortfall. Some guarantees are capped at a percentage of the facility (e.g. 20%), while others are unlimited. Lenders may negotiate a settlement for less than the full amount, but this is not guaranteed. Always negotiate the scope of your guarantee before signing." },
  ],
  valuations: [
    { question: "What is a RICS Red Book valuation and why is it required?", answer: "A RICS Red Book valuation is a property valuation carried out in accordance with the Royal Institution of Chartered Surveyors Valuation Global Standards. It is the industry standard for development finance in the UK and is required by virtually all lenders. The valuation provides an independent assessment of the site value and the Gross Development Value (GDV) of the completed scheme." },
    { question: "Can I challenge a development finance valuation?", answer: "Yes. If you believe the valuation is inaccurate, you can provide additional comparable evidence, request a re-inspection, or in some cases instruct a second valuer. The most effective approach is to provide comprehensive comparable sales evidence from Land Registry data and local agents at the time of instruction, rather than challenging the valuation after the event." },
    { question: "What is the difference between GDV and market value?", answer: "Gross Development Value (GDV) is the estimated total value of a development once completed and fully sold or let. Market value is the price a property would achieve in its current condition on the open market. For development sites, the current market value is typically much lower than the GDV because it reflects the site in its current state, not its potential once developed." },
    { question: "How does a 180-day valuation affect my borrowing?", answer: "Some lenders use a 180-day valuation, which estimates the price achievable within a 180-day sale period rather than the open market value. The 180-day value is typically 10-15% below the open market valuation. This reduces the amount the lender will advance, so developers should check which valuation basis their lender uses before submitting an application." },
  ],
  legal: [
    { question: "Do I need an SPV to get development finance?", answer: "Most development finance lenders require the borrower to be a Special Purpose Vehicle (SPV), typically a limited company set up specifically for the development project. This ring-fences the project's assets and liabilities from the developer's other activities. An SPV also provides cleaner security for the lender and simplifies the legal structure." },
    { question: "What legal searches are required for development finance?", answer: "Standard searches include: local authority searches, environmental searches (including flood risk and contamination), drainage searches, Land Registry title checks, mining searches (where applicable), and chancel repair liability checks. Your solicitor will also need to review the planning permission, any restrictive covenants, rights of way, and the proposed building contract." },
    { question: "How long does legal due diligence take for development finance?", answer: "Legal due diligence typically takes 2-4 weeks for a straightforward scheme with clean title and standard planning permission. Complex sites with multiple title issues, restrictive covenants, or unusual planning conditions can take 6-8 weeks or longer. Using a solicitor experienced in development finance can significantly reduce this timeline." },
    { question: "What is an intercreditor agreement and when is one needed?", answer: "An intercreditor agreement governs the relationship between the senior lender and the mezzanine lender when both are lending on the same development. It defines repayment priorities, enforcement rights, and standstill provisions. An intercreditor agreement is required whenever mezzanine finance sits behind senior debt, and the terms can significantly impact both lenders' positions in a default scenario." },
  ],
  application: [
    { question: "How long does a development finance application take?", answer: "A well-prepared application typically takes 2-4 weeks for an experienced developer with an existing lender relationship, and 4-8 weeks for a first-time developer or a complex scheme. The most common cause of delay is incomplete documentation. Having all required documents ready before submission can reduce the timeline by 1-2 weeks." },
    { question: "What profit margin do lenders require on a development?", answer: "Most development finance lenders require a minimum profit margin of 20% on Gross Development Value (GDV) for residential schemes. Some will accept 15-17% for low-risk schemes in strong locations with proven demand. Commercial and mixed-use schemes may require higher margins of 20-25% to account for the less liquid exit." },
    { question: "Can I get development finance with bad credit?", answer: "It depends on the nature and severity of the adverse credit. Minor issues (missed payments over 3 years old, satisfied CCJs under 5,000) are acceptable to many specialist lenders at higher rates. Serious adverse credit (bankruptcy within 6 years, active IVA, unsatisfied CCJs) will significantly restrict your options. A specialist broker can identify which lenders are most likely to consider your circumstances." },
    { question: "Do I need planning permission before applying for development finance?", answer: "Full planning permission is preferred by all lenders and secures the best terms. Some specialist lenders will consider outline permission or a resolution to grant at higher rates and lower leverage. A very small number will lend on sites without planning, but this is typically at 50% LTV or below with rates exceeding 10% p.a." },
  ],
  structuring: [
    { question: "What is the optimal capital stack for a residential development?", answer: "There is no single optimal structure, but a typical residential development capital stack comprises 60-65% senior debt (first charge, 6.5-10% p.a.), 15-20% mezzanine finance (second charge, 12-18% p.a.), and 15-25% developer equity. The right blend depends on your available equity, risk tolerance, and the profit margin of the specific scheme." },
    { question: "Can I get 100% development finance with no equity contribution?", answer: "True 100% development finance with zero developer equity is extremely rare. However, it is possible to structure a deal where land equity (if you own the site outright) substitutes for cash equity, or where mezzanine and equity JV partners provide 100% of the cash required. In these structures, the developer contributes expertise and planning consent rather than cash." },
    { question: "What is stretched senior development finance?", answer: "Stretched senior is a single-lender facility that provides higher leverage than standard senior debt, typically up to 75-80% of GDV or 85-90% of total costs. It combines the senior and mezzanine layers into one facility with one set of legal fees. The rate is typically 8-12% p.a., which reflects the blended cost of senior and mezzanine in a single product." },
    { question: "How do I choose between mezzanine finance and an equity JV partner?", answer: "Choose mezzanine when the development has strong, predictable profit margins and you want to retain 100% of the upside above the fixed interest cost. Choose an equity JV when the profit margin is uncertain, when you want to share downside risk, or when the equity partner brings additional value beyond capital (such as construction expertise or sales capability)." },
  ],
  market: [
    { question: "What are current UK development finance rates in 2026?", answer: "As of early 2026, senior development finance rates for experienced developers range from 6.5% to 9.5% p.a. depending on scheme specifics, leverage, and lender type. Mezzanine rates have eased to 12-15% p.a. Arrangement fees are typically 1-2% of the facility. Rates are broadly stable following the Bank of England base rate settling after the turbulence of 2022-2024." },
    { question: "Which UK regions offer the best development finance terms?", answer: "London and the South East attract the most competitive pricing due to the deepest pool of lender interest and lower perceived sales risk. However, strong schemes in Manchester, Birmingham, Leeds, and Bristol are increasingly securing competitive terms as lenders become more comfortable with regional markets. The key driver is local demand evidence, not just geography." },
    { question: "How has the Bank of England base rate affected development finance?", answer: "The base rate directly influences the cost of funds for development lenders. After rising rapidly from 0.1% in late 2021 to over 5% by mid-2023, the rate has now stabilised. This stability has given lenders confidence to sharpen pricing, and development finance rates in 2026 are notably lower than their 2023 peaks. Variable-rate facilities have benefited most." },
    { question: "Are non-bank lenders safe to use for development finance?", answer: "Non-bank lenders now account for 40-50% of UK development finance origination and include well-capitalised institutions backed by major credit funds. They are regulated where required and operate under standard facility documentation. Many offer better terms than banks for development lending. The key is to work with an established lender with a proven track record, ideally recommended by a specialist broker." },
  ],
  comparison: [
    { question: "How do I choose the right type of property finance for my project?", answer: "The right product depends on your project type, timeline, and exit strategy. Development finance suits ground-up builds and heavy conversions. Bridging loans suit fast acquisitions and short-term holds. Mezzanine finance fills the equity gap on larger schemes. A specialist broker can model the total cost of each option for your specific project." },
    { question: "Can I combine different types of property finance on one project?", answer: "Yes, combining products is common. A typical structure might use bridging to acquire a site, development finance to fund the build, and mezzanine to stretch leverage. The bridge-to-develop strategy is one of the most established approaches. An experienced broker ensures all facilities are coordinated and that intercreditor agreements are in place where needed." },
    { question: "Is it worth using a broker for development finance?", answer: "For development finance specifically, yes. The market has over 200 active lenders with different criteria, and a specialist broker can identify the best fit in hours rather than weeks. Broker fees are typically 1% of the facility and are almost always recovered through better rates and terms than a developer could negotiate directly. The FCA requires brokers to act in your best interests." },
  ],
  "development-finance": [
    { question: "How does development finance differ from a standard mortgage?", answer: "Development finance is a short-term facility (12-24 months) with staged drawdowns aligned to construction milestones, assessed on completed value (GDV). A standard mortgage is long-term (25+ years) with a single advance based on current property value. Development finance charges interest on drawn funds only, while mortgages charge on the full balance from day one." },
    { question: "What is the minimum project size for development finance?", answer: "Most specialist lenders have a minimum facility size of 150,000-250,000, which typically corresponds to a single-unit conversion or a 2-unit development. Some niche lenders will consider facilities from 100,000. For projects below this threshold, a refurbishment bridging loan may be more appropriate." },
    { question: "Do I need a quantity surveyor report for development finance?", answer: "A QS report is not always mandatory, but it significantly strengthens your application. Lenders require evidence that build costs are realistic, which can be satisfied by two independent contractor quotes or a QS cost plan. For schemes over 2M GDV, most lenders will insist on a QS report. RICS-qualified quantity surveyors are the industry standard." },
  ],
  general: [
    { question: "What types of property finance does Construction Capital arrange?", answer: "We arrange the full spectrum of property finance: development finance for ground-up builds and conversions, bridging loans for acquisitions and short-term needs, mezzanine finance to stretch leverage, equity and joint ventures, refurbishment finance, commercial mortgages, and development exit finance. Our panel includes over 40 specialist lenders." },
    { question: "How much does it cost to use a property finance broker?", answer: "Broker fees for development finance are typically 1% of the facility, payable on successful completion. Some brokers charge an upfront fee, but we believe fees should only be payable on success. Our fee is transparent and agreed at the outset. In our experience, the savings we achieve on rates and terms consistently exceed the broker fee." },
    { question: "How quickly can property finance be arranged?", answer: "Timescales vary by product: bridging loans can complete in 5-10 working days, refurbishment finance in 2-3 weeks, development finance in 2-8 weeks depending on complexity and borrower experience. Having all documentation prepared before submission is the single most effective way to accelerate the process." },
  ],
  bridging: [
    { question: "How quickly can a bridging loan complete?", answer: "The fastest bridging loans can complete in 3-5 working days, though 7-10 working days is more typical. Speed depends on the complexity of the security, the availability of a valuation, and how quickly legal searches can be obtained. Having your solicitor instructed and searches ordered in advance can save several days." },
    { question: "Can I get a bridging loan with adverse credit?", answer: "Yes, many bridging lenders consider adverse credit. The key factor is the security value and the strength of your exit strategy, rather than personal credit history. Rates for borrowers with adverse credit are typically 0.2-0.4% per month higher than standard rates. Specific criteria vary by lender." },
  ],
  mezzanine: [
    { question: "How is mezzanine finance secured?", answer: "Mezzanine finance is secured by a second charge on the development site, sitting behind the senior lender's first charge. An intercreditor agreement between the senior and mezzanine lenders governs the priority of repayment and enforcement rights. Some mezzanine lenders also require a personal guarantee from the developer." },
    { question: "Can mezzanine finance be used for land acquisition?", answer: "Yes, mezzanine finance can be used to fund part of the land acquisition cost, particularly when the senior lender's day-one advance does not cover the full purchase price. The mezzanine advance is typically drawn alongside the senior debt on day one and repaid from sales proceeds or refinancing at the end of the project." },
  ],
  refurbishment: [
    { question: "What is the difference between refurbishment finance and a bridging loan?", answer: "Refurbishment finance is specifically structured for properties requiring works, with staged drawdowns for build costs. A bridging loan provides a single advance based on current value. For projects with significant works (over 50,000), refurbishment finance with staged funding is more cost-effective because you only pay interest on drawn funds." },
    { question: "Do I need planning permission for a refurbishment project?", answer: "It depends on the scope of works. Cosmetic refurbishment (kitchen, bathroom, redecoration) does not require planning. Change of use (e.g. office to residential) requires planning or prior approval under permitted development rights. Structural alterations may require Building Regulations approval even if planning is not needed." },
  ],
  commercial: [
    { question: "What loan-to-value can I achieve on a commercial mortgage?", answer: "Typical LTVs range from 50% to 75% depending on the property type, tenant covenant, and lease terms. Standard commercial properties (offices, industrial) with strong tenants can achieve 70-75%. Specialist or secondary properties may be limited to 50-65%. The rental income must typically cover 125-150% of the mortgage payment at a stressed interest rate." },
    { question: "Can I get a commercial mortgage on a mixed-use property?", answer: "Yes, mixed-use properties (typically a shop or office with residential above) are widely financeable. Many lenders view the residential element positively because it diversifies the income stream. Both high-street banks and specialist lenders offer mixed-use commercial mortgages at competitive terms." },
  ],
};

// ---------------------------------------------------------------------------
// Entity mentions and internal link patterns
// ---------------------------------------------------------------------------

const ENTITY_MENTIONS: Record<string, string> = {
  "FCA": "Financial Conduct Authority (FCA)",
  "RICS": "Royal Institution of Chartered Surveyors (RICS)",
  "HMRC": "HM Revenue &amp; Customs (HMRC)",
  "Land Registry": "HM Land Registry",
  "CIL": "Community Infrastructure Levy (CIL)",
  "Section 106": "Section 106",
  "NHBC": "National House Building Council (NHBC)",
  "Building Regulations": "Building Regulations",
  "SDLT": "Stamp Duty Land Tax (SDLT)",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface ParsedGuide {
  slug: string;
  title: string;
  category: string;
  hasFaqs: boolean;
  relatedSlugs: string[];
  relatedServices: string[];
  sectionHeadings: string[];
}

/**
 * Parse a guide file to extract metadata about each guide
 * without modifying the structure. Uses regex to find key info.
 */
function parseGuidesFromFile(content: string): ParsedGuide[] {
  const guides: ParsedGuide[] = [];
  // Split on guide boundaries (each starts with a slug)
  const guidePattern = /slug:\s*"([^"]+)"[\s\S]*?title:\s*"([^"]+)"[\s\S]*?category:\s*"([^"]+)"/g;
  let match;
  while ((match = guidePattern.exec(content)) !== null) {
    const slug = match[1];
    const title = match[2];
    const category = match[3];

    // Find position of this slug in the content
    const slugPos = match.index;

    // Find the next slug or end of array
    const nextSlugMatch = /slug:\s*"[^"]+"/g;
    nextSlugMatch.lastIndex = slugPos + match[0].length;
    const nextMatch = nextSlugMatch.exec(content);
    const guideEnd = nextMatch ? nextMatch.index : content.length;
    const guideContent = content.substring(slugPos, guideEnd);

    // Check for faqs
    const hasFaqs = /faqs:\s*\[/.test(guideContent);

    // Extract relatedSlugs
    const relatedSlugsMatch = guideContent.match(/relatedSlugs:\s*\[([\s\S]*?)\]/);
    const relatedSlugs: string[] = [];
    if (relatedSlugsMatch) {
      const slugMatches = relatedSlugsMatch[1].match(/"([^"]+)"/g);
      if (slugMatches) {
        for (const s of slugMatches) {
          relatedSlugs.push(s.replace(/"/g, ""));
        }
      }
    }

    // Extract relatedServices
    const relatedServicesMatch = guideContent.match(/relatedServices:\s*\[([\s\S]*?)\]/);
    const relatedServices: string[] = [];
    if (relatedServicesMatch) {
      const serviceMatches = relatedServicesMatch[1].match(/"([^"]+)"/g);
      if (serviceMatches) {
        for (const s of serviceMatches) {
          relatedServices.push(s.replace(/"/g, ""));
        }
      }
    }

    // Extract section headings
    const headingPattern = /heading:\s*"([^"]+)"/g;
    const sectionHeadings: string[] = [];
    let headingMatch;
    while ((headingMatch = headingPattern.exec(guideContent)) !== null) {
      sectionHeadings.push(headingMatch[1]);
    }

    guides.push({ slug, title, category, hasFaqs, relatedSlugs, relatedServices, sectionHeadings });
  }
  return guides;
}

/**
 * Check if content already contains a table
 */
function hasTable(content: string): boolean {
  return content.includes("<table");
}

/**
 * Check if content already has enough internal links
 */
function countInternalLinks(content: string): number {
  // Count links in the raw TS file content — quotes may be escaped as \"
  const linkPattern = /href=(?:\\?["'])\/(?:services|guides|deal-room)/g;
  const matches = content.match(linkPattern);
  return matches ? matches.length : 0;
}

/**
 * Check if content already has EEAT callouts
 */
function hasEEATCallout(content: string): boolean {
  return content.includes("Expert Insight") || content.includes("Broker's Note") || content.includes("Market Intelligence") || content.includes("border-gold bg-gold");
}

/**
 * Generate internal link HTML for a service
 */
function serviceLink(slug: string): string {
  const svc = SERVICE_LINKS[slug];
  if (!svc) return "";
  return `<a href="${svc.href}">${svc.name}</a>`;
}

/**
 * Generate internal link HTML for a guide
 */
function guideLink(slug: string): string {
  const title = GUIDE_LINKS[slug];
  if (!title) return "";
  return `<a href="/guides/${slug}">${title}</a>`;
}

/**
 * Pick N cross-link guides from the full list, excluding the current guide and its already-linked guides
 */
function pickCrossLinks(currentSlug: string, currentRelated: string[], category: string, count: number): string[] {
  // Prefer guides in the same category
  const allSlugs = Object.keys(GUIDE_LINKS);
  const excluded = new Set([currentSlug, ...currentRelated]);

  const sameCat = allSlugs.filter(s => !excluded.has(s) && getCategoryForSlug(s) === category);
  const diffCat = allSlugs.filter(s => !excluded.has(s) && getCategoryForSlug(s) !== category);

  // Shuffle both
  shuffle(sameCat);
  shuffle(diffCat);

  const result: string[] = [];
  for (const s of sameCat) {
    if (result.length >= count) break;
    result.push(s);
  }
  for (const s of diffCat) {
    if (result.length >= count) break;
    result.push(s);
  }
  return result;
}

function shuffle(arr: string[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// Simple category inference from slug (best-effort)
function getCategoryForSlug(slug: string): string {
  // Check if slug is in any known category files
  if (slug.includes("-vs-") || slug.includes("first-time") || slug.includes("permitted-development-rights-finance-guide") || slug.includes("section-106") || slug.includes("hmo-conversion")) return "comparison";
  if (slug.includes("hidden-") || slug.includes("-fees") || slug.includes("true-cost") || slug.includes("insurance-requirements") || slug.includes("title-indemnity")) return "hidden-fees";
  if (slug.includes("default") || slug.includes("lpa-receiver") || slug.includes("avoiding-default") || slug.includes("cost-overrun") || slug.includes("programme-delay") || slug.includes("personal-guarantee") || slug.includes("intercreditor") || slug.includes("breach-of-covenant") || slug.includes("refinancing-distressed") || slug.includes("contractor-insolvency") || slug.includes("planning-refusal") || slug.includes("market-downturn") || slug.includes("loan-to-value-covenant") || slug.includes("restructuring") || slug.includes("development-exit-finance-explained")) return "defaults";
  if (slug.includes("valuation") || slug.includes("rics") || slug.includes("residual-land") || slug.includes("gdv-vs") || slug.includes("challenging-low") || slug.includes("automated-valuation") || slug.includes("180-day") || slug.includes("reinstatement") || slug.includes("site-value") || slug.includes("monitoring-surveyor-valuation") || slug.includes("development-appraisal-sensitivity") || slug.includes("comparable-evidence") || slug.includes("cost-approach")) return "valuations";
  if (slug.includes("legal") || slug.includes("facility-agreement") || slug.includes("spv-structure") || slug.includes("planning-permission-development") || slug.includes("land-registry") || slug.includes("jct-") || slug.includes("building-regulations") || slug.includes("environmental-searches") || slug.includes("party-wall") || slug.includes("restrictive-covenant") || slug.includes("rights-of-way") || slug.includes("listed-building") || slug.includes("permitted-development-rights-finance") || slug.includes("cil-section") || slug.includes("completion-process")) return "legal";
  if (slug.includes("application") || slug.includes("checklist") || slug.includes("build-cost-estimates") || slug.includes("planning-application") || slug.includes("contractor-tender") || slug.includes("credit-history") || slug.includes("timeline") || slug.includes("equity-requirements") || slug.includes("conversions") || slug.includes("multi-unit") || slug.includes("ground-up") || slug.includes("phased-projects") || slug.includes("joint-borrowers") || slug.includes("second-charge") || slug.includes("pre-approval") || slug.includes("development-appraisal-lenders")) return "application";
  if (slug.includes("capital-stack") || slug.includes("senior-debt") || slug.includes("stretched-senior") || slug.includes("bridging-to-") || slug.includes("profit-margins") || slug.includes("equity-contribution") || slug.includes("drawdown-schedules") || slug.includes("interest-roll-up") || slug.includes("exit-strategies") || slug.includes("blended-finance") || slug.includes("forward-funding") || slug.includes("build-to-rent") || slug.includes("portfolio-approach") || slug.includes("land-banking") || slug.includes("100-percent")) return "structuring";
  if (slug.includes("market-2026") || slug.includes("interest-rate-trends") || slug.includes("regional-") || slug.includes("alternative-lenders") || slug.includes("sustainable-") || slug.includes("modular-") || slug.includes("permitted-development-market") || slug.includes("housing-crisis") || slug.includes("lending-criteria") || slug.includes("foreign-national")) return "market";
  return "general";
}

/**
 * Build an internal links paragraph mentioning several related guides and services
 */
function buildInternalLinksParagraph(currentSlug: string, relatedSlugs: string[], relatedServices: string[], category: string): string {
  const crossLinks = pickCrossLinks(currentSlug, relatedSlugs, category, 3);

  const parts: string[] = [];

  // Add 1-2 service links
  const unusedServices = Object.keys(SERVICE_LINKS).filter(s => !relatedServices.includes(s));
  shuffle(unusedServices);
  const serviceCount = Math.min(2, unusedServices.length);
  for (let i = 0; i < serviceCount; i++) {
    const svc = SERVICE_LINKS[unusedServices[i]];
    parts.push(`<a href="${svc.href}">${svc.name}</a>`);
  }

  // Add 2-3 guide cross-links
  for (const slug of crossLinks.slice(0, 3)) {
    parts.push(`<a href="/guides/${slug}">${GUIDE_LINKS[slug]}</a>`);
  }

  if (parts.length === 0) return "";

  // Build natural prose
  const serviceText = serviceCount > 0
    ? `For developers exploring other funding options, we also arrange ${parts.slice(0, serviceCount).join(" and ")}.`
    : "";

  const guideText = crossLinks.length > 0
    ? ` You may also find these guides useful: ${crossLinks.map(s => `<a href="/guides/${s}">${GUIDE_LINKS[s]}</a>`).join(", ")}.`
    : "";

  return serviceText + guideText;
}

/**
 * Build entity-rich paragraph for a category
 */
function buildEntityParagraph(category: string): string {
  const entitySentences: Record<string, string> = {
    "hidden-fees": "All development finance costs should be factored into your HMRC Stamp Duty Land Tax (SDLT) and tax planning calculations. The Financial Conduct Authority (FCA) regulates certain lending activities, and while most development finance falls outside FCA regulation, working with an FCA-registered broker provides additional consumer protection.",
    defaults: "In the event of a development loan default, the lender may exercise powers under the Law of Property Act 1925 to appoint an LPA receiver. The Financial Conduct Authority (FCA) and the Royal Institution of Chartered Surveyors (RICS) provide frameworks that govern valuation and enforcement processes. Developers should be aware that HM Land Registry charges and any Community Infrastructure Levy (CIL) obligations remain payable regardless of the loan status.",
    valuations: "All development finance valuations in the UK should be conducted in accordance with the Royal Institution of Chartered Surveyors (RICS) Red Book Global Standards. HM Land Registry data provides essential comparable evidence for Gross Development Value assessments. Building Regulations compliance and National House Building Council (NHBC) warranty cover directly affect the valuation of completed units.",
    legal: "Development finance legal due diligence involves multiple regulatory bodies and statutory requirements. HM Land Registry registration is mandatory for all property charges. Building Regulations approval must be obtained from either the local authority building control or an approved inspector. The National House Building Council (NHBC) or equivalent warranty provider must be in place for new-build residential units. Section 106 obligations and Community Infrastructure Levy (CIL) payments must be accounted for in the legal structure.",
    application: "Your development finance application should demonstrate compliance with Building Regulations and planning permission requirements. HM Revenue &amp; Customs (HMRC) Stamp Duty Land Tax (SDLT) calculations must be accurate in your development appraisal. Lenders will verify your site's status with HM Land Registry and may require RICS-qualified professional reports including a quantity surveyor cost plan and a monitoring surveyor assessment.",
    structuring: "The capital stack structure must account for all statutory costs including Stamp Duty Land Tax (SDLT) payable to HMRC, Community Infrastructure Levy (CIL), and any Section 106 obligations. An SPV structure registered with Companies House and reflected at HM Land Registry is standard practice. The Financial Conduct Authority (FCA) regulates certain elements of property finance, and professional valuations must comply with Royal Institution of Chartered Surveyors (RICS) standards.",
    market: "The UK development finance market operates within a framework set by the Financial Conduct Authority (FCA), the Bank of England prudential regulation, and the Royal Institution of Chartered Surveyors (RICS) valuation standards. HM Land Registry transaction data provides real-time market intelligence, while HMRC Stamp Duty Land Tax (SDLT) receipts serve as a leading indicator of market activity. Government housing targets and National House Building Council (NHBC) new-build registration data inform lender appetite and confidence.",
    comparison: "When comparing property finance options, consider the regulatory framework: the Financial Conduct Authority (FCA) regulates certain types of lending, while RICS standards govern valuations across all product types. HM Land Registry registration applies to all secured lending, and Building Regulations compliance affects the exit valuation regardless of which finance product you use.",
    "development-finance": "Development finance in the UK is governed by a comprehensive regulatory and professional framework. RICS Red Book valuations are the standard for all development lending. HM Land Registry handles the registration of all security charges. Building Regulations sign-off and NHBC (or equivalent) warranty cover are prerequisites for selling completed residential units. HMRC SDLT calculations must be precisely modelled in your development appraisal.",
    general: "UK property finance operates within frameworks set by the Financial Conduct Authority (FCA), the Royal Institution of Chartered Surveyors (RICS), and HM Land Registry. Developers should account for HMRC Stamp Duty Land Tax (SDLT), Building Regulations compliance, and any Section 106 or Community Infrastructure Levy (CIL) obligations in their project planning.",
    bridging: "Bridging loan security is registered with HM Land Registry, and the property will require a RICS-compliant valuation. If using a bridge to acquire a site for subsequent development, consider how Building Regulations, planning permission, and any Community Infrastructure Levy (CIL) obligations will affect the project timeline and exit strategy.",
    mezzanine: "Mezzanine finance sits behind the senior lender's first charge registered at HM Land Registry. The intercreditor agreement between senior and mezzanine lenders governs enforcement rights. RICS valuations determine the Gross Development Value on which leverage calculations are based. The Financial Conduct Authority (FCA) regulatory position should be understood, particularly regarding the treatment of personal guarantees.",
    refurbishment: "Refurbishment projects must comply with Building Regulations, which are enforced by either the local authority building control or an approved inspector. HM Land Registry registration applies to all secured lending. For residential conversions, National House Building Council (NHBC) or equivalent warranty cover may be required depending on the scope of works and the nature of the exit strategy.",
    commercial: "Commercial mortgage lending is governed by the Financial Conduct Authority (FCA) where the borrower is an individual occupier. RICS valuations are standard, and HM Land Registry registration applies to all secured commercial property finance. Lenders will assess energy performance certificates (EPCs) and compliance with the Minimum Energy Efficiency Standards (MEES) regulations for commercial lettings.",
  };

  return entitySentences[category] || entitySentences["general"];
}

// ---------------------------------------------------------------------------
// Main enrichment logic
// ---------------------------------------------------------------------------

function enrichFile(filePath: string): { guidesProcessed: number; tablesAdded: number; linksAdded: number; faqsAdded: number; eeatsAdded: number } {
  let content = fs.readFileSync(filePath, "utf-8");
  const guides = parseGuidesFromFile(content);
  let tablesAdded = 0;
  let linksAdded = 0;
  let faqsAdded = 0;
  let eeatsAdded = 0;

  for (const guide of guides) {
    const { slug, category, hasFaqs, relatedSlugs, relatedServices, sectionHeadings } = guide;

    // Always scope all searches to start from this guide's slug position
    const guideSlugIdx = content.indexOf(`slug: "${slug}"`);
    if (guideSlugIdx === -1) continue;

    // Find the end of this guide's content (next slug or end of file)
    const nextSlugPattern = /slug:\s*"/g;
    nextSlugPattern.lastIndex = guideSlugIdx + slug.length + 10;
    const nextSlugResult = nextSlugPattern.exec(content);
    const guideEndIdx = nextSlugResult ? nextSlugResult.index : content.length;

    // 1. Add table to the appropriate section
    const guideChunk = content.substring(guideSlugIdx, guideEndIdx);
    if (!hasTable(guideChunk)) {
      const tableHtml = SLUG_SPECIFIC_TABLES[slug] || (CATEGORY_TABLES[category] ? CATEGORY_TABLES[category](slug, guide.title) : CATEGORY_TABLES["general"](slug, guide.title));

      if (tableHtml) {
        // Find the best section to insert the table into
        let targetSection = "";
        if (category === "comparison") {
          targetSection = sectionHeadings.find(h => /compar|side.by.side|versus|vs|difference|overview/i.test(h)) || sectionHeadings[1] || sectionHeadings[0];
        } else if (category === "hidden-fees") {
          targetSection = sectionHeadings.find(h => /cost|fee|charge|price|breakdown|structure/i.test(h)) || sectionHeadings[1] || sectionHeadings[0];
        } else if (category === "defaults") {
          targetSection = sectionHeadings.find(h => /timeline|process|stage|step|procedure/i.test(h)) || sectionHeadings[1] || sectionHeadings[0];
        } else if (category === "valuations") {
          targetSection = sectionHeadings.find(h => /method|approach|type|comparison|overview/i.test(h)) || sectionHeadings[1] || sectionHeadings[0];
        } else if (category === "legal") {
          targetSection = sectionHeadings.find(h => /requirement|checklist|process|document|compliance/i.test(h)) || sectionHeadings[1] || sectionHeadings[0];
        } else if (category === "application") {
          targetSection = sectionHeadings.find(h => /checklist|document|requirement|what you need|prepare/i.test(h)) || sectionHeadings[0] || sectionHeadings[0];
        } else if (category === "structuring") {
          targetSection = sectionHeadings.find(h => /capital|stack|layer|structure|overview|senior/i.test(h)) || sectionHeadings[1] || sectionHeadings[0];
        } else if (category === "market") {
          targetSection = sectionHeadings.find(h => /rate|trend|current|overview|state|market/i.test(h)) || sectionHeadings[1] || sectionHeadings[0];
        } else {
          targetSection = sectionHeadings[1] || sectionHeadings[0];
        }

        if (targetSection) {
          // IMPORTANT: scope the heading search to start from the current guide's slug position
          const sectionPattern = `heading: "${targetSection}"`;
          const sectionIdx = content.indexOf(sectionPattern, guideSlugIdx);
          if (sectionIdx !== -1) {
            const afterSection = content.substring(sectionIdx);
            const contentArrayStart = afterSection.indexOf("content: [");
            if (contentArrayStart !== -1) {
              const fromContentArray = afterSection.substring(contentArrayStart);
              let depth = 0;
              let closingIdx = -1;
              for (let i = 0; i < fromContentArray.length; i++) {
                if (fromContentArray[i] === "[" && fromContentArray[i-1] !== "\\") depth++;
                if (fromContentArray[i] === "]" && fromContentArray[i-1] !== "\\") {
                  depth--;
                  if (depth === 0) {
                    closingIdx = i;
                    break;
                  }
                }
              }

              if (closingIdx !== -1) {
                const absoluteClosingIdx = sectionIdx + contentArrayStart + closingIdx;
                const tableString = `\n          "${tableHtml.replace(/"/g, '\\"')}",`;
                const insertPoint = absoluteClosingIdx;

                const lastChar = content.substring(0, insertPoint).trimEnd().slice(-1);
                const needsComma = lastChar !== "," && lastChar !== "[";
                const prefix = needsComma ? "," : "";

                content = content.substring(0, insertPoint) + prefix + tableString + "\n        " + content.substring(insertPoint);
                tablesAdded++;
              }
            }
          }
        }
      }
    }

    // 2. Add EEAT callout block to the first section that doesn't have one
    // Re-find slug position since content may have changed from table insertion
    const slugStartIdx = content.indexOf(`slug: "${slug}"`);
    const nextSlugForEeat = /slug:\s*"/g;
    nextSlugForEeat.lastIndex = slugStartIdx + slug.length + 10;
    const nextSlugEeatResult = nextSlugForEeat.exec(content);
    const guideEndForEeat = nextSlugEeatResult ? nextSlugEeatResult.index : content.length;
    const slugSection = content.substring(slugStartIdx, guideEndForEeat);
    if (!hasEEATCallout(slugSection)) {
      const callouts = EEAT_CALLOUTS[category] || EEAT_CALLOUTS["general"];
      if (callouts && callouts.length > 0) {
        const callout = callouts[0];

        const firstHeading = sectionHeadings[0];
        if (firstHeading) {
          const headingPattern = `heading: "${firstHeading}"`;
          const headingIdx = content.indexOf(headingPattern, slugStartIdx);
          if (headingIdx !== -1) {
            const afterHeading = content.substring(headingIdx);
            const contentArrayStart = afterHeading.indexOf("content: [");
            if (contentArrayStart !== -1) {
              const fromArr = afterHeading.substring(contentArrayStart);
              let depth = 0;
              let closingIdx = -1;
              for (let i = 0; i < fromArr.length; i++) {
                if (fromArr[i] === "[" && (i === 0 || fromArr[i-1] !== "\\")) depth++;
                if (fromArr[i] === "]" && fromArr[i-1] !== "\\") {
                  depth--;
                  if (depth === 0) {
                    closingIdx = i;
                    break;
                  }
                }
              }

              if (closingIdx !== -1) {
                const absIdx = headingIdx + contentArrayStart + closingIdx;
                const calloutString = `\n          "${callout.replace(/"/g, '\\"')}",`;
                const lastChar = content.substring(0, absIdx).trimEnd().slice(-1);
                const prefix = lastChar !== "," && lastChar !== "[" ? "," : "";
                content = content.substring(0, absIdx) + prefix + calloutString + "\n        " + content.substring(absIdx);
                eeatsAdded++;
              }
            }
          }
        }
      }
    }

    // 3. Add internal links paragraph + entity mentions to the last section
    const currentSlugIdx = content.indexOf(`slug: "${slug}"`);
    const nextSlugForLinks = /slug:\s*"/g;
    nextSlugForLinks.lastIndex = currentSlugIdx + slug.length + 10;
    const nextSlugLinksResult = nextSlugForLinks.exec(content);
    const guideEndForLinks = nextSlugLinksResult ? nextSlugLinksResult.index : content.length;
    const currentSlugSection = content.substring(currentSlugIdx, guideEndForLinks);
    const currentLinkCount = countInternalLinks(currentSlugSection);

    if (currentLinkCount < 5) {
      const lastHeading = sectionHeadings[sectionHeadings.length - 1];
      if (lastHeading) {
        const headingPattern = `heading: "${lastHeading}"`;
        const headingIdx = content.indexOf(headingPattern, currentSlugIdx);
        if (headingIdx !== -1) {
          const afterHeading = content.substring(headingIdx);
          const contentArrayStart = afterHeading.indexOf("content: [");
          if (contentArrayStart !== -1) {
            const fromArr = afterHeading.substring(contentArrayStart);
            let depth = 0;
            let closingIdx = -1;
            for (let i = 0; i < fromArr.length; i++) {
              if (fromArr[i] === "[" && (i === 0 || fromArr[i-1] !== "\\")) depth++;
              if (fromArr[i] === "]" && fromArr[i-1] !== "\\") {
                depth--;
                if (depth === 0) {
                  closingIdx = i;
                  break;
                }
              }
            }

            if (closingIdx !== -1) {
              const absIdx = headingIdx + contentArrayStart + closingIdx;

              // Build internal links paragraph
              const linksParagraph = buildInternalLinksParagraph(slug, relatedSlugs, relatedServices, category);

              // Build entity paragraph
              const entityParagraph = buildEntityParagraph(category);

              if (linksParagraph || entityParagraph) {
                const combinedParagraph = [linksParagraph, entityParagraph].filter(Boolean).join(" ");
                const linkString = `\n          "${combinedParagraph.replace(/"/g, '\\"')}",`;
                const lastChar = content.substring(0, absIdx).trimEnd().slice(-1);
                const prefix = lastChar !== "," && lastChar !== "[" ? "," : "";
                content = content.substring(0, absIdx) + prefix + linkString + "\n        " + content.substring(absIdx);
                linksAdded++;
              }
            }
          }
        }
      }
    }

    // 4. Add FAQs if missing
    if (!hasFaqs) {
      const faqsForCategory = CATEGORY_FAQS[category] || CATEGORY_FAQS["general"];
      if (faqsForCategory && faqsForCategory.length > 0) {
        // Pick 3-4 FAQs
        const selectedFaqs = faqsForCategory.slice(0, Math.min(4, faqsForCategory.length));

        // Find the position to insert faqs - after relatedLocations array
        const slugPos = content.indexOf(`slug: "${slug}"`);
        if (slugPos !== -1) {
          // Find relatedLocations closing bracket
          const afterSlug = content.substring(slugPos);
          const relatedLocationsMatch = afterSlug.match(/relatedLocations:\s*\[[\s\S]*?\]/);
          if (relatedLocationsMatch) {
            const relLocEnd = slugPos + (afterSlug.indexOf(relatedLocationsMatch[0]) + relatedLocationsMatch[0].length);

            // Build the faqs array string
            const faqStrings = selectedFaqs.map(faq => {
              const q = faq.question.replace(/"/g, '\\"');
              const a = faq.answer.replace(/"/g, '\\"');
              return `      {\n        question: "${q}",\n        answer: "${a}"\n      }`;
            });
            const faqsBlock = `,\n    faqs: [\n${faqStrings.join(",\n")}\n    ]`;

            content = content.substring(0, relLocEnd) + faqsBlock + content.substring(relLocEnd);
            faqsAdded++;
          }
        }
      }
    }
  }

  fs.writeFileSync(filePath, content, "utf-8");
  return { guidesProcessed: guides.length, tablesAdded, linksAdded, faqsAdded, eeatsAdded };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  console.log("=== Guide Enrichment Script ===\n");

  let totalGuides = 0;
  let totalTables = 0;
  let totalLinks = 0;
  let totalFaqs = 0;
  let totalEeats = 0;

  for (const file of FILES_TO_PROCESS) {
    const filePath = path.join(GUIDES_DIR, file);

    if (!fs.existsSync(filePath)) {
      console.log(`  SKIP: ${file} (not found)`);
      continue;
    }

    console.log(`Processing: ${file}`);
    const result = enrichFile(filePath);
    console.log(`  Guides: ${result.guidesProcessed}, Tables: +${result.tablesAdded}, Links: +${result.linksAdded}, FAQs: +${result.faqsAdded}, EEAT: +${result.eeatsAdded}`);

    totalGuides += result.guidesProcessed;
    totalTables += result.tablesAdded;
    totalLinks += result.linksAdded;
    totalFaqs += result.faqsAdded;
    totalEeats += result.eeatsAdded;
  }

  console.log(`\n=== Summary ===`);
  console.log(`Total guides processed: ${totalGuides}`);
  console.log(`Tables added: ${totalTables}`);
  console.log(`Internal link blocks added: ${totalLinks}`);
  console.log(`FAQ blocks added: ${totalFaqs}`);
  console.log(`EEAT callouts added: ${totalEeats}`);
  console.log(`\nDone!`);
}

main();
