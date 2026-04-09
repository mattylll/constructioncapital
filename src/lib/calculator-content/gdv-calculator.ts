import type { CalculatorContent } from "./types";

export const content: CalculatorContent = {
  howItWorks: {
    title: "How the GDV Calculator Works",
    paragraphs: [
      "Gross Development Value (GDV) is the total market value of a completed development — the sum of the values of all individual units or spaces once built and ready for sale or letting. It is the starting point for every development appraisal and the single most consequential figure in the financial model: a 5% movement in GDV has a greater impact on profit than almost any other variable.",
      "This calculator builds up GDV from the unit level. Enter the number and type of each unit in your scheme (for example, two one-bedroom flats, four two-bedroom flats, and two three-bedroom houses), the expected sale price per unit, and any commercial or ancillary space. The calculator multiplies unit count by price, sums the results, and shows your total GDV alongside a breakdown by unit type.",
      "You can also model GDV on a price-per-square-foot basis if you are working from floor areas rather than individual unit estimates. Input the net saleable area (NSA) for each unit type and the expected sales rate per square foot — derived from comparable sold prices in the local market — to produce a GDV estimate that is anchored in measurable data rather than assumptions.",
      "The calculator includes a sensitivity table showing how GDV changes at ±5%, ±10%, and ±15% from your base assumption. Lenders will stress GDV when they underwrite your scheme; understanding the downside scenario before you apply for finance positions you as a well-prepared borrower and helps you identify whether your profit margin is sufficient to absorb adverse market movements.",
    ],
  },
  guide: {
    title: "How to Calculate and Validate GDV for a Development Project",
    sections: [
      {
        heading: "Using Comparables to Build a Credible GDV",
        paragraphs: [
          "The most important input into any GDV calculation is the comparable evidence — recently sold properties of similar specification, size, and location that demonstrate what buyers are paying in the current market. Without robust comparables, GDV is an assumption rather than an estimate, and a lender's valuer will challenge any GDV that cannot be supported by transactions.",
          "Land Registry sold prices are the gold standard for comparable evidence. They represent actual completed transactions — not asking prices — and are publicly available via the Price Paid Data portal. The limitation is recency: Land Registry data lags the market by four to eight weeks at registration, and older transactions in a rising or falling market can be misleading. Check the date of each comparable and weight recent transactions more heavily.",
          "Rightmove and Zoopla sold prices aggregate Land Registry data with their own listings database, making it easier to filter by property type, size, and postcode. For new-build comparables, new-build specific portals and the developer's own sales agents are the most reliable sources — Land Registry data understates new-build prices in some cases because incentives (stamp duty paid, upgraded specification, cashback) are not disclosed in the headline price.",
          "RICS Red Book valuations — the independent assessments commissioned by lenders — are the formal benchmark. A RICS-qualified surveyor will typically inspect a sample of comparable properties, analyse sold price data, apply adjustments for specification and location, and produce a formal opinion of market value. The RICS valuation forms the basis of the lender's advance, regardless of what the developer's comparables suggest. Discrepancies between the developer's GDV and the RICS figure are a common source of funding shortfalls.",
        ],
        bullets: [
          "Land Registry Price Paid Data: actual sale prices, 4–8 week lag",
          "Rightmove/Zoopla sold prices: accessible filtering by type and size",
          "Agent valuations: useful directionally, but not independent — treat with caution",
          "RICS Red Book: the figure lenders use — get an informal indication early",
          "Weight recent transactions (within 6 months) more heavily in rising or falling markets",
        ],
      },
      {
        heading: "The New Build Premium: How Much Extra Can You Expect?",
        paragraphs: [
          "New-build properties typically command a premium over equivalent second-hand stock. Buyers pay more for a new-build for several reasons: no chain, ten-year structural warranty (NHBC Buildmark or equivalent), modern specification including energy efficiency, and the ability to choose finishes and customise. This new-build premium is a real and measurable phenomenon — but it varies significantly by location, specification, and market conditions.",
          "In strong markets with limited new-build supply — many provincial towns, coastal locations, and suburban areas — the new-build premium can be 15–20% above comparable second-hand prices. In markets where new-build supply is plentiful relative to demand, or where recent years have seen significant Help to Buy-driven new-build activity, the premium compresses toward 5–10% or disappears entirely.",
          "For GDV purposes, do not automatically apply a blanket new-build premium to your comparables. Instead, use dedicated new-build comparables where available, and test any premium assumption with your sales agent. Agents with an active pipeline in your target market will have the most current intelligence on achievable new-build prices and the type of specification buyers are expecting at that price point.",
          "Specification matters as much as new-build status. A new-build flat with poor thermal performance, dated fittings, and no external amenity will not command a premium over well-maintained second-hand stock. A scheme that meets or exceeds EPC A rating, includes EV charging points, and offers a high-quality specification can genuinely support a 15–20% premium over the existing market. Understand what your target buyer values before setting GDV.",
        ],
      },
      {
        heading: "Unit Mix Optimisation: How Changing the Mix Changes GDV",
        paragraphs: [
          "The unit mix — the combination of unit types and sizes within a scheme — has a substantial impact on GDV per square foot and therefore on overall value. Optimising the mix is one of the most effective levers a developer has to maximise value without increasing the footprint or build cost significantly.",
          "One-bedroom units typically achieve the highest sales price per square foot because buyers pay a location premium for a smaller absolute outlay. However, they generate the lowest absolute sales price per unit, and planning authorities in many areas are now pushing back against excessive one-bedroom provision, particularly where family housing need is identified in the local housing market assessment.",
          "Three-bedroom units and four-bedroom houses command the highest absolute sales prices and, in family housing markets, often the shortest time to exchange. They are less efficient in terms of GDV per square foot than one-bedroom units, but they may attract less planning resistance and are often more readily mortgageable by the widest range of buyers.",
          "The most valuable mix strategy is to design for the specific market. In a commuter town with high demand from young professional families, two and three-bedroom units may achieve better value than maximising one-bedroom provision. In a city-centre location with strong young professional demand, one and two-bedroom units may outperform. Research the undersupplied segments in your specific local market rather than applying a generic mix strategy.",
        ],
        bullets: [
          "One-bed units: highest GDV per sq ft, lowest absolute price per unit",
          "Two-bed units: best balance of planning deliverability and market demand",
          "Three-bed and houses: highest absolute price, strongest family market demand",
          "Check planning policy: many LPAs now prescribe minimum mix requirements",
          "Sense-check proposed mix with a local agent before finalising the design",
        ],
      },
      {
        heading: "Sensitivity Analysis and How Lenders Verify GDV",
        paragraphs: [
          "Any GDV figure you use in an appraisal should be stress-tested. Property markets move — sometimes significantly during the period between a planning application and a sales launch. A scheme viable at 100% of GDV but loss-making at 90% has a fragile financial case. Stress-testing to 85–90% of base GDV is a standard discipline that experienced developers apply before committing to a land purchase.",
          "The sensitivity analysis built into this calculator shows the profit impact of GDV movements in 5% increments. The most important threshold to identify is the GDV level at which the project breaks even (profit on cost falls to zero). If that break-even GDV is below 80% of your base assumption, the scheme has a reasonable margin of safety. If it is above 90%, the scheme is highly sensitive to market movements and should be scrutinised carefully.",
          "Lenders apply their own stress tests. Most development finance lenders will decline to advance against a GDV they cannot independently support at an 85–90% stress level. They commission a RICS Red Book valuation — which takes an independent view of achievable prices and applies its own stress — and will lend against the lower of the developer's appraisal and the RICS valuation. Developers who benchmark their GDV conservatively and support it with strong comparable evidence will find that the RICS valuation converges with their appraisal, minimising the risk of a funding shortfall at credit stage.",
        ],
        bullets: [
          "Always model GDV sensitivity at 85%, 90%, 95%, and 100% of base",
          "Identify the break-even GDV — the floor below which the project loses money",
          "Lenders stress GDV to 85–90% when assessing maximum advance",
          "RICS valuation is independent and may differ from developer's GDV — allow for this",
          "Use presales to reduce reliance on GDV assumptions — contracted sales are bankable evidence",
        ],
      },
    ],
  },
};
