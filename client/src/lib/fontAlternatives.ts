// "Free alternative" pages: people search for a commercial or system font by
// name ("بديل خط الآيفون", "Tahoma Arabic alternative") and want a free font
// that looks similar. Each page names the original, then points to open-licence
// fonts from the library. Shared by the React page and server/seoHtml.ts.
//
// The originals are not hosted here; the alternatives are all published under
// the SIL Open Font License, which allows commercial use. "Similar" is our
// judgement of the style, not a claim that the fonts are identical.

import { familyOfFont, familyPath } from "./fontFamilies";

export type Locale = "ar" | "en" | "fr";
type Text = Record<Locale, string>;

type AltFont = { key: string; slug: string; name: string; nameAr: string; blurb: Text };

export const ALT_FONTS: AltFont[] = [
  { key: "ibmplex", slug: "ibm-plex-sans-arabic", name: "IBM Plex Sans Arabic", nameAr: "آي بي إم بلكس سانس عربي", blurb: {
    ar: "حروف واضحة ومحايدة بطابع تقني وأوزان متعددة، تناسب الواجهات والنصوص الطويلة.",
    en: "Clear, neutral letterforms with a technical feel and several weights; good for interfaces and long text.",
    fr: "Lettres nettes et neutres au caractère technique, en plusieurs graisses ; adaptée aux interfaces et aux textes longs." } },
  { key: "noto", slug: "noto-sans-arabic", name: "Noto Sans Arabic", nameAr: "نوتو سانس عربي", blurb: {
    ar: "تغطية واسعة للحروف والتشكيل ومظهر محايد قريب من خطوط النظام.",
    en: "Wide letter and diacritic coverage with a neutral look close to system fonts.",
    fr: "Large couverture des lettres et des voyelles, avec un aspect neutre proche des polices système." } },
  { key: "almarai", slug: "almarai", name: "Almarai", nameAr: "المراعي", blurb: {
    ar: "سانس حديث وبسيط، قراءته مريحة على الجوال والمواقع.",
    en: "A modern, simple sans that reads comfortably on phones and websites.",
    fr: "Une sans moderne et simple, confortable à lire sur mobile et sur le web." } },
  { key: "tajawal", slug: "tajawal-regular", name: "Tajawal", nameAr: "تجوال", blurb: {
    ar: "حروف هندسية نظيفة بأوزان كثيرة من الخفيف إلى الأسود، تناسب العناوين والواجهات.",
    en: "Clean geometric letters in many weights from light to black; suits headings and interfaces.",
    fr: "Lettres géométriques épurées en nombreuses graisses, du fin au noir ; idéale pour titres et interfaces." } },
  { key: "cairo", slug: "cairo-regular", name: "Cairo", nameAr: "القاهرة", blurb: {
    ar: "خط حديث يجمع بين روح الكوفي ووضوح السانس، يناسب المواقع والشعارات.",
    en: "A modern font mixing a Kufi spirit with sans clarity; suits websites and logos.",
    fr: "Une police moderne mêlant esprit koufique et clarté sans empattement ; pour sites et logos." } },
  { key: "mada", slug: "mada", name: "Mada", nameAr: "مدى", blurb: {
    ar: "سانس بسيط مصمم للشاشات بحواف مريحة للعين.",
    en: "A plain sans designed for screens, with comfortable shapes.",
    fr: "Une sans sobre conçue pour les écrans, aux formes confortables." } },
  { key: "readex", slug: "readex-pro", name: "Readex Pro", nameAr: "ريدكس برو", blurb: {
    ar: "مصمم لسهولة القراءة السريعة في الواجهات والتطبيقات.",
    en: "Designed for quick reading in interfaces and apps.",
    fr: "Conçue pour une lecture rapide dans les interfaces et les applications." } },
  { key: "alexandria", slug: "alexandria-regular", name: "Alexandria", nameAr: "الإسكندرية", blurb: {
    ar: "خط عصري بمظهر ودود يناسب العناوين والعلامات التجارية.",
    en: "A contemporary, friendly-looking font for headings and brands.",
    fr: "Une police contemporaine à l'allure chaleureuse pour titres et marques." } },
  { key: "notonaskh", slug: "noto-naskh-arabic", name: "Noto Naskh Arabic", nameAr: "نوتو نسخ عربي", blurb: {
    ar: "نسخ واضح بتغطية واسعة للتشكيل، يصلح للنصوص الطويلة.",
    en: "Clear Naskh with wide diacritic coverage; fine for long text.",
    fr: "Un naskh net avec une large couverture des voyelles ; adapté aux longs textes." } },
  { key: "amiri", slug: "amiri-regular", name: "Amiri", nameAr: "أميري", blurb: {
    ar: "نسخ كلاسيكي أنيق مستوحى من طباعة الكتب العربية القديمة، يناسب الكتب والمقالات.",
    en: "An elegant classical Naskh inspired by early Arabic book printing; for books and articles.",
    fr: "Un naskh classique et élégant inspiré de l'imprimerie arabe ancienne ; pour livres et articles." } },
  { key: "scheherazade", slug: "scheherazade-new", name: "Scheherazade New", nameAr: "شهرزاد الجديد", blurb: {
    ar: "نسخ تقليدي من SIL بتشكيل كامل، يناسب النصوص الدينية والأدبية.",
    en: "A traditional Naskh from SIL with full diacritics; suits religious and literary text.",
    fr: "Un naskh traditionnel de SIL avec voyelles complètes ; pour textes religieux et littéraires." } },
  { key: "lateef", slug: "lateef", name: "Lateef", nameAr: "لطيف", blurb: {
    ar: "نسخ بطابع خطي مرن من SIL، أقرب إلى كتابة اليد.",
    en: "A flexible, hand-written feeling Naskh from SIL.",
    fr: "Un naskh souple de SIL, proche de l'écriture manuscrite." } },
  { key: "markazi", slug: "markazi-text", name: "Markazi Text", nameAr: "مركزي", blurb: {
    ar: "نسخ مع لاتيني متوازن، مناسب للمقالات والنصوص ثنائية اللغة.",
    en: "A Naskh with a balanced Latin; good for articles and bilingual text.",
    fr: "Un naskh avec un latin équilibré ; pour articles et textes bilingues." } },
];

