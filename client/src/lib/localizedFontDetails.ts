import {
  englishCategories,
  frenchCategories,
} from "./internationalContent";
import { detectFontFamily } from "./fontFamily";

export type FontDetailLocale = "en" | "fr";

export const localizedFontDetailCopy = {
  en: {
    heading: (fontName: string) => `Download ${fontName} Arabic Font`,
    detailsHeading: "Font file details",
    nameLabel: "Font name",
    arabicNameLabel: "Arabic name",
    categoryLabel: "Category",
    formatLabel: "Format",
    styleLabel: "Style",
    designerLabel: "Designer",
    licenseLabel: "License",
    copyrightLabel: "Copyright",
    sourceLabel: "Source",
    licenseNoticeHeading: "License note from the source",
    licenseNoticeIntro: "This note is reproduced from the source. Check the linked source and license terms before use.",
    previewLabel: "Preview text",
    previewPlaceholder: "Type Arabic text to preview…",
    previewSizesHeading: "Preview at different sizes",
    previewSizeLabels: ["Large heading", "Subheading", "Body text", "Small text"],
    aboutHeading: "About this font",
    usesHeading: "Suggested uses",
    installHeading: "Installing the font",
    installIntro: "Installation steps depend on the file format and your operating system. Check compatibility before installing.",
    windowsHeading: "Windows",
    macHeading: "macOS",
    installSteps: {
      windows: [
        "Download the font file.",
        "Open the file if its format is supported by Windows.",
        "Choose Install in the font viewer.",
        "Restart the design application if the font does not appear.",
      ],
      mac: [
        "Download the font file.",
        "Open the file if its format is supported by macOS.",
        "Choose Install Font in Font Book.",
        "Restart the design application if the font does not appear.",
      ],
    },
    characterMapHeading: "Character preview",
    characterMapIntro: "Sample Latin letters, Arabic characters and numerals. Character coverage can vary by font file.",
    characterMapImageCaption: "Image preview of this font’s characters",
    characterMapImageAlt: (fontName: string) => `Character preview for ${fontName}`,
    categoryFaqHeading: "Common questions about this style",
    relatedHeading: "More fonts in this category",
    variantsHeading: "Other styles in this font family",
    relatedArticlesHeading: "Related articles",
    sidebarHeading: "Font information",
    categoriesHeading: "Browse font categories",
    addFavorite: "Add font to favorites",
    removeFavorite: "Remove font from favorites",
    regularWeight: "Regular",
    browseCategory: (categoryName: string) => `Browse all ${categoryName} fonts`,
    download: "Download file",
    notListed: "Not listed",
    categoryFallback: "Arabic fonts",
    categoryDescriptionFallback: "Preview the sample text and check this file’s format, license and source details before using it.",
    softwareCompatibility: "Check the file format and test the font in your operating system and software.",
  },
  fr: {
    heading: (fontName: string) => `Télécharger la police arabe ${fontName}`,
    detailsHeading: "Informations sur le fichier",
    nameLabel: "Nom de la police",
    arabicNameLabel: "Nom en arabe",
    categoryLabel: "Catégorie",
    formatLabel: "Format",
    styleLabel: "Style",
    designerLabel: "Créateur",
    licenseLabel: "Licence",
    copyrightLabel: "Droits d’auteur",
    sourceLabel: "Source",
    licenseNoticeHeading: "Note de licence de la source",
    licenseNoticeIntro: "Cette note est reproduite depuis la source. Consultez la source et les conditions de licence avant toute utilisation.",
    previewLabel: "Texte de prévisualisation",
    previewPlaceholder: "Saisissez un texte arabe à prévisualiser…",
    previewSizesHeading: "Prévisualisation à différentes tailles",
    previewSizeLabels: ["Grand titre", "Sous-titre", "Texte courant", "Petit texte"],
    aboutHeading: "À propos de cette police",
    usesHeading: "Utilisations possibles",
    installHeading: "Installer la police",
    installIntro: "Les étapes dépendent du format du fichier et du système d’exploitation. Vérifiez la compatibilité avant l’installation.",
    windowsHeading: "Windows",
    macHeading: "macOS",
    installSteps: {
      windows: [
        "Téléchargez le fichier de police.",
        "Ouvrez-le si son format est pris en charge par Windows.",
        "Choisissez Installer dans le visualiseur de polices.",
        "Redémarrez le logiciel de création si la police n’apparaît pas.",
      ],
      mac: [
        "Téléchargez le fichier de police.",
        "Ouvrez-le si son format est pris en charge par macOS.",
        "Choisissez Installer la police dans Livre des polices.",
        "Redémarrez le logiciel de création si la police n’apparaît pas.",
      ],
    },
    characterMapHeading: "Aperçu des caractères",
    characterMapIntro: "Exemples de lettres latines, de caractères arabes et de chiffres. La prise en charge varie selon le fichier.",
    characterMapImageCaption: "Aperçu illustré des caractères de cette police",
    characterMapImageAlt: (fontName: string) => `Aperçu des caractères de ${fontName}`,
    categoryFaqHeading: "Questions sur ce style",
    relatedHeading: "Autres polices de cette catégorie",
    variantsHeading: "Autres styles de cette famille",
    relatedArticlesHeading: "Articles associés",
    sidebarHeading: "Informations sur la police",
    categoriesHeading: "Parcourir les catégories",
    addFavorite: "Ajouter aux favoris",
    removeFavorite: "Retirer des favoris",
    regularWeight: "Régulier",
    browseCategory: (categoryName: string) => `Voir toutes les polices ${categoryName}`,
    download: "Télécharger le fichier",
    notListed: "Non indiqué",
    categoryFallback: "polices arabes",
    categoryDescriptionFallback: "Prévisualisez le texte et vérifiez le format, la licence et la source de ce fichier avant de l’utiliser.",
    softwareCompatibility: "Vérifiez le format du fichier et testez la police dans votre système et vos logiciels.",
  },
} as const;

