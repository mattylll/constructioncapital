#!/usr/bin/env bash
# Weekly planning-portal refresh.
# Scrapes every enabled Idox + Civica authority over a rolling 3-month window,
# then commits and pushes any changed data/generated/planning/**/latest.json
# files so Vercel picks up the update.
#
# Invoked by launchd (~/Library/LaunchAgents/com.constructioncapital.planning-weekly.plist)
# or manually: ./scripts/planning-weekly.sh

set -uo pipefail

PROJECT_DIR="/Users/mattlenzie/Claude Code Projects/Construction Capital V2"
MONTHS="${PLANNING_MONTHS:-3}"
BRANCH="main"

cd "$PROJECT_DIR"

# Load nvm so `npx` resolves under launchd (which starts with a minimal PATH).
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

mkdir -p logs
TIMESTAMP="$(date +%Y-%m-%d_%H%M%S)"
LOG="logs/planning-weekly-${TIMESTAMP}.log"

{
  echo "=== Planning weekly refresh started $(date) ==="
  echo "Project: $PROJECT_DIR"
  echo "Window:  last $MONTHS months"
  echo "Node:    $(node --version 2>&1 || echo 'node not found')"
  echo

  IDOX_STATUS=0
  CIVICA_STATUS=0

  echo "--- Idox (public-access portals) ---"
  npx tsx scripts/fetch-planning-idox.ts --all --months "$MONTHS" || IDOX_STATUS=$?
  echo "Idox exit: $IDOX_STATUS"
  echo

  echo "--- Civica (Portal360 API) ---"
  npx tsx scripts/fetch-planning-batch.ts --all --months "$MONTHS" || CIVICA_STATUS=$?
  echo "Civica exit: $CIVICA_STATUS"
  echo

  echo "--- Commit & push ---"
  git add data/generated/planning/
  if git diff --cached --quiet; then
    echo "No data changes — nothing to commit."
  else
    CHANGED=$(git diff --cached --name-only | wc -l | tr -d ' ')
    git commit -m "chore(planning): weekly refresh $(date +%Y-%m-%d) — ${CHANGED} town files updated"
    git push origin "$BRANCH"
    echo "Pushed ${CHANGED} updated town files to origin/${BRANCH}."
  fi

  echo
  echo "=== Finished $(date) (idox=${IDOX_STATUS}, civica=${CIVICA_STATUS}) ==="
} >>"$LOG" 2>&1

# Prune logs older than 60 days.
find logs -name 'planning-weekly-*.log' -type f -mtime +60 -delete 2>/dev/null || true
