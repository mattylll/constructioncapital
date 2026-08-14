import type { MarketReport } from "../../types";

// NICHE EDITION — Industrial & Logistics Development Monitor, H1 2026.
// Sources: data/lending-monitor/niche-industrial-h1-2026.json (planning),
// niche-industrial-lending-cuts.json (CH charge cuts, two independent cuts:
// operator SIC and collateral particulars), HMLR Price Paid type-O industrial
// address transactions. No lender is named. The commentary section is drafted
// for Matt Lenzie's approval and is clearly framed as opinion.

const report: MarketReport = {
  slug: "industrial-logistics-development-monitor-h1-2026",
  title: "Industrial & Logistics Development Monitor: H1 2026",
  metaTitle: "UK Industrial & Logistics Development Pipeline H1 2026 | Planning, Lending & Values Data",
  metaDescription:
    "547 industrial and logistics planning applications in H1 2026, at least 870,000 sq m of proposed floorspace in the rolling year, industrial-secured lending up 29% against a market up 17%, and six years of sold-value data. Primary-source monitor.",
  excerpt:
    "Industrial planning applications rose 23% half-on-half and industrial-secured lending grew nearly twice as fast as the wider charge market. The Midlands leads on proposed floorspace and on lending volume, and the 2024 loan cohort is redeeming faster than any before it.",
  category: "lending",
  datePublished: "2026-08-14",
  dateModified: "2026-08-14",
  readingTime: "11 min read",
  sections: [
    {
      heading: "The industrial pipeline in H1 2026",
      content: [
        `Developers and occupiers submitted <strong>547 industrial and logistics planning applications</strong> across the 83 councils in our qualifying dataset in H1 2026. The quarterly build tells the momentum story: 215 applications in Q3 2025, 230 in Q4, then a step change to 277 in Q1 2026 and 270 in Q2. The two most recent complete quarters are the two strongest in the series, and H1 2026 ran <strong>23% ahead of H2 2025</strong> on identical council coverage.`,
        `Over the rolling year to 6 August 2026 the pipeline stands at <strong>1,001 live applications</strong>. Floorspace is only stated in a minority of proposal texts, but the 32 schemes that do state it total <strong>872,799 sq m</strong>, which should be read as a floor for the pipeline, not a total. Within the rolling year, 148 applications (15%) are big-box distribution and logistics schemes; the remaining 85% is the multi-let, trade counter, workshop and open-storage economy that rarely makes agency research but generates most of the sector's financing demand.`,
        `Open storage, the asset class that barely existed as an investment category five years ago, accounts for 39 applications in the rolling year: yards for vehicles, haulage and containers, typically consented faster than built space and increasingly financed as income-producing property in its own right.`,
      ],
    },
    {
      heading: "The scale end: six schemes carry most of the stated floorspace",
      content: [
        `The largest schemes in the rolling-year pipeline are concentrated and geographically spread. Greater Cambridge leads with an application for <strong>up to 230,000 sq m of employment floorspace</strong> in Use Class E(g). Derby follows at 104,430 sq m, now at reserved-matters stage. Trafford has an outline application for 70,000 sq m, West Oxfordshire 64,305 sq m including B8 distribution, Harborough 60,000 sq m of employment floorspace, and Chelmsford a 46,605 sq m mixed employment, logistics, storage and distribution scheme still in determination.`,
        `Those six schemes alone account for over 575,000 sq m, roughly two thirds of all stated floorspace in the pipeline. As with every asset class this Monitor covers, the big-box tail and the small-scheme body are different markets: the former generates a handful of large, long development facilities, the latter a steady flow of sub-£5m acquisition, refurbishment and bridging requirements.`,
      ],
    },
    {
      heading: "Where the pipeline sits",
      content: [
        `<table><thead><tr><th>Region</th><th>Applications (12m)</th><th>Stated floorspace (sq m)</th></tr></thead><tbody><tr><td>London &amp; South East</td><td>269</td><td>76,067</td></tr><tr><td>North East &amp; Yorkshire</td><td>166</td><td>3,003</td></tr><tr><td>East of England</td><td>142</td><td>287,573</td></tr><tr><td>South West</td><td>134</td><td>22,068</td></tr><tr><td>Midlands</td><td>116</td><td>386,446</td></tr><tr><td>North West</td><td>115</td><td>97,642</td></tr><tr><td>Wales</td><td>59</td><td>0</td></tr></tbody></table>`,
        `London and the South East file the most applications, as they do in every sector, but the floorspace column inverts the map. The <strong>Midlands holds the largest stated floorspace in the country at 386,446 sq m</strong>, anchored by the Derby and Harborough schemes, with the East of England second on the strength of Greater Cambridge. This is the golden-triangle logistics geography showing up in primary planning data: the biggest sheds are being planned where the motorways cross, not where the application count is highest. Stated floorspace is a floor in every region, and a zero means no scheme in that region stated a figure, not that nothing is planned.`,
      ],
    },
    {
      heading: "The lending side: industrial re-rated in H1 2026",
      content: [
        `We cut Companies House charge registrations two independent ways. The <strong>collateral cut</strong> counts new charges whose filing particulars name industrial property: industrial estates and units, trading estates, warehouses and trade counters, whatever the borrower's trade. The <strong>operator cut</strong> counts new charges against borrowers classified to warehousing, cargo handling and road freight, the occupier side of the market. The two cuts overlap by just 14 filings in H1 2026, so they genuinely measure different things.`,
        `The collateral cut is the story of the half. <strong>911 new charges were registered against industrial property in H1 2026, up 29% on H1 2025</strong> (706), against a whole-market rise of 17%. Distinct borrowers rose faster still, up 30% to 713. Growth that outruns a rising market, carried by more borrowers rather than bigger facility counts per borrower, is breadth, not concentration: more sponsors are borrowing against sheds than at any point in the three years we measure.`,
        `The honest context is that 2026 is a recovery as much as a boom. Industrial collateral was 0.82% of all UK charge registrations in H1 2024, fell to 0.68% in H1 2025 while the wider market grew around it, and has recovered to 0.75% in H1 2026. Industrial lending is growing faster than the market again, but its market share has not yet regained its 2024 level. The share of collateral-cut facilities written to borrowers less than a year old rose from 12.5% in H1 2024 to 15.4% in H1 2026, which reads as new SPVs being formed to buy industrial: acquisition activity, not just refinancing of held stock.`,
        `Located to the charged property rather than the registered office, H1 2026 industrial-collateral facilities split: Midlands 140, North East &amp; Yorkshire 135, London &amp; South East 113, North West 102, East of England 81, South West 75, Wales 57, with 88 filings at postcodes outside the England and Wales bridge, mainly Scotland. The Midlands leading on lending volume as well as on pipeline floorspace is the cleanest regional signal in this edition. The operator cut is too thin to publish regionally under our 30-observation floor, so we state that rather than print noise.`,
      ],
    },
    {
      heading: "Occupiers are the cautious side of the market",
      content: [
        `The operator cut grew far more slowly: <strong>608 facilities in H1 2026 against 579 in H1 2025, up 5%</strong>, in a whole market up 17%. As a share of all charge registrations, occupier borrowing has declined for two consecutive years, from 0.68% in H1 2024 to 0.50% in H1 2026. Warehousing, haulage and freight operators are borrowing more in absolute terms but visibly less than the market around them.`,
        `Read together, the two cuts describe the half cleanly: property investors and developers re-rated industrial in H1 2026, while the occupiers of that property stayed conservative. That gap matters for underwriting, because investor demand ultimately needs occupier covenants to let to; it is also the classic early-cycle shape, where capital moves before tenants do.`,
      ],
    },
    {
      heading: "The refinance channel is open: 2024 cohorts are the fastest yet",
      content: [
        `Redemption behaviour is measured on fixed 18-month windows, so every cohort is compared like for like. Of operator-cut facilities originated in 2022, into the rate shock, only 8.6% were fully redeemed within 18 months. The 2023 cohort recovered to 10.8% and the <strong>2024 cohort reached 13.5%, the fastest in the six years measured</strong> (1,200 facilities). The collateral cut shows the same recovery at lower levels: after the 2022 and 2023 cohorts slowed to 7.1% and 6.8%, the 2024 cohort reached 9.0%, again the fastest in its series.`,
        `Fast-redeeming recent cohorts mean exits are working: bridges are refinancing onto terms, developments are selling or stabilising, and the 2022-vintage debt that could not move at the time is still working through as a pool of pent-up refinancing demand. For brokers, the redemption data is the quantitative version of what the desk already feels: the industrial refinance market reopened through 2024 and stayed open into 2026.`,
      ],
    },
    {
      heading: "What sheds actually sell for: six years of registered transactions",
      content: [
        `Setting planning and lending against real transaction evidence: HM Land Registry records commercial-classified sales at addresses on industrial estates, industrial and trading estates and named industrial units. This excludes portfolio and share-structure deals, so it is the owner-occupier and private-investor end of the market, which is precisely the end most of the financing demand comes from.`,
        `<table><thead><tr><th>Year</th><th>Registered sales</th><th>Median price</th></tr></thead><tbody><tr><td>2020</td><td>1,910</td><td>£300,000</td></tr><tr><td>2021</td><td>2,193</td><td>£350,000</td></tr><tr><td>2022</td><td>2,001</td><td>£380,000</td></tr><tr><td>2023</td><td>1,841</td><td>£375,000</td></tr><tr><td>2024</td><td>1,966</td><td>£365,000</td></tr><tr><td>2025</td><td>1,668</td><td>£380,000</td></tr></tbody></table>`,
        `The 2025 median of <strong>£380,000 matches the 2022 peak</strong>, but it was set on 1,668 registered sales, the thinnest full year in the series. Values holding at peak on falling volume is a market where owners do not need to sell, consistent with the lending data: stock is being refinanced and held rather than traded. Registrations lag completions by months and lag longest for commercial transactions, so 2025 will fill in modestly and the 244 registrations so far dated in 2026 (median £365,750, latest dated 12 June 2026) are an early, incomplete read, not a comparable year.`,
        `Regionally, over the 12 months to August 2026, the Midlands again leads on volume with 168 registered sales at a £397,800 median, ahead of London and the South East on 125 sales at a £450,000 median. The cheapest regional median is the South West at £318,615; Wales, at £374,500, prices above the North West at £355,000.`,
      ],
    },
    {
      heading: "The view from the desk",
      content: [
        `<em>Commentary from Matt Lenzie, founder:</em>`,
        `The single most useful number in this edition is the gap between the two lending cuts: investor-side lending up 29%, occupier-side up 5%. Capital has decided industrial is the asset class to own into the next cycle, and the planning data says developers agree, but the tenant side has not yet confirmed the trade. Sponsors underwriting big speculative floorspace should be pricing that gap, not ignoring it.`,
        `The Midlands trio is the pattern to watch: most stated pipeline floorspace, most industrial-secured lending, most registered sales, and a median price still £52,200 below London and the South East. On our desk that reads as the most liquid, most financeable industrial market in the country right now. The other number I keep returning to is the 15.4% new-borrower share: nearly one facility in six is going to a company less than a year old. First-time industrial SPVs are exactly the borrowers who need structuring help, because they have no track record to lean on, and they are the fastest-growing part of this market.`,
      ],
    },
    {
      heading: "Methodology and data notes",
      content: [
        `<strong>Planning.</strong> Applications are taken from local planning authority registers via our data lake and classified as industrial and logistics by proposal text: industrial units and estates, distribution and logistics floorspace, warehousing, trade counters, manufacturing premises, B2, B8 and E(g) use classes, and open storage. Self storage is excluded and reported separately in this series. Condition-discharge, variation, scoping and other procedural filings are excluded so a scheme counts once, not once per filing; cross-register duplicates are removed. Windowed figures use the 83 councils (of 147 in the lake) whose scrape window demonstrably spans the full period; the quarterly series uses councils covered back to July 2025 throughout, so quarters are compared on identical coverage. Floorspace is as stated by applicants in proposal text, is stated in only a minority of applications, and is therefore a floor, not a total.`,
        `<strong>Lending.</strong> Lending figures count mortgage and charge registrations at Companies House. The collateral cut matches filing particulars naming industrial property types; the operator cut matches borrowers with warehousing, cargo-handling and road-freight SIC classifications. Companies House records no loan values, so lending is measured in facility and borrower counts, verifiable against the public register. Niche growth is always reported against the whole-market baseline (121,546 registrations in H1 2026, up 17% on H1 2025) and as a share of that market. Regional lending is located by the charged property's postcode extracted from filing particulars, not the borrower's registered office; cuts below our 30-observation floor are suppressed and stated as suppressed. Redemption rates are fixed-window: a cohort is reported only once every facility in it has had a full 18 months to run. No individual lender is named in any Monitor publication. Full definitions: <a href="/lending-trends/methodology">Monitor methodology</a>.`,
        `<strong>Values.</strong> Sold prices are HM Land Registry Price Paid Data (Crown copyright and database right, Open Government Licence v3.0), commercial-classified transactions at industrial-keyword addresses in England and Wales. This captures individual registered transfers, not portfolio or corporate deals, and registrations lag completions, so recent periods understate final volumes. Latest transaction dated 12 June 2026.`,
      ],
    },
    {
      heading: "What this means for industrial sponsors",
      content: [
        `A pipeline up 23% half-on-half reaches consent, and funding requirement, from late 2026 into 2027, into a lender market whose industrial appetite is measurably above the whole-market trend and whose refinance channel is the fastest it has been in six years. Sponsors buying or building sheds are entering with the current running in their favour; the caution flag is the occupier side, which is growing at a fraction of the investor pace and will decide whether today's floorspace lets at tomorrow's rents.`,
        `Construction Capital arranges acquisition, development, bridging and term finance for industrial and logistics property across the lenders behind these numbers. To discuss a scheme, call <a href="tel:+442038163693">+44 20 3816 3693</a> or start with the <a href="/deal-room">deal room</a>.`,
      ],
    },
  ],
  faqs: [
    {
      question: "How many industrial units are being built in the UK in 2026?",
      answer:
        "Across the 83-council qualifying dataset, 547 industrial and logistics planning applications were submitted in H1 2026 alone, 23% more than in H2 2025 on identical coverage. The rolling-year pipeline stands at 1,001 applications, with stated floorspace of at least 872,799 sq m; the largest single scheme proposes up to 230,000 sq m in Greater Cambridge.",
    },
    {
      question: "Which UK region has the strongest industrial development pipeline?",
      answer:
        "By stated floorspace, the Midlands, with 386,446 sq m in the rolling year, anchored by schemes of 104,430 sq m in Derby and 60,000 sq m in Harborough. By application count, London and the South East lead with 269. The Midlands also leads H1 2026 industrial-secured lending volume and registered industrial sales, making it the most consistent regional signal in the dataset.",
    },
    {
      question: "Are lenders still lending on industrial property in 2026?",
      answer:
        "Yes, and faster than the wider market: 911 new charges were registered against industrial property in H1 2026, up 29% on H1 2025, against whole-market growth of 17%. Distinct borrowers rose 30% to 713, and 15.4% of facilities went to companies less than a year old, indicating new acquisition SPVs rather than pure refinancing.",
    },
    {
      question: "What does an industrial unit cost to buy in the UK?",
      answer:
        "The 2025 median registered sale price at industrial-estate addresses was £380,000, matching the 2022 peak, on 1,668 transactions. Over the 12 months to August 2026 regional medians ranged from £318,615 in the South West to £450,000 in London and the South East, with the Midlands at £397,800 on the highest volume. These are individual registered transfers, mostly owner-occupier and private-investor sized deals.",
    },
    {
      question: "How quickly are industrial property loans repaid?",
      answer:
        "The 2024 cohorts are the fastest measured: 13.5% of occupier-side facilities and 9.0% of industrial-collateral facilities originated in 2024 were fully redeemed within 18 months, against troughs of 8.6% and 7.1% for the 2022 rate-shock cohorts. Every cohort is measured over a complete 18-month window, so comparisons are like for like.",
    },
  ],
  relatedReportSlugs: [
    "development-lending-monitor-h1-2026",
    "development-exit-refinance-monitor-h1-2026",
    "care-home-development-monitor-h1-2026",
  ],
  relatedTownSlugs: [],
  relatedServiceSlugs: ["development-finance", "bridging-loans", "commercial-mortgages"],
  charts: {
    quarterlyTrend: [
      { name: "2025-Q3", value: 215 },
      { name: "2025-Q4", value: 230 },
      { name: "2026-Q1", value: 277 },
      { name: "2026-Q2", value: 270 },
    ],
    townPrices: [
      { name: "Midlands", value: 140 },
      { name: "North East & Yorkshire", value: 135 },
      { name: "London & South East", value: 113 },
      { name: "North West", value: 102 },
      { name: "East of England", value: 81 },
      { name: "South West", value: 75 },
      { name: "Wales", value: 57 },
    ],
  },
};

export default report;
