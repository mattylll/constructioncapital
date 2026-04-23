/**
 * Town-Specific Market Data
 *
 * Structured local data for the top ~40 towns by development finance relevance.
 * This data is rendered as a unique content section on town pages, significantly
 * increasing per-page uniqueness above the ~35% baseline from regional content.
 *
 * Fields are factual and verifiable. Where approximate, values are marked as such.
 * Data should be updated periodically as market conditions change.
 */

export interface TownMarketData {
  /** Local planning authority name */
  planningAuthority: string;
  /** Average residential property price (approximate) */
  avgPropertyPrice: string;
  /** Population (approximate, from latest census) */
  population: string;
  /** Key development areas / regeneration zones */
  developmentHotspots: string[];
  /** Unique market characteristics (2-3 sentences) */
  marketInsight: string;
  /** Local demand drivers specific to this town */
  demandDrivers: string[];
  /** Average rental yield range for the area */
  rentalYieldRange: string;
  /** Custom overview paragraphs replacing the generic intro (optional) */
  overview?: string[];
  /** Custom service-page commentary keyed by service slug (optional) */
  serviceCommentary?: Record<string, string[]>;

  // ── Enrichment fields (optional) ──────────────────────────

  /** URL to the local planning authority's online planning portal */
  planningPortalUrl?: string;
  /** Community Infrastructure Levy rate info (if applicable) */
  cilRate?: string;
  /** S106 obligations overview for this area */
  s106Notes?: string;
  /** Whether the town centre or significant areas are in conservation zones */
  conservationAreas?: string[];
  /** Regional lender appetite commentary - what lenders look for here */
  lenderAppetite?: string;
}

/**
 * Keyed by `${countySlug}/${townSlug}` for O(1) lookup.
 */
