/**
 * Location Content Library
 *
 * Generates genuinely distinct content for location pages based on three axes:
 *   1. Service type (6 distinct content sets)
 *   2. Region (8 regional contexts)
 *   3. Town slug hash (deterministic variation so adjacent towns differ)
 *
 * This produces 144-192 distinct content combinations before town/county name injection.
 */

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

export interface DealExample {
  title: string;
  description: string;
  gdv: string;
  loanAmount: string;
  ltv: string;
  loanType: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

// ─────────────────────────────────────────────────────────
// County → Region Mapping
// ─────────────────────────────────────────────────────────

type Region =
  | "london-se"
  | "north-west"
  | "midlands"
  | "south-west"
  | "north-east-yorkshire"
  | "east-of-england"
  | "scotland"
  | "wales";

const COUNTY_REGION_MAP: Record<string, Region> = {
  // London & South East
  "greater-london": "london-se",
  surrey: "london-se",
  kent: "london-se",
  essex: "london-se",
  "east-sussex": "london-se",
  "west-sussex": "london-se",
  hampshire: "london-se",
  berkshire: "london-se",
  buckinghamshire: "london-se",
  oxfordshire: "london-se",
  hertfordshire: "london-se",
  middlesex: "london-se",

  // North West
  "greater-manchester": "north-west",
  lancashire: "north-west",
  merseyside: "north-west",
  cheshire: "north-west",
  cumbria: "north-west",

  // Midlands
  "west-midlands": "midlands",
  "east-midlands": "midlands",
  warwickshire: "midlands",
  staffordshire: "midlands",
  derbyshire: "midlands",
  nottinghamshire: "midlands",
  leicestershire: "midlands",
  northamptonshire: "midlands",
  worcestershire: "midlands",
  shropshire: "midlands",
  herefordshire: "midlands",

  // South West
  bristol: "south-west",
  somerset: "south-west",
  devon: "south-west",
  cornwall: "south-west",
  dorset: "south-west",
  wiltshire: "south-west",
  gloucestershire: "south-west",

  // North East & Yorkshire
  "west-yorkshire": "north-east-yorkshire",
  "south-yorkshire": "north-east-yorkshire",
  "north-yorkshire": "north-east-yorkshire",
  "east-riding-of-yorkshire": "north-east-yorkshire",
  "tyne-and-wear": "north-east-yorkshire",
  durham: "north-east-yorkshire",
  northumberland: "north-east-yorkshire",
  "county-durham": "north-east-yorkshire",

  // East of England
  suffolk: "east-of-england",
  norfolk: "east-of-england",
  cambridgeshire: "east-of-england",
  bedfordshire: "east-of-england",
  "milton-keynes": "east-of-england",

  // Scotland
  edinburgh: "scotland",
  glasgow: "scotland",
  "city-of-edinburgh": "scotland",
  "city-of-glasgow": "scotland",
  fife: "scotland",
  aberdeenshire: "scotland",
  highland: "scotland",
  perth: "scotland",
  dundee: "scotland",
  stirling: "scotland",

  // Wales
  cardiff: "wales",
  swansea: "wales",
  newport: "wales",
  "vale-of-glamorgan": "wales",
  "rhondda-cynon-taf": "wales",
  caerphilly: "wales",
  bridgend: "wales",
  powys: "wales",
  carmarthenshire: "wales",
  pembrokeshire: "wales",
};

function getRegion(countySlug: string): Region {
  return COUNTY_REGION_MAP[countySlug] ?? "london-se";
}

// ─────────────────────────────────────────────────────────
// Deterministic hash for pseudo-random variant selection
// ─────────────────────────────────────────────────────────

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit int
  }
  return Math.abs(hash);
}

function pickVariant<T>(items: T[], slug: string): T {
  return items[hashString(slug) % items.length];
}

// ─────────────────────────────────────────────────────────
// Regional Context Paragraphs
// ─────────────────────────────────────────────────────────

const REGIONAL_CONTEXT: Record<Region, string[]> = {
  "london-se": [
    "London and the South East remain the UK's most active property development markets, underpinned by persistent housing undersupply against some of the strongest demand fundamentals in Europe. Land values are elevated but so are achievable sales prices, creating viable margins for well-structured schemes — particularly in outer boroughs and commuter towns where affordability pressures are redirecting buyer demand.",
    "Planning in this region can be complex, with conservation areas, Green Belt restrictions, and robust local opposition adding time and cost to consenting. However, high exit values mean that lenders are often willing to offer favourable terms for well-located sites with deliverable planning. The Build-to-Rent sector is particularly active, with institutional capital increasingly targeting outer London and key South East commuter hubs.",
    "Prime residential values in Central London continue to attract international capital, while the suburban and Home Counties markets benefit from hybrid working patterns driving demand for larger homes with garden space. Developers who understand the micro-market dynamics — from Crossrail catchment areas to new Overground extensions — can achieve premium returns.",
  ],
  "north-west": [
    "The North West is experiencing a sustained development boom driven by major regeneration programmes across Greater Manchester, Liverpool City Region, and Lancashire. Manchester's population growth — the fastest of any UK city outside London — is fuelling demand for new homes, while the city's expanding commercial district is creating mixed-use conversion opportunities at scale.",
    "Build costs in the North West remain materially below London and the South East, while rental yields are among the strongest in the country. This combination makes the region attractive to both local developers and national operators. Liverpool's waterfront regeneration and the continued expansion of MediaCityUK in Salford are creating significant development pipelines.",
    "Transport improvements — including HS2 Phase 2 planning and the Trans-Pennine route upgrade — are supporting land value growth in towns along key corridors. Lenders with regional expertise recognise the strong fundamentals and are actively seeking to deploy capital across the North West.",
  ],
  midlands: [
    "The Midlands development market benefits from its central UK location, strong transport connectivity, and a growing population attracted by relative affordability compared to London and the South East. Birmingham's ongoing transformation — anchored by HS2 and the Commonwealth Games legacy — has repositioned the city as a serious investment destination.",
    "The region's industrial heritage creates abundant conversion opportunities, from Victorian mills and factories to post-war commercial buildings with permitted development potential. Build costs are competitive, and the presence of multiple universities drives consistent demand for purpose-built student accommodation and HMO conversions.",
    "East Midlands towns along the M1 corridor are seeing increased development interest as logistics and distribution companies expand, bringing employment growth that supports residential demand. Nottingham, Leicester, and Derby each offer distinct market dynamics but share strong fundamentals for well-located residential schemes.",
  ],
  "south-west": [
    "The South West combines strong lifestyle appeal with genuine development demand, particularly in Bristol — now established as the UK's most competitive regional city for tech and professional services employment. Housing affordability pressures in Bristol and Bath are pushing demand into surrounding towns, creating opportunities for developers across Somerset, Wiltshire, and Gloucestershire.",
    "Coastal markets in Devon, Cornwall, and Dorset benefit from sustained tourism demand that supports mixed-use and holiday-let development models. Post-pandemic lifestyle migration to the South West has strengthened residential markets in towns previously considered secondary, with remote working enabling permanent relocation from London and the South East.",
    "Bristol's Temple Quarter regeneration, Bath's enterprise zone, and Exeter's growing reputation as a biomedical hub are all generating development opportunities. Lenders recognise the South West's diverse market dynamics — from urban regeneration to rural conversion projects — and several specialist funders actively target the region.",
  ],
  "north-east-yorkshire": [
    "Yorkshire and the North East offer some of the UK's most attractive development economics: low land costs, competitive build prices, and surprisingly strong rental yields in cities like Leeds, Sheffield, and Newcastle. The region's university cities generate consistent demand for student accommodation and young professional rental housing.",
    "Leeds has emerged as a financial services hub second only to London, driving commercial and residential development at scale. Sheffield's advanced manufacturing sector and Newcastle's digital corridor are creating employment-driven housing demand that supports new-build viability in locations that might not have worked a decade ago.",
    "Regeneration programmes in Teesside, Hull, and Sunderland are unlocking development sites at accessible land values, while the Heritage Action Zones across the region provide additional incentives for sensitive conversion projects. Lenders familiar with the North East and Yorkshire markets understand the strong income potential relative to development costs.",
  ],
  "east-of-england": [
    "The East of England benefits from proximity to London combined with significantly lower land costs, making it attractive for volume residential development. The Cambridge-London corridor is one of the UK's fastest-growing economic zones, with tech-sector employment driving premium housing demand across Cambridgeshire and into Bedfordshire.",
    "Suffolk and Norfolk offer a different dynamic: market towns with genuine housing undersupply and a growing retiree population seeking quality new-build stock. Build costs are moderate, and local planning authorities in several East of England districts have been more receptive to residential development than their South East counterparts.",
    "Milton Keynes and the Oxford-Cambridge Arc represent a once-in-a-generation development opportunity, with government-backed infrastructure investment intended to deliver hundreds of thousands of new homes over the coming decades. Early-mover developers in this corridor are securing sites at prices that should deliver strong returns as infrastructure improvements materialise.",
  ],
  scotland: [
    "Scotland operates under a distinct planning system with its own regulatory framework, which creates both opportunities and considerations for developers. Edinburgh commands premium residential values comparable to many English cities, while Glasgow's extensive regeneration agenda is opening up large-scale development opportunities at more accessible land values.",
    "The Scottish Government's commitment to affordable housing delivery — supported by grant funding programmes — creates a supportive environment for developers willing to include affordable elements in their schemes. Build-to-Rent is gaining momentum in both Edinburgh and Glasgow, with institutional capital increasingly targeting the Scottish market.",
    "Aberdeen's market, traditionally tied to the oil and gas sector, is diversifying with energy transition creating new employment drivers. Dundee's V&A-anchored waterfront regeneration has catalysed residential development interest. The key to financing Scottish projects is working with lenders who understand the specific legal and planning differences north of the border.",
  ],
  wales: [
    "Wales offers genuine development opportunities backed by a supportive government policy environment. Help to Buy Wales and Welsh Government grant schemes provide demand-side support that improves scheme viability, particularly for developers targeting the first-time buyer market in areas like the South Wales valleys.",
    "Cardiff's continued growth as a commercial and cultural centre is driving residential development demand, particularly in the Cardiff Bay and city centre regeneration zones. Swansea's waterfront transformation and Newport's emerging urban village around the Transporter Bridge district are creating additional development pipelines.",
    "The Welsh planning system has its own nuances — including Technical Advice Notes and the requirement for Welsh language impact assessments in certain areas — that developers need to navigate. Lenders experienced in the Welsh market understand these requirements and can structure facilities that account for the specific consenting timeline.",
  ],
};

