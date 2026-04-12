import type { CalculatorContent } from "./types";

export const content: CalculatorContent = {
  howItWorks: {
    title: "How Portfolio Leverage and DSCR Are Calculated",
    paragraphs: [
      "Portfolio leverage analysis measures the overall debt load across a property portfolio relative to its total value, and assesses whether the rental income generated is sufficient to service that debt. Where a single-property ICR calculation asks whether one property's rent covers one mortgage, portfolio leverage analysis asks whether the entire portfolio's aggregate rent covers its aggregate debt service - a more holistic and commercially realistic picture.",
      "The Debt Service Coverage Ratio (DSCR) is the primary metric used in portfolio-level lending decisions. It divides the portfolio's total net operating income (NOI) - gross rent minus operating costs, excluding mortgage payments - by the total annual debt service (interest and, where relevant, capital repayment). A DSCR of 1.0 means income exactly covers debt payments. A DSCR of 1.25 means income covers debt payments 1.25 times over, providing a 25% buffer.",
      "Commercial and specialist lenders use DSCR in exactly this way when assessing portfolio loan facilities, refinancing requests, and new acquisitions that would bring the portfolio to a new blended LTV. Unlike the residential PRA stress test, which applies a notional 5.5% rate, DSCR analysis is more flexible and typically assessed against the actual or expected weighted average rate across the portfolio.",
      "This calculator allows you to enter multiple properties with their respective values, rents, costs, and outstanding mortgage balances to produce a consolidated portfolio leverage picture: total LTV, aggregate DSCR, and the headroom available before debt service becomes unsustainable.",
    ],
  },
  guide: {
    title: "Portfolio Leverage: DSCR, Refinancing Strategy, and Lender Appetite",
    sections: [
      {
        heading: "Optimal LTV for Growth vs Cash Flow",
        paragraphs: [
          "One of the most important strategic decisions in portfolio management is choosing where to sit on the LTV spectrum. Higher LTV means more leverage, which amplifies returns when property values rise and cash flow is positive, but reduces resilience when values fall or rental income is interrupted. Lower LTV means less leverage, more predictable cash flow, and greater lender flexibility, but slower equity accumulation and lower overall ROI on deployed capital.",
          "For investors primarily focused on portfolio growth - acquiring new assets, recycling equity into further purchases - maintaining LTVs in the 70% to 75% range across the portfolio provides access to the widest range of BTL lenders at competitive rates while retaining meaningful refinancing capacity. Pushing above 75% LTV concentrates the portfolio with fewer specialist lenders, typically at higher rates, and leaves less buffer against value corrections.",
          "For investors in a consolidation phase - prioritising cash flow stability and income - bringing LTVs down to 50% to 60% through rental income accumulation, selective disposals, or capital repayment dramatically improves DSCR and reduces interest cost. The cash flow benefit is immediate; the opportunity cost is slower portfolio growth. Most mature portfolio landlords migrate from higher leverage during the accumulation phase to lower leverage as they approach retirement or income drawdown, deliberately trading growth potential for income security.",
        ],
        bullets: [
          "70–75% LTV: typical sweet spot for growth-focused investors accessing mainstream BTL lenders",
          "75–80% LTV: available from specialist lenders, higher rates, reduced DSCR headroom",
          "Below 65% LTV: strongest lender appetite, best pricing, maximum cash flow resilience",
          "Above 80% LTV: limited product availability, usually confined to bridging or development finance structures",
          "Blended portfolio LTV below 60% provides substantial refinancing capacity and positions the portfolio for commercial portfolio loan facilities",
        ],
      },
      {
        heading: "Refinancing Strategies for Portfolio Growth",
        paragraphs: [
          "Refinancing is the primary mechanism by which portfolio landlords recycle equity from appreciating assets into new acquisitions without triggering SDLT or CGT. When a property rises in value, refinancing to a higher loan amount at the same or lower LTV extracts the increased equity in cash, which can then be deployed as a deposit on a further purchase. Executed systematically, this strategy allows a portfolio to grow substantially without requiring large injections of new external capital.",
          "Timing refinances effectively matters. Most BTL fixed rate products carry early repayment charges (ERCs) during the initial fixed period, typically 1% to 5% of the outstanding balance. Refinancing before the fixed term expires incurs these charges, which must be weighed against the equity release benefit or rate improvement on offer. Many experienced landlords stagger their mortgage end dates across the portfolio to create a rolling programme of ERC-free refinancing opportunities each year.",
          "When refinancing for equity release, lenders will revalue the property and lend against the new value at the agreed LTV. A property purchased for £200,000 and now valued at £260,000, mortgaged at 75% LTV, would move from a loan of £150,000 to a loan of £195,000 - releasing £45,000 in cash. That £45,000, deployed as a 25% deposit on a new £180,000 property, adds another asset to the portfolio without any cash from savings. The new property's rental income then services its own mortgage, and in time further appreciation creates the next refinancing opportunity.",
        ],
      },
      {
        heading: "Portfolio Stress Testing and Lender Appetite",
        paragraphs: [
          "Lenders assessing portfolio landlords apply a portfolio-wide stress test, not just a single-property calculation. They want to see that if interest rates rise, if void periods extend, or if individual properties temporarily underperform, the portfolio as a whole continues to cover its debt service obligations. A portfolio that passes individual property ICR tests but has a narrow aggregate DSCR is a riskier proposition for a lender than one where the total income significantly exceeds total debt service.",
          "The key metric specialist lenders focus on for portfolio facilities is a minimum DSCR of 1.20x to 1.30x on the actual product rate - not the stressed rate. This means aggregate rental income, after operating costs, must exceed aggregate interest payments by 20% to 30%. Portfolios with DSCR below 1.0x on the actual rate - where rental income does not cover actual interest payments - are in negative cash flow and will face very limited lender appetite except from high-street lenders using top-slicing (supplementing rent with personal income).",
          "Lender appetite for portfolio landlords varies significantly by segment. High-street banks such as Barclays, NatWest, and Santander have retreated from complex portfolio lending and typically cap exposure at four to ten properties. Specialist lenders - Aldermore, Foundation Home Loans, Kent Reliance, Paragon, Fleet Mortgages - are more comfortable with portfolios of 10 to 50 properties and offer portfolio facilities that allow multiple properties to be refinanced under a single application. For portfolios above 20 properties or where commercial elements are included, a commercial bridging or term lender may offer a portfolio facility on commercial lending terms.",
        ],
        bullets: [
          "Minimum DSCR expected by specialist lenders: 1.20x to 1.30x on actual rate",
          "DSCR below 1.0x indicates negative cash flow - very limited lender appetite",
          "Portfolio landlord documentation: full asset schedule, EPC ratings, tenancy agreements, rent schedules",
          "High-street banks: typically cap at 4–10 properties before declining further lending",
          "Specialist BTL lenders: comfortable with 10–50 properties under portfolio submission",
          "Commercial lenders: portfolio facilities for 20+ properties or mixed residential/commercial portfolios",
        ],
      },
      {
        heading: "Debt Service Coverage Ratios and When to Deleverage",
        paragraphs: [
          "Understanding when to deleverage - deliberately reducing portfolio borrowing - is as important as knowing when to leverage up. Several triggers should prompt a serious review of whether the portfolio's debt load remains appropriate. A sustained deterioration in DSCR, driven either by rising rates or by rental income falling short of projections, is the clearest signal. A portfolio where DSCR has declined from 1.35x to 1.10x over two to three years has less resilience than at acquisition, and further deterioration could trigger lender covenant breach or force distressed asset sales.",
          "Regulatory changes also affect the deleveraging calculus. The gradual withdrawal of mortgage interest relief under Section 24 reduced effective after-tax returns for personally held leveraged portfolios, making the same LTV less viable than it was before 2017. Some landlords responded by selling higher-LTV, lower-yielding properties where the tax-adjusted DSCR had turned negative, retaining only the strongest-performing assets with more conservative leverage.",
          "Deleveraging can take several forms: selling individual properties and using proceeds to reduce debt on retained assets, directing surplus cash flow towards capital repayment rather than further acquisitions, or accepting a lower LTV on refinancing rather than maximising equity release. The decision should be made in the context of your full financial position, including the CGT cost of any disposals, the opportunity cost of retaining capital in lower-leveraged properties rather than deploying it elsewhere, and your income requirements over the medium term.",
        ],
      },
    ],
  },
};
