export type CalculatorCategory =
  | "development"
  | "conversions"
  | "investment"
  | "bridging"
  | "mezzanine"
  | "costs"
  | "valuation";

export interface CalculatorMeta {
  slug: string;
  name: string;
  shortDesc: string;
  icon: string;
  category: CalculatorCategory;
  categoryLabel: string;
  order: number;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  faqs: { question: string; answer: string }[];
  relatedCalculators: string[];
  dealRoomLoanType: string;
  usesLocationData: boolean;
}

export const CALCULATOR_CATEGORIES: {
  slug: CalculatorCategory;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    slug: "development",
    label: "Development & Construction",
    description:
      "Model costs, profit and timelines for ground-up developments",
    icon: "Building2",
  },
  {
    slug: "conversions",
    label: "Conversions & PD",
    description:
      "Estimate costs for office, commercial, barn and HMO conversions",
    icon: "ArrowLeftRight",
  },
  {
    slug: "investment",
    label: "Investment & Returns",
    description:
      "Calculate yields, ROI and mortgage costs for investment properties",
    icon: "TrendingUp",
  },
  {
    slug: "bridging",
    label: "Bridging & Short-Term",
    description:
      "Work out the cost of bridging, auction and refurbishment finance",
    icon: "Clock",
  },
  {
    slug: "mezzanine",
    label: "Mezzanine & Equity",
    description:
      "Model mezzanine layers, equity requirements and JV structures",
    icon: "Layers",
  },
  {
    slug: "costs",
    label: "Costs & Fees",
    description: "Estimate stamp duty, legal fees, VAT and professional costs",
    icon: "Receipt",
  },
  {
    slug: "valuation",
    label: "Valuation & Market",
    description:
      "Calculate GDV and residual land value with local market data",
    icon: "BarChart3",
  },
];

