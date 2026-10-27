export interface InternationalCategory {
  slug: string;
  arabicCategory: string;
  name: string;
  title: string;
  description: string;
  intro: string;
  uses: string[];
  faqs: { question: string; answer: string }[];
  heading?: string;
  guide?: string[];
}

export const englishHome = {
  title: "Arabic Fonts — Free Download for Calligraphy & Design | xfontat",
  description:
    "Download 850+ free Arabic fonts: Thuluth, Diwani, Kufi, Naskh, Ruqaa and Nastaliq. Preview your own text and try our Arabic keyboard and name tools.",
  heading: "Free Arabic fonts to download and preview",
  intro:
    "xfontat is a free library of more than 850 Arabic fonts, sorted by calligraphy style. Type your own text to preview it in every font, open a font to see its characters, format and licence, then download it. Free tools help you type in Arabic, write your name in Arabic calligraphy and preview a tattoo.",
  toolsHeading: "Free Arabic writing tools",
  tools: [
    { href: "/en/arabic-keyboard", icon: "keyboard" as const, title: "Arabic keyboard", description: "Type in Arabic on any device, with vowel marks and phonetic typing." },
    { href: "/en/names-in-arabic", icon: "names" as const, title: "Names in Arabic", description: "How 200 popular names are written in Arabic, with meanings and calligraphy." },
    { href: "/en/arabic-font-generator", icon: "generator" as const, title: "Arabic font generator", description: "Turn a name or text into Arabic calligraphy and download a PNG." },
    { href: "/en/greeting-cards", icon: "cards" as const, title: "Arabic greeting cards", description: "Eid, Ramadan and wedding cards with a name and an Arabic calligraphy greeting." },
    { href: "/en/arabic-fancy-text", icon: "zakhrafa" as const, title: "Arabic fancy text", description: "Decorate a name in Arabic or English and copy it into games and apps." },
    { href: "/en/arabic-tattoo-fonts", icon: "tattoo" as const, title: "Arabic tattoo fonts", description: "Preview a tattoo in calligraphy fonts and avoid common mistakes." },
    { href: "/en/arabic-phrases", icon: "phrases" as const, title: "Arabic phrases", description: "Allah, Bismillah, Habibi and more, with meaning and calligraphy." },
  ],
  aboutHeading: "Explore Arabic typography",
  about:
    "Arabic typefaces vary in letterforms, character coverage, and file format. Preview the text you plan to use, check the file details, and confirm its license before including it in a project.",
  licenseHeading: "Check the details for each font",
  license:
    "Available formats and usage terms can differ from one file to another. Review the source and license details on the individual font record before commercial use or redistribution.",
  benefitsHeading: "Why browse Arabic fonts on xfontat?",
  benefits: [
    { title: "Browse by style", description: "Explore the listed Arabic font files through clear style categories." },
    { title: "Preview your own text", description: "Test the words you plan to use before choosing a file." },
    { title: "Review font details", description: "Check the format, designer, license, and source when those details are available." },
    { title: "Download from the font page", description: "Open the font record to review its information before downloading." },
    { title: "Check compatibility", description: "Test the file in the operating system and software version you plan to use." },
  ],
  projectGuidesHeading: "How to choose an Arabic font for your project",
  projectGuides: [
    { title: "Logos and visual identities", description: "Test the actual brand name at its intended size. Compare letter shapes and check that it remains clear in smaller layouts." },
    { title: "Social media graphics", description: "Preview the final wording on a phone-sized screen and check contrast against the background." },
    { title: "Books and long-form text", description: "Test a representative paragraph and verify the characters and diacritics your text requires." },
    { title: "Invitations and events", description: "Preview names and dates at their final size, and make sure decorative details do not obscure key information." },
    { title: "Religious text", description: "Check the required characters and diacritics, then compare the final text with a trusted reference before publishing." },
    { title: "Design software", description: "Check Arabic shaping, text direction, and file-format support in the software version you plan to use." },
  ],
  categoryGuideHeading: "Arabic font styles: a quick guide",
  categoryGuideIntro: "These categories group digital font files for browsing. Individual designs, character coverage, and readability can vary, so preview the specific file you plan to use.",
  collectionsHeading: "Browse fonts by project",
  searchLabel: "Search fonts",
  searchPreviewHeading: "Search and preview",
  searchPlaceholder: "Search by font name…",
  formatLabel: "Format",
  previewLabel: "Preview text",
  previewPlaceholder: "Enter Arabic text to preview…",
  previewSizeLabel: "Preview size",
  favoriteAdd: "Add font to favorites",
  favoriteRemove: "Remove font from favorites",
  viewDetails: "View font details",
  results: "font files",
  noResults: "No font files match your search.",
  loading: "Loading font files…",
  error: "Font files could not be loaded. Please try again.",
  retry: "Try again",
  download: "View & Download",
  licenseLabel: "License",
  licenseUnknown: "Check the source license before use.",
  source: "Source",
  previous: "Previous",
  next: "Next",
  home: "Home",
  mainNavigation: "Main navigation",
  designFonts: "Design fonts",
  blog: "Blog",
  allCategories: "Browse styles",
  language: "العربية",
  familyCountLabel: (count: number) => count === 1 ? "font family" : "font families",
  fileCountLabel: (count: number) => count === 1 ? "font file" : "font files",
  variantCountLabel: (count: number) => count === 1 ? "style" : "styles",
  footerAbout: "About",
  footerContact: "Contact",
  footerPrivacy: "Privacy",
  footerTerms: "Terms",
  emptyCategory: "This category is not available.",
  faqHeading: "Common questions",
  faqs: [
    {
      question: "Can I preview Arabic text before downloading a font?",
      answer:
        "Yes. Enter sample text in the preview field to compare how the listed font files render it. Coverage and shaping can vary by file, so test the exact text you plan to use.",
    },
    {
      question: "Are all fonts free for commercial use?",
      answer:
        "Usage terms vary by font. Check the license and source information for the individual file before commercial use or redistribution.",
    },
    {
      question: "Which file formats are available?",
      answer:
        "Formats vary by file. Check the format shown with each font and confirm that your operating system or application supports it.",
    },
  ],
};

