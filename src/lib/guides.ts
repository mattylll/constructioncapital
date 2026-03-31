export type GuideCategory =
  | "development-finance"
  | "bridging"
  | "mezzanine"
  | "equity"
  | "refurbishment"
  | "commercial"
  | "general"
  | "hidden-fees"
  | "defaults"
  | "valuations"
  | "legal"
  | "application"
  | "structuring"
  | "market";

export interface GuideSection {
  heading: string;
  content: string[];
}

export interface GuideFAQ {
  question: string;
  answer: string;
}

export interface Guide {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: GuideCategory;
  readingTime: string;
  datePublished: string;
  dateModified: string;
  relatedServices: string[];
  relatedLocations: string[];
  relatedGuides: string[];
  sections: GuideSection[];
  faqs: GuideFAQ[];
}

export const GUIDES: Guide[] = [
  // --- Comparison Guide 1 ---
  {
    slug: "development-finance-vs-bridging-loans",
    title: "Development Finance vs Bridging Loans: Which Do You Need?",
    metaTitle:
      "Development Finance vs Bridging Loans | Key Differences Explained",
    metaDescription:
      "Compare development finance and bridging loans side by side. Rates, terms, LTV, use cases and when to choose each for your UK property project.",
    excerpt:
      "Two of the most common short-term property finance products, but they serve very different purposes. We break down the rates, terms, and scenarios where each makes sense.",
    category: "development-finance",
    readingTime: "8 min read",
    datePublished: "2026-03-31",
    dateModified: "2026-03-31",
    relatedServices: ["development-finance", "bridging-loans"],
    relatedLocations: ["greater-london", "greater-manchester", "west-midlands"],
    relatedGuides: [
      "refurbishment-finance-vs-development-finance",
      "bank-vs-specialist-development-finance",
    ],
    sections: [
      {
        heading: "What Is Development Finance?",
        content: [
          "Development finance is senior debt structured specifically for ground-up construction or heavy conversion projects. It covers land acquisition and build costs, with funds released in staged drawdowns as your project hits construction milestones verified by a monitoring surveyor.",
          "Typical terms range from 12 to 24 months, with interest rates from 6.5% per annum. Lenders will fund up to 65\u201370% of the Gross Development Value (LTGDV), meaning you need equity or mezzanine to cover the rest.",
          "Development finance is fundamentally a project loan. The lender underwrites your scheme \u2014 planning permission, build costs, contractor credentials, and exit strategy \u2014 not just the asset value today.",
        ],
      },
      {
        heading: "What Are Bridging Loans?",
        content: [
          "Bridging loans are short-term secured loans designed for speed. They bridge a gap between a purchase and a longer-term finance solution, or provide rapid capital for auction purchases, chain-breaks, or time-sensitive acquisitions.",
          "Rates start from 0.55% per month (approximately 6.6% per annum), with terms from 1 to 18 months and LTV up to 75%. Unlike development finance, bridging loans are typically advanced as a single drawdown against the current value of the asset.",
          "The key advantage is speed \u2014 funds can be available within 5\u201310 working days, compared to 4\u20138 weeks for a development facility.",
        ],
      },
      {
        heading: "Side-by-Side Comparison",
        content: [
          "<strong>Rates:</strong> Development finance from 6.5% p.a. vs bridging from 0.55% p.m. (6.6% p.a.). On the surface they look similar, but development finance interest is typically rolled up and only charged on drawn funds, while bridging interest accrues on the full advance from day one.",
          "<strong>Loan-to-Value:</strong> Development finance offers up to 65\u201370% LTGDV (based on the completed project value). Bridging offers up to 75% LTV based on the current or purchase value of the asset.",
          "<strong>Terms:</strong> Development finance runs 12\u201324 months to match the build programme. Bridging is shorter at 1\u201318 months. Both carry exit fees and potential extension charges if you overrun.",
          "<strong>Drawdowns:</strong> Development finance uses staged drawdowns tied to build milestones. Bridging is a single day-one advance. This makes development finance more cost-efficient for projects with significant build periods.",
          "<strong>Fees:</strong> Both typically carry 1\u20132% arrangement fees. Development finance adds monitoring surveyor costs (\u00a3500\u2013\u00a31,500 per inspection). Bridging may have exit fees of 1\u20131.5%.",
        ],
      },
      {
        heading: "When to Use Development Finance",
        content: [
          "Choose development finance when you are undertaking a ground-up build, heavy structural conversion, or any project where the end value significantly exceeds the current site value. The staged drawdown structure means you only pay interest on capital as you need it.",
          "Development finance is also the right choice when the project timeline exceeds 6 months, when you need to fund both land and build costs, or when you need to demonstrate to planning authorities or JV partners that you have an institutional-grade funding facility in place.",
          "Typical projects: new-build residential schemes (3\u2013100+ units), office-to-residential conversions, commercial developments, and mixed-use schemes.",
        ],
      },
      {
        heading: "When to Use Bridging Loans",
        content: [
          "Bridging loans are the right tool when speed is the priority. Auction purchases with 28-day completion deadlines, securing a site before planning is granted, breaking a property chain, or acquiring a property that needs light refurbishment before refinancing onto a mortgage.",
          "They also work well for short-term holds where you plan to sell within 6\u201312 months without significant works, or when you need to release equity from an existing asset quickly to fund a deposit elsewhere.",
          "Do not use bridging for ground-up development \u2014 the single drawdown and shorter terms make it significantly more expensive than a proper development facility for projects over 6 months.",
        ],
      },
      {
        heading: "Cost Comparison: A Real Example",
        content: [
          "Consider a \u00a32M site with \u00a31.5M build costs and a GDV of \u00a35M. With development finance at 65% LTGDV (\u00a33.25M facility), interest at 7% p.a. rolled up on staged drawdowns over 18 months, your total interest cost would be approximately \u00a3250,000\u2013\u00a3300,000.",
          "The same project funded via bridging at 75% LTV on the \u00a32M purchase (\u00a31.5M advance) at 0.75% p.m. for 18 months would cost \u00a3202,500 in interest alone \u2014 but you would still need to find the \u00a31.5M build costs from another source. Total finance cost would be significantly higher.",
          "This illustrates why development finance is purpose-built for construction projects: the staged drawdown structure and higher advance against the completed value deliver a lower overall cost of capital.",
        ],
      },
      {
        heading: "Can You Combine Both?",
        content: [
          "Yes. A common strategy is to use a bridging loan to acquire a site quickly (especially at auction), then refinance into a development facility once planning is secured. This \u2018bridge-to-develop\u2019 approach gives you the speed of bridging with the cost efficiency of development finance.",
          "Construction Capital regularly structures these two-stage deals, ensuring the bridging lender\u2019s terms allow early repayment without penalty when the development facility is ready to draw. Contact us to discuss your specific scenario.",
        ],
      },
    ],
    faqs: [
      {
        question:
          "What is the main difference between development finance and bridging loans?",
        answer:
          "Development finance funds construction projects with staged drawdowns and is based on the completed value (LTGDV). Bridging loans provide a single lump sum quickly, based on the current asset value (LTV). Development finance is for building; bridging is for buying fast.",
      },
      {
        question:
          "Which is cheaper, development finance or a bridging loan?",
        answer:
          "For construction projects over 6 months, development finance is almost always cheaper because you only pay interest on drawn funds. Bridging loans charge interest on the full advance from day one, making them more expensive for longer-term projects.",
      },
      {
        question:
          "Can I use a bridging loan for a ground-up development?",
        answer:
          "It is not recommended. Bridging loans advance a single drawdown and have shorter terms (1\u201318 months). For ground-up builds you need staged drawdowns aligned to your build programme, which is what development finance provides.",
      },
      {
        question:
          "How quickly can I get development finance compared to a bridging loan?",
        answer:
          "Bridging loans can complete in 5\u201310 working days. Development finance typically takes 4\u20138 weeks due to the need for detailed appraisals, monitoring surveyor appointment, and build cost verification.",
      },
    ],
  },

  // --- Comparison Guide 2 ---
  {
    slug: "mezzanine-finance-vs-equity-funding",
    title:
      "Mezzanine Finance vs Equity Funding: Choosing the Right Capital Stack",
    metaTitle:
      "Mezzanine Finance vs Equity Funding | Capital Stack Guide for Developers",
    metaDescription:
      "Compare mezzanine finance and equity funding for property development. Understand costs, control, profit share, and when each makes sense for your capital stack.",
    excerpt:
      "Both fill the gap between senior debt and your own cash, but the cost structures and control implications are worlds apart. Here is how to decide.",
    category: "mezzanine",
    readingTime: "7 min read",
    datePublished: "2026-03-31",
    dateModified: "2026-03-31",
    relatedServices: ["mezzanine-finance", "equity-jv"],
    relatedLocations: ["greater-london", "west-yorkshire", "avon"],
    relatedGuides: [
      "senior-debt-vs-mezzanine-finance",
      "development-finance-vs-bridging-loans",
    ],
    sections: [
      {
        heading: "Understanding the Capital Stack",
        content: [
          "Every property development is funded through a capital stack: layers of finance with different risk profiles, costs, and claims on the project\u2019s profits. At the bottom is senior debt (cheapest, first claim). At the top is developer equity (most expensive, last claim). The middle layers \u2014 mezzanine and equity \u2014 are where most developers have choices to make.",
          "The fundamental trade-off is simple: mezzanine finance is debt (you repay it with interest), while equity funding gives an investor a share of ownership and profits. Both reduce the cash you need to put in, but they affect your returns and control very differently.",
        ],
      },
      {
        heading: "What Is Mezzanine Finance?",
        content: [
          "Mezzanine finance is a subordinated loan that sits behind senior debt in the capital stack. It stretches your total borrowing from the typical 65\u201370% LTGDV of senior debt up to 85\u201390% LTGDV, dramatically reducing the equity you need to inject.",
          "Rates are higher than senior debt \u2014 typically from 12% per annum \u2014 reflecting the additional risk the mezzanine lender takes by ranking behind the senior lender in any recovery scenario. Terms mirror the development programme at 12\u201324 months.",
          "Crucially, mezzanine is debt: you owe a fixed return regardless of how profitable the project is. If your scheme delivers a 25% profit margin, you keep everything above the mezzanine interest cost. The lender gets their 12% and nothing more.",
        ],
      },
      {
        heading: "What Is Equity Funding?",
        content: [
          "Equity funding involves bringing in a capital partner \u2014 typically a family office, HNW individual, or property fund \u2014 who provides cash in exchange for a share of the project\u2019s profits. There is no fixed interest rate; instead, the investor takes a profit share starting from around 40%.",
          "Equity can cover up to 100% of costs when combined with senior debt. In a joint venture (JV) structure, the equity partner may fund everything from the land deposit to the build contingency, while you contribute your development expertise and management time.",
          "The key difference from mezzanine: equity partners share in both the upside and the downside. If the project makes \u00a31M profit, they take their agreed share. If it makes \u00a33M, they take a proportionally larger amount. With mezzanine, the cost is fixed regardless of profit.",
        ],
      },
      {
        heading: "Side-by-Side Comparison",
        content: [
          "<strong>Cost structure:</strong> Mezzanine charges a fixed interest rate from 12% p.a. Equity takes a profit share from 40%. On a highly profitable scheme, mezzanine is cheaper. On a marginal scheme, equity may be less risky for the developer since there is no fixed repayment obligation.",
          "<strong>Control:</strong> Mezzanine lenders typically do not take a seat at the table \u2014 they monitor via the same surveyor as the senior lender. Equity partners often want board seats, approval rights on key decisions, and regular reporting. This can slow down decision-making on site.",
          "<strong>Total borrowing:</strong> Mezzanine stretches to 85\u201390% LTGDV. Equity can cover 100% of costs in a full JV. If you have minimal cash to invest, equity may be your only option.",
          "<strong>Risk profile:</strong> Mezzanine must be repaid regardless of project outcome \u2014 it adds leverage and therefore risk. Equity shares the downside: if the project loses money, the equity partner absorbs losses proportionally.",
          "<strong>Speed:</strong> Mezzanine facilities can often be arranged within the same timeline as senior debt (4\u20138 weeks). Equity and JV negotiations typically take 8\u201312 weeks due to legal structuring, shareholder agreements, and due diligence.",
        ],
      },
      {
        heading: "When to Use Mezzanine Finance",
        content: [
          "Mezzanine is the right choice when you have a scheme with strong margins (20%+ profit on GDV) and want to maximise your return on equity. By borrowing more at a fixed cost, you keep a larger share of the profit upside.",
          "It also makes sense when you want to retain full control of the project, when you have a track record that mezzanine lenders will back, and when you have enough equity for the remaining 10\u201315% the mezzanine does not cover.",
          "Example: On a \u00a35M GDV scheme with \u00a31M profit, using mezzanine at 12% on a \u00a31M facility costs approximately \u00a3180,000 over 18 months. You retain \u00a3820,000 profit. With equity at 40% profit share, the investor takes \u00a3400,000 and you retain \u00a3600,000.",
        ],
      },
      {
        heading: "When to Use Equity Funding",
        content: [
          "Equity is the better choice when you lack the personal capital to cover the gap between senior debt and total costs, when you are taking on a larger or riskier scheme than your balance sheet can support, or when you want a partner who brings more than just capital (contacts, expertise, operational support).",
          "First-time developers often need equity partners because mezzanine lenders require a track record of 2\u20133 completed schemes. A credible equity partner can also strengthen your application to senior lenders.",
          "Equity also makes sense on very large schemes (\u00a310M+ GDV) where the absolute profit is large enough that sharing it still delivers an attractive return, and the capital efficiency of not tying up your own cash across a long programme is valuable.",
        ],
      },
      {
        heading: "How Construction Capital Can Help",
        content: [
          "We have relationships with both specialist mezzanine lenders and equity providers. Our role is to model your capital stack, show you the cost implications of each option, and connect you with the right partners for your specific scheme.",
          "In many cases, the optimal structure is a blend: senior debt covering 65% LTGDV, mezzanine stretching to 85%, and developer equity covering the final 15%. We can arrange the entire stack through a single process, saving you time and ensuring the intercreditor terms work for everyone.",
        ],
      },
    ],
    faqs: [
      {
        question:
          "Is mezzanine finance cheaper than equity funding?",
        answer:
          "On profitable schemes (20%+ margin), yes. Mezzanine has a fixed cost (from 12% p.a.) while equity takes a profit share (from 40%). On a scheme with strong margins, the fixed mezzanine cost will be lower than the equity partner's profit share.",
      },
      {
        question:
          "Do I lose control of my project with equity funding?",
        answer:
          "Partially. Equity partners typically require approval rights on major decisions, regular reporting, and sometimes board representation. With mezzanine finance, you retain full operational control as the lender monitors passively through a surveyor.",
      },
      {
        question: "Can I use both mezzanine and equity together?",
        answer:
          "This is unusual. Most capital stacks use either mezzanine or equity to fill the gap above senior debt, not both. Using both creates complex intercreditor arrangements and can be cost-prohibitive.",
      },
      {
        question:
          "What track record do I need for mezzanine finance?",
        answer:
          "Most mezzanine lenders require evidence of 2\u20133 successfully completed developments. First-time developers typically need equity partners instead, or a very experienced project team to compensate for lack of personal track record.",
      },
    ],
  },

  // --- Comparison Guide 3 ---
  {
    slug: "bank-vs-specialist-development-finance",
    title:
      "Bank vs Specialist Development Finance: Pros, Cons and When to Use Each",
    metaTitle:
      "Bank vs Specialist Development Finance | Rates, Speed & Flexibility Compared",
    metaDescription:
      "Compare high street bank development finance with specialist lenders. Rates, approval speed, flexibility, and which is right for your property development project.",
    excerpt:
      "High street banks offer the cheapest rates. Specialist lenders offer speed and flexibility. Here is how to decide which route is right for your development.",
    category: "development-finance",
    readingTime: "7 min read",
    datePublished: "2026-03-31",
    dateModified: "2026-03-31",
    relatedServices: ["development-finance", "mezzanine-finance"],
    relatedLocations: ["greater-london", "surrey", "kent"],
    relatedGuides: [
      "development-finance-vs-bridging-loans",
      "senior-debt-vs-mezzanine-finance",
    ],
    sections: [
      {
        heading: "The Two Markets for Development Finance",
        content: [
          "UK development finance broadly splits into two markets. High street banks (Lloyds, NatWest, HSBC, Barclays, Santander) offer the lowest rates but the most rigid criteria. Specialist lenders (Atelier, CrowdProperty, LendInvest, Maslow, and dozens more) charge more but move faster and accept deals that banks won\u2019t touch.",
          "Understanding which market your deal fits is the first decision you need to make. Get it wrong and you waste weeks on a bank application that was never going to be approved, or overpay with a specialist lender for a deal any bank would fund.",
        ],
      },
      {
        heading: "Bank Development Finance: What to Expect",
        content: [
          "High street banks typically offer development finance at 4\u20136% over base rate (currently equating to roughly 8\u201310% all-in), with arrangement fees of 1\u20131.5%. They will fund up to 60\u201365% LTGDV and require a minimum developer track record of 3\u20135 completed schemes.",
          "The approval process involves a full credit committee review, which takes 6\u201312 weeks from application to first drawdown. Banks require detailed QS reports, full planning permission (not just outline), and evidence of pre-sales or lettings on larger schemes.",
          "The advantage is cost: bank rates can be 2\u20134% per annum cheaper than specialist lenders. On a \u00a310M facility over 18 months, that difference is \u00a3300,000\u2013\u00a3600,000 in interest savings.",
        ],
      },
      {
        heading: "Specialist Development Finance: What to Expect",
        content: [
          "Specialist lenders offer rates from 6.5% per annum (typically 8\u201312% all-in with fees) and will fund up to 70% LTGDV, sometimes 75% for experienced developers. Track record requirements are more flexible: some will fund second or third projects, and most will consider the strength of the wider team (contractor, architect, project manager).",
          "Speed is the headline advantage. Specialist lenders can issue terms within 48 hours, complete due diligence in 2\u20134 weeks, and have funds available within 4\u20136 weeks of application. Some can complete in as little as 2 weeks for straightforward schemes.",
          "They are also more flexible on scheme type. Permitted development conversions, unusual planning conditions, modular construction, mixed-use with a commercial element above 30% \u2014 specialists regularly fund deals that fall outside bank policy.",
        ],
      },
      {
        heading: "Side-by-Side Comparison",
        content: [
          "<strong>Rates:</strong> Banks from 4\u20136% over base rate. Specialists from 6.5% p.a. fixed. On current base rates, the gap is roughly 2\u20134% per annum.",
          "<strong>LTV/LTGDV:</strong> Banks max at 60\u201365% LTGDV. Specialists go to 70\u201375% LTGDV. The higher gearing from specialists means less equity required.",
          "<strong>Speed:</strong> Banks take 6\u201312 weeks. Specialists take 2\u20136 weeks. If you need to move fast (site under offer, planning expiring), a specialist is the only realistic option.",
          "<strong>Track record:</strong> Banks want 3\u20135 completed schemes. Specialists may accept 1\u20132 completions, or a strong team with a less experienced lead developer.",
          "<strong>Flexibility:</strong> Banks follow rigid policy on scheme type, location, and unit mix. Specialists take a commercial view on each deal and can often find ways to make unusual schemes work.",
          "<strong>Ongoing relationship:</strong> A bank facility comes with a relationship manager and access to other banking products (hedging, trade finance, deposits). Specialists are transactional \u2014 you borrow, you repay, the relationship ends.",
        ],
      },
      {
        heading: "When to Use a Bank",
        content: [
          "Use a bank when you have a strong track record (5+ schemes), the project is straightforward (residential, full planning, established location), and timeline is not the main constraint. The interest savings on larger facilities (\u00a35M+) can be substantial.",
          "Banks are also the right choice if you want to build a long-term lending relationship. Repeat borrowers often negotiate improved terms, faster approvals on subsequent deals, and access to higher gearing as trust builds.",
          "Best for: established developers with a pipeline of 3+ projects, schemes above \u00a35M GDV in prime locations, projects where planning and pre-sales are already in place.",
        ],
      },
      {
        heading: "When to Use a Specialist Lender",
        content: [
          "Use a specialist when speed matters, when your track record is limited, when the scheme is unusual, or when you need higher gearing than a bank will offer. The premium you pay in interest is often offset by the cost of delay or the opportunity cost of missing a site acquisition.",
          "Specialists are essential for: permitted development conversions, schemes below \u00a31M (most banks have minimum facility sizes), sites purchased at auction with tight completion deadlines, and projects in secondary or tertiary locations that fall outside bank catchment areas.",
          "Many experienced developers use specialists for early-stage or opportunistic deals where speed is critical, then refinance to a bank facility for their core pipeline projects. Construction Capital can help you structure either route.",
        ],
      },
    ],
    faqs: [
      {
        question:
          "Are bank development loans always cheaper than specialist lenders?",
        answer:
          "Yes in terms of headline interest rates (typically 2\u20134% cheaper per annum). However, the slower approval process can cost more in opportunity terms if you miss a site purchase. Factor in total cost including delays, not just the interest rate.",
      },
      {
        question:
          "Can I get development finance from a bank as a first-time developer?",
        answer:
          "It is very difficult. Most high street banks require evidence of 3\u20135 completed developments. First-time developers should approach specialist lenders who assess the whole team, not just the lead developer's personal track record.",
      },
      {
        question:
          "How do I switch from a specialist lender to a bank?",
        answer:
          "Complete 2\u20133 schemes successfully with specialist funding, building a demonstrable track record of delivery on time and on budget. Then approach banks with your completed portfolio. A broker like Construction Capital can make introductions at the right time.",
      },
    ],
  },

  // --- Comparison Guide 4 ---
  {
    slug: "senior-debt-vs-mezzanine-finance",
    title:
      "Senior Debt vs Mezzanine Finance: How They Work Together in Your Capital Stack",
    metaTitle:
      "Senior Debt vs Mezzanine Finance | Capital Stack Explained for Property Developers",
    metaDescription:
      "Understand the differences between senior debt and mezzanine finance for property development. Rates, risk, priority, and how to structure your capital stack.",
    excerpt:
      "Senior debt and mezzanine finance are different layers of the same capital stack. Understanding how they interact is essential for structuring any development deal.",
    category: "structuring",
    readingTime: "7 min read",
    datePublished: "2026-03-31",
    dateModified: "2026-03-31",
    relatedServices: ["development-finance", "mezzanine-finance"],
    relatedLocations: ["greater-london", "greater-manchester", "kent"],
    relatedGuides: [
      "mezzanine-finance-vs-equity-funding",
      "bank-vs-specialist-development-finance",
    ],
    sections: [
      {
        heading: "What Is Senior Debt?",
        content: [
          "Senior debt is the primary loan facility in a property development\u2019s capital stack. It has first priority over all other creditors \u2014 if the project fails and the asset is sold, the senior lender is repaid first. This lower risk position is reflected in lower interest rates, typically from 6.5% per annum.",
          "Senior lenders will typically fund up to 65\u201370% of the Gross Development Value (LTGDV), covering both land acquisition and construction costs through staged drawdowns. The loan is secured by a first charge over the development site.",
          "For most property developments, senior debt forms the foundation of the funding structure. It is the cheapest layer of capital and the one that defines the parameters for everything above it.",
        ],
      },
      {
        heading: "What Is Mezzanine Finance?",
        content: [
          "Mezzanine finance is a subordinated loan that sits behind senior debt. It has a second charge over the property and is repaid only after the senior lender has been fully repaid. This higher risk is reflected in higher rates, typically from 12% per annum.",
          "Mezzanine stretches your total borrowing from the 65\u201370% LTGDV of senior debt up to 85\u201390% LTGDV. The mezzanine lender fills the gap between what the senior lender will provide and what you can contribute as equity.",
          "Think of it as a bridge between cheap senior debt and expensive equity. It costs more than senior debt but less than giving away a share of your profits to an equity partner.",
        ],
      },
      {
        heading: "How They Interact: The Intercreditor Agreement",
        content: [
          "When senior debt and mezzanine are used together, the two lenders enter into an intercreditor agreement (ICA). This legal document governs how the lenders relate to each other and, critically, what happens in a default scenario.",
          "Key ICA provisions include: the mezzanine lender cannot enforce its security without the senior lender\u2019s consent, the senior lender is repaid in full before any mezzanine recovery, and the mezzanine lender may have \u2018cure rights\u2019 allowing it to step in and fix defaults before the senior lender accelerates the loan.",
          "The ICA negotiation can take 2\u20134 weeks and is a significant part of the legal cost. Using a broker who has pre-agreed ICAs with regular lender pairings can save considerable time and legal fees.",
        ],
      },
      {
        heading: "Side-by-Side Comparison",
        content: [
          "<strong>Priority:</strong> Senior debt has first charge and first claim on recovery. Mezzanine has second charge and is repaid only after the senior lender is made whole.",
          "<strong>Rates:</strong> Senior debt from 6.5% p.a. Mezzanine from 12% p.a. The rate difference reflects the additional risk the mezzanine lender carries.",
          "<strong>LTV coverage:</strong> Senior covers 0\u201370% LTGDV. Mezzanine covers the 70\u201390% LTGDV tranche. Together they reduce your equity requirement to 10\u201315% of total costs.",
          "<strong>Drawdown:</strong> Both typically use staged drawdowns aligned to the build programme. The senior lender draws first on each stage, with the mezzanine lender funding its proportion of each drawdown.",
          "<strong>Security:</strong> Senior takes first charge. Mezzanine takes second charge. Both are secured against the same development site.",
        ],
      },
      {
        heading: "Example Capital Stack",
        content: [
          "Consider a development with a GDV of \u00a35M and total costs (land + build + fees) of \u00a33.75M. A typical capital stack might be: senior debt at 65% LTGDV = \u00a33.25M, mezzanine at 85% LTGDV = additional \u00a31M (covering the 65\u201385% tranche), and developer equity of \u00a3562,500 (15% of costs).",
          "The blended cost of debt in this scenario: senior debt at 7% on \u00a33.25M = \u00a3227,500 p.a., plus mezzanine at 13% on \u00a31M = \u00a3130,000 p.a. Total annual interest: \u00a3357,500, or a blended rate of approximately 8.4% on \u00a34.25M total borrowing.",
          "Without mezzanine, the developer would need \u00a31.56M in equity (35% of costs) instead of \u00a3562,500. Mezzanine freed up almost \u00a31M of capital that can be deployed to other projects.",
        ],
      },
      {
        heading: "When to Stack Senior + Mezzanine",
        content: [
          "Use both when the project has strong margins (20%+ profit on GDV) that can absorb the blended cost of debt, when you want to maximise leverage to free capital for other projects, and when you have enough track record for both lenders to back you.",
          "Avoid stacking when margins are thin (below 15% on GDV), when the project carries significant planning or build risk, or when you are a first-time developer \u2014 mezzanine lenders typically require a demonstrated track record.",
          "Construction Capital arranges both layers simultaneously, ensuring the senior and mezzanine terms dovetail and the intercreditor agreement is pre-agreed before you commit to either facility.",
        ],
      },
    ],
    faqs: [
      {
        question:
          "What happens to mezzanine finance if the project fails?",
        answer:
          "The senior lender is repaid first from any asset sale proceeds. The mezzanine lender only receives payment after the senior debt is fully cleared. In a severe loss scenario, the mezzanine lender may recover nothing, which is why mezzanine rates are higher.",
      },
      {
        question:
          "Can I get mezzanine without senior debt?",
        answer:
          "Mezzanine finance is designed to complement senior debt, not replace it. You would not typically take mezzanine alone as it is priced for the subordinated risk position. Without senior debt, you would use a standard development loan at senior rates.",
      },
      {
        question:
          "How much equity do I still need with senior debt and mezzanine?",
        answer:
          "Typically 10\u201315% of total project costs. With senior debt at 65\u201370% LTGDV and mezzanine stretching to 85\u201390% LTGDV, the developer's equity contribution is significantly reduced compared to using senior debt alone.",
      },
    ],
  },

  // --- Comparison Guide 5 ---
  {
    slug: "fixed-vs-variable-bridging-rates",
    title:
      "Fixed vs Variable Bridging Rates: Which Saves You More?",
    metaTitle:
      "Fixed vs Variable Bridging Rates | Cost Comparison for Property Investors",
    metaDescription:
      "Compare fixed and variable rate bridging loans. Understand how rate changes affect your costs, when to lock in, and which structure suits your exit strategy.",
    excerpt:
      "With bridging rates from 0.55% per month, the fixed vs variable decision can mean thousands in savings or unexpected costs. Here is how to choose.",
    category: "bridging",
    readingTime: "6 min read",
    datePublished: "2026-03-31",
    dateModified: "2026-03-31",
    relatedServices: ["bridging-loans", "development-exit-finance"],
    relatedLocations: ["greater-london", "surrey", "essex"],
    relatedGuides: [
      "development-finance-vs-bridging-loans",
      "refurbishment-finance-vs-development-finance",
    ],
    sections: [
      {
        heading: "How Bridging Rates Are Structured",
        content: [
          "Bridging loan rates are quoted monthly, not annually \u2014 a convention that makes direct comparison with other finance products tricky. A rate of 0.55% per month equates to approximately 6.6% per annum. Rates range from 0.55% to 1.5% per month depending on the LTV, property type, exit strategy, and borrower profile.",
          "Rates can be structured as either fixed for the entire loan term, or variable (typically tracking the Bank of England base rate plus a margin). The choice affects your total cost, your certainty over repayments, and your flexibility to exit early.",
        ],
      },
      {
        heading: "Fixed Rate Bridging Loans",
        content: [
          "With a fixed rate bridging loan, the monthly interest rate is locked in for the entire term. If you agree 0.75% per month on a 12-month bridge, your interest cost is predictable from day one regardless of what happens to base rates.",
          "Fixed rates are typically 0.05\u20130.15% per month higher than the equivalent variable rate at the time of arrangement. This premium is the cost of certainty. On a \u00a3500,000 bridging loan over 12 months, the premium equates to \u00a33,000\u2013\u00a39,000 in additional interest.",
          "Most fixed rate bridges do not charge early repayment interest \u2014 you pay interest only on the months you use the facility. However, some lenders impose a minimum interest period (typically 3 months). Always check before committing.",
        ],
      },
      {
        heading: "Variable Rate Bridging Loans",
        content: [
          "Variable rate bridging loans are priced as a margin over the Bank of England base rate (e.g., base + 0.50% per month, or base + 5% per annum). As base rates move, your monthly interest cost moves with them.",
          "When base rates are stable or falling, variable rates offer savings over fixed. When rates are rising, variable exposes you to increasing costs that can erode your project margins. In the current rate environment, this is a material consideration.",
          "Variable rate bridges are more common in the institutional lending market and for larger facilities (\u00a31M+). Smaller bridging loans from specialist lenders are more commonly offered on fixed terms.",
        ],
      },
      {
        heading: "Cost Comparison Example",
        content: [
          "Take a \u00a3750,000 bridging loan over 9 months. At a fixed rate of 0.75% p.m., total interest = \u00a350,625. At a variable rate starting at 0.65% p.m. (base + margin) with base rate increasing by 0.25% during the term, total interest \u2248 \u00a347,250\u2013\u00a349,500 depending on timing.",
          "In this example, variable saves \u00a31,000\u2013\u00a33,000 in a stable rate environment. But if base rates had increased by 0.50% instead, the variable cost would exceed the fixed cost. The savings are real but uncertain.",
          "The breakeven point is the rate at which the variable cost equals the fixed cost. Ask your broker to calculate this for your specific facility size and expected term.",
        ],
      },
      {
        heading: "When to Choose Fixed Rates",
        content: [
          "Choose fixed when: base rates are expected to rise, your exit strategy has a defined timeline (e.g., sale already agreed or refinance offer in hand), you need certainty for cash flow planning, or the premium over variable is small (under 0.10% p.m.).",
          "Fixed is also the safer option for less experienced borrowers who may not be tracking rate movements closely, or for projects where the margin is tight and a rate increase could make the deal unviable.",
        ],
      },
      {
        heading: "When to Choose Variable Rates",
        content: [
          "Choose variable when: base rates are stable or expected to fall, you plan to exit quickly (under 6 months), the variable margin is significantly lower than fixed alternatives, or you have a flexible exit strategy that allows you to accelerate repayment if rates increase.",
          "Variable rates are particularly attractive at the start of an easing cycle, when the base rate is expected to decline over your loan term. In this scenario, your monthly costs reduce automatically without needing to refinance.",
        ],
      },
      {
        heading: "Other Cost Factors Beyond the Rate",
        content: [
          "The interest rate is only one component of bridging loan cost. Arrangement fees (1\u20132%), exit fees (0\u20131.5%), valuation fees (\u00a3500\u2013\u00a32,500), and legal fees all contribute to the total cost of borrowing.",
          "Some lenders offer lower rates but charge higher fees, and vice versa. When comparing fixed vs variable, ensure you are comparing the total cost of borrowing, not just the headline rate. Construction Capital provides total-cost comparisons across our lender panel to help you make the right choice.",
        ],
      },
    ],
    faqs: [
      {
        question:
          "Are fixed rate bridging loans more expensive than variable?",
        answer:
          "Fixed rates typically carry a premium of 0.05\u20130.15% per month over equivalent variable rates. Whether this makes them more expensive overall depends on base rate movements during your loan term.",
      },
      {
        question:
          "Can I switch from variable to fixed during a bridging loan?",
        answer:
          "Generally no. The rate structure is agreed at drawdown and remains for the term. To switch, you would need to refinance with a new lender, which involves additional fees and legal costs that rarely make it worthwhile on a short-term bridge.",
      },
      {
        question:
          "Do I pay interest on the full term if I repay a fixed rate bridge early?",
        answer:
          "Most lenders only charge interest on the months used, not the full term. However, some impose a minimum interest period of 3\u20136 months. Always confirm the early repayment terms before drawing the facility.",
      },
    ],
  },

  // --- Comparison Guide 6 ---
  {
    slug: "refurbishment-finance-vs-development-finance",
    title:
      "Refurbishment Finance vs Development Finance: Which Fits Your Project?",
    metaTitle:
      "Refurbishment Finance vs Development Finance | Choosing the Right Loan",
    metaDescription:
      "Compare refurbishment finance and development finance for UK property projects. Rates, terms, scope of works, and how to choose the right facility for your project.",
    excerpt:
      "The line between refurbishment and development is not always clear. Choosing the wrong finance product can cost you in rates, delays, or declined applications.",
    category: "refurbishment",
    readingTime: "7 min read",
    datePublished: "2026-03-31",
    dateModified: "2026-03-31",
    relatedServices: ["refurbishment-finance", "development-finance"],
    relatedLocations: [
      "greater-london",
      "greater-manchester",
      "west-midlands",
    ],
    relatedGuides: [
      "development-finance-vs-bridging-loans",
      "bank-vs-specialist-development-finance",
    ],
    sections: [
      {
        heading: "Defining the Boundary: Refurbishment vs Development",
        content: [
          "The distinction matters because lenders assess, price, and structure these facilities differently. As a rule of thumb: if your project involves changing the use, adding square footage, or structural alteration requiring Building Regulations approval beyond a simple Part P or Part L notification, it is likely classified as development by most lenders.",
          "Light refurbishment covers cosmetic works: new kitchens, bathrooms, redecoration, new flooring, and minor repairs. Budget typically under \u00a350,000 per unit. Heavy refurbishment adds structural changes: removing walls, adding extensions, loft conversions, or converting a house into flats under permitted development rights.",
          "Development covers ground-up construction, major structural conversions (e.g., office to residential), or any project where planning permission is required. The completed product is fundamentally different from the starting asset.",
        ],
      },
      {
        heading: "Refurbishment Finance: How It Works",
        content: [
          "Refurbishment finance is structured as a short-term loan with one or two drawdowns. You receive funds to purchase the property and a further drawdown (or retained amount) to cover the refurbishment costs once works begin.",
          "Rates start from 0.65% per month with LTV up to 75% based on the current or purchase value. Terms run 6\u201318 months. The exit strategy is typically a sale of the improved property or a refinance onto a buy-to-let mortgage.",
          "Key advantage: speed and simplicity. Refurbishment loans require less documentation than development finance \u2014 no monitoring surveyor, no staged drawdowns, no QS report. You provide a schedule of works and a valuation, and the lender releases funds.",
        ],
      },
      {
        heading: "Development Finance: How It Works",
        content: [
          "Development finance uses staged drawdowns tied to build milestones verified by an independent monitoring surveyor. The lender releases funds as each stage is completed (foundations, superstructure, first fix, second fix, completion).",
          "Rates start from 6.5% per annum with LTGDV up to 65\u201370%. Terms run 12\u201324 months. The exit strategy is typically a sale of completed units or a refinance onto investment finance.",
          "The monitoring surveyor inspects the site before each drawdown (at \u00a3500\u2013\u00a31,500 per visit), verifying that works are on programme and the budget is on track. This adds cost but gives the lender (and you) an independent check on progress.",
        ],
      },
      {
        heading: "Side-by-Side Comparison",
        content: [
          "<strong>Rates:</strong> Refurbishment from 0.65% p.m. (7.8% p.a.). Development from 6.5% p.a. Development looks cheaper on an annual basis, but refurbishment projects are typically shorter and the total interest cost may be lower.",
          "<strong>LTV basis:</strong> Refurbishment is based on current/purchase value (LTV). Development is based on completed value (LTGDV). This means development finance can advance a larger absolute sum on the same property if the project adds significant value.",
          "<strong>Drawdowns:</strong> Refurbishment uses 1\u20132 drawdowns. Development uses 4\u20136 staged drawdowns. Staged drawdowns reduce interest costs on larger projects but add monitoring costs.",
          "<strong>Documentation:</strong> Refurbishment requires a schedule of works and valuation. Development requires planning permission, QS cost report, build programme, contractor details, and professional team appointments.",
          "<strong>Timeline to funds:</strong> Refurbishment can complete in 2\u20134 weeks. Development takes 4\u20138 weeks due to more extensive due diligence.",
        ],
      },
      {
        heading: "The Grey Area: Heavy Refurbishment",
        content: [
          "Many projects sit in a grey area between light refurbishment and full development. Converting a house into 3 flats under permitted development, adding a two-storey extension, or stripping a building back to its shell are all projects that some lenders classify as refurbishment and others as development.",
          "The classification matters because it determines pricing, documentation requirements, and which lenders will consider the deal. A project classified as development will face a longer application process and potentially higher costs, but may access higher leverage based on the completed value.",
          "Construction Capital helps you position these grey-area projects with the right lenders. Sometimes the same project can be presented as either a heavy refurbishment or a light development, and the right positioning saves you money and time.",
        ],
      },
      {
        heading: "When to Choose Each",
        content: [
          "<strong>Choose refurbishment finance when:</strong> the scope is cosmetic to moderate structural works, no planning permission is required, total works budget is under \u00a3250,000, you want speed and simplicity, and your exit is a sale or BTL refinance within 12 months.",
          "<strong>Choose development finance when:</strong> you are building from the ground up, the project requires full planning permission, total costs exceed \u00a3500,000, the completed value significantly exceeds the current value, or the project timeline exceeds 12 months.",
          "<strong>For heavy refurbishments in the grey area:</strong> speak to a broker. The right lender classification can save you 1\u20132% on your annual interest rate and 2\u20134 weeks on your application timeline.",
        ],
      },
    ],
    faqs: [
      {
        question:
          "Can I use a bridging loan instead of refurbishment finance?",
        answer:
          "Yes, for light refurbishment. Many bridging loans allow you to undertake cosmetic improvements to the property. However, for works above \u00a350,000 or structural changes, a dedicated refurbishment facility is usually more cost-effective and provides a structured works drawdown.",
      },
      {
        question:
          "What happens if my refurbishment project scope expands into development territory?",
        answer:
          "You may need to refinance into a development facility. If unexpected structural issues arise or you decide to extend the scope, speak to your lender immediately. Some refurbishment lenders have development products you can transition to; others will require you to find a new facility.",
      },
      {
        question:
          "Do I need planning permission for a heavy refurbishment?",
        answer:
          "Not always. Many heavy refurbishment projects fall under permitted development rights (e.g., converting a house into flats, commercial to residential under Class MA). However, you will almost always need Building Regulations approval. Check with your local planning authority before committing to a finance structure.",
      },
    ],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function getRelatedGuides(slug: string): Guide[] {
  const guide = getGuideBySlug(slug);
  if (!guide) return [];
  return guide.relatedGuides
    .map((relatedSlug) => getGuideBySlug(relatedSlug))
    .filter((g): g is Guide => g !== undefined);
}
