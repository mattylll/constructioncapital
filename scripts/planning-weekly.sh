#!/usr/bin/env bash
# Weekly planning-portal refresh.
# Scrapes every enabled Idox + Civica + FastWeb + AgileApplications + Arcus
# authority over a rolling 3-month window, then commits and pushes any changed
# data/generated/planning/**/latest.json files so Vercel picks up the update.
#
# Invoked by launchd (~/Library/LaunchAgents/com.constructioncapital.planning-weekly.plist)
# or manually: ./scripts/planning-weekly.sh

set -uo pipefail

PROJECT_DIR="/Users/mattlenzie/Claude Code Projects/Construction Capital V2"
MONTHS="${PLANNING_MONTHS:-3}"
OUTREACH_DAYS="${PLANNING_OUTREACH_DAYS:-8}"
MIN_GDV="${PLANNING_MIN_GDV:-500000}"
MIN_UNITS="${PLANNING_MIN_UNITS:-2}"
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
  FASTWEB_STATUS=0
  AGILE_STATUS=0
  ARCUS_STATUS=0
  PROSPECT_STATUS=0
  WEEKLY_OUTREACH_STATUS=0
  GROWTH_PACK_STATUS=0

  echo "--- Idox (public-access portals) ---"
  npx tsx scripts/fetch-planning-idox.ts --all --months "$MONTHS" || IDOX_STATUS=$?
  echo "Idox exit: $IDOX_STATUS"
  echo

  echo "--- Civica (Portal360 API) ---"
  npx tsx scripts/fetch-planning-batch.ts --all --months "$MONTHS" || CIVICA_STATUS=$?
  echo "Civica exit: $CIVICA_STATUS"
  echo

  echo "--- FastWeb (classic ASP portals) ---"
  npx tsx scripts/fetch-planning-fastweb.ts --all --months "$MONTHS" || FASTWEB_STATUS=$?
  echo "FastWeb exit: $FASTWEB_STATUS"
  echo

  echo "--- AgileApplications (CitizenPortal JSON API) ---"
  npx tsx scripts/fetch-planning-agile.ts --all --months "$MONTHS" || AGILE_STATUS=$?
  echo "Agile exit: $AGILE_STATUS"
  echo

  echo "--- Arcus Built Environment (Salesforce Aura JSON-RPC) ---"
  npx tsx scripts/fetch-planning-arcus.ts --all --months "$MONTHS" || ARCUS_STATUS=$?
  echo "Arcus exit: $ARCUS_STATUS"
  echo

  echo "--- Developer prospect extraction ---"
  npx tsx scripts/extract-developer-leads.ts --min-gdv "$MIN_GDV" --min-units "$MIN_UNITS" || PROSPECT_STATUS=$?
  echo "Prospect extraction exit: $PROSPECT_STATUS"
  echo

  if [ "${PLANNING_ENRICH:-0}" = "1" ]; then
    echo "--- Optional Companies House enrichment ---"
    if [ -n "${COMPANIES_HOUSE_API_KEY:-}" ]; then
      npx tsx scripts/enrich-companies-house.ts --skip-enriched || true
    else
      echo "Skipped: COMPANIES_HOUSE_API_KEY not set"
    fi
    echo

    echo "--- Optional Apollo contact enrichment ---"
    if [ -n "${APOLLO_API_KEY:-}" ]; then
      npx tsx scripts/enrich-apollo-contacts.ts --skip-enriched || true
    else
      echo "Skipped: APOLLO_API_KEY not set"
    fi
    echo
  fi

  echo "--- Weekly approved-applications outreach pack ---"
  npx tsx scripts/generate-weekly-planning-outreach.ts --days "$OUTREACH_DAYS" --min-gdv "$MIN_GDV" --min-units "$MIN_UNITS" || WEEKLY_OUTREACH_STATUS=$?
  echo "Weekly outreach exit: $WEEKLY_OUTREACH_STATUS"
  echo

  echo "--- Growth operating pack ---"
  npx tsx scripts/generate-growth-operating-system.ts || GROWTH_PACK_STATUS=$?
  echo "Growth pack exit: $GROWTH_PACK_STATUS"
  echo

  echo "--- Commit & push ---"
  git add data/generated/planning/ data/generated/developer-prospects/prospects.json data/generated/weekly-planning-outreach/ data/generated/growth-plan/ data/sqlite/news.db 2>/dev/null || true
  if git diff --cached --quiet; then
    echo "No data changes — nothing to commit."
  else
    CHANGED=$(git diff --cached --name-only | wc -l | tr -d ' ')
    git commit -m "chore(planning): weekly refresh $(date +%Y-%m-%d) — ${CHANGED} town files updated"
    git push origin "$BRANCH"
    echo "Pushed ${CHANGED} updated town files to origin/${BRANCH}."
  fi

  echo
  echo "=== Finished $(date) (idox=${IDOX_STATUS}, civica=${CIVICA_STATUS}, fastweb=${FASTWEB_STATUS}, agile=${AGILE_STATUS}, arcus=${ARCUS_STATUS}, prospects=${PROSPECT_STATUS}, weekly_outreach=${WEEKLY_OUTREACH_STATUS}, growth_pack=${GROWTH_PACK_STATUS}) ==="
} >>"$LOG" 2>&1

# Prune logs older than 60 days.
find logs -name 'planning-weekly-*.log' -type f -mtime +60 -delete 2>/dev/null || true
