export interface GuideSection {
  heading: string;
  content: string[];
}

export interface Guide {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: "development-finance" | "bridging" | "mezzanine" | "equity" | "refurbishment" | "commercial" | "general";
  readingTime: string;
  datePublished: string;
  dateModified: string;
  sections: GuideSection[];
  relatedSlugs: string[];
  /** Service slugs this guide links to */
  relatedServices: string[];
  /** County slugs for internal linking */
  relatedLocations: string[];
}

function calculateReadingTime(sections: GuideSection[]): string {
  const totalWords = sections.reduce((sum, section) => {
    const headingWords = section.heading.split(/\s+/).length;
    const contentWords = section.content.reduce(
      (cSum, para) => cSum + para.split(/\s+/).length,
      0,
    );
    return sum + headingWords + contentWords;
  }, 0);
  const minutes = Math.max(1, Math.round(totalWords / 200));
  return `${minutes} min read`;
}

const GUIDES_RAW: Omit<Guide, "readingTime">[] = [
  // ─── Development Finance Guides ───
  {
    slug: "how-does-development-finance-work",
    title: "How Does Development Finance Work? A Complete Guide for UK Developers",
    metaTitle: "How Does Development Finance Work? | UK Developer Guide 2026",
    metaDescription: "Understand how development finance works in the UK — from application to drawdown. Learn about LTV, GDV, phased drawdowns, monitoring surveyors and exit strategies.",
    excerpt: "A ground-up guide to how development finance is structured in the UK, covering loan mechanics, drawdown schedules, monitoring surveyors, and what lenders look for in your application.",
    category: "development-finance",
    datePublished: "2025-09-15",
    dateModified: "2026-01-20",
    sections: [
      {
        heading: "What is development finance?",
        content: [
          "Development finance is a specialist loan product used to fund the construction of new residential or commercial property. Unlike a standard mortgage, development finance is typically structured as a short-term facility (12-24 months) with staged drawdowns that align with your build programme.",
          "The loan covers two main costs: land acquisition (or the refinancing of land you already own) and construction costs. The land element is usually advanced on day one, while build costs are released in tranches as your project progresses and is verified by an independent monitoring surveyor.",
          "Lenders assess development finance applications primarily on Gross Development Value (GDV) — the estimated total sales value of the completed scheme. The maximum loan is typically expressed as a percentage of GDV, known as Loan-to-GDV (LTGDV), which for senior debt usually ranges from 60-70%.",
        ],
      },
      {
        heading: "How drawdowns work",
        content: [
          "Development finance is not advanced in a single lump sum. Instead, funds are released in stages — known as drawdowns or tranches — as construction milestones are reached. A typical drawdown schedule might include: initial advance for land purchase, then subsequent draws at substructure completion, superstructure/first fix, second fix, and practical completion.",
          "Before each drawdown, the lender's monitoring surveyor (an independent RICS-qualified professional appointed by the lender) visits the site to verify that works have been completed to the required standard and that costs are in line with the approved budget. Only once the monitoring surveyor confirms progress does the lender release the next tranche.",
          "This phased approach protects both the lender and the developer. The lender is never overexposed to a half-built project, and the developer only pays interest on funds actually drawn — which can significantly reduce overall borrowing costs compared to a fully drawn facility.",
        ],
      },
      {
        heading: "What lenders look for in your application",
        content: [
          "Development finance lenders assess four key areas: the site and planning status, the financial viability of the scheme, the experience of the developer, and the proposed exit strategy.",
          "Planning permission is usually required before a lender will commit to a facility, although some specialist lenders will consider sites with a resolution to grant or even outline permission at higher rates. The more planning risk in your project, the higher the cost of borrowing.",
          "Your development appraisal needs to demonstrate a minimum profit margin — most lenders want to see at least 20% profit on GDV for residential schemes. Build costs need to be realistic and supported by at least two contractor tenders or a QS cost plan. Contingency of 5-10% of build costs is expected.",
          "Developer experience matters significantly. First-time developers can access development finance, but typically at lower LTVs and higher rates. Lenders want to see you have delivered similar projects before — or that you have an experienced project manager or contractor on board.",
        ],
      },
      {
        heading: "Interest rates and costs",
        content: [
          "Development finance interest rates typically start from around 6.5% per annum for experienced developers with strong schemes. Rates are usually calculated on a daily basis and rolled up (added to the loan) rather than paid monthly — meaning you don't make interest payments during the build. Instead, the total interest is repaid along with the principal when the project completes.",
          "In addition to interest, expect the following costs: arrangement fee (typically 1-2% of the facility), monitoring surveyor fees (£500-£1,500 per visit), valuation fee (from £3,000 depending on scheme size), and legal fees for both your solicitor and the lender's solicitor.",
          "The total cost of finance should be factored into your development appraisal from day one. A good broker will model the full cost of finance — including rolled-up interest, fees, and exit costs — to ensure your scheme remains viable.",
        ],
      },
      {
        heading: "Exit strategies",
        content: [
          "Every development finance facility requires a clear exit strategy — how will the loan be repaid? The three most common exits are: individual unit sales (for residential schemes), refinance onto a term loan or commercial mortgage (for retained stock), or bulk sale to an investor (for build-to-rent).",
          "Your exit strategy must be realistic and supported by evidence. If you plan to sell units, the lender will want comparable sales evidence. If refinancing, you need to demonstrate that the completed value supports the refinance amount. If selling to an investor, letters of intent or framework agreements strengthen your application.",
          "The strength of your exit strategy directly impacts the terms available. A residential scheme in a strong market with proven demand will attract better rates than a speculative commercial development in an untested location.",
        ],
      },
    ],
    relatedSlugs: ["development-finance-first-time-developer", "development-finance-vs-bridging-loan", "how-to-calculate-gdv"],
    relatedServices: ["development-finance", "mezzanine-finance"],
    relatedLocations: ["greater-london", "greater-manchester", "west-midlands"],
  },
  {
    slug: "development-finance-first-time-developer",
    title: "Development Finance for First-Time Developers: What You Need to Know",
    metaTitle: "Development Finance for First-Time Developers | UK Guide 2026",
    metaDescription: "Can first-time developers get development finance? Yes. Learn the requirements, typical LTVs, and how to strengthen your application as a new property developer in the UK.",
    excerpt: "First-time developers can access development finance — but the terms and requirements differ. This guide covers what lenders expect, how to structure your first deal, and mistakes to avoid.",
    category: "development-finance",
    datePublished: "2025-10-01",
    dateModified: "2026-01-15",
    sections: [
      {
        heading: "Can first-time developers get development finance?",
        content: [
          "Yes — but not all lenders will consider you, and those that do will apply different criteria. The development finance market includes over 100 active lenders in the UK, and approximately 30-40 of these will consider first-time developers. The key difference is that you will typically receive lower leverage (50-60% LTGDV vs 65-70% for experienced developers) and pay higher interest rates.",
          "The reason is straightforward: development is inherently risky, and experience reduces that risk. A developer who has successfully completed three similar schemes presents less risk to a lender than someone who has never managed a build programme, dealt with contractors, or navigated building regulations.",
          "However, lenders recognise that every experienced developer was once a first-time developer. What they're looking for is evidence that you've mitigated the risks associated with inexperience.",
        ],
      },
      {
        heading: "How to strengthen your first application",
        content: [
          "The single most impactful thing you can do as a first-time developer is appoint an experienced project manager or use a design-and-build contractor with a proven track record. This shifts the construction risk from you to a professional who has delivered similar projects. Many lenders will treat a first-time developer with an experienced contractor more favourably than one planning to self-manage the build.",
          "Start with a straightforward scheme. A 2-4 unit residential development with full planning permission is the ideal first project. Avoid complex schemes (basement excavations, listed buildings, commercial conversions) until you have a track record. Lenders want to see that your first project is deliverable.",
          "Have more equity than the minimum. If the lender asks for 40% equity, try to bring 45-50%. The extra equity provides a buffer that makes lenders more comfortable, and it demonstrates that you have meaningful financial commitment to the project's success.",
          "Prepare a comprehensive development appraisal using industry-standard software (Argus Developer or similar). Include realistic build costs supported by at least two contractor quotes, a detailed programme, and conservative sales assumptions. First-time developers who present institutional-quality appraisals stand out.",
        ],
      },
      {
        heading: "What to expect on your first deal",
        content: [
          "Interest rates for first-time developers typically range from 8-12% per annum, compared to 6.5-9% for experienced developers. Arrangement fees are usually at the higher end of the range (1.5-2%). Some lenders will also require a personal guarantee, which is common for first-time developers.",
          "The monitoring surveyor will likely visit more frequently — monthly rather than at milestone stages. This isn't a sign of distrust; it's the lender being appropriately careful with a borrower who hasn't managed a build before.",
          "Expect the process to take longer. A first-time developer application typically takes 4-8 weeks from submission to drawdown, compared to 2-4 weeks for an experienced developer with an existing lender relationship. Use this time productively by finalising contractor appointments and preparing for site mobilisation.",
        ],
      },
      {
        heading: "Common mistakes first-time developers make",
        content: [
          "Underestimating build costs is the most common error. Professional developers build in 5-10% contingency because unexpected costs always arise — ground conditions, material price increases, programme delays. First-time developers often present the most optimistic cost projection, which makes lenders nervous.",
          "Ignoring planning conditions. Full planning permission doesn't mean unconditional. Pre-commencement conditions (archaeological surveys, drainage strategies, construction management plans) must be discharged before you can start on site. Failing to factor in the time and cost of discharging conditions can delay your project.",
          "Choosing the cheapest contractor. The lowest quote is not always the best value. An experienced contractor who costs 10% more but delivers on time and to specification is worth more than a cheap contractor who causes delays and quality issues that affect your sales values.",
        ],
      },
    ],
    relatedSlugs: ["how-does-development-finance-work", "how-to-calculate-gdv", "development-finance-vs-bridging-loan"],
    relatedServices: ["development-finance"],
    relatedLocations: ["kent", "essex", "surrey"],
  },
  {
    slug: "development-finance-vs-bridging-loan",
    title: "Development Finance vs Bridging Loan: Which Do You Need?",
    metaTitle: "Development Finance vs Bridging Loan — Key Differences Explained",
    metaDescription: "Development finance and bridging loans serve different purposes. Compare costs, timelines, LTVs and use cases to choose the right funding for your UK property project.",
    excerpt: "Both fund property deals, but they're structured very differently. This guide explains when to use development finance, when a bridging loan makes more sense, and how costs compare.",
    category: "general",
    datePublished: "2025-08-20",
    dateModified: "2026-02-01",
    sections: [
      {
        heading: "The fundamental difference",
        content: [
          "Development finance funds construction — it's designed for projects where you're building something new or substantially altering an existing structure. Bridging loans fund acquisitions — they're designed for purchasing property quickly, usually with an exit strategy to refinance or sell.",
          "This matters because the loan mechanics are completely different. Development finance involves phased drawdowns aligned to a build programme, with an independent monitoring surveyor overseeing progress. Bridging loans are typically advanced as a single lump sum on completion of the purchase.",
          "If your project involves significant building works (ground-up development, structural conversions, major refurbishment), you need development finance. If you're buying a property that needs little or no work — or light cosmetic refurbishment — a bridging loan is appropriate.",
        ],
      },
      {
        heading: "Cost comparison",
        content: [
          "On a headline basis, bridging loans appear more expensive. Monthly rates of 0.55-1.0% equate to 6.6-12% annualised — broadly similar to development finance. But the total cost equation is different because of how interest accrues.",
          "With development finance, you only pay interest on funds drawn. If your total facility is £2M but you've only drawn £500K in month one, you pay interest on £500K. By month six you might have drawn £1.2M. This phased accrual means the actual interest cost is significantly lower than if you'd borrowed the full amount from day one.",
          "With a bridging loan, you borrow the full amount upfront and pay interest from day one on the entire balance. For a 12-month £1M bridge at 0.75% monthly, total interest is £90,000. A £1M development finance facility drawn over 12 months with an average balance of £650,000 at 8% annual costs approximately £52,000 in interest.",
          "However, development finance has higher arrangement fees (typically 1.5-2% vs 1-1.5% for bridging) and the cost of monitoring surveyor visits (£500-£1,500 each). Factor in all costs when comparing.",
        ],
      },
      {
        heading: "Speed of completion",
        content: [
          "Bridging loans are faster. Specialist bridging lenders can complete in 5-14 days, with some offering same-day completion for repeat borrowers. This speed makes bridging essential for auction purchases (28-day completion deadline) and competitive acquisitions.",
          "Development finance takes longer — typically 3-6 weeks from application to first drawdown. The lender needs to instruct a valuation, review your build costs and programme, appoint a monitoring surveyor, and complete legal due diligence. This timeline is appropriate because the lender is committing to a multi-month facility with ongoing drawdowns.",
          "If you need to secure a site quickly but plan to develop it, a common strategy is to use a bridging loan for the acquisition, then refinance into a development finance facility once planning and pre-construction work is complete. The bridging loan buys you time; the development finance funds the build.",
        ],
      },
      {
        heading: "When to use each product",
        content: [
          "Use development finance when: you're building new homes, converting commercial to residential, carrying out heavy structural refurbishment, or any project with a build programme exceeding 3 months and significant construction costs.",
          "Use a bridging loan when: you're buying at auction, securing a site ahead of planning, purchasing below market value for quick resale, funding a gap between selling one property and buying another, or carrying out light refurbishment (cosmetic upgrades, new kitchen/bathroom, redecoration).",
          "Use both when: you need to acquire a site quickly (bridge for the purchase) and then develop it (development finance for the build). This two-stage approach is common and many brokers will arrange both facilities simultaneously with different lenders.",
        ],
      },
    ],
    relatedSlugs: ["how-does-development-finance-work", "bridging-loan-auction-purchases", "mezzanine-vs-equity-jv"],
    relatedServices: ["development-finance", "bridging-loans"],
    relatedLocations: ["greater-london", "west-yorkshire", "edinburgh"],
  },
  // ─── Bridging Loan Guides ───
  {
    slug: "bridging-loan-auction-purchases",
    title: "Using a Bridging Loan to Buy at Auction: A Step-by-Step Guide",
    metaTitle: "Bridging Loan for Auction Purchases | UK Property Guide 2026",
    metaDescription: "How to use a bridging loan to buy property at auction in the UK. Learn about pre-approval, completion deadlines, costs and exit strategies for auction purchases.",
    excerpt: "Buying at auction requires completing within 28 days. Bridging loans are the go-to funding solution. This guide covers how to get pre-approved, what it costs, and how to plan your exit.",
    category: "bridging",
    datePublished: "2025-11-10",
    dateModified: "2026-01-28",
    sections: [
      {
        heading: "Why bridging loans and auctions go together",
        content: [
          "When you buy at auction, the fall of the gavel creates a legally binding contract. You pay a 10% deposit on the day and must complete the purchase within 28 days (20 working days). Fail to complete and you lose your deposit — typically £20,000-£100,000+ depending on the lot.",
          "Conventional mortgages cannot move this quickly. Even the fastest high-street lenders take 4-6 weeks. Specialist bridging lenders, by contrast, routinely complete in 7-14 days, well within the auction deadline.",
          "The key is preparation. You should not bid at auction hoping to arrange finance afterwards. The best approach is to get a Decision in Principle (DIP) from a bridging lender before the auction, based on the catalogue details and your financial position. This gives you confidence to bid knowing that finance is available.",
        ],
      },
      {
        heading: "Pre-auction preparation",
        content: [
          "Before the auction, instruct your broker to obtain DIPs from 2-3 bridging lenders. The DIP is not a binding offer — it's an indication that the lender is willing to lend on the property type and value, subject to valuation and legal due diligence.",
          "Commission your own survey before bidding. The legal pack is available from the auction house before the sale — have your solicitor review it and flag any issues (restrictive covenants, short leases, chancel repair liability). Legal issues discovered after the auction can delay completion or kill the deal entirely.",
          "Set your maximum bid based on a realistic assessment of the property's current value, your refurbishment/development costs, and the end value. Include all financing costs — bridging interest, arrangement fee, valuation, legal fees, and your exit costs — in this calculation. The worst auction purchases are ones where the buyer overbids because they got caught up in the room.",
        ],
      },
      {
        heading: "Costs and typical terms",
        content: [
          "Bridging loans for auction purchases typically carry rates of 0.55-0.85% per month, depending on the property type, LTV, and your experience. Maximum LTV is usually 70-75% of the purchase price, meaning you need the 10% auction deposit plus another 15-20% in equity.",
          "Arrangement fees range from 1-2% of the loan amount. Add valuation fees (£500-£3,000 depending on property value), lender legal fees (£1,000-£2,500), and your own solicitor's fees. Total setup costs typically amount to 3-5% of the loan amount.",
          "Interest is usually retained (deducted from the loan advance) or rolled up (added to the balance). Retained interest means you don't make monthly payments but the usable loan amount is reduced. Rolled-up interest means you receive the full loan but repay more at the end.",
        ],
      },
      {
        heading: "Exit strategy planning",
        content: [
          "Your exit strategy is the single most important element of an auction bridging loan. The lender will not advance funds unless you can demonstrate a clear, achievable exit within the loan term (typically 6-12 months).",
          "Common exit strategies include: refinance onto a buy-to-let mortgage (if retaining as investment), sale of the property after refurbishment (if adding value), or development finance to fund a conversion or development (if the property has development potential).",
          "If your exit is refinancing, ensure the end value supports the refinance amount. If your exit is sale, ensure comparable sales evidence supports your projected sale price. If your exit is development finance, have your development appraisal ready and ideally a DIP from a development lender.",
        ],
      },
    ],
    relatedSlugs: ["development-finance-vs-bridging-loan", "how-does-development-finance-work"],
    relatedServices: ["bridging-loans", "refurbishment-finance"],
    relatedLocations: ["greater-london", "essex", "kent"],
  },
  // ─── Mezzanine & Equity Guides ───
  {
    slug: "mezzanine-vs-equity-jv",
    title: "Mezzanine Finance vs Joint Venture Equity: How to Choose",
    metaTitle: "Mezzanine Finance vs JV Equity — Which Is Right for Your Deal?",
    metaDescription: "Compare mezzanine finance and JV equity for UK property development. Understand cost structures, control implications, and when each capital solution makes sense.",
    excerpt: "Both mezzanine and JV equity reduce the cash you need to invest. But they work very differently and suit different situations. This guide helps you decide which is right for your project.",
    category: "mezzanine",
    datePublished: "2025-10-15",
    dateModified: "2026-01-10",
    sections: [
      {
        heading: "How mezzanine finance works",
        content: [
          "Mezzanine finance is a loan that sits behind your senior development finance in the capital stack. Where senior debt might cover 60-65% of GDV, mezzanine stretches total borrowing to 80-90% of costs. It reduces the equity you need to inject from 35-40% to as little as 10-15%.",
          "The critical feature of mezzanine is that it's debt, not equity. The mezzanine lender has no ownership stake in your project and no share of your profits. They charge a fixed interest rate (typically 12-18% per annum) and an arrangement fee (2-3%). Your profit is yours to keep.",
          "The trade-off is that mezzanine comes with an intercreditor agreement — a legal document that governs the relationship between the senior lender and the mezzanine lender. The senior lender has priority on repayment; the mezzanine lender is repaid after the senior debt is cleared. This subordinated position is why mezzanine costs more than senior debt.",
        ],
      },
      {
        heading: "How JV equity works",
        content: [
          "Joint venture equity is an investment, not a loan. A JV partner contributes capital (sometimes the full equity requirement) in exchange for a share of the project's profits. Typical splits range from 50/50 to 60/40 (investor/developer), depending on who is contributing what.",
          "In a typical JV structure, the developer contributes the site (or site knowledge and planning), project management expertise, and day-to-day execution. The equity partner contributes the cash needed alongside senior debt. The developer does the work; the investor provides the capital.",
          "JV equity is not on your balance sheet as debt. It's a partnership, and the equity provider shares both the upside and the downside. If the project generates less profit than expected, the equity partner's return decreases proportionally. If it generates more, they share in the upside.",
        ],
      },
      {
        heading: "Cost comparison — which is cheaper?",
        content: [
          "On the surface, mezzanine looks more expensive: 12-18% per annum vs a profit share of 40-60%. But the real comparison depends on your project's profitability.",
          "Take a £5M GDV scheme with £1.5M senior debt, requiring £500K additional capital. With mezzanine at 15% over 14 months, the cost is approximately £87,500. With JV equity providing £500K for a 50/50 profit share on a scheme generating £1M profit, the cost is £500,000. Mezzanine is dramatically cheaper on a profitable scheme.",
          "However, if the scheme makes only £200K profit (cost overruns, market downturn), mezzanine still costs £87,500 — eating 44% of your profit. The JV partner's share would be £100K. When profits are thin, JV can be less painful because the pain is shared.",
          "The rule of thumb: if you're confident in your scheme's profitability and want to maximise your return, use mezzanine. If you want to share risk and are willing to share reward, use JV equity.",
        ],
      },
      {
        heading: "Control and decision-making",
        content: [
          "Mezzanine lenders have no say in how you run your project. They don't attend your site meetings, approve your contractor appointments, or influence your sales strategy. They lend money and expect it back with interest. Your project, your decisions.",
          "JV equity partners typically want involvement. The degree varies — some are entirely passive (\"silent partners\" who contribute capital and wait for returns), while others want board seats, approval rights over key decisions (contractor selection, sales pricing, design changes), and regular reporting.",
          "Before entering a JV, negotiate the governance structure carefully. A well-drafted JV agreement specifies exactly what the developer can decide unilaterally and what requires partner approval. Getting this wrong creates friction that can delay your project and damage your relationship.",
        ],
      },
    ],
    relatedSlugs: ["how-does-development-finance-work", "development-finance-first-time-developer", "how-to-calculate-gdv"],
    relatedServices: ["mezzanine-finance", "equity-jv"],
    relatedLocations: ["greater-manchester", "west-midlands", "south-yorkshire"],
  },
  // ─── Technical Guides ───
  {
    slug: "how-to-calculate-gdv",
    title: "How to Calculate GDV: Gross Development Value Explained",
    metaTitle: "How to Calculate GDV (Gross Development Value) | Developer Guide",
    metaDescription: "Learn how to calculate Gross Development Value (GDV) for your UK property development. Includes methods, comparable evidence, RICS Red Book valuations and lender requirements.",
    excerpt: "GDV is the single most important number in your development appraisal. Get it wrong and your project fails. This guide explains how lenders, valuers, and experienced developers calculate GDV.",
    category: "general",
    datePublished: "2025-09-01",
    dateModified: "2026-01-25",
    sections: [
      {
        heading: "What is GDV?",
        content: [
          "Gross Development Value (GDV) is the total market value of a completed development. For a residential scheme, it's the sum of all individual unit sales. For a commercial development, it's the investment value based on the capitalised rental income. For a mixed-use scheme, it's both combined.",
          "GDV determines everything: how much you can borrow, whether your scheme is viable, and ultimately whether you make a profit. Development finance lenders express their maximum loan as a percentage of GDV (LTGDV) — typically 60-70% for senior debt. A £5M GDV scheme at 65% LTGDV generates a maximum facility of £3.25M.",
          "This is why getting GDV right is critical. Overestimate GDV and you'll borrow too much, build a scheme that doesn't stack, and potentially default on your facility. Underestimate it and you'll leave money on the table or fail to secure adequate funding.",
        ],
      },
      {
        heading: "Calculating residential GDV",
        content: [
          "For residential developments, GDV is calculated using comparable sales evidence — recent sales of similar properties in the same area. The key word is 'comparable'. A new-build 3-bed semi in a suburban development is not comparable to a period 3-bed semi in an established street, even if they have the same number of bedrooms.",
          "The most reliable comparables are: new-build sales by other developers in the immediate area (within 0.5 miles), recently completed schemes of similar specification, and Land Registry data for the specific postcode sector. Adjust for differences in specification, garden size, parking, and aspect.",
          "Apply a per-square-foot rate to your proposed scheme. If comparable new builds in the area sell at £350/sq ft and your units average 850 sq ft, each unit is worth approximately £297,500. For a 12-unit scheme, GDV is £3.57M. Always sense-check this against the market — are there enough buyers at this price point in this location?",
        ],
      },
      {
        heading: "The RICS Red Book valuation",
        content: [
          "Your lender will instruct a RICS-registered valuer to provide a formal Red Book valuation of your site and proposed scheme. This valuation is independent of your own GDV estimate and is the figure the lender will use to calculate your maximum facility.",
          "The valuer will assess: the site in its current condition (the 'site value'), the completed development value (the GDV), the build costs and programme, and the developer's profit margin. They may disagree with your GDV estimate — and their figure is the one that matters to the lender.",
          "If the valuer comes in significantly below your estimate, it doesn't necessarily mean your scheme is unviable. It may mean the valuer has used more conservative comparables, applied a different per-square-foot rate, or made different assumptions about specification. You can challenge a valuation with additional evidence, but ultimately the lender relies on their appointed valuer.",
        ],
      },
      {
        heading: "Common GDV mistakes",
        content: [
          "Using asking prices rather than achieved prices. Estate agent asking prices are aspirational — they're the price the agent hopes to achieve, not what buyers actually pay. Always use Land Registry sold prices or verified sales data from property portals.",
          "Comparing to different property types. A converted flat is not comparable to a new-build flat. A terraced house is not comparable to a detached house. A garden flat is not comparable to a top-floor flat. The more specific your comparables, the more credible your GDV.",
          "Ignoring new supply. If another developer is building 200 new homes in the same postcode, their scheme will absorb buyer demand. Your sales rate and achievable prices may be lower than current comparable evidence suggests. Lenders and valuers check planning applications for competing schemes.",
          "Applying London or South East values to regional markets. A developer who achieves £500/sq ft in Surrey should not expect the same in Staffordshire. Regional price differentials are well-established and lenders will immediately flag unrealistic GDV assumptions.",
        ],
      },
    ],
    relatedSlugs: ["how-does-development-finance-work", "development-finance-first-time-developer"],
    relatedServices: ["development-finance", "mezzanine-finance", "equity-jv"],
    relatedLocations: ["greater-london", "surrey", "hertfordshire"],
  },
  // ─── Refurbishment Guide ───
  {
    slug: "light-vs-heavy-refurbishment-finance",
    title: "Light vs Heavy Refurbishment Finance: Which Do You Need?",
    metaTitle: "Light vs Heavy Refurbishment Finance | UK Property Guide 2026",
    metaDescription: "Understand the difference between light and heavy refurbishment finance in the UK. Compare costs, LTVs, timelines and when each product applies to your renovation project.",
    excerpt: "Refurbishment finance comes in two forms — light and heavy — with different rates, LTVs and requirements. This guide explains the distinction and helps you choose the right product.",
    category: "refurbishment",
    datePublished: "2025-11-20",
    dateModified: "2026-02-05",
    sections: [
      {
        heading: "Defining light and heavy refurbishment",
        content: [
          "Light refurbishment covers cosmetic and non-structural works: new kitchens, bathrooms, redecoration, flooring, garden landscaping, and minor repairs. The property remains habitable throughout (or nearly so), and planning permission is not required. Works typically cost under 15% of the property's current value.",
          "Heavy refurbishment involves structural alterations, change of use, or works requiring planning permission: converting a house into flats, adding extensions, loft conversions with structural steel, removing or adding walls, rewiring, replumbing, and underpinning. Works typically cost 15-50% or more of the property's current value.",
          "The distinction matters because lenders treat these as fundamentally different products. Light refurbishment is closer to a standard bridging loan; heavy refurbishment is closer to development finance with phased drawdowns and monitoring.",
        ],
      },
      {
        heading: "Light refurbishment — terms and process",
        content: [
          "Light refurbishment finance is typically priced at 0.55-0.85% per month with LTVs up to 75% of the purchase price. The full loan is usually advanced on day one — there are no phased drawdowns because the works are minor and don't significantly change the property's risk profile.",
          "The process is fast: application to completion in 7-21 days. The lender instructs a desktop or drive-by valuation (rather than a full RICS survey), and legal due diligence is lighter. Some lenders offer automated valuations for properties under £500K, enabling same-week completion.",
          "Exit strategies include: refinance onto a buy-to-let mortgage at the improved value, or sale at the improved price. Light refurbishment is the classic 'buy, refurb, refinance' (BRR) strategy used by portfolio landlords and property investors.",
        ],
      },
      {
        heading: "Heavy refurbishment — terms and process",
        content: [
          "Heavy refurbishment finance is priced at 0.65-1.0% per month (or 8-14% per annum) with LTVs up to 70-75% of the end value (GDV). Like development finance, the loan is drawn in phases: an initial advance for the purchase, then subsequent drawdowns as construction milestones are met.",
          "A monitoring surveyor is appointed to verify works at each stage. The process takes 3-6 weeks from application to first drawdown, similar to development finance. You'll need a detailed schedule of works, contractor quotes, and a realistic programme.",
          "Planning permission must be in place before the lender will commit to heavy refurbishment finance. If you're converting commercial to residential under permitted development rights, you'll need the prior approval certificate. If structural works require Building Regulations approval, this should be in progress.",
        ],
      },
      {
        heading: "Choosing the right product",
        content: [
          "If your works are cosmetic only and cost under 15% of the property value, use light refurbishment finance. It's faster, cheaper, and simpler.",
          "If your works involve structural changes, change of use, or cost over 15% of the property value, use heavy refurbishment finance. Trying to fund heavy works with a light refurb product will create problems — the lender may call in the loan if they discover structural works underway that weren't disclosed.",
          "If your project involves demolition and rebuild, you need development finance rather than refurbishment finance. The line between heavy refurbishment and development is not always clear — generally, if you're retaining less than 50% of the original structure, it's classified as development rather than refurbishment.",
        ],
      },
    ],
    relatedSlugs: ["development-finance-vs-bridging-loan", "how-does-development-finance-work"],
    relatedServices: ["refurbishment-finance", "bridging-loans"],
    relatedLocations: ["greater-london", "west-midlands", "lancashire"],
  },
  // ─── Commercial Mortgage Guide ───
  {
    slug: "commercial-mortgage-guide-uk",
    title: "Commercial Mortgages in the UK: A Complete Guide",
    metaTitle: "Commercial Mortgage Guide UK | Rates, LTV & Requirements 2026",
    metaDescription: "Complete guide to UK commercial mortgages. Covers eligibility, rates from 5.5%, LTVs up to 75%, property types, and how rental coverage ratios work.",
    excerpt: "Everything you need to know about commercial mortgages in the UK — from eligibility criteria and rental coverage ratios to how lenders value multi-let properties and what lease length matters.",
    category: "commercial",
    datePublished: "2025-12-01",
    dateModified: "2026-02-01",
    sections: [
      {
        heading: "What is a commercial mortgage?",
        content: [
          "A commercial mortgage is a long-term loan secured against a commercial or semi-commercial property. Unlike development finance or bridging loans, commercial mortgages are designed for holding — you're buying or refinancing a property to generate rental income over a period of years, not months.",
          "Commercial mortgages fund a wide range of property types: offices, retail units, industrial warehouses, pubs and restaurants, care homes, hotels, and mixed-use buildings with both commercial and residential elements. Terms typically range from 3-25 years, with interest rates from around 5.5% per annum.",
          "The key difference from residential mortgages is that commercial lenders assess the property's income-generating ability, not just the borrower's personal income. Rental coverage ratio (how comfortably the rent covers the mortgage payments) is the primary affordability metric.",
        ],
      },
      {
        heading: "How rental coverage ratio works",
        content: [
          "Rental Coverage Ratio (RCR), also known as Interest Cover Ratio (ICR), is the relationship between the property's annual rental income and the annual mortgage interest payments. Lenders typically require an RCR of 125-200%, meaning the rent must be 1.25-2.0x the interest payments.",
          "For example: a property generating £50,000 per annum in rent with a mortgage interest cost of £30,000 per annum has an RCR of 167%. Most lenders would be comfortable with this level of cover.",
          "Multi-let properties (offices, retail parades, industrial estates) are assessed on the weighted average rental income, accounting for any vacant units. If 2 out of 10 units are vacant, the lender may calculate RCR on 80% of the potential income — or they may stress-test using the current income only.",
          "Lease length matters significantly. Lenders prefer properties with long, secure leases (5+ years remaining) from creditworthy tenants. A single-let warehouse with 15 years remaining to a PLC tenant is much easier to finance than a multi-let office with 6-month rolling tenancies.",
        ],
      },
      {
        heading: "Property types and lender appetite",
        content: [
          "Standard commercial property types (offices, industrial, retail with established tenants) attract the widest range of lenders and the best terms. Rates from 5.5% per annum, LTVs up to 75%.",
          "Semi-commercial (mixed-use) properties — typically a shop or office with a residential flat above — are widely available from both high-street banks and specialist lenders. The residential element often improves the lending proposition because it provides a diversified income stream.",
          "Specialist property types (pubs, hotels, care homes, petrol stations) require specialist lenders who understand the operating business as well as the property. These are assessed as going concerns — the lender evaluates the business performance, not just the bricks and mortar. Rates are typically higher (7-10%) and LTVs lower (50-65%).",
          "Development sites, land without buildings, and properties with significant planning potential are not suitable for commercial mortgages. These require development finance or bridging loans.",
        ],
      },
      {
        heading: "Fixed vs variable rates",
        content: [
          "Commercial mortgage rates are available as fixed or variable. Fixed rates provide certainty of payments for a set period (typically 2-5 years), after which the loan reverts to the lender's standard variable rate. Variable rates track Bank of England base rate plus a margin.",
          "Fixed rates are generally 0.5-1.0% higher than equivalent variable rates, reflecting the cost to the lender of guaranteeing your rate. In a rising rate environment, fixing early provides protection. In a falling rate environment, variable rates become more attractive.",
          "Consider your investment horizon. If you plan to hold the property for 10+ years and want payment certainty, fix for the longest available period. If you might sell or refinance within 2-3 years, a variable rate avoids early repayment charges that apply when breaking a fixed-rate deal.",
        ],
      },
    ],
    relatedSlugs: ["development-finance-vs-bridging-loan", "how-does-development-finance-work"],
    relatedServices: ["commercial-mortgages"],
    relatedLocations: ["greater-london", "greater-manchester", "west-midlands", "edinburgh"],
  },
];

export const GUIDES: Guide[] = GUIDES_RAW.map((guide) => ({
  ...guide,
  readingTime: calculateReadingTime(guide.sections),
}));

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function getRelatedGuides(currentSlug: string): Guide[] {
  const current = getGuideBySlug(currentSlug);
  if (!current) return [];
  return current.relatedSlugs
    .map((s) => getGuideBySlug(s))
    .filter((g): g is Guide => g !== undefined);
}
