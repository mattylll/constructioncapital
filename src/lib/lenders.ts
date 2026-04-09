export type LenderType =
  | "high-street-bank"
  | "specialist-lender"
  | "challenger-bank"
  | "family-office"
  | "institutional"
  | "bridging-specialist"
  | "development-specialist";

export interface Lender {
  slug: string;
  name: string;
  type: LenderType;
  description: string;
  services: string[];
  minLoan: string;
  maxLoan: string;
  typicalRate: string;
  maxLtv: string;
  strengths: string[];
  turnaround: string;
}

export const LENDER_TYPES: {
  slug: LenderType;
  label: string;
  description: string;
}[] = [
  {
    slug: "high-street-bank",
    label: "High Street Bank",
    description:
      "Major UK retail banks offering competitive rates for lower-risk development schemes with strong covenants.",
  },
  {
    slug: "specialist-lender",
    label: "Specialist Lender",
    description:
      "Dedicated property finance lenders with deep sector expertise and flexible underwriting criteria.",
  },
  {
    slug: "challenger-bank",
    label: "Challenger Bank",
    description:
      "Newer entrants to the banking market offering innovative products and faster decision-making.",
  },
  {
    slug: "family-office",
    label: "Family Office",
    description:
      "Private wealth vehicles providing bespoke lending and equity solutions for experienced developers.",
  },
  {
    slug: "institutional",
    label: "Institutional",
    description:
      "Insurance companies, pension funds, and asset managers deploying capital into development finance.",
  },
  {
    slug: "bridging-specialist",
    label: "Bridging Specialist",
    description:
      "Lenders focused on short-term bridging finance with rapid completion timelines and flexible security.",
  },
  {
    slug: "development-specialist",
    label: "Development Specialist",
    description:
      "Lenders exclusively focused on ground-up development finance with deep construction lending expertise.",
  },
];

