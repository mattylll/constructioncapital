/**
 * diagnose-planning-gaps.ts — Wave 1 of the planning-coverage fix.
 *
 * Finds every ENABLED authority (across all five scraper registries) that
 * lists a town which has no data/generated/planning/<county>/<town>/latest.json,
 * runs that single authority through its own scraper, and classifies the
 * outcome:
 *
 *   OK_NOW         all expected towns now have data (transient failure)
 *   ZERO_RESULTS   scraper ran clean but found no relevant apps (may be a
 *                  legitimately quiet district over the 3-month window)
 *   TOWN_UNWRITTEN scraper succeeded and wrote other towns, but not the
 *                  target town → town-mapping bug in the registry entry
 *   TLS_CHAIN      incomplete certificate chain (needs the Arcus robustFetch
 *                  repair pattern ported)
 *   HTTP_FAIL      404/403/redirect/rate-limit — likely portal migration
 *   TIMEOUT        authority exceeded the per-run cap
 *   ERROR          anything else (see log tail in report.json)
 *
 * CLI safety: a bare invocation prints usage and exits — nothing runs and
 * nothing is written without an explicit flag.
 *
 * Usage:
 *   npx tsx scripts/diagnose-planning-gaps.ts --run                # all gap authorities
 *   npx tsx scripts/diagnose-planning-gaps.ts --run --only idox:bristol,arcus:wiltshire
 *   npx tsx scripts/diagnose-planning-gaps.ts --run --limit 5      # first N only
 *   npx tsx scripts/diagnose-planning-gaps.ts --list               # print gap authorities, run nothing
 *
 * Output: data/generated/planning-gap-diagnosis/report.{json,md}
 */

import * as fs from "fs";
import * as path from "path";
import { spawnSync } from "child_process";
import { UK_COUNTIES } from "../src/lib/uk-locations-data";
import { PLANNING_AUTHORITIES } from "./planning-authorities";

const MONTHS = process.env.PLANNING_MONTHS || "3";
const PER_AUTHORITY_TIMEOUT_MS = 20 * 60 * 1000;
const BETWEEN_AUTHORITIES_MS = 5000;

interface RegistryEntry {
  id: string;
  name: string;
  enabled: boolean;
  towns: Array<{ townSlug: string; countySlug: string }>;
}

interface GapAuthority {
  vendor: "idox" | "batch" | "fastweb" | "agile" | "arcus";
  id: string;
  name: string;
  missingTowns: string[]; // "county/town"
}

interface Diagnosis {
  vendor: string;
  id: string;
  name: string;
  missingTowns: string[];
  classification: string;
  exitCode: number | null;
  townsRecovered: string[];
  townsStillMissing: string[];
  durationSec: number;
  logTail: string;
}

// ─── Registry extraction (same bracket-walk approach as audit script) ───

