---
name: xfontat cost optimization
description: Decisions made about reducing Replit hosting/bandwidth costs for the fonts platform
---

- Added `compression` middleware and long-lived Cache-Control headers (`public, max-age=2592000, immutable`) for font files (woff/woff2/ttf/otf) in server/index.ts to cut down "data sent to visitors" bandwidth costs, since font files are large and rarely change.
- **Why:** Font assets are large and rarely change, so caching and compression limit repeat downloads and bandwidth.
- **How to apply:** When adding static asset types or a CDN, keep long caching for stable assets and compress text responses; avoid immutable caching for mutable HTML.
