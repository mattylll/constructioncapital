/**
 * Probe candidate Idox Public Access URLs for LPAs that are not yet in the
 * registry. For each LPA we try a set of predictable URL patterns and mark
 * the first one that returns a valid Idox advanced search page.
 *
 * The "valid Idox" signal is the presence of both a CSRF token input and
 * the caseAddressType=Application form field — the two things the scraper
 * actually needs. Sites that redirect to a different search stack (Arcus,
 * Geographical, Agile etc.) won't match.
 *
 * Usage:  npx tsx scripts/probe-idox-portals.ts > /tmp/idox-probes.txt
 */

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

interface Target {
  id: string; // proposed registry id
  name: string;
  towns: Array<{ townSlug: string; countySlug: string }>;
  /** URL bases to try, in priority order. `{path}` placeholders get /online-applications appended. */
  candidates: string[];
}

const TARGETS: Target[] = [
  // ── Derbyshire
  { id: "amber-valley", name: "Amber Valley Borough Council",
    towns: [{ townSlug: "belper", countySlug: "derbyshire" }],
    candidates: ["https://info.ambervalley.gov.uk", "https://publicaccess.ambervalley.gov.uk", "https://planning.ambervalley.gov.uk"] },
  { id: "south-derbyshire", name: "South Derbyshire District Council",
    towns: [{ townSlug: "swadlincote", countySlug: "derbyshire" }],
    candidates: ["https://planning.southderbyshire.gov.uk", "https://publicaccess.south-derbys.gov.uk"] },
  { id: "erewash", name: "Erewash Borough Council",
    towns: [
      { townSlug: "ilkeston", countySlug: "derbyshire" },
      { townSlug: "long-eaton", countySlug: "derbyshire" },
    ],
    candidates: ["https://pa.erewash.gov.uk", "https://publicaccess.erewash.gov.uk", "https://planning.erewash.gov.uk"] },

  // ── Sussex
  { id: "arun", name: "Arun District Council",
    towns: [{ townSlug: "bognor-regis", countySlug: "sussex" }],
    candidates: ["https://www1.arun.gov.uk/planrec", "https://publicaccess.arun.gov.uk", "https://planning.arun.gov.uk"] },
  { id: "crawley", name: "Crawley Borough Council",
    towns: [{ townSlug: "crawley", countySlug: "sussex" }],
    candidates: ["https://planningregister.crawley.gov.uk", "https://publicaccess.crawley.gov.uk"] },

  // ── Kent
  { id: "ashford-kent", name: "Ashford Borough Council",
    towns: [{ townSlug: "ashford", countySlug: "kent" }],
    candidates: ["https://planning.ashford.gov.uk", "https://publicaccess.ashford.gov.uk", "https://planning01.ashford.gov.uk"] },
  { id: "folkestone-hythe", name: "Folkestone & Hythe District Council",
    towns: [{ townSlug: "folkestone", countySlug: "kent" }],
    candidates: ["https://searchplanning.folkestone-hythe.gov.uk", "https://publicaccess.folkestone-hythe.gov.uk", "https://planning.folkestone-hythe.gov.uk"] },
  { id: "tunbridge-wells", name: "Tunbridge Wells Borough Council",
    towns: [{ townSlug: "tunbridge-wells", countySlug: "kent" }],
    candidates: ["https://twbcpa.midkent.gov.uk", "https://publicaccess.tunbridgewells.gov.uk", "https://planning.tunbridgewells.gov.uk"] },

  // ── Essex
  { id: "basildon", name: "Basildon Borough Council",
    towns: [{ townSlug: "basildon", countySlug: "essex" }],
    candidates: ["https://planning.basildon.gov.uk", "https://publicaccess.basildon.gov.uk"] },
  { id: "braintree", name: "Braintree District Council",
    towns: [{ townSlug: "braintree", countySlug: "essex" }],
    candidates: ["https://publicaccess.braintree.gov.uk", "https://planning.braintree.gov.uk"] },
  { id: "brentwood", name: "Brentwood Borough Council",
    towns: [{ townSlug: "brentwood", countySlug: "essex" }],
    candidates: ["https://publicaccess.brentwood.gov.uk", "https://planning.brentwood.gov.uk"] },
  { id: "castle-point", name: "Castle Point Borough Council",
    towns: [{ townSlug: "canvey-island", countySlug: "essex" }],
    candidates: ["https://publicaccess.castlepoint.gov.uk", "https://planningsearch.castlepoint.gov.uk"] },
  { id: "colchester", name: "Colchester City Council",
    towns: [{ townSlug: "colchester", countySlug: "essex" }],
    candidates: ["https://www.colchester.gov.uk/wampr", "https://publicaccess.colchester.gov.uk", "https://planning.colchester.gov.uk"] },
  { id: "harlow", name: "Harlow Council",
    towns: [{ townSlug: "harlow", countySlug: "essex" }],
    candidates: ["https://planapps.harlow.gov.uk", "https://publicaccess.harlow.gov.uk"] },
  { id: "southend", name: "Southend-on-Sea City Council",
    towns: [{ townSlug: "southend-on-sea", countySlug: "essex" }],
    candidates: ["https://publicaccess.southend.gov.uk", "https://planning.southend.gov.uk"] },
  { id: "tendring", name: "Tendring District Council",
    towns: [{ townSlug: "clacton-on-sea", countySlug: "essex" }],
    candidates: ["https://idox.tendringdc.gov.uk", "https://publicaccess.tendringdc.gov.uk", "https://planning.tendringdc.gov.uk"] },
  { id: "thurrock", name: "Thurrock Council",
    towns: [{ townSlug: "grays", countySlug: "essex" }],
    candidates: ["https://regs.thurrock.gov.uk", "https://publicaccess.thurrock.gov.uk", "https://planning.thurrock.gov.uk"] },

  // ── Bedfordshire
  { id: "central-bedfordshire", name: "Central Bedfordshire Council",
    towns: [
      { townSlug: "dunstable", countySlug: "bedfordshire" },
      { townSlug: "biggleswade", countySlug: "bedfordshire" },
      { townSlug: "leighton-buzzard", countySlug: "bedfordshire" },
      { townSlug: "sandy", countySlug: "bedfordshire" },
      { townSlug: "flitwick", countySlug: "bedfordshire" },
    ],
    candidates: ["https://plantech.centralbedfordshire.gov.uk", "https://publicaccess.centralbedfordshire.gov.uk", "https://planning.centralbedfordshire.gov.uk"] },

  // ── Berkshire
  { id: "wokingham", name: "Wokingham Borough Council",
    towns: [{ townSlug: "wokingham", countySlug: "berkshire" }],
    candidates: ["https://publicaccess.wokingham.gov.uk", "https://planning.wokingham.gov.uk"] },
  { id: "reading", name: "Reading Borough Council",
    towns: [{ townSlug: "reading", countySlug: "berkshire" }],
    candidates: ["https://planning.reading.gov.uk", "https://publicaccess.reading.gov.uk", "https://rbr.reading.gov.uk"] },
  { id: "slough", name: "Slough Borough Council",
    towns: [{ townSlug: "slough", countySlug: "berkshire" }],
    candidates: ["https://www2.slough.gov.uk", "https://publicaccess.slough.gov.uk", "https://planning.slough.gov.uk"] },

  // ── Leicestershire / Midlands
  { id: "charnwood", name: "Charnwood Borough Council",
    towns: [{ townSlug: "loughborough", countySlug: "leicestershire" }],
    candidates: ["https://portal.charnwood.gov.uk", "https://publicaccess.charnwood.gov.uk", "https://planning.charnwood.gov.uk"] },
  { id: "nuneaton-bedworth", name: "Nuneaton & Bedworth Borough Council",
    towns: [
      { townSlug: "nuneaton", countySlug: "warwickshire" },
      { townSlug: "bedworth", countySlug: "warwickshire" },
    ],
    candidates: ["https://planapps.nuneatonandbedworth.gov.uk", "https://publicaccess.nuneatonandbedworth.gov.uk"] },
  { id: "rugby", name: "Rugby Borough Council",
    towns: [{ townSlug: "rugby", countySlug: "warwickshire" }],
    candidates: ["https://planning.rugby.gov.uk", "https://publicaccess.rugby.gov.uk"] },
  { id: "stratford-on-avon", name: "Stratford-on-Avon District Council",
    towns: [{ townSlug: "stratford-upon-avon", countySlug: "warwickshire" }],
    candidates: ["https://apps.stratford.gov.uk", "https://publicaccess.stratford.gov.uk", "https://planning.stratford.gov.uk"] },

  // ── Oxfordshire
  { id: "cherwell", name: "Cherwell District Council",
    towns: [
      { townSlug: "banbury", countySlug: "oxfordshire" },
      { townSlug: "bicester", countySlug: "oxfordshire" },
    ],
    candidates: ["https://planningregister.cherwell.gov.uk", "https://publicaccess.cherwell.gov.uk", "https://planning.cherwell.gov.uk"] },
  { id: "south-oxfordshire", name: "South Oxfordshire District Council",
    towns: [
      { townSlug: "didcot", countySlug: "oxfordshire" },
      { townSlug: "henley-on-thames", countySlug: "oxfordshire" },
      { townSlug: "thame", countySlug: "oxfordshire" },
    ],
    candidates: ["https://data.southoxon.gov.uk/ccm/support/dispatchSupportCmd.jsp", "https://publicaccess.southoxon.gov.uk", "https://planning.southoxon.gov.uk"] },
  { id: "vale-white-horse", name: "Vale of White Horse District Council",
    towns: [{ townSlug: "abingdon", countySlug: "oxfordshire" }],
    candidates: ["https://data.whitehorsedc.gov.uk/ccm/support/dispatchSupportCmd.jsp", "https://publicaccess.whitehorsedc.gov.uk", "https://planning.whitehorsedc.gov.uk"] },

  // ── Staffs
  { id: "cannock-chase", name: "Cannock Chase Council",
    towns: [{ townSlug: "cannock", countySlug: "staffordshire" }],
    candidates: ["https://planning.cannockchasedc.gov.uk", "https://publicaccess.cannockchasedc.gov.uk"] },
  { id: "east-staffordshire", name: "East Staffordshire Borough Council",
    towns: [{ townSlug: "burton-upon-trent", countySlug: "staffordshire" }],
    candidates: ["https://publicaccess.eaststaffsbc.gov.uk", "https://planning.eaststaffsbc.gov.uk"] },
  { id: "tamworth", name: "Tamworth Borough Council",
    towns: [{ townSlug: "tamworth", countySlug: "staffordshire" }],
    candidates: ["https://planning.tamworth.gov.uk", "https://publicaccess.tamworth.gov.uk"] },

  // ── Hampshire
  { id: "eastleigh", name: "Eastleigh Borough Council",
    towns: [{ townSlug: "eastleigh", countySlug: "hampshire" }],
    candidates: ["https://planning.eastleigh.gov.uk", "https://publicaccess.eastleigh.gov.uk"] },
  { id: "fareham", name: "Fareham Borough Council",
    towns: [{ townSlug: "fareham", countySlug: "hampshire" }],
    candidates: ["https://publicaccess-online.fareham.gov.uk", "https://publicaccess.fareham.gov.uk", "https://planning.fareham.gov.uk"] },

  // ── Norfolk
  { id: "breckland", name: "Breckland Council",
    towns: [
      { townSlug: "thetford", countySlug: "norfolk" },
      { townSlug: "dereham", countySlug: "norfolk" },
      { townSlug: "attleborough", countySlug: "norfolk" },
    ],
    candidates: ["https://plan.breckland.gov.uk", "https://publicaccess.breckland.gov.uk", "https://planning.breckland.gov.uk"] },
  { id: "kings-lynn-west-norfolk", name: "King's Lynn & West Norfolk Borough Council",
    towns: [{ townSlug: "kings-lynn", countySlug: "norfolk" }],
    candidates: ["https://online.west-norfolk.gov.uk", "https://publicaccess.west-norfolk.gov.uk", "https://planning.west-norfolk.gov.uk"] },

  // ── Suffolk
  { id: "ipswich", name: "Ipswich Borough Council",
    towns: [{ townSlug: "ipswich", countySlug: "suffolk" }],
    candidates: ["https://online.ipswich.gov.uk", "https://publicaccess.ipswich.gov.uk", "https://planning.ipswich.gov.uk"] },

  // ── Dorset / Wiltshire / South West
  { id: "dorset", name: "Dorset Council",
    towns: [
      { townSlug: "weymouth", countySlug: "dorset" },
      { townSlug: "dorchester", countySlug: "dorset" },
      { townSlug: "wimborne", countySlug: "dorset" },
      { townSlug: "sherborne", countySlug: "dorset" },
      { townSlug: "bridport", countySlug: "dorset" },
    ],
    candidates: ["https://planning.dorsetcouncil.gov.uk", "https://publicaccess.dorsetcouncil.gov.uk"] },
  { id: "wiltshire", name: "Wiltshire Council",
    towns: [
      { townSlug: "salisbury", countySlug: "wiltshire" },
      { townSlug: "chippenham", countySlug: "wiltshire" },
      { townSlug: "trowbridge", countySlug: "wiltshire" },
      { townSlug: "melksham", countySlug: "wiltshire" },
      { townSlug: "marlborough", countySlug: "wiltshire" },
      { townSlug: "devizes", countySlug: "wiltshire" },
      { townSlug: "warminster", countySlug: "wiltshire" },
    ],
    candidates: ["https://planning.wiltshire.gov.uk", "https://publicaccess.wiltshire.gov.uk"] },
  { id: "somerset", name: "Somerset Council",
    towns: [
      { townSlug: "taunton", countySlug: "somerset" },
      { townSlug: "bridgwater", countySlug: "somerset" },
    ],
    candidates: ["https://publicaccess.somerset.gov.uk", "https://planning.somerset.gov.uk", "https://publicaccess.somersetwestandtaunton.gov.uk"] },
  { id: "bath-nes", name: "Bath & North East Somerset Council",
    towns: [
      { townSlug: "bath", countySlug: "somerset" },
      { townSlug: "keynsham", countySlug: "bristol" },
    ],
    candidates: ["https://planning.bathnes.gov.uk", "https://isharemaps.bathnes.gov.uk", "https://publicaccess.bathnes.gov.uk"] },
  { id: "south-gloucestershire", name: "South Gloucestershire Council",
    towns: [{ townSlug: "filton", countySlug: "bristol" }],
    candidates: ["https://developments.southglos.gov.uk", "https://publicaccess.southglos.gov.uk", "https://planning.southglos.gov.uk"] },

  // ── Cheshire / North West
  { id: "cheshire-east", name: "Cheshire East Council",
    towns: [
      { townSlug: "crewe", countySlug: "cheshire" },
      { townSlug: "macclesfield", countySlug: "cheshire" },
      { townSlug: "wilmslow", countySlug: "cheshire" },
      { townSlug: "nantwich", countySlug: "cheshire" },
    ],
    candidates: ["https://pa.cheshireeast.gov.uk", "https://publicaccess.cheshireeast.gov.uk", "https://planning.cheshireeast.gov.uk"] },
  { id: "warrington", name: "Warrington Borough Council",
    towns: [{ townSlug: "warrington", countySlug: "cheshire" }],
    candidates: ["https://publicaccess.warrington.gov.uk", "https://planning.warrington.gov.uk", "https://pp.warrington.gov.uk"] },

  // ── Lancashire
  { id: "preston", name: "Preston City Council",
    towns: [{ townSlug: "preston", countySlug: "lancashire" }],
    candidates: ["https://publicaccess.preston.gov.uk", "https://planning.preston.gov.uk"] },
  { id: "hyndburn", name: "Hyndburn Borough Council",
    towns: [{ townSlug: "accrington", countySlug: "lancashire" }],
    candidates: ["https://planregister.hyndburnbc.gov.uk", "https://publicaccess.hyndburnbc.gov.uk"] },
  { id: "fylde", name: "Fylde Council",
    towns: [{ townSlug: "lytham-st-annes", countySlug: "lancashire" }],
    candidates: ["https://publicaccess.fylde.gov.uk", "https://planning.fylde.gov.uk"] },
  { id: "blackburn-darwen", name: "Blackburn with Darwen Borough Council",
    towns: [{ townSlug: "blackburn", countySlug: "lancashire" }],
    candidates: ["https://webapps.blackburn.gov.uk", "https://publicaccess.blackburn.gov.uk", "https://planning.blackburn.gov.uk"] },

  // ── Lincs
  { id: "east-lindsey", name: "East Lindsey District Council",
    towns: [{ townSlug: "skegness", countySlug: "lincolnshire" }],
    candidates: ["https://publicaccess.e-lindsey.gov.uk", "https://planning.e-lindsey.gov.uk"] },
  { id: "west-lindsey", name: "West Lindsey District Council",
    towns: [{ townSlug: "gainsborough", countySlug: "lincolnshire" }],
    candidates: ["https://publicaccess.west-lindsey.gov.uk", "https://planning.west-lindsey.gov.uk"] },
  { id: "south-holland", name: "South Holland District Council",
    towns: [{ townSlug: "spalding", countySlug: "lincolnshire" }],
    candidates: ["https://publicaccess.sholland.gov.uk", "https://planning.sholland.gov.uk"] },
  { id: "boston", name: "Boston Borough Council",
    towns: [{ townSlug: "boston", countySlug: "lincolnshire" }],
    candidates: ["https://publicaccess.boston.gov.uk", "https://planning.boston.gov.uk"] },

  // ── Worcs
  { id: "malvern-hills", name: "Malvern Hills District Council",
    towns: [{ townSlug: "malvern", countySlug: "worcestershire" }],
    candidates: ["https://plan.malvernhills.gov.uk", "https://publicaccess.malvernhills.gov.uk", "https://planning.malvernhills.gov.uk"] },
  { id: "wychavon", name: "Wychavon District Council",
    towns: [
      { townSlug: "droitwich", countySlug: "worcestershire" },
      { townSlug: "evesham", countySlug: "worcestershire" },
    ],
    candidates: ["https://plan.wychavon.gov.uk", "https://publicaccess.wychavon.gov.uk", "https://planning.wychavon.gov.uk"] },
  { id: "worcester", name: "Worcester City Council",
    towns: [{ townSlug: "worcester", countySlug: "worcestershire" }],
    candidates: ["https://plan.worcester.gov.uk", "https://publicaccess.worcester.gov.uk", "https://planning.worcester.gov.uk"] },

  // ── Tyne & Wear
  { id: "newcastle", name: "Newcastle City Council",
    towns: [{ townSlug: "newcastle", countySlug: "tyne-and-wear" }],
    candidates: ["https://publicaccessapplications.newcastle.gov.uk", "https://publicaccess.newcastle.gov.uk", "https://planning.newcastle.gov.uk"] },
  { id: "north-tyneside", name: "North Tyneside Council",
    towns: [{ townSlug: "north-shields", countySlug: "tyne-and-wear" }],
    candidates: ["https://idoxpa.northtyneside.gov.uk", "https://publicaccess.northtyneside.gov.uk", "https://planning.northtyneside.gov.uk"] },
  { id: "south-tyneside", name: "South Tyneside Council",
    towns: [{ townSlug: "south-shields", countySlug: "tyne-and-wear" }],
    candidates: ["https://online.southtyneside.gov.uk", "https://publicaccess.southtyneside.gov.uk", "https://planning.southtyneside.gov.uk"] },

  // ── Yorkshire
  { id: "barnsley", name: "Barnsley Metropolitan Borough Council",
    towns: [
      { townSlug: "barnsley", countySlug: "south-yorkshire" },
      { townSlug: "wombwell", countySlug: "south-yorkshire" },
    ],
    candidates: ["https://planningapps.barnsley.gov.uk", "https://publicaccess.barnsley.gov.uk", "https://planning.barnsley.gov.uk"] },
  { id: "rotherham", name: "Rotherham Metropolitan Borough Council",
    towns: [{ townSlug: "rotherham", countySlug: "south-yorkshire" }],
    candidates: ["https://planning.rotherham.gov.uk", "https://publicaccess.rotherham.gov.uk"] },
  { id: "kirklees", name: "Kirklees Council",
    towns: [
      { townSlug: "huddersfield", countySlug: "west-yorkshire" },
      { townSlug: "dewsbury", countySlug: "west-yorkshire" },
    ],
    candidates: ["https://www.kirklees.gov.uk/beta/planning-applications/search-applications.aspx", "https://publicaccess.kirklees.gov.uk", "https://planning.kirklees.gov.uk"] },

  // ── Cumbria
  { id: "westmorland-furness", name: "Westmorland and Furness Council",
    towns: [
      { townSlug: "barrow-in-furness", countySlug: "cumbria" },
      { townSlug: "kendal", countySlug: "cumbria" },
      { townSlug: "penrith", countySlug: "cumbria" },
    ],
    candidates: ["https://applications.westmorlandandfurness.gov.uk", "https://publicaccess.westmorlandandfurness.gov.uk"] },

  // ── Shropshire (unitary covering Telford?)
  { id: "telford-wrekin", name: "Telford & Wrekin Council",
    towns: [{ townSlug: "telford", countySlug: "shropshire" }],
    candidates: ["https://secure.telford.gov.uk", "https://publicaccess.telford.gov.uk", "https://planning.telford.gov.uk"] },

  // ── Northamptonshire
  { id: "west-northants", name: "West Northamptonshire Council",
    towns: [
      { townSlug: "northampton", countySlug: "northamptonshire" },
      { townSlug: "daventry", countySlug: "northamptonshire" },
      { townSlug: "towcester", countySlug: "northamptonshire" },
    ],
    candidates: ["https://publicaccess.westnorthants.gov.uk", "https://planning.westnorthants.gov.uk", "https://snc.planning-register.co.uk"] },

  // ── Peterborough / Cambridgeshire
  { id: "peterborough", name: "Peterborough City Council",
    towns: [{ townSlug: "peterborough", countySlug: "cambridgeshire" }],
    candidates: ["https://planpa.peterborough.gov.uk", "https://publicaccess.peterborough.gov.uk", "https://planning.peterborough.gov.uk"] },

  // ── West Midlands metros
  { id: "birmingham", name: "Birmingham City Council",
    towns: [
      { townSlug: "birmingham", countySlug: "west-midlands" },
      { townSlug: "sutton-coldfield", countySlug: "west-midlands" },
    ],
    candidates: ["https://eplanning.birmingham.gov.uk", "https://publicaccess.birmingham.gov.uk", "https://planningonline.birmingham.gov.uk"] },
  { id: "coventry", name: "Coventry City Council",
    towns: [{ townSlug: "coventry", countySlug: "west-midlands" }],
    candidates: ["https://planning.coventry.gov.uk", "https://publicaccess.coventry.gov.uk"] },
  { id: "dudley", name: "Dudley Metropolitan Borough Council",
    towns: [{ townSlug: "dudley", countySlug: "west-midlands" }],
    candidates: ["https://ecap.dudley.gov.uk", "https://publicaccess.dudley.gov.uk", "https://planning.dudley.gov.uk"] },
  { id: "walsall", name: "Walsall Metropolitan Borough Council",
    towns: [{ townSlug: "walsall", countySlug: "west-midlands" }],
    candidates: ["https://planning.walsall.gov.uk", "https://publicaccess.walsall.gov.uk"] },

  // ── Merseyside
  { id: "liverpool", name: "Liverpool City Council",
    towns: [{ townSlug: "liverpool", countySlug: "merseyside" }],
    candidates: ["https://lar.liverpool.gov.uk", "https://publicaccess.liverpool.gov.uk", "https://planning.liverpool.gov.uk"] },

  // ── London boroughs
  { id: "hackney", name: "London Borough of Hackney",
    towns: [{ townSlug: "hackney", countySlug: "greater-london" }],
    candidates: ["https://pa.hackney.gov.uk", "https://publicaccess.hackney.gov.uk", "https://planning.hackney.gov.uk"] },
  { id: "haringey", name: "London Borough of Haringey",
    towns: [{ townSlug: "tottenham", countySlug: "greater-london" }],
    candidates: ["https://publicaccess.haringey.gov.uk", "https://planning.haringey.gov.uk", "https://planningregister.haringey.gov.uk"] },
  { id: "hounslow", name: "London Borough of Hounslow",
    towns: [{ townSlug: "hounslow", countySlug: "greater-london" }],
    candidates: ["https://publicaccess.hounslow.gov.uk", "https://planning.hounslow.gov.uk"] },
];

