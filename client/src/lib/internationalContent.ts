export interface InternationalCategory {
  slug: string;
  arabicCategory: string;
  name: string;
  title: string;
  description: string;
  intro: string;
  uses: string[];
  faqs: { question: string; answer: string }[];
}

export const englishHome = {
  title: "Arabic Fonts — Browse and Preview | xfontat",
  description:
    "Browse Arabic font styles, preview Arabic text, and check the format and license information listed for each file.",
  heading: "Arabic fonts to browse and preview",
  intro:
    "Explore Arabic font files by style, preview your own text, and check each file’s format and license information before using it.",
  aboutHeading: "Explore Arabic typography",
  about:
    "Arabic typefaces vary in letterforms, character coverage, and file format. Preview the text you plan to use, check the file details, and confirm its license before including it in a project.",
  licenseHeading: "Check the details for each font",
  license:
    "Available formats and usage terms can differ from one file to another. Review the source and license details on the individual font record before commercial use or redistribution.",
  searchLabel: "Search fonts",
  searchPlaceholder: "Search by font name…",
  previewLabel: "Preview text",
  previewPlaceholder: "Enter Arabic text to preview…",
  results: "font files",
  noResults: "No font files match your search.",
  loading: "Loading font files…",
  error: "Font files could not be loaded. Please try again.",
  retry: "Try again",
  download: "Download file",
  licenseLabel: "License",
  licenseUnknown: "Check the source license before use.",
  source: "Source",
  previous: "Previous",
  next: "Next",
  home: "Home",
  allCategories: "Browse styles",
  language: "العربية",
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
    title: "Thuluth Arabic Fonts to Preview | xfontat",
    description:
      "Browse Arabic font files classified as Thuluth, preview sample text, and check the format and license details for each file.",
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
    title: "Diwani Arabic Fonts to Preview | xfontat",
    description:
      "Browse Arabic font files classified as Diwani, preview their letterforms, and review file details before use.",
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
    title: "Ruqah Arabic Fonts to Preview | xfontat",
    description:
      "Browse Arabic font files classified as Ruqah and compare how sample text looks at your intended display size.",
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
    title: "Kufi Arabic Fonts to Preview | xfontat",
    description:
      "Browse Arabic font files classified as Kufi, including varied geometric forms, and preview them with your own text.",
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
    title: "Naskh Arabic Fonts to Preview | xfontat",
    description:
      "Browse Arabic font files classified as Naskh and test letter clarity and diacritics with your own text.",
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
    title: "Arabic Design Fonts to Preview | xfontat",
    description:
      "Browse Arabic font files in the design category, preview sample text, and check each file’s format and license.",
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
    title: "Freehand Arabic Fonts to Preview | xfontat",
    description:
      "Browse Arabic font files classified as freehand or graffiti styles and preview them before use.",
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
    title: "Arabic Fonts in the Photoshop Category | xfontat",
    description:
      "Browse Arabic font files listed in the Photoshop category and check format, Arabic support, and license before use.",
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
    title: "Nastaliq Arabic Fonts to Preview | xfontat",
    description:
      "Browse font files classified as Nastaliq and test the language characters and shaping required by your text.",
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
  title: "Polices arabes — Parcourir et prévisualiser | xfontat",
  description:
    "Parcourez des styles de polices arabes, prévisualisez du texte et vérifiez le format et la licence indiqués pour chaque fichier.",
  heading: "Polices arabes à parcourir et à prévisualiser",
  intro:
    "Explorez les fichiers de polices arabes par style, prévisualisez votre texte et vérifiez le format et la licence de chaque fichier avant de l’utiliser.",
  aboutHeading: "Explorer la typographie arabe",
  about:
    "Les polices arabes diffèrent par la forme des lettres, la couverture des caractères et le format. Prévisualisez le texte prévu, consultez les détails du fichier et vérifiez sa licence avant de l’utiliser dans un projet.",
  licenseHeading: "Vérifier les détails de chaque police",
  license:
    "Les formats disponibles et les conditions d’utilisation varient selon les fichiers. Consultez la source et la licence de chaque fichier avant tout usage commercial ou redistribution.",
  searchLabel: "Rechercher des polices",
  searchPlaceholder: "Rechercher par nom…",
  previewLabel: "Texte de prévisualisation",
  previewPlaceholder: "Saisissez un texte arabe à prévisualiser…",
  results: "fichiers de police",
  noResults: "Aucun fichier ne correspond à votre recherche.",
  loading: "Chargement des fichiers…",
  error: "Impossible de charger les fichiers. Réessayez.",
  retry: "Réessayer",
  download: "Télécharger le fichier",
  licenseLabel: "Licence",
  licenseUnknown: "Consultez la licence à la source avant utilisation.",
  source: "Source",
  previous: "Précédent",
  next: "Suivant",
  home: "Accueil",
  allCategories: "Parcourir les styles",
  language: "العربية",
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

export const frenchCategories: InternationalCategory[] = [
  {
    slug: "thuluth",
    arabicCategory: "ثلث",
    name: "Thuluth",
    title: "Polices arabes Thuluth à prévisualiser | xfontat",
    description:
      "Parcourez les fichiers arabes classés dans la catégorie Thuluth, prévisualisez du texte et vérifiez le format et la licence de chaque fichier.",
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
    title: "Polices arabes Diwani à prévisualiser | xfontat",
    description:
      "Parcourez les fichiers arabes classés Diwani, prévisualisez leurs formes et consultez les détails avant utilisation.",
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
    title: "Polices arabes Ruqah à prévisualiser | xfontat",
    description:
      "Parcourez les fichiers arabes classés Ruqah et comparez leur rendu à la taille prévue pour votre création.",
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
    title: "Polices arabes Kufi à prévisualiser | xfontat",
    description:
      "Parcourez les fichiers arabes classés Kufi, dont différents styles géométriques, et prévisualisez votre propre texte.",
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
    title: "Polices arabes Naskh à prévisualiser | xfontat",
    description:
      "Parcourez les fichiers arabes classés Naskh et testez la lisibilité et les signes diacritiques avec votre texte.",
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
    title: "Polices arabes de design à prévisualiser | xfontat",
    description:
      "Parcourez les fichiers arabes de la catégorie design, prévisualisez du texte et consultez le format et la licence.",
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
    title: "Polices arabes manuscrites à prévisualiser | xfontat",
    description:
      "Parcourez les fichiers arabes classés manuscrits ou graffiti et prévisualisez-les avant utilisation.",
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
    title: "Fichiers arabes de la catégorie Photoshop | xfontat",
    description:
      "Parcourez les fichiers arabes de la catégorie Photoshop et vérifiez le format, la prise en charge de l’arabe et la licence.",
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
    title: "Polices arabes Nastaliq à prévisualiser | xfontat",
    description:
      "Parcourez les fichiers classés Nastaliq et testez les caractères et le façonnage nécessaires à votre texte.",
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
