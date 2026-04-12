import type { CalculatorContent } from "./types";

export const content: CalculatorContent = {
  howItWorks: {
    title: "How the development finance calculator works",
    paragraphs: [
      "This calculator models the core economics of a ground-up development finance facility. Enter your total development cost (land plus build costs plus fees), your anticipated Gross Development Value (GDV), and your preferred loan term. The calculator returns your maximum loan amount based on standard Loan-to-Cost (LTC) and Loan-to-GDV (LTGDV) limits, your projected interest cost under a roll-up structure, and an indicative arrangement fee. These outputs give you an immediate read on how much debt you can raise and what it will cost.",
      "Development finance lenders in the UK apply two separate leverage tests simultaneously. The LTC test caps the loan at a percentage of total project costs, typically 65% to 75%. The LTGDV test caps the loan at a percentage of GDV, typically 60% to 65%. Both constraints apply and the binding limit - whichever produces the lower loan amount - determines your maximum facility. Our calculator applies both tests and flags which one is constraining your deal, which is the same analysis a lender's credit team will run on your application.",
      "Interest on development finance is almost always rolled up rather than serviced monthly. This means the interest accrues on top of your loan balance and is repaid in full at the end of the facility, typically from sales proceeds or a refinance. Because the loan is drawn down in tranches as the build progresses rather than as a single lump sum on day one, the actual interest you pay is significantly less than the headline rate applied to the full facility. Our calculator models this drawdown curve to give you a realistic interest cost figure rather than an inflated worst-case number.",
      "The figures produced are indicative estimates for initial planning purposes. Actual terms depend on your borrower profile, planning status, contractor appointments, and the specific lender you work with. To receive a fully underwritten indicative term sheet for your development, submit your project details through our Deal Room and a member of the Construction Capital team will respond within 24 hours.",
    ],
  },
  guide: {
    title: "Development finance in the UK: a complete guide for property developers",
    sections: [
      {
        heading: "How to choose the right development finance lender",
        paragraphs: [
          "The UK development finance market comprises well over 100 active lenders, ranging from the major high street banks through challenger banks, specialist development lenders, and private credit funds. Choosing between them is not simply a matter of finding the lowest interest rate. Lenders differ significantly in the schemes they will fund, the leverage they offer, the speed at which they can complete, and the quality of their relationship management during the build programme.",
          "High street banks offer the lowest rates but are highly selective. They typically require experienced borrowers with at least three completed comparable developments, full planning consent (not outline), a pre-let or pre-sale of a meaningful proportion of the scheme, and a clean credit profile. Their credit processes are lengthy - often 8 to 16 weeks from application to completion - and their internal appetite shifts with the economic cycle. For most small and medium-sized developers, a specialist development lender or a private debt fund will be a more realistic and practical choice.",
          "Specialist development lenders have built their entire business model around development finance. They understand construction risk, they employ in-house monitoring surveyors, and their underwriting teams can assess a scheme within days rather than weeks. They will lend on more complex schemes, at higher leverage, and to less experienced developers than the high street banks. Their rates are correspondingly higher, typically 7% to 10% per annum versus 5% to 7% for a bank, but the additional cost is often justified by speed, certainty, and flexibility.",
          "When comparing lenders, focus on total cost rather than headline rate. A lender charging 7.5% with a 2% arrangement fee, a 1% exit fee, and mandatory monitoring surveyor costs will be significantly more expensive overall than one charging 8.5% with a 1.5% arrangement fee and no exit fee. Always model the full cost of finance from day one, including all fees, to arrive at an accurate picture. Construction Capital has relationships with over 50 active lenders and can benchmark the market for your specific scheme - submit your project through our Deal Room for a free comparison.",
        ],
        bullets: [
          "High street banks: lowest rates but slowest process and most restrictive criteria",
          "Specialist development lenders: broader appetite, faster execution, higher rates",
          "Private debt funds: highest leverage available (up to 90% LTC), highest rates",
          "Peer-to-peer platforms: suitable for smaller schemes under £1M, limited track record required",
          "Ask for a full cost illustration, not just the headline rate, before proceeding",
        ],
      },
      {
        heading: "Structuring your development finance capital stack",
        paragraphs: [
          "The capital stack for a development project describes all the layers of funding used to finance the scheme, stacked in order of repayment priority. Getting the structure right has a greater impact on your net profit than almost any other decision you make. The most common structure for a UK residential development is a combination of senior debt, mezzanine finance, and developer equity.",
          "Senior development finance typically covers 65% to 70% of total project costs or 60% to 65% of GDV. On a scheme with £3 million in total costs and a £4 million GDV, senior debt might provide £2 million to £2.1 million, leaving you with an equity gap of £900,000 to £1 million. That gap must be filled from your own resources or from additional capital layers. This is where mezzanine finance or equity joint ventures become important.",
          "The LTC and LTGDV metrics are not interchangeable, and understanding how they interact is essential. Consider a scheme with £2 million build costs, £1 million land cost, and £5 million GDV. At 70% LTC the senior lender will advance £2.1 million. At 65% LTGDV the lender will advance £3.25 million. In this case, the LTC constraint is binding. Now take the same scheme but with a thinner margin - say £4 million GDV. At 70% LTC the advance is still £2.1 million. At 65% LTGDV the advance is £2.6 million. Now the LTGDV constraint bites first. Profit margin directly determines which test is the binding constraint.",
          "Drawdown schedules are negotiated between you and the lender before completion. A typical schedule releases funds in tranches tied to build stages: substructure complete, first floor complete, roof on, practical completion, and so on. Each drawdown is validated by an independent monitoring surveyor (QS) who visits the site, confirms the works are complete, and signs off the claim. Lenders will only release funds against certified work completed, never in advance. Understanding this is important for your cash flow planning - you need sufficient working capital to fund each stage before you can draw the next tranche.",
        ],
        bullets: [
          "LTC and LTGDV limits apply simultaneously - the lower result is your ceiling",
          "Senior debt typically covers 65-70% LTC or 60-65% LTGDV",
          "Drawdowns are released against QS-certified completed works, never in advance",
          "Interest rolls up against drawn balances, not the full facility limit",
          "Total finance costs typically represent 8-15% of GDV on a well-structured scheme",
        ],
      },
      {
        heading: "Common pitfalls in development finance",
        paragraphs: [
          "The most expensive mistake developers make is underestimating their total project costs in the initial appraisal. Development finance lenders require a detailed cost plan prepared or verified by an independent Quantity Surveyor before they will complete. If your actual costs are higher than the QS-certified cost plan, the shortfall must be funded from your own resources - the lender will not increase their facility mid-project unless the increase in costs is matched by a credible increase in GDV. Always include a contingency of at least 10% of build costs in your initial cost plan, and make sure your lender accepts this figure.",
          "A related pitfall is failing to account for the full loan term correctly. Development finance is typically priced and structured for 12 to 24 months. If your build programme takes longer than anticipated, your facility may expire before the project is complete. Extending a development finance facility mid-construction is possible but expensive - lenders typically charge extension fees of 0.5% to 1% of the facility per month, and they may require updated valuations and QS reports at your cost. Build a minimum three-month buffer into your loan term request from day one.",
          "Monitoring surveyor (QS) costs are a frequently overlooked expense. Your lender will appoint their own monitoring surveyor, whose fees are charged to you as the borrower. On a £2 million facility, monitoring costs might run to £8,000 to £15,000 over the life of the facility, covering initial report, drawdown visits, and a final review at practical completion. You should also budget for your own QS to prepare the cost plan and manage drawdown claims - the lender's QS works for the lender, not for you.",
          "Finally, many developers overlook the impact of Value Added Tax on build costs. VAT at 20% is generally charged on construction works and professional fees. On a new-build residential development, the sale of completed dwellings is zero-rated for VAT, meaning you can reclaim VAT on your input costs. However, the cash flow impact of paying VAT upfront before your HMRC refund arrives can be significant on large schemes. Mixed-use developments where commercial units are sold or let also create complex VAT partial exemption calculations that require specialist advice.",
        ],
        bullets: [
          "Always include 10% contingency on build costs - lenders expect it",
          "Add a 3-month buffer to your requested loan term to absorb programme delays",
          "Budget separately for lender-appointed monitoring surveyor fees",
          "Account for VAT cashflow on new-build schemes before HMRC refunds",
          "Personal guarantees are typically required from directors of SPV borrowers",
        ],
      },
      {
        heading: "When to use mezzanine finance alongside senior development debt",
        paragraphs: [
          "Mezzanine finance is the second charge loan that sits between your senior debt and your equity contribution in the capital stack. Its primary purpose is to reduce the amount of cash you need to deploy as the developer, allowing you to either take on larger schemes than your equity reserves would otherwise allow, or to run multiple projects in parallel. For many experienced UK developers, mezzanine finance is not a last resort - it is a standard part of deal structuring.",
          "The decision to use mezzanine should be driven by a simple analysis: does the additional interest cost on the mezzanine facility reduce your profit by less than the benefit you gain from deploying less equity? If you can deploy £500,000 of mezzanine at 14% per annum for 18 months (total interest cost of approximately £105,000 rolled up, net of the drawdown curve effect) and this allows you to free up £500,000 of equity to deploy on a second project generating £200,000 of profit, the mezzanine has created significant net value even after its cost.",
          "Lenders offering mezzanine finance behind senior debt in a development context typically provide up to 80% to 85% of total costs when combined with the senior facility, or up to 75% to 80% of GDV. They require an intercreditor deed between themselves and the senior lender, which governs how the two parties interact in the event of default. This deed must be agreed before completion of both facilities, so it is essential to select a senior lender who works with your preferred mezzanine provider - or to use a broker such as Construction Capital who can match both layers simultaneously and manage the intercreditor negotiation on your behalf.",
          "Mezzanine is not always the right choice. On schemes with thin profit margins, the additional interest burden can be the difference between a viable and unviable deal. On a £1 million GDV scheme projecting £180,000 net profit (18%), adding £100,000 of mezzanine at 15% for 18 months might cost £22,500 in rolled-up interest, reducing your net profit to £157,500 (15.75%) - still viable. But on a scheme already projecting 14% profit on GDV, that same cost could push you below the 12% threshold most lenders regard as minimum viability, triggering a requirement to restructure the deal entirely.",
        ],
        bullets: [
          "Mezzanine typically fills the gap between senior debt and your equity, providing up to 80-85% LTC combined",
          "An intercreditor deed between the senior and mezzanine lenders is required - allow additional legal time",
          "Model the full rolled-up interest cost, not the headline rate, before committing",
          "Use mezzanine to run parallel projects, not to rescue schemes with inadequate margins",
          "Construction Capital can arrange senior and mezzanine simultaneously to simplify the process",
        ],
      },
    ],
  },
};