interface ProbeResult {
  id: string;
  name: string;
  url: string | null;
  status: "idox-ok" | "not-idox" | "unreachable";
  detail: string;
}

async function probeUrl(baseUrl: string): Promise<{ ok: boolean; detail: string }> {
  // Most Idox portals live under /online-applications but some use different paths.
  // Try the common path first; if the URL already contains a path, try it as-is.
  const pathsToTry: string[] = [];
  if (/\.(aspx|jsp|gov\.uk\/[^/]+)/.test(baseUrl) && !baseUrl.endsWith(".gov.uk")) {
    pathsToTry.push(""); // already-pathed URL
  } else {
    pathsToTry.push("/online-applications", "/publicaccess", "/public-access");
  }

  for (const p of pathsToTry) {
    const full = `${baseUrl}${p}/search.do?action=advanced&searchType=Application`;
    try {
      const resp = await fetch(full, {
        method: "GET",
        headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
        redirect: "follow",
        signal: AbortSignal.timeout(10000),
      });
      if (!resp.ok) continue;
      const html = await resp.text();
      const hasCsrf = /<input[^>]+name=["']_csrf["']/i.test(html);
      const hasAdvSearch = /caseAddressType|applicationReceivedStart|Advanced Search/i.test(html);
      if (hasCsrf && hasAdvSearch) {
        return { ok: true, detail: `${baseUrl}${p}` };
      }
    } catch {
      // try next
    }
  }
  return { ok: false, detail: "no idox markers" };
}

async function main() {
  console.log(`Probing ${TARGETS.length} candidate LPAs...\n`);
  const results: ProbeResult[] = [];

  // 5-at-a-time concurrency
  const CONC = 5;
  for (let i = 0; i < TARGETS.length; i += CONC) {
    const chunk = TARGETS.slice(i, i + CONC);
    await Promise.all(chunk.map(async (t) => {
      for (const candidate of t.candidates) {
        const r = await probeUrl(candidate);
        if (r.ok) {
          results.push({ id: t.id, name: t.name, url: r.detail, status: "idox-ok", detail: "" });
          console.log(`✅ ${t.id}  →  ${r.detail}`);
          return;
        }
      }
      results.push({ id: t.id, name: t.name, url: null, status: "not-idox", detail: t.candidates.join(", ") });
      console.log(`❌ ${t.id}  (${t.candidates.length} URLs failed)`);
    }));
  }

  const ok = results.filter((r) => r.status === "idox-ok");
  const bad = results.filter((r) => r.status !== "idox-ok");

  console.log(`\n═════ Summary ═════`);
  console.log(`${ok.length}/${results.length} LPAs resolved to working Idox portal`);

  console.log(`\n── Working (paste into IDOX_AUTHORITIES) ──`);
  for (const t of TARGETS) {
    const r = results.find((x) => x.id === t.id);
    if (!r || r.status !== "idox-ok" || !r.url) continue;
    const baseUrl = r.url.replace(/\/online-applications$|\/publicaccess$|\/public-access$/, "");
    const searchPath = r.url.endsWith("/online-applications") ? "" :
      r.url.endsWith("/publicaccess") ? `\n    searchPath: "/publicaccess",` :
      r.url.endsWith("/public-access") ? `\n    searchPath: "/public-access",` : "";
    const townsBlock = t.towns.length === 1
      ? `[{ townSlug: "${t.towns[0].townSlug}", countySlug: "${t.towns[0].countySlug}" }]`
      : `[\n      ${t.towns.map((tw) => `{ townSlug: "${tw.townSlug}", countySlug: "${tw.countySlug}" },`).join("\n      ")}\n    ]`;
    console.log(`  {
    id: "${t.id}",
    name: "${t.name}",
    baseUrl: "${baseUrl}",
    towns: ${townsBlock},${searchPath}
    enabled: true,
  },`);
  }

  console.log(`\n── Failed probes (may need Band B research) ──`);
  for (const r of bad) {
    console.log(`  ${r.id} — ${r.name}`);
  }
}

main().catch((err) => { console.error("Fatal:", err); process.exit(1); });
