import type { CalculatorContent } from "./types";

export const content: CalculatorContent = {
  howItWorks: {
    title: "How Office-to-Residential Conversions Work Financially",
    paragraphs: [
      "Office-to-residential conversion is one of the most commercially tested PD strategies in the UK market, having produced tens of thousands of new homes since Class O was introduced in 2013 and subsequently replaced by Class MA in August 2021. The financial logic is straightforward: acquire a vacant or under-let office building at a commercial yield-based valuation, convert it to residential use via prior approval, and sell or refinance the completed units at residential values that are typically 30–60% higher per square foot than the commercial equivalent.",
      "The conversion calculator quantifies the key outputs - gross development value (GDV), total cost, profit, and return on cost - from the inputs specific to an office conversion project. These include the existing office floor area, estimated residential net-to-gross efficiency ratio, target unit mix (studios, one-beds, two-beds), build cost per square foot, and anticipated residential exit values. Unlike ground-up development, office conversions generally achieve higher net-to-gross ratios (75–85%) because the existing structural grid determines room sizes rather than optimal residential planning.",
      "Finance for office-to-residential conversions is typically structured as a bridging loan to fund acquisition and prior approval, followed by a development loan that releases tranches against construction milestones. Alternatively, where the conversion is relatively light-touch - for example, an open-plan office floor requiring minimal structural intervention - some lenders will underwrite the entire project under a single bridging facility at a higher LTV against the completed GDV. The right structure depends on the scale of works, the strength of the exit market, and the developer's track record.",
      "The key variables that distinguish a profitable office conversion from a marginal one are acquisition price (ideally at or near commercial value with no residential hope value priced in), build cost control (conversions carry different risk profiles to new build - unforeseen structural and services costs are common), and exit value certainty. In markets where office-to-resi supply has been high, unit values and absorption periods warrant close scrutiny during appraisal.",
    ],
  },
  guide: {
    title: "Office-to-Residential Conversions: Finance and Planning Guide",
    sections: [
      {
        heading: "Class MA Eligibility: Vacancy Test, Size Limits, and Exclusions",
        paragraphs: [
          "Class MA of the Town and Country Planning (General Permitted Development) (England) Order 2015 (as amended) is the statutory route for converting Use Class E buildings - which includes offices - to residential use without a full planning application. Eligibility is determined by a set of conditions that must all be satisfied before a prior approval application is submitted. Failure to meet any one of them means the development is not PD and a full planning application will be required.",
          "The vacancy condition requires the building to have been vacant for at least three months immediately before the prior approval application date. This is assessed on a building-by-building basis; if a multi-floor office block has floors occupied by tenants on upward-only rent reviews, those floors cannot be included in the application. Developers frequently time acquisition and application to coincide with tenant departures, and evidence of vacancy (typically a statutory declaration supported by utility cut-off records, business rates relief notifications, or landlord correspondence) must accompany the prior approval submission.",
          "The two-year use condition requires the building to have been in Use Class E (or a predecessor use that would now fall within Class E) for a continuous period of at least two years ending on the application date. Buildings that were recently converted from another use - or that have been vacant for longer than two years with no evidence of prior commercial use - may not satisfy this condition. Former residential buildings temporarily converted to offices, or sui generis uses such as casinos or nightclubs, do not qualify.",
        ],
        bullets: [
          "Maximum floorspace per Class MA application: 1,500 sqm - buildings larger than this require phased applications or a full planning consent",
          "Flood zone 3 exclusion: buildings in NPPF flood zone 3 (high probability of flooding) cannot be converted under Class MA",
          "Prior approval assessment topics: transport and parking, contamination risk, flooding, noise from existing or nearby commercial uses, and adequate natural light to habitable rooms",
          "Prior approval determination period: 56 days from the date of a valid application; deemed consent if LPA fails to determine within this period",
          "Article 4 Directions: many LPAs - including the City of London, Manchester City Centre, and numerous London boroughs - have removed Class MA rights in designated employment areas; always verify before committing to acquisition",
        ],
      },
      {
        heading: "Typical Conversion Costs and Build Cost Benchmarks",
        paragraphs: [
          "Office-to-residential conversion costs vary considerably depending on the age and specification of the building, the target residential product, the extent of reconfiguration required, and regional labour markets. As a broad benchmark, conversion costs in 2024–25 range from approximately £80–£120 per square foot for a basic open-plan conversion to £150–£220 per square foot for a full Cat A+ finish in a building requiring significant M&E (mechanical and electrical services) replacement, façade works, or structural intervention.",
          "The most significant cost driver in office conversions is the M&E overhaul. Modern commercial offices run centralised HVAC, raised-access flooring, and shared WC cores that are entirely unsuitable for residential use. Stripping out and replacing these services - running new gas or air source heat pump infrastructure, individual flat ventilation, and separate metering - typically accounts for 25–35% of the total build cost. Where the building has asbestos (common in anything built before 1990), a full asbestos survey and remediation programme will add cost and programme time.",
          "Fire compartmentation is another major cost variable. The Building Safety Act 2022 and associated changes to Approved Document B introduced significantly more onerous requirements for compartmentation in residential buildings, particularly those over 11 metres in height. For office buildings being converted above this threshold, a full fire strategy must be prepared by a competent fire engineer, and the cost of achieving the required compartmentation between flats (and between floors) in a building designed for open-plan commercial use should not be underestimated.",
        ],
        bullets: [
          "Typical conversion cost ranges (England, 2024–25): £80–£120/sqft basic conversion; £150–£220/sqft for high-spec or complex buildings",
          "Net-to-gross efficiency: typically 75–85% for office conversions (vs 85–92% for purpose-built residential) - factor this into unit size calculations",
          "M&E replacement: budget 25–35% of build cost for mechanical and electrical works in pre-2000 buildings",
          "Asbestos: mandatory R&D survey before any conversion; remediation costs can range from £5,000 to over £100,000 depending on extent",
          "Stamp Duty Land Tax: SDLT applies to the commercial acquisition; non-residential rates apply on purchase, potentially saving significantly vs residential rates on comparable GDV properties",
          "Section 106 and CIL: prior approval does not generally trigger Section 106 obligations, but Community Infrastructure Levy may still apply in CIL-charging authorities",
        ],
      },
      {
        heading: "Unit Mix Optimisation and Exit Values",
        paragraphs: [
          "The residential unit mix - the combination of studio, one-bedroom, two-bedroom, and larger flats - is the primary lever through which developers maximise GDV from a fixed amount of floorspace. In an office-to-residential conversion, the unit mix is partly constrained by the structural grid of the building: offices designed around a 7.5–9 metre structural bay pattern will naturally lend themselves to one-bed and two-bed units, while narrower cellular office buildings may suit smaller studios or compact one-beds.",
          "Studios and one-bedroom flats typically achieve the highest value per square foot in most UK markets, because the entry price point is accessible to a larger pool of buyers and investors. However, many LPAs have adopted minimum internal space standards - the nationally described space standard (NDSS) recommends a minimum of 37 sqm for a one-person studio - and some councils apply these as a condition on prior approval as well as on full planning. Below-standard units carry a real risk of mortgage refusal on exit, limiting the buyer pool to cash purchasers only.",
          "The most important exit value comparison in any office conversion appraisal is the per-square-foot residential value versus the per-square-foot office value at the point of acquisition. In secondary provincial markets, this arbitrage can be significant - offices may trade at £80–£150/sqft capital value while comparable residential values are £200–£300/sqft. In prime London locations, the gap may be narrower, but the absolute values are higher. Sensitivity testing the GDV against a 5–10% downward movement in residential values is essential, particularly in markets where new-build residential supply from competing conversions is elevated.",
        ],
        bullets: [
          "Nationally Described Space Standard minimums: 37 sqm (1-person studio), 50 sqm (1-bed, 2-person), 61 sqm (2-bed, 3-person), 70 sqm (2-bed, 4-person)",
          "Avoid units under 30 sqm - below this threshold, high-street mortgage lenders typically decline, severely restricting your buyer pool",
          "Build to rent (BTR) exit: selling the completed block to an institutional BTR operator as a single lot may deliver a faster exit at a modest price discount vs individual unit sales",
          "Comparable evidence: commission a residential RICS valuation report before acquisition to establish GDV assumptions independently of agent marketing estimates",
          "Absorption rate: for blocks of 20+ units, model a realistic sales period (typically 6–18 months) and factor carrying costs into the appraisal",
        ],
      },
      {
        heading: "Finance Structures for Office-to-Residential Conversions",
        paragraphs: [
          "The finance structure for an office conversion project depends principally on three variables: the total project cost (acquisition plus build), the strength and certainty of the planning position, and the developer's track record. For most projects, the preferred structure is a two-stage facility: a bridging loan to fund the acquisition and prior approval costs, transitioning to a development finance facility once prior approval is secured and construction is ready to commence.",
          "Development finance for office conversions is typically available at 60–70% of total project costs (acquisition plus build), with interest rates currently in the range of 8–12% per annum depending on lender, LTV, and borrower profile. Lenders will appoint their own monitoring surveyor to certify drawdowns against a schedule of works, and will require a professional QS cost report before first drawdown. The monitoring surveyor's role is to protect the lender's security as well as to provide a framework for orderly drawdown, so developers should factor in the cost of this service (typically £3,000–£8,000 per project) alongside arrangement fees, legal costs, and valuation fees in the finance cost column of the appraisal.",
          "Where a developer has an established relationship with a funder and strong prior approval, some lenders will underwrite the entire conversion under a heavy refurbishment bridging product at a higher LTV against GDV - typically 65–70% of the completed residential value. This removes the need for a transition between facilities but generally carries a higher all-in cost. The right approach depends on the programme - short, simple conversions suit a single bridging facility; complex, multi-phase projects or buildings requiring significant structural work typically warrant a full development finance facility with properly structured drawdown.",
        ],
        bullets: [
          "Typical development finance terms: 60–70% LTPC (loan to project cost), 65–75% LTGDV (loan to gross development value), 12–24 month terms",
          "Bridging to development: prior approval confirmation is the typical trigger for transitioning from bridging to development finance",
          "Mezzanine finance: available to bridge the gap between senior debt and developer equity - typically 70–85% LTGDV, at a higher rate (12–18% pa)",
          "Exit finance: residential investment loans or buy-to-let mortgages against completed units if the exit strategy is rental rather than sale",
          "Lender due diligence: expect lenders to instruct an independent RICS valuation (Day 1 and GDV), QS report, planning report, and title/legal review before first drawdown",
        ],
      },
    ],
  },
};
