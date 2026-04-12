/**
 * NeuronWriter SEO Audit Script
 *
 * Creates queries for priority keywords, waits for processing,
 * then pulls recommendations and compares against our live content.
 *
 * Usage: npx tsx scripts/neuronwriter-audit.ts [create|poll|report]
 *   - create: Submit keyword queries to NeuronWriter (uses credits)
 *   - poll: Check status of pending queries
 *   - report: Pull results and generate optimisation report
 */

import fs from "fs";
import path from "path";

const API_BASE = "https://app.neuronwriter.com/neuron-api/0.5/writer";
const API_KEY = "n-ae84f91a6ec8a83b93aea7f4fd2f5320";
const PROJECT_ID = "9c395e2f447cffa3";
const ENGINE = "google.co.uk";
const LANGUAGE = "English";

const STATE_FILE = path.join(__dirname, "../data/neuronwriter-queries.json");

interface KeywordQuery {
  keyword: string;
  category: string;
  targetPage: string;
  volume: number | null;
  queryId?: string;
  status?: string;
}

// Priority keywords mapped to our pages
const KEYWORDS: KeywordQuery[] = [
  // Service pages — highest commercial intent
  { keyword: "property development lenders", category: "service", targetPage: "/", volume: 1000 },
  { keyword: "property development loan", category: "service", targetPage: "/services/development-finance", volume: 1000 },
  { keyword: "property development finance", category: "service", targetPage: "/services/development-finance", volume: 720 },
  { keyword: "bridging finance for property development", category: "service", targetPage: "/services/bridging-loans", volume: 390 },
  { keyword: "property refurbishment finance", category: "service", targetPage: "/services/refurbishment-finance", volume: 140 },
  { keyword: "development finance UK", category: "service", targetPage: "/", volume: 140 },
  { keyword: "commercial property development finance", category: "service", targetPage: "/services/commercial-mortgages", volume: 210 },

  // High-value longtail
  { keyword: "residential development finance", category: "longtail", targetPage: "/services/development-finance", volume: 170 },
  { keyword: "property development funding", category: "longtail", targetPage: "/services/development-finance", volume: 170 },
  { keyword: "construction loan UK", category: "longtail", targetPage: "/services/development-finance", volume: 90 },
  { keyword: "ground up development finance", category: "longtail", targetPage: "/guides/development-finance-ground-up", volume: 50 },
  { keyword: "heavy refurbishment finance", category: "longtail", targetPage: "/services/refurbishment-finance", volume: 50 },
  { keyword: "joint venture finance for property development", category: "longtail", targetPage: "/services/equity-jv", volume: 50 },
  { keyword: "development finance lenders UK", category: "longtail", targetPage: "/", volume: 40 },
  { keyword: "care home development finance", category: "longtail", targetPage: "NEW: segment page", volume: 30 },

  // Informational / guides
  { keyword: "how does development finance work", category: "guide", targetPage: "/guides/how-does-development-finance-work", volume: null },
  { keyword: "what is development finance", category: "guide", targetPage: "/guides/how-does-development-finance-work", volume: null },
  { keyword: "development finance for beginners", category: "guide", targetPage: "/guides/development-finance-first-time-developer", volume: null },
  { keyword: "development finance vs bridging finance", category: "guide", targetPage: "/guides/development-finance-vs-bridging-loans", volume: null },
  { keyword: "development finance application process", category: "guide", targetPage: "/guides/development-finance-application-checklist", volume: null },
  { keyword: "development finance GDV explained", category: "guide", targetPage: "/guides/how-to-calculate-gdv", volume: null },
  { keyword: "development finance costs UK", category: "guide", targetPage: "/guides/true-cost-development-finance", volume: null },
  { keyword: "how to finance a property development", category: "guide", targetPage: "/guides/how-does-development-finance-work", volume: null },

  // Geo / location
  { keyword: "development finance London", category: "geo", targetPage: "/locations/greater-london", volume: null },
  { keyword: "development finance Manchester", category: "geo", targetPage: "/locations/greater-manchester", volume: null },
  { keyword: "development finance Birmingham", category: "geo", targetPage: "/locations/west-midlands", volume: null },
  { keyword: "development finance broker London", category: "geo", targetPage: "/locations/greater-london", volume: null },
  { keyword: "development finance North West", category: "geo", targetPage: "NEW: region page", volume: null },
];

async function apiCall(endpoint: string, body: Record<string, unknown> = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "X-API-KEY": API_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

function loadState(): KeywordQuery[] {
  if (fs.existsSync(STATE_FILE)) {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
  }
  return KEYWORDS;
}

function saveState(queries: KeywordQuery[]) {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(queries, null, 2));
}

