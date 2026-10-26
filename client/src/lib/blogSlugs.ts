// Readable English and French URLs for translated blog posts. The Arabic post
// keeps its original slug; requests for the old slug under /en or /fr are
// redirected to these.

const SLUGS: Record<string, { en: string; fr: string }> = {
  "daleel-ikhtiyar-alkhat-alarabi": { en: "how-to-choose-an-arabic-font", fr: "choisir-une-police-arabe" },
  "alfarq-bayn-thuluth-kufi-ruqaa": { en: "thuluth-vs-kufi-vs-ruqaa", fr: "difference-thuluth-coufique-ruqaa" },
  "best-practices-arabic-fonts-digital-design": { en: "best-practices-arabic-fonts-digital-design", fr: "bonnes-pratiques-polices-arabes-design" },
  "how-to-download-use-arabic-fonts": { en: "how-to-download-use-arabic-fonts", fr: "telecharger-utiliser-polices-arabes" },
  "ethical-use-arabic-fonts": { en: "ethical-use-arabic-fonts", fr: "usage-ethique-polices-arabes" },
  "afdal-10-khotot-arabiya-lil-tasmeem": { en: "arabic-fonts-for-design", fr: "polices-arabes-pour-le-design" },
  "khotot-arabiya-lil-photoshop-majanan": { en: "arabic-fonts-in-photoshop", fr: "polices-arabes-photoshop" },
  "khotot-arabiya-lil-shiaarat-wal-logos": { en: "arabic-fonts-for-logos", fr: "polices-arabes-pour-logos" },
  "khotot-arabiya-muzakhrafa-lil-tasmeem": { en: "ornamental-arabic-fonts", fr: "polices-arabes-ornees" },
  "khotot-arabiya-lil-social-media": { en: "arabic-fonts-for-social-media", fr: "polices-arabes-reseaux-sociaux" },
  "khotot-arabiya-lil-youtubiyeen": { en: "arabic-fonts-for-youtube-thumbnails", fr: "polices-arabes-miniatures-youtube" },
  "khotot-arabiya-lil-kotob-wal-matbooaat": { en: "arabic-fonts-for-books", fr: "polices-arabes-pour-livres" },
  "khotot-arabiya-lil-dawaat-wal-munasabaat": { en: "arabic-fonts-for-invitations", fr: "polices-arabes-invitations" },
  "khotot-arabiya-lil-alamat-al-tijariya": { en: "arabic-fonts-for-branding", fr: "polices-arabes-identite-visuelle" },
  "khotot-arabiya-lil-wosham": { en: "arabic-lettering-for-tattoos", fr: "lettrage-arabe-tatouage" },
  "khotot-arabiya-lil-mawaqi-wal-tatbeeqat": { en: "arabic-fonts-for-websites-and-apps", fr: "polices-arabes-sites-et-applications" },
};

const ORIGINAL: Record<"en" | "fr", Map<string, string>> = {
  en: new Map(Object.entries(SLUGS).map(([original, slugs]) => [slugs.en, original])),
  fr: new Map(Object.entries(SLUGS).map(([original, slugs]) => [slugs.fr, original])),
};

export function localizedBlogSlug(locale: "en" | "fr", slug: string): string {
  return SLUGS[slug]?.[locale] ?? slug;
}

// The Arabic post slug for a slug used in an /en or /fr URL.
export function originalBlogSlug(locale: "en" | "fr", slug: string): string {
  return ORIGINAL[locale].get(slug) ?? slug;
}

export const blogPostPath = (locale: "ar" | "en" | "fr", slug: string) =>
  locale === "ar" ? `/blog/${slug}` : `/${locale}/blog/${localizedBlogSlug(locale, slug)}`;

// Shorter titles and descriptions for search results where the translated
// headline or excerpt is longer than Google shows.
const SEO: Record<string, Partial<Record<"en" | "fr", { title?: string; description?: string }>>> = {
  "best-practices-arabic-fonts-digital-design": { fr: { title: "Bonnes pratiques des polices arabes en design numérique" } },
  "ethical-use-arabic-fonts": { fr: { title: "Design responsable : usage éthique des polices arabes" } },
  "afdal-10-khotot-arabiya-lil-tasmeem": { fr: { title: "10 polices arabes de xfontat à comparer pour le design" } },
  "khotot-arabiya-lil-social-media": { fr: { title: "Choisir une police arabe pour les réseaux sociaux" } },
  "khotot-arabiya-lil-kotob-wal-matbooaat": {
    en: { description: "How to choose Arabic fonts for books, magazines and reports: print and screen fonts, and how to pick the right one for your project." },
    fr: { title: "Meilleures polices arabes pour livres et publications", description: "Choisir une police arabe pour livres, magazines et rapports : polices d'impression et conseils pour bien choisir selon votre projet." },
  },
  "khotot-arabiya-lil-dawaat-wal-munasabaat": {
    en: { description: "The most beautiful Arabic fonts for weddings, parties and special events, with tips for designing elegant, readable invitations." },
    fr: { title: "Les plus belles polices arabes pour invitations", description: "Les plus belles polices arabes pour mariages, fêtes et événements, avec des conseils pour des invitations élégantes et lisibles." },
  },
  "khotot-arabiya-lil-alamat-al-tijariya": { fr: { title: "Police arabe pour l'image de marque et l'identité visuelle", description: "Comment choisir une police arabe pour votre marque et construire une identité visuelle forte et cohérente." } },
  "khotot-arabiya-lil-mawaqi-wal-tatbeeqat": { fr: { title: "Choisir une police arabe pour sites et applications", description: "Tester une police arabe sur un site ou une application : sens d'écriture, intégration, performance et support des caractères." } },
};

export function blogSeo(locale: "en" | "fr", slug: string, title: string, description: string) {
  const override = SEO[slug]?.[locale];
  return { title: override?.title ?? title, description: override?.description ?? description };
}
