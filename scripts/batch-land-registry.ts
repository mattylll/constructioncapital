/**
 * Batch Land Registry Processor
 *
 * Downloads HMLR Price Paid CSVs and processes data for ALL towns in the
 * UK locations database. Streams through the CSVs once, buckets transactions
 * by district and town name, maps to our location slugs, and generates
 * per-town JSON output files.
 *
 * Output:
 *   data/generated/sold-data/{county}/{town}/latest.json
 *   data/generated/town-stats/{county}/{town}.json
 *
 * Usage:
 *   npx tsx scripts/batch-land-registry.ts
 *   npx tsx scripts/batch-land-registry.ts --years 2024,2025,2026
 *   npx tsx scripts/batch-land-registry.ts --skip-download
 */

import * as fs from "fs";
import * as path from "path";
import { createReadStream } from "fs";
import { createInterface } from "readline";
import { UK_COUNTIES } from "../src/lib/uk-locations-data";

// ─── Configuration ───────────────────────────────────────────

const BASE_URL =
  "http://prod.publicdata.landregistry.gov.uk.s3-website-eu-west-1.amazonaws.com";

const DATA_DIR = path.join(process.cwd(), "data", "land-registry");
const OUTPUT_DIR = path.join(process.cwd(), "data", "generated");

// ─── Types ───────────────────────────────────────────────────

interface Transaction {
  price: number;
  date: string;
  postcode: string;
  propertyType: string; // D, S, T, F, O
  newBuild: boolean;
  tenure: string; // F, L
  address: string;
  town: string;
  district: string;
}

interface LocationMapping {
  countySlug: string;
  townSlug: string;
  townName: string;
  /** HMLR district names to match (uppercase) */
  districts: string[];
  /** HMLR town/city names to match (uppercase), used as fallback */
  townNames: string[];
}

// ─── HMLR District Mapping ──────────────────────────────────
// Maps our location slugs to HMLR district names.
// HMLR districts = local authority names (e.g., "ST ALBANS", "MANCHESTER").
// Many town names match their district directly. Others need manual overrides.