export type FontAlternative = {
  slug: string;
  name: string;
  nameAr: string;
  owner: Text;
  look: Text;
  alts: string[];
};

const SYSTEM_SANS_ALTS = ["noto", "ibmplex", "almarai", "readex"];
const NASKH_ALTS = ["amiri", "scheherazade", "notonaskh", "markazi"];
const GEOMETRIC_ALTS = ["tajawal", "cairo", "almarai", "mada"];

export const FONT_ALTERNATIVES: FontAlternative[] = [
  { slug: "sf-arabic", name: "SF Arabic", nameAr: "خط الآيفون",
    owner: { ar: "آبل", en: "Apple", fr: "Apple" },
    look: { ar: "سانس حديث نظيف هو خط واجهات الآيفون والآيباد والماك. ترخيصه من آبل مخصص لتطوير التطبيقات على منصاتها.", en: "A clean modern sans, the interface font of iPhone, iPad and Mac. Apple's licence limits it to developing apps for its platforms.", fr: "Une sans moderne et épurée, la police d'interface de l'iPhone, de l'iPad et du Mac. La licence d'Apple la limite au développement d'apps pour ses plateformes." },
    alts: ["ibmplex", "noto", "readex", "almarai"] },
  { slug: "tahoma", name: "Tahoma", nameAr: "خط تاهوما",
    owner: { ar: "مايكروسوفت", en: "Microsoft", fr: "Microsoft" },
    look: { ar: "سانس مدمج ومقروء بأحجام صغيرة، يأتي مع ويندوز وأوفيس ولا يُنشر للتحميل بترخيص حر.", en: "A compact sans that stays legible at small sizes. It ships with Windows and Office and is not published under a free licence.", fr: "Une sans compacte lisible en petite taille. Elle est livrée avec Windows et Office et n'est pas publiée sous licence libre." },
    alts: ["noto", "almarai", "mada", "ibmplex"] },
  { slug: "din-next-arabic", name: "DIN Next Arabic", nameAr: "خط دين نكست العربي",
    owner: { ar: "مونوتايب (لينوتايب)", en: "Monotype (Linotype)", fr: "Monotype (Linotype)" },
    look: { ar: "سانس هندسي صناعي بحروف منتظمة، شائع في الهويات والإعلانات، وهو خط تجاري بترخيص مدفوع.", en: "A geometric, industrial-looking sans with regular letters, common in branding and ads. It is a commercial font under a paid licence.", fr: "Une sans géométrique d'allure industrielle aux lettres régulières, courante en identité visuelle. C'est une police commerciale sous licence payante." },
    alts: ["tajawal", "cairo", "mada", "readex"] },
  { slug: "helvetica-neue-arabic", name: "Helvetica Neue Arabic", nameAr: "خط هلفتيكا نيو العربي",
    owner: { ar: "مونوتايب (لينوتايب)", en: "Monotype (Linotype)", fr: "Monotype (Linotype)" },
    look: { ar: "سانس محايد بتصميم متوازن يرافق اللاتيني هلفتيكا، وهو خط تجاري بترخيص مدفوع.", en: "A neutral, balanced sans designed to sit next to Helvetica Latin. It is a commercial font under a paid licence.", fr: "Une sans neutre et équilibrée conçue pour accompagner l'Helvetica latine. C'est une police commerciale sous licence payante." },
    alts: SYSTEM_SANS_ALTS },
  { slug: "geeza-pro", name: "Geeza Pro", nameAr: "خط جيزة برو",
    owner: { ar: "آبل", en: "Apple", fr: "Apple" },
    look: { ar: "نسخ حديث وواضح يأتي مع أنظمة آبل لعرض النصوص العربية العادية، ولا يُنشر للتحميل.", en: "A clear, modern Naskh that ships with Apple systems for everyday Arabic text. It is not published for download.", fr: "Un naskh moderne et net livré avec les systèmes Apple pour le texte arabe courant. Il n'est pas publié au téléchargement." },
    alts: ["notonaskh", "scheherazade", "amiri", "lateef"] },
  { slug: "bahij-the-sans-arabic", name: "Bahij TheSans Arabic", nameAr: "خط بهيج ذا سانس",
    owner: { ar: "بهيج (تجاري)", en: "Bahij (commercial)", fr: "Bahij (commercial)" },
    look: { ar: "سانس عربي حديث بأوزان كثيرة ومظهر ودود، شائع في المواقع والهويات، بترخيص تجاري مدفوع.", en: "A modern Arabic sans in many weights with a friendly look, common on websites and in branding, under a paid commercial licence.", fr: "Une sans arabe moderne en nombreuses graisses à l'allure amicale, courante sur le web et en identité visuelle, sous licence commerciale payante." },
    alts: GEOMETRIC_ALTS },
  { slug: "neo-sans-arabic", name: "Neo Sans Arabic", nameAr: "خط نيو سانس العربي",
    owner: { ar: "مونوتايب", en: "Monotype", fr: "Monotype" },
    look: { ar: "سانس عصري بحروف هندسية مستديرة، شائع في الشعارات والشاشات، وهو خط تجاري مدفوع.", en: "A contemporary sans with rounded geometric letters, common in logos and screens. It is a paid commercial font.", fr: "Une sans contemporaine aux lettres géométriques arrondies, courante dans les logos et les écrans. C'est une police commerciale payante." },
    alts: ["cairo", "tajawal", "readex", "alexandria"] },
  { slug: "frutiger-arabic", name: "Frutiger Arabic", nameAr: "خط فروتيجر العربي",
    owner: { ar: "مونوتايب (لينوتايب)", en: "Monotype (Linotype)", fr: "Monotype (Linotype)" },
    look: { ar: "سانس إنساني مقروء صُمم للافتات والشاشات، وهو خط تجاري بترخيص مدفوع.", en: "A humanist, legible sans designed for signage and screens. It is a commercial font under a paid licence.", fr: "Une sans humaniste et lisible conçue pour la signalétique et les écrans. C'est une police commerciale sous licence payante." },
    alts: ["noto", "almarai", "ibmplex", "mada"] },
  { slug: "myriad-arabic", name: "Myriad Arabic", nameAr: "خط ميريد العربي",
    owner: { ar: "أدوبي", en: "Adobe", fr: "Adobe" },
    look: { ar: "سانس مألوف ومحايد من أدوبي يأتي مع بعض برامجها، وهو خط تجاري بترخيص خاص.", en: "A familiar, neutral sans from Adobe bundled with some of its software. It is a commercial font under a proprietary licence.", fr: "Une sans neutre et familière d'Adobe livrée avec certains de ses logiciels. C'est une police commerciale sous licence propriétaire." },
    alts: SYSTEM_SANS_ALTS },
  { slug: "traditional-arabic", name: "Traditional Arabic", nameAr: "خط تراديشنال عربي",
    owner: { ar: "مايكروسوفت", en: "Microsoft", fr: "Microsoft" },
    look: { ar: "نسخ تقليدي يأتي مع ويندوز وأوفيس وهو الخط الافتراضي في كثير من ملفات وورد العربية.", en: "A traditional Naskh bundled with Windows and Office, the default in many Arabic Word files.", fr: "Un naskh traditionnel livré avec Windows et Office, la police par défaut de nombreux fichiers Word arabes." },
    alts: NASKH_ALTS },
  { slug: "arial-arabic", name: "Arial", nameAr: "خط أريال",
    owner: { ar: "مايكروسوفت (مونوتايب)", en: "Microsoft (Monotype)", fr: "Microsoft (Monotype)" },
    look: { ar: "سانس بسيط يأتي مع ويندوز وأوفيس ويُستخدم افتراضياً في كثير من المستندات العربية.", en: "A plain sans bundled with Windows and Office and used by default in many Arabic documents.", fr: "Une sans simple livrée avec Windows et Office, utilisée par défaut dans de nombreux documents arabes." },
    alts: ["noto", "almarai", "mada", "ibmplex"] },
  { slug: "sakkal-majalla", name: "Sakkal Majalla", nameAr: "خط ساكال مجلة",
    owner: { ar: "مايكروسوفت (تصميم مراد ساكال)", en: "Microsoft (designed by Mourad Sakkal)", fr: "Microsoft (dessinée par Mourad Sakkal)" },
    look: { ar: "نسخ خفيف مناسب للنصوص يأتي مع ويندوز وأوفيس ولا يُنشر للتحميل بترخيص حر.", en: "A light Naskh for running text that ships with Windows and Office and is not published under a free licence.", fr: "Un naskh léger pour le texte courant, livré avec Windows et Office, non publié sous licence libre." },
    alts: ["amiri", "notonaskh", "markazi", "scheherazade"] },
  { slug: "segoe-ui-arabic", name: "Segoe UI Arabic", nameAr: "خط سيجو يو آي العربي",
    owner: { ar: "مايكروسوفت", en: "Microsoft", fr: "Microsoft" },
    look: { ar: "سانس واجهات ويندوز وأوفيس بمظهر نظيف مقروء، ولا يُنشر للتحميل بترخيص حر.", en: "The clean, legible interface sans of Windows and Office, not published under a free licence.", fr: "La sans d'interface de Windows et d'Office, nette et lisible, non publiée sous licence libre." },
    alts: SYSTEM_SANS_ALTS },
  { slug: "janna-lt", name: "Janna LT", nameAr: "خط جنى",
    owner: { ar: "جهة تجارية", en: "a commercial foundry", fr: "une fonderie commerciale" },
    look: { ar: "سانس عربي واضح بأوزان عادي وعريض، منتشر في الإعلانات والمطبوعات، وهو خط تجاري بترخيص مدفوع.", en: "A clear Arabic sans in regular and bold, common in ads and print. It is a commercial font under a paid licence.", fr: "Une sans arabe claire en graisses normale et grasse, courante en publicité et en imprimé. C'est une police commerciale sous licence payante." },
    alts: GEOMETRIC_ALTS },
  { slug: "ge-ss", name: "GE SS", nameAr: "خط جي إي إس إس",
    owner: { ar: "جهة تجارية", en: "a commercial foundry", fr: "une fonderie commerciale" },
    look: { ar: "عائلة سانس عربية واسعة تُستخدم في الإعلام والإعلان، وهي خطوط تجارية بترخيص مدفوع.", en: "A broad family of Arabic sans fonts used in media and advertising. They are commercial fonts under a paid licence.", fr: "Une vaste famille de sans arabes utilisée dans les médias et la publicité. Ce sont des polices commerciales sous licence payante." },
    alts: GEOMETRIC_ALTS },
  { slug: "adobe-arabic", name: "Adobe Arabic", nameAr: "خط أدوبي عربي",
    owner: { ar: "أدوبي", en: "Adobe", fr: "Adobe" },
    look: { ar: "نسخ كلاسيكي بتباين هادئ مناسب للنصوص، يأتي مع برامج أدوبي وهو خط خاص بترخيصها.", en: "A classic Naskh with calm contrast for text, bundled with Adobe software under Adobe's licence.", fr: "Un naskh classique au contraste doux pour le texte, livré avec les logiciels Adobe sous leur licence." },
    alts: NASKH_ALTS },
];

