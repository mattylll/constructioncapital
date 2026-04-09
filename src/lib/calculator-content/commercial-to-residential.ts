import type { CalculatorContent } from "./types";

export const content: CalculatorContent = {
  howItWorks: {
    title: "How Commercial-to-Residential Conversions Work",
    paragraphs: [
      "Commercial-to-residential conversion encompasses a wide range of building types — from high-street shops and supermarkets to light industrial units and petrol filling stations — each with a different planning route, structural profile, and cost base. The unifying financial logic is the same as for office conversions: acquire a building at a commercial or blended valuation, convert to residential use, and realise the uplift to residential values. The route to residential consent and the cost of getting there, however, varies considerably by original use class.",
      "Since September 2020, the Town and Country Planning (Use Classes) (Amendment) (England) Regulations 2020 consolidated most traditional commercial uses — A1 retail, A2 financial and professional, A3 restaurants, B1 offices, and a range of leisure and healthcare uses — into a single Use Class E. This rationalisation significantly broadened the scope of Class MA permitted development rights, which now apply to any Use Class E building that meets the vacancy and two-year use conditions. Retail units, gyms, estate agents, and dental surgeries all now have a PD route to residential conversion that did not previously exist.",
      "Buildings that remain outside Use Class E — pubs (now sui generis), nightclubs (sui generis), hot food takeaways (Use Class E as of 2020 for some, but complex), petrol filling stations (sui generis), and light industrial (Use Class B2/B8) — require full planning permission for any change of use to residential. These routes carry more uncertainty but can deliver significant value where commercial values are depressed and residential demand is strong.",
      "The conversion calculator models the financial case across all commercial building types by allowing users to input the current commercial value (as an anchor for acquisition benchmarking), the gross internal area, target unit numbers, build cost assumptions, and residential exit values. The output — profit on cost, return on GDV, and required finance — gives a rapid read on whether a site justifies further due diligence and, if so, how it should be financed.",
    ],
  },
  guide: {
    title: "Commercial-to-Residential Conversions: Planning Routes and Cost Guide",
    sections: [
      {
        heading: "Planning Routes by Use Class",
        paragraphs: [
          "The planning route available for a commercial-to-residential conversion is determined first by the building's existing lawful use class and second by whether Class MA permitted development rights have been removed by an Article 4 Direction. For Use Class E buildings — the broad commercial class covering most retail, office, and service uses — Class MA is the default route where PD rights are intact. Prior approval is required, covering transport, contamination, flooding, noise, and natural light, but the LPA cannot refuse on general planning grounds.",
          "Use Class B2 (general industrial) and B8 (storage and distribution) buildings have no Class MA route. Conversion of these buildings to residential requires a full planning application. In many local authority areas, particularly those with identified employment land shortages, such applications face a strong policy presumption against loss of industrial or warehousing floorspace. Evidence of marketing the building for its existing B2/B8 use — typically 12–24 months at a realistic asking price — is usually required before a planning inspector will consider residential conversion acceptable in these locations.",
          "Sui generis uses — those that do not fall within any defined use class — require full planning consent for any change of use. Former pubs are a notable example: they lost their A4 use class in September 2020 and became sui generis. Many are also registered as Assets of Community Value (ACVs) under the Localism Act 2011, which triggers a six-month moratorium on sale to allow community groups to bid. Converting a former pub with ACV status requires both full planning consent for change of use and, in some cases, a robust demonstration that viable pub operation is no longer commercially feasible.",
        ],
        bullets: [
          "Use Class E (retail, office, clinic, gym, café, etc.): Class MA prior approval available subject to vacancy and two-year use conditions",
          "Use Class B2 (general industrial) and B8 (storage/distribution): full planning application required; employment land policy likely to apply",
          "Sui generis (pubs, nightclubs, petrol stations, casinos): full planning application required in all cases",
          "Permitted development from B1(c) light industrial to residential (former Class PA): this right expired in May 2019 and has not been renewed; full planning required",
          "Mixed-use buildings: where a building has multiple use classes, each element must be assessed separately; a retail ground floor with office upper floors may have a PD route for the upper floors only",
        ],
      },
      {
        heading: "Cost Considerations by Building Type",
        paragraphs: [
          "The cost of converting a commercial building to residential use is driven by the gap between what the existing structure provides and what the Building Regulations require of a new residential building. This gap varies enormously by building type. A modern ground-floor retail unit in a post-2000 block may need relatively modest work — new partitioning, residential MEP (mechanical, electrical, and plumbing), kitchens, and bathrooms — whereas a 1960s supermarket with a large open footprint, flat roof, and no natural light to the rear requires far more fundamental intervention.",
          "Retail units present specific challenges around rear floor depths and natural light. Deep plan retail (more than approximately 8–10 metres from front to rear window) makes it difficult to achieve adequate natural light to all habitable rooms without rooflights or lightwells, both of which add cost. Ground-floor retail-to-residential conversions also frequently sit below or adjacent to other commercial uses, creating noise transmission challenges that must be addressed through acoustic flooring and partition systems to meet Building Regulations Approved Document E standards.",
          "Industrial buildings — particularly older brick-built factory units — can offer excellent conversion opportunities where they have high eaves height, generous floor-to-ceiling dimensions, and robust structural frames that can support a residential fit-out. The cost premium in industrial conversions typically lies in insulation (older industrial buildings have minimal thermal envelope), services provision (running hot water, heating, and ventilation into large open spaces), and acoustic separation between units. Mould risk is a particular concern in industrial conversions: buildings that have been unheated for extended periods may have damp ingress through floors and walls that is not immediately visible at survey stage.",
        ],
        bullets: [
          "Retail conversion cost range: £90–£160/sqft depending on depth of plan, floor condition, and services requirement",
          "Industrial conversion cost range: £100–£180/sqft — insulation and services are the primary cost drivers",
          "Former pub conversion: typically £120–£200/sqft, with premium costs for structural alterations to bar areas, cellar waterproofing, and heritage material matching if listed",
          "VAT: conversion of a building that has never been used for residential purposes may qualify for the 5% reduced rate of VAT on eligible building materials and construction services",
          "Ground floor to residential: where residential use is below an existing commercial floor, party floor acoustic treatment is mandatory and typically costs £15–£25/sqm",
        ],
      },
      {
        heading: "Structural Surveys and Fire Safety Under BS 9991",
        paragraphs: [
          "A structural survey is essential before committing to any commercial-to-residential conversion project. Unlike a homebuyer's survey, a structural survey for a commercial conversion should specifically address: the adequacy of foundations for proposed residential loads, the condition of the structural frame (concrete, steel, or masonry), the load capacity of existing floors, and any evidence of movement, settlement, or structural defect. Where the conversion involves adding a storey or creating a roof terrace, a structural engineer must confirm that the existing structure can carry the additional load before a design is developed.",
          "Fire safety requirements for residential buildings have been significantly strengthened following the Grenfell Tower fire and the implementation of the Building Safety Act 2022. For residential conversions above 11 metres in height (the threshold for 'higher-risk buildings'), a Principal Designer and Principal Contractor must be appointed under the Building Regulations 2010 (as amended), and the project is subject to enhanced oversight by the Building Safety Regulator. Below 11 metres, Approved Document B remains the primary standard, but its requirements for residential buildings are substantially more onerous than those for commercial buildings being converted.",
          "BS 9991:2015 (Fire Safety in the Design, Management and Use of Residential Buildings — Code of Practice) is the relevant British Standard for fire engineering design in residential buildings. It provides guidance on compartmentation, means of escape, detection and alarm systems, and the use of sprinklers. For converted buildings — particularly those with irregular floor plans, existing voids, or historic construction — a performance-based fire engineering approach under BS 9991 may be more appropriate than prescriptive compliance with Approved Document B, potentially reducing the cost of achieving the required fire resistance while still meeting the life safety objectives of the regulations.",
        ],
        bullets: [
          "Structural survey: commission a full structural engineer's inspection before exchange — RICS Level 3 survey alone is insufficient for commercial conversion",
          "Approved Document B (residential): requires 30-minute fire resistance for elements of structure in most converted buildings up to 3 storeys; 60 minutes for 4+ storeys",
          "Smoke alarms: Grade D, Category LD2 interlinked alarms required in all new dwellings under Approved Document B (2019 edition)",
          "Sprinklers: mandatory in all new residential buildings over 11 metres in Wales; recommended by BS 9991 for England and triggered by Building Regulations for certain high-risk building types",
          "Fire door specification: FD30S (30-minute fire door with smoke seal) required for all doors opening onto escape routes in converted residential buildings",
          "Building control: a full plans application to a registered building control body is advisable for complex conversions — self-certification is not appropriate for change of use projects",
        ],
      },
      {
        heading: "Viability and Finance for Commercial Conversions",
        paragraphs: [
          "The viability of a commercial-to-residential conversion hinges on the acquisition price relative to residential GDV, with build cost and finance cost as the key variables in between. The most profitable conversions are those where the commercial building is acquired at or close to its existing commercial value — with no residential hope value priced in by the vendor — and where the developer can demonstrate a clear PD or planning route to residential consent before committing to purchase.",
          "Lenders providing finance for commercial-to-residential conversions will assess the project against the same criteria as any development finance transaction: loan to gross development value (typically 65–75%), loan to project cost (typically 65–70%), developer experience in comparable projects, and the strength of the exit market. Where the planning route is prior approval under Class MA, most specialist development lenders are comfortable lending against confirmed prior approval. Where the route is a full planning application, lenders will typically require either planning consent before first drawdown or a meaningful equity buffer to cover the planning risk period.",
          "For smaller conversions — a single retail unit to two or three flats, for example — a heavy refurbishment bridging loan may be the most efficient structure, avoiding the overhead of a full development finance facility. Rates for heavy refurbishment bridging are typically in the range of 0.75–1.2% per month, with terms of 12–18 months. The key distinction that lenders draw is between 'light refurbishment' (cosmetic works only, no change of use) and 'heavy refurbishment' (structural works, change of use, or extension) — only the latter requires a specialist development or heavy refurb facility.",
        ],
        bullets: [
          "Target acquisition price: model backwards from GDV to establish the maximum price that delivers your required profit margin (typically 15–20% of GDV for a conversion project)",
          "Planning risk: agree a conditional exchange or option agreement with the vendor to defer completion until prior approval or planning consent is secured",
          "Finance timeline: allow 4–8 weeks from application to first drawdown for development finance; bridging can often be arranged within 2–4 weeks",
          "Section 106 and CIL: prior approval conversions are generally exempt from Section 106; CIL may still apply — check the LPA's CIL charging schedule",
          "Exit options: individual flat sales, block sale to a BTR operator, or refinance to a residential investment loan — model all three and select the most appropriate based on the local market",
        ],
      },
    ],
  },
};