export const TOWN_MARKET_DATA: Record<string, TownMarketData> = {
  // ─── LONDON & SOUTH EAST ────────────────────────────────

  "greater-london/london": {
    planningAuthority: "Various London Borough Councils",
    avgPropertyPrice: "£530,000",
    population: "8,800,000",
    developmentHotspots: [
      "Nine Elms and Battersea Power Station regeneration",
      "Stratford and Olympic Park legacy developments",
      "Old Kent Road opportunity area",
      "Barking Riverside new town",
      "Brent Cross Town regeneration",
    ],
    marketInsight:
      "London operates as dozens of distinct micro-markets rather than a single entity. Inner London schemes command premium GDVs but face higher land costs and complex planning. Outer London boroughs - particularly those along Crossrail and DLR extensions - offer the best development economics for mid-market residential schemes targeting first-time buyers and young professionals.",
    demandDrivers: [
      "Chronic housing undersupply across all 33 boroughs",
      "Crossrail and Overground extension catchment premiums",
      "Build-to-Rent institutional demand in Zone 2-4",
      "Permitted development office conversions in the City fringe",
    ],
    rentalYieldRange: "3.5-5.5%",
    planningPortalUrl: "https://www.london.gov.uk/programmes-strategies/planning",
    cilRate: "Varies by borough - typically £100-£400/sqm for residential in outer London, up to £400+/sqm in prime central",
    s106Notes: "Affordable housing typically 35% on-site (50% on public land). Boroughs negotiate viability-tested contributions on smaller schemes.",
    conservationAreas: ["Numerous across all boroughs - over 1,000 designated conservation areas across Greater London"],
    lenderAppetite: "Very strong across all lender types. Inner London attracts institutional and family office capital for £5m+ schemes. Outer London is popular with specialist lenders for sub-£5m residential developments. Exit route certainty is high given sustained buyer demand.",
  },

  "greater-london/croydon": {
    planningAuthority: "London Borough of Croydon",
    avgPropertyPrice: "£390,000",
    population: "390,000",
    developmentHotspots: [
      "Croydon town centre masterplan",
      "East Croydon station quarter",
      "Purley Way corridor",
    ],
    marketInsight:
      "Croydon is one of South London's most active development markets, with a major town centre regeneration programme creating opportunities for high-density residential schemes. Fast rail connections to Victoria and London Bridge (15 minutes) support commuter demand, while the Westfield development pipeline signals institutional confidence in the area's trajectory.",
    demandDrivers: [
      "Town centre regeneration masterplan",
      "Fast rail to Central London (15 min)",
      "Relative affordability vs inner London",
    ],
    rentalYieldRange: "4.5-5.5%",
  },

  "surrey/guildford": {
    planningAuthority: "Guildford Borough Council",
    avgPropertyPrice: "£550,000",
    population: "80,000",
    developmentHotspots: [
      "Guildford town centre regeneration",
      "North Street redevelopment",
      "Slyfield industrial estate regeneration",
    ],
    marketInsight:
      "Guildford combines premium residential values with strong demand from University of Surrey students and young professionals in the town's growing tech sector. The town centre redevelopment is creating mixed-use opportunities, while the surrounding villages offer boutique residential conversion projects with strong exit values.",
    demandDrivers: [
      "University of Surrey student and staff housing demand",
      "Tech sector employment growth",
      "Premium commuter belt location (34 min to Waterloo)",
    ],
    rentalYieldRange: "3.5-4.5%",
  },

  "kent/maidstone": {
    planningAuthority: "Maidstone Borough Council",
    avgPropertyPrice: "£350,000",
    population: "175,000",
    developmentHotspots: [
      "Maidstone East riverside quarter",
      "Springfield and Invicta barracks sites",
      "Lenham Heath garden community (planned)",
    ],
    marketInsight:
      "Maidstone is Kent's county town with a proactive approach to housing delivery. The local plan allocates significant sites for residential development, creating a pipeline of opportunities. HS1 connections via Maidstone East provide fast commuter access to London, supporting buyer demand from relocating professionals seeking more space.",
    demandDrivers: [
      "Local plan housing allocations",
      "HS1 commuter connectivity to London",
      "Affordability advantage over London and Medway",
    ],
    rentalYieldRange: "4.5-5.5%",
  },

  "essex/chelmsford": {
    planningAuthority: "Chelmsford City Council",
    avgPropertyPrice: "£390,000",
    population: "180,000",
    developmentHotspots: [
      "Chelmsford Garden Community (North East)",
      "Army & Navy roundabout regeneration",
      "Beaulieu Park new town",
    ],
    marketInsight:
      "Chelmsford achieved city status in 2012 and has been one of Essex's fastest-growing development markets since. The Chelmsford Garden Community is a strategic-scale housing delivery programme, while the city centre offers commercial-to-residential conversion opportunities. Strong schools and direct rail to Liverpool Street (35 min) drive family buyer demand.",
    demandDrivers: [
      "Garden Community strategic allocation",
      "Direct rail to Liverpool Street (35 min)",
      "City status and growing amenity base",
    ],
    rentalYieldRange: "4.0-5.0%",
  },

  // ─── NORTH WEST ──────────────────────────────────────────

  "greater-manchester/manchester": {
    planningAuthority: "Manchester City Council",
    avgPropertyPrice: "£250,000",
    population: "550,000",
    developmentHotspots: [
      "Victoria North (formerly Northern Gateway) - 15,000 homes",
      "Ancoats and New Islington urban village",
      "NOMA mixed-use regeneration",
      "Piccadilly/HS2 station quarter",
      "Salford Quays and MediaCityUK expansion",
    ],
    marketInsight:
      "Manchester has the UK's fastest-growing city centre population and the strongest residential development pipeline outside London. Build-to-Rent and co-living dominate the city centre, while surrounding boroughs offer traditional for-sale residential schemes at strong yields. The planned HS2 station at Piccadilly is expected to drive significant land value uplift in the eastern gateway.",
    demandDrivers: [
      "Fastest city-centre population growth in the UK",
      "HS2 Piccadilly station investment",
      "BBC, ITV, and tech sector MediaCityUK employment",
      "University cluster generating 100,000+ students",
    ],
    rentalYieldRange: "5.5-7.5%",
  },

  "greater-manchester/salford": {
    planningAuthority: "Salford City Council",
    avgPropertyPrice: "£220,000",
    population: "270,000",
    developmentHotspots: [
      "MediaCityUK Phase 2 expansion",
      "Salford Crescent and University district",
      "Greengate and Chapel Street regeneration",
    ],
    marketInsight:
      "Salford's MediaCityUK has transformed the city into a major employment hub, with BBC, ITV, dock10, and a growing cluster of tech companies. Residential demand from media professionals has driven development across Salford Quays, while the Greengate area offers city-centre-adjacent opportunities at lower land values than Manchester's core.",
    demandDrivers: [
      "MediaCityUK employment cluster",
      "University of Salford expansion",
      "City-centre adjacency at lower land costs",
    ],
    rentalYieldRange: "5.5-7.0%",
  },

  "lancashire/preston": {
    planningAuthority: "Preston City Council",
    avgPropertyPrice: "£170,000",
    population: "145,000",
    developmentHotspots: [
      "Preston City Centre masterplan",
      "UCLan (University of Central Lancashire) campus expansion",
      "Preston Western Distributor road corridor",
    ],
    marketInsight:
      "Preston offers some of the strongest rental yields in the North West, driven by the University of Central Lancashire's 30,000+ student population and the city's role as Lancashire's administrative centre. Affordable property prices create attractive entry points for developers, with HMO conversions and student accommodation delivering yields consistently above 8%.",
    demandDrivers: [
      "UCLan student population (30,000+)",
      "Lancashire administrative centre",
      "Strong rental yields relative to acquisition costs",
    ],
    rentalYieldRange: "6.5-9.0%",
  },

  "merseyside/liverpool": {
    planningAuthority: "Liverpool City Council",
    avgPropertyPrice: "£180,000",
    population: "500,000",
    developmentHotspots: [
      "Liverpool Waters - £5.5bn waterfront regeneration",
      "Baltic Triangle creative quarter",
      "Knowledge Quarter and Paddington Village",
      "Ten Streets creative district",
    ],
    marketInsight:
      "Liverpool is experiencing its most significant development cycle in decades, anchored by the £5.5bn Liverpool Waters scheme and the wider city centre regeneration programme. Rental yields are among the highest of any UK city, making completed developments attractive as retained investments. The Knowledge Quarter around the Royal Liverpool Hospital is creating a new employment node that supports residential demand.",
    demandDrivers: [
      "Liverpool Waters £5.5bn regeneration",
      "Three major universities with 60,000+ students",
      "Highest rental yields of any major UK city",
    ],
    rentalYieldRange: "6.0-8.5%",
  },

  // ─── MIDLANDS ────────────────────────────────────────────

  "west-midlands/birmingham": {
    planningAuthority: "Birmingham City Council",
    avgPropertyPrice: "£230,000",
    population: "1,150,000",
    developmentHotspots: [
      "Smithfield - 17-acre city centre regeneration",
      "Digbeth creative quarter",
      "Perry Barr (former Commonwealth Games village)",
      "Curzon Street HS2 station quarter",
      "Eastside city park and surrounding development",
    ],
    marketInsight:
      "Birmingham is the UK's largest regional city and is undergoing a transformation driven by HS2, the Commonwealth Games legacy, and a massive city centre development pipeline. The HS2 Curzon Street station will reduce travel times to London to 49 minutes, driving significant land value appreciation in the eastern city centre. Digbeth is emerging as a creative hub attracting tech companies and young professionals.",
    demandDrivers: [
      "HS2 Curzon Street station (London in 49 min)",
      "Commonwealth Games legacy developments",
      "Five universities with 80,000+ students",
      "Digbeth/Eastside creative sector growth",
    ],
    rentalYieldRange: "5.0-7.0%",
  },

  "nottinghamshire/nottingham": {
    planningAuthority: "Nottingham City Council",
    avgPropertyPrice: "£200,000",
    population: "330,000",
    developmentHotspots: [
      "Broadmarsh centre redevelopment",
      "Island Quarter - Nottingham's largest regeneration",
      "Sneinton Market creative quarter",
    ],
    marketInsight:
      "Nottingham combines a large student population (60,000+ across two universities) with a growing professional employment base, creating strong rental demand. The Broadmarsh area redevelopment is transforming the southern city centre, while the Island Quarter represents the city's single largest development opportunity. Property prices remain accessible, supporting development viability.",
    demandDrivers: [
      "Two major universities with 60,000+ students",
      "BioCity and life sciences employment",
      "City centre regeneration momentum",
    ],
    rentalYieldRange: "5.5-7.5%",
  },

  "leicestershire/leicester": {
    planningAuthority: "Leicester City Council",
    avgPropertyPrice: "£220,000",
    population: "370,000",
    developmentHotspots: [
      "Waterside regeneration zone",
      "Leicester Space Park and Pioneer Park",
      "Ashton Green sustainable urban extension",
    ],
    marketInsight:
      "Leicester benefits from its central location on the M1 corridor, strong university sector (University of Leicester and De Montfort University), and a diverse economy. The Waterside regeneration is creating new residential development opportunities along the River Soar corridor. The city's textile heritage provides a stock of characterful industrial buildings suitable for conversion.",
    demandDrivers: [
      "Two universities with 40,000+ students",
      "M1 corridor connectivity",
      "Space and technology sector growth",
    ],
    rentalYieldRange: "5.5-7.0%",
  },

  // ─── SOUTH WEST ──────────────────────────────────────────

  "bristol/bristol": {
    planningAuthority: "Bristol City Council",
    avgPropertyPrice: "£350,000",
    population: "470,000",
    developmentHotspots: [
      "Temple Quarter - 130-acre city centre regeneration",
      "Western Harbour dockside development",
      "Bedminster Green urban village",
      "Filton Airfield new neighbourhood (2,675 homes)",
    ],
    marketInsight:
      "Bristol is consistently ranked as the UK's most competitive regional city for tech employment, supporting premium residential demand that has pushed average values well above the national average. Temple Quarter is the city's flagship regeneration programme, while Western Harbour will create a new waterfront neighbourhood. Developers face competitive land markets but achieve strong exit values.",
    demandDrivers: [
      "UK's largest tech employment centre outside London",
      "Two Russell Group universities",
      "Temple Quarter 130-acre regeneration",
      "Strong lifestyle appeal driving relocation demand",
    ],
    rentalYieldRange: "4.5-6.0%",
  },

  "devon/exeter": {
    planningAuthority: "Exeter City Council",
    avgPropertyPrice: "£310,000",
    population: "130,000",
    developmentHotspots: [
      "Exeter Science Park",
      "Cranbrook new community",
      "Water Lane urban village",
    ],
    marketInsight:
      "Exeter's growing reputation as a biomedical and technology hub is driving employment growth and residential demand. The Met Office and University of Exeter anchor a knowledge economy that attracts young professionals. Cranbrook, one of the UK's first new towns in a generation, is creating large-scale residential development opportunities on the eastern fringe.",
    demandDrivers: [
      "Met Office and biomedical sector employment",
      "University of Exeter growth",
      "Cranbrook new town housing delivery",
    ],
    rentalYieldRange: "4.5-5.5%",
  },

  // ─── YORKSHIRE & NORTH EAST ──────────────────────────────

  "west-yorkshire/leeds": {
    planningAuthority: "Leeds City Council",
    avgPropertyPrice: "£230,000",
    population: "800,000",
    developmentHotspots: [
      "South Bank - 253-acre city centre regeneration",
      "SOYO cultural quarter",
      "Kirkstall Forge and Aire Valley",
      "Leeds Innovation District",
    ],
    marketInsight:
      "Leeds is the UK's largest financial centre outside London, with a legal and professional services sector that drives strong demand for city-centre apartments and commuter-belt family housing. South Bank is one of the largest city-centre regeneration programmes in Europe, creating a new neighbourhood south of the River Aire with capacity for 8,000 new homes and 35,000 new jobs.",
    demandDrivers: [
      "UK's largest financial centre outside London",
      "South Bank 253-acre regeneration (8,000 homes)",
      "Three universities with 65,000+ students",
      "Channel 4 national HQ relocation",
    ],
    rentalYieldRange: "5.5-7.5%",
  },

  "south-yorkshire/sheffield": {
    planningAuthority: "Sheffield City Council",
    avgPropertyPrice: "£195,000",
    population: "560,000",
    developmentHotspots: [
      "Heart of the City II regeneration",
      "West Bar Square mixed-use quarter",
      "Sheffield Olympic Legacy Park",
      "Kelham Island creative quarter",
    ],
    marketInsight:
      "Sheffield combines affordable property prices with strong rental demand from two major universities and the city's advanced manufacturing and digital sectors. Kelham Island has transformed from an industrial area into one of the UK's most desirable urban neighbourhoods, demonstrating the city's regeneration potential. Heart of the City II is bringing new retail, leisure, and residential to the core.",
    demandDrivers: [
      "Two universities with 60,000+ students",
      "Advanced Manufacturing Research Centre (AMRC)",
      "Kelham Island creative neighbourhood success",
    ],
    rentalYieldRange: "5.5-7.5%",
  },

  "tyne-and-wear/newcastle": {
    planningAuthority: "Newcastle City Council",
    avgPropertyPrice: "£195,000",
    population: "300,000",
    developmentHotspots: [
      "Quayside and East Quayside regeneration",
      "Helix innovation district",
      "Stephenson Quarter",
      "Forth Yards development",
    ],
    marketInsight:
      "Newcastle's compact city centre and strong university sector create concentrated rental demand that supports attractive development yields. The Helix innovation district - on the former Scottish & Newcastle brewery site - is creating a new knowledge economy hub, while the Quayside and Ouseburn Valley offer characterful conversion opportunities. Land values remain accessible, supporting development viability.",
    demandDrivers: [
      "Two major universities with 50,000+ students",
      "Helix innovation district",
      "Growing digital and tech sector",
      "Strong rental yields in compact city centre",
    ],
    rentalYieldRange: "6.0-8.0%",
  },

  // ─── EAST OF ENGLAND ─────────────────────────────────────

  "cambridgeshire/cambridge": {
    planningAuthority: "Cambridge City Council / South Cambridgeshire",
    avgPropertyPrice: "£500,000",
    population: "145,000",
    developmentHotspots: [
      "Cambridge North station quarter",
      "Eddington (North West Cambridge)",
      "Cambridge Biomedical Campus expansion",
      "Cambridge South station (planned)",
    ],
    marketInsight:
      "Cambridge's tech and biotech sectors make it one of the UK's strongest micro-markets for residential development. Extreme supply constraints within the city push values to near-London levels, while new strategic developments at Eddington and around Cambridge North station are creating volume residential opportunities. The planned Cambridge South station will unlock the biomedical campus area for residential development.",
    demandDrivers: [
      "Global tech and biotech employment cluster",
      "University of Cambridge ecosystem",
      "Extreme housing supply constraints",
      "Oxford-Cambridge Arc government investment",
    ],
    rentalYieldRange: "3.5-5.0%",
  },

  "norfolk/norwich": {
    planningAuthority: "Norwich City Council",
    avgPropertyPrice: "£240,000",
    population: "145,000",
    developmentHotspots: [
      "East Norwich masterplan (4,000+ homes)",
      "Anglia Square regeneration",
      "Norwich Research Park expansion",
    ],
    marketInsight:
      "Norwich is a compact cathedral city with a strong independent economy, an established university sector, and the East Norwich masterplan creating one of the largest brownfield development opportunities in the East of England. The city's relative isolation from other major centres creates a self-contained market with reliable local demand.",
    demandDrivers: [
      "University of East Anglia (UEA)",
      "East Norwich masterplan (4,000+ homes)",
      "Norwich Research Park employment",
    ],
    rentalYieldRange: "5.0-6.5%",
  },

  // ─── SCOTLAND ────────────────────────────────────────────

  "edinburgh/edinburgh": {
    planningAuthority: "City of Edinburgh Council",
    avgPropertyPrice: "£310,000",
    population: "530,000",
    developmentHotspots: [
      "Edinburgh BioQuarter expansion",
      "Granton Waterfront regeneration (3,500 homes)",
      "West Edinburgh (Edinburgh Gateway corridor)",
      "Fountainbridge and Union Canal corridor",
    ],
    marketInsight:
      "Edinburgh is the UK's strongest rental market outside London, with year-round demand from festivals, tourism, students, and a growing financial services sector. Supply constraints within the UNESCO World Heritage boundary push development to outer areas, where Granton Waterfront and West Edinburgh are creating new residential neighbourhoods. Scottish legal requirements (Standard Securities, separate title system) require lenders with specific Scottish capability.",
    demandDrivers: [
      "UK's strongest rental market outside London",
      "Four universities with 60,000+ students",
      "Financial services and tech employment growth",
      "Tourism and festival economy",
    ],
    rentalYieldRange: "4.5-6.5%",
  },

  "glasgow/glasgow": {
    planningAuthority: "Glasgow City Council",
    avgPropertyPrice: "£170,000",
    population: "635,000",
    developmentHotspots: [
      "Barras Art and Design (BAaD) quarter",
      "Pacific Quay and Glasgow Harbour",
      "Sighthill transformational regeneration area",
      "Collegelands Innovation District",
    ],
    marketInsight:
      "Glasgow offers the strongest development economics of any major Scottish city: accessible land values, competitive build costs, and rental yields that significantly outperform Edinburgh. The city's extensive regeneration programme - from Sighthill to the Clyde waterfront - is creating large-scale residential development opportunities. Glasgow's four universities generate consistent student housing demand.",
    demandDrivers: [
      "Four universities with 70,000+ students",
      "Largest city centre in Scotland by area",
      "Extensive regeneration programme",
      "Strong rental yields relative to acquisition costs",
    ],
    rentalYieldRange: "6.0-8.0%",
  },

  // ─── WALES ───────────────────────────────────────────────

  "cardiff/cardiff": {
    planningAuthority: "Cardiff Council",
    avgPropertyPrice: "£260,000",
    population: "365,000",
    developmentHotspots: [
      "Cardiff Bay continued regeneration",
      "Central Square business district",
      "Atlantic Wharf redevelopment",
      "Plasdwr garden city (7,000 homes)",
    ],
    marketInsight:
      "Cardiff is Wales's capital and by far its most active development market. The city centre has been transformed by the Central Square development (BBC Wales HQ) and ongoing Cardiff Bay investment. Plasdwr, a 7,000-home garden city on the western fringe, represents one of the UK's largest residential-led developments. Help to Buy Wales supports first-time buyer demand, improving scheme viability.",
    demandDrivers: [
      "Welsh Government capital city investment",
      "Three universities with 50,000+ students",
      "Help to Buy Wales demand support",
      "BBC Wales and media sector employment",
    ],
    rentalYieldRange: "5.0-7.0%",
  },

  // ─── ADDITIONAL HIGH-TRAFFIC TOWNS ───────────────────────

  "hampshire/southampton": {
    planningAuthority: "Southampton City Council",
    avgPropertyPrice: "£250,000",
    population: "260,000",
    developmentHotspots: [
      "Itchen Riverside regeneration",
      "Bargate Quarter redevelopment",
      "Royal Pier Waterfront",
    ],
    marketInsight:
      "Southampton is Hampshire's largest city with a diversified economy driven by the port, marine industries, and two major universities. The city centre has significant brownfield regeneration potential, with the Itchen Riverside and Royal Pier Waterfront schemes creating new residential neighbourhoods. Student housing demand from the University of Southampton (25,000+ students) supports HMO and PBSA development.",
    demandDrivers: [
      "Two universities with 40,000+ students",
      "Port and marine employment",
      "City centre regeneration pipeline",
    ],
    rentalYieldRange: "5.0-6.5%",
  },

  "oxfordshire/oxford": {
    planningAuthority: "Oxford City Council",
    avgPropertyPrice: "£480,000",
    population: "155,000",
    developmentHotspots: [
      "Oxford North (formerly Northern Gateway)",
      "Oxpens and Osney Mead redevelopment",
      "Barton Park (885 homes)",
    ],
    marketInsight:
      "Oxford's global university brand, biomedical research sector, and extreme housing supply constraints create one of the UK's most undersupplied housing markets. Development sites within the city are scarce and planning is complex, but achievable values are premium. Oxford North is the city's most significant new development quarter, bringing employment-led mixed-use to the northern edge.",
    demandDrivers: [
      "University of Oxford ecosystem",
      "Biomedical and tech research employment",
      "Extreme housing supply constraints",
      "Oxford-Cambridge Arc investment",
    ],
    rentalYieldRange: "3.5-5.0%",
  },

  "west-yorkshire/bradford": {
    planningAuthority: "City of Bradford Metropolitan District Council",
    avgPropertyPrice: "£150,000",
    population: "540,000",
    developmentHotspots: [
      "City Village regeneration (previously Odeon Quarter)",
      "One City Park development",
      "Bradford Live (formerly Odeon) entertainment venue",
    ],
    marketInsight:
      "Bradford offers some of the most accessible entry points for property development in the UK, with land and property values significantly below nearby Leeds. The city's young, growing population drives housing demand, while the University of Bradford supports student accommodation investment. Regeneration momentum is building, with Bradford's 2025 UK City of Culture status acting as a catalyst.",
    demandDrivers: [
      "UK's youngest city by average age",
      "UK City of Culture legacy",
      "Significant price differential vs Leeds (15 min away)",
    ],
    rentalYieldRange: "7.0-9.5%",
  },

  "cheshire/chester": {
    planningAuthority: "Cheshire West and Chester Council",
    avgPropertyPrice: "£300,000",
    population: "130,000",
    developmentHotspots: [
      "Chester Northgate development",
      "Chester Business Quarter",
      "Garden Quarter (former military barracks)",
    ],
    marketInsight:
      "Chester combines heritage appeal with strong professional employment from the financial services and legal sectors. The city's Roman walls and conservation area create planning complexity but also premium values for sensitively designed schemes. The Northgate development is transforming the city centre's commercial offer, while the Garden Quarter is delivering high-quality residential on the former military site.",
    demandDrivers: [
      "Financial and professional services employment",
      "Heritage tourism economy",
      "North Wales commuter catchment",
    ],
    rentalYieldRange: "4.5-6.0%",
  },

  "north-yorkshire/york": {
    planningAuthority: "City of York Council",
    avgPropertyPrice: "£320,000",
    population: "210,000",
    developmentHotspots: [
      "York Central - 45-hectare brownfield regeneration",
      "Castle Gateway and Foss Basin",
      "University of York campus expansion",
    ],
    marketInsight:
      "York combines premium residential values with a constrained development market - the city's heritage status, Green Belt, and flood risk areas limit available sites. York Central, a 45-hectare brownfield site next to the station, represents one of the largest city-centre development opportunities in the UK. The University of York's continued expansion supports purpose-built student accommodation demand.",
    demandDrivers: [
      "York Central 45-hectare brownfield opportunity",
      "Tourism economy (8M+ visitors/year)",
      "Two universities",
      "Premium residential market",
    ],
    rentalYieldRange: "4.5-6.0%",
  },

  "hertfordshire/st-albans": {
    planningAuthority: "St Albans City and District Council",
    avgPropertyPrice: "£615,000",
    population: "150,000",
    overview: [
      "St Albans is a premium commuter city with cathedral heritage, outstanding schools, and a 20-minute Thameslink service into St Pancras. Median property prices sit around £615,000 - significantly above the national average - driven by persistent buyer demand and constrained supply across a heavily Green Belt district.",
      "For developers, the opportunity here lies in conversion and infill. With extensive conservation area coverage across the city centre and tight Green Belt boundaries, new-build land is scarce. The strongest returns come from office-to-residential permitted development, sensitive heritage conversions, and previously developed sites on corridors like Hatfield Road and Victoria Street.",
      "Whether you're financing a prior approval scheme, a boutique new-build, or a commercial-to-residential conversion, we connect you with lenders who understand the St Albans market and can structure funding around the planning realities of this high-value district.",
    ],
    developmentHotspots: [
      "City centre infill and conversion (St Peters/Hatfield Road corridor)",
      "Oaklands and Cell Barnes new-build developments",
      "Office-to-residential conversions along Victoria Street",
      "Green Belt edge sites near London Colney and Chiswell Green",
    ],
    marketInsight:
      "St Albans combines cathedral-city heritage with premium London commuter demand - 20 minutes to St Pancras via Thameslink. The district is one of the most restrictive in Hertfordshire, with Green Belt covering much of the area and extensive conservation area constraints across the city centre. Development opportunity concentrates on prior approval conversions, infill sites, and previously developed land. Strong buyer demand keeps absorption rates high, but build costs in the Home Counties run 10-15% above national averages.",
    demandDrivers: [
      "Thameslink connectivity (20 min to St Pancras)",
      "Outstanding state and private schools",
      "Cathedral city heritage and lifestyle appeal",
      "Strong rental market from young professionals and families",
      "Limited new supply driving premium pricing",
    ],
    rentalYieldRange: "3.5-4.5%",
    serviceCommentary: {
      "development-finance": [
        "St Albans sits in one of the most constrained planning districts in the Home Counties, with Green Belt coverage limiting new-build land supply and conservation area restrictions shaping what can be built in the city centre. For developers who can navigate these constraints, the rewards are significant - median property prices around £615,000 support strong GDV assumptions, and absorption rates remain high thanks to persistent commuter demand from the Thameslink corridor.",
        "The typical development finance deal here isn't a large greenfield estate - it's a 4–12 unit infill scheme on previously developed land, a prior approval office conversion on Victoria Street or Hatfield Road, or a sensitive new-build within the conservation area. Senior lenders are comfortable with St Albans risk profiles, but the planning complexity means your funding partner needs to understand heritage constraints, Section 106 obligations, and the longer timelines that come with conservation area applications.",
        "We structure development finance for St Albans schemes from £500k to £15M+, typically at 60–70% LTGDV with rates from 6.5% p.a. Build cost assumptions in this district run 10–15% above national averages - lenders familiar with Hertfordshire factor this into their appraisals, which is why working with a broker who knows the local lending landscape matters.",
      ],
      "mezzanine-finance": [
        "In a high-value market like St Albans - where land costs are elevated and build specifications need to match buyer expectations - the equity requirement on a development can tie up significant capital. Mezzanine finance bridges the gap between the 60–65% that a senior lender will typically advance and the 85–90% total leverage that frees you to pursue multiple schemes simultaneously.",
        "The intercreditor relationship is the structural foundation of any mezzanine deal. Not every senior lender operating in Hertfordshire will accept subordinated debt behind their facility, and those that do require an approved intercreditor agreement governing priorities in a default scenario. We work with both parties to ensure the capital stack is structurally sound - this is particularly important in St Albans where scheme timelines can extend due to conservation area and listed building consent processes.",
        "With median semi-detached prices at £740,000 and detached values approaching £950,000, even a modest 6-unit scheme in St Albans can carry a GDV north of £4M. At those numbers, the difference between 65% and 85% leverage represents over £800,000 of equity released back to your balance sheet. Mezzanine pricing - typically 12–18% p.a. - reflects its subordinated position, but the blended cost across your full capital stack is often lower than alternatives that achieve similar leverage.",
      ],
      "bridging-loans": [
        "Speed matters in St Albans. With limited development land and strong buyer competition, auction purchases and off-market opportunities don't wait for conventional mortgage timelines. Bridging finance lets you secure a site in 7–14 days, whether you're acquiring a commercial building for permitted development conversion, a period property for refurbishment, or a development plot before planning is determined.",
        "The typical bridging scenario here involves acquiring a property or site while your planning application or prior approval is being processed. St Albans' conservation area coverage and Green Belt constraints mean that planning timelines can be longer than neighbouring districts - a 12-month bridge with extension options gives you the runway to navigate the process without pressure-selling if consent takes longer than expected.",
        "With property values averaging £615,000 and detached homes regularly exceeding £950,000, St Albans assets provide strong security for bridging lenders. We arrange bridges from £150k to £10M+ at rates from 0.55% per month, with LTVs up to 75% of current value. Exit strategies typically involve either refinancing onto development finance once planning is secured, or sale of the completed/refurbished property.",
      ],
      "equity-jv": [
        "St Albans' premium values and constrained supply make it an attractive market for equity partners and JV investors. Family offices and institutional investors are drawn to the district's fundamentals - strong commuter demand, high buyer quality, and limited competing supply - while developers benefit from 90–100% funding of project costs in exchange for a profit share.",
        "The typical equity JV structure in this market involves the developer contributing the site (often acquired with bridging finance) and their development expertise, while the equity partner funds build costs and potentially the land. Profit splits vary - commonly 50/50 to 70/30 in the developer's favour - depending on the risk profile and your track record. For St Albans schemes, the investor appetite is strong: the combination of £615,000+ median prices and high absorption rates reduces the sales risk that equity partners are most concerned about.",
        "We connect St Albans developers with equity sources including family offices, property funds, and high-net-worth individuals. Whether you're looking for a JV partner on a single scheme or a programmatic arrangement to roll across multiple sites in Hertfordshire, we structure the deal to align incentives and protect both parties through the development cycle.",
      ],
      "refurbishment-finance": [
        "St Albans' housing stock includes a significant proportion of period and post-war properties, many within conservation areas, creating a steady pipeline of refurbishment opportunities. From light cosmetic upgrades to heavy structural refurbishments of listed buildings, the uplift potential in this market is compelling - a well-executed refurb can add 20–30% to the value of a property where the median already sits at £615,000.",
        "The key distinction in St Albans is between light and heavy refurbishment finance. Light refurb - cosmetic works, new kitchens and bathrooms, redecorating - typically draws rates from 0.55% per month with faster completion. Heavy refurb involving structural works, extensions, or change of use (particularly HMO conversions, which are increasingly popular near the city centre) attracts higher rates but funds a wider scope of work including construction contingencies.",
        "Conservation area and listed building constraints in central St Albans add complexity to refurbishment projects - materials specifications, window designs, and facade treatments all need to meet heritage requirements. Lenders experienced in Hertfordshire understand these constraints and build them into their appraisals. We match your project with funders who won't be surprised by the additional costs and timelines that heritage refurbishment demands.",
      ],
      "commercial-mortgages": [
        "St Albans' commercial property market benefits from the same fundamentals that drive residential values - excellent transport links, affluent catchment, and a thriving city centre anchored by the cathedral and market. Office space, retail units on St Peters Street and the surrounding lanes, and mixed-use properties all attract investor interest, with yields typically ranging from 3.5–5.5% depending on asset class and covenant strength.",
        "For investors holding or acquiring commercial property in the district, long-term mortgage finance provides stable, predictable leverage. We arrange commercial mortgages from £250k to £25M+ on offices, retail, industrial, and mixed-use assets across St Albans and the wider Hertfordshire area. Typical terms run 5–25 years at rates from 5.5% p.a., with LTVs up to 75%.",
        "The emerging opportunity in St Albans is the conversion of commercial space - particularly offices that don't meet modern occupier requirements - into residential under permitted development rights. If you're holding a commercial asset with conversion potential, we can structure a commercial mortgage that reflects the underlying residential value while you pursue the planning pathway.",
      ],
      "development-exit-finance": [
        "Development exit finance replaces your development facility once construction is substantially complete, giving you breathing room to sell completed units at the best price rather than under pressure from a maturing loan. In St Albans, where individual unit values are high and buyers are discerning, the difference between a pressured and a patient sale can be tens of thousands of pounds per unit.",
        "The economics are straightforward: your development lender is charging 7–10% p.a. on the full facility while you're selling down. An exit facility at 0.55–0.75% per month on the remaining balance - which reduces as each unit sells - dramatically cuts your monthly interest bill during the sales period. On a 6-unit St Albans scheme with a GDV of £4M+, the interest saving alone can exceed £100,000 over a 6–9 month sales period.",
        "We arrange development exit facilities from £500k to £15M+ with LTVs up to 75% of the completed value. Drawdown is typically within 2–4 weeks of practical completion, allowing a seamless transition from your development lender. The facility reduces automatically as units sell, so you're never paying interest on capital you don't need.",
      ],
    },
  },
};

