import {
  englishCategories,
  frenchCategories,
} from "./internationalContent";

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
    browseCategory: (categoryName: string) => `Voir toutes les polices ${categoryName}`,
    download: "Télécharger le fichier",
    notListed: "Non indiqué",
    categoryFallback: "polices arabes",
    categoryDescriptionFallback: "Prévisualisez le texte et vérifiez le format, la licence et la source de ce fichier avant de l’utiliser.",
    softwareCompatibility: "Vérifiez le format du fichier et testez la police dans votre système et vos logiciels.",
  },
} as const;

export function getLocalizedFontPageContent(
  font: { name: string; fileFormat: string; category: string; style?: string | null },
  locale: FontDetailLocale,
) {
  const categories = locale === "fr" ? frenchCategories : englishCategories;
  const category = categories.find((item) => item.arabicCategory === font.category);
  const copy = localizedFontDetailCopy[locale];
  const categoryName = category?.name || copy.categoryFallback;
  const format = font.fileFormat || copy.notListed;

  return {
    category,
    categoryName,
    categoryDescription: category?.intro || copy.categoryDescriptionFallback,
    summary: locale === "fr"
      ? `${font.name} est un fichier de police arabe de catégorie ${categoryName}. Le style indiqué est ${font.style || copy.notListed} et le format du fichier est ${format}. Prévisualisez les caractères et consultez la licence et la source avant utilisation.`
      : `${font.name} is an Arabic font file in the ${categoryName} category. The listed style is ${font.style || copy.notListed}, and the file format is ${format}. Preview the characters and review the license and source before use.`,
    useCases: category?.uses || [],
    faqs: category?.faqs || [],
    title: locale === "fr"
      ? `Télécharger la police arabe ${font.name} | xfontat`
      : `Download ${font.name} Arabic Font | xfontat`,
    description: locale === "fr"
      ? `Prévisualisez ${font.name}, une police arabe de la catégorie ${categoryName}. Vérifiez le format ${format}, la licence et la source avant de télécharger le fichier.`
      : `Preview ${font.name}, an Arabic font in the ${categoryName} category. Check the ${format} format, license and source before downloading the file.`,
  };
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
