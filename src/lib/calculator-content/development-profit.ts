import type { CalculatorContent } from "./types";

export const content: CalculatorContent = {
  howItWorks: {
    title: "How the development profit calculator works",
    paragraphs: [
      "This calculator computes the two profit metrics that UK development finance lenders use to assess every application: profit on cost and profit on GDV. Enter your Gross Development Value (the total revenue from selling or letting all units), your total development costs (land, build, fees, and finance), and any affordable housing obligations. The calculator returns your gross profit in pounds, profit as a percentage of total cost, and profit as a percentage of GDV.",
      "Profit on cost and profit on GDV are related but meaningfully different measurements. Profit on cost expresses your return relative to what you spent: a £200,000 profit on £1 million of total costs is a 20% profit on cost. Profit on GDV expresses your margin relative to your sales revenue: the same £200,000 profit on a £1.2 million GDV is a 16.7% profit on GDV. Lenders universally quote their minimum profit requirements in terms of profit on GDV, so understanding both metrics and how they relate is essential for reading a lender's credit criteria correctly.",
      "The calculator also models the sensitivity of your profit margin to changes in GDV and build costs. A 5% shortfall in GDV and a 5% cost overrun occurring simultaneously — a realistic stress scenario — can eliminate 30% to 50% of projected profit on a typical residential scheme. Understanding this sensitivity before you commit to a site is the most important financial discipline a developer can develop, and it is one that all experienced lenders will scrutinise carefully before approving a facility.",
      "These figures are indicative starting points for your feasibility analysis. Actual achievable GDV should be based on formal Red Book valuations or comparable sales evidence, and cost plans should be verified by an independent Quantity Surveyor before you commit to purchasing land or submitting a planning application.",
    ],
  },
  guide: {
    title: "Developer profit: what margins lenders expect and how to protect them",
    sections: [
      {
        heading: "What profit margins do development finance lenders require?",
        paragraphs: [
          "Every development finance lender in the UK has a minimum profit threshold that your appraisal must demonstrate before they will consider lending. This threshold exists because lenders use profit as a proxy for the cushion of value that protects their loan in the event that sales are slower than anticipated or build costs overrun. The standard minimum across the market is 20% profit on cost, which equates to approximately 17% profit on GDV on a typical residential development. Some lenders express their minimum solely as a GDV percentage, typically 15% to 20% profit on GDV.",
          "The 20% on cost figure is not arbitrary. It reflects the finding, borne out repeatedly by UK development finance experience, that a combination of a 10% cost overrun and a 10% shortfall in GDV — both plausible in isolation and potentially correlated in a weakening market — would reduce a 20% margin to approximately 1% to 2% on cost, leaving the loan essentially fully covered by the residual asset value. A developer starting with only 12% profit on cost exposed to the same scenario would end up with a loss, potentially crystallising a shortfall against the lender's security.",
          "Minimum profit thresholds also vary by scheme type and lender risk appetite. Commercial developments, mixed-use schemes with complex planning conditions, and sites in secondary locations typically face higher minimum profit requirements — often 25% on cost or more — because the GDV evidence is less reliable and the exit (finding a buyer or tenant) is less certain. Purpose-built student accommodation, co-living, and build-to-rent schemes are assessed differently again, often using yield-based GDV calculations derived from comparable rental evidence rather than comparable sales.",
          "It is important to understand that a lender's minimum profit threshold is a gate, not a target. Passing the minimum does not mean a lender will be enthusiastic about your deal. Lenders compete for the most attractive schemes — those with strong margins, experienced borrowers, and robust GDV evidence — and they reserve their best rates and highest leverage for these applications. A scheme showing 25% profit on cost from an experienced developer in a liquid sales market will attract better terms than one showing 21% from a first-time developer in a thin market, even though both technically clear the minimum.",
        ],
        bullets: [
          "Industry standard minimum: 20% profit on total development cost",
          "Equivalent to approximately 15-17% profit on GDV at typical development leverage",
          "Commercial and mixed-use schemes typically require 25%+ profit on cost",
          "Higher margins attract better rates and higher LTC from lenders",
          "Minimum thresholds are gates, not targets — aim for meaningful headroom above them",
        ],
      },
      {
        heading: "Sensitivity analysis: stress-testing your profit margin",
        paragraphs: [
          "Sensitivity analysis is the most important analytical discipline in development appraisal and the area where even experienced developers most commonly cut corners. A sensitivity table plots what happens to your profit margin as individual assumptions change — GDV rises or falls, build costs increase or decrease, programme extends — giving you a visual picture of your scheme's robustness. No serious lender will review a development appraisal without requesting sensitivity analysis, and no serious developer should commit to a site without running it.",
          "The standard sensitivity test in UK development finance applies simultaneous stresses to GDV (downward) and costs (upward). A common matrix tests GDV at -5%, -10%, and -15%, against build costs at +5%, +10%, and +15%, creating a 3x3 grid of nine scenarios. On a scheme showing 20% profit on cost in the base case, a combined -10% GDV and +10% cost scenario might reduce profit to approximately 3% to 5% on cost — the project is still marginally profitable but the developer would be in very difficult discussions with their lender. The same scenario on a 15% base case margin would produce a loss.",
          "Finance costs are often treated as fixed in sensitivity analysis, but this is a mistake. If your programme extends by six months due to contractor delays, planning complications, or a slow sales market, your interest roll-up will increase accordingly. On a £2 million development finance facility at 8% per annum, a six-month extension costs approximately £80,000 in additional rolled-up interest. This cost compounds against your profit margin at exactly the moment when everything else in your deal is already under stress. Include programme delay as a separate sensitivity dimension.",
          "Effective sensitivity analysis requires a well-structured appraisal model. We recommend maintaining a single spreadsheet where all key assumptions are clearly labelled as inputs, and all profit figures are formula-driven from those inputs. This allows you to run scenarios quickly and to share your model with lenders, valuers, and advisers who will all want to stress-test different assumptions. Construction Capital can review your appraisal model as part of our deal structuring service and provide market-informed assumptions based on comparable transactions we have arranged.",
        ],
        bullets: [
          "Always run a simultaneous -10% GDV / +10% cost scenario as a minimum stress test",
          "Include programme delay as a sensitivity variable — each additional month adds finance cost",
          "A scheme viable only in the base case is not a bankable scheme",
          "Lenders will run their own sensitivity analysis — better to identify issues yourself first",
          "Maintain a formula-driven model with clearly labelled inputs for easy scenario testing",
        ],
      },
      {
        heading: "How affordable housing obligations affect developer profit",
        paragraphs: [
          "Affordable housing requirements imposed through planning conditions represent one of the most significant and often underestimated threats to developer profit on residential schemes in England. Local planning authorities (LPAs) set affordable housing policies in their Local Plans, typically requiring between 20% and 50% of new units to be provided as affordable housing, either on-site or through a financial contribution to the LPA. In London, the Mayor's Affordable Housing Programme has its own requirements and funding mechanisms that interact with, and sometimes override, borough-level policies.",
          "Affordable units sold to registered providers (housing associations) at discounted values directly reduce GDV. An open-market flat with a GDV of £350,000 sold as affordable housing at 50% of market value (affordable rent or shared ownership) contributes only £175,000 to your GDV. On a 50-unit scheme where 20 units are required as affordable, this can reduce overall GDV by £3.5 million on a scheme that might otherwise generate £17.5 million. This reduction flows directly through to profit — it is not offset by any reduction in build costs, as affordable units cost the same to build as market units.",
          "The viability assessment mechanism under the National Planning Policy Framework (NPPF) allows developers to challenge affordable housing requirements where they can demonstrate, using a scheme-specific development appraisal, that the policy requirement would make the development unviable. To be accepted as unviable, the policy requirement must reduce profit below the minimum necessary to incentivise development — typically defined in England as 17.5% to 20% profit on GDV using the RICS Financial Viability in Planning guidance. RICS-accredited valuers regularly prepare these assessments, and a well-evidenced viability argument can materially reduce your affordable housing obligation.",
          "The interplay between affordable housing, Section 106 obligations, and CIL payments requires careful modelling from the earliest stages of site assessment. We have reviewed schemes where developers bid for land based on policy-level affordable housing percentages only to discover through pre-application discussions that the LPA's preferred tenure mix (e.g., 70% social rent rather than shared ownership) materially increased the discount applied to affordable unit values, reducing GDV and destroying the appraisal. Always establish the LPA's preferred tenure mix before you model affordable housing into your land bid.",
        ],
        bullets: [
          "Affordable housing requirements range from 20% to 50% of units depending on the LPA",
          "Affordable units are typically valued at 50-70% of open-market value, directly reducing GDV",
          "The NPPF viability mechanism allows developers to challenge requirements below 17.5-20% profit on GDV",
          "Tenure mix (social rent vs shared ownership) significantly affects the blended affordable discount",
          "Establish affordable housing expectations before agreeing a land price",
        ],
      },
      {
        heading: "Contingency planning and protecting your margin through the build",
        paragraphs: [
          "A contingency line in your development appraisal is not a sign of weakness or imprecision — it is a sign of professional experience. Lenders and their monitoring surveyors expect to see a contingency of 5% to 10% of construction costs included in every development appraisal they assess. The absence of a contingency, or a figure below 5%, is a red flag that prompts experienced underwriters to question the credibility of the cost plan. For complex schemes, conversions, or any project involving existing structures, 10% is the appropriate minimum.",
          "Contingency serves two distinct functions. The first is absorbing genuine unknowns that arise during construction — ground conditions worse than expected, utility diversions more complex than estimated, or material cost increases between the cost plan date and the time the work is actually procured. The second function is providing a buffer against programme delay. Every week a project overruns is a week of additional finance cost, additional site management overhead, and an additional week before sales proceed and the loan is repaid.",
          "Fixed-price contracts with reputable main contractors offer one of the most effective mechanisms for protecting your margin. A JCT Design and Build contract or a traditional JCT Standard Building Contract with a Schedule of Works transfers construction cost risk to the contractor for works within the agreed scope. The contractor takes on the risk of labour and material price movements, ground condition surprises (within limits agreed in the contract), and weather delays. However, fixed-price contracts are not absolute protection — variations instructed by the developer, employer's risks, and force majeure events remain the developer's liability. Instruct as few variations as possible once the contract is signed.",
          "Sales risk is the other major threat to profit margin and the one most developers focus on least during the appraisal stage. Your GDV is an estimate of what the market will pay for your completed units. It is validated at the point of your lender's valuation, but the market moves during the construction period. Schemes taking 18 to 24 months to build are exposed to meaningful GDV movements. Securing forward sales or exchanges on a proportion of units before or during construction provides both comfort for your lender and direct protection for your margin. Many development finance lenders will improve their terms — offering higher LTC or a reduced rate — if you can demonstrate pre-sales covering 20% to 30% of GDV before the facility completes.",
        ],
        bullets: [
          "Include 5-10% of build costs as contingency in every appraisal — 10% for complex schemes",
          "Fixed-price JCT contracts transfer cost overrun risk to the contractor for in-scope works",
          "Minimise variations after contract execution — each variation erodes your contingency buffer",
          "Pre-sales covering 20-30% of GDV improve lender terms and protect your margin",
          "Model your profit at practical completion AND after your projected sales period to capture holding costs",
        ],
      },
    ],
  },
};
