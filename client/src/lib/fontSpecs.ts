// What a font file supports, read from the file by scripts/font-specs.py and
// attached to each font by the server. Shared by the font page and
// server/seoHtml.ts so both describe the font the same way.

export type FontSpecs = {
  glyphs: number;
  arabic: boolean;
  harakat: boolean;
  persian: boolean;
  urdu: boolean;
  latin: boolean;
  easternDigits: boolean;
  persianDigits: boolean;
  westernDigits: boolean;
  variable: boolean;
  weightRange?: [number, number];
  designer?: string;
  vendor?: string;
};

type Locale = "ar" | "en" | "fr";
type SpecFont = { name: string; nameArabic: string; fileFormat: string; designer?: string | null; specs?: FontSpecs };

const yesNo = (locale: Locale, value: boolean) => (locale === "ar" ? (value ? "نعم" : "لا") : locale === "fr" ? (value ? "Oui" : "Non") : value ? "Yes" : "No");

function digits(locale: Locale, specs: FontSpecs): string {
  const sets = [
    specs.easternDigits && (locale === "ar" ? "١٢٣ (عربية مشرقية)" : locale === "fr" ? "١٢٣ (arabes orientaux)" : "١٢٣ (Eastern Arabic)"),
    specs.westernDigits && (locale === "ar" ? "123 (عربية غربية)" : locale === "fr" ? "123 (occidentaux)" : "123 (Western)"),
    specs.persianDigits && (locale === "ar" ? "۱۲۳ (فارسية)" : locale === "fr" ? "۱۲۳ (persans)" : "۱۲۳ (Persian)"),
  ].filter(Boolean) as string[];
  if (sets.length) return sets.join(locale === "ar" ? "، " : ", ");
  return locale === "ar" ? "لا يحتوي على أرقام" : locale === "fr" ? "Aucun chiffre" : "No digits";
}

// Rows for the specs table on the font page.
export function specsRows(locale: Locale, font: SpecFont): Array<[string, string]> {
  const specs = font.specs;
  if (!specs) return [];
  const t = (ar: string, en: string, fr: string) => (locale === "ar" ? ar : locale === "fr" ? fr : en);
  const rows: Array<[string, string]> = [
    [t("التشكيل (الحركات)", "Diacritics (harakat)", "Voyelles (harakat)"), yesNo(locale, specs.harakat)],
    [t("الحروف الفارسية (پ چ ژ گ)", "Persian letters (پ چ ژ گ)", "Lettres persanes (پ چ ژ گ)"), yesNo(locale, specs.persian)],
    [t("الحروف الأردية", "Urdu letters", "Lettres ourdoues"), yesNo(locale, specs.urdu)],
    [t("الحروف اللاتينية (A–Z)", "Latin letters (A–Z)", "Lettres latines (A–Z)"), yesNo(locale, specs.latin)],
    [t("الأرقام", "Digits", "Chiffres"), digits(locale, specs)],
    [t("عدد الرموز في الملف", "Glyphs in the file", "Glyphes dans le fichier"), String(specs.glyphs)],
  ];
  if (specs.variable) {
    rows.push([t("الأوزان", "Weights", "Graisses"), specs.weightRange
      ? t(`خط متغير من ${specs.weightRange[0]} إلى ${specs.weightRange[1]}`, `Variable, ${specs.weightRange[0]}–${specs.weightRange[1]}`, `Variable, ${specs.weightRange[0]}–${specs.weightRange[1]}`)
      : t("خط متغير", "Variable", "Variable")]);
  }
  if (!font.designer && specs.designer) rows.push([t("المصمم (حسب بيانات الملف)", "Designer (from the file)", "Créateur (selon le fichier)"), specs.designer]);
  if (specs.vendor) rows.push([t("الجهة المصنعة (حسب بيانات الملف)", "Vendor (from the file)", "Éditeur (selon le fichier)"), specs.vendor]);
  return rows;
}

