function slugifyPart(value: string): string {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/(?:alfont|p30download)(?:[\s._-]*com)?/g, " ")
    .replace(/[._]+/g, " ")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function legacySlugifyPart(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

export function generateSlug(fontName: string, fileName: string, category: string): string {
  const base = slugifyPart(fontName) || slugifyPart(fileName) || "arabic-font";
  return base;
}

export function getCanonicalFontSlug(font: {
  slug?: string | null;
  name: string;
  fileName: string;
  category: string;
}): string {
  return font.slug || generateSlug(font.name, font.fileName, font.category);
}

export function generateLegacyNameSlug(fontName: string): string {
  return `${legacySlugifyPart(fontName)}-font`;
}

export function generateLegacyFontSlug(fontName: string, fileName: string, category: string): string {
  const base = legacySlugifyPart(fontName) || legacySlugifyPart(fileName) || "arabic-font";
  return `${base}-${stableHash(`${category}/${fileName}`)}-font`;
}

export function getFontIdentity(category: string, fileName: string): string {
  return `${category}/${fileName}`;
}

export function buildCleanFontSlugAssignments(
  fonts: Array<{ name: string; fileName: string; category: string }>,
): Map<string, string> {
  const records = fonts.map((font) => ({
    ...font,
    identity: getFontIdentity(font.category, font.fileName),
    base: slugifyPart(font.name) || slugifyPart(font.fileName) || "arabic-font",
  })).sort((a, b) => a.identity.localeCompare(b.identity));
  const used = new Set<string>();
  const result = new Map<string, string>();
  const nextSuffix = new Map<string, number>();
  for (const record of records) {
    let candidate = record.base;
    if (used.has(candidate)) {
      let suffix = nextSuffix.get(record.base) || 2;
      candidate = `${record.base}-${suffix}`;
      while (used.has(candidate)) {
        suffix += 1;
        candidate = `${record.base}-${suffix}`;
      }
      nextSuffix.set(record.base, suffix + 1);
    }
    used.add(candidate);
    result.set(record.identity, candidate);
  }
  return result;
}
