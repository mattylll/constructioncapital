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
      "Property Development Finance UK | Development Loans from 6.5%",
    metaDescription:
      "Specialist property development finance for UK developers. Senior debt loans up to 70% LTGDV, rates from 6.5% p.a., 12-24 month terms. Broker access to 100+ development finance lenders.",
    h1: "Property Development Finance",
    heroSubtitle:
      "Senior debt funding for ground-up residential and commercial property developments across the UK. Staged drawdowns aligned to your build programme, with development loan rates from 6.5% p.a. and up to 70% LTGDV.",
    sections: [
      {
        title: "What Is Property Development Finance?",
        paragraphs: [
          "Property development finance is a specialist loan product designed to fund the construction of new-build residential and commercial property developments. Unlike a standard mortgage, a development finance loan is assessed primarily on the projected end value of your completed scheme, known as the Gross Development Value (GDV), rather than the current value of the site or your personal income.",
          "The loan is structured as a senior debt facility with staged drawdowns released as your build programme progresses. The initial tranche typically covers land acquisition, with subsequent drawdowns released against completed construction milestones verified by the lender's monitoring surveyor. This staged approach means you only pay interest on funds that have been drawn, keeping your overall finance costs lower.",
          "As specialist <a href=\"/guides/broker-fees-development-finance\">development finance brokers</a>, we work with over 100 lenders across the UK, from high-street banks to specialist development finance lenders and challenger banks. Our role is to match your property development project to the most competitive funding options available, negotiating rates, leverage, and loan terms on your behalf.",
        ],
      },
      {
        title: "How Does Property Development Finance Work?",
        paragraphs: [
          "Development finance works differently from a standard business loan or mortgage. Rather than receiving a lump sum, your facility is drawn down in stages as construction progresses. A typical development loan might have 6 to 10 drawdown stages across a 12 to 24 month build programme, with each release verified by an independent monitoring surveyor instructed by the lender.",
          "The amount you can borrow is determined by two key metrics. Loan to Gross Development Value (LTGDV) measures your total borrowing as a percentage of the projected end value of the completed scheme. Most senior lenders cap this at 60-70% LTGDV. Loan to Cost (LTC) measures borrowing against total project costs, typically capped at 80-90%. The lender will apply whichever metric produces the lower loan amount.",
          "Interest can be serviced monthly or, more commonly, rolled up and added to the loan balance for repayment at the end of the term. The repayment of development finance typically comes from the sale of completed units or refinancing onto long-term mortgages. Your exit strategy is a critical part of any development finance application, and lenders will scrutinise this carefully before approving your loan.",
        ],
      },
      {
        title: "Types of Property Development Finance",
        paragraphs: [
          "There are several different types of development finance available depending on the nature of your project. Ground-up development finance is the most common, funding new-build residential or commercial property developments from site acquisition through to practical completion. This suits everything from single-plot builds to large housing developments of 100+ units.",
          "Conversion and refurbishment finance covers projects that involve changing the use of an existing building, such as <a href=\"/calculators/office-to-residential\">office-to-residential conversions</a> under permitted development rights, or the conversion of barns, churches, and commercial buildings into residential dwellings. For lighter-touch renovation projects, <a href=\"/services/refurbishment-finance\">refurbishment finance</a> may be more appropriate and cost-effective.",
          "For larger schemes, the capital stack can be structured with senior debt alongside <a href=\"/services/mezzanine-finance\">mezzanine finance</a> to stretch total borrowing to 85-90% LTGDV, reducing the equity contribution required from the developer. Where developers lack the equity for even a mezzanine-supported structure, <a href=\"/services/equity-jv\">equity and joint venture partnerships</a> can fill the gap.",
        ],
      },
      {
        title: "Eligibility and Criteria for Development Finance",
        paragraphs: [
          "Development finance lenders assess applications based on the viability of the project, the experience of the developer, and the strength of the professional team. Most lenders require at least outline planning permission in place before they will consider a development finance application, although some specialist lenders will fund pre-planning acquisitions at lower leverage.",
          "Your track record as a property developer matters significantly. Experienced developers with a proven history of delivering schemes on time and within budget will access better rates and higher leverage. First-time developers can still secure development finance, but may face higher interest rates, lower LTGDV caps, and requirements to appoint an experienced project manager or contractor.",
          "Lenders also look at the professional team behind the project, including your architect, quantity surveyor (QS), main contractor, and solicitor. A RICS-registered valuation of the site and proposed scheme will be required, along with detailed build cost estimates, a realistic sales appraisal, and evidence of comparable property values in the local market.",
        ],
      },
      {
        title: "Costs Involved in Development Finance",
        paragraphs: [
          "The costs of a property development loan extend beyond the headline interest rate. Arrangement fees typically range from 1-2% of the gross loan facility, payable on completion of the legal process. Valuation fees cover the RICS valuation of your site and proposed scheme, and typically cost between £2,000 and £10,000 depending on the size of the development.",
          "Monitoring surveyor fees are an ongoing cost throughout the build programme. The lender appoints an independent surveyor to inspect your site before each drawdown, verifying that construction milestones have been met. These inspections typically cost £500 to £1,500 per visit. <a href=\"/guides/monitoring-surveyor-fees-explained\">Legal fees</a>, broker fees, and building control costs should also be factored into your total development finance costs.",
          "You can model these costs using our <a href=\"/calculators/development-finance\">development finance calculator</a>, which provides an indicative breakdown of total finance costs based on your loan amount, interest rate, and build programme duration. We are transparent about all costs from the outset, ensuring there are no hidden fees in your development finance facility.",
        ],
      },
      {
        title: "How to Apply for Development Finance",
        paragraphs: [
          "To apply for property development finance through Construction Capital, start by submitting your project details in our <a href=\"/deal-room\">Deal Room</a>. We typically review new enquiries within 24 hours and come back to you with an initial assessment of the funding options available for your scheme.",
          "We then match your development project to the most suitable lenders from our panel of 100+ development finance lenders across the UK. We present you with indicative terms from multiple sources, explaining the pros and cons of each option so you can make an informed decision. Once you have selected a lender, we manage the full application process including valuation instruction, legal coordination, and credit committee submission.",
          "Typical timescales from application to first drawdown are 4 to 8 weeks, depending on the size and type of property development. This includes the RICS valuation, legal due diligence, and credit committee approval. We can expedite urgent deals where a faster timeline is needed, and we have relationships with lenders whose credit committees meet daily for time-sensitive transactions.",
        ],
      },
    ],
    useCases: [
      {
        title: "Ground-Up Residential Developments",
        description:
          "New-build housing schemes from single plots to 100+ unit developments, including apartments, houses, and mixed tenure projects.",
      },
      {
        title: "Commercial New Builds",
        description:
          "Purpose-built student accommodation (PBSA), industrial units, office developments, and logistics facilities.",
      },
      {
        title: "Mixed-Use Schemes",
        description:
          "Combined residential and commercial property developments requiring flexible facility structures with different valuation approaches per element.",
      },
      {
        title: "Land Acquisition with Planning",
        description:
          "Purchase of sites with planning consent in place, with construction drawdowns following as the build programme begins.",
      },
      {
        title: "Permitted Development Conversions",
        description:
          "Office-to-residential, commercial-to-residential, and other conversions under permitted development rights (PDR), funded as development or heavy refurbishment facilities.",
      },
      {
        title: "Section 106 and CIL-Heavy Schemes",
        description:
          "Larger housing developments with significant planning obligations, where finance structures need to account for affordable housing contributions and community infrastructure levy payments.",
      },
    ],
    processSteps: [
      {
        title: "Submit Your Deal",
        description:
          "Enter your project details in our Deal Room. We typically review within 24 hours and provide an initial assessment.",
      },
      {
        title: "Lender Matching",
        description:
          "We match your project to the most suitable development finance lenders from our 100+ panel and present indicative terms from multiple sources.",
      },
      {
        title: "Application & Valuation",
        description:
          "Full application submission with supporting documents. The lender instructs a RICS valuation and appoints a monitoring surveyor.",
      },
      {
        title: "Drawdown & Build",
        description:
          "Funds are released in stages as construction progresses, verified by the monitoring surveyor at each milestone.",
      },
    ],
    faqs: [
      {
        question: "What deposit do I need for property development finance?",
        answer:
          "Most development finance lenders require a 30-35% equity contribution based on total project costs or GDV. This means the senior loan covers 65-70% LTGDV. You can reduce your cash equity requirement to 10-15% by layering mezzanine finance behind the senior debt facility, stretching total borrowing to 85-90% LTGDV.",
      },
      {
        question: "How does a property development loan work?",
        answer:
          "A property development loan is drawn down in stages aligned to your build programme. The initial tranche covers land acquisition, with subsequent drawdowns released as construction milestones are completed and verified by the lender's monitoring surveyor. Interest is typically rolled up and repaid from unit sales or refinancing at the end of the loan term.",
      },
      {
        question: "Can first-time developers get development finance?",
        answer:
          "Yes, funding can be arranged for first-time developers, though lender appetite varies. You will typically need to demonstrate relevant construction or property experience, appoint an experienced project manager or contractor, and may face slightly higher rates or lower leverage. Having a strong professional team and a well-prepared appraisal significantly improves your chances.",
      },
      {
        question: "How long does development finance take to arrange?",
        answer:
          "Typical timescales are 4-8 weeks from application to first drawdown. This includes RICS valuation, legal due diligence, and credit committee approval. We can expedite urgent deals where needed, with some lenders able to complete within 2-3 weeks for straightforward applications.",
      },
      {
        question: "What is LTGDV and why does it matter?",
        answer:
          "Loan to Gross Development Value (LTGDV) is the ratio of your total borrowing to the projected end value of the completed scheme. It is the primary metric that development finance lenders use to assess applications. Most senior lenders cap at 65-70% LTGDV, with mezzanine stretching this to 85-90%.",
      },
      {
        question: "Do I need planning permission before applying?",
        answer:
          "Most lenders require at least outline planning consent. Some specialist lenders will fund pre-planning site acquisitions at lower leverage, with the facility stepping up once planning permission is granted. Having detailed planning consent in place will give you access to better rates and higher leverage.",
      },
      {
        question: "Can I get 100% development finance?",
        answer:
          "100% development finance is not available from a single senior lender, as all require some equity contribution. However, by combining senior debt with mezzanine finance and equity or JV partnerships, it is possible to structure funding that covers close to 100% of total project costs. The trade-off is higher overall finance costs and profit sharing.",
      },
      {
        question: "How much can I borrow with property development finance?",
        answer:
          "Borrowing is determined by two metrics: LTGDV (typically 60-70% of the projected end value) and Loan to Cost (typically 80-90% of total project costs). The lender applies whichever produces the lower loan amount. Our panel funds development projects from £250,000 to over £50 million.",
      },
      {
        question: "What is the difference between development finance and a bridging loan?",
        answer:
          "Development finance is specifically designed for construction projects with staged drawdowns aligned to the build programme. Bridging loans are short-term facilities for acquiring property quickly, without construction funding. A bridging loan might be used to acquire a site before development finance is in place, with the bridge repaid when the development facility completes.",
      },
      {
        question: "Can you get a bank loan for property development?",
        answer:
          "Yes, several high-street banks offer property development loans, but criteria tend to be stricter and timescales longer than specialist development finance lenders. Banks typically require a stronger track record, lower leverage, and longer processing times. As a broker, we search across banks and specialist lenders to find the best fit for your project.",
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
      "Mezzanine Finance for Property Development | 85-90% LTGDV",
    metaDescription:
      "Mezzanine property development finance to reduce your equity contribution. Stretch borrowing to 85-90% LTGDV behind senior debt. Expert capital stack structuring for UK developers.",
    h1: "Mezzanine Finance for Property Development",
    heroSubtitle:
      "Reduce your equity requirement by stretching the capital stack to 85-90% LTGDV. Mezzanine finance sits behind senior debt, filling the gap between your facility and total project costs.",
    sections: [
      {
        title: "What Is Mezzanine Finance?",
        paragraphs: [
          "Mezzanine finance is a second-charge development loan that sits behind your senior debt facility in the capital stack. Where <a href=\"/services/development-finance\">senior development finance</a> typically covers 60-70% of the Gross Development Value (LTGDV), mezzanine stretches total borrowing to 80-90%, significantly reducing the equity you need to contribute from your own funds.",
          "The mezzanine lender takes more risk than the senior lender because they are repaid after the senior facility is cleared. This additional risk is reflected in higher interest rates, typically starting from 12% per annum (1% per month). However, the overall blended cost of senior-plus-mezzanine borrowing is usually significantly cheaper than bringing in an <a href=\"/services/equity-jv\">equity partner</a> who would take a 40-60% share of your development profit.",
          "Mezzanine finance is one of the most powerful tools available to property developers seeking to maximise their return on equity. By reducing the cash you need to inject into each scheme, you can deploy your capital across multiple projects simultaneously, scaling your development business faster.",
        ],
      },
      {
        title: "How Does Mezzanine Finance Work?",
        paragraphs: [
          "Mezzanine finance works alongside senior debt as part of a coordinated capital stack. The senior lender provides the first-charge loan (typically 60-70% LTGDV), the mezzanine lender provides a second-charge loan (stretching total debt to 85-90% LTGDV), and the developer contributes the remaining 10-15% as equity.",
          "Both facilities draw down in stages as construction progresses, with the monitoring surveyor verifying milestones for both the senior and mezzanine lender. On repayment, the senior debt is cleared first from sales proceeds, followed by the mezzanine. This waterfall structure is governed by an intercreditor agreement between the two lenders.",
          "We structure mezzanine alongside senior debt as a single coordinated package. Many of our lender relationships offer combined senior-plus-mezzanine facilities from a single source, simplifying the process and eliminating the need for a separate intercreditor deed. Where separate lenders are used, we manage the coordination to ensure both tranches work together seamlessly.",
        ],
      },
      {
        title: "The Capital Stack Explained",
        paragraphs: [
          "Every property development is funded through a combination of debt and equity, collectively known as the capital stack. Understanding this structure is essential for maximising your return on investment. Senior debt forms the base of the stack at 60-70% LTGDV, mezzanine fills the middle layer stretching to 85-90%, and your equity contribution sits at the top.",
          "Getting the capital stack right is critical. Too little debt and you tie up excess capital in a single project. Too much debt and the interest burden eats into your profit margin. We use our <a href=\"/calculators/development-finance\">development finance calculator</a> to model different scenarios, helping you find the optimal balance between leverage, cost, and risk for each scheme.",
          "For developers building a pipeline of projects, the capital stack becomes a strategic tool. By using mezzanine finance to reduce your equity requirement on each deal from 30-35% to just 10-15%, you can potentially run three projects simultaneously with the same capital that would otherwise fund a single scheme.",
        ],
      },
      {
        title: "Mezzanine Finance Costs and Fees",
        paragraphs: [
          "Mezzanine interest rates typically start from 12% per annum (1% per month), with arrangement fees of 1-2% of the mezzanine loan amount. Interest is usually rolled up and repaid alongside the mezzanine principal at the end of the loan term from development sales proceeds.",
          "While mezzanine is more expensive than senior debt on a standalone basis, the key comparison is against the alternative. An equity partner taking a 50% profit share on a scheme generating £500,000 profit costs you £250,000. A mezzanine facility covering the same equity gap at 15% per annum over 18 months might cost £45,000 to £60,000 in interest and fees. The maths strongly favours mezzanine in most scenarios.",
          "We always present a clear cost comparison between mezzanine finance, equity partnerships, and self-funding so you can make an informed decision. Use our <a href=\"/calculators/development-profit\">development profit calculator</a> to model the impact of different capital structures on your net return.",
        ],
      },
      {
        title: "Eligibility for Mezzanine Finance",
        paragraphs: [
          "Mezzanine lenders assess applications based on the overall strength of the development project, the experience of the developer, and the viability of the senior-plus-mezzanine structure. A strong GDV appraisal with healthy profit margins (typically 20%+ on cost) is essential, as the mezzanine lender needs confidence that the scheme can support both tranches of debt.",
          "Not all senior lenders permit a second charge on the development site. We specifically source from lenders who are comfortable with mezzanine in the capital stack, or arrange combined facilities from single sources. Your senior lender must consent to the mezzanine, and this is documented in the intercreditor agreement governing both facilities.",
          "First-time developers can access mezzanine finance, but lenders will look more closely at the professional team, the project manager's track record, and the overall risk profile. Having a detailed <a href=\"/guides/legal-due-diligence-development-finance\">development appraisal</a> and a credible build cost estimate from a qualified quantity surveyor significantly strengthens your application.",
        ],
      },
      {
        title: "How to Apply for Mezzanine Finance",
        paragraphs: [
          "Submit your project details in our <a href=\"/deal-room\">Deal Room</a> and indicate that you are seeking mezzanine finance alongside senior debt. We will review your scheme within 24 hours and advise on the optimal capital stack structure for your project.",
          "We then approach senior and mezzanine lenders together, or source combined facilities from single providers, presenting you with coordinated packages that maximise your leverage while keeping blended finance costs competitive. The application process typically takes 4-8 weeks from initial enquiry to drawdown.",
        ],
      },
    ],
    useCases: [
      {
        title: "Reducing Equity Contribution",
        description:
          "Free up your capital by borrowing more against your project, keeping equity available for other opportunities or as a reserve.",
      },
      {
        title: "Scaling Your Development Portfolio",
        description:
          "Run multiple projects simultaneously by spreading your equity across more deals, using mezzanine to reduce the cash requirement on each.",
      },
      {
        title: "First-Time Developer Schemes",
        description:
          "Bridge the equity gap when you have a viable project and a strong professional team but limited available capital.",
      },
      {
        title: "Large Residential Developments",
        description:
          "High-GDV schemes where even 30% equity represents a significant capital commitment that exceeds your available cash.",
      },
      {
        title: "Portfolio Developers Recycling Capital",
        description:
          "Developers who need to start their next project before the current scheme has fully sold, using mezzanine to reduce capital tied up in each deal.",
      },
      {
        title: "Schemes with Strong Margins",
        description:
          "Projects with profit margins of 20%+ on cost where the interest cost of mezzanine is comfortably covered by the development surplus.",
      },
    ],
    processSteps: [
      {
        title: "Capital Stack Review",
        description:
          "We assess your project and determine the optimal senior/mezzanine split to maximise leverage while maintaining viable profit margins.",
      },
      {
        title: "Coordinated Sourcing",
        description:
          "We approach senior and mezzanine lenders together, or source combined facilities from single providers.",
      },
      {
        title: "Intercreditor Agreement",
        description:
          "Legal documentation governing the relationship between senior and mezzanine lenders, setting out priority, consent, and enforcement rights.",
      },
      {
        title: "Staged Drawdowns",
        description:
          "Both tranches draw down in coordination as your build programme progresses, verified by the monitoring surveyor.",
      },
    ],
    faqs: [
      {
        question: "How much does mezzanine finance cost?",
        answer:
          "Mezzanine rates typically start from 12% per annum (1% per month) with an arrangement fee of 1-2%. While more expensive than senior debt, the blended cost of senior-plus-mezzanine is usually significantly cheaper than giving away 40-60% of your profit to an equity partner.",
      },
      {
        question: "Can I get mezzanine finance with any senior lender?",
        answer:
          "Not all senior lenders permit a second charge. We specifically source from lenders who are comfortable with mezzanine in the capital stack, or arrange combined facilities from single sources that offer both tranches. Your senior lender must formally consent to the mezzanine.",
      },
      {
        question: "What is an intercreditor agreement?",
        answer:
          "An intercreditor deed governs the priority and relationship between the senior and mezzanine lender. It sets out who gets repaid first, consent requirements for variations, and what happens if the project runs into difficulty. This is a standard legal document in mezzanine structures and is prepared by the senior lender's solicitors.",
      },
      {
        question: "Is mezzanine finance better than bringing in an equity partner?",
        answer:
          "In most cases, yes. A mezzanine lender charges a fixed interest rate (typically 12-15% p.a.), while an equity partner typically takes 40-60% of the development profit. On a profitable scheme, mezzanine preserves far more of your upside. However, equity partnerships may suit first-time developers who also need the partner's experience and credibility.",
      },
      {
        question: "What LTGDV can I achieve with mezzanine?",
        answer:
          "With senior debt plus mezzanine, you can typically stretch total borrowing to 85-90% LTGDV, reducing your equity requirement to just 10-15% of the Gross Development Value. Some combined facilities from specialist lenders can go even higher for exceptional projects.",
      },
      {
        question: "Can first-time developers access mezzanine finance?",
        answer:
          "Yes, though mezzanine lenders will look closely at your professional team, project manager's experience, and the overall risk profile of the scheme. Having a strong QS cost plan, credible architect, and experienced contractor significantly helps your application.",
      },
      {
        question: "How is mezzanine finance repaid?",
        answer:
          "Mezzanine finance is repaid from development sales proceeds or refinancing, after the senior debt has been fully cleared. Interest is typically rolled up throughout the loan term rather than serviced monthly, so there are no monthly payments to manage during the build programme.",
      },
      {
        question: "Can I use mezzanine for a refurbishment project?",
        answer:
          "Mezzanine is most commonly used alongside development finance for ground-up schemes, but some lenders will provide mezzanine-style second-charge facilities for heavy refurbishment projects where the works budget and projected uplift in value are substantial enough to support the additional debt layer.",
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
      "Bridging Loans for Property Development | Funds in 7 Days from 0.55% p.m.",
    metaDescription:
      "Fast bridging finance for property developers and investors. Completion in as little as 7 days, up to 75% LTV, 1-18 month terms. Auction, chain-break and pre-planning bridge specialists across the UK.",
    h1: "Bridging Loans for Property Development",
    heroSubtitle:
      "Short-term bridging finance for time-sensitive property deals. Completion in as little as 7 days, with rates from 0.55% per month and LTVs up to 75%.",
    sections: [
      {
        title: "What Is a Bridging Loan for Property Development?",
        paragraphs: [
          "A bridging loan is a short-term finance facility designed for property developers and investors who need to act fast. Bridging finance bridges the gap between needing capital immediately and arranging longer-term funding, typically completing in 7 to 14 days compared to 6 to 8 weeks for conventional mortgage lending.",
          "Property development bridging loans are used for a wide range of purposes: purchasing at auction with a 28-day completion deadline, securing an off-market site before competitors, acquiring property ahead of planning permission, or breaking a chain when your existing sale is delayed. In every case, bridging finance provides the speed and certainty that standard lending cannot match.",
          "Construction Capital specialises in unregulated commercial and investment bridging for property developers and investors across the UK. We source from a panel of specialist bridging lenders who can deliver rapid decisions and fast completions, with finance options tailored to your specific deal.",
        ],
      },
      {
        title: "How Does a Property Bridging Loan Work?",
        paragraphs: [
          "A bridging loan is secured against property, either the asset being purchased or existing property you own. The lender assesses the loan primarily on the value of the security and the viability of your exit strategy, rather than personal income or rental yields. This means vacant, derelict, and non-standard properties are all considered.",
          "Loan terms typically range from 1 to 18 months, with interest charged monthly (usually between 0.55% and 1.0% per month). Interest can be serviced monthly, rolled up into the loan balance, or retained from the advance. Most bridging lenders offer up to 75% LTV on residential property and 65-70% on commercial properties.",
          "Every bridge loan requires a clear exit strategy, meaning a defined plan for how you will repay the facility. Common exit strategies include sale of the property, refinancing onto a longer-term mortgage or buy-to-let product, or refinancing into a <a href=\"/services/development-finance\">development finance facility</a> once planning permission is secured.",
        ],
      },
      {
        title: "Types of Bridging Finance for Property Developers",
        paragraphs: [
          "Development bridging loans fall into several categories depending on their purpose. Acquisition bridges fund the rapid purchase of sites or property, typically ahead of arranging longer-term finance. These are the most common type and suit auction purchases, off-market deals, and pre-planning site acquisitions.",
          "Refurbishment bridges combine the acquisition funding with capital to carry out renovation works. For light refurbishment (cosmetic improvements without structural changes), the process is fast and straightforward. For heavier works, lenders may structure the facility similarly to a small <a href=\"/services/refurbishment-finance\">refurbishment finance</a> deal with staged drawdowns against completed works.",
          "Bridge-to-let facilities are designed for investors using the BRRR strategy (Buy, Refurbish, Refinance, Rent). You purchase with the bridge, complete light refurbishment, then refinance onto a buy-to-let mortgage at the improved valuation. We can arrange both the initial bridge and the refinance as a coordinated package.",
          "Chain-break bridges allow you to complete a property purchase even when your existing sale is delayed or has fallen through. The bridge is repaid when your property eventually sells, preventing the loss of a time-sensitive purchase.",
        ],
      },
      {
        title: "Bridging Loan Costs and Fees",
        paragraphs: [
          "Bridging finance costs include the monthly interest rate (typically 0.55-1.0% per month), an arrangement fee (1-2% of the loan amount), valuation fee, and legal costs. Some bridging lenders also charge exit fees, although we favour lenders who do not.",
          "The total cost of a bridging loan depends on the duration, loan amount, and your chosen interest payment method. Retained interest (deducted from the advance upfront) can be the most cost-effective approach if the bridge is repaid early, as unused interest is refunded. We are transparent about all costs upfront so there are no surprises, and we can model the total cost for you before you commit.",
          "It is worth noting that bridging finance regulated by the Financial Conduct Authority (FCA) applies only to property you intend to live in. Investment and commercial bridging for property developers is unregulated, which means faster processing and more flexible criteria, but with fewer consumer protections.",
        ],
      },
      {
        title: "How to Get the Right Bridging Loan for Property Development",
        paragraphs: [
          "As a specialist broker, we search across our entire bridging lender panel to find the right facility for your specific deal. The best bridging loan for a property developer depends on the purpose, timeline, security type, and exit strategy. Auction purchases need the fastest possible completion. Pre-planning bridges need a lender comfortable with the planning risk. Refurbishment bridges need a lender who funds both acquisition and works.",
          "Submit your deal in our <a href=\"/deal-room\">Deal Room</a> and receive an indicative decision within hours. We have relationships with bridging lenders whose credit committees meet daily, and legal processes that can be fast-tracked for urgent requirements. Our panel includes lenders who can complete in as little as 5 to 7 working days for straightforward transactions.",
        ],
      },
    ],
    useCases: [
      {
        title: "Auction Purchases",
        description:
          "28-day completion timelines. Pre-approved facilities available for regular auction buyers who need certainty of funding.",
      },
      {
        title: "Chain Breaks",
        description:
          "Bridge the gap when your existing sale is delayed but your purchase needs to complete to avoid losing the deal.",
      },
      {
        title: "Pre-Planning Site Acquisitions",
        description:
          "Secure development sites ahead of planning consent at lower LTV, with exit via development finance once planning permission is granted.",
      },
      {
        title: "Refurbishment Bridge-to-Let",
        description:
          "Acquire and refurbish a property, then refinance onto a buy-to-let mortgage at the improved valuation, releasing your capital.",
      },
      {
        title: "Off-Market Opportunities",
        description:
          "Act fast on off-market property deals where the vendor requires rapid exchange and completion to beat competing buyers.",
      },
      {
        title: "Uninhabitable Property Purchases",
        description:
          "Fund the purchase of properties that are unmortgageable due to their condition, with exit via refurbishment and refinance or sale.",
      },
    ],
    processSteps: [
      {
        title: "Same-Day Assessment",
        description:
          "Submit your deal and receive an indicative decision within hours, not days.",
      },
      {
        title: "Rapid Valuation",
        description:
          "Desktop or drive-by valuations for speed. Full RICS valuations where required by the lender.",
      },
      {
        title: "Legal Fast-Track",
        description:
          "Dual-representation solicitors and streamlined legal processes to minimise completion timescales.",
      },
      {
        title: "Completion in Days",
        description:
          "Funds released as quickly as 5-7 working days from instruction for straightforward deals.",
      },
    ],
    faqs: [
      {
        question: "How quickly can I get a bridging loan?",
        answer:
          "The fastest completions are 5-7 working days from application. Typical timelines are 2-3 weeks. Speed depends on the type of deal, the valuation method used, and how quickly legal processes can be completed. Auction purchases with tight deadlines are routinely fast-tracked.",
      },
      {
        question: "What is the exit strategy for a bridging loan?",
        answer:
          "Every bridging loan requires a clear exit strategy explaining how you will repay the facility. Common exit strategies include sale of the property, refinancing onto a longer-term mortgage, or refinancing into a development finance facility. The lender assesses the viability of your exit before approving the bridge.",
      },
      {
        question: "Are bridging loans regulated?",
        answer:
          "Bridging loans secured against property you will live in are regulated by the Financial Conduct Authority (FCA). Investment and commercial bridging is unregulated. Construction Capital specialises in unregulated commercial and investment bridging finance for property developers and investors.",
      },
      {
        question: "Can I get a bridging loan on a property with no income?",
        answer:
          "Yes. Unlike a mortgage, bridging lenders focus primarily on the property value and your exit strategy rather than rental income or personal earnings. Vacant, derelict, and non-standard properties are all considered.",
      },
      {
        question: "What fees are involved in bridging finance?",
        answer:
          "Typical fees include an arrangement fee (1-2% of the loan), valuation fee, and legal costs. Some lenders charge exit fees, but we favour those who do not. We provide a full cost breakdown upfront so there are no hidden charges.",
      },
      {
        question: "What is the difference between bridging and development finance?",
        answer:
          "Bridging finance is a short-term loan for acquiring property quickly, while development finance funds the entire construction process with staged drawdowns. A developer might use a bridge to acquire a site quickly, then refinance into a development facility once planning is secured and the build programme begins.",
      },
      {
        question: "Can I use a bridging loan to buy at auction?",
        answer:
          "Yes, this is one of the most common uses of bridging finance. Auction purchases require completion within 28 days, which is too fast for conventional mortgage lending. We have lender relationships that specialise in auction finance and can provide pre-approval before you bid.",
      },
      {
        question: "How much can I borrow with bridging finance?",
        answer:
          "Most bridging lenders offer up to 75% LTV on residential property and 65-70% on commercial properties. Loan amounts typically start from £50,000 and can exceed £25 million for larger transactions. The maximum you can borrow depends on the value of the security property and the strength of your exit strategy.",
      },
      {
        question: "Can I get a bridging loan with adverse credit?",
        answer:
          "Some specialist bridging lenders consider applicants with adverse credit history, including CCJs, defaults, and missed payments. The rate and LTV available will depend on the severity and recency of the adverse credit. We have lender relationships that specialise in this area.",
      },
      {
        question: "Do I need planning permission for a bridging loan?",
        answer:
          "No. Planning permission is not required for a standard bridging loan, as the facility is secured against the existing value of the property. In fact, many developers use bridge finance specifically to acquire sites before planning permission is in place, with the exit strategy being to refinance into development finance once planning is granted.",
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
      "Joint Venture Finance for Property Development | Equity Partnerships",
    metaDescription:
      "Joint venture development finance and equity partnerships for UK property developers. Profit-share structures from 40%. Fund up to 100% of project costs with family offices and institutional investors.",
    h1: "Joint Venture Finance for Property Development",
    heroSubtitle:
      "Access development capital through joint venture partnerships and equity funding structures. Fund up to 100% of your project costs with the right investor partner.",
    sections: [
      {
        title: "What Is Joint Venture Development Finance?",
        paragraphs: [
          "Joint venture (JV) development finance provides the developer's equity contribution on a property development project. An equity partner or joint venture investor puts up the capital that is not covered by senior debt or mezzanine finance, in exchange for a share of the development profit rather than a fixed interest rate.",
          "This type of finance is the most expensive form of capital in the development stack because you are giving away a share of your profit, typically 40-60%. However, it allows you to pursue property development projects with minimal or zero cash equity of your own. For first-time developers, capital-light operators, or experienced developers wanting to scale rapidly, joint venture partnerships unlock deals that would otherwise be out of reach.",
          "Construction Capital connects property developers with a network of pre-qualified equity sources, including family offices, institutional investors, private equity funds, and high-net-worth individuals. We manage the entire process from initial introduction through to legal completion, ensuring both parties' interests are properly protected through robust joint venture agreements.",
        ],
      },
      {
        title: "How Does Joint Venture Development Finance Work?",
        paragraphs: [
          "In a typical joint venture structure, the equity partner provides the developer's required contribution (usually 10-35% of total project costs), while <a href=\"/services/development-finance\">senior development finance</a> covers the remainder. The development is usually held within a Special Purpose Vehicle (SPV), a limited company set up specifically for the project, with shares held by both the developer and the equity partner.",
          "The joint venture agreement governs the relationship, setting out each party's contributions, responsibilities, decision-making rights, reporting requirements, and the profit-share arrangement. Most JV structures include a preferred return for the equity partner (a minimum return before the profit split applies) and a promote structure that rewards the developer with a larger share once certain return thresholds are exceeded.",
          "On completion and sale of the development, the proceeds flow in a defined order: first, senior debt is repaid. Then the equity partner's capital is returned along with their preferred return. Finally, remaining profits are split according to the agreed profit share. This waterfall structure protects the equity partner's capital while giving the developer the potential for a strong return on what is essentially their time, expertise, and effort rather than their cash.",
        ],
      },
      {
        title: "Types of Joint Venture Partners",
        paragraphs: [
          "Family offices are often the most flexible joint venture partners, offering faster decision-making and more pragmatic terms than institutional investors. They suit mid-market developments with GDVs of £2-20 million and can often commit to a decision within 2-4 weeks of receiving a detailed investment memorandum.",
          "Institutional investors and private equity funds provide larger equity commitments for schemes typically above £5 million GDV. They conduct more thorough due diligence and have more formal governance requirements, but can commit substantial capital across multiple projects for developers who prove their capability on an initial deal.",
          "High-net-worth (HNW) individuals may co-invest on smaller schemes, often bringing their own property experience and contacts. <a href=\"/guides/spv-structure-property-development\">SPV structures</a> are commonly used to ring-fence each joint venture project, providing both parties with limited liability protection and clear financial reporting.",
        ],
      },
      {
        title: "Joint Venture Eligibility and Criteria",
        paragraphs: [
          "Equity partners assess joint venture applications based on several key factors. Your track record as a property developer is paramount. Experienced developers with a proven history of delivering profitable schemes will attract better terms and more competitive profit shares. First-time developers can still secure JV partnerships, but may need to accept a larger profit share for the equity partner or bring in an experienced project manager to de-risk the deal.",
          "The strength of the development project itself matters enormously. Partners will evaluate the planning permission status, site location, GDV appraisal, build cost estimates, comparable sales evidence, and the achievability of your projected timeline. Having these materials professionally prepared in an investment memorandum significantly speeds up the process.",
          "Equity partners will also conduct due diligence on your professional team, including architect, quantity surveyor, contractor, and solicitor. A personal guarantee may be required depending on the partner and the structure, although many joint ventures are structured without personal guarantees where the project fundamentals are strong.",
        ],
      },
      {
        title: "Joint Venture vs Mezzanine Finance",
        paragraphs: [
          "A common question from property developers is whether to use <a href=\"/services/mezzanine-finance\">mezzanine finance</a> or a joint venture equity partner. The answer depends on your circumstances. Mezzanine finance is almost always cheaper in pure financial terms because you pay a fixed interest rate rather than sharing profit. On a scheme generating £500,000 profit, a 50% JV split costs you £250,000, while mezzanine interest might total £50,000 to £80,000.",
          "However, joint venture partners offer benefits beyond capital. An experienced equity partner can provide strategic guidance, introductions to contractors and agents, and credibility with senior lenders. For first-time developers especially, having a reputable JV partner can be the difference between securing senior debt and being declined.",
          "We often recommend a blended approach: using mezzanine finance where the developer has sufficient experience to access it, and joint venture partnerships where the additional support and credibility of an equity partner adds value beyond the capital itself. Submit your details in our <a href=\"/deal-room\">Deal Room</a> and we will advise on the optimal structure for your situation.",
        ],
      },
      {
        title: "How to Apply for Joint Venture Finance",
        paragraphs: [
          "To find the right equity partner, you need a well-prepared investment memorandum that clearly presents the opportunity. This should include a detailed development appraisal with GDV projections, build cost estimates from a qualified QS, planning status and any conditions, a realistic programme, comparable evidence from the local market, and your CV or track record summary.",
          "We introduce your deal to pre-qualified equity sources suited to your project profile, managing the introductions, initial discussions, and term negotiations on your behalf. The typical timeline from initial introduction to legal completion of the JV agreement is 4-12 weeks, depending on the size and type of the development and the due diligence requirements of the chosen partner.",
        ],
      },
    ],
    useCases: [
      {
        title: "First-Time Property Developers",
        description:
          "Access equity from experienced partners who also bring industry knowledge, contacts, and credibility with senior lenders.",
      },
      {
        title: "Capital-Light Growth Strategy",
        description:
          "Run multiple property development projects simultaneously by using equity partners rather than tying up your own cash in each scheme.",
      },
      {
        title: "Large-Scale Developments",
        description:
          "Schemes with £10M+ GDV where the equity requirement alone exceeds most developers' available capital reserves.",
      },
      {
        title: "Strategic Land Partnerships",
        description:
          "Long-hold land with planning upside where senior debt is not appropriate but patient equity capital from a JV partner is well suited.",
      },
      {
        title: "100% Funded Development Structures",
        description:
          "Combining senior debt with JV equity to achieve close to 100% of total project costs, allowing the developer to contribute effort and expertise rather than cash.",
      },
      {
        title: "Portfolio Developer Partnerships",
        description:
          "Ongoing relationships with equity partners who commit to funding multiple projects over time, creating a reliable pipeline of development capital.",
      },
    ],
    processSteps: [
      {
        title: "Project Assessment",
        description:
          "We evaluate your scheme, track record, and development appraisal to determine the equity requirement and ideal partner profile.",
      },
      {
        title: "Partner Matching",
        description:
          "We introduce your deal to pre-qualified equity sources suited to your project type, size, and location.",
      },
      {
        title: "Term Negotiation",
        description:
          "Profit-share structures, governance arrangements, decision-making rights, reporting requirements, and exit provisions.",
      },
      {
        title: "Legal & Close",
        description:
          "Joint venture agreements, SPV formation, shareholder arrangements, and coordination with the senior debt provider.",
      },
    ],
    faqs: [
      {
        question: "How much profit do equity partners typically take?",
        answer:
          "Profit shares typically range from 40-60% depending on the risk profile, developer experience, and how much equity the partner is contributing. Many structures include a preferred return (hurdle rate) for the equity partner before the profit split applies, along with a promote that rewards the developer with a larger share once returns exceed agreed thresholds.",
      },
      {
        question: "Can I get 100% funding with a joint venture partner?",
        answer:
          "In theory, yes, if the equity partner funds the entire developer contribution and senior debt covers the rest. In practice, most senior lenders still want to see the developer with some skin in the game, even if that is as little as 5-10% of costs. Some JV structures achieve this by the developer providing a personal guarantee rather than cash equity.",
      },
      {
        question: "What does an equity partner expect from me as a developer?",
        answer:
          "Joint venture partners evaluate your track record, professional team (architect, QS, contractors), the strength of the project appraisal, and your personal commitment to the scheme. They will conduct thorough due diligence and typically want regular reporting, defined decision-making rights, and some oversight during the development.",
      },
      {
        question: "How long does it take to find a joint venture partner?",
        answer:
          "Timelines vary from 4-12 weeks depending on deal size, location, and the due diligence requirements of the equity partner. Having a professionally prepared investment memorandum with detailed appraisals, planning status, and professional team details significantly speeds up the process.",
      },
      {
        question: "What is a Special Purpose Vehicle (SPV)?",
        answer:
          "An SPV is a limited company set up specifically to hold a single development project. It ring-fences the joint venture assets and liabilities from both the developer's and investor's other activities, providing limited liability protection and clear financial reporting. Most joint venture structures use an SPV, and senior lenders generally require them.",
      },
      {
        question: "Do I have to provide a personal guarantee for a joint venture?",
        answer:
          "It depends on the equity partner and the deal structure. Many joint ventures are structured without personal guarantees where the project fundamentals are strong and the senior lender does not require one. However, some partners may request a personal guarantee as additional comfort, particularly for first-time developers.",
      },
      {
        question: "What are the 4 types of joint ventures in property development?",
        answer:
          "The main joint venture structures are: equity partnerships (investor provides cash equity for a profit share), strategic partnerships (land owner and developer collaborate), corporate JVs (two development companies pool resources on a specific project), and forward-funding arrangements (an investor funds construction in exchange for a completed asset). The right structure depends on what each party brings to the table.",
      },
      {
        question: "Can I secure joint venture finance without profit sharing?",
        answer:
          "Traditional joint venture structures always involve profit sharing, as that is how the equity partner earns their return. If you want to avoid profit sharing, consider mezzanine finance instead, which charges a fixed interest rate rather than taking a share of your development profit. The trade-off is that mezzanine requires the developer to have more experience and the scheme to support the additional debt layer.",
      },
      {
        question: "How are joint venture development finance applications assessed?",
        answer:
          "Equity partners assess the viability of the development (GDV, build costs, profit margin), the developer's track record, the professional team, planning status, and comparable evidence. They also review the proposed JV structure, governance arrangements, and the senior debt terms to ensure the overall capital stack is sustainable.",
      },
      {
        question: "Is a joint venture right for my development?",
        answer:
          "A joint venture is typically right if you have a viable project but insufficient equity, if you are a first-time developer who would benefit from an experienced partner, or if you want to scale rapidly without tying up your capital. If you have sufficient equity and experience, mezzanine finance will usually preserve more of your profit. We can advise on the best approach for your specific circumstances.",
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
      "Property Refurbishment Finance | Light & Heavy Refurb Loans from 0.65% p.m.",
    metaDescription:
      "Property refurbishment finance for investors and developers. Covers acquisition plus works costs. Up to 75% LTV, 6-18 month terms. HMO conversions, commercial-to-resi, and permitted development specialists across the UK.",
    h1: "Property Refurbishment Finance",
    heroSubtitle:
      "Fund property renovations, conversions, and HMO projects with specialist refurbishment loans. Covers acquisition and refurbishment works with rates from 0.65% per month.",
    sections: [
      {
        title: "What Is Property Refurbishment Finance?",
        paragraphs: [
          "Property refurbishment finance is a specialist loan designed to fund the purchase and renovation of investment property. Unlike a standard mortgage or bridging loan, a refurbishment facility is specifically structured to cover both the acquisition cost and the refurbishment works, with drawdowns released as renovation milestones are completed.",
          "This type of finance suits property investors and developers who buy below market value, add value through refurbishment, and either sell at a profit or refinance onto a long-term buy-to-let mortgage at the improved valuation. It is the core funding product for the BRRR strategy (Buy, Refurbish, Refinance, Rent), one of the most popular property investment approaches in the UK.",
          "As specialist <a href=\"/guides/broker-fees-development-finance\">refurbishment finance brokers</a>, we source from a wide panel of lenders including bridging specialists, challenger banks, and development finance providers. Whether your project involves light cosmetic improvements or a heavy structural conversion, we find the right lender and product for your scope of works.",
        ],
      },
      {
        title: "Light vs Heavy Refurbishment Finance",
        paragraphs: [
          "Lenders distinguish between light refurbishment and heavy refurbishment based on the scope of works involved. Understanding which category your project falls into is important because it determines which lenders can fund you, the costs, and the process.",
          "Light refurbishment covers cosmetic improvements such as new kitchens, bathrooms, decoration, flooring, and garden landscaping, without any structural changes or requirement for planning permission. Light refurb facilities are faster to arrange, typically cheaper, and often complete within 2-3 weeks. Most bridging lenders offer light refurbishment finance with a straightforward schedule of works.",
          "Heavy refurbishment involves structural alterations, extensions, loft conversions, basement excavations, change of use, or conversion work that requires planning permission or Building Regulations approval. Heavy refurb finance works more like a small <a href=\"/services/development-finance\">development finance</a> facility, with professional costings from a quantity surveyor, a monitoring surveyor appointed to verify completed works, and staged drawdowns released against milestones. For larger heavy refurbishment projects, a full development finance loan may be more appropriate.",
        ],
      },
      {
        title: "How Does Refurbishment Finance Work?",
        paragraphs: [
          "A refurbishment loan is structured in two parts. The acquisition element funds the purchase of the property, typically at 70-75% of the current market value or purchase price (whichever is lower). The refurbishment element funds the cost of works, usually released in arrears against completed stages verified by the lender or their surveyor.",
          "For light refurbishment, the works funding may be released in a single drawdown or two stages. For heavy refurbishment, drawdowns are typically aligned to specific milestones in the schedule of works, with the lender's monitoring surveyor inspecting the property before each release. Many lenders will fund 100% of the refurbishment costs on top of the acquisition facility, provided the combined loan stays within their LTV parameters based on the projected end value of the property.",
          "The loan term is typically 6 to 18 months, giving you time to complete the refurbishment works and arrange your exit, whether that is selling the property or refinancing onto a longer-term mortgage product. Interest can be serviced monthly or rolled up into the loan balance for repayment at exit.",
        ],
      },
      {
        title: "Refurbishment Loan Rates and Costs",
        paragraphs: [
          "Refurbishment finance rates depend on the scope of works, the LTV, and whether the project is classified as light or heavy refurbishment. Light refurb loan rates typically start from 0.65% per month with arrangement fees of 1-2%. Heavy refurbishment rates start from around 0.75% per month, reflecting the additional risk and complexity.",
          "Additional costs include a valuation fee (both current and projected end value), legal fees for the lender's solicitor, and for heavy refurb projects, monitoring surveyor fees for each site inspection. Arrangement fees are usually paid from the loan advance, so you do not need to fund them separately upfront.",
          "We always provide a full cost breakdown before you commit, and you can model different scenarios using our <a href=\"/calculators/development-finance\">finance calculator</a>. Understanding the total cost of your refurbishment finance, including all fees, is essential for calculating whether your project stacks up commercially.",
        ],
      },
      {
        title: "Refurbishment Finance Eligibility",
        paragraphs: [
          "Eligibility for property refurbishment finance depends on the property type, scope of works, your experience, and the projected end value. Most lenders require a clear schedule of works with realistic cost estimates, evidence of comparable property values to support the projected end value, and a defined exit strategy.",
          "Both individuals and limited companies can apply for refurbishment finance. Many property investors and developers use limited company (SPV) structures for tax efficiency, and the majority of lenders on our panel are comfortable lending to limited companies. First-time investors and developers are considered, although some lenders may require additional comfort such as a qualified project manager for heavy refurbishment works.",
          "The property types funded include residential houses and flats, HMOs (houses in multiple occupation), commercial properties, mixed-use buildings, and semi-commercial properties. Properties that are currently uninhabitable or unmortgageable are routinely funded, as the purpose of the refurbishment is to bring them to a lettable or saleable standard.",
        ],
      },
      {
        title: "How to Apply for Refurbishment Finance",
        paragraphs: [
          "To apply for property refurbishment finance, submit your project details in our <a href=\"/deal-room\">Deal Room</a>. Include the property address, purchase price (or current value if refinancing), a schedule of works with cost estimates, and the projected end value once refurbishment is complete.",
          "We match your refurbishment project to lenders experienced with your specific property type and scope of works. Whether you are converting a commercial unit to residential under permitted development rights, transforming a standard house into an HMO, or carrying out a cosmetic refurbishment before refinancing to a buy-to-let, we find the right lender and negotiate competitive terms on your behalf.",
        ],
      },
    ],
    useCases: [
      {
        title: "HMO Conversions",
        description:
          "Convert standard residential houses into houses of multiple occupation for higher rental yields. Covers acquisition and conversion works including fire safety, en-suite bathrooms, and licensing requirements.",
      },
      {
        title: "Commercial-to-Residential Conversions",
        description:
          "Convert offices, shops, or industrial units to residential dwellings under permitted development rights or full planning permission.",
      },
      {
        title: "Cosmetic Refurbishment (BRRR)",
        description:
          "Light refurb to increase property value and rental appeal before refinancing onto a buy-to-let mortgage and holding for long-term income.",
      },
      {
        title: "Heavy Structural Renovation",
        description:
          "Major structural works including extensions, loft conversions, basement excavations, and removal of load-bearing walls.",
      },
      {
        title: "Auction Property Purchases",
        description:
          "Fund the purchase of below-market-value properties bought at auction that require refurbishment before they can be mortgaged conventionally.",
      },
      {
        title: "Flat-Above-Shop Conversions",
        description:
          "Convert unused upper floors of commercial buildings into residential flats, a semi-commercial refurbishment project funded by specialist lenders.",
      },
    ],
    processSteps: [
      {
        title: "Deal Submission",
        description:
          "Property details, purchase price, scope of works, cost estimates, and projected end value.",
      },
      {
        title: "Lender Selection",
        description:
          "We match your refurbishment scope and property type to the most suitable lenders from our panel.",
      },
      {
        title: "Valuation & Schedule Review",
        description:
          "Lender instructs a valuation (current and projected) and reviews your schedule of works and cost estimates.",
      },
      {
        title: "Drawdowns Against Works",
        description:
          "Acquisition funds released at completion. Refurbishment funds drawn in stages against completed works.",
      },
    ],
    faqs: [
      {
        question: "What is the difference between light and heavy refurbishment finance?",
        answer:
          "Light refurbishment covers cosmetic works (kitchens, bathrooms, decoration, flooring) without structural changes, typically costing under £50,000. Heavy refurbishment involves structural work, extensions, change of use, or conversion, usually requiring planning permission or Building Regulations approval and professional costings from a quantity surveyor.",
      },
      {
        question: "Can refurbishment finance cover 100% of the works costs?",
        answer:
          "Many lenders will fund 100% of the refurbishment costs on top of the acquisition facility, provided the combined loan stays within their LTV parameters. This is typically 70-75% of the projected end value (GDV) of the refurbished property.",
      },
      {
        question: "How does BRRR financing work?",
        answer:
          "Buy, Refurbish, Refinance, Rent: you purchase with a refurbishment bridging loan, complete the works, refinance onto a buy-to-let mortgage at the improved valuation (releasing your initial capital), and hold the property for rental income. We arrange both the initial refurb facility and the refinance as a coordinated package.",
      },
      {
        question: "Do I need planning permission for refurbishment finance?",
        answer:
          "Light refurbishment typically does not require planning permission. Heavy refurb or change of use may need planning permission or prior approval under permitted development rights. Lenders will want to see the appropriate consents in place before releasing funds for works that require them.",
      },
      {
        question: "Can I get a refurbishment loan for a commercial property?",
        answer:
          "Yes. Our lender panel includes specialists in commercial property refurbishment, including offices, retail units, industrial spaces, and mixed-use buildings. The criteria and rates may differ from residential refurbishment, but funding is available for most commercial property types.",
      },
      {
        question: "Do bridging loans cover refurbishment costs?",
        answer:
          "Standard bridging loans typically fund acquisition only. However, refurbishment bridging loans are specifically designed to cover both the purchase price and the cost of works. The refurbishment element is usually released in stages against completed milestones rather than as an upfront lump sum.",
      },
      {
        question: "Can limited companies apply for refurbishment finance?",
        answer:
          "Yes. The majority of lenders on our panel lend to limited companies, including SPVs set up specifically for individual property investments. Many investors prefer limited company structures for tax efficiency, and this does not restrict your access to refurbishment finance products.",
      },
      {
        question: "How can I get a loan for heavy refurbishment?",
        answer:
          "Heavy refurbishment finance requires a detailed schedule of works, professional cost estimates (ideally from a quantity surveyor), planning permission or Building Regulations approval where required, and a RICS valuation of both the current and projected end value. Submit your project in our Deal Room and we will match you with lenders experienced in heavy structural refurbishment projects.",
      },
      {
        question: "Can I use refurbishment finance to buy at auction?",
        answer:
          "Yes. Many property investors use refurbishment bridging loans to purchase below-market-value properties at auction that require renovation. The bridge completes within the 28-day auction deadline, and refurbishment drawdowns follow once the works begin. We can arrange pre-approval so you have certainty of funding before you bid.",
      },
      {
        question: "Is refurbishment finance suitable for larger projects?",
        answer:
          "For larger refurbishment projects involving major structural works, multiple units, or substantial build costs, a full development finance facility may be more appropriate than a refurbishment bridge. The line between heavy refurbishment and development finance is not always clear-cut, and we will advise on the best product for your specific scope of works.",
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
      "Commercial Property Development Finance & Mortgages | From 5.5%",
    metaDescription:
      "Commercial property finance for investors and developers. Commercial mortgages up to 75% LTV, 3-25 year terms. Development finance for commercial new builds. Whole-of-market broker access across the UK.",
    h1: "Commercial Property Finance",
    heroSubtitle:
      "Long-term commercial mortgages and development finance for commercial property across the UK. Rates from 5.5% p.a., terms up to 25 years, LTVs up to 75%.",
    sections: [
      {
        title: "What Is Commercial Property Finance?",
        paragraphs: [
          "Commercial property finance encompasses the range of loan products available for purchasing, refinancing, developing, or releasing equity from commercial and semi-commercial property. Unlike residential mortgages, commercial property lending is assessed on a combination of the property's income, tenant quality, lease terms, and the borrower's financial position.",
          "The two primary products are commercial mortgages (long-term finance for stabilised, income-producing properties) and commercial property development finance (short-term facilities for building or converting commercial property). As whole-of-market brokers, we source both products from our panel of 100+ lenders, finding the most competitive terms for your specific property type and circumstances.",
          "Commercial property finance is suitable for a wide range of property types including offices, retail units, industrial warehouses, logistics facilities, mixed-use buildings, and semi-commercial properties such as a shop with a residential flat above. We also arrange <a href=\"/services/development-finance\">development finance</a> for ground-up commercial new builds and commercial-to-residential conversion projects.",
        ],
      },
      {
        title: "How Does a Commercial Mortgage Work?",
        paragraphs: [
          "A commercial mortgage provides long-term finance for purchasing or refinancing commercial property. Terms typically range from 3 to 25 years, with loan-to-value ratios of up to 75% depending on the property type, tenant strength, and lease terms. Interest rates start from around 5.5% per annum for the strongest applications.",
          "Commercial mortgages fall into two categories. Owner-occupied facilities are for businesses purchasing their own premises to trade from. Investment commercial mortgages fund the purchase of property let to third-party tenants. Lender appetite and terms differ between the two. Investment properties with strong covenant tenants on long leases typically achieve better rates and higher leverage than owner-occupied lending.",
          "Repayment structures include capital-and-interest (reducing the loan over the term), interest-only (with the capital repaid at term end from sale or refinance), or a combination of both. The right structure depends on your cash flow requirements and long-term strategy for the property.",
        ],
      },
      {
        title: "Commercial Property Development Finance",
        paragraphs: [
          "For developers building new commercial property, commercial development finance provides staged funding similar to residential development loans. The loan covers land acquisition and construction costs, drawn down in stages against completed milestones verified by a monitoring surveyor.",
          "Commercial development finance is available for a range of project types including industrial units, warehouses, office buildings, retail developments, student accommodation, and care homes. Lending criteria focus on the GDV of the completed scheme, the strength of pre-lets or pre-sales, and the developer's track record in delivering commercial projects.",
          "The exit strategy for commercial development finance is typically either sale of the completed units or refinancing onto a long-term commercial mortgage once the building is let and income-producing. Having pre-let agreements in place significantly strengthens your development finance application and can unlock better rates and higher leverage.",
        ],
      },
      {
        title: "Types of Commercial Property We Finance",
        paragraphs: [
          "Our lender panel provides finance for virtually every type of commercial property in the UK. Office acquisitions, whether single buildings or multi-let office parks, are funded by both mainstream banks and specialist commercial lenders. Retail and high-street properties, including shops, restaurants, and retail parks, are widely financed despite changing high-street dynamics.",
          "Industrial and logistics property is currently one of the strongest sectors for commercial finance, with lenders competing aggressively to fund warehouses, distribution centres, and light industrial units due to the sector's strong rental growth and low vacancy rates. Mixed-use properties combining commercial and residential elements can be funded as either commercial or semi-commercial mortgages, depending on the balance between the two uses.",
          "More specialist commercial property types such as care homes, hotels, and purpose-built student accommodation (PBSA) require lenders with specific sector expertise. We have relationships with specialist lenders in each of these sectors and can source competitive terms for non-standard commercial assets.",
        ],
      },
      {
        title: "Commercial Mortgage Costs and Eligibility",
        paragraphs: [
          "Commercial mortgage rates currently start from around 5.5% per annum for the strongest applications, with rates depending on the LTV, property type, tenant quality, lease length, and whether you choose a fixed or variable rate. Arrangement fees typically range from 0.5-1.5% of the loan amount, and you should also budget for a RICS commercial valuation (£2,000-£15,000 depending on property size and type) and legal fees.",
          "Eligibility depends on the property's income coverage, your financial position, and the property type. Lenders typically require the rental income to cover at least 125-150% of the mortgage payment (the interest coverage ratio). For owner-occupied mortgages, the trading strength of your business is assessed alongside the property's value.",
          "Both individuals and limited companies can apply for commercial mortgages. SPV structures are common for portfolio investors holding multiple commercial properties. We search our whole-of-market panel to find the best commercial mortgage rate for your specific deal, whether you are purchasing, refinancing, or releasing equity.",
        ],
      },
      {
        title: "How to Apply for Commercial Property Finance",
        paragraphs: [
          "To apply for a commercial mortgage or commercial development finance, submit your requirements in our <a href=\"/deal-room\">Deal Room</a>. We will review your enquiry within 24 hours and search across our lender panel for the most competitive terms available for your property type and circumstances.",
          "The typical timeline for a commercial mortgage is 6-10 weeks from application to completion, including valuation, credit approval, and legal processes. Straightforward deals with clean tenancy schedules and financials can sometimes complete faster. For development finance on commercial projects, timescales are similar to residential development, typically 4-8 weeks from application to first drawdown.",
          "We provide whole-of-market broker advice, searching across mainstream banks, challenger banks, building societies, and specialist commercial lenders. Whether you need a <a href=\"/calculators/development-finance\">development loan for a new-build commercial project</a> or a long-term mortgage for an existing investment property, we find the right funding options and negotiate on your behalf.",
        ],
      },
    ],
    useCases: [
      {
        title: "Office Acquisitions",
        description:
          "Purchase office space for your business or as a tenanted investment property, from single suites to multi-let office buildings.",
      },
      {
        title: "Retail & High Street",
        description:
          "Shops, restaurants, retail parks, and high-street units, both single assets and portfolios.",
      },
      {
        title: "Industrial & Warehousing",
        description:
          "Warehouses, distribution centres, light industrial units, and logistics facilities with strong rental demand.",
      },
      {
        title: "Refinancing & Equity Release",
        description:
          "Remortgage existing commercial holdings to release capital for new acquisitions or secure more competitive terms.",
      },
      {
        title: "Mixed-Use Property",
        description:
          "Buildings combining commercial and residential elements, funded as commercial or semi-commercial mortgages depending on the balance.",
      },
      {
        title: "Commercial Development Projects",
        description:
          "Ground-up construction of new commercial buildings including industrial units, offices, and purpose-built accommodation.",
      },
    ],
    processSteps: [
      {
        title: "Requirements Review",
        description:
          "Property type, value, rental income, your financial position, and intended use (investment or owner-occupied).",
      },
      {
        title: "Market Search",
        description:
          "We search our whole-of-market lender panel for the most competitive terms matching your property profile.",
      },
      {
        title: "Application",
        description:
          "Full application with financials, tenancy schedules, and property details submitted to the chosen lender.",
      },
      {
        title: "Completion",
        description:
          "RICS valuation, legal process, and drawdown, typically completing within 6-10 weeks.",
      },
    ],
    faqs: [
      {
        question: "What deposit do I need for a commercial mortgage?",
        answer:
          "Most commercial lenders require a minimum 25% deposit (75% LTV). Some specialist lenders offer up to 80% LTV for properties with strong covenant tenants or established owner-occupier businesses. The deposit required depends on the property type, tenant quality, and your overall financial position.",
      },
      {
        question: "Can I get a commercial mortgage for a mixed-use property?",
        answer:
          "Yes. Mixed-use properties combining commercial and residential elements are widely funded. Some lenders treat these as commercial, others as semi-commercial with slightly different terms. We find the best approach and lender for your specific property.",
      },
      {
        question: "What are typical commercial mortgage rates?",
        answer:
          "Commercial mortgage rates currently start from around 5.5% per annum for strong applications. The rate depends on property type, LTV, tenant quality, lease length, and whether you choose fixed or variable. We search across the whole market to find the most competitive rate for your deal.",
      },
      {
        question: "How long does a commercial mortgage take to arrange?",
        answer:
          "Typical timescales are 6-10 weeks from application to completion, including RICS valuation, credit approval, and legal processes. Straightforward deals with clean tenancy schedules and strong financials can sometimes complete faster.",
      },
      {
        question: "Can I get a business loan for property development?",
        answer:
          "Standard business loans are not designed for property development. Instead, you need specialist development finance that is secured against the property and structured with staged drawdowns. We arrange both commercial mortgages for stabilised assets and development finance for construction projects.",
      },
      {
        question: "What is the difference between a commercial mortgage and development finance?",
        answer:
          "A commercial mortgage is long-term finance (3-25 years) for purchasing or refinancing a completed, income-producing commercial property. Development finance is short-term (12-24 months) for building new commercial property, with staged drawdowns against construction milestones. The development loan is repaid by selling the asset or refinancing onto a commercial mortgage.",
      },
      {
        question: "Can I get commercial property development finance as a first-time developer?",
        answer:
          "Yes, although lender options are more limited for first-time developers. Having relevant sector experience (even if you have not developed before), a strong professional team, and pre-let agreements on the completed space will all strengthen your application significantly.",
      },
      {
        question: "How are commercial mortgage applications assessed?",
        answer:
          "Lenders assess a combination of the property's rental income and tenant strength, the loan-to-value ratio, your personal and business financial position, and the overall quality and location of the property. The rental income typically needs to cover at least 125-150% of the mortgage payment.",
      },
      {
        question: "Can I refinance an existing commercial property?",
        answer:
          "Yes, refinancing is one of the most common reasons for arranging a commercial mortgage. You might refinance to release equity, secure a better interest rate, switch from variable to fixed, or consolidate multiple commercial properties under a single lender. We search the market to find the best refinancing terms available.",
      },
      {
        question: "What types of commercial property development finance are available?",
        answer:
          "Commercial development finance covers ground-up construction of offices, industrial units, warehouses, retail, student accommodation, care homes, and mixed-use schemes. Funding is available for projects from £500,000 to over £50 million, with leverage typically up to 60-65% LTGDV for commercial developments.",
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
      "Replace your development loan once construction completes. Lower holding costs from 0.55% p.m., phased unit sales, up to 75% LTV. Free up capital for your next UK property development project.",
    h1: "Development Exit Finance",
    heroSubtitle:
      "Replace your development facility once construction completes. Lower your holding costs while you sell completed units, and free up capital for your next project.",
    sections: [
      {
        title: "What Is Development Exit Finance?",
        paragraphs: [
          "Development exit finance is a short-term facility that repays your <a href=\"/services/development-finance\">development loan</a> once construction is substantially complete. It replaces the more expensive development finance with a lower-cost holding facility, giving you time to sell completed units at the best market price rather than accepting discounted offers to meet your development lender's repayment deadline.",
          "Most development loans require full repayment within 3 to 6 months of practical completion. If your units have not all sold by that point, you face penalty rates, extension fees, or even enforcement action from the lender. Development exit finance removes this pressure by refinancing the existing facility onto a purpose-built product designed for the sales period.",
          "Exit finance rates are significantly lower than development finance rates because the construction risk has been removed. The lender is secured against completed, saleable property rather than a building site. Typical exit rates range from 0.55% to 0.85% per month, compared to 0.75% to 1.0%+ on the development facility.",
        ],
      },
      {
        title: "How Does Development Exit Finance Work?",
        paragraphs: [
          "Development exit finance works by refinancing your existing development loan at or near practical completion. The exit lender pays off the remaining balance on your development facility, taking a first charge over the completed property in its place. As each unit sells, the proceeds reduce the exit loan balance.",
          "Most exit facilities operate on a reducing basis. When a unit sells and the proceeds clear the portion of debt allocated to that unit, the lender releases the charge on that specific plot. This allows you to complete individual sales without needing the lender's consent for each transaction, provided sales prices are above agreed minimum levels.",
          "The exit facility term is typically 6 to 18 months, giving you an extended window to achieve the best possible prices on your remaining stock. If the market is soft or your sales agent advises holding for a better season, the exit facility gives you that flexibility without the pressure of an imminent development loan maturity.",
        ],
      },
      {
        title: "Capital Recycling for Pipeline Developers",
        paragraphs: [
          "One of the most significant benefits of development exit finance is capital recycling. As each unit on your current scheme sells, those proceeds are freed up rather than remaining trapped in the development facility. This means you can deploy profits from early sales into your next land acquisition or development project while remaining units continue to sell.",
          "For property developers building a pipeline of projects, this is transformative. Instead of waiting for every unit to sell before starting the next scheme, you can overlap projects and significantly increase your annual output. A developer completing two projects per year could potentially scale to three or four by using exit finance to recycle capital more efficiently.",
          "We recommend discussing your exit strategy at the start of your development, not at the end. By planning the transition from development finance to exit finance early, you ensure a smooth handover and avoid any gap between facilities. Our team can arrange <a href=\"/services/bridging-loans\">bridging solutions</a> for urgent situations where the development facility has already matured.",
        ],
      },
      {
        title: "Development Exit Finance Costs",
        paragraphs: [
          "Exit finance rates typically range from 0.55% to 0.85% per month, with arrangement fees of 1-2% of the gross facility. This represents a meaningful saving compared to the development loan rates of 0.75% to 1.0%+ per month that you would otherwise be paying during the sales period.",
          "On a development with £2 million of outstanding debt and a 9-month sales period, switching from development finance at 0.85% per month to exit finance at 0.60% per month saves approximately £45,000 in interest costs. When you factor in the potential penalty rates that development lenders charge on expired facilities, the savings can be substantially higher.",
          "Additional costs include a valuation fee (the exit lender will instruct a fresh valuation of the completed scheme), legal fees for the refinance, and potentially an early repayment charge on your existing development facility. We model all of these costs for you to ensure the exit refinance is financially beneficial, and provide a comparison using our <a href=\"/calculators/development-finance\">finance calculator</a>.",
        ],
      },
      {
        title: "When to Arrange Development Exit Finance",
        paragraphs: [
          "The ideal time to arrange development exit finance is 3 to 6 months before your development facility matures or practical completion, whichever comes first. This gives sufficient time to instruct a valuation, complete the legal process, and draw down the exit facility before your development loan expires.",
          "Many experienced developers arrange their exit finance concurrently with the development facility, agreeing indicative terms at the outset so the transition is seamless. Some development lenders offer built-in exit products that automatically convert the facility once construction completes, simplifying the process further.",
          "If your development loan has already expired and you are facing penalty rates or enforcement pressure, we can still help. Emergency exit refinancing can often be arranged within 2 to 4 weeks through our specialist lender relationships. The sooner you act, the more options are available and the better the terms you can achieve.",
        ],
      },
      {
        title: "How to Apply for Development Exit Finance",
        paragraphs: [
          "Submit your scheme details in our <a href=\"/deal-room\">Deal Room</a>, including the development address, number of units, current sales position, outstanding debt, and development loan maturity date. We will review your situation within 24 hours and present exit finance options from our lender panel.",
          "The information we need includes the practical completion certificate (or expected date), a schedule of unsold units with individual asking prices, details of any units currently under offer or reserved, the outstanding balance on your development facility, and any existing sales or rental agreements. With this information, we can approach exit lenders and secure competitive terms quickly.",
        ],
      },
    ],
    useCases: [
      {
        title: "Completed Residential Schemes",
        description:
          "Repay your maturing development facility while individual houses or apartments are marketed and sold at the best market price.",
      },
      {
        title: "Phased Unit Sales",
        description:
          "Sell completed units individually at full market value rather than bulk-discounting to a single buyer to meet your development lender's deadline.",
      },
      {
        title: "Pipeline Developers",
        description:
          "Free up capital and credit lines to start your next development project before all units on the current scheme have sold.",
      },
      {
        title: "Rental Retention",
        description:
          "Hold completed units temporarily for rental income while market conditions improve or while arranging long-term buy-to-let refinancing.",
      },
      {
        title: "Expired Development Facilities",
        description:
          "Refinance development loans that have already matured or are charging penalty rates, avoiding enforcement action and reducing holding costs.",
      },
      {
        title: "Part-Sold Schemes",
        description:
          "Reduce the outstanding debt to reflect units already sold, lowering your monthly interest burden on the remaining stock.",
      },
    ],
    processSteps: [
      {
        title: "Completion Assessment",
        description:
          "We assess your scheme at or near practical completion, review the sales position, and determine the outstanding debt to be refinanced.",
      },
      {
        title: "Exit Facility Sourcing",
        description:
          "We source competitive exit facilities from specialist lenders, often different from your original development funder.",
      },
      {
        title: "Refinance & Repay",
        description:
          "The exit facility repays your development lender in full. Unit sales proceeds then reduce the exit loan on a rolling basis.",
      },
      {
        title: "Final Redemption",
        description:
          "The exit facility is repaid in full from remaining unit sales, typically within 6-12 months of the initial refinance.",
      },
    ],
    faqs: [
      {
        question: "When should I arrange development exit finance?",
        answer:
          "Ideally 3-6 months before your development facility matures or practical completion, whichever comes first. This gives time to arrange the exit facility without pressure. We recommend discussing your exit strategy at the start of your development, not at the end.",
      },
      {
        question: "Is development exit finance cheaper than my development loan?",
        answer:
          "Almost always, yes. Development loans carry higher rates because of construction risk. Once the build is complete, that risk is removed, and exit lenders reflect this with lower rates, typically 0.55-0.85% per month compared to 0.75-1.0%+ on the development facility.",
      },
      {
        question: "Can I keep some units to rent instead of selling?",
        answer:
          "Yes, many exit facilities allow you to retain a portion of units for rental income. The exit lender will want a clear plan for those retained units, typically refinancing them onto a buy-to-let mortgage or commercial mortgage within an agreed timeframe.",
      },
      {
        question: "What if my development loan has already expired?",
        answer:
          "If your development lender is charging penalty rates or has issued a repayment demand, we can still arrange exit finance, often completing within 2-4 weeks through our specialist lender relationships. The sooner you act, the more options are available.",
      },
      {
        question: "How does the reducing facility work?",
        answer:
          "As each unit sells, the sales proceeds reduce the exit loan balance. The lender releases the charge on individual plots as they are sold, provided the sale price meets the agreed minimum. This means your monthly interest cost reduces with each sale.",
      },
      {
        question: "Can I use exit finance to fund my next project?",
        answer:
          "Development exit finance does not directly fund your next project, but it frees up capital by refinancing the existing development debt at lower rates. As units sell and the exit facility reduces, profits from those sales can be redeployed into your next land acquisition or development.",
      },
      {
        question: "What LTV is available on development exit finance?",
        answer:
          "Exit lenders typically offer up to 70-75% of the current market value of the completed, unsold units. Since the properties are now finished and saleable, valuations are more straightforward than development finance assessments, and LTV ratios are based on real market evidence.",
      },
      {
        question: "Do I need a different lender for exit finance?",
        answer:
          "Not necessarily. Some development lenders offer built-in exit products that automatically convert the facility at completion. However, we often find that sourcing from a different specialist exit lender produces better rates and more flexible terms than staying with the original development funder.",
      },
      {
        question: "How long does development exit finance take to arrange?",
        answer:
          "Typical timescales are 3-6 weeks from application to completion. Since the property is already built, valuations are faster (no need for development appraisals), and the legal process is a straightforward refinance. Urgent cases can be expedited to 2-3 weeks where necessary.",
      },
      {
        question: "Can development exit finance be used for commercial schemes?",
        answer:
          "Yes. Exit finance is available for both residential and commercial development schemes. For commercial developments, exit lenders may want to see pre-let agreements or strong letting agent marketing in place, as the exit strategy relies on either sale or refinancing onto a long-term commercial mortgage.",
      },
    ],
    relatedSlugs: [
      "development-finance",
      "commercial-mortgages",
      "bridging-loans",
    ],
  },
};