/**
 * Enrichment data - planning portal URLs, CIL/S106 info, conservation areas,
 * and lender appetite commentary.  Kept separate from the base records for
 * maintainability; merged at read time via `getTownMarketData`.
 */
const ENRICHMENT: Record<string, Partial<TownMarketData>> = {
  "greater-london/croydon": {
    planningPortalUrl: "https://www.croydon.gov.uk/planning-and-regeneration/planning",
    cilRate: "£120/sqm for residential (Zone B), £0 in the Croydon Opportunity Area for affordable housing schemes",
    s106Notes: "35% affordable housing requirement on major schemes (10+ units). Viability-tested reductions possible on brownfield and regeneration sites.",
    conservationAreas: ["Central Croydon (Church Street area)", "South End and Park Hill", "Addiscombe"],
    lenderAppetite: "Good appetite from specialist lenders for £1-5m residential schemes. Croydon's regeneration story is well understood. Some lenders cautious on high-rise given the Brick by Brick history - mid-rise schemes attract wider interest.",
  },
  "surrey/guildford": {
    planningPortalUrl: "https://www.guildford.gov.uk/planning",
    cilRate: "£573/sqm in town centre rising to £763/sqm in the wider borough for residential",
    s106Notes: "40% affordable housing on sites of 10+ units. High CIL rates reflect premium values but compress development margins.",
    conservationAreas: ["Guildford Town Centre", "Onslow Village", "Stoke Park"],
    lenderAppetite: "Strong appetite across all lender types. Premium Surrey location with reliable exit values. Family offices and banks comfortable with schemes up to £10m+. Conservation area sites require lenders comfortable with heritage risk.",
  },
  "kent/maidstone": {
    planningPortalUrl: "https://www.maidstone.gov.uk/home/primary-services/planning-and-building",
    cilRate: "£120/sqm for residential in Zone A (urban), £160/sqm in Zone B (rural/suburban)",
    s106Notes: "30% affordable housing on major schemes. Education and healthcare contributions typically required on family housing developments.",
    conservationAreas: ["Maidstone Town Centre", "Loose Village", "Teston"],
    lenderAppetite: "Good appetite from specialist and challenger lenders. Maidstone's strong housing delivery track record gives lenders confidence in planning. Schemes near HS1 stations attract premium interest from London-based lenders.",
  },
  "essex/chelmsford": {
    planningPortalUrl: "https://www.chelmsford.gov.uk/planning-and-building-control/",
    cilRate: "£168/sqm for residential in the urban area, higher in rural zones",
    s106Notes: "35% affordable housing on major schemes. Healthcare and education contributions typically required. Garden Community sites have bespoke S106 frameworks.",
    conservationAreas: ["Chelmsford City Centre", "Great Baddow", "Writtle Village"],
    lenderAppetite: "Strong appetite from mainstream and specialist lenders. Chelmsford's city status and direct rail link to Liverpool Street support reliable exit values. Garden Community sites attract larger lenders comfortable with phased drawdown.",
  },
  "greater-manchester/manchester": {
    planningPortalUrl: "https://www.manchester.gov.uk/info/200074/planning",
    cilRate: "No CIL adopted - Manchester relies on S106 contributions",
    s106Notes: "20% affordable housing on new developments (subject to viability). Manchester's no-CIL position makes it more developer-friendly than many comparable cities.",
    conservationAreas: ["Ancoats", "Castlefield", "Albert Square", "Stevenson Square", "St Ann's Square"],
    lenderAppetite: "Excellent appetite across all lender types. Manchester is the most active regional lending market in the UK. Banks, funds, and specialist lenders all compete for Manchester deals. BTR schemes attract institutional forward-funding. Maximum appetite typically £50m+ from large funds.",
  },
  "greater-manchester/salford": {
    planningPortalUrl: "https://www.salford.gov.uk/planning-building-and-regeneration/",
    cilRate: "No CIL adopted - Salford uses S106 contributions",
    s106Notes: "20% affordable housing target. MediaCityUK and Salford Quays have specific planning frameworks with negotiated contributions.",
    conservationAreas: ["Worsley Village", "Peel Green", "Kersal Dale"],
    lenderAppetite: "Strong appetite, benefiting from Manchester market spillover. MediaCityUK-adjacent schemes particularly attractive to lenders. Land values lower than Manchester core make development economics compelling for specialist lenders.",
  },
  "lancashire/preston": {
    planningPortalUrl: "https://www.preston.gov.uk/article/1276/Planning",
    cilRate: "No CIL adopted",
    s106Notes: "30% affordable housing on major schemes. Preston's community wealth building model means S106 contributions are actively negotiated.",
    lenderAppetite: "Specialist lenders dominate. Strong yields attract investors but exit route needs demonstrating - lenders want evidence of buyer/tenant demand. Student housing schemes near UCLan campus attract dedicated PBSA lenders.",
  },
  "merseyside/liverpool": {
    planningPortalUrl: "https://liverpool.gov.uk/planning-and-building-control/",
    cilRate: "No CIL adopted - Liverpool uses S106 and planning obligations",
    s106Notes: "20% affordable housing target (subject to viability). Liverpool Waters has a bespoke planning framework with reduced obligations to incentivise regeneration.",
    conservationAreas: ["Stanley Dock", "Duke Street/Bold Street", "Castle Street", "William Brown Street"],
    lenderAppetite: "Good appetite from specialist and challenger lenders. Liverpool's high yields attract investment-focused developers. Baltic Triangle and city centre schemes well understood. Some mainstream lenders remain cautious - specialist lenders dominate sub-£5m deals.",
  },
  "west-midlands/birmingham": {
    planningPortalUrl: "https://www.birmingham.gov.uk/planning",
    cilRate: "£69/sqm for residential in the city centre, £26/sqm in other areas",
    s106Notes: "35% affordable housing on major schemes (20% in the city centre subject to viability). HS2 and Smithfield developments have bespoke planning frameworks.",
    conservationAreas: ["Jewellery Quarter", "Colmore Row and Environs", "Moseley", "Bournville"],
    lenderAppetite: "Excellent appetite - Birmingham is the UK's second-strongest regional lending market after Manchester. HS2 narrative drives mainstream lender interest. Curzon Street and Digbeth schemes attract institutional capital. Broad range of lenders from £500k specialist facilities to £50m+ institutional tickets.",
  },
  "nottinghamshire/nottingham": {
    planningPortalUrl: "https://www.nottinghamcity.gov.uk/planning-and-building-control/",
    cilRate: "No CIL currently in force - under review",
    s106Notes: "20% affordable housing on major schemes (subject to viability). Broadmarsh area has specific regeneration incentives.",
    conservationAreas: ["Lace Market", "The Park", "Sneinton Market"],
    lenderAppetite: "Specialist lenders active for student housing and BTR. Island Quarter is attracting institutional interest. Mainstream bank appetite growing as the city centre regenerates. Lenders want to see strong pre-let or pre-sale evidence on for-sale schemes.",
  },
  "leicestershire/leicester": {
    planningPortalUrl: "https://www.leicester.gov.uk/planning-and-building/",
    cilRate: "No CIL adopted - uses S106 contributions",
    s106Notes: "20% affordable housing on major schemes. Waterside regeneration zone has reduced S106 requirements to incentivise development.",
    conservationAreas: ["New Walk", "Castle Gardens/St Mary de Castro", "Market Place"],
    lenderAppetite: "Specialist lenders dominate. Strong yields and affordable land attract northern-focused lenders. Student housing schemes well understood by PBSA specialists. Space Park and technology corridor beginning to attract wider lender interest.",
  },
  "bristol/bristol": {
    planningPortalUrl: "https://www.bristol.gov.uk/planning-and-building-regulations/planning-applications",
    cilRate: "£100/sqm in the inner urban area, £50/sqm in central Bristol",
    s106Notes: "40% affordable housing on major schemes - one of the highest requirements in England. Viability challenges common on brownfield sites. Bristol's affordable housing policy is frequently tested at appeal.",
    conservationAreas: ["Clifton", "Redcliffe", "King Street", "Hotwells", "Montpelier"],
    lenderAppetite: "Strong appetite from all lender types. Bristol's premium values and tech economy attract mainstream banks and institutional capital. Temple Quarter schemes command significant interest. Bedminster and South Bristol emerging - specialist lenders ahead of the curve here.",
  },
  "devon/exeter": {
    planningPortalUrl: "https://exeter.gov.uk/planning-services/",
    cilRate: "£125/sqm for residential development",
    s106Notes: "35% affordable housing on major schemes. Cranbrook has a bespoke contributions framework including community infrastructure and SANGS.",
    conservationAreas: ["Exeter City Centre", "Topsham", "St Leonards"],
    lenderAppetite: "Moderate appetite - specialist lenders most active. Exeter's growth story is understood but distance from London means some mainstream lenders are less familiar. University-linked schemes and Cranbrook attract dedicated specialists.",
  },
  "west-yorkshire/leeds": {
    planningPortalUrl: "https://www.leeds.gov.uk/planning",
    cilRate: "No CIL adopted - uses S106 and planning obligations",
    s106Notes: "7% affordable housing in the city centre (with commuted sums common), higher in suburban areas. Leeds' flexible approach makes development economics more viable than many comparable cities.",
    conservationAreas: ["Leeds City Centre", "Headingley", "Far Headingley", "Meanwood"],
    lenderAppetite: "Excellent appetite - Leeds is one of the strongest regional lending markets in the UK. Financial services employment gives lenders confidence in exit demand. South Bank is attracting institutional and fund capital for large-scale BTR. Specialist lenders active across all scheme sizes.",
  },
  "south-yorkshire/sheffield": {
    planningPortalUrl: "https://www.sheffield.gov.uk/planning",
    cilRate: "No CIL adopted",
    s106Notes: "10% affordable housing on major schemes in the city centre (subject to viability). Sheffield's pragmatic approach supports development viability.",
    conservationAreas: ["Sheffield City Centre", "Kelham Island/Neepsend", "Endcliffe and Ranmoor"],
    lenderAppetite: "Specialist lenders most active. Sheffield's strong yields attract investment-focused developers. AMRC and university sector support BTR demand. Kelham Island success story gives lenders confidence in creative-quarter regeneration plays.",
  },
  "tyne-and-wear/newcastle": {
    planningPortalUrl: "https://www.newcastle.gov.uk/services/planning-building-and-development",
    cilRate: "No CIL adopted - uses S106 obligations",
    s106Notes: "15% affordable housing on major schemes (subject to viability). Newcastle's pragmatic planning approach supports development.",
    conservationAreas: ["Grainger Town", "Newcastle Central", "Jesmond", "Ouseburn Valley"],
    lenderAppetite: "Specialist lenders dominate sub-£5m. Newcastle's compact city centre and university demand are well understood. Helix innovation district attracting wider interest. Some mainstream lenders active on larger BTR schemes (£10m+).",
  },
  "cambridgeshire/cambridge": {
    planningPortalUrl: "https://www.cambridge.gov.uk/planning",
    cilRate: "£150/sqm for residential in the city, varies in South Cambridgeshire",
    s106Notes: "40% affordable housing on major schemes - one of the highest requirements in England. Viability is less often contested given Cambridge's premium values.",
    conservationAreas: ["Cambridge City Centre (extensive - covers most of the historic core)", "Newnham", "West Cambridge"],
    lenderAppetite: "Very strong appetite from all lender types. Cambridge's global brand and tech economy make it one of the most bankable development locations in the UK. Banks, institutional lenders, and family offices all compete for Cambridge deals. Limited available sites mean schemes rarely struggle for funding.",
  },
  "norfolk/norwich": {
    planningPortalUrl: "https://www.norwich.gov.uk/info/20025/planning_applications",
    cilRate: "£115/sqm for residential in the urban area",
    s106Notes: "33% affordable housing on major schemes. East Norwich has a specific planning framework with bespoke contribution levels.",
    conservationAreas: ["Norwich City Centre (one of the UK's largest urban conservation areas)", "Earlham", "The Avenues"],
    lenderAppetite: "Specialist lenders most active. Norwich's self-contained market and university demand provide stable fundamentals. East Norwich masterplan attracting wider interest from regional lenders. Heritage conversion schemes require lenders comfortable with listed building risk.",
  },
  "edinburgh/edinburgh": {
    planningPortalUrl: "https://www.edinburgh.gov.uk/planning-building",
    cilRate: "Not applicable - Scotland does not use CIL",
    s106Notes: "Scotland uses Section 75 planning obligations. Edinburgh requires 25% affordable housing on sites of 12+ units. Developer contributions for education and transport infrastructure are standard.",
    conservationAreas: ["Edinburgh Old Town and New Town (UNESCO World Heritage Site)", "Stockbridge", "Morningside", "Leith"],
    lenderAppetite: "Strong appetite but requires Scottish-capable lenders (Standard Securities, separate title system). Edinburgh's premium values attract banks and institutional capital. Not all English lenders operate in Scotland - we maintain a specialist panel of Scotland-active funders.",
  },
  "glasgow/glasgow": {
    planningPortalUrl: "https://www.glasgow.gov.uk/index.aspx?articleid=17542",
    cilRate: "Not applicable - Scotland does not use CIL",
    s106Notes: "Scotland uses Section 75 planning obligations. Glasgow typically requires 25% affordable housing on major schemes. Regeneration zones may have reduced or waived contributions.",
    conservationAreas: ["Glasgow City Centre", "Merchant City", "Park Circus/Woodlands", "Pollokshields"],
    lenderAppetite: "Good appetite from Scottish-active lenders. Glasgow's strong yields and affordable land attract specialist capital. Sighthill and Clyde waterfront regeneration schemes building lender confidence. Requires funders comfortable with Scottish legal framework.",
  },
  "cardiff/cardiff": {
    planningPortalUrl: "https://www.cardiff.gov.uk/ENG/resident/Planning/Pages/default.aspx",
    cilRate: "Not applicable - Wales does not currently operate CIL (though reforms are under consultation)",
    s106Notes: "Wales uses Section 106 obligations. Cardiff requires 20-30% affordable housing depending on location. Help to Buy Wales supports new-build demand, improving scheme viability.",
    conservationAreas: ["Cardiff Bay", "Cathedral Road", "Pontcanna", "Roath Park"],
    lenderAppetite: "Good appetite from lenders active in Wales. Cardiff's capital city status and Help to Buy Wales support make it the most bankable Welsh location. Some English lenders don't operate in Wales - we ensure access to Wales-active funders.",
  },
  "hampshire/southampton": {
    planningPortalUrl: "https://www.southampton.gov.uk/planning/",
    cilRate: "£70/sqm for residential in the city centre, £120/sqm elsewhere",
    s106Notes: "35% affordable housing on major schemes (subject to viability). City centre and waterfront schemes may negotiate reduced requirements.",
    conservationAreas: ["Old Town/High Street", "Oxford Street", "Bevois Mount"],
    lenderAppetite: "Moderate to good appetite. Southampton's port employment and university sector provide stable demand fundamentals. Specialist lenders active across all scheme sizes. Waterfront and city centre regeneration schemes attract wider interest.",
  },
  "oxfordshire/oxford": {
    planningPortalUrl: "https://www.oxford.gov.uk/planning",
    cilRate: "£233/sqm for residential",
    s106Notes: "50% affordable housing on sites of 10+ units - one of the highest requirements in England. Oxford's extreme undersupply means viability arguments are hard to sustain.",
    conservationAreas: ["Oxford City Centre (extensive - covers most of the historic core)", "Jericho", "North Oxford", "Headington"],
    lenderAppetite: "Very strong appetite from all lender types. Oxford's global brand and extreme undersupply make it exceptionally bankable. Premium values support strong security positions. Heritage complexity requires lenders experienced with listed buildings and conservation area work.",
  },
  "west-yorkshire/bradford": {
    planningPortalUrl: "https://www.bradford.gov.uk/planning-and-building-control/",
    cilRate: "No CIL adopted",
    s106Notes: "15% affordable housing on major schemes (subject to viability). Bradford's regeneration priorities mean contributions are often negotiated pragmatically.",
    lenderAppetite: "Specialist lenders most active. Bradford's low entry values and high yields attract investment-focused developers. City of Culture legacy building lender confidence. Track record evidence particularly important - lenders want to see demonstrated local exit capability.",
  },
  "cheshire/chester": {
    planningPortalUrl: "https://www.cheshirewestandchester.gov.uk/residents/planning-and-building-control",
    cilRate: "£110/sqm for residential in the city, varying across the wider district",
    s106Notes: "30% affordable housing on major schemes. Conservation area and World Heritage considerations add complexity (and cost) to city centre schemes.",
    conservationAreas: ["Chester City Centre (within Roman Walls)", "The Rows", "Queen's Park", "Curzon Park"],
    lenderAppetite: "Good appetite from specialist and mainstream lenders. Chester's heritage and professional employment base support premium values. Conservation area work requires heritage-experienced lenders. Garden Quarter and Northgate attracting wider interest.",
  },
  "north-yorkshire/york": {
    planningPortalUrl: "https://www.york.gov.uk/Planning",
    cilRate: "No CIL adopted - uses S106 contributions",
    s106Notes: "30% affordable housing on major schemes. York Central has a bespoke planning framework. Flood risk zones require additional mitigation contributions.",
    conservationAreas: ["York City Centre (one of the UK's most extensive urban conservation areas)", "The Stonebow", "Clifton", "Bishopthorpe"],
    lenderAppetite: "Moderate to good appetite. York's premium values attract mainstream lender interest but limited site availability constrains deal flow. York Central is attracting institutional capital. Flood risk considerations require specialist assessment - experienced lenders build this into appraisals.",
  },
  "hertfordshire/st-albans": {
    planningPortalUrl: "https://www.stalbans.gov.uk/planning",
    cilRate: "£240/sqm for residential - one of the highest rates in Hertfordshire",
    s106Notes: "40% affordable housing on major schemes. Combined with high CIL, total planning obligations significantly impact viability. Prior approval conversions avoid both CIL and affordable housing requirements.",
    conservationAreas: ["St Albans City Centre", "Fishpool Street/Romeland", "College Street", "Sopwell"],
    lenderAppetite: "Strong appetite from all lender types. St Albans' premium values (median £615,000) provide excellent security. Prior approval conversions particularly popular with lenders given simplified planning. Banks and specialist lenders both active. Home Counties expertise essential - we match with Hertfordshire-experienced funders.",
  },
};

/**
 * Retrieve town market data for a specific location.
 * Merges base data with enrichment fields when available.
 * Returns undefined if no specific data exists for this town.
 */
export function getTownMarketData(
  countySlug: string,
  townSlug: string,
): TownMarketData | undefined {
  const key = `${countySlug}/${townSlug}`;
  const base = TOWN_MARKET_DATA[key];
  if (!base) return undefined;
  const extra = ENRICHMENT[key];
  
return extra ? { ...base, ...extra } : base;
}
