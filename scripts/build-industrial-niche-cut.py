#!/usr/bin/env python3
"""Build the industrial & logistics niche cut from the Construction Capital lake.

Feeds the Industrial & Logistics Development Monitor (market-reports/lending).
Run: python3 scripts/build-industrial-niche-cut.py   (from the repo root)

Outputs (additive, never deletes):
  data/lending-monitor/niche-industrial-h1-2026.json       planning + PPD cut
  data/lending-monitor/niche-industrial-lending-cuts.json  CH charge cuts

Sources and methodology notes:
- Planning comes from the RAW Idox exports (data/planning-exports/), NOT from
  data/generated/planning/, which is residential-filtered upstream and holds
  almost no industrial applications. Admin filings (condition discharge, S73,
  S106, scoping/screening, lawfulness certificates) are excluded so a scheme
  counts once; cross-register duplicates are removed; windowed aggregates use
  only councils whose scrape window demonstrably spans the period, and the
  quarterly series uses councils covered continuously since July 2025.
- Charges come from the Companies House Reverse Lookup project's ch.db,
  opened READ-ONLY. Two independent cuts: collateral (particulars keywords)
  and operator (warehousing/cargo/freight SICs). Niche growth is always
  emitted alongside the whole-register baseline and share-of-market.
- Sold values are HMLR Price Paid type-O rows at industrial-keyword
  addresses (data/land-registry/pp-*.csv). Registrations lag completions.

To produce a new edition (e.g. H2 2026), update the period constants in the
charge_cut() calls and the H1 filters below, and write to new dated
filenames; never overwrite a published edition's JSON.
"""
import json, re, csv, glob, os, sqlite3, statistics
from collections import Counter, defaultdict
from datetime import date, timedelta

CC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB = os.path.join(os.path.dirname(CC), "Comapnies House Reverse Lookup", "data", "ch.db")

# county slug -> region, derived from the site's canonical locations data
_loc_src = open(os.path.join(CC, "src", "lib", "uk-locations-data.ts")).read()
COUNTY_REGION = dict(re.findall(r'slug:\s*"([^"]+)"[^{}]*?region:\s*"([^"]+)"', _loc_src, re.S))
BRIDGE = json.load(open(os.path.join(CC, "data/lending-monitor/postcode-region-bridge.json")))
DISTRICT_REGION = BRIDGE["map"]

# ── Industrial classification (same tiers as industrialpropertyfinance.co.uk) ─
STRICT = re.compile(
    r"(light\s+industrial|general\s+industrial|industrial\s+unit(s)?|industrial\s+estate"
    r"|industrial\s+(and|&)\s+(warehouse|distribution|logistics)"
    r"|distribution\s+(centre|center|unit|warehouse|park|depot|hub|facility|building)"
    r"|logistics\s+(unit|park|hub|centre|center|facility|warehouse|building)"
    r"|warehouse(s|ing)?\b|storage\s+(and|&)\s+distribution|trade\s+counter"
    r"|manufacturing\s+(unit|facility|premises|building)"
    r"|use\s+class(es)?\s*(B1\s*\(\s*c\s*\)|B2|B8|E\s*\(\s*g\s*\)(\s*\(\s*i{1,3}\s*\))?)"
    r"|class\s*B[128]\b|workshop(s)?\s+(unit|building|use|premises)|employment\s+unit(s)?)", re.I)
OPENSTORE = re.compile(r"(open\s+storage|storage\s+yard|industrial\s+yard|haulage\s+yard|vehicle\s+storage\s+yard)", re.I)
EXCLUDE = re.compile(r"(self[\s-]*stor(age|e)|household\s+(and|&)\s+business\s+storage)", re.I)
# admin/procedural filings excluded so a scheme counts once, not once per filing
ADMIN = re.compile(r"(discharge[^.]{0,90}?conditions?\b"
                   r"|details\s+required\s+by\s+condition|variation\s+of\s+condition"
                   r"|deed\s+of\s+variation|section\s+106|section\s+73"
                   r"|compliance\s+with\s+condition|approval\s+of\s+details|submission\s+of\s+details"
                   r"|non[\s-]*material\s+amendment|details?\s+pursuant\s"
                   r"|(eia\s+)?(scoping|screening)\s+opinion"
                   r"|certificate\s+of\s+lawful|lawful\s+development\s+certificate"
                   r"|application\s+for\s+approval\s+of\s+details)", re.I)
