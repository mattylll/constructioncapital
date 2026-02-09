export const SERVICES = [
  {
    slug: "development-finance",
    name: "Development Finance",
    shortDesc:
      "Senior debt funding for ground-up residential and commercial developments.",
    longDesc:
      "Development finance provides the core funding for new-build projects. Typically structured as senior debt, it covers land acquisition and construction costs with staged drawdowns aligned to your build programme.",
    typicalLtv: "Up to 65-70% LTGDV",
    typicalRate: "From 6.5% p.a.",
    typicalTerm: "12-24 months",
    icon: "Building2",
  },
  {
    slug: "mezzanine-finance",
    name: "Mezzanine Finance",
    shortDesc:
      "Stretch your capital stack beyond senior debt to reduce equity requirements.",
    longDesc:
      "Mezzanine finance sits behind senior debt in the capital stack, stretching your total borrowing to 80-90% of costs. It reduces the equity you need to inject, freeing capital for additional projects.",
    typicalLtv: "Up to 85-90% LTGDV",
    typicalRate: "From 12% p.a.",
    typicalTerm: "12-24 months",
    icon: "Layers",
  },
  {
    slug: "bridging-loans",
    name: "Bridging Loans",
    shortDesc:
      "Short-term finance for acquisitions, auction purchases and time-sensitive deals.",
    longDesc:
      "Bridging loans provide rapid access to capital when speed is critical. Whether purchasing at auction, securing a site before planning, or bridging a gap between transactions, funds can be available within days.",
    typicalLtv: "Up to 75% LTV",
    typicalRate: "From 0.55% p.m.",
    typicalTerm: "1-18 months",
    icon: "Clock",
  },
  {
    slug: "equity-jv",
    name: "Equity & Joint Ventures",
    shortDesc:
      "Equity partnerships and JV structures for developers seeking capital partners.",
    longDesc:
      "For developers who want to preserve capital or lack the equity to satisfy senior debt requirements, equity and JV structures provide the missing piece. We connect you with family offices and institutional equity partners.",
    typicalLtv: "Up to 100% of costs",
    typicalRate: "Profit share from 40%",
    typicalTerm: "Project duration",
    icon: "Handshake",
  },
  {
    slug: "refurbishment-finance",
    name: "Refurbishment Finance",
    shortDesc:
      "Funding for light and heavy refurbishment projects including conversions.",
    longDesc:
      "Refurbishment finance covers the acquisition and renovation costs for property conversion and refurbishment projects. From light cosmetic works to heavy structural alterations, we source competitive terms.",
    typicalLtv: "Up to 75% LTV",
    typicalRate: "From 0.65% p.m.",
    typicalTerm: "6-18 months",
    icon: "Wrench",
  },
  {
    slug: "commercial-mortgages",
    name: "Commercial Mortgages",
    shortDesc:
      "Long-term finance for commercial property acquisition and refinancing.",
    longDesc:
      "Commercial mortgages provide long-term finance for purchasing or refinancing commercial and semi-commercial property. Suitable for offices, retail, industrial units, and mixed-use buildings.",
    typicalLtv: "Up to 75% LTV",
    typicalRate: "From 5.5% p.a.",
    typicalTerm: "3-25 years",
    icon: "Landmark",
  },
  {
    slug: "development-exit-finance",
    name: "Development Exit Finance",
    shortDesc:
      "Short-term funding to repay development finance while you sell completed units.",
    longDesc:
      "Development exit finance replaces your development facility once construction is complete, giving you breathing room to sell units at the best price rather than under pressure. It repays the senior lender and provides a lower-cost holding facility while you market and sell.",
    typicalLtv: "Up to 75% LTV",
    typicalRate: "From 0.55% p.m.",
    typicalTerm: "6-18 months",
    icon: "LogOut",
  },
] as const;

export type Service = (typeof SERVICES)[number];
export type ServiceSlug = Service["slug"];