const DISTRICT_OVERRIDES: Record<string, string[]> = {
  // London boroughs — our town names are areas within boroughs
  "greater-london/croydon": ["CROYDON"],
  "greater-london/barking": ["BARKING AND DAGENHAM"],
  "greater-london/woolwich": ["GREENWICH"],
  "greater-london/ealing": ["EALING"],
  "greater-london/stratford": ["NEWHAM"],
  "greater-london/lewisham": ["LEWISHAM"],
  "greater-london/tottenham": ["HARINGEY"],
  "greater-london/wembley": ["BRENT"],
  "greater-london/hounslow": ["HOUNSLOW"],
  "greater-london/brixton": ["LAMBETH"],
  "greater-london/hackney": ["HACKNEY"],
  "greater-london/bermondsey": ["SOUTHWARK"],

  // Kent — towns within larger districts
  "kent/maidstone": ["MAIDSTONE"],
  "kent/ashford": ["ASHFORD"],
  "kent/canterbury": ["CANTERBURY"],
  "kent/tunbridge-wells": ["TUNBRIDGE WELLS"],
  "kent/chatham": ["MEDWAY"],
  "kent/folkestone": ["FOLKESTONE AND HYTHE", "SHEPWAY"],
  "kent/gravesend": ["GRAVESHAM"],
  "kent/dartford": ["DARTFORD"],
  "kent/tonbridge": ["TONBRIDGE AND MALLING"],
  "kent/dover": ["DOVER"],
  "kent/sevenoaks": ["SEVENOAKS"],
  "kent/margate": ["THANET"],

  // Surrey
  "surrey/guildford": ["GUILDFORD"],
  "surrey/woking": ["WOKING"],
  "surrey/epsom": ["EPSOM AND EWELL"],
  "surrey/redhill": ["REIGATE AND BANSTEAD"],
  "surrey/farnham": ["WAVERLEY"],
  "surrey/weybridge": ["ELMBRIDGE"],
  "surrey/camberley": ["SURREY HEATH"],
  "surrey/staines": ["SPELTHORNE"],
  "surrey/dorking": ["MOLE VALLEY"],
  "surrey/leatherhead": ["MOLE VALLEY"],

  // Sussex
  "sussex/brighton": ["BRIGHTON AND HOVE"],
  "sussex/worthing": ["WORTHING"],
  "sussex/crawley": ["CRAWLEY"],
  "sussex/horsham": ["HORSHAM"],
  "sussex/eastbourne": ["EASTBOURNE"],
  "sussex/hastings": ["HASTINGS"],
  "sussex/chichester": ["CHICHESTER"],
  "sussex/bognor-regis": ["ARUN"],
  "sussex/lewes": ["LEWES"],
  "sussex/haywards-heath": ["MID SUSSEX"],

  // Hampshire
  "hampshire/southampton": ["SOUTHAMPTON"],
  "hampshire/portsmouth": ["PORTSMOUTH"],
  "hampshire/winchester": ["WINCHESTER"],
  "hampshire/basingstoke": ["BASINGSTOKE AND DEANE"],
  "hampshire/andover": ["TEST VALLEY"],
  "hampshire/farnborough": ["RUSHMOOR"],
  "hampshire/eastleigh": ["EASTLEIGH"],
  "hampshire/fareham": ["FAREHAM"],
  "hampshire/aldershot": ["RUSHMOOR"],
  "hampshire/fleet": ["HART"],

  // Berkshire
  "berkshire/reading": ["READING"],
  "berkshire/slough": ["SLOUGH"],
  "berkshire/bracknell": ["BRACKNELL FOREST"],
  "berkshire/maidenhead": ["WINDSOR AND MAIDENHEAD"],
  "berkshire/wokingham": ["WOKINGHAM"],
  "berkshire/newbury": ["WEST BERKSHIRE"],
  "berkshire/windsor": ["WINDSOR AND MAIDENHEAD"],
  "berkshire/thatcham": ["WEST BERKSHIRE"],

  // Buckinghamshire
  "buckinghamshire/aylesbury": ["BUCKINGHAMSHIRE", "AYLESBURY VALE"],
  "buckinghamshire/high-wycombe": ["BUCKINGHAMSHIRE", "WYCOMBE"],
  "buckinghamshire/amersham": ["BUCKINGHAMSHIRE", "CHILTERN"],
  "buckinghamshire/beaconsfield": ["BUCKINGHAMSHIRE", "SOUTH BUCKS"],
  "buckinghamshire/marlow": ["BUCKINGHAMSHIRE", "WYCOMBE"],
  "buckinghamshire/chesham": ["BUCKINGHAMSHIRE", "CHILTERN"],
  "buckinghamshire/buckingham": ["BUCKINGHAMSHIRE", "AYLESBURY VALE"],
  "buckinghamshire/princes-risborough": ["BUCKINGHAMSHIRE", "WYCOMBE"],

  // Oxfordshire
  "oxfordshire/oxford": ["OXFORD"],
  "oxfordshire/banbury": ["CHERWELL"],
  "oxfordshire/didcot": ["SOUTH OXFORDSHIRE"],
  "oxfordshire/bicester": ["CHERWELL"],
  "oxfordshire/abingdon": ["VALE OF WHITE HORSE"],
  "oxfordshire/witney": ["WEST OXFORDSHIRE"],
  "oxfordshire/henley-on-thames": ["SOUTH OXFORDSHIRE"],
  "oxfordshire/thame": ["SOUTH OXFORDSHIRE"],

  // Hertfordshire
  "hertfordshire/st-albans": ["ST ALBANS"],
  "hertfordshire/watford": ["WATFORD"],
  "hertfordshire/stevenage": ["STEVENAGE"],
  "hertfordshire/hemel-hempstead": ["DACORUM"],
  "hertfordshire/welwyn-garden-city": ["WELWYN HATFIELD"],
  "hertfordshire/hatfield": ["WELWYN HATFIELD"],
  "hertfordshire/hertford": ["EAST HERTFORDSHIRE"],
  "hertfordshire/bishops-stortford": ["EAST HERTFORDSHIRE"],
  "hertfordshire/harpenden": ["ST ALBANS"],
  "hertfordshire/borehamwood": ["HERTSMERE"],

  // Essex
  "essex/chelmsford": ["CHELMSFORD"],
  "essex/basildon": ["BASILDON"],
  "essex/southend-on-sea": ["SOUTHEND-ON-SEA", "SOUTHEND ON SEA"],
  "essex/colchester": ["COLCHESTER"],
  "essex/harlow": ["HARLOW"],
  "essex/brentwood": ["BRENTWOOD"],
  "essex/braintree": ["BRAINTREE"],
  "essex/grays": ["THURROCK"],
  "essex/clacton-on-sea": ["TENDRING"],
  "essex/canvey-island": ["CASTLE POINT"],

  // Bristol — sub-areas within Bristol city
  "bristol/bristol-city-centre": ["CITY OF BRISTOL"],
  "bristol/bedminster": ["CITY OF BRISTOL"],
  "bristol/bishopston": ["CITY OF BRISTOL"],
  "bristol/filton": ["SOUTH GLOUCESTERSHIRE"],
  "bristol/hengrove": ["CITY OF BRISTOL"],
  "bristol/keynsham": ["BATH AND NORTH EAST SOMERSET"],

  // Somerset
  "somerset/bath": ["BATH AND NORTH EAST SOMERSET"],
  "somerset/taunton": ["SOMERSET", "TAUNTON DEANE", "SOMERSET WEST AND TAUNTON"],
  "somerset/bridgwater": ["SOMERSET", "SEDGEMOOR"],
  "somerset/yeovil": ["SOMERSET", "SOUTH SOMERSET"],
  "somerset/frome": ["SOMERSET", "MENDIP"],
  "somerset/glastonbury": ["SOMERSET", "MENDIP"],
  "somerset/wells": ["SOMERSET", "MENDIP"],
  "somerset/weston-super-mare": ["NORTH SOMERSET"],

  // Devon
  "devon/exeter": ["EXETER"],
  "devon/plymouth": ["PLYMOUTH"],
  "devon/torquay": ["TORBAY"],
  "devon/newton-abbot": ["TEIGNBRIDGE"],
  "devon/barnstaple": ["NORTH DEVON"],
  "devon/tiverton": ["MID DEVON"],
  "devon/exmouth": ["EAST DEVON"],
  "devon/paignton": ["TORBAY"],

  // Cornwall
  "cornwall/truro": ["CORNWALL"],
  "cornwall/falmouth": ["CORNWALL"],
  "cornwall/newquay": ["CORNWALL"],
  "cornwall/penzance": ["CORNWALL"],
  "cornwall/st-austell": ["CORNWALL"],
  "cornwall/bodmin": ["CORNWALL"],
  "cornwall/camborne": ["CORNWALL"],
  "cornwall/bude": ["CORNWALL"],

  // Dorset
  "dorset/bournemouth": ["BOURNEMOUTH, CHRISTCHURCH AND POOLE", "BOURNEMOUTH"],
  "dorset/poole": ["BOURNEMOUTH, CHRISTCHURCH AND POOLE", "POOLE"],
  "dorset/weymouth": ["DORSET", "WEYMOUTH AND PORTLAND"],
  "dorset/dorchester": ["DORSET", "WEST DORSET"],
  "dorset/christchurch": ["BOURNEMOUTH, CHRISTCHURCH AND POOLE", "CHRISTCHURCH"],
  "dorset/wimborne": ["DORSET", "EAST DORSET"],
  "dorset/sherborne": ["DORSET", "WEST DORSET"],
  "dorset/bridport": ["DORSET", "WEST DORSET"],

  // Wiltshire
  "wiltshire/swindon": ["SWINDON"],
  "wiltshire/salisbury": ["WILTSHIRE"],
  "wiltshire/chippenham": ["WILTSHIRE"],
  "wiltshire/trowbridge": ["WILTSHIRE"],
  "wiltshire/melksham": ["WILTSHIRE"],
  "wiltshire/marlborough": ["WILTSHIRE"],
  "wiltshire/devizes": ["WILTSHIRE"],
  "wiltshire/warminster": ["WILTSHIRE"],

  // Gloucestershire
  "gloucestershire/cheltenham": ["CHELTENHAM"],
  "gloucestershire/gloucester": ["GLOUCESTER"],
  "gloucestershire/stroud": ["STROUD"],
  "gloucestershire/cirencester": ["COTSWOLD"],
  "gloucestershire/tewkesbury": ["TEWKESBURY"],
  "gloucestershire/lydney": ["FOREST OF DEAN"],

  // West Midlands
  "west-midlands/birmingham": ["BIRMINGHAM"],
  "west-midlands/wolverhampton": ["WOLVERHAMPTON"],
  "west-midlands/coventry": ["COVENTRY"],
  "west-midlands/solihull": ["SOLIHULL"],
  "west-midlands/dudley": ["DUDLEY"],
  "west-midlands/walsall": ["WALSALL"],
  "west-midlands/sutton-coldfield": ["BIRMINGHAM"],
  "west-midlands/west-bromwich": ["SANDWELL"],

  // Warwickshire
  "warwickshire/leamington-spa": ["WARWICK"],
  "warwickshire/warwick": ["WARWICK"],
  "warwickshire/rugby": ["RUGBY"],
  "warwickshire/nuneaton": ["NUNEATON AND BEDWORTH"],
  "warwickshire/stratford-upon-avon": ["STRATFORD-ON-AVON"],
  "warwickshire/kenilworth": ["WARWICK"],
  "warwickshire/bedworth": ["NUNEATON AND BEDWORTH"],

  // Staffordshire
  "staffordshire/stoke-on-trent": ["STOKE-ON-TRENT"],
  "staffordshire/stafford": ["STAFFORD"],
  "staffordshire/lichfield": ["LICHFIELD"],
  "staffordshire/burton-upon-trent": ["EAST STAFFORDSHIRE"],
  "staffordshire/tamworth": ["TAMWORTH"],
  "staffordshire/newcastle-under-lyme": ["NEWCASTLE-UNDER-LYME"],
  "staffordshire/cannock": ["CANNOCK CHASE"],

  // Worcestershire
  "worcestershire/worcester": ["WORCESTER"],
  "worcestershire/redditch": ["REDDITCH"],
  "worcestershire/kidderminster": ["WYRE FOREST"],
  "worcestershire/malvern": ["MALVERN HILLS"],
  "worcestershire/droitwich": ["WYCHAVON"],
  "worcestershire/evesham": ["WYCHAVON"],
  "worcestershire/bromsgrove": ["BROMSGROVE"],

  // Shropshire
  "shropshire/shrewsbury": ["SHROPSHIRE"],
  "shropshire/telford": ["TELFORD AND WREKIN"],
  "shropshire/oswestry": ["SHROPSHIRE"],
  "shropshire/bridgnorth": ["SHROPSHIRE"],
  "shropshire/market-drayton": ["SHROPSHIRE"],
  "shropshire/ludlow": ["SHROPSHIRE"],

  // Derbyshire
  "derbyshire/derby": ["DERBY"],
  "derbyshire/chesterfield": ["CHESTERFIELD"],
  "derbyshire/buxton": ["HIGH PEAK"],
  "derbyshire/matlock": ["DERBYSHIRE DALES"],
  "derbyshire/belper": ["AMBER VALLEY"],
  "derbyshire/ilkeston": ["EREWASH"],
  "derbyshire/swadlincote": ["SOUTH DERBYSHIRE"],
  "derbyshire/long-eaton": ["EREWASH"],

  // Nottinghamshire
  "nottinghamshire/nottingham": ["NOTTINGHAM"],
  "nottinghamshire/mansfield": ["MANSFIELD"],
  "nottinghamshire/newark": ["NEWARK AND SHERWOOD"],
  "nottinghamshire/worksop": ["BASSETLAW"],
  "nottinghamshire/west-bridgford": ["RUSHCLIFFE"],
  "nottinghamshire/arnold": ["GEDLING"],
  "nottinghamshire/retford": ["BASSETLAW"],

  // Leicestershire
  "leicestershire/leicester": ["LEICESTER"],
  "leicestershire/loughborough": ["CHARNWOOD"],
  "leicestershire/hinckley": ["HINCKLEY AND BOSWORTH"],
  "leicestershire/melton-mowbray": ["MELTON"],
  "leicestershire/market-harborough": ["HARBOROUGH"],
  "leicestershire/coalville": ["NORTH WEST LEICESTERSHIRE"],
  "leicestershire/wigston": ["OADBY AND WIGSTON"],

  // Northamptonshire
  "northamptonshire/northampton": ["WEST NORTHAMPTONSHIRE", "NORTHAMPTON"],
  "northamptonshire/kettering": ["NORTH NORTHAMPTONSHIRE", "KETTERING"],
  "northamptonshire/corby": ["NORTH NORTHAMPTONSHIRE", "CORBY"],
  "northamptonshire/wellingborough": ["NORTH NORTHAMPTONSHIRE", "WELLINGBOROUGH"],
  "northamptonshire/daventry": ["WEST NORTHAMPTONSHIRE", "DAVENTRY"],
  "northamptonshire/rushden": ["NORTH NORTHAMPTONSHIRE", "EAST NORTHAMPTONSHIRE"],
  "northamptonshire/towcester": ["WEST NORTHAMPTONSHIRE", "SOUTH NORTHAMPTONSHIRE"],

  // Lincolnshire
  "lincolnshire/lincoln": ["LINCOLN"],
  "lincolnshire/grantham": ["SOUTH KESTEVEN"],
  "lincolnshire/boston": ["BOSTON"],
  "lincolnshire/skegness": ["EAST LINDSEY"],
  "lincolnshire/spalding": ["SOUTH HOLLAND"],
  "lincolnshire/sleaford": ["NORTH KESTEVEN"],
  "lincolnshire/stamford": ["SOUTH KESTEVEN"],
  "lincolnshire/gainsborough": ["WEST LINDSEY"],

  // Greater Manchester
  "greater-manchester/manchester": ["MANCHESTER"],
  "greater-manchester/salford": ["SALFORD"],
  "greater-manchester/stockport": ["STOCKPORT"],
  "greater-manchester/bolton": ["BOLTON"],
  "greater-manchester/rochdale": ["ROCHDALE"],
  "greater-manchester/oldham": ["OLDHAM"],
  "greater-manchester/bury": ["BURY"],
  "greater-manchester/wigan": ["WIGAN"],
  "greater-manchester/altrincham": ["TRAFFORD"],
  "greater-manchester/ashton-under-lyne": ["TAMESIDE"],

  // Lancashire
  "lancashire/preston": ["PRESTON"],
  "lancashire/blackpool": ["BLACKPOOL"],
  "lancashire/lancaster": ["LANCASTER"],
  "lancashire/burnley": ["BURNLEY"],
  "lancashire/blackburn": ["BLACKBURN WITH DARWEN"],
  "lancashire/chorley": ["CHORLEY"],
  "lancashire/accrington": ["HYNDBURN"],
  "lancashire/lytham-st-annes": ["FYLDE"],

  // Merseyside
  "merseyside/liverpool": ["LIVERPOOL"],
  "merseyside/birkenhead": ["WIRRAL"],
  "merseyside/southport": ["SEFTON"],
  "merseyside/st-helens": ["ST. HELENS", "ST HELENS"],
  "merseyside/bootle": ["SEFTON"],
  "merseyside/wallasey": ["WIRRAL"],

  // Cheshire
  "cheshire/chester": ["CHESHIRE WEST AND CHESTER"],
  "cheshire/warrington": ["WARRINGTON"],
  "cheshire/crewe": ["CHESHIRE EAST"],
  "cheshire/macclesfield": ["CHESHIRE EAST"],
  "cheshire/northwich": ["CHESHIRE WEST AND CHESTER"],
  "cheshire/wilmslow": ["CHESHIRE EAST"],
  "cheshire/nantwich": ["CHESHIRE EAST"],
  "cheshire/ellesmere-port": ["CHESHIRE WEST AND CHESTER"],

  // Cumbria — now unitary authorities
  "cumbria/carlisle": ["CUMBERLAND", "CARLISLE"],
  "cumbria/barrow-in-furness": ["WESTMORLAND AND FURNESS", "BARROW-IN-FURNESS"],
  "cumbria/kendal": ["WESTMORLAND AND FURNESS", "SOUTH LAKELAND"],
  "cumbria/penrith": ["WESTMORLAND AND FURNESS", "EDEN"],
  "cumbria/workington": ["CUMBERLAND", "ALLERDALE"],
  "cumbria/whitehaven": ["CUMBERLAND", "COPELAND"],

  // West Yorkshire
  "west-yorkshire/leeds": ["LEEDS"],
  "west-yorkshire/bradford": ["BRADFORD"],
  "west-yorkshire/huddersfield": ["KIRKLEES"],
  "west-yorkshire/wakefield": ["WAKEFIELD"],
  "west-yorkshire/halifax": ["CALDERDALE"],
  "west-yorkshire/dewsbury": ["KIRKLEES"],
  "west-yorkshire/pontefract": ["WAKEFIELD"],
  "west-yorkshire/ilkley": ["BRADFORD"],

  // South Yorkshire
  "south-yorkshire/sheffield": ["SHEFFIELD"],
  "south-yorkshire/doncaster": ["DONCASTER"],
  "south-yorkshire/rotherham": ["ROTHERHAM"],
  "south-yorkshire/barnsley": ["BARNSLEY"],
  "south-yorkshire/mexborough": ["DONCASTER"],
  "south-yorkshire/wombwell": ["BARNSLEY"],

  // North Yorkshire
  "north-yorkshire/york": ["YORK"],
  "north-yorkshire/harrogate": ["NORTH YORKSHIRE", "HARROGATE"],
  "north-yorkshire/scarborough": ["NORTH YORKSHIRE", "SCARBOROUGH"],
  "north-yorkshire/skipton": ["NORTH YORKSHIRE", "CRAVEN"],
  "north-yorkshire/whitby": ["NORTH YORKSHIRE", "SCARBOROUGH"],
  "north-yorkshire/ripon": ["NORTH YORKSHIRE", "HARROGATE"],
  "north-yorkshire/northallerton": ["NORTH YORKSHIRE", "HAMBLETON"],
  "north-yorkshire/knaresborough": ["NORTH YORKSHIRE", "HARROGATE"],

  // Tyne and Wear
  "tyne-and-wear/newcastle": ["NEWCASTLE UPON TYNE"],
  "tyne-and-wear/sunderland": ["SUNDERLAND"],
  "tyne-and-wear/gateshead": ["GATESHEAD"],
  "tyne-and-wear/south-shields": ["SOUTH TYNESIDE"],
  "tyne-and-wear/north-shields": ["NORTH TYNESIDE"],
  "tyne-and-wear/washington": ["SUNDERLAND"],

  // County Durham
  "county-durham/durham": ["COUNTY DURHAM"],
  "county-durham/bishop-auckland": ["COUNTY DURHAM"],
  "county-durham/newton-aycliffe": ["COUNTY DURHAM"],
  "county-durham/consett": ["COUNTY DURHAM"],
  "county-durham/chester-le-street": ["COUNTY DURHAM"],
  "county-durham/peterlee": ["COUNTY DURHAM"],

  // Northumberland
  "northumberland/morpeth": ["NORTHUMBERLAND"],
  "northumberland/blyth": ["NORTHUMBERLAND"],
  "northumberland/cramlington": ["NORTHUMBERLAND"],
  "northumberland/alnwick": ["NORTHUMBERLAND"],
  "northumberland/hexham": ["NORTHUMBERLAND"],
  "northumberland/berwick-upon-tweed": ["NORTHUMBERLAND"],

  // East Riding
  "east-riding-of-yorkshire/hull": ["KINGSTON UPON HULL, CITY OF", "KINGSTON UPON HULL"],
  "east-riding-of-yorkshire/beverley": ["EAST RIDING OF YORKSHIRE"],
  "east-riding-of-yorkshire/bridlington": ["EAST RIDING OF YORKSHIRE"],
  "east-riding-of-yorkshire/goole": ["EAST RIDING OF YORKSHIRE"],
  "east-riding-of-yorkshire/driffield": ["EAST RIDING OF YORKSHIRE"],
  "east-riding-of-yorkshire/hessle": ["EAST RIDING OF YORKSHIRE"],

  // Norfolk
  "norfolk/norwich": ["NORWICH"],
  "norfolk/great-yarmouth": ["GREAT YARMOUTH"],
  "norfolk/kings-lynn": ["KING'S LYNN AND WEST NORFOLK"],
  "norfolk/thetford": ["BRECKLAND"],
  "norfolk/wymondham": ["SOUTH NORFOLK"],
  "norfolk/cromer": ["NORTH NORFOLK"],
  "norfolk/dereham": ["BRECKLAND"],
  "norfolk/attleborough": ["BRECKLAND"],

  // Suffolk
  "suffolk/ipswich": ["IPSWICH"],
  "suffolk/bury-st-edmunds": ["WEST SUFFOLK", "ST EDMUNDSBURY"],
  "suffolk/lowestoft": ["EAST SUFFOLK", "WAVENEY"],
  "suffolk/felixstowe": ["EAST SUFFOLK", "SUFFOLK COASTAL"],
  "suffolk/sudbury": ["BABERGH"],
  "suffolk/newmarket": ["WEST SUFFOLK", "FOREST HEATH"],
  "suffolk/stowmarket": ["MID SUFFOLK"],
  "suffolk/leiston": ["EAST SUFFOLK", "SUFFOLK COASTAL"],

  // Cambridgeshire
  "cambridgeshire/cambridge": ["CAMBRIDGE"],
  "cambridgeshire/peterborough": ["PETERBOROUGH"],
  "cambridgeshire/huntingdon": ["HUNTINGDONSHIRE"],
  "cambridgeshire/st-neots": ["HUNTINGDONSHIRE"],
  "cambridgeshire/ely": ["EAST CAMBRIDGESHIRE"],
  "cambridgeshire/march": ["FENLAND"],
  "cambridgeshire/wisbech": ["FENLAND"],
  "cambridgeshire/st-ives": ["HUNTINGDONSHIRE"],

  // Bedfordshire
  "bedfordshire/luton": ["LUTON"],
  "bedfordshire/bedford": ["BEDFORD"],
  "bedfordshire/dunstable": ["CENTRAL BEDFORDSHIRE"],
  "bedfordshire/biggleswade": ["CENTRAL BEDFORDSHIRE"],
  "bedfordshire/leighton-buzzard": ["CENTRAL BEDFORDSHIRE"],
  "bedfordshire/sandy": ["CENTRAL BEDFORDSHIRE"],
  "bedfordshire/flitwick": ["CENTRAL BEDFORDSHIRE"],

  // Scotland — uses Registers of Scotland, not HMLR. Skip for now.
  // Wales — HMLR covers Wales
  "cardiff/cardiff-city-centre": ["CARDIFF"],
  "cardiff/cardiff-bay": ["CARDIFF"],
  "cardiff/canton": ["CARDIFF"],
  "cardiff/cathays": ["CARDIFF"],
  "cardiff/splott": ["CARDIFF"],
  "cardiff/pontcanna": ["CARDIFF"],

  "swansea/swansea-city-centre": ["SWANSEA"],
  "swansea/mumbles": ["SWANSEA"],
  "swansea/sa1-waterfront": ["SWANSEA"],
  "swansea/sketty": ["SWANSEA"],
  "swansea/morriston": ["SWANSEA"],
  "swansea/neath": ["NEATH PORT TALBOT"],

  "newport/newport-city-centre": ["NEWPORT"],
  "newport/caerleon": ["NEWPORT"],
  "newport/maindee": ["NEWPORT"],
  "newport/cwmbran": ["TORFAEN"],
  "newport/pontypool": ["TORFAEN"],

  "powys/brecon": ["POWYS"],
  "powys/newtown": ["POWYS"],
  "powys/welshpool": ["POWYS"],
  "powys/llandrindod-wells": ["POWYS"],
  "powys/builth-wells": ["POWYS"],
  "powys/hay-on-wye": ["POWYS"],

  "gwynedd/bangor": ["GWYNEDD"],
  "gwynedd/caernarfon": ["GWYNEDD"],
  "gwynedd/porthmadog": ["GWYNEDD"],
  "gwynedd/pwllheli": ["GWYNEDD"],
  "gwynedd/dolgellau": ["GWYNEDD"],
  "gwynedd/bethesda": ["GWYNEDD"],
};

