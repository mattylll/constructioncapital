import type { CalculatorContent } from "./types";

export const content: CalculatorContent = {
  howItWorks: {
    title: "How the Mezzanine Finance Calculator Works",
    paragraphs: [
      "Mezzanine finance sits between your senior development loan and your equity in the capital stack. Where a senior lender might advance up to 60–65% of gross development value (GDV), a mezzanine lender can top that up to 80–85% of GDV — dramatically reducing the cash you need to put in on day one.",
      "This calculator takes your project GDV, total development costs, and your senior debt terms, then models how much mezzanine finance you could layer on top. It shows you the resulting equity requirement, the blended cost of your combined borrowing, and a rough illustration of net profit after all debt is repaid.",
      "The key inputs are your senior loan-to-cost (LTC) ratio, the mezzanine advance (typically expressed as a percentage of GDV), and the mezzanine interest rate — usually quoted as an annual rate between 10% and 15%, rolled up and repaid on exit. The calculator computes interest on a rolled basis across your projected loan term, so you can see the true all-in cost before you approach a lender.",
      "Bear in mind that mezzanine lenders will also scrutinise your experience, planning permission quality, contractor track record, and exit route. The numbers this calculator produces are indicative; a lender's credit committee will form its own view on the appropriate advance and rate. Use the output as a starting point for conversations with your broker rather than a guaranteed offer.",
    ],
  },
  guide: {
    title: "Mezzanine Finance for Property Development: A Practical Guide",
    sections: [
      {
        heading: "When Does Mezzanine Finance Make Sense?",
        paragraphs: [
          "Most senior development lenders advance between 55% and 70% of total development costs, and they typically cap their exposure at 60–65% of GDV. On a £5m GDV scheme with £3.5m of total costs, a senior lender advancing 65% of GDV would provide £3.25m — leaving you to fund £250,000 of costs plus a meaningful equity buffer from your own resources. That can mean tying up £500,000 to £750,000 of cash, which may be earmarked for your next site.",
          "Mezzanine finance plugs that gap. A mezz lender will typically advance up to 15–20% of GDV on top of the senior loan, taking overall gearing from 65% to 80–85% of GDV. On the same £5m scheme, that could reduce your required equity from 35% of costs to as little as 10–15% — freeing capital to run multiple projects concurrently.",
          "Mezzanine works best when your expected profit on cost comfortably exceeds 20%. Lenders will stress-test the deal assuming GDV falls and costs overrun; if the margin is thin, they will either decline or impose punitive rates. Schemes with planning risk still to resolve, contractor conflicts, or an illiquid exit market are unlikely to attract mezz funding on attractive terms.",
        ],
        bullets: [
          "Senior LTC is capped and you have a funding gap you cannot close from equity alone",
          "Your profit on cost exceeds 20% before financing costs",
          "Full planning permission is in place or conditionally approved",
          "You have a credible exit — presales, forward sale, or refinance onto BTL",
          "You want to recycle equity across multiple concurrent sites",
        ],
      },
      {
        heading: "Typical Rates and How Mezzanine Is Structured",
        paragraphs: [
          "Mezzanine finance is priced to reflect its subordinated position. Because a mezz lender sits behind the senior lender in the security waterfall, it faces significantly more risk and charges accordingly. Current market rates run from approximately 10% per annum at the lower end — for experienced developers on strong schemes in liquid markets — to 15% per annum or above for higher-risk projects or less experienced applicants.",
          "Most mezzanine is offered on a rolled-up basis: interest accrues monthly and is added to the outstanding balance rather than being paid as monthly cash. This is important for cash-flow modelling because the effective loan balance grows over time. On a £500,000 mezz facility at 12% per annum, rolled for 18 months, you would owe approximately £595,000 on exit — almost £95,000 more than the drawn balance.",
          "Arrangement fees of 1.5–2% of the mezz facility are standard, and exit fees of 1% are common. Some lenders combine a lower interest rate with a profit share, typically 15–25% of the developer's profit above a threshold return. Profit-share mezz can be cheaper in absolute terms if the project performs, but it dilutes your upside. Fixed-rate mezz is generally preferred by developers who are confident in their margin.",
        ],
        bullets: [
          "Typical rate range: 10–15% per annum, rolled up",
          "Arrangement fee: 1.5–2% of the facility",
          "Exit fee: 0.5–1% of the facility on repayment",
          "Loan terms: 12–24 months, aligned to the development programme",
          "Security: second charge over the site, often with personal guarantees",
        ],
      },
      {
        heading: "How Mezzanine Layers With Senior Debt",
        paragraphs: [
          "Understanding the intercreditor relationship is essential. The senior lender holds a first legal charge over the site and has priority claim on any sale proceeds. The mezzanine lender takes a second charge, meaning they are only repaid after the senior lender is fully satisfied. This subordination is formalised in an intercreditor agreement, which also limits what the mezzanine lender can do if the senior lender calls an event of default.",
          "Not all senior lenders will permit mezzanine. Some mainstream development finance lenders operate clean-charge policies and will only lend if they hold the sole first charge. Others actively co-lend with approved mezz providers, and some lenders offer stretch senior loans — advancing to 75–80% LTC themselves at a blended rate, removing the need for a separate mezz tranche.",
          "When your senior lender does permit mezz, you will need both parties to approve each other's term sheets before you can draw. Allow three to four weeks for intercreditor negotiations to be documented. Your solicitor will need to manage both sets of lender requirements simultaneously, which adds to legal costs — budget an additional £3,000–£7,000 for the intercreditor work.",
        ],
      },
      {
        heading: "What Mezzanine Lenders Look For",
        paragraphs: [
          "Mezzanine lenders apply tighter credit criteria than their senior counterparts because they are taking more risk. The most important factor is the loan-to-GDV position after both tranches: if the combined senior and mezzanine debt represents more than 85% of GDV, most lenders will decline. They stress the GDV by 10–15% to model a downside scenario and will only proceed if the stressed position still shows adequate coverage.",
          "Developer track record carries significant weight at the mezzanine level. Lenders want to see at least two or three completed schemes of comparable scale, with exit evidence — sales statements, completion statements, or Land Registry data. First-time developers rarely access mezzanine finance without a joint venture partner who brings the required experience.",
          "The planning permission must be implemented and the design must be market-ready. Mezzanine lenders will commission their own RICS valuation and will not rely solely on the developer's comparables. They will also review the build contract, the contractor's financial standing, and the professional team's indemnity insurance. A robust monitoring surveyor appointment — often a condition of the senior facility — provides comfort at the mezz level too.",
        ],
        bullets: [
          "Combined LTV after both tranches: maximum 85% of GDV",
          "Minimum developer profit on cost: 20% before financing",
          "Planning: full or conditional approval in place",
          "Developer experience: two or more completed comparable schemes",
          "Exit strategy: presales, forward sale to a housing association, or refinance",
          "RICS Red Book valuation commissioned by the lender",
        ],
      },
    ],
  },
};