export const englishCategories: InternationalCategory[] = [
  {
    slug: "thuluth",
    arabicCategory: "ثلث",
    name: "Thuluth",
    heading: "Thuluth Arabic fonts",
    guide: ["Thuluth (\"one third\") is one of the six classical styles of Arabic calligraphy. Its tall vertical strokes, deep curves and overlapping letters make it the script of mosque inscriptions, book titles and formal headings.", "Digital Thuluth fonts simplify the hand-written style so it can be typed. Use them for large headings, logos with a traditional feel, certificates and wall art; avoid them for long paragraphs, where Naskh reads more easily."],
    title: "Thuluth Font Free Download — Arabic Thuluth Calligraphy Fonts | xfontat",
    description: "Download free Thuluth Arabic fonts. Preview your text in Thuluth calligraphy, compare styles and check each font's format and licence before use.",
    intro:
      "This collection groups files under the Thuluth category. Letterforms and decorative details vary, so preview the exact text and size needed for your design.",
    uses: ["Headings", "Invitations", "Decorative compositions"],
    faqs: [
      {
        question: "How can I compare Thuluth font files?",
        answer:
          "Preview the same names or phrases in each file and compare legibility at the size and layout you plan to use.",
      },
      {
        question: "Is Thuluth suitable for long passages?",
        answer:
          "Readability depends on the individual design and size. Test a representative passage before choosing a font for longer text.",
      },
    ],
  },
  {
    slug: "diwani",
    arabicCategory: "ديواني",
    name: "Diwani",
    heading: "Diwani Arabic fonts",
    guide: ["Diwani was developed in the Ottoman chancery for official decrees. Letters lean, curve and sit on top of one another, so the writing looks like a single flowing ornament.", "Diwani fonts suit wedding invitations, names, greeting cards and decorative logos. Keep the text short and check that names and dates stay readable at the final size."],
    title: "Diwani Font Free Download — Arabic Diwani Calligraphy Fonts | xfontat",
    description: "Download free Diwani Arabic fonts. Preview names and short phrases in flowing Diwani calligraphy and check each font's format and licence.",
    intro:
      "The Diwani category includes files with different flowing and decorative forms. Compare each file with your actual text and available layout space.",
    uses: ["Invitations", "Certificates", "Decorative headings"],
    faqs: [
      {
        question: "How do I choose a Diwani font for an invitation?",
        answer:
          "Preview the names, dates, and other important text at the intended size. Make sure decorative forms do not reduce readability.",
      },
      {
        question: "Can every Diwani font be used commercially?",
        answer:
          "Do not assume so. Review the license and source information for the specific file before commercial use.",
      },
    ],
  },
  {
    slug: "ruqaa",
    arabicCategory: "رقعة",
    name: "Ruqah",
    heading: "Ruqaa Arabic fonts",
    guide: ["Ruqaa (also written Riqa or Ruqah) is the most common style of everyday Arabic handwriting. It is quick to write, with short strokes, few flourishes and dots often joined into small dashes.", "Ruqaa fonts give designs a handwritten, informal feel. They work well for posters, social media graphics, food packaging and short headlines."],
    title: "Ruqaa Font Free Download — Arabic Riqa Handwriting Fonts | xfontat",
    description: "Download free Ruqaa (Riqa) Arabic fonts, the style of everyday Arabic handwriting. Preview your text and check each font's format and licence.",
    intro:
      "Ruqah files in this directory can differ in letter shape and spacing. Preview the exact words and check the file details before choosing one.",
    uses: ["Short headings", "Social graphics", "Labels"],
    faqs: [
      {
        question: "How can I test a Ruqah font for a design?",
        answer:
          "Preview your actual text at the final size, then check that the letters remain clear on the target screen or printed layout.",
      },
      {
        question: "Are Ruqah fonts suitable for body text?",
        answer:
          "It depends on the specific font and reading size. Test a full sample paragraph before using it for extended text.",
      },
    ],
  },
  {
    slug: "kufi",
    arabicCategory: "كوفي",
    name: "Kufi",
    heading: "Kufi Arabic fonts",
    guide: ["Kufic is the oldest Arabic calligraphic style, used in early Quran manuscripts and architecture. It is built from straight lines and angles, and its square variant can be laid out on a grid like a pattern.", "Modern Kufi fonts include many clean, geometric typefaces that work like a sans-serif. They are a popular choice for logos, apps, websites and signage because they stay clear at small sizes."],
    title: "Kufi Font Free Download — Arabic Kufic & Geometric Fonts | xfontat",
    description: "Download free Kufi Arabic fonts, from classic Kufic to modern geometric sans-serif styles. Preview your text and check each font's licence.",
    intro:
      "The Kufi category brings together different Arabic font files, including geometric styles. Compare letter shapes and spacing against the needs of your project.",
    uses: ["Logos", "Headings", "Geometric compositions"],
    faqs: [
      {
        question: "How can I compare Kufi font styles?",
        answer:
          "Use the same sample text for each file and compare its letterforms, spacing, and readability in the final layout.",
      },
      {
        question: "Can a Kufi font be used for a logo?",
        answer:
          "A particular file may suit a logo, but test the brand name at small and large sizes and verify the file’s license before use.",
      },
    ],
  },
  {
    slug: "naskh",
    arabicCategory: "نسخ",
    name: "Naskh",
    heading: "Naskh Arabic fonts",
    guide: ["Naskh is the classical script used for copying books and the Quran, and the model for most Arabic printing. Its letters are rounded, balanced and easy to read in long passages.", "Choose a Naskh font for body text, books, reports, subtitles and websites. Check that it supports the diacritics (tashkeel) you need if your text is vocalised."],
    title: "Naskh Font Free Download — Arabic Naskh Text Fonts | xfontat",
    description: "Download free Naskh Arabic fonts for books, documents and websites. Preview paragraphs in Naskh and check each font's character set and licence.",
    intro:
      "Files classified as Naskh can differ in proportions, character coverage, and diacritic support. Preview representative content before choosing a file.",
    uses: ["Books", "Articles", "Long-form text"],
    faqs: [
      {
        question: "How do I evaluate a Naskh font for long text?",
        answer:
          "Preview a representative paragraph at the intended size and line spacing. Check the characters and diacritics required by your content.",
      },
      {
        question: "Do all Naskh files support Arabic diacritics?",
        answer:
          "Support varies by file. Test the exact words and marks you need, and review the file information before use.",
      },
    ],
  },
  {
    slug: "tasmeem",
    arabicCategory: "تصميم",
    name: "Arabic Design Fonts",
    heading: "Arabic display and decorative fonts",
    guide: ["Display fonts are designed to be seen at large sizes: bold headlines, posters, packaging and video titles. Many mix traditional letterforms with modern shapes, outlines and textures.", "Because display fonts trade readability for personality, use them for a few words at a time and pair them with a simple Naskh or Kufi font for the rest of the text."],
    title: "Arabic Display Fonts Free Download — Decorative Fonts | xfontat",
    description: "Download free decorative Arabic display fonts for logos, posters, thumbnails and social media. Preview your text and check each font's licence.",
    intro:
      "This is a practical library category containing varied Arabic font files. Check each file’s character coverage, format, and license for your project.",
    uses: ["Posters", "Social graphics", "Presentations"],
    faqs: [
      {
        question: "How should I choose an Arabic design font?",
        answer:
          "Compare several files using the actual text and layout. Check legibility, character coverage, format, and license before selecting one.",
      },
      {
        question: "Will every file work in my design software?",
        answer:
          "Compatibility depends on the file format, operating system, and software version. Check the software documentation and test the file.",
      },
    ],
  },
  {
    slug: "graffiti",
    arabicCategory: "خطوط الحرة",
    name: "Freehand Arabic Fonts",
    heading: "Freehand and handwritten Arabic fonts",
    guide: ["Freehand fonts imitate brush strokes, markers and street lettering rather than a classical calligraphy style. Each design has its own rhythm, so results vary a lot from one font to another.", "They suit album covers, street-style posters, T-shirts and social media posts. Test the exact words you plan to use, since some freehand fonts cover only basic Arabic letters."],
    title: "Freehand Arabic Fonts Free Download — Handwritten Styles | xfontat",
    description: "Download free freehand and handwritten Arabic fonts with brush, marker and graffiti styles. Preview your text and check each font's licence.",
    intro:
      "Files in this category use varied expressive forms. Preview actual words and check that the characters you need are present.",
    uses: ["Short titles", "Posters", "Expressive graphics"],
    faqs: [
      {
        question: "Are freehand Arabic fonts suitable for paragraphs?",
        answer:
          "Readability depends on the individual file and size. Test a representative paragraph; these styles may be easier to evaluate in short text.",
      },
      {
        question: "Does “freehand” mean the font is free to use?",
        answer:
          "No. The category name describes a style, not a license. Review each file’s license before use.",
      },
    ],
  },
  {
    slug: "photoshop",
    arabicCategory: "فوتوشوب",
    name: "Arabic Fonts for Design Software",
    heading: "Arabic fonts for Photoshop and design apps",
    guide: ["These fonts are popular with designers working in Photoshop, Illustrator, InDesign, Canva and video editors. To display Arabic correctly, the app must support right-to-left text and Arabic shaping.", "In Photoshop, enable the Middle Eastern text engine (Preferences > Type) so letters join correctly. If letters appear separated or reversed, the app or setting does not support Arabic, not the font."],
    title: "Arabic Fonts for Photoshop Free Download | xfontat",
    description: "Download free Arabic fonts that work in Photoshop, Illustrator, Canva and other design apps. Preview your text and check each font's licence.",
    intro:
      "This is a library category, not a compatibility guarantee. Check the file format and test Arabic shaping and text direction in your software version.",
    uses: ["Image editing", "Posters", "Design layouts"],
    faqs: [
      {
        question: "Will every font in this category work in Photoshop?",
        answer:
          "The category does not guarantee compatibility. Check the file format and test Arabic shaping in the Photoshop version and operating system you use.",
      },
      {
        question: "What should I check before using a font file?",
        answer:
          "Confirm the file format, test the required Arabic characters and direction, and review the license and source information.",
      },
    ],
  },
  {
    slug: "nastaliq",
    arabicCategory: "نستعليق",
    name: "Nastaliq",
    heading: "Nastaliq fonts",
    guide: ["Nastaliq developed in Persia in the 14th and 15th centuries and is still the main calligraphic style for Persian and Urdu. Words slope down from right to left, giving it a light, hanging rhythm.", "Nastaliq fonts are ideal for poetry, book covers and elegant titles. Many also include the extra letters used in Persian and Urdu, such as پ, چ, گ and ے."],
    title: "Nastaliq Font Free Download — Persian & Urdu Calligraphy | xfontat",
    description: "Download free Nastaliq fonts for Persian, Urdu and Arabic calligraphy. Preview your text in Nastaliq and check each font's character set and licence.",
    intro:
      "Nastaliq files can differ in character coverage and shaping behavior. Preview the exact language and text you intend to use.",
    uses: ["Headings", "Short compositions", "Multilingual layouts"],
    faqs: [
      {
        question: "How do I test a Nastaliq font file?",
        answer:
          "Preview representative words in the target language and check character joining, diacritics, and spacing in your intended software.",
      },
      {
        question: "Can I use a Nastaliq file for commercial work?",
        answer:
          "Check the license for the specific file before commercial use or redistribution.",
      },
    ],
  },
];

