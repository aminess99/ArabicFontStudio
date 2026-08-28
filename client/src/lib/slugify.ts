function slugifyPart(value: string): string {
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
  return `${base}-${stableHash(`${category}/${fileName}`)}-font`;
}
