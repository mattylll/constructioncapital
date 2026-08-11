import type { MarketReport } from "../../types";

// NICHE EDITION — Care Home Development Monitor, H1 2026 (v2, full depth).
// Sources: data/lending-monitor/niche-care-homes-h1-2026.json (planning),
// niche-care-cqc-context.json (CQC stock, OGL v3.0), niche-care-lending-cuts.json
// (CH charge cuts). No lender is named. The commentary section is drafted for
// Matt Lenzie's approval and is clearly framed as opinion.

const report: MarketReport = {
  slug: "care-home-development-monitor-h1-2026",
  title: "Care Home Development Monitor: H1 2026",
  metaTitle: "UK Care Home Development Pipeline H1 2026 | Planning, Stock & Lending Data",
  metaDescription:
    "125 care home applications in H1 2026, a £1.1bn rolling pipeline, pipeline-versus-stock ratios by region, CQC quality context and care-sector lending cuts from Companies House. Primary-source data.",
  excerpt:
    "Care applications rose every quarter to mid-2026 against a £1.1bn pipeline. The East of England is investing hardest relative to its existing stock, and it is also the region whose stock is rated worst. Lending held flat while spreading across more operators.",
  category: "lending",
  datePublished: "2026-08-11",
  dateModified: "2026-08-11",
  readingTime: "11 min read",
  sections: [
    {
      heading: "The care home pipeline in H1 2026",
      content: [
        `Developers submitted <strong>125 care and retirement living applications</strong> across our 264-town planning dataset in H1 2026, proposing around <strong>1,560 beds</strong> with an estimated development value of <strong>£544m</strong>. Momentum built through the period: quarterly submissions ran 33, 54, 65 and 60 from Q3 2025 through Q2 2026, making the two most recent complete quarters the two strongest in the dataset.`,
        `Over the full rolling year the pipeline stands at <strong>315 live schemes, roughly 3,430 beds and £1.1bn in estimated GDV</strong>: 48 applications approved, 267 still in determination. Care is a slow-consented asset class, so a pipeline skewed to pending applications is structural rather than a warning sign; it is also precisely where development finance demand forms twelve to eighteen months out.`,
        `The scale end of the market is concentrated in a handful of schemes. A 446-bed hybrid application in Great Yarmouth, a 412-bed outline in Thurrock, 343 beds at reserved-matters stage in North Norfolk and 300 in Reigate and Banstead together account for over a third of all pipeline beds. Below them, the market thins fast: of schemes stating bed numbers, 193 propose fewer than 20 beds, 7 propose 20 to 59, and just 12 propose 60 or more. The big-box care market and the small-scheme market are, in effect, different industries sharing a use class.`,
      ],
    },
    {
      heading: "What is actually being built: conversions dominate by count, new-build by beds",
      content: [
        `Classifying every scheme by its works: <strong>194 of the 315 applications (62%) are conversions or changes of use</strong>, typically existing residential or commercial buildings moving into C2 use. Only 65 (21%) are new-build applications, with 30 extensions to existing homes and 26 others. But the weight is inverted by size: nearly all of the large bed numbers sit in the new-build column, because the 60-plus-bed schemes that carry the pipeline's value are overwhelmingly ground-up developments.`,
        `For lenders and brokers this split matters. Conversion-led demand means a steady flow of smaller facilities, often bridging into refurbishment then term debt on stabilisation, while the new-build tail generates the larger, longer development facilities. The financing products these two markets need barely overlap.`,
      ],
    },
    {
      heading: "Where the beds are planned",
      content: [
        `<table><thead><tr><th>Region</th><th>Applications (12m)</th><th>Beds</th><th>Est. GDV</th></tr></thead><tbody><tr><td>London &amp; South East</td><td>104</td><td>1,310</td><td>£557m</td></tr><tr><td>East of England</td><td>29</td><td>815</td><td>£195m</td></tr><tr><td>Midlands</td><td>75</td><td>737</td><td>£211m</td></tr><tr><td>South West</td><td>26</td><td>260</td><td>£84m</td></tr><tr><td>North East &amp; Yorkshire</td><td>56</td><td>258</td><td>£44m</td></tr><tr><td>Wales</td><td>5</td><td>37</td><td>£5m</td></tr><tr><td>North West</td><td>20</td><td>9</td><td>£2m</td></tr></tbody></table>`,
        `London and the South East lead on both volume and value, as they do in almost every asset class. The more interesting number is the East of England's: 29 applications carrying 815 beds gives it by far the largest average scheme size in the country, driven by the Great Yarmouth and North Norfolk consents. The North West's near-empty beds column reflects a market of small extensions and conversions rather than an absent market, though as the next section shows, its pipeline is thin however it is measured.`,
      ],
    },
    {
      heading: "Pipeline versus existing stock: the replacement-demand map",
      content: [
        `Raw pipeline numbers flatter big regions. The better question is how much each region is adding <em>relative to the beds it already operates</em>. Setting the pipeline against the Care Quality Commission's register of active care homes in the same counties (13,738 homes, 444,873 beds as at June 2026) produces a very different league table.`,
        `<table><thead><tr><th>Region</th><th>Existing beds (CQC)</th><th>Pipeline beds</th><th>Pipeline as % of stock</th><th>Stock rated below Good</th></tr></thead><tbody><tr><td>East of England</td><td>29,898</td><td>815</td><td><strong>2.7%</strong></td><td><strong>23.4%</strong></td></tr><tr><td>London &amp; South East</td><td>144,342</td><td>1,310</td><td>0.9%</td><td>15.6%</td></tr><tr><td>Midlands</td><td>95,231</td><td>737</td><td>0.8%</td><td>21.2%</td></tr><tr><td>South West</td><td>52,310</td><td>260</td><td>0.5%</td><td>10.8%</td></tr><tr><td>North East &amp; Yorkshire</td><td>63,302</td><td>258</td><td>0.4%</td><td>16.2%</td></tr><tr><td>North West</td><td>59,790</td><td>9</td><td>0.0%</td><td>20.2%</td></tr></tbody></table>`,
        `The East of England is expanding its bed base at three times the covered-market rate, and it is simultaneously the region whose existing stock is rated worst: 23.4% of its inspected homes carry a Requires Improvement or Inadequate rating, against 17.3% across all covered counties. That pairing is what replacement demand looks like in data: an ageing, under-performing stock base attracting the largest new schemes in the country.`,
        `The inverse case is the North West: 20.2% of stock rated below Good, the second-worst in the table, and effectively zero pipeline beds. If the replacement thesis holds anywhere next, it is there; the demand signal exists and the development response has not yet arrived.`,
      ],
    },
    {
      heading: "The lending side: flat activity, broader base, established borrowers",
      content: [
        `Secured lending to care-sector operators held essentially level: <strong>1,828 new facilities</strong> registered against care-classified borrowers in H1 2026 versus 1,885 in H1 2025, a change of minus 3%. The distinct borrower count moved the other way, up 3.6% to 1,356. Flat facilities on a wider base is the signature of lending spreading across more, smaller operators rather than concentrating into large group refinancings.`,
        `Care lending is also strikingly an established-operator market. Only <strong>11% of H1 2026 facilities were written against companies less than a year old</strong>, against 24% across the whole development-active market. Where mainstream development lending runs on single-scheme SPVs, care lending runs on trading operators with track records, which is consistent with how lenders underwrite the sector: on operations and fee mix as much as on bricks.`,
        `Located to the property rather than the registered office, H1 2026 care-sector facilities split: London &amp; South East 127, Midlands 122, North East &amp; Yorkshire 66, North West 65, South West 58, East of England 48, Wales 31. Note the Midlands running nearly level with London and the South East on lending volume despite a far smaller pipeline by value: a large existing operator base transacting steadily, versus a south-east market where more of the activity is development-shaped.`,
      ],
    },
    {
      heading: "The 2022 vintage: locked in by the rate shock, now working out",
      content: [
        `Redemption behaviour tells the sector's interest-rate story in one series. Of care-sector facilities originated in 2019, 10.5% were fully redeemed within 18 months, and the 2020 and 2021 cohorts behaved similarly at 9.7% and 9.6%. The <strong>2022 cohort collapsed to 6.2%</strong>: facilities written into the rate shock had nowhere better to refinance, so operators sat on them. The 2023 cohort recovered to 10.4% and 2024 reached <strong>11.1%, the fastest-redeeming cohort in the series</strong> (3,721 facilities, all observed over a full 18-month window; the comparison is like for like).`,
        `The practical read: the refinance channel in care reopened through 2023 and 2024, and the backlog of 2022-vintage debt that could not move at the time remains a pool of pent-up refinancing demand that lenders and brokers are still working through.`,
      ],
    },
    {
      heading: "The view from the desk",
      content: [
        `<em>Commentary from Matt Lenzie, founder:</em>`,
        `The care pipeline's quarter-on-quarter build is the most encouraging sequence in this dataset, but the shape of it matters more than the size. Nearly two-thirds of schemes by count are conversions, and those borrowers are frequently first-time care developers buying a building that looks convertible. The underwriting reality is that lenders back the operator covenant and the CQC registration path, not the property, and schemes without an operator attached will keep finding terms harder than their sponsors expect.`,
        `The East of England numbers deserve attention from developers hunting sites. Where a quarter of existing stock is rated below Good, local authorities have both a shortage problem and a quality problem, and well-designed replacement stock lands on the right side of both. We would expect the North West to follow rather than languish; the ratings pressure is the same and the land is cheaper. On funding, the return of redemption speed to above-2019 levels says exits are working again, and in our experience it is the exit story, not the build cost, that decides whether a care development gets funded in this market.`,
      ],
    },
    {
      heading: "Methodology and data notes",
      content: [
        `<strong>Planning.</strong> Applications are scraped directly from local planning authority portals covering 264 UK towns and classified to the care sector by proposal text (care home, nursing home, extra care, assisted living, retirement living, C2 use). Condition-compliance, discharge-of-condition and non-material-amendment filings are excluded so a scheme is counted once, not once per filing; duplicates appearing in more than one authority's register are removed; twelve towns whose current data covers a shorter window are excluded entirely rather than undercounted. Bed and value figures are as stated by applicants or estimated from unit counts; pipeline GDV is an estimate, not a valuation.`,
        `<strong>Existing stock and quality.</strong> Stock and ratings figures cover active care homes in the same counties as the planning dataset and are derived from the Care Quality Commission's register of active locations (June 2026). Contains public sector information from the Care Quality Commission, licensed under the Open Government Licence v3.0.`,
        `<strong>Lending.</strong> Lending figures count mortgage and charge registrations at Companies House against borrowers carrying care-sector SIC classifications. Companies House records no loan values, so lending is measured in facility and borrower counts, verifiable by anyone against the public register. Regional lending is located by the charged property's postcode extracted from filing particulars, not the borrower's registered office. Redemption rates are fixed-window: a cohort is reported only once every facility in it has had the full 18 months to run. No individual lender is named in any Monitor publication. Full definitions, suppression rules and revision policy: <a href="/lending-trends/methodology">Monitor methodology</a>.`,
      ],
    },
    {
      heading: "What this means for care home developers",
      content: [
        `A rising application pipeline against flat lending is a timing story: schemes submitted in H1 2026 reach consent, and funding requirement, from late 2026 into 2027, into a lender market whose appetite is proven and whose refinance channel has visibly reopened. Developers with an operator attached and a credible registration path are entering at a favourable point in the cycle; conversion-led sponsors without operational depth will find the market more selective.`,
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
      question: "Which UK region has the strongest care home development pipeline?",
      answer:
        "Relative to existing stock, the East of England: its pipeline equals 2.7% of its existing CQC-registered beds, three times the covered-market rate, and includes the largest schemes currently in determination (446 beds in Great Yarmouth, 343 in North Norfolk). By raw volume, London and the South East lead with 104 applications and 1,310 beds.",
    },
    {
      question: "Are UK care home developments mostly new-build or conversions?",
      answer:
        "By count, conversions: 62% of live schemes are changes of use into C2, against 21% new-build. By beds, new-build dominates, because nearly all schemes of 60 beds or more are ground-up developments. The two segments need very different financing structures.",
    },
    {
      question: "Are lenders still active in care home finance?",
      answer:
        "Yes. 1,828 secured facilities were registered against care-sector borrowers in H1 2026, essentially level with H1 2025, while the number of distinct borrowers rose 3.6% to 1,356. Only 11% of facilities went to companies under a year old, versus 24% market-wide: care lending strongly favours established operators.",
    },
    {
      question: "How quickly are care home loans repaid?",
      answer:
        "11.1% of care-sector facilities originated in 2024 were fully redeemed within 18 months, the fastest cohort on record, after the 2022 cohort fell to 6.2% during the rate shock. All cohorts are measured over a complete 18-month window, so the comparison is like for like.",
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
    townPrices: [
      { name: "East of England", value: 2.7 },
      { name: "London & South East", value: 0.9 },
      { name: "Midlands", value: 0.8 },
      { name: "South West", value: 0.5 },
      { name: "North East & Yorkshire", value: 0.4 },
      { name: "North West", value: 0.0 },
    ],
  },
};

export default report;
