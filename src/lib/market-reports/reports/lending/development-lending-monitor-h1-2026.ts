import type { MarketReport } from "../../types";

const report: MarketReport = {
  slug: "development-lending-monitor-h1-2026",
  title: "Development Lending Monitor: H1 2026",
  metaTitle: "UK Development Lending Monitor H1 2026 | Charge Data Analysis",
  metaDescription: "32,529 secured facilities registered by development-active lenders in H1 2026, across 35 active lenders. Companies House charge data, analysed quarterly.",
  excerpt: "32,529 new secured facilities in H1 2026 (+16.6% on H1 2025), 35 active lenders, and an 18-month redemption rate that has risen every cohort year since 2021.",
  category: "lending",
  datePublished: "2026-08-11",
  dateModified: "2026-08-11",
  readingTime: "4 min read",
  sections: [
    {
      heading: "The market in H1 2026",
      content: [
        `Development-active lenders registered <strong>32,529 new secured facilities</strong> against UK borrowers in H1 2026, +16.6% against the same period last year. Quarter by quarter the market was remarkably steady: 16,191 charges in 2026-Q1 and 16,338 in 2026-Q2, each against roughly 9,800 distinct borrower companies.`,
        `Pure-play development lenders wrote 470 facilities over the same period (404 in the prior-year period). The wider register, all lenders of every kind, recorded 121,546 charges, so development-active lenders account for roughly 27% of all UK secured lending events by count.`,
        `New vehicles matter: <strong>24% of facilities</strong> in the latest quarter were written against companies incorporated within the previous twelve months, the classic single-scheme SPV pattern.`,
      ],
    },
    {
      heading: "Lender breadth and concentration",
      content: [
        `35 lenders in our development-active set wrote three or more facilities in the latest quarter. The five most active accounted for 70% of activity and the top ten for 88%, a Herfindahl-Hirschman index of 1,306, which competition authorities would class as moderately concentrated. We publish concentration only in aggregate; this Monitor does not rank or name individual lenders.`,
        `Breadth has practical meaning for borrowers: a moderately concentrated market with 35 genuinely active lenders is one where terms are still won by shopping the whole market rather than defaulting to the biggest names.`,
      ],
    },
    {
      heading: "Redemptions: loans are exiting faster",
      content: [
        `The clearest trend in the data is in how quickly facilities are redeemed. Of loans originated in 2021, 7.1% were satisfied within 18 months. That figure has risen every cohort since: <strong>11.1% for the 2024 cohort</strong> (49,861 facilities). These are fixed-window rates, so recent cohorts are only included once every loan has had the full 18 months to run; the comparison is like for like.`,
        `Faster redemption is consistent with what the refinance data shows below: an active exit and refinance market pulling loans off books earlier.`,
      ],
    },
    {
      heading: "Refinance and junior debt activity",
      content: [
        `Where two charges are registered against the same property title by unrelated lenders, the sequencing reveals the product. In H1 2026 we identified <strong>799 refinance events</strong> (a senior charge satisfied at or near the registration of a successor) and <strong>779 third-party junior charges</strong> registered alongside a live senior facility, the signature of mezzanine and second-charge lending. Related-party structures such as a lender's own security trustee are excluded from both counts.`,
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
        `Construction Capital arranges development finance, bridging and development exit facilities across the lenders behind these numbers. To discuss a scheme, call <a href="tel:+442038163693">+44 20 3816 3693</a> or start with the <a href="/deal-room">deal room</a>.`,
      ],
    },
  ],
  faqs: [
    { question: "How many development finance loans were written in the UK in H1 2026?", answer: `Development-active lenders registered 32,529 new secured facilities at Companies House in H1 2026. Companies House does not record loan values, so the count of registered charges is the most reliable public measure of activity.` },
    { question: "How concentrated is the UK development lending market?", answer: `In the latest quarter the five most active development-focused lenders accounted for 70% of new facilities and the top ten for 88%, with 35 lenders writing three or more facilities. That is a moderately concentrated market by HHI standards.` },
    { question: "How quickly are UK development loans repaid?", answer: `11.1% of secured facilities originated by development-active lenders in 2024 were fully redeemed within 18 months, up from 7.1% for the 2021 cohort. The trend has risen every year since 2021.` },
  ],
  relatedReportSlugs: ["development-exit-refinance-monitor-h1-2026","mezzanine-junior-debt-monitor-h1-2026"],
  relatedTownSlugs: [],
  relatedServiceSlugs: ["development-finance", "bridging-loans", "development-exit-finance"],
  charts: { quarterlyTrend: [{"name":"2023-Q1","value":9461},{"name":"2023-Q2","value":9036},{"name":"2023-Q3","value":9878},{"name":"2023-Q4","value":10123},{"name":"2024-Q1","value":10626},{"name":"2024-Q2","value":12068},{"name":"2024-Q3","value":12793},{"name":"2024-Q4","value":14374},{"name":"2025-Q1","value":14447},{"name":"2025-Q2","value":13453},{"name":"2025-Q3","value":15301},{"name":"2025-Q4","value":15907},{"name":"2026-Q1","value":16191},{"name":"2026-Q2","value":16338}] },
};

export default report;
