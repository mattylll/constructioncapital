import type { CalculatorContent } from "./types";

export const content: CalculatorContent = {
  howItWorks: {
    title: "How the Legal Costs Calculator Works",
    paragraphs: [
      "Legal costs in property transactions fall into two categories: solicitor professional fees (the cost of the solicitor's time) and disbursements (third-party costs the solicitor pays on your behalf, such as searches and Land Registry fees). This calculator estimates both components based on transaction type, purchase price, and property characteristics.",
      "Enter the property value, whether the transaction is a purchase, remortgage, or sale, and whether the property is freehold or leasehold. For purchases, the calculator also estimates the disbursements: local authority search, drainage and water search, environmental search, and Land Registry registration fee. These are fixed or formulaic costs that do not vary by firm, so the estimates are reasonably accurate.",
      "Where the calculation is less precise is professional fees. Solicitors set their own fee scales, and there is wide variation between high-street firms in lower-cost areas and specialist property solicitors in London. The calculator uses typical market benchmarks, but quotes from two or three firms on your specific transaction are the only reliable way to budget professional fees accurately.",
      "For development finance and commercial transactions, the calculator includes lender legal costs — the fee charged by the lender's solicitor, which the borrower is required to pay in addition to their own legal costs. On development transactions, both sets of legal costs together can be a significant line item in the project appraisal.",
    ],
  },
  guide: {
    title: "Legal Costs for Property Transactions: A Practical Breakdown",
    sections: [
      {
        heading: "Solicitor Fees vs Disbursements: Understanding the Difference",
        paragraphs: [
          "One of the most common sources of confusion in property legal costs is the distinction between the solicitor's professional fee and disbursements. Both appear on the same invoice but they are fundamentally different in nature and, critically, in how much control you have over them.",
          "Professional fees are what the solicitor charges for their time, knowledge, and project management of your transaction. These are negotiable, variable between firms, and subject to market pricing. They are almost always quoted net of VAT — add 20% to get to the cost you will actually pay. A residential purchase of a freehold property might attract professional fees of £800–£1,500 from a regional firm, or £2,000–£4,000 from a specialist London firm. Commercial property transactions and development finance add significant complexity and push fees higher.",
          "Disbursements are pass-through costs — the solicitor pays them on your behalf and recharges them at cost. They include search fees (typically £250–£400 for a standard residential search pack), Land Registry fees (set by HM Land Registry on a sliding scale linked to property value), Stamp Duty Land Tax (which the solicitor collects from you and remits to HMRC), and bank transfer fees. Disbursements are largely fixed and non-negotiable, though the choice of search provider can affect search fees at the margin.",
        ],
        bullets: [
          "Professional fees: solicitor's time — negotiable, VAT applicable at 20%",
          "Search fees: local authority, drainage, environmental — typically £250–£400 for residential",
          "Land Registry fee: scales with property value — £20 on a £100k property, £295 on £500k",
          "SDLT: collected and remitted by solicitor, not a solicitor profit line",
          "Lender legal fees: separate charge if borrowing — typically £750–£2,000 residential, more for commercial",
        ],
      },
      {
        heading: "Typical Costs by Transaction Type",
        paragraphs: [
          "For a straightforward residential purchase at £300,000, total legal costs including professional fees, searches, Land Registry, and bank transfer fees (but excluding SDLT) typically run to £1,500–£2,500. Leasehold properties add complexity — solicitors must review the lease, request management company information, and raise additional enquiries — pushing costs up by £400–£800.",
          "Remortgages are cheaper than purchases. There is no stamp duty, no search pack unless the lender requires it (many accept search indemnity insurance instead), and the Land Registry fee is lower for registration of a charge than for a transfer of ownership. Typical all-in remortgage legal costs are £500–£1,200 for residential properties.",
          "Development finance transactions are materially more expensive. The borrower pays both their own solicitor and the lender's solicitor (typically £1,500–£3,000 for the lender's legal work on a straightforward development facility). The development loan agreement is a complex document, and solicitors on both sides must negotiate its terms, review planning consents, and consider the drawdown mechanics. Total legal costs on a £1m development facility — both sides — often reach £5,000–£10,000.",
          "Commercial transactions add further complexity: title investigation of commercial titles is typically more involved, VAT on commercial property requires specific advice, and planning use class questions often arise. Budget £3,000–£8,000 in professional fees for a typical commercial acquisition in the £500,000–£2m range, on top of disbursements.",
        ],
      },
      {
        heading: "Why Dual Representation Can Save Money",
        paragraphs: [
          "Traditionally, the buyer's solicitor and the lender's solicitor were always separate firms. In residential mortgage transactions, this changed when the Law Society introduced the Conveyancing Quality Scheme and lenders began permitting 'dual representation' — allowing one solicitor to act for both the buyer and the mortgage lender in the same transaction.",
          "Dual representation is now standard for residential purchases with mainstream mortgage lenders. The buyer's solicitor simultaneously represents the lender, removing the need for the lender to instruct a separate firm and charge the borrower for separate legal costs. This saves £500–£1,000 on a typical residential purchase. Not all lenders permit dual representation, and specialist lenders — particularly development finance lenders and bridging lenders — almost always insist on their own separate legal representation.",
          "For commercial property and development finance, dual representation is generally not available. Lenders in these markets require independent legal advice to protect their security, and the complexity of the documentation justifies separate representation. Borrowers should budget for both sides of legal costs on any commercial or development transaction as a matter of course.",
        ],
        bullets: [
          "Residential mortgages: dual representation now standard — saves £500–£1,000",
          "Bridging and development finance: always separate lender legal costs",
          "Leasehold adds £400–£800 to residential legal costs",
          "New builds: additional legal work on developer's contract — budget extra £500–£800",
          "Shared ownership: specialist leasehold structure — higher complexity and cost",
        ],
      },
      {
        heading: "Commercial vs Residential Conveyancing: Key Differences",
        paragraphs: [
          "Commercial conveyancing operates under different norms and timelines from residential conveyancing, and the cost reflects this. While a straightforward residential purchase can complete within four to six weeks with organised parties, commercial transactions routinely take three to six months — and the legal fees reflect the extended period of work.",
          "Commercial titles often include complex legal arrangements: multiple occupational leases, development agreements, planning obligations (Section 106 agreements), overage clauses, and rights of way that must be investigated and reported on. Each adds to the solicitor's time and, therefore, their fee. On properties with planning permission, the solicitor must also verify the planning conditions, check the planning agreements, and confirm there are no pre-commencement conditions outstanding that would prevent development.",
          "VAT is a significant additional consideration in commercial property. Commercial properties may have elected to opt to tax, meaning the sale attracts 20% VAT. The buyer must either register for VAT and recover it (which is straightforward if the property is for business use generating VAT-able income), or use the Transfer of a Going Concern (TOGC) rules to dis-apply VAT on the purchase altogether. Both routes require specific advice and add time to the transaction. Budget for VAT advice as a separate line item in your legal cost estimate for any commercial acquisition.",
        ],
        bullets: [
          "Commercial transactions: typical professional fees £3,000–£10,000 for mid-market acquisitions",
          "Residential transactions: typical professional fees £800–£2,500 including disbursements",
          "Always request a fixed-fee quote or a detailed estimate with assumptions stated",
          "Confirm whether the solicitor's quote includes or excludes VAT — always add 20%",
          "For development projects, obtain legal cost estimates at the appraisal stage, not after exchange",
        ],
      },
    ],
  },
};