export const alternativePath = (locale: Locale, slug: string) => (locale === "ar" ? `/alternative/${slug}` : `/${locale}/alternative/${slug}`);
export const alternativesHubPath = (locale: Locale) => (locale === "ar" ? "/alternatives" : `/${locale}/alternatives`);

export const findAlternative = (slug: string) => FONT_ALTERNATIVES.find((item) => item.slug === slug);

type LibraryFont = { slug: string; name: string; nameArabic: string; category: string; duplicateOf?: string | null; designer?: string | null; license?: string | null; fileUrl: string; fileName: string };

export type ResolvedAlternative<T extends LibraryFont> = AltFont & { font: T; familyPath?: string; weights: number };

// The alternatives that exist in the library, in the page's order.
export function resolveAlternatives<T extends LibraryFont>(original: FontAlternative, fonts: T[], locale: Locale): Array<ResolvedAlternative<T>> {
  const result: Array<ResolvedAlternative<T>> = [];
  for (const key of original.alts) {
    const alt = ALT_FONTS.find((item) => item.key === key);
    const font = alt && fonts.find((item) => item.slug === alt.slug && !item.duplicateOf);
    if (!alt || !font) continue;
    const family = familyOfFont(fonts, font);
    result.push({ ...alt, font, familyPath: family ? familyPath(locale, family.slug) : undefined, weights: family?.fonts.length ?? 1 });
  }
  return result;
}

