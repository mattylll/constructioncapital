/**
 * Audit script: cross-reference site towns against Idox + Civica authority
 * registries to identify
 *   (a) towns whose LPA is ALREADY an enabled authority → just add the
 *       townSlug to its towns[] array (registry edit only, zero new probes).
 *   (b) towns whose LPA is not in any registry → need a new authority probe.
 *   (c) towns with no DISTRICT_OVERRIDE entry → can't resolve the LPA.
 *
 * Usage: npx tsx scripts/audit-planning-coverage.ts
 */
import * as fs from "fs";
import * as path from "path";
import { UK_COUNTIES } from "../src/lib/uk-locations-data";
import { PLANNING_AUTHORITIES } from "./planning-authorities";

// Scotland is deprioritised (per project scope).
const SCOTLAND_SLUGS = new Set([
  "aberdeen", "dundee", "edinburgh", "fife", "glasgow", "highland",
]);

// Load DISTRICT_OVERRIDES by requiring batch-land-registry.ts wouldn't work
// (it has side effects on import). Instead, extract the literal with a regex.
function loadDistrictOverrides(): Record<string, string[]> {
  const src = fs.readFileSync(
    path.join(process.cwd(), "scripts", "batch-land-registry.ts"),
    "utf-8"
  );
  const start = src.indexOf("const DISTRICT_OVERRIDES: Record<string, string[]> = {");
  const openBrace = src.indexOf("{", start);
  let depth = 0;
  let end = openBrace;
  for (let i = openBrace; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") { depth--; if (depth === 0) { end = i; break; } }
  }
  const body = src.substring(openBrace, end + 1);
  // Strip comments then eval as an object literal.
  const cleaned = body.replace(/(?<![:"])\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${cleaned});`)();
}

// Extract the IDOX_AUTHORITIES literal from fetch-planning-idox.ts.
interface IdoxEntry {
  id: string;
  name: string;
  baseUrl: string;
  towns: Array<{ townSlug: string; countySlug: string }>;
  enabled: boolean;
}
function loadIdoxAuthorities(): IdoxEntry[] {
  const src = fs.readFileSync(
    path.join(process.cwd(), "scripts", "fetch-planning-idox.ts"),
    "utf-8"
  );
  const marker = "const IDOX_AUTHORITIES: IdoxAuthority[] = ";
  const start = src.indexOf(marker);
  const openBracket = src.indexOf("[", start + marker.length);
  let depth = 0;
  let end = openBracket;
  for (let i = openBracket; i < src.length; i++) {
    if (src[i] === "[") depth++;
    else if (src[i] === "]") { depth--; if (depth === 0) { end = i; break; } }
  }
  const body = src.substring(openBracket, end + 1);
  const cleaned = body.replace(/(?<![:"])\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${cleaned});`)();
}

function norm(s: string): string {
  return s.toLowerCase().replace(/\band\b/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

function main() {
  const overrides = loadDistrictOverrides();
  const idox = loadIdoxAuthorities();
  const civica = PLANNING_AUTHORITIES;

  // Build quick lookup: normalised district name → list of authority entries
  // (Idox + Civica) that likely cover it.
  const authoritiesByDistrict = new Map<
    string,
    Array<{ kind: "idox" | "civica"; id: string; name: string; enabled: boolean }>
  >();

  const registerAuthority = (
    kind: "idox" | "civica",
    id: string,
    name: string,
    enabled: boolean
  ) => {
    const candidates = new Set<string>();
    candidates.add(norm(id.replace(/-/g, " ")));
    candidates.add(norm(name.replace(/\b(council|district|borough|city|county|metropolitan|royal|london|of|the)\b/gi, " ")));
    for (const c of candidates) {
      if (!c) continue;
      const entry = { kind, id, name, enabled };
      const list = authoritiesByDistrict.get(c) ?? [];
      list.push(entry);
      authoritiesByDistrict.set(c, list);
    }
  };
  for (const a of idox) registerAuthority("idox", a.id, a.name, a.enabled);
  for (const a of civica) registerAuthority("civica", a.id, a.name, a.enabled);

  // Index: authority-id → current townSlug set (to detect "already listed").
  const idoxTownsByAuthId = new Map(idox.map((a) => [a.id, new Set(a.towns.map((t) => t.townSlug))]));
  const civicaTownsByAuthId = new Map(civica.map((a) => [a.id, new Set(a.towns.map((t) => t.townSlug))]));

  const registryAdds: Array<{
    county: string; town: string; district: string;
    kind: "idox" | "civica"; authId: string; authName: string;
  }> = [];
  const disabledMatches: Array<{
    county: string; town: string; district: string;
    kind: "idox" | "civica"; authId: string; authName: string;
  }> = [];
  const noOverride: Array<{ county: string; town: string }> = [];
  const noAuthority: Array<{ county: string; town: string; district: string }> = [];
  const alreadyListed: Array<{ county: string; town: string }> = [];

  for (const county of UK_COUNTIES) {
    if (SCOTLAND_SLUGS.has(county.slug)) continue;
    for (const town of county.towns) {
      const latestPath = path.join(
        process.cwd(), "data", "generated", "planning", county.slug, town.slug, "latest.json"
      );
      if (fs.existsSync(latestPath)) continue; // already captured

      const key = `${county.slug}/${town.slug}`;
      const districts = overrides[key];
      if (!districts || districts.length === 0) {
        noOverride.push({ county: county.slug, town: town.slug });
        continue;
      }

      let matched = false;
      for (const d of districts) {
        const candidates = authoritiesByDistrict.get(norm(d)) ?? [];
        for (const c of candidates) {
          // Skip if already listed
          const townsSet = c.kind === "idox"
            ? idoxTownsByAuthId.get(c.id)
            : civicaTownsByAuthId.get(c.id);
          if (townsSet?.has(town.slug)) {
            alreadyListed.push({ county: county.slug, town: town.slug });
            matched = true;
            break;
          }
          const record = {
            county: county.slug, town: town.slug, district: d,
            kind: c.kind, authId: c.id, authName: c.name,
          };
          if (c.enabled) registryAdds.push(record);
          else disabledMatches.push(record);
          matched = true;
          break;
        }
        if (matched) break;
      }
      if (!matched) noAuthority.push({ county: county.slug, town: town.slug, district: districts[0] });
    }
  }

  const report = [
    `Planning coverage audit — ${new Date().toISOString().slice(0,10)}`,
    `(Scotland excluded per project scope)`,
    ``,
    `Registry-only additions (ENABLED authority already covers this town):  ${registryAdds.length}`,
    `Matches found but authority is DISABLED:                               ${disabledMatches.length}`,
    `No authority matched for the district (need to add a new authority):  ${noAuthority.length}`,
    `Town has no DISTRICT_OVERRIDE (can't resolve LPA):                    ${noOverride.length}`,
    `Already listed under an authority but no latest.json (run pending):   ${alreadyListed.length}`,
    ``,
    `═══ REGISTRY-ONLY ADDS (immediate wins) ═══`,
  ];

  // Group by authority for easy editing
  const byAuth = new Map<string, typeof registryAdds>();
  for (const r of registryAdds) {
    const k = `${r.kind}:${r.authId}`;
    const list = byAuth.get(k) ?? [];
    list.push(r);
    byAuth.set(k, list);
  }
  for (const [k, rs] of [...byAuth.entries()].sort()) {
    report.push(`\n  ${k} (${rs[0].authName})`);
    for (const r of rs) report.push(`    + ${r.county}/${r.town}   [district: ${r.district}]`);
  }

  report.push(``, `═══ DISABLED-AUTHORITY MATCHES (revisit later) ═══`);
  for (const r of disabledMatches) {
    report.push(`  - ${r.county}/${r.town}  →  ${r.kind}:${r.authId} (${r.authName})`);
  }

  report.push(``, `═══ NO MATCHING AUTHORITY — needs new registry entry ═══`);
  const byDistrict = new Map<string, string[]>();
  for (const r of noAuthority) {
    const list = byDistrict.get(r.district) ?? [];
    list.push(`${r.county}/${r.town}`);
    byDistrict.set(r.district, list);
  }
  for (const [d, towns] of [...byDistrict.entries()].sort()) {
    report.push(`  [${d}]  →  ${towns.join(", ")}`);
  }

  report.push(``, `═══ ALREADY LISTED (town in authority's towns[] but no data file) ═══`);
  for (const r of alreadyListed) report.push(`  - ${r.county}/${r.town}`);

  report.push(``, `═══ NO DISTRICT_OVERRIDE (add to batch-land-registry.ts) ═══`);
  for (const r of noOverride) report.push(`  - ${r.county}/${r.town}`);

  console.log(report.join("\n"));
}

main();
