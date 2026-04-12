export interface ComparisonOption {
  slug: string;
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  typicalTimeline: string;
  typicalCost: string;
}

export const FUNDING_ROUTES: ComparisonOption[] = [
  {
    slug: "specialist-broker",
    name: "Specialist Broker (Construction Capital)",
    description:
      "A dedicated development finance broker with deep lender relationships and capital stack expertise.",
    pros: [
      "Access to 100+ specialist lenders across the whole market",
      "Expert deal structuring to maximise leverage and minimise cost",
      "Significant time saving - one application, multiple lenders",
      "Competitive rates through panel leverage and lender competition",
    ],
    cons: [
      "Broker fee (typically 1-2% arrangement fee, usually deducted from the facility)",
    ],
    bestFor:
      "Developers seeking optimal terms across the whole market, complex capital stacks, or projects requiring specialist lender knowledge",
    typicalTimeline: "Indicative terms in 24 hours, completion in 2-4 weeks",
    typicalCost: "1-2% arrangement fee",
  },
  {
    slug: "direct-to-lender",
    name: "Direct to Lender",
    description:
      "Approaching a development finance lender directly without broker intermediation.",
    pros: [
      "No broker fee on the transaction",
      "Direct relationship with your lender",
    ],
    cons: [
      "Limited to one lender's products and appetite",
      "No market comparison - you never know if you're getting the best deal",
      "DIY application process with no expert guidance",
      "Often worse rates without broker leverage and volume relationships",
    ],
    bestFor:
      "Simple deals where you have an existing lender relationship and are confident in their terms",
    typicalTimeline: "2-6 weeks depending on lender",
    typicalCost: "No broker fee, but potentially higher lender rates",
  },
  {
    slug: "high-street-bank",
    name: "High Street Bank",
    description:
      "Traditional high street banks offering property development lending alongside their retail banking services.",
    pros: [
      "Familiar brand and existing banking relationship",
      "Potentially lower rates for simple, low-risk deals",
    ],
    cons: [
      "Slow decision-making (8-12 weeks is common)",
      "Conservative lending criteria - low LTV, vanilla projects only",
      "Limited development finance expertise within branch networks",
      "No specialist understanding of complex capital stacks",
    ],
    bestFor:
      "Experienced developers with strong balance sheets and straightforward residential projects",
    typicalTimeline: "8-12 weeks to completion",
    typicalCost: "Lower headline rate, but inflexible terms",
  },
  {
    slug: "online-platform",
    name: "Online Platform",
    description:
      "Technology-driven platforms offering development finance comparison or direct lending online.",
    pros: [
      "Quick indicative terms through automated processes",
      "Technology-driven, user-friendly interface",
    ],
    cons: [
      "Limited real lender relationships - often just lead generation",
      "Less structuring expertise for complex deals",
      "Indicative terms may not reflect final offers",
      "Limited human expertise when deals get complicated",
    ],
    bestFor:
      "Developers wanting a quick initial sense of market rates before engaging a specialist",
    typicalTimeline: "Instant indicative, but 4-8 weeks to actual completion",
    typicalCost: "Varies - some charge fees, others are lead-gen funded",
  },
  {
    slug: "mortgage-broker",
    name: "Mortgage Broker",
    description:
      "Residential or buy-to-let mortgage brokers who occasionally handle development finance enquiries.",
    pros: [
      "Good for buy-to-let and standard residential mortgages",
      "May already have a relationship with you",
    ],
    cons: [
      "Rarely understand development finance structures",
      "Limited access to specialist development lenders",
      "May mis-advise on capital stack structuring and mezzanine options",
      "Not equipped for planning-contingent or phased drawdown facilities",
    ],
    bestFor:
      "Buy-to-let purchases or simple residential refinancing - not development finance",
    typicalTimeline: "Varies widely - often delayed by learning curve",
    typicalCost: "Standard broker fee, but risk of sub-optimal deal structure",
  },
];

export interface ComparisonFeature {
  feature: string;
  description: string;
  ratings: Record<
    string,
    "excellent" | "good" | "average" | "poor" | "n/a"
  >;
}

export const COMPARISON_FEATURES: ComparisonFeature[] = [
  {
    feature: "Speed to Terms",
    description: "How quickly you receive indicative or formal terms",
    ratings: {
      "specialist-broker": "excellent",
      "direct-to-lender": "good",
      "high-street-bank": "poor",
      "online-platform": "good",
      "mortgage-broker": "average",
    },
  },
  {
    feature: "Lender Access",
    description: "Breadth of lender panel and market coverage",
    ratings: {
      "specialist-broker": "excellent",
      "direct-to-lender": "poor",
      "high-street-bank": "poor",
      "online-platform": "average",
      "mortgage-broker": "poor",
    },
  },
  {
    feature: "Rate Competitiveness",
    description: "Ability to secure the most competitive rates through leverage",
    ratings: {
      "specialist-broker": "excellent",
      "direct-to-lender": "average",
      "high-street-bank": "good",
      "online-platform": "average",
      "mortgage-broker": "average",
    },
  },
  {
    feature: "Capital Stack Expertise",
    description: "Knowledge of senior, mezzanine, equity, and blended structures",
    ratings: {
      "specialist-broker": "excellent",
      "direct-to-lender": "average",
      "high-street-bank": "poor",
      "online-platform": "average",
      "mortgage-broker": "poor",
    },
  },
  {
    feature: "Development Finance Knowledge",
    description: "Deep understanding of ground-up, refurb, and conversion projects",
    ratings: {
      "specialist-broker": "excellent",
      "direct-to-lender": "good",
      "high-street-bank": "average",
      "online-platform": "average",
      "mortgage-broker": "poor",
    },
  },
  {
    feature: "Planning Complexity Handling",
    description: "Ability to structure deals around planning conditions and risk",
    ratings: {
      "specialist-broker": "excellent",
      "direct-to-lender": "good",
      "high-street-bank": "poor",
      "online-platform": "poor",
      "mortgage-broker": "n/a",
    },
  },
  {
    feature: "Mezzanine / Equity Sourcing",
    description: "Access to stretch finance, mezzanine debt, and JV equity partners",
    ratings: {
      "specialist-broker": "excellent",
      "direct-to-lender": "poor",
      "high-street-bank": "n/a",
      "online-platform": "poor",
      "mortgage-broker": "n/a",
    },
  },
  {
    feature: "Post-Completion Support",
    description: "Ongoing advisory for exits, refinancing, and portfolio strategy",
    ratings: {
      "specialist-broker": "excellent",
      "direct-to-lender": "good",
      "high-street-bank": "average",
      "online-platform": "poor",
      "mortgage-broker": "average",
    },
  },
  {
    feature: "Fee Transparency",
    description: "Clear, upfront disclosure of all costs and fees",
    ratings: {
      "specialist-broker": "excellent",
      "direct-to-lender": "good",
      "high-street-bank": "average",
      "online-platform": "average",
      "mortgage-broker": "good",
    },
  },
  {
    feature: "Deal Structuring",
    description: "Ability to optimise terms, covenants, and facility mechanics",
    ratings: {
      "specialist-broker": "excellent",
      "direct-to-lender": "average",
      "high-street-bank": "poor",
      "online-platform": "poor",
      "mortgage-broker": "poor",
    },
  },
];