export const frenchHome = {
  title: "Polices arabes gratuites à télécharger — calligraphie | xfontat",
  description:
    "Plus de 850 polices arabes gratuites : thuluth, diwani, coufique, naskh, ruqaa et nastaliq. Prévisualisez votre texte et essayez notre clavier arabe.",
  heading: "Polices arabes gratuites à télécharger et prévisualiser",
  intro:
    "xfontat est une bibliothèque gratuite de plus de 850 polices arabes, classées par style de calligraphie. Tapez votre texte pour le prévisualiser dans chaque police, ouvrez une police pour voir ses caractères, son format et sa licence, puis téléchargez-la. Des outils gratuits permettent aussi d'écrire en arabe, d'écrire son prénom en calligraphie et de prévisualiser un tatouage.",
  toolsHeading: "Outils gratuits d'écriture arabe",
  tools: [
    { href: "/fr/clavier-arabe", icon: "keyboard" as const, title: "Clavier arabe", description: "Écrivez en arabe sur n'importe quel appareil, avec voyelles et saisie phonétique." },
    { href: "/fr/prenoms-en-arabe", icon: "names" as const, title: "Prénoms en arabe", description: "Comment 200 prénoms s'écrivent en arabe, avec leur sens et en calligraphie." },
    { href: "/fr/generateur-police-arabe", icon: "generator" as const, title: "Générateur de police arabe", description: "Transformez un prénom ou un texte en calligraphie arabe et téléchargez un PNG." },
    { href: "/fr/cartes-de-voeux", icon: "cards" as const, title: "Cartes de vœux arabes", description: "Cartes Aïd, Ramadan et mariage avec prénom et vœu en calligraphie arabe." },
    { href: "/fr/texte-arabe-stylise", icon: "zakhrafa" as const, title: "Écriture arabe stylée", description: "Décorez un prénom en arabe ou en latin et copiez-le dans vos jeux et applis." },
    { href: "/fr/police-arabe-tatouage", icon: "tattoo" as const, title: "Polices pour tatouage", description: "Prévisualisez un tatouage en calligraphie et évitez les erreurs fréquentes." },
    { href: "/fr/expressions-arabes", icon: "phrases" as const, title: "Expressions arabes", description: "Allah, Bismillah, Habibi et d'autres, avec leur sens et en calligraphie." },
  ],
  aboutHeading: "Explorer la typographie arabe",
  about:
    "Les polices arabes diffèrent par la forme des lettres, la couverture des caractères et le format. Prévisualisez le texte prévu, consultez les détails du fichier et vérifiez sa licence avant de l’utiliser dans un projet.",
  licenseHeading: "Vérifier les détails de chaque police",
  license:
    "Les formats disponibles et les conditions d’utilisation varient selon les fichiers. Consultez la source et la licence de chaque fichier avant tout usage commercial ou redistribution.",
  benefitsHeading: "Pourquoi parcourir les polices arabes sur xfontat ?",
  benefits: [
    { title: "Parcourir par style", description: "Explorez les fichiers arabes répertoriés dans des catégories faciles à consulter." },
    { title: "Prévisualiser votre texte", description: "Testez les mots prévus avant de choisir un fichier." },
    { title: "Consulter les détails", description: "Vérifiez le format, le créateur, la licence et la source lorsque ces informations sont disponibles." },
    { title: "Télécharger depuis la fiche", description: "Ouvrez la fiche pour consulter les informations avant le téléchargement." },
    { title: "Vérifier la compatibilité", description: "Testez le fichier avec le système et la version logicielle que vous comptez utiliser." },
  ],
  projectGuidesHeading: "Comment choisir une police arabe pour votre projet",
  projectGuides: [
    { title: "Logos et identités visuelles", description: "Testez le nom de marque réel à sa taille prévue. Comparez les formes et vérifiez qu’il reste lisible dans les petits formats." },
    { title: "Visuels pour réseaux sociaux", description: "Prévisualisez le texte à sa taille finale sur un écran de téléphone et vérifiez le contraste avec l’arrière-plan." },
    { title: "Livres et textes longs", description: "Testez un paragraphe représentatif et vérifiez les caractères et signes diacritiques nécessaires." },
    { title: "Invitations et événements", description: "Prévisualisez les noms et les dates à leur taille finale, sans laisser les ornements masquer les informations importantes." },
    { title: "Textes religieux", description: "Vérifiez les caractères et signes diacritiques requis, puis comparez le texte final à une référence fiable avant publication." },
    { title: "Logiciels de design", description: "Vérifiez le façonnage arabe, le sens du texte et la prise en charge du format dans la version logicielle visée." },
  ],
  categoryGuideHeading: "Styles de polices arabes : guide rapide",
  categoryGuideIntro: "Ces catégories regroupent des fichiers numériques pour faciliter la navigation. Le dessin, la couverture des caractères et la lisibilité varient : prévisualisez le fichier concerné.",
  collectionsHeading: "Parcourir les polices par projet",
  searchLabel: "Rechercher des polices",
  searchPreviewHeading: "Rechercher et prévisualiser",
  searchPlaceholder: "Rechercher par nom…",
  formatLabel: "Format",
  previewLabel: "Texte de prévisualisation",
  previewPlaceholder: "Saisissez un texte arabe à prévisualiser…",
  previewSizeLabel: "Taille de prévisualisation",
  favoriteAdd: "Ajouter la police aux favoris",
  favoriteRemove: "Retirer la police des favoris",
  viewDetails: "Voir la fiche de la police",
  results: "fichiers de police",
  noResults: "Aucun fichier ne correspond à votre recherche.",
  loading: "Chargement des fichiers…",
  error: "Impossible de charger les fichiers. Réessayez.",
  retry: "Réessayer",
  download: "Voir et télécharger",
  licenseLabel: "Licence",
  licenseUnknown: "Consultez la licence à la source avant utilisation.",
  source: "Source",
  previous: "Précédent",
  next: "Suivant",
  home: "Accueil",
  mainNavigation: "Navigation principale",
  designFonts: "Polices de design",
  blog: "Blog",
  allCategories: "Parcourir les styles",
  language: "العربية",
  familyCountLabel: (count: number) => count === 1 ? "famille de polices" : "familles de polices",
  fileCountLabel: (count: number) => count === 1 ? "fichier de police" : "fichiers de police",
  variantCountLabel: (count: number) => count === 1 ? "variante" : "variantes",
  footerAbout: "À propos",
  footerContact: "Contact",
  footerPrivacy: "Confidentialité",
  footerTerms: "Conditions",
  emptyCategory: "Cette catégorie n’est pas disponible.",
  faqHeading: "Questions fréquentes",
  faqs: [
    {
      question: "Puis-je prévisualiser du texte arabe avant de télécharger une police ?",
      answer:
        "Oui. Saisissez un exemple dans le champ de prévisualisation pour comparer le rendu des fichiers proposés. La couverture des caractères et le façonnage peuvent varier : testez le texte exact que vous utiliserez.",
    },
    {
      question: "Toutes les polices sont-elles gratuites pour un usage commercial ?",
      answer:
        "Les conditions varient selon la police. Consultez la licence et la source du fichier concerné avant tout usage commercial ou redistribution.",
    },
    {
      question: "Quels formats de fichiers sont disponibles ?",
      answer:
        "Le format varie selon le fichier. Vérifiez le format indiqué et sa compatibilité avec votre système ou application.",
    },
  ],
};