BIGBOX = re.compile(r"(distribution\s+(centre|center|warehouse|park|depot|hub|facility)"
                    r"|logistics\s+(park|hub|centre|center|facility|warehouse)|storage\s+(and|&)\s+distribution)", re.I)

SQM = re.compile(r"([\d,]+(?:\.\d+)?)\s*(?:sq\.?\s*m\b|sqm\b|square\s+metres?|m2\b|m²)", re.I)
SQFT = re.compile(r"([\d,]+(?:\.\d+)?)\s*(?:sq\.?\s*ft\b|sqft\b|square\s+feet)", re.I)

def floorspace_sqm(text):
    vals = []
    for m in SQM.finditer(text):
        v = float(m.group(1).replace(",", ""))
        if 20 <= v <= 500000: vals.append(v)
    for m in SQFT.finditer(text):
        v = float(m.group(1).replace(",", "")) * 0.092903
        if 20 <= v <= 500000: vals.append(v)
    return max(vals) if vals else None  # largest stated figure = scheme floorspace

def iso(dstr):
    """Normalise dd/mm/yyyy to yyyy-mm-dd; pass ISO through; else empty."""
    if not dstr: return ""
    m = re.match(r"^(\d{2})/(\d{2})/(\d{4})", dstr)
    if m: return f"{m.group(3)}-{m.group(2)}-{m.group(1)}"
    return dstr[:10] if re.match(r"^\d{4}-\d{2}-\d{2}", dstr) else ""

def quarter(dstr):
    m = re.match(r"(\d{4})-(\d{2})", dstr or "")
    return f"{m.group(1)}-Q{(int(m.group(2))-1)//3+1}" if m else None

# ═══ A. PLANNING CUT (raw Idox exports — the CC generated dataset is
# residential-filtered upstream, so industrial must come from the raw lake) ══
APPROVED = re.compile(r"(grant|approv|permit|no objection)", re.I)
REFUSED = re.compile(r"(refus|reject|withdraw)", re.I)

apps_by_council = {}                  # (council, ref) -> app
council_min = {}; council_max = {}    # coverage window over ALL apps, any type
today = date.today().isoformat()

for f in sorted(glob.glob(os.path.join(CC, "data/planning-exports/*-raw-api-*.json"))):
    council = os.path.basename(f).split("-raw-api-")[0]
    if council == "dataforseo": continue
    try: data = json.load(open(f))
    except Exception: continue
    if not isinstance(data, list): continue
    for a in data:
        rec = iso(a.get("received_date") or "")
        if rec and rec <= today:
            if council not in council_min or rec < council_min[council]: council_min[council] = rec
            if council not in council_max or rec > council_max[council]: council_max[council] = rec
        prop = a.get("proposal") or ""
        if ADMIN.search(prop) or EXCLUDE.search(prop): continue
        tier = "industrial" if STRICT.search(prop) else ("openStorage" if OPENSTORE.search(prop) else None)
        if not tier: continue
        key = (council, a.get("ref_no") or prop[:60])
        if key in apps_by_council: continue
        decided = bool(iso(a.get("decision_date") or "")) or bool(a.get("decision_notice_type"))
        dtext = f'{a.get("decision_notice_type") or ""} {a.get("app_status") or ""}'
        status = ("approved" if APPROVED.search(dtext) else
                  "refused" if REFUSED.search(dtext) else
                  "decided" if decided else "pending")
        pc = (a.get("postcode") or "").strip()
        if not pc:
            m = re.search(r"\b([A-Z]{1,2}\d[A-Z\d]?)\s*\d[A-Z]{2}\b", (a.get("application_address") or "").upper())
            pc = m.group(1) if m else ""
        district = (pc.split(" ") or [""])[0]
        apps_by_council[key] = {
            "council": council, "ref": key[1], "proposal": prop,
            "tier": tier, "status": status, "received": rec,
            "region": DISTRICT_REGION.get(district, "unknown"),
            "address": a.get("application_address") or "",
            "siteAreaHa": a.get("site_area") or None,
            "sqm": floorspace_sqm(prop), "bigbox": bool(BIGBOX.search(prop)),
        }

# cross-council duplicate removal (same ref + same address in two registers)
seen_global = set(); flat = []
for app in apps_by_council.values():
    gk = (app["ref"], (app["address"] or "")[:40].lower())
    if gk in seen_global: continue
    seen_global.add(gk)
    # cross-boundary applications appear verbatim in both councils' registers;
    # a long proposal text is specific enough to dedupe on
    prop = app["proposal"]
    if len(prop) >= 100:
        pk = prop[:150].lower()
        if pk in seen_global: continue
        seen_global.add(pk)
    flat.append(app)

