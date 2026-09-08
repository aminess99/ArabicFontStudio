---
name: Creator thumbnail presets
description: Product rule for named YouTube creator-inspired thumbnail presets
---

Named creator presets are references for thumbnail composition conventions—scale, color, framing, expression, and curiosity—not instructions to reproduce a real creator's face, logo, branding, or exact composition.

**Why:** Users want recognizable YouTube packaging patterns, but generated Arabic text and creator likenesses reduce control and can make the product feel derivative.

**How to apply:** Keep the named preset visible in the selector, translate it into generic visual directions in the generation prompt, explicitly request original generic people, and pass the exact Arabic headline to the image model for rendering inside the artwork.

The thumbnail pipeline uses `google/gemini-3.7-flash` through OpenRouter for style-aware prompt refinement, followed by `google/gemini-3.1-flash-image-preview` (Nano Banana 2) through OpenRouter for the actual 16:9 image.

**Why:** Separating prompt direction from image rendering makes creator-style rules reusable while allowing the image model to focus on composition and visual fidelity.

**How to apply:** Keep both stages server-side behind `OPENROUTER_API_KEY`; do not expose the key or move either model call into the browser.