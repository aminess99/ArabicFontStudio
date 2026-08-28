import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFontSchema } from "@shared/schema";
import { getGeneratedPosts } from "./blogGenerator";
import { blogPosts as staticBlogPosts } from "../client/src/lib/blogData";
import { collections } from "../client/src/lib/collectionsData";

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

function generateSlug(fontName: string): string {
  return fontName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    + "-font";
}

const BOT_AGENTS = [
  'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
  'yandexbot', 'facebot', 'ia_archiver', 'ahrefsbot', 'semrushbot',
  'mj12bot',
  // AI crawlers
  'gptbot', 'claudebot', 'perplexitybot', 'applebot', 'anthropic-ai',
  'cohere-ai', 'ai2bot', 'diffbot', 'imagesiftbot', 'omgilibot',
  // Social / share scrapers
  'twitterbot', 'linkedinbot', 'whatsapp', 'telegrambot', 'slackbot',
  'discordbot', 'facebookexternalhit', 'pinterestbot', 'snapchat',
  'vkshare', 'w3c_validator', 'embedly', 'quora link preview',
];

function markdownToHtml(content: string): string {
  const paragraphs = content.split(/\n\n+/).filter(Boolean);
  return paragraphs.map(block => {
    const trimmed = block.trim();

    if (/^# .+/.test(trimmed)) {
      const text = trimmed.replace(/^# /, '').replace(/\*\*/g, '');
      return `<h1>${text}</h1>`;
    }

    if (/^## .+/.test(trimmed)) {
      const text = trimmed.replace(/^## /, '').replace(/\*\*/g, '');
      return `<h2>${text}</h2>`;
    }

    if (/^### .+/.test(trimmed)) {
      const text = trimmed.replace(/^### /, '').replace(/\*\*/g, '');
      return `<h3>${text}</h3>`;
    }

    if (trimmed.startsWith('**') && trimmed.endsWith('**:')) {
      const text = trimmed.replace(/\*\*/g, '').replace(/:$/, '');
      return `<h2>${text}</h2>`;
    }

    const boldHeading = trimmed.match(/^\*\*(.+?)\*\*:?\s*/);
    if (trimmed.startsWith('**') && boldHeading) {
      const heading = boldHeading[1];
      const rest = trimmed.replace(/^\*\*(.+?)\*\*:?\s*/, '').replace(/\*\*/g, '');
      return `<h3>${heading}</h3>${rest ? `<p>${rest}</p>` : ''}`;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split('\n').filter(Boolean).map(item =>
        `<li>${item.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '')}</li>`
      ).join('');
      return `<ol>${items}</ol>`;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items = trimmed.split('\n').filter(Boolean).map(item =>
        `<li>${item.replace(/^[-*]\s/, '').replace(/\*\*/g, '')}</li>`
      ).join('');
      return `<ul>${items}</ul>`;
    }

    const text = trimmed.replace(/\*\*/g, '');
    return `<p>${text}</p>`;
  }).join('\n');
}

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
    intro: "خط الثلث هو تاج الخطوط العربية وأجملها على الإطلاق. يُعدّ من أعرق فنون الخط العربي وأكثرها تعقيداً وجمالاً، إذ يجمع بين التراث الأصيل والإبداع الفني الرفيع. سُمّي بالثلث لأن ثلث الحرف يكون مستقيماً وثلثاه منحنيان. ولا يزال هذا الخط اليوم الأكثر شيوعاً في الزخارف المعمارية والنصوص الدينية والأعمال الفنية الراقية.",
    history: "نشأ خط الثلث في العراق خلال القرن العاشر الميلادي على يد الخطاط ابن مقلة، وتطوّر لاحقاً على يد كبار الخطاطين كياقوت المستعصمي وابن البوّاب. ازدهر الخط في العصر العباسي وأصبح الخط الرسمي للمساجد والمدارس والقصور. وفي العصر العثماني، أتقنه الخطاطون الأتراك وطوّروه إلى أشكال بالغة الجمال، حتى باتت القسطنطينية مركزاً عالمياً لفن خط الثلث.",
    usageTips: "يُستخدم خط الثلث في: الزخارف المعمارية للمساجد والمباني، تصميم الشعارات الفاخرة، أغلفة الكتب التراثية، والأعمال الفنية. استخدمه في العناوين الرئيسية الكبيرة لا في النصوص الطويلة. يبدو في أبهى صوره على خلفيات داكنة بلون ذهبي أو أبيض.",
    faq: "هل يصلح خط الثلث للشاشات الرقمية؟ نعم للعناوين والبانرات الكبيرة. هل هو مجاني؟ نعم، جميع خطوط الثلث في xfontat متاحة للتحميل المجاني بصيغ TTF وOTF."
  },
  "ديواني": {
    intro: "خط الديواني من أكثر الخطوط العربية رشاقةً وأناقةً، يتميز بانسيابيته الجذابة وزخارفه الفريدة. نشأ في أروقة الديوان العثماني الملكي ليصبح رمزاً للسلطة والفخامة والرقيّ. اليوم، يُستخدم خط الديواني في المناسبات الاحتفالية والأعمال الفنية الراقية، وهو الخيار الأول لبطاقات الأفراح والشهادات التكريمية.",
    history: "نشأ خط الديواني في الإمبراطورية العثمانية في القرن الخامس عشر الميلادي. ويُنسب اختراعه إلى الخطاط إبراهيم منيف في عهد السلطان محمد الفاتح، حيث استُخدم في ديوان السلطان للمراسيم والوثائق الرسمية. وتفرّع منه الخط الديواني الجلي الذي يُضاف إليه زخارف هندسية تملأ الفراغات بين الحروف.",
    usageTips: "مثالي لـ: بطاقات الأفراح والمناسبات الراقية، الشهادات وشهادات التقدير، التصاميم الفنية الزخرفية، العلامات التجارية الفاخرة. اختر لوناً ذهبياً على خلفيات فاتحة. تجنب استخدامه في فقرات النص الطويل.",
    faq: "ما الفرق بين الديواني والديواني الجلي؟ الديواني العادي رشيق وسهل القراءة نسبياً، أما الجلي فأكثر تزخرفاً وتعقيداً. هل هو مجاني؟ نعم، جميع خطوط الديواني متاحة للتحميل المجاني من xfontat."
  },
  "رقعة": {
    intro: "خط الرقعة هو الخط الأكثر استخداماً في الحياة اليومية للعرب، يتميز بسرعة الكتابة ووضوح الشكل وسهولة القراءة. ورغم بساطته الظاهرة، فإنه يمتلك شخصية بصرية قوية ومتماسكة تجعله مناسباً لمختلف التصاميم العصرية والرقمية. يجمع خط الرقعة بين العملية والجمال، مما يجعله الاختيار الأمثل للمصمم العصري.",
    history: "نشأ خط الرقعة في الدولة العثمانية في القرن التاسع عشر الميلادي، في عهد السلطان محمود الثاني. طوّره الخطاط ممتاز بك لتسهيل كتابة الوثائق الرسمية بسرعة. انتشر انتشاراً واسعاً في المشرق العربي وأصبح الخط الغالب في المدارس والصحف ولافتات المحلات.",
    usageTips: "مثالي لـ: منشورات السوشال ميديا، تصميم واجهات المستخدم، لافتات المحلات، طباعة الكتب والمجلات. يعمل بشكل رائع من 14px إلى 72px. يبدو رائعاً على خلفيات ملوّنة جريئة.",
    faq: "هل خط الرقعة مناسب للمواقع الإلكترونية؟ نعم، خطوط الرقعة الرقمية مثالية للويب. هل يمكن استخدامه في فقرات طويلة؟ نعم لكن النسخ أنسب للنصوص الطويلة جداً."
  },
  "كوفي": {
    intro: "خط الكوفي هو أعرق الخطوط العربية وأقدمها، فمنه نشأت جميع الخطوط العربية الأخرى. يتميز بزواياه الهندسية الحادة وبنيته المربعة المتناسقة التي تمنحه مظهراً عصرياً رغم تاريخه الضارب في القِدَم. يجمع خط الكوفي بين الأصالة والحداثة ليكون الخيار المفضل للمصممين الباحثين عن هوية بصرية مميزة.",
    history: "نشأ الخط الكوفي في مدينة الكوفة العراقية في القرن الأول الهجري (السابع الميلادي). كُتبت به أولى نسخ المصحف الشريف وسُكّ به على العملات الإسلامية الأولى. وبمرور الزمن، تطوّر إلى أشكال عديدة: الكوفي المربع، المضفّر، المورّق، الهندسي، والزخرفي.",
    usageTips: "مثالي لـ: تصميم الشعارات والهوية البصرية، الفن المعماري والزخرفة، تصميم واجهات المستخدم الحديثة. استخدم لوناً واحداً فقط لإبراز بنيته الهندسية. أعطه مساحة بيضاء كافية حوله.",
    faq: "هل الكوفي مناسب للنصوص الطويلة؟ لا، هو مثالي للعناوين والشعارات فقط. ما أنواعه الشائعة؟ الكوفي الهندسي والكوفي التقريبي الأكثر استخداماً في التصميم الحديث."
  },
  "نسخ": {
    intro: "خط النسخ هو عماد الطباعة العربية وأوسع الخطوط استخداماً في العالم العربي. يتميز بوضوحه الاستثنائي وسهولة قراءته في مختلف الأحجام، مما يجعله الخيار الطبيعي للكتب والصحف والمواقع الإلكترونية والتطبيقات. خط النسخ هو لغة الكلمة المكتوبة العربية بامتياز.",
    history: "طوّر خط النسخ الخطاط ابن مقلة في بغداد خلال القرن العاشر الميلادي ليحلّ محل الخط الكوفي. ارتقى به ابن البوّاب ثم ياقوت المستعصمي. ومع ظهور الطباعة، أصبح النسخ الخط الرئيسي في الصحافة والنشر، وهو خط القرآن الكريم في أغلب مصاحف العالم.",
    usageTips: "مثالي لـ: الكتب والمطبوعات الأكاديمية، المواقع والتطبيقات، الصحف والمجلات، القرآن الكريم والمحتوى الديني. استخدم أوزاناً مختلفة لإنشاء تراتبية نصية. حجم 16px مع تباعد 1.6 مثالي للويب.",
    faq: "ما أفضل خطوط النسخ للمواقع؟ Cairo وNoto Sans Arabic وTajawal وAmiri. هل يصلح النسخ للشعارات؟ يمكن لكن الكوفي والثلث أقوى تأثيراً."
  },
  "تصميم": {
    intro: "خطوط التصميم العربية هي مجموعة متنوعة من الخطوط الحديثة والمبتكرة التي ابتكرها مصممون معاصرون لتلبية احتياجات التصميم الإبداعي المتطور. تتنوع بين الهندسية والتعبيرية والعصرية، وتمتلك كل منها شخصية بصرية مميزة تجعلها أدوات قوية في يد المصمم المحترف.",
    history: "شهدت العقود الأخيرة ازدهاراً غير مسبوق في مجال تصميم الخطوط العربية المعاصرة. مع انتشار الحاسوب وبرامج التصميم في ثمانينيات القرن الماضي، تحوّل كثير من الخطاطين والمصممين إلى تحويل فنهم إلى خطوط رقمية. اليوم تزخر المكتبات الرقمية بآلاف الخطوط التصميمية التي تعكس روح العصر.",
    usageTips: "مثالي لـ: الإعلانات والحملات التسويقية، منشورات السوشال ميديا، الهوية البصرية للعلامات التجارية، عروض PowerPoint. لا تستخدم أكثر من خطين في تصميم واحد. خطوط التصميم تحتاج مساحة بيضاء كافية.",
    faq: "كيف أختار خط التصميم المناسب؟ حدد الشخصية: جريئة وقوية أم أنيقة وفاخرة؟ هل يمكن استخدامها تجارياً؟ معظم الخطوط في xfontat مجانية للاستخدام التجاري."
  },
  "خطوط الحرة": {
    intro: "خطوط الحرة العربية هي مجموعة من الخطوط التعبيرية والغرافيتي والزخرفية ذات الشخصية البصرية الجريئة. صُممت للعناوين والملصقات والشعارات والتصاميم التي تحتاج إلى حضور قوي ولافت.",
    history: "تطورت الخطوط الحرة مع انتشار التصميم الرقمي وبرامج الرسم والنشر، حيث أصبح المصممون يمزجون بين الحروف العربية والزخرفة والتأثيرات البصرية الحديثة لإنشاء أساليب غير تقليدية.",
    usageTips: "مناسبة للشعارات والملصقات والإعلانات ومنشورات السوشال ميديا وأغلفة المحتوى. استخدمها في العناوين والنصوص القصيرة، وتجنب استخدامها في الفقرات الطويلة لضمان سهولة القراءة.",
    faq: "هل خطوط الحرة مناسبة للنصوص الطويلة؟ لا، الأفضل استخدامها للعناوين والتصاميم البصرية. هل كل الخطوط مجانية للاستخدام التجاري؟ يجب مراجعة ترخيص كل خط على حدة قبل الاستخدام التجاري."
  },
  "فوتوشوب": {
    intro: "خطوط الفوتوشوب العربية هي مجموعة متخصصة من الخطوط المُصمَّمة خصيصاً للعمل بكفاءة عالية مع برامج التصميم الجرافيكي كـ Adobe Photoshop وIllustrator وAfter Effects. تتميز بوضوحها الاستثنائي عند التكبير والتصغير، وبدعمها لميزات OpenType المتقدمة.",
    history: "مع انتشار Adobe Photoshop في العالم العربي خلال التسعينيات، نشأت حاجة ماسّة لخطوط عربية مُحسَّنة للعمل مع هذا البرنامج. عمل مصممون ومبرمجون عرب على حل مشكلة الاتجاه العربي (RTL) وابتكروا خطوطاً متوافقة تماماً مع بيئة Photoshop.",
    usageTips: "مثالي لـ: تصاميم البوسترات والإعلانات، تحرير الصور وإضافة نصوص، منشورات السوشال ميديا، التصميم المطبوع. فعّل World-Ready Composer في Photoshop للكتابة العربية الصحيحة. استخدم 300dpi للطباعة.",
    faq: "كيف أثبّت الخط في Photoshop؟ ثبّت ملف TTF/OTF ثم أعد تشغيل البرنامج. لماذا تظهر الحروف مقطوعة؟ فعّل Middle Eastern Features في إعدادات Photoshop."
  },
  "نستعليق": {
    intro: "خط النستعليق هو جوهرة الخط الفارسي وعروس الخطوط في التراث الإسلامي. يتميز بشكله الحركي المميز حيث تميل الكلمات بشكل مائل رقيق يوحي بالانسياب والرشاقة. نشأ في إيران وانتشر في آسيا الوسطى وشبه القارة الهندية، وهو حتى اليوم الخط الرسمي للغة الأردية.",
    history: "ابتكر خط النستعليق الخطاط الإيراني مير علي تبريزي في القرن الرابع عشر الميلادي. يعني الاسم جمعاً بين كلمتي نسخ وتعليق. ازدهر في إيران وأصبح لغة الشعر الفارسي والأدب الرفيع، وانتقل إلى الهند ليصبح الخط الأساسي للغة الأردية.",
    usageTips: "مثالي لـ: المحتوى الأردي والفارسي، الشعر والأدب الكلاسيكي، التصاميم الراقية والفاخرة، غلافات كتب الشعر. يحتاج مسافات سخية بين الأسطر (2.0 أو أكثر). يبدو في أجمل صوره على خلفيات ورقية أو بألوان ترابية.",
    faq: "ما الفرق بين النستعليق والتعليق؟ النستعليق أكثر تعقيداً وجمالاً، يجمع بين النسخ والتعليق. هل يمكن كتابة العربية بالنستعليق؟ نعم، لكنه أكثر شيوعاً للأردية والفارسية."
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
  // Dynamic rendering for search engine bots

  app.get("/font/:slug", async (req, res, next) => {
    if (!isBot(req.headers['user-agent'] || '')) return next();
    const fonts = await storage.getAllFonts();
    const font = fonts.find(f => generateSlug(f.name) === req.params.slug);
    if (!font) return next();
    const canonical = `https://xfontat.com/font/${req.params.slug}`;
    const title = `تحميل خط ${font.nameArabic} مجاناً | xfontat`;
    const desc = `حمّل خط ${font.nameArabic} (${font.name}) مجاناً بصيغة ${font.fileFormat || 'TTF'}. خط ${font.category} احترافي متاح للتحميل المباشر.`;
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
    if (!isBot(req.headers['user-agent'] || '')) return next();
    const arabicCat = slugToCategory[req.params.category];
    if (!arabicCat) return next();
    const fonts = await storage.getAllFonts();
    const catFonts = fonts.filter(f => f.category === arabicCat);
    const canonical = `https://xfontat.com/fonts/${req.params.category}`;
    const title = `خطوط ${arabicCat} العربية - تحميل مجاني | xfontat`;
    const desc = `اكتشف ${catFonts.length} خط ${arabicCat} عربي احترافي. تحميل مجاني بصيغ TTF وOTF.`;
    const links = catFonts.slice(0, 60).map(f =>
      `<li><a href="/font/${generateSlug(f.name)}">${f.nameArabic} - ${f.name}</a></li>`
    ).join('\n');
    const content = categoryContent[arabicCat];
    const richContent = content ? `
<h2>عن خطوط ${arabicCat}</h2>
<p>${content.intro}</p>
<h2>تاريخ خط ${arabicCat}</h2>
<p>${content.history}</p>
<h2>استخدامات ونصائح</h2>
<p>${content.usageTips}</p>
<h2>أسئلة شائعة عن خطوط ${arabicCat}</h2>
<p>${content.faq}</p>
` : '';
    const body = `<p>${desc}</p>${richContent}<h2>قائمة خطوط ${arabicCat} (${catFonts.length} خط)</h2><ul>${links}</ul>`;
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
        "name": `خطوط ${arabicCat}`,
        "numberOfItems": catFonts.length,
        "itemListElement": catFonts.slice(0, 20).map((f, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "item": {
            "@type": "SoftwareApplication",
            "name": f.nameArabic,
            "url": `https://xfontat.com/font/${generateSlug(f.name)}`,
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://xfontat.com/" },
          { "@type": "ListItem", "position": 2, "name": `خطوط ${arabicCat}`, "item": canonical },
        ]
      },
      ...(content ? [{
        "@type": "FAQPage",
        "mainEntity": [{ "@type": "Question", "name": content.faq.split('؟')[0] + '؟', "acceptedAnswer": { "@type": "Answer", "text": content.faq.split('؟').slice(1).join('؟') } }]
      }] : [])
    ];
    res.send(botHTML(title, desc, canonical, `خطوط ${arabicCat}`, body, jsonLd));
  });

  app.get("/blog/:slug", async (req, res, next) => {
    if (!isBot(req.headers['user-agent'] || '')) return next();
    const slug = req.params.slug;

    // Check static blog posts first
    const staticPost = staticBlogPosts.find(p => p.slug === slug);
    if (staticPost) {
      const canonical = `https://xfontat.com/blog/${slug}`;
      const contentHtml = markdownToHtml(staticPost.content || '');
      const body = `<p>${staticPost.excerpt || ''}</p>${contentHtml}`;
      const jsonLd = [
        {
          "@type": "Article",
          "headline": staticPost.title,
          "description": staticPost.excerpt,
          "url": canonical,
          "inLanguage": "ar",
          "author": { "@type": "Person", "name": staticPost.author },
          "datePublished": staticPost.dateISO,
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
    if (!post) return next();
    const canonical = `https://xfontat.com/blog/${slug}`;
    const contentHtml = markdownToHtml(post.content || '');
    const body = `<p>${post.excerpt || ''}</p>${contentHtml}`;
    const jsonLd = [
      {
        "@type": "Article",
        "headline": post.title,
        "description": post.excerpt,
        "url": canonical,
        "inLanguage": "ar",
        "author": { "@type": "Person", "name": post.author || "فريق xfontat" },
        "datePublished": post.dateISO,
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
    const desc = `اكتشف ${designFonts.length}+ خط عربي عصري للتصميم الجرافيكي والهوية البصرية والسوشال ميديا. تحميل مجاني.`;
    const fontLinks = designFonts.slice(0, 50).map(f =>
      `<li><a href="/font/${generateSlug(f.name)}">${f.nameArabic}</a></li>`
    ).join('\n');
    const body = `
<p>${desc}</p>
<h2>لماذا تختار خطوط التصميم العربية الحديثة؟</h2>
<p>خطوط التصميم العربية الحديثة تجمع بين الأصالة العربية والحداثة الرقمية. مثالية للشعارات ومنشورات السوشال ميديا والهوية البصرية.</p>
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

  app.get("/collection/:slug", (req, res, next) => {
    if (!isBot(req.headers['user-agent'] || '')) return next();
    const collection = collections.find(c => c.slug === req.params.slug);
    if (!collection) return next();
    const canonical = `https://xfontat.com/collection/${req.params.slug}`;
    const title = `${collection.titleArabic} | xfontat`;
    const desc = collection.description;
    const faqHtml = collection.faqs.map(f =>
      `<h3>${f.question}</h3><p>${f.answer}</p>`
    ).join('\n');
    const useCaseList = collection.useCases.map(u => `<li>${u}</li>`).join('\n');
    const body = `
<p>${collection.longDescription}</p>
<h2>حالات الاستخدام</h2>
<ul>${useCaseList}</ul>
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
    const title = 'من نحن | xfontat - مكتبة الخطوط العربية';
    const desc = 'تعرف على xfontat، منصة الخطوط العربية الاحترافية التي توفر أكبر مجموعة من الخطوط العربية المجانية للمصممين والمطورين.';
    const body = `
<p>${desc}</p>
<h2>ما هي xfontat؟</h2>
<p>xfontat هي منصة متخصصة في توفير الخطوط العربية الاحترافية المجانية. نسعى لأن نكون المرجع الأول للمصممين والمطورين العرب الباحثين عن خطوط عربية عالية الجودة.</p>
<h2>مهمتنا</h2>
<p>نؤمن بأن الوصول إلى الخطوط العربية الاحترافية يجب أن يكون سهلاً ومجانياً للجميع. لذلك، نوفر مكتبة شاملة تضم مئات الخطوط العربية بأنماط متنوعة: ثلث، ديواني، كوفي، نسخ، رقعة، وغيرها.</p>
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
        "description": "منصة متخصصة في توفير الخطوط العربية الاحترافية والمجانية"
      }
    };
    res.send(botHTML(title, desc, canonical, 'من نحن - xfontat', body, jsonLd));
  });

  app.get("/contact", (req, res, next) => {
    if (!isBot(req.headers['user-agent'] || '')) return next();
    const canonical = 'https://xfontat.com/contact';
    const title = 'اتصل بنا | xfontat';
    const desc = 'تواصل مع فريق xfontat لأي استفسارات حول الخطوط العربية، الاقتراحات، أو الدعم الفني.';
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
    const title = 'سياسة الخصوصية | xfontat';
    const desc = 'اقرأ سياسة الخصوصية الخاصة بمنصة xfontat لتعرف كيف نتعامل مع بياناتك الشخصية.';
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
    const title = 'شروط الاستخدام | xfontat';
    const desc = 'اقرأ شروط وأحكام استخدام منصة xfontat لمكتبة الخطوط العربية.';
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
    const title = `xfontat | تحميل خطوط عربية مجانية - ${fonts.length} خط`;
    const desc = `مكتبة شاملة من ${fonts.length} خط عربي احترافي: ثلث، ديواني، رقعة، كوفي، نسخ، تصميم، فوتوشوب، نستعليق. تحميل مجاني.`;
    const catLinks = categories.map(c =>
      `<li><a href="/fonts/${categoryToSlug[c] || c}">${c} (${fonts.filter(f => f.category === c).length} خط)</a></li>`
    ).join('\n');
    const fontLinks = fonts.slice(0, 120).map(f =>
      `<li><a href="/font/${generateSlug(f.name)}">${f.nameArabic}</a></li>`
    ).join('\n');
    const body = `
<p>${desc}</p>
<h2>ما هو الخط العربي وما أهميته للمصمم؟</h2>
<p>الخط العربي فن بصري راقٍ يجمع بين الجمال الجمالي والوظيفة التواصلية. نشأ منذ أكثر من أربعة عشر قرناً وتطور عبر حضارات متعاقبة لينتج لنا اليوم مدرسة خطية فريدة لا مثيل لها في تنوعها وثرائها. يختلف الخط العربي عن الخط اللاتيني في كونه يُكتب من اليمين إلى اليسار، وفي أن الحرف العربي يغيّر شكله بحسب موقعه في الكلمة (بداية، وسط، نهاية)، مما يمنحه ديناميكية بصرية استثنائية.</p>
<h2>كيف تختار الخط العربي المناسب لمشروعك؟</h2>
<p>للشعارات والهوية البصرية: اختر الكوفي الهندسي للطابع الحديث أو الثلث للأصالة. لمنشورات السوشال ميديا: خطوط الرقعة والتصميم الحديثة مثالية. للكتب والمحتوى الطويل: خط النسخ هو الاختيار الأمثل. للدعوات والمناسبات: الديواني هو الملك بلا منازع. للفوتوشوب والتصميم الجرافيكي: استخدم خطوط الفوتوشوب المحسّنة.</p>
<h2>تصنيفات الخطوط العربية في xfontat</h2>
<ul>${catLinks}</ul>
<h2>لماذا تختار xfontat؟</h2>
<p>xfontat هي المنصة العربية الأولى المتخصصة في توفير مجموعة شاملة من الخطوط العربية الاحترافية المجانية. نضع بين يديك أكثر من ${fonts.length} خطاً عربياً متنوعاً في ثمانية أصناف رئيسية. جميع الخطوط متاحة للتحميل الفوري بصيغتي TTF وOTF دون تسجيل أو اشتراك. تتميز منصتنا بأداة المعاينة التفاعلية التي تتيح لك كتابة نصك الخاص ومعاينته بأي خط قبل التحميل.</p>
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
        "description": "منصة متخصصة في توفير الخطوط العربية الاحترافية والمجانية",
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
            "url": `https://xfontat.com/font/${generateSlug(f.name)}`,
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
            "acceptedAnswer": { "@type": "Answer", "text": "يمكنك تحميل أي خط بسهولة من خلال الضغط على زر التحميل بجانب كل خط. الخطوط متاحة بصيغ TTF و OTF." }
          },
          {
            "@type": "Question",
            "name": "هل جميع الخطوط مجانية للتحميل؟",
            "acceptedAnswer": { "@type": "Answer", "text": "نعم، جميع الخطوط في مكتبة xfontat متاحة للتحميل مجاناً بدون أي رسوم أو اشتراكات." }
          },
          {
            "@type": "Question",
            "name": "كيف أستخدم الخطوط في المشاريع التجارية؟",
            "acceptedAnswer": { "@type": "Answer", "text": "جميع الخطوط في xfontat متاحة للاستخدام في المشاريع الشخصية والتجارية. تحقق من رخصة كل خط للحصول على تفاصيل الاستخدام الكاملة." }
          }
        ]
      }
    ];
    res.send(botHTML(title, desc, canonical, 'مكتبة الخطوط العربية المجانية - xfontat', body, jsonLd));
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

      const fontPages = fonts.map(font => ({
        url: `/font/${generateSlug(font.name)}`,
        priority: "0.7",
        changefreq: "monthly",
        lastmod: font.addedAt ? new Date(font.addedAt).toISOString() : new Date().toISOString(),
      }));

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
        lastmod: new Date("2026-03-27").toISOString(),
      }));

      const now = new Date().toISOString();

      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

      [...staticPages, ...categoryPages, ...collectionPages, ...fontPages, ...blogPages].forEach((page: any) => {
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
        xml += `    <lastmod>${page.lastmod ?? now}</lastmod>\n`;
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

  // Bot 404 catch-all: return a real 404 for bots hitting unknown routes
  app.use((req, res, next) => {
    if (!isBot(req.headers['user-agent'] || '')) return next();
    if (isKnownRoute(req.path)) return next();
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
