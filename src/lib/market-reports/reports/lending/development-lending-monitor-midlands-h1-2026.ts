import type { MarketReport } from "../../types";

const report: MarketReport = {
  slug: "development-lending-monitor-midlands-h1-2026",
  title: "Development Lending Monitor, Midlands: H1 2026",
  metaTitle: "Midlands Development Lending H1 2026 | Monitor Regional Edition",
  metaDescription: "4,389 secured development facilities against Midlands property in H1 2026 (+8.2% year on year). Property-level Companies House charge data.",
  excerpt: "4,389 facilities secured on Midlands property in H1 2026, 16.4% of regionally-attributable activity, +8.2% year on year.",
  category: "lending",
  region: "Midlands",
  datePublished: "2026-08-11",
  dateModified: "2026-08-11",
  readingTime: "3 min read",
  sections: [
    {
      heading: "Midlands in H1 2026",
      content: [
        `Development-active lenders took security over Midlands property in <strong>4,389 new facilities</strong> during H1 2026, +8.2% against the same period last year. That is 16.4% of all regionally-attributable lending events in the period.`,
        `Attribution here is to the property itself, not the borrower's registered office. Most development SPVs are registered at an accountant's or solicitor's address, frequently in London, so registered-office geography badly overstates the capital and understates every other region. The Monitor extracts the charged property's postcode from the legal particulars of each filing instead; 81% of facilities can be located this way.`,
        `Quarterly pattern: 2,214 in 2026-Q1, 2,175 in 2026-Q2.`,
      ],
    },
    {
      heading: "Methodology and data notes",
      content: [
        `This edition of the Monitor is built from every mortgage and charge registered at Companies House, cross-referenced against a curated set of development-active lenders in three tiers: pure-play development lenders, banks and bridging lenders with substantial development arms, and institutional real estate credit. Lender identities are resolved through their funding-line vehicles and security trustees, so lending through numbered SPVs is captured against the economic lender. No individual lender is named or ranked in this publication; concentration is reported only in aggregate.`,
        `Charge data runs to 2026-07-31; satisfaction filings to 2026-08-03. Companies House filings record no loan values (a 2013 reform removed the amount-secured field), so activity is measured in charge registrations and distinct borrower counts, never estimated loan books.`,
        `Regional attribution uses the postcode of the charged property, extracted from the legal particulars of each charge, not the borrower's registered office. Property postcodes are recoverable for 81% of ecosystem charges; regional figures are shares of that covered set. Coverage is England and Wales. Any cut with fewer than 30 observations is suppressed rather than published.`,
        `Full methodology, definitions and revision policy: <a href="/lending-trends/methodology">Monitor methodology</a>. The underlying aggregates are published as open data on the report page.`,
      ],
    },
    {
      heading: "What this means for developers seeking finance",
      content: [
        `A market writing roughly 1,250 secured facilities a week across 35 active lenders is a market with genuine competition for good schemes. Pricing and leverage still vary widely between lenders, which is exactly where whole-of-market advice earns its keep.`,
        `Construction Capital arranges development finance, bridging and development exit facilities across the lenders behind these numbers. To discuss a scheme, call <a href="tel:+441582227007">01582 227 007</a> or start with the <a href="/deal-room">deal room</a>.`,
      ],
    },
  ],
  faqs: [
    { question: "How much development lending happened in Midlands in H1 2026?", answer: `4,389 secured facilities were registered against Midlands property by development-active lenders in H1 2026, 16.4% of regionally-attributable UK activity. Companies House records no loan values, so counts are the reliable public measure.` },
  ],
  relatedReportSlugs: ["development-lending-monitor-h1-2026"],
  relatedTownSlugs: [],
  relatedServiceSlugs: ["development-finance", "bridging-loans", "development-exit-finance"],
  charts: { quarterlyTrend: [{"name":"2023-Q1","value":1309},{"name":"2023-Q2","value":1223},{"name":"2023-Q3","value":1316},{"name":"2023-Q4","value":1474},{"name":"2024-Q1","value":1437},{"name":"2024-Q2","value":1650},{"name":"2024-Q3","value":1802},{"name":"2024-Q4","value":2252},{"name":"2025-Q1","value":2160},{"name":"2025-Q2","value":1895},{"name":"2025-Q3","value":2066},{"name":"2025-Q4","value":2211},{"name":"2026-Q1","value":2214},{"name":"2026-Q2","value":2175}] },
};

export default report;
