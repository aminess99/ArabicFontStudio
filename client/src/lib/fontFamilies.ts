// Families of fonts that ship in several weights ("Tajawal Bold", "Tajawal
// Light"…). People search for the family name, so each family with two or
// more weights gets its own page listing all of them. Shared by the React
// page and server/seoHtml.ts.

import { detectFontFamily } from "./fontFamily";
import { arabicFontName } from "./fontArabicNames";

type FamilyFont = { slug: string; name: string; nameArabic: string; category: string; duplicateOf?: string | null; designer?: string | null; license?: string | null; fileUrl: string };

export type FontFamilyGroup<T extends FamilyFont = FamilyFont> = {
  slug: string;
  name: string;
  nameArabic: string;
  category: string;
  fonts: T[];
};

const ARABIC = /[؀-ۿ]/;
// Short weight codes some families use ("Hacen Beirut Lt", "Hacen Algeria Bd").
const SHORT_WEIGHTS = /\s+(lt|md|bd|hd|st|xl|xxl)$/i;

export function familyName(fontName: string): string {
  return detectFontFamily(fontName).replace(SHORT_WEIGHTS, "").trim();
}

const familyKey = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

export function familySlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const familyPath = (locale: "ar" | "en" | "fr", slug: string) => (locale === "ar" ? `/family/${slug}` : `/${locale}/family/${slug}`);

const WEIGHT_ORDER: Array<[RegExp, number]> = [
  [/thin|hairline/, 1],
  [/extralight|ultralight/, 2],
  [/light|lt$/, 3],
  [/semibold|demibold|smbd/, 6],
  [/extrabold|ultrabold|exbd/, 8],
  [/black|heavy|fat/, 9],
  [/bold|bd$/, 7],
  [/medium|md$/, 5],
];

export function weightRank(fontName: string): number {
  const rest = familyKey(fontName);
  const rank = WEIGHT_ORDER.find(([pattern]) => pattern.test(rest))?.[1] ?? 4;
  return rank + (/italic|oblique|slant/.test(rest) ? 0.5 : 0);
}

// The Arabic family name: from the name list, else the part all the fonts'
// Arabic names share ("تجوال عريض", "تجوال خفيف" → "تجوال").
function arabicFamilyName(name: string, fonts: FamilyFont[]): string {
  const listed = arabicFontName(name);
  if (listed) return listed;
  const arabic = fonts.map((font) => font.nameArabic).filter((value) => ARABIC.test(value));
  if (arabic.length === fonts.length) {
    const words = arabic[0].split(" ");
    let shared = words.length;
    for (const other of arabic.slice(1)) {
      const otherWords = other.split(" ");
      let i = 0;
      while (i < shared && words[i] === otherWords[i]) i++;
      shared = i;
    }
    if (shared > 0) return words.slice(0, shared).join(" ");
  }
  return name;
}

export function buildFontFamilies<T extends FamilyFont>(fonts: T[]): FontFamilyGroup<T>[] {
  const groups = new Map<string, { name: string; fonts: T[] }>();
  for (const font of fonts) {
    if (font.duplicateOf) continue;
    const name = familyName(font.name);
    const key = familyKey(name);
    if (!key) continue;
    const group = groups.get(key) ?? { name, fonts: [] };
    group.fonts.push(font);
    groups.set(key, group);
  }
  const families: FontFamilyGroup<T>[] = [];
  const used = new Set<string>();
  for (const { name, fonts: members } of Array.from(groups.values())) {
    // Skip families without a real name ("4", "4 0", "4 1" are file numbers).
    if (members.length < 2 || !/[a-z]{3}/i.test(name)) continue;
    const slug = familySlug(name);
    if (!slug || used.has(slug)) continue;
    used.add(slug);
    members.sort((a, b) => weightRank(a.name) - weightRank(b.name) || a.name.localeCompare(b.name));
    const categories = members.map((font) => font.category);
    const category = categories.sort((a, b) => categories.filter((c) => c === b).length - categories.filter((c) => c === a).length)[0];
    families.push({ slug, name, nameArabic: arabicFamilyName(name, members), category, fonts: members });
  }
  return families.sort((a, b) => b.fonts.length - a.fonts.length || a.name.localeCompare(b.name));
}

export function findFontFamily<T extends FamilyFont>(fonts: T[], slug: string): FontFamilyGroup<T> | undefined {
  return buildFontFamilies(fonts).find((family) => family.slug === slug);
}

// The family a font belongs to, when it has a family page.
export function familyOfFont<T extends FamilyFont>(fonts: T[], font: FamilyFont): FontFamilyGroup<T> | undefined {
  const key = familyKey(familyName(font.name));
  return buildFontFamilies(fonts).find((family) => familyKey(family.name) === key);
}

// "تجوال عريض" → "عريض": the weight part of a font's Arabic name within its family.
export function weightLabel(font: FamilyFont, family: FontFamilyGroup): string {
  if (ARABIC.test(font.nameArabic) && font.nameArabic.startsWith(family.nameArabic)) {
    const rest = font.nameArabic.slice(family.nameArabic.length).trim();
    return rest || "عادي";
  }
  const rest = font.name.slice(family.name.length).trim();
  return rest || "Regular";
}

