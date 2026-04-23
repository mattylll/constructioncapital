/**
 * Pipeline Orchestrator CLI
 *
 * Unified entry point for running pipeline stages in sequence.
 * All pipelines run the same scripts you'd run manually — this just
 * chains them and logs the results.
 *
 * Usage:
 *   npx tsx scripts/orchestrate.ts --pipeline planning --county hertfordshire
 *   npx tsx scripts/orchestrate.ts --pipeline outreach --limit 50
 *   npx tsx scripts/orchestrate.ts --pipeline content --county hertfordshire
 *   npx tsx scripts/orchestrate.ts --pipeline press --county hertfordshire
 *   npx tsx scripts/orchestrate.ts --pipeline social --county hertfordshire
 *   npx tsx scripts/orchestrate.ts --pipeline microsites --site manchester
 *   npx tsx scripts/orchestrate.ts --pipeline all --county hertfordshire
 *   npx tsx scripts/orchestrate.ts --list
 */

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

// ── Config ──────────────────────────────────────────────────────────────────

const LOG_DIR = path.join(process.cwd(), "data", "generated", "pipeline-logs");

// ── Types ───────────────────────────────────────────────────────────────────

interface PipelineStep {
  name: string;
  command: string;
  description: string;
  optional?: boolean;
}

interface PipelineLog {
  pipeline: string;
  startedAt: string;
  completedAt: string;
  steps: {
    name: string;
    command: string;
    status: "success" | "failed" | "skipped";
    duration: number;
    output: string;
    error?: string;
  }[];
  totalDuration: number;
}

// ── Pipeline Definitions ────────────────────────────────────────────────────

