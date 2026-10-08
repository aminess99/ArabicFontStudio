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

function botHTML(
  title: string,
  description: string,
  canonical: string,
  h1: string,
  body: string,
  jsonLd?: object | object[],
  image?: string
): string {
  const ogImage = image || FALLBACK_OG_IMAGE;
  const jsonLdScript = jsonLd
    ? `<script type="application/ld+json">${JSON.stringify(Array.isArray(jsonLd) ? { "@context": "https://schema.org", "@graph": jsonLd } : jsonLd)}</script>`
    : '';
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
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
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:alt" content="${title}">
<meta property="og:locale" content="ar_AR">
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
<nav>
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
<a href="/contact">اتصل بنا</a>
</nav>
</body>
</html>`;
}

const KNOWN_ROUTE_PATTERNS = [
  /^\/$/,
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
    res.send(botHTML(title, desc, canonical, categoryLabel, body, jsonLd));
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
    res.send(botHTML(title, desc, canonical, 'مكتبة خطوط عربية مجانية للتحميل الفوري', body, jsonLd));
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

      const seenFontUrls = new Set<string>();
      const fontPages = fonts.flatMap(font => {
        const url = `/font/${generateSlug(font.name, font.fileName, font.category)}`;
        if (seenFontUrls.has(url)) return [];
        seenFontUrls.add(url);
        return [{
          url,
          priority: "0.7",
          changefreq: "monthly",
          lastmod: font.addedAt ? new Date(font.addedAt).toISOString() : undefined,
        }];
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
        .map(post => ({
          url: `/blog/${post.slug}`,
          priority: "0.6",
          changefreq: "monthly",
          lastmod: new Date(post.date).toISOString(),
        }));

      const collectionSlugs = collections.map(c => c.slug);
      const collectionPages = collectionSlugs.map(slug => ({
        url: `/collection/${slug}`,
        priority: "0.8",
        changefreq: "weekly",
      }));

      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

      [...staticPages, ...categoryPages, ...collectionPages, ...fontPages, ...blogPages].forEach((page: any) => {
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
