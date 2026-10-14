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

export function getEnglishCategory(slug: string | undefined) {
  return englishCategories.find((category) => category.slug === slug);
}