function getPipelines(opts: {
  county?: string;
  limit?: string;
  site?: string;
  campaign?: string;
}): Record<string, PipelineStep[]> {
  const countyArg = opts.county ? `--county ${opts.county}` : "--all";
  const limitArg = opts.limit ? `--limit ${opts.limit}` : "";
  const siteArg = opts.site ? `--site ${opts.site}` : "--all";

  return {
    planning: [
      {
        name: "fetch-planning-data",
        command: `npx tsx scripts/fetch-planning-data.ts ${countyArg}`,
        description: "Fetch planning applications from Portal360 API",
      },
      {
        name: "process-planning-data",
        command: `npx tsx scripts/process-planning-data.ts ${countyArg}`,
        description: "Process and classify planning applications",
      },
      {
        name: "extract-developer-leads",
        command: `npx tsx scripts/extract-developer-leads.ts`,
        description: "Extract developer prospects from planning data",
      },
    ],

    outreach: [
      {
        name: "enrich-companies-house",
        command: `npx tsx scripts/enrich-companies-house.ts --skip-enriched ${limitArg}`,
        description: "Enrich prospects with Companies House data",
      },
      {
        name: "enrich-apollo-contacts",
        command: `npx tsx scripts/enrich-apollo-contacts.ts --skip-enriched ${limitArg}`,
        description: "Find contact details via Apollo.io",
      },
      {
        name: "generate-indicative-terms",
        command: `npx tsx scripts/generate-indicative-terms.ts`,
        description: "Calculate indicative finance terms per prospect",
      },
      {
        name: "push-to-instantly",
        command: opts.campaign
          ? `npx tsx scripts/push-to-instantly.ts --campaign ${opts.campaign} ${limitArg}`
          : `echo "Skipped: no --campaign specified"`,
        description: "Push leads to Instantly.ai campaign",
        optional: !opts.campaign,
      },
    ],

    content: [
      {
        name: "generate-market-roundups",
        command: `npx tsx scripts/generate-market-roundups.ts ${countyArg}`,
        description: "Generate market roundup articles",
      },
      {
        name: "generate-planning-articles",
        command: `npx tsx scripts/generate-planning-articles.ts ${countyArg}`,
        description: "Generate planning round-up articles",
      },
    ],

    press: [
      {
        name: "generate-press-packages",
        command: `npx tsx scripts/generate-press-packages.ts ${countyArg}`,
        description: "Generate press release packages",
      },
      {
        name: "push-press-outreach",
        command: opts.campaign
          ? `npx tsx scripts/push-press-outreach.ts --campaign ${opts.campaign} ${countyArg}`
          : `echo "Skipped: no --campaign specified"`,
        description: "Push press packages to journalists via Instantly",
        optional: !opts.campaign,
      },
    ],

    social: [
      {
        name: "generate-social-content",
        command: `npx tsx scripts/generate-social-content.ts ${countyArg}`,
        description: "Generate social media posts from content",
      },
      {
        name: "publish-social",
        command: `npx tsx scripts/publish-social.ts --all-platforms ${countyArg}`,
        description: "Publish to LinkedIn, X/Twitter, Facebook",
        optional: true,
      },
    ],

    microsites: [
      {
        name: "generate-listicles",
        command: `npx tsx scripts/generate-microsite-listicles.ts ${siteArg} --count 3`,
        description: "Generate listicle blog content for microsites",
      },
      {
        name: "push-microsite-content",
        command: `npx tsx scripts/push-microsite-content.ts ${siteArg}`,
        description: "Push content to microsite repos",
      },
      {
        name: "update-microsite-footers",
        command: `npx tsx scripts/update-microsite-footers.ts ${siteArg}`,
        description: "Update microsite footer links to CC",
      },
      {
        name: "audit-microsites",
        command: `npx tsx scripts/audit-microsites.ts --skip-http`,
        description: "Audit microsite status",
        optional: true,
      },
    ],

    "land-registry": [
      {
        name: "batch-land-registry",
        command: `npx tsx scripts/batch-land-registry.ts`,
        description: "Batch process Land Registry data for all towns",
      },
    ],

    "lender-intel": [
      {
        name: "fetch-charges-data",
        command: `npx tsx scripts/fetch-charges-data.ts --skip-fetched ${limitArg}`,
        description: "Fetch Companies House charges (lender activity)",
      },
    ],

    listings: [
      {
        name: "fetch-listing-data",
        command: `npx tsx scripts/fetch-listing-data.ts ${countyArg} --skip-fetched`,
        description: "Fetch PropertyData.co.uk listing stats",
      },
    ],

    video: [
      {
        name: "generate-scripts",
        command: `cd remotion && npx tsx scripts/generate-scripts.ts ${opts.county ? `--county=${opts.county}` : "--all"}`,
        description: "Generate video scripts from market data",
      },
      {
        name: "generate-voiceovers",
        command: `cd remotion && node scripts/generate-voiceovers.mjs ${opts.county ? `--county=${opts.county}` : "--all"}`,
        description: "Generate TTS voiceovers via Fish.Audio",
      },
      {
        name: "generate-registry",
        command: `cd remotion && node scripts/generate-indexes.mjs`,
        description: "Rebuild composition registry",
      },
      {
        name: "render-batch",
        command: `cd remotion && node scripts/render-batch.mjs ${opts.county ? `--county=${opts.county}` : "--all"}`,
        description: "Render location videos to MP4",
      },
      {
        name: "upload-youtube",
        command: `cd remotion && node scripts/upload-youtube.mjs ${opts.county ? `--county=${opts.county}` : "--all"}`,
        description: "Upload rendered videos to YouTube",
        optional: true,
      },
    ],

    "quality-review": [
      {
        name: "review-content-quality",
        command: `npx tsx scripts/review-content-quality.ts ${countyArg}`,
        description: "Review content with Gemini for quality/compliance",
      },
    ],
  };
}

// ── Runner ──────────────────────────────────────────────────────────────────

function runStep(step: PipelineStep): { status: "success" | "failed" | "skipped"; output: string; error?: string; duration: number } {
  const start = Date.now();

  try {
    console.log(`  [RUN] ${step.name}`);
    console.log(`        ${step.description}`);
    console.log(`        $ ${step.command}`);

    const output = execSync(step.command, {
      encoding: "utf-8",
      cwd: process.cwd(),
      timeout: 600_000, // 10 minutes per step
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env },
    });

    const duration = Date.now() - start;
    // Print last few lines of output
    const lines = output.trim().split("\n");
    const tail = lines.slice(-5).join("\n");
    console.log(`        ${tail.replace(/\n/g, "\n        ")}`);
    console.log(`  [OK] ${step.name} (${(duration / 1000).toFixed(1)}s)\n`);

    return { status: "success", output: output.slice(-2000), duration };
  } catch (e: any) {
    const duration = Date.now() - start;
    const error = e.stderr?.slice(-500) || e.message?.slice(0, 500) || "Unknown error";
    const output = e.stdout?.slice(-1000) || "";
    console.log(`  [FAIL] ${step.name} (${(duration / 1000).toFixed(1)}s)`);
    console.log(`         ${error.split("\n")[0]}`);
    console.log();

    return { status: "failed", output, error, duration };
  }
}

