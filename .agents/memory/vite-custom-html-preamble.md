---
name: Vite React preamble for custom HTML
description: Ensure React Fast Refresh works when Express generates the page HTML instead of Vite transforming the app entry document.
---

When Express route handlers generate HTML in Vite development mode, include the React Refresh bootstrap before loading `/@vite/client` and the React entry module. Vite cannot inject its plugin preamble into HTML it did not transform.

**Why:** Without the preamble, `@vitejs/plugin-react` throws “can't detect preamble”; React modules can load but the app never mounts, leaving only the static server shell visible.

**How to apply:** For custom development HTML, import `/@react-refresh`, call `injectIntoGlobalHook(window)`, define `$RefreshReg$` and `$RefreshSig$`, and set `__vite_plugin_react_preamble_installed__` before the entry script. In production, use built asset tags and omit the development-only bootstrap.