export type InternationalHomeCopy = typeof englishHome | typeof frenchHome;

export const frenchCategories: InternationalCategory[] = [
  {
    slug: "thuluth",
    arabicCategory: "ثلث",
    name: "Thuluth",
    heading: "Polices arabes Thuluth",
    guide: ["Le thuluth (« un tiers ») est l'un des six styles classiques de la calligraphie arabe. Ses hampes verticales, ses courbes profondes et ses lettres superposées en font l'écriture des inscriptions de mosquées et des titres d'ouvrages.", "Les polices thuluth simplifient le style manuscrit pour qu'il puisse être tapé. Utilisez-les pour les grands titres, les logos traditionnels, les diplômes et les tableaux, mais pas pour les longs paragraphes."],
    title: "Police Thuluth gratuite — calligraphie arabe Thuluth | xfontat",
    description: "Téléchargez des polices arabes Thuluth gratuites. Prévisualisez votre texte en calligraphie Thuluth et vérifiez le format et la licence de chaque police.",
    intro:
      "Cette collection regroupe des fichiers classés dans la catégorie Thuluth. Les formes et les ornements varient : prévisualisez le texte et la taille prévus pour votre création.",
    uses: ["Titres", "Invitations", "Compositions décoratives"],
    faqs: [
      {
        question: "Comment comparer des polices Thuluth ?",
        answer:
          "Prévisualisez les mêmes noms ou phrases dans chaque fichier et comparez leur lisibilité à la taille prévue.",
      },
      {
        question: "Le Thuluth convient-il aux longs textes ?",
        answer:
          "La lisibilité dépend du dessin de chaque police et de sa taille. Testez un extrait représentatif avant de l’utiliser pour un texte long.",
      },
    ],
  },
  {
    slug: "diwani",
    arabicCategory: "ديواني",
    name: "Diwani",
    heading: "Polices arabes Diwani",
    guide: ["Le diwani est né à la chancellerie ottomane pour les décrets officiels. Les lettres s'inclinent, s'arrondissent et se superposent, si bien que l'écriture forme un seul ornement fluide.", "Les polices diwani conviennent aux faire-part de mariage, aux prénoms, aux cartes de vœux et aux logos décoratifs. Gardez un texte court et vérifiez la lisibilité des noms et des dates."],
    title: "Police Diwani gratuite — calligraphie arabe Diwani | xfontat",
    description: "Téléchargez des polices arabes Diwani gratuites. Prévisualisez prénoms et phrases courtes en calligraphie Diwani et vérifiez la licence.",
    intro:
      "La catégorie Diwani rassemble des fichiers aux formes fluides et décoratives variées. Comparez chaque fichier avec votre texte et l’espace disponible.",
    uses: ["Invitations", "Certificats", "Titres décoratifs"],
    faqs: [
      {
        question: "Comment choisir une police Diwani pour une invitation ?",
        answer:
          "Prévisualisez les noms, les dates et les informations importantes à la taille prévue. Vérifiez que les ornements ne nuisent pas à la lisibilité.",
      },
      {
        question: "Toutes les polices Diwani sont-elles utilisables à des fins commerciales ?",
        answer:
          "Ne le présumez pas. Consultez la licence et la source du fichier concerné avant tout usage commercial.",
      },
    ],
  },
  {
    slug: "ruqaa",
    arabicCategory: "رقعة",
    name: "Ruqah",
    heading: "Polices arabes Ruqaa",
    guide: ["Le ruqaa (ou riqa) est le style le plus répandu de l'écriture arabe manuscrite au quotidien. Rapide à tracer, il a des traits courts, peu d'ornements et des points souvent liés en petits tirets.", "Les polices ruqaa donnent un aspect manuscrit et décontracté. Elles conviennent aux affiches, aux visuels pour les réseaux sociaux, aux emballages alimentaires et aux titres courts."],
    title: "Police Ruqaa gratuite — écriture arabe manuscrite Riqa | xfontat",
    description: "Téléchargez des polices arabes Ruqaa (Riqa) gratuites, le style de l'écriture arabe manuscrite courante. Prévisualisez votre texte et vérifiez la licence.",
    intro:
      "Les fichiers de la catégorie Ruqah peuvent différer par la forme et l’espacement des lettres. Prévisualisez les mots concernés et consultez les détails de chaque fichier.",
    uses: ["Titres courts", "Visuels pour réseaux sociaux", "Étiquettes"],
    faqs: [
      {
        question: "Comment tester une police Ruqah pour un visuel ?",
        answer:
          "Prévisualisez le texte réel à sa taille finale et vérifiez qu’il reste lisible sur l’écran ou le support d’impression prévu.",
      },
      {
        question: "Les polices Ruqah conviennent-elles au texte courant ?",
        answer:
          "Cela dépend du fichier et de la taille de lecture. Testez un paragraphe représentatif avant de l’utiliser pour un texte long.",
      },
    ],
  },
  {
    slug: "kufi",
    arabicCategory: "كوفي",
    name: "Kufi",
    heading: "Polices arabes coufiques (Kufi)",
    guide: ["Le coufique est le plus ancien style de calligraphie arabe, utilisé dans les premiers manuscrits du Coran et en architecture. Il est fait de lignes droites et d'angles ; sa variante carrée se compose sur une grille.", "Les polices coufiques modernes comprennent de nombreux caractères géométriques et épurés, proches d'un sans-serif. Elles sont prisées pour les logos, les applications, les sites web et la signalétique."],
    title: "Police Kufi gratuite — polices arabes coufiques et géométriques | xfontat",
    description: "Téléchargez des polices arabes coufiques gratuites, du coufique classique aux styles géométriques modernes. Prévisualisez votre texte et vérifiez la licence.",
    intro:
      "La catégorie Kufi rassemble différents fichiers de polices arabes, notamment des styles géométriques. Comparez les formes et l’espacement selon les besoins du projet.",
    uses: ["Logos", "Titres", "Compositions géométriques"],
    faqs: [
      {
        question: "Comment comparer des styles Kufi ?",
        answer:
          "Utilisez le même texte d’exemple pour chaque fichier et comparez les formes, l’espacement et la lisibilité dans la mise en page finale.",
      },
      {
        question: "Une police Kufi peut-elle convenir à un logo ?",
        answer:
          "Un fichier peut convenir, mais testez le nom de marque à différentes tailles et vérifiez la licence avant utilisation.",
      },
    ],
  },
  {
    slug: "naskh",
    arabicCategory: "نسخ",
    name: "Naskh",
    heading: "Polices arabes Naskh",
    guide: ["Le naskh est l'écriture classique de la copie des livres et du Coran, et le modèle de la plupart des textes imprimés en arabe. Ses lettres arrondies et équilibrées se lisent facilement dans les longs passages.", "Choisissez une police naskh pour le texte courant, les livres, les rapports, les sous-titres et les sites web. Vérifiez qu'elle gère les voyelles (tachkil) si votre texte est vocalisé."],
    title: "Police Naskh gratuite — polices arabes de texte | xfontat",
    description: "Téléchargez des polices arabes Naskh gratuites pour les livres, documents et sites web. Prévisualisez des paragraphes et vérifiez la licence de chaque police.",
    intro:
      "Les fichiers classés Naskh peuvent différer par leurs proportions, la couverture des caractères et la prise en charge des signes diacritiques. Testez un contenu représentatif.",
    uses: ["Livres", "Articles", "Textes longs"],
    faqs: [
      {
        question: "Comment évaluer une police Naskh pour un texte long ?",
        answer:
          "Prévisualisez un paragraphe représentatif à la taille et à l’interlignage prévus. Vérifiez les caractères et signes diacritiques nécessaires.",
      },
      {
        question: "Tous les fichiers Naskh prennent-ils en charge les signes diacritiques arabes ?",
        answer:
          "La prise en charge varie selon le fichier. Testez les mots et signes voulus et consultez les informations du fichier.",
      },
    ],
  },
  {
    slug: "tasmeem",
    arabicCategory: "تصميم",
    name: "Polices arabes de design",
    heading: "Polices arabes décoratives",
    guide: ["Les polices décoratives sont faites pour les grands formats : titres, affiches, emballages et vidéos. Beaucoup mêlent formes traditionnelles et formes modernes, contours ou textures.", "Comme elles privilégient la personnalité à la lisibilité, utilisez-les pour quelques mots et associez-les à une police naskh ou coufique simple pour le reste du texte."],
    title: "Polices arabes décoratives gratuites — titres et logos | xfontat",
    description: "Téléchargez des polices arabes décoratives gratuites pour logos, affiches, miniatures et réseaux sociaux. Prévisualisez votre texte et vérifiez la licence.",
    intro:
      "Cette catégorie pratique rassemble différents fichiers de polices arabes. Vérifiez la couverture des caractères, le format et la licence de chaque fichier.",
    uses: ["Affiches", "Visuels pour réseaux sociaux", "Présentations"],
    faqs: [
      {
        question: "Comment choisir une police arabe pour un projet de design ?",
        answer:
          "Comparez plusieurs fichiers avec le texte et la mise en page réels. Vérifiez la lisibilité, les caractères nécessaires, le format et la licence.",
      },
      {
        question: "Tous les fichiers fonctionnent-ils dans mon logiciel de design ?",
        answer:
          "La compatibilité dépend du format, du système et de la version du logiciel. Consultez sa documentation et testez le fichier.",
      },
    ],
  },
  {
    slug: "graffiti",
    arabicCategory: "خطوط الحرة",
    name: "Polices arabes manuscrites",
    heading: "Polices arabes manuscrites et libres",
    guide: ["Les polices libres imitent le pinceau, le marqueur ou le lettrage urbain plutôt qu'un style calligraphique classique. Chaque dessin a son propre rythme.", "Elles conviennent aux pochettes d'album, aux affiches urbaines, aux t-shirts et aux publications sur les réseaux sociaux. Testez les mots exacts, car certaines ne couvrent que les lettres arabes de base."],
    title: "Polices arabes manuscrites gratuites — styles libres | xfontat",
    description: "Téléchargez des polices arabes manuscrites gratuites, styles pinceau, marqueur et graffiti. Prévisualisez votre texte et vérifiez la licence de chaque police.",
    intro:
      "Les fichiers de cette catégorie présentent des formes expressives variées. Testez les mots réels et vérifiez la présence des caractères nécessaires.",
    uses: ["Titres courts", "Affiches", "Visuels expressifs"],
    faqs: [
      {
        question: "Les polices manuscrites arabes conviennent-elles aux paragraphes ?",
        answer:
          "La lisibilité dépend du fichier et de sa taille. Testez un paragraphe représentatif ; ces styles sont souvent plus faciles à évaluer sur un texte court.",
      },
      {
        question: "Le nom de catégorie « manuscrite » signifie-t-il que la police est gratuite ?",
        answer:
          "Non. Le nom décrit un style, pas une licence. Consultez la licence de chaque fichier avant utilisation.",
      },
    ],
  },
  {
    slug: "photoshop",
    arabicCategory: "فوتوشوب",
    name: "Polices arabes pour logiciels de design",
    heading: "Polices arabes pour Photoshop et logiciels de design",
    guide: ["Ces polices sont appréciées des graphistes sous Photoshop, Illustrator, InDesign, Canva et les logiciels de montage. Pour afficher l'arabe correctement, le logiciel doit gérer l'écriture de droite à gauche.", "Dans Photoshop, activez le moteur de texte pour le Moyen-Orient (Préférences > Texte) afin que les lettres se lient. Des lettres séparées ou inversées viennent du logiciel, pas de la police."],
    title: "Polices arabes pour Photoshop gratuites | xfontat",
    description: "Téléchargez des polices arabes gratuites pour Photoshop, Illustrator, Canva et autres logiciels de design. Prévisualisez votre texte et vérifiez la licence.",
    intro:
      "Cette catégorie de bibliothèque ne garantit pas la compatibilité. Vérifiez le format et testez le façonnage arabe et le sens du texte dans votre version du logiciel.",
    uses: ["Retouche d’image", "Affiches", "Mises en page"],
    faqs: [
      {
        question: "Toutes les polices de cette catégorie fonctionnent-elles dans Photoshop ?",
        answer:
          "La catégorie ne garantit pas la compatibilité. Vérifiez le format et testez le façonnage arabe avec votre version de Photoshop et votre système.",
      },
      {
        question: "Que vérifier avant d’utiliser un fichier de police ?",
        answer:
          "Confirmez le format, testez les caractères et le sens du texte nécessaires, puis consultez la licence et la source.",
      },
    ],
  },
  {
    slug: "nastaliq",
    arabicCategory: "نستعليق",
    name: "Nastaliq",
    heading: "Polices Nastaliq",
    guide: ["Le nastaliq est né en Perse aux XIVe et XVe siècles et reste le principal style calligraphique du persan et de l'ourdou. Les mots descendent de droite à gauche, ce qui lui donne un rythme léger et suspendu.", "Les polices nastaliq sont idéales pour la poésie, les couvertures de livres et les titres élégants. Beaucoup incluent les lettres propres au persan et à l'ourdou, comme پ, چ, گ et ے."],
    title: "Police Nastaliq gratuite — calligraphie persane et ourdou | xfontat",
    description: "Téléchargez des polices Nastaliq gratuites pour la calligraphie persane, ourdoue et arabe. Prévisualisez votre texte et vérifiez la licence.",
    intro:
      "Les fichiers Nastaliq peuvent différer par la couverture des caractères et leur comportement de façonnage. Prévisualisez le texte exact et la langue visés.",
    uses: ["Titres", "Compositions courtes", "Mises en page multilingues"],
    faqs: [
      {
        question: "Comment tester un fichier Nastaliq ?",
        answer:
          "Prévisualisez des mots représentatifs dans la langue visée et vérifiez les ligatures, les signes diacritiques et l’espacement dans votre logiciel.",
      },
      {
        question: "Puis-je utiliser un fichier Nastaliq à des fins commerciales ?",
        answer:
          "Consultez la licence du fichier concerné avant tout usage commercial ou redistribution.",
      },
    ],
  },
];

export function getEnglishCategory(slug: string | undefined) {
  return englishCategories.find((category) => category.slug === slug);
}

export function getFrenchCategory(slug: string | undefined) {
  return frenchCategories.find((category) => category.slug === slug);
}
