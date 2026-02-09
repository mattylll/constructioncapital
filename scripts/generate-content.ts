/**
 * Generate Content Script
 *
 * Fetches all locations from Convex and generates unique AI content for each
 * location x service combination using OpenAI. Content is inserted into the
 * `location_services` table.
 *
 * Features:
 *   - Resume capability: skips location/service combos that already have content
 *   - Batch processing: processes 5 concurrent OpenAI requests at a time
 *   - Progress tracking with counter
 *   - Proper error handling with retries
 *
 * Usage:
 *   npx tsx scripts/generate-content.ts
 *
 * Requires:
 *   - OPENAI_API_KEY in .env.local or environment
 *   - CONVEX_URL or NEXT_PUBLIC_CONVEX_URL in .env.local or environment
 *   - Convex mutation: locationServices.create
 *     (run `npx convex dev` first to generate the API)
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as path from "path";
import * as fs from "fs";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Location {
  _id: string;
  town: string;
  county: string;
  county_slug: string;
  town_slug: string;
  region: string;
  population?: number;
}

interface FAQ {
  question: string;
  answer: string;
}

interface DealExample {
  title: string;
  description: string;
  gdv: string;
  loan_amount: string;
  ltv: string;
  loan_type: string;
}

interface Rates {
  rate_from: string;
  rate_to: string;
  ltv_max: string;
  term: string;
  arrangement_fee: string;
}

interface GeneratedContent {
  market_commentary: string;
  faqs: FAQ[];
  deal_example: DealExample;
  rates: Rates;
  meta_title: string;
  meta_description: string;
}

interface ServiceDefinition {
  slug: string;
  name: string;
  shortDesc: string;
  typicalLtv: string;
  typicalRate: string;
  typicalTerm: string;
}

// ---------------------------------------------------------------------------
// Services (mirrored from src/lib/services.ts for standalone execution)
// ---------------------------------------------------------------------------

const SERVICES: ServiceDefinition[] = [
  {
    slug: "development-finance",
    name: "Development Finance",
    shortDesc: "Senior debt funding for ground-up residential and commercial developments.",
    typicalLtv: "Up to 65-70% LTGDV",
    typicalRate: "From 6.5% p.a.",
    typicalTerm: "12-24 months",
  },
  {
    slug: "mezzanine-finance",
    name: "Mezzanine Finance",
    shortDesc: "Stretch your capital stack beyond senior debt to reduce equity requirements.",
    typicalLtv: "Up to 85-90% LTGDV",
    typicalRate: "From 12% p.a.",
    typicalTerm: "12-24 months",
  },
  {
    slug: "bridging-loans",
    name: "Bridging Loans",
    shortDesc: "Short-term finance for acquisitions, auction purchases and time-sensitive deals.",
    typicalLtv: "Up to 75% LTV",
    typicalRate: "From 0.55% p.m.",
    typicalTerm: "1-18 months",
  },
  {
    slug: "equity-jv",
    name: "Equity & Joint Ventures",
    shortDesc: "Equity partnerships and JV structures for developers seeking capital partners.",
    typicalLtv: "Up to 100% of costs",
    typicalRate: "Profit share from 40%",
    typicalTerm: "Project duration",
  },
  {
    slug: "refurbishment-finance",
    name: "Refurbishment Finance",
    shortDesc: "Funding for light and heavy refurbishment projects including conversions.",
    typicalLtv: "Up to 75% LTV",
    typicalRate: "From 0.65% p.m.",
    typicalTerm: "6-18 months",
  },
  {
    slug: "commercial-mortgages",
    name: "Commercial Mortgages",
    shortDesc: "Long-term finance for commercial property acquisition and refinancing.",
    typicalLtv: "Up to 75% LTV",
    typicalRate: "From 5.5% p.a.",
    typicalTerm: "3-25 years",
  },
];

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const CONCURRENCY = 5;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;
const OPENAI_MODEL = "gpt-4o-mini";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Minimal .env file parser (no external dependency required).
 */
