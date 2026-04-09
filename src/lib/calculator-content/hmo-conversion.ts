import type { CalculatorContent } from "./types";

export const content: CalculatorContent = {
  howItWorks: {
    title: "How HMO Conversions Are Financed and Appraised",
    paragraphs: [
      "Houses in multiple occupation (HMOs) are one of the highest-yielding residential property strategies available to UK landlords, but they require a more rigorous appraisal framework than standard buy-to-let because their value depends on income rather than comparable residential sales evidence. The HMO conversion calculator is built around this income-based valuation methodology: it models the gross rental income from individual rooms, deducts operating costs (management, voids, maintenance, licensing fees), and capitalises the net operating income at the yield appropriate to the local HMO market.",
      "Converting a property to an HMO — whether from a single-family dwelling, a flat, or a commercial building — requires analysis across four distinct areas: planning permission or permitted development rights, licensing requirements under the Housing Act 2004, building regulations compliance (particularly fire safety), and the operational management model that determines net yield. Each of these areas carries cost and risk that must be accurately modelled before a finance application is submitted.",
      "Finance for HMO conversions is a specialist area. Most high-street lenders do not offer products for HMOs with more than four lettable rooms, and many have withdrawn from the sector entirely following tightened affordability requirements and stress testing under the Prudential Regulation Authority's buy-to-let mortgage standards. Specialist HMO lenders — including several challenger banks and peer-to-peer platforms — assess applications on a rental coverage basis (typically requiring rent to cover mortgage interest at 125–145% at a stressed rate of 5–6%) and will lend on the HMO value rather than the lower single-let value.",
      "The calculator outputs the key metrics that both experienced investors and their lenders use to assess an HMO: gross yield, net yield, gross rental income per room per month, capital value on an HMO basis, and the loan amount available against that value. It also flags the relationship between the HMO value and the single-let value, which determines the refinance uplift available after conversion — a key element of the buy-refurbish-refinance strategy widely used in the HMO market.",
    ],
  },
  guide: {
    title: "HMO Conversions: Planning, Licensing, and Yield Guide",
    sections: [
      {
        heading: "Article 4 Directions and the Planning Framework for HMOs",
        paragraphs: [
          "The planning status of an HMO depends on its size. Small HMOs of between 3 and 6 occupants sharing a property fall within Use Class C4 under the Town and Country Planning (Use Classes) (Amendment) (England) Regulations 2010. Larger HMOs — those with 7 or more occupants — are sui generis (a use that does not fall within any defined class) and always require full planning consent for a change of use from C3 (dwellinghouse).",
          "For C4 HMOs (3–6 persons), the change of use from C3 to C4 is permitted development in most areas — meaning no planning application is required. However, this PD right has been removed by Article 4 Directions in a significant number of local authority areas, primarily those with high concentrations of student accommodation and shared housing, including Oxford, Cambridge, Bristol, Nottingham, Leeds, Southampton, Portsmouth, and many London boroughs. In Article 4 areas, a full planning application is required for any change of use from a single-family home to an HMO, regardless of the number of occupants, and the LPA can — and regularly does — refuse applications where the proportion of HMOs in a street or ward has already reached the locally defined threshold.",
          "The practical implication for developers and investors is that site selection for HMO conversions must begin with a check of the applicable Article 4 Directions. In non-Article 4 areas, small HMOs can proceed without planning consent, removing a significant source of delay and uncertainty. In Article 4 areas, a planning application adds 8–13 weeks (the statutory determination period) and carries the risk of refusal where an HMO concentration policy applies. Pre-application advice from the LPA is strongly recommended before committing to acquisition in an Article 4 area.",
        ],
        bullets: [
          "Use Class C4: HMO of 3–6 occupants — change of use from C3 is PD in non-Article 4 areas",
          "Sui generis HMO: 7+ occupants — always requires full planning consent regardless of Article 4",
          "Common Article 4 areas: Oxford, Cambridge, Nottingham, Leeds, Bristol, Southampton, Portsmouth, and most Inner London boroughs — always verify before acquisition",
          "HMO concentration policies: many LPAs cap the proportion of HMOs in any 50-metre radius at 10–20% — check the local plan and any adopted SPD",
          "Student-specific HMOs: some LPAs apply specific policies to purpose-built student accommodation (PBSA) and student HMOs — check whether the property will be marketed to students, as this may trigger different policy tests",
          "Conversion back from C4 to C3: a change from HMO back to single-family use is PD in most areas and does not require consent, giving exit flexibility",
        ],
      },
      {
        heading: "Mandatory and Additional Licensing: Requirements and Costs",
        paragraphs: [
          "HMO licensing is separate from planning permission and is governed by the Housing Act 2004, as amended by the Licensing of Houses in Multiple Occupation (Mandatory Conditions) (England) Regulations 2018. All HMOs with five or more occupants forming two or more households — regardless of the number of storeys — require a mandatory HMO licence from the local authority. This is a national requirement that applies everywhere in England.",
          "In addition to mandatory licensing, many local authorities have introduced additional licensing schemes under Part 2 of the Housing Act 2004, which extend licensing requirements to smaller HMOs (typically 3–4 occupants) in designated areas. Selective licensing schemes under Part 3 go further, requiring a licence for all privately rented properties in a defined area regardless of whether they are HMOs. Before acquiring any property intended for HMO use, check whether the local authority operates additional or selective licensing in the target area, as these carry their own application fees (typically £200–£800 per property) and compliance conditions.",
          "HMO licence conditions set out the standards the property must meet, including minimum room sizes, fire safety provisions, heating standards, and management obligations. Licence fees vary significantly between local authorities — mandatory HMO licences typically cost £500–£1,500 per property for a five-year term — but the cost of achieving compliance is often the more significant factor. Councils carry out pre-licence inspections and may issue improvement notices requiring works to be completed before a licence is granted. Planning the conversion to meet licence conditions from the outset — rather than retrofitting — is far more cost-effective.",
        ],
        bullets: [
          "Mandatory licence threshold: 5+ occupants, 2+ households — applies nationally",
          "Additional licensing: extends to smaller HMOs in designated areas — check the LPA's licensing register or housing department",
          "Licence duration: typically 5 years; must be renewed before expiry; operating without a licence is a criminal offence carrying an unlimited fine",
          "Rent repayment orders: tenants (and local authorities) can apply for a rent repayment order of up to 12 months' rent if the landlord operates an unlicensed HMO",
          "Licence conditions: will specify room sizes, fire alarm grade, fire door specification, emergency lighting, bathroom ratios, and kitchen facilities",
          "Management regulations: HMO Management Regulations 2006 impose ongoing duties on landlords/managers regardless of licensing status",
        ],
      },
      {
        heading: "Room Size Minimums, Fire Safety, and Building Regulations",
        paragraphs: [
          "Room size standards for HMOs are governed by the Licensing of Houses in Multiple Occupation (Mandatory Conditions) (England) Regulations 2018, which set out minimum floor areas that must be met as a condition of any mandatory HMO licence. A room used as sleeping accommodation by one adult must have a minimum floor area of 6.51 square metres. A room used by two adults must have a minimum floor area of 10.22 square metres. Rooms under 4.64 square metres cannot be used as sleeping accommodation under any circumstances. These minimums are measured excluding built-in wardrobes and any part of the room where the ceiling height is under 1.5 metres.",
          "Fire safety is the most complex technical area in HMO conversions and the one where non-compliance carries the greatest legal risk. The Fire Safety Act 2021 and the Housing Act 2004 both impose obligations on HMO landlords, and the specific requirements vary by building height and number of occupants. For most HMOs up to two storeys, the standard fire safety specification includes: Grade A interlinked mains-wired smoke alarms on every floor landing and in every habitable room, interlinked heat detectors in kitchens, FD30S (30-minute fire door with smoke seal) specification doors on all habitable rooms and to the kitchen, and a thumb-turn lock on the front door to enable escape. For buildings over two storeys, a full fire risk assessment by a competent professional is required under the Regulatory Reform (Fire Safety) Order 2005.",
          "Building regulations consent is required for any structural works carried out as part of an HMO conversion, including the creation of new rooms, alterations to the structural frame, and changes to drainage. Where the building is changing use from C3 to C4 — or from commercial to residential — a change of use building regulations application is required, which triggers assessment against Approved Document standards for the new residential use. This includes Approved Document B (fire safety), Approved Document E (sound insulation between rooms), Approved Document L (energy efficiency), and Approved Document G (water efficiency).",
        ],
        bullets: [
          "Minimum room sizes (mandatory conditions): 6.51 sqm (1 adult), 10.22 sqm (2 adults), 4.64 sqm minimum (no sleeping use below this area)",
          "Fire alarms: Grade A (mains-wired), interlinked system required for all mandatory licensed HMOs; Grade D (battery) may be acceptable for smaller unlicensed HMOs subject to risk assessment",
          "Fire doors: FD30S specification required on all habitable rooms in mandatory licensed HMOs — budget £150–£400 per door installed including frame and hardware",
          "Emergency lighting: required in communal areas (stairs, hallways, kitchen) for HMOs of 3+ storeys or 5+ occupants",
          "Bathroom ratios: typically 1 bathroom per 5 occupants required by licence conditions; some councils require 1 per 4 — verify locally before finalising room numbers",
          "Soundproofing: Approved Document E requires 40dB Rw airborne sound insulation between bedrooms in HMOs changing use — this often requires new partition walls or acoustic treatment",
        ],
      },
      {
        heading: "Yield Calculations: HMOs vs Standard Buy-to-Let",
        paragraphs: [
          "The financial case for HMO conversion is built on the yield premium over single-let residential property. A standard three-bedroom house let as a single unit might generate a gross yield of 4–6% in most UK markets. The same property converted to a five-bedroom HMO and let by the room can generate a gross yield of 8–15%, depending on the local HMO rental market, the quality of the conversion, and the room sizes achieved. This yield differential is the engine of HMO investment strategy.",
          "The gross yield is, however, an incomplete measure of HMO performance. Operating costs for HMOs are substantially higher than for single-let properties, and must be accurately modelled to arrive at the net yield figure on which valuers and lenders base their assessments. The key cost items are: management fees (typically 10–15% of gross rent for a managing agent, vs 8–12% for a standard BTL), voids (HMOs have higher turnover, particularly in student markets — budget 2–4 weeks void per room per year), utilities (where the landlord provides bills-included tenancies, which is the market norm in most HMO markets), licence fees, insurance premiums (HMO-specific policies cost more than standard landlord cover), and ongoing maintenance and compliance costs.",
          "For valuation purposes, most specialist HMO lenders and RICS valuers apply a net income capitalisation approach to HMOs of five or more bedrooms. The net operating income (gross rent minus operating costs) is divided by the appropriate HMO capitalisation rate for the location — typically 6–9% depending on the market — to arrive at the capital value. This value is usually materially higher than the single-let residential comparables and represents the HMO's 'investment value'. The gap between the single-let value and the HMO investment value is the equity uplift that the buy-refurbish-refinance strategy is designed to capture.",
        ],
        bullets: [
          "Gross yield calculation: (total annual room rents ÷ purchase price including all costs) × 100",
          "Typical HMO gross yields by market (2024–25): 8–12% in Northern cities (Leeds, Manchester, Sheffield, Nottingham); 7–10% in Midlands; 6–9% in Southern England and London",
          "Operating cost benchmarks: management 12–15%, voids 8–10%, maintenance 8–12%, utilities (if inclusive) 15–25%, insurance 1–2%, licensing 0.5–1% — total deductions of 40–60% of gross rent are typical",
          "Net yield target: institutional HMO operators typically require 6%+ net yield; private investors often accept 5–7% net yield in strong markets",
          "Refinance strategy: after conversion and stabilisation, refinance at HMO value (income-based) to release equity — most specialist lenders offer 70–75% LTV against the HMO valuation",
          "Section 24 impact: all HMO mortgage interest is subject to the Section 24 restriction on deductibility for individual landlords; company ownership (SPV) preserves full interest deductibility",
        ],
      },
    ],
  },
};
