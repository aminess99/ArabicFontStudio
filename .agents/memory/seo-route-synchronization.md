---
name: SEO route synchronization
description: The project uses both crawler HTML and a React SPA, so public route changes must stay synchronized across several surfaces.
---

Every public route must be kept consistent across the sitemap, crawler-facing HTML, the SPA fallback head, the client router, and HTTP status handling.

**Why:** A route can appear valid in React while returning generic metadata to ordinary HTML requests, or appear in the sitemap while returning a crawler-only 404. Static fallback markup can also retain stale titles or headings after SPA and crawler metadata are updated.

**How to apply:** When changing a public page, synchronize its static HTML shell (`client/index.html`), crawler HTML, SPA metadata, client UI, sitemap, and HTTP status behavior. Check the raw HTML for both ordinary and crawler requests.