// Scotland uses Registers of Scotland (not HMLR). These counties are skipped.
const SCOTLAND_COUNTIES = new Set([
  "edinburgh", "glasgow", "aberdeen", "dundee", "highland", "fife",
]);

// ─── Build Location Mappings ────────────────────────────────

function buildLocationMappings(): LocationMapping[] {
  const mappings: LocationMapping[] = [];

  for (const county of UK_COUNTIES) {
    if (SCOTLAND_COUNTIES.has(county.slug)) continue;

    for (const town of county.towns) {
      const key = `${county.slug}/${town.slug}`;
      const override = DISTRICT_OVERRIDES[key];

      mappings.push({
        countySlug: county.slug,
        townSlug: town.slug,
        townName: town.name,
        districts: override || [town.name.toUpperCase()],
        townNames: [town.name.toUpperCase()],
      });
    }
  }

  return mappings;
}

// ─── CSV Parsing ────────────────────────────────────────────

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

function buildAddress(paon: string, saon: string, street: string): string {
  const parts: string[] = [];
  if (saon) parts.push(saon);
  if (paon) parts.push(paon);
  if (street) parts.push(street);
  return parts.join(", ");
}

// ─── Download ───────────────────────────────────────────────

async function downloadFile(url: string, dest: string): Promise<void> {
  console.log(`  Downloading ${url}...`);
  const resp = await fetch(url, { redirect: "follow" });
  if (!resp.ok) {
    throw new Error(`Download failed: ${resp.status} ${resp.statusText}`);
  }

  const totalBytes = parseInt(resp.headers.get("content-length") || "0", 10);
  const totalMB = totalBytes > 0 ? (totalBytes / 1024 / 1024).toFixed(0) : "?";
  console.log(`  Size: ~${totalMB}MB`);

  const buffer = Buffer.from(await resp.arrayBuffer());
  fs.writeFileSync(dest, buffer);
  console.log(`  Saved to ${dest}`);
}

// ─── Stream + Bucket ────────────────────────────────────────

async function streamAndBucket(
  csvPath: string,
  districtBuckets: Map<string, Transaction[]>,
  townBuckets: Map<string, Transaction[]>,
): Promise<number> {
  const rl = createInterface({
    input: createReadStream(csvPath, { encoding: "utf-8" }),
    crlfDelay: Infinity,
  });

  let lineCount = 0;
  let kept = 0;

  for await (const line of rl) {
    lineCount++;
    if (lineCount % 200000 === 0) {
      process.stdout.write(
        `\r  Parsed ${(lineCount / 1000).toFixed(0)}k lines, ${kept} kept...`
      );
    }

    const fields = parseCSVLine(line);
    if (fields.length < 16) continue;

    // Skip deletions
    if (fields[15].trim() === "D") continue;

    const price = parseInt(fields[1], 10);
    if (!price || price <= 0) continue;

    const district = fields[12].trim().toUpperCase();
    const townCity = fields[11].trim().toUpperCase();

    const tx: Transaction = {
      price,
      date: fields[2].split(" ")[0],
      postcode: fields[3].trim(),
      propertyType: fields[4].trim(),
      newBuild: fields[5].trim() === "Y",
      tenure: fields[6].trim(),
      address: buildAddress(fields[7].trim(), fields[8].trim(), fields[9].trim()),
      town: townCity,
      district,
    };

    // Bucket by district
    if (!districtBuckets.has(district)) {
      districtBuckets.set(district, []);
    }
    districtBuckets.get(district)!.push(tx);

    // Also bucket by town/city name for secondary matching
    if (!townBuckets.has(townCity)) {
      townBuckets.set(townCity, []);
    }
    townBuckets.get(townCity)!.push(tx);

    kept++;
  }

  console.log(
    `\r  Parsed ${(lineCount / 1000).toFixed(0)}k lines, ${kept} kept            `
  );
  return kept;
}