// ─────────────────────────────────────────────────────────
// Market Commentary (per service)
// ─────────────────────────────────────────────────────────

interface MarketCommentarySet {
  /** 3-4 paragraph variants — the hash picks one */
  paragraphs: string[][];
}

const SERVICE_MARKET_COMMENTARY: Record<string, MarketCommentarySet> = {
  "development-finance": {
    paragraphs: [
      [
        "Ground-up development requires a lender who understands construction risk — from contractor procurement and build programme management to monitoring surveyor requirements and staged drawdown mechanics. The right development finance facility aligns draw schedules with your cost plan, ensuring cash flow matches build progress without unnecessary interest carry.",
        "Lender appetite for development finance varies significantly by scheme type and location. Purpose-built residential schemes with strong pre-sale evidence typically attract the keenest pricing, while more complex mixed-use or phased developments may require specialist funders who take a more nuanced view of construction and sales risk.",
        "We structure development finance facilities that account for the practical realities of construction: weather delays, planning condition discharge timelines, and the gap between practical completion and legal completions on unit sales. Getting these details right at the outset prevents costly renegotiations mid-build.",
      ],
      [
        "Securing competitive development finance depends on presenting your scheme in the right way to the right lenders. This means a robust cost plan from a credible quantity surveyor, realistic build programme, and achievable GDV supported by comparable sales evidence — not aspirational pricing.",
        "Senior development lenders typically fund 60-70% of GDV or 80-85% of total costs, whichever is lower. Day-one land drawdowns of 50-65% of site value are standard, with construction costs drawn in arrears against surveyor-certified stage completions. Understanding this structure helps you plan your equity requirement accurately.",
        "Interest is usually rolled up (added to the loan) rather than serviced monthly, meaning you don't need to fund interest payments during the build phase. Exit fees, non-utilisation fees, and monitoring surveyor costs should all be factored into your development appraisal from the outset.",
      ],
      [
        "The development finance market has matured considerably, with challenger banks and specialist lenders competing aggressively for quality schemes. This competition benefits developers who can present well-structured proposals — but navigating 100+ potential funders to find the best fit requires market knowledge and established relationships.",
        "Build cost inflation has been a defining feature of recent years, and lenders now scrutinise cost plans more carefully than ever. Fixed-price contracts with reputable contractors give lenders confidence and typically unlock better terms. If you're using a design-and-build approach, ensure your contract provides adequate cost certainty.",
        "Planning risk remains the single biggest concern for development finance lenders. Schemes with full, unconditional planning permission attract significantly better terms than those with outline permission or subject to conditions. Discharging pre-commencement conditions before approaching lenders will materially improve your available terms.",
      ],
    ],
  },

  "mezzanine-finance": {
    paragraphs: [
      [
        "Mezzanine finance fills the gap between senior debt and developer equity in the capital stack. For schemes where the senior lender will fund 60-65% of costs, mezzanine can stretch total leverage to 85-90%, dramatically reducing the equity you need to inject. This capital efficiency lets you pursue multiple projects simultaneously.",
        "The intercreditor relationship between senior and mezzanine lenders is the critical structural element. Not all senior lenders will accept mezzanine behind their facility, and those that do typically require an approved intercreditor agreement that governs priorities in a default scenario. We work with both parties to ensure the capital stack is structurally sound.",
        "Mezzanine pricing reflects its subordinated position — typically 12-18% per annum — but the overall blended cost of your capital stack is often lower than alternative structures that achieve similar leverage. The key calculation is whether the additional leverage creates sufficient incremental return to justify the cost.",
      ],
      [
        "Structuring mezzanine alongside senior debt requires careful coordination. The mezzanine lender needs comfort that the senior facility terms are workable, while the senior lender needs assurance that the mezzanine won't interfere with their security position. We manage this process to ensure both parties are aligned before commitment.",
        "Profit-share mezzanine structures are increasingly common for larger schemes, where the mezzanine provider takes a percentage of net development profit instead of, or in addition to, a fixed interest rate. This can reduce your cash cost of capital during the build phase, with the mezzanine return contingent on the scheme's success.",
        "The decision to use mezzanine finance should be driven by a clear capital efficiency rationale. If you have sufficient equity for a single project but want to deploy across two or three schemes simultaneously, mezzanine can multiply your effective development capacity without requiring external equity partners.",
      ],
      [
        "Mezzanine providers range from specialist debt funds and family offices to institutional lenders with dedicated stretched-senior products. Each has different risk appetite, pricing structures, and minimum deal sizes. Matching your scheme to the right mezzanine provider is as important as finding the right senior lender.",
        "First-charge mezzanine — where a single lender provides both senior and stretched-senior tranches up to 85-90% LTC — has grown in popularity as it eliminates intercreditor complexity. However, the pricing is typically higher than a properly structured two-lender capital stack, so the right approach depends on scheme economics and your appetite for structural complexity.",
        "Timing is critical with mezzanine: most providers need to complete their due diligence in parallel with the senior lender to avoid delays. We recommend engaging the mezzanine conversation early — ideally at the same time as senior lender selection — rather than trying to layer it in after senior terms are agreed.",
      ],
    ],
  },

  "bridging-loans": {
    paragraphs: [
      [
        "Speed defines bridging finance. When you need to complete an acquisition within days rather than weeks — whether at auction, to secure a competitive off-market site, or to break a chain — bridging provides certainty that mainstream lenders cannot match. The best bridging lenders can issue terms within hours and complete within 5-10 working days.",
        "Every bridging loan needs a clear exit strategy. The three most common exits are: sale of the property, refinance onto a longer-term facility (development finance, term loan, or mortgage), or planning uplift followed by development. Lenders assess the credibility of your exit as carefully as they assess the property itself.",
        "Bridging rates have become more competitive as the sector has matured, with regulated bridging (on properties you'll occupy) starting from 0.55% per month and unregulated (investment properties) from 0.60% per month. Arrangement fees of 1-2% are standard, with exit fees increasingly rare among competitive lenders.",
      ],
      [
        "Auction purchases represent the classic bridging use case: you've won the lot, the hammer has fallen, and you have 28 days (sometimes 56 for special conditions) to complete. Having a bridging facility pre-agreed or a lender who can move fast is essential. We recommend getting a decision in principle before the auction day.",
        "Bridge-to-development is a powerful strategy for sites requiring planning permission. You acquire the site on a bridging facility, secure planning consent, then refinance onto a development finance facility at terms that reflect the planning uplift. This approach lets you control sites without committing to the higher costs of a full development facility before planning is in place.",
        "Refurbishment bridging is a hybrid product that combines acquisition funding with a facility for light refurbishment works — typically up to 15-20% of the property value. This suits investors buying properties that need cosmetic work before refinancing onto a buy-to-let mortgage at a higher valuation.",
      ],
      [
        "The bridging market has bifurcated into two distinct segments: high-volume, technology-driven lenders who can process straightforward residential bridges very quickly at competitive rates, and specialist bridgers who handle complex situations — title issues, non-standard construction, unusual tenancies — where mainstream options fall short.",
        "Interest on bridging loans can be structured as retained (deducted from the gross loan advance), serviced (paid monthly), or rolled up (added to the loan balance). Retained interest is most common for short-term facilities, while rolled-up interest suits longer-term bridges where you want to minimise monthly outgoings during a refurbishment or planning period.",
        "Second-charge bridging is available for borrowers who have existing mortgage debt and need additional capital without disturbing their first-charge facility. This is particularly useful for experienced landlords who want to release equity from their portfolio to fund acquisitions, without refinancing their existing, often favourably priced, mortgage.",
      ],
    ],
  },

  "equity-jv": {
    paragraphs: [
      [
        "Equity and joint venture structures solve a fundamental problem: you have the development expertise, the site, and the planning — but not the capital. Rather than scaling down your ambitions to match your available equity, JV structures bring in a capital partner who funds 100% of project costs in exchange for a share of the profits.",
        "JV structures vary widely. At one end, a simple equity injection with a fixed preferred return operates similarly to expensive debt. At the other end, a full joint venture with shared decision-making, shared risk, and a waterfall profit distribution gives the capital partner genuine co-ownership of the project. The right structure depends on both parties' risk appetite and return expectations.",
        "Finding the right equity partner is as important as finding the right deal. Family offices, private equity funds, and high-net-worth individuals each bring different expectations around reporting, governance, and involvement in development decisions. We match developers with equity partners whose investment style aligns with their approach to project management.",
      ],
      [
        "The economics of equity and JV structures should be evaluated against the alternative of using more debt. If senior debt at 65% of costs plus mezzanine to 85% would leave you needing only 15% equity, a full JV giving away 40-50% of profits may not be the optimal structure. The calculation changes for larger schemes where even 15% represents a significant capital commitment.",
        "Developer profit shares in JV structures typically range from 50-70%, depending on the developer's contribution (land, planning, management expertise) and the equity partner's perception of project risk. Deals where the developer contributes a consented site with strong comparable evidence command higher profit shares than earlier-stage opportunities.",
        "Equity partners typically require more extensive reporting and governance than debt providers. Expect monthly project reports, regular site visits, and approval rights over material decisions (contractor appointments, specification changes, pricing strategy). Building this into your project management process from the outset avoids friction during the development phase.",
      ],
      [
        "Institutional equity — from real estate private equity funds and sovereign wealth-backed vehicles — is increasingly available for UK residential development, particularly for larger schemes (£10M+ GDV). These partners bring operational sophistication and can move quickly on deals that fit their mandate, but they typically require standardised legal documentation and institutional-grade due diligence.",
        "For smaller schemes (sub-£5M GDV), family offices and high-net-worth individuals remain the most active equity partners. These investors are often more flexible on structure and governance than institutional capital, and can make investment decisions faster. The trade-off is that each relationship needs to be individually negotiated rather than fitting into a standard framework.",
        "Land-for-equity structures — where the developer contributes land and the equity partner funds all construction costs — are among the most efficient JV arrangements. The developer avoids any cash outlay while retaining a meaningful profit share, and the equity partner gets a fully consented, shovel-ready project with a proven development manager.",
      ],
    ],
  },

  "refurbishment-finance": {
    paragraphs: [
      [
        "Refurbishment finance covers the spectrum from light cosmetic works (redecorating, new kitchen and bathroom, garden landscaping) to heavy structural refurbishment (reconfiguration, extensions, change of use, and full strip-back renovation). The product you need depends on the scope of works: light refurb typically falls within bridging parameters, while heavy refurb requires a specialist facility with staged drawdowns.",
        "Lenders categorise refurbishment into light and heavy based on whether the works require planning permission, building regulations sign-off, or structural alterations. Light refurbishment (typically under £50K or 15% of property value) can often be funded through a standard bridging facility with a retained works element. Heavy refurbishment over this threshold usually requires a dedicated refurbishment facility with surveyor-certified drawdowns.",
        "The exit strategy for refurbishment finance is straightforward: refinance the completed property onto a long-term mortgage (buy-to-let or residential) or sell at the improved value. Lenders want to see a clear margin between your total costs (acquisition + works + finance costs) and the expected end value — typically requiring at least 20-25% headroom.",
      ],
      [
        "Commercial-to-residential conversions under permitted development rights remain one of the most popular refurbishment finance use cases. These projects avoid the full planning application process, reducing both risk and timeline. However, lenders still want to see evidence of prior approval and confirmation that the building meets the necessary criteria for permitted development.",
        "HMO conversions require specialist lenders who understand the licensing regime. Article 4 directions — which require planning permission for HMO conversion in many urban areas — add complexity but also create barriers to entry that protect your investment. Lenders who know the HMO market can offer competitive terms for experienced operators with compliant properties.",
        "Build cost verification is a key part of refurbishment finance. Unlike development finance where a formal quantity surveyor report is standard, refurbishment lenders may accept contractor quotes or a schedule of works from a project manager. However, having a QS-verified cost plan typically unlocks better terms and higher leverage.",
      ],
      [
        "The distinction between refurbishment finance and development finance matters for pricing and structure. Refurbishment facilities typically carry higher interest rates than development finance but lower arrangement fees and shorter completion timelines. For projects where the existing structure is retained and the works are primarily internal, refurbishment finance is usually the appropriate product.",
        "Permitted development conversions — particularly office-to-residential under Class MA — have created significant opportunities for refurbishment finance. These conversions can be completed faster than new-build schemes and at lower cost, but they require careful assessment of the building's suitability, including floor-to-ceiling heights, natural light, and structural capacity for residential loading.",
        "Energy efficiency improvements are increasingly factored into refurbishment finance decisions. Lenders recognise that properties refurbished to high EPC ratings command premium rents and sales values, and some offer preferential terms for projects that demonstrably improve energy performance. This is particularly relevant for older properties where an EPC upgrade is part of the refurbishment scope.",
      ],
    ],
  },

  "development-exit-finance": {
    paragraphs: [
      [
        "Development exit finance is a specialist product designed for one specific scenario: your build is complete (or near-complete) but you haven't yet sold all the units. Your development finance facility is approaching maturity, and the lender wants repayment. Exit finance steps in to repay the development lender, replacing an expensive construction facility with a lower-cost holding loan while you market and sell at the best achievable prices.",
        "The key advantage of exit finance over simply extending your development facility is cost. Development finance rates — typically 7-12% per annum with monitoring surveyor fees and non-utilisation charges — are designed for an active construction phase. Once the build is done, you're paying for risk that no longer exists. Exit finance reprices the facility to reflect the reduced risk of a completed, habitable scheme, often saving 2-4% per annum in interest costs.",
        "Lenders offering exit finance assess the completed scheme rather than the development proposal. They instruct a valuation on the finished product, review your sales strategy and comparable evidence, and advance against the current market value of unsold units. This valuation-led approach often unlocks better leverage than the original development facility provided.",
      ],
      [
        "The development exit finance market has grown significantly as lenders recognise the gap between construction completion and final unit sales. In a market where sales can take 6-18 months post-completion — particularly for larger schemes or those in emerging locations — developers need a cost-effective holding facility rather than an expensive development loan rolling over month after month.",
        "Timing the transition from development finance to exit finance requires coordination. Ideally, you begin conversations with exit lenders 2-3 months before practical completion, so that the new facility is ready to draw as soon as the monitoring surveyor signs off the final stage. This avoids any gap where your development lender might charge penalty rates or demand immediate repayment.",
        "Exit finance facilities are typically structured as a single drawdown that repays the development lender in full, with the remaining equity released over time as units sell. Some lenders offer flexible repayment structures where each unit sale triggers a partial repayment, reducing the outstanding balance and your interest costs progressively.",
      ],
      [
        "Choosing between extending your existing development facility and refinancing onto a dedicated exit product depends on the numbers. Many development lenders offer extension terms — but these are often at increased rates (1-2% premium) and with additional fees. A standalone exit facility from a specialist lender frequently works out cheaper, even accounting for the arrangement fee and legal costs of a new facility.",
        "Exit finance is particularly valuable for developers who have multiple projects in the pipeline. Repaying your development lender frees up your borrowing capacity and track record for the next scheme, rather than having capital tied up in a completed but unsold project. This capital recycling effect can be worth more than the direct interest saving.",
        "The exit finance market includes specialist bridging lenders, challenger banks, and some mainstream funders who have developed specific exit products. Each has different criteria around minimum units remaining, acceptable sales periods, and geographic focus. Matching your completed scheme to the right exit lender is as important as finding the right development funder in the first place.",
      ],
    ],
  },

  "commercial-mortgages": {
    paragraphs: [
      [
        "Commercial mortgages provide long-term finance for acquiring or refinancing income-producing commercial property. Unlike development finance, which is based on projected future value, commercial mortgage lending is primarily driven by the property's current income — specifically, the rental income coverage ratio relative to debt service costs.",
        "Lenders typically require rental income to cover debt service by at least 125-150%, depending on the interest rate and the property type. Multi-tenanted properties with diversified income streams often achieve better terms than single-tenant assets, as the risk of total income loss is lower. The weighted average unexpired lease term (WAULT) is a key metric that influences both leverage and pricing.",
        "Commercial mortgage terms range from 3 to 25 years, with interest rates available on fixed, variable, or hybrid bases. Longer fixes provide certainty but typically carry a premium. The right term structure depends on your investment strategy — if you plan to refurbish and reposition the asset within 5 years, a shorter fix with lower break costs makes more sense.",
      ],
      [
        "Valuation methodology for commercial mortgages differs fundamentally from residential lending. Commercial properties are valued on an investment basis (capitalised rental income) rather than comparable sales, meaning that rental strength, lease terms, and tenant covenant directly affect your achievable leverage and pricing.",
        "Mixed-use properties — typically residential above commercial ground floors — sit in a grey area between commercial and residential mortgage products. Some lenders treat them as commercial, others offer bespoke mixed-use products, and the right approach depends on the income split and the proportion of the property that's commercial versus residential.",
        "Refinancing from development finance or bridging into a long-term commercial mortgage is a common strategy for developers who want to retain completed assets as investments. Pre-agreeing exit finance terms before the development or refurbishment phase gives you certainty on long-term holding costs and can strengthen your initial funding application.",
      ],
      [
        "The commercial mortgage market is served by high-street banks, building societies, specialist commercial lenders, and insurance company lending arms — each with different criteria and sweet spots. High-street banks offer the lowest rates but apply the most conservative underwriting. Specialist lenders accept higher risk but charge accordingly. Finding the right fit requires understanding each lender's current appetite.",
        "Tenant covenant assessment is central to commercial mortgage underwriting. Lenders want to know not just who your tenants are, but their financial stability, their lease terms, and whether the property could be re-let at similar rents if they vacated. Properties with government or blue-chip tenants on long leases attract the best terms.",
        "Break clauses and lease expiries within the mortgage term create risk events that lenders price into their terms. If a significant tenant has a break option exercisable during your proposed mortgage term, expect the lender to stress-test the income coverage assuming that tenant departs. Renegotiating or removing break clauses before seeking finance can materially improve your available terms.",
      ],
    ],
  },
};