export type LocalizedFontDetailCopy =
  (typeof localizedFontDetailCopy)[FontDetailLocale];

export function getLocalizedFontPageContent(
  font: { name: string; fileFormat: string; category: string; style?: string | null; duplicateOf?: string | null },
  locale: FontDetailLocale,
) {
  const categories = locale === "fr" ? frenchCategories : englishCategories;
  const category = categories.find((item) => item.arabicCategory === font.category);
  const copy = localizedFontDetailCopy[locale];
  const categoryName = category?.name || copy.categoryFallback;
  const format = font.fileFormat || copy.notListed;
  const style = getLocalizedFontStyleLabel(font.style, locale, copy.notListed);

  return {
    category,
    categoryName,
    categoryDescription: category?.intro || copy.categoryDescriptionFallback,
    summary: locale === "fr"
      ? `${font.name} est un fichier de police arabe de catégorie ${categoryName}. Le style indiqué est ${style} et le format du fichier est ${format}. Prévisualisez les caractères et consultez la licence et la source avant utilisation.`
      : `${font.name} is an Arabic font file in the ${categoryName} category. The listed style is ${style}, and the file format is ${format}. Preview the characters and review the license and source before use.`,
    style,
    useCases: category?.uses || [],
    faqs: category?.faqs || [],
    title: locale === "fr"
      ? `Télécharger la police arabe ${font.name}${font.duplicateOf ? ` (${categoryName})` : ""} | xfontat`
      : `Download ${font.name} Arabic Font${font.duplicateOf ? ` (${categoryName})` : ""} | xfontat`,
    description: locale === "fr"
      ? `Prévisualisez ${font.name}, une police arabe de la catégorie ${categoryName}. Vérifiez le format ${format}, la licence et la source avant de télécharger le fichier.`
      : `Preview ${font.name}, an Arabic font in the ${categoryName} category. Check the ${format} format, license and source before downloading the file.`,
  };
}