# unknown-region apps inherit their council's modal known region
council_modal = {}
for c in {a["council"] for a in flat}:
    known = Counter(a["region"] for a in flat if a["council"] == c and a["region"] != "unknown")
    if known: council_modal[c] = known.most_common(1)[0][0]
inferred = 0
for a in flat:
    if a["region"] == "unknown" and a["council"] in council_modal:
        a["region"] = council_modal[a["council"]]; inferred += 1

CUTOFF = max(a["received"] for a in flat if a["received"])
W12_START = (date.fromisoformat(CUTOFF) - timedelta(days=365)).isoformat()
# a council qualifies for windowed/trend aggregates only if its scrape window
# demonstrably spans the whole comparison period (back past W12 start and
# current through end of H1 2026)
qual = {c for c in council_min
        if council_min[c] <= W12_START and council_max.get(c, "") >= "2026-06-30"}
# quarterly trend needs windows spanning 2025-Q3 onward (care-report pattern:
# four complete quarters of momentum, no YoY claim the data cannot support)
qual_trend = {c for c in qual if council_min[c] <= "2025-07-01"}

w12 = [a for a in flat if a["council"] in qual and W12_START <= a["received"] <= CUTOFF]
h1 = [a for a in flat if a["council"] in qual and "2026-01-01" <= a["received"] <= "2026-06-30"]

def agg(rows):
    sqm_rows = [a["sqm"] for a in rows if a["sqm"]]
    return {
        "apps": len(rows),
        "withFloorspace": len(sqm_rows),
        "floorspaceSqm": round(sum(sqm_rows)),
        "approved": sum(1 for a in rows if a["status"] == "approved"),
        "refused": sum(1 for a in rows if a["status"] == "refused"),
        "decidedOther": sum(1 for a in rows if a["status"] == "decided"),
        "pending": sum(1 for a in rows if a["status"] == "pending"),
        "bigbox": sum(1 for a in rows if a["bigbox"]),
    }

by_region = {}
for r in sorted({a["region"] for a in w12}):
    rows = [a for a in w12 if a["region"] == r]
    sq = [a["sqm"] for a in rows if a["sqm"]]
    by_region[r] = {"n": len(rows), "sqm": round(sum(sq)), "approved": sum(1 for a in rows if a["status"]=="approved")}

by_quarter = Counter(quarter(a["received"]) for a in flat
                     if a["council"] in qual_trend and "2025-07-01" <= a["received"] <= CUTOFF)
# one row per scheme in the display list: filings for the same scheme repeat
# the same floorspace figure in the same council
top, top_seen = [], set()
for a in sorted([a for a in w12 if a["sqm"]], key=lambda a: -a["sqm"]):
    k = (a["council"], round(a["sqm"]))
    if k in top_seen: continue
    top_seen.add(k); top.append(a)
    if len(top) == 12: break

planning_out = {
    "extractedAt": date.today().isoformat(),
    "basis": (f"Raw Idox planning exports from the Construction Capital lake, deduped by (council, reference) "
              f"and cross-register; admin filings (condition discharge, NMA) excluded; self storage excluded. "
              f"12-month window {W12_START} to {CUTOFF} over {len(qual)} councils whose scrape window spans the "
              f"full period; the quarterly series uses the {len(qual_trend)} councils whose window reaches "
              f"back to July 2025. Floorspace is as stated in proposal text and is a floor, not a total."),
    "cutoff": CUTOFF, "windowStart": W12_START,
    "councilsTotal": len(council_min),
    "councilsQualifying12m": len(qual),
    "councilsQualifyingTrend": len(qual_trend),
    "allTimeIndustrialApps": len(flat),
    "regionInferredFromCouncilModal": inferred,
    "window12m": agg(w12),
    "h1_2026": agg(h1),
    "byRegion": by_region,
    "byQuarter": {q: by_quarter[q] for q in sorted(by_quarter) if q},
    "tierSplit": dict(Counter(a["tier"] for a in w12)),
    "topSchemes": [{
        "council": a["council"], "region": a["region"], "status": a["status"],
        "sqm": round(a["sqm"]), "bigbox": a["bigbox"],
        "received": a["received"], "proposal": a["proposal"][:220],
    } for a in top],
}

