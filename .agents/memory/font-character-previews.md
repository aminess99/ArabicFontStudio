---
name: Font character previews
description: Decision for combining SEO-friendly character text with visual font specimen images.
---

Keep the character map as readable HTML and use a generated image as a supplementary visual preview. The current library rollout uses one watermarked WebP preview per font.

**Why:** HTML remains searchable, accessible, copyable, and lightweight, while the image shows the exact visual character style and can support image search without making every font page heavy.

**How to apply:** Keep previews compressed, use descriptive alt text, intrinsic dimensions, lazy loading, and a subtle `xfontat.com` watermark for brand protection. New fonts need a matching preview asset before they can display the image layer.

For bulk preview generation, verify that the renderer resolves each requested family to the exact font file. Pango/Fontconfig can silently substitute another font for some local CFF or hyphenated families.

**Why:** A substituted face produces a valid-looking image that does not actually preview the selected font.

**How to apply:** Compare the resolved font path with the target file; render mismatches through a browser `@font-face` that points directly to that font file.