export const CALCULATORS: CalculatorMeta[] = [
  // ════════════════════════════════════════════════
  // A. DEVELOPMENT & CONSTRUCTION
  // ════════════════════════════════════════════════
  {
    slug: "development-finance",
    name: "Development Finance Calculator",
    shortDesc:
      "Calculate senior debt, equity, interest costs and profit for your development project.",
    icon: "Building2",
    category: "development",
    categoryLabel: "Development & Construction",
    order: 1,
    metaTitle:
      "Development Finance Calculator | Estimate Costs & Profit | Construction Capital",
    metaDescription:
      "Free development finance calculator. Enter land cost, build costs and GDV to estimate senior debt, equity required, interest and developer profit. Optional mezzanine toggle.",
    h1: "Development Finance Calculator",
    heroSubtitle:
      "Model your development appraisal in seconds. Enter your costs and GDV to see senior debt, equity, interest and profit - with an optional mezzanine layer.",
    faqs: [
      {
        question: "How much can I borrow with development finance?",
        answer:
          "Most lenders offer up to 65–70% of the Gross Development Value (LTGDV) as senior debt. With mezzanine finance layered on top, you can stretch total borrowing to 85–90% LTGDV, reducing the equity you need to contribute.",
      },
      {
        question: "What interest rate should I expect?",
        answer:
          "Senior development finance rates typically start from 6.5% per annum. Rates vary based on the project, location, developer experience and loan-to-GDV ratio. Mezzanine finance, which carries higher risk, typically starts from 12% per annum.",
      },
      {
        question: "How is development finance interest calculated?",
        answer:
          "Interest is usually charged on a rolled-up basis, meaning it accrues during the build period and is repaid along with the principal when units are sold. This calculator uses a simple annual interest estimate on the total facility for the full term.",
      },
      {
        question: "What costs does the calculator include?",
        answer:
          "The calculator covers land cost, build costs, professional fees and a contingency percentage. It does not include stamp duty, agent fees or legal costs on the sale of units - factor these into your own appraisal.",
      },
      {
        question: "Is this calculator accurate for my project?",
        answer:
          "This is an indicative tool for initial appraisals. Every lender structures deals differently, and actual terms depend on your track record, the site and market conditions. Contact us for a bespoke quote tailored to your project.",
      },
    ],
    relatedCalculators: [
      "mezzanine-finance",
      "development-appraisal",
      "build-cost-estimator",
    ],
    dealRoomLoanType: "Development Finance",
    usesLocationData: true,
  },
  {
    slug: "development-profit",
    name: "Development Profit Calculator",
    shortDesc:
      "Estimate gross and net profit, profit on cost and profit per unit for a residential development.",
    icon: "TrendingUp",
    category: "development",
    categoryLabel: "Development & Construction",
    order: 2,
    metaTitle:
      "Development Profit Calculator | Gross & Net Profit | Construction Capital",
    metaDescription:
      "Free development profit calculator. Enter unit mix, land cost, build costs and GDV to estimate gross profit, net profit, profit on cost and profit per unit for your scheme.",
    h1: "Development Profit Calculator",
    heroSubtitle:
      "See whether your scheme stacks up. Enter your costs and sales values to calculate developer profit, profit on cost and return per unit.",
    faqs: [
      {
        question: "What is a good profit on cost for a development?",
        answer:
          "Most lenders require a minimum 20% profit on cost (or 15–20% profit on GDV) for the scheme to be viable. Higher-risk projects or first-time developers may need to demonstrate higher margins to secure funding.",
      },
      {
        question: "What is the difference between profit on cost and profit on GDV?",
        answer:
          "Profit on cost divides your net profit by total project costs (including finance). Profit on GDV divides net profit by the Gross Development Value. Lenders typically assess both, but profit on cost is the more common benchmark.",
      },
      {
        question: "Does this calculator include finance costs?",
        answer:
          "Yes. You can enter an estimated finance cost percentage which is applied to total project costs. For a more detailed finance breakdown, use our Development Finance Calculator.",
      },
      {
        question: "How do I estimate GDV for my scheme?",
        answer:
          "GDV is the total sales revenue from your completed units. Use comparable local sales data - our GDV Calculator can auto-populate values from Land Registry data for your area.",
      },
      {
        question: "Should I include affordable housing in my profit calculation?",
        answer:
          "If your scheme includes affordable units, value them at the discounted price they'll be sold at (typically 60–80% of market value for shared ownership, or a fixed price for affordable rent). This reduces your total GDV.",
      },
    ],
    relatedCalculators: [
      "development-finance",
      "gdv-calculator",
      "build-cost-estimator",
    ],
    dealRoomLoanType: "Development Finance",
    usesLocationData: true,
  },
  {
    slug: "build-cost-estimator",
    name: "Build Cost Estimator",
    shortDesc:
      "Estimate total build costs by project type, specification level and region using BCIS benchmarks.",
    icon: "Hammer",
    category: "development",
    categoryLabel: "Development & Construction",
    order: 3,
    metaTitle:
      "Build Cost Estimator UK | Cost Per Sqft by Region | Construction Capital",
    metaDescription:
      "Free build cost estimator for UK developments. Calculate total build costs by project type, specification level and region. Based on BCIS benchmark data for new-builds, conversions and refurbishments.",
    h1: "Build Cost Estimator",
    heroSubtitle:
      "Get a realistic build cost estimate for your project. Select your build type, specification and region to see cost per sqft and total build budget.",
    faqs: [
      {
        question: "How much does it cost to build per square foot in the UK?",
        answer:
          "Build costs vary significantly by region and specification. As a guide: basic new-build houses cost £120–160/sqft, standard specification £160–220/sqft, high specification £220–300/sqft, and luxury finishes can exceed £350/sqft. London and the South East attract a 15–25% premium.",
      },
      {
        question: "What is included in build costs?",
        answer:
          "Build costs typically include substructure (foundations), superstructure (walls, floors, roof), internal finishes, mechanical and electrical (M&E), external works and preliminaries. They exclude land cost, professional fees, finance costs and contingency - factor these separately.",
      },
      {
        question: "How accurate are online build cost calculators?",
        answer:
          "Online calculators provide a useful starting point for feasibility. Actual costs depend on site conditions, ground conditions, access, planning requirements and market conditions. For funding purposes, lenders will require a Quantity Surveyor's cost plan.",
      },
      {
        question: "What contingency should I allow?",
        answer:
          "Most lenders and QS firms recommend 5–10% contingency for new-builds and 10–15% for refurbishments or conversions. Complex sites, listed buildings or projects with planning uncertainty should allow higher contingencies.",
      },
      {
        question: "Are build costs higher for conversions than new-builds?",
        answer:
          "Often yes. Conversions involve working with existing structures, which can reveal hidden costs (asbestos, structural issues, services upgrades). However, conversions may benefit from reduced VAT (5% vs 20%) and lower demolition costs.",
      },
    ],
    relatedCalculators: [
      "development-finance",
      "development-appraisal",
      "professional-fees",
    ],
    dealRoomLoanType: "Development Finance",
    usesLocationData: true,
  },
  {
    slug: "development-appraisal",
    name: "Development Appraisal Calculator",
    shortDesc:
      "Run a full development appraisal with sensitivity analysis and maximum land bid calculation.",
    icon: "FileSpreadsheet",
    category: "development",
    categoryLabel: "Development & Construction",
    order: 4,
    metaTitle:
      "Development Appraisal Calculator | Residual Valuation | Construction Capital",
    metaDescription:
      "Free development appraisal calculator. Enter all project costs, GDV and target profit to generate a full appraisal, sensitivity analysis and maximum land bid price.",
    h1: "Development Appraisal Calculator",
    heroSubtitle:
      "Run a comprehensive development appraisal. Enter your costs and target return to see a full cost breakdown, residual land value and profit sensitivity at different GDV scenarios.",
    faqs: [
      {
        question: "What is a development appraisal?",
        answer:
          "A development appraisal is a financial model that assesses the viability of a property development by comparing the Gross Development Value (GDV) against all costs - land, construction, fees, finance and profit. It determines whether the scheme generates an acceptable return.",
      },
      {
        question: "What is the residual method of valuation?",
        answer:
          "The residual method calculates land value by deducting all development costs (including target profit) from the GDV. The 'residual' figure is the maximum you should pay for the land. It's the standard method used by developers and valuers.",
      },
      {
        question: "What target profit should I use?",
        answer:
          "Most lenders require 15–20% profit on GDV (or 20–25% profit on cost) for residential schemes. Commercial developments may accept lower margins. First-time developers or complex schemes may need higher margins to satisfy lender risk appetite.",
      },
      {
        question: "What is sensitivity analysis in a development appraisal?",
        answer:
          "Sensitivity analysis shows how your profit changes if GDV or costs vary from your base case. For example, what happens to profit if GDV falls 5% or build costs rise 10%? Lenders always stress-test your appraisal using downside scenarios.",
      },
      {
        question: "How does this differ from a Quantity Surveyor's appraisal?",
        answer:
          "This calculator provides a high-level feasibility assessment. A QS appraisal includes detailed elemental cost breakdowns, phased cash flows, S-curve drawdown profiles and site-specific adjustments. You'll need a QS report for formal funding applications.",
      },
    ],
    relatedCalculators: [
      "residual-land-value",
      "build-cost-estimator",
      "development-finance",
    ],
    dealRoomLoanType: "Development Finance",
    usesLocationData: true,
  },
  {
    slug: "section-106-cil",
    name: "S106 / CIL Calculator",
    shortDesc:
      "Estimate Section 106 contributions and Community Infrastructure Levy for your development.",
    icon: "Landmark",
    category: "development",
    categoryLabel: "Development & Construction",
    order: 5,
    metaTitle:
      "S106 & CIL Calculator | Planning Obligations Estimator | Construction Capital",
    metaDescription:
      "Free S106 and CIL calculator. Estimate Section 106 contributions and Community Infrastructure Levy costs for your UK development based on local authority rates and unit count.",
    h1: "S106 / CIL Calculator",
    heroSubtitle:
      "Estimate your planning obligations before you commit. Enter your local authority, unit count and floorspace to calculate CIL liability and likely S106 contributions.",
    faqs: [
      {
        question: "What is the Community Infrastructure Levy (CIL)?",
        answer:
          "CIL is a fixed charge per square metre of new floorspace, set by each local authority. It funds infrastructure like schools, transport and green spaces. Rates vary from £0 to £600+/sqm depending on the local authority, location within the borough, and use class.",
      },
      {
        question: "What is Section 106?",
        answer:
          "S106 is a legal agreement between a developer and the local planning authority. It typically covers affordable housing provision, education contributions, highways improvements, open space and ecological mitigation. Unlike CIL, S106 is negotiated on a site-by-site basis.",
      },
      {
        question: "Can I claim CIL exemptions?",
        answer:
          "Self-build projects, affordable housing and charitable developments may be exempt from CIL. Some local authorities also offer relief for vacant buildings (the 'vacant building credit'). Exemptions must be claimed before development commences.",
      },
      {
        question: "How do I find my local CIL rate?",
        answer:
          "Check your local authority's planning website for their CIL Charging Schedule. Rates are usually published as a table showing charges by zone and use class. Some councils haven't adopted CIL - they rely on S106 instead.",
      },
      {
        question:
          "How much should I budget for S106 on a residential development?",
        answer:
          "S106 costs vary enormously by location and scheme size. As a rough guide, budget £5,000–£20,000 per unit for education, highways and open space contributions. Affordable housing requirements (typically 20–40% of units) are the largest S106 obligation.",
      },
    ],
    relatedCalculators: [
      "development-appraisal",
      "residual-land-value",
      "professional-fees",
    ],
    dealRoomLoanType: "Development Finance",
    usesLocationData: true,
  },
  {
    slug: "construction-timeline",
    name: "Construction Timeline Estimator",
    shortDesc:
      "Estimate build duration by project type, scale and construction method with phase-by-phase breakdown.",
    icon: "CalendarDays",
    category: "development",
    categoryLabel: "Development & Construction",
    order: 6,
    metaTitle:
      "Construction Timeline Estimator | Build Duration Calculator | Construction Capital",
    metaDescription:
      "Free construction timeline estimator. Calculate build duration by project type, number of units and construction method. See phase-by-phase breakdown and recommended finance term.",
    h1: "Construction Timeline Estimator",
    heroSubtitle:
      "Plan your build programme and finance term. Select your project type, scale and construction method to see an estimated timeline with key phases.",
    faqs: [
      {
        question: "How long does it take to build a house in the UK?",
        answer:
          "A single new-build house typically takes 6–12 months from breaking ground to completion, depending on size, specification and construction method. Timber frame can reduce this to 4–8 months. Add 3–6 months for planning and pre-commencement conditions.",
      },
      {
        question: "How does construction method affect build time?",
        answer:
          "Traditional masonry construction is the slowest method. Timber frame reduces build time by 20–30%. SIPs (Structural Insulated Panels) and modular/offsite construction can cut timelines by 40–60% compared to traditional methods.",
      },
      {
        question: "Why does build duration matter for finance?",
        answer:
          "Development finance interest accrues throughout the build period. A longer build means higher interest costs, eroding your profit. Lenders set a maximum term - if your build overruns, you may face penalty rates or need to refinance.",
      },
      {
        question: "What are pre-commencement conditions?",
        answer:
          "Pre-commencement conditions are planning conditions that must be discharged before you start building. Common examples include drainage strategy, contamination reports, ecology surveys and construction management plans. Allow 6–12 weeks to discharge these.",
      },
      {
        question: "Should I include a sales period in my timeline?",
        answer:
          "Yes. Your finance term should cover both the build period and a realistic sales period. Most lenders allow 3–6 months for sales of a small scheme. Larger schemes may phase sales throughout the build.",
      },
    ],
    relatedCalculators: [
      "development-finance",
      "build-cost-estimator",
      "development-appraisal",
    ],
    dealRoomLoanType: "Development Finance",
    usesLocationData: false,
  },

  // ════════════════════════════════════════════════
  // B. CONVERSIONS & PERMITTED DEVELOPMENT
  // ════════════════════════════════════════════════
  {
    slug: "permitted-development",
    name: "PD Rights Calculator",
    shortDesc:
      "Check PD eligibility and estimate conversion costs, GDV and profit for permitted development schemes.",
    icon: "ShieldCheck",
    category: "conversions",
    categoryLabel: "Conversions & PD",
    order: 1,
    metaTitle:
      "Permitted Development Calculator | PD Rights Checker | Construction Capital",
    metaDescription:
      "Free permitted development calculator. Check PD eligibility by use class, estimate conversion costs and calculate profit for office-to-resi and other PD schemes in England.",
    h1: "Permitted Development (PD) Rights Calculator",
    heroSubtitle:
      "Check whether your conversion qualifies under permitted development and estimate the financials. Enter the current use class, floorspace and location to see costs, GDV and profit.",
    faqs: [
      {
        question: "What is permitted development?",
        answer:
          "Permitted development (PD) rights allow certain types of building work and changes of use without needing full planning permission. Instead, you apply for 'prior approval' which is a simpler, faster process focused on specific impacts like transport, flooding and noise.",
      },
      {
        question: "Which use classes can convert to residential under PD?",
        answer:
          "Class MA allows commercial, business and service uses (Use Class E) to convert to residential (C3). This covers offices, shops, restaurants, light industrial and more. The building must have been in use class E for at least 2 years and vacant for at least 3 months.",
      },
      {
        question: "What are the size limits for PD conversions?",
        answer:
          "Under Class MA, there is no upper floorspace limit (the 1,500 sqm cap was removed in 2024). However, each individual dwelling must be at least 37 sqm (nationally described space standards). Conservation areas and listed buildings are generally excluded.",
      },
      {
        question: "How long does prior approval take?",
        answer:
          "The local authority has 56 days (8 weeks) to determine a prior approval application, compared to 8–13 weeks for full planning. If they don't respond within 56 days, prior approval is deemed granted by default.",
      },
      {
        question: "What can the council refuse prior approval on?",
        answer:
          "Councils can only assess specific matters: transport/highways impact, contamination, flooding, noise, natural light, fire safety and the impact on the intended use of the building. They cannot refuse based on design, density or housing mix - which is a key advantage over full planning.",
      },
    ],
    relatedCalculators: [
      "office-to-residential",
      "commercial-to-residential",
      "development-finance",
    ],
    dealRoomLoanType: "Development Finance",
    usesLocationData: true,
  },
  {
    slug: "office-to-residential",
    name: "Office to Resi Calculator",
    shortDesc:
      "Calculate conversion costs, GDV and profit for office-to-residential schemes under PD or planning.",
    icon: "Building",
    category: "conversions",
    categoryLabel: "Conversions & PD",
    order: 2,
    metaTitle:
      "Office to Residential Conversion Calculator | Costs & Profit | Construction Capital",
    metaDescription:
      "Free office to residential conversion calculator. Enter purchase price, floorspace and proposed units to estimate conversion cost, GDV, profit and finance requirements.",
    h1: "Office to Residential Conversion Calculator",
    heroSubtitle:
      "Model the financials of an office-to-resi conversion. Enter the building details and proposed unit mix to see total cost, GDV and developer profit.",
    faqs: [
      {
        question: "How much does an office to residential conversion cost per sqft?",
        answer:
          "Typical conversion costs range from £80–150/sqft for basic conversions (offices in good condition) to £150–250/sqft for more complex projects requiring structural work, new services or reconfigured layouts. Add 15–25% for London and the South East.",
      },
      {
        question: "Do I need planning permission for office to resi?",
        answer:
          "In most cases, office-to-residential conversions qualify under Permitted Development (Class MA, formerly Class O). You apply for prior approval instead of full planning permission, which is faster and has fewer grounds for refusal.",
      },
      {
        question: "What GDV should I expect from an office conversion?",
        answer:
          "GDV depends on location, unit sizes and specification. Office conversions typically create flats, so use local flat prices as your guide. New-build premium is usually lower for conversions (5–15%) compared to ground-up new-builds (15–25%).",
      },
      {
        question: "What financing is available for office conversions?",
        answer:
          "Most development finance lenders fund office-to-resi schemes at 60–70% LTGDV for senior debt, with mezzanine available to stretch to 85–90%. PD schemes may attract slightly better terms due to reduced planning risk.",
      },
      {
        question: "What are the main risks of office-to-resi conversions?",
        answer:
          "Key risks include: discovering asbestos or structural issues in the existing building, achieving adequate natural light (a prior approval requirement), managing service charge liabilities during conversion, and creating units that meet minimum space standards (37 sqm).",
      },
    ],
    relatedCalculators: [
      "permitted-development",
      "development-finance",
      "build-cost-estimator",
    ],
    dealRoomLoanType: "Development Finance",
    usesLocationData: true,
  },
  {
    slug: "commercial-to-residential",
    name: "Commercial to Resi Calculator",
    shortDesc:
      "Estimate costs and profit for converting retail, pubs, warehouses and industrial units to residential.",
    icon: "Store",
    category: "conversions",
    categoryLabel: "Conversions & PD",
    order: 3,
    metaTitle:
      "Commercial to Residential Conversion Calculator | Construction Capital",
    metaDescription:
      "Free commercial to residential conversion calculator. Estimate costs, GDV and profit for converting shops, pubs, warehouses and industrial buildings to homes.",
    h1: "Commercial to Residential Conversion Calculator",
    heroSubtitle:
      "Assess the viability of converting a commercial building to residential. Select the property type, enter costs and see estimated profit and finance requirements.",
    faqs: [
      {
        question: "Which commercial buildings can be converted to residential?",
        answer:
          "Under Class MA, most Use Class E buildings (shops, offices, cafes, light industrial, gyms, health centres) can convert to residential via PD. Pubs (Sui Generis), warehouses (B8) and heavy industrial (B2) typically require full planning permission.",
      },
      {
        question: "How much does a commercial to residential conversion cost?",
        answer:
          "Costs vary significantly by building type. Retail conversions: £100–180/sqft. Warehouse/industrial: £120–200/sqft. Pubs: £130–220/sqft. These ranges assume standard specification - listed buildings or complex structures will cost more.",
      },
      {
        question: "Is VAT charged on conversions?",
        answer:
          "Conversions of non-residential buildings to residential use benefit from a reduced VAT rate of 5% on construction services and materials (compared to 20% standard rate). This can significantly improve scheme viability. The reduced rate applies to the first conversion only.",
      },
      {
        question: "Do conversions qualify for Help to Buy or shared ownership?",
        answer:
          "Converted units can qualify for shared ownership and other affordable housing schemes if built to the required standards. They generally do not qualify for the (now closed) Help to Buy equity loan scheme, which was restricted to new-build homes.",
      },
      {
        question: "What is the planning route for pub and warehouse conversions?",
        answer:
          "Pubs and drinking establishments are classed as Sui Generis, so they require full planning permission for change of use. Warehouses (B8 storage) also need full planning unless the local authority has granted a Local Development Order for PD conversion.",
      },
    ],
    relatedCalculators: [
      "permitted-development",
      "office-to-residential",
      "development-finance",
    ],
    dealRoomLoanType: "Development Finance",
    usesLocationData: true,
  },
  {
    slug: "barn-conversion",
    name: "Barn Conversion Calculator",
    shortDesc:
      "Estimate conversion costs, GDV and profit for agricultural barn-to-dwelling projects.",
    icon: "Warehouse",
    category: "conversions",
    categoryLabel: "Conversions & PD",
    order: 4,
    metaTitle:
      "Barn Conversion Cost Calculator | Estimate Build & Profit | Construction Capital",
    metaDescription:
      "Free barn conversion calculator. Estimate costs per sqft, GDV and profit for traditional, steel frame and Dutch barn conversions. Includes listed building and ecology cost adjustments.",
    h1: "Barn Conversion Cost Calculator",
    heroSubtitle:
      "Assess the viability of a barn conversion project. Enter the barn type, condition and proposed use to estimate conversion costs, GDV and developer profit.",
    faqs: [
      {
        question: "How much does a barn conversion cost in the UK?",
        answer:
          "Barn conversion costs range from £150–250/sqft for steel frame or Dutch barns in good condition, to £200–400+/sqft for traditional stone barns requiring significant structural work. Listed barns can cost 30–50% more due to heritage requirements and specialist materials.",
      },
      {
        question: "Do barn conversions need planning permission?",
        answer:
          "Class Q permitted development rights allow agricultural buildings to convert to up to 5 dwellings (or 10 under certain conditions). The barn must have been in agricultural use on 20 March 2013 and not significantly extended. Full planning is needed for listed barns.",
      },
      {
        question: "What surveys are needed for a barn conversion?",
        answer:
          "Typical surveys include: structural survey, bat/ecology survey (legally required), contamination assessment (from agricultural use), drainage survey, and a heritage statement if near listed buildings or in a conservation area. Budget £5,000–£15,000 for surveys.",
      },
      {
        question: "What is the typical GDV for a barn conversion?",
        answer:
          "Barn conversions in desirable rural locations can achieve premium prices. A well-converted traditional barn can sell for £400–600/sqft in sought-after counties. However, rural locations may have slower sales velocity than urban schemes.",
      },
      {
        question: "Can I get development finance for a barn conversion?",
        answer:
          "Yes. Most development lenders fund barn conversions at 60–70% LTGDV. They'll require a structural engineer's report, detailed costings and evidence of planning consent or Class Q approval. First-time developers may face stricter criteria.",
      },
    ],
    relatedCalculators: [
      "permitted-development",
      "build-cost-estimator",
      "development-finance",
    ],
    dealRoomLoanType: "Development Finance",
    usesLocationData: true,
  },
  {
    slug: "hmo-conversion",
    name: "HMO Conversion Calculator",
    shortDesc:
      "Calculate total investment, rental yield, ROI and payback period for an HMO conversion project.",
    icon: "Users",
    category: "conversions",
    categoryLabel: "Conversions & PD",
    order: 5,
    metaTitle:
      "HMO Conversion Calculator | Yield & ROI Estimator | Construction Capital",
    metaDescription:
      "Free HMO conversion calculator. Enter purchase price, room count and rents to calculate total investment, gross yield, net yield, ROI and payback period for your HMO project.",
    h1: "HMO Conversion Calculator",
    heroSubtitle:
      "Model the returns on an HMO conversion. Enter purchase price, number of rooms and target rents to see yield, ROI and payback period.",
    faqs: [
      {
        question: "What is an HMO?",
        answer:
          "A House in Multiple Occupation (HMO) is a property rented by 3 or more tenants from 2 or more households who share facilities like a kitchen or bathroom. Mandatory HMO licensing applies to properties with 5+ tenants. Some councils require 'additional licensing' for smaller HMOs.",
      },
      {
        question: "Do I need planning permission to convert to an HMO?",
        answer:
          "Converting a dwelling (C3) to a small HMO (C4, 3–6 occupants) is permitted development in most areas. However, many councils have introduced Article 4 directions removing PD rights for HMOs - check your local authority. Large HMOs (7+ occupants, Sui Generis) always need planning.",
      },
      {
        question: "What yields can I expect from an HMO?",
        answer:
          "HMOs typically generate gross yields of 8–15%, significantly higher than standard buy-to-let (4–7%). Net yields after management costs, voids and maintenance are usually 6–10%. Higher yields are achievable in university towns and areas with strong rental demand.",
      },
      {
        question: "How much does it cost to convert a property to an HMO?",
        answer:
          "Budget £8,000–£15,000 per lettable room for a standard conversion, covering fire safety upgrades, en-suite bathrooms, locks, communal kitchen/living areas and decoration. More extensive conversions (adding rooms, extending) can cost £15,000–£25,000+ per room.",
      },
      {
        question: "What financing is available for HMO conversions?",
        answer:
          "Bridging loans are commonly used to purchase and convert HMO properties, then refinanced onto a specialist HMO mortgage. Some lenders offer dedicated HMO development finance. LTVs are typically 70–75% on the post-conversion value.",
      },
    ],
    relatedCalculators: [
      "rental-yield",
      "bridging-loans",
      "refurbishment-finance",
    ],
    dealRoomLoanType: "Bridging Loan",
    usesLocationData: true,
  },
  {
    slug: "church-conversion",
    name: "Church / Chapel Conversion Calculator",
    shortDesc:
      "Estimate conversion costs, heritage considerations and profit for church and chapel developments.",
    icon: "Church",
    category: "conversions",
    categoryLabel: "Conversions & PD",
    order: 6,
    metaTitle:
      "Church Conversion Calculator | Heritage Build Costs & Profit | Construction Capital",
    metaDescription:
      "Free church and chapel conversion calculator. Estimate costs for listed and unlisted religious buildings, including heritage premiums, specialist surveys and developer profit.",
    h1: "Church / Chapel Conversion Calculator",
    heroSubtitle:
      "Assess the viability of a church or chapel conversion. Enter the building details, listing grade and proposed units to see estimated costs, GDV and profit.",
    faqs: [
      {
        question: "How much does a church conversion cost?",
        answer:
          "Church conversions typically cost £200–400/sqft, with Grade II listed buildings at the lower end and Grade I or II* at the higher end. The premium over standard conversions is 30–80% due to specialist materials, conservation requirements and the complexity of working with large open-plan spaces.",
      },
      {
        question: "Do church conversions need planning permission?",
        answer:
          "Yes. Churches (D1 or F1 use class) do not benefit from PD rights for residential conversion. Full planning permission is required, plus Listed Building Consent if the building is listed. The planning process typically takes 3–6 months.",
      },
      {
        question: "What are the main challenges of church conversions?",
        answer:
          "Key challenges include: creating adequate floor levels in high-ceilinged spaces, meeting building regulations for fire safety and thermal performance, preserving listed features (stained glass, stonework), and addressing bat roosting (very common in churches).",
      },
      {
        question: "Can I get heritage grants for a church conversion?",
        answer:
          "Historic England and the Heritage Lottery Fund occasionally offer grants for converting heritage buildings to sustainable new uses. Grants typically cover 25–50% of heritage-specific costs (restoration of listed features) rather than the full conversion. Awards are competitive.",
      },
      {
        question: "What GDV can I expect from a church conversion?",
        answer:
          "Well-converted churches in desirable locations can command 20–40% premiums over standard housing due to their unique character. However, unusual layouts may limit the buyer pool. Grade I listed conversions can achieve exceptional prices but take longer to sell.",
      },
    ],
    relatedCalculators: [
      "build-cost-estimator",
      "development-finance",
      "professional-fees",
    ],
    dealRoomLoanType: "Development Finance",
    usesLocationData: true,
  },

  // ════════════════════════════════════════════════
  // C. INVESTMENT & RETURNS
  // ════════════════════════════════════════════════
  {
    slug: "rental-yield",
    name: "Rental Yield Calculator",
    shortDesc:
      "Calculate gross and net rental yield, annual income and monthly cash flow for any property.",
    icon: "Percent",
    category: "investment",
    categoryLabel: "Investment & Returns",
    order: 1,
    metaTitle:
      "Rental Yield Calculator UK | Gross & Net Yield | Construction Capital",
    metaDescription:
      "Free rental yield calculator. Enter property price, monthly rent and costs to calculate gross yield, net yield, annual income and monthly cash flow for buy-to-let investments.",
    h1: "Rental Yield Calculator",
    heroSubtitle:
      "See the true return on your rental property. Enter the purchase price, monthly rent and running costs to calculate gross and net yield.",
    faqs: [
      {
        question: "What is a good rental yield in the UK?",
        answer:
          "Gross yields of 5–8% are considered good in most areas. Prime London averages 3–4%, while northern cities and university towns can achieve 7–10%+. Net yields (after costs) are typically 2–3 percentage points lower than gross.",
      },
      {
        question: "What is the difference between gross and net yield?",
        answer:
          "Gross yield = (annual rent ÷ property price) × 100. Net yield deducts annual costs (management fees, insurance, maintenance, voids, service charges) before dividing by the property price. Net yield gives a more realistic picture of your return.",
      },
      {
        question: "What costs should I include in net yield?",
        answer:
          "Include: letting agent/management fees (8–15% of rent), insurance (buildings and landlord), maintenance (budget 10–15% of rent), void periods (typically 2–4 weeks/year), ground rent and service charge (leasehold), and any licensing costs.",
      },
      {
        question: "Does yield include mortgage payments?",
        answer:
          "No. Rental yield is calculated on the full property value, not the cash invested. To see the return on your actual cash outlay, use our Cash-on-Cash Return Calculator or ROI Calculator instead.",
      },
      {
        question: "How does yield vary by property type?",
        answer:
          "Flats generally yield more than houses due to lower purchase prices relative to rent. HMOs achieve the highest yields (8–15%+) but require more management. Commercial property yields are typically 5–8% but with longer void periods.",
      },
    ],
    relatedCalculators: [
      "buy-to-let-mortgage",
      "cash-on-cash-return",
      "roi-calculator",
    ],
    dealRoomLoanType: "Commercial Mortgage",
    usesLocationData: true,
  },
  {
    slug: "roi-calculator",
    name: "Property ROI Calculator",
    shortDesc:
      "Calculate total return, annualised ROI and return on cash invested including capital growth.",
    icon: "TrendingUp",
    category: "investment",
    categoryLabel: "Investment & Returns",
    order: 2,
    metaTitle:
      "Property ROI Calculator UK | Total Return on Investment | Construction Capital",
    metaDescription:
      "Free property ROI calculator. Enter purchase price, deposit, rent and expected growth to calculate total return, annualised ROI and return on cash invested over your holding period.",
    h1: "Property ROI Calculator",
    heroSubtitle:
      "See the full picture of your property investment return. Enter your purchase details, rental income and growth assumptions to calculate total ROI over your holding period.",
    faqs: [
      {
        question: "How do you calculate ROI on a rental property?",
        answer:
          "ROI on a rental property combines rental income and capital growth. Total return = (cumulative net rent + capital gain) over the holding period. Annualised ROI accounts for the time value of money. ROI on cash measures the return on your actual deposit, not the full property value.",
      },
      {
        question: "What ROI should I aim for on a buy-to-let?",
        answer:
          "A good total ROI for buy-to-let is 8–15% per annum (combining yield and capital growth). In high-growth areas like London, capital appreciation drives returns despite lower yields. In the North, higher yields compensate for slower growth.",
      },
      {
        question: "Does ROI include leverage effects?",
        answer:
          "Yes. This calculator shows ROI on cash invested (your deposit), which includes the leverage effect of mortgage finance. A £25k deposit on a £100k property that grows 5% gives you £5k growth on £25k invested - a 20% ROI on cash before rental income.",
      },
      {
        question: "What capital growth rate should I assume?",
        answer:
          "The UK long-term average is 5–7% per annum, but this varies hugely by region. Use our location data to see actual YoY price changes in your target area. For conservative appraisals, use 2–3% growth. Stress-test at 0% or negative growth.",
      },
      {
        question: "Should I factor in transaction costs?",
        answer:
          "Yes. Include stamp duty, legal fees, survey costs and arrangement fees on purchase, plus agent fees and legal costs on sale. These can add 5–8% to purchase costs and 2–3% to sale costs, significantly affecting short-term ROI.",
      },
    ],
    relatedCalculators: [
      "rental-yield",
      "cash-on-cash-return",
      "buy-to-let-mortgage",
    ],
    dealRoomLoanType: "Commercial Mortgage",
    usesLocationData: true,
  },
  {
    slug: "buy-to-let-mortgage",
    name: "BTL Mortgage Calculator",
    shortDesc:
      "Calculate monthly payments, ICR, stress-tested affordability and maximum borrowing for buy-to-let.",
    icon: "Home",
    category: "investment",
    categoryLabel: "Investment & Returns",
    order: 3,
    metaTitle:
      "Buy-to-Let Mortgage Calculator UK | ICR & Affordability | Construction Capital",
    metaDescription:
      "Free buy-to-let mortgage calculator. Enter property value, deposit and rent to calculate monthly payments, interest coverage ratio (ICR), stress-tested affordability and maximum borrowing.",
    h1: "Buy-to-Let Mortgage Calculator",
    heroSubtitle:
      "Check whether your buy-to-let investment stacks up. Enter property value, deposit and rental income to see monthly payments, ICR and maximum borrowing.",
    faqs: [
      {
        question: "What is ICR and why does it matter for BTL?",
        answer:
          "Interest Coverage Ratio (ICR) measures how comfortably the rent covers the mortgage interest. Most lenders require an ICR of 125–145% at a stress rate of 5.5%. For example, if monthly interest is £500, rent must be at least £625–£725.",
      },
      {
        question: "What deposit do I need for a buy-to-let mortgage?",
        answer:
          "Most BTL lenders require a minimum 25% deposit (75% LTV). Lower rates are available at 60% and 50% LTV. First-time landlords and limited company purchases may need larger deposits. Some specialist lenders offer up to 85% LTV.",
      },
      {
        question: "Should I choose interest-only or repayment?",
        answer:
          "Most BTL investors choose interest-only to maximise monthly cash flow. Your monthly payment is lower, and you rely on capital growth to build equity. Repayment costs more monthly but builds equity over time. Many investors use interest-only then remortgage periodically.",
      },
      {
        question: "What is the stress test rate?",
        answer:
          "The stress test rate is the interest rate lenders use to assess affordability - typically 5.5% regardless of your actual rate. This ensures you can still afford payments if rates rise. Some lenders use higher stress rates (6–7%) for higher-risk products.",
      },
      {
        question: "Can I get a BTL mortgage through a limited company?",
        answer:
          "Yes. Since changes to mortgage interest tax relief (Section 24), many landlords use Special Purpose Vehicles (SPVs) for tax efficiency. Company BTL rates are typically 0.5–1% higher than personal rates, but full mortgage interest is deductible against rental income.",
      },
    ],
    relatedCalculators: [
      "rental-yield",
      "roi-calculator",
      "stamp-duty-sdlt",
    ],
    dealRoomLoanType: "Commercial Mortgage",
    usesLocationData: true,
  },
  {
    slug: "portfolio-leverage",
    name: "Portfolio Leverage Calculator",
    shortDesc:
      "Analyse your portfolio's LTV, equity position, borrowing capacity and debt service coverage ratio.",
    icon: "PieChart",
    category: "investment",
    categoryLabel: "Investment & Returns",
    order: 4,
    metaTitle:
      "Portfolio Leverage Calculator | Equity & Borrowing Capacity | Construction Capital",
    metaDescription:
      "Free portfolio leverage calculator. Enter your property portfolio details to calculate current LTV, available equity, additional borrowing capacity and debt service coverage ratio (DSCR).",
    h1: "Portfolio Leverage Calculator",
    heroSubtitle:
      "Understand your portfolio's financial position. Enter your portfolio value, debt and rental income to see available equity, borrowing capacity and DSCR.",
    faqs: [
      {
        question: "What is portfolio leverage?",
        answer:
          "Portfolio leverage measures how much debt you use relative to your portfolio's value. A portfolio worth £2M with £1.2M debt has 60% leverage (LTV). Higher leverage amplifies returns but increases risk. Most lenders cap portfolio LTV at 65–75%.",
      },
      {
        question: "What is DSCR and why does it matter?",
        answer:
          "Debt Service Coverage Ratio (DSCR) measures whether your rental income covers your debt payments. DSCR = annual net operating income ÷ annual debt payments. Lenders typically require DSCR of 1.25x or higher. Below 1.0x means you're cash-flow negative.",
      },
      {
        question: "How much can I borrow against my portfolio?",
        answer:
          "Your borrowing capacity depends on current LTV, rental income and lender criteria. At 75% LTV with sufficient rental coverage, a portfolio valued at £2M could support up to £1.5M debt. Portfolio lenders may offer single facilities covering multiple properties.",
      },
      {
        question: "Should I refinance to release equity?",
        answer:
          "Refinancing to release equity makes sense when property values have risen significantly, rates are competitive, and you have a clear use for the released capital (new purchases, development). Factor in arrangement fees, legal costs and potential early repayment charges.",
      },
      {
        question: "What is a portfolio landlord?",
        answer:
          "The PRA defines a portfolio landlord as someone with 4+ mortgaged buy-to-let properties. Portfolio landlords face stricter assessment criteria - lenders must consider the entire portfolio, not just individual properties. Specialist portfolio lenders offer streamlined processes.",
      },
    ],
    relatedCalculators: [
      "buy-to-let-mortgage",
      "rental-yield",
      "roi-calculator",
    ],
    dealRoomLoanType: "Commercial Mortgage",
    usesLocationData: false,
  },
  {
    slug: "cash-on-cash-return",
    name: "Cash-on-Cash Return Calculator",
    shortDesc:
      "Calculate the annual cash return on your actual cash invested in a rental property.",
    icon: "Banknote",
    category: "investment",
    categoryLabel: "Investment & Returns",
    order: 5,
    metaTitle:
      "Cash-on-Cash Return Calculator | Property Investment | Construction Capital",
    metaDescription:
      "Free cash-on-cash return calculator for property investors. Enter your cash invested, rental income and expenses to see annual cash-on-cash return percentage and payback period.",
    h1: "Cash-on-Cash Return Calculator",
    heroSubtitle:
      "See the return on the cash you've actually invested. Enter your total cash outlay and monthly cash flow to calculate your cash-on-cash return and payback period.",
    faqs: [
      {
        question: "What is cash-on-cash return?",
        answer:
          "Cash-on-cash return measures the annual pre-tax cash flow from an investment divided by the total cash invested. Unlike yield (which uses property value), CoC uses your actual money put in - including deposit, stamp duty, refurb costs and fees.",
      },
      {
        question: "What is a good cash-on-cash return for property?",
        answer:
          "A cash-on-cash return of 8–12% is considered good for residential property. HMOs and serviced accommodation can achieve 15–25%+. Compare this to savings rates or stock market returns to assess whether the investment justifies the effort and risk.",
      },
      {
        question: "How does leverage affect cash-on-cash return?",
        answer:
          "Leverage (using a mortgage) amplifies cash-on-cash return because you invest less of your own money. However, mortgage payments reduce monthly cash flow. The sweet spot is where leverage boosts returns without turning cash flow negative.",
      },
      {
        question: "What should I include in 'total cash invested'?",
        answer:
          "Include: deposit, stamp duty, legal fees, survey costs, arrangement fees, any refurbishment costs, furnishing costs and initial void period costs. This gives the true picture of how much cash you put in before the property starts generating returns.",
      },
      {
        question: "How is cash-on-cash different from ROI?",
        answer:
          "Cash-on-cash only considers annual cash flow - it ignores capital growth and mortgage principal repayment. ROI includes all forms of return (cash flow + capital growth + equity buildup). CoC is best for assessing immediate cash flow; ROI for total investment performance.",
      },
    ],
    relatedCalculators: [
      "roi-calculator",
      "rental-yield",
      "buy-to-let-mortgage",
    ],
    dealRoomLoanType: "Commercial Mortgage",
    usesLocationData: true,
  },

  // ════════════════════════════════════════════════
  // D. BRIDGING & SHORT-TERM
  // ════════════════════════════════════════════════
  {
    slug: "bridging-loans",
    name: "Bridging Loan Calculator",
    shortDesc:
      "Estimate monthly interest, total cost and LTV for your bridging loan.",
    icon: "Clock",
    category: "bridging",
    categoryLabel: "Bridging & Short-Term",
    order: 1,
    metaTitle:
      "Bridging Loan Calculator | Monthly Interest & Total Cost | Construction Capital",
    metaDescription:
      "Free bridging loan calculator. Enter property value, loan amount, term and rate to calculate monthly interest, total borrowing cost, LTV and arrangement fees.",
    h1: "Bridging Loan Calculator",
    heroSubtitle:
      "Work out the true cost of a bridging loan. Enter your property value and loan details to see monthly interest, fees and total borrowing cost.",
    faqs: [
      {
        question: "How is bridging loan interest calculated?",
        answer:
          "Bridging loan interest is typically quoted as a monthly rate (e.g. 0.55% per month). Interest can be retained (deducted upfront from the loan), rolled up (added to the loan and paid at redemption), or serviced (paid monthly). This calculator assumes rolled-up interest.",
      },
      {
        question: "What fees are charged on a bridging loan?",
        answer:
          "Most bridging lenders charge an arrangement fee of 1–2% of the loan amount. There may also be valuation fees, legal fees and an exit fee (though many lenders have dropped exit fees). This calculator includes a standard 2% arrangement fee.",
      },
      {
        question: "What LTV can I get on a bridging loan?",
        answer:
          "Most bridging lenders offer up to 75% LTV on the open market value. Some specialist lenders go to 80% or even 100% with additional security. Lower LTVs typically attract better rates.",
      },
      {
        question: "How long can I have a bridging loan for?",
        answer:
          "Bridging loans typically run from 1 to 18 months. Most lenders prefer a clear exit strategy - either a sale or refinance - within 12 months. Extensions are possible but may incur additional fees.",
      },
      {
        question: "Is this calculator accurate?",
        answer:
          "This provides indicative figures for planning purposes. Actual terms depend on the property, your circumstances, the lender and the exit strategy. Contact us for a precise quote from our panel of 100+ lenders.",
      },
    ],
    relatedCalculators: [
      "auction-finance",
      "refurbishment-finance",
      "chain-break",
    ],
    dealRoomLoanType: "Bridging Loan",
    usesLocationData: false,
  },
  {
    slug: "auction-finance",
    name: "Auction Finance Calculator",
    shortDesc:
      "Calculate costs, deposit requirements and timeline for purchasing property at auction with bridging finance.",
    icon: "Gavel",
    category: "bridging",
    categoryLabel: "Bridging & Short-Term",
    order: 2,
    metaTitle:
      "Auction Finance Calculator | 28-Day Completion Costs | Construction Capital",
    metaDescription:
      "Free auction finance calculator. Enter guide price, valuation and LTV to calculate bridging costs, deposit needed and 28-day completion timeline for auction property purchases.",
    h1: "Auction Finance Calculator",
    heroSubtitle:
      "Plan your auction purchase with confidence. Enter the guide price, your maximum bid and exit strategy to see total finance costs and the deposit you need on auction day.",
    faqs: [
      {
        question: "How does auction finance work?",
        answer:
          "Auction finance is a type of bridging loan arranged quickly (often pre-auction) to fund property purchases at auction. You pay a 10% deposit on the day, then complete within 28 days using the bridging loan. The loan is then repaid via sale, refinance or development.",
      },
      {
        question: "How quickly can auction finance be arranged?",
        answer:
          "Most auction finance lenders can provide a Decision in Principle (DIP) within 24 hours and complete within 7–14 working days - well within the 28-day auction completion deadline. Pre-arrange your finance before bidding for the fastest completion.",
      },
      {
        question: "What deposit do I need at auction?",
        answer:
          "You pay 10% of the hammer price as a deposit immediately (usually by banker's draft or debit card). The remaining 90% is due within 28 days. Your bridging lender typically provides 70–75% LTV, so you need 25–30% total equity including the 10% deposit.",
      },
      {
        question: "What if I can't complete within 28 days?",
        answer:
          "Failure to complete within 28 days means you forfeit your 10% deposit and may be liable for further costs. This is why pre-arranging finance before bidding is essential. Some modern auctions offer 56-day completion or use the 'conditional' auction format.",
      },
      {
        question: "What exit strategies work for auction finance?",
        answer:
          "Common exit strategies: sell the property at market value (if bought below), refinance onto a buy-to-let mortgage (for rentals), or use development finance to fund refurbishment then sell. Your exit strategy determines the bridging term and rate.",
      },
    ],
    relatedCalculators: [
      "bridging-loans",
      "refurbishment-finance",
      "stamp-duty-sdlt",
    ],
    dealRoomLoanType: "Bridging Loan",
    usesLocationData: true,
  },
  {
    slug: "refurbishment-finance",
    name: "Refurbishment Finance Calculator",
    shortDesc:
      "Calculate day-1 loan, refurb drawdowns, total facility and equity position for light and heavy refurbishment.",
    icon: "Wrench",
    category: "bridging",
    categoryLabel: "Bridging & Short-Term",
    order: 3,
    metaTitle:
      "Refurbishment Finance Calculator | Light & Heavy Refurb Costs | Construction Capital",
    metaDescription:
      "Free refurbishment finance calculator. Enter purchase price, refurb budget and post-works value to calculate day-1 loan, total facility, interest costs and equity position.",
    h1: "Refurbishment Finance Calculator",
    heroSubtitle:
      "Model the finance for your refurbishment project. Enter the purchase price, refurb budget and expected end value to see your total facility, interest costs and equity position.",
    faqs: [
      {
        question: "What is the difference between light and heavy refurbishment?",
        answer:
          "Light refurb is cosmetic work - decoration, new kitchen/bathroom, flooring, garden. No structural changes or planning required. Heavy refurb involves structural work - extensions, loft conversions, reconfiguring layouts, underpinning. Heavy refurb typically needs building regulations and may need planning.",
      },
      {
        question: "How is refurbishment finance structured?",
        answer:
          "Refurb finance provides a day-1 loan (typically 70–75% of purchase price) plus staged drawdowns for refurb costs (released against QS inspections). The total facility covers purchase + refurb. Interest is charged on the drawn balance, not the full facility.",
      },
      {
        question: "What LTV can I get on refurbishment finance?",
        answer:
          "Day-1 advance: up to 75% of purchase price or 70% of current market value. Total facility: up to 75% of the gross development value (post-works value). Net loan after interest and fees deduction determines your true day-1 advance.",
      },
      {
        question: "Can I include the refurb costs in the loan?",
        answer:
          "Yes. Most refurbishment lenders fund 100% of refurb costs (drawn in stages). The refurb element is advanced against surveyor-verified completion of each stage. You may need to fund the first stage yourself before the lender starts releasing funds.",
      },
      {
        question: "What is the typical exit strategy for refurb finance?",
        answer:
          "Common exits: sell the refurbished property at the higher value, or refinance onto a longer-term mortgage (BTL or residential). If refinancing, ensure the post-works valuation supports the mortgage required to repay the refurb loan in full.",
      },
    ],
    relatedCalculators: [
      "bridging-loans",
      "build-cost-estimator",
      "development-exit",
    ],
    dealRoomLoanType: "Refurbishment Finance",
    usesLocationData: true,
  },
  {
    slug: "development-exit",
    name: "Development Exit Calculator",
    shortDesc:
      "Calculate savings from refinancing your development loan onto cheaper exit finance during the sales period.",
    icon: "LogOut",
    category: "bridging",
    categoryLabel: "Bridging & Short-Term",
    order: 4,
    metaTitle:
      "Development Exit Finance Calculator | Save on Interest | Construction Capital",
    metaDescription:
      "Free development exit calculator. Compare the cost of staying on your development loan vs refinancing onto exit finance. Calculate monthly savings, total interest reduction and net proceeds.",
    h1: "Development Exit Calculator",
    heroSubtitle:
      "See how much you could save by switching to exit finance. Enter your current loan details and remaining sales to compare costs and calculate your net proceeds.",
    faqs: [
      {
        question: "What is development exit finance?",
        answer:
          "Development exit finance replaces your development loan once the build is complete and units are being sold. It offers lower rates (typically 0.45–0.65% per month vs 0.65–0.85% for development finance) because the construction risk has been eliminated.",
      },
      {
        question: "When should I switch to exit finance?",
        answer:
          "Switch when your development is practically complete (or has received practical completion certification) and you're in the sales period. Most developers switch when they have 6–12 months of sales remaining - the interest savings can be substantial.",
      },
      {
        question: "How much can I save with exit finance?",
        answer:
          "Typical savings are 0.2–0.4% per month on the outstanding balance. On a £2M loan over 6 months, that's £24,000–£48,000 in interest savings - often enough to cover the arrangement fee of the new facility.",
      },
      {
        question: "What LTV is available on exit finance?",
        answer:
          "Exit lenders typically offer 70–75% LTV against the current market value (which should be higher than the original development cost). Some lenders will go to 80% with a strong sales history and pre-sales in place.",
      },
      {
        question: "Are there any downsides to switching?",
        answer:
          "You'll pay arrangement fees on the new facility (typically 1–2%) and additional legal costs. If your sales period is very short (under 3 months), the fees may outweigh the interest savings. Check your development loan for early repayment charges.",
      },
    ],
    relatedCalculators: [
      "development-finance",
      "bridging-loans",
      "blended-finance-cost",
    ],
    dealRoomLoanType: "Development Exit Finance",
    usesLocationData: true,
  },
  {
    slug: "chain-break",
    name: "Chain Break Calculator",
    shortDesc:
      "Calculate the total cost of using bridging finance to break a property chain and secure your purchase.",
    icon: "Unlink",
    category: "bridging",
    categoryLabel: "Bridging & Short-Term",
    order: 5,
    metaTitle:
      "Chain Break Calculator | Bridging Loan Costs for Chain Breaks | Construction Capital",
    metaDescription:
      "Free chain break calculator. Calculate the total cost of using a bridging loan to break a property chain, including interest, fees and your net position after both transactions complete.",
    h1: "Chain Break Calculator",
    heroSubtitle:
      "Work out the cost of breaking a chain with a bridging loan. Enter both property details to see total bridging cost, your net position and maximum affordable bridging period.",
    faqs: [
      {
        question: "What is a chain break bridging loan?",
        answer:
          "A chain break bridging loan lets you buy your next property before selling your current one. You borrow against your existing property (or the new purchase) to complete the purchase, then repay the bridge when your property sells. It removes you from the chain.",
      },
      {
        question: "How much does chain break bridging cost?",
        answer:
          "Chain break bridging rates start from 0.45% per month with a 1–2% arrangement fee. On a £300k bridge for 4 months, expect total costs of £8,000–£12,000. Weigh this against the risk of losing your purchase in a chain collapse.",
      },
      {
        question: "What security do I need?",
        answer:
          "The lender takes a first or second charge over your existing property, the new property, or both. Combined LTV across both properties typically can't exceed 70–75%. If your existing property has a mortgage, the bridge sits as a second charge behind it.",
      },
      {
        question: "How long can a chain break bridge last?",
        answer:
          "Typically 3–12 months. The term should cover a realistic sales period for your existing property. If your property hasn't sold within the term, you may need to extend (at higher cost) or reduce the price to force a sale.",
      },
      {
        question: "Is a chain break bridge worth it?",
        answer:
          "It depends on your risk tolerance and the market. In a fast-moving market where you risk losing your dream home, the cost of a bridge (£8–15k typically) may be worth it. In a slow market, ensure you can afford the monthly bridge costs if your property takes longer to sell.",
      },
    ],
    relatedCalculators: [
      "bridging-loans",
      "stamp-duty-sdlt",
      "legal-costs",
    ],
    dealRoomLoanType: "Bridging Loan",
    usesLocationData: true,
  },

  // ════════════════════════════════════════════════
  // E. MEZZANINE & EQUITY
  // ════════════════════════════════════════════════
  {
    slug: "mezzanine-finance",
    name: "Mezzanine Finance Calculator",
    shortDesc:
      "Calculate mezzanine funding, blended cost and remaining equity for your project.",
    icon: "Layers",
    category: "mezzanine",
    categoryLabel: "Mezzanine & Equity",
    order: 1,
    metaTitle:
      "Mezzanine Finance Calculator | Blended Cost & Equity | Construction Capital",
    metaDescription:
      "Free mezzanine finance calculator. Enter project cost, senior debt and GDV to calculate mezzanine amount, blended interest cost, equity required and developer profit.",
    h1: "Mezzanine Finance Calculator",
    heroSubtitle:
      "See how mezzanine finance reduces your equity requirement. Enter your deal numbers to calculate the mezzanine layer, blended cost and profit.",
    faqs: [
      {
        question: "What is mezzanine finance?",
        answer:
          "Mezzanine finance sits between senior debt and equity in the capital stack. It fills the gap between what a senior lender will provide (typically 60–70% LTGDV) and the total project cost, reducing the equity a developer needs to inject.",
      },
      {
        question: "How much does mezzanine finance cost?",
        answer:
          "Mezzanine rates typically start from 12% per annum, reflecting the higher risk position behind senior debt. Some lenders charge up to 18–20% depending on the deal. Interest is usually rolled up and repaid at project completion.",
      },
      {
        question: "How is blended cost calculated?",
        answer:
          "Blended cost is the weighted average interest rate across your senior debt and mezzanine facility. For example, if you borrow £700k at 7% senior and £200k at 15% mezzanine, the blended rate is ((700×7)+(200×15)) ÷ 900 = 8.78%.",
      },
      {
        question:
          "What is the difference between mezzanine finance and equity?",
        answer:
          "Mezzanine is debt - it charges interest and must be repaid, but the lender has no ownership stake. Equity investors take a share of the profit (typically 40–60%) in exchange for their capital. Mezzanine is cheaper when the project performs well.",
      },
      {
        question: "Can I use mezzanine and senior debt together?",
        answer:
          "Yes, that is the standard structure. Senior debt covers 60–70% LTGDV, mezzanine stretches to 85–90%, and the developer contributes the remaining equity. Both lenders need to agree to an inter-creditor arrangement.",
      },
    ],
    relatedCalculators: [
      "equity-required",
      "blended-finance-cost",
      "development-finance",
    ],
    dealRoomLoanType: "Mezzanine Finance",
    usesLocationData: false,
  },
  {
    slug: "equity-required",
    name: "Equity Required Calculator",
    shortDesc:
      "Calculate the minimum equity needed for your project based on senior debt, mezzanine and GDV.",
    icon: "Wallet",
    category: "mezzanine",
    categoryLabel: "Mezzanine & Equity",
    order: 2,
    metaTitle:
      "Equity Required Calculator | How Much Equity Do I Need? | Construction Capital",
    metaDescription:
      "Free equity calculator for property developers. Enter project cost, GDV and debt terms to calculate minimum equity required with and without mezzanine finance.",
    h1: "Equity Required Calculator",
    heroSubtitle:
      "Find out how much equity you need to put into your deal. Enter your project cost, GDV and borrowing terms to see equity requirements with and without mezzanine.",
    faqs: [
      {
        question: "How much equity do I need for a development?",
        answer:
          "With senior debt only (65% LTGDV), you'll need 35% of GDV as equity - often 50–60% of total project cost. Adding mezzanine to 85–90% LTGDV reduces equity to 10–15% of GDV. The exact amount depends on the relationship between total cost and GDV.",
      },
      {
        question: "Can I develop with no equity?",
        answer:
          "In rare cases, yes - using 100% joint venture funding, profit-share arrangements, or cross-charging against other assets. However, most lenders require at least 5–10% cash equity to demonstrate the developer has 'skin in the game'.",
      },
      {
        question: "What counts as equity?",
        answer:
          "Cash deposits, owned land (contributed at market value), retained profits from previous projects, and third-party investor capital all count as equity. Some lenders accept deferred land payments as pseudo-equity. Borrowed funds do not count.",
      },
      {
        question: "Is it better to use less equity or more?",
        answer:
          "Less equity maximises return on invested capital but increases finance costs and risk. More equity reduces finance costs and may secure better rates. The optimal balance depends on your available capital, the number of deals you want to run simultaneously, and risk appetite.",
      },
      {
        question: "How does equity affect my profit margin?",
        answer:
          "Higher leverage (more debt, less equity) increases total finance costs, reducing gross profit. However, it increases profit on equity invested. This calculator shows both metrics so you can find the optimal balance for your project.",
      },
    ],
    relatedCalculators: [
      "mezzanine-finance",
      "development-finance",
      "profit-share-jv",
    ],
    dealRoomLoanType: "Development Finance",
    usesLocationData: true,
  },
  {
    slug: "profit-share-jv",
    name: "JV / Profit Share Calculator",
    shortDesc:
      "Model profit split, return on equity and comparison with debt finance for joint venture structures.",
    icon: "Handshake",
    category: "mezzanine",
    categoryLabel: "Mezzanine & Equity",
    order: 3,
    metaTitle:
      "JV Profit Share Calculator | Joint Venture Returns | Construction Capital",
    metaDescription:
      "Free JV and profit share calculator. Model developer and investor returns for joint venture property developments. Compare JV structures against mezzanine finance alternatives.",
    h1: "JV / Profit Share Calculator",
    heroSubtitle:
      "Model a joint venture structure for your development. Enter the capital contributions and profit share to compare developer and investor returns.",
    faqs: [
      {
        question: "How do property joint ventures work?",
        answer:
          "In a JV, one party (typically the developer) provides expertise and management, while the other provides capital. Profits are split according to an agreed ratio. The developer often receives a management fee plus a share of profits; the investor receives a preferred return plus a profit share.",
      },
      {
        question: "What is a typical JV profit split?",
        answer:
          "Common structures: 50/50 split after the investor receives a preferred return (8–12%); 60/40 in favour of the investor for larger capital contributions; or 70/30 in favour of the developer if they contribute significant equity. Every deal is negotiable.",
      },
      {
        question: "Is a JV better than mezzanine finance?",
        answer:
          "JVs share risk - if the project underperforms, the JV partner absorbs losses alongside you. Mezzanine charges interest regardless of profit. JVs are better for higher-risk projects; mezzanine is cheaper when the project performs well. This calculator compares both.",
      },
      {
        question: "What legal structure should a JV use?",
        answer:
          "Most property JVs use a Special Purpose Vehicle (SPV) limited company, with a shareholders' agreement defining roles, responsibilities, profit distribution and exit triggers. Some use LLPs. Always take legal advice - JV disputes are common and expensive.",
      },
      {
        question: "How do I find JV partners?",
        answer:
          "JV partners include: high-net-worth individuals, family offices, property investment clubs, equity funds and other developers. We can introduce you to equity partners through our network - submit your deal in the Deal Room.",
      },
    ],
    relatedCalculators: [
      "equity-required",
      "mezzanine-finance",
      "development-profit",
    ],
    dealRoomLoanType: "Equity & Joint Venture",
    usesLocationData: false,
  },
  {
    slug: "blended-finance-cost",
    name: "Blended Finance Cost Calculator",
    shortDesc:
      "Calculate the weighted average cost of capital across senior debt, mezzanine and equity tranches.",
    icon: "Calculator",
    category: "mezzanine",
    categoryLabel: "Mezzanine & Equity",
    order: 4,
    metaTitle:
      "Blended Finance Cost Calculator | WACC for Property | Construction Capital",
    metaDescription:
      "Free blended finance cost calculator. Enter your senior debt, mezzanine and equity amounts with rates to calculate weighted average cost of capital (WACC) and total finance cost.",
    h1: "Blended Finance Cost Calculator",
    heroSubtitle:
      "Understand the true cost of your capital stack. Enter each funding tranche and its cost to see the blended rate, total finance cost and per-tranche breakdown.",
    faqs: [
      {
        question: "What is blended cost of finance?",
        answer:
          "Blended cost is the weighted average interest rate across all your funding sources. It accounts for the different amounts and rates of senior debt, mezzanine and equity. A lower blended cost means more profit - it's the key metric for comparing capital structures.",
      },
      {
        question: "How do you calculate WACC for property development?",
        answer:
          "WACC = (senior debt × senior rate + mezzanine × mezz rate + equity × equity target return) ÷ total capital. For example: £1M at 7% + £300k at 15% + £200k at 20% = (70k + 45k + 40k) ÷ £1.5M = 10.3% blended rate.",
      },
      {
        question: "Should I include equity cost in the blended rate?",
        answer:
          "Including equity's target return gives the true cost of capital. However, many developers calculate the blended cost of debt only (excluding equity) to assess the direct finance cost. This calculator shows both metrics.",
      },
      {
        question: "What is a typical blended rate for a development?",
        answer:
          "A senior-only deal might have a blended rate of 6.5–8%. Adding mezzanine typically pushes this to 8–11%. Including equity's target return (15–25%) can push the overall WACC to 12–16%. The key is that total finance costs remain within your profit margin.",
      },
      {
        question: "How do arrangement fees affect the blended cost?",
        answer:
          "Arrangement fees are a one-off cost but should be annualised and added to the effective rate for comparison. A 2% fee on a 12-month loan adds 2% to the effective rate. On a 6-month loan, it adds 4%. This calculator includes fees in the total cost.",
      },
    ],
    relatedCalculators: [
      "mezzanine-finance",
      "equity-required",
      "development-finance",
    ],
    dealRoomLoanType: "Development Finance",
    usesLocationData: false,
  },

  // ════════════════════════════════════════════════
  // F. COSTS & FEES
  // ════════════════════════════════════════════════
  {
    slug: "stamp-duty-sdlt",
    name: "SDLT Calculator",
    shortDesc:
      "Calculate Stamp Duty Land Tax for residential, commercial and additional property purchases.",
    icon: "Receipt",
    category: "costs",
    categoryLabel: "Costs & Fees",
    order: 1,
    metaTitle:
      "Stamp Duty Calculator 2026 | SDLT Rates & Bands | Construction Capital",
    metaDescription:
      "Free UK stamp duty calculator for 2026. Calculate SDLT for first-time buyers, home movers, additional properties and companies. See band breakdown, effective rate and surcharges.",
    h1: "Stamp Duty (SDLT) Calculator",
    heroSubtitle:
      "Calculate your stamp duty bill in seconds. Enter the purchase price and buyer type to see the SDLT payable, effective rate and band-by-band breakdown.",
    faqs: [
      {
        question: "What are the current SDLT rates for 2026?",
        answer:
          "Standard residential rates: 0% up to £125,000, 2% on £125,001–£250,000, 5% on £250,001–£925,000, 10% on £925,001–£1,500,000, and 12% above £1,500,000. First-time buyers pay 0% up to £300,000 and 5% on £300,001–£500,000.",
      },
      {
        question: "What is the additional property surcharge?",
        answer:
          "If you own another property (including buy-to-let or overseas property), you pay a 5% surcharge on top of standard rates on the entire purchase price. This applies from the first £1 and significantly increases the stamp duty bill for portfolio investors.",
      },
      {
        question: "Do companies pay more stamp duty?",
        answer:
          "Companies purchasing residential property over £500,000 pay the 5% additional property surcharge. Properties over £500,000 attract an additional 2% corporate surcharge (total 17% on the portion above £1.5M). Non-UK residents pay an extra 2% on top.",
      },
      {
        question: "Is SDLT different in Wales and Scotland?",
        answer:
          "Yes. Wales has Land Transaction Tax (LTT) with different rates and bands. Scotland has Land and Buildings Transaction Tax (LBTT). This calculator covers England and Northern Ireland (SDLT) and includes a Welsh LTT option.",
      },
      {
        question: "Can I reclaim the additional property surcharge?",
        answer:
          "If you sell your previous main residence within 36 months of buying the new one, you can apply for a refund of the additional dwelling supplement. The refund must be claimed within 12 months of the sale or 12 months of the filing date, whichever is later.",
      },
    ],
    relatedCalculators: [
      "legal-costs",
      "buy-to-let-mortgage",
      "bridging-loans",
    ],
    dealRoomLoanType: "Bridging Loan",
    usesLocationData: true,
  },
  {
    slug: "arrangement-fees",
    name: "Arrangement Fee Calculator",
    shortDesc:
      "Calculate the true cost of arrangement fees when added to the loan, deducted from advance or paid upfront.",
    icon: "FileText",
    category: "costs",
    categoryLabel: "Costs & Fees",
    order: 2,
    metaTitle:
      "Arrangement Fee Calculator | True Cost of Loan Fees | Construction Capital",
    metaDescription:
      "Free arrangement fee calculator. Compare the cost of arrangement fees added to the loan vs deducted from the advance vs paid separately. See the effective additional interest cost.",
    h1: "Arrangement Fee Calculator",
    heroSubtitle:
      "Understand the real cost of your arrangement fee. Choose how it's structured to see the impact on your net advance, total interest and effective borrowing cost.",
    faqs: [
      {
        question: "What is an arrangement fee?",
        answer:
          "An arrangement fee (or facility fee) is the lender's charge for setting up the loan, typically 1–2% of the loan amount. It covers underwriting, legal review and administration. Some lenders also charge valuation fees, monitoring fees and exit fees separately.",
      },
      {
        question: "Should I add the fee to the loan or pay it upfront?",
        answer:
          "Adding to the loan preserves your cash but increases the amount you pay interest on, raising the total cost. Paying upfront costs less overall but requires more cash on day one. Deducting from the advance reduces your net day-1 funds. This calculator compares all three.",
      },
      {
        question: "What is a typical arrangement fee?",
        answer:
          "Development finance: 1.5–2% of the facility. Bridging loans: 1–2% of the loan. Mezzanine: 2–3% of the mezzanine tranche. Commercial mortgages: 0.5–1.5% of the loan. Some lenders offer lower rates with higher arrangement fees, or vice versa.",
      },
      {
        question: "Are arrangement fees negotiable?",
        answer:
          "Often yes, especially on larger facilities (£2M+), repeat business, or when using a broker. A good broker can negotiate fee reductions of 0.25–0.5% which on a £3M loan saves £7,500–£15,000. Always compare the blended cost including fees.",
      },
      {
        question: "Do I pay VAT on arrangement fees?",
        answer:
          "Financial intermediary services are generally VAT exempt. However, some fees (valuation, monitoring, legal) may attract VAT at 20%. Check with your lender - the VAT treatment can vary depending on how the fee is structured.",
      },
    ],
    relatedCalculators: [
      "bridging-loans",
      "development-finance",
      "blended-finance-cost",
    ],
    dealRoomLoanType: "Development Finance",
    usesLocationData: false,
  },
  {
    slug: "legal-costs",
    name: "Legal Costs Estimator",
    shortDesc:
      "Estimate solicitor fees, disbursements and total legal costs for property transactions and developments.",
    icon: "Scale",
    category: "costs",
    categoryLabel: "Costs & Fees",
    order: 3,
    metaTitle:
      "Legal Costs Estimator | Solicitor Fees for Property | Construction Capital",
    metaDescription:
      "Free legal costs estimator for property transactions. Estimate solicitor fees, Land Registry charges, searches and total disbursements for purchases, sales, remortgages and developments.",
    h1: "Legal Costs Estimator",
    heroSubtitle:
      "Budget for your legal costs before committing to a transaction. Select the transaction type and property details to see estimated solicitor fees and disbursements.",
    faqs: [
      {
        question: "How much do solicitors charge for property transactions?",
        answer:
          "Standard residential conveyancing: £800–£1,500 + VAT for purchases/sales under £500k. Complex transactions (leaseholds, new-builds, developments): £1,500–£5,000 + VAT. Development finance legal work: £3,000–£10,000+ depending on deal size and complexity.",
      },
      {
        question: "What are disbursements?",
        answer:
          "Disbursements are third-party costs your solicitor pays on your behalf: local authority searches (£200–£400), Land Registry fees (£100–£500), environmental searches (£40–£100), bankruptcy searches (£2 per name), and bank transfer fees (£25–£50 per transfer).",
      },
      {
        question: "Do I need separate solicitors for purchase and finance?",
        answer:
          "Usually yes. The lender appoints their own solicitor to act on their behalf. On development finance, you'll pay for both your solicitor and the lender's solicitor. Some bridging lenders allow dual representation (one solicitor acting for both) to save costs.",
      },
      {
        question: "How long does conveyancing take?",
        answer:
          "Standard residential purchase: 8–12 weeks. Cash purchase: 2–4 weeks. Bridging/auction purchase: 1–3 weeks with an experienced solicitor. Development finance legal: 2–4 weeks for straightforward deals, 4–8 weeks for complex structures.",
      },
      {
        question: "Can I negotiate legal fees?",
        answer:
          "Yes. Get quotes from 3–4 solicitors, including online conveyancers for straightforward transactions. For development work, negotiate a fixed fee rather than hourly rates. Volume discounts are available if you do multiple transactions per year.",
      },
    ],
    relatedCalculators: [
      "stamp-duty-sdlt",
      "professional-fees",
      "arrangement-fees",
    ],
    dealRoomLoanType: "Development Finance",
    usesLocationData: true,
  },
  {
    slug: "vat-construction",
    name: "VAT on Construction Calculator",
    shortDesc:
      "Calculate VAT liability for new-builds, conversions and refurbishments including zero and reduced rates.",
    icon: "BadgePercent",
    category: "costs",
    categoryLabel: "Costs & Fees",
    order: 4,
    metaTitle:
      "VAT on Construction Calculator | Zero Rate & Reduced Rate | Construction Capital",
    metaDescription:
      "Free VAT calculator for construction projects. Calculate VAT liability for new-builds (zero-rated), conversions (5% reduced rate) and refurbishments (20% standard rate).",
    h1: "VAT on Construction Calculator",
    heroSubtitle:
      "Understand your VAT position on construction work. Select the build type to see which elements are zero-rated, reduced-rate and standard-rate, and calculate your net VAT liability.",
    faqs: [
      {
        question: "Is VAT charged on new-build construction?",
        answer:
          "New-build residential construction is zero-rated for VAT purposes. This means the contractor charges 0% VAT on labour and most materials. However, professional fees (architects, engineers) are standard-rated at 20%, and some materials installed by the developer (not the builder) are also standard-rated.",
      },
      {
        question: "What is the reduced rate for conversions?",
        answer:
          "Conversions of non-residential buildings to residential use qualify for a 5% reduced VAT rate on labour and materials. This also applies to: changing the number of dwellings, renovating properties empty for 2+ years, and converting single dwellings to multiple dwellings.",
      },
      {
        question: "Can I reclaim VAT on a new-build?",
        answer:
          "If you're VAT-registered (or registering voluntarily), you can reclaim input VAT on zero-rated new-build supplies. Self-builders who aren't VAT-registered can reclaim VAT on materials under the DIY Housebuilders' Scheme (HMRC VAT 431NB/431C).",
      },
      {
        question: "Is refurbishment work zero-rated?",
        answer:
          "No. Refurbishment of existing dwellings is standard-rated at 20%. The only exception is properties that have been empty for 2+ years, which qualify for the 5% reduced rate. This is a significant cost difference - a £500k refurb costs £100k in VAT at 20% vs £25k at 5%.",
      },
      {
        question: "What is the CIS scheme and does it affect VAT?",
        answer:
          "The Construction Industry Scheme (CIS) is a tax deduction system (20% of labour) separate from VAT. CIS applies to subcontractor payments and is offset against the subcontractor's tax liability. From March 2021, the domestic reverse charge requires the customer to account for VAT on construction services.",
      },
    ],
    relatedCalculators: [
      "build-cost-estimator",
      "development-appraisal",
      "professional-fees",
    ],
    dealRoomLoanType: "Development Finance",
    usesLocationData: false,
  },
  {
    slug: "professional-fees",
    name: "Professional Fees Calculator",
    shortDesc:
      "Estimate the cost of architects, engineers, QS, planning consultants and other project professionals.",
    icon: "Briefcase",
    category: "costs",
    categoryLabel: "Costs & Fees",
    order: 5,
    metaTitle:
      "Professional Fees Calculator | Architect, QS & Engineer Costs | Construction Capital",
    metaDescription:
      "Free professional fees calculator for property development. Estimate costs for architects, structural engineers, quantity surveyors, planning consultants and other professionals.",
    h1: "Professional Fees Calculator",
    heroSubtitle:
      "Budget for your professional team. Toggle the consultants you need to see estimated fees based on your project type and value.",
    faqs: [
      {
        question: "How much does an architect cost for a development?",
        answer:
          "Architects typically charge 5–12% of build cost for a full service (from concept to completion). For larger developments, expect 5–7%. Smaller or complex projects: 8–12%. RIBA stages can be split - many developers only use an architect to Stage 3 (planning) then switch to a building designer.",
      },
      {
        question: "Do I need a Quantity Surveyor?",
        answer:
          "Yes, for any development seeking finance. Lenders require a QS cost plan and will appoint a QS to certify interim valuations (which trigger loan drawdowns). QS fees are typically 1–2.5% of build cost. A QS also helps identify cost savings and manage variations.",
      },
      {
        question: "What does a planning consultant do?",
        answer:
          "A planning consultant prepares and manages your planning application, negotiates with the local authority, and presents your case at committee or appeal. Fees range from £3,000–£5,000 for simple applications to £15,000–£50,000+ for major developments or appeals.",
      },
      {
        question: "What other professionals might I need?",
        answer:
          "Depending on the project: structural engineer (£2k–£8k), M&E consultant (1–3% of build cost), project manager (2–5% of build cost), CDM coordinator (£2k–£5k), ecology surveyor (£1k–£5k), arboriculturist (£500–£2k), heritage consultant (£2k–£10k), and building control (£1k–£3k).",
      },
      {
        question: "Can I reduce professional fees?",
        answer:
          "Yes. Negotiate fixed fees rather than percentage-based. Use a project manager to coordinate (reduces architect's scope). Appoint professionals early - changes mid-project are expensive. Get 3 quotes and check references. For repeat projects, negotiate portfolio discounts.",
      },
    ],
    relatedCalculators: [
      "build-cost-estimator",
      "development-appraisal",
      "vat-construction",
    ],
    dealRoomLoanType: "Development Finance",
    usesLocationData: false,
  },

  // ════════════════════════════════════════════════
  // G. VALUATION & MARKET
  // ════════════════════════════════════════════════
  {
    slug: "gdv-calculator",
    name: "GDV Calculator",
    shortDesc:
      "Calculate Gross Development Value using local Land Registry data with unit mix and sensitivity analysis.",
    icon: "BarChart3",
    category: "valuation",
    categoryLabel: "Valuation & Market",
    order: 1,
    metaTitle:
      "GDV Calculator | Gross Development Value with Market Data | Construction Capital",
    metaDescription:
      "Free GDV calculator with Land Registry integration. Enter your unit mix and location to auto-populate values from local sales data. Includes sensitivity analysis at ±5% and ±10%.",
    h1: "GDV Calculator",
    heroSubtitle:
      "Calculate your Gross Development Value using real market data. Select a location to auto-populate from local Land Registry sales, or enter your own values.",
    faqs: [
      {
        question: "What is Gross Development Value (GDV)?",
        answer:
          "GDV is the total sales revenue from a completed development - the sum of all unit sale prices. It's the top line of any development appraisal and determines how much a lender will advance (typically 60–70% of GDV as senior debt).",
      },
      {
        question: "How do I estimate GDV for my development?",
        answer:
          "Use comparable local sales of similar property types and sizes. This calculator uses Land Registry data to show median prices by property type (detached, semi, terraced, flat) in your area. Adjust for new-build premium (typically 10–20% above existing stock).",
      },
      {
        question: "What is the new-build premium?",
        answer:
          "New-build homes typically sell at a 10–25% premium over comparable second-hand properties. The premium varies by location, developer brand and market conditions. In strong markets, the premium is higher; in weaker markets, it can disappear entirely.",
      },
      {
        question: "Should I use asking prices or sold prices for GDV?",
        answer:
          "Always use actual sold prices (from Land Registry data), not asking prices. Asking prices can be 5–15% higher than achieved prices. Lenders and valuers will only accept evidence based on comparable sales, not listings.",
      },
      {
        question: "How does GDV affect my finance?",
        answer:
          "GDV determines your maximum loan. At 65% LTGDV, a £3M GDV supports £1.95M senior debt. A lower GDV means less borrowing and more equity needed. Lenders stress-test GDV at -5% to -10% to ensure the deal still works in a downturn.",
      },
    ],
    relatedCalculators: [
      "residual-land-value",
      "development-appraisal",
      "development-finance",
    ],
    dealRoomLoanType: "Development Finance",
    usesLocationData: true,
  },
  {
    slug: "residual-land-value",
    name: "Residual Land Value Calculator",
    shortDesc:
      "Calculate the maximum you should pay for a development site using the residual valuation method.",
    icon: "MapPin",
    category: "valuation",
    categoryLabel: "Valuation & Market",
    order: 2,
    metaTitle:
      "Residual Land Value Calculator | Maximum Land Bid Price | Construction Capital",
    metaDescription:
      "Free residual land value calculator. Enter GDV, build costs and target profit to calculate the maximum price you should pay for a development site using the residual method.",
    h1: "Residual Land Value Calculator",
    heroSubtitle:
      "Calculate the maximum you should pay for land. Enter your GDV, costs and target profit to see the residual land value - the most you can bid and still make your required return.",
    faqs: [
      {
        question: "What is residual land value?",
        answer:
          "Residual land value is the maximum price a developer can pay for a site and still achieve their target profit. It's calculated by deducting all development costs (construction, fees, finance, profit) from the GDV. The 'residual' is what's left for land.",
      },
      {
        question: "How is residual land value calculated?",
        answer:
          "Residual Land Value = GDV - Build Costs - Professional Fees - Contingency - S106/CIL - Finance Costs - Selling Costs - Target Profit. This calculator performs all these deductions and shows the maximum land bid price.",
      },
      {
        question: "What target profit margin should I use?",
        answer:
          "Standard targets: 15–20% profit on GDV (or 20–25% profit on cost) for residential. Lower margins (10–15% on GDV) may be acceptable for lower-risk schemes (PD conversions, pre-sold units). Higher margins (20–25% on GDV) for complex or higher-risk projects.",
      },
      {
        question: "Why do developers use the residual method?",
        answer:
          "The residual method is the industry standard because it works backwards from the end value (GDV) to determine land value. This prevents developers from overpaying for sites. Surveyors, lenders and HMRC all use residual valuations for land pricing.",
      },
      {
        question: "How does land value per acre vary in the UK?",
        answer:
          "Residential development land ranges from £250,000/acre in parts of the North to £5M+/acre in prime London and the South East. Greenfield land without planning is worth far less (agricultural value: £8,000–£12,000/acre). Planning consent typically adds 80–95% of the uplift.",
      },
    ],
    relatedCalculators: [
      "gdv-calculator",
      "development-appraisal",
      "section-106-cil",
    ],
    dealRoomLoanType: "Development Finance",
    usesLocationData: true,
  },
];

export function getCalculatorBySlug(slug: string): CalculatorMeta | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}

export function getCalculatorsByCategory(
  category: CalculatorCategory
): CalculatorMeta[] {
  return CALCULATORS.filter((c) => c.category === category).sort(
    (a, b) => a.order - b.order
  );
}
