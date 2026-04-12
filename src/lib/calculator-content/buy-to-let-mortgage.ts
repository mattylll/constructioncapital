import type { CalculatorContent } from "./types";

export const content: CalculatorContent = {
  howItWorks: {
    title: "How Buy-to-Let Mortgage Calculations Work",
    paragraphs: [
      "Buy-to-let mortgages are assessed differently from residential home loans. Whereas a residential mortgage is primarily sized against the borrower's personal income, a buy-to-let mortgage is sized against the rental income the property generates relative to the mortgage interest payment. This ratio is called the Interest Coverage Ratio (ICR), and it is the central metric every BTL lender applies.",
      "The ICR tells a lender how many times over the rental income covers the mortgage interest cost. A property generating £1,200 per month in rent against an interest charge of £700 per month has an ICR of 1.71x - that is, rent covers interest 1.71 times. Lenders do not assess ICR against the actual product rate, however. They stress-test it against a higher notional rate to ensure borrowers can sustain the mortgage if rates rise.",
      "This calculator works backwards from your rental income (or forwards from a proposed loan amount) to show you the maximum borrowing available under standard ICR stress tests, and to model your monthly interest payment at different rate scenarios. You can compare interest-only and repayment structures and see how product rate changes affect affordability.",
      "The results are indicative rather than a formal mortgage offer. Actual borrowing capacity depends on lender-specific criteria, property type, your tax status, and whether you are borrowing personally or through a limited company. Use these figures as a planning tool and speak with a specialist BTL broker before committing to a purchase.",
    ],
  },
  guide: {
    title: "Buy-to-Let Mortgages: PRA Stress Tests, ICR Rules, and Product Choice",
    sections: [
      {
        heading: "PRA Stress Test Rules and ICR Requirements",
        paragraphs: [
          "The Prudential Regulation Authority (PRA) introduced standardised underwriting standards for buy-to-let mortgages in January 2017, fundamentally changing how lenders assess affordability. Before these rules, lenders set their own ICR floors and stress rates, leading to considerable variation in the market. The PRA rules created a baseline that all regulated BTL lenders must apply, though many lenders apply criteria that are stricter still.",
          "Under PRA rules, lenders must stress-test BTL affordability at the higher of the product rate plus 2%, or 5.5%, whichever is greater. For basic rate (20%) taxpayers holding property in their personal name, the ICR floor is 125% - meaning rent must cover 125% of the stressed interest cost. For higher rate (40%) and additional rate (45%) taxpayers, most lenders apply a stricter ICR of 145%, reflecting the reduced after-tax benefit of mortgage interest under Section 24.",
          "In practice, most mainstream lenders use 145% at a 5.5% stress rate as their standard test, regardless of tax rate, because it provides a consistent and conservative underwriting standard. Some specialist lenders and challenger banks apply slightly different tests - particularly for portfolio landlords or limited company borrowers - so working with a whole-of-market broker who understands the nuances across lenders is important when you are close to the affordability boundary.",
        ],
        bullets: [
          "Standard stress rate: higher of (product rate + 2%) or 5.5%",
          "Basic rate taxpayer ICR: minimum 125% of stressed interest",
          "Higher/additional rate taxpayer ICR: typically 145% of stressed interest",
          "Example: £150,000 loan at 5.5% stress rate = £8,250 annual interest. At 145% ICR, minimum required annual rent = £11,963 (£997/month)",
          "Some lenders apply top-slicing - allowing personal income to supplement rent - for borrowers with high earned incomes",
          "New-build properties and flats above commercial premises often face additional lender restrictions",
        ],
      },
      {
        heading: "Limited Company vs Personal Name: Which Structure Is Right?",
        paragraphs: [
          "The question of whether to hold buy-to-let property personally or through a Special Purpose Vehicle (SPV) limited company is one of the most consequential decisions a landlord makes, and the answer depends heavily on individual tax circumstances, existing portfolio size, and long-term objectives.",
          "The primary driver of the shift towards limited company ownership in recent years is Section 24. As described in the rental yield guide, Section 24 restricts mortgage interest relief for personally held properties to a 20% basic rate credit, regardless of the landlord's marginal tax rate. Limited companies are not subject to this restriction - they continue to treat mortgage interest as a deductible business expense and pay corporation tax only on genuine profit. With the current corporation tax rate at 25% for profits above £250,000 (and 19% for profits below £50,000 under small profits relief), this creates a meaningful advantage for higher rate taxpaying landlords with significant debt.",
          "The disadvantages of company ownership are real, however. BTL mortgage rates in limited company names are typically 0.3% to 0.8% higher than equivalent personal-name products, which erodes some of the tax saving. Transferring existing personally held properties into a company triggers SDLT on the company acquisition and potentially CGT on the individual's disposal - making restructuring expensive unless done at an early stage. Extracting profit from a company as salary or dividend attracts personal tax, meaning the tax deferral benefit depends on whether you need the income now or can leave it to compound within the company.",
        ],
        bullets: [
          "Limited company (SPV): mortgage interest fully deductible, corporation tax on profit, higher mortgage rates, complexity",
          "Personal name: subject to Section 24, simpler administration, access to wider product range, lower mortgage rates",
          "New investors starting from scratch: limited company SPV is often more tax-efficient from day one",
          "Existing landlords with large personal portfolios: transferring to company is usually cost-prohibitive without specialist advice",
          "Mortgage lenders for limited company BTL: specialist and challenger banks dominate; fewer high-street options",
          "Always take advice from a tax accountant and specialist BTL broker before making structural decisions",
        ],
      },
      {
        heading: "Fixed Rate, Tracker, and Discount Products",
        paragraphs: [
          "BTL mortgage products broadly follow the same structures as residential mortgages: fixed rates that hold constant for a defined initial period, tracker rates that move in line with the Bank of England base rate plus a margin, and discount rates that sit below the lender's standard variable rate. The right choice depends on your risk appetite, cash flow requirements, and view on the interest rate outlook.",
          "Fixed rate products - typically available over two, three, or five year initial periods - provide certainty of cost. For landlords running properties on thin margins, the predictability of a fixed rate facilitates accurate cash flow planning and removes exposure to rate rises during the fixed term. The trade-off is that you will not benefit from rate reductions, and early repayment charges (ERCs) can be significant if you need to exit the product before the fixed term ends.",
          "Tracker products move in line with the base rate and are priced as base rate plus a margin - for example, base rate plus 1.5%. When the base rate falls, so does your mortgage payment. When it rises, costs increase accordingly. Trackers are typically available with either no ERCs or lower ERCs than equivalent fixed products, making them more suitable for investors who anticipate selling or refinancing within the initial period. Some tracker products include a rate floor, meaning they cannot fall below a minimum level even if the base rate drops significantly.",
        ],
      },
      {
        heading: "Portfolio Landlord Rules and Green Mortgage Incentives",
        paragraphs: [
          "Since September 2017, the PRA has required lenders to apply enhanced underwriting standards to borrowers with four or more mortgaged buy-to-let properties - the so-called 'portfolio landlord' definition. These rules require lenders to assess the entire portfolio's performance, not just the property being mortgaged, before approving a new loan. In practice, this means providing a full schedule of your existing properties, their rental incomes, mortgage balances, and valuations.",
          "Portfolio landlord underwriting is more intensive and can be more restrictive than standard BTL underwriting. Some high-street lenders have exited the portfolio landlord market entirely, leaving specialist lenders and commercial-minded challenger banks as the primary source of lending above four properties. Maintaining clean, organised portfolio documentation - rent schedules, mortgage statements, property valuations - significantly smooths the application process and improves the speed and quality of offers.",
          "Green mortgages have emerged as an increasingly relevant product category for buy-to-let landlords, driven by lender ESG commitments and regulatory pressure to improve the energy efficiency of the rental sector. Properties with an Energy Performance Certificate (EPC) rating of A, B, or C can access preferential rates from a growing number of lenders - typically 0.1% to 0.3% lower than equivalent products for less energy-efficient stock. Given the government's direction of travel on minimum EPC requirements for rental properties, investing in energy efficiency improvements not only unlocks better mortgage terms now but positions the portfolio against future regulatory risk.",
        ],
        bullets: [
          "Portfolio landlord threshold: 4 or more mortgaged BTL properties",
          "Portfolio landlord assessment: lenders review the whole portfolio's ICR, not just the subject property",
          "Key documentation needed: full property schedule, mortgage statements, EPC certificates, AST agreements",
          "Specialist lenders (not high-street banks) are the primary source for portfolio landlords with 10+ properties",
          "Green mortgage discount: typically 0.1–0.3% rate reduction for EPC A/B/C properties",
          "Planned minimum EPC C requirement for new tenancies makes energy upgrades both commercially and regulatorily sensible",
        ],
      },
    ],
  },
};
