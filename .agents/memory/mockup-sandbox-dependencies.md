---
name: Mockup sandbox dependencies
description: Environment-specific dependency behavior for isolated visual mockup artifacts
---

Isolated mockup artifacts can be created without a local dependency tree even though their workflow starts successfully. When the artifact and main app declare different Vite/Tailwind generations, the preview can resolve the wrong root PostCSS configuration or fail to find Vite entirely.

**Why:** Visual verification depends on the artifact preview server, and a running workflow alone does not prove the iframe can compile its CSS.

**How to apply:** Before presenting a new mockup, confirm the artifact workflow logs are clean and capture the preview. If dependency resolution is missing, keep the fix isolated to the mockup artifact rather than changing the main app's toolchain.