# ═══ B. LAND REGISTRY PPD INDUSTRIAL CUT ═══════════════════════════════════
IND_ADDR = re.compile(r"(INDUSTRIAL ESTATE|INDUSTRIAL PARK|TRADING ESTATE|INDUSTRIAL UNIT|BUSINESS PARK)", re.I)
ppd = {"byYear": {}, "byRegion12m": {}, "note": "HMLR Price Paid type-O (commercial) transactions at industrial-keyword addresses. Type O excludes most portfolio/share deals; registrations lag 1-2 months minimum, longer for commercial."}
region_rows_recent = []
max_tx_date = ""
for y in range(2020, 2027):
    f = os.path.join(CC, f"data/land-registry/pp-{y}.csv")
    if not os.path.exists(f): continue
    prices = []; count = 0
    for row in csv.reader(open(f, encoding="utf-8", errors="replace")):
        if len(row) < 15 or row[4] != "O": continue
        addr = " ".join(row[7:13])
        if not IND_ADDR.search(addr): continue
        # exclude pure "business park" office-flavoured rows unless industrial term also present
        if re.search(r"BUSINESS PARK", addr, re.I) and not re.search(r"INDUSTRIAL|TRADING ESTATE|UNIT", addr, re.I): continue
        try: p = int(row[1])
        except ValueError: continue
        if p < 5000 or p > 100_000_000: continue
        count += 1; prices.append(p)
        d = row[2][:10]
        if d > max_tx_date: max_tx_date = d
        if d >= W12_START:
            district = (row[3].split(" ") or [""])[0]
            region_rows_recent.append((DISTRICT_REGION.get(district, "outside coverage"), p))
    if count:
        ppd["byYear"][str(y)] = {"transactions": count, "medianPrice": round(statistics.median(prices)),
                                  "meanPrice": round(statistics.mean(prices)), "totalConsideration": sum(prices)}
ppd["maxTransactionDate"] = max_tx_date
reg = defaultdict(list)
for r, p in region_rows_recent: reg[r].append(p)
ppd["byRegion12m"] = {r: {"transactions": len(v), "medianPrice": round(statistics.median(v))}
                      for r, v in sorted(reg.items(), key=lambda kv: -len(kv[1]))}

# ═══ C. COMPANIES HOUSE CHARGE CUTS (read-only) ════════════════════════════
con = sqlite3.connect(f"file:{DB}?mode=ro", uri=True)
con.row_factory = sqlite3.Row
cur = con.cursor()

OPERATOR_SICS = ("52101", "52102", "52103", "52241", "52242", "52243", "49410")
sic_ph = ",".join("?" * len(OPERATOR_SICS))
COLLATERAL_SQL = ("(charges.particulars LIKE '%industrial estate%' OR charges.particulars LIKE '%industrial unit%'"
                  " OR charges.particulars LIKE '%industrial park%' OR charges.particulars LIKE '%trading estate%'"
                  " OR charges.particulars LIKE '%warehouse%' OR charges.particulars LIKE '%trade counter%')")

def charge_cut(where, params, label):
    out = {"label": label}
    for name, lo, hi in (("h1_2026", "2026-01-01", "2026-06-30"), ("h1_2025", "2025-01-01", "2025-06-30"),
                         ("h1_2024", "2024-01-01", "2024-06-30")):
        r = cur.execute(
            f"SELECT COUNT(*) c, COUNT(DISTINCT charges.company_number) b FROM charges "
            f"JOIN companies ON companies.company_number=charges.company_number "
            f"WHERE {where} AND charges.created_on BETWEEN ? AND ?", params + [lo, hi]).fetchone()
        newspv = cur.execute(
            f"SELECT COUNT(*) c FROM charges JOIN companies ON companies.company_number=charges.company_number "
            f"WHERE {where} AND charges.created_on BETWEEN ? AND ? "
            f"AND companies.incorporation_date >= date(charges.created_on,'-12 months')", params + [lo, hi]).fetchone()
        out[name] = {"charges": r["c"], "borrowers": r["b"],
                     "newBorrowerSharePct": round(100 * newspv["c"] / r["c"], 1) if r["c"] else None}
    # redemption cohorts: full-18-month-window only
    coh = []
    for yr in range(2019, 2025):
        r = cur.execute(
            f"SELECT COUNT(*) n, SUM(CASE WHEN charges.satisfied_on IS NOT NULL "
            f"AND julianday(charges.satisfied_on)-julianday(charges.created_on)<=548 THEN 1 ELSE 0 END) s "
            f"FROM charges JOIN companies ON companies.company_number=charges.company_number "
            f"WHERE {where} AND charges.created_on BETWEEN ? AND ?", params + [f"{yr}-01-01", f"{yr}-12-31"]).fetchone()
        if r["n"] and r["n"] >= 30:
            coh.append({"cohort": str(yr), "originated": r["n"], "redeemedWithin18mPct": round(100 * (r["s"] or 0) / r["n"], 1)})
    out["redemptionCohorts"] = coh
    # regional split H1 2026 via charged-property postcode
    rows = cur.execute(
        f"SELECT charge_properties.postcode pc FROM charges "
        f"JOIN companies ON companies.company_number=charges.company_number "
        f"JOIN charge_properties ON charge_properties.charge_id=charges.id "
        f"WHERE {where} AND charges.created_on BETWEEN '2026-01-01' AND '2026-06-30'", params).fetchall()
    rc = Counter()
    for row in rows:
        district = (row["pc"] or "").split(" ")[0]
        rc[DISTRICT_REGION.get(district, "outside coverage")] += 1
    out["regionalH1_2026_propertyLocated"] = dict(rc.most_common())
    out["regionalCoverageNote"] = "property-postcode located; charges with no extractable property postcode are not represented"
    return out

