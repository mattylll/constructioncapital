import type { ServiceSlug } from "./services";

export interface ServicePageContent {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  sections: {
    title: string;
    paragraphs: string[];
  }[];
  useCases: { title: string; description: string }[];
  processSteps: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  relatedSlugs: ServiceSlug[];
}

export const SERVICE_PAGE_CONTENT: Record<string, ServicePageContent> = {
  "development-finance": {
    metaTitle:
      "Development Finance | Ground-Up Funding from 6.5%",
    metaDescription:
      "Staged development finance for new-build projects. 65-70% LTGDV, 12-24 month terms. Expert brokers arranging £500K–£50M+ facilities across the UK.",
    h1: "Development Finance for Property Developers",
    heroSubtitle:
      "Senior debt funding for ground-up residential and commercial developments. Staged drawdowns aligned to your build programme, with rates from 6.5% p.a.",
    sections: [
      {
        title: "What Is Development Finance?",
        paragraphs: [
          "Development finance is the core funding product for new-build property projects. It provides the capital to purchase land and fund construction costs, typically structured as a senior debt facility with staged drawdowns released as your build programme progresses.",
          "Unlike traditional mortgages, development finance is assessed primarily on the projected end value of your scheme (Gross Development Value or GDV) rather than the current value of the site. This means viable projects with strong margins can secure funding even on land with limited current value.",
          "As specialist development finance brokers, we work with over 100 lenders — from high-street banks to specialist development funders — to source the most competitive terms for your specific project.",
        ],
      },
      {
        title: "How Staged Drawdowns Work",
        paragraphs: [
          "Development finance is released in stages rather than as a single lump sum. The initial tranche typically covers land acquisition, with subsequent drawdowns released against completed construction milestones verified by the lender's monitoring surveyor.",
          "This staged approach reduces the lender's risk exposure and keeps your interest costs lower — you only pay interest on funds that have been drawn. A typical 12-unit residential scheme might have 6-8 drawdown stages across a 15-month build programme.",
        ],
      },
    ],
    useCases: [
      {
        title: "Ground-Up Residential",
        description:
          "New-build housing schemes from single plots to 100+ unit developments.",
      },
      {
        title: "Commercial New Builds",
        description:
          "Purpose-built student accommodation, industrial units, and office developments.",
      },
      {
        title: "Mixed-Use Schemes",
        description:
          "Combined residential and commercial projects requiring flexible facility structures.",
      },
      {
        title: "Land with Planning",
        description:
          "Acquisition of sites with planning consent, with construction drawdowns following.",
      },
    ],
    processSteps: [
      {
        title: "Submit Your Deal",
        description:
          "Enter your project details in our Deal Room. We typically review within 24 hours.",
      },
      {
        title: "Lender Matching",
        description:
          "We match your project to the most suitable lenders from our 100+ panel and present indicative terms.",
      },
      {
        title: "Application & Valuation",
        description:
          "Full application submission with supporting documents. The lender instructs a valuation and monitoring surveyor.",
      },
      {
        title: "Drawdown & Build",
        description:
          "Funds are released in stages as construction progresses, verified by the monitoring surveyor.",
      },
    ],
    faqs: [
      {
        question: "What deposit do I need for development finance?",
        answer:
          "Most lenders require 30-35% equity contribution based on total project costs or GDV. Mezzanine finance can reduce this to 10-15% by stretching the capital stack behind the senior debt facility.",
      },
      {
        question: "How long does development finance take to arrange?",
        answer:
          "Typical timescales are 4-8 weeks from application to first drawdown. This includes valuation, legal due diligence, and credit committee approval. We can expedite urgent deals where needed.",
      },
      {
        question: "Can first-time developers get development finance?",
        answer:
          "Yes, though lender appetite varies. First-time developers typically need to demonstrate relevant construction or property experience, a strong professional team, and may face slightly higher rates or lower leverage.",
      },
      {
        question: "What is LTGDV and why does it matter?",
        answer:
          "Loan to Gross Development Value (LTGDV) is the ratio of your total borrowing to the projected end value of the completed scheme. Most senior lenders cap at 65-70% LTGDV. It is the primary metric lenders use to assess development finance applications.",
      },
      {
        question: "Do I need planning permission before applying?",
        answer:
          "Most lenders require at least outline planning consent. Some specialist lenders will fund pre-planning acquisitions at lower leverage, with the facility stepping up once planning is granted.",
      },
    ],
    relatedSlugs: [
      "mezzanine-finance",
      "development-exit-finance",
      "bridging-loans",
    ],
  },

  "mezzanine-finance": {
    metaTitle:
      "Mezzanine Finance | Stretch to 85-90% LTGDV",
    metaDescription:
      "Mezzanine property finance to reduce your equity contribution. Stretches borrowing to 85-90% LTGDV behind senior debt. Expert structuring for UK developers.",
    h1: "Mezzanine Finance for Property Development",
    heroSubtitle:
      "Reduce your equity requirement by stretching the capital stack to 85-90% LTGDV. Mezzanine sits behind senior debt, filling the gap between your facility and project costs.",
    sections: [
      {
        title: "What Is Mezzanine Finance?",
        paragraphs: [
          "Mezzanine finance is a second-charge loan that sits behind your senior development facility in the capital stack. Where senior debt typically covers 60-70% LTGDV, mezzanine stretches total borrowing to 80-90%, significantly reducing the equity you need to contribute from your own funds.",
          "The mezzanine lender takes more risk than the senior lender — they are repaid after the senior facility is cleared — which is reflected in higher interest rates, typically from 12% p.a. However, the overall cost of capital is usually lower than bringing in an equity partner who would take a share of your profits.",
        ],
      },
      {
        title: "The Capital Stack Explained",
        paragraphs: [
          "Every property development is funded through a combination of debt and equity — the capital stack. Senior debt forms the base (60-70% LTGDV), mezzanine fills the middle (stretching to 85-90%), and your equity contribution sits at the top. Getting this structure right is critical to maximising your return on equity.",
          "We structure mezzanine alongside senior debt as a single coordinated package. Many of our lender relationships offer combined senior-plus-mezzanine facilities, simplifying the process and ensuring both tranches work together seamlessly.",
        ],
      },
    ],
    useCases: [
      {
        title: "Reducing Equity Contribution",
        description:
          "Free up capital by borrowing more against your project, keeping equity available for other opportunities.",
      },
      {
        title: "Scaling Your Portfolio",
        description:
          "Run multiple projects simultaneously by spreading your equity across more deals.",
      },
      {
        title: "First-Time Developer Schemes",
        description:
          "Bridge the equity gap when you have a viable project but limited available cash.",
      },
      {
        title: "Large Residential Developments",
        description:
          "High-GDV schemes where even 30% equity represents a significant capital commitment.",
      },
    ],
    processSteps: [
      {
        title: "Capital Stack Review",
        description:
          "We assess your project and determine the optimal senior/mezzanine split.",
      },
      {
        title: "Coordinated Sourcing",
        description:
          "We approach senior and mezzanine lenders together, or source combined facilities.",
      },
      {
        title: "Intercreditor Agreement",
        description:
          "Legal documentation governing the relationship between senior and mezzanine lenders.",
      },
      {
        title: "Staged Drawdowns",
        description:
          "Both tranches draw down in coordination as your build progresses.",
      },
    ],
    faqs: [
      {
        question: "How much does mezzanine finance cost?",
        answer:
          "Mezzanine rates typically start from 12% p.a. (1% per month) with an arrangement fee of 1-2%. While more expensive than senior debt, the blended cost of senior-plus-mezzanine is usually significantly cheaper than giving away 40-60% of your profit to an equity partner.",
      },
      {
        question: "Can I get mezzanine finance with any senior lender?",
        answer:
          "Not all senior lenders permit a second charge. We specifically source from lenders who are comfortable with mezzanine in the capital stack, or arrange combined facilities from single sources that offer both tranches.",
      },
      {
        question: "What is an intercreditor agreement?",
        answer:
          "An intercreditor deed governs the priority and relationship between the senior and mezzanine lender. It sets out who gets repaid first, consent requirements, and what happens if the project runs into difficulty. This is a standard legal document in mezzanine structures.",
      },
      {
        question: "Is mezzanine finance better than bringing in an equity partner?",
        answer:
          "In most cases, yes — mezzanine is cheaper than equity. A mezzanine lender charges a fixed interest rate (typically 12-15% p.a.), while an equity partner typically takes 40-60% of the profit. On a profitable scheme, mezzanine preserves far more of your upside.",
      },
    ],
    relatedSlugs: [
      "development-finance",
      "equity-jv",
      "bridging-loans",
    ],
  },

  "bridging-loans": {
    metaTitle:
      "Bridging Loans | Funds in 7 Days from 0.55% p.m.",
    metaDescription:
      "Fast bridging finance for property professionals. Completion in as little as 7 days, 75% LTV, 1-18 month terms. Auction, chain-break & pre-planning specialists.",
    h1: "Bridging Loans for Property Investors & Developers",
    heroSubtitle:
      "Short-term finance for time-sensitive deals. Completion in as little as 7 days, with rates from 0.55% per month and LTVs up to 75%.",
    sections: [
      {
        title: "What Are Bridging Loans?",
        paragraphs: [
          "Bridging loans are short-term property finance facilities designed for situations where speed is essential. They bridge the gap between needing funds immediately and arranging longer-term finance, typically completing in 7-14 days compared to 6-8 weeks for conventional lending.",
          "Whether you are purchasing at auction with a 28-day completion deadline, breaking a property chain, or securing a site before planning consent, bridging finance provides the speed and certainty to act decisively when opportunities arise.",
        ],
      },
      {
        title: "Speed That Closes Deals",
        paragraphs: [
          "The property market rewards speed. Auction purchases require completion within 28 days. Off-market deals need rapid exchange to beat competing buyers. Pre-planning site acquisitions are time-sensitive as vendors rarely hold for slow finance.",
          "Our bridging lender panel includes specialists who can complete in as little as 5-7 working days. We have relationships with lenders whose credit committees meet daily, and legal processes that can be fast-tracked for urgent requirements.",
        ],
      },
    ],
    useCases: [
      {
        title: "Auction Purchases",
        description:
          "28-day completion timelines. Pre-approved facilities available for regular auction buyers.",
      },
      {
        title: "Chain Breaks",
        description:
          "Bridge the gap when your sale is delayed but your purchase needs to complete.",
      },
      {
        title: "Pre-Planning Acquisitions",
        description:
          "Secure sites ahead of planning consent at lower LTV, with exit via development finance.",
      },
      {
        title: "Refurbishment Bridge-to-Let",
        description:
          "Acquire and refurbish, then refinance onto a buy-to-let mortgage once works complete.",
      },
    ],
    processSteps: [
      {
        title: "Same-Day Assessment",
        description:
          "Submit your deal and receive an indicative decision within hours.",
      },
      {
        title: "Rapid Valuation",
        description:
          "Desktop or drive-by valuations for speed. Full valuations where required.",
      },
      {
        title: "Legal Fast-Track",
        description:
          "Dual-representation solicitors and streamlined legal processes.",
      },
      {
        title: "Completion in Days",
        description:
          "Funds released as quickly as 5-7 working days from instruction.",
      },
    ],
    faqs: [
      {
        question: "How quickly can I get a bridging loan?",
        answer:
          "The fastest completions are 5-7 working days from application. Typical timelines are 2-3 weeks. Speed depends on the complexity of the deal, the valuation method, and how quickly legal processes can be completed.",
      },
      {
        question: "What is the exit strategy for a bridging loan?",
        answer:
          "Every bridging loan requires a clear exit strategy — how you will repay the facility. Common exits include sale of the property, refinancing onto a longer-term mortgage, or refinancing into a development finance facility. Lenders assess the viability of your exit before approving the bridge.",
      },
      {
        question: "Are bridging loans regulated?",
        answer:
          "Bridging loans on property you will live in are FCA-regulated. Investment and commercial bridging is unregulated. Construction Capital arranges both regulated and unregulated bridging through appropriately authorised lender partners.",
      },
      {
        question: "Can I get a bridging loan on a property with no income?",
        answer:
          "Yes. Unlike mortgages, bridging lenders focus primarily on the property value and your exit strategy rather than rental income or personal earnings. Vacant, derelict, and non-standard properties are all considered.",
      },
      {
        question: "What fees are involved in bridging finance?",
        answer:
          "Typical fees include an arrangement fee (1-2% of the loan), valuation fee, and legal costs. Some lenders charge exit fees. We are transparent about all costs upfront so there are no surprises.",
      },
    ],
    relatedSlugs: [
      "refurbishment-finance",
      "development-finance",
      "development-exit-finance",
    ],
  },

  "equity-jv": {
    metaTitle:
      "Equity Funding & Joint Ventures | Zero-Deposit Development",
    metaDescription:
      "Connect with family offices and institutional equity partners for property development. Profit-share structures from 40%. Ideal for capital-light and first-time developers.",
    h1: "Equity Funding & Joint Venture Partnerships",
    heroSubtitle:
      "Access development capital through equity partnerships and joint venture structures. Fund up to 100% of your project costs with the right partner.",
    sections: [
      {
        title: "What Is Equity & JV Funding?",
        paragraphs: [
          "Equity and joint venture funding provides the developer's equity contribution on a project — the portion not covered by senior debt or mezzanine. An equity partner invests capital in exchange for a share of the development profit, rather than charging a fixed interest rate.",
          "This is the most expensive form of capital (you are giving away profit share), but it allows you to pursue projects with minimal or zero cash equity. For first-time developers, capital-light operators, or those wanting to scale rapidly, equity partnerships unlock deals that would otherwise be out of reach.",
        ],
      },
      {
        title: "Types of Equity Partners",
        paragraphs: [
          "We work with a range of equity providers including family offices, institutional investors, private equity funds, and high-net-worth individuals. Each has different criteria, return expectations, and involvement preferences.",
          "Family offices often provide more flexible terms and faster decision-making. Institutional investors suit larger schemes (£5M+ equity) with longer track records. HNW individuals may co-invest on smaller schemes. We match the right capital source to your specific project and experience level.",
        ],
      },
    ],
    useCases: [
      {
        title: "First-Time Developers",
        description:
          "Access equity from experienced partners who also bring industry knowledge and credibility with lenders.",
      },
      {
        title: "Capital-Light Growth",
        description:
          "Run multiple projects simultaneously by using equity partners rather than tying up your own cash.",
      },
      {
        title: "Large-Scale Schemes",
        description:
          "£10M+ GDV projects where the equity requirement alone exceeds most developers' available capital.",
      },
      {
        title: "Strategic Land",
        description:
          "Long-hold land with planning upside where debt is not appropriate but patient equity capital is.",
      },
    ],
    processSteps: [
      {
        title: "Project Assessment",
        description:
          "We evaluate your scheme, track record, and determine the equity requirement.",
      },
      {
        title: "Partner Matching",
        description:
          "We introduce your deal to pre-qualified equity sources suited to your project profile.",
      },
      {
        title: "Term Negotiation",
        description:
          "Profit-share structures, governance, decision-making rights, and reporting requirements.",
      },
      {
        title: "Legal & Close",
        description:
          "JV agreements, shareholder arrangements, and coordination with debt providers.",
      },
    ],
    faqs: [
      {
        question: "How much profit do equity partners typically take?",
        answer:
          "Profit shares typically range from 40-60% depending on the risk profile, developer experience, and how much equity the partner is contributing. Some structures include a preferred return (hurdle rate) before the profit split kicks in.",
      },
      {
        question: "Can I get 100% funding with an equity partner?",
        answer:
          "In theory, yes — if an equity partner funds the entire developer contribution and senior debt covers the rest. In practice, most lenders still want to see the developer with some skin in the game, even if that is as little as 5-10% of costs.",
      },
      {
        question: "What does an equity partner expect from me as a developer?",
        answer:
          "Equity partners evaluate your track record, professional team (architects, QS, contractors), the strength of the project appraisal, and your personal commitment. They will conduct thorough due diligence and typically want regular reporting and some oversight rights.",
      },
      {
        question: "How long does it take to find an equity partner?",
        answer:
          "Timelines vary from 4-12 weeks depending on deal size and complexity. Having a well-prepared investment memorandum with detailed appraisals, planning status, and professional team details significantly speeds up the process.",
      },
    ],
    relatedSlugs: [
      "mezzanine-finance",
      "development-finance",
      "commercial-mortgages",
    ],
  },

  "refurbishment-finance": {
    metaTitle:
      "Refurbishment Finance | Light & Heavy Refurb from 0.65% p.m.",
    metaDescription:
      "Finance for property refurbishment and conversion projects. Covers acquisition + works. 75% LTV, 6-18 months. HMO, commercial-to-resi & permitted development specialists.",
    h1: "Refurbishment Finance for Property Investors",
    heroSubtitle:
      "Fund property renovations, conversions, and HMO projects. Covers acquisition and works with rates from 0.65% per month.",
    sections: [
      {
        title: "What Is Refurbishment Finance?",
        paragraphs: [
          "Refurbishment finance provides the capital to purchase and renovate investment property. Unlike standard bridging or buy-to-let mortgages, refurb facilities are specifically designed to fund both the acquisition and the cost of works, with drawdowns released as renovation milestones are completed.",
          "The product suits property investors who buy below market value, add value through refurbishment, and either sell at profit or refinance onto a long-term mortgage at the improved valuation. It is the core funding product for the BRRR (Buy, Refurbish, Refinance, Rent) strategy.",
        ],
      },
      {
        title: "Light vs Heavy Refurbishment",
        paragraphs: [
          "Lenders distinguish between light and heavy refurbishment based on the scope of works. Light refurb covers cosmetic improvements — new kitchens, bathrooms, decoration, and garden works — without structural changes or planning permission. Heavy refurb involves structural alterations, extensions, change of use, or conversion work.",
          "Light refurb finance is faster to arrange and typically cheaper. Heavy refurb requires more detailed schedules of works, professional costings, and often a monitoring surveyor — similar to a small development facility. We source the right product for your specific scope.",
        ],
      },
    ],
    useCases: [
      {
        title: "HMO Conversions",
        description:
          "Convert standard houses into houses of multiple occupation for higher rental yields.",
      },
      {
        title: "Commercial-to-Residential",
        description:
          "Convert offices, shops, or industrial units to residential under permitted development rights.",
      },
      {
        title: "Cosmetic Refurbishment",
        description:
          "Light refurb to increase value and rental appeal before refinancing to a buy-to-let.",
      },
      {
        title: "Structural Renovation",
        description:
          "Heavy refurb including extensions, loft conversions, and basement excavations.",
      },
    ],
    processSteps: [
      {
        title: "Deal Submission",
        description:
          "Property details, purchase price, scope of works, and estimated end value.",
      },
      {
        title: "Lender Selection",
        description:
          "We match your refurb scope to lenders experienced with your property type.",
      },
      {
        title: "Valuation & Schedule",
        description:
          "Lender valuation and review of your schedule of works and cost estimates.",
      },
      {
        title: "Drawdowns Against Works",
        description:
          "Acquisition funds released at completion, refurb funds drawn against completed stages.",
      },
    ],
    faqs: [
      {
        question: "What is the difference between light and heavy refurb finance?",
        answer:
          "Light refurbishment covers cosmetic works (kitchens, bathrooms, decoration) without structural changes — typically under £50K. Heavy refurbishment involves structural work, extensions, change of use, or conversion — usually requiring planning permission and professional costings.",
      },
      {
        question: "Can refurbishment finance cover 100% of the works costs?",
        answer:
          "Many lenders will fund 100% of the refurbishment costs on top of the purchase facility, provided the combined loan stays within their LTV parameters (typically 70-75% of the projected end value).",
      },
      {
        question: "How does BRRR financing work?",
        answer:
          "Buy, Refurbish, Refinance, Rent: you purchase with a refurb bridge, complete the works, refinance onto a buy-to-let mortgage at the improved value (releasing your capital), and hold for rental income. We arrange both the initial refurb facility and the refinance.",
      },
      {
        question: "Do I need planning permission for refurbishment finance?",
        answer:
          "Light refurb typically does not require planning. Heavy refurb or change of use may need planning permission or prior approval under permitted development. Lenders will want to see the appropriate consents in place before releasing funds.",
      },
    ],
    relatedSlugs: [
      "bridging-loans",
      "development-finance",
      "commercial-mortgages",
    ],
  },

  "commercial-mortgages": {
    metaTitle:
      "Commercial Mortgages | Long-Term Finance from 5.5%",
    metaDescription:
      "Commercial mortgage advice for offices, retail, industrial & mixed-use. Up to 75% LTV, 3-25 year terms. Whole-of-market broker access across the UK.",
    h1: "Commercial Mortgages for Property Investors",
    heroSubtitle:
      "Long-term finance for commercial and semi-commercial property. Rates from 5.5% p.a., terms up to 25 years, LTVs up to 75%.",
    sections: [
      {
        title: "What Is a Commercial Mortgage?",
        paragraphs: [
          "A commercial mortgage provides long-term finance for purchasing, refinancing, or releasing equity from commercial property. Unlike residential mortgages, commercial lending is assessed on a combination of property income, tenant strength, lease terms, and the borrower's financial position.",
          "Commercial mortgages suit a wide range of property types including offices, retail units, industrial warehouses, mixed-use buildings, and semi-commercial properties (such as a shop with a flat above). Terms range from 3 to 25 years with either fixed or variable rates.",
        ],
      },
      {
        title: "Owner-Occupied vs Investment",
        paragraphs: [
          "Commercial mortgages fall into two categories. Owner-occupied facilities are for businesses purchasing their own premises — the property is used to trade from rather than let out. Investment commercial mortgages fund the purchase of property let to tenants.",
          "Lender appetite and terms differ between the two. Investment properties with strong tenants on long leases typically achieve better rates and higher leverage. Owner-occupied lending depends more on the trading strength of the business.",
        ],
      },
    ],
    useCases: [
      {
        title: "Office Acquisitions",
        description:
          "Purchase office space for your business or as a tenanted investment.",
      },
      {
        title: "Retail & High Street",
        description:
          "Shops, restaurants, and retail units — both single assets and small portfolios.",
      },
      {
        title: "Industrial & Warehousing",
        description:
          "Warehouses, light industrial units, and logistics facilities with strong rental demand.",
      },
      {
        title: "Refinancing & Equity Release",
        description:
          "Remortgage existing commercial holdings to release capital or secure better terms.",
      },
    ],
    processSteps: [
      {
        title: "Requirements Review",
        description:
          "Property type, value, income, your financial position, and intended use.",
      },
      {
        title: "Market Search",
        description:
          "We search our whole-of-market panel for the best terms matching your profile.",
      },
      {
        title: "Application",
        description:
          "Full application with financials, tenancy schedules, and property details.",
      },
      {
        title: "Completion",
        description:
          "Valuation, legal process, and drawdown — typically 6-10 weeks.",
      },
    ],
    faqs: [
      {
        question: "What deposit do I need for a commercial mortgage?",
        answer:
          "Most commercial lenders require a minimum 25% deposit (75% LTV). Some specialist lenders offer up to 80% LTV for strong covenant tenants or established businesses. The deposit required depends on the property type, tenant quality, and your financial strength.",
      },
      {
        question: "Can I get a commercial mortgage for a mixed-use property?",
        answer:
          "Yes. Mixed-use properties (commercial and residential) are widely funded. Some lenders treat these as commercial, others as semi-commercial with slightly different terms. We find the best approach for your specific property.",
      },
      {
        question: "What are typical commercial mortgage rates?",
        answer:
          "Rates currently start from around 5.5% p.a. for strong applications. The rate depends on property type, LTV, tenant quality, lease length, and whether you choose fixed or variable. We source across the market to find the most competitive rate for your deal.",
      },
      {
        question: "How long does a commercial mortgage take to arrange?",
        answer:
          "Typical timescales are 6-10 weeks from application to completion. This includes valuation, credit approval, and legal processes. Straightforward deals with clean tenancy and financials can sometimes complete faster.",
      },
    ],
    relatedSlugs: [
      "development-exit-finance",
      "bridging-loans",
      "refurbishment-finance",
    ],
  },

  "development-exit-finance": {
    metaTitle:
      "Development Exit Finance | Release Capital from 0.55% p.m.",
    metaDescription:
      "Replace your development loan once construction completes. Phased unit sales, reduced rates from 0.55% p.m., 75% LTV. Free up capital for your next project.",
    h1: "Development Exit Finance",
    heroSubtitle:
      "Replace your development facility once construction completes. Lower your holding costs while you sell, and free up capital for your next project.",
    sections: [
      {
        title: "What Is Development Exit Finance?",
        paragraphs: [
          "Development exit finance is a short-term facility that repays your development loan once construction is substantially complete. It replaces the more expensive development finance with a lower-cost holding facility, giving you time to sell completed units at the best price rather than accepting discounted offers to meet your development lender's repayment deadline.",
          "Most development loans require full repayment within 6 months of practical completion. Development exit finance extends that window at a significantly lower rate — typically 0.55-0.85% per month compared to 0.75-1.0%+ on the development facility.",
        ],
      },
      {
        title: "Capital Recycling",
        paragraphs: [
          "One of the key benefits of development exit finance is capital recycling. As each unit sells, the exit facility reduces, and your development finance is fully repaid. This means any profit from early sales can be redeployed into your next acquisition while remaining units continue to sell.",
          "For developers building a pipeline of projects, this is transformative. Instead of waiting for every unit to sell before starting the next scheme, you can overlap projects and significantly increase your annual output.",
        ],
      },
    ],
    useCases: [
      {
        title: "Completed Schemes",
        description:
          "Repay your maturing development facility while units are marketed and sold.",
      },
      {
        title: "Phased Disposals",
        description:
          "Sell units individually at full market value rather than bulk-discounting to hit deadlines.",
      },
      {
        title: "Pipeline Developers",
        description:
          "Free up capital and credit lines to start your next project before current sales complete.",
      },
      {
        title: "Rental Retention",
        description:
          "Hold completed units temporarily while market conditions improve or rental yields stabilise.",
      },
    ],
    processSteps: [
      {
        title: "Completion Assessment",
        description:
          "We assess your scheme at or near practical completion and review the sales position.",
      },
      {
        title: "Exit Facility Sourcing",
        description:
          "We source competitive exit facilities, often from lenders different to your original funder.",
      },
      {
        title: "Refinance & Repay",
        description:
          "The exit facility repays your development lender. Sales proceeds reduce the exit loan.",
      },
      {
        title: "Final Redemption",
        description:
          "The exit facility is repaid in full from remaining unit sales, typically within 6-12 months.",
      },
    ],
    faqs: [
      {
        question: "When should I arrange development exit finance?",
        answer:
          "Ideally 3-6 months before your development facility matures or practical completion. This gives time to arrange the exit facility without pressure. We recommend discussing exit strategy at the start of your development, not at the end.",
      },
      {
        question: "Is development exit finance cheaper than my development loan?",
        answer:
          "Almost always, yes. Development loans carry higher rates because of construction risk. Once the build is complete, that risk is removed, and exit lenders reflect this with lower rates — typically 0.55-0.85% per month compared to 0.75-1.0%+ on the development facility.",
      },
      {
        question: "Can I keep some units to rent instead of selling?",
        answer:
          "Yes, many exit facilities allow you to retain a portion of units. The exit lender will want a clear plan for those retained units — typically refinancing them onto a buy-to-let mortgage within an agreed timeframe.",
      },
      {
        question: "What if my development loan has already expired?",
        answer:
          "If your development lender is charging penalty rates or has issued a repayment demand, we can still arrange exit finance — often completing within 2-4 weeks. The sooner you act, the more options are available.",
      },
    ],
    relatedSlugs: [
      "development-finance",
      "commercial-mortgages",
      "bridging-loans",
    ],
  },
};