export const LENDERS: Lender[] = [
  // High Street Banks
  {
    slug: "meridian-bank",
    name: "Meridian Bank",
    type: "high-street-bank",
    description:
      "One of the UK's leading high street lenders with a dedicated property development division. Known for competitive pricing on straightforward residential schemes in established locations.",
    services: [
      "development-finance",
      "commercial-mortgages",
      "development-exit-finance",
    ],
    minLoan: "£1M",
    maxLoan: "£75M",
    typicalRate: "From 5.5% p.a.",
    maxLtv: "65% LTGDV",
    strengths: [
      "Lowest rates for experienced developers with strong track records",
      "Dedicated relationship managers across all UK regions",
      "Flexible drawdown schedules aligned to build programmes",
    ],
    turnaround: "4-6 weeks",
  },
  {
    slug: "crown-commercial-bank",
    name: "Crown Commercial Bank",
    type: "high-street-bank",
    description:
      "A major clearing bank with a well-resourced real estate finance team. Strong appetite for mixed-use schemes and urban regeneration projects backed by planning consent.",
    services: [
      "development-finance",
      "commercial-mortgages",
      "refurbishment-finance",
    ],
    minLoan: "£2M",
    maxLoan: "£100M",
    typicalRate: "From 5.8% p.a.",
    maxLtv: "60% LTGDV",
    strengths: [
      "Deep expertise in mixed-use and regeneration schemes",
      "Ability to provide follow-on commercial mortgage at completion",
      "Strong appetite for urban brownfield sites",
    ],
    turnaround: "4-8 weeks",
  },
  {
    slug: "albion-national",
    name: "Albion National",
    type: "high-street-bank",
    description:
      "A trusted high street name with appetite for both residential and commercial development lending. Offers preferential terms for repeat borrowers and portfolio developers.",
    services: [
      "development-finance",
      "commercial-mortgages",
      "development-exit-finance",
      "bridging-loans",
    ],
    minLoan: "£500K",
    maxLoan: "£50M",
    typicalRate: "From 5.9% p.a.",
    maxLtv: "65% LTGDV",
    strengths: [
      "Preferential pricing for repeat borrowers",
      "Will consider pre-planning sites for experienced developers",
      "Portfolio facility options for multi-site developers",
    ],
    turnaround: "3-6 weeks",
  },

  // Specialist Lenders
  {
    slug: "oakbridge-capital",
    name: "Oakbridge Capital",
    type: "specialist-lender",
    description:
      "A leading specialist property lender with over 15 years in the development finance market. Combines institutional-grade processes with entrepreneurial flexibility on complex structures.",
    services: [
      "development-finance",
      "mezzanine-finance",
      "bridging-loans",
      "refurbishment-finance",
      "development-exit-finance",
    ],
    minLoan: "£500K",
    maxLoan: "£30M",
    typicalRate: "From 7.0% p.a.",
    maxLtv: "70% LTGDV",
    strengths: [
      "Flexible on complex sites including permitted development conversions",
      "In-house legal team speeds up documentation",
      "Will stretch LTV for proven developers with strong pre-sales",
    ],
    turnaround: "2-4 weeks",
  },
  {
    slug: "castlegate-finance",
    name: "Castlegate Finance",
    type: "specialist-lender",
    description:
      "Specialist in funding residential development projects across England and Wales. Particularly active in the mid-market space with schemes of 5-50 units.",
    services: [
      "development-finance",
      "refurbishment-finance",
      "development-exit-finance",
    ],
    minLoan: "£250K",
    maxLoan: "£20M",
    typicalRate: "From 7.5% p.a.",
    maxLtv: "70% LTGDV",
    strengths: [
      "Strong appetite for first-time developers with relevant experience",
      "Flexible on phased drawdowns and cost overrun facilities",
      "Regional offices providing local market knowledge",
    ],
    turnaround: "2-3 weeks",
  },
  {
    slug: "thornfield-lending",
    name: "Thornfield Lending",
    type: "specialist-lender",
    description:
      "A specialist lender focused exclusively on property development and refurbishment. Known for creative structuring and willingness to look beyond standard underwriting criteria.",
    services: [
      "development-finance",
      "mezzanine-finance",
      "refurbishment-finance",
      "bridging-loans",
    ],
    minLoan: "£300K",
    maxLoan: "£25M",
    typicalRate: "From 7.2% p.a.",
    maxLtv: "75% LTGDV",
    strengths: [
      "Considers non-standard construction methods and modular builds",
      "Experienced with Section 106 and affordable housing obligations",
      "Quick credit decisions with delegated authority at senior level",
    ],
    turnaround: "2-3 weeks",
  },
  {
    slug: "pennine-property-finance",
    name: "Pennine Property Finance",
    type: "specialist-lender",
    description:
      "Northern-headquartered specialist with strong relationships across the Midlands and North. Excellent track record funding schemes in secondary locations where high street banks hesitate.",
    services: [
      "development-finance",
      "refurbishment-finance",
      "commercial-mortgages",
      "development-exit-finance",
    ],
    minLoan: "£200K",
    maxLoan: "£15M",
    typicalRate: "From 7.8% p.a.",
    maxLtv: "70% LTGDV",
    strengths: [
      "Deep knowledge of Northern and Midlands property markets",
      "Will fund schemes in locations other lenders avoid",
      "Pragmatic approach to developer experience requirements",
    ],
    turnaround: "2-4 weeks",
  },

  // Challenger Banks
  {
    slug: "nexus-bank",
    name: "Nexus Bank",
    type: "challenger-bank",
    description:
      "A fast-growing challenger bank with a technology-driven approach to development lending. Streamlined application processes and rapid credit decisions set them apart from traditional lenders.",
    services: [
      "development-finance",
      "bridging-loans",
      "refurbishment-finance",
      "development-exit-finance",
    ],
    minLoan: "£500K",
    maxLoan: "£40M",
    typicalRate: "From 6.5% p.a.",
    maxLtv: "70% LTGDV",
    strengths: [
      "Digital-first platform with real-time drawdown tracking",
      "Competitive rates rivalling high street banks",
      "Fast credit committee turnaround with weekly sittings",
    ],
    turnaround: "2-4 weeks",
  },
  {
    slug: "hartland-bank",
    name: "Hartland Bank",
    type: "challenger-bank",
    description:
      "A challenger bank specialising in SME property lending. Strong appetite for experienced developers seeking to scale their portfolios with a supportive banking partner.",
    services: [
      "development-finance",
      "commercial-mortgages",
      "bridging-loans",
      "development-exit-finance",
    ],
    minLoan: "£750K",
    maxLoan: "£35M",
    typicalRate: "From 6.8% p.a.",
    maxLtv: "65% LTGDV",
    strengths: [
      "Dedicated development finance team with sector expertise",
      "Portfolio lending facilities for multi-site developers",
      "Transparent fee structure with no hidden charges",
    ],
    turnaround: "3-5 weeks",
  },
  {
    slug: "vanguard-commercial",
    name: "Vanguard Commercial",
    type: "challenger-bank",
    description:
      "An ambitious challenger bank with particular strength in commercial and mixed-use development lending. Growing rapidly across the South East and Midlands.",
    services: [
      "development-finance",
      "commercial-mortgages",
      "refurbishment-finance",
    ],
    minLoan: "£1M",
    maxLoan: "£50M",
    typicalRate: "From 6.2% p.a.",
    maxLtv: "65% LTGDV",
    strengths: [
      "Strong appetite for commercial and mixed-use schemes",
      "Competitive rates for well-located sites with planning",
      "Experienced credit team with ex-high street expertise",
    ],
    turnaround: "3-5 weeks",
  },

  // Family Offices
  {
    slug: "sterling-and-co",
    name: "Sterling & Co",
    type: "family-office",
    description:
      "A private family office providing bespoke development finance and equity solutions. Known for their discretion, speed, and willingness to structure around complex developer needs.",
    services: [
      "development-finance",
      "mezzanine-finance",
      "equity-jv",
      "bridging-loans",
    ],
    minLoan: "£1M",
    maxLoan: "£25M",
    typicalRate: "From 8.5% p.a.",
    maxLtv: "85% LTGDV",
    strengths: [
      "Bespoke structuring including profit-share and equity arrangements",
      "Single decision-maker enables rapid credit approval",
      "Flexible on security and covenant packages",
    ],
    turnaround: "1-2 weeks",
  },
  {
    slug: "beaumont-private-capital",
    name: "Beaumont Private Capital",
    type: "family-office",
    description:
      "A multi-generational family office with deep roots in UK property. Provides senior and mezzanine debt alongside equity co-investment for premium residential developments.",
    services: [
      "development-finance",
      "mezzanine-finance",
      "equity-jv",
    ],
    minLoan: "£2M",
    maxLoan: "£40M",
    typicalRate: "From 8.0% p.a.",
    maxLtv: "80% LTGDV",
    strengths: [
      "Can provide entire capital stack from one source",
      "Significant appetite for prime central London and Home Counties",
      "Long-term partnership approach with repeat developers",
    ],
    turnaround: "1-3 weeks",
  },
  {
    slug: "ashworth-family-office",
    name: "Ashworth Family Office",
    type: "family-office",
    description:
      "A discreet private lending operation backed by a UK industrialist family. Focuses on smaller, high-conviction deals where speed and certainty of execution matter most.",
    services: [
      "bridging-loans",
      "mezzanine-finance",
      "equity-jv",
      "development-finance",
    ],
    minLoan: "£500K",
    maxLoan: "£10M",
    typicalRate: "From 9.0% p.a.",
    maxLtv: "80% LTGDV",
    strengths: [
      "Fastest decision-making of any lender on our panel",
      "Will fund pre-planning acquisitions for the right borrower",
      "No arrangement fee on deals completing within agreed timescales",
    ],
    turnaround: "3-7 days",
  },
  {
    slug: "cavendish-wealth",
    name: "Cavendish Wealth Partners",
    type: "family-office",
    description:
      "A sophisticated family office deploying capital across mezzanine and equity positions. Particularly active in the build-to-rent and student accommodation sectors.",
    services: [
      "mezzanine-finance",
      "equity-jv",
      "development-finance",
    ],
    minLoan: "£3M",
    maxLoan: "£30M",
    typicalRate: "From 10% p.a.",
    maxLtv: "90% LTGDV",
    strengths: [
      "Specialist appetite for build-to-rent and student housing",
      "Can stretch to 90% LTGDV via combined senior and mezz",
      "Joint venture structures with reduced profit share for repeat partners",
    ],
    turnaround: "1-3 weeks",
  },

  // Institutional
  {
    slug: "commonwealth-asset-management",
    name: "Commonwealth Asset Management",
    type: "institutional",
    description:
      "An institutional asset manager deploying insurance and pension capital into UK development finance. Offers the most competitive pricing for large-scale, low-risk schemes.",
    services: [
      "development-finance",
      "commercial-mortgages",
      "development-exit-finance",
    ],
    minLoan: "£10M",
    maxLoan: "£150M",
    typicalRate: "From 5.0% p.a.",
    maxLtv: "60% LTGDV",
    strengths: [
      "Lowest rates available for institutional-grade schemes",
      "Long-term funding relationships with major housebuilders",
      "Can provide development-to-investment facilities",
    ],
    turnaround: "6-10 weeks",
  },
  {
    slug: "sovereign-real-estate-finance",
    name: "Sovereign Real Estate Finance",
    type: "institutional",
    description:
      "Part of a major European insurance group, providing development finance for large-scale residential and mixed-use schemes. Conservative underwriting with extremely competitive pricing.",
    services: [
      "development-finance",
      "commercial-mortgages",
    ],
    minLoan: "£15M",
    maxLoan: "£200M",
    typicalRate: "From 4.8% p.a.",
    maxLtv: "55% LTGDV",
    strengths: [
      "The most competitive rates in the market for qualifying schemes",
      "Very long-term facilities available including forward funding",
      "Appetite for large PRS and BTR portfolio financing",
    ],
    turnaround: "8-12 weeks",
  },
  {
    slug: "atlas-capital-partners",
    name: "Atlas Capital Partners",
    type: "institutional",
    description:
      "An institutional fund manager deploying capital from multiple pension funds into UK property development. Active across the full capital stack from senior debt to preferred equity.",
    services: [
      "development-finance",
      "mezzanine-finance",
      "equity-jv",
      "commercial-mortgages",
    ],
    minLoan: "£5M",
    maxLoan: "£100M",
    typicalRate: "From 6.0% p.a.",
    maxLtv: "75% LTGDV",
    strengths: [
      "Can provide full capital stack solutions from single source",
      "Flexible on phasing and multi-site portfolio facilities",
      "Dedicated origination team with deep property expertise",
    ],
    turnaround: "4-8 weeks",
  },

  // Bridging Specialists
  {
    slug: "rapide-finance",
    name: "Rapide Finance",
    type: "bridging-specialist",
    description:
      "The UK's fastest bridging lender with a fully automated valuation and legal process. Specialises in auction finance and time-critical acquisitions where same-week completion is essential.",
    services: [
      "bridging-loans",
      "development-exit-finance",
      "refurbishment-finance",
    ],
    minLoan: "£100K",
    maxLoan: "£15M",
    typicalRate: "From 0.55% p.m.",
    maxLtv: "75% LTV",
    strengths: [
      "Completion in as little as 3 working days for standard cases",
      "Automated valuation model for properties under £1M",
      "No exit fees on loans repaid within 6 months",
    ],
    turnaround: "3-7 days",
  },
  {
    slug: "bridgewell-capital",
    name: "Bridgewell Capital",
    type: "bridging-specialist",
    description:
      "A well-capitalised bridging lender with an in-house fund providing certainty of execution. Particularly strong on regulated bridging, second charges, and complex security structures.",
    services: [
      "bridging-loans",
      "refurbishment-finance",
      "development-exit-finance",
    ],
    minLoan: "£150K",
    maxLoan: "£25M",
    typicalRate: "From 0.59% p.m.",
    maxLtv: "75% LTV",
    strengths: [
      "In-house funding removes third-party delay risk",
      "Regulated bridging available for owner-occupier situations",
      "Comfortable with second charge and complex security positions",
    ],
    turnaround: "5-10 days",
  },
  {
    slug: "fleetway-lending",
    name: "Fleetway Lending",
    type: "bridging-specialist",
    description:
      "A specialist short-term lender focused on property professionals and portfolio landlords. Offers competitive rates with a streamlined repeat-borrower programme for established clients.",
    services: [
      "bridging-loans",
      "refurbishment-finance",
      "commercial-mortgages",
    ],
    minLoan: "£75K",
    maxLoan: "£10M",
    typicalRate: "From 0.49% p.m.",
    maxLtv: "70% LTV",
    strengths: [
      "Market-leading rates for low-LTV bridging transactions",
      "Repeat borrower programme with reduced fees and rates",
      "Will lend on mixed-use, semi-commercial, and HMO security",
    ],
    turnaround: "5-10 days",
  },
  {
    slug: "swiftbridge-finance",
    name: "Swiftbridge Finance",
    type: "bridging-specialist",
    description:
      "An agile bridging lender specialising in auction purchases, chain breaks, and time-sensitive acquisitions. Their 24-hour DIP process and dedicated case managers ensure rapid completion.",
    services: [
      "bridging-loans",
      "development-exit-finance",
    ],
    minLoan: "£50K",
    maxLoan: "£5M",
    typicalRate: "From 0.65% p.m.",
    maxLtv: "80% LTV",
    strengths: [
      "24-hour decision in principle for standard applications",
      "Will stretch to 80% LTV for prime residential security",
      "Dedicated case manager assigned within 1 hour of application",
    ],
    turnaround: "3-5 days",
  },

  // Development Specialists
  {
    slug: "groundworks-development-finance",
    name: "Groundworks Development Finance",
    type: "development-specialist",
    description:
      "A dedicated development finance lender with construction industry expertise at every level. Their monitoring surveyors and credit team all have hands-on development backgrounds.",
    services: [
      "development-finance",
      "mezzanine-finance",
      "development-exit-finance",
    ],
    minLoan: "£500K",
    maxLoan: "£35M",
    typicalRate: "From 6.8% p.a.",
    maxLtv: "75% LTGDV",
    strengths: [
      "Construction-experienced credit team understands build risk",
      "Pragmatic approach to cost overruns and programme changes",
      "Will fund schemes with as few as 2 units",
    ],
    turnaround: "2-3 weeks",
  },
  {
    slug: "brickwork-finance",
    name: "Brickwork Finance",
    type: "development-specialist",
    description:
      "Purpose-built for property developers, offering development finance from land acquisition through to exit. Particularly strong with first-time developers transitioning from refurbishment.",
    services: [
      "development-finance",
      "refurbishment-finance",
      "development-exit-finance",
      "bridging-loans",
    ],
    minLoan: "£250K",
    maxLoan: "£20M",
    typicalRate: "From 7.5% p.a.",
    maxLtv: "70% LTGDV",
    strengths: [
      "Supportive of developers stepping up from refurb to ground-up",
      "Flexible on experience requirements with strong project fundamentals",
      "In-house QS team provides fast drawdown sign-off",
    ],
    turnaround: "2-3 weeks",
  },
  {
    slug: "elevate-development-capital",
    name: "Elevate Development Capital",
    type: "development-specialist",
    description:
      "A development finance specialist with a focus on sustainable and energy-efficient builds. Offers preferential terms for schemes exceeding current building regulation energy standards.",
    services: [
      "development-finance",
      "mezzanine-finance",
      "equity-jv",
    ],
    minLoan: "£1M",
    maxLoan: "£45M",
    typicalRate: "From 6.5% p.a.",
    maxLtv: "75% LTGDV",
    strengths: [
      "Green premium — reduced rates for EPC A-rated developments",
      "Strong appetite for modular and MMC construction methods",
      "Will co-invest equity alongside senior debt for qualifying schemes",
    ],
    turnaround: "2-4 weeks",
  },
  {
    slug: "siteline-capital",
    name: "Siteline Capital",
    type: "development-specialist",
    description:
      "Specialist lender exclusively focused on residential development finance across the UK. Known for pragmatic underwriting and deep understanding of regional housing markets.",
    services: [
      "development-finance",
      "development-exit-finance",
      "refurbishment-finance",
    ],
    minLoan: "£300K",
    maxLoan: "£18M",
    typicalRate: "From 7.2% p.a.",
    maxLtv: "70% LTGDV",
    strengths: [
      "Regional market specialists with local knowledge across the UK",
      "Flexible on unit mix including houses, flats, and bungalows",
      "Straightforward documentation with minimal conditions precedent",
    ],
    turnaround: "2-3 weeks",
  },
];

export function getLenderBySlug(slug: string): Lender | undefined {
  return LENDERS.find((l) => l.slug === slug);
}

export function getLendersByType(type: LenderType): Lender[] {
  return LENDERS.filter((l) => l.type === type);
}

export function getLendersByService(service: string): Lender[] {
  return LENDERS.filter((l) => l.services.includes(service));
}
