/**
 * Fetch planning applications from St Albans Portal360 (Civica) API.
 *
 * Calls the Civica JSON API directly — no browser needed.
 * Fetches a 12-month window of received applications to capture both
 * pending and decided (approved/refused) applications.
 *
 * Usage:
 *   npx tsx scripts/fetch-planning-data.ts
 *   npx tsx scripts/fetch-planning-data.ts --months 6
 */

import * as fs from "fs";
import * as path from "path";

// ─── Configuration ───────────────────────────────────────────

const API_URL =
  "https://planningapplications.stalbans.gov.uk/w2webparts/Resource/Civica/Handler.ashx/keyobject/pagedsearch";

const PAGE_SIZE = 50;
const THROTTLE_MS = 400; // ms between requests
const DEFAULT_MONTHS = 12;

// ─── Helpers ─────────────────────────────────────────────────

function formatDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

interface RawApiItem {
  Items: Array<{ FieldName: string; Value: string }>;
}

function flattenItem(item: RawApiItem): Record<string, string> {
  const result: Record<string, string> = {};
  for (const field of item.Items) {
    result[field.FieldName] = field.Value ?? "";
  }
  return result;
}

// ─── Fetch ───────────────────────────────────────────────────

async function fetchPage(
  fromRow: number,
  toRow: number,
  dateFrom: string,
  dateTo: string,
  countOnly: boolean = false
): Promise<{ items: RawApiItem[]; totalRows: number }> {
  const body = {
    refType: "PBDC",
    fromRow,
    toRow,
    searchFields: {
      received_dateFrom: dateFrom,
      received_dateTo: dateTo,
    },
    NoTotalRows: false,
  };

  const resp = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    throw new Error(`API returned ${resp.status}: ${resp.statusText}`);
  }

  const data = await resp.json();

  // The API returns { KeyObjects: [...], TotalRows: N }
  const items: RawApiItem[] = data.KeyObjects || [];
  const totalRows: number = data.TotalRows || 0;

  return { items, totalRows };
}

async function fetchAllApplications(
  dateFrom: string,
  dateTo: string
): Promise<Record<string, string>[]> {
  // First request to get total count
  console.log(`  Fetching rows 1-${PAGE_SIZE}...`);
  const first = await fetchPage(1, PAGE_SIZE, dateFrom, dateTo);
  const totalRows = first.totalRows;
  console.log(`  Total rows: ${totalRows}`);

  const allItems: RawApiItem[] = [...first.items];

  // Paginate remaining
  let fromRow = PAGE_SIZE + 1;
  while (fromRow <= totalRows) {
    const toRow = Math.min(fromRow + PAGE_SIZE - 1, totalRows);
    console.log(`  Fetching rows ${fromRow}-${toRow}...`);
    await sleep(THROTTLE_MS);

    try {
      const page = await fetchPage(fromRow, toRow, dateFrom, dateTo);
      allItems.push(...page.items);
    } catch (err) {
      console.error(`  Error fetching rows ${fromRow}-${toRow}: ${err}`);
      // Continue with next page
    }

    fromRow += PAGE_SIZE;
  }

  // Flatten Items arrays into flat objects
  return allItems.map(flattenItem);
}

// ─── Main ────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const monthsIdx = args.indexOf("--months");
  const months =
    monthsIdx >= 0 ? parseInt(args[monthsIdx + 1], 10) : DEFAULT_MONTHS;

  const now = new Date();
  const from = new Date(now);
  from.setMonth(from.getMonth() - months);

  const dateFrom = formatDate(from);
  const dateTo = formatDate(now);

  console.log(
    `\nFetching St Albans planning applications: ${dateFrom} to ${dateTo} (${months} months)\n`
  );

  const applications = await fetchAllApplications(dateFrom, dateTo);

  // Deduplicate on ref_no (keep last seen)
  const deduped = new Map<string, Record<string, string>>();
  for (const app of applications) {
    const ref = app.ref_no || app.additional_ref_no || "";
    if (ref) {
      deduped.set(ref, app);
    }
  }

  const results = Array.from(deduped.values());

  console.log(`\n  Fetched: ${applications.length} raw records`);
  console.log(`  After dedup: ${results.length} unique applications`);

  // Count decided vs pending
  const decided = results.filter(
    (a) =>
      a.decision_notice_type &&
      a.decision_notice_type !== "PENDING" &&
      a.decision_notice_type !== ""
  );
  const approved = results.filter(
    (a) =>
      a.app_status === "Approved" ||
      (a.decision_notice_type &&
        a.decision_notice_type.toLowerCase().includes("approved"))
  );
  const refused = results.filter(
    (a) =>
      a.app_status === "Refused" ||
      (a.decision_notice_type &&
        a.decision_notice_type.toLowerCase().includes("refused"))
  );

  console.log(`  Decided: ${decided.length}`);
  console.log(`  Approved: ${approved.length}`);
  console.log(`  Refused: ${refused.length}`);
  console.log(
    `  Pending: ${results.length - decided.length}`
  );

  // Save raw data
  const today = new Date().toISOString().split("T")[0];
  const exportDir = path.join(process.cwd(), "data", "planning-exports");
  fs.mkdirSync(exportDir, { recursive: true });

  const outPath = path.join(exportDir, `st-albans-raw-api-${today}.json`);
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\n  Saved: ${outPath}`);

  // Show decision_notice_type breakdown
  const decisionTypes = new Map<string, number>();
  for (const a of results) {
    const dt = a.decision_notice_type || "(empty)";
    decisionTypes.set(dt, (decisionTypes.get(dt) || 0) + 1);
  }
  console.log("\n  Decision notice types:");
  for (const [type, count] of [...decisionTypes.entries()].sort(
    (a, b) => b[1] - a[1]
  )) {
    console.log(`    ${count.toString().padStart(4)}  ${type}`);
  }

  // Show app_status breakdown
  const statuses = new Map<string, number>();
  for (const a of results) {
    const s = a.app_status || "(empty)";
    statuses.set(s, (statuses.get(s) || 0) + 1);
  }
  console.log("\n  Application statuses:");
  for (const [status, count] of [...statuses.entries()].sort(
    (a, b) => b[1] - a[1]
  )) {
    console.log(`    ${count.toString().padStart(4)}  ${status}`);
  }

  console.log("\n  Done!\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
