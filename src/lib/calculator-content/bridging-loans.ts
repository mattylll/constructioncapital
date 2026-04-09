import type { CalculatorContent } from "./types";

export const content: CalculatorContent = {
  howItWorks: {
    title: "How bridging finance works",
    paragraphs: [
      "A bridging loan is a short-term secured facility, typically running from one to 24 months, designed to bridge a gap between an immediate funding need and a longer-term solution. Rather than assessing affordability the way a residential mortgage lender would, bridging lenders focus primarily on the value of the security — the property being charged — and the credibility of the borrower's exit strategy.",
      "Bridging loans are split into two regulatory categories. Regulated bridging applies where the security is, or will be, your primary residence; these loans fall under FCA oversight and carry stronger consumer protections. Unregulated bridging covers investment or commercial property, permitted development conversions, and buy-to-let acquisitions — lenders in this space can move significantly faster and apply more flexible underwriting criteria.",
      "Loans are also described by their charge position. A first-charge bridging loan sits ahead of all other debt on the property and consequently attracts lower rates, as lenders face the least recovery risk. A second-charge loan is placed behind an existing mortgage, giving the lender a subordinate claim on proceeds in a sale; this higher risk is reflected in marginally higher pricing and a lower maximum loan-to-value.",
      "The calculator above estimates your monthly interest cost, total interest across the term, and gross loan amount. Enter the property value, the loan amount you need, and your expected loan term to see an indicative cost breakdown. Rates shown are illustrative; your actual rate will depend on the strength of your security, your credit profile, the loan-to-value ratio, and the clarity of your exit.",
    ],
  },
  guide: {
    title: "Bridging loans: a complete guide for UK property borrowers",
    sections: [
      {
        heading: "When does bridging finance make sense?",
        paragraphs: [
          "Bridging finance is not a product to reach for casually — the cost is materially higher than a term mortgage, and the short-term nature means a robust exit must exist before funds are drawn. When those conditions are met, however, bridging can unlock transactions that would otherwise be impossible.",
          "The four scenarios where bridging is most commonly and legitimately used are: purchasing at auction (where the 28-day legal completion deadline makes conventional mortgage finance impractical), breaking a property chain (where your onward purchase is ready but your sale has not yet exchanged), funding a refurbishment that makes a property unmortgageable in its current condition, and purchasing land or a site ahead of securing planning permission.",
          "In each case the bridging loan is a deliberate, time-limited tool rather than a substitute for long-term finance. Lenders will want to see a credible exit — typically a refinance onto a term mortgage or the completion of a sale — and will assess whether that exit is achievable within the proposed term.",
        ],
        bullets: [
          "Auction purchases requiring completion within 28 days of the fall of the hammer",
          "Chain breaks where an onward purchase is ready but the sale of your current property is delayed",
          "Refurbishments where the property does not meet standard mortgage lending criteria",
          "Land purchases and sites awaiting planning permission",
          "Below-market-value acquisitions where speed provides the commercial advantage",
        ],
      },
      {
        heading: "Understanding bridging loan rates and fee structures",
        paragraphs: [
          "Bridging rates are quoted monthly rather than annually, which makes direct comparison with mortgage rates misleading. The market spans roughly 0.45% per month for low-risk, well-secured regulated loans up to 1.2% per month for higher-LTV unregulated deals or those involving unusual security. For a six-month loan at 0.75% per month, the interest cost on a £500,000 facility is £22,500 — before fees.",
          "Arrangement fees are typically 1–2% of the gross loan and are usually added to the facility rather than paid on day one. Exit fees, where charged, are commonly 1% of the loan and fall due on redemption. Valuations are commissioned by the lender but paid by the borrower; expect £500–£1,500 for standard residential property and more for complex commercial assets. Legal fees are payable on both sides — your solicitor and the lender's — and typically run to £1,500–£3,000 each for a straightforward deal.",
          "Interest can be structured in three ways: serviced (paid monthly), retained (deducted from the facility on day one, reducing the net advance), or rolled (accruing to the loan balance and repaid on exit). Retained and rolled interest both gross up the facility size, which affects the LTV calculation. Brokers often model all three options to identify the structure that best suits the borrower's cashflow position.",
        ],
        bullets: [
          "Monthly rates typically 0.45–1.2% depending on LTV, security type, and regulatory status",
          "Arrangement fee: 1–2% of the gross loan, usually added to the facility",
          "Exit fee: 0–1% of the loan, charged on redemption by some lenders",
          "Valuation fee: £500–£1,500 for standard residential property",
          "Legal fees: £1,500–£3,000 per side for a straightforward transaction",
        ],
      },
      {
        heading: "Exit strategy: the most important part of any bridging application",
        paragraphs: [
          "Lenders require a clearly articulated, evidenced exit strategy before issuing a formal offer. This is the single largest differentiator between an application that completes smoothly and one that stalls at credit. The exit strategy must be both credible and achievable within the proposed loan term — ideally with sufficient buffer to absorb delays.",
          "A sale exit requires evidence that the property is or will be marketable: comparable sold prices in the area, an estate agent valuation, or — for development or refurbishment projects — a projected GDV supported by comparable new-build or refurbished sales nearby. A refinance exit requires evidence that a term mortgage will be available at the point of redemption; this usually means demonstrating serviceability using the anticipated rental income (for investment properties) or personal income (for regulated products).",
          "Where the exit involves completing a refurbishment before refinancing, lenders will want to see that the works are costed, that the timeline is realistic, and that the projected end value supports the refinance LTV. Some lenders will stress-test the exit against a 10–15% reduction in projected end value to satisfy themselves that the loan remains recoverable even if the market softens.",
        ],
      },
      {
        heading: "First charge vs second charge: what borrowers need to know",
        paragraphs: [
          "The charge position of a bridging loan affects both the rate available and the maximum LTV a lender will advance. First-charge lenders are first in line if the property is repossessed and sold, making their position lower-risk; they typically lend up to 75–80% LTV for residential security and price accordingly. Second-charge lenders sit behind an existing mortgage and face a residual recovery position; they price for this additional risk and may apply a lower gross LTV cap.",
          "For borrowers who already hold a mortgage on the property being used as security, a second-charge bridging loan avoids the need to redeem and replace the existing mortgage. This is often the faster and cheaper route where the primary mortgage is on a fixed rate with early repayment charges. Where no existing charge exists, a first-charge facility is generally preferable.",
          "Cross-charging — using multiple properties as security — can unlock higher loan amounts or lower rates by reducing the aggregate LTV across the portfolio. This is common in portfolio bridging transactions and in cases where a single property would not support the required loan quantum on its own.",
        ],
      },
    ],
  },
};
