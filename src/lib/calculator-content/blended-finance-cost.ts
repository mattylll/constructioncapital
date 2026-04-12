import type { CalculatorContent } from "./types";

export const content: CalculatorContent = {
  howItWorks: {
    title: "How the Blended Finance Cost Calculator Works",
    paragraphs: [
      "When you fund a development with multiple debt tranches - a senior loan at one rate and mezzanine at another - the overall cost of your borrowing is neither rate in isolation. The blended cost is a weighted average that reflects how much of your total debt sits in each tranche. This calculator computes that blended rate and shows the total interest burden across the full loan term.",
      "Enter the size and annual interest rate for each tranche: typically a senior development loan (drawn progressively over the build period) and one or two subordinated facilities. The calculator weights each rate by its proportion of total debt drawn and produces a single blended cost of capital figure - the equivalent rate you would need on a single-tranche loan to replicate the same total interest spend.",
      "Because development loans draw down progressively rather than as a lump sum, the calculator models interest on average drawn balances rather than peak debt. Senior debt is usually drawn monthly in line with a drawdown schedule; mezzanine may be drawn in one or two tranches. Specifying your drawdown profile improves the accuracy of the blended cost calculation.",
      "The output is most useful when comparing capital stack options: for example, stretch senior at 9% versus conventional senior at 6.5% plus mezzanine at 12%. The blended cost tells you which combination is cheaper in cash terms, and the total interest figure shows the absolute difference so you can weigh it against the equity freed up by each structure.",
    ],
  },
  guide: {
    title: "Optimising the Capital Stack: Blended Finance Cost Explained",
    sections: [
      {
        heading: "Why Blended Cost Matters More Than Any Single Rate",
        paragraphs: [
          "Property developers routinely focus on the senior loan rate - partly because it is the largest facility and partly because it is the most prominently quoted figure in term sheets. But the senior rate alone does not tell you what your development finance actually costs. A senior loan at 7% with £500,000 of mezzanine at 13% has a very different blended cost from a stretch senior at 9% with no mezzanine at all.",
          "The blended cost is the single number that lets you compare these structures on a like-for-like basis. It normalises for tranche size so that you can answer the core question: if I took all my debt in one pot, what interest rate would replicate my actual interest spend? Once you have that number, you can compare it directly against alternatives - and against your projected profit margin to assess whether the deal stacks.",
          "Blended cost also feeds into your equity return calculation. A lower blended cost means more profit retained after debt service, which increases return on equity for the same project. This makes it a central input in appraisal models and in conversations with JV partners or investors who are assessing whether your capital stack is efficiently structured.",
        ],
        bullets: [
          "Single metric for comparing capital stacks with different tranche structures",
          "Enables direct comparison: stretch senior vs senior + mezz vs JV equity",
          "Feeds directly into profit on cost and return on equity calculations",
          "Useful in lender conversations to demonstrate you understand your financing costs",
        ],
      },
      {
        heading: "How Each Tranche Impacts Your Overall Cost",
        paragraphs: [
          "The weight each tranche carries in the blended rate depends on its proportion of total debt. On a deal with £2m of senior debt at 7% and £500,000 of mezzanine at 12%, the senior represents 80% of total debt and the mezzanine 20%. The blended rate is (0.80 × 7%) + (0.20 × 12%) = 5.6% + 2.4% = 8%. That 8% is the number you use to compare this structure against alternatives.",
          "Where mezzanine has the greatest impact on blended cost is when it represents a larger share of total debt. On a deal with £1.5m senior and £750,000 mezzanine (a 67:33 split), the blended rate at the same respective rates rises to (0.67 × 7%) + (0.33 × 12%) = 4.69% + 3.96% = 8.65%. A higher mezzanine proportion lifts the blended cost disproportionately because the weight on the expensive tranche has grown.",
          "Fees compound this effect. Arrangement fees of 1.5–2% on the mezzanine facility, expressed as an effective annual rate across a 12-month term, add 1.5–2 percentage points to the effective mezzanine cost. Factoring these into the blended cost calculation gives a more honest all-in figure, and is the approach sophisticated appraisals and lender credit models use.",
        ],
      },
      {
        heading: "Optimising the Capital Stack: When to Choose Each Structure",
        paragraphs: [
          "There is no universally correct capital stack structure - the optimal choice depends on your project's margin, timeline, equity position, and risk appetite. However, several decision rules apply in most scenarios.",
          "When your senior lender offers a stretched senior facility at up to 75–80% LTC at a rate below 9.5%, this is almost always preferable to a conventional senior plus mezzanine structure. You avoid the complexity of two lenders, the intercreditor negotiation, the additional set of arrangement fees, and the risk of the mezz lender disagreeing with the senior on credit events. The convenience premium of a single lender is usually worth 0.5–1% on the blended rate.",
          "Conventional senior plus mezzanine becomes more attractive when: you can source senior debt at a very competitive rate from a bank or institutional lender (sub-6%), the project has a long track record that attracts institutional mezz pricing (sub-11%), and the equity freed up by the mezzanine can be deployed on a second scheme that would otherwise sit idle. The freed equity effectively earns a second return, which can outweigh the higher blended cost.",
        ],
        bullets: [
          "Stretch senior at sub-9.5%: usually beats senior + mezz for simplicity and cost",
          "Senior + mezz: optimal when senior rate is very low and equity can be recycled",
          "Minimise mezzanine proportion to reduce blended cost impact",
          "Factor all fees into blended cost - arrangement fees move the number materially",
          "Model best case, base case, and downside to test whether blended cost is still manageable",
        ],
      },
      {
        heading: "Worked Examples: Comparing Capital Stack Scenarios",
        paragraphs: [
          "Consider a development with £3m of total costs and a £4.5m GDV, generating a pre-finance profit of £1.5m. The developer has £450,000 of equity available and is choosing between three capital stack options.",
          "Option A is stretch senior at 8.5% on £2.7m (90% LTC), with £300,000 equity. Rolled interest over 18 months on the full drawn balance costs approximately £344,000. Net profit after financing: £1.156m. Return on equity: 257%.",
          "Option B is conventional senior at 6.5% on £1.95m (65% LTC) plus mezzanine at 12% on £600,000, with £450,000 equity. Senior interest: £190,000. Mezz interest plus fees (13.5% effective): £121,000. Total financing cost: £311,000. Net profit: £1.189m. Return on equity: 164%.",
          "Option A has higher interest costs but requires less equity, producing a significantly better ROE despite the higher blended rate of 8.5% versus Option B's blended 7.9%. This illustrates the core tension: optimising blended cost does not always optimise return on equity. The right metric depends on whether your constraint is the equity available or the willingness to pay a higher rate.",
        ],
      },
    ],
  },
};
