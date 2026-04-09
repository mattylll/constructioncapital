import type { CalculatorContent } from "./types";

export const content: CalculatorContent = {
  howItWorks: {
    title: "How the Arrangement Fees Calculator Works",
    paragraphs: [
      "An arrangement fee — sometimes called a facility fee or origination fee — is charged by a lender for setting up your finance facility. It is separate from the interest rate and can be a significant cost in its own right. For short-term property finance products, the arrangement fee can represent as much as 20–30% of the total financing cost when expressed as an effective annualised rate.",
      "This calculator takes your loan amount, the arrangement fee percentage, and any exit fee, then shows you the total fee cost in pounds, the net advance you actually receive (where fees are deducted from the loan), and the effective annual rate (EAR) — the true cost of your finance including both interest and fees. The EAR is particularly important for short-term bridging and development loans, where fees have an outsized impact on the all-in cost compared to longer-term mortgage products.",
      "The calculator handles three fee payment structures: fees added to the loan (increasing the balance but preserving your net advance), fees deducted from the loan on day one (reducing the cash you receive), and fees paid separately at outset or completion. Each structure has different cash-flow implications, and the calculator shows how each affects your net position.",
      "Note that some lenders quote arrangement fees as a fixed pound amount rather than a percentage. For very large loans, a percentage-based fee can become disproportionate, and lenders often cap it at a maximum. Input the actual pound amount where your lender quotes a flat fee rather than a percentage.",
    ],
  },
  guide: {
    title: "Arrangement Fees in Property Finance: Rates, Structures, and Negotiation",
    sections: [
      {
        heading: "Typical Fee Ranges by Product Type",
        paragraphs: [
          "Arrangement fees vary considerably across different property finance products, reflecting the complexity of each loan type, the volume of lender due diligence required, and competitive market dynamics. Understanding the typical range for your specific product helps you assess whether a term sheet is competitive or overpriced.",
          "Bridging finance carries the highest arrangement fees, typically between 1% and 2% of the gross loan. On a £500,000 bridging loan at 1.5%, that is £7,500 added to your costs before you have drawn a penny. Bridging is short-term and high-margin for lenders, so they are motivated to compete on rate but often compensate via fees. Unregulated bridging — for investment or development purposes — generally commands slightly higher fees than regulated bridging for owner-occupied purposes.",
          "Development finance fees run from 1% to 1.5% of the gross facility, though some lenders charge on the net loan rather than the full facility (the distinction matters when you have a large contingency that may not be drawn). Buy-to-let mortgage arrangement fees have compressed significantly with competition and typically range from 0% to 1%, with many high-street lenders now offering fee-free products at a slightly higher interest rate.",
        ],
        bullets: [
          "Bridging loans: 1–2% of gross loan, payable at outset or deducted from advance",
          "Development finance: 1–1.5% of facility, sometimes charged on net loan only",
          "Commercial mortgages: 1–1.5%, occasionally higher on complex or large facilities",
          "Buy-to-let mortgages: 0–1%, many fee-free options from mainstream lenders",
          "Mezzanine finance: 1.5–2% of mezz facility, often plus an exit fee of 0.5–1%",
        ],
      },
      {
        heading: "Fee Structures: Added, Deducted, or Paid Separately",
        paragraphs: [
          "How and when you pay an arrangement fee affects your cash position and the true cost of your borrowing. There are three primary structures, each with distinct implications.",
          "Fees added to the loan are the most common structure for bridging and development finance. The arrangement fee is capitalised — added to your loan balance rather than paid in cash — meaning you borrow more than the net amount you receive. If you borrow £500,000 gross with a 1.5% fee added, your loan balance from day one is £507,500 (the fee itself also attracts interest if it is rolled up). This preserves your working capital but increases your total debt and interest cost.",
          "Fees deducted from the advance mean the lender retains the arrangement fee from the first drawdown. If you need £500,000 net for your purchase and the fee is 1.5%, you must borrow £507,500 gross to net off exactly £500,000. Borrowers who do not account for this correctly find themselves short of funds at completion. This is particularly important in auction purchases where the net amount needed is fixed.",
          "Fees paid separately at outset or from personal funds reduce the effective loan size but require liquid cash. Some lenders require upfront payment of the arrangement fee before they will issue a facility letter, which can create cash-flow pressure at the front end of a deal. Exit fees paid on repayment are always separate and are usually 0.5–1% of the loan balance at the time of repayment.",
        ],
      },
      {
        heading: "How Fees Affect Your Net Advance and True Cost",
        paragraphs: [
          "The arrangement fee fundamentally affects two things: the net cash you receive and the effective cost of your borrowing. Both require careful modelling before you commit to a facility.",
          "On a development facility of £2m at 7% per annum over 18 months, the headline interest cost on a rolled basis is approximately £210,000. Add an arrangement fee of 1.5% (£30,000) and an exit fee of 1% (£20,000) and the all-in financing cost rises to £260,000 — approximately 24% higher than the interest rate alone suggests. The effective annual rate (EAR) for this facility is closer to 9.3% than the quoted 7%. This is a material difference in any appraisal.",
          "For bridging finance, which is typically shorter term, the EAR impact of fees is even more pronounced. A six-month bridge at 0.75% per month (9% per annum) with a 2% arrangement fee and 1% exit fee has an EAR of approximately 15.4% — nearly double the quoted monthly rate annualised. Always calculate the EAR when comparing bridging products: lenders who lead with a low monthly rate and high fees can look cheaper than they are.",
        ],
        bullets: [
          "Always model EAR to compare facilities with different rate and fee combinations",
          "On short-term products, fees have a greater proportional impact on EAR",
          "Broker fees (typically 1–1.5% of the loan) are separate from lender arrangement fees",
          "Solicitor fees for the lender's legal work are additional and quoted separately",
          "VAT: lender arrangement fees are generally exempt; broker fees may attract VAT",
        ],
      },
      {
        heading: "Negotiating Arrangement Fees: What Works and What Does Not",
        paragraphs: [
          "Arrangement fees are more negotiable than most borrowers assume, particularly on larger facilities. Lenders calibrate fees as a blend of revenue, risk pricing, and deal-winning tool — they will reduce fees to win business from creditworthy borrowers, especially in a competitive environment.",
          "Loan size is the most powerful lever. Lenders who charge 1.5% on a £300,000 facility will often accept 1% on a £1.5m facility from the same borrower, because the absolute pound value of the fee is already attractive. On very large transactions — £5m and above — fees of 0.75% are achievable with the right lender relationship or through a broker with volume.",
          "Repeat business is the second most effective lever. A developer who has borrowed through the same lender on three previous schemes and repaid without incident has significant negotiating power. Some lenders offer formal loyalty pricing or preferred borrower status with fee reductions. Maintaining clean credit performance and communicating proactively with your lender — even between transactions — builds this goodwill.",
          "Brokers can often negotiate fee reductions that borrowers cannot achieve directly, partly because they have ongoing relationships with the lender's BDMs and partly because they can credibly signal they will direct future business elsewhere. A good broker will also be transparent about whether their own fee is included in the lender's arrangement fee via a procuration arrangement, or charged separately to you.",
        ],
        bullets: [
          "Negotiate on larger facilities — lenders prefer lower percentage, higher absolute fee",
          "Repeat borrower status carries significant weight — track record matters",
          "Use a broker with volume relationships to access preferential pricing",
          "Compare the all-in cost including fees, not just the headline rate",
          "Ask whether the lender will waive the exit fee if you refinance with them on the next deal",
        ],
      },
    ],
  },
};
