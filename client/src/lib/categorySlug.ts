export const categoryToSlug: Record<string, string> = {
  "ثلث": "thuluth",
  "ديواني": "diwani",
  "رقعة": "ruqaa",
  "كوفي": "kufi",
  "نسخ": "naskh",
  "تصميم": "tasmeem",
  "خطوط الحرة": "graffiti",
  "فوتوشوب": "photoshop",
  "نستعليق": "nastaliq",
};

export const slugToCategory: Record<string, string> = Object.fromEntries(
  Object.entries(categoryToSlug).map(([ar, slug]) => [slug, ar])
);

export function getCategorySlug(arabicName: string): string {
  return categoryToSlug[arabicName] || arabicName;
}

export function getCategoryDisplayName(arabicName: string): string {
  return arabicName === "خطوط الحرة" ? "خطوط الغرافيتي" : arabicName;
}

export function getCategoryFromSlug(slug: string): string | undefined {
  return slugToCategory[slug];
}
