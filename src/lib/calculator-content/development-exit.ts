import type { CalculatorContent } from "./types";

export const content: CalculatorContent = {
  howItWorks: {
    title: "How development exit finance works",
    paragraphs: [
      "Development exit finance is a specialist bridging product designed to refinance a development or construction loan once the main build is complete - or substantially complete - and sales are underway. Rather than remaining on a senior development facility while individual units sell through, the developer takes out a development exit loan that costs less, releases equity, and removes the time pressure of a draw-down facility with a hard expiry date.",
      "Development finance is expensive. Senior debt typically costs 5–8% per annum plus fees, and most development facilities include profit erosion clauses or require regular financial reporting that creates administrative burden. Once a building is finished and units are being shown to buyers, the risk profile of the project has fallen dramatically - the development risk is gone. Development exit lenders price for this reduced risk, typically charging 0.5–0.8% per month on facilities of up to 75% of the current market value of the remaining stock.",
      "The mechanics are straightforward: the development exit lender values the completed units, agrees a facility based on a percentage of that value, and uses the proceeds to redeem the existing development loan. As individual units sell, the proceeds reduce the outstanding balance through partial releases. Lenders price partial releases into the facility at the outset, specifying a minimum release percentage per unit sold - typically 105–115% of the pro-rata loan allocation for that unit.",
      "Use the calculator to model the cost of a development exit facility against the alternative of remaining on your existing development finance, and to estimate how long the facility needs to run to allow your sales programme to complete.",
    ],
  },
  guide: {
    title: "Development exit finance: releasing capital and reducing costs on completed schemes",
    sections: [
      {
        heading: "When to use development exit finance",
        paragraphs: [
          "The clearest signal that development exit finance is worth considering is when your development loan is approaching its expiry date but your sales programme is running behind schedule. Extending a development facility is expensive - lenders typically charge extension fees of 0.5–1% per month of extension, and the existing rate often steps up after the original term. A development exit refinance restarts the clock on a lower rate, buying the time needed to achieve the best achievable sales prices without being forced to accept reduced offers.",
          "A second and increasingly common use case is releasing equity to fund the next project. Experienced developers rarely wait for all units on a completed scheme to sell before deploying capital into their next site. Development exit finance allows a developer to extract a material portion of their profit - or their equity contribution to the completed scheme - as soon as the build is finished, recycling that capital into the deposit and costs for the next acquisition while the sales programme on the completed scheme continues.",
          "Development exit is also used where a developer's relationship with their senior funder has deteriorated, where the original lender has been acquired or changed its appetite for the sector, or simply where a cleaner loan structure with a single funder suits the developer's preferences during the sales period. The product is flexible enough to accommodate all of these scenarios.",
        ],
        bullets: [
          "Sales programme running slower than the development loan term allows",
          "Existing development facility approaching expiry - avoid forced extension on unfavourable terms",
          "Releasing equity to fund the next acquisition while sales continue",
          "Reducing monthly interest cost once construction risk has been removed",
          "Consolidating onto a simpler loan structure for the sales period",
        ],
      },
      {
        heading: "Typical terms: LTV, pricing, and loan duration",
        paragraphs: [
          "Development exit lenders typically advance up to 75% of the open market value of the completed units, assessed on a 'portfolio' basis - the value of the units on an individual sale basis rather than a portfolio or bulk discount. This 75% LTV figure is relatively consistent across the market, though lenders with strong appetite for the sector will occasionally stretch to 80% for high-quality schemes in strong locations.",
          "Rates range from approximately 0.5% to 0.85% per month, with the lower end accessible to well-located completed residential schemes with strong sales evidence and an experienced developer borrower. Commercial or mixed-use schemes, developments in weaker markets, or borrowers with a less established track record will price towards the higher end. Arrangement fees are typically 1–2% of the facility.",
          "Loan terms are usually set between 12 and 24 months, with 18 months the most common structure. The term is designed to accommodate the developer's sales programme with a meaningful buffer - a 30-unit scheme selling at two to three units per month would typically require 12–18 months to sell through, so a 24-month facility provides adequate headroom. Lenders will want to see a realistic sales programme supported by comparable evidence and, where available, a sales agent's assessment of achievable rates and timescales.",
        ],
        bullets: [
          "Maximum LTV: typically 75% of open market value of completed units",
          "Monthly rates: 0.5–0.85% depending on scheme quality and borrower profile",
          "Arrangement fee: 1–2% of facility",
          "Loan terms: 12–24 months, with 18 months most common",
          "Partial release premium: typically 105–115% of pro-rata loan allocation per unit sold",
        ],
      },
      {
        heading: "What lenders need to see: underwriting a development exit application",
        paragraphs: [
          "Unlike a development finance application - which is primarily forward-looking, assessed on projected GDV and build costs - a development exit application is backward-looking and relatively straightforward to underwrite. The completed building exists, the risk is residual sales risk rather than construction risk, and the lender's main concern is whether the units will sell at prices sufficient to repay the loan.",
          "Lenders will require a current RICS valuation of the completed scheme on an individual unit basis. They will want to see the existing development loan statement confirming the redemption figure. A sales report from the appointed sales agent - showing units sold, units reserved, units available, and achieved and asking prices - is essential. Where sales have been slow, the developer should be prepared to explain the reasons and demonstrate that pricing or marketing adjustments have been made.",
          "The developer's own financial position matters less in this product than in development finance, because the security is a completed asset rather than a site with construction risk. However, lenders will still run credit checks and will want to confirm the borrower's track record of delivering comparable schemes on time and within budget.",
        ],
        bullets: [
          "Current RICS valuation of completed units on an individual sale basis",
          "Development loan redemption statement confirming the balance to be refinanced",
          "Sales agent's report showing units sold, reserved, and available with achieved prices",
          "Planning permission and building regulations sign-off for the completed scheme",
          "Evidence of the developer's track record on comparable previous schemes",
        ],
      },
      {
        heading: "Partial releases as units sell: how the loan reduces",
        paragraphs: [
          "Unlike a standard bridging loan that is redeemed in a single lump sum at the end of the term, a development exit facility is structured to reduce progressively as individual units complete their sales. Each time a unit sells, the buyer's solicitor pays the purchase price to the developer's solicitor, who in turn pays the lender's release figure before remitting the balance to the developer.",
          "The release figure per unit is agreed at the outset in the facility agreement. It is expressed as a percentage of the individual unit's allocated loan - typically 105–115%. So if a unit has been allocated a loan of £200,000 against a sale price of £350,000, the lender might require a release payment of £220,000 (110%) to discharge that unit from the charge. The remaining £130,000 of sale proceeds flows to the developer.",
          "This structure means the developer receives a growing stream of cash as each unit sells, while the lender's outstanding loan balance reduces proportionally. The facility is fully redeemed when the final unit sells and the last release payment is made. Developers should model the cash flow implications of the release premium carefully - on a tight scheme, a 115% release requirement can meaningfully delay the point at which the developer begins receiving meaningful net proceeds.",
        ],
      },
    ],
  },
};
