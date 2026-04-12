export interface ProductComparison {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  optionA: {
    name: string;
    description: string;
    typicalRate: string;
    typicalLtv: string;
    typicalTerm: string;
    pros: string[];
    cons: string[];
    bestFor: string;
    serviceSlug: string;
  };
  optionB: {
    name: string;
    description: string;
    typicalRate: string;
    typicalLtv: string;
    typicalTerm: string;
    pros: string[];
    cons: string[];
    bestFor: string;
    serviceSlug: string;
  };
  features: {
    feature: string;
    optionA: string;
    optionB: string;
  }[];
  verdict: string[];
  faqs: { question: string; answer: string }[];
  relatedGuides: string[];
  relatedServices: string[];
}

export const PRODUCT_COMPARISONS: ProductComparison[] = [
  {
    slug: "development-finance-vs-bridging-loans",
    title: "Development Finance vs Bridging Loans: Which Do You Need?",
    metaTitle: "Development Finance vs Bridging Loans | Key Differences",
    metaDescription:
      "Compare development finance and bridging loans side by side. Rates, terms, LTV, use cases and when to choose each for your UK property project.",
    excerpt:
      "Two of the most common short-term property finance products, but they serve fundamentally different purposes. We break down when each is the right choice.",
    optionA: {
      name: "Development Finance",
      description:
        "A structured facility designed for ground-up construction or major refurbishment, with funds released in staged drawdowns against build progress verified by a monitoring surveyor.",
      typicalRate: "6.5-10% p.a.",
      typicalLtv: "60-70% LTGDV",
      typicalTerm: "12-24 months",
      pros: [
        "Staged drawdowns match actual build expenditure",
        "Higher leverage against completed value (GDV)",
        "Purpose-built for construction projects with monitoring",
        "Interest only charged on drawn funds, reducing overall cost",
      ],
      cons: [
        "Requires detailed planning permission and build costs",
        "Monitoring surveyor adds cost and time to drawdowns",
        "Longer application process with more documentation",
        "Not suitable for quick acquisitions or chain breaks",
      ],
      bestFor:
        "Ground-up developments, major conversions, and heavy refurbishment projects where construction works form the majority of the cost",
      serviceSlug: "development-finance",
    },
    optionB: {
      name: "Bridging Loan",
      description:
        "A short-term secured loan providing rapid access to capital, typically for acquisition or light refurbishment, with the full facility available from day one.",
      typicalRate: "0.55-1.0% per month",
      typicalLtv: "70-80% LTV",
      typicalTerm: "1-18 months",
      pros: [
        "Speed - completion in as little as 5-10 working days",
        "Full facility available from day one",
        "Flexible use - acquisitions, chain breaks, auction purchases",
        "Less documentation required than development finance",
      ],
      cons: [
        "Interest on the full facility from day one",
        "Lower leverage against purchase price than development finance against GDV",
        "Not designed for major construction projects",
        "Monthly interest rates can be expensive over longer terms",
      ],
      bestFor:
        "Quick acquisitions, auction purchases, chain breaks, pre-planning site purchases, and light refurbishment projects",
      serviceSlug: "bridging-loans",
    },
    features: [
      { feature: "Speed to Completion", optionA: "2-4 weeks", optionB: "5-10 days" },
      { feature: "Funds Released", optionA: "Staged drawdowns", optionB: "Full amount from day one" },
      { feature: "Interest Charged On", optionA: "Drawn balance only", optionB: "Full facility" },
      { feature: "Monitoring Required", optionA: "Yes - surveyor at each drawdown", optionB: "No" },
      { feature: "Planning Permission", optionA: "Required (usually full permission)", optionB: "Not required" },
      { feature: "Typical Use", optionA: "New builds, major refurbs, conversions", optionB: "Acquisitions, light refurbs, chain breaks" },
      { feature: "Exit Strategy", optionA: "Sale or refinance of completed units", optionB: "Sale, refinance, or development finance" },
      { feature: "Valuation Basis", optionA: "GDV (completed value)", optionB: "Current market value" },
    ],
    verdict: [
      "The choice between development finance and bridging is determined by what you are doing with the property. If your project involves significant construction works - ground-up building, structural alterations, or changes requiring building regulations approval - you need development finance. The staged drawdown structure matches how construction projects spend money, and the GDV-based leverage gives you more borrowing capacity.",
      "If you need to move quickly on an acquisition, break a chain, or fund a light cosmetic refurbishment, a bridging loan is the right tool. Many developers use both products in sequence: a bridge to acquire a site quickly, then refinance into development finance once planning permission is secured. We regularly structure these bridge-to-development transitions for our clients.",
      "The most common mistake we see is developers trying to use a bridging loan for a project that requires development finance. This typically results in higher overall costs, insufficient funds for the build, and a stressful scramble to refinance mid-project.",
    ],
    faqs: [
      {
        question: "Can I use a bridging loan for a property development?",
        answer:
          "You can use a bridging loan for light refurbishment (cosmetic works not requiring building regulations approval), but for ground-up development, major conversions, or heavy refurbishment, you need development finance. The key test is whether the works require a monitoring surveyor and staged drawdowns.",
      },
      {
        question: "Is development finance more expensive than a bridging loan?",
        answer:
          "Development finance headline rates (6.5-10% p.a.) appear lower than bridging rates (0.55-1.0% per month, equivalent to 6.6-12% p.a.), but the total cost depends on how much you draw and when. Because development finance only charges interest on drawn funds, the effective cost can be significantly lower than a bridge where interest accrues on the full facility from day one.",
      },
      {
        question: "Can I switch from a bridging loan to development finance?",
        answer:
          "Yes - this is a common strategy called bridge-to-development. You use a bridging loan to acquire the site quickly (often at auction or in a competitive process), then refinance into a development finance facility once planning permission is secured. We structure these transitions regularly and can arrange both facilities from our lending panel.",
      },
    ],
    relatedGuides: [
      "development-finance-vs-bridging-loans",
      "how-does-development-finance-work",
    ],
    relatedServices: ["development-finance", "bridging-loans"],
  },
  {
    slug: "mezzanine-finance-vs-equity-jv",
    title: "Mezzanine Finance vs Equity Joint Venture: Which Is Right for You?",
    metaTitle: "Mezzanine Finance vs Equity JV | Property Developer Guide",
    metaDescription:
      "Compare mezzanine finance and equity joint ventures for UK property development. Fixed cost vs profit share, control implications, and when to use each.",
    excerpt:
      "Both reduce your equity requirement, but the cost structures, control implications, and risk profiles are very different. Here is how to choose.",
    optionA: {
      name: "Mezzanine Finance",
      description:
        "A second-charge loan sitting between senior debt and equity in the capital stack, providing additional leverage at a fixed interest rate.",
      typicalRate: "12-18% p.a.",
      typicalLtv: "Up to 85% LTC / 75% LTGDV",
      typicalTerm: "12-24 months (aligned with senior debt)",
      pros: [
        "Fixed, predictable cost - you keep all the upside above the interest",
        "No profit share or equity dilution",
        "Developer retains full control of the project",
        "Faster to arrange than finding an equity partner",
      ],
      cons: [
        "Higher interest rate than senior debt (12-18% p.a.)",
        "Must be repaid regardless of project performance",
        "Requires intercreditor agreement with senior lender",
        "Increases total debt burden and default risk",
      ],
      bestFor:
        "Experienced developers with strong projects who want to maximise leverage while retaining full profit and control",
      serviceSlug: "mezzanine-finance",
    },
    optionB: {
      name: "Equity Joint Venture",
      description:
        "A partnership where an investor contributes equity capital in exchange for a share of the development profit, sharing both risk and reward.",
      typicalRate: "30-50% profit share",
      typicalLtv: "Can achieve 90-100% of costs (with senior debt)",
      typicalTerm: "Project duration (typically 18-36 months)",
      pros: [
        "No interest payments during the build",
        "Risk shared with the equity partner",
        "Can achieve near-100% funding of total costs",
        "Equity partner may add value through experience or contacts",
      ],
      cons: [
        "Significant profit share dilutes developer returns",
        "Loss of full control - JV partner has a say in key decisions",
        "Complex legal structuring (JV agreement, shareholder agreement)",
        "Finding the right partner takes time",
      ],
      bestFor:
        "First-time developers, projects requiring minimal cash input, or schemes where a strategic partner adds value beyond capital",
      serviceSlug: "equity-jv",
    },
    features: [
      { feature: "Cost Structure", optionA: "Fixed interest (12-18% p.a.)", optionB: "Profit share (30-50%)" },
      { feature: "Developer Control", optionA: "Full control retained", optionB: "Shared decision-making" },
      { feature: "Cash Flow During Build", optionA: "Interest accrues (rolled up)", optionB: "No payments until profit realised" },
      { feature: "Risk Sharing", optionA: "Developer bears all equity risk", optionB: "Risk shared with partner" },
      { feature: "Speed to Arrange", optionA: "2-4 weeks", optionB: "4-12 weeks" },
      { feature: "Legal Complexity", optionA: "Intercreditor deed required", optionB: "Full JV/shareholder agreement" },
      { feature: "Impact on Returns", optionA: "Predictable - cost is fixed", optionB: "Variable - higher profit = higher cost" },
      { feature: "Best for Profit Margin", optionA: "Projects with 20%+ profit on GDV", optionB: "Projects where capital preservation matters more than margin" },
    ],
    verdict: [
      "The fundamental question is whether you would rather pay a fixed rate or share your profit. If your development has a strong projected margin - say 20% or more on GDV - mezzanine finance almost always delivers better net returns to the developer. You pay 12-18% interest on the mezzanine tranche for 12-18 months, which is a known cost that you can build into your appraisal.",
      "An equity JV makes more sense when you lack the cash for even a reduced equity contribution, when you are a first-time developer who benefits from a partner's track record, or when the JV partner brings strategic value beyond capital - perhaps a relationship with a housing association for the affordable units, or a proven sales team for off-plan disposals.",
      "We frequently model both options for developers and the numbers often surprise them. On a £4 million GDV scheme with £800,000 projected profit, mezzanine at 15% on a £400,000 tranche costs roughly £60,000 over 12 months. A 40% equity JV on the same scheme would cost £320,000. The mezzanine route delivers five times more profit to the developer - provided the project performs as expected.",
    ],
    faqs: [
      {
        question: "Can I use both mezzanine finance and an equity JV on the same project?",
        answer:
          "This is unusual because adding both layers creates a very complex capital stack. Most lenders and mezzanine providers prefer a clean three-layer structure (senior + mezzanine + developer equity or senior + equity JV). However, on larger schemes above £10 million GDV, layered structures with multiple capital sources are more common.",
      },
      {
        question: "Will a mezzanine lender accept a first-time developer?",
        answer:
          "Some mezzanine lenders will work with first-time developers, but the terms will reflect the higher risk - expect lower leverage, higher rates, and potentially a requirement for an experienced project manager or employer's agent. A broker can identify the mezzanine lenders most likely to support your specific situation.",
      },
      {
        question: "How much profit share is typical in a property development JV?",
        answer:
          "JV profit splits typically range from 50/50 to 60/40 in favour of the developer. The split depends on how much non-financial value the developer brings (planning consent, site knowledge, project management expertise) versus the equity partner's contribution. For first-time developers contributing mainly the site and management, a 50/50 split is standard.",
      },
    ],
    relatedGuides: [
      "mezzanine-vs-equity-jv",
      "capital-stack-property-development",
    ],
    relatedServices: ["mezzanine-finance", "equity-jv"],
  },
  {
    slug: "development-finance-vs-commercial-mortgage",
    title:
      "Development Finance vs Commercial Mortgage: Which Do You Need?",
    metaTitle: "Development Finance vs Commercial Mortgage | UK Guide",
    metaDescription:
      "Compare development finance with commercial mortgages for UK property. Key differences in structure, rates, terms, and when each product is appropriate.",
    excerpt:
      "One funds construction, the other funds completed assets. Understanding the distinction prevents costly mistakes.",
    optionA: {
      name: "Development Finance",
      description:
        "A short-term facility for funding construction or major refurbishment, with staged drawdowns against verified build progress and repayment from sales or refinance at completion.",
      typicalRate: "6.5-10% p.a.",
      typicalLtv: "60-70% LTGDV",
      typicalTerm: "12-24 months",
      pros: [
        "Designed for construction - staged drawdowns match build spend",
        "Leverage based on completed value (GDV), not current value",
        "Monitoring ensures project stays on track",
        "Interest only on drawn funds reduces cost during build",
      ],
      cons: [
        "Short-term only - must refinance or sell at completion",
        "Higher rates than long-term commercial mortgages",
        "Requires detailed appraisal, planning, and build cost verification",
        "Monitoring surveyor costs at each drawdown stage",
      ],
      bestFor:
        "Active construction projects - new builds, conversions, heavy refurbishment requiring building regulations approval",
      serviceSlug: "development-finance",
    },
    optionB: {
      name: "Commercial Mortgage",
      description:
        "A long-term secured loan against a completed commercial or mixed-use property, typically repaid over 5-25 years from rental income or business cash flow.",
      typicalRate: "4-7% p.a.",
      typicalLtv: "60-75% LTV",
      typicalTerm: "5-25 years",
      pros: [
        "Lower interest rates than development finance",
        "Long-term stability with fixed or variable rate options",
        "Capital and interest repayment builds equity over time",
        "Suitable for investment hold strategies",
      ],
      cons: [
        "Cannot fund construction works or major refurbishment",
        "Based on current value, not future value",
        "Early repayment charges limit flexibility",
        "Requires income evidence (rental or business)",
      ],
      bestFor:
        "Acquiring or refinancing completed commercial property, investment hold strategies, and owner-occupied business premises",
      serviceSlug: "commercial-mortgages",
    },
    features: [
      { feature: "Purpose", optionA: "Funding construction works", optionB: "Funding completed asset purchase/hold" },
      { feature: "Valuation Basis", optionA: "Gross Development Value (future)", optionB: "Current market value" },
      { feature: "Term Length", optionA: "12-24 months", optionB: "5-25 years" },
      { feature: "Repayment", optionA: "Bullet repayment at completion", optionB: "Monthly capital and interest" },
      { feature: "Income Required", optionA: "No - repaid from sales/refinance", optionB: "Yes - rental or business income" },
      { feature: "Fund Release", optionA: "Staged drawdowns", optionB: "Lump sum at completion" },
      { feature: "Typical Rate", optionA: "6.5-10% p.a.", optionB: "4-7% p.a." },
      { feature: "Exit Strategy", optionA: "Sale of units or refinance", optionB: "Ongoing repayment from income" },
    ],
    verdict: [
      "These products serve completely different purposes and are rarely interchangeable. Development finance funds the creation of value through construction. A commercial mortgage funds the acquisition or long-term holding of an existing asset. If you are building, converting, or heavily refurbishing, you need development finance. If you are buying a completed building to hold as an investment, you need a commercial mortgage.",
      "The most common transition we arrange is from development finance into a commercial mortgage. A developer builds a commercial scheme using development finance, then refinances the completed, tenanted building onto a long-term commercial mortgage. This is a clean exit that repays the development facility and locks in a long-term hold strategy at much lower rates.",
      "We also see developers who attempt to use a commercial mortgage to fund refurbishment works on a property they already own. While minor cosmetic works can sometimes be accommodated within a commercial mortgage, anything requiring planning permission, building regulations, or structural works should be funded through a development or refurbishment finance facility.",
    ],
    faqs: [
      {
        question:
          "Can I get a commercial mortgage to fund property development?",
        answer:
          "No. Commercial mortgages are designed for completed, income-producing properties. They do not fund construction works, staged drawdowns, or speculative development. You need development finance or refurbishment finance for any project involving significant building works.",
      },
      {
        question:
          "Can I refinance development finance onto a commercial mortgage?",
        answer:
          "Yes - this is one of the most common exit strategies for development finance. Once your scheme is complete and tenanted (for commercial or BTR), you refinance the short-term development facility onto a long-term commercial mortgage at a lower rate. We can arrange both the development finance and the exit mortgage from our lending panel.",
      },
      {
        question:
          "What if my project is both acquisition and refurbishment?",
        answer:
          "If the refurbishment is light (cosmetic, no building regs), a bridging loan with a refurbishment element may work. If it involves structural works or building regulations, you need either a heavy refurbishment bridging facility or full development finance. A specialist broker can assess which product fits your specific scope of works.",
      },
    ],
    relatedGuides: ["development-finance", "comparison", "commercial"],
    relatedServices: ["development-finance", "commercial-mortgages"],
  },
  {
    slug: "specialist-broker-vs-direct-to-lender",
    title: "Using a Broker vs Going Direct to a Lender: What Is Best?",
    metaTitle: "Development Finance Broker vs Direct to Lender | Guide",
    metaDescription:
      "Should you use a specialist development finance broker or approach lenders directly? An honest comparison of costs, access, and outcomes.",
    excerpt:
      "An honest assessment of when a specialist broker adds value versus when going direct makes sense. We explain both sides.",
    optionA: {
      name: "Specialist Development Finance Broker",
      description:
        "A dedicated intermediary with relationships across 100+ specialist lenders who structures, packages, and places development finance on behalf of the borrower.",
      typicalRate: "Same lender rates + 1-2% broker arrangement fee",
      typicalLtv: "Best available across whole market",
      typicalTerm: "Matched to project requirements",
      pros: [
        "Whole-of-market access to 100+ lenders in a single application",
        "Expert deal structuring optimises the capital stack",
        "Competitive tension between lenders drives better terms",
        "Saves weeks of developer time on applications and negotiations",
        "Navigates complex scenarios (adverse credit, first-time, unusual assets)",
      ],
      cons: [
        "Broker fee adds 1-2% to the cost (often absorbed into the facility)",
        "Quality varies widely between brokers",
      ],
      bestFor:
        "Any project where optimal terms, speed, or structuring complexity matters - which is the majority of development finance deals",
      serviceSlug: "development-finance",
    },
    optionB: {
      name: "Direct to Lender",
      description:
        "Approaching one or more development finance lenders directly, without broker intermediation, to negotiate terms and complete the application independently.",
      typicalRate: "Lender's standard terms (no broker fee)",
      typicalLtv: "Limited to that lender's maximum",
      typicalTerm: "That lender's standard terms",
      pros: [
        "No broker fee on the transaction",
        "Direct relationship with the decision-maker",
        "Suitable if you already know which lender is right",
      ],
      cons: [
        "No market comparison - you cannot know if terms are competitive",
        "Limited to one lender's products, appetite, and criteria",
        "No expert packaging - poorly presented applications get worse terms",
        "No leverage from volume relationships that brokers maintain",
        "If that lender declines, you start again from scratch",
      ],
      bestFor:
        "Developers with an existing strong lender relationship, simple vanilla projects, or those who genuinely understand the lending market",
      serviceSlug: "development-finance",
    },
    features: [
      { feature: "Lender Access", optionA: "100+ specialist lenders", optionB: "One lender at a time" },
      { feature: "Market Knowledge", optionA: "Real-time visibility on rates and appetite", optionB: "Limited to public information" },
      { feature: "Application Quality", optionA: "Professionally packaged to lender standards", optionB: "Self-prepared" },
      { feature: "Negotiation Leverage", optionA: "Volume relationships and competitive tension", optionB: "Individual borrower only" },
      { feature: "Cost", optionA: "1-2% broker fee (often from facility)", optionB: "No broker fee" },
      { feature: "Time Investment", optionA: "Minimal - broker handles the process", optionB: "Significant - you do everything" },
      { feature: "Complex Deals", optionA: "Expertise in structuring and problem-solving", optionB: "Limited to your own knowledge" },
      { feature: "If Declined", optionA: "Broker pivots to alternative lenders immediately", optionB: "Start again with a new lender" },
    ],
    verdict: [
      "We are obviously biased, so let us be transparent: strictly speaking, you do not need a broker. You can approach lenders directly, and some experienced developers with established lender relationships do exactly that. The question is whether the broker fee delivers value that exceeds its cost.",
      "In our experience, the answer is yes for the vast majority of deals. The competitive tension created by submitting to multiple lenders simultaneously almost always results in better terms than a single direct approach. We regularly see rate reductions of 0.5-1.5% and fee waivers that more than offset our arrangement fee. On a £2 million facility, a 0.5% rate improvement saves approximately £10,000 per year - more than covering a typical broker fee.",
      "Where going direct makes sense is when you have a genuine relationship with a specific lender, a very simple deal that does not require structuring, and you are confident that the lender's terms are competitive. Even then, many developers use a broker for due diligence - to confirm that the direct offer is actually as good as it appears.",
    ],
    faqs: [
      {
        question: "How much does a development finance broker charge?",
        answer:
          "Broker arrangement fees typically range from 1% to 2% of the gross facility. This is usually deducted from the initial advance or added to the loan, so there is no upfront cash cost to the developer. Some brokers charge a fixed fee instead. At Construction Capital, our fee is transparent and agreed before we begin work.",
      },
      {
        question: "Do I get worse rates going through a broker?",
        answer:
          "No - in fact, the opposite is usually true. Brokers have volume relationships with lenders that individual borrowers do not. Lenders offer brokers preferential rates because brokers send them a steady flow of well-packaged deals. The competitive tension from submitting to multiple lenders also drives rates down.",
      },
      {
        question:
          "Can a broker help if I have already been declined by a lender?",
        answer:
          "Absolutely. Being declined by one lender does not mean your project is unfundable. Different lenders have very different appetites for geography, asset class, borrower experience, and deal size. A specialist broker knows which lenders are most likely to support your specific scenario and can often find a solution where a direct approach failed.",
      },
    ],
    relatedGuides: ["application", "comparison", "development-finance"],
    relatedServices: ["development-finance", "bridging-loans", "mezzanine-finance"],
  },
];

export function getComparisonBySlug(
  slug: string
): ProductComparison | undefined {
  return PRODUCT_COMPARISONS.find((c) => c.slug === slug);
}