// ── CREATE: Submit queries to NeuronWriter ──
async function createQueries() {
  const queries = loadState();
  let created = 0;

  for (const q of queries) {
    if (q.queryId) {
      console.log(`⏭  Skip (already submitted): ${q.keyword}`);
      continue;
    }

    console.log(`🔍 Creating query: "${q.keyword}"`);
    try {
      const result = await apiCall("/new-query", {
        project: PROJECT_ID,
        keyword: q.keyword,
        engine: ENGINE,
        language: LANGUAGE,
        competitors_mode: "top10",
      });

      q.queryId = result.query;
      q.status = "waiting";
      created++;
      console.log(`   ✓ Query ID: ${result.query}`);

      // Save after each to preserve progress
      saveState(queries);

      // Small delay between requests
      await new Promise((r) => setTimeout(r, 1500));
    } catch (err) {
      console.error(`   ✗ Failed: ${err}`);
      // Stop if we hit limits
      break;
    }
  }

  console.log(`\n✅ Created ${created} queries. Run 'poll' in ~60s to check status.`);
  saveState(queries);
}

// ── POLL: Check query statuses ──
async function pollQueries() {
  const queries = loadState();
  let ready = 0;
  let waiting = 0;

  for (const q of queries) {
    if (!q.queryId) continue;
    if (q.status === "ready") {
      ready++;
      continue;
    }

    try {
      const result = await apiCall("/get-query", { query: q.queryId });
      q.status = result.status;

      if (result.status === "ready") {
        ready++;
        console.log(`✅ Ready: "${q.keyword}"`);
      } else {
        waiting++;
        console.log(`⏳ ${result.status}: "${q.keyword}"`);
      }

      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.error(`✗ Error polling "${q.keyword}": ${err}`);
    }
  }

  saveState(queries);
  console.log(`\n📊 ${ready} ready, ${waiting} pending`);
}

// Helper: terms_txt values are newline-separated strings; terms values are arrays of objects
function parseTermsTxt(val: unknown): string[] {
  if (typeof val === "string") return val.split("\n").filter(Boolean);
  if (Array.isArray(val)) return val.map((v: any) => v.t || v.term || String(v));
  return [];
}

function parseTermsArr(val: unknown): { t: string; usage_pc: number; sugg_usage?: number[] }[] {
  if (Array.isArray(val)) return val;
  return [];
}

// ── REPORT: Pull results and generate optimisation recommendations ──
async function generateReport() {
  const queries = loadState();
  const reportDir = path.join(__dirname, "../data/neuronwriter-reports");
  fs.mkdirSync(reportDir, { recursive: true });

  const summaryRows: string[] = [];
  summaryRows.push(
    "| Keyword | Vol | Target Page | Word Target | Top Title Terms | Top H2 Terms | Key Entities |"
  );
  summaryRows.push(
    "|---------|-----|-------------|-------------|-----------------|--------------|--------------|"
  );

  for (const q of queries) {
    if (!q.queryId || q.status !== "ready") continue;

    console.log(`📥 Pulling: "${q.keyword}"`);
    try {
      const result = await apiCall("/get-query", { query: q.queryId });

      // Save raw result
      const safeSlug = q.keyword.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
      fs.writeFileSync(
        path.join(reportDir, `${safeSlug}.json`),
        JSON.stringify(result, null, 2)
      );

      const metrics = result.metrics || {};
      const termsTxt = result.terms_txt || {};
      const terms = result.terms || {};

      // Word count target
      const wordTarget = metrics.word_count?.target || "?";

      // Key terms
      const titleTerms = parseTermsTxt(termsTxt.title).slice(0, 5).join(", ");
      const h2Terms = parseTermsTxt(termsTxt.h2).slice(0, 5).join(", ");
      const entities = parseTermsArr(terms.entities)
        .slice(0, 5)
        .map((e) => e.t)
        .join(", ");

      summaryRows.push(
        `| ${q.keyword} | ${q.volume ?? "—"} | ${q.targetPage} | ${wordTarget} | ${titleTerms || "—"} | ${h2Terms || "—"} | ${entities || "—"} |`
      );

      // Generate per-keyword optimisation file
      const report = generateKeywordReport(q, result);
      fs.writeFileSync(
        path.join(reportDir, `${safeSlug}-recommendations.md`),
        report
      );

      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.error(`✗ Error: ${err}`);
    }
  }

  // Write summary
  const summary = `# NeuronWriter SEO Audit — Construction Capital\n\nGenerated: ${new Date().toISOString().split("T")[0]}\n\n${summaryRows.join("\n")}\n`;
  fs.writeFileSync(path.join(reportDir, "SUMMARY.md"), summary);
  console.log(`\n✅ Reports saved to ${reportDir}/`);
}