// ─────────────────────────────────────────────────────────
// FAQs per service — completely different questions
// ─────────────────────────────────────────────────────────

const SERVICE_FAQS: Record<string, (townName: string, countyName: string) => FAQ[]> = {
  "development-finance": (townName, countyName) => [
    {
      question: "How are development finance drawdowns structured?",
      answer: `Development finance is drawn in stages aligned to your build programme. Typically, a day-one drawdown covers 50-65% of the land value, with subsequent construction drawdowns released against surveyor-certified stage completions — usually foundations, frame, wind and watertight, first fix, second fix, and practical completion. Each drawdown request is verified by the lender's monitoring surveyor before funds are released. For projects in ${townName}, we ensure drawdown schedules are realistic and account for local build conditions.`,
    },
    {
      question: "What is a monitoring surveyor and why do I need one?",
      answer: `A monitoring surveyor (MS) is appointed by the lender to independently verify that construction is progressing in line with the approved build programme and cost plan. They conduct site inspections before each drawdown, confirming that the work claimed has been completed to an acceptable standard. The MS cost — typically £5,000-£15,000 depending on scheme size — is paid by the borrower. In ${countyName}, we work with experienced local monitoring surveyors who understand regional build standards.`,
    },
    {
      question: "Can I get development finance without full planning permission?",
      answer: `Most development finance lenders require full, detailed planning permission before they will commit to a facility. Some will consider outline permission with reserved matters, but this typically comes with lower leverage and higher pricing. A small number of specialist lenders will fund pre-planning acquisitions, but these are structured as bridging or land loans rather than full development facilities. Our recommendation for ${townName} projects is to secure planning before approaching development lenders to access the best terms.`,
    },
    {
      question: "How is GDV calculated for my development?",
      answer: `Gross Development Value (GDV) is the total estimated revenue from selling or letting all units in your completed scheme. It's calculated by the lender's valuer using comparable sales evidence — recent transactions for similar properties in the same area. For ${townName}, the valuer will look at recent sales within a reasonable radius, adjusting for specification, size, and location differences. The RICS Red Book valuation will also consider market conditions and forecast trends.`,
    },
    {
      question: "What contingency should I build into my development costs?",
      answer: "Lenders typically expect a construction contingency of 5-10% of build costs, depending on the project's complexity. Ground-up schemes on cleared sites usually require 5%, while conversion projects involving existing structures may need 7.5-10% to account for unforeseen structural issues. The contingency sits within your total cost plan and is only drawn if needed. We recommend erring toward the higher end for refurbishment or conversion projects where hidden issues are more likely.",
    },
    {
      question: "Do I need a separate contractor or can I self-build?",
      answer: "Most development finance lenders prefer an independent, experienced contractor on a fixed-price or JCT contract. Self-build arrangements — where the developer also acts as the main contractor — are possible but limit your lender options and typically attract less favourable terms. If you plan to self-build, having a credible quantity surveyor verify your cost plan and an experienced site manager on the project will help reassure lenders. Some specialist funders actively support self-build developers with a proven track record.",
    },
  ],

  "mezzanine-finance": (townName, countyName) => [
    {
      question: "How does mezzanine finance interact with my senior lender?",
      answer: `Mezzanine sits behind the senior lender in the capital stack, meaning the senior lender gets repaid first in any default scenario. This relationship is governed by an intercreditor agreement (ICA) that defines each party's rights. Not all senior lenders accept mezzanine behind their facility — we ensure that your senior lender in ${countyName} is mezzanine-friendly before committing to a dual-tranche structure.`,
    },
    {
      question: "What intercreditor agreement is needed for mezzanine?",
      answer: "An intercreditor agreement (ICA) governs the relationship between senior and mezzanine lenders. It covers priority of payments, information rights, standstill periods (during which the mezzanine lender cannot take enforcement action), and the conditions under which each lender can exercise their security. ICAs are typically negotiated between the lenders' solicitors, and the process can take 2-4 weeks. We coordinate this process to minimise delays and ensure terms are workable for both parties.",
    },
    {
      question: "Can I use mezzanine finance to fund 100% of build costs?",
      answer: `Mezzanine typically stretches your total leverage from the senior lender's cap (usually 60-70% of costs) up to 85-90% of total costs. Achieving 100% of costs through debt alone is unusual — most mezzanine structures still require the developer to contribute 10-15% equity. However, if your land was acquired at a discount to current value, the equity trapped in the site may count as your contribution. For ${townName} schemes, we model the capital stack to minimise your cash equity requirement.`,
    },
    {
      question: "How does the mezzanine lender's return work?",
      answer: "Mezzanine returns are structured as either fixed interest (typically 12-18% p.a., usually rolled up), a profit share (commonly 15-25% of net development profit), or a combination of both — a lower fixed coupon plus a smaller profit share. Pure profit-share structures reduce your cost during the build phase but can be more expensive if the scheme performs well. The optimal structure depends on your project's risk profile and expected returns.",
    },
    {
      question: "What happens if my project overruns with mezzanine in place?",
      answer: "Project overruns with mezzanine in place are more expensive than with senior debt alone, because you're accruing interest on both tranches. Most mezzanine facilities include a 3-6 month extension option (sometimes at a higher rate) to accommodate delays. However, if the overrun threatens scheme viability, the intercreditor agreement governs how the situation is managed. Early communication with both lenders is essential — we advise our clients to flag potential delays as soon as they become apparent.",
    },
  ],

  "bridging-loans": (townName, countyName) => [
    {
      question: "How fast can bridging finance complete?",
      answer: `The fastest bridging completions happen within 3-5 working days for straightforward residential properties with clean title and simple legal structures. More typically, completions take 7-14 working days. The key variables are valuation turnaround time, legal title complexity, and whether the borrower has all documentation ready. For properties in ${townName}, we have relationships with local valuers who can provide same-day or next-day inspections to accelerate the process.`,
    },
    {
      question: "What exit strategy do I need for a bridging loan?",
      answer: "Every bridging lender requires a credible exit strategy — their primary concern is how and when you'll repay the loan. The three most common exits are: (1) sale of the property, (2) refinance onto a term mortgage, or (3) refinance into a development or refurbishment facility. The stronger and more certain your exit, the better your bridging terms. Having an exit facility agreed in principle before drawing the bridge gives lenders maximum confidence.",
    },
    {
      question: "Can I use a bridging loan to buy at auction?",
      answer: `Auction purchase is one of the most common bridging use cases. You typically have 28 days to complete after the hammer falls (some lots have 56-day completion periods). We recommend getting a bridging decision in principle before auction day — this means the lender has reviewed your financials and will commit subject only to valuation and legal due diligence on the specific property. For auctions featuring ${countyName} properties, we can often arrange pre-auction valuations to further accelerate completion.`,
    },
    {
      question: "Are regulated and unregulated bridging loans different?",
      answer: "Yes, significantly. Regulated bridging loans are governed by the FCA and apply when you or a close family member will occupy the property. They offer consumer protections including a 14-day reflection period, which can delay completion. Unregulated bridges apply to investment properties and have no reflection period, making them faster to complete. The distinction is important because it affects which lenders can participate and the speed of execution.",
    },
    {
      question: "What happens if my bridging loan term expires?",
      answer: "If you can't repay the bridge within the initial term, most lenders offer a contractual extension — typically 3-6 months at an increased interest rate. Beyond the extension period, the lender can appoint receivers or take enforcement action to recover their funds. The best way to avoid this situation is to have a realistic exit timeline from the outset and to start executing your exit strategy well before the term expires. We monitor all active bridges and flag upcoming maturities to ensure exits are on track.",
    },
    {
      question: "Can bridging finance be used on commercial property?",
      answer: `Commercial bridging is available for offices, retail units, industrial properties, mixed-use buildings, and land. Rates are typically slightly higher than residential bridging — from 0.65% per month — and maximum LTV is usually 65-70% rather than the 75% available on residential. For commercial properties in ${townName}, we access specialist commercial bridging lenders who understand the local investment market and can value accurately.`,
    },
  ],

  "equity-jv": (townName, countyName) => [
    {
      question: "How are profits typically split in a JV?",
      answer: `Profit splits vary widely depending on what each party contributes. A developer contributing land with planning permission and managing the build typically retains 55-70% of net profits. A developer contributing only management expertise (no land, no cash) might receive 30-50%. The equity partner's share is usually structured as a preferred return (8-12% p.a.) plus a share of remaining profits. For ${townName} schemes, profit splits also reflect local market risk and expected returns.`,
    },
    {
      question: "What control does the equity partner have over my project?",
      answer: "The level of control varies by agreement, but equity partners typically require approval rights over key decisions: contractor appointment, material specification changes, pricing strategy, and any cost overruns exceeding an agreed threshold (usually 5-10% of budget). Day-to-day project management decisions remain with the developer. The governance framework should be agreed upfront in the JV agreement — we help negotiate terms that give the developer operational freedom while providing the equity partner with appropriate oversight.",
    },
    {
      question: "Can I use JV equity alongside senior debt?",
      answer: `Absolutely — this is one of the most common and efficient structures. The JV entity borrows senior debt at 55-65% of GDV, with the equity partner funding the remaining costs. This gears the equity partner's return (they're investing less cash for the same profit share) and reduces their risk exposure to the senior debt portion. For ${countyName} projects, we coordinate the senior lender and equity partner simultaneously to ensure both are comfortable with the structure.`,
    },
    {
      question: "How do I exit a JV arrangement once the project completes?",
      answer: "JV exits are typically defined in the JV agreement. For development JVs, the exit is usually the sale of completed units, with profits distributed according to the agreed waterfall after repaying senior debt and the equity partner's preferred return. For investment JVs (retained assets), the exit may involve one party buying out the other at an agreed valuation methodology, or a joint sale after a minimum holding period. Clean exit mechanics should be a priority during JV negotiation.",
    },
    {
      question: "What due diligence will a JV partner require?",
      answer: "Equity partners conduct thorough due diligence on both the project and the developer. Expect them to review: your track record (completed projects, financial outcomes), the site (title, planning, environmental), the appraisal (costs, GDV, programme), and your financial position (personal net worth, other commitments). Institutional equity partners will also require professional reports — Red Book valuation, site investigation, planning review — which typically cost £15,000-£30,000. Having these prepared in advance accelerates the process.",
    },
  ],

  "refurbishment-finance": (townName, countyName) => [
    {
      question: "What's the difference between light and heavy refurbishment finance?",
      answer: `Light refurbishment covers cosmetic works — redecoration, new kitchens and bathrooms, flooring, garden landscaping — typically costing less than £50,000 or 15% of property value. Heavy refurbishment involves structural alterations, extensions, reconfiguration, or change of use, and usually requires planning permission or building regulations approval. The distinction matters because light refurb can be funded through a standard bridging loan, while heavy refurb requires a specialist facility with staged drawdowns. For properties in ${townName}, we assess the scope of works to recommend the right product.`,
    },
    {
      question: "Can I convert a commercial property to residential using refurbishment finance?",
      answer: `Yes — commercial-to-residential conversions are one of the most common uses of refurbishment finance, particularly under permitted development rights (Class MA for office-to-residential, Class G for agricultural buildings). In ${countyName}, we work with specialist lenders who understand PDR conversions and can move quickly when prior approval is in place. The key requirement is evidence that the building is structurally suitable for residential conversion without disproportionate external alterations.`,
    },
    {
      question: "How are refurbishment costs verified by the lender?",
      answer: "Lenders verify refurbishment costs through either a quantity surveyor's report (for heavy refurb over £150K) or a contractor's fixed-price quote (for lighter works). Some lenders will accept a detailed schedule of works prepared by the borrower, but this limits your lender options. We recommend obtaining at least two contractor quotes for comparison and having a QS review the scope if the works exceed £100K. Costs are drawn in arrears against completed work, verified by the lender's surveyor.",
    },
    {
      question: "Do I need planning permission for my refurbishment project?",
      answer: "Not all refurbishment works require planning permission. Internal alterations that don't change the external appearance of the building are generally permitted development. However, extensions, changes to listed buildings, works in conservation areas, and changes of use typically require planning consent. Building regulations approval is a separate requirement that applies to structural works, electrical installations, and plumbing regardless of planning status. Check with your local authority early in the process.",
    },
    {
      question: "Can I live in the property during refurbishment?",
      answer: "If you plan to occupy the property during refurbishment, the loan becomes a regulated product under FCA rules. This limits your lender options and typically adds 1-2 weeks to the completion timeline due to the mandatory reflection period. Many borrowers choose to live elsewhere during works to access unregulated (faster, wider lender choice) refurbishment finance. If the property will be uninhabitable during works, the point is moot — but confirm with your solicitor before proceeding.",
    },
    {
      question: "What happens if refurbishment costs exceed my budget?",
      answer: `Most refurbishment facilities include a contingency allowance of 5-10% built into the approved cost plan. If costs exceed this contingency, you'll need to fund the overrun from your own resources or request a facility increase from the lender — which requires a revised valuation and may not be approved. To mitigate this risk, we recommend thorough structural surveys before acquisition, fixed-price contractor agreements, and realistic contingency provisions, particularly for older properties in ${countyName} where hidden defects are more common.`,
    },
  ],

  "development-exit-finance": (townName, countyName) => [
    {
      question: "What is development exit finance?",
      answer: `Development exit finance is a short-term loan that replaces your development finance facility once construction is complete or near-complete. It repays your development lender and provides a lower-cost holding facility while you sell the remaining units in your scheme. For completed projects in ${townName}, exit finance typically costs significantly less than rolling over an expired development facility.`,
    },
    {
      question: "When should I arrange exit finance?",
      answer: `Ideally, start conversations with exit lenders 2-3 months before practical completion. This gives time for valuation, legal due diligence, and facility documentation so the exit facility is ready to draw as soon as your development is signed off. For ${countyName} projects, we coordinate the transition to ensure there's no gap between your development facility expiring and the exit facility completing.`,
    },
    {
      question: "How is exit finance different from extending my development loan?",
      answer: "Development loan extensions typically come at a premium rate (1-2% above the original facility rate) and often require additional fees. Exit finance is specifically designed for completed schemes, so it's priced against the lower risk of a finished, habitable development rather than an active construction project. The net saving — even after arrangement fees and legal costs — usually makes exit finance the more cost-effective option.",
    },
    {
      question: "What LTV can I achieve with exit finance?",
      answer: `Exit finance lenders typically advance up to 70-75% of the current market value of unsold units. The valuation is based on the completed scheme rather than the development appraisal GDV, so the actual advance depends on how the market has moved since you started the project. For completed schemes in ${townName}, a Red Book valuation of the finished units determines the maximum facility.`,
    },
    {
      question: "How are repayments structured on exit finance?",
      answer: "Most exit finance facilities allow partial repayments as individual units sell, reducing your outstanding balance and interest costs progressively. Some lenders require a minimum repayment per unit sale (typically 100-110% of the per-unit debt allocation), while others allow flexible repayment as long as the overall LTV remains within covenant. Interest can be serviced monthly or rolled up depending on the lender.",
    },
    {
      question: "Can I use exit finance if I haven't sold any units yet?",
      answer: `Yes — exit finance is specifically designed for this scenario. The lender assesses the completed scheme, your sales strategy, and comparable evidence to determine that the units are saleable at the projected values. Having some units under offer or reserved strengthens your application, but it's not a requirement. For ${countyName} schemes, we present your sales strategy alongside local market evidence to demonstrate achievable sales timelines.`,
    },
  ],

  "commercial-mortgages": (townName, countyName) => [
    {
      question: "What rental coverage ratio do commercial mortgage lenders require?",
      answer: `Most commercial mortgage lenders require rental income to cover debt service by 125-200%, depending on the lender and property type. At current interest rates, a 150% interest cover ratio (ICR) is typical for multi-let properties, while single-tenant assets may need to demonstrate 175-200% coverage. For commercial properties in ${townName}, the achievable ICR depends on local rental levels relative to the purchase price — we model this before approaching lenders to ensure viable terms.`,
    },
    {
      question: "How are commercial properties valued for mortgage purposes?",
      answer: "Commercial properties are valued using the investment method — capitalising the rental income at an appropriate yield to derive a capital value. The valuer assesses: the quality and location of the property, the strength of the tenants, the terms of the leases, and comparable investment transactions. This means a property with strong tenants on long leases in a good location will be valued more highly (lower yield, higher value) than the same building with short leases or weak tenants.",
    },
    {
      question: "Can I get a commercial mortgage on a mixed-use property?",
      answer: `Mixed-use properties — typically with commercial ground floors and residential upper floors — are financeable but fall between specialist product types. If the residential element exceeds 40-50% of the total floor area, some lenders will treat it as a residential mortgage with a commercial element. Others offer bespoke mixed-use products. The income split between commercial and residential tenants, and the relative lease strengths, determine which approach yields the best terms for ${countyName} mixed-use assets.`,
    },
    {
      question: "What lease length do lenders expect from my tenants?",
      answer: "Lenders prefer tenants on institutional lease terms — typically 5-10 year leases with upward-only rent reviews and a minimum 3-year unexpired term. However, many commercial properties have shorter leases or are multi-let with a range of expiry dates. The weighted average unexpired lease term (WAULT) is the key metric: a WAULT of 4+ years is generally comfortable for most lenders, while a WAULT under 2 years will limit your options and increase pricing.",
    },
    {
      question: "How does personal guarantee work with commercial mortgages?",
      answer: "Personal guarantees (PGs) are common in commercial mortgage lending, particularly for smaller loans (under £2M) or where the borrowing entity is a single-purpose vehicle (SPV). The PG gives the lender recourse to your personal assets if the rental income is insufficient to service the debt. Some lenders offer non-recourse lending (no PG) but this typically requires lower LTV (50-60%) and stronger income coverage. We negotiate PG exposure carefully, sometimes limiting guarantees to interest shortfall rather than the full loan amount.",
    },
    {
      question: "Can I refinance a development into a commercial mortgage?",
      answer: `Refinancing a completed development into a long-term commercial mortgage is a common exit strategy for developers who want to retain assets as investments. The key transition point is when the property has stabilised — meaning tenants are in occupation, leases are signed, and rental income is flowing. Pre-agreeing exit terms during the development phase gives you certainty on long-term holding costs. For retained assets in ${townName}, we help structure the development-to-investment transition to optimise your long-term returns.`,
    },
  ],
};

