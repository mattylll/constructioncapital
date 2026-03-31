#!/bin/bash
# Setup script for analytics database
# Usage: ./scripts/setup-analytics.sh <base-url> <analytics-secret>
#
# Example:
#   ./scripts/setup-analytics.sh https://constructioncapital.co.uk your-secret-token
#
# This will:
# 1. Initialize the database schema
# 2. Add Construction Capital as the first tracked site

BASE_URL="${1:-http://localhost:3000}"
TOKEN="${2:-$ANALYTICS_SECRET}"

if [ -z "$TOKEN" ]; then
  echo "Error: Please provide the analytics secret token"
  echo "Usage: ./scripts/setup-analytics.sh <base-url> <token>"
  exit 1
fi

echo "Initializing analytics schema..."
curl -s -X POST "$BASE_URL/api/analytics/setup" \
  -H "Content-Type: application/json" \
  -H "x-analytics-token: $TOKEN" \
  -d '{"site_id":"cc","name":"Construction Capital","domain":"constructioncapital.co.uk"}' | python3 -m json.tool

echo ""
echo "Done! Your tracking script tag:"
echo ""
echo "  <script defer src=\"$BASE_URL/t.js\" data-site=\"cc\"></script>"
echo ""
echo "Dashboard: $BASE_URL/admin/analytics"
echo "Token: $TOKEN"
