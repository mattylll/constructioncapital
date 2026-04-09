import type { CalculatorContent } from "./types";

export const content: CalculatorContent = {
  howItWorks: {
    title: "How Barn Conversions Are Appraised",
    paragraphs: [
      "Barn conversion projects occupy a distinctive position in the UK development finance market. They combine the planning certainty of Class Q permitted development rights — available since 2014 and materially expanded in 2024 — with the complexity and cost premium of converting structures that were never designed for human habitation. For lenders and developers alike, the appraisal of a barn conversion requires careful analysis of structural viability, planning eligibility, local residential values, and the significant cost variables that distinguish agricultural conversions from their urban commercial equivalents.",
      "The financial case for barn conversions rests on the uplift from agricultural land value (typically £8,000–£15,000 per acre for bare agricultural land) to residential curtilage value. A converted barn in a desirable rural location — the Cotswolds, the Yorkshire Dales, the Surrey Hills — can achieve £350–£600 per square foot in residential sale value, representing a substantial multiple of the cost base. In less sought-after rural locations, however, the residential premium over agricultural value is narrower, and the cost of conversion can absorb the uplift entirely, leaving little or no developer profit.",
      "The conversion calculator models barn projects by allowing input of the existing agricultural floor area, the number and type of proposed dwellings, build cost per square foot (which typically carries a meaningful premium over standard residential new build), and local residential values. It also captures the land cost — expressed either as a total acquisition price for the agricultural unit or as a per-acre equivalent — which is the critical variable that determines whether the project is viable at all.",
      "Because barn conversions are frequently pursued by owner-occupiers (farmers converting redundant buildings) as well as by property developers, the finance market has adapted to serve both audiences. Development finance is available for straightforward Class Q projects with strong planning positions; specialist rural lenders also offer tailored products for more complex heritage conversions where listed building consent or full planning is required.",
    ],
  },
  guide: {
    title: "Barn Conversions: Class Q, Heritage, and Rural Planning Guide",
    sections: [
      {
        heading: "Class Q Permitted Development: Agricultural Buildings to Dwellinghouses",
        paragraphs: [
          "Class Q of Schedule 2, Part 3 to the Town and Country Planning (General Permitted Development) (England) Order 2015 grants permitted development rights for the change of use of agricultural buildings to up to five dwellinghouses, subject to prior approval from the local planning authority. The rights were expanded by the Town and Country Planning (General Permitted Development) (England) (Amendment) (No. 2) Order 2024, which increased the cumulative floorspace cap from 865 sqm to 1,000 sqm and expanded the maximum dwelling size from 465 sqm to 465 sqm (unchanged) but clarified the treatment of 'smaller dwellings' (under 100 sqm) and 'larger dwellings' (100–465 sqm) in the permitted combination.",
          "The agricultural unit must have been established on or before 20 March 2013 — the date on which the original Class Q rights were introduced. Buildings erected after this date, or buildings that were not part of an established agricultural unit (for example, storage buildings on a residential smallholding), are excluded. The LPA will require evidence that the building has a lawful agricultural use, typically demonstrated by historic business rates records, farm business tenancy agreements, or aerial photography showing agricultural activity.",
          "The structural viability requirement is the aspect of Class Q most frequently contested at prior approval stage and on appeal. Class Q permits 'conversion' operations — the installation of new windows, doors, roofs, insulation, and services — but does not permit the rebuilding or replacement of structural elements. Where an agricultural building is in poor condition — particularly steel portal frame sheds with corroded columns, or masonry barns with failed roofs — the LPA may refuse prior approval on the grounds that the works required amount to rebuilding rather than conversion. A detailed structural engineer's report, confirming that the existing structural frame can be retained and adapted, is essential evidence in any Class Q application.",
        ],
        bullets: [
          "Maximum cumulative floorspace per agricultural unit: 1,000 sqm (post-2024 amendment)",
          "Maximum individual dwelling size: 465 sqm (gross internal area)",
          "Maximum number of dwellings: 5 per agricultural unit (any combination of smaller and larger dwellings)",
          "Excluded locations: National Parks, the Broads, SSSIs — Class Q rights for larger dwellings (over 100 sqm) do not apply in AONBs; smaller dwellings (under 100 sqm) remain permitted in AONBs",
          "Prior approval assessment topics: transport, noise, contamination, flooding, location/siting making residential use impractical or undesirable, and design and external appearance",
          "Determination period: 56 days from valid application; deemed consent if LPA fails to determine within this period",
        ],
      },
      {
        heading: "Structural Viability and Listed Building Considerations",
        paragraphs: [
          "The structural assessment of a barn intended for conversion is fundamentally different from a standard structural survey. The question is not simply whether the building is safe, but whether it can be converted to residential use within the confines of Class Q — which restricts permitted operations to those necessary to convert the building rather than to rebuild it. A structural engineer experienced in agricultural conversions will assess the existing frame, walls, and roof structure and advise on the works that can be undertaken within PD, and those that would require full planning consent.",
          "Masonry barns typically present a different structural profile from steel-framed agricultural sheds. Stone or brick walls, if intact, provide good thermal mass and are often structurally sound. The primary vulnerabilities are the roof structure (often a simple purlin-and-rafter system that has deteriorated, or been replaced with a corrugated steel sheet roof that has failed), the floor (usually compacted earth or concrete slab at agricultural standard, requiring replacement), and the openings (large cart doors that need to be partially or fully infilled to create habitable space while retaining some visual openness).",
          "Listed building status adds a further layer of complexity and cost. Barns are frequently listed alongside the farmhouse to which they belong, particularly in areas with a high concentration of Georgian and Victorian farm buildings. Any conversion of a listed agricultural building requires listed building consent in addition to prior approval or full planning permission. The scope of listed building consent is determined by the character of the listed building as defined in the List description and by the applicable conservation policies of the LPA. In practice, this means that structural interventions, window replacements, and new openings must all be approved by the conservation officer, often requiring the use of traditional materials — lime mortar, reclaimed or matching stone, timber windows — that carry a meaningful cost premium.",
        ],
        bullets: [
          "Structural engineer's report: commission before exchange; confirm whether the building passes the 'capable of functioning as a dwelling' test without rebuilding",
          "Steel portal frame barns: the most common refusal ground is that the thin gauge steel columns and cladding cannot support the insulation, glazing, and weathering required for residential use without wholesale replacement",
          "Listed buildings: require listed building consent in addition to planning; English Heritage (Historic England) guidance and the LPA's conservation officer are the key stakeholders",
          "Curtilage listing: even if the barn itself is not individually listed, it may be a curtilage listed structure if it predates the listing of the associated farmhouse",
          "Schedule of condition: a photographic schedule of condition prepared before works commence is essential to demonstrate that approved features have been retained",
        ],
      },
      {
        heading: "Cost Premiums for Heritage, Ecology, and Rural Build",
        paragraphs: [
          "Barn conversions consistently carry a build cost premium over standard residential new build, reflecting the combination of rural logistics, heritage materials, specialist contractors, and the unpredictability of working within an existing structure. As a general benchmark, barn conversion build costs in England currently range from £150–£250 per square foot, compared to £120–£180 per square foot for a standard residential new build of equivalent specification. In high-cost rural areas — the Cotswolds, Surrey Hills, Yorkshire Dales — the upper end of this range is regularly exceeded.",
          "Ecological surveys are a near-universal requirement for barn conversions, and their findings can significantly affect both programme and cost. Bats are the most commonly encountered protected species in rural agricultural buildings; a single roost of common pipistrelles can result in a requirement for a mitigation strategy that includes artificial roost features, low-lux lighting design, and a bat-sensitive construction programme supervised by a licensed ecologist. Great crested newts may be present in ponds within 500 metres of the site, triggering a requirement for either a district-level licence (where the LPA has a strategic mitigation plan in place) or an individual European Protected Species licence. Barn owls are also relevant: active nests cannot be disturbed during the breeding season (February–August), which can delay construction start.",
          "The supply chain for heritage barn conversions is more restricted than for standard development. Lime mortar pointing, reclaimed timber, matching local stone, and heritage ironmongery all require specialist suppliers and, in many cases, specialist subcontractors. Lead times for reclaimed materials can be 8–16 weeks, and the skill set required to execute lime mortar work or traditional joinery is concentrated in a relatively small pool of contractors. This supply constraint is particularly acute in rural areas distant from major centres, where mobilisation costs and subcontractor travel time add to the overall cost base.",
        ],
        bullets: [
          "Typical barn conversion build cost: £150–£250/sqft — budget to the upper end for listed buildings or complex heritage structures",
          "Bat survey requirements: a preliminary roost assessment (PRA) is needed first; if bats are found, full emergence/re-entry surveys may be required over multiple seasons (April–October)",
          "Great crested newt surveys: required where ponds exist within 500 metres; habitat suitability index assessment first, followed by presence/absence survey if HSI is 0.4 or above",
          "Planning condition typical for ecology: no demolition or conversion works to commence between 1 March and 31 August without written LPA consent — factor into programme",
          "VAT relief: conversion of a building that has not been used as a dwelling for 10+ years qualifies for the 5% reduced VAT rate on eligible construction services",
          "Self-build exemption: where an individual is converting a barn for their own occupation, they may be eligible for a VAT refund under the DIY Housebuilder scheme",
        ],
      },
      {
        heading: "Rural Planning Policies and Finance for Barn Conversions",
        paragraphs: [
          "Beyond the specific Class Q permitted development framework, rural planning policy — primarily the National Planning Policy Framework (NPPF) and local plan rural housing policies — shapes the planning landscape for barn conversions. The NPPF supports the re-use of redundant or disused rural buildings for residential purposes where it can contribute to a thriving rural economy, but it also requires that new housing in the open countryside (outside defined settlement boundaries) is subject to special justification. Class Q bypasses much of this policy landscape by providing a statutory PD right, but where Class Q is not available or has been exhausted, a full planning application for residential conversion will need to engage with the LPA's rural housing policies directly.",
          "Many LPAs require that barns converted under full planning consent are subjected to an agricultural occupancy condition — restricting occupation to those employed or last employed in agriculture, forestry, or a related rural industry — or, conversely, a marketing exercise demonstrating that the building cannot viably be re-used for commercial or community purposes before residential conversion is accepted. Agricultural occupancy conditions materially reduce the value of a converted barn (typically by 25–40% compared to an open market equivalent) and should be a key risk to assess in the pre-acquisition due diligence.",
          "Finance for barn conversions is available from specialist rural lenders and development finance providers, but the market is narrower than for urban conversion projects. Most mainstream development lenders will consider Class Q projects with strong prior approval positions, treating them similarly to permitted development conversions in urban markets. The key lender concerns are structural risk (addressed by a structural engineer's report), planning certainty (addressed by confirmed prior approval), and exit value (addressed by a rural RICS valuation). For listed building or complex heritage projects, the lender pool narrows further, and a specialist rural finance broker — familiar with lenders who have an appetite for heritage and rural assets — is typically required.",
        ],
        bullets: [
          "Agricultural occupancy conditions: check any existing agricultural tie before acquisition — they severely restrict the buyer pool and depress value",
          "Class Q exhaustion: once the 1,000 sqm cap is reached on an agricultural unit, no further Class Q conversions are available — any additional buildings require full planning",
          "Full planning vs Class Q: where the barn is not structurally suitable for Class Q, a full planning application for 'isolated homes in the open countryside' must meet the NPPF's 'exceptional quality or innovative design' or 'appropriate rural location' tests",
          "Development finance for barn conversions: 60–70% LTPC, 12–24 month terms; lenders will require QS cost report, structural engineer's report, and RICS 'Red Book' valuation",
          "Self-build routes: Ecology Building Society and Buildstore specialist lenders offer self-build finance for barn conversions under an arrears-based drawdown structure",
        ],
      },
    ],
  },
};
