import type { MarketReport } from "../../types";

const report: MarketReport = {
  slug: "mezzanine-junior-debt-monitor-h1-2026",
  title: "Mezzanine and Junior Debt Monitor: H1 2026",
  metaTitle: "UK Mezzanine Finance Activity H1 2026 | Junior Charge Data",
  metaDescription: "779 third-party junior charges registered alongside live senior facilities in H1 2026. Companies House title-level analysis.",
  excerpt: "779 third-party junior charges alongside live senior debt in H1 2026: measured mezzanine and second-charge activity, not survey sentiment.",
  category: "lending",
  datePublished: "2026-08-11",
  dateModified: "2026-08-11",
  readingTime: "3 min read",
  sections: [
    {
      heading: "Junior debt activity in H1 2026",
      content: [
        `Where a second charge is registered on a title while an unrelated lender's senior charge remains outstanding, someone is layering debt: mezzanine, second-charge or stretch structures. The Monitor counted <strong>779 such third-party junior charges</strong> in H1 2026: 359 in 2026-Q1, 420 in 2026-Q2.`,
        `Same-group structures are excluded, so a lender registering both a senior and junior charge through its own vehicles does not count. What remains is genuine third-party capital-stack layering, the measurable core of the UK mezzanine market. Companies House records no amounts, so this is an activity count, not a volume estimate; it is also a floor, since junior positions secured by other means (share charges alone, unregistered instruments) are invisible to the register.`,
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
    { question: "How large is the UK mezzanine development finance market?", answer: `No public source records mezzanine loan values, but activity is measurable: 779 third-party junior charges were registered alongside live senior facilities in H1 2026. Related-party structures are excluded, so this is a floor for genuine capital-stack layering.` },
  ],
  relatedReportSlugs: ["development-lending-monitor-h1-2026","development-exit-refinance-monitor-h1-2026"],
  relatedTownSlugs: [],
  relatedServiceSlugs: ["development-finance", "bridging-loans", "development-exit-finance"],
  charts: { quarterlyTrend: [{"name":"2023-Q1","value":92},{"name":"2023-Q2","value":95},{"name":"2023-Q3","value":118},{"name":"2023-Q4","value":133},{"name":"2024-Q1","value":125},{"name":"2024-Q2","value":132},{"name":"2024-Q3","value":164},{"name":"2024-Q4","value":223},{"name":"2025-Q1","value":231},{"name":"2025-Q2","value":256},{"name":"2025-Q3","value":257},{"name":"2025-Q4","value":357},{"name":"2026-Q1","value":359},{"name":"2026-Q2","value":420}] },
};

export default report;
