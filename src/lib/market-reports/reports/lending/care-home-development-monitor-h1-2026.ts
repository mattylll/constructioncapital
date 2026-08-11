import type { MarketReport } from "../../types";

// SAMPLE NICHE EDITION — first of the asset-class Monitor series.
// Every number traces to data/lending-monitor/niche-care-homes-h1-2026.json
// (planning: 264-town dataset, 12-month windows only, condition-filing noise
// filtered, cross-authority deduped) and the CH charge register (care-sector
// SIC borrowers). No lender is named.

const report: MarketReport = {
  slug: "care-home-development-monitor-h1-2026",
  title: "Care Home Development Monitor: H1 2026",
  metaTitle: "UK Care Home Development Pipeline H1 2026 | Planning & Lending Data",
  metaDescription:
    "125 care home planning applications in H1 2026 (1,560 beds, £544m estimated GDV), applications rising every quarter, and 1,828 secured facilities against care-sector borrowers. Primary-source data.",
  excerpt:
    "Care home applications rose every quarter to mid-2026: 125 schemes and 1,560 beds entered the pipeline in H1 alone, against a £1.1bn rolling-year pipeline. Lending activity held flat while the borrower base broadened.",
  category: "lending",
  datePublished: "2026-08-11",
  dateModified: "2026-08-11",
  readingTime: "6 min read",
  sections: [
    {
      heading: "The care home pipeline in H1 2026",
      content: [
        `Developers submitted <strong>125 care and retirement living applications</strong> across our 264-town planning dataset in H1 2026, proposing around <strong>1,560 beds</strong> with an estimated development value of <strong>£544m</strong>. Momentum built through the period: quarterly submissions ran 33, 54, 65 and 60 from Q3 2025 through Q2 2026, so the two most recent full quarters are the two strongest in the dataset.`,
        `Over the full rolling year the pipeline stands at <strong>315 live schemes, roughly 3,430 beds and £1.1bn in estimated GDV</strong>, of which 48 applications have already been approved and 267 remain in determination. Care development is a slow-consented asset class; a pipeline skewed heavily to pending applications is normal, and it is where development finance demand forms next.`,
        `The largest schemes in determination illustrate the scale end of the market: a 446-bed hybrid application in Great Yarmouth, a 412-bed outline in Thurrock, and reserved-matters stages for 343 beds in North Norfolk and 300 in Reigate and Banstead.`,
      ],
    },
    {
      heading: "Where the beds are planned",
      content: [
        `<table><thead><tr><th>Region</th><th>Applications (12m)</th><th>Beds</th><th>Est. GDV</th></tr></thead><tbody><tr><td>London &amp; South East</td><td>104</td><td>1,310</td><td>£557m</td></tr><tr><td>East of England</td><td>29</td><td>815</td><td>£195m</td></tr><tr><td>Midlands</td><td>75</td><td>737</td><td>£211m</td></tr><tr><td>South West</td><td>26</td><td>260</td><td>£84m</td></tr><tr><td>North East &amp; Yorkshire</td><td>56</td><td>258</td><td>£44m</td></tr><tr><td>Wales</td><td>5</td><td>37</td><td>£5m</td></tr><tr><td>North West</td><td>20</td><td>9</td><td>£2m</td></tr></tbody></table>`,
        `London and the South East dominate by value as well as volume, but the East of England punches far above its application count: 29 schemes carrying 815 beds, the largest average scheme size in the country, driven by the Great Yarmouth and North Norfolk consents. The North West's near-absence of bed numbers reflects smaller extension and conversion schemes rather than an empty market, and is worth watching rather than dismissing.`,
      ],
    },
    {
      heading: "The lending side: flat activity, broader borrower base",
      content: [
        `Secured lending to care-sector operators held essentially level: <strong>1,828 new facilities</strong> were registered against borrowers with care-sector classifications in H1 2026, against 1,885 in H1 2025, a change of minus 3%. The distinct borrower count moved the other way, up 3.6% to 1,356.`,
        `Flat facility numbers on a wider borrower base is the signature of a market where lending is spreading across more, smaller operators rather than concentrating in large group refinancings. For developers, the read-through is that lender appetite for the sector is intact while the demand pipeline above is still building towards consent.`,
      ],
    },
    {
      heading: "Methodology and data notes",
      content: [
        `Planning figures are drawn from applications scraped directly from local planning authority portals covering 264 UK towns, classified to the care sector by proposal text (care home, nursing home, extra care, assisted living, retirement living and C2-use applications). Condition-compliance, discharge-of-condition and non-material-amendment filings are excluded so that a scheme is counted once, not once per filing; duplicate entries appearing in more than one authority's register are removed. Twelve towns whose data currently covers a shorter window are excluded entirely rather than undercounted. Bed and value figures are as stated by applicants or estimated from unit counts, and pipeline GDV is an estimate, not a valuation.`,
        `Lending figures count mortgage and charge registrations at Companies House against borrowers carrying care-sector SIC classifications. Companies House records no loan values, so lending is measured in facility and borrower counts, which anyone can verify against the public register. Full definitions, suppression rules and the revision policy: <a href="/lending-trends/methodology">Monitor methodology</a>.`,
      ],
    },
    {
      heading: "What this means for care home developers",
      content: [
        `A rising application pipeline against flat lending is a timing story: the schemes submitted in H1 2026 will reach consent, and funding requirement, from late 2026 into 2027. Operators and developers bringing forward care schemes are entering a market where lender appetite is proven but not yet crowded with competing consented stock.`,
        `Construction Capital arranges development finance for care, retirement and assisted living schemes across the lenders behind these numbers. To discuss a scheme, call <a href="tel:+442038163693">+44 20 3816 3693</a> or start with the <a href="/deal-room">deal room</a>.`,
      ],
    },
  ],
  faqs: [
    {
      question: "How many care homes are being built in the UK in 2026?",
      answer:
        "Across a 264-town planning dataset, 125 care and retirement living applications were submitted in H1 2026 alone, proposing around 1,560 beds. The rolling-year pipeline stands at 315 live schemes and roughly 3,430 beds with an estimated development value of £1.1bn, of which 48 schemes are already approved.",
    },
    {
      question: "Which UK regions have the most care home development?",
      answer:
        "London and the South East lead with 104 applications and 1,310 beds over the rolling year, followed by the Midlands on 75 applications. The East of England has the largest average scheme size: 29 applications carrying 815 beds, including the largest schemes currently in determination.",
    },
    {
      question: "Are lenders still active in care home finance?",
      answer:
        "Yes. 1,828 secured facilities were registered against care-sector borrowers in H1 2026, essentially level with H1 2025, while the number of distinct borrowers rose 3.6% to 1,356 — lending is spreading across more operators rather than shrinking.",
    },
  ],
  relatedReportSlugs: [
    "development-lending-monitor-h1-2026",
    "development-exit-refinance-monitor-h1-2026",
  ],
  relatedTownSlugs: [],
  relatedServiceSlugs: ["development-finance", "bridging-loans", "commercial-mortgages"],
  charts: {
    quarterlyTrend: [
      { name: "2025-Q3", value: 33 },
      { name: "2025-Q4", value: 54 },
      { name: "2026-Q1", value: 65 },
      { name: "2026-Q2", value: 60 },
    ],
  },
};

export default report;