function extractArrayLiteral(file: string, marker: string): RegistryEntry[] {
  const src = fs.readFileSync(path.join(process.cwd(), "scripts", file), "utf-8");
  const start = src.indexOf(marker);
  if (start === -1) throw new Error(`Marker not found in ${file}: ${marker}`);
  const openBracket = src.indexOf("[", start + marker.length);
  let depth = 0;
  let end = openBracket;
  for (let i = openBracket; i < src.length; i++) {
    if (src[i] === "[") depth++;
    else if (src[i] === "]") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  const body = src.substring(openBracket, end + 1);
  const cleaned = body
    .replace(/(?<![:"'])\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${cleaned});`)();
}

function loadRegistries(): Record<GapAuthority["vendor"], RegistryEntry[]> {
  return {
    idox: extractArrayLiteral("fetch-planning-idox.ts", "const IDOX_AUTHORITIES: IdoxAuthority[] = "),
    batch: PLANNING_AUTHORITIES as unknown as RegistryEntry[],
    fastweb: extractArrayLiteral("fetch-planning-fastweb.ts", "export const FASTWEB_AUTHORITIES: FastwebAuthority[] = "),
    agile: extractArrayLiteral("fetch-planning-agile.ts", "const AGILE_AUTHORITIES: AgileAuthority[] = "),
    arcus: extractArrayLiteral("fetch-planning-arcus.ts", "const ARCUS_AUTHORITIES: ArcusAuthority[] = "),
  };
}

// ─── Gap detection ───────────────────────────────────────────

function latestJsonPath(countySlug: string, townSlug: string): string {
  return path.join(process.cwd(), "data", "generated", "planning", countySlug, townSlug, "latest.json");
}

function findGapAuthorities(): GapAuthority[] {
  const validTowns = new Set(
    UK_COUNTIES.flatMap((c) => c.towns.map((t) => `${c.slug}/${t.slug}`))
  );
  const registries = loadRegistries();
  const gaps: GapAuthority[] = [];

  for (const [vendor, entries] of Object.entries(registries) as Array<[
    GapAuthority["vendor"],
    RegistryEntry[]
  ]>) {
    for (const entry of entries) {
      if (!entry.enabled) continue;
      const missing = (entry.towns ?? [])
        .map((t) => `${t.countySlug}/${t.townSlug}`)
        .filter((key) => validTowns.has(key))
        .filter((key) => {
          const [c, t] = key.split("/");
          return !fs.existsSync(latestJsonPath(c, t));
        });
      if (missing.length > 0) {
        gaps.push({ vendor, id: entry.id, name: entry.name, missingTowns: missing });
      }
    }
  }

  return gaps.sort((a, b) => b.missingTowns.length - a.missingTowns.length);
}

// ─── Classification ──────────────────────────────────────────

function classify(
  exitCode: number | null,
  timedOut: boolean,
  log: string,
  recovered: string[],
  stillMissing: string[]
): string {
  if (timedOut) return "TIMEOUT";
  if (stillMissing.length === 0) return "OK_NOW";
  if (/UNABLE_TO_VERIFY_LEAF_SIGNATURE|unable to verify the first certificate/i.test(log)) {
    return "TLS_CHAIN";
  }
  if (/429|Too Many Requests/i.test(log) && recovered.length === 0) return "HTTP_FAIL";
  if (/(404|403|ENOTFOUND|ECONNREFUSED|certificate|redirect(ed)? to|fetch failed)/i.test(log) && recovered.length === 0) {
    return "HTTP_FAIL";
  }
  if (exitCode === 0 || recovered.length > 0) {
    // Scraper considers itself successful; did it simply find nothing?
    if (/(0 relevant|Relevant: 0|no (matching|relevant) applications|0 results)/i.test(log)) {
      return "ZERO_RESULTS";
    }
    return "TOWN_UNWRITTEN";
  }
  return "ERROR";
}

// ─── Runner ──────────────────────────────────────────────────

function runAuthority(gap: GapAuthority): Diagnosis {
  const script = `scripts/fetch-planning-${gap.vendor === "batch" ? "batch" : gap.vendor}.ts`;
  const started = Date.now();
  console.log(`\n▶ [${gap.vendor}:${gap.id}] ${gap.name} — expecting ${gap.missingTowns.join(", ")}`);

  const res = spawnSync(
    "npx",
    ["tsx", script, "--authority", gap.id, "--months", MONTHS],
    {
      cwd: process.cwd(),
      encoding: "utf-8",
      timeout: PER_AUTHORITY_TIMEOUT_MS,
      maxBuffer: 32 * 1024 * 1024,
    }
  );

  const timedOut = res.error?.message?.includes("ETIMEDOUT") ?? false;
  const log = `${res.stdout ?? ""}\n${res.stderr ?? ""}`;
  const recovered = gap.missingTowns.filter((key) => {
    const [c, t] = key.split("/");
    return fs.existsSync(latestJsonPath(c, t));
  });
  const stillMissing = gap.missingTowns.filter((k) => !recovered.includes(k));
  const classification = classify(res.status, timedOut, log, recovered, stillMissing);
  const durationSec = Math.round((Date.now() - started) / 1000);

  console.log(
    `■ [${gap.vendor}:${gap.id}] ${classification} — recovered ${recovered.length}/${gap.missingTowns.length} towns in ${durationSec}s (exit ${res.status})`
  );

  return {
    vendor: gap.vendor,
    id: gap.id,
    name: gap.name,
    missingTowns: gap.missingTowns,
    classification,
    exitCode: res.status,
    townsRecovered: recovered,
    townsStillMissing: stillMissing,
    durationSec,
    logTail: log.split("\n").slice(-25).join("\n").slice(-3000),
  };
}

function writeReport(diagnoses: Diagnosis[], complete: boolean) {
  const outDir = path.join(process.cwd(), "data", "generated", "planning-gap-diagnosis");
  fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(
    path.join(outDir, "report.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), complete, diagnoses }, null, 2)
  );

  const byClass = new Map<string, Diagnosis[]>();
  for (const d of diagnoses) {
    const list = byClass.get(d.classification) ?? [];
    list.push(d);
    byClass.set(d.classification, list);
  }

  const md: string[] = [
    `# Planning gap diagnosis — ${new Date().toISOString().slice(0, 10)}${complete ? "" : " (IN PROGRESS)"}`,
    "",
    `Authorities diagnosed: ${diagnoses.length}`,
    "",
    "| Classification | Authorities | Towns recovered |",
    "| --- | --- | --- |",
  ];
  for (const [cls, list] of [...byClass.entries()].sort()) {
    md.push(
      `| ${cls} | ${list.length} | ${list.reduce((s, d) => s + d.townsRecovered.length, 0)} |`
    );
  }
  for (const [cls, list] of [...byClass.entries()].sort()) {
    md.push("", `## ${cls}`, "");
    for (const d of list) {
      md.push(
        `- **${d.vendor}:${d.id}** (${d.name}) — recovered ${d.townsRecovered.length}/${d.missingTowns.length}: still missing ${d.townsStillMissing.join(", ") || "—"} (${d.durationSec}s, exit ${d.exitCode})`
      );
    }
  }
  fs.writeFileSync(path.join(outDir, "report.md"), md.join("\n"));
}

// ─── CLI ─────────────────────────────────────────────────────

function usage(): never {
  console.log(
    "Usage:\n" +
      "  npx tsx scripts/diagnose-planning-gaps.ts --list                 # show gap authorities, run nothing\n" +
      "  npx tsx scripts/diagnose-planning-gaps.ts --run                  # diagnose all gap authorities\n" +
      "  npx tsx scripts/diagnose-planning-gaps.ts --run --only v:id,v:id # subset\n" +
      "  npx tsx scripts/diagnose-planning-gaps.ts --run --limit N        # first N\n"
  );
  process.exit(0);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || (!args.includes("--run") && !args.includes("--list"))) usage();

  let gaps = findGapAuthorities();

  const onlyIdx = args.indexOf("--only");
  if (onlyIdx !== -1 && args[onlyIdx + 1]) {
    const wanted = new Set(args[onlyIdx + 1].split(","));
    gaps = gaps.filter((g) => wanted.has(`${g.vendor}:${g.id}`));
  }
  const limitIdx = args.indexOf("--limit");
  if (limitIdx !== -1 && args[limitIdx + 1]) {
    gaps = gaps.slice(0, parseInt(args[limitIdx + 1], 10) || gaps.length);
  }

  console.log(`Gap authorities (enabled, listed towns missing data): ${gaps.length}`);
  for (const g of gaps) {
    console.log(`  ${String(g.missingTowns.length).padStart(2)}  ${g.vendor}:${g.id}  →  ${g.missingTowns.join(", ")}`);
  }
  if (args.includes("--list")) return;

  const diagnoses: Diagnosis[] = [];
  for (const gap of gaps) {
    diagnoses.push(runAuthority(gap));
    writeReport(diagnoses, false); // incremental — survives interruption
    await new Promise((r) => setTimeout(r, BETWEEN_AUTHORITIES_MS));
  }
  writeReport(diagnoses, true);

  const counts = new Map<string, number>();
  diagnoses.forEach((d) => counts.set(d.classification, (counts.get(d.classification) ?? 0) + 1));
  console.log(`\n=== DIAGNOSIS COMPLETE: ${diagnoses.length} authorities ===`);
  for (const [cls, n] of [...counts.entries()].sort()) console.log(`  ${cls}: ${n}`);
  const totalRecovered = diagnoses.reduce((s, d) => s + d.townsRecovered.length, 0);
  console.log(`  towns recovered: ${totalRecovered}`);
  console.log(`Report: data/generated/planning-gap-diagnosis/report.md`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
