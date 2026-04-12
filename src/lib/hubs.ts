/**
 * Topical Hub Page Definitions
 *
 * Each hub aggregates related guides, calculators, and services into a single
 * pillar page, creating dense internal link clusters for topical authority.
 */

export interface Hub {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[];
  /** Guide categories to include (matches guide.category) */
  guideCategories: string[];
  /** Specific guide slugs to include (in addition to category matches) */
  guideSlugs: string[];
  /** Calculator slugs to include */
  calculatorSlugs: string[];
  /** Service slugs to feature */
  serviceSlugs: string[];
  /** Comparison page slugs to link */
  comparisonSlugs: string[];
  /** SITE_IMAGES key for hero background */
  heroImageKey: string;
}

export const HUBS: Hub[] = [
  {
    slug: "development-finance-guide",
    title: "The Complete Guide to Development Finance",
    metaTitle:
      "Development Finance Guide 2026 | Everything You Need to Know | Construction Capital",
    metaDescription:
      "Your comprehensive guide to development finance in the UK. Compare rates, learn how drawdowns work, understand valuations, and explore calculators to model your next project.",
    intro: [
      "Development finance is the backbone of UK property development, providing the senior debt funding that turns planning permissions into completed homes and commercial buildings. Whether you are a first-time developer purchasing your first site or an experienced operator scaling a multi-site portfolio, understanding how development finance works is essential to structuring profitable deals.",
      "This hub brings together our complete library of development finance content — from beginner guides explaining how facilities are structured, through to advanced content on capital stacks, monitoring processes, and exit strategies. Use the calculators to model your deal, read the guides to deepen your knowledge, and explore the comparison pages to understand how development finance compares to alternative products.",
    ],
    guideCategories: [
      "development-finance",
      "application",
      "structuring",
      "defaults",
    ],
    guideSlugs: [],
    calculatorSlugs: [
      "development-finance",
      "development-profit",
      "build-cost-estimator",
      "development-appraisal",
      "construction-timeline",
      "gdv-calculator",
      "residual-land-value",
    ],
    serviceSlugs: [
      "development-finance",
      "mezzanine-finance",
      "development-exit-finance",
    ],
    comparisonSlugs: [
      "development-finance-vs-bridging-loans",
      "development-finance-vs-commercial-mortgage",
    ],
    heroImageKey: "guide-development-finance",
  },
  {
    slug: "bridging-finance-guide",
    title: "Bridging Finance: Everything You Need to Know",
    metaTitle:
      "Bridging Loans Guide 2026 | Rates, Costs & How to Apply | Construction Capital",
    metaDescription:
      "Complete guide to bridging finance in the UK. Understand rates, fees, application process, and when a bridge is the right choice for your property deal.",
    intro: [
      "Bridging loans are the fastest form of secured property finance, designed for situations where speed and certainty of completion outweigh the cost of borrowing. From auction purchases requiring completion within 28 days to chain breaks that would otherwise collapse a transaction, bridges provide the short-term capital that keeps deals moving.",
      "This hub collects everything you need to know about bridging finance — how rates and fees work, when to use a bridge versus other products, and how to structure a bridge-to-development-finance transition. Use our calculators to model the costs and browse our guides for in-depth analysis of every aspect of bridging.",
    ],
    guideCategories: ["bridging", "comparison"],
    guideSlugs: [],
    calculatorSlugs: [
      "bridging-loans",
      "auction-finance",
      "chain-break",
      "arrangement-fees",
    ],
    serviceSlugs: ["bridging-loans", "refurbishment-finance"],
    comparisonSlugs: ["development-finance-vs-bridging-loans"],
    heroImageKey: "guide-bridging",
  },
  {
    slug: "mezzanine-finance-guide",
    title: "Mezzanine Finance for Property Developers",
    metaTitle:
      "Mezzanine Finance Guide 2026 | Stretch Your Capital Stack | Construction Capital",
    metaDescription:
      "Understand mezzanine finance for property development. How it works, typical rates, when to use mezz vs equity, and how to structure the optimal capital stack.",
    intro: [
      "Mezzanine finance allows property developers to stretch their borrowing beyond the limits of senior debt, reducing the equity contribution required and freeing capital for additional projects. Sitting behind senior debt in the capital stack, mezzanine facilities typically take total leverage to 80-90% of costs or 75-85% of GDV.",
      "This hub covers everything from the fundamentals of how mezzanine works through to advanced structuring topics like intercreditor agreements, profit shares, and blended cost analysis. Whether you are considering mezzanine for the first time or comparing it against an equity joint venture, our guides, calculators, and comparison pages will help you make an informed decision.",
    ],
    guideCategories: ["mezzanine", "structuring"],
    guideSlugs: [],
    calculatorSlugs: [
      "mezzanine-finance",
      "equity-required",
      "profit-share-jv",
      "blended-finance-cost",
    ],
    serviceSlugs: ["mezzanine-finance", "equity-jv", "development-finance"],
    comparisonSlugs: ["mezzanine-finance-vs-equity-jv"],
    heroImageKey: "guide-mezzanine",
  },
  {
    slug: "property-development-costs",
    title: "Property Development Costs Explained",
    metaTitle:
      "Property Development Costs 2026 | Complete Breakdown | Construction Capital",
    metaDescription:
      "Every cost involved in a UK property development project. SDLT, CIL, professional fees, build costs, finance costs and hidden charges explained with calculators.",
    intro: [
      "Understanding the full cost structure of a property development is critical to building a viable appraisal and avoiding the cash flow surprises that derail projects. Beyond the headline figures of land and build costs, developers must budget for stamp duty, legal fees, planning obligations, finance costs, professional fees, and a host of other charges that can collectively add 15-25% to the total project cost.",
      "This hub brings together our complete library of cost-related content — from guides explaining each fee category in detail, through to calculators that model the numbers for your specific project. Use this resource to ensure nothing is missed from your development appraisal.",
    ],
    guideCategories: ["hidden-fees", "valuations"],
    guideSlugs: [],
    calculatorSlugs: [
      "stamp-duty-sdlt",
      "arrangement-fees",
      "legal-costs",
      "vat-construction",
      "professional-fees",
      "section-106-cil",
      "build-cost-estimator",
    ],
    serviceSlugs: ["development-finance", "bridging-loans"],
    comparisonSlugs: ["specialist-broker-vs-direct-to-lender"],
    heroImageKey: "guide-general",
  },
  {
    slug: "first-time-developer",
    title: "First-Time Property Developer Hub",
    metaTitle:
      "First-Time Developer Guide 2026 | How to Start | Construction Capital",
    metaDescription:
      "Everything first-time property developers need to know. From securing finance with no track record to understanding planning, costs, and how to structure your first deal.",
    intro: [
      "Every experienced developer started with their first project. If you are considering your first property development — whether a single house build, a conversion project, or a small residential scheme — this hub brings together all the information you need to take that first step with confidence.",
      "We have structured this content to follow the journey of a first-time developer: understanding what finance is available, how to apply without a track record, what costs to expect, how to navigate planning, and how to structure your deal to maximise profit while managing risk. Our calculators let you model the numbers before you commit, and our guides explain every step in plain English.",
    ],
    guideCategories: ["application"],
    guideSlugs: [
      "first-time-developer-finance",
      "how-does-development-finance-work",
    ],
    calculatorSlugs: [
      "development-finance",
      "development-profit",
      "build-cost-estimator",
      "stamp-duty-sdlt",
      "arrangement-fees",
    ],
    serviceSlugs: [
      "development-finance",
      "bridging-loans",
      "refurbishment-finance",
    ],
    comparisonSlugs: [
      "development-finance-vs-bridging-loans",
      "specialist-broker-vs-direct-to-lender",
    ],
    heroImageKey: "guide-application",
  },
  {
    slug: "permitted-development-guide",
    title: "Permitted Development: Conversions & Change of Use",
    metaTitle:
      "Permitted Development Guide 2026 | Conversions & Change of Use | Construction Capital",
    metaDescription:
      "Guide to permitted development rights in England. Office-to-residential, barn conversions, change of use, Class MA, and how to finance PD schemes.",
    intro: [
      "Permitted development rights allow certain types of building work and changes of use to proceed without full planning permission, significantly reducing planning risk and accelerating project timelines. Since the introduction of Class O (now Class MA) in 2013, PD rights have become one of the most popular routes for property developers, particularly for office-to-residential and commercial-to-residential conversions.",
      "This hub covers everything you need to know about PD schemes — from understanding which rights apply to your project, through to financing, cost modelling, and navigating the prior approval process. Our conversion calculators model the specific economics of different conversion types, and our guides explain the regulatory landscape in detail.",
    ],
    guideCategories: ["legal"],
    guideSlugs: [],
    calculatorSlugs: [
      "permitted-development",
      "office-to-residential",
      "commercial-to-residential",
      "barn-conversion",
      "hmo-conversion",
      "church-conversion",
    ],
    serviceSlugs: [
      "development-finance",
      "bridging-loans",
      "refurbishment-finance",
    ],
    comparisonSlugs: [],
    heroImageKey: "guide-refurbishment",
  },
];

export function getHubBySlug(slug: string): Hub | undefined {
  return HUBS.find((h) => h.slug === slug);
}