// ── CLI ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const pipelineFlag = args.indexOf("--pipeline");
const pipelineName = pipelineFlag !== -1 ? args[pipelineFlag + 1] : undefined;
const countyFlag = args.indexOf("--county");
const county = countyFlag !== -1 ? args[countyFlag + 1] : undefined;
const limitFlag = args.indexOf("--limit");
const limit = limitFlag !== -1 ? args[limitFlag + 1] : undefined;
const siteFlag = args.indexOf("--site");
const site = siteFlag !== -1 ? args[siteFlag + 1] : undefined;
const campaignFlag = args.indexOf("--campaign");
const campaign = campaignFlag !== -1 ? args[campaignFlag + 1] : undefined;
const isList = args.includes("--list");

const opts = { county, limit, site, campaign };
const pipelines = getPipelines(opts);

if (isList || !pipelineName) {
  console.log("Pipeline Orchestrator\n");
  console.log("Usage: npx tsx scripts/orchestrate.ts --pipeline <name> [options]\n");
  console.log("Options:");
  console.log("  --county <slug>      County to process (or omit for --all)");
  console.log("  --limit <n>          Limit API calls");
  console.log("  --site <slug>        Microsite to process");
  console.log("  --campaign <id>      Instantly.ai campaign ID");
  console.log();
  console.log("Available pipelines:\n");

  for (const [name, steps] of Object.entries(pipelines)) {
    console.log(`  ${name.padEnd(16)} ${steps.length} steps`);
    for (const step of steps) {
      const opt = step.optional ? " (optional)" : "";
      console.log(`    → ${step.name}${opt}`);
    }
    console.log();
  }

  console.log(`  ${"all".padEnd(16)} Runs: planning → outreach → content → press → social`);
  process.exit(0);
}

// ── Main ────────────────────────────────────────────────────────────────────

function main() {
  if (!pipelineName) {
    console.error("Pipeline name is required.");
    process.exit(1);
  }
  const name = pipelineName;
  let stepsToRun: PipelineStep[];

  if (name === "all") {
    stepsToRun = [
      ...pipelines.planning,
      ...pipelines.outreach,
      ...pipelines.content,
      ...pipelines.press,
      ...pipelines.social,
    ];
  } else if (pipelines[name]) {
    stepsToRun = pipelines[name];
  } else {
    console.error(`Unknown pipeline: ${name}`);
    console.error(`Available: ${Object.keys(pipelines).join(", ")}, all`);
    process.exit(1);
  }

  console.log(`\n=== Pipeline: ${name} ===`);
  console.log(`Steps: ${stepsToRun.length}`);
  if (county) console.log(`County: ${county}`);
  if (limit) console.log(`Limit: ${limit}`);
  if (site) console.log(`Site: ${site}`);
  if (campaign) console.log(`Campaign: ${campaign}`);
  console.log();

  const pipelineStart = Date.now();
  const logSteps: PipelineLog["steps"] = [];
  let failures = 0;

  for (const step of stepsToRun) {
    const result = runStep(step);
    logSteps.push({
      name: step.name,
      command: step.command,
      ...result,
    });
    if (result.status === "failed") {
      failures++;
      if (!step.optional) {
        console.log(`  [ABORT] Required step failed — stopping pipeline.\n`);
        break;
      }
      console.log(`  [CONTINUE] Optional step failed — continuing.\n`);
    }
  }

  const totalDuration = Date.now() - pipelineStart;

  // Save log
  const log: PipelineLog = {
    pipeline: name,
    startedAt: new Date(pipelineStart).toISOString(),
    completedAt: new Date().toISOString(),
    steps: logSteps,
    totalDuration,
  };

  fs.mkdirSync(LOG_DIR, { recursive: true });
  const logPath = path.join(LOG_DIR, `${new Date().toISOString().split("T")[0]}-${name}.json`);
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2), "utf-8");

  // Summary
  const succeeded = logSteps.filter((s) => s.status === "success").length;
  const failed = logSteps.filter((s) => s.status === "failed").length;

  console.log(`=== Pipeline Complete ===`);
  console.log(`Duration: ${(totalDuration / 1000).toFixed(1)}s`);
  console.log(`Steps: ${succeeded} succeeded, ${failed} failed, ${logSteps.length} total`);
  console.log(`Log: ${logPath}`);

  if (failures > 0) process.exit(1);
}

main();
