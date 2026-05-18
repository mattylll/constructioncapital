# Geographic Hierarchy Brief — Wave 2 Location Pages

_Bradley Benner / Semantic Mastery methodology applied to the highest-impression but lowest-CTR location pages on constructioncapital.co.uk (Google Search Console, May 2026)._

## Targets

| Target page | GSC May 2026 | Service entity |
|---|---|---|
| `/locations/staffordshire/stafford` | 935 imp / 1 click / pos 7.1 | hub |
| `/locations/staffordshire/stafford/commercial-mortgages` | 405 imp / 1 click / pos 15.3 | commercial mortgages |
| `/locations/nottinghamshire/nottingham/development-finance` | 632 imp / 2 click / pos 10.8 | development finance |
| `/locations/dorset/poole/commercial-mortgages` | 707 imp / 1 click / pos 18.5 | commercial mortgages |
| `/locations/east-riding-of-yorkshire/hull/bridging-loans` | 444 imp / 1 click / pos 10.0 | bridging |
| `/locations/hampshire/portsmouth/bridging-loans` | 408 imp / 1 click / pos 19.5 | bridging |
| `/locations/west-midlands/wolverhampton/bridging-loans` | 300 imp / 2 click / pos 11.8 | bridging |
| `/locations/essex/harlow/bridging-loans` | 216 imp / 2 click / pos 32.8 | bridging |
| `/locations/oxfordshire/oxford/commercial-mortgages` | 117 imp / 2 click / pos 18.9 | commercial mortgages |

Build type: **template refactor** (these pages already exist — we are improving the entity-variant treatment, not creating new URLs).

Premises: Construction Capital has no physical premises in any of these locations — this is a pure pSEO play, so the homepage stays optimised for the broadest national entity ("United Kingdom") and every location page gets its own entity-optimised treatment.

## DataForSEO keyword research (location 2826, en, 2026-05-18)

Full data in `data/generated/keyword-research/bb-batch-2026-05-18.{json,md}`.

Key finding: **exact-match `[service] [town]` queries have very low volume (10–30/mo)**. The 700+ impressions per page are coming from broader queries where Google chooses the geo-relevant page. The volume sits at the national level:

- `commercial mortgage calculator` — 3,600/mo
- `commercial mortgage rates` — 1,900/mo
- `commercial mortgage calculator uk` — 880/mo
- `commercial mortgage rates uk` — 390/mo

→ **Strategy implication:** ranking gains will come from (a) clearer entity differentiation between URL, SEO title, H1, H2, H3s so Google connects the page to its target entity, and (b) deeper supporting content on the broader query terms (calculator, rates, lender names). This brief covers (a); content gap wave 3 will tackle (b).

## Hierarchy & entity variants (Wikipedia-sourced)

For each target, the entity variants and administrative containers gathered from the Wikipedia page title + bolded text + "What links here" redirects + infobox.

### Stafford — Worked Example
- **Town variants:** Stafford · Stafford, Staffordshire · the county town of Staffordshire · Stafford town · Stafford, England
- **District:** Borough of Stafford
- **County:** Staffordshire (variants: Staffs, the county of Staffordshire)
- **Region:** West Midlands (region)
- **Country:** England, United Kingdom
- **Neighbourhoods (H3 list):** Baswich, Beaconside, Castlefields, Coppenhall, Doxey, Forebridge, Highfields, Holmcroft, Hyde Lea, Littleworth, Moss Pit, Parkside, Rickerscote, Silkmore, Tillington, Walton on the Hill, Wildwood
- **Landmarks:** Stafford Castle, Ancient High House, Shire Hall, St Chad's Church, Shugborough Hall
- **Trigger word for H1:** "specialist"

### Nottingham
- **Town variants:** Nottingham · the City of Nottingham · Nottingham, Nottinghamshire · Nottingham, East Midlands · Nottingham city
- **District:** City of Nottingham
- **County:** Nottinghamshire · Notts · the county of Nottinghamshire
- **Region:** East Midlands
- **Neighbourhoods (H3 list):** The Lace Market, Hockley, The Park Estate, West Bridgford, Beeston, Sherwood, Mapperley, Wollaton, Lenton, Radford, Hyson Green, St Ann's, Sneinton, Carrington
- **Landmarks:** Nottingham Castle, Old Market Square, Wollaton Hall, the Lace Market, Trent Bridge
- **Trigger word:** "specialist"

### Poole
- **Town variants:** Poole · the Borough of Poole · Poole, Dorset · Poole harbourside · Poole, England
- **District:** Bournemouth, Christchurch and Poole
- **County:** Dorset
- **Region:** South West
- **Neighbourhoods:** Sandbanks, Canford Cliffs, Branksome Park, Lilliput, Parkstone, Penn Hill, Hamworthy, Oakdale, Broadstone, Creekmoor, Canford Heath, Newtown, Holes Bay, Lower Parkstone
- **Landmarks:** Poole Harbour, Sandbanks peninsula, Brownsea Island, Poole Quay, Compton Acres
- **Trigger word:** "specialist"

### Kingston upon Hull
- **Town variants:** Hull · Kingston upon Hull · the city of Hull · Hull, East Yorkshire · Hull, Yorkshire
- **County:** East Riding of Yorkshire · East Yorkshire · the East Riding
- **Region:** Yorkshire and the Humber
- **Neighbourhoods:** Old Town, the Marina, Hessle Road, Anlaby Road, Newland Avenue, Beverley Road, Holderness Road, Sutton, Bransholme, Orchard Park, Avenues, Princes Avenue, Spring Bank, Hessle, Cottingham
- **Landmarks:** the Humber Bridge, Hull Marina, The Deep aquarium, Hull Minster, Old Town
- **Trigger word:** "specialist"

### Portsmouth
- **Town variants:** Portsmouth · the city of Portsmouth · Portsmouth, Hampshire · Portsmouth city · Portsea Island
- **County:** Hampshire · Hants
- **Region:** South East
- **Neighbourhoods:** Old Portsmouth, Southsea, Portsea, Landport, Buckland, Fratton, Milton, North End, Hilsea, Copnor, Eastney, Cosham, Drayton, Farlington, Paulsgrove
- **Landmarks:** Portsmouth Historic Dockyard, Spinnaker Tower, Gunwharf Quays, Southsea Castle, HMS Victory
- **Trigger word:** "specialist"

### Wolverhampton
- **Town variants:** Wolverhampton · the city of Wolverhampton · Wolverhampton, West Midlands · Wolverhampton, Staffordshire (historic) · the City of Wolverhampton
- **County:** West Midlands (metropolitan county)
- **Region:** West Midlands (region)
- **Neighbourhoods:** Bilston, Tettenhall, Wednesfield, Penn, Whitmore Reans, Blakenhall, Bushbury, Compton, Heath Town, Park Village, Oxley, Fallings Park, Merry Hill, Finchfield, Low Hill
- **Landmarks:** St Peter's Collegiate Church, Molineux Stadium, the Grand Theatre, Wolverhampton Art Gallery, Bantock House
- **Trigger word:** "specialist"

### Harlow
- **Town variants:** Harlow · Harlow New Town · Harlow, Essex · the Borough of Harlow · Harlow town
- **County:** Essex
- **Region:** East of England
- **Neighbourhoods:** Old Harlow, Church Langley, Newhall, Mark Hall, Netteswell, Little Parndon, Great Parndon, Latton Bush, Tye Green, Sumners, Bush Fair, Staple Tye, Potter Street, Kingsmoor
- **Landmarks:** Town Park, Harlow Mill, Gibberd Garden, Harlow sculpture trail, Mark Hall Cycle Museum
- **Trigger word:** "specialist"

### Oxford
- **Town variants:** Oxford · the City of Oxford · Oxford, Oxfordshire · Oxford city · the City of Dreaming Spires
- **County:** Oxfordshire · Oxon
- **Region:** South East
- **Neighbourhoods:** Jericho, Summertown, Cowley, Headington, Marston, Iffley, Wolvercote, Botley, St Clement's, Grandpont, New Hinksey, Florence Park, East Oxford, North Oxford, Blackbird Leys
- **Landmarks:** University of Oxford, Radcliffe Camera, Christ Church, Bodleian Library, Oxford Castle quarter
- **Trigger word:** "leading"

## Service entity variants (URL → SEO title → H1 → H2 are all different)

Per Benner's "every element gets a different variant" rule, each service now has four distinct phrasings configured in `src/lib/location-entities.ts`:

| URL slug | SEO title uses | H1 uses | H2 uses | Body copy uses |
|---|---|---|---|---|
| `commercial-mortgages` | Commercial Mortgages | Commercial Mortgage Broker | Commercial Property Finance | commercial property lending |
| `development-finance` | Development Finance | Property Development Finance | Senior Development Lending | development funding |
| `bridging-loans` | Bridging Loans | Bridging Finance | Short-Term Property Lending | bridging credit |
| `mezzanine-finance` | Mezzanine Finance | Mezzanine Property Funding | Second-Charge Development Capital | mezzanine capital |
| `equity-jv` | Equity & JV | Equity & JV Partners | Property Joint Venture Capital | equity capital and joint venture funding |
| `refurbishment-finance` | Refurbishment Finance | Property Refurbishment Loans | Light & Heavy Refurb Funding | refurbishment lending |
| `development-exit-finance` | Development Exit Finance | Development Exit Bridging | Post-Practical-Completion Refinance | exit refinance |

## Worked example — `/locations/staffordshire/stafford/commercial-mortgages`

**Old version (repetition pattern):**
- URL: `/locations/staffordshire/stafford/commercial-mortgages`
- SEO title: `Commercial Mortgages in Stafford - Rates from 5.5% | Staffordshire`
- H1: "Commercial Mortgages in Stafford"
- H2 (market commentary): "Commercial Mortgages in Stafford."

→ All four use the phrase "Commercial Mortgages" plus "Stafford" — classic keyword stuffing pattern, no fresh entity associations.

**New version (Bradley Benner pattern):**
- URL: `/locations/staffordshire/stafford/commercial-mortgages` _(unchanged — clean canonical)_
- SEO title: **Commercial Mortgages in Stafford, Staffordshire**
- H1: **Specialist Commercial Mortgage Broker for Stafford developers** _(trigger word + H1 variant + entity primary)_
- H2 (market commentary): **Commercial Property Finance across Stafford, Staffordshire** _(H2 variant + secondary entity variant)_
- H2 (neighbourhoods): **Commercial Property Finance across Stafford's neighbourhoods**
- H3s under that: Baswich · Beaconside · Castlefields · Coppenhall · Doxey · Forebridge · Highfields · Holmcroft · Hyde Lea · Littleworth · Moss Pit · Parkside · Rickerscote · Silkmore · Tillington · Walton on the Hill · Wildwood

Each element now creates a fresh association rather than echoing the previous one.

## Implementation summary

Files added:
- `src/lib/location-entities.ts` — entity variants for 8 priority towns + 8 counties + 7 services
- `src/components/locations/neighbourhood-areas.tsx` — H3 neighbourhood list component

Files edited:
- `src/app/locations/[county]/[town]/[service]/page.tsx` — wired entity variants into `generateMetadata` (SEO title + meta description), H1 rendering, H2 in the market-commentary `ProseSection`, and rendered `<NeighbourhoodAreas>` below the commentary

Template behaviour:
- When `getTownEntity(county, town)` returns a record → Benner pattern applies and the neighbourhoods section renders.
- When no entity record exists → falls back to existing `SERVICE_TITLE_PATTERNS` / `SERVICE_DESC_PATTERNS` so the remaining ~3,000 pages render exactly as before.

This is **opt-in** per town, so we can roll out city by city without risk of cross-page regressions.

## Sub-page decision rule (per Benner)

We have intentionally **not** created neighbourhood-level URLs (e.g. `/locations/staffordshire/stafford/commercial-mortgages/baswich`). Per Benner's sub-page rule:

1. Index the parent page with the H3 neighbourhood list.
2. Give Google 3 weeks.
3. Only build a dedicated sub-page for a neighbourhood if the parent page is not ranking for `[service] [neighbourhood]` queries after that window.

Recommended re-check: **2026-06-08** for Stafford, **2026-06-15** for the rest of the cohort.

## Next steps (awaiting sign-off)

1. **Approve the entity-variant changes** for Stafford as the worked example.
2. **Roll the same pattern to the remaining 7 priority towns** — already configured in `location-entities.ts`, no code changes needed, just deploy.
3. **Expand entity records** to the next 20 high-impression towns once these prove out (Leeds, Manchester, Nottingham, Bristol, Hull, Cardiff, etc. — many already have data in `town-market-data.ts` that can be cross-referenced).
4. **Wave 3 of the content-gap guides** to target the broader national-volume queries DataForSEO surfaced: a commercial mortgage rates UK explainer with a calculator, a bridging loan calculator guide, and the lender-name-keyed pages (HSBC commercial mortgage, Santander commercial mortgage, Halifax commercial mortgage) for which there is 50–260/mo of search demand.

---

_Want me to deploy the Benner pattern to the remaining 7 priority towns now, or hold for review of Stafford first? Y/N._
