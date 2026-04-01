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
      "London operates as dozens of distinct micro-markets rather than a single entity. Inner London schemes command premium GDVs but face higher land costs and complex planning. Outer London boroughs — particularly those along Crossrail and DLR extensions — offer the best development economics for mid-market residential schemes targeting first-time buyers and young professionals.",
    demandDrivers: [
      "Chronic housing undersupply across all 33 boroughs",
      "Crossrail and Overground extension catchment premiums",
      "Build-to-Rent institutional demand in Zone 2-4",
      "Permitted development office conversions in the City fringe",
    ],
    rentalYieldRange: "3.5-5.5%",
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
      "Victoria North (formerly Northern Gateway) — 15,000 homes",
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
      "Liverpool Waters — £5.5bn waterfront regeneration",
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
      "Smithfield — 17-acre city centre regeneration",
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
      "Island Quarter — Nottingham's largest regeneration",
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
      "Temple Quarter — 130-acre city centre regeneration",
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
      "South Bank — 253-acre city centre regeneration",
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
      "Newcastle's compact city centre and strong university sector create concentrated rental demand that supports attractive development yields. The Helix innovation district — on the former Scottish & Newcastle brewery site — is creating a new knowledge economy hub, while the Quayside and Ouseburn Valley offer characterful conversion opportunities. Land values remain accessible, supporting development viability.",
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
      "Glasgow offers the strongest development economics of any major Scottish city: accessible land values, competitive build costs, and rental yields that significantly outperform Edinburgh. The city's extensive regeneration programme — from Sighthill to the Clyde waterfront — is creating large-scale residential development opportunities. Glasgow's four universities generate consistent student housing demand.",
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
      "York Central — 45-hectare brownfield regeneration",
      "Castle Gateway and Foss Basin",
      "University of York campus expansion",
    ],
    marketInsight:
      "York combines premium residential values with a constrained development market — the city's heritage status, Green Belt, and flood risk areas limit available sites. York Central, a 45-hectare brownfield site next to the station, represents one of the largest city-centre development opportunities in the UK. The University of York's continued expansion supports purpose-built student accommodation demand.",
    demandDrivers: [
      "York Central 45-hectare brownfield opportunity",
      "Tourism economy (8M+ visitors/year)",
      "Two universities",
      "Premium residential market",
    ],
    rentalYieldRange: "4.5-6.0%",
  },
};

/**
 * Retrieve town market data for a specific location.
 * Returns undefined if no specific data exists for this town.
 */
export function getTownMarketData(
  countySlug: string,
  townSlug: string,
): TownMarketData | undefined {
  return TOWN_MARKET_DATA[`${countySlug}/${townSlug}`];
}
