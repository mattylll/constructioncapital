# Location Copy Audit — 2026-07-12

Pages audited: **3504** (county + town + town×service)

| Severity | Count |
| --- | --- |
| Critical | 0 |
| Warning | 0 |
| Info | 257 |

**Boilerplate index:** 92% of long paragraphs sitewide are template paragraphs shared by >100 pages (after normalising place names and figures).

## Findings by type

### info/ALL_PENDING_PLANNING (191)

- `/locations/greater-london/croydon` — Planning dataset has 185 apps, none decided — approval stats suppressed by component guard
- `/locations/greater-london/woolwich` — Planning dataset has 106 apps, none decided — approval stats suppressed by component guard
- `/locations/greater-london/stratford` — Planning dataset has 26 apps, none decided — approval stats suppressed by component guard
- `/locations/greater-london/lewisham` — Planning dataset has 1 apps, none decided — approval stats suppressed by component guard
- `/locations/greater-london/tottenham` — Planning dataset has 4 apps, none decided — approval stats suppressed by component guard
- `/locations/greater-london/brixton` — Planning dataset has 171 apps, none decided — approval stats suppressed by component guard
- `/locations/greater-london/mayfair` — Planning dataset has 328 apps, none decided — approval stats suppressed by component guard
- `/locations/greater-london/marylebone` — Planning dataset has 328 apps, none decided — approval stats suppressed by component guard
- `/locations/greater-london/clapham` — Planning dataset has 171 apps, none decided — approval stats suppressed by component guard
- `/locations/greater-london/vauxhall` — Planning dataset has 171 apps, none decided — approval stats suppressed by component guard
- `/locations/greater-london/westminster` — Planning dataset has 328 apps, none decided — approval stats suppressed by component guard
- `/locations/greater-london/kingston` — Planning dataset has 48 apps, none decided — approval stats suppressed by component guard
- `/locations/greater-london/enfield` — Planning dataset has 277 apps, none decided — approval stats suppressed by component guard
- `/locations/greater-london/bexley` — Planning dataset has 68 apps, none decided — approval stats suppressed by component guard
- `/locations/greater-london/city-of-london` — Planning dataset has 35 apps, none decided — approval stats suppressed by component guard
- `/locations/kent/maidstone` — Planning dataset has 55 apps, none decided — approval stats suppressed by component guard
- `/locations/kent/canterbury` — Planning dataset has 7 apps, none decided — approval stats suppressed by component guard
- `/locations/kent/chatham` — Planning dataset has 13 apps, none decided — approval stats suppressed by component guard
- `/locations/kent/dartford` — Planning dataset has 22 apps, none decided — approval stats suppressed by component guard
- `/locations/kent/tonbridge` — Planning dataset has 48 apps, none decided — approval stats suppressed by component guard
- …and 171 more (see report.json)

### info/CONSTANT_METRIC (16)

- `sitewide` — "70%" appears on 7934 of 3066 service pages — verify it is a quoted term, not a broken derived metric
- `sitewide` — "75%" appears on 5626 of 3066 service pages — verify it is a quoted term, not a broken derived metric
- `sitewide` — "65%" appears on 5125 of 3066 service pages — verify it is a quoted term, not a broken derived metric
- `sitewide` — "100%" appears on 4985 of 3066 service pages — verify it is a quoted term, not a broken derived metric
- `sitewide` — "85%" appears on 3300 of 3066 service pages — verify it is a quoted term, not a broken derived metric
- `sitewide` — "15%" appears on 3226 of 3066 service pages — verify it is a quoted term, not a broken derived metric
- `sitewide` — "90%" appears on 2884 of 3066 service pages — verify it is a quoted term, not a broken derived metric
- `sitewide` — "20%" appears on 2722 of 3066 service pages — verify it is a quoted term, not a broken derived metric
- `sitewide` — "2%" appears on 2508 of 3066 service pages — verify it is a quoted term, not a broken derived metric
- `sitewide` — "25%" appears on 2299 of 3066 service pages — verify it is a quoted term, not a broken derived metric
- `sitewide` — "10%" appears on 2195 of 3066 service pages — verify it is a quoted term, not a broken derived metric
- `sitewide` — "12%" appears on 1924 of 3066 service pages — verify it is a quoted term, not a broken derived metric
- `sitewide` — "55%" appears on 1924 of 3066 service pages — verify it is a quoted term, not a broken derived metric
- `sitewide` — "60%" appears on 1924 of 3066 service pages — verify it is a quoted term, not a broken derived metric
- `sitewide` — "40%" appears on 1717 of 3066 service pages — verify it is a quoted term, not a broken derived metric
- `sitewide` — "4%" appears on 1703 of 3066 service pages — verify it is a quoted term, not a broken derived metric

### info/FLAT_YOY (50)

- `/locations/greater-london/tottenham` — YoY change is exactly 0 — must render neutrally, never '+0%'
- `/locations/greater-london/highgate` — YoY change is exactly 0 — must render neutrally, never '+0%'
- `/locations/greater-london/wimbledon` — YoY change is exactly 0 — must render neutrally, never '+0%'
- `/locations/greater-london/sutton` — YoY change is exactly 0 — must render neutrally, never '+0%'
- `/locations/greater-london/merton` — YoY change is exactly 0 — must render neutrally, never '+0%'
- `/locations/kent/chatham` — YoY change is exactly 0 — must render neutrally, never '+0%'
- `/locations/kent/folkestone` — YoY change is exactly 0 — must render neutrally, never '+0%'
- `/locations/kent/margate` — YoY change is exactly 0 — must render neutrally, never '+0%'
- `/locations/sussex/crawley` — YoY change is exactly 0 — must render neutrally, never '+0%'
- `/locations/sussex/horsham` — YoY change is exactly 0 — must render neutrally, never '+0%'
- `/locations/essex/grays` — YoY change is exactly 0 — must render neutrally, never '+0%'
- `/locations/somerset/glastonbury` — YoY change is exactly 0 — must render neutrally, never '+0%'
- `/locations/devon/exeter` — YoY change is exactly 0 — must render neutrally, never '+0%'
- `/locations/devon/plymouth` — YoY change is exactly 0 — must render neutrally, never '+0%'
- `/locations/wiltshire/trowbridge` — YoY change is exactly 0 — must render neutrally, never '+0%'
- `/locations/west-midlands/birmingham` — YoY change is exactly 0 — must render neutrally, never '+0%'
- `/locations/west-midlands/coventry` — YoY change is exactly 0 — must render neutrally, never '+0%'
- `/locations/west-midlands/dudley` — YoY change is exactly 0 — must render neutrally, never '+0%'
- `/locations/staffordshire/lichfield` — YoY change is exactly 0 — must render neutrally, never '+0%'
- `/locations/worcestershire/redditch` — YoY change is exactly 0 — must render neutrally, never '+0%'
- …and 30 more (see report.json)

## Most-shared template paragraphs

- **438 pages** — “We arrange the full range of property development finance in Croydon: development finance for ground-up schemes, bridging loans for auction purchases and chain …”
- **438 pages** — “Start by submitting your deal through our Deal Room with your project details - site address, purchase price, build costs, and expected end value. Our team will…”
- **438 pages** — “The development finance market has become increasingly competitive, with challenger banks, specialist lenders, and debt funds all seeking to lend against qualit…”
- **438 pages** — “In Croydon and the surrounding area, we regularly arrange development loans for schemes including new-build housing estates, infill developments on brownfield l…”
- **438 pages** — “The development lending market serving Croydon spans high-street banks, challenger banks, and specialist funders — names like Together, United Trust Bank, Alder…”
- **438 pages** — “Development finance interest rates for Croydon projects typically range from 6.5% to 11% per annum, depending on scheme size, developer experience, leverage, an…”
- **438 pages** — “Beyond the interest rate, your total cost of development finance includes arrangement fees (typically 1.5-2% of the facility), monitoring surveyor fees (£5,000-…”
- **438 pages** — “The LTV ratio is typically expressed as a percentage of Gross Development Value (LTGDV), with most senior development lenders offering 60-70% LTGDV or 80-90% of…”
- **438 pages** — “Development finance lenders assess four core areas: the site (location, planning status, and any constraints), the scheme (design quality, unit mix, and specifi…”
- **438 pages** — “First-time developers can access development finance, though the available terms will reflect the additional risk. Having a strong professional team around you …”
- **438 pages** — “Development finance is drawn in stages aligned to your build programme. Typically, a day-one drawdown covers 50-65% of the land value, with subsequent construct…”
- **438 pages** — “Most development finance lenders require full, detailed planning permission before they will commit to a facility. Some will consider outline permission with re…”
- **438 pages** — “Gross Development Value (GDV) is the total estimated revenue from selling or letting all units in your completed scheme. It's calculated by the lender's valuer …”
- **438 pages** — “A 12-unit residential development on a former commercial site near Croydon. The project involved demolition of the existing structure, full site remediation, an…”
- **438 pages** — “We coordinate the entire mezzanine process, from identifying mezzanine-friendly senior lenders through to negotiating the intercreditor agreement that governs t…”

## Pages with highest boilerplate share

- `/locations/greater-london/barking/development-finance` — 100% of 33 paragraphs shared
- `/locations/greater-london/barking/mezzanine-finance` — 100% of 30 paragraphs shared
- `/locations/greater-london/barking/bridging-loans` — 100% of 32 paragraphs shared
- `/locations/greater-london/barking/equity-jv` — 100% of 30 paragraphs shared
- `/locations/greater-london/barking/refurbishment-finance` — 100% of 31 paragraphs shared
- `/locations/greater-london/barking/commercial-mortgages` — 100% of 31 paragraphs shared
- `/locations/greater-london/barking/development-exit-finance` — 100% of 31 paragraphs shared
- `/locations/greater-london/lewisham/development-finance` — 100% of 32 paragraphs shared
- `/locations/greater-london/lewisham/mezzanine-finance` — 100% of 29 paragraphs shared
- `/locations/greater-london/lewisham/bridging-loans` — 100% of 32 paragraphs shared
- `/locations/greater-london/lewisham/equity-jv` — 100% of 29 paragraphs shared
- `/locations/greater-london/lewisham/refurbishment-finance` — 100% of 31 paragraphs shared
- `/locations/greater-london/lewisham/commercial-mortgages` — 100% of 31 paragraphs shared
- `/locations/greater-london/lewisham/development-exit-finance` — 100% of 30 paragraphs shared
- `/locations/greater-london/wembley/development-finance` — 100% of 32 paragraphs shared
