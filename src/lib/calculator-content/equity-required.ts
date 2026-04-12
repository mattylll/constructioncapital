import type { CalculatorContent } from "./types";

export const content: CalculatorContent = {
  howItWorks: {
    title: "How the Equity Required Calculator Works",
    paragraphs: [
      "This calculator works out how much equity you need to put into a development project, based on the gap between your total development costs and the finance you can raise. Equity is the residual funding after all debt - senior loan, mezzanine, and any other structured finance - has been applied against total project costs.",
      "Enter your GDV, total development costs (including land, build, finance, and professional fees), your expected senior loan-to-cost ratio, and whether you plan to use mezzanine finance. The calculator then derives the debt available and subtracts it from total costs to produce your required equity contribution, expressed both in pounds and as a percentage of costs.",
      "It also models the return on equity (ROE) - the ratio of net profit to equity deployed - which is the most important metric for a developer assessing whether the capital tied up in a project justifies the risk and opportunity cost. A deal requiring 35% equity with a 25% profit on cost produces a very different ROE from the same scheme funded with 15% equity via mezzanine.",
      "Remember that equity is broader than cash. Land you already own, equity in other properties you can cross-charge, and deferred consideration to a vendor all count as equity contributions in the eyes of most lenders. The calculator lets you specify your equity source so you can model different scenarios accurately.",
    ],
  },
  guide: {
    title: "Understanding Equity Requirements in Property Development",
    sections: [
      {
        heading: "With and Without Mezzanine: How the Numbers Change",
        paragraphs: [
          "The equity requirement on any development project is largely driven by how much debt you can access. To illustrate the difference mezzanine makes, consider a scheme with a £4m GDV and £2.8m of total development costs, giving a profit of £1.2m before financing - a healthy 43% margin on cost.",
          "Without mezzanine, a senior lender advancing 65% of GDV provides £2.6m, leaving an equity gap of £200,000. That sounds manageable, but in practice the senior lender may cap advances at 85% of day-one land value or require a contingency buffer, pushing the equity need closer to £400,000–£500,000 in practice.",
          "Layer mezzanine on top to 80% of GDV and the combined debt rises to £3.2m - reducing the equity requirement to around £280,000 before fees, or roughly 10% of costs. After both sets of arrangement fees and rolled interest, the net profit falls, but the ROE rises substantially because you have deployed far less of your own capital. This is the mathematical engine behind multi-site development strategies.",
        ],
        bullets: [
          "No mezz - senior at 65% GDV: equity typically 25–35% of costs",
          "With mezz to 80% GDV: equity falls to 10–15% of costs",
          "With mezz to 85% GDV: equity can fall to 5–10% of costs on strong schemes",
          "ROE improves as equity reduces - but so does your margin for error",
        ],
      },
      {
        heading: "Minimum Equity Thresholds: Lender Requirements",
        paragraphs: [
          "The phrase 'skin in the game' appears in almost every lender's credit policy. Lenders want to know that the developer has meaningful capital at risk, because developers with little equity have less to lose if a project fails. Most mainstream development finance lenders require a minimum equity contribution of 10% of total development costs - some set the bar at 15–20% for less experienced applicants.",
          "The definition of equity matters enormously. Land value is usually accepted as equity, particularly where you have owned the site for some time and values have risen. If you purchased land for £500,000 and its current vacant possession value is £750,000, most lenders will credit the £750,000 as equity - effectively allowing you to put in no additional cash if your borrowing covers the remaining costs.",
          "Joint venture equity from a funding partner is also accepted, provided the JV agreement is structured correctly. The lender will want to see that the equity is genuinely committed - typically evidenced by funds in a solicitor's client account or a completed equity subscription - before they release the first drawdown of the senior facility.",
        ],
        bullets: [
          "Minimum cash equity: typically 10% of total development costs",
          "Land value counts: use RICS vacant possession valuation as evidence",
          "Cross-charges: equity in other unencumbered assets can support the facility",
          "Deferred vendor consideration: may be treated as equity if documented correctly",
          "JV partner equity: accepted if committed and evidenced before first drawdown",
        ],
      },
      {
        heading: "Sources of Equity: How Developers Fund Their Contribution",
        paragraphs: [
          "Cash from retained profits or personal savings is the simplest form of equity, but it is rarely the only option. Experienced developers assemble their equity from multiple sources, combining cash with land value, cross-charges, and deferred consideration to minimise the amount of liquid capital they need.",
          "Cross-charging means granting a charge over another property you own - typically a free-and-clear investment property or a previous development site with residual equity - to supplement the equity in the new project. The lender will commission a valuation of the cross-charged asset and advance against a proportion of its equity. This approach allows you to fund new schemes without selling existing ones.",
          "Vendor finance is worth exploring on land purchases. Some landowners will accept a deferred completion or a staged land payment, effectively lending you part of the purchase price. Structured as a deferred consideration, this can count as equity in the eyes of your development finance lender, reducing the cash you need to find at day one.",
          "Private investors and family offices will often provide equity or quasi-equity in exchange for a preferred return or a share of profits. This is the closest alternative to mezzanine for smaller schemes where formal mezzanine products are not available. The key distinction is that equity investors share in both the upside and the downside, whereas a mezzanine lender is purely a creditor.",
        ],
      },
      {
        heading: "How to Reduce Your Equity Contribution",
        paragraphs: [
          "Reducing equity is a legitimate goal for any developer seeking to maximise return on capital. The primary lever is increasing leverage through either stretched senior or mezzanine finance. However, higher leverage increases interest costs, narrows the margin, and leaves less room for cost overruns - so equity reduction must be balanced against risk management.",
          "Presales are one of the most effective tools for reducing effective equity risk. If you can secure exchange of contracts on 30–40% of units before you start on site, some lenders will treat presale income as quasi-equity, improving your funding structure and reducing your reliance on mezzanine. It also demonstrates market demand, which gives lenders comfort.",
          "Planning gain is another route. Securing planning permission on a site you already own, or on a site purchased with planning potential, can dramatically uplift the land value - and therefore the equity credited to your scheme - without deploying additional cash. This is why developers who source well and obtain planning permission add so much more value than those who simply buy consented plots.",
        ],
        bullets: [
          "Use mezzanine to fill the gap between senior debt and equity",
          "Explore stretch senior loans (up to 75–80% LTC) to avoid a second lender",
          "Secure presales early to reduce risk exposure and improve lender appetite",
          "Negotiate deferred land payments to reduce day-one equity requirement",
          "Maximise land value by securing or improving planning before drawing finance",
        ],
      },
    ],
  },
};