// ─────────────────────────────────────────────────────────
// Deal Examples per Service (genuinely different)
// ─────────────────────────────────────────────────────────

const SERVICE_DEAL_EXAMPLES: Record<string, (townName: string) => DealExample> = {
  "development-finance": (townName) => ({
    title: `New-Build Residential Scheme near ${townName}`,
    description: `A 12-unit residential development on a former commercial site near ${townName}. The project involved demolition of the existing structure, full site remediation, and construction of a three-storey apartment block with underground parking. Funding structured as phased drawdowns against a 14-month build programme with day-one land release.`,
    gdv: "£4,200,000",
    loanAmount: "£2,730,000",
    ltv: "65% LTGDV",
    loanType: "Senior Development Finance",
  }),

  "mezzanine-finance": (townName) => ({
    title: `Capital Stack Layering for ${townName} Conversion`,
    description: `A 24-unit commercial-to-residential conversion requiring a stretched capital stack. Senior debt covered 65% of total costs, with mezzanine bridging the gap to 85%. The dual-tranche structure was coordinated with a single monitoring surveyor and governed by an intercreditor agreement negotiated in parallel with the senior facility.`,
    gdv: "£5,800,000",
    loanAmount: "£1,200,000",
    ltv: "85% of Total Costs",
    loanType: "Mezzanine (behind £3.5M senior)",
  }),

  "bridging-loans": (townName) => ({
    title: `Auction Purchase in ${townName}`,
    description: `A Victorian terraced property purchased at auction for 22% below market value. Bridging finance was pre-agreed before auction day, enabling completion within 14 days of the hammer falling. The exit was a pre-arranged light refurbishment facility, with the borrower adding value through cosmetic improvements before refinancing onto a buy-to-let mortgage.`,
    gdv: "£1,100,000",
    loanAmount: "£770,000",
    ltv: "70% LTV",
    loanType: "Regulated Bridging Loan",
  }),

  "equity-jv": (townName) => ({
    title: `JV Partnership for ${townName} Scheme`,
    description: `A 30-unit residential development where the developer contributed land with planning permission (valued at £1.7M) and a family office partner funded 100% of construction costs. The developer managed the build and retained 60% of net profits, with the equity partner receiving 40% plus an 8% per annum preferred return on invested capital.`,
    gdv: "£8,500,000",
    loanAmount: "£6,800,000",
    ltv: "100% of Costs",
    loanType: "Equity JV + Senior Debt",
  }),

  "refurbishment-finance": (townName) => ({
    title: `HMO Conversion near ${townName}`,
    description: `Conversion of a large Victorian property into a licensed 8-bed HMO. Works included structural reconfiguration, ensuite bathrooms to all rooms, fire safety compliance works, and a shared commercial kitchen. Funded as a light refurbishment bridge at 75% of purchase price with works costs drawn against stage completions over a 5-month programme.`,
    gdv: "£950,000",
    loanAmount: "£620,000",
    ltv: "75% LTV",
    loanType: "Refurbishment Bridge",
  }),

  "development-exit-finance": (townName) => ({
    title: `Completed Residential Scheme Exit in ${townName}`,
    description: `A 16-unit residential development completed on programme but with only 4 units sold at practical completion. The original development facility was approaching maturity with the lender pressing for repayment. Exit finance was arranged to repay the development lender in full, providing an 18-month sales window at a significantly lower interest rate. 8 units sold within 6 months, with partial repayments reducing the outstanding balance progressively.`,
    gdv: "£5,600,000",
    loanAmount: "£3,150,000",
    ltv: "75% of unsold unit value",
    loanType: "Development Exit Finance",
  }),

  "commercial-mortgages": (townName) => ({
    title: `Multi-Let Office Acquisition in ${townName}`,
    description: `Acquisition of a multi-tenanted office building with 6 tenants on lease terms ranging from 2 to 8 years. WAULT of 4.3 years with 85% occupancy at acquisition. A 15-year fixed-rate commercial mortgage was secured at 70% LTV, with the lender excluding the vacant floor from income covenant calculations for the first 12 months to allow for letting.`,
    gdv: "£4,200,000",
    loanAmount: "£2,940,000",
    ltv: "70% LTV",
    loanType: "15-Year Fixed Commercial Mortgage",
  }),
};

