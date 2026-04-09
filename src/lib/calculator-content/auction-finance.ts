import type { CalculatorContent } from "./types";

export const content: CalculatorContent = {
  howItWorks: {
    title: "How auction finance works",
    paragraphs: [
      "When a lot is sold under the hammer at a traditional property auction, the buyer is immediately bound by the terms of sale. Contracts exchange at the point of the winning bid, and completion must follow within 28 calendar days. Miss that deadline and you forfeit your 10% deposit — typically tens of thousands of pounds — and may face additional damages claims from the seller.",
      "Conventional mortgage finance cannot reliably complete within 28 days. Lenders need time to conduct valuations, underwrite the application, and issue formal offers; that process commonly takes six to ten weeks. Auction finance — a specialist bridging product underwritten with the urgency of the auction timeline in mind — is specifically structured to meet the 28-day window.",
      "Lenders experienced in auction finance can issue an Agreement in Principle before you bid, conduct a desktop or drive-by valuation within days of the auction, and release funds to your solicitor in time for completion. The loan then runs for six to 24 months while you arrange your long-term exit, whether that is a buy-to-let mortgage, a refurbishment followed by refinance, or an onward sale.",
      "This calculator estimates the total cost of an auction finance facility. Enter the purchase price, deposit, and expected loan term to see your monthly interest, total interest, and gross loan requirement — giving you a clear picture of the total cost to factor into your auction bidding strategy.",
    ],
  },
  guide: {
    title: "Auction finance: meeting the 28-day deadline",
    sections: [
      {
        heading: "Pre-auction preparation: setting yourself up to complete",
        paragraphs: [
          "The most common reason auction purchasers fail to complete is insufficient preparation before the auction itself. By the time you bid, your finance should already be arranged in principle, your solicitor should have reviewed the legal pack, and you should have a clear understanding of the property's condition and any structural risks that might affect value or insurability.",
          "Obtaining an Agreement in Principle from an auction finance lender before you attend — or before the online auction closes — is straightforward and costs nothing. Provide the lender or broker with the auction catalogue details, your deposit evidence, and a brief overview of your exit strategy. Most AIP decisions are returned within 24–48 hours. This document does not commit the lender to funding, but it confirms that the deal broadly fits their criteria and allows you to bid with genuine confidence.",
          "The legal pack — typically available on the auction house's website several weeks before sale day — contains the title register, special conditions of sale, searches, and any tenancy agreements. Your solicitor should review this before you bid; it frequently contains issues that affect value, such as short-remaining leases, overage clauses, or restrictive covenants. Budget at least £500–£800 for a pre-auction legal review.",
        ],
        bullets: [
          "Obtain an Agreement in Principle from a lender or broker before bidding",
          "Instruct a solicitor to review the legal pack — do not skip this step",
          "Commission an independent survey or at minimum a desktop valuation report",
          "Confirm you have the 10% deposit available in cleared funds on auction day",
          "Establish your maximum bid based on total costs, not just the purchase price",
        ],
      },
      {
        heading: "The 28-day completion timeline: day by day",
        paragraphs: [
          "Day one starts the moment the hammer falls. On that day you will typically sign the memorandum of sale, pay the 10% deposit, and receive confirmation of the exchange. Your solicitor should be instructed immediately — ideally they were waiting for your call having already reviewed the legal pack. Simultaneously, contact your lender or broker to trigger the formal application process.",
          "Days two to seven are typically consumed by the formal valuation. Lenders will instruct a RICS-registered surveyor from their panel; some will accept a desktop valuation for standard properties in strong markets, which can turn around in 24 hours. For properties requiring a physical inspection, allow three to five working days for the report to be prepared and submitted to the lender's credit team.",
          "Days eight to fourteen cover credit underwriting and formal offer issue. The lender's credit team reviews the valuation, confirms the deal structure, and issues a formal loan offer subject to satisfactory legal due diligence. Your solicitor simultaneously works through the title enquiries, resolves any issues flagged in the legal pack review, and prepares for completion.",
          "Days fifteen to twenty-eight are the legal completion phase. The lender's solicitors must be satisfied with the title before releasing funds. Aim to complete by day 25 at the latest, giving yourself a three-day buffer against last-minute administrative delays. Completion on day 28 is possible but leaves no margin for error.",
        ],
        bullets: [
          "Day 1: Sign memorandum of sale, pay 10% deposit, instruct solicitor, trigger lender application",
          "Days 2–7: Lender commissions valuation (desktop or physical)",
          "Days 8–14: Credit underwriting and formal offer issued",
          "Days 15–25: Legal due diligence and fund release",
          "Days 26–28: Buffer — aim to complete no later than day 25",
        ],
      },
      {
        heading: "Conditional vs unconditional auctions and online sales",
        paragraphs: [
          "Traditional (unconditional) auctions exchange contracts immediately on the fall of the hammer, triggering the 28-day completion deadline. This is the format offered by the major national rooms — Allsop, Savills, BidX1 — and most regional auctioneers. It is the format for which auction finance is primarily designed.",
          "Conditional auctions — increasingly common in the residential sector and often branded as 'modern method of auction' — work differently. The winning bidder pays a reservation fee and is given 28 days to exchange contracts, followed by a further 28 days to complete. This 56-day window is more compatible with conventional mortgage finance, though auction finance remains an option for buyers who want certainty and speed.",
          "Online auctions have grown significantly since 2020. Most major auctioneers now run fully online events on the same unconditional terms as their traditional rooms. The same 28-day completion rule applies, and the same pre-auction finance preparation is required. One practical difference: online auctions often run over a fixed bidding window (typically five to ten minutes per lot, with auto-extension if bids arrive in the final minute), so the exact auction date can be known well in advance, making preparation easier.",
        ],
      },
      {
        heading: "Costs, risks, and what happens if you cannot complete",
        paragraphs: [
          "The full cost of auction finance includes the bridging loan interest, arrangement fee, valuation fee, your solicitor's fees, the lender's solicitor's fees, and any stamp duty land tax payable on completion. For a £300,000 purchase on a six-month bridge at 0.75% per month with a 1.5% arrangement fee, the total finance cost typically falls in the range of £17,000–£22,000 before SDLT and solicitor fees. Factor all of these costs into your maximum bid calculation before the auction.",
          "If you cannot complete within 28 days, the consequences are severe. The seller retains your 10% deposit — immediately crystallising a loss of the full deposit amount. The seller may then re-list the property and, if it achieves a lower price at re-sale, pursue you for the shortfall plus their additional costs. In practice, most sellers prefer to retain the deposit and move on, but the contractual right to claim further losses is real.",
          "The most common cause of failure to complete is not finance — it is a title defect discovered too late in the legal process, or a valuation that comes in materially below the purchase price. Both risks are substantially reduced by thorough pre-auction preparation: instructing a solicitor to review the legal pack, and obtaining an independent survey or at minimum a condition report before you bid.",
        ],
      },
    ],
  },
};
