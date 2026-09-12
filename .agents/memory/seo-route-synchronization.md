---
name: SEO route synchronization
description: The project uses both crawler HTML and a React SPA, so public route changes must stay synchronized across several surfaces.
---

Every public route must be kept consistent across the sitemap, crawler-facing HTML, the SPA fallback head, the client router, and HTTP status handling.

**Why:** A route can appear valid in React while returning generic metadata to ordinary HTML requests, or appear in the sitemap while returning a crawler-only 404. These inconsistencies reduce discoverability and create soft 404s.

**How to apply:** When adding or removing a public page, update the route allowlist, crawler HTML, SPA metadata map, client route, sitemap, and both valid/invalid URL checks together.