const ORIGINAL_NAME = (original: FontAlternative, locale: Locale) => (locale === "ar" ? `${original.nameAr} (${original.name})` : original.name);

export function altDisplayName(alt: AltFont, locale: Locale) {
  return locale === "ar" ? `${alt.nameAr} (${alt.name})` : alt.name;
}

export function alternativeCopy(original: FontAlternative, locale: Locale, count: number, altNames: string[]) {
  const name = ORIGINAL_NAME(original, locale);
  const list = altNames.join(locale === "ar" ? "، " : ", ");
  if (locale === "fr") {
    return {
      title: `Alternative gratuite à ${original.name} en arabe : ${count} polices similaires | xfontat`,
      heading: `Alternative gratuite à ${original.name} pour l'arabe`,
      description: `Cherchez une police arabe gratuite proche de ${original.name} ? ${list} : aperçu de votre texte et téléchargement, licence libre SIL OFL.`.slice(0, 160),
      intro: `${original.name} (${original.owner.fr}) : ${original.look.fr} Si vous voulez un rendu proche sans payer de licence, voici ${count} polices arabes sous licence SIL Open Font License, utilisables aussi dans un projet commercial. La ressemblance est approximative : testez votre texte avant de choisir.`,
      faqs: [
        { question: `Quelle est la meilleure alternative gratuite à ${original.name} ?`, answer: `Parmi nos choix, ${altNames[0]} est le plus proche du style général. Comparez-la avec ${altNames.slice(1).join(", ")} sur votre propre texte.` },
        { question: `Ces polices sont-elles vraiment identiques à ${original.name} ?`, answer: "Non. Elles ont un style voisin mais des formes différentes. Aucune police libre ne reproduit exactement une police commerciale." },
        { question: "Puis-je les utiliser dans un projet commercial ?", answer: "Oui : elles sont publiées sous licence SIL Open Font License 1.1, qui autorise l'usage commercial. Conservez la mention de licence si vous redistribuez les fichiers." },
      ],
    };
  }
  if (locale === "en") {
    return {
      title: `Free ${original.name} Alternative for Arabic: ${count} Similar Fonts | xfontat`,
      heading: `Free alternative to ${original.name} for Arabic`,
      description: `Looking for a free Arabic font close to ${original.name}? ${list}: preview your text and download, with an open SIL OFL licence.`.slice(0, 160),
      intro: `${original.name} (${original.owner.en}): ${original.look.en} If you want a similar result without paying for a licence, here are ${count} Arabic fonts under the SIL Open Font License, which also allows commercial projects. The match is approximate, so test your own text before choosing.`,
      faqs: [
        { question: `What is the best free alternative to ${original.name}?`, answer: `Of our picks, ${altNames[0]} is closest in overall style. Compare it with ${altNames.slice(1).join(", ")} using your own text.` },
        { question: `Are these fonts identical to ${original.name}?`, answer: "No. They have a similar style but different letter shapes. No free font reproduces a commercial font exactly." },
        { question: "Can I use them in a commercial project?", answer: "Yes: they are published under the SIL Open Font License 1.1, which allows commercial use. Keep the licence notice if you redistribute the font files." },
      ],
    };
  }
  return {
    title: `بديل ${original.nameAr} (${original.name}) المجاني — ${count} خطوط عربية مشابهة | xfontat`,
    heading: `بديل ${original.nameAr} (${original.name}) المجاني`,
    description: `تبحث عن خط عربي مجاني قريب من ${original.nameAr} (${original.name})؟ ${list}: عاين نصك وحمّل الخط، بترخيص حر SIL OFL.`.slice(0, 160),
    intro: `${original.nameAr} (${original.name}) من ${original.owner.ar}: ${original.look.ar} وإن أردت نتيجة قريبة بلا شراء ترخيص، فهذه ${count} خطوط عربية بترخيص SIL Open Font License الذي يسمح أيضاً بالمشاريع التجارية. التشابه تقريبي وليس مطابقاً، فجرّب نصك قبل أن تختار.`,
    faqs: [
      { question: `ما أفضل بديل مجاني لـ${original.nameAr}؟`, answer: `من اختياراتنا، ${altNames[0]} أقربها إلى الطابع العام. قارنه بـ${altNames.slice(1).join("، ")} على نصك أنت.` },
      { question: `هل هذه الخطوط مطابقة لـ${original.nameAr}؟`, answer: "لا، فهي قريبة في الأسلوب لكن أشكال الحروف تختلف. لا يوجد خط مجاني يطابق خطاً تجارياً تماماً." },
      { question: "هل أستطيع استخدامها في مشروع تجاري؟", answer: "نعم، فهي منشورة بترخيص SIL Open Font License 1.1 الذي يسمح بالاستخدام التجاري. احتفظ بإشعار الترخيص إذا أعدت توزيع ملفات الخط." },
    ],
  };
}

