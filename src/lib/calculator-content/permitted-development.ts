import type { CalculatorContent } from "./types";

export const content: CalculatorContent = {
  howItWorks: {
    title: "How Permitted Development Rights Work",
    paragraphs: [
      "Permitted development (PD) rights allow certain changes of use and physical alterations to buildings without requiring a full planning application. They are granted by the Town and Country Planning (General Permitted Development) (England) Order 2015 (GPDO) and its subsequent amendments, giving property owners a streamlined route to repurpose or extend buildings where the planning system would otherwise create significant delay and cost.",
      "For developers and investors, PD rights represent one of the most powerful tools in the UK residential conversion market. The headline classes relevant to conversion projects are Class MA (commercial, business and service to residential), Class Q (agricultural buildings to dwellinghouses), and Class AA (upward extensions to existing residential blocks). Each class has its own permitted floorspace limits, prior approval requirements, and eligibility criteria that must be satisfied before any works begin.",
      "Unlike a full planning application, PD does not grant automatic permission. Most conversion routes require prior approval from the local planning authority (LPA), a process in which the council assesses a defined set of issues — typically transport impact, flood risk, contamination, noise, and daylight — but cannot refuse on general planning grounds such as design or housing need. This narrower scope of assessment is what makes prior approval faster and more predictable than a full application.",
      "PD rights are not universal. Article 4 Directions allow LPAs to remove specific PD rights in defined areas, most commonly applied to Class MA office conversions in town centres and employment zones where councils wish to protect commercial floorspace. Before assuming a PD route is available, developers must verify the applicable Article 4 Directions for the relevant local authority. Conservation areas, listed buildings, and sites of special scientific interest also carry restrictions. Understanding these constraints at the outset is essential to accurate appraisal.",
    ],
  },
  guide: {
    title: "Permitted Development Rights: A Developer's Guide",
    sections: [
      {
        heading: "Class MA: Commercial, Business and Service to Residential",
        paragraphs: [
          "Class MA, introduced in August 2021 as the replacement for the former Class O (office to resi) and Class M (retail to resi) rights, is the primary PD route for converting commercial premises to residential use. It applies to buildings in Use Class E — which since September 2020 has amalgamated offices, retail, restaurants, gyms, clinics, and a range of other commercial uses into a single flexible class.",
          "To qualify under Class MA, the building must have been vacant for a continuous period of at least three months immediately before the date of the prior approval application. The building must also have been in lawful Use Class E use (or a predecessor use that would now fall within Class E) for a continuous period of at least two years ending on the application date. These conditions are designed to prevent the conversion of actively trading commercial premises.",
          "The maximum floorspace that can be converted under a single Class MA prior approval application is 1,500 square metres. There is no minimum size threshold, which makes the class applicable to small shop units as well as sizeable office floors. However, LPAs have successfully argued that multiple simultaneous applications for the same building constitute an attempt to circumvent the cap, so developers planning to convert larger buildings in phases should take specialist planning advice.",
        ],
        bullets: [
          "Prior approval assessment covers: transport and highways, contamination, flooding, noise from commercial premises, and adequate natural light for all habitable rooms",
          "The council has 56 days to determine a prior approval application; failure to decide within this period means prior approval is deemed granted",
          "Buildings in flood zone 3 (high probability) are excluded from Class MA",
          "The development must create self-contained dwellinghouses (C3 use); HMOs or houses in multiple occupation cannot be delivered via Class MA",
          "External appearance: Class MA permits only minimal changes to the exterior; cladding, new windows or roofline alterations may require a separate application under Class A of Part 1",
        ],
      },
      {
        heading: "Class Q: Agricultural Buildings to Dwellinghouses",
        paragraphs: [
          "Class Q permits the conversion of existing agricultural buildings to residential use without full planning consent. It applies to buildings within an established agricultural unit that existed on or before 20 March 2013. The right is intended to support rural housing delivery and the repurposing of redundant farm buildings, but it carries a set of viability requirements that distinguish it from urban conversion routes.",
          "Under Class Q, the cumulative floorspace converted within a single agricultural unit is capped at 1,000 square metres. Up to five separate dwellinghouses can be created, with a maximum floor area of 465 square metres per dwelling. Larger dwellings (150–465 sqm) count as 'larger dwellings' and reduce the permitted number; smaller conversions under 100 sqm count as 'smaller dwellings'. The interplay between these categories determines the unit mix available on any given site.",
          "A critical limiting factor under Class Q is the requirement that the building is 'capable of functioning as a dwelling'. This phrase has been the subject of extensive appeal and case law. LPAs regularly refuse Class Q applications on the grounds that the structural works required amount to a 'rebuild' rather than a 'conversion', particularly where agricultural steel portal frame sheds have deteriorated or where masonry walls are structurally deficient. A structural engineer's report confirming the existing frame can be retained is essential evidence in any prior approval submission.",
        ],
        bullets: [
          "Agricultural unit must have been in agricultural use on or before 20 March 2013; buildings erected after this date are excluded",
          "No PD rights for listed buildings or buildings within a Site of Special Scientific Interest (SSSI)",
          "Prior approval assessment covers: transport, noise, contamination, flooding, whether the location or siting makes it impractical or undesirable for residential use, and design and external appearance",
          "Permitted operations under Class Q include: installation of windows, doors, roofs, insulation, utilities and drainage — but structural elements must largely be retained",
          "Class Q does not apply in National Parks, the Broads, or Areas of Outstanding Natural Beauty for larger dwellings (over 100 sqm)",
        ],
      },
      {
        heading: "Class AA: Upward Extensions to Residential Blocks",
        paragraphs: [
          "Class AA allows the addition of up to two new storeys on top of existing purpose-built blocks of flats, and up to one additional storey on detached houses built between 1 July 1948 and 5 March 2018. For residential developers, the most commercially relevant application is the extension of existing flatted blocks, which can deliver new units at substantially lower cost than ground-up construction by utilising existing foundations, common parts, and infrastructure.",
          "The prior approval assessment for Class AA is more extensive than for Class MA or Q, reflecting the visual and structural impact of upward extensions. The council will assess: the impact on the amenity of adjoining premises, the external appearance of the building, air traffic and defence asset safeguarding, and whether the development is structurally sound. Critically, neighbours of the building have the right to be notified and to make representations, which are then taken into account.",
          "Structural capacity is the primary technical risk under Class AA. The existing building must be capable of supporting the additional load without significant reinforcement. Modern concrete-frame blocks often have headroom; older masonry construction may not. A structural feasibility report from a specialist engineer should be commissioned before any prior approval application is submitted, as a refusal based on structural grounds can be difficult to challenge.",
        ],
        bullets: [
          "Maximum addition is two storeys for blocks of flats; one storey for detached houses",
          "The resulting building cannot exceed 30 metres in height",
          "New flats created must have the same or smaller footprint as the existing block; no cantilevers or significant footprint changes",
          "The building must have been in residential use as a block of flats since before 1 July 1948 or was purpose-built between that date and 5 March 2018",
          "Class AA cannot be used for buildings on Article 2(3) land (conservation areas, National Parks, AONBs, World Heritage Sites, the Broads)",
        ],
      },
      {
        heading: "Article 4 Directions and When Full Planning is Needed",
        paragraphs: [
          "An Article 4 Direction is a mechanism by which a local planning authority can withdraw specified PD rights in a defined geographical area. For Class MA conversions, Article 4 Directions are common in town centres, business parks, and enterprise zones where councils have identified a strategic need to protect employment land. Before committing to any PD strategy, developers must search the relevant LPA's website and the Planning Portal to identify whether an Article 4 Direction applies to the site.",
          "Full planning permission will always be required where the building is listed, where the site is within a World Heritage Site, and for certain types of conversion that fall outside the GPDO classes entirely. Conversions to HMOs (Use Class C4 or sui generis HMOs), for example, require full planning consent and are subject to additional Article 4 Directions in most university towns and cities. Similarly, converting a building into a care home, hotel, or student accommodation falls outside PD rights and requires a full application.",
          "Where PD rights do not apply or have been removed, a full planning application is not necessarily a dead end. Pre-application discussions with the LPA, a well-evidenced housing need argument, and a sensitive design approach can all improve the prospect of consent. However, the timeline, cost, and uncertainty of a full application must be factored into the development appraisal at the outset. Lenders providing development finance or bridging loans will require clarity on planning status before committing funds, and sites relying on a contested full planning application carry a materially higher risk profile than those with PD rights confirmed by a prior approval certificate.",
        ],
      },
    ],
  },
};