function loadEnvFile(filePath: string): boolean {
  if (!fs.existsSync(filePath)) return false;

  const content = fs.readFileSync(filePath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
  return true;
}

function loadEnv(): void {
  const root = path.resolve(__dirname, "..");
  const envLocalPath = path.join(root, ".env.local");
  const envPath = path.join(root, ".env");

  if (loadEnvFile(envLocalPath)) {
    console.log("[env] Loaded .env.local");
  } else if (loadEnvFile(envPath)) {
    console.log("[env] Loaded .env");
  } else {
    console.log("[env] No .env file found, using environment variables");
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Process items in batches with a given concurrency limit.
 */
async function processBatch<T, R>(
  items: T[],
  concurrency: number,
  processor: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  let index = 0;

  async function worker(): Promise<void> {
    while (index < items.length) {
      const currentIndex = index++;
      const item = items[currentIndex];
      results[currentIndex] = await processor(item, currentIndex);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () =>
    worker()
  );
  await Promise.all(workers);
  return results;
}

// ---------------------------------------------------------------------------
// OpenAI API call
// ---------------------------------------------------------------------------

function buildPrompt(location: Location, service: ServiceDefinition): string {
  return `You are a UK property finance content specialist writing for Construction Capital, a development finance brokerage. Generate unique, specific content for the following location and service combination.

LOCATION:
- Town: ${location.town}
- County: ${location.county}
- Region: ${location.region}
- Population: ${location.population ? location.population.toLocaleString() : "N/A"}

SERVICE:
- Name: ${service.name}
- Description: ${service.shortDesc}
- Typical LTV: ${service.typicalLtv}
- Typical Rate: ${service.typicalRate}
- Typical Term: ${service.typicalTerm}

Generate the following in valid JSON format (no markdown, no code blocks, just pure JSON):

{
  "market_commentary": "A 200-300 word market commentary about ${service.name} in ${location.town}, ${location.county}. Reference local factors such as the housing market, planning context, regeneration projects, local economy, transport links, demographics, and demand drivers specific to ${location.town}. Mention the ${location.region} regional context. Write in a professional, authoritative tone as a finance specialist. Do NOT use generic text - every paragraph must be specific to ${location.town}.",

  "faqs": [
    {
      "question": "A specific FAQ question about ${service.name} in ${location.town}",
      "answer": "A detailed 50-80 word answer specific to this service and location"
    }
  ],

  "deal_example": {
    "title": "A short title for an example ${service.name} deal in ${location.town}",
    "description": "A 2-3 sentence description of a realistic ${service.name} deal in ${location.town}, referencing local property types and values",
    "gdv": "Gross Development Value as a formatted string e.g. '2,400,000'",
    "loan_amount": "Loan amount as a formatted string e.g. '1,560,000'",
    "ltv": "LTV percentage as string e.g. '65%'",
    "loan_type": "${service.name}"
  },

  "rates": {
    "rate_from": "Starting interest rate as string e.g. '6.5% p.a.' or '0.55% p.m.'",
    "rate_to": "Upper interest rate as string e.g. '9.5% p.a.' or '0.95% p.m.'",
    "ltv_max": "Maximum LTV as string e.g. '70% LTGDV'",
    "term": "Typical term as string e.g. '12-24 months'",
    "arrangement_fee": "Arrangement fee as string e.g. '1-2%'"
  },

  "meta_title": "An SEO-optimised title under 60 characters for ${service.name} in ${location.town} | Construction Capital",

  "meta_description": "An SEO-optimised meta description of 150-160 characters for ${service.name} in ${location.town}, ${location.county}"
}

IMPORTANT RULES:
1. Generate exactly 5 FAQ objects in the faqs array
2. Each FAQ must be specifically about ${service.name} (not generic finance questions) and relevant to ${location.town}
3. The deal example must use realistic values appropriate for ${location.region} property prices
4. For London and South East, use higher property values. For North, use lower values. For Midlands, use middle-range values
5. Rates should vary slightly by region: London/SE slightly higher base rates, North slightly lower
6. For bridging loans and refurbishment finance, use monthly rates (p.m.). For other services, use annual rates (p.a.) or profit share
7. All monetary values should be realistic GBP amounts WITHOUT the pound symbol - just the number with commas
8. The market commentary MUST be unique and specific - reference real characteristics of ${location.town}
9. Return ONLY valid JSON - no markdown formatting, no code blocks, no explanation text`;
}

async function callOpenAI(
  prompt: string,
  apiKey: string,
  retries: number = MAX_RETRIES
): Promise<GeneratedContent> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          messages: [
            {
              role: "system",
              content:
                "You are a UK property development finance expert. Always respond with valid JSON only. No markdown, no code blocks, no explanations outside the JSON.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.8,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        if (response.status === 429) {
          // Rate limited - wait longer
          const waitTime = RETRY_DELAY_MS * attempt * 2;
          console.warn(
            `    [rate-limit] Waiting ${waitTime}ms before retry ${attempt}/${retries}`
          );
          await sleep(waitTime);
          continue;
        }
        throw new Error(
          `OpenAI API error ${response.status}: ${errorBody}`
        );
      }

      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content;

      if (!rawContent) {
        throw new Error("Empty response from OpenAI");
      }

      // Clean the response - remove potential markdown code blocks
      let cleaned = rawContent.trim();
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.slice(7);
      } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.slice(3);
      }
      if (cleaned.endsWith("```")) {
        cleaned = cleaned.slice(0, -3);
      }
      cleaned = cleaned.trim();

      const parsed = JSON.parse(cleaned) as GeneratedContent;

      // Validate essential fields
      if (
        !parsed.market_commentary ||
        !parsed.faqs ||
        !Array.isArray(parsed.faqs) ||
        parsed.faqs.length === 0 ||
        !parsed.deal_example ||
        !parsed.rates ||
        !parsed.meta_title ||
        !parsed.meta_description
      ) {
        throw new Error("Incomplete content generated - missing required fields");
      }

      // Ensure exactly 5 FAQs
      if (parsed.faqs.length < 5) {
        console.warn(
          `    [warn] Only ${parsed.faqs.length} FAQs generated, expected 5`
        );
      }

      return parsed;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);

      if (attempt < retries) {
        console.warn(
          `    [retry] Attempt ${attempt}/${retries} failed: ${message}`
        );
        await sleep(RETRY_DELAY_MS * attempt);
      } else {
        throw new Error(
          `Failed after ${retries} attempts: ${message}`
        );
      }
    }
  }

  throw new Error("Unreachable - all retries exhausted");
}

