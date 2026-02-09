/**
 * UK Locations Data
 *
 * Comprehensive county-level data with real towns and genuine local context
 * for every county served by Construction Capital. This replaces the placeholder
 * town lists and provides unique, factual content for each location page.
 *
 * Each county includes:
 *   - Real towns/cities with development finance relevance
 *   - County-level market context (unique per county)
 *   - Town-level distinguishing features
 *   - Key development drivers and local factors
 */

export interface TownData {
  name: string;
  slug: string;
  /** One-line distinguishing context for this town */
  context: string;
}

export interface CountyData {
  name: string;
  slug: string;
  region: string;
  /** 2-3 sentence unique market overview for this specific county */
  overview: string;
  /** Key development drivers specific to this county */
  drivers: string[];
  towns: TownData[];
}

function s(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export const UK_COUNTIES: CountyData[] = [
  // ═══════════════════════════════════════════════
  // LONDON & SOUTH EAST
  // ═══════════════════════════════════════════════
  {
    name: "Greater London",
    slug: "greater-london",
    region: "London & South East",
    overview:
      "The UK's largest and most active property development market, with persistent housing undersupply across all 33 boroughs. Inner London commands premium values for luxury and BTR schemes, while outer boroughs attract family housing and first-time buyer developments. Crossrail, Overground extensions, and the Bakerloo line upgrade continue to reshape micro-market dynamics.",
    drivers: [
      "Crossrail catchment area premium",
      "Build-to-Rent institutional demand",
      "Permitted development office conversions",
      "Affordable housing policy requirements",
    ],
    towns: [
      { name: "Croydon", slug: "croydon", context: "South London's largest regeneration programme with over 10,000 new homes planned in the town centre" },
      { name: "Barking", slug: "barking", context: "East London regeneration hub anchored by Barking Riverside — one of Europe's largest brownfield developments" },
      { name: "Woolwich", slug: "woolwich", context: "Elizabeth Line connectivity driving residential demand along the Royal Arsenal Waterfront" },
      { name: "Ealing", slug: "ealing", context: "West London beneficiary of Crossrail with strong family housing demand and conservation area opportunities" },
      { name: "Stratford", slug: "stratford", context: "Olympic legacy area with continued institutional investment and strong transport connectivity" },
      { name: "Lewisham", slug: "lewisham", context: "Bakerloo line extension target area with significant council-led regeneration plans" },
      { name: "Tottenham", slug: "tottenham", context: "North London regeneration corridor driven by the stadium development and High Road improvements" },
      { name: "Wembley", slug: "wembley", context: "Major regeneration area around the stadium with high-density residential development" },
      { name: "Hounslow", slug: "hounslow", context: "West London town benefiting from Great West Corridor development and Heathrow proximity" },
      { name: "Brixton", slug: "brixton", context: "South London market with strong buyer demand and heritage-led conversion opportunities" },
      { name: "Hackney", slug: "hackney", context: "East London creative hub with premium values for converted commercial and industrial buildings" },
      { name: "Bermondsey", slug: "bermondsey", context: "Southwark riverside area with warehouse conversions and proximity to the City" },
    ],
  },
  {
    name: "Kent",
    slug: "kent",
    region: "London & South East",
    overview:
      "The Garden of England combines strong London commuter demand with distinct local markets in cathedral cities and coastal towns. High Speed 1 services from Ebbsfleet and Ashford have transformed travel times to London, creating premium commuter catchments. The county's diverse geography supports everything from urban apartment schemes in Medway to rural barn conversions in the Weald.",
    drivers: [
      "HS1 commuter premium from Ebbsfleet and Ashford",
      "Ebbsfleet Garden City — 15,000 new homes",
      "Coastal regeneration in Folkestone and Margate",
      "Medway waterfront development pipeline",
    ],
    towns: [
      { name: "Maidstone", slug: "maidstone", context: "County town with strong local demand and significant brownfield redevelopment along the River Medway" },
      { name: "Ashford", slug: "ashford", context: "HS1 hub with 17-minute journey to London St Pancras, driving major residential expansion" },
      { name: "Canterbury", slug: "canterbury", context: "Cathedral city with strong student housing demand from three universities and heritage conversion opportunities" },
      { name: "Tunbridge Wells", slug: "tunbridge-wells", context: "Premium commuter town with high-value residential market and conservation area refurbishment demand" },
      { name: "Chatham", slug: "chatham", context: "Medway waterfront regeneration with the Historic Dockyard area attracting conversion schemes" },
      { name: "Folkestone", slug: "folkestone", context: "Coastal regeneration driven by the Creative Quarter and harbour arm development" },
      { name: "Gravesend", slug: "gravesend", context: "Thames-side town with Ebbsfleet Garden City creating significant development demand nearby" },
      { name: "Dartford", slug: "dartford", context: "Elizabeth Line terminus with major housing growth including the Ebbsfleet area" },
      { name: "Tonbridge", slug: "tonbridge", context: "Prosperous Weald market town with demand for quality family housing and boutique developments" },
      { name: "Dover", slug: "dover", context: "Port town with affordable land values and waterfront regeneration opportunities" },
      { name: "Sevenoaks", slug: "sevenoaks", context: "Affluent commuter town with premium values and Green Belt constraints limiting supply" },
      { name: "Margate", slug: "margate", context: "Coastal revival driven by Turner Contemporary gallery and creative-sector migration from London" },
    ],
  },
  {
    name: "Surrey",
    slug: "surrey",
    region: "London & South East",
    overview:
      "One of England's most affluent counties, Surrey's property market is characterised by premium values, Green Belt constraints, and strong commuter demand. Limited development land means high competition for sites, but achievable values support viable margins even at elevated build costs. The county has a strong market for high-specification family homes and boutique apartment schemes.",
    drivers: [
      "Premium commuter demand from fast London services",
      "Green Belt scarcity driving land values",
      "Affluent buyer demographic supporting high-spec development",
      "University of Surrey and Royal Holloway student demand",
    ],
    towns: [
      { name: "Guildford", slug: "guildford", context: "County town with university-driven demand and premium family housing market in surrounding villages" },
      { name: "Woking", slug: "woking", context: "Major town centre regeneration with Victoria Square transforming the commercial core" },
      { name: "Epsom", slug: "epsom", context: "Attractive commuter town with hospital quarter regeneration and strong family housing demand" },
      { name: "Redhill", slug: "redhill", context: "East Surrey hub with improving town centre and fast London services via Thameslink" },
      { name: "Farnham", slug: "farnham", context: "Historic market town with premium values and creative arts university presence" },
      { name: "Weybridge", slug: "weybridge", context: "Affluent Elmbridge town with ultra-premium residential market and limited development supply" },
      { name: "Camberley", slug: "camberley", context: "Western Surrey town with Ministry of Defence presence and growing commercial sector" },
      { name: "Staines", slug: "staines", context: "Heathrow proximity driving commercial and residential demand along the A30 corridor" },
      { name: "Dorking", slug: "dorking", context: "Surrey Hills market town with heritage conversion opportunities and premium buyer demand" },
      { name: "Leatherhead", slug: "leatherhead", context: "Corporate headquarters town with good transport links and growing residential demand" },
    ],
  },
  {
    name: "Sussex",
    slug: "sussex",
    region: "London & South East",
    overview:
      "Sussex spans two historic counties — East and West — combining the coastal cities of Brighton and Worthing with the rural South Downs and prosperous Wealden towns. Brighton is the South Coast's most dynamic property market, driven by London overspill, a creative economy, and strong student demand. West Sussex towns along the Arun Valley line offer commuter-belt family housing at lower entry points.",
    drivers: [
      "Brighton's creative economy and London overspill",
      "South Downs National Park lifestyle appeal",
      "Gatwick Airport employment corridor",
      "Coastal regeneration in Hastings and Bexhill",
    ],
    towns: [
      { name: "Brighton", slug: "brighton", context: "South Coast's most dynamic property market with strong rental demand from two universities and creative industries" },
      { name: "Worthing", slug: "worthing", context: "Emerging coastal market with improving town centre and significantly lower values than Brighton" },
      { name: "Crawley", slug: "crawley", context: "Gatwick Airport town with strong employment base and demand for both residential and commercial property" },
      { name: "Horsham", slug: "horsham", context: "Prosperous West Sussex town with premium family housing market and direct London services" },
      { name: "Eastbourne", slug: "eastbourne", context: "Retirement and tourism coast with HMO demand from growing college population" },
      { name: "Hastings", slug: "hastings", context: "Coastal regeneration area with heritage quarter conversion opportunities and improving rail links" },
      { name: "Chichester", slug: "chichester", context: "Cathedral city with affluent buyer demographic and South Downs lifestyle appeal" },
      { name: "Bognor Regis", slug: "bognor-regis", context: "Affordable coastal market with University of Chichester campus driving local demand" },
      { name: "Lewes", slug: "lewes", context: "County town with heritage character, premium values, and conservation area conversion opportunities" },
      { name: "Haywards Heath", slug: "haywards-heath", context: "Mid-Sussex commuter town with fast Brighton and London services and strong family demand" },
    ],
  },
  {
    name: "Hampshire",
    slug: "hampshire",
    region: "London & South East",
    overview:
      "Hampshire is a large and diverse county anchored by the cities of Southampton and Portsmouth, with prosperous commuter towns along the M3 corridor. The county benefits from strong employment in defence, marine, and financial services, creating robust housing demand. Southampton's port-side regeneration and Winchester's heritage premium represent opposite ends of the value spectrum.",
    drivers: [
      "Southampton port regeneration and city centre living",
      "Winchester premium market with heritage conversions",
      "M3 corridor commuter demand",
      "Military and defence sector housing demand",
    ],
    towns: [
      { name: "Southampton", slug: "southampton", context: "Port city with major waterfront regeneration and growing student population from two universities" },
      { name: "Portsmouth", slug: "portsmouth", context: "Naval city with waterfront development opportunities and strong rental demand from military personnel" },
      { name: "Winchester", slug: "winchester", context: "Historic cathedral city commanding premium values with conservation area development opportunities" },
      { name: "Basingstoke", slug: "basingstoke", context: "M3 corridor commercial hub with corporate headquarters presence and growing residential demand" },
      { name: "Andover", slug: "andover", context: "Army garrison town with steady housing demand and development land availability" },
      { name: "Farnborough", slug: "farnborough", context: "Defence and aviation hub with commercial property demand and Blackwater Valley growth" },
      { name: "Eastleigh", slug: "eastleigh", context: "Southampton overspill town with good rail links and growing town centre regeneration" },
      { name: "Fareham", slug: "fareham", context: "Solent towns corridor with Welborne Garden Village creating significant new housing supply" },
      { name: "Aldershot", slug: "aldershot", context: "Military town undergoing regeneration with affordable land values relative to surrounding areas" },
      { name: "Fleet", slug: "fleet", context: "Affluent commuter town with strong family housing demand and limited new supply" },
    ],
  },
  {
    name: "Berkshire",
    slug: "berkshire",
    region: "London & South East",
    overview:
      "Berkshire's property market is driven by its position in the M4 corridor — the UK's 'Silicon Valley' — with major tech employers including Microsoft, Oracle, and Vodafone headquartered in the county. Reading is the commercial centre with significant office-to-residential conversion potential, while Windsor and Maidenhead command premium residential values. The county benefits from excellent motorway and rail connectivity.",
    drivers: [
      "M4 tech corridor employment demand",
      "Reading station area regeneration",
      "Elizabeth Line extending commuter catchment",
      "Office-to-residential PD conversions in town centres",
    ],
    towns: [
      { name: "Reading", slug: "reading", context: "M4 corridor hub with major station quarter regeneration and significant office-to-residential PD potential" },
      { name: "Slough", slug: "slough", context: "Elizabeth Line connectivity and proximity to Heathrow driving residential and commercial development" },
      { name: "Bracknell", slug: "bracknell", context: "Regenerated town centre with The Lexicon shopping destination and strong tech-sector employment" },
      { name: "Maidenhead", slug: "maidenhead", context: "Thames-side town with Elizabeth Line services and premium waterfront development opportunities" },
      { name: "Wokingham", slug: "wokingham", context: "Affluent commuter town with major strategic development locations delivering 13,000+ new homes" },
      { name: "Newbury", slug: "newbury", context: "West Berkshire market town with Vodafone HQ and racecourse-area premium residential market" },
      { name: "Windsor", slug: "windsor", context: "Royal town with ultra-premium values and heritage conversion opportunities near the Castle" },
      { name: "Thatcham", slug: "thatcham", context: "Growing West Berkshire town with more affordable entry points and family housing demand" },
    ],
  },
  {
    name: "Buckinghamshire",
    slug: "buckinghamshire",
    region: "London & South East",
    overview:
      "Buckinghamshire is a prosperous Home Counties authority with a diverse market ranging from High Wycombe's urban regeneration to the Chiltern Hills' premium villages. The HS2 route through the county has created both disruption and opportunity, with development activity concentrated around Aylesbury's growth plans and the Milton Keynes border area. Pinewood Studios' expansion continues to drive local demand.",
    drivers: [
      "Aylesbury Garden Town growth — 16,000 new homes planned",
      "HS2 corridor development opportunities",
      "Pinewood Studios expansion and creative sector",
      "Chiltern Hills premium lifestyle market",
    ],
    towns: [
      { name: "Aylesbury", slug: "aylesbury", context: "Garden Town designation with 16,000 new homes planned across multiple strategic sites" },
      { name: "High Wycombe", slug: "high-wycombe", context: "Largest Buckinghamshire town with Handy Cross hub regeneration and furniture industry heritage conversions" },
      { name: "Amersham", slug: "amersham", context: "Metropolitan line commuter town with premium Chiltern Hills values and conservation area opportunities" },
      { name: "Beaconsfield", slug: "beaconsfield", context: "Affluent commuter town near Pinewood Studios with ultra-premium family housing market" },
      { name: "Marlow", slug: "marlow", context: "Thames-side town with premium riverside development opportunities and strong lifestyle appeal" },
      { name: "Chesham", slug: "chesham", context: "Metropolitan line terminus town with more affordable values and growing development interest" },
      { name: "Buckingham", slug: "buckingham", context: "Historic market town with university campus and growing residential demand" },
      { name: "Princes Risborough", slug: "princes-risborough", context: "Chiltern town with major expansion plans for 2,500 new homes and HS2 relief road" },
    ],
  },
  {
    name: "Oxfordshire",
    slug: "oxfordshire",
    region: "London & South East",
    overview:
      "Oxfordshire combines Oxford's globally recognised university city market with the science and innovation corridor extending to Milton Park and Harwell. The county has some of the most acute housing affordability pressures outside London, creating strong demand for new residential development. Science Vale and the Oxfordshire-Cambridge Arc represent significant long-term growth drivers for both commercial and residential development.",
    drivers: [
      "Oxford University and science-sector employment",
      "Oxford-Cambridge Arc investment corridor",
      "Didcot Garden Town and Science Vale growth",
      "Severe housing affordability gap driving demand",
    ],
    towns: [
      { name: "Oxford", slug: "oxford", context: "University city with severe housing undersupply, strong student and academic demand, and heritage conversion constraints" },
      { name: "Banbury", slug: "banbury", context: "North Oxfordshire growth town with significant housing allocation and M40 motorway connectivity" },
      { name: "Didcot", slug: "didcot", context: "Garden Town with major housing growth driven by Science Vale employment and fast London rail services" },
      { name: "Bicester", slug: "bicester", context: "Eco-town designation and Bicester Village retail destination driving population growth and housing demand" },
      { name: "Abingdon", slug: "abingdon", context: "Historic market town near Science Vale with growing demand from tech and research-sector employees" },
      { name: "Witney", slug: "witney", context: "West Oxfordshire market town with premium Cotswolds-fringe values and family housing demand" },
      { name: "Henley-on-Thames", slug: "henley-on-thames", context: "Premium Thames-side town with regatta heritage and ultra-high-value residential market" },
      { name: "Thame", slug: "thame", context: "Well-connected market town with neighbourhood plan enabling controlled growth and family housing demand" },
    ],
  },
  {
    name: "Hertfordshire",
    slug: "hertfordshire",
    region: "London & South East",
    overview:
      "Hertfordshire benefits from its position immediately north of London, with fast rail services from multiple towns into King's Cross, St Pancras, and Liverpool Street. The county has a strong bio-science sector centred on Stevenage, a growing film industry around Leavesden and Elstree, and established commuter markets in St Albans and Harpenden that command premium values. Major housing growth is planned at Harlow and Hemel Hempstead.",
    drivers: [
      "Fast rail commuter services into London terminals",
      "Bio-science corridor around Stevenage",
      "Film studio expansion at Leavesden and Elstree",
      "Harlow and Hemel Hempstead growth areas",
    ],
    towns: [
      { name: "St Albans", slug: "st-albans", context: "Premium commuter city with cathedral heritage, conservation area constraints, and strong buyer demand" },
      { name: "Watford", slug: "watford", context: "Major retail and commercial centre with significant town centre regeneration and Metropolitan line connectivity" },
      { name: "Stevenage", slug: "stevenage", context: "New Town undergoing regeneration with bio-science employment base and major housing growth plans" },
      { name: "Hemel Hempstead", slug: "hemel-hempstead", context: "Dacorum growth area with Maylands business park and significant brownfield redevelopment potential" },
      { name: "Welwyn Garden City", slug: "welwyn-garden-city", context: "Garden City heritage with bio-pharma employment and fast King's Cross services" },
      { name: "Hatfield", slug: "hatfield", context: "University of Hertfordshire campus town with growing residential demand and former aerodrome development" },
      { name: "Hertford", slug: "hertford", context: "Historic county town with riverside development opportunities and Lee Valley connectivity" },
      { name: "Bishops Stortford", slug: "bishops-stortford", context: "Stansted Airport proximity driving demand with major northern expansion delivering 5,000+ homes" },
      { name: "Harpenden", slug: "harpenden", context: "Premium village-feel commuter town with some of the highest residential values in the county" },
      { name: "Borehamwood", slug: "borehamwood", context: "Elstree Studios proximity and Thameslink services driving residential development interest" },
    ],
  },
  {
    name: "Essex",
    slug: "essex",
    region: "London & South East",
    overview:
      "Essex combines London-fringe regeneration areas with established commuter towns and the Thames Gateway growth corridor. The county's western edge merges with Greater London, offering development opportunities at London prices with Essex build costs. Basildon, Southend, and Chelmsford each have distinct market dynamics, from waterfront regeneration to city centre apartment schemes. The county's strong rental market supports both BTL investors and purpose-built rental development.",
    drivers: [
      "Thames Gateway housing growth corridor",
      "Chelmsford city status and commercial growth",
      "Southend airport expansion and seafront regeneration",
      "London overspill demand in western Essex",
    ],
    towns: [
      { name: "Chelmsford", slug: "chelmsford", context: "Essex's only city with strong commercial centre, major housing growth, and fast Liverpool Street services" },
      { name: "Basildon", slug: "basildon", context: "Thames Gateway New Town with significant regeneration plans and Enterprise Zone benefits" },
      { name: "Southend-on-Sea", slug: "southend-on-sea", context: "City status and seafront regeneration driving residential and leisure development investment" },
      { name: "Colchester", slug: "colchester", context: "Britain's oldest recorded town with garrison regeneration and university campus driving demand" },
      { name: "Harlow", slug: "harlow", context: "Garden Town status with Gilston Park development delivering 10,000 homes and Enterprise Zone" },
      { name: "Brentwood", slug: "brentwood", context: "Affluent commuter town with Elizabeth Line proximity and premium family housing demand" },
      { name: "Braintree", slug: "braintree", context: "Growth district with major garden community plans at Andrewsfield and Marks Tey" },
      { name: "Grays", slug: "grays", context: "Thurrock growth area with London Gateway port driving employment and housing demand" },
      { name: "Clacton-on-Sea", slug: "clacton-on-sea", context: "Tendring coastal town with affordable values and regeneration-led development opportunities" },
      { name: "Canvey Island", slug: "canvey-island", context: "Thames estuary island community with distinct market and waterfront development potential" },
    ],
  },

  // ═══════════════════════════════════════════════
  // SOUTH WEST
  // ═══════════════════════════════════════════════
  {
    name: "Bristol",
    slug: "bristol",
    region: "South West",
    overview:
      "Bristol is the South West's economic powerhouse and one of the UK's most competitive regional cities for tech and professional services employment. The city's property market has outperformed most regional centres over the past decade, driven by a growing population, constrained supply, and the appeal of its cultural scene. Temple Quarter — a 130-acre regeneration area around Bristol Temple Meads station — represents one of the largest urban development opportunities in the UK.",
    drivers: [
      "Temple Quarter 130-acre regeneration",
      "Tech sector employment growth",
      "Two universities driving rental demand",
      "Harbour-side and Bedminster regeneration",
    ],
    towns: [
      { name: "Bristol City Centre", slug: "bristol-city-centre", context: "Urban core with Temple Quarter regeneration and harbour-side residential conversion opportunities" },
      { name: "Bedminster", slug: "bedminster", context: "South Bristol regeneration area with former industrial sites and growing creative quarter" },
      { name: "Bishopston", slug: "bishopston", context: "Popular north Bristol neighbourhood with strong family housing demand and refurbishment opportunities" },
      { name: "Filton", slug: "filton", context: "Former Airbus airfield site delivering 2,700 homes in one of the UK's largest brownfield schemes" },
      { name: "Hengrove", slug: "hengrove", context: "South Bristol growth area with former park and leisure centre site earmarked for major housing" },
      { name: "Keynsham", slug: "keynsham", context: "Bath-Bristol corridor town with growing commuter demand and town centre regeneration" },
    ],
  },
  {
    name: "Somerset",
    slug: "somerset",
    region: "South West",
    overview:
      "Somerset's property market is diverse, ranging from the Georgian premium of Bath to the regeneration opportunities in Bridgwater and Taunton. Hinkley Point C — the UK's first new nuclear power station in a generation — is the county's largest current economic driver, bringing thousands of construction workers and creating housing demand across the Bridgwater area. Bath commands premium values driven by heritage appeal and lifestyle buyers.",
    drivers: [
      "Hinkley Point C construction workforce housing demand",
      "Bath heritage premium and conversion opportunities",
      "Taunton garden town growth plans",
      "M5 corridor connectivity improvements",
    ],
    towns: [
      { name: "Bath", slug: "bath", context: "UNESCO World Heritage city with ultra-premium values and heritage conversion opportunities in Georgian townhouses" },
      { name: "Taunton", slug: "taunton", context: "County town with garden town aspirations, Firepool regeneration, and growing commuter appeal" },
      { name: "Bridgwater", slug: "bridgwater", context: "Hinkley Point C driving significant housing demand and town centre regeneration investment" },
      { name: "Yeovil", slug: "yeovil", context: "South Somerset market town with aerospace employment base and affordable development land" },
      { name: "Frome", slug: "frome", context: "Creative town with strong lifestyle appeal and growing demand from London and Bristol relocators" },
      { name: "Glastonbury", slug: "glastonbury", context: "Unique tourism-driven market with festival economy and growing permanent population" },
      { name: "Wells", slug: "wells", context: "England's smallest city with cathedral heritage and premium boutique development opportunities" },
      { name: "Weston-super-Mare", slug: "weston-super-mare", context: "North Somerset coastal town with town centre regeneration and Bristol commuter demand" },
    ],
  },
  {
    name: "Devon",
    slug: "devon",
    region: "South West",
    overview:
      "Devon offers two distinct property markets: the South Devon coast (Torbay, Dartmouth, Salcombe) commands premium values driven by lifestyle buyers and tourism, while Exeter is emerging as a genuine economic hub with a growing biomedical sector and university expansion. North Devon's market is more affordable but benefits from tourism demand. The county's rural areas provide barn conversion and farmstead development opportunities.",
    drivers: [
      "Exeter biomedical and university sector growth",
      "South Devon coastal premium and lifestyle market",
      "Tourism-driven holiday-let development",
      "Rural barn conversion permitted development",
    ],
    towns: [
      { name: "Exeter", slug: "exeter", context: "Cathedral city with university-driven growth, biomedical hub, and significant eastern expansion at Cranbrook" },
      { name: "Plymouth", slug: "plymouth", context: "Naval port city with waterfront regeneration, two universities, and affordable development land" },
      { name: "Torquay", slug: "torquay", context: "English Riviera resort with premium seafront values and hotel-to-residential conversion opportunities" },
      { name: "Newton Abbot", slug: "newton-abbot", context: "South Devon market town with major housing growth areas and commuter appeal to Exeter" },
      { name: "Barnstaple", slug: "barnstaple", context: "North Devon's largest town with regional service centre role and tourism-adjacent economy" },
      { name: "Tiverton", slug: "tiverton", context: "Mid-Devon market town with new A361 improvements and growing residential demand" },
      { name: "Exmouth", slug: "exmouth", context: "Coastal town with Exe estuary waterfront and growing appeal from Exeter commuters" },
      { name: "Paignton", slug: "paignton", context: "Torbay coastal town with affordable values relative to Torquay and regeneration opportunities" },
    ],
  },
  {
    name: "Cornwall",
    slug: "cornwall",
    region: "South West",
    overview:
      "Cornwall's property market is uniquely shaped by tourism, lifestyle migration, and second-home ownership. The post-pandemic remote working shift has transformed the market, with permanent relocations from London and the South East pushing up values in previously affordable towns. St Ives, Padstow, and Rock command premium coastal values, while Truro and Falmouth offer year-round urban markets. Holiday-let development is a significant sector, though new planning restrictions on second homes are reshaping the opportunity.",
    drivers: [
      "Remote working-driven permanent relocation",
      "Tourism and holiday-let development demand",
      "Spaceport Cornwall and aerospace sector growth",
      "Falmouth and Penryn university campus expansion",
    ],
    towns: [
      { name: "Truro", slug: "truro", context: "Cornwall's only city and administrative centre with growing commercial sector and year-round residential demand" },
      { name: "Falmouth", slug: "falmouth", context: "University town with maritime heritage, creative industries, and strong rental demand" },
      { name: "Newquay", slug: "newquay", context: "Surf capital with airport connectivity and growing year-round residential market beyond tourism" },
      { name: "Penzance", slug: "penzance", context: "West Cornwall market town with heritage waterfront and emerging creative sector" },
      { name: "St Austell", slug: "st-austell", context: "Central Cornwall town with Eden Project proximity and affordable development opportunities" },
      { name: "Bodmin", slug: "bodmin", context: "Former county town with affordable land values and A30 dual carriageway connectivity" },
      { name: "Camborne", slug: "camborne", context: "Former mining town with regeneration opportunities and World Heritage Site status" },
      { name: "Bude", slug: "bude", context: "North Cornwall coastal town with lifestyle buyer demand and limited new housing supply" },
    ],
  },
  {
    name: "Dorset",
    slug: "dorset",
    region: "South West",
    overview:
      "Dorset combines the Jurassic Coast's tourism appeal with Bournemouth's vibrant urban economy. Bournemouth, Christchurch and Poole (BCP) unitary authority is one of the South Coast's most active development markets, with strong student demand from two universities and a growing digital sector. Rural Dorset offers lifestyle conversions and agricultural PD opportunities, while the coast commands premium values for well-located schemes.",
    drivers: [
      "BCP coastal conurbation — 400,000 population",
      "Two universities driving student housing demand",
      "Jurassic Coast tourism economy",
      "Digital and financial services employment growth",
    ],
    towns: [
      { name: "Bournemouth", slug: "bournemouth", context: "Major South Coast resort with two universities, digital sector growth, and town centre regeneration" },
      { name: "Poole", slug: "poole", context: "Harbour-side town with premium waterfront values and Twin Sails regeneration area" },
      { name: "Weymouth", slug: "weymouth", context: "Olympic sailing legacy resort with affordable coastal values and harbour regeneration" },
      { name: "Dorchester", slug: "dorchester", context: "County town with Poundbury extension and heritage-led development approach" },
      { name: "Christchurch", slug: "christchurch", context: "Affluent coastal town at the Dorset-Hampshire border with premium residential values" },
      { name: "Wimborne", slug: "wimborne", context: "East Dorset market town with riverside development potential and growing commuter demand" },
      { name: "Sherborne", slug: "sherborne", context: "Historic North Dorset town with abbey precinct heritage and premium buyer demographic" },
      { name: "Bridport", slug: "bridport", context: "West Dorset creative town with growing lifestyle appeal and Jurassic Coast proximity" },
    ],
  },
  {
    name: "Wiltshire",
    slug: "wiltshire",
    region: "South West",
    overview:
      "Wiltshire is a large rural county with development focused around the garrison town of Salisbury, the M4 corridor town of Swindon, and the commuter-belt market towns of Marlborough, Devizes, and Chippenham. The county's military presence — with significant bases at Bulford, Tidworth, and Larkhill — creates steady housing demand. Swindon is the county's largest commercial centre with significant office-to-residential conversion potential.",
    drivers: [
      "Military garrison housing demand",
      "Swindon commercial conversion opportunities",
      "M4 corridor connectivity",
      "Chippenham and Trowbridge growth areas",
    ],
    towns: [
      { name: "Swindon", slug: "swindon", context: "M4 corridor commercial centre with significant office-to-residential PD potential and growing tech sector" },
      { name: "Salisbury", slug: "salisbury", context: "Cathedral city with heritage market, military connections, and premium conversion opportunities" },
      { name: "Chippenham", slug: "chippenham", context: "M4 corridor growth town with major housing allocation and Bristol commuter demand" },
      { name: "Trowbridge", slug: "trowbridge", context: "County town with affordable values and growing demand from Bath and Bristol overspill" },
      { name: "Melksham", slug: "melksham", context: "Growing West Wiltshire town with canal-side regeneration and expanding residential demand" },
      { name: "Marlborough", slug: "marlborough", context: "Premium market town with Marlborough College presence and affluent buyer demographic" },
      { name: "Devizes", slug: "devizes", context: "Central Wiltshire market town with heritage character and growing residential appeal" },
      { name: "Warminster", slug: "warminster", context: "Garrison town with military-driven housing demand and affordable entry points" },
    ],
  },
  {
    name: "Gloucestershire",
    slug: "gloucestershire",
    region: "South West",
    overview:
      "Gloucestershire bridges the Cotswolds' premium lifestyle market with Gloucester's urban regeneration and Cheltenham's established residential appeal. The Cotswolds command some of the highest rural property values in England, while Gloucester's docks and Kings Quarter regeneration offer development at more accessible price points. GCHQ's presence in Cheltenham drives tech-sector employment and housing demand.",
    drivers: [
      "GCHQ Cheltenham cyber security cluster",
      "Cotswolds premium lifestyle values",
      "Gloucester docks and city centre regeneration",
      "M5 corridor connectivity to Bristol and Birmingham",
    ],
    towns: [
      { name: "Cheltenham", slug: "cheltenham", context: "Regency spa town with GCHQ-driven demand, premium values, and strong independent school catchment" },
      { name: "Gloucester", slug: "gloucester", context: "Cathedral city with docks regeneration, Kings Quarter development, and affordable urban values" },
      { name: "Stroud", slug: "stroud", context: "Creative Cotswold town with canal regeneration and strong appeal to London relocators" },
      { name: "Cirencester", slug: "cirencester", context: "Capital of the Cotswolds with premium market town values and heritage conversion demand" },
      { name: "Tewkesbury", slug: "tewkesbury", context: "Historic market town at the M5/M50 junction with major housing growth plans" },
      { name: "Lydney", slug: "lydney", context: "Forest of Dean market town with growing residential demand and affordable land values" },
    ],
  },

  // ═══════════════════════════════════════════════
  // MIDLANDS
  // ═══════════════════════════════════════════════
  {
    name: "West Midlands",
    slug: "west-midlands",
    region: "Midlands",
    overview:
      "The West Midlands metropolitan county centres on Birmingham — the UK's second city — which is undergoing its most significant transformation in decades. HS2 arrival at Curzon Street, the Smithfield and Eastside regeneration zones, and the Commonwealth Games legacy are reshaping the city's development landscape. The Black Country towns of Wolverhampton, Dudley, and Walsall offer more affordable development opportunities with strong rental yields.",
    drivers: [
      "HS2 Curzon Street quarter development",
      "Smithfield and Eastside Birmingham regeneration",
      "Commonwealth Games legacy sites",
      "Black Country regeneration and connectivity improvements",
    ],
    towns: [
      { name: "Birmingham", slug: "birmingham", context: "UK's second city with HS2-driven regeneration, strong BTR demand, and major city centre development pipeline" },
      { name: "Wolverhampton", slug: "wolverhampton", context: "Black Country city with Canalside quarter regeneration and city centre living strategy" },
      { name: "Coventry", slug: "coventry", context: "City of Culture legacy with two universities driving student and graduate housing demand" },
      { name: "Solihull", slug: "solihull", context: "Affluent South Birmingham area with HS2 Interchange station creating major development opportunities" },
      { name: "Dudley", slug: "dudley", context: "Metro extension regeneration area with affordable values and Very Light Rail Innovation Centre" },
      { name: "Walsall", slug: "walsall", context: "Black Country town with waterfront regeneration and growing residential conversion opportunities" },
      { name: "Sutton Coldfield", slug: "sutton-coldfield", context: "Affluent North Birmingham town with premium family housing market and town centre regeneration" },
      { name: "West Bromwich", slug: "west-bromwich", context: "Strategic centre with Midland Metropolitan Hospital and New Square regeneration" },
    ],
  },
  {
    name: "Warwickshire",
    slug: "warwickshire",
    region: "Midlands",
    overview:
      "Warwickshire benefits from Birmingham's economic growth while maintaining its own distinct identity. Royal Leamington Spa is the county's premium residential market, with Regency architecture and strong buyer demand. Warwick has heritage appeal, while Nuneaton and Rugby offer more affordable development opportunities along key transport corridors. The county's automotive heritage — with JLR at Gaydon and Aston Martin at Gaydon — supports local employment.",
    drivers: [
      "Leamington Spa Regency premium market",
      "JLR and Aston Martin automotive employment",
      "Rugby western growth area — 6,200 new homes",
      "HS2 route corridor development",
    ],
    towns: [
      { name: "Leamington Spa", slug: "leamington-spa", context: "Regency spa town with premium values, strong independent retail, and growing tech sector" },
      { name: "Warwick", slug: "warwick", context: "Historic castle town with heritage conversion opportunities and university campus demand" },
      { name: "Rugby", slug: "rugby", context: "Major growth town with western expansion delivering 6,200 homes and strong London rail links" },
      { name: "Nuneaton", slug: "nuneaton", context: "North Warwickshire town with affordable values and town centre regeneration plans" },
      { name: "Stratford-upon-Avon", slug: "stratford-upon-avon", context: "Shakespeare heritage tourism driving premium values with strong international buyer interest" },
      { name: "Kenilworth", slug: "kenilworth", context: "Affluent town between Warwick and Coventry with premium family housing and castle heritage" },
      { name: "Bedworth", slug: "bedworth", context: "North Warwickshire town adjacent to Coventry with affordable entry points and growing demand" },
    ],
  },
  {
    name: "Staffordshire",
    slug: "staffordshire",
    region: "Midlands",
    overview:
      "Staffordshire's property market is anchored by Stoke-on-Trent — the Potteries — where affordable values and a growing student population create accessible development opportunities. Lichfield offers a heritage premium, while Stafford town benefits from its position on the West Coast Main Line with fast London services. The county's northern moorlands provide rural conversion opportunities.",
    drivers: [
      "Stoke-on-Trent ceramics heritage conversions",
      "Stafford West Coast Main Line connectivity",
      "Lichfield heritage premium market",
      "Keele and Staffordshire university student demand",
    ],
    towns: [
      { name: "Stoke-on-Trent", slug: "stoke-on-trent", context: "Potteries city with some of England's most affordable property, growing student demand, and heritage conversion potential" },
      { name: "Stafford", slug: "stafford", context: "County town with fast WCML services to London and Birmingham and growing residential demand" },
      { name: "Lichfield", slug: "lichfield", context: "Cathedral city with heritage premium, strong buyer demand, and limited development supply" },
      { name: "Burton upon Trent", slug: "burton-upon-trent", context: "Brewing heritage town with affordable values and East Staffordshire growth plans" },
      { name: "Tamworth", slug: "tamworth", context: "Castle town at the Warwickshire border with growing demand from Birmingham commuters" },
      { name: "Newcastle-under-Lyme", slug: "newcastle-under-lyme", context: "University town adjacent to Keele campus with student and graduate housing demand" },
      { name: "Cannock", slug: "cannock", context: "Southern Staffordshire town with affordable values and proximity to Birmingham's employment base" },
    ],
  },
  {
    name: "Worcestershire",
    slug: "worcestershire",
    region: "Midlands",
    overview:
      "Worcestershire combines Worcester's cathedral city premium with the Malvern Hills lifestyle market and Redditch's more affordable urban development opportunities. The county benefits from M5 motorway connectivity linking it to Birmingham, Bristol, and the wider motorway network. Pershore, Evesham, and Droitwich offer market town development opportunities with growing commuter demand.",
    drivers: [
      "Worcester Shrub Hill regeneration",
      "Malvern Hills lifestyle premium",
      "M5 corridor Birmingham commuter demand",
      "Redditch town centre regeneration",
    ],
    towns: [
      { name: "Worcester", slug: "worcester", context: "Cathedral city with Shrub Hill quarter regeneration and strong university-driven rental demand" },
      { name: "Redditch", slug: "redditch", context: "New Town with town centre regeneration opportunities and affordable Birmingham commuter values" },
      { name: "Kidderminster", slug: "kidderminster", context: "Wyre Forest town with carpet industry heritage conversions and canal-side development" },
      { name: "Malvern", slug: "malvern", context: "Spa town with Hills backdrop, premium lifestyle values, and QinetiQ defence sector employment" },
      { name: "Droitwich", slug: "droitwich", context: "Spa town with growing commuter appeal and canal quarter development opportunities" },
      { name: "Evesham", slug: "evesham", context: "Vale of Evesham market town with horticultural heritage and Cotswold-fringe appeal" },
      { name: "Bromsgrove", slug: "bromsgrove", context: "South Worcestershire commuter town with fast Birmingham services and growing residential demand" },
    ],
  },
  {
    name: "Shropshire",
    slug: "shropshire",
    region: "Midlands",
    overview:
      "Shropshire is a large, predominantly rural county with development concentrated around Shrewsbury and Telford. Shrewsbury's medieval town centre offers heritage conversion opportunities, while Telford — a New Town — provides affordable land and modern commercial property for conversion. The county's position on the Welsh border gives it a distinct character and a market that differs from the urban West Midlands.",
    drivers: [
      "Shrewsbury medieval heritage conversions",
      "Telford New Town regeneration",
      "Welsh border market dynamics",
      "Rural barn conversion and farmstead PD",
    ],
    towns: [
      { name: "Shrewsbury", slug: "shrewsbury", context: "Medieval county town with river-loop heritage centre and growing residential demand from relocators" },
      { name: "Telford", slug: "telford", context: "New Town with affordable development land, Station Quarter regeneration, and growing commercial sector" },
      { name: "Oswestry", slug: "oswestry", context: "Welsh border market town with affordable values and growing residential demand" },
      { name: "Bridgnorth", slug: "bridgnorth", context: "Historic Severn Valley town with tourism appeal and premium residential market" },
      { name: "Market Drayton", slug: "market-drayton", context: "North Shropshire market town with Muller dairy employment and affordable housing demand" },
      { name: "Ludlow", slug: "ludlow", context: "Foodie capital with castle heritage, premium values, and strong lifestyle buyer demand" },
    ],
  },
  {
    name: "Derbyshire",
    slug: "derbyshire",
    region: "Midlands",
    overview:
      "Derbyshire's property market centres on Derby city — home to Rolls-Royce and Bombardier — with the Peak District National Park to the north creating a premium lifestyle market in towns like Bakewell and Matlock. Chesterfield's regeneration and the A38 corridor growth areas provide accessible development opportunities. The county's mix of industrial heritage and rural landscape creates diverse conversion and new-build opportunities.",
    drivers: [
      "Rolls-Royce and Bombardier employment anchor",
      "Derby Riverside regeneration",
      "Peak District lifestyle premium",
      "A38 corridor growth areas",
    ],
    towns: [
      { name: "Derby", slug: "derby", context: "Manufacturing city with Rolls-Royce HQ, Riverside regeneration, and university-driven demand" },
      { name: "Chesterfield", slug: "chesterfield", context: "Market town with growing regeneration agenda and affordable values relative to Sheffield" },
      { name: "Buxton", slug: "buxton", context: "Peak District spa town with heritage thermal baths regeneration and lifestyle buyer premium" },
      { name: "Matlock", slug: "matlock", context: "Derwent Valley county town with World Heritage Site proximity and tourism-supported market" },
      { name: "Belper", slug: "belper", context: "Derwent Valley Mills World Heritage town with mill conversion opportunities" },
      { name: "Ilkeston", slug: "ilkeston", context: "South-east Derbyshire town with Erewash Canal regeneration and affordable development land" },
      { name: "Swadlincote", slug: "swadlincote", context: "South Derbyshire growth area with National Forest proximity and growing population" },
      { name: "Long Eaton", slug: "long-eaton", context: "Erewash town near the Nottinghamshire border with HS2 East Midlands Hub station nearby" },
    ],
  },
  {
    name: "Nottinghamshire",
    slug: "nottinghamshire",
    region: "Midlands",
    overview:
      "Nottingham is one of the East Midlands' most dynamic cities, with two major universities, a growing creative sector, and significant regeneration investment in the Broadmarsh and Island Quarter developments. The city's strong rental market supports both BTL investment and purpose-built student accommodation. The wider county offers market town development in Newark, Mansfield, and Worksop at more affordable price points.",
    drivers: [
      "Broadmarsh and Island Quarter Nottingham regeneration",
      "Two universities driving student housing demand",
      "Creative Quarter and Lace Market conversions",
      "Newark northern growth area",
    ],
    towns: [
      { name: "Nottingham", slug: "nottingham", context: "Major city with two universities, Broadmarsh regeneration, and strong student housing demand" },
      { name: "Mansfield", slug: "mansfield", context: "North Nottinghamshire town with former coalfield regeneration and affordable development land" },
      { name: "Newark", slug: "newark", context: "Historic market town with northern growth area and East Coast Main Line connectivity" },
      { name: "Worksop", slug: "worksop", context: "Bassetlaw market town with heritage centre and growing residential demand" },
      { name: "West Bridgford", slug: "west-bridgford", context: "Premium Nottingham suburb with strong family housing demand and Trent Bridge cricket ground" },
      { name: "Arnold", slug: "arnold", context: "Gedling borough residential area with growing demand and proximity to Nottingham city" },
      { name: "Retford", slug: "retford", context: "East Coast Main Line market town with fast London services and growing commuter appeal" },
    ],
  },
  {
    name: "Leicestershire",
    slug: "leicestershire",
    region: "Midlands",
    overview:
      "Leicester has been one of the UK's fastest-growing cities, driven by a diverse economy, two universities, and a large student population that creates strong rental demand. The city's cultural diversity supports distinct property sub-markets, while the Golden Triangle (Leicester-Loughborough-Nottingham) is one of the UK's strongest buy-to-let corridors. Loughborough and Market Harborough offer distinct county town markets.",
    drivers: [
      "Leicester city centre regeneration",
      "Golden Triangle BTL corridor",
      "Loughborough university campus demand",
      "East Midlands Gateway logistics employment",
    ],
    towns: [
      { name: "Leicester", slug: "leicester", context: "Major city with two universities, strong BTL market, and significant cultural quarter regeneration" },
      { name: "Loughborough", slug: "loughborough", context: "University town with one of the UK's strongest student housing markets and growing tech sector" },
      { name: "Hinckley", slug: "hinckley", context: "South-west Leicestershire town with MIRA technology park and growing residential demand" },
      { name: "Melton Mowbray", slug: "melton-mowbray", context: "Market town with food industry heritage and northern distributor road unlocking growth" },
      { name: "Market Harborough", slug: "market-harborough", context: "Premium market town with fast London services and affluent buyer demographic" },
      { name: "Coalville", slug: "coalville", context: "North West Leicestershire town near East Midlands Airport with affordable development land" },
      { name: "Wigston", slug: "wigston", context: "Leicester suburb with strong family housing demand and good city connectivity" },
    ],
  },
  {
    name: "Northamptonshire",
    slug: "northamptonshire",
    region: "Midlands",
    overview:
      "Northamptonshire sits at the heart of England's logistics corridor, with excellent motorway connectivity via the M1, A14, and A45. Northampton's ongoing town centre regeneration and the county's position within the Oxford-Cambridge Arc create development opportunities. Daventry and Kettering offer market town development, while Corby's continued expansion from a New Town base provides volume housing opportunities.",
    drivers: [
      "Oxford-Cambridge Arc growth corridor",
      "M1 and A14 logistics employment",
      "Northampton town centre regeneration",
      "Corby continued expansion from New Town base",
    ],
    towns: [
      { name: "Northampton", slug: "northampton", context: "County town with major town centre and waterside regeneration, university campus, and logistics employment" },
      { name: "Kettering", slug: "kettering", context: "North Northamptonshire growth town with Midland Road regeneration and affordable values" },
      { name: "Corby", slug: "corby", context: "Former steel town with continued population growth, Enterprise Zone, and affordable development land" },
      { name: "Wellingborough", slug: "wellingborough", context: "Mid-Northamptonshire town with fast London Midland services and growing residential demand" },
      { name: "Daventry", slug: "daventry", context: "Logistics hub town with DIRFT distribution park driving employment and housing demand" },
      { name: "Rushden", slug: "rushden", context: "East Northamptonshire town with Rushden Lakes retail destination and growing residential market" },
      { name: "Towcester", slug: "towcester", context: "South Northamptonshire market town with Silverstone proximity and premium values" },
    ],
  },
  {
    name: "Lincolnshire",
    slug: "lincolnshire",
    region: "Midlands",
    overview:
      "Lincolnshire is one of England's largest counties by area, with a predominantly agricultural economy that creates rural development opportunities alongside Lincoln's cathedral city market. The county's east coast — from Skegness to Mablethorpe — has a distinct tourism-driven economy, while the south of the county around Grantham benefits from East Coast Main Line connectivity. Boston and Spalding serve the agricultural sector with growing residential demand.",
    drivers: [
      "Lincoln cathedral city premium and university growth",
      "East Coast tourism economy",
      "RAF base housing demand",
      "Grantham ECML connectivity and growth",
    ],
    towns: [
      { name: "Lincoln", slug: "lincoln", context: "Cathedral city with Brayford Waterfront regeneration, university campus, and strong heritage conversion market" },
      { name: "Grantham", slug: "grantham", context: "ECML market town with major southern growth area and fast London services" },
      { name: "Boston", slug: "boston", context: "Fenland market town with waterfront regeneration potential and agricultural sector employment" },
      { name: "Skegness", slug: "skegness", context: "East coast resort with holiday-let market and affordable year-round residential values" },
      { name: "Spalding", slug: "spalding", context: "South Holland agricultural hub with growing residential demand and affordable development land" },
      { name: "Sleaford", slug: "sleaford", context: "Central Lincolnshire market town with RAF Cranwell proximity and growing residential appeal" },
      { name: "Stamford", slug: "stamford", context: "Georgian stone-built market town with premium heritage values and conservation area conversions" },
      { name: "Gainsborough", slug: "gainsborough", context: "West Lindsey town with riverside regeneration and some of England's most affordable property" },
    ],
  },

  // ═══════════════════════════════════════════════
  // NORTH WEST
  // ═══════════════════════════════════════════════
  {
    name: "Greater Manchester",
    slug: "greater-manchester",
    region: "North West",
    overview:
      "Greater Manchester is the UK's largest city-region economy outside London, with Manchester city centre experiencing a development boom that has transformed the skyline. The 10-borough metropolitan county offers diverse development opportunities — from premium city-centre BTR schemes to affordable family housing in Rochdale, Oldham, and Bolton. Strong rental yields, competitive build costs, and the fastest population growth of any UK city outside London underpin a robust development market.",
    drivers: [
      "Manchester city centre BTR boom",
      "Northern Powerhouse Rail connectivity",
      "MediaCityUK Salford expansion",
      "Stockport town centre Mayoral Development Corporation",
    ],
    towns: [
      { name: "Manchester", slug: "manchester", context: "UK's fastest-growing city with major BTR pipeline, NOMA and Ancoats regeneration, and two university campuses" },
      { name: "Salford", slug: "salford", context: "MediaCityUK anchor driving Salford Quays and Crescent waterfront residential development" },
      { name: "Stockport", slug: "stockport", context: "Mayoral Development Corporation transforming town centre with major mixed-use regeneration" },
      { name: "Bolton", slug: "bolton", context: "Former mill town with town centre regeneration and affordable development opportunities" },
      { name: "Rochdale", slug: "rochdale", context: "Metrolink-connected town with riverside regeneration and affordable values" },
      { name: "Oldham", slug: "oldham", context: "Pennine fringe town with town centre masterplan and growing residential demand" },
      { name: "Bury", slug: "bury", context: "Northern GM town with famous market, Metrolink connectivity, and family housing demand" },
      { name: "Wigan", slug: "wigan", context: "Western GM town with pier quarter regeneration and strong local housing demand" },
      { name: "Altrincham", slug: "altrincham", context: "Premium South Manchester commuter town with award-winning market quarter" },
      { name: "Ashton-under-Lyne", slug: "ashton-under-lyne", context: "Eastern GM town with Tameside town centre regeneration and Metrolink connectivity" },
    ],
  },
  {
    name: "Lancashire",
    slug: "lancashire",
    region: "North West",
    overview:
      "Lancashire's property market is diverse, from Preston's growing city centre to Blackpool's coastal regeneration and the Lancashire Enterprise Zone. The county benefits from strong transport links via the M6, M65, and West Coast Main Line, with Preston offering competitive city-centre values compared to Manchester and Liverpool. The Ribble Valley and Forest of Bowland provide premium lifestyle markets.",
    drivers: [
      "Preston city centre living strategy",
      "Blackpool coastal regeneration",
      "Lancashire Enterprise Zone",
      "UCLan and Lancaster University student demand",
    ],
    towns: [
      { name: "Preston", slug: "preston", context: "Lancashire's largest city with University of Central Lancashire campus, city living strategy, and fast WCML services" },
      { name: "Blackpool", slug: "blackpool", context: "Iconic resort undergoing significant regeneration including the Talbot Gateway and central corridor" },
      { name: "Lancaster", slug: "lancaster", context: "Historic university city with canal-side development and premium bay-view residential market" },
      { name: "Burnley", slug: "burnley", context: "M65 corridor town with some of England's most affordable property and growing BTL investor interest" },
      { name: "Blackburn", slug: "blackburn", context: "East Lancashire town with Cathedral Quarter regeneration and Northgate redevelopment" },
      { name: "Chorley", slug: "chorley", context: "South Lancashire market town with Buckshaw Village major development and growing commuter appeal" },
      { name: "Accrington", slug: "accrington", context: "Hyndburn town with affordable values and heritage town centre conversion opportunities" },
      { name: "Lytham St Annes", slug: "lytham-st-annes", context: "Fylde Coast premium market with strong retirement and lifestyle buyer demand" },
    ],
  },
  {
    name: "Merseyside",
    slug: "merseyside",
    region: "North West",
    overview:
      "Merseyside's development market is anchored by Liverpool's ongoing urban renaissance — from the Baltic Triangle creative quarter to the £5.5 billion Liverpool Waters scheme. The city's strong cultural identity, two universities, and growing tech sector support a diversified residential market. Wirral and Sefton offer suburban and coastal development opportunities at lower price points than the city centre.",
    drivers: [
      "Liverpool Waters £5.5bn waterfront scheme",
      "Baltic Triangle creative quarter",
      "Knowledge Quarter and Paddington Village",
      "Wirral Waters regeneration",
    ],
    towns: [
      { name: "Liverpool", slug: "liverpool", context: "City of culture with major waterfront regeneration, two universities, and growing tech sector" },
      { name: "Birkenhead", slug: "birkenhead", context: "Wirral Waters and town centre regeneration creating significant development opportunities" },
      { name: "Southport", slug: "southport", context: "Victorian resort with seafront regeneration and retirement market demand" },
      { name: "St Helens", slug: "st-helens", context: "Glass heritage town with town centre regeneration and affordable development land" },
      { name: "Bootle", slug: "bootle", context: "North Liverpool waterfront regeneration area with Atlantic Gateway investment" },
      { name: "Wallasey", slug: "wallasey", context: "Wirral coastal town with New Brighton regeneration and growing residential demand" },
    ],
  },
  {
    name: "Cheshire",
    slug: "cheshire",
    region: "North West",
    overview:
      "Cheshire is one of England's most affluent counties outside London, with premium residential markets in Alderley Edge, Wilmslow, and Knutsford commanding some of the highest values in the North West. Chester's Roman heritage and racecourse create a premium city market, while Crewe's position on the HS2 Phase 2 route has generated development interest. Warrington's position between Manchester and Liverpool makes it a significant commercial and residential market.",
    drivers: [
      "Alderley Edge and Wilmslow ultra-premium market",
      "Chester heritage city demand",
      "Warrington new town expansion",
      "HS2 Phase 2 Crewe hub station",
    ],
    towns: [
      { name: "Chester", slug: "chester", context: "Roman heritage city with premium residential market, university campus, and conservation area conversions" },
      { name: "Warrington", slug: "warrington", context: "New Town between Manchester and Liverpool with major commercial sector and growing residential demand" },
      { name: "Crewe", slug: "crewe", context: "Railway town with HS2 hub station plans driving regeneration and development interest" },
      { name: "Macclesfield", slug: "macclesfield", context: "Silk heritage town with strong commuter demand to Manchester and growing town centre living" },
      { name: "Northwich", slug: "northwich", context: "Mid-Cheshire town with Barons Quay regeneration and heritage salt mine tourism" },
      { name: "Wilmslow", slug: "wilmslow", context: "Premium commuter town with some of the North West's highest residential values" },
      { name: "Nantwich", slug: "nantwich", context: "Historic market town with heritage character and premium South Cheshire values" },
      { name: "Ellesmere Port", slug: "ellesmere-port", context: "Mersey Gateway town with industrial heritage conversion and growing residential demand" },
    ],
  },
  {
    name: "Cumbria",
    slug: "cumbria",
    region: "North West",
    overview:
      "Cumbria's property market is unique in the North West, shaped by the Lake District National Park's tourism economy, the nuclear industry around Sellafield and the planned Moorside development, and Carlisle's position as the county's only city. Holiday-let development is a significant sector in the Lakes, while Carlisle and Barrow-in-Furness offer more conventional residential development opportunities at accessible values.",
    drivers: [
      "Lake District tourism and holiday-let demand",
      "Sellafield decommissioning and Moorside investment",
      "Carlisle Station Gateway regeneration",
      "BAE Systems Barrow submarine programme",
    ],
    towns: [
      { name: "Carlisle", slug: "carlisle", context: "Border city with Station Gateway regeneration, University of Cumbria campus, and growing residential market" },
      { name: "Barrow-in-Furness", slug: "barrow-in-furness", context: "BAE Systems submarine programme driving major housing demand and workforce growth" },
      { name: "Kendal", slug: "kendal", context: "Southern Lakes gateway town with premium lifestyle values and strong tourism economy" },
      { name: "Penrith", slug: "penrith", context: "Northern Lakes market town with M6 connectivity and growing residential demand" },
      { name: "Workington", slug: "workington", context: "West Cumbria industrial town with Sellafield-related employment and affordable development" },
      { name: "Whitehaven", slug: "whitehaven", context: "Georgian harbour town with heritage waterfront and nuclear industry employment" },
    ],
  },

  // ═══════════════════════════════════════════════
  // NORTH EAST & YORKSHIRE
  // ═══════════════════════════════════════════════
  {
    name: "West Yorkshire",
    slug: "west-yorkshire",
    region: "North East & Yorkshire",
    overview:
      "West Yorkshire is anchored by Leeds — the UK's largest financial centre outside London — which has experienced a sustained development boom in city centre living, BTR, and purpose-built student accommodation. Bradford's affordable values and university presence offer development at lower entry points, while Huddersfield and Wakefield provide market town opportunities. The county benefits from strong motorway and rail connectivity.",
    drivers: [
      "Leeds South Bank — largest regeneration site in Europe",
      "Channel 4 HQ and creative sector growth",
      "Bradford city centre regeneration",
      "Trans-Pennine Route Upgrade rail improvements",
    ],
    towns: [
      { name: "Leeds", slug: "leeds", context: "UK's largest financial centre outside London with South Bank regeneration and major BTR pipeline" },
      { name: "Bradford", slug: "bradford", context: "City with affordable development land, two university campuses, and UNESCO City of Film status" },
      { name: "Huddersfield", slug: "huddersfield", context: "University town with Pennine heritage mill conversions and growing town centre living" },
      { name: "Wakefield", slug: "wakefield", context: "Cathedral city with waterfront regeneration and Hepworth Gallery cultural anchor" },
      { name: "Halifax", slug: "halifax", context: "Calderdale heritage town with Piece Hall cultural destination and heritage mill conversions" },
      { name: "Dewsbury", slug: "dewsbury", context: "Kirklees town with affordable values and Trans-Pennine rail connectivity improvements" },
      { name: "Pontefract", slug: "pontefract", context: "Historic Wakefield district town with castle heritage and growing residential demand" },
      { name: "Ilkley", slug: "ilkley", context: "Premium West Yorkshire spa town with strong family housing demand and Wharfedale lifestyle appeal" },
    ],
  },
  {
    name: "South Yorkshire",
    slug: "south-yorkshire",
    region: "North East & Yorkshire",
    overview:
      "South Yorkshire centres on Sheffield — a city that has reinvented itself from its steel heritage into a hub for advanced manufacturing, digital industries, and higher education. The city's two universities create one of the UK's largest student populations, supporting a massive rental market. Doncaster and Rotherham offer affordable development at lower risk, while Barnsley's Glass Works regeneration is transforming the town centre.",
    drivers: [
      "Sheffield Heart of the City II regeneration",
      "Advanced Manufacturing Innovation District",
      "Doncaster Lakeside development area",
      "Barnsley Glass Works town centre regeneration",
    ],
    towns: [
      { name: "Sheffield", slug: "sheffield", context: "Steel city reinvented with two universities, advanced manufacturing sector, and Heart of the City II regeneration" },
      { name: "Doncaster", slug: "doncaster", context: "South Yorkshire's eastern city with racecourse, Lakeside development, and Doncaster Sheffield Airport legacy" },
      { name: "Rotherham", slug: "rotherham", context: "Forge Island regeneration and growing residential demand adjacent to Sheffield" },
      { name: "Barnsley", slug: "barnsley", context: "Glass Works town centre regeneration transforming the retail and residential offer" },
      { name: "Mexborough", slug: "mexborough", context: "Don Valley town with affordable values and growing connectivity via the A1(M)" },
      { name: "Wombwell", slug: "wombwell", context: "Former mining village with affordable housing and growing commuter demand to Sheffield" },
    ],
  },
  {
    name: "North Yorkshire",
    slug: "north-yorkshire",
    region: "North East & Yorkshire",
    overview:
      "North Yorkshire is England's largest county by area, spanning from the Yorkshire Dales to the North York Moors and the heritage city of York. York commands premium values driven by tourism, two universities, and its position as a major rail hub. Harrogate and Ripon offer established residential markets with strong buyer demand, while Scarborough and Whitby have coastal tourism economies supporting holiday-let development.",
    drivers: [
      "York student and tourism-driven demand",
      "Harrogate conference and spa town premium",
      "Yorkshire Dales and Moors tourism",
      "Catterick Garrison military housing demand",
    ],
    towns: [
      { name: "York", slug: "york", context: "Heritage city with two universities, major rail hub, and premium residential market within the city walls" },
      { name: "Harrogate", slug: "harrogate", context: "Spa town with strong conference tourism, premium residential values, and established buyer demand" },
      { name: "Scarborough", slug: "scarborough", context: "Yorkshire coast resort with seafront regeneration, university campus, and holiday-let market" },
      { name: "Skipton", slug: "skipton", context: "Yorkshire Dales gateway town with strong lifestyle appeal and canal quarter development" },
      { name: "Whitby", slug: "whitby", context: "Historic fishing port with premium tourism economy and growing holiday-let development demand" },
      { name: "Ripon", slug: "ripon", context: "Cathedral city with smallest city status, heritage market square, and premium values" },
      { name: "Northallerton", slug: "northallerton", context: "County town with ECML connectivity and growing residential demand from York commuters" },
      { name: "Knaresborough", slug: "knaresborough", context: "Riverside market town adjacent to Harrogate with heritage character and strong demand" },
    ],
  },
  {
    name: "Tyne and Wear",
    slug: "tyne-and-wear",
    region: "North East & Yorkshire",
    overview:
      "Tyne and Wear is the North East's metropolitan heart, with Newcastle upon Tyne and Gateshead forming a dynamic twin-city centre. Newcastle's quayside regeneration, two universities, and growing digital economy support a strong rental and development market. Sunderland's International Advanced Manufacturing Park (IAMP) and city centre regeneration are creating employment-driven housing demand. The metro system provides excellent connectivity across the conurbation.",
    drivers: [
      "Newcastle Helix innovation district",
      "Gateshead Quays arena and conference centre",
      "Sunderland IAMP advanced manufacturing",
      "Two major universities driving rental demand",
    ],
    towns: [
      { name: "Newcastle", slug: "newcastle", context: "North East's capital with quayside regeneration, Helix innovation district, and major university population" },
      { name: "Sunderland", slug: "sunderland", context: "Riverside regeneration city with IAMP advanced manufacturing and growing city centre living" },
      { name: "Gateshead", slug: "gateshead", context: "Quays conference centre and Baltic creative quarter driving residential demand south of the Tyne" },
      { name: "South Shields", slug: "south-shields", context: "Coastal South Tyneside town with seafront regeneration and Metro connectivity" },
      { name: "North Shields", slug: "north-shields", context: "Fish Quay heritage area with growing creative sector and waterfront development" },
      { name: "Washington", slug: "washington", context: "New Town with Nissan factory employment anchor and affordable residential development" },
    ],
  },
  {
    name: "County Durham",
    slug: "county-durham",
    region: "North East & Yorkshire",
    overview:
      "County Durham combines the cathedral city of Durham — a UNESCO World Heritage Site — with former mining communities that offer some of England's most affordable property. Durham University creates strong student housing demand in the city, while the wider county's regeneration zones in Bishop Auckland and Newton Aycliffe provide development opportunities at accessible values. The A1(M) corridor connects the county to Newcastle and Teesside.",
    drivers: [
      "Durham University student housing demand",
      "Bishop Auckland Heritage Action Zone",
      "Hitachi Newton Aycliffe rail manufacturing",
      "A1(M) corridor connectivity",
    ],
    towns: [
      { name: "Durham", slug: "durham", context: "UNESCO World Heritage city with premium university housing demand and conservation area constraints" },
      { name: "Bishop Auckland", slug: "bishop-auckland", context: "Heritage Action Zone and Auckland Castle cultural project driving regeneration" },
      { name: "Newton Aycliffe", slug: "newton-aycliffe", context: "New Town with Hitachi rail factory and Aycliffe Business Park employment" },
      { name: "Consett", slug: "consett", context: "Former steel town on the hills with growing residential demand and affordable values" },
      { name: "Chester-le-Street", slug: "chester-le-street", context: "Cricket town between Durham and Newcastle with growing commuter demand" },
      { name: "Peterlee", slug: "peterlee", context: "East Durham New Town with affordable development land and regeneration opportunities" },
    ],
  },
  {
    name: "Northumberland",
    slug: "northumberland",
    region: "North East & Yorkshire",
    overview:
      "Northumberland is England's most northerly county, with a property market shaped by its dramatic coastline, rural landscapes, and the growing commuter belt around Morpeth and Cramlington. The county offers some of the most affordable development opportunities in England, with strong demand for quality new-build housing in the accessible southern towns. Alnwick's castle and heritage tourism create a premium niche market.",
    drivers: [
      "Morpeth and Cramlington Newcastle commuter demand",
      "Alnwick castle heritage tourism premium",
      "AONB coastline tourism and holiday-lets",
      "Blyth offshore wind employment growth",
    ],
    towns: [
      { name: "Morpeth", slug: "morpeth", context: "Premium county town with strong Newcastle commuter demand and Carlisle Park riverside development" },
      { name: "Blyth", slug: "blyth", context: "Port town repositioning as offshore wind hub with growing energy sector employment" },
      { name: "Cramlington", slug: "cramlington", context: "South-east Northumberland town with strong family housing demand and Newcastle connectivity" },
      { name: "Alnwick", slug: "alnwick", context: "Castle town with heritage tourism premium and Alnwick Garden cultural destination" },
      { name: "Hexham", slug: "hexham", context: "Tynedale market town with abbey heritage and premium rural lifestyle values" },
      { name: "Berwick-upon-Tweed", slug: "berwick-upon-tweed", context: "Border town with ECML station and unique English-Scottish cross-border market" },
    ],
  },
  {
    name: "East Riding of Yorkshire",
    slug: "east-riding-of-yorkshire",
    region: "North East & Yorkshire",
    overview:
      "The East Riding spans from the Yorkshire Wolds to the Humber estuary, with Hull as its principal urban market. Hull's City of Culture legacy and the Siemens Gamesa wind turbine factory are transforming the city's economy and attracting development investment. The coastal resort of Bridlington offers holiday-let opportunities, while Beverley's market town premium reflects its affluent demographic and racecourse appeal.",
    drivers: [
      "Hull City of Culture legacy regeneration",
      "Siemens Gamesa green energy employment",
      "Beverley market town premium",
      "Bridlington seafront regeneration",
    ],
    towns: [
      { name: "Hull", slug: "hull", context: "City of Culture legacy with Fruit Market regeneration, Siemens wind energy, and growing creative sector" },
      { name: "Beverley", slug: "beverley", context: "Premium Minster market town with racecourse, strong independent retail, and affluent buyer demographic" },
      { name: "Bridlington", slug: "bridlington", context: "Yorkshire coast resort with seafront regeneration and growing holiday-let market" },
      { name: "Goole", slug: "goole", context: "Humber port town with affordable values and M62 corridor logistics employment" },
      { name: "Driffield", slug: "driffield", context: "Wolds market town with agricultural economy and growing residential demand" },
      { name: "Hessle", slug: "hessle", context: "Humber Bridge town with premium Hull-fringe values and waterfront development potential" },
    ],
  },

  // ═══════════════════════════════════════════════
  // EAST OF ENGLAND
  // ═══════════════════════════════════════════════
  {
    name: "Norfolk",
    slug: "norfolk",
    region: "East of England",
    overview:
      "Norfolk's property market centres on Norwich — a cathedral city with a growing university, insurance sector employment, and an independent cultural scene. The county's coastal markets from Wells to Great Yarmouth offer holiday-let and tourism-driven development, while the Broads National Park creates a unique waterside development niche. Norfolk has genuine housing undersupply in its market towns, supporting new residential development.",
    drivers: [
      "Norwich city centre regeneration",
      "Norfolk Broads tourism and waterside development",
      "North Norfolk coastal premium market",
      "UEA and NUA university demand",
    ],
    towns: [
      { name: "Norwich", slug: "norwich", context: "Cathedral city with university growth, Anglia Square regeneration, and strong independent cultural economy" },
      { name: "Great Yarmouth", slug: "great-yarmouth", context: "Coastal town with offshore energy employment, Town Deal regeneration, and affordable values" },
      { name: "King's Lynn", slug: "kings-lynn", context: "West Norfolk market town with heritage waterfront and growing residential demand" },
      { name: "Thetford", slug: "thetford", context: "Breckland town with major SUE growth area delivering 5,000+ new homes" },
      { name: "Wymondham", slug: "wymondham", context: "South Norfolk market town with Norwich commuter demand and growing town expansion" },
      { name: "Cromer", slug: "cromer", context: "North Norfolk coastal town with premium holiday-let market and heritage pier" },
      { name: "Dereham", slug: "dereham", context: "Mid-Norfolk market town with affordable values and growing residential demand" },
      { name: "Attleborough", slug: "attleborough", context: "Central Norfolk town with major growth allocation and improving A11 connectivity" },
    ],
  },
  {
    name: "Suffolk",
    slug: "suffolk",
    region: "East of England",
    overview:
      "Suffolk combines the university town market of Ipswich with the heritage coastal appeal of Aldeburgh and Southwold and the military-influenced market around Mildenhall and Lakenheath. Ipswich's waterfront regeneration has created significant residential development along the Wet Dock, while Bury St Edmunds commands market town premium values. Sizewell C's planned construction will create housing demand similar to Hinkley Point in Somerset.",
    drivers: [
      "Sizewell C nuclear construction workforce demand",
      "Ipswich waterfront regeneration",
      "US military base housing demand",
      "Felixstowe port logistics employment",
    ],
    towns: [
      { name: "Ipswich", slug: "ipswich", context: "County town with Wet Dock waterfront regeneration, university campus, and Felixstowe port proximity" },
      { name: "Bury St Edmunds", slug: "bury-st-edmunds", context: "Historic abbey town with premium market town values and strong lifestyle buyer demand" },
      { name: "Lowestoft", slug: "lowestoft", context: "Coastal town with offshore energy sector employment and Town Deal regeneration" },
      { name: "Felixstowe", slug: "felixstowe", context: "UK's largest container port driving employment and residential demand" },
      { name: "Sudbury", slug: "sudbury", context: "Gainsborough heritage market town with growing London commuter appeal" },
      { name: "Newmarket", slug: "newmarket", context: "Horse racing capital with unique property market shaped by stud farms and Jockey Club" },
      { name: "Stowmarket", slug: "stowmarket", context: "Central Suffolk market town with fast London services and major housing growth area" },
      { name: "Leiston", slug: "leiston", context: "Sizewell C adjacent town that will see significant workforce housing demand" },
    ],
  },
  {
    name: "Cambridgeshire",
    slug: "cambridgeshire",
    region: "East of England",
    overview:
      "Cambridgeshire is one of the UK's fastest-growing counties, driven by Cambridge's world-renowned technology and biotech cluster. The city's severe housing undersupply creates premium values and strong development demand, while the surrounding towns of Huntingdon, St Neots, and Ely offer development at lower entry points with good rail connectivity. The Oxford-Cambridge Arc and the Northstowe new town represent generational development opportunities.",
    drivers: [
      "Cambridge biotech and technology cluster",
      "Oxford-Cambridge Arc growth corridor",
      "Northstowe new town — 10,000 homes",
      "Cambridge South station development",
    ],
    towns: [
      { name: "Cambridge", slug: "cambridge", context: "World-class university city with severe undersupply, biotech-driven demand, and premium residential values" },
      { name: "Peterborough", slug: "peterborough", context: "Northern gateway city with significant growth agenda and affordable development land" },
      { name: "Huntingdon", slug: "huntingdon", context: "A1/A14 hub town with Alconbury Weald enterprise campus and 6,500 new homes planned" },
      { name: "St Neots", slug: "st-neots", context: "Huntingdonshire market town with fast London services and Loves Farm expansion" },
      { name: "Ely", slug: "ely", context: "Cathedral city with premium values, Cambridge commuter demand, and heritage character" },
      { name: "March", slug: "march", context: "Fenland market town with affordable values and growing residential demand" },
      { name: "Wisbech", slug: "wisbech", context: "Fenland town with Garden Town aspirations and significant regeneration plans" },
      { name: "St Ives", slug: "st-ives", context: "Cambridgeshire market town with guided busway Cambridge connectivity and riverside development" },
    ],
  },
  {
    name: "Bedfordshire",
    slug: "bedfordshire",
    region: "East of England",
    overview:
      "Bedfordshire sits at the heart of the Oxford-Cambridge Arc, making it one of the most strategically important development locations in England. Luton is undergoing major regeneration driven by airport expansion and the DART rail link, while Bedford's river-fronting town centre offers conversion and new-build opportunities. The county benefits from fast Thameslink services to London and strong employment in logistics and distribution.",
    drivers: [
      "Oxford-Cambridge Arc central location",
      "Luton airport expansion and DART link",
      "Thameslink fast London connectivity",
      "Bedford river quarter regeneration",
    ],
    towns: [
      { name: "Luton", slug: "luton", context: "Airport city with DART rail link, Power Court regeneration, and strong rental demand" },
      { name: "Bedford", slug: "bedford", context: "County town with river quarter development, strong London commuter demand, and growing population" },
      { name: "Dunstable", slug: "dunstable", context: "Busway-connected town with affordable values and proximity to Luton's employment base" },
      { name: "Biggleswade", slug: "biggleswade", context: "East Bedfordshire town with fast London services and major eastern expansion plans" },
      { name: "Leighton Buzzard", slug: "leighton-buzzard", context: "South Bedfordshire market town with London Midland connectivity and growing demand" },
      { name: "Sandy", slug: "sandy", context: "East Coast Main Line market town with fast London services and RSPB headquarters" },
      { name: "Flitwick", slug: "flitwick", context: "Mid-Bedfordshire commuter town with fast Thameslink services and family housing demand" },
    ],
  },

  // ═══════════════════════════════════════════════
  // SCOTLAND
  // ═══════════════════════════════════════════════
  {
    name: "Edinburgh",
    slug: "edinburgh",
    region: "Scotland",
    overview:
      "Edinburgh is Scotland's capital and one of the UK's most prestigious property markets, with the UNESCO Old and New Town World Heritage Site creating both opportunities and constraints. The city's financial services sector, festival economy, and university population drive strong residential demand, while the waterfront at Granton and Western Harbour represent Edinburgh's largest current development opportunities. Values in the city centre are comparable to many English cities.",
    drivers: [
      "Granton Waterfront — Edinburgh's largest regeneration",
      "Financial services and tech sector employment",
      "Three universities driving rental demand",
      "Festival economy supporting short-let market",
    ],
    towns: [
      { name: "Edinburgh City Centre", slug: "edinburgh-city-centre", context: "UNESCO World Heritage city centre with premium values and heritage conversion opportunities" },
      { name: "Leith", slug: "leith", context: "Waterfront district with ongoing residential development and growing creative sector" },
      { name: "Granton", slug: "granton", context: "Edinburgh's largest waterfront regeneration delivering 3,500 homes over coming decades" },
      { name: "Portobello", slug: "portobello", context: "Seaside suburb with strong family demand and growing independent retail scene" },
      { name: "Corstorphine", slug: "corstorphine", context: "West Edinburgh suburb with airport proximity and strong family housing market" },
      { name: "Musselburgh", slug: "musselburgh", context: "East Lothian border town with Edinburgh commuter demand and racecourse heritage" },
    ],
  },
  {
    name: "Glasgow",
    slug: "glasgow",
    region: "Scotland",
    overview:
      "Glasgow is Scotland's largest city and economic engine, with a property market that offers significantly more affordable development opportunities than Edinburgh while delivering strong rental yields. The city's extensive regeneration — from the Clyde waterfront to the Sighthill Transformational Regeneration Area — is creating development pipelines at scale. Glasgow's four universities generate one of the UK's largest student populations.",
    drivers: [
      "Clyde waterfront and Buchanan Wharf regeneration",
      "Sighthill Transformational Regeneration Area",
      "Four universities — largest student population in Scotland",
      "COP26 legacy and net-zero innovation",
    ],
    towns: [
      { name: "Glasgow City Centre", slug: "glasgow-city-centre", context: "Scotland's commercial capital with Buchanan Quarter regeneration and growing BTR sector" },
      { name: "Govan", slug: "govan", context: "Clyde waterfront regeneration area with BAE shipbuilding and Queen Elizabeth University Hospital" },
      { name: "Partick", slug: "partick", context: "West End neighbourhood near Glasgow University with strong rental demand and conversion opportunities" },
      { name: "Shawlands", slug: "shawlands", context: "South Side neighbourhood with growing appeal and improving independent retail scene" },
      { name: "East End", slug: "east-end", context: "Commonwealth Games legacy area with Clyde Gateway regeneration and affordable development land" },
      { name: "Maryhill", slug: "maryhill", context: "Canal-side regeneration with affordable housing development and improving connectivity" },
    ],
  },
  {
    name: "Aberdeen",
    slug: "aberdeen",
    region: "Scotland",
    overview:
      "Aberdeen's property market is undergoing a significant transition as the city diversifies from its historic dependence on oil and gas toward renewable energy, hydrogen, and carbon capture. The Energy Transition Zone at the harbour is attracting investment, while the city centre — previously dominated by commercial property — is seeing growing demand for residential conversion. Values have corrected from their oil-boom peak, creating buying opportunities.",
    drivers: [
      "Energy Transition Zone harbour development",
      "Aberdeen South Harbour — largest new port in UK",
      "University of Aberdeen and RGU student demand",
      "City centre commercial-to-residential conversions",
    ],
    towns: [
      { name: "Aberdeen City Centre", slug: "aberdeen-city-centre", context: "Granite city core with commercial conversion opportunities and growing residential demand" },
      { name: "Torry", slug: "torry", context: "Energy Transition Zone and South Harbour creating major regeneration alongside residential development" },
      { name: "Dyce", slug: "dyce", context: "Airport and heliport area with energy sector employment and residential demand" },
      { name: "Cove Bay", slug: "cove-bay", context: "Southern coastal suburb with growing family housing and harbour development proximity" },
      { name: "Westhill", slug: "westhill", context: "Suburban settlement with energy sector employment and strong family housing market" },
      { name: "Bridge of Don", slug: "bridge-of-don", context: "Northern Aberdeen suburb with university proximity and established residential market" },
    ],
  },
  {
    name: "Dundee",
    slug: "dundee",
    region: "Scotland",
    overview:
      "Dundee has been transformed by the V&A Museum and the wider waterfront regeneration, creating a cultural anchor that is reshaping the city's residential market. Two universities — Dundee and Abertay — generate strong student demand, while the city's growing digital games sector (home to Grand Theft Auto developer Rockstar North's origins) attracts tech workers. Property values remain among the most affordable of Scotland's cities.",
    drivers: [
      "V&A Dundee and waterfront regeneration",
      "Digital games and creative tech sector",
      "Two universities — student housing demand",
      "Tay Cities Deal investment",
    ],
    towns: [
      { name: "Dundee City Centre", slug: "dundee-city-centre", context: "V&A waterfront transformation with growing residential market and two university campuses" },
      { name: "Broughty Ferry", slug: "broughty-ferry", context: "Premium coastal suburb with beach esplanade and strong family housing demand" },
      { name: "Lochee", slug: "lochee", context: "Inner suburb with affordable values and jute mill heritage conversion opportunities" },
      { name: "Monifieth", slug: "monifieth", context: "Eastern coastal town with Dundee commuter demand and growing residential market" },
    ],
  },
  {
    name: "Highland",
    slug: "highland",
    region: "Scotland",
    overview:
      "The Highlands is the largest local authority area in the UK, with Inverness as its capital and economic centre. The city is experiencing significant growth driven by tourism, the University of the Highlands and Islands, and the renewable energy sector. The wider Highlands offer rural development opportunities including holiday-let construction, agricultural conversion, and estate development. Distance from Central Scotland creates a distinct market.",
    drivers: [
      "Inverness city centre expansion",
      "Tourism and holiday-let construction",
      "Renewable energy sector employment",
      "University of the Highlands and Islands growth",
    ],
    towns: [
      { name: "Inverness", slug: "inverness", context: "Highland capital with growing university presence, tourism economy, and city centre living demand" },
      { name: "Fort William", slug: "fort-william", context: "Outdoor capital of the UK with strong tourism economy and housing affordability challenges" },
      { name: "Nairn", slug: "nairn", context: "Moray Firth coastal town with retirement and lifestyle buyer demand" },
      { name: "Aviemore", slug: "aviemore", context: "Cairngorms tourism hub with year-round visitor economy and holiday-let development demand" },
      { name: "Thurso", slug: "thurso", context: "North Highland town with Dounreay decommissioning and space sector at Sutherland Spaceport" },
    ],
  },
  {
    name: "Fife",
    slug: "fife",
    region: "Scotland",
    overview:
      "Fife — the 'Kingdom of Fife' — sits between Edinburgh and Dundee, with St Andrews' university and golf heritage creating an internationally recognised premium market. Dunfermline and Kirkcaldy provide more accessible development opportunities, with the former benefiting from city status and Edinburgh commuter demand via the Queensferry Crossing. The East Neuk fishing villages offer premium holiday-let and conversion opportunities.",
    drivers: [
      "St Andrews university and golf tourism premium",
      "Dunfermline city status and Edinburgh commuter demand",
      "Queensferry Crossing improved connectivity",
      "East Neuk coastal premium and holiday-let market",
    ],
    towns: [
      { name: "Dunfermline", slug: "dunfermline", context: "Scotland's newest city with Edinburgh commuter demand and growing town centre regeneration" },
      { name: "Kirkcaldy", slug: "kirkcaldy", context: "Fife's largest town with waterfront regeneration potential and affordable development land" },
      { name: "St Andrews", slug: "st-andrews", context: "University and golf capital with ultra-premium values and strong international buyer demand" },
      { name: "Glenrothes", slug: "glenrothes", context: "New Town with affordable development land and Fife business park employment" },
      { name: "Cowdenbeath", slug: "cowdenbeath", context: "West Fife town with affordable values and growing Edinburgh commuter demand" },
      { name: "Cupar", slug: "cupar", context: "North Fife market town with agricultural heritage and growing residential appeal" },
    ],
  },

  // ═══════════════════════════════════════════════
  // WALES
  // ═══════════════════════════════════════════════
  {
    name: "Cardiff",
    slug: "cardiff",
    region: "Wales",
    overview:
      "Cardiff is Wales' capital and its most active property development market, with a growing population, three universities, and a diversified economy spanning financial services, media, and the public sector. Cardiff Bay's waterfront transformation was a pioneering regeneration model, and the city centre continues to develop with schemes around Central Square and the Dumballs Road quarter. Strong rental demand from students and young professionals supports a robust BTL market.",
    drivers: [
      "Central Square BBC Wales and transport hub",
      "Dumballs Road mixed-use quarter",
      "Three universities — strong student demand",
      "South Wales Metro connectivity improvements",
    ],
    towns: [
      { name: "Cardiff City Centre", slug: "cardiff-city-centre", context: "Welsh capital with Central Square regeneration, three universities, and growing BTR sector" },
      { name: "Cardiff Bay", slug: "cardiff-bay", context: "Pioneering waterfront regeneration with continuing residential and commercial development" },
      { name: "Canton", slug: "canton", context: "Popular inner suburb with strong rental demand and Victorian terrace refurbishment opportunities" },
      { name: "Cathays", slug: "cathays", context: "University quarter with strong HMO and student housing market near Cardiff University" },
      { name: "Splott", slug: "splott", context: "Emerging inner-city area with industrial heritage conversions and growing buyer interest" },
      { name: "Pontcanna", slug: "pontcanna", context: "Premium Cardiff neighbourhood with strong family demand and period property conversions" },
    ],
  },
  {
    name: "Swansea",
    slug: "swansea",
    region: "Wales",
    overview:
      "Swansea's property market is being reshaped by the major city centre and waterfront regeneration programme. The Swansea Bay City Deal is investing over £1 billion in the region, while the University of Swansea's Bay Campus has created a new residential catchment. The Gower Peninsula — the UK's first designated Area of Outstanding Natural Beauty — creates a premium coastal market for holiday-let and lifestyle development.",
    drivers: [
      "Swansea Bay City Deal — £1bn+ investment",
      "City centre regeneration and arena district",
      "University Bay Campus residential demand",
      "Gower Peninsula coastal premium market",
    ],
    towns: [
      { name: "Swansea City Centre", slug: "swansea-city-centre", context: "Arena quarter regeneration and wind street leisure district driving city centre living" },
      { name: "Mumbles", slug: "mumbles", context: "Premium Gower gateway village with seafront values and strong lifestyle buyer demand" },
      { name: "SA1 Waterfront", slug: "sa1-waterfront", context: "Major waterfront development district with marina residential and commercial schemes" },
      { name: "Sketty", slug: "sketty", context: "Residential suburb near Singleton University campus with student and family housing demand" },
      { name: "Morriston", slug: "morriston", context: "Hospital quarter area with affordable values and growing residential demand" },
      { name: "Neath", slug: "neath", context: "Neath Port Talbot town centre with affordable development opportunities and valley connectivity" },
    ],
  },
  {
    name: "Newport",
    slug: "newport",
    region: "Wales",
    overview:
      "Newport is emerging as one of South Wales' most interesting development markets, with significantly lower values than Cardiff but strong growth fundamentals. The city's location at the M4 junction with direct London services, the International Convention Centre of Wales, and the growing tech sector are creating demand that outpaces current supply. The Transporter Bridge and riverside quarter represent heritage regeneration opportunities.",
    drivers: [
      "International Convention Centre of Wales",
      "M4 corridor and London Paddington services",
      "Tech sector growth and compound semiconductor cluster",
      "Riverside quarter and Transporter Bridge regeneration",
    ],
    towns: [
      { name: "Newport City Centre", slug: "newport-city-centre", context: "M4 junction city with convention centre, fast London trains, and growing tech sector" },
      { name: "Caerleon", slug: "caerleon", context: "Roman heritage suburb with university campus and premium residential values" },
      { name: "Maindee", slug: "maindee", context: "Inner city area with affordable values and growing regeneration interest" },
      { name: "Cwmbran", slug: "cwmbran", context: "New Town with affordable development land and growing South Wales commuter demand" },
      { name: "Pontypool", slug: "pontypool", context: "Torfaen valley town with affordable values and heritage ironworks conversion potential" },
    ],
  },
  {
    name: "Powys",
    slug: "powys",
    region: "Wales",
    overview:
      "Powys is Wales' largest and most sparsely populated county, spanning the rural heart of Mid Wales from the Brecon Beacons to the Shropshire border. The property market is characterised by rural development — barn conversions, farmstead developments, and small-scale housing in market towns. Brecon, Newtown, and Welshpool are the principal residential markets. Tourism and agriculture underpin the local economy, with the Brecon Beacons National Park driving holiday-let demand.",
    drivers: [
      "Brecon Beacons National Park tourism",
      "Rural barn conversion opportunities",
      "Agricultural diversification PD rights",
      "Market town housing undersupply",
    ],
    towns: [
      { name: "Brecon", slug: "brecon", context: "National Park gateway town with tourism economy and premium heritage market" },
      { name: "Newtown", slug: "newtown", context: "Mid-Wales' largest town with manufacturing heritage and affordable development land" },
      { name: "Welshpool", slug: "welshpool", context: "Welsh border market town with Shropshire connectivity and growing residential demand" },
      { name: "Llandrindod Wells", slug: "llandrindod-wells", context: "Victorian spa town with heritage character and affordable values" },
      { name: "Builth Wells", slug: "builth-wells", context: "Royal Welsh Show town with agricultural heritage and rural market appeal" },
      { name: "Hay-on-Wye", slug: "hay-on-wye", context: "Book town with international literary festival and premium lifestyle buyer demand" },
    ],
  },
  {
    name: "Gwynedd",
    slug: "gwynedd",
    region: "Wales",
    overview:
      "Gwynedd encompasses Snowdonia National Park and the Llŷn Peninsula, creating a tourism-driven property market with significant Welsh language and cultural considerations. Bangor's university creates student demand, while Caernarfon's castle heritage and Porthmadog's coastal appeal support distinct residential markets. The county has introduced some of Wales' strictest second-home planning restrictions, which developers need to navigate carefully.",
    drivers: [
      "Snowdonia National Park tourism economy",
      "Bangor University student housing demand",
      "Welsh language planning considerations",
      "Second-home planning restrictions shaping market",
    ],
    towns: [
      { name: "Bangor", slug: "bangor", context: "University city with strong student housing demand and Menai Strait waterfront" },
      { name: "Caernarfon", slug: "caernarfon", context: "Castle town with UNESCO World Heritage status and growing tourism economy" },
      { name: "Porthmadog", slug: "porthmadog", context: "Coastal town with Ffestiniog Railway heritage and holiday-let market demand" },
      { name: "Pwllheli", slug: "pwllheli", context: "Llŷn Peninsula market town with marina development and tourism economy" },
      { name: "Dolgellau", slug: "dolgellau", context: "Southern Snowdonia market town with outdoor tourism and heritage stone buildings" },
      { name: "Bethesda", slug: "bethesda", context: "Slate quarry town near Zip World with growing adventure tourism employment" },
    ],
  },
];

/**
 * Get county data by slug
 */
export function getCountyBySlug(slug: string): CountyData | undefined {
  return UK_COUNTIES.find((c) => c.slug === slug);
}

/**
 * Get all towns for a county
 */
export function getTownsForCounty(countySlug: string): TownData[] {
  const county = getCountyBySlug(countySlug);
  return county?.towns ?? [];
}

/**
 * Get a specific town in a county
 */
export function getTownInCounty(
  countySlug: string,
  townSlug: string,
): TownData | undefined {
  const towns = getTownsForCounty(countySlug);
  return towns.find((t) => t.slug === townSlug);
}

/**
 * Get related towns (same county, excluding current)
 */
export function getRelatedTowns(
  countySlug: string,
  currentTownSlug: string,
  limit = 6,
): TownData[] {
  const towns = getTownsForCounty(countySlug);
  return towns.filter((t) => t.slug !== currentTownSlug).slice(0, limit);
}
