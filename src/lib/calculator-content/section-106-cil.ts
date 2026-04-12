import type { CalculatorContent } from "./types";

export const content: CalculatorContent = {
  howItWorks: {
    title: "How the Section 106 and CIL calculator works",
    paragraphs: [
      "This calculator estimates the Community Infrastructure Levy (CIL) liability and Section 106 (S106) obligations associated with your proposed development in England. Enter your proposed development type, gross internal area, location (local planning authority), and any affordable housing requirement set by the LPA. The calculator retrieves the applicable CIL charging rate from the authority's adopted charging schedule, applies it to your chargeable net additional floor area, and produces a CIL estimate alongside a range for expected S106 contributions based on comparable consented schemes in the area.",
      "CIL is a non-negotiable levy charged per square metre of new development by LPAs that have adopted a charging schedule. It is calculated on the net additional chargeable floor area - the new gross internal area minus any existing floorspace that was in lawful use during the three years prior to the planning application. The levy rate varies by authority and by development type within each authority. London boroughs set their own rates, and the Mayor of London also levies a separate Mayoral CIL (MCIL) of £60 per square metre across most of Greater London (with higher rates in specific opportunity areas).",
      "Section 106 contributions are planning obligations negotiated between the developer and the LPA as conditions attached to a planning consent. Unlike CIL, S106 obligations are individually negotiated and vary significantly between authorities and between schemes. Common S106 heads include affordable housing (either on-site units or a commuted sum in lieu), highway contributions, education contributions, open space provision or off-site contributions, sports facilities, health infrastructure, and public realm improvements. Our calculator applies typical S106 ranges based on comparable consented schemes in the selected authority to give you a realistic expectation, not a fixed figure.",
      "These estimates are indicative benchmarks only. CIL calculations require formal indexation (using the BCIS All-in Tender Price Index from the year of consent to the year of commencement), and S106 obligations must be individually negotiated with the LPA. Always obtain formal CIL liability calculations from your local planning authority and legal advice on S106 obligations before committing to a land acquisition or development programme.",
    ],
  },
  guide: {
    title: "Section 106 and CIL: a developer's guide to planning obligations in England",
    sections: [
      {
        heading: "CIL charging schedules: what you pay, where, and when",
        paragraphs: [
          "The Community Infrastructure Levy was introduced under the Planning Act 2008 and came into effect through the CIL Regulations 2010 (as subsequently amended). It is a charge levied by LPAs on most forms of new development to fund infrastructure needed to support growth in the area. CIL is not universal - only LPAs that have adopted a CIL charging schedule can levy it, and the schedules vary enormously between authorities in both structure and rate. As of 2026, approximately two-thirds of LPAs in England have adopted charging schedules, with the remainder still relying entirely on S106 for developer contributions.",
          "CIL rates are set by LPAs in their charging schedules following a viability assessment demonstrating that the proposed rates can be charged without making development in the area unviable. Rates are expressed in pounds per square metre of chargeable net additional floorspace and are typically divided into development type zones. For example, a London borough might charge £400/sqm for market residential in its higher-value residential zone, £200/sqm in its lower-value zone, nil for affordable housing, and £100/sqm for retail. The same borough might exempt student accommodation entirely from CIL as a strategic priority.",
          "The Mayoral CIL (MCIL) applies across Greater London in addition to each borough's own CIL. MCIL1 originally applied at £35 to £50/sqm but was superseded by MCIL2, which applies at £60/sqm for most of Greater London and £80/sqm in designated CAZ (Central Activities Zone) areas. MCIL2 is charged in addition to borough-level CIL, meaning a residential developer in an inner London borough might face a combined CIL liability of £400 to £500/sqm when both charges are added together. On a 2,000 sqm GIA scheme, that equates to £800,000 to £1,000,000 in CIL charges before any S106 obligations are considered.",
          "CIL is payable at commencement of development rather than at grant of consent. The developer must submit a Commencement Notice to the LPA before starting works (failure to do so results in surcharges of up to 20% of the CIL liability). Payment can be demanded in full at commencement or in instalments under instalment policies adopted by individual LPAs - these vary significantly and should be confirmed with the relevant authority. CIL liability is indexed annually in line with the BCIS All-in Tender Price Index, meaning the amount payable increases from the date of consent to the date of commencement.",
        ],
        bullets: [
          "CIL applies only in LPAs with adopted charging schedules (approximately two-thirds of English LPAs)",
          "London developers face borough CIL plus Mayoral CIL2 (£60-80/sqm) simultaneously",
          "CIL is charged on net additional chargeable floor area - existing lawful floorspace is deducted",
          "CIL is payable at commencement, not at consent - submit a Commencement Notice before breaking ground",
          "Index the CIL from consent date to commencement date using BCIS AITP",
        ],
      },
      {
        heading: "Section 106 negotiation strategies",
        paragraphs: [
          "Unlike CIL, S106 obligations are negotiated individually for each development, giving developers meaningful scope to influence the outcome through skilled negotiation and robust evidence. The starting point for any S106 negotiation is the LPA's adopted policies in its Local Plan and Supplementary Planning Documents (SPDs). These set out what the authority expects from development - the affordable housing percentage, the per-pupil education contribution, the highway improvement requirements - and form the baseline from which negotiation proceeds.",
          "The most important principle in S106 negotiation is that the Planning Practice Guidance (PPG) requires obligations to be necessary to make the development acceptable in planning terms, directly related to the development, and fairly and reasonably related in scale and kind. These three tests derive from regulation 122 of the CIL Regulations and case law. An obligation that does not meet all three tests can be challenged and, in the worst case, refused by the Planning Inspector on appeal. Understanding this legal framework gives developers confidence to push back on LPA demands that are excessive or poorly evidenced.",
          "Timing in S106 negotiations matters enormously. The ideal position is to engage with the LPA in pre-application discussions before submitting the formal planning application, establishing the broad heads of obligation at that early stage. Once an application is validated, the LPA is working against a statutory determination clock (typically 13 weeks for major applications, extendable by agreement), and there is pressure on both sides to reach agreement. Leaving S106 negotiation until after validation reduces your bargaining leverage, as the LPA knows that further delays cost the developer money in finance costs and opportunity cost.",
          "Phased payment triggers and cascade mechanisms are valuable tools in S106 negotiation. Rather than paying a contribution as a lump sum on commencement (which creates significant cash flow pressure alongside CIL), negotiate for payments to be triggered at specific build milestones - first occupation, 50% of units sold, and final occupation. For affordable housing, negotiate a cascade clause that reduces the affordable percentage if a formally agreed GDV threshold is not achieved by the time the development is marketed, providing a contractual mechanism to revisit the affordable housing obligation if the market moves against you.",
        ],
        bullets: [
          "Engage with the LPA in pre-application discussions to establish S106 heads before validation",
          "All obligations must satisfy the three statutory tests: necessary, directly related, and proportionate",
          "Negotiate phased payment triggers rather than lump-sum commencement payments",
          "Secure a cascade mechanism that reduces affordable housing if GDV thresholds are missed",
          "Challenge obligations that lack clear policy basis or supporting evidence",
        ],
      },
      {
        heading: "Affordable housing thresholds and the viability argument",
        paragraphs: [
          "Affordable housing is the most financially significant S106 obligation for most residential developers in England. Local plan policies set a percentage requirement - typically 20% to 40% in urban areas, rising to 50% in parts of London - above a threshold number of units, commonly 10 units (or sites over 0.5 hectares) in urban areas and as few as 5 in rural areas. These percentages are policy starting points, not fixed outcomes, because the NPPF and PPG provide a mechanism for developers to challenge requirements that would make their development unviable.",
          "The viability assessment process under the NPPF is the primary tool for reducing an unaffordable affordable housing obligation. A developer who commissions an RICS-accredited valuer to prepare a Financial Viability Assessment (FVA) demonstrating that the policy-compliant affordable housing quantum reduces profit below the Benchmark Land Value (BLV) - the minimum return a reasonable landowner would accept to release the site for development - can submit this as evidence to support a reduced affordable housing obligation. The FVA must be disclosed publicly as a condition of the consent in accordance with the PPG, so the confidentiality of your development economics becomes a planning record.",
          "The three most common grounds for a successful viability challenge are: (1) the site has specific abnormal costs (contamination, demolition, heritage constraints) not captured in the LPA's standard viability assumptions; (2) the local residential market is weaker than the authority-wide assumptions used in the Local Plan viability study; or (3) the LPA's affordable housing tenure mix (the split between social rent, affordable rent, and shared ownership) is more expensive for the developer than the tenure mix assumed in the Local Plan viability study. All three arguments require expert evidence from an accredited valuer with local market knowledge.",
          "The First Homes scheme, introduced under the Planning Policy for Traveller Sites 2015 and subsequently expanded, requires that in England at least 25% of all affordable units provided on most new developments are First Homes - properties sold at a minimum 30% discount to first-time buyers, with the discount perpetuated in perpetuity on future sales. First Homes count towards overall affordable housing requirements but are not eligible for grant funding from Homes England, meaning developers cannot offset the GDV discount with public subsidy. Understanding how First Homes interact with your overall affordable housing obligation and your GDV assumptions is critical to accurate appraisal modelling.",
        ],
        bullets: [
          "Affordable housing thresholds: typically 10+ units in urban areas, 5+ in rural areas",
          "Policy requirements range from 20-50% of units depending on the LPA",
          "A Financial Viability Assessment (FVA) can reduce requirements below policy if development would be unviable",
          "FVAs must now be publicly disclosed as a condition of planning consent",
          "First Homes must comprise at least 25% of affordable units at a minimum 30% discount",
        ],
      },
      {
        heading: "CIL exemptions and reliefs available to developers",
        paragraphs: [
          "The CIL Regulations provide several important exemptions and reliefs that can materially reduce or eliminate CIL liability. Understanding these reliefs and ensuring you apply for them correctly - and on time - is one of the most straightforward ways to reduce your scheme's statutory costs. CIL reliefs do not apply automatically; they must be claimed using the correct forms before commencement of development. Commencing works before a relief is formally assumed by the LPA results in the relief being permanently lost.",
          "Self-build exemption provides 100% relief from CIL for dwellings that the applicant intends to build or commission for use as their principal private residence. The self-build exemption is available to individuals building or commissioning single homes, and also applies to custom-build projects where individual buyers commission their own plot within a larger scheme. The exemption must be claimed before commencement and the dwelling must be occupied as a principal private residence for at least three years following completion. If the conditions are not met, the CIL liability becomes payable in full.",
          "Social housing relief provides 100% CIL relief for dwellings that meet the definition of social housing in the CIL Regulations - broadly, units provided by a registered provider under a social rent, affordable rent, or shared ownership model. Units qualifying for social housing relief must be identified in the planning consent and transferred to a registered provider (housing association) before CIL becomes payable. This relief is central to the economics of schemes with significant affordable housing components and must be carefully managed through the planning consent and S106 agreement.",
          "Charitable relief provides full CIL relief for development used wholly for charitable purposes by a charity. This applies to new buildings for religious use, community facilities, and housing provided by charitable organisations. Mandatory charitable relief also extends to buildings used by disabled people's organisations and amateur sports clubs registered with HMRC. In-kind infrastructure payments - where a developer provides infrastructure on behalf of the LPA in lieu of a CIL payment - are also deductible from CIL liability under certain LPA policies, making it worth exploring with the authority whether there are infrastructure projects in the area that might support this arrangement.",
        ],
        bullets: [
          "Self-build exemption: 100% relief for dwellings built or commissioned as principal private residences",
          "Social housing relief: 100% relief for units transferred to registered providers under qualifying tenures",
          "Charitable relief: 100% relief for development used wholly or mainly for charitable purposes",
          "All reliefs must be formally claimed before commencement - they are never granted automatically",
          "In-kind infrastructure delivery may be deductible from CIL under some LPA policies",
        ],
      },
    ],
  },
};
