import type { CalculatorContent } from "./types";

export const content: CalculatorContent = {
  howItWorks: {
    title: "How the build cost estimator works",
    paragraphs: [
      "This estimator uses BCIS (Building Cost Information Service) benchmark data to produce an indicative build cost for your scheme based on development type, gross internal area (GIA), specification level, and location. Enter your scheme parameters and the calculator returns a cost per square metre range (lower quartile, median, upper quartile) derived from comparable completed projects, together with a total estimated build cost and a confidence range representing the typical spread between a well-managed and a poorly managed project of the same type.",
      "BCIS cost data is the industry standard reference used by Quantity Surveyors, development finance lenders, and their appointed monitoring surveyors across the UK. It is based on actual tender prices from completed projects, updated quarterly, and broken down by building type, floor area, and procurement route. Our estimator applies the relevant BCIS category for your scheme type - new-build residential, residential conversion, commercial, mixed-use, or specialist housing - and adjusts for regional location using BCIS location factors, which range from approximately 0.85 in the north of England to 1.35 in Central London.",
      "Build costs estimated by this tool include substructure, superstructure, internal finishes, mechanical and electrical services, and external works to site boundaries. They exclude VAT, professional fees (architect, structural engineer, QS, project manager - typically 8% to 12% of build cost), planning fees, Building Regulations fees, utility connection costs, finance costs, and land acquisition costs. These excluded items are critical components of your total development cost and must be added separately in your development appraisal.",
      "These estimates should be treated as preliminary benchmarks only. Accurate project-specific cost planning requires engagement with a Quantity Surveyor who has current market knowledge and access to live subcontractor pricing. Before submitting an application for development finance, your cost plan must be prepared or independently verified by a QS acceptable to your lender.",
    ],
  },
  guide: {
    title: "Build costs in UK property development: benchmarks, variations, and value engineering",
    sections: [
      {
        heading: "Regional cost variations across the UK",
        paragraphs: [
          "Build costs in the UK vary significantly by region, and failing to account for this variation is one of the most common errors in development feasibility analysis. The BCIS location factor for Inner London - particularly the Royal Borough of Kensington and Chelsea, Westminster, and the City - is approximately 1.30 to 1.40 relative to a national average of 1.00. This means a scheme costing £2,000 per square metre to build in a regional city such as Sheffield or Nottingham might cost £2,600 to £2,800 per square metre in Central London. The difference is driven primarily by labour costs, site logistics, access restrictions, and the availability of skilled trades in each location.",
          "Outer London and the South East carry location factors of approximately 1.10 to 1.20 relative to the national average. The South West ranges from 0.95 to 1.05, the Midlands and East of England 0.90 to 1.00, and the North West, Yorkshire, and North East 0.85 to 0.95. Scotland, Wales, and Northern Ireland have their own BCIS adjustments; Scottish schemes in Edinburgh and Glasgow are typically 5% to 10% above the Scottish average due to labour demand from a concentrated construction market. These regional differentials are real, persistent, and well-evidenced - they should be applied from the earliest feasibility stage.",
          "Within any given region, there are additional micro-location cost drivers that BCIS factors do not fully capture. High-density urban sites with restricted access will always be more expensive to build on than open suburban sites because of crane logistics, just-in-time material delivery requirements, and the cost of managing neighbours' rights. Sites with contamination, poor ground conditions, or proximity to watercourses attract significant substructure premiums. Rural sites in areas of outstanding natural beauty (AONBs) or National Parks carry additional costs related to materials specification requirements and the limited availability of local trades. Site-specific factors like these can add 10% to 25% to the BCIS benchmark before you have considered specification level.",
          "The practical implication is that regional benchmarks are a starting point, not an endpoint. A developer acquiring a site in a London borough should use an inner London BCIS factor as a minimum floor for their cost assumptions. But if the site is a basement extension in a conservation area with party wall obligations on three sides, the actual cost will be materially above even that adjusted benchmark. Early engagement with a QS familiar with the specific area and scheme type will save significant money in the long run by setting realistic cost assumptions before the land price is committed.",
        ],
        bullets: [
          "Inner London location factor: 1.30-1.40 versus national average of 1.00",
          "Outer London and South East: 1.10-1.20",
          "Midlands and East of England: 0.90-1.00",
          "North of England and Scotland: 0.85-0.95",
          "Site-specific factors (contamination, access, conservation area) can add 10-25% to regional benchmarks",
        ],
      },
      {
        heading: "How specification level affects build cost",
        paragraphs: [
          "Specification level is the single largest controllable variable in build cost after the fundamental scheme type. For new-build residential development, the BCIS median build cost for a standard-specification 2-bedroom flat in an outer London location is approximately £1,800 to £2,200 per square metre GIA. A high-specification equivalent - with fitted wardrobes, engineered hardwood flooring, underfloor heating, video intercom, and premium kitchen and bathroom finishes - might cost £2,500 to £3,200 per square metre. A super-prime specification in a prime Central London scheme can reach £4,000 to £6,000 per square metre or beyond.",
          "The challenge for developers is calibrating specification to the target buyer profile without either underdelivering relative to market expectations or overspecifying beyond what buyers will pay for. In aspirational suburban markets, buyers of new-build homes are accustomed to standard developer specification: carpet in bedrooms, LVT in living areas, basic white goods in kitchens, and developer-supplied sanitaryware. A developer who upgrades every unit to engineered timber flooring throughout and premium kitchen appliances will spend an additional £15,000 to £20,000 per unit but may recover only £10,000 to £15,000 in GDV - destroying value rather than creating it.",
          "The opposite risk applies in prime and super-prime markets. A developer who builds apartments in a prime Central London postcode to a standard specification in a market where all comparables are finished to a high or super-prime standard will find that buyers expect the premium finish and will discount heavily against schemes that fall short. Specification must always be benchmarked against actual comparables in the target market, not against the developer's personal preference or comfort with cost.",
          "Mechanical and electrical (M&E) specification is particularly prone to cost escalation and is worth scrutinising carefully. MVHR (mechanical ventilation with heat recovery) systems, underfloor heating, EV charging provision, and smart home technology are increasingly expected in new-build residential schemes but carry material cost premiums. EV charging provision is now a requirement under Building Regulations Part S for new residential buildings with associated car parking. MVHR systems cost approximately £2,000 to £4,000 per unit installed and are often required to meet Part F ventilation standards in airtight modern construction. Model these as fixed costs per unit rather than as percentages of overall build cost.",
        ],
        bullets: [
          "Standard residential new-build: £1,600-2,200/sqm GIA (outer London and regional cities)",
          "Mid-specification: £2,200-2,800/sqm GIA",
          "High specification: £2,800-3,500/sqm GIA",
          "Super-prime (Central London): £4,000-6,000/sqm GIA",
          "EV charging (Part S) and MVHR ventilation are now mandated cost items on new-build residential",
        ],
      },
      {
        heading: "Construction cost inflation and current market trends",
        paragraphs: [
          "Construction cost inflation has been one of the defining challenges of UK development finance since 2021. The supply chain disruptions following the pandemic, compounded by labour shortages driven by reduced EU worker availability post-Brexit, drove BCIS Tender Price Inflation to peaks of 9% to 12% per annum in 2022. While inflation has moderated significantly since then, costs remain structurally higher than pre-2020 levels and the UK construction labour market continues to be characterised by skills shortages in key trades.",
          "The trades most consistently in short supply and therefore commanding premium rates include roofers, electricians (particularly first fix), groundworkers in areas with high development activity, brickwork gangs, and drylining fixers. In London and the South East, a skilled electrician commands day rates of £350 to £500, and securing a reliable ground-working subcontractor in a busy market can require tendering to eight or more firms to receive even three returns. Developers whose cost plans are prepared on rates from 12 to 18 months before construction begins face material tender-versus-budget gaps.",
          "Forward procurement - fixing material prices and labour rates before they move against you - is an increasingly important risk management tool. For schemes starting on site within six months, asking tenderers to hold their prices for 90 to 120 days before you draw your development finance is standard practice. For schemes where there is a gap of six months or more between cost plan preparation and site start (common where planning consent is still being pursued), you should apply a cost inflation allowance of at least 4% to 6% per annum to the cost plan figures. This allowance should be clearly documented in your appraisal and discussed with your lender and their monitoring surveyor.",
          "The shift towards Modern Methods of Construction (MMC) - volumetric modular systems, structural insulated panels (SIPs), and cross-laminated timber (CLT) - is partly a response to labour inflation. MMC factory production reduces on-site labour content and dependence on scarce skilled trades, while potentially improving programme predictability and quality. However, MMC carries its own risks: manufacturer lead times, transport logistics, and the need for precisely prepared foundations that tolerate zero tolerance in setting out. The cost premium for MMC over traditional construction ranges from nil to 15% depending on scheme type and volume of production, and the programme savings are most reliably captured on schemes of 20 units or more.",
        ],
        bullets: [
          "BCIS Tender Price Inflation peaked at 9-12% in 2022 and has since moderated but not reversed",
          "Apply 4-6% per annum inflation allowance to cost plans prepared more than 6 months before site start",
          "Groundworkers, electricians, and roofers are consistently the most constrained trades",
          "Forward procurement and fixed-price contracts help manage inflation risk",
          "MMC offers programme certainty advantages but requires volume (20+ units) to realise cost benefits",
        ],
      },
      {
        heading: "Value engineering: reducing costs without destroying GDV",
        paragraphs: [
          "Value engineering is the systematic process of reviewing every element of a scheme's design and specification to identify cost savings that do not reduce GDV or compromise quality below market expectations. Done well, it is one of the most powerful profit-protection tools available to a developer. Done poorly - by cutting corners in ways that become visible to buyers - it destroys the premium buyers are willing to pay and damages resale values. The distinction between genuine value engineering and false economy is one that experienced developers, good QSs, and knowledgeable monitoring surveyors can all identify immediately.",
          "The highest-value opportunities for cost reduction typically lie in the structural frame, external envelope, and M&E systems rather than in the interior fit-out. Changing from a concrete frame to a CLT structure, or from brick cladding to a rendered block or rainscreen system, can save £100 to £200 per square metre without any impact on interior finish quality. Reducing floor-to-ceiling heights by 100 to 150mm on a multi-storey scheme saves one entire additional floor of structure for approximately every ten storeys - meaningful on larger schemes. Simplifying the roofline by eliminating dormers, hips, and complex valleys reduces both construction cost and the risk of future maintenance defects.",
          "Unit mix optimisation is a form of value engineering that operates at the scheme level rather than the unit level. The cost per square metre to build a studio or one-bedroom flat is broadly the same as for a two-bedroom flat of the same construction type, but the revenue per square metre from studios and one-beds is significantly higher in most urban markets because smaller units carry a GDV premium per square foot. On a scheme where your site and planning consent can support a range of unit mixes, shifting the mix towards smaller units - subject to local plan unit mix policies - can materially improve GDV per square metre of build cost without adding construction complexity.",
          "What the QS monitoring report covers in the context of value engineering is important to understand. Your lender's appointed monitoring surveyor is not there to help you cut costs - they are there to protect the lender's security by ensuring the build quality is maintained at the level required to achieve the GDV used in the lender's valuation. If you instruct value engineering changes mid-project that reduce the specification below the level on which the GDV was assessed, the monitoring surveyor will flag this in their drawdown report and may recommend that the lender commission a revised valuation. In extreme cases, this can result in the lender reducing their facility or requiring you to inject additional equity. Discuss any significant specification changes with your broker and lender before instructing them on site.",
        ],
        bullets: [
          "Structural frame and external envelope offer the highest-value engineering opportunities",
          "Simplify rooflines and floor plates to reduce construction complexity and cost",
          "Shift unit mix towards smaller units to improve GDV per square metre of build cost",
          "Never reduce specification below the level on which the lender's GDV valuation was based",
          "Agree material changes to specification with your lender before instructing them on site",
        ],
      },
    ],
  },
};
