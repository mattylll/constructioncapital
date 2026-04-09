import type { CalculatorContent } from "./types";

export const content: CalculatorContent = {
  howItWorks: {
    title: "How the development appraisal calculator works",
    paragraphs: [
      "This calculator performs a residual development appraisal — the fundamental analytical method used by UK property developers, lenders, and valuers to assess the viability of any scheme. You enter your anticipated Gross Development Value (GDV), your build costs, professional fees, finance costs, agents' and legal fees on sale, and your required profit margin. The calculator works backwards from these inputs to produce the residual land value: the maximum amount you can afford to pay for the site while still achieving your target return.",
      "The residual method is the established standard in the UK development finance industry, underpinning RICS Red Book valuations, planning viability assessments under the NPPF, and every lender's underwriting process. The logic is straightforward: GDV minus all costs (build, fees, finance, profit) equals residual land value. If a site is being marketed at a price above the residual value your appraisal generates, the deal does not work at your target margin. If it is priced below, there may be an opportunity — or there are assumptions in your appraisal that the market has not priced correctly.",
      "The calculator also produces the two profit metrics that development finance lenders require: profit on cost (your net profit divided by total development costs including land) and profit on GDV (your net profit divided by GDV). It cross-checks these against typical lender minimums and flags whether your appraisal is likely to clear a lender's credit thresholds at the current set of assumptions. This helps you identify at the earliest stage whether the scheme is bankable in its current form or whether you need to adjust your assumptions, your land offer, or your specification.",
      "Use the sensitivity controls to stress-test your appraisal across a range of GDV and cost scenarios. A viable scheme should show positive profit margins under all reasonable stress scenarios, not just in the optimistic base case. Submit your appraisal to Construction Capital through our Deal Room for a full review, market-informed benchmarking, and an indication of the finance terms your scheme is likely to attract.",
    ],
  },
  guide: {
    title: "The development appraisal: a step-by-step guide for UK property developers",
    sections: [
      {
        heading: "The appraisal process step by step",
        paragraphs: [
          "A development appraisal is built from the top down, starting with GDV and working backwards to land value, or from the bottom up, starting with land cost and working forwards to profit. Both directions are useful and experienced developers run both to check their assumptions are internally consistent. The top-down approach answers the question: what can I afford to pay for this site? The bottom-up approach answers: given what I have paid (or am being asked to pay), does this deal work?",
          "Step one is establishing GDV. For a residential scheme, GDV is the aggregate of all anticipated sales proceeds from individual units. Each unit type — studio, one-bed, two-bed, three-bed — should be valued separately using comparable sales evidence from the same postcode or comparable area, adjusted for floor level, aspect, and finish quality. For commercial schemes, GDV is typically derived from a yield capitalisation: estimated annual rental income divided by an appropriate yield. For mixed-use schemes, both approaches are applied to the relevant portions of the scheme and summed.",
          "Step two is establishing all development costs. These fall into four categories: land costs (purchase price, SDLT, legal fees), build costs (construction contract, external works), professional fees (architect, structural engineer, QS, project manager, planning fees, Building Regulations, warranties), and finance costs (arrangement fees, interest rolled up on drawdowns, monitoring surveyor fees, exit fees). Each category must be modelled carefully. Build costs should be benchmarked against BCIS data for the scheme type and region. Finance costs should be modelled as a rolled-up interest calculation based on a realistic drawdown schedule, not as a flat percentage of the total facility.",
          "Step three is applying your required profit. This is a decision, not a calculation, and it should reflect the risk profile of the specific scheme. A straightforward residential scheme in a liquid sales market with full planning consent and an established contractor might justify a 20% profit on cost target. A complex mixed-use scheme with a novel planning consent in a secondary location with untested GDV assumptions warrants 25% to 30% on cost. Your profit target is the return you require to justify the risks you are taking — set it before you start the appraisal, not after you have seen what the numbers allow.",
        ],
        bullets: [
          "GDV: sum of all unit sales values (residential) or yield capitalisation (commercial)",
          "Build costs: benchmark against BCIS, verified by a Quantity Surveyor",
          "Professional fees: typically 8-12% of build costs for a standard residential scheme",
          "Finance costs: model as rolled-up interest on a drawdown schedule, not a flat percentage",
          "Profit target: set before running the appraisal based on scheme risk, not after seeing the result",
        ],
      },
      {
        heading: "Key assumptions that lenders scrutinise",
        paragraphs: [
          "Development finance lenders do not simply accept the numbers in a developer's appraisal at face value. Their underwriting team, and the RICS-registered valuer they appoint, will challenge every significant assumption. Understanding which assumptions receive the most scrutiny — and preparing robust evidence to support them — is one of the most important preparation steps before approaching a lender.",
          "GDV is the assumption under most scrutiny. Lenders want to see comparable sales evidence from within the last 12 months, from the same or an immediately adjacent postcode, for units of a similar size and finish level to those being developed. Comparables from a different town, even a nearby one, or from an estate with a materially different profile, will be discounted by the valuer. The lender's valuer will typically discount the developer's headline GDV by 5% to 15% in their own assessment if the comparables are thin or if the market has softened since the original GDV assessment was made. This lender-assessed GDV, rather than your own, is the figure used to calculate maximum loan amounts.",
          "Build costs are verified against BCIS benchmarks and, on larger facilities, by the monitoring surveyor's initial report before completion. A cost plan prepared by an independent RICS-accredited QS carries significantly more weight with a lender than one prepared by a contractor or by the developer themselves. Lenders are alert to cost plans that are light on contingency, that omit standard elements (external works, utility connections, Building Regulations fees), or that apply rates materially below current BCIS median levels for the region and scheme type. If your cost plan is challenged at underwriting stage, be prepared to justify it with written contractor indicative prices or QS commentary.",
          "Programme is a less visible but equally important assumption. The loan term you request must be evidenced by a realistic construction programme and sales forecast. A lender will ask: how long has your contractor said the works will take? What is your anticipated marketing and sales period? Do these timelines, added together with a reasonable contingency for overruns, fit within the requested loan term? An application requesting an 18-month facility on a scheme the QS believes will take 22 months to build and sell will either be declined or restructured with conditions that protect the lender against the likely overrun.",
        ],
        bullets: [
          "GDV: supported by comparable sales evidence from the same postcode within the last 12 months",
          "Build costs: RICS QS-verified cost plan with BCIS-benchmarked rates and 10% contingency",
          "Programme: supported by a contractor's indicative programme and a realistic sales forecast",
          "Finance costs: modelled on a drawdown schedule with a buffer for programme delay",
          "Professional team: lenders prefer named, accredited professionals over TBD appointments",
        ],
      },
      {
        heading: "Sensitivity tables and the maximum land bid",
        paragraphs: [
          "A sensitivity table is a grid showing how your key output — typically profit on GDV or residual land value — changes as two input assumptions vary simultaneously. The most commonly used sensitivity table in development appraisal plots GDV (on one axis) against build cost (on the other axis), with profit on GDV shown in each cell of the grid. A well-constructed table typically spans GDV from -15% to +10% of the base case and build costs from -5% to +20%, capturing both pessimistic and optimistic scenarios.",
          "Reading a sensitivity table correctly is as important as constructing one. The base case cell is not the most important cell in the table — the cells representing realistic downside scenarios are. If your scheme shows 22% profit on GDV in the base case but 5% profit on GDV under a -10% GDV / +10% cost scenario, the table is telling you that the scheme has very limited headroom. A construction programme delay, a weakening in local house prices, or a contractor insolvency requiring remobilisation could all push you into the loss-making quadrant of the table. A scheme that only works in the best-case scenario is not a fundable scheme.",
          "The residual land value calculation gives you your maximum land bid — the price at which you can acquire the site and still achieve your minimum required profit margin. This is a more disciplined and analytically correct basis for making land offers than simply deciding what you are willing to pay based on intuition. Run the residual calculation at your base-case assumptions to get your maximum bid, then run it again at a moderate downside scenario (-5% GDV, +5% cost) to find your conservative maximum. Your actual bid should sit between these two figures, reflecting how confident you are in your base-case assumptions.",
          "A common error is treating the maximum land bid as the land offer price. The maximum bid is the absolute ceiling — the price at which the deal delivers exactly your minimum required return with no headroom for error. In practice, you should offer meaningfully below this ceiling to preserve optionality. If unexpected costs arise during due diligence — a contamination survey reveals remediation costs, or a drainage investigation reveals a requirement for attenuation — you need room to absorb those costs without the deal collapsing. Experienced developers typically build 10% to 15% of headroom below the theoretical maximum bid into their initial offer.",
        ],
        bullets: [
          "Run sensitivity tables across GDV -15% to +10% and build costs -5% to +20%",
          "Focus on realistic downside cells, not the base-case cell",
          "Maximum land bid = GDV minus all costs and minimum required profit",
          "Offer below the maximum bid to preserve headroom for due diligence surprises",
          "A scheme viable only under optimistic assumptions will not attract development finance",
        ],
      },
      {
        heading: "IRR versus profit on cost: which metric matters more?",
        paragraphs: [
          "Development appraisals in the UK typically focus on profit on cost and profit on GDV as the primary return metrics. These are absolute return measures: they tell you the total profit as a proportion of what was spent or what was sold. They are intuitive, easy to communicate, and directly comparable to lender minimum thresholds. However, they ignore the time dimension of a project — a 20% profit on cost generated in 12 months is a fundamentally different investment from a 20% profit on cost generated over 36 months, but both look identical in a standard development appraisal.",
          "Internal Rate of Return (IRR) addresses this shortcoming by expressing the return as an annualised percentage that accounts for the timing of all cash flows — equity invested, costs drawn down, and proceeds received. A 20% profit on cost over 12 months equates to an IRR of approximately 18% to 20%. The same 20% profit on cost over 36 months equates to an IRR of only 6% to 7%. IRR is therefore a more complete measure of the true return to equity, and it is the metric most commonly used in equity joint venture negotiations and by institutional development lenders assessing their risk-adjusted return.",
          "For the majority of residential developers in the UK working on 12 to 24-month schemes, profit on cost remains the more useful metric in day-to-day appraisal. It is the figure your lender and their underwriters will focus on, it is directly comparable across deals regardless of size, and it translates immediately into a go/no-go decision based on market-standard thresholds. IRR becomes more important when comparing projects of materially different durations — choosing between a 12-month and a 30-month scheme — or when assessing the equity returns in a leveraged structure where the timing of drawdowns and repayment creates complex cash flows.",
          "When presenting a development appraisal to a lender or investor, it is good practice to include both metrics alongside the sensitivity table. Profit on cost demonstrates absolute margin adequacy. IRR demonstrates the efficiency of equity deployment. Together they give a complete picture of how the project works financially. Construction Capital regularly prepares investment memoranda for clients that present both metrics in a format familiar to institutional investors and lenders, which can materially improve the quality and speed of credit decisions on your application.",
        ],
        bullets: [
          "Profit on cost: total return as a percentage of total expenditure — the standard lender metric",
          "Profit on GDV: total return as a percentage of sales revenue — directly comparable to lender minimums",
          "IRR: annualised return to equity, accounting for timing of all cash flows",
          "IRR is critical for comparing projects of different durations or for equity JV negotiations",
          "Present profit on cost, profit on GDV, and IRR together for a complete return picture",
        ],
      },
    ],
  },
};
