---
name: xfontat cost optimization
description: Decisions made about reducing Replit hosting/bandwidth costs for the fonts platform
---

- The Postgres DB (DATABASE_URL) is not used at runtime (app uses in-memory MemStorage); it only exists to satisfy drizzle.config.ts during deploy validation. Deleting it previously caused deploys to get stuck — keep it even though it adds small compute cost.
- Added `compression` middleware and long-lived Cache-Control headers (`public, max-age=2592000, immutable`) for font files (woff/woff2/ttf/otf) in server/index.ts to cut down "data sent to visitors" bandwidth costs, since font files are large and rarely change.
- **Why:** Bandwidth (data sent to visitors) and DB compute were the two biggest recurring cost line items; caching reduces repeat-visitor bandwidth without any functional risk.
- **How to apply:** When adding new static asset types or a CDN, keep the same long-cache approach; don't remove the DB without first confirming deploy no longer requires DATABASE_URL validation.