export function getLocalizedFontStyleLabel(
  style: string | null | undefined,
  locale: FontDetailLocale,
  fallback: string,
) {
  if (!style?.trim()) return fallback;
  const normalized = style.trim().normalize("NFD").replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "").toLowerCase();
  const labels: Record<string, { en: string; fr: string }> = {
    "عادي": { en: "Regular", fr: "Régulier" },
    "منتظم": { en: "Regular", fr: "Régulier" },
    "غامق": { en: "Bold", fr: "Gras" },
    "عريض": { en: "Bold", fr: "Gras" },
    "متوسط": { en: "Medium", fr: "Moyen" },
    "خفيف": { en: "Light", fr: "Léger" },
    "رقيق": { en: "Thin", fr: "Fin" },
    "مائل": { en: "Italic", fr: "Italique" },
    "ثقيل": { en: "Heavy", fr: "Très gras" },
    "اسود": { en: "Black", fr: "Noir" },
  };
  const arabicLabel = labels[normalized]?.[locale];
  if (arabicLabel) return arabicLabel;

  const latinWeights: Record<string, { en: string; fr: string }> = {
    regular: { en: "Regular", fr: "Régulier" },
    bold: { en: "Bold", fr: "Gras" },
    semibold: { en: "SemiBold", fr: "Semi-gras" },
    extralight: { en: "ExtraLight", fr: "Extra-léger" },
    medium: { en: "Medium", fr: "Moyen" },
    light: { en: "Light", fr: "Léger" },
    black: { en: "Black", fr: "Noir" },
    semicondensed: { en: "SemiCondensed", fr: "Semi-condensé" },
    italic: { en: "Italic", fr: "Italique" },
    roman: { en: "Roman", fr: "Romain" },
  };
  return style.replace(/[A-Za-z]+/g, (token) => latinWeights[token.toLowerCase()]?.[locale] || token);
}

export function getLocalizedFontWeightLabel(fontName: string, locale: FontDetailLocale) {
  const family = detectFontFamily(fontName);
  const escapedFamily = family.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const suffix = fontName.replace(new RegExp(`^${escapedFamily}`, "i"), "").trim().replace(/^[-_\s]+/, "").trim();
  const key = suffix.toLowerCase().replace(/[\s_-]+/g, "");
  const labels: Record<string, { en: string; fr: string }> = {
    regular: { en: "Regular", fr: "Régulier" },
    normal: { en: "Regular", fr: "Régulier" },
    roman: { en: "Roman", fr: "Romain" },
    plain: { en: "Plain", fr: "Normal" },
    medium: { en: "Medium", fr: "Moyen" },
    semibold: { en: "Semi-bold", fr: "Semi-gras" },
    demibold: { en: "Semi-bold", fr: "Semi-gras" },
    bold: { en: "Bold", fr: "Gras" },
    extrabold: { en: "Extra bold", fr: "Extra-gras" },
    black: { en: "Black", fr: "Noir" },
    heavy: { en: "Heavy", fr: "Très gras" },
    thin: { en: "Thin", fr: "Fin" },
    light: { en: "Light", fr: "Léger" },
    extralight: { en: "Extra light", fr: "Extra-léger" },
    ultralight: { en: "Ultra light", fr: "Ultra-léger" },
    italic: { en: "Italic", fr: "Italique" },
    condensed: { en: "Condensed", fr: "Condensé" },
    oblique: { en: "Oblique", fr: "Oblique" },
  };
  return labels[key]?.[locale] || suffix || localizedFontDetailCopy[locale].regularWeight;
}

export const fontCharacterMap = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
  ["ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "د"],
  ["ش", "س", "ي", "ب", "ل", "ا", "ت", "ن", "م", "ك", "ط"],
  ["ئ", "ء", "ؤ", "ر", "لا", "ى", "ة", "و", "ز", "ظ"],
  ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
];