export function alternativesHubCopy(locale: Locale) {
  if (locale === "fr") {
    return {
      title: "Alternatives gratuites aux polices arabes payantes | xfontat",
      heading: "Alternatives gratuites aux polices arabes payantes et système",
      description: "SF Arabic, Tahoma, DIN Next, Helvetica Neue Arabic, Geeza Pro… trouvez pour chacune une police arabe gratuite proche, sous licence libre.",
      intro: "Les polices système et commerciales ne se téléchargent pas librement. Choisissez celle que vous cherchez : nous proposons des polices arabes gratuites au style voisin, sous licence libre, avec aperçu de votre texte.",
    };
  }
  if (locale === "en") {
    return {
      title: "Free Alternatives to Paid and System Arabic Fonts | xfontat",
      heading: "Free alternatives to paid and system Arabic fonts",
      description: "SF Arabic, Tahoma, DIN Next, Helvetica Neue Arabic, Geeza Pro and more: find a free Arabic font with a similar style for each, under an open licence.",
      intro: "System and commercial fonts cannot be downloaded freely. Pick the one you are looking for: we suggest free Arabic fonts with a similar style, under an open licence, with a live preview of your text.",
    };
  }
  return {
    title: "بدائل مجانية للخطوط العربية المدفوعة وخطوط النظام | xfontat",
    heading: "بدائل مجانية للخطوط العربية المدفوعة وخطوط النظام",
    description: "خط الآيفون SF Arabic وتاهوما ودين نكست وهلفتيكا وجيزة برو وغيرها: لكل خط بديل عربي مجاني قريب منه بترخيص حر.",
    intro: "خطوط النظام والخطوط التجارية لا تُحمَّل مجاناً. اختر الخط الذي تبحث عنه وسنقترح لك خطوطاً عربية مجانية قريبة منه في الأسلوب بترخيص حر، مع معاينة لنصك.",
  };
}