export function familyTitleName(family: FontFamilyGroup): string {
  return ARABIC.test(family.nameArabic) && family.nameArabic !== family.name ? `${family.nameArabic} ${family.name}` : family.name;
}

type Locale = "ar" | "en" | "fr";

// Arabic count agreement: وزنان، ٣ أوزان، ١٢ وزناً.
function arWeights(count: number): string {
  if (count === 2) return "وزنان";
  return count <= 10 ? `${count} أوزان` : `${count} وزناً`;
}

export function familyCopy(family: FontFamilyGroup, locale: Locale, categoryLabel: string) {
  const count = family.fonts.length;
  const designer = family.fonts.find((font) => font.designer)?.designer;
  const license = family.fonts.find((font) => font.license)?.license;
  const titleName = familyTitleName(family);
  if (locale === "fr") {
    return {
      title: `Police ${family.name} — ${count} graisses à télécharger gratuitement | xfontat`,
      heading: `Police ${family.name} : toutes les graisses`,
      description: `Téléchargez la famille de polices arabes ${family.name} : ${count} graisses (${family.fonts.slice(0, 4).map((font) => font.name.slice(family.name.length).trim() || "Regular").join(", ")}). Aperçu de votre texte dans chaque graisse.`.slice(0, 160),
      intro: `La famille ${family.name} compte ${count} fichiers de police arabe de la catégorie ${categoryLabel}${designer ? `, dessinés par ${designer}` : ""}.${license ? ` Licence : ${license}.` : " Vérifiez la licence de chaque fichier avant un usage commercial."} Comparez les graisses ci-dessous et téléchargez celle qui convient à votre projet.`,
      faqs: [
        { question: `Combien de graisses compte la police ${family.name} ?`, answer: `${count} fichiers : ${family.fonts.map((font) => font.name).join(", ")}.` },
        { question: `${family.name} est-elle gratuite ?`, answer: license ? `Elle est publiée sous ${license}. Lisez la licence avant un usage commercial.` : "Le téléchargement est gratuit, mais la licence n'a pas été vérifiée : renseignez-vous auprès du créateur avant un usage commercial." },
        { question: "Quelle graisse choisir ?", answer: "Les graisses fines conviennent aux grands titres, la graisse normale au texte courant, et les graisses grasses aux titres et aux visuels courts." },
      ],
    };
  }
  if (locale === "en") {
    return {
      title: `${family.name} Arabic Font — All ${count} Weights Free Download | xfontat`,
      heading: `${family.name} Arabic font: all weights`,
      description: `Download the ${family.name} Arabic font family: ${count} weights (${family.fonts.slice(0, 4).map((font) => font.name.slice(family.name.length).trim() || "Regular").join(", ")}). Preview your text in every weight.`.slice(0, 160),
      intro: `The ${family.name} family has ${count} Arabic font files in the ${categoryLabel} category${designer ? `, designed by ${designer}` : ""}.${license ? ` Licence: ${license}.` : " Check each file's licence before commercial use."} Compare the weights below and download the one that fits your project.`,
      faqs: [
        { question: `How many weights does ${family.name} have?`, answer: `${count} files: ${family.fonts.map((font) => font.name).join(", ")}.` },
        { question: `Is ${family.name} free?`, answer: license ? `It is published under the ${license}. Read the licence before commercial use.` : "The download is free, but the licence has not been verified: check with the designer before commercial use." },
        { question: "Which weight should I use?", answer: "Light weights suit large headings, the regular weight suits body text, and bold weights suit headlines and short visuals." },
      ],
    };
  }
  const weights = family.fonts.map((font) => weightLabel(font, family)).join("، ");
  return {
    title: `خط ${titleName} — تحميل جميع الأوزان مجاناً | xfontat`,
    heading: `خط ${titleName}: جميع الأوزان`,
    description: `حمّل عائلة خط ${family.nameArabic} (${family.name}) كاملة: ${arWeights(count)} منها ${family.fonts.slice(0, 4).map((font) => weightLabel(font, family)).join("، ")}. عاين نصك بكل وزن قبل التحميل.`.slice(0, 160),
    intro: `عائلة خط ${family.nameArabic} (${family.name}) تضم ${arWeights(count)} من تصنيف ${categoryLabel}: ${weights}.${designer ? ` من تصميم ${designer}.` : ""}${license ? ` الترخيص: ${license}.` : " راجع ترخيص كل ملف قبل الاستخدام التجاري."} قارن الأوزان في الأسفل وحمّل ما يناسب مشروعك.`,
    faqs: [
      { question: `كم وزناً في خط ${family.nameArabic}؟`, answer: `${arWeights(count)}: ${weights}.` },
      { question: `هل خط ${family.nameArabic} مجاني؟`, answer: license ? `يُنشر بترخيص ${license}. اقرأ نص الترخيص قبل الاستخدام التجاري.` : "التحميل مجاني، لكن الترخيص لم يُتحقق منه بعد، فراجع المصمم قبل الاستخدام التجاري." },
      { question: "أي وزن أختار؟", answer: "الأوزان الخفيفة تناسب العناوين الكبيرة، والوزن العادي يناسب النصوص، والأوزان العريضة تناسب العناوين القصيرة والتصاميم." },
    ],
  };
}
