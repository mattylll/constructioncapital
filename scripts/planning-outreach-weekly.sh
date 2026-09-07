#!/usr/bin/env bash
# Weekly planning-approval outreach.
# Runs the morning after the Sunday planning refresh (planning-weekly.sh):
# selects newly approved finance-size schemes, resolves owners and contacts,
# pushes leads to the Instantly campaign, syncs interested replies to GHL,
# then commits the run report and state so nothing is contacted twice.
#
# Invoked by launchd (~/Library/LaunchAgents/com.constructioncapital.planning-outreach-weekly.plist)
# or manually: ./scripts/planning-outreach-weekly.sh [extra args passed to the pipeline]

set -uo pipefail

PROJECT_DIR="/Users/mattlenzie/Claude Code Projects/Construction Capital V2"
BRANCH="main"
LIMIT="${OUTREACH_LIMIT:-60}"
MAX_AGE_DAYS="${OUTREACH_MAX_AGE_DAYS:-45}"

cd "$PROJECT_DIR"

# Load nvm so `npx` resolves under launchd (which starts with a minimal PATH).
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# API keys live in .env.local (git-ignored). The scripts also load it themselves,
# but exporting here keeps behaviour identical for any child process.
if [ -f .env.local ]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

mkdir -p logs
TIMESTAMP="$(date +%Y-%m-%d_%H%M%S)"
LOG="logs/planning-outreach-${TIMESTAMP}.log"

{
  echo "=== Planning outreach started $(date) ==="
  echo "Node: $(node --version 2>&1 || echo 'node not found')"
  echo

  PIPELINE_STATUS=0
  SYNC_STATUS=0

  echo "--- Outreach pipeline ---"
  npx tsx scripts/planning-outreach-weekly.ts --limit "$LIMIT" --max-age-days "$MAX_AGE_DAYS" "$@" || PIPELINE_STATUS=$?
  echo "Pipeline exit: $PIPELINE_STATUS"
  echo

  echo "--- Sync interested replies to GHL ---"
  if [ -n "${GHL_API_KEY:-}" ]; then
    npx tsx scripts/sync-instantly-responses.ts || SYNC_STATUS=$?
  else
    echo "Skipped: GHL_API_KEY not set"
  fi
  echo "Sync exit: $SYNC_STATUS"
  echo

  echo "--- Commit & push ---"
  git add data/generated/planning-outreach/ data/generated/developer-prospects/outreach-log.json data/generated/developer-prospects/ghl-sync-log.json 2>/dev/null || true
  if git diff --cached --quiet; then
    echo "No outreach changes to commit."
  else
    git commit -m "chore(outreach): weekly planning outreach $(date +%Y-%m-%d)" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
    git push origin "$BRANCH" || echo "git push failed (will retry next week)"
  fi

  echo
  echo "=== Finished $(date) (pipeline=${PIPELINE_STATUS}, sync=${SYNC_STATUS}) ==="
} >>"$LOG" 2>&1

find logs -name 'planning-outreach-*.log' -type f -mtime +60 -delete 2>/dev/null || true
