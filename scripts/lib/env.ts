import * as fs from "fs";
import * as path from "path";

/**
 * Load `.env.local` (or another dotenv-style file) into process.env without
 * overriding variables that are already set. tsx does not auto-load env files,
 * and launchd starts with an empty environment, so every script that talks to
 * an external API calls this first.
 */
export function loadEnvLocal(file = ".env.local"): void {
  const p = path.isAbsolute(file) ? file : path.join(process.cwd(), file);
  if (!fs.existsSync(p)) return;

  for (const rawLine of fs.readFileSync(p, "utf-8").split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const m = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[m[1]] === undefined) process.env[m[1]] = value;
  }
}
