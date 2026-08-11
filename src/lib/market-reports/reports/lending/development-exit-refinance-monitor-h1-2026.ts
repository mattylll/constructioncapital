import type { MarketReport } from "../../types";

const report: MarketReport = {
  slug: "development-exit-refinance-monitor-h1-2026",
  title: "Development Exit and Refinance Monitor: H1 2026",
  metaTitle: "UK Development Exit Finance H1 2026 | Refinance Event Data",
  metaDescription: "799 title-level refinance events identified in H1 2026. Senior-to-successor charge sequencing from Companies House, quarterly.",
  excerpt: "799 refinance events in H1 2026: senior facilities redeemed at or near a successor's registration, the fingerprint of the dev-exit market.",
  category: "lending",
  datePublished: "2026-08-11",
  dateModified: "2026-08-11",
  readingTime: "3 min read",
  sections: [
    {
      heading: "Refinance activity in H1 2026",
      content: [
        `Tracking pairs of charges registered against the same property title, the Monitor identified <strong>799 refinance events</strong> in H1 2026: cases where an unrelated senior lender's charge was satisfied at or near the registration of a successor facility. This is the fingerprint of the development exit and refinance market, developments moving from build facilities to exit bridges, term debt or sales-period funding.`,
        `Quarterly: 402 in 2026-Q1, 397 in 2026-Q2. Related-party successions (a lender's own trustee or group vehicle) are excluded.`,
        `The redemption data in the <a href="/market-reports/development-lending-monitor-h1-2026">national Monitor</a> corroborates the trend: 18-month redemption rates have risen every cohort year since 2021, consistent with an increasingly liquid exit market.`,
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
    { question: "How active is the UK development exit finance market?", answer: `The Monitor identified 799 title-level refinance events in H1 2026, where a senior charge was redeemed at or near the registration of a successor facility from an unrelated lender.` },
  ],
  relatedReportSlugs: ["development-lending-monitor-h1-2026","mezzanine-junior-debt-monitor-h1-2026"],
  relatedTownSlugs: [],
  relatedServiceSlugs: ["development-finance", "bridging-loans", "development-exit-finance"],
  charts: { quarterlyTrend: [{"name":"2023-Q1","value":179},{"name":"2023-Q2","value":191},{"name":"2023-Q3","value":226},{"name":"2023-Q4","value":229},{"name":"2024-Q1","value":223},{"name":"2024-Q2","value":270},{"name":"2024-Q3","value":257},{"name":"2024-Q4","value":317},{"name":"2025-Q1","value":310},{"name":"2025-Q2","value":363},{"name":"2025-Q3","value":337},{"name":"2025-Q4","value":365},{"name":"2026-Q1","value":402},{"name":"2026-Q2","value":397}] },
};

export default report;