// ─────────────────────────────────────────────────────────
// Arrangement Fees per Service
// ─────────────────────────────────────────────────────────

const SERVICE_ARRANGEMENT_FEES: Record<string, string> = {
  "development-finance": "1.5-2% of facility",
  "mezzanine-finance": "2-3% of facility",
  "bridging-loans": "1-2% of facility",
  "equity-jv": "Negotiated per deal",
  "refurbishment-finance": "1-2% of facility",
  "commercial-mortgages": "0.5-1.5% of facility",
  "development-exit-finance": "1-2% of facility",
};

// ─────────────────────────────────────────────────────────
// County Overview Content (region-aware)
// ─────────────────────────────────────────────────────────

const COUNTY_OVERVIEW_VARIANTS: Record<Region, string[][]> = {
  "london-se": [
    [
      "As one of the most active development markets in the UK, this region offers opportunities across the full spectrum — from high-density urban apartment schemes to commuter-belt family housing. Strong demand fundamentals and premium exit values attract both local developers and national operators, while the depth of the lender market ensures competitive finance is available for well-structured proposals.",
      "Planning in the South East can be more challenging than other regions, with conservation areas, listed buildings, and community opposition adding complexity. However, the premium achievable values mean that projects which do secure consent are typically well-rewarded. We work with developers to present schemes to lenders in a way that addresses these regional considerations.",
    ],
    [
      "The property development landscape here is characterised by high land values, strong buyer demand, and a competitive lending market. Transport connectivity — from Crossrail to mainline rail services — drives micro-market premiums that informed developers can exploit. The key to success is accurate site-level appraisal that reflects genuine local comparables rather than regional averages.",
      "Housing undersupply in this region is among the most acute in the country, creating a structural demand driver that supports new development. Local authorities are under pressure to meet housing targets, which can create planning opportunities for developers who engage constructively with the consenting process.",
    ],
  ],
  "north-west": [
    [
      "The North West property market combines strong rental yields with genuine capital growth potential, driven by major regeneration programmes and population growth. Manchester's expansion as a commercial centre is creating ripple effects across the wider region, with towns along transport corridors benefiting from improved connectivity and employment growth.",
      "Build costs in the North West remain competitive relative to achievable values, creating margins that can support both experienced developers and those building their track record. We connect developers with lenders who understand the regional market dynamics and can assess schemes based on realistic local comparables.",
    ],
    [
      "Regeneration-driven development is the defining characteristic of the North West property market. From Manchester's Northern Quarter to Liverpool's Baltic Triangle, urban renewal projects are transforming former industrial areas into thriving residential and mixed-use neighbourhoods. Lenders with regional expertise recognise the value creation potential in these regeneration zones.",
      "The rental market across the North West is robust, with yields consistently outperforming London and the South East. This makes the region attractive for developers planning to retain completed units as investments, with commercial mortgage refinancing providing a viable long-term hold strategy.",
    ],
  ],
  midlands: [
    [
      "The Midlands development market benefits from central UK connectivity, a growing population, and relative affordability that continues to attract both residents and businesses. Birmingham's transformation as a major investment destination is creating demand for housing, offices, and mixed-use developments at a scale not seen in decades.",
      "The region's industrial heritage provides a rich pipeline of conversion opportunities — from Victorian factories and mills to post-war commercial buildings. These buildings often benefit from permitted development rights, enabling faster consenting and lower planning risk. We work with lenders who understand the specific considerations of conversion projects in the Midlands.",
    ],
    [
      "Property development in the Midlands is supported by strong fundamentals: growing employment, improving transport links, and a housing market that remains affordable relative to earnings. The M1, M6, and M42 corridors connect the region's towns and cities, creating commuter catchment areas that support residential development in locations beyond the traditional urban cores.",
      "University cities across the Midlands — including Birmingham, Nottingham, Leicester, and Coventry — generate consistent demand for purpose-built student accommodation and graduate rental housing. This specialist sector offers attractive yields and has a dedicated lending market that we access for qualifying projects.",
    ],
  ],
  "south-west": [
    [
      "The South West offers a distinctive development market shaped by lifestyle demand, tourism, and Bristol's emergence as one of the UK's most dynamic cities. Property values vary significantly across the region — from Bristol's urban premium to the more accessible markets of Somerset and Wiltshire — creating opportunities for developers at different price points and risk levels.",
      "Tourism-driven demand supports mixed-use and holiday-let development models in coastal areas of Devon, Cornwall, and Dorset. These schemes require specialist lender knowledge, as income profiles differ from standard residential developments. We source finance from lenders who understand seasonal income patterns and the holiday-let regulatory framework.",
    ],
    [
      "Bristol dominates the South West development finance market, with its tech sector employment base, university population, and cultural appeal driving residential demand across the city and its commuter belt. Bath's heritage market attracts premium buyers, while the M4 and M5 corridors support residential development in towns that offer relative affordability with good connectivity.",
      "Post-pandemic lifestyle migration has strengthened demand in South West markets that were previously considered secondary. Remote working has enabled permanent relocation from London, pushing up values in towns like Exeter, Taunton, and Cheltenham. Developers who can deliver quality housing stock in these locations are finding strong demand from relocating professionals.",
    ],
  ],
  "north-east-yorkshire": [
    [
      "Yorkshire and the North East offer some of the UK's most compelling development economics. Low land costs, competitive build prices, and strong rental yields create margins that support viable schemes across a range of project types. Leeds, Sheffield, and Newcastle anchor the region's development market, with their university populations and growing employment bases driving consistent housing demand.",
      "The region's regeneration zones — from Teesside's industrial transformation to Hull's cultural renaissance — are unlocking development sites at accessible land values. Lenders with regional expertise understand the strong income potential relative to development costs, and several specialist funders actively target the North East and Yorkshire markets.",
    ],
    [
      "Property development in this region benefits from a growing recognition that northern cities offer genuine investment returns comparable to, or exceeding, many southern markets on a yield basis. Student accommodation, young professional rental housing, and family homes all find strong demand in the region's major centres, creating diversified exit options for completed schemes.",
      "Heritage Action Zones and conservation area grants across Yorkshire and the North East provide additional incentives for sensitive conversion projects, while the region's stock of Victorian and Edwardian buildings creates a natural pipeline of refurbishment opportunities. We connect developers with lenders who value these regional opportunities and can assess schemes based on local market knowledge.",
    ],
  ],
  "east-of-england": [
    [
      "The East of England combines London proximity with significantly lower land costs, making it one of the UK's most active regions for volume residential development. The Cambridge-London corridor is experiencing tech-driven growth that supports premium housing demand, while market towns across Suffolk, Norfolk, and Cambridgeshire have genuine housing undersupply that supports new development.",
      "Commuter-belt demand remains a defining feature of the East of England property market, with towns offering fast rail services to London attracting premium buyer interest. The Oxford-Cambridge Arc represents a generational development opportunity, with infrastructure investment planned to support hundreds of thousands of new homes over the coming decades.",
    ],
    [
      "The development market in the East of England is diverse: from high-value Cambridge tech corridors to Norfolk's coastal markets and Bedfordshire's commuter towns. This diversity means that lender appetite and achievable terms vary significantly by location, and matching your scheme to the right funder requires knowledge of each sub-market's dynamics.",
      "Agricultural conversions under Class Q permitted development are particularly relevant in the East of England, where the rural landscape contains a significant stock of redundant agricultural buildings suitable for residential conversion. These schemes offer a fast route to creating rural housing, and specialist lenders understand the specific considerations of barn conversions and farmstead developments.",
    ],
  ],
  scotland: [
    [
      "Scotland's property development market operates under its own planning system and legal framework, creating both opportunities and specific considerations for developers. Edinburgh commands premium residential values driven by constrained supply within the UNESCO World Heritage boundary, while Glasgow's extensive regeneration agenda is opening up large-scale development at more accessible land values.",
      "The Scottish Government's affordable housing programme provides grant funding that can improve scheme viability for developers willing to include affordable elements. Build-to-Rent is gaining momentum in both Edinburgh and Glasgow, with institutional capital recognising the strong rental fundamentals of Scottish cities. Financing Scottish projects requires lenders who understand the specific legal differences north of the border.",
    ],
    [
      "Development finance in Scotland requires awareness of key legal differences from England and Wales, including the use of Standard Securities rather than Legal Charges and differences in the planning application process. These differences don't affect the fundamentals of financing, but they do influence which lenders are active in the market. We work exclusively with funders who have Scotland-specific experience and legal capability.",
      "Aberdeen's energy transition is creating new development opportunities beyond the traditional oil and gas economy, while Dundee's V&A-anchored waterfront regeneration has catalysed residential interest. Scotland's smaller cities and towns — from Stirling to Perth — offer development opportunities with strong local demand and limited competition from national housebuilders.",
    ],
  ],
  wales: [
    [
      "Wales offers genuine development opportunities supported by a policy environment that actively encourages housebuilding. Help to Buy Wales and Welsh Government grant schemes provide demand-side support that improves scheme viability, particularly for developments targeting first-time buyers. Cardiff and Swansea anchor the Welsh development market, with growing populations and improving economic fundamentals.",
      "The Welsh planning system has its own nuances — including Technical Advice Notes, the requirement for Welsh language impact assessments in certain areas, and specific affordable housing policies. Developers who understand these requirements can navigate the system effectively, and lenders experienced in the Welsh market account for the specific consenting timeline in their facility terms.",
    ],
    [
      "South Wales dominates the development finance market, with Cardiff's continued growth as a commercial and cultural centre driving residential demand across the city and the M4 corridor. Newport's regeneration and the continued development of the South Wales valleys create opportunities for developers who understand the local market dynamics and can source sites at values that support viable schemes.",
      "North Wales offers a different market dynamic, with tourism-driven demand supporting holiday-let and mixed-use developments along the coast, while market towns in mid-Wales benefit from lifestyle relocation and a chronic shortage of quality housing stock. We connect developers across Wales with lenders who understand the regional variations and can structure finance accordingly.",
    ],
  ],
};

