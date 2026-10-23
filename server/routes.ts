import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFontSchema } from "@shared/schema";
import { getGeneratedPosts } from "./blogGenerator";
import { blogPosts as staticBlogPosts } from "../client/src/lib/blogData";
import { collections } from "../client/src/lib/collectionsData";
import { getBlogInternalLinks } from "../client/src/lib/blogInternalLinks";
import { registerThumbnailRoutes } from "./thumbnailGenerator";
import { renderMarkdownToHtml } from "@shared/markdown";
import {
  englishCategories,
  englishHome,
  frenchCategories,
  frenchHome,
} from "../client/src/lib/internationalContent";
import {
  fullBlogTranslations,
  localizedBlogPosts,
} from "../client/src/lib/blogTranslations";
import {
  localizedCollections,
  localizedStaticPages,
} from "../client/src/lib/localizedPagesContent";
import {
  fontCharacterMap,
  getLocalizedFontWeightLabel,
  getLocalizedFontPageContent,
  localizedFontDetailCopy,
} from "../client/src/lib/localizedFontDetails";
import { detectFontFamily, groupFontsByFamily } from "../client/src/lib/fontFamily";

const categoryToSlug: Record<string, string> = {
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

function slugifyPart(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function generateLegacySlug(fontName: string): string {
  return `${slugifyPart(fontName)}-font`;
}

function generateSlug(fontName: string, fileName: string, category: string): string {
  const base = slugifyPart(fontName) || slugifyPart(fileName) || "arabic-font";
  return `${base}-${stableHash(`${category}/${fileName}`)}-font`;
}

function getCategoryLabel(category: string): string {
  return category.startsWith("خطوط ") ? category : `خطوط ${category}`;
}

function getPostDateModified(post: { dateISO: string; dateModified?: string }): string {
  return post.dateModified || post.dateISO;
}

async function renderBlogInternalLinks(post: {
  title: string;
  excerpt?: string;
  content?: string;
  keywords?: string[];
}): Promise<string> {
  const related = getBlogInternalLinks(post);
  const fonts = await storage.getFontsByCategories(related.categories.map(link => link.category));
  const categoryLinks = related.categories.map(link =>
    `<li><a href="/fonts/${link.slug}">${link.label}</a></li>`
  ).join("\n");
  const collectionLinks = related.collections.map(collection =>
    `<li><a href="/collection/${collection.slug}">${collection.titleArabic}</a></li>`
  ).join("\n");
  const fontLinks = fonts.slice(0, 4).map(font =>
    `<li><a href="/font/${generateSlug(font.name, font.fileName, font.category)}">${font.nameArabic}</a></li>`
  ).join("\n");

  return `
<aside aria-labelledby="related-fonts-heading">
<h2 id="related-fonts-heading">خطوط ومجموعات مرتبطة بموضوع المقال</h2>
<p>استكشف الخطوط العربية المناسبة لتطبيق النصائح الواردة في هذا المقال:</p>
<ul>${categoryLinks}${collectionLinks}${fontLinks}</ul>
</aside>`;
}

const BOT_AGENTS = [
  'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
  'yandexbot', 'facebot', 'ia_archiver', 'ahrefsbot', 'semrushbot',
  'mj12bot',
  // AI crawlers
  'gptbot', 'oai-searchbot', 'chatgpt-user', 'claudebot', 'perplexitybot', 'applebot', 'anthropic-ai',
  'cohere-ai', 'ai2bot', 'diffbot', 'imagesiftbot', 'omgilibot',
  // Social / share scrapers
  'twitterbot', 'linkedinbot', 'whatsapp', 'telegrambot', 'slackbot',
  'discordbot', 'facebookexternalhit', 'pinterestbot', 'snapchat',
  'vkshare', 'w3c_validator', 'embedly', 'quora link preview',
];

function isBot(userAgent: string): boolean {
  const ua = (userAgent || '').toLowerCase();
  return BOT_AGENTS.some(b => ua.includes(b));
}

const slugToCategory: Record<string, string> = {
  "thuluth": "ثلث",
  "diwani": "ديواني",
  "ruqaa": "رقعة",
  "kufi": "كوفي",
  "naskh": "نسخ",
  "tasmeem": "تصميم",
  "graffiti": "خطوط الحرة",
  "photoshop": "فوتوشوب",
  "nastaliq": "نستعليق",
};

const categoryContent: Record<string, { intro: string; history: string; usageTips: string; faq: string }> = {
  "ثلث": {
    intro: "خط الثلث أسلوب زخرفي من أساليب الخط العربي. تختلف النماذج الرقمية في تفاصيل الحروف والزخارف، لذا عاين كل خط بالحجم الذي سيظهر به.",
    history: "توجد روايات متعددة حول تسمية الخط وتطوره. لا نعرض هنا تاريخاً أو نسبةً إلى خطاط بعينه من دون مصدر موثوق مرتبط بالمعلومة.",
    usageTips: "يمكن اختبار نماذج الثلث في اللوحات والعناوين المعمارية. تحقق من وضوح النص في الحجم النهائي، وراجع النص مع مصدر موثوق أو مختص قبل استخدامه في مادة دينية.",
    faq: "هل يصلح خط الثلث للشاشات الرقمية؟ اختبر وضوحه في الحجم والسياق المقصودين. راجع ترخيص الملف قبل أي استخدام تجاري أو إعادة توزيع."
  },
  "ديواني": {
    intro: "خط الديواني أسلوب انسيابي مزخرف من أساليب الخط العربي. يمكن تجربته في الدعوات والشهادات والعناوين الفنية، مع اختبار وضوح النص في حجمه النهائي.",
    history: "تطورت للخط الديواني أنماط متعددة، منها الديواني والديواني الجلي. تختلف كثافة الزخرفة والتداخل بين الخطوط الرقمية، لذا ينبغي معاينة كل خط على حدة.",
    usageTips: "يمكن تجربته في بطاقات المناسبات والشهادات والعناوين الزخرفية. اترك مساحة كافية حول النص، وتحقق من وضوح الأسماء والتواريخ. تجنب الفقرات الطويلة إذا صعبت قراءتها.",
    faq: "ما الفرق بين الديواني والديواني الجلي؟ تختلف الأنماط في مقدار الزخرفة والتداخل، لذلك قارن النماذج المعروضة. التنزيل المجاني لا يعني بالضرورة السماح بكل أنواع الاستخدام؛ راجع ترخيص كل خط."
  },
  "رقعة": {
    intro: "خط الرقعة أسلوب مختصر من أساليب الخط العربي. جرّبه في الكتابة والعناوين القصيرة، واختبر وضوح الحروف في التصميم والحجم المستهدفين.",
    history: "توجد للرقعة خطوط رقمية متعددة تختلف في أشكال الحروف وتفاصيلها. لا ننسب تاريخاً أو شخصاً بعينه هنا دون مرجع موثوق ظاهر للقارئ.",
    usageTips: "يمكن تجربته في منشورات التواصل والعناوين واللافتات. راجع شكل الحروف واتصالها على أحجام وأجهزة مختلفة، ولا تعتمد مقاساً ثابتاً لكل مشروع.",
    faq: "هل خط الرقعة مناسب للمواقع الإلكترونية؟ جرّبه على الأجهزة المستهدفة واختبر وضوحه. هل يصلح للفقرات الطويلة؟ يعتمد ذلك على تصميم الخط وحجمه."
  },
  "كوفي": {
    intro: "تضم فئة الكوفي أنماطاً متعددة، من بينها أشكال هندسية ومربعة. يمكن اختبار هذه الأنماط في الشعارات والعناوين بحسب وضوح الحروف واحتياجات التصميم.",
    history: "تختلف أشكال الخط الكوفي بين نماذج هندسية وزخرفية وغيرها. تُعرض هنا الخطوط المتاحة ضمن هذا التصنيف، من دون ترتيب تاريخي أو ادعاء بأسبقية غير موثقة.",
    usageTips: "يمكن تجربة بعض أنماطه في الشعارات والزخارف والعناوين. اختبر وضوح الحروف والتباين، واترك مساحة حول النص بحسب التصميم.",
    faq: "هل الكوفي مناسب للنصوص الطويلة؟ يعتمد ذلك على تصميم الخط وحجمه؛ اختبر عينة فعلية قبل اعتماده. ما أنواعه؟ تختلف الأشكال المعروضة بين الهندسي والزخرفي وغيرها."
  },
  "نسخ": {
    intro: "تُستخدم تسمية النسخ لأنماط متعددة من الخطوط العربية. قارن وضوح كل خط وتغطيته للحروف والتشكيل في النصوص والأحجام التي يحتاجها مشروعك.",
    history: "تطورت أنماط النسخ عبر مراحل مختلفة من الكتابة والطباعة. لا تُعرض هنا تواريخ أو نسب محددة لغياب مصدر تاريخي موثق بجانب هذا النص.",
    usageTips: "يمكن اختبار خطوط النسخ في الكتب والمواقع والتطبيقات والنصوص الطويلة. جرّب أحجاماً وأوزاناً مختلفة على المحتوى الفعلي، وتحقق من التشكيل.",
    faq: "ما الخط المناسب للمواقع؟ قارن الخطوط المتاحة على محتوى موقعك، مع اختبار القراءة والترخيص ودعم المتصفحات. هل يصلح النسخ للشعارات؟ قد يصلح بحسب شكل الخط وطبيعة الهوية."
  },
  "تصميم": {
    intro: "يضم تصنيف التصميم خطوطاً عربية بأنماط هندسية وتعبيرية متنوعة. افحص شكل كل ملف وتغطيته للحروف قبل اختياره للمشروع.",
    history: "هذا تصنيف عملي داخل المكتبة وليس سرداً لتاريخ الخطوط؛ لا تُعرض هنا تواريخ أو أعداد من دون مراجع موثوقة.",
    usageTips: "يمكن تجربة أنماط مختلفة في الإعلانات والمنشورات والهوية والعروض. اختبر وضوح الرسالة على المقاس الذي سيُنشر، وراجع الترخيص.",
    faq: "كيف أختار خط التصميم؟ قارن عدة خطوط على نص المشروع وحجمه الفعلي. لا يضمن اختيار الخط وحده زيادة التفاعل؛ راجع ترخيص كل ملف قبل الاستخدام التجاري."
  },
  "خطوط الحرة": {
    intro: "يضم تصنيف الخطوط الحرة نماذج تعبيرية وزخرفية. افحص الحروف والترخيص والصيغ المتاحة لكل ملف قبل استخدامه.",
    history: "لا نقدم هنا سرداً تاريخياً موثقاً لهذه الفئة؛ ينصبّ الوصف على الخطوط الرقمية المعروضة.",
    usageTips: "جرّب هذه الأنماط في العناوين والملصقات والنصوص القصيرة، واختبر القراءة قبل استخدامها في فقرات طويلة.",
    faq: "هل تناسب الخطوط الحرة النصوص الطويلة؟ يعتمد ذلك على تصميم الخط وحجمه؛ اختبر عينة فعلية. راجع ترخيص كل خط قبل الاستخدام التجاري."
  },
  "فوتوشوب": {
    intro: "«خطوط الفوتوشوب» اسم تصنيف في المكتبة ولا يضمن وحده توافق الملف مع إصدار محدد من Photoshop أو غيره. تحقق من الصيغة ودعم العربية داخل البرنامج.",
    history: "لا يُعرض هنا تاريخ موثق لهذه الفئة؛ افحص بيانات كل خط ومتطلبات البرنامج من مصدرها.",
    usageTips: "يمكن تجربة الخطوط في الملصقات وتحرير الصور والمنشورات. اختبر اتجاه النص والحروف داخل إصدار البرنامج، واتبع متطلبات الطباعة أو المنصة عند التصدير.",
    faq: "كيف أستخدم خطاً عربياً في Photoshop؟ اتبع وثائق إصدار البرنامج وثبّت صيغة مدعومة، ثم اختبر اتصال الحروف واتجاه النص. قد تختلف الإعدادات بين الإصدارات."
  },
  "نستعليق": {
    intro: "النستعليق نمط خطي تظهر في بعض نماذجه ميول وتراكيب مميزة. افحص دعم الملف للغة والنص الذي تريد كتابته قبل التنزيل.",
    history: "لا نعرض هنا تاريخاً أو نسبة اختراع للنستعليق من دون مصدر موثوق ظاهر للقارئ. راجع المراجع المتخصصة للمعلومات التاريخية.",
    usageTips: "تحقق من أن الملف يتضمن محارف اللغة المطلوبة، ثم اختبر النص والمسافات على التصميم النهائي.",
    faq: "كيف أختبر خط النستعليق؟ جرّب نصاً فعلياً وتحقق من اتصال الحروف والتشكيل ودعم اللغة. راجع الترخيص قبل الاستخدام التجاري."
  }
};

const SITE_NAME = 'xfontat';
const FALLBACK_OG_IMAGE = 'https://xfontat.com/logo.png';

interface BotPageOptions {
  lang?: "ar" | "en" | "fr";
  alternates?: { lang: string; href: string }[];
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function botHTML(
  title: string,
  description: string,
  canonical: string,
  h1: string,
  body: string,
  jsonLd?: object | object[],
  image?: string,
  options: BotPageOptions = {}
): string {
  const lang = options.lang || "ar";
  const ogImage = image || FALLBACK_OG_IMAGE;
  const alternateLinks = (options.alternates || [])
    .map(({ lang: alternateLang, href }) =>
      `<link rel="alternate" hreflang="${escapeHtml(alternateLang)}" href="${escapeHtml(href)}">`
    )
    .join("\n");
  const navigation = lang === "en"
    ? `<nav aria-label="Main navigation">
<a href="/en">Home</a> |
${englishCategories.map((category) => `<a href="/en/fonts/${category.slug}">${category.name}</a>`).join(" | ")} |
<a href="/">العربية</a>
</nav>`
    : lang === "fr"
    ? `<nav aria-label="Navigation principale">
<a href="/fr">Accueil</a> |
${frenchCategories.map((category) => `<a href="/fr/fonts/${category.slug}">${category.name}</a>`).join(" | ")} |
<a href="/">العربية</a>
</nav>`
    : `<nav>
<a href="/">الرئيسية</a> |
<a href="/fonts/thuluth">خطوط الثلث</a> |
<a href="/fonts/diwani">خطوط الديواني</a> |
<a href="/fonts/ruqaa">خطوط الرقعة</a> |
<a href="/fonts/kufi">خطوط الكوفي</a> |
<a href="/fonts/naskh">خطوط النسخ</a> |
<a href="/fonts/tasmeem">خطوط التصميم</a> |
<a href="/fonts/graffiti">خطوط الحرة</a> |
<a href="/fonts/photoshop">خطوط الفوتوشوب</a> |
<a href="/fonts/nastaliq">خطوط النستعليق</a> |
<a href="/design-fonts">خطوط التصميم الحديث</a> |
<a href="/about">من نحن</a> |
<a href="/blog">المدونة</a> |
<a href="/contact">اتصل بنا</a> |
<a href="/en">English</a>
</nav>`;
  const jsonLdScript = jsonLd
    ? `<script type="application/ld+json">${JSON.stringify(Array.isArray(jsonLd) ? { "@context": "https://schema.org", "@graph": jsonLd } : jsonLd)}</script>`
    : '';
  return `<!DOCTYPE html>
<html lang="${lang}" dir="${lang === "ar" ? "rtl" : "ltr"}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="index, follow">
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="256x256" href="/favicon.png">
<link rel="shortcut icon" href="/favicon.ico">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">
${alternateLinks}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:alt" content="${title}">
<meta property="og:locale" content="${lang === "ar" ? "ar_AR" : lang === "fr" ? "fr_FR" : "en_US"}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@xfontat">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${ogImage}">
<meta name="twitter:image:alt" content="${title}">
<meta name="twitter:url" content="${canonical}">
${jsonLdScript}
</head>
<body>
<h1>${h1}</h1>
${body}
${navigation}
</body>
</html>`;
}

const KNOWN_ROUTE_PATTERNS = [
  /^\/$/,
  /^\/en\/?$/,
  /^\/en\/fonts\/[^/]+$/,
  /^\/fr\/?$/,
  /^\/fr\/fonts\/[^/]+$/,
  /^\/(?:en|fr)\/(?:font|collection|blog)\/[^/]+$/,
  /^\/(?:en|fr)\/(?:blog|design-fonts|about|contact|privacy|terms)\/?$/,
  /^\/(?:en|fr)\/youtube-thumbnail-maker\/?$/,
  /^\/design-fonts$/,
  /^\/blog$/,
  /^\/youtube-thumbnail-maker$/,
  /^\/about$/,
  /^\/contact$/,
  /^\/privacy$/,
  /^\/terms$/,
  /^\/font\/[^/]+$/,
  /^\/fonts\/[^/]+$/,
  /^\/blog\/[^/]+$/,
  /^\/collection\/[^/]+$/,
  /^\/sitemap\.xml$/,
  /^\/robots\.txt$/,
  /^\/api\//,
];

function isKnownRoute(path: string): boolean {
  return KNOWN_ROUTE_PATTERNS.some(p => p.test(path));
}

export async function registerRoutes(app: Express): Promise<Server> {
  registerThumbnailRoutes(app);

  // Dynamic rendering for search engine bots

  app.get("/font/:slug", async (req, res, next) => {
    const fonts = await storage.getAllFonts();
    let font = fonts.find(f => generateSlug(f.name, f.fileName, f.category) === req.params.slug);

    if (!font) {
      const legacyFont = fonts.find(f => generateLegacySlug(f.name) === req.params.slug);
      if (legacyFont) {
        return res.redirect(301, `/font/${generateSlug(legacyFont.name, legacyFont.fileName, legacyFont.category)}`);
      }
    }

    if (!font) {
      return res.status(404).send(botHTML(
        'الخط غير موجود | xfontat',
        'تعذر العثور على الخط المطلوب في مكتبة xfontat.',
        `https://xfontat.com/font/${req.params.slug}`,
        'الخط غير موجود',
        '<p>تعذر العثور على الخط المطلوب.</p><p><a href="/">العودة إلى الرئيسية</a></p>'
      ));
    }
    if (!isBot(req.headers['user-agent'] || '')) return next();
    const canonical = `https://xfontat.com/font/${req.params.slug}`;
    const title = `تحميل خط ${font.nameArabic} مجاناً | xfontat`;
    const formatInfo = font.fileFormat ? ` الصيغة المعروضة: ${font.fileFormat}.` : " راجع تفاصيل الصفحة لمعرفة الصيغة المتاحة.";
    const desc = `تصفّح خط ${font.nameArabic} (${font.name}) ضمن تصنيف ${font.category}.${formatInfo} راجع الترخيص قبل الاستخدام.`;
    const body = `
<p>${desc}</p>
<p>التصنيف: <a href="/fonts/${categoryToSlug[font.category] || font.category}">${font.category}</a></p>
<a href="${font.fileUrl}" download="${font.fileName}">تحميل الخط مجاناً</a>`;
    const jsonLd = [
      {
        "@type": "SoftwareApplication",
        "name": font.nameArabic,
        "alternateName": font.name,
        "applicationCategory": "DesignApplication",
        "url": canonical,
        "description": desc,
        "inLanguage": "ar",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "operatingSystem": "Windows, macOS, Linux",
        "downloadUrl": font.fileUrl,
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://xfontat.com/" },
          { "@type": "ListItem", "position": 2, "name": font.category, "item": `https://xfontat.com/fonts/${categoryToSlug[font.category] || font.category}` },
          { "@type": "ListItem", "position": 3, "name": font.nameArabic, "item": canonical },
        ]
      }
    ];
    res.send(botHTML(title, desc, canonical, font.nameArabic, body, jsonLd));
  });

  app.get("/fonts/:category", async (req, res, next) => {
    const arabicCat = slugToCategory[req.params.category];
    if (!arabicCat) {
      return res.status(404).send(botHTML(
        'التصنيف غير موجود | xfontat',
        'تعذر العثور على تصنيف الخطوط المطلوب في مكتبة xfontat.',
        `https://xfontat.com/fonts/${req.params.category}`,
        'التصنيف غير موجود',
        '<p>تعذر العثور على تصنيف الخطوط المطلوب.</p><p><a href="/">العودة إلى الرئيسية</a></p>'
      ));
    }
    if (!isBot(req.headers['user-agent'] || '')) return next();
    const fonts = await storage.getAllFonts();
    const catFonts = fonts.filter(f => f.category === arabicCat);
    const canonical = `https://xfontat.com/fonts/${req.params.category}`;
    const categoryLabel = getCategoryLabel(arabicCat);
    const title = `${categoryLabel} العربية - تحميل مجاني | xfontat`;
    const desc = `استكشف الخطوط ضمن تصنيف ${categoryLabel} وعاين الحروف. تختلف صيغ الملفات وتراخيصها؛ راجع صفحة كل خط.`;
    const links = catFonts.slice(0, 60).map(f =>
      `<li><a href="/font/${generateSlug(f.name, f.fileName, f.category)}">${f.nameArabic} - ${f.name}</a></li>`
    ).join('\n');
    const content = categoryContent[arabicCat];
    const richContent = content ? `
<h2>عن ${categoryLabel}</h2>
<p>${content.intro}</p>
<h2>تاريخ ${categoryLabel}</h2>
<p>${content.history}</p>
<h2>استخدامات ونصائح</h2>
<p>${content.usageTips}</p>
<h2>أسئلة شائعة عن ${categoryLabel}</h2>
<p>${content.faq}</p>
` : '';
    const body = `<p>${desc}</p>${richContent}<h2>قائمة ${categoryLabel} (${catFonts.length} خط)</h2><ul>${links}</ul>`;
    const jsonLd = [
      {
        "@type": "CollectionPage",
        "name": title,
        "description": desc,
        "url": canonical,
        "inLanguage": "ar",
        "isPartOf": { "@type": "WebSite", "name": "xfontat", "url": "https://xfontat.com" },
        "numberOfItems": catFonts.length,
      },
      {
        "@type": "ItemList",
        "name": categoryLabel,
        "numberOfItems": catFonts.length,
        "itemListElement": catFonts.slice(0, 20).map((f, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "item": {
            "@type": "SoftwareApplication",
            "name": f.nameArabic,
            "url": `https://xfontat.com/font/${generateSlug(f.name, f.fileName, f.category)}`,
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://xfontat.com/" },
          { "@type": "ListItem", "position": 2, "name": categoryLabel, "item": canonical },
        ]
      },
      ...(content ? [{
        "@type": "FAQPage",
        "mainEntity": [{ "@type": "Question", "name": content.faq.split('؟')[0] + '؟', "acceptedAnswer": { "@type": "Answer", "text": content.faq.split('؟').slice(1).join('؟') } }]
      }] : [])
    ];
    res.send(botHTML(
      title,
      desc,
      canonical,
      categoryLabel,
      body,
      jsonLd,
      undefined,
      {
        lang: "ar",
        alternates: [
          { lang: "ar", href: canonical },
          { lang: "en", href: `https://xfontat.com/en/fonts/${req.params.category}` },
          { lang: "fr", href: `https://xfontat.com/fr/fonts/${req.params.category}` },
          { lang: "x-default", href: canonical },
        ],
      }
    ));
  });

  app.get("/blog/:slug", async (req, res, next) => {
    const slug = req.params.slug;

    // Check static blog posts first
    const staticPost = staticBlogPosts.find(p => p.slug === slug);
    if (staticPost) {
      if (!isBot(req.headers['user-agent'] || '')) return next();
      const canonical = `https://xfontat.com/blog/${slug}`;
      const contentHtml = renderMarkdownToHtml(staticPost.content || '');
      const relatedLinksHtml = await renderBlogInternalLinks(staticPost);
      const body = `<p>${staticPost.excerpt || ''}</p>${contentHtml}${relatedLinksHtml}`;
      const jsonLd = [
        {
          "@type": "Article",
          "headline": staticPost.title,
          "description": staticPost.excerpt,
          "url": canonical,
          "inLanguage": "ar",
          "datePublished": staticPost.dateISO,
          "dateModified": getPostDateModified(staticPost),
          "publisher": { "@type": "Organization", "name": "xfontat", "url": "https://xfontat.com" },
          "keywords": staticPost.keywords?.join(', '),
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://xfontat.com/" },
            { "@type": "ListItem", "position": 2, "name": "المدونة", "item": "https://xfontat.com/blog" },
            { "@type": "ListItem", "position": 3, "name": staticPost.title, "item": canonical },
          ]
        }
      ];
      return res.send(botHTML(staticPost.title, staticPost.excerpt || staticPost.title, canonical, staticPost.title, body, jsonLd));
    }

    // Then check generated posts
    const posts = getGeneratedPosts();
    const post = posts.find(p => p.slug === slug);
    if (!post) {
      return res.status(404).send(botHTML(
        'المقال غير موجود | xfontat',
        'تعذر العثور على المقال المطلوب في مدونة xfontat.',
        `https://xfontat.com/blog/${slug}`,
        'المقال غير موجود',
        '<p>تعذر العثور على المقال المطلوب.</p><p><a href="/blog">العودة إلى المدونة</a></p>'
      ));
    }
    if (!isBot(req.headers['user-agent'] || '')) return next();
    const canonical = `https://xfontat.com/blog/${slug}`;
    const contentHtml = renderMarkdownToHtml(post.content || '');
    const relatedLinksHtml = await renderBlogInternalLinks(post);
    const body = `<p>${post.excerpt || ''}</p>${contentHtml}${relatedLinksHtml}`;
    const jsonLd = [
      {
        "@type": "Article",
        "headline": post.title,
        "description": post.excerpt,
        "url": canonical,
        "inLanguage": "ar",
        "datePublished": post.dateISO,
        "dateModified": getPostDateModified(post),
        "publisher": { "@type": "Organization", "name": "xfontat", "url": "https://xfontat.com" },
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://xfontat.com/" },
          { "@type": "ListItem", "position": 2, "name": "المدونة", "item": "https://xfontat.com/blog" },
          { "@type": "ListItem", "position": 3, "name": post.title, "item": canonical },
        ]
      }
    ];
    res.send(botHTML(post.title, post.excerpt || post.title, canonical, post.title, body, jsonLd));
  });

  app.get("/blog", (req, res, next) => {
    if (!isBot(req.headers['user-agent'] || '')) return next();
    const canonical = 'https://xfontat.com/blog';
    const title = 'مدونة xfontat - مقالات الخطوط العربية والتصميم';
    const desc = 'اقرأ أحدث مقالات الخطوط العربية والتصميم الجرافيكي. نصائح للمصممين حول اختيار الخطوط، استخداماتها وتاريخها.';
    const generatedPosts = getGeneratedPosts();
    const allPosts = [...staticBlogPosts, ...generatedPosts];
    const postLinks = allPosts.slice(0, 40).map(p =>
      `<li><a href="/blog/${p.slug}">${p.title}</a></li>`
    ).join('\n');
    const body = `<p>${desc}</p><h2>أحدث المقالات</h2><ul>${postLinks}</ul>`;
    const jsonLd = [
      {
        "@type": "CollectionPage",
        "name": title,
        "description": desc,
        "url": canonical,
        "inLanguage": "ar",
        "isPartOf": { "@type": "WebSite", "name": "xfontat", "url": "https://xfontat.com" },
        "numberOfItems": allPosts.length,
      },
      {
        "@type": "ItemList",
        "name": "مقالات مدونة xfontat",
        "numberOfItems": allPosts.length,
        "itemListElement": allPosts.slice(0, 20).map((p, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "item": { "@type": "Article", "headline": p.title, "url": `https://xfontat.com/blog/${p.slug}` }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://xfontat.com/" },
          { "@type": "ListItem", "position": 2, "name": "المدونة", "item": canonical },
        ]
      }
    ];
    res.send(botHTML(title, desc, canonical, 'مدونة xfontat', body, jsonLd));
  });

  app.get("/design-fonts", async (req, res, next) => {
    if (!isBot(req.headers['user-agent'] || '')) return next();
    const fonts = await storage.getAllFonts();
    const designFonts = fonts.filter(f => f.category === 'تصميم' || f.category === 'رقعة' || f.category === 'كوفي');
    const canonical = 'https://xfontat.com/design-fonts';
    const title = 'خطوط عربية للتصميم الحديث - تحميل مجاني | xfontat';
    const desc = "استكشف خطوطاً عربية للتصميم والهوية البصرية، وعاين النص بالحجم المستهدف. تختلف الصيغ والتراخيص؛ راجع صفحة كل خط.";
    const fontLinks = designFonts.slice(0, 50).map(f =>
      `<li><a href="/font/${generateSlug(f.name, f.fileName, f.category)}">${f.nameArabic}</a></li>`
    ).join('\n');
    const body = `
<p>${desc}</p>
<h2>اختبار خطوط التصميم</h2>
<p>قارن مظهر الحروف ووضوحها في الشعار أو المنشور المستهدف، وتحقق من الصيغة والترخيص في صفحة كل ملف.</p>
<h2>خطوط التصميم المتاحة</h2>
<ul>${fontLinks}</ul>
<h2>تصنيفات خطوط التصميم</h2>
<ul>
<li><a href="/fonts/tasmeem">خطوط التصميم</a></li>
<li><a href="/fonts/kufi">خطوط الكوفي الهندسي</a></li>
<li><a href="/fonts/ruqaa">خطوط الرقعة</a></li>
</ul>`;
    const jsonLd = [
      {
        "@type": "CollectionPage",
        "name": title,
        "description": desc,
        "url": canonical,
        "inLanguage": "ar",
        "isPartOf": { "@type": "WebSite", "name": "xfontat", "url": "https://xfontat.com" },
        "numberOfItems": designFonts.length,
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://xfontat.com/" },
          { "@type": "ListItem", "position": 2, "name": "خطوط التصميم", "item": canonical },
        ]
      }
    ];
    res.send(botHTML(title, desc, canonical, 'خطوط عربية للتصميم الحديث', body, jsonLd));
  });

  app.get("/youtube-thumbnail-maker", (req, res, next) => {
    if (!isBot(req.headers['user-agent'] || '')) return next();

    const canonical = 'https://xfontat.com/youtube-thumbnail-maker';
    const title = 'منشئ الصور المصغرة لليوتيوب بالذكاء الاصطناعي | xfontat';
    const desc = 'أنشئ صوراً مصغرة احترافية لليوتيوب بالذكاء الاصطناعي مع دعم النص العربي واتجاه RTL، بمقاس 1280×720 ومعاينة جاهزة للنشر.';
    const body = `
<p>${desc}</p>
<h2>كيف يعمل منشئ الصور المصغرة؟</h2>
<p>اكتب فكرة الفيديو أو عنوانه، اختر أسلوباً بصرياً مناسباً، وأضف صورة شخصية أو منتجاً عند الحاجة، ثم أنشئ صورة مصغرة مخصصة لليوتيوب.</p>
<h2>مميزات الأداة</h2>
<ul>
<li>دعم العناوين العربية واتجاه الكتابة من اليمين إلى اليسار.</li>
<li>إنشاء الصور بمقاس 1280×720 المناسب ليوتيوب.</li>
<li>رفع صورة شخصية أو منتج بصيغ PNG وJPG وWebP.</li>
<li>اختيار أساليب بصرية متنوعة دون نسخ هوية صناع محتوى آخرين.</li>
</ul>
<p><a href="${canonical}">ابدأ إنشاء صورة مصغرة الآن</a></p>`;
    const jsonLd = [
      {
        "@type": "WebApplication",
        "name": "منشئ الصور المصغرة لليوتيوب",
        "alternateName": "AI YouTube Thumbnail Maker",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web",
        "url": canonical,
        "description": desc,
        "inLanguage": "ar",
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "ما المقاس المناسب لصورة Thumbnail في يوتيوب؟",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "المقاس المستخدم هو 1280×720 بنسبة 16:9، وهو مناسب لعرض الصور المصغرة على يوتيوب."
            }
          },
          {
            "@type": "Question",
            "name": "هل يدعم منشئ الصور المصغرة الكتابة العربية؟",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "نعم، يدعم العناوين العربية واتجاه الكتابة من اليمين إلى اليسار مع الحفاظ على النص الذي تدخله."
            }
          }
        ]
      }
    ];
    res.send(botHTML(title, desc, canonical, 'منشئ الصور المصغرة لليوتيوب بالذكاء الاصطناعي', body, jsonLd));
  });

  app.get("/collection/:slug", async (req, res, next) => {
    const collection = collections.find(c => c.slug === req.params.slug);
    if (!collection) {
      return res.status(404).send(botHTML(
        'المجموعة غير موجودة | xfontat',
        'تعذر العثور على مجموعة الخطوط المطلوبة في مكتبة xfontat.',
        `https://xfontat.com/collection/${req.params.slug}`,
        'المجموعة غير موجودة',
        '<p>تعذر العثور على مجموعة الخطوط المطلوبة.</p><p><a href="/">العودة إلى الرئيسية</a></p>'
      ));
    }
    if (!isBot(req.headers['user-agent'] || '')) return next();
    const canonical = `https://xfontat.com/collection/${req.params.slug}`;
    const title = `${collection.titleArabic} | xfontat`;
    const desc = collection.description;
    const faqHtml = collection.faqs.map(f =>
      `<h3>${f.question}</h3><p>${f.answer}</p>`
    ).join('\n');
    const useCaseList = collection.useCases.map(u => `<li>${u}</li>`).join('\n');
    const fonts = await storage.getFontsByCategories(collection.categories);
    const fontLinks = fonts.map(font =>
      `<li><a href="/font/${generateSlug(font.name, font.fileName, font.category)}">${font.nameArabic}</a></li>`
    ).join('\n');
    const body = `
<p>${collection.longDescription}</p>
<h2>حالات الاستخدام</h2>
<ul>${useCaseList}</ul>
<h2>خطوط المجموعة</h2>
<ul>${fontLinks}</ul>
<h2>الفئات المشمولة</h2>
<ul>${collection.categories.map(c => `<li><a href="/fonts/${categoryToSlug[c] || c}">${c}</a></li>`).join('\n')}</ul>
<h2>أسئلة شائعة</h2>
${faqHtml}`;
    const jsonLd = [
      {
        "@type": "CollectionPage",
        "name": collection.titleArabic,
        "description": collection.description,
        "url": canonical,
        "inLanguage": "ar",
        "isPartOf": { "@type": "WebSite", "name": "xfontat", "url": "https://xfontat.com" },
        "keywords": collection.keywords.join(', '),
        "numberOfItems": fonts.length,
      },
      {
        "@type": "ItemList",
        "name": `خطوط ${collection.titleArabic}`,
        "numberOfItems": fonts.length,
        "itemListElement": fonts.map((font, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "CreativeWork",
            "name": font.nameArabic,
            "url": `https://xfontat.com/font/${generateSlug(font.name, font.fileName, font.category)}`,
          }
        })),
      },
      {
        "@type": "FAQPage",
        "mainEntity": collection.faqs.map(f => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": { "@type": "Answer", "text": f.answer }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://xfontat.com/" },
          { "@type": "ListItem", "position": 2, "name": collection.titleArabic, "item": canonical },
        ]
      }
    ];
    res.send(botHTML(title, desc, canonical, collection.titleArabic, body, jsonLd));
  });

  app.get("/about", (req, res, next) => {
    if (!isBot(req.headers['user-agent'] || '')) return next();
    const canonical = 'https://xfontat.com/about';
    const title = 'من نحن | xfontat — مكتبة الخطوط العربية';
    const desc = 'تعرف على xfontat، منصة لتصفح الخطوط العربية ومعاينتها والاطلاع على معلومات الصيغ والتراخيص المتاحة.';
    const body = `
<p>${desc}</p>
<h2>ما هي xfontat؟</h2>
<p>xfontat منصة عربية لتصفح الخطوط العربية ومعاينتها. تختلف الصيغ وشروط الاستخدام بحسب كل ملف، لذا راجع تفاصيله وترخيصه قبل الاستخدام.</p>
<h2>المعاينة ومعلومات الملفات</h2>
<p>يمكنك تجربة الخط على نصك، ثم مراجعة صفحة الملف لمعرفة الصيغة والمصدر والترخيص المتاح.</p>
<h2>تواصل معنا</h2>
<p>يسعدنا تلقي استفساراتكم واقتراحاتكم. <a href="/contact">تواصل معنا</a></p>`;
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": title,
      "description": desc,
      "url": canonical,
      "inLanguage": "ar",
      "isPartOf": { "@type": "WebSite", "name": "xfontat", "url": "https://xfontat.com" },
      "about": {
        "@type": "Organization",
        "name": "xfontat",
        "url": "https://xfontat.com",
        "description": "منصة لتصفح الخطوط العربية ومعاينتها والاطلاع على معلومات الصيغ والتراخيص المتاحة."
      }
    };
    res.send(botHTML(title, desc, canonical, 'من نحن - xfontat', body, jsonLd));
  });

  app.get("/contact", (req, res, next) => {
    if (!isBot(req.headers['user-agent'] || '')) return next();
    const canonical = 'https://xfontat.com/contact';
    const title = 'اتصل بنا | xfontat — دعم مكتبة الخطوط العربية والمساعدة';
    const desc = 'تواصل مع فريق xfontat للحصول على دعم مكتبة الخطوط العربية، إرسال الاقتراحات، والإبلاغ عن مشكلات التحميل أو الاستخدام وسنساعدك سريعاً.';
    const body = `
<p>${desc}</p>
<h2>طرق التواصل</h2>
<p>يمكنك التواصل معنا عبر البريد الإلكتروني أو من خلال نموذج التواصل المتاح على الصفحة.</p>
<h2>الدعم الفني</h2>
<p>إذا واجهت أي مشكلة في تحميل الخطوط أو استخدامها، لا تتردد في التواصل معنا وسنرد عليك في أقرب وقت ممكن.</p>`;
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": title,
      "description": desc,
      "url": canonical,
      "inLanguage": "ar",
      "isPartOf": { "@type": "WebSite", "name": "xfontat", "url": "https://xfontat.com" },
    };
    res.send(botHTML(title, desc, canonical, 'اتصل بنا', body, jsonLd));
  });

  app.get("/privacy", (req, res, next) => {
    if (!isBot(req.headers['user-agent'] || '')) return next();
    const canonical = 'https://xfontat.com/privacy';
    const title = 'سياسة الخصوصية | xfontat — حماية بيانات زوار مكتبة الخطوط';
    const desc = 'اقرأ سياسة الخصوصية في xfontat وتعرف على البيانات التي نجمعها، وكيف نستخدمها ونحميها أثناء تصفح مكتبة الخطوط العربية وتحميلها بأمان.';
    const body = `
<p>${desc}</p>
<h2>جمع البيانات</h2>
<p>نحن نحترم خصوصيتك ولا نجمع أي بيانات شخصية دون موافقتك الصريحة.</p>
<h2>ملفات تعريف الارتباط</h2>
<p>نستخدم ملفات تعريف الارتباط لتحسين تجربة المستخدم وتحليل بيانات الزيارات بصورة مجمعة وغير شخصية.</p>`;
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": title,
      "description": desc,
      "url": canonical,
      "inLanguage": "ar",
      "isPartOf": { "@type": "WebSite", "name": "xfontat", "url": "https://xfontat.com" },
    };
    res.send(botHTML(title, desc, canonical, 'سياسة الخصوصية', body, jsonLd));
  });

  app.get("/terms", (req, res, next) => {
    if (!isBot(req.headers['user-agent'] || '')) return next();
    const canonical = 'https://xfontat.com/terms';
    const title = 'شروط الاستخدام | xfontat — حقوق استخدام الخطوط العربية';
    const desc = 'تعرف على شروط استخدام xfontat، وقواعد تحميل الخطوط العربية وحقوق استخدامها الشخصي أو التجاري وفق ترخيص كل خط والأنظمة المعمول بها.';
    const body = `
<p>${desc}</p>
<h2>استخدام الخطوط</h2>
<p>جميع الخطوط المتاحة على xfontat مجانية للاستخدام الشخصي والتصميمي. للاستخدام التجاري، يرجى مراجعة ترخيص كل خط على حدة.</p>
<h2>حقوق الملكية الفكرية</h2>
<p>محتوى الموقع وتصميمه هو ملك لـ xfontat. الخطوط المتاحة للتحميل هي ملك لمصمميها الأصليين.</p>`;
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": title,
      "description": desc,
      "url": canonical,
      "inLanguage": "ar",
      "isPartOf": { "@type": "WebSite", "name": "xfontat", "url": "https://xfontat.com" },
    };
    res.send(botHTML(title, desc, canonical, 'شروط الاستخدام', body, jsonLd));
  });

  app.get("/en", async (req, res, next) => {
    if (!isBot(req.headers["user-agent"] || "")) return next();

    const fonts = await storage.getAllFonts();
    const fontGroups = groupFontsByFamily(fonts);
    const canonical = "https://xfontat.com/en";
    const categoryLinks = englishCategories
      .map((category) => `<li><a href="/en/fonts/${category.slug}">${escapeHtml(category.name)}</a></li>`)
      .join("\n");
    const fontLinks = fontGroups
      .slice(0, 80)
      .map((group) => `<li><a href="/en/font/${generateSlug(group.primary.name, group.primary.fileName, group.primary.category)}">${escapeHtml(group.family)} — <span lang="ar" dir="rtl">${escapeHtml(group.primary.nameArabic)}</span></a> <span>${group.variants.length} ${englishHome.variantCountLabel(group.variants.length)}</span></li>`)
      .join("\n");
    const benefitItems = englishHome.benefits
      .map((item) => `<li><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></li>`)
      .join("\n");
    const projectGuides = englishHome.projectGuides
      .map((item) => `<article><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></article>`)
      .join("\n");
    const categoryGuides = englishCategories
      .map((category) => `<article><h3><a href="/en/fonts/${category.slug}">${escapeHtml(category.name)}</a></h3><p>${escapeHtml(category.intro)}</p><ul>${category.uses.map((use) => `<li>${escapeHtml(use)}</li>`).join("")}</ul></article>`)
      .join("\n");
    const collections = Object.entries(localizedCollections.en)
      .map(([slug, collection]) => `<article><h3><a href="/en/collection/${slug}">${escapeHtml(collection.title)}</a></h3><p>${escapeHtml(collection.description)}</p><ul>${collection.useCases.map((use) => `<li>${escapeHtml(use)}</li>`).join("")}</ul></article>`)
      .join("\n");
    const faqs = englishHome.faqs
      .map((faq) => `<article><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></article>`)
      .join("\n");
    const body = `
<p>${englishHome.intro}</p>
<section><h2>Browse Arabic font styles</h2><ul>${categoryLinks}</ul></section>
<h2>${englishHome.aboutHeading}</h2>
<p>${englishHome.about}</p>
<h2>${englishHome.licenseHeading}</h2>
<p>${englishHome.license}</p>
<h2>${englishHome.searchPreviewHeading}</h2>
<p>${englishHome.searchLabel}: ${englishHome.searchPlaceholder}</p>
<p>${englishHome.previewLabel}: ${englishHome.previewPlaceholder}</p>
<p>${englishHome.previewSizeLabel}: 16–72px</p>
<h2>Arabic font families in the directory</h2><p>${fontGroups.length} families across ${fonts.length} font files</p><ul>${fontLinks}</ul>
<section><h2>${englishHome.benefitsHeading}</h2><ul>${benefitItems}</ul></section>
<section><h2>${englishHome.projectGuidesHeading}</h2>${projectGuides}</section>
<section><h2>${englishHome.categoryGuideHeading}</h2><p>${englishHome.categoryGuideIntro}</p>${categoryGuides}</section>
<section><h2>${englishHome.collectionsHeading}</h2>${collections}</section>
<section><h2>${englishHome.faqHeading}</h2>${faqs}</section>
<footer><a href="/en/about">${englishHome.footerAbout}</a> | <a href="/en/contact">${englishHome.footerContact}</a> | <a href="/en/privacy">${englishHome.footerPrivacy}</a> | <a href="/en/terms">${englishHome.footerTerms}</a></footer>`;
    const jsonLd = [
      {
        "@type": "WebSite",
        "name": "xfontat",
        "url": canonical,
        "description": englishHome.description,
        "inLanguage": "en",
      },
      {
        "@type": "CollectionPage",
        "name": englishHome.title,
        "description": englishHome.description,
        "url": canonical,
        "inLanguage": "en",
        "numberOfItems": fontGroups.length,
      },
      {
        "@type": "ItemList",
        "itemListElement": fontGroups.slice(0, 80).map((group, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": group.family,
          "url": `https://xfontat.com/en/font/${generateSlug(group.primary.name, group.primary.fileName, group.primary.category)}`,
        })),
      },
      {
        "@type": "FAQPage",
        "mainEntity": englishHome.faqs.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
        })),
      },
    ];
    res.send(botHTML(
      englishHome.title,
      englishHome.description,
      canonical,
      englishHome.heading,
      body,
      jsonLd,
      undefined,
      {
        lang: "en",
        alternates: [
          { lang: "en", href: canonical },
          { lang: "fr", href: "https://xfontat.com/fr" },
          { lang: "ar", href: "https://xfontat.com/" },
          { lang: "x-default", href: "https://xfontat.com/" },
        ],
      }
    ));
  });

  app.get("/en/fonts/:category", async (req, res, next) => {
    const category = englishCategories.find((item) => item.slug === req.params.category);
    const canonical = `https://xfontat.com/en/fonts/${req.params.category}`;
    if (!category) {
      return res.status(404).send(botHTML(
        "Category not found | xfontat",
        "The requested Arabic font category was not found.",
        canonical,
        "Category not found",
        '<p>The requested category is not available.</p><p><a href="/en">Return to the English directory</a></p>',
        undefined,
        undefined,
        { lang: "en" }
      ));
    }
    if (!isBot(req.headers["user-agent"] || "")) return next();

    const fonts = await storage.getFontsByCategory(category.arabicCategory);
    const fontGroups = groupFontsByFamily(fonts);
    const fontLinks = fontGroups
      .slice(0, 80)
      .map((group) => `<li><a href="/en/font/${generateSlug(group.primary.name, group.primary.fileName, group.primary.category)}">${escapeHtml(group.family)} — <span lang="ar" dir="rtl">${escapeHtml(group.primary.nameArabic)}</span></a> <span>${group.variants.length} ${englishHome.variantCountLabel(group.variants.length)}</span></li>`)
      .join("\n");
    const faqHtml = category.faqs
      .map((faq) => `<section><h3>${faq.question}</h3><p>${faq.answer}</p></section>`)
      .join("\n");
    const body = `
<p>${category.intro}</p>
<h2>Common uses</h2>
<ul>${category.uses.map((use) => `<li>${use}</li>`).join("\n")}</ul>
<h2>Font families in this category</h2>
<p>${fontGroups.length} families across ${fonts.length} font files</p>
<ul>${fontLinks}</ul>
<h2>Common questions about ${category.name} fonts</h2>
${faqHtml}
<p>Formats and licenses vary by file. Check the individual file information and source before use.</p>`;
    const jsonLd = [
      {
        "@type": "CollectionPage",
        "name": category.name,
        "description": category.description,
        "url": canonical,
        "inLanguage": "en",
        "numberOfItems": fontGroups.length,
      },
      {
        "@type": "FAQPage",
        "mainEntity": category.faqs.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
        })),
      },
    ];
    res.send(botHTML(
      category.title,
      category.description,
      canonical,
      category.name,
      body,
      jsonLd,
      undefined,
      {
        lang: "en",
        alternates: [
          { lang: "en", href: canonical },
          { lang: "fr", href: `https://xfontat.com/fr/fonts/${category.slug}` },
          { lang: "ar", href: `https://xfontat.com/fonts/${category.slug}` },
          { lang: "x-default", href: `https://xfontat.com/fonts/${category.slug}` },
        ],
      }
    ));
  });

  app.get("/fr", async (req, res, next) => {
    if (!isBot(req.headers["user-agent"] || "")) return next();

    const fonts = await storage.getAllFonts();
    const fontGroups = groupFontsByFamily(fonts);
    const canonical = "https://xfontat.com/fr";
    const categoryLinks = frenchCategories
      .map((category) => `<li><a href="/fr/fonts/${category.slug}">${escapeHtml(category.name)}</a></li>`)
      .join("\n");
    const fontLinks = fontGroups
      .slice(0, 80)
      .map((group) => `<li><a href="/fr/font/${generateSlug(group.primary.name, group.primary.fileName, group.primary.category)}">${escapeHtml(group.family)} — <span lang="ar" dir="rtl">${escapeHtml(group.primary.nameArabic)}</span></a> <span>${group.variants.length} ${frenchHome.variantCountLabel(group.variants.length)}</span></li>`)
      .join("\n");
    const benefitItems = frenchHome.benefits
      .map((item) => `<li><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></li>`)
      .join("\n");
    const projectGuides = frenchHome.projectGuides
      .map((item) => `<article><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></article>`)
      .join("\n");
    const categoryGuides = frenchCategories
      .map((category) => `<article><h3><a href="/fr/fonts/${category.slug}">${escapeHtml(category.name)}</a></h3><p>${escapeHtml(category.intro)}</p><ul>${category.uses.map((use) => `<li>${escapeHtml(use)}</li>`).join("")}</ul></article>`)
      .join("\n");
    const collections = Object.entries(localizedCollections.fr)
      .map(([slug, collection]) => `<article><h3><a href="/fr/collection/${slug}">${escapeHtml(collection.title)}</a></h3><p>${escapeHtml(collection.description)}</p><ul>${collection.useCases.map((use) => `<li>${escapeHtml(use)}</li>`).join("")}</ul></article>`)
      .join("\n");
    const faqs = frenchHome.faqs
      .map((faq) => `<article><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></article>`)
      .join("\n");
    const body = `
<p>${frenchHome.intro}</p>
<section><h2>Parcourir les styles de polices arabes</h2><ul>${categoryLinks}</ul></section>
<h2>${frenchHome.aboutHeading}</h2>
<p>${frenchHome.about}</p>
<h2>${frenchHome.licenseHeading}</h2>
<p>${frenchHome.license}</p>
<h2>${frenchHome.searchPreviewHeading}</h2>
<p>${frenchHome.searchLabel} : ${frenchHome.searchPlaceholder}</p>
<p>${frenchHome.previewLabel} : ${frenchHome.previewPlaceholder}</p>
<p>${frenchHome.previewSizeLabel} : 16–72 px</p>
<h2>Familles de polices arabes du répertoire</h2><p>${fontGroups.length} familles pour ${fonts.length} fichiers de polices</p><ul>${fontLinks}</ul>
<section><h2>${frenchHome.benefitsHeading}</h2><ul>${benefitItems}</ul></section>
<section><h2>${frenchHome.projectGuidesHeading}</h2>${projectGuides}</section>
<section><h2>${frenchHome.categoryGuideHeading}</h2><p>${frenchHome.categoryGuideIntro}</p>${categoryGuides}</section>
<section><h2>${frenchHome.collectionsHeading}</h2>${collections}</section>
<section><h2>${frenchHome.faqHeading}</h2>${faqs}</section>
<footer><a href="/fr/about">${frenchHome.footerAbout}</a> | <a href="/fr/contact">${frenchHome.footerContact}</a> | <a href="/fr/privacy">${frenchHome.footerPrivacy}</a> | <a href="/fr/terms">${frenchHome.footerTerms}</a></footer>`;
    const jsonLd = [
      {
        "@type": "WebSite",
        "name": "xfontat",
        "url": canonical,
        "description": frenchHome.description,
        "inLanguage": "fr",
      },
      {
        "@type": "CollectionPage",
        "name": frenchHome.title,
        "description": frenchHome.description,
        "url": canonical,
        "inLanguage": "fr",
        "numberOfItems": fontGroups.length,
      },
      {
        "@type": "ItemList",
        "itemListElement": fontGroups.slice(0, 80).map((group, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": group.family,
          "url": `https://xfontat.com/fr/font/${generateSlug(group.primary.name, group.primary.fileName, group.primary.category)}`,
        })),
      },
      {
        "@type": "FAQPage",
        "mainEntity": frenchHome.faqs.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
        })),
      },
    ];
    res.send(botHTML(
      frenchHome.title,
      frenchHome.description,
      canonical,
      frenchHome.heading,
      body,
      jsonLd,
      undefined,
      {
        lang: "fr",
        alternates: [
          { lang: "fr", href: canonical },
          { lang: "en", href: "https://xfontat.com/en" },
          { lang: "ar", href: "https://xfontat.com/" },
          { lang: "x-default", href: "https://xfontat.com/" },
        ],
      }
    ));
  });

  app.get("/fr/fonts/:category", async (req, res, next) => {
    const category = frenchCategories.find((item) => item.slug === req.params.category);
    const canonical = `https://xfontat.com/fr/fonts/${req.params.category}`;
    if (!category) {
      return res.status(404).send(botHTML(
        "Catégorie introuvable | xfontat",
        "La catégorie demandée est introuvable.",
        canonical,
        "Catégorie introuvable",
        '<p>Cette catégorie n’est pas disponible.</p><p><a href="/fr">Retour à la bibliothèque</a></p>',
        undefined,
        undefined,
        { lang: "fr" }
      ));
    }
    if (!isBot(req.headers["user-agent"] || "")) return next();

    const fonts = await storage.getFontsByCategory(category.arabicCategory);
    const fontGroups = groupFontsByFamily(fonts);
    const fontLinks = fontGroups
      .slice(0, 80)
      .map((group) => `<li><a href="/fr/font/${generateSlug(group.primary.name, group.primary.fileName, group.primary.category)}">${escapeHtml(group.family)} — <span lang="ar" dir="rtl">${escapeHtml(group.primary.nameArabic)}</span></a> <span>${group.variants.length} ${frenchHome.variantCountLabel(group.variants.length)}</span></li>`)
      .join("\n");
    const faqHtml = category.faqs
      .map((faq) => `<section><h3>${faq.question}</h3><p>${faq.answer}</p></section>`)
      .join("\n");
    const body = `
<p>${category.intro}</p>
<h2>Utilisations courantes</h2>
<ul>${category.uses.map((use) => `<li>${use}</li>`).join("\n")}</ul>
<h2>Familles de polices de cette catégorie</h2>
<p>${fontGroups.length} familles pour ${fonts.length} fichiers de polices</p>
<ul>${fontLinks}</ul>
<h2>Questions fréquentes sur les polices ${category.name}</h2>
${faqHtml}
<p>Les formats et les licences varient selon les fichiers. Consultez les informations et la source de chaque fichier avant utilisation.</p>`;
    const jsonLd = [
      {
        "@type": "CollectionPage",
        "name": category.name,
        "description": category.description,
        "url": canonical,
        "inLanguage": "fr",
        "numberOfItems": fontGroups.length,
      },
      {
        "@type": "FAQPage",
        "mainEntity": category.faqs.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
        })),
      },
    ];
    res.send(botHTML(
      category.title,
      category.description,
      canonical,
      category.name,
      body,
      jsonLd,
      undefined,
      {
        lang: "fr",
        alternates: [
          { lang: "fr", href: canonical },
          { lang: "en", href: `https://xfontat.com/en/fonts/${category.slug}` },
          { lang: "ar", href: `https://xfontat.com/fonts/${category.slug}` },
          { lang: "x-default", href: `https://xfontat.com/fonts/${category.slug}` },
        ],
      }
    ));
  });

  app.get("/:locale/:section/:slug", async (req, res, next) => {
    const locale = req.params.locale;
    if (locale !== "en" && locale !== "fr") return next();
    if (!isBot(req.headers["user-agent"] || "")) return next();

    const isFrench = locale === "fr";
    const section = req.params.section;
    const slug = req.params.slug;
    const canonical = `https://xfontat.com/${locale}/${section}/${slug}`;
    const alternates = [
      { lang: "en", href: `https://xfontat.com/en/${section}/${slug}` },
      { lang: "fr", href: `https://xfontat.com/fr/${section}/${slug}` },
      { lang: "ar", href: `https://xfontat.com/${section}/${slug}` },
    ];

    if (section === "font") {
      const font = await storage.getFontBySlug(slug, generateSlug);
      if (!font) {
        const title = isFrench ? "Police introuvable | xfontat" : "Font not found | xfontat";
        return res.status(404).send(botHTML(title, title, canonical, title, `<p><a href="/${locale}">${isFrench ? "Accueil" : "Home"}</a></p>`, undefined, undefined, { lang: locale }));
      }
      const localizedFont = getLocalizedFontPageContent(font, locale);
      const copy = localizedFontDetailCopy[locale];
      const categoryPath = `/${locale}/fonts/${localizedFont.category?.slug || "kufi"}`;
      const previewPath = `/font-previews/${generateSlug(font.name, font.fileName, font.category)}.webp`;
      const infoRows = [
        `<div><dt>${copy.nameLabel}</dt><dd>${escapeHtml(font.name)}</dd></div>`,
        `<div><dt>${copy.arabicNameLabel}</dt><dd lang="ar" dir="rtl">${escapeHtml(font.nameArabic)}</dd></div>`,
        `<div><dt>${copy.categoryLabel}</dt><dd><a href="${categoryPath}">${escapeHtml(localizedFont.categoryName)}</a></dd></div>`,
        `<div><dt>${copy.formatLabel}</dt><dd>${escapeHtml(font.fileFormat || copy.notListed)}</dd></div>`,
        `<div><dt>${copy.styleLabel}</dt><dd>${escapeHtml(localizedFont.style)}</dd></div>`,
        font.designer ? `<div><dt>${copy.designerLabel}</dt><dd>${escapeHtml(font.designer)}</dd></div>` : "",
        font.license ? `<div><dt>${copy.licenseLabel}</dt><dd>${escapeHtml(font.license)}</dd></div>` : "",
        font.copyright ? `<div><dt>${copy.copyrightLabel}</dt><dd>${escapeHtml(font.copyright)}</dd></div>` : "",
        font.sourceUrl ? `<div><dt>${copy.sourceLabel}</dt><dd><a href="${escapeHtml(font.sourceUrl)}" rel="nofollow">${copy.sourceLabel}</a></dd></div>` : "",
      ].filter(Boolean).join("\n");
      const categoryUses = localizedFont.useCases.length
        ? `<section><h2>${copy.usesHeading}</h2><ul>${localizedFont.useCases.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>`
        : "";
      const licenseNotice = font.licenseNotice
        ? `<section><h3>${copy.licenseNoticeHeading}</h3><p>${copy.licenseNoticeIntro}</p><details><summary>${copy.licenseNoticeHeading}</summary><p lang="ar" style="white-space:pre-wrap">${escapeHtml(font.licenseNotice)}</p></details></section>`
        : "";
      const characterRows = fontCharacterMap
        .map((row) => `<p>${row.map((character) => `<span>${escapeHtml(character)}</span>`).join(" ")}</p>`)
        .join("");
      const installationSteps = (steps: readonly string[]) =>
        `<ol>${steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>`;
      const faqSection = localizedFont.faqs.length
        ? `<section><h2>${copy.categoryFaqHeading}</h2>${localizedFont.faqs.map((faq) => `<article><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></article>`).join("")}</section>`
        : "";
      const categoryFonts = await storage.getFontsByCategory(font.category);
      const familyName = detectFontFamily(font.name);
      const familyVariants = categoryFonts.filter((item) => (
        item.id !== font.id && detectFontFamily(item.name) === familyName
      ));
      const relatedFonts = categoryFonts.filter((item) => (
        item.id !== font.id && detectFontFamily(item.name) !== familyName
      )).slice(0, 5);
      const familyVariantsSection = familyVariants.length
        ? `<section><h2>${copy.variantsHeading}</h2><ul>${familyVariants.map((item) => `<li><a href="/${locale}/font/${generateSlug(item.name, item.fileName, item.category)}">${escapeHtml(item.name)}</a> — ${escapeHtml(getLocalizedFontWeightLabel(item.name, locale))} — ${escapeHtml(item.fileFormat || copy.notListed)} <a href="${escapeHtml(item.fileUrl)}" download="${escapeHtml(item.fileName)}">${copy.download}</a></li>`).join("")}</ul></section>`
        : "";
      const relatedSection = relatedFonts.length
        ? `<section><h2>${copy.relatedHeading}</h2><ul>${relatedFonts.map((item) => `<li><a href="/${locale}/font/${generateSlug(item.name, item.fileName, item.category)}">${escapeHtml(item.name)} — <span lang="ar" dir="rtl">${escapeHtml(item.nameArabic)}</span></a></li>`).join("")}</ul><p><a href="${categoryPath}">${escapeHtml(copy.browseCategory(localizedFont.categoryName))}</a></p></section>`
        : "";
      const categoryKeywords: Record<string, string[]> = {
        "ثلث": ["ثلث", "خطوط عربية", "تصميم", "شعارات"],
        "ديواني": ["ديواني", "مزخرفة", "خطوط عربية"],
        "رقعة": ["رقعة", "خطوط عربية", "سوشال"],
        "كوفي": ["كوفي", "شعارات", "لوجو", "تصميم"],
        "نسخ": ["نسخ", "خطوط عربية", "فوتوشوب"],
        "تصميم": ["تصميم", "شعارات", "فوتوشوب", "سوشال"],
        "خطوط الحرة": ["غرافيتي", "خطوط حرة", "تصميم", "شعارات"],
        "فوتوشوب": ["فوتوشوب", "تصميم", "سوشال"],
        "نستعليق": ["نستعليق", "فارسي", "خطوط عربية"],
      };
      const articleKeywords = categoryKeywords[font.category] || ["خطوط عربية"];
      const relatedArticles = staticBlogPosts
        .filter((post) => articleKeywords.some((keyword) => post.title.includes(keyword) || post.keywords.some((item) => item.includes(keyword))))
        .slice(0, 3)
        .map((post) => {
          const translation = fullBlogTranslations[post.slug]?.[locale] || localizedBlogPosts[locale][post.slug];
          if (!translation) return "";
          const excerpt = translation.excerpt;
          return `<li><a href="/${locale}/blog/${post.slug}">${escapeHtml(translation.title)}</a><p>${escapeHtml(excerpt)}</p></li>`;
        })
        .filter(Boolean)
        .join("");
      const articlesSection = relatedArticles
        ? `<section><h2>${copy.relatedArticlesHeading}</h2><ul>${relatedArticles}</ul></section>`
        : "";
      const categoryLinks = (locale === "fr" ? frenchCategories : englishCategories)
        .map((item) => `<li><a href="/${locale}/fonts/${item.slug}">${escapeHtml(item.name)}</a></li>`)
        .join("");
      const body = `
<nav aria-label="${isFrench ? "Fil d’Ariane" : "Breadcrumb"}">
  <a href="/${locale}">${isFrench ? "Accueil" : "Home"}</a> /
  <a href="${categoryPath}">${escapeHtml(localizedFont.categoryName)}</a> /
  <span>${escapeHtml(font.name)}</span>
</nav>
<h1>${escapeHtml(copy.heading(font.name))}</h1>
<p lang="ar" dir="rtl">${escapeHtml(font.nameArabic)}</p>
<section>
  <h2>${copy.aboutHeading}</h2>
  <p>${escapeHtml(localizedFont.summary)}</p>
  <p>${escapeHtml(localizedFont.categoryDescription)}</p>
  <p>${escapeHtml(copy.softwareCompatibility)}</p>
</section>
<section>
  <h2>${copy.previewSizesHeading}</h2>
  <p lang="ar" dir="rtl">${escapeHtml("بسم الله الرحمن الرحيم")}</p>
  <figure>
    <figcaption>${copy.characterMapImageCaption}</figcaption>
    <img src="${previewPath}" alt="${escapeHtml(copy.characterMapImageAlt(font.name))}" width="1400" height="760" loading="lazy">
  </figure>
</section>
<section>
  <h2>${copy.detailsHeading}</h2>
  <dl>${infoRows}</dl>
  ${licenseNotice}
</section>
<p><a href="${escapeHtml(font.fileUrl)}" download="${escapeHtml(font.fileName)}">${copy.download}</a></p>
${categoryUses}
<section>
  <h2>${copy.installHeading}</h2>
  <p>${copy.installIntro}</p>
  <h3>${copy.windowsHeading}</h3>${installationSteps(copy.installSteps.windows)}
  <h3>${copy.macHeading}</h3>${installationSteps(copy.installSteps.mac)}
</section>
<section>
  <h2>${copy.characterMapHeading}</h2>
  <p>${copy.characterMapIntro}</p>
  ${characterRows}
</section>
${faqSection}
${familyVariantsSection}
${relatedSection}
${articlesSection}
<aside>
  <h2>${copy.sidebarHeading}</h2>
  <dl>${infoRows}</dl>
  <p><a href="${escapeHtml(font.fileUrl)}" download="${escapeHtml(font.fileName)}">${copy.download}</a></p>
  <h3>${copy.categoriesHeading}</h3>
  <ul>${categoryLinks}</ul>
</aside>`;
      const title = localizedFont.title;
      const description = localizedFont.description;
      const breadcrumbs = [
        { "@type": "ListItem", position: 1, name: isFrench ? "Accueil" : "Home", item: `https://xfontat.com/${locale}` },
        { "@type": "ListItem", position: 2, name: localizedFont.categoryName, item: `https://xfontat.com${categoryPath}` },
        { "@type": "ListItem", position: 3, name: font.name, item: canonical },
      ];
      const jsonLd = [
        {
          "@type": "CreativeWork",
          "name": font.name,
          "alternateName": font.nameArabic,
          "description": description,
          "url": canonical,
          "inLanguage": locale,
          "genre": localizedFont.categoryName,
          "encodingFormat": font.fileFormat || undefined,
          "isBasedOn": font.sourceUrl || undefined,
          "contentUrl": `https://xfontat.com${font.fileUrl}`,
        },
        { "@type": "BreadcrumbList", "itemListElement": breadcrumbs },
        {
          "@type": "ItemList",
          "name": copy.variantsHeading,
          "itemListElement": familyVariants.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": `${item.name} — ${getLocalizedFontWeightLabel(item.name, locale)}`,
            "url": `https://xfontat.com/${locale}/font/${generateSlug(item.name, item.fileName, item.category)}`,
          })),
        },
        {
          "@type": "FAQPage",
          "mainEntity": localizedFont.faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
          })),
        },
      ];
      return res.send(botHTML(
        escapeHtml(title),
        escapeHtml(description),
        canonical,
        escapeHtml(copy.heading(font.name)),
        body,
        jsonLd,
        undefined,
        { lang: locale, alternates }
      ));
    }

    if (section === "collection") {
      const collection = collections.find((item) => item.slug === slug);
      const translated = localizedCollections[locale][slug];
      if (!collection || !translated) {
        return res.status(404).send(botHTML(
          isFrench ? "Collection introuvable | xfontat" : "Collection not found | xfontat",
          isFrench ? "Cette collection n’est pas disponible." : "This collection is not available.",
          canonical,
          isFrench ? "Collection introuvable" : "Collection not found",
          `<p><a href="/${locale}">${isFrench ? "Accueil" : "Home"}</a></p>`,
          undefined,
          undefined,
          { lang: locale }
        ));
      }
      const categoryNames = (isFrench ? frenchCategories : englishCategories);
      const fonts = await storage.getFontsByCategories(collection.categories);
      const fontGroups = groupFontsByFamily(fonts);
      const links = fontGroups.slice(0, 80).map((group) =>
        `<li><a href="/${locale}/font/${generateSlug(group.primary.name, group.primary.fileName, group.primary.category)}">${escapeHtml(group.family)} — <span lang="ar" dir="rtl">${escapeHtml(group.primary.nameArabic)}</span></a> <span>${group.variants.length} ${isFrench ? frenchHome.variantCountLabel(group.variants.length) : englishHome.variantCountLabel(group.variants.length)}</span></li>`
      ).join("");
      const collectionFaqs = isFrench
        ? [
            { question: `Comment choisir une police dans « ${translated.title} » ?`, answer: "Prévisualisez le texte exact à sa taille prévue et vérifiez sa lisibilité. Consultez la fiche du fichier avant de le choisir." },
            { question: "Puis-je utiliser ces polices à des fins commerciales ?", answer: "Les droits d’utilisation varient selon chaque fichier. Consultez sa licence et sa source avant tout usage commercial ou redistribution." },
            { question: "Quels formats de fichiers sont disponibles ?", answer: "Les formats varient d’un fichier à l’autre. Consultez la fiche de chaque police pour vérifier son format et sa compatibilité." },
          ]
        : [
            { question: `How should I choose a font from “${translated.title}”?`, answer: "Preview the exact text at its intended size and check readability. Review the individual file page before choosing a font." },
            { question: "Can I use these fonts commercially?", answer: "Usage rights vary by file. Check its license and source before commercial use or redistribution." },
            { question: "Which file formats are available?", answer: "Formats vary by file. Open each font’s detail page to check its format and compatibility." },
          ];
      const faqHtml = collectionFaqs
        .map((faq) => `<article><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></article>`)
        .join("");
      const relatedCollections = Object.entries(localizedCollections[locale])
        .filter(([otherSlug]) => otherSlug !== slug)
        .map(([otherSlug, item]) => `<li><a href="/${locale}/collection/${otherSlug}">${escapeHtml(item.title)}</a></li>`)
        .join("");
      const body = `
<nav aria-label="${isFrench ? "Fil d’Ariane" : "Breadcrumb"}"><a href="/${locale}">${isFrench ? "Accueil" : "Home"}</a> / ${escapeHtml(translated.title)}</nav>
<h1>${escapeHtml(translated.title)}</h1>
<p>${translated.description}</p>
<ul>${translated.useCases.map((item) => `<li>${item}</li>`).join("")}</ul>
<h2>${isFrench ? "Catégories" : "Categories"}</h2>
<ul>${collection.categories.map((name) => {
  const category = categoryNames.find((item) => item.arabicCategory === name);
  return category
    ? `<li><a href="/${locale}/fonts/${category.slug}">${escapeHtml(category.name)}</a></li>`
    : `<li>${escapeHtml(name)}</li>`;
}).join("")}</ul>
<h2>${isFrench ? "Familles de polices" : "Font families"}</h2>
<p>${isFrench ? `${fontGroups.length} familles pour ${fonts.length} fichiers de polices` : `${fontGroups.length} families across ${fonts.length} font files`}</p>
<ul>${links}</ul>
<section><h2>${isFrench ? "Questions fréquentes" : "Common questions"}</h2>${faqHtml}</section>
<section><h2>${isFrench ? "Autres collections" : "Other collections"}</h2><ul>${relatedCollections}</ul></section>`;
      return res.send(botHTML(
        translated.title,
        translated.description,
        canonical,
        translated.title,
        body,
        {
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "CollectionPage", "name": translated.title, "description": translated.description, "url": canonical, "inLanguage": locale, "numberOfItems": fontGroups.length },
            {
              "@type": "ItemList",
              "name": translated.title,
              "numberOfItems": fontGroups.length,
              "itemListElement": fontGroups.slice(0, 80).map((group, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": group.family,
                "url": `https://xfontat.com/${locale}/font/${generateSlug(group.primary.name, group.primary.fileName, group.primary.category)}`,
              })),
            },
            { "@type": "FAQPage", "mainEntity": collectionFaqs.map((faq) => ({ "@type": "Question", "name": faq.question, "acceptedAnswer": { "@type": "Answer", "text": faq.answer } })) },
          ],
        },
        undefined,
        { lang: locale, alternates }
      ));
    }

    if (section === "blog") {
      const post = staticBlogPosts.find((item) => item.slug === slug);
      const translated = (fullBlogTranslations[slug]?.[locale] || localizedBlogPosts[locale][slug]) as
        | { title: string; excerpt: string; summary?: string; content?: string }
        | undefined;
      if (!post || !translated) return res.status(404).send(botHTML(
        isFrench ? "Article introuvable | xfontat" : "Article not found | xfontat",
        isFrench ? "Cet article n’est pas disponible dans cette langue." : "This article is not available in this language.",
        canonical,
        isFrench ? "Article introuvable" : "Article not found",
        `<p><a href="/blog/${escapeHtml(slug)}">${isFrench ? "Lire l’article arabe" : "Read the Arabic article"}</a></p>`,
        undefined,
        undefined,
        { lang: locale }
      ));
      const body = "content" in translated
        ? `${renderMarkdownToHtml(translated.content || "")}<p><a href="/blog/${post.slug}">${isFrench ? "Consulter la version arabe" : "View the Arabic version"}</a></p>`
        : `<p>${translated.excerpt}</p><h2>${isFrench ? "En bref" : "In brief"}</h2><p>${translated.summary}</p><p><a href="/blog/${post.slug}">${isFrench ? "Lire l’article original en arabe" : "Read the original Arabic article"}</a></p>`;
      return res.send(botHTML(
        translated.title,
        translated.excerpt,
        canonical,
        translated.title,
        body,
        { "@type": "Article", "headline": translated.title, "description": translated.excerpt, "url": canonical, "inLanguage": locale },
        undefined,
        { lang: locale, alternates }
      ));
    }
    return next();
  });

  app.get("/:locale/:page", (req, res, next) => {
    const locale = req.params.locale;
    const page = req.params.page;
    if ((locale !== "en" && locale !== "fr") || !isBot(req.headers["user-agent"] || "")) return next();
    const canonical = `https://xfontat.com/${locale}/${page}`;
    const isFrench = locale === "fr";
    const translatedPages = localizedStaticPages[locale];
    if (page === "blog") {
      const title = isFrench ? "Conseils sur les polices arabes | xfontat" : "Arabic font guides | xfontat";
      const description = isFrench
        ? "Guides pratiques pour choisir et utiliser des polices arabes."
        : "Practical guides to choosing and using Arabic fonts.";
      const posts = staticBlogPosts.map((post) => {
        const translation = fullBlogTranslations[post.slug]?.[locale] || localizedBlogPosts[locale][post.slug];
        return translation ? `<li><a href="/${locale}/blog/${post.slug}">${translation.title}</a> — ${translation.excerpt}</li>` : "";
      }).join("");
      return res.send(botHTML(title, description, canonical, title, `<ul>${posts}</ul>`, { "@type": "Blog", "name": title, "inLanguage": locale }, undefined, {
        lang: locale,
        alternates: [
          { lang: "en", href: `https://xfontat.com/en/blog` },
          { lang: "fr", href: `https://xfontat.com/fr/blog` },
          { lang: "ar", href: "https://xfontat.com/blog" },
        ],
      }));
    }
    if (page === "design-fonts") {
      const content = isFrench
        ? { title: "Polices arabes de design | xfontat", description: "Parcourez les fichiers de polices arabes de la catégorie design et vérifiez leurs détails.", heading: "Polices arabes de design" }
        : { title: "Arabic design fonts | xfontat", description: "Browse Arabic font files in the design category and review their details.", heading: "Arabic design fonts" };
      const body = `<p>${content.description}</p><p><a href="/${locale}/fonts/tasmeem">${isFrench ? "Parcourir cette catégorie" : "Browse this category"}</a></p>`;
      return res.send(botHTML(content.title, content.description, canonical, content.heading, body, { "@type": "WebPage", "name": content.title, "url": canonical, "inLanguage": locale }, undefined, {
        lang: locale,
        alternates: [
          { lang: "en", href: "https://xfontat.com/en/design-fonts" },
          { lang: "fr", href: "https://xfontat.com/fr/design-fonts" },
          { lang: "ar", href: "https://xfontat.com/design-fonts" },
        ],
      }));
    }
    if (page === "youtube-thumbnail-maker") {
      const content = isFrench
        ? {
            title: "Créateur de miniatures YouTube par IA | xfontat",
            description: "Créez une miniature 1280×720 à partir d’une idée, avec un titre arabe lisible et une composition liée au sujet.",
            heading: "Créateur de miniatures YouTube pour vidéos en arabe",
            features: ["Texte arabe de droite à gauche", "Styles visuels au choix", "Import d’une personne ou d’un produit"],
          }
        : {
            title: "AI YouTube Thumbnail Maker for Arabic | xfontat",
            description: "Create a 1280×720 thumbnail from a video idea, with a clear Arabic title and a composition tied to the topic.",
            heading: "YouTube thumbnail maker for Arabic videos",
            features: ["Arabic right-to-left text", "Selectable visual styles", "Upload a person or product image"],
          };
      const body = `<p>${content.description}</p><ul>${content.features.map((feature) => `<li>${feature}</li>`).join("")}</ul>`;
      return res.send(botHTML(content.title, content.description, canonical, content.heading, body, {
        "@type": "WebApplication", "name": content.title, "url": canonical, "inLanguage": locale,
        "applicationCategory": "MultimediaApplication", "operatingSystem": "Web",
      }, undefined, {
        lang: locale,
        alternates: [
          { lang: "en", href: "https://xfontat.com/en/youtube-thumbnail-maker" },
          { lang: "fr", href: "https://xfontat.com/fr/youtube-thumbnail-maker" },
          { lang: "ar", href: "https://xfontat.com/youtube-thumbnail-maker" },
        ],
      }));
    }
    const key = page as "about" | "contact" | "privacy" | "terms";
    if (!(key in translatedPages)) return next();
    const content = translatedPages[key];
    const heading = "intro" in content ? content.heading : content.title;
    const body = "intro" in content
      ? `<p>${content.description}</p><p>${content.intro}</p><p>info@xfontat.com · support@xfontat.com · suggestions@xfontat.com</p><p>${content.form.join(" · ")}</p>`
      : `<p>${content.description}</p>${content.sections.map(section => `<section><h2>${section.heading}</h2>${(section.paragraphs ?? section.body ?? []).map((paragraph: string) => `<p>${paragraph}</p>`).join("")}${section.items ? `<ul>${section.items.map((item: string) => `<li>${item}</li>`).join("")}</ul>` : ""}</section>`).join("")}`;
    return res.send(botHTML(content.title, content.description, canonical, heading, body, {
      "@type": "WebPage", "name": content.title, "url": canonical, "inLanguage": locale,
    }, undefined, {
      lang: locale,
      alternates: [
        { lang: "en", href: `https://xfontat.com/en/${page}` },
        { lang: "fr", href: `https://xfontat.com/fr/${page}` },
        { lang: "ar", href: `https://xfontat.com/${page}` },
      ],
    }));
  });

  app.get("/", async (req, res, next) => {
    if (!isBot(req.headers['user-agent'] || '')) return next();
    const fonts = await storage.getAllFonts();
    const categories = Array.from(new Set(fonts.map(f => f.category)));
    const canonical = `https://xfontat.com/`;
    const title = "تحميل خطوط عربية مجانية | مكتبة xfontat";
    const desc = "تصفّح الخطوط العربية على xfontat، واطّلع على الصيغ المتاحة والترخيص ومعلومات المصدر في صفحة كل خط.";
    const catLinks = categories.map(c =>
      `<li><a href="/fonts/${categoryToSlug[c] || c}">${c}</a></li>`
    ).join('\n');
    const fontLinks = fonts.slice(0, 120).map(f =>
      `<li><a href="/font/${generateSlug(f.name, f.fileName, f.category)}">${f.nameArabic}</a></li>`
    ).join('\n');
    const body = `
<p>${desc}</p>
<h2>ما هو الخط العربي وما أهميته للمصمم؟</h2>
<p>الخط العربي نظام كتابة وفن بصري تطورت أساليبه عبر قرون وفي سياقات متعددة. يُكتب من اليمين إلى اليسار، وتتغير أشكال كثير من حروفه بحسب موقعها في الكلمة.</p>
<h2>كيف تختار الخط العربي المناسب لمشروعك؟</h2>
<p>ابدأ بتجربة أكثر من خط على النص والحجم والخلفية الفعلية لمشروعك. قارن وضوح الحروف، دعم التشكيل، الترخيص، وطريقة عرض الخط على الأجهزة المستهدفة؛ لا يوجد اختيار واحد مناسب لكل الشعارات أو المنشورات أو النصوص الطويلة.</p>
<h2>تصنيفات الخطوط العربية في xfontat</h2>
<ul>${catLinks}</ul>
<h2>لماذا تختار xfontat؟</h2>
<p>xfontat منصة عربية لتصفّح الخطوط العربية ومعاينتها. تتوفر الملفات للتنزيل بحسب الصيغ المدرجة في صفحة كل خط؛ راجع الترخيص الخاص به قبل الاستخدام التجاري. تتيح أداة المعاينة كتابة نص واختبار مظهره قبل التنزيل.</p>
<h2>أبرز الخطوط المتاحة للتحميل</h2>
<ul>${fontLinks}</ul>
`;
    const jsonLd = [
      {
        "@type": "WebSite",
        "name": "xfontat",
        "alternateName": "إكس فونتات",
        "url": "https://xfontat.com",
        "description": desc,
        "inLanguage": "ar",
        "potentialAction": {
          "@type": "SearchAction",
          "target": { "@type": "EntryPoint", "urlTemplate": "https://xfontat.com/?q={search_term_string}" },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "name": "xfontat",
        "alternateName": "إكس فونتات",
        "url": "https://xfontat.com",
        "description": "منصة لتصفح الخطوط العربية ومعاينتها والاطلاع على معلومات الصيغ والتراخيص المتاحة.",
        "inLanguage": "ar"
      },
      {
        "@type": "CollectionPage",
        "name": title,
        "description": desc,
        "url": "https://xfontat.com/",
        "inLanguage": "ar",
        "numberOfItems": fonts.length,
      },
      {
        "@type": "ItemList",
        "name": "أبرز الخطوط العربية",
        "numberOfItems": fonts.length,
        "itemListElement": fonts.slice(0, 20).map((f, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "item": {
            "@type": "SoftwareApplication",
            "name": f.nameArabic,
            "url": `https://xfontat.com/font/${generateSlug(f.name, f.fileName, f.category)}`,
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          }
        }))
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "كيف أحمل الخطوط من xfontat؟",
            "acceptedAnswer": { "@type": "Answer", "text": "افتح صفحة الخط واضغط على زر التنزيل؛ تعرض الصفحة الصيغة المتوفرة للملف." }
          },
          {
            "@type": "Question",
            "name": "هل جميع الخطوط مجانية للتحميل؟",
            "acceptedAnswer": { "@type": "Answer", "text": "نعم، جميع الخطوط في مكتبة xfontat متاحة للتحميل مجاناً بدون أي رسوم أو اشتراكات." }
          },
          {
            "@type": "Question",
            "name": "كيف أستخدم الخطوط في المشاريع التجارية؟",
            "acceptedAnswer": { "@type": "Answer", "text": "التحميل مجاني، لكن حقوق الاستخدام التجاري تختلف من خط إلى آخر. تحقق من رخصة كل خط قبل استخدامه في مشروع تجاري." }
          }
        ]
      }
    ];
    res.send(botHTML(
      title,
      desc,
      canonical,
      'مكتبة خطوط عربية مجانية للتحميل الفوري',
      body,
      jsonLd,
      undefined,
      {
        lang: "ar",
        alternates: [
          { lang: "ar", href: canonical },
          { lang: "en", href: "https://xfontat.com/en" },
          { lang: "fr", href: "https://xfontat.com/fr" },
          { lang: "x-default", href: canonical },
        ],
      }
    ));
  });

  app.get("/api/fonts", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const categories = req.query.categories as string | undefined;
      const page = parseInt(req.query.page as string) || 0;
      const limit = parseInt(req.query.limit as string) || 0;

      const q = req.query.q as string | undefined;

      if (page > 0 && limit > 0) {
        const [fonts, total] = await Promise.all([
          storage.getFontsPaginated(page, limit, category, q),
          storage.getFontsCount(category, q),
        ]);
        res.json({ data: fonts, total, page, limit });
      } else if (category) {
        const fonts = await storage.getFontsByCategory(category);
        res.json(fonts);
      } else if (categories) {
        const catList = categories.split(',').map(c => decodeURIComponent(c));
        const fonts = await storage.getFontsByCategories(catList);
        res.json(fonts);
      } else {
        const fonts = await storage.getAllFonts();
        res.json(fonts);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fonts" });
    }
  });

  app.get("/api/fonts/by-slug/:slug", async (req, res) => {
    try {
      const font = await storage.getFontBySlug(req.params.slug, generateSlug);
      if (!font) {
        return res.status(404).json({ error: "Font not found" });
      }
      res.json(font);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch font" });
    }
  });

  app.get("/api/fonts/count", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const total = await storage.getFontsCount(category);
      res.json({ total });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch count" });
    }
  });

  app.get("/api/fonts/:id", async (req, res) => {
    try {
      const font = await storage.getFontById(req.params.id);
      if (!font) {
        return res.status(404).json({ error: "Font not found" });
      }
      res.json(font);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch font" });
    }
  });

  app.post("/api/fonts", async (req, res) => {
    try {
      const validatedData = insertFontSchema.parse(req.body);
      const font = await storage.createFont(validatedData);
      res.status(201).json(font);
    } catch (error) {
      res.status(400).json({ error: "Invalid font data" });
    }
  });

  app.delete("/api/fonts/:id", async (req, res) => {
    try {
      const success = await storage.deleteFont(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Font not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete font" });
    }
  });

  app.get("/sitemap.xml", async (req, res) => {
    try {
      const baseUrl = "https://xfontat.com";

      const staticPages = [
        { url: "/", priority: "1.0", changefreq: "daily" },
        { url: "/en", priority: "1.0", changefreq: "daily" },
        { url: "/fr", priority: "1.0", changefreq: "daily" },
        ...(["en", "fr"] as const).flatMap(locale => [
          { url: `/${locale}/youtube-thumbnail-maker`, priority: "0.9", changefreq: "weekly" },
          { url: `/${locale}/design-fonts`, priority: "0.8", changefreq: "weekly" },
          { url: `/${locale}/blog`, priority: "0.7", changefreq: "weekly" },
          { url: `/${locale}/about`, priority: "0.5", changefreq: "monthly" },
          { url: `/${locale}/contact`, priority: "0.5", changefreq: "monthly" },
          { url: `/${locale}/privacy`, priority: "0.3", changefreq: "yearly" },
          { url: `/${locale}/terms`, priority: "0.3", changefreq: "yearly" },
        ]),
        { url: "/youtube-thumbnail-maker", priority: "0.9", changefreq: "weekly" },
        { url: "/design-fonts", priority: "0.9", changefreq: "weekly" },
        { url: "/blog", priority: "0.7", changefreq: "weekly" },
        { url: "/about", priority: "0.5", changefreq: "monthly" },
        { url: "/contact", priority: "0.5", changefreq: "monthly" },
        { url: "/privacy", priority: "0.3", changefreq: "yearly" },
        { url: "/terms", priority: "0.3", changefreq: "yearly" },
      ];

      const fonts = await storage.getAllFonts();
      const categories = Array.from(new Set(fonts.map(font => font.category)));
      const categoryPages = categories.map(cat => ({
        url: `/fonts/${categoryToSlug[cat] || cat}`,
        priority: "0.8",
        changefreq: "weekly"
      }));
      const englishCategoryPages = englishCategories.map(category => ({
        url: `/en/fonts/${category.slug}`,
        priority: "0.8",
        changefreq: "weekly",
      }));
      const frenchCategoryPages = frenchCategories.map(category => ({
        url: `/fr/fonts/${category.slug}`,
        priority: "0.8",
        changefreq: "weekly",
      }));

      const seenFontUrls = new Set<string>();
      const fontPages = fonts.flatMap(font => {
        const url = `/font/${generateSlug(font.name, font.fileName, font.category)}`;
        if (seenFontUrls.has(url)) return [];
        seenFontUrls.add(url);
        return [
          {
          url,
          priority: "0.7",
          changefreq: "monthly",
          lastmod: font.addedAt ? new Date(font.addedAt).toISOString() : undefined,
          },
          ...(["en", "fr"] as const).map(locale => ({
            url: `/${locale}${url}`,
            priority: "0.7",
            changefreq: "monthly",
            lastmod: font.addedAt ? new Date(font.addedAt).toISOString() : undefined,
          })),
        ];
      });

      const generatedBlogPosts = getGeneratedPosts().map(post => ({
        slug: post.slug,
        date: post.dateISO,
      }));
      const allBlogPostsForSitemap = [
        ...staticBlogPosts.map(p => ({ slug: p.slug, date: p.dateISO })),
        ...generatedBlogPosts,
      ];
      const seenSlugs = new Set<string>();
      const blogPages = allBlogPostsForSitemap
        .filter(post => {
          if (seenSlugs.has(post.slug)) return false;
          seenSlugs.add(post.slug);
          return true;
        })
        .flatMap(post => {
          const lastmod = new Date(post.date).toISOString();
          const entries = [{ url: `/blog/${post.slug}`, priority: "0.6", changefreq: "monthly", lastmod }];
          if (!localizedBlogPosts.en[post.slug] || !localizedBlogPosts.fr[post.slug]) return entries;
          return [
            ...entries,
            { url: `/en/blog/${post.slug}`, priority: "0.6", changefreq: "monthly", lastmod },
            { url: `/fr/blog/${post.slug}`, priority: "0.6", changefreq: "monthly", lastmod },
          ];
        });

      const collectionSlugs = collections.map(c => c.slug);
      const collectionPages = collectionSlugs.map(slug => ({
        url: `/collection/${slug}`,
        priority: "0.8",
        changefreq: "weekly",
      }));
      const localizedCollectionPages = (["en", "fr"] as const).flatMap(locale =>
        Object.keys(localizedCollections[locale]).map(slug => ({
          url: `/${locale}/collection/${slug}`,
          priority: "0.8",
          changefreq: "weekly",
        }))
      );

      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

      [...staticPages, ...categoryPages, ...englishCategoryPages, ...frenchCategoryPages, ...collectionPages, ...localizedCollectionPages, ...fontPages, ...blogPages].forEach((page: any) => {
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
        if (page.lastmod) {
          xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
        }
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += '  </url>\n';
      });

      xml += '</urlset>';

      res.header('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error) {
      res.status(500).send('Error generating sitemap');
    }
  });

  app.get("/robots.txt", (req, res) => {
    const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://xfontat.com/sitemap.xml`;

    res.header('Content-Type', 'text/plain');
    res.send(robotsTxt);
  });

  app.get("/api/blog/posts", (req, res) => {
    try {
      const posts = getGeneratedPosts();
      res.json(posts);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch generated posts" });
    }
  });

  app.get("/api/blog/posts/:slug", (req, res) => {
    try {
      const posts = getGeneratedPosts();
      const post = posts.find((p) => p.slug === req.params.slug);
      if (!post) return res.status(404).json({ error: "Post not found" });
      res.json(post);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  // Return a real 404 for unknown document routes instead of letting the SPA
  // fallback turn every typo into a successful-looking page.
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    const isAssetRequest =
      /\.[a-z0-9]{1,8}$/i.test(req.path) ||
      req.path.startsWith('/assets/') ||
      req.path.startsWith('/@') ||
      req.path.startsWith('/src/');
    if (isKnownRoute(req.path) || isAssetRequest) return next();
    const canonical = `https://xfontat.com${req.path}`;
    const body = `
<p>الصفحة التي تبحث عنها غير موجودة.</p>
<p><a href="/">العودة إلى الرئيسية</a></p>`;
    res.status(404).send(botHTML(
      'صفحة غير موجودة | xfontat',
      'الصفحة التي تبحث عنها غير موجودة في مكتبة الخطوط العربية xfontat.',
      canonical,
      '404 - صفحة غير موجودة',
      body
    ));
  });

  const httpServer = createServer(app);

  return httpServer;
}