function generateKeywordReport(q: KeywordQuery, data: any): string {
  const metrics = data.metrics || {};
  const termsTxt = data.terms_txt || {};
  const terms = data.terms || {};
  const competitors = data.competitors || [];
  const ideas = data.ideas || {};
  const serp = data.serp_summary || {};

  let md = `# Optimisation Report: "${q.keyword}"\n\n`;
  md += `**Target Page:** ${q.targetPage}\n`;
  md += `**Search Volume:** ${q.volume ?? "No data"}\n`;
  md += `**Category:** ${q.category}\n`;
  md += `**Intent:** ${serp.intent || "—"}\n`;
  md += `**NeuronWriter URL:** ${data.query_url || "—"}\n\n`;

  // Word count
  md += `## Content Length\n`;
  md += `- Target: **${metrics.word_count?.target || "?"}** words\n`;
  md += `- Median top 10: **${metrics.word_count?.median || "?"}** words\n`;
  md += `- Readability target: **${metrics.readability?.target || "?"}**\n\n`;

  // Competitors
  md += `## Top Competitors\n`;
  md += `| Rank | URL | Title |\n|------|-----|-------|\n`;
  for (const c of competitors.slice(0, 10)) {
    md += `| ${c.rank || "?"} | ${c.url || "?"} | ${(c.title || "").slice(0, 60)} |\n`;
  }
  md += `\n`;

  // Competitor H2 structure
  md += `## Competitor Heading Structure\n`;
  for (const c of competitors.slice(0, 3)) {
    md += `### ${c.url?.split("/").pop() || c.url}\n`;
    if (c.headers) {
      for (const [tag, text] of c.headers.slice(0, 10)) {
        md += `- **${tag}**: ${text}\n`;
      }
    }
    md += `\n`;
  }

  // Title terms
  md += `## Title Tag Terms\n`;
  md += `| Term | Usage % (top 10) |\n|------|------------------|\n`;
  for (const t of parseTermsArr(terms.title).slice(0, 10)) {
    md += `| ${t.t} | ${t.usage_pc}% |\n`;
  }
  md += `\n`;

  // H1 terms
  md += `## H1 Terms\n`;
  md += `| Term | Usage % |\n|------|---------|\n`;
  for (const t of parseTermsArr(terms.h1).slice(0, 8)) {
    md += `| ${t.t} | ${t.usage_pc}% |\n`;
  }
  md += `\n`;

  // H2 terms
  md += `## H2 Terms\n`;
  md += `| Term | Usage % |\n|------|---------|\n`;
  for (const t of parseTermsArr(terms.h2).slice(0, 15)) {
    md += `| ${t.t} | ${t.usage_pc}% |\n`;
  }
  md += `\n`;

  // Content terms with frequency ranges
  md += `## Content Terms (body copy)\n`;
  md += `| Term | Usage % | Suggested Count |\n|------|---------|----------------|\n`;
  for (const t of parseTermsArr(terms.content_basic).slice(0, 30)) {
    const range = t.sugg_usage ? `${t.sugg_usage[0]}-${t.sugg_usage[1]}` : "—";
    md += `| ${t.t} | ${t.usage_pc}% | ${range} |\n`;
  }
  md += `\n`;

  // Extended content terms
  const extended = parseTermsArr(terms.content_extended).slice(0, 20);
  if (extended.length > 0) {
    md += `## Extended Content Terms\n`;
    md += `| Term | Usage % | Suggested Count |\n|------|---------|----------------|\n`;
    for (const t of extended) {
      const range = t.sugg_usage ? `${t.sugg_usage[0]}-${t.sugg_usage[1]}` : "—";
      md += `| ${t.t} | ${t.usage_pc}% | ${range} |\n`;
    }
    md += `\n`;
  }

  // Entities
  const entities = parseTermsArr(terms.entities);
  if (entities.length > 0) {
    md += `## Entities\n`;
    md += `| Entity | Importance | Relevance | Wikipedia |\n|--------|------------|-----------|----------|\n`;
    for (const e of entities.slice(0, 20)) {
      const wiki = (e as any).links?.find((l: any) => l[0] === "wikipedia")?.[1] || "—";
      md += `| ${e.t} | ${(e as any).importance?.toFixed(1) || "—"} | ${((e as any).relevance * 100)?.toFixed(0) || "—"}% | ${wiki} |\n`;
    }
    md += `\n`;
  }

  // Questions / PAA
  md += `## People Also Ask\n`;
  for (const item of (ideas.people_also_ask || []).slice(0, 10)) {
    md += `- ${item.q || item}\n`;
  }
  md += `\n`;

  md += `## Suggested Questions\n`;
  for (const item of (ideas.suggest_questions || []).slice(0, 10)) {
    md += `- ${item.q || item}\n`;
  }
  md += `\n`;

  md += `## Content Questions\n`;
  for (const item of (ideas.content_questions || []).slice(0, 10)) {
    md += `- ${item.q || item}\n`;
  }
  md += `\n`;

  return md;
}

// ── MAIN ──
const command = process.argv[2] || "create";

switch (command) {
  case "create":
    createQueries().catch(console.error);
    break;
  case "poll":
    pollQueries().catch(console.error);
    break;
  case "report":
    generateReport().catch(console.error);
    break;
  default:
    console.log("Usage: npx tsx scripts/neuronwriter-audit.ts [create|poll|report]");
}
