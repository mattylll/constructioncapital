import type { CalculatorContent } from "./types";

export const content: CalculatorContent = {
  howItWorks: {
    title: "How the Residual Land Value Calculator Works",
    paragraphs: [
      "Residual land value (RLV) is what a developer can afford to pay for a site after all costs and a required profit margin have been deducted from the completed development value. It is calculated by working backwards from GDV: subtract construction costs, professional fees, finance costs, sales and marketing costs, and the developer's required return — and whatever remains is the residual, the maximum price that makes the scheme viable.",
      "This calculator takes your GDV, itemised cost assumptions, finance costs, and target profit margin as inputs and derives the residual land value automatically. You can also work forwards — enter a land price and see the resulting profit — or use the calculator to find the minimum GDV needed to support a given land price at your required margin.",
      "The residual method is sensitive to its inputs, particularly GDV and build cost. A 5% change in GDV on a £5m scheme moves the residual by several hundred thousand pounds. This is why site acquisition decisions should always be tested with sensitivity analysis, not just at a single base-case assumption. The calculator includes a sensitivity matrix showing how the residual changes across a range of GDV and build cost scenarios.",
      "Note that the residual value produced by this calculator is the maximum viability threshold — the price at which the scheme just achieves your target return. In practice, you would bid below this to retain negotiating margin and to create headroom for cost overruns or GDV softening during the development period.",
    ],
  },
  guide: {
    title: "Residual Land Value: The Industry-Standard Method for Valuing Development Sites",
    sections: [
      {
        heading: "The Residual Method Explained",
        paragraphs: [
          "The residual land valuation method is the foundational approach used by developers, land agents, and planning authorities to assess the viability of a development proposal. Its logic is straightforward: the value of a development site is what is left over (the residual) after the costs of development and a reasonable developer's profit are deducted from the value of the completed scheme.",
          "Expressed as a formula: Residual Land Value = GDV − Total Development Costs − Developer's Profit − Purchaser's Costs.",
          "Total development costs include construction costs (build cost per square foot multiplied by floor area), professional fees (architect, engineer, QS — typically 8–12% of build cost), planning and infrastructure costs (Section 106 contributions, Community Infrastructure Levy, utilities connections), finance costs (interest on the development loan, arrangement fees), sales and marketing costs (agent's fees of 1.5–2% of GDV, show home costs, marketing materials), and a contingency (typically 5–10% of construction cost for unforeseen costs).",
          "Developer's profit is usually expressed as a percentage of GDV (return on value, or ROV) or as a percentage of total development costs (return on cost, or ROC). A 20% return on cost is often cited as a minimum viable threshold in mainstream UK development finance; returns below 15% are generally considered insufficient to justify the risk. Institutional developers and housebuilders often work to lower returns because they have lower financing costs and more certainty in their cost base.",
        ],
        bullets: [
          "RLV = GDV minus construction costs minus professional fees minus finance minus profit minus purchaser's costs",
          "Developer's profit target: typically 15–20% on cost, or 12–17% on GDV",
          "Purchaser's costs: SDLT plus legal fees on land purchase (typically 5–7% of land price)",
          "Finance cost: development loan interest rolled up over the build period",
          "Contingency: 5–10% of construction cost for cost overruns",
        ],
      },
      {
        heading: "Why the Residual Method Is the Industry Standard",
        paragraphs: [
          "The residual method is widely used because it aligns the land price directly with the economics of the specific development proposed. Unlike comparative sales evidence — which values a site by reference to what similar sites have sold for — the residual method values a site by reference to what it can produce. This makes it particularly valuable for sites where no direct comparables exist, or where the development scheme differs significantly from what has previously been built in the area.",
          "Planning authorities use the residual method to assess viability in Section 106 negotiations. When a developer argues that a proposed affordable housing requirement makes a scheme unviable, the planning authority will commission its own residual valuation — and the two sides will debate the assumptions, particularly GDV, build cost, and required profit margin. The robustness of these negotiations depends entirely on the quality of the underlying residual analysis.",
          "Lenders use a form of residual analysis in their credit assessments. Development finance lenders will carry out their own residual calculation — using a RICS-approved valuer for GDV and their own assumptions for costs and profit — to determine the minimum viable land value against which they will lend. If the lender's residual is materially lower than the price a developer has paid for a site, this can prevent the deal from proceeding or force the developer to put in more equity.",
          "Estate agents and land agents use residual analysis to advise landowners on the price they can expect to achieve from development-purchasers, and to structure competitive tender processes. Understanding that development bidders are constrained by the residual — not by a simple multiple of comparables — is essential context for any landowner contemplating the sale of a developable site.",
        ],
      },
      {
        heading: "Inputs That Move the Needle: GDV Sensitivity",
        paragraphs: [
          "Of all the inputs into a residual land valuation, GDV has by far the greatest leverage on the outcome. Because land sits at the bottom of the residual stack — absorbing whatever is left after all costs and profit are deducted — a proportionally small change in GDV produces a disproportionately large change in the residual land value.",
          "Consider a scheme with a £5m GDV, £3.5m of development costs (excluding land), and a required profit of 20% on GDV (£1m). The residual is £500,000 before purchaser's costs. If GDV falls 5% to £4.75m, the profit (held at 20% of GDV) falls to £950,000 — but the residual also falls to £300,000, a drop of 40%. The same 5% GDV movement has caused the land value to fall by 40%. This gearing effect is the defining characteristic of the residual method and explains why land values are so volatile in property cycles.",
          "Build cost is the second most sensitive input, though its leverage is lower than GDV because it affects costs rather than value. A 10% increase in build cost on a £2m construction budget reduces the residual by £200,000 — significant, but not as dramatic as the GDV gearing effect. Finance cost is less sensitive in absolute terms but grows in importance as the development period lengthens or interest rates rise.",
        ],
        bullets: [
          "GDV has the highest gearing — small percentage changes move land value significantly",
          "Always run sensitivity analysis at ±5%, ±10%, ±15% on GDV and build cost",
          "Build cost is the second most important lever in the residual",
          "Finance cost becomes more sensitive as loan terms extend or rates rise",
          "Required profit margin assumption is intensely negotiated in planning viability assessments",
        ],
      },
      {
        heading: "How Developers Use RLV to Bid on Sites, and Hope Value vs Overage",
        paragraphs: [
          "Developers use the residual method to set their maximum site acquisition price — the ceiling above which the scheme becomes unviable at the required profit margin. In competitive land markets, particularly for prime urban sites, multiple developers will be bidding simultaneously. The developer with the most efficient cost base, the highest GDV expectations, or the lowest required profit margin can bid highest and still achieve a viable return.",
          "In practice, experienced developers do not bid at the theoretical residual maximum. They reserve headroom — typically 10–15% below the maximum residual — to allow for negotiation, cost overruns, and market softening. Bidding at the maximum residual is a strategy that leaves no room for error and is a hallmark of developers who subsequently run into financial difficulty.",
          "Hope value is the premium above the current use value that a landowner expects from a site based on the reasonable prospect of future planning permission, even if permission has not yet been granted. In land sale negotiations, developers routinely encounter asking prices that include substantial hope value — effectively asking the developer to pay for planning risk that they are taking on themselves. The HMLR-published planning application data and the local planning authority's housing need assessment are important context for assessing whether hope value is justified.",
          "Overage clauses — also known as clawback agreements — allow landowners to participate in future value increases if the site is developed more intensively than the original sale assumed, or if planning permission is obtained for a more valuable use. A typical overage provides for the landowner to receive 25–35% of any additional profit above a threshold trigger for a period of 20–25 years. Overage is increasingly common on greenfield and edge-of-settlement sites where the planning position may improve after initial sale. Developers should model the cost of any overage obligation carefully — it is effectively a contingent liability that reduces future profit on enhanced schemes.",
        ],
        bullets: [
          "Bid 10–15% below the maximum residual to preserve a safety margin",
          "Hope value should only be paid where planning potential is objectively supported",
          "Overage clauses: expect 25–35% of uplift above threshold — model this as a cost",
          "Benchmark land values: regional averages vary widely from £50,000/ha (rural) to £2m+/ha (urban)",
          "Always allow for purchaser's costs (SDLT and legal fees) in the residual before bidding",
        ],
      },
    ],
  },
};