// Questions people ask about a font ("does it support harakat?"), answered
// from the file.
export function specsFaqs(locale: Locale, font: SpecFont): Array<{ question: string; answer: string }> {
  const specs = font.specs;
  if (!specs) return [];
  const name = locale === "ar" ? font.nameArabic : font.name;
  if (locale === "fr") {
    return [
      { question: `${name} prend-elle en charge les voyelles arabes ?`, answer: specs.harakat ? "Oui, le fichier contient les voyelles (fatha, damma, kasra, soukoun, chadda et tanwin)." : "Non, le fichier ne contient pas toutes les voyelles ; le texte voyellé s'affichera avec une autre police." },
      { question: `${name} contient-elle des lettres latines ?`, answer: specs.latin ? "Oui, elle contient l'alphabet latin, utile pour un texte bilingue." : "Non, utilisez une autre police pour le texte en lettres latines." },
    ];
  }
  if (locale === "en") {
    return [
      { question: `Does ${name} support Arabic diacritics?`, answer: specs.harakat ? "Yes. The file includes the harakat (fatha, damma, kasra, sukun, shadda and tanween)." : "No. The file does not include all the harakat, so vowelled text will fall back to another font." },
      { question: `Does ${name} include Latin letters?`, answer: specs.latin ? "Yes, it includes the Latin alphabet, useful for bilingual text." : "No. Pair it with another font for Latin text." },
    ];
  }
  return [
    { question: `هل خط ${name} يدعم التشكيل؟`, answer: specs.harakat ? "نعم، يحتوي الملف على الحركات كاملة: الفتحة والضمة والكسرة والسكون والشدة والتنوين." : "لا، الملف لا يحتوي على كل الحركات، فيظهر النص المشكول بخط آخر بديل." },
    { question: `هل خط ${name} يدعم الحروف الإنجليزية؟`, answer: specs.latin ? "نعم، يحتوي على الحروف اللاتينية، فيصلح للنصوص المكتوبة بالعربي والإنجليزي معاً." : "لا، استخدم معه خطاً آخر للنص الإنجليزي." },
    ...(specs.persian ? [{ question: `هل خط ${name} يدعم الفارسية؟`, answer: `نعم، يحتوي على الحروف الفارسية پ چ ژ گ${specs.urdu ? " والحروف الأردية أيضاً" : ""}.` }] : []),
  ];
}

// "يدعم التشكيل والحروف اللاتينية والأرقام العربية": the strongest features.
function featuresAr(specs: FontSpecs): string {
  const parts = [
    specs.harakat && "التشكيل",
    specs.persian && "الحروف الفارسية",
    specs.latin && "الحروف اللاتينية",
    specs.easternDigits && specs.westernDigits ? "الأرقام العربية والإنجليزية" : specs.easternDigits ? "الأرقام العربية" : specs.westernDigits ? "الأرقام الإنجليزية" : "",
  ].filter(Boolean) as string[];
  if (!parts.length) return "";
  return parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(" و")} و${parts[parts.length - 1]}`;
}

// Meta description for a font page without a written profile.
export function specsDescriptionAr(font: SpecFont & { category?: string }): string | undefined {
  const specs = font.specs;
  if (!specs) return undefined;
  const latin = font.nameArabic !== font.name ? ` (${font.name})` : "";
  const features = featuresAr(specs);
  const designer = font.designer || specs.designer;
  const candidates = [
    `خط ${font.nameArabic}${latin}${font.category ? ` من خطوط ${font.category}` : ""}${features ? `، يدعم ${features}` : ""}${specs.variable ? " بأوزان متغيرة" : ""}. حمّله مجاناً بصيغة ${font.fileFormat}${designer ? ` من تصميم ${designer}` : ""} وعاين نصك قبل التحميل.`,
    `خط ${font.nameArabic}${latin}${features ? `، يدعم ${features}` : ""}. حمّله مجاناً بصيغة ${font.fileFormat} وعاين نصك قبل التحميل.`,
    `خط ${font.nameArabic}${latin}${features ? `، يدعم ${features}` : ""}. حمّله مجاناً بصيغة ${font.fileFormat}.`,
  ];
  return candidates.find((text) => text.length <= 160) ?? candidates[candidates.length - 1].slice(0, 160);
}