// ─────────────────────────────────────────────────────────
// Town Overview Variants (per region)
// ─────────────────────────────────────────────────────────

const TOWN_OVERVIEW_VARIANTS: Record<Region, ((townName: string, countyName: string) => string[])[]> = {
  "london-se": [
    (townName, countyName) => [
      `Property development in ${townName} benefits from the strong buyer demand that characterises the South East market. Transport links, local amenities, and the area's established residential character support premium exit values for well-designed schemes. Whether you're planning a boutique residential conversion or a larger new-build development, the lending market for ${townName} projects is active and competitive.`,
      `Our team has arranged finance for multiple projects across ${countyName}, building relationships with lenders who understand local planning dynamics, build costs, and achievable values. This local knowledge allows us to present your ${townName} scheme to the right funders — those with genuine appetite for your specific project type and location.`,
    ],
    (townName, countyName) => [
      `${townName} sits within one of the UK's strongest housing markets, where persistent undersupply supports both sales values and rental demand. The area attracts a mix of owner-occupiers and investors, creating flexible exit strategies for developers — whether selling completed units, retaining as BTL investments, or a combination of both.`,
      `Securing competitive finance for ${townName} developments requires matching your project with lenders who are currently active in ${countyName}. Lender appetite varies by quarter and by location, and our real-time knowledge of which funders are deploying capital in your area gives you an advantage in both speed and pricing.`,
    ],
  ],
  "north-west": [
    (townName, countyName) => [
      `${townName} is part of the North West's dynamic property market, where strong rental yields combine with genuine capital growth potential to create attractive development economics. The area benefits from the region's broader regeneration momentum, with infrastructure improvements and employment growth supporting housing demand at a level that sustains new development.`,
      `We arrange finance for projects across ${countyName}, working with lenders who recognise the strong fundamentals of the North West market. Our regional relationships mean we can access funders who are actively seeking to deploy capital in ${townName} and surrounding areas — often achieving better terms than developers approaching the market cold.`,
    ],
    (townName, countyName) => [
      `Development opportunities in ${townName} reflect the North West's broader growth story: competitive build costs, strong rental yields, and a buyer market driven by genuine affordability relative to the South East. The area's connectivity — by road, rail, and proximity to major employment centres — supports residential demand across a range of price points.`,
      `Financing developments in ${townName} requires an understanding of local market dynamics that generic, London-centric brokers often lack. Our experience across ${countyName} means we can advise on realistic GDVs, appropriate build cost assumptions, and the specific lender criteria that apply to projects in your area.`,
    ],
  ],
  midlands: [
    (townName, countyName) => [
      `${townName} sits at the heart of the Midlands development market, benefiting from the region's central location, growing population, and improving transport connections. The area offers development opportunities across the spectrum — from residential new-builds to commercial conversions — with build costs that remain competitive relative to achievable values.`,
      `Our experience arranging finance for projects across ${countyName} gives us insight into the specific lender appetite for ${townName} developments. We understand which funders are active in the area, what terms they're currently offering, and how to present your scheme to maximise leverage and minimise costs.`,
    ],
    (townName, countyName) => [
      `Property development in ${townName} benefits from the Midlands' strong fundamentals: a growing population attracted by relative affordability, improving employment opportunities, and transport connectivity that links the region's towns and cities. The area's mix of Victorian housing stock, post-war commercial buildings, and available development land creates a diverse pipeline of opportunities.`,
      `Lender appetite for ${countyName} projects is strong, with several specialist funders actively targeting the Midlands market. We leverage these relationships to secure competitive terms for ${townName} developments, whether you're a first-time developer or an experienced operator seeking to scale your portfolio.`,
    ],
  ],
  "south-west": [
    (townName, countyName) => [
      `${townName} offers a property development market shaped by the South West's distinctive combination of lifestyle appeal, economic growth, and housing demand. The area attracts buyers relocating for quality of life as well as local demand from growing employment centres, creating a diverse and resilient market that supports well-located residential development.`,
      `Financing developments in ${townName} requires lenders who understand the South West's specific market dynamics — from seasonal demand patterns to the higher build costs associated with some rural locations. We connect you with funders who have genuine ${countyName} experience and can assess your project based on realistic local parameters.`,
    ],
    (townName, countyName) => [
      `Development in ${townName} benefits from the South West's growing appeal to homebuyers, investors, and lifestyle relocators. The area's natural environment, cultural amenities, and improving transport links combine to create demand for quality housing that exceeds current supply — a fundamental driver that supports new development across the price spectrum.`,
      `We have arranged finance for diverse projects across ${countyName}, from urban apartment schemes to rural conversions, giving us a practical understanding of what works in this market. This experience allows us to guide your ${townName} development toward the most appropriate funding structures and lenders.`,
    ],
  ],
  "north-east-yorkshire": [
    (townName, countyName) => [
      `${townName} is part of a region that offers compelling development economics: competitive land and build costs combined with strong rental yields and growing buyer demand. The area's university population, employment growth, and improving connectivity are creating housing demand that supports new development at margins that work for both established developers and those building their track record.`,
      `Our knowledge of the ${countyName} property market extends beyond headline figures to the micro-level detail that matters for scheme viability — achievable sales rates, realistic construction timelines, and the specific lender criteria for projects in your area. We use this knowledge to secure competitive finance for ${townName} developments.`,
    ],
    (townName, countyName) => [
      `Property development in ${townName} reflects the northern growth story that is reshaping UK property markets. Strong yields, affordable entry points, and genuine demand from a growing population create opportunities that sophisticated developers are increasingly recognising. The key to success is realistic appraisal that reflects local comparables rather than aspirational benchmarks.`,
      `Securing finance for developments in ${countyName} requires lenders with genuine regional knowledge. National funders who assess every deal through a London lens often miss the value in northern markets. We work with specialist lenders who understand ${townName}'s specific dynamics and can price your facility based on local market realities.`,
    ],
  ],
  "east-of-england": [
    (townName, countyName) => [
      `${townName} benefits from the East of England's combination of London proximity and relative affordability, making it an attractive location for residential development. The area's transport links, school catchment appeal, and growing employment base create buyer demand that supports new-build and refurbishment schemes across a range of price points and densities.`,
      `We arrange finance for developments across ${countyName}, working with lenders who understand the East of England's diverse sub-markets. Our knowledge of local planning dynamics, build cost benchmarks, and achievable values ensures your ${townName} project is presented to the right funders in the right way.`,
    ],
    (townName, countyName) => [
      `Development in ${townName} is supported by strong demand drivers: an undersupplied housing market, growing employment in the broader region, and lifestyle migration from London accelerated by hybrid working patterns. These fundamentals create a robust market for well-located residential schemes, with both sales and rental exit strategies viable in most locations.`,
      `The lending market for ${countyName} projects is competitive, with both mainstream and specialist funders active in the region. Our relationships across the East of England lending market allow us to benchmark terms and negotiate from a position of knowledge, ensuring your ${townName} development secures the most competitive available finance.`,
    ],
  ],
  scotland: [
    (townName, countyName) => [
      `Property development in ${townName} operates within Scotland's distinct legal and planning framework. Understanding the specific requirements — from Standard Securities to the Scottish planning application process — is essential for both developers and lenders. We work exclusively with funders who have Scottish market experience and the legal infrastructure to support projects north of the border.`,
      `Our ${countyName} experience covers the full range of Scottish development types, from urban apartment schemes to rural conversions. We understand the local market dynamics that affect your project's viability and can connect you with lenders who share that understanding — securing terms that reflect ${townName}'s genuine development potential.`,
    ],
    (townName, countyName) => [
      `${townName} sits within a Scottish property market that offers genuine opportunities for developers who understand its specific dynamics. Housing demand is supported by population growth, employment diversification, and a government policy environment that actively encourages housebuilding through grant funding and planning reforms.`,
      `Financing developments in ${townName} requires lenders who are comfortable with Scottish title law, the planning application process, and local market values. Not all UK-wide funders are active in Scotland, but those that are recognise the strong fundamentals of the Scottish market. We connect you with these lenders to ensure your ${countyName} project secures competitive terms.`,
    ],
  ],
  wales: [
    (townName, countyName) => [
      `Development in ${townName} benefits from Wales's supportive policy environment, including Help to Buy Wales and government grant schemes that improve scheme viability. The area's housing market has genuine undersupply, creating demand for quality new-build and refurbishment projects that is not fully met by the current development pipeline.`,
      `We arrange finance for projects across ${countyName}, working with lenders who understand the Welsh market's specific characteristics — from planning system nuances to local demand drivers. Our experience ensures your ${townName} development is presented to funders who can assess it based on genuine Welsh market knowledge rather than English assumptions.`,
    ],
    (townName, countyName) => [
      `${townName} is part of a Welsh property market that offers genuine development value. Competitive land prices, a supportive grant environment, and growing demand from both local buyers and relocators create conditions that support viable development across a range of scheme types and price points.`,
      `Financing developments in ${countyName} requires an understanding of the Welsh planning system and local market dynamics. We work with lenders who have committed to the Welsh market and can assess ${townName} projects based on realistic local parameters — not generic UK-wide assumptions that may not reflect your area's specific conditions.`,
    ],
  ],
};

// ─────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────

/**
 * Returns market commentary paragraphs for a service page.
 * Content varies by service type, region, and town hash.
 */
export function getMarketCommentary(
  serviceSlug: string,
  countySlug: string,
  townName: string,
  countyName: string,
): string[] {
  const region = getRegion(countySlug);
  const commentary = SERVICE_MARKET_COMMENTARY[serviceSlug];
  if (!commentary) return [];

  // Pick a service-specific paragraph set using town slug hash
  const townSlug = townName.toLowerCase().replace(/\s+/g, "-");
  const serviceParas = pickVariant(commentary.paragraphs, townSlug);

  // Pick a regional context paragraph
  const regionalParas = REGIONAL_CONTEXT[region];
  const regionalPara = pickVariant(regionalParas, townSlug + countySlug);

  // Return service-specific paragraphs + one regional context paragraph
  return [...serviceParas, regionalPara];
}

/**
 * Returns FAQ array for a service page.
 * Each service has completely different questions.
 */
export function getFaqs(
  serviceSlug: string,
  townName: string,
  countyName: string,
): FAQ[] {
  const generator = SERVICE_FAQS[serviceSlug];
  if (!generator) return [];
  return generator(townName, countyName);
}

/**
 * Returns a deal example for a service page.
 * Each service has a unique project type, GDV, and structure.
 */
export function getDealExample(
  serviceSlug: string,
  townName: string,
): DealExample {
  const generator = SERVICE_DEAL_EXAMPLES[serviceSlug];
  if (!generator) {
    return {
      title: `Development Project in ${townName}`,
      description: `A property development project in ${townName} requiring structured finance.`,
      gdv: "£3,000,000",
      loanAmount: "£2,000,000",
      ltv: "65% LTGDV",
      loanType: "Development Finance",
    };
  }
  return generator(townName);
}

/**
 * Returns county overview paragraphs, varying by region.
 */
export function getCountyOverview(
  countySlug: string,
  countyName: string,
): string[] {
  const region = getRegion(countySlug);
  const variants = COUNTY_OVERVIEW_VARIANTS[region];
  const selected = pickVariant(variants, countySlug);
  return selected;
}

/**
 * Returns town overview paragraphs, varying by region and town hash.
 */
export function getTownOverview(
  townName: string,
  countyName: string,
  countySlug: string,
): string[] {
  const region = getRegion(countySlug);
  const variants = TOWN_OVERVIEW_VARIANTS[region];
  const townSlug = townName.toLowerCase().replace(/\s+/g, "-");
  const generator = pickVariant(variants, townSlug);
  return generator(townName, countyName);
}

/**
 * Returns arrangement fee string for a service.
 */
export function getArrangementFee(serviceSlug: string): string {
  return SERVICE_ARRANGEMENT_FEES[serviceSlug] ?? "1-2% of facility";
}

// ─────────────────────────────────────────────────────────
// Popular location links for services page cross-linking
// ─────────────────────────────────────────────────────────

export const SERVICE_POPULAR_LOCATIONS: Record<
  string,
  { label: string; county: string; town: string }[]
> = {
  "development-finance": [
    { label: "London", county: "greater-london", town: "london" },
    { label: "Manchester", county: "greater-manchester", town: "manchester" },
    { label: "Birmingham", county: "west-midlands", town: "birmingham" },
    { label: "Bristol", county: "bristol", town: "bristol" },
    { label: "Leeds", county: "west-yorkshire", town: "leeds" },
  ],
  "mezzanine-finance": [
    { label: "London", county: "greater-london", town: "london" },
    { label: "Manchester", county: "greater-manchester", town: "manchester" },
    { label: "Bristol", county: "bristol", town: "bristol" },
    { label: "Birmingham", county: "west-midlands", town: "birmingham" },
    { label: "Edinburgh", county: "edinburgh", town: "edinburgh" },
  ],
  "bridging-loans": [
    { label: "London", county: "greater-london", town: "london" },
    { label: "Surrey", county: "surrey", town: "guildford" },
    { label: "Manchester", county: "greater-manchester", town: "manchester" },
    { label: "Kent", county: "kent", town: "maidstone" },
    { label: "Essex", county: "essex", town: "chelmsford" },
  ],
  "equity-jv": [
    { label: "London", county: "greater-london", town: "london" },
    { label: "Bristol", county: "bristol", town: "bristol" },
    { label: "Manchester", county: "greater-manchester", town: "manchester" },
    { label: "Birmingham", county: "west-midlands", town: "birmingham" },
    { label: "Edinburgh", county: "edinburgh", town: "edinburgh" },
  ],
  "refurbishment-finance": [
    { label: "London", county: "greater-london", town: "london" },
    { label: "Leeds", county: "west-yorkshire", town: "leeds" },
    { label: "Manchester", county: "greater-manchester", town: "manchester" },
    { label: "Sheffield", county: "south-yorkshire", town: "sheffield" },
    { label: "Newcastle", county: "tyne-and-wear", town: "newcastle" },
  ],
  "commercial-mortgages": [
    { label: "London", county: "greater-london", town: "london" },
    { label: "Edinburgh", county: "edinburgh", town: "edinburgh" },
    { label: "Manchester", county: "greater-manchester", town: "manchester" },
    { label: "Birmingham", county: "west-midlands", town: "birmingham" },
    { label: "Cardiff", county: "cardiff", town: "cardiff" },
  ],
  "development-exit-finance": [
    { label: "London", county: "greater-london", town: "london" },
    { label: "Manchester", county: "greater-manchester", town: "manchester" },
    { label: "Birmingham", county: "west-midlands", town: "birmingham" },
    { label: "Bristol", county: "bristol", town: "bristol" },
    { label: "Leeds", county: "west-yorkshire", town: "leeds" },
  ],
};

// ─────────────────────────────────────────────────────────
// Case study → location cross-linking helpers
// ─────────────────────────────────────────────────────────

/**
 * Maps case study `county` name to a county slug for location links.
 */
export function countyNameToSlug(county: string): string {
  return county.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Maps case study `loanType` to a service slug for deep-linking.
 */
export function loanTypeToServiceSlug(loanType: string): string | null {
  const mapping: Record<string, string> = {
    "Development Finance": "development-finance",
    "Development + Mezzanine": "mezzanine-finance",
    "Bridging Loan": "bridging-loans",
    "Equity JV + Senior Debt": "equity-jv",
    "Refurbishment Finance": "refurbishment-finance",
    "Commercial Mortgage": "commercial-mortgages",
  };
  return mapping[loanType] ?? null;
}