// ---------------------------------------------------------------------------
// Main script
// ---------------------------------------------------------------------------

interface TaskItem {
  location: Location;
  service: ServiceDefinition;
}

async function main(): Promise<void> {
  loadEnv();

  // ── Validate environment ──────────────────────────────────────────────────
  const convexUrl =
    process.env.NEXT_PUBLIC_CONVEX_URL ?? process.env.CONVEX_URL;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (!convexUrl) {
    console.error(
      "[error] CONVEX_URL or NEXT_PUBLIC_CONVEX_URL not found in environment.\n" +
        "  Set it in .env.local or pass it directly."
    );
    process.exit(1);
  }

  if (!openaiApiKey) {
    console.error(
      "[error] OPENAI_API_KEY not found in environment.\n" +
        "  Set it in .env.local or pass it directly."
    );
    process.exit(1);
  }

  console.log(`[info] Connecting to Convex at ${convexUrl}`);
  console.log(`[info] Using OpenAI model: ${OPENAI_MODEL}`);
  console.log(`[info] Concurrency: ${CONCURRENCY}`);

  const client = new ConvexHttpClient(convexUrl);

  // ── Fetch all locations ───────────────────────────────────────────────────
  console.log("[info] Fetching locations...");

  let locations: Location[] = [];
  try {
    locations = await client.query(api.locations.getAllPublished, {});
  } catch {
    try {
      locations = await client.query(api.locations.getAll, {});
    } catch {
      console.error(
        "[error] Could not fetch locations. Run seed-towns.ts first."
      );
      process.exit(1);
    }
  }

  if (locations.length === 0) {
    console.error(
      "[error] No locations found. Run seed-towns.ts first to populate the database."
    );
    process.exit(1);
  }

  console.log(`[info] Found ${locations.length} locations.`);

  // ── Fetch existing location_services for resume capability ────────────────
  console.log("[info] Fetching existing location_services content...");

  let existingServices: Array<{
    county_slug: string;
    town_slug: string;
    service_slug: string;
  }> = [];

  try {
    existingServices = await client.query(
      api.locationServices.getAllPublished,
      {}
    );
  } catch {
    console.log(
      "[warn] Could not fetch existing location_services (table may be empty)."
    );
  }

  const existingKeys = new Set(
    existingServices.map(
      (s) => `${s.county_slug}::${s.town_slug}::${s.service_slug}`
    )
  );

  console.log(`[info] Found ${existingServices.length} existing content records.`);

  // ── Build task list (location x service combos that need content) ─────────
  const tasks: TaskItem[] = [];

  for (const location of locations) {
    for (const service of SERVICES) {
      const key = `${location.county_slug}::${location.town_slug}::${service.slug}`;
      if (!existingKeys.has(key)) {
        tasks.push({ location, service });
      }
    }
  }

  const totalPossible = locations.length * SERVICES.length;
  const alreadyDone = totalPossible - tasks.length;

  console.log(
    `\n[info] Content generation plan:`
  );
  console.log(`  Total combos:    ${totalPossible}`);
  console.log(`  Already done:    ${alreadyDone}`);
  console.log(`  To generate:     ${tasks.length}`);

  if (tasks.length === 0) {
    console.log("\n[info] All content is already generated. Nothing to do.");
    return;
  }

  console.log(`\n[info] Starting content generation...\n`);

  // ── Process tasks in batches ──────────────────────────────────────────────
  let completed = 0;
  let failed = 0;
  const startTime = Date.now();

  await processBatch(tasks, CONCURRENCY, async (task, _index) => {
    const { location, service } = task;
    const label = `${location.town} x ${service.name}`;

    try {
      // Generate content via OpenAI
      const prompt = buildPrompt(location, service);
      const content = await callOpenAI(prompt, openaiApiKey);

      // Insert into Convex
      await client.mutation(api.locationServices.create, {
        county_slug: location.county_slug,
        town_slug: location.town_slug,
        town: location.town,
        county: location.county,
        service_slug: service.slug,
        service_name: service.name,
        market_commentary: content.market_commentary,
        faqs: content.faqs.slice(0, 5), // Ensure max 5 FAQs
        deal_example: content.deal_example,
        rates: content.rates,
        meta_title: content.meta_title,
        meta_description: content.meta_description,
        is_published: true,
        content_generated_at: Date.now(),
      });

      completed++;
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const rate = (completed / parseFloat(elapsed)).toFixed(2);
      console.log(
        `  [${completed + failed}/${tasks.length}] [+] ${label} (${elapsed}s elapsed, ${rate}/s)`
      );
    } catch (err: unknown) {
      failed++;
      const message = err instanceof Error ? err.message : String(err);
      console.error(
        `  [${completed + failed}/${tasks.length}] [!] ${label}: ${message}`
      );
    }
  });

  // ── Summary ───────────────────────────────────────────────────────────────
  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log("\n========================================");
  console.log("  Content generation complete");
  console.log(`  Total time:          ${totalTime}s`);
  console.log(`  Tasks processed:     ${completed + failed}`);
  console.log(`  Successfully saved:  ${completed}`);
  console.log(`  Failed:              ${failed}`);
  console.log(`  Previously done:     ${alreadyDone}`);
  console.log(
    `  Total coverage:      ${alreadyDone + completed}/${totalPossible}`
  );
  console.log("========================================\n");

  if (failed > 0) {
    console.log(
      "[info] Some tasks failed. Re-run the script to retry failed items (resume capability)."
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[fatal]", err);
  process.exit(1);
});
