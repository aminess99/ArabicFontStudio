#!/usr/bin/env bash
# Render build entrypoint. Replit's package firewall rewrites resolved URLs in
# package-lock.json to hosts that only exist inside Replit; point them back at
# the public registry before installing.
set -euo pipefail
sed -i -E 's#https?://package-firewall\.replit\.[a-z]+/npm/#https://registry.npmjs.org/#g' package-lock.json
npm ci --include=dev
npm run build
