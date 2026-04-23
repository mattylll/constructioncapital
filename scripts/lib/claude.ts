/**
 * Claude helper — invokes the local Claude Code CLI in headless `--print` mode
 * so all calls go through the user's subscription (no metered API spend).
 *
 * Why a CLI shell-out instead of @anthropic-ai/sdk?
 *   The Anthropic REST SDK requires ANTHROPIC_API_KEY (metered). The local
 *   `claude` CLI uses the subscription auth (zero marginal cost). For
 *   batch content generation this is the right tradeoff — slower per call
 *   but free, and the user has explicitly chosen the subscription path.
 *
 * Usage:
 *   import { runClaude } from "./lib/claude";
 *   const text = await runClaude({
 *     prompt: "Draft this guide ...",
 *     systemPrompt: "You write UK property finance guides.",
 *     model: "opus",
 *   });
 */

import { spawn } from "child_process";
import { existsSync } from "fs";

const CLAUDE_BIN = process.env.CLAUDE_BIN || "/Users/mattlenzie/.local/bin/claude";

export interface ClaudeOptions {
  prompt: string;
  systemPrompt?: string;
  model?: "opus" | "sonnet" | "haiku" | string;
  /** Limit cost (only applies if user is on metered API auth) */
  maxBudgetUsd?: number;
  /** Working directory — defaults to repo root */
  cwd?: string;
  /** Timeout in ms; default 180s (a long draft can easily take 60-120s) */
  timeoutMs?: number;
  /** Optional structured-output schema; CLI enforces JSON conformance */
  jsonSchema?: object;
}

export class ClaudeError extends Error {
  constructor(message: string, public stderr?: string, public code?: number) {
    super(message);
    this.name = "ClaudeError";
  }
}

export async function runClaude(opts: ClaudeOptions): Promise<string> {
  if (!existsSync(CLAUDE_BIN)) {
    throw new ClaudeError(`Claude CLI not found at ${CLAUDE_BIN}. Set CLAUDE_BIN env var.`);
  }

  // Note: do NOT pass --bare. It forces ANTHROPIC_API_KEY-only auth and
  // blocks subscription/OAuth, which is the auth path we rely on.
  const args = [
    "--print",
    "--model",
    opts.model ?? "opus",
    "--output-format",
    "text",
    "--no-session-persistence",
    "--disable-slash-commands",
  ];

  if (opts.systemPrompt) {
    args.push("--append-system-prompt", opts.systemPrompt);
  }
  if (opts.jsonSchema) {
    args.push("--json-schema", JSON.stringify(opts.jsonSchema));
  }
  if (opts.maxBudgetUsd != null) {
    args.push("--max-budget-usd", String(opts.maxBudgetUsd));
  }

  // Prompt is a positional argument
  args.push(opts.prompt);

  return new Promise((resolve, reject) => {
    const proc = spawn(CLAUDE_BIN, args, {
      cwd: opts.cwd ?? process.cwd(),
      env: { ...process.env },
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    const timeoutMs = opts.timeoutMs ?? 180_000;
    const timer = setTimeout(() => {
      proc.kill("SIGKILL");
      reject(new ClaudeError(`Claude CLI timeout after ${timeoutMs}ms`, stderr));
    }, timeoutMs);

    proc.stdout.on("data", (chunk) => (stdout += chunk.toString()));
    proc.stderr.on("data", (chunk) => (stderr += chunk.toString()));

    proc.on("error", (err) => {
      clearTimeout(timer);
      reject(new ClaudeError(`Claude CLI spawn failed: ${err.message}`, stderr));
    });

    proc.on("close", (code) => {
      clearTimeout(timer);
      if (code !== 0) {
        reject(new ClaudeError(`Claude CLI exited ${code}`, stderr, code ?? undefined));
        return;
      }
      resolve(stdout.trim());
    });
  });
}

/**
 * Convenience: prompt Claude for a TypeScript file body and strip any
 * surrounding markdown fences. Useful for guide-draft generation where the
 * model wraps output in ```ts ... ```.
 */
export async function runClaudeForCode(opts: ClaudeOptions): Promise<string> {
  const raw = await runClaude(opts);
  return stripCodeFence(raw);
}

export function stripCodeFence(text: string): string {
  // Strip leading/trailing ```lang ... ```  blocks, plus surrounding whitespace
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```[a-zA-Z0-9_-]*\n([\s\S]*?)\n```$/);
  if (fenceMatch) return fenceMatch[1].trim();
  return trimmed;
}
