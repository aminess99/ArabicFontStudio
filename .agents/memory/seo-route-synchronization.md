---
name: SEO route synchronization
description: The project uses both crawler HTML and a React SPA, so public route changes must stay synchronized across several surfaces.
---

For public routes, the Express response—not React effects—is the source of truth for crawler-visible metadata, language, fallback content, canonical URL, and HTTP status. React can replace that fallback after loading.

**Why:** Crawlers that do not execute JavaScript need the correct page content on the initial response, while visitors should keep using the existing SPA.

**How to apply:** Resolve route data in the server HTML handler and use the same indexability rules for the dynamic sitemap. Keep the React route aligned and verify raw HTTP status, title, canonical, H1, language, and internal links without JavaScript.