// ─── Stats Computation ──────────────────────────────────────

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function computeStats(transactions: Transaction[]) {
  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const twoYearsAgo = new Date(now);
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  const oneYearAgoStr = oneYearAgo.toISOString().split("T")[0];
  const twoYearsAgoStr = twoYearsAgo.toISOString().split("T")[0];

  const last12m = transactions.filter((t) => t.date >= oneYearAgoStr);
  const prior12m = transactions.filter(
    (t) => t.date >= twoYearsAgoStr && t.date < oneYearAgoStr
  );

  const prices12m = last12m.map((t) => t.price);
  const pricesPrior = prior12m.map((t) => t.price);

  const medianPrice = median(prices12m);
  const medianPrior = median(pricesPrior);
  const yoyChange =
    medianPrior > 0
      ? parseFloat(
          (((medianPrice - medianPrior) / medianPrior) * 100).toFixed(1)
        )
      : 0;

  // Median by property type
  const medianByType: Record<string, number> = {};
  for (const type of ["D", "S", "T", "F"]) {
    const typePrices = last12m
      .filter((t) => t.propertyType === type)
      .map((t) => t.price);
    if (typePrices.length >= 3) {
      medianByType[type] = median(typePrices);
    }
  }

  // New build stats
  const newBuilds = last12m.filter((t) => t.newBuild);
  const existing = last12m.filter((t) => !t.newBuild);
  const newBuildMedian =
    newBuilds.length >= 3 ? median(newBuilds.map((t) => t.price)) : 0;
  const existingMedian =
    existing.length >= 3 ? median(existing.map((t) => t.price)) : 0;
  const newBuildPremium =
    existingMedian > 0
      ? parseFloat(
          (((newBuildMedian - existingMedian) / existingMedian) * 100).toFixed(1)
        )
      : 0;

  return {
    medianPrice,
    medianByType,
    transactionCount12m: last12m.length,
    yoyChange,
    newBuildCount: newBuilds.length,
    existingCount: existing.length,
    newBuildPremium,
    recentTransactions: [...last12m]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 20)
      .map((t) => ({
        price: t.price,
        date: t.date,
        postcode: t.postcode,
        propertyType: t.propertyType,
        newBuild: t.newBuild,
        tenure: t.tenure,
        address: t.address,
      })),
  };
}

// ─── Output ─────────────────────────────────────────────────

function writeOutputFiles(
  mapping: LocationMapping,
  transactions: Transaction[]
) {
  const stats = computeStats(transactions);

  // Skip if insufficient data
  if (stats.transactionCount12m < 5) return false;

  // Write sold data JSON
  const soldDataDir = path.join(
    OUTPUT_DIR,
    "sold-data",
    mapping.countySlug,
    mapping.townSlug
  );
  fs.mkdirSync(soldDataDir, { recursive: true });
  fs.writeFileSync(
    path.join(soldDataDir, "latest.json"),
    JSON.stringify(
      {
        updatedAt: new Date().toISOString(),
        townSlug: mapping.townSlug,
        countySlug: mapping.countySlug,
        stats: {
          medianPrice: stats.medianPrice,
          medianByType: stats.medianByType,
          transactionCount12m: stats.transactionCount12m,
          yoyChange: stats.yoyChange,
          newBuildCount: stats.newBuildCount,
          existingCount: stats.existingCount,
          newBuildPremium: stats.newBuildPremium,
        },
        recentTransactions: stats.recentTransactions,
      },
      null,
      2
    )
  );

  // Write town stats JSON
  // Merge with existing planning data if available
  let planningStats = {
    approvedApps12m: 0,
    pipelineUnits: 0,
    pipelineGdv: 0,
    approvalRate: 0,
  };
  const planningPath = path.join(
    OUTPUT_DIR,
    "planning",
    mapping.countySlug,
    mapping.townSlug,
    "latest.json"
  );
  try {
    const planning = JSON.parse(fs.readFileSync(planningPath, "utf-8"));
    planningStats = {
      approvedApps12m: planning.summary?.approved || 0,
      pipelineUnits: planning.summary?.totalUnits || 0,
      pipelineGdv: planning.summary?.totalEstimatedGDV || 0,
      approvalRate: planning.summary?.approvalRate || 0,
    };
  } catch {
    // No planning data — that's fine
  }

  const townStatsDir = path.join(OUTPUT_DIR, "town-stats", mapping.countySlug);
  fs.mkdirSync(townStatsDir, { recursive: true });
  fs.writeFileSync(
    path.join(townStatsDir, `${mapping.townSlug}.json`),
    JSON.stringify(
      {
        updatedAt: new Date().toISOString(),
        townSlug: mapping.townSlug,
        countySlug: mapping.countySlug,
        marketSnapshot: {
          medianPrice: stats.medianPrice,
          transactionCount12m: stats.transactionCount12m,
          yoyPriceChange: stats.yoyChange,
          ...planningStats,
        },
      },
      null,
      2
    )
  );

  return true;
}

// ─── Main ───────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const skipDownload = args.includes("--skip-download");
  const yearsIdx = args.indexOf("--years");
  const years =
    yearsIdx >= 0
      ? args[yearsIdx + 1].split(",").map((y) => y.trim())
      : ["2024", "2025", "2026"];

  console.log("\n═══════════════════════════════════════════════════════");
  console.log("  BATCH LAND REGISTRY PROCESSOR");
  console.log("═══════════════════════════════════════════════════════\n");

  // Build location mappings
  const mappings = buildLocationMappings();
  console.log(`  Locations to process: ${mappings.length}`);

  // Build lookup: which districts do we care about?
  const relevantDistricts = new Set<string>();
  for (const m of mappings) {
    for (const d of m.districts) {
      relevantDistricts.add(d);
    }
    for (const t of m.townNames) {
      relevantDistricts.add(t); // Also track town names for secondary matching
    }
  }
  console.log(`  Relevant HMLR districts/towns: ${relevantDistricts.size}`);

  // Download CSV files
  fs.mkdirSync(DATA_DIR, { recursive: true });

  if (!skipDownload) {
    for (const year of years) {
      const csvPath = path.join(DATA_DIR, `pp-${year}.csv`);
      if (fs.existsSync(csvPath)) {
        const stat = fs.statSync(csvPath);
        const ageDays = (Date.now() - stat.mtimeMs) / (1000 * 60 * 60 * 24);
        if (ageDays < 7) {
          console.log(
            `  Skipping download for ${year} (cached, ${ageDays.toFixed(0)} days old)`
          );
          continue;
        }
      }
      const url = `${BASE_URL}/pp-${year}.csv`;
      await downloadFile(url, csvPath);
    }
  }

  // Stream and bucket all CSVs
  const districtBuckets = new Map<string, Transaction[]>();
  const townBuckets = new Map<string, Transaction[]>();

  for (const year of years) {
    const csvPath = path.join(DATA_DIR, `pp-${year}.csv`);
    if (!fs.existsSync(csvPath)) {
      console.log(`  Warning: ${csvPath} not found, skipping`);
      continue;
    }
    console.log(`\n  Processing ${year}...`);
    await streamAndBucket(csvPath, districtBuckets, townBuckets);
  }

  console.log(`\n  Districts found: ${districtBuckets.size}`);
  console.log(`  Town/city names found: ${townBuckets.size}`);

  // Match each location to its transactions
  let matched = 0;
  let noData = 0;
  let insufficientData = 0;
  const results: { town: string; county: string; transactions: number; median: number }[] = [];

  for (const mapping of mappings) {
    // Collect transactions from all matching districts
    let transactions: Transaction[] = [];
    for (const district of mapping.districts) {
      const bucket = districtBuckets.get(district);
      if (bucket) {
        transactions.push(...bucket);
      }
    }

    // For locations where multiple towns share a district (e.g., Cornwall,
    // County Durham, Wiltshire), filter by town/city name in the data
    const sharedDistrictLocations = mappings.filter(
      (m) =>
        m !== mapping &&
        m.districts.some((d) => mapping.districts.includes(d))
    );

    if (sharedDistrictLocations.length > 0 && transactions.length > 0) {
      // This district is shared — try to narrow by town/city column match
      const townFiltered = transactions.filter(
        (t) => t.town === mapping.townName.toUpperCase()
      );
      // Use filtered if it has enough data, otherwise keep district-level
      if (townFiltered.length >= 10) {
        transactions = townFiltered;
      }
    }

    // Deduplicate (same transaction might appear in multiple years)
    const seen = new Set<string>();
    transactions = transactions.filter((t) => {
      const key = `${t.price}-${t.date}-${t.postcode}-${t.address}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (transactions.length === 0) {
      noData++;
      continue;
    }

    const written = writeOutputFiles(mapping, transactions);
    if (written) {
      const stats = computeStats(transactions);
      matched++;
      results.push({
        town: mapping.townName,
        county: mapping.countySlug,
        transactions: stats.transactionCount12m,
        median: stats.medianPrice,
      });
    } else {
      insufficientData++;
    }
  }

  // Summary
  console.log("\n═══════════════════════════════════════════════════════");
  console.log("  RESULTS");
  console.log("═══════════════════════════════════════════════════════\n");
  console.log(`  Locations matched with data: ${matched}`);
  console.log(`  No data found: ${noData}`);
  console.log(`  Insufficient data (<5 transactions): ${insufficientData}`);
  console.log(`  Total locations: ${mappings.length}`);
  console.log(
    `  Coverage: ${((matched / mappings.length) * 100).toFixed(1)}%\n`
  );

  // Top 20 by transaction count
  results.sort((a, b) => b.transactions - a.transactions);
  console.log("  Top 20 towns by transaction volume (12m):");
  console.log("  ─────────────────────────────────────────────");
  for (const r of results.slice(0, 20)) {
    console.log(
      `  ${r.town.padEnd(25)} ${String(r.transactions).padStart(6)} txns   £${r.median.toLocaleString("en-GB").padStart(10)}`
    );
  }

  console.log("\n  Done!\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