operator = charge_cut(
    f"charges.company_number IN (SELECT company_number FROM company_sic WHERE sic_code IN ({sic_ph}))",
    list(OPERATOR_SICS),
    "Operators: warehousing & storage (52101-52103), cargo handling (52241-52243), road freight (49410)")
collateral = charge_cut(
    COLLATERAL_SQL, [],
    "Collateral: charge particulars naming industrial estates, industrial units/parks, trading estates, warehouses or trade counters")
# overlap between the two cuts, H1 2026
ov = cur.execute(
    f"SELECT COUNT(*) c FROM charges JOIN companies ON companies.company_number=charges.company_number "
    f"WHERE charges.company_number IN (SELECT company_number FROM company_sic WHERE sic_code IN ({sic_ph})) "
    f"AND {COLLATERAL_SQL} AND charges.created_on BETWEEN '2026-01-01' AND '2026-06-30'", list(OPERATOR_SICS)).fetchone()
whole = {}
for yr in ("2024", "2025", "2026"):
    whole[f"h1_{yr}"] = cur.execute(
        "SELECT COUNT(*) c FROM charges WHERE created_on BETWEEN ? AND ?",
        [f"{yr}-01-01", f"{yr}-06-30"]).fetchone()["c"]
con.close()

for cut in (operator, collateral):
    for p in ("h1_2024", "h1_2025", "h1_2026"):
        if cut.get(p) and whole.get(p):
            cut[p]["shareOfAllChargesPct"] = round(100 * cut[p]["charges"] / whole[p], 3)

lending_out = {
    "version": "1.0", "builtAt": date.today().isoformat(),
    "definition": "Two independent cuts of Companies House charge registrations. The operator cut counts charges against borrowers carrying warehousing, cargo-handling or road-freight SIC codes (occupier-side demand). The collateral cut counts charges whose particulars name industrial property types (investor and owner-occupier property lending, any borrower SIC). They overlap and are never summed.",
    "wholeMarketH1Charges": whole,
    "wholeMarketNote": "All charge registrations at Companies House in the period, any sector. Growth in a niche cut must be read against this baseline; shares are the honest comparator.",
    "operatorCut": operator, "collateralCut": collateral,
    "overlapH1_2026": ov["c"],
}

os.makedirs(os.path.join(CC, "data/lending-monitor"), exist_ok=True)
planning_out["ppd"] = ppd
json.dump(planning_out, open(os.path.join(CC, "data/lending-monitor/niche-industrial-h1-2026.json"), "w"), indent=1)
json.dump(lending_out, open(os.path.join(CC, "data/lending-monitor/niche-industrial-lending-cuts.json"), "w"), indent=1)
print("councils qual/trend:", len(qual), len(qual_trend))
print("planning w12:", planning_out["window12m"])
print("h1_2026:", planning_out["h1_2026"])
print("byQuarter:", planning_out["byQuarter"])
print("regions:", {k: v["n"] for k, v in planning_out["byRegion"].items()})
print("ppd byYear:", {k: (v["transactions"], v["medianPrice"]) for k, v in ppd["byYear"].items()})
print("operator h1_2026:", operator["h1_2026"], "vs h1_2025:", operator["h1_2025"])
print("collateral h1_2026:", collateral["h1_2026"], "vs h1_2025:", collateral["h1_2025"])
print("overlap:", ov["c"])
