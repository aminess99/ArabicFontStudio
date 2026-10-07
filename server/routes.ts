import type { Express } from "express";
import { createServer, type Server } from "http";
import * as fs from "node:fs";
import * as path from "node:path";
import { storage } from "./storage";
import { insertFontSchema } from "@shared/schema";
import { getGeneratedPosts } from "./blogGenerator";
import { blogPosts as staticBlogPosts } from "../client/src/lib/blogData";
import { collections } from "../client/src/lib/collectionsData";
import { getBlogInternalLinks } from "../client/src/lib/blogInternalLinks";
import { registerThumbnailRoutes } from "./thumbnailGenerator";

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
  if (category === "خطوط الحرة") return "خطوط الغرافيتي";
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

function markdownToHtml(content: string): string {
  const paragraphs = content.split(/\n\n+/).filter(Boolean);
  // The page shell owns the article's single H1. Generated Markdown can
  // repeat that title as a leading "# ..." block, so omit only that first
  // document title while preserving all subordinate headings. Any other
  // level-one Markdown headings are demoted so article content can never
  // introduce a second H1.
  const firstBlock = paragraphs[0]?.trim();
  const contentBlocks = firstBlock && /^#\s+/.test(firstBlock)
    ? paragraphs.slice(1)
    : paragraphs;
  return contentBlocks.map(block => {
    const trimmed = block.trim();

    if (/^# .+/.test(trimmed)) {
      const text = trimmed.replace(/^# /, '').replace(/\*\*/g, '');
      return `<h2>${text}</h2>`;
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
    faq: "كيف أختار خط التصميم المناسب؟ حدد الشخصية: جريئة وقوية أم أنيقة وفاخرة؟ هل يمكن استخدامها تجارياً؟ يعتمد ذلك على ترخيص الخط، لذا راجع ترخيص كل خط قبل الاستخدام التجاري."
  },
  "خطوط الحرة": {
    intro: "خطوط الغرافيتي العربية هي مجموعة من الخطوط التعبيرية والزخرفية ذات الشخصية البصرية الجريئة. صُممت للعناوين والملصقات والشعارات والتصاميم التي تحتاج إلى حضور قوي ولافت.",
    history: "تطورت خطوط الغرافيتي مع انتشار التصميم الرقمي وبرامج الرسم والنشر، حيث أصبح المصممون يمزجون بين الحروف العربية والزخرفة والتأثيرات البصرية الحديثة لإنشاء أساليب غير تقليدية.",
    usageTips: "مناسبة للشعارات والملصقات والإعلانات ومنشورات السوشال ميديا وأغلفة المحتوى. استخدمها في العناوين والنصوص القصيرة، وتجنب استخدامها في الفقرات الطويلة لضمان سهولة القراءة.",
    faq: "هل خطوط الغرافيتي مناسبة للنصوص الطويلة؟ لا، الأفضل استخدامها للعناوين والتصاميم البصرية. هل كل الخطوط مجانية للاستخدام التجاري؟ يجب مراجعة ترخيص كل خط على حدة قبل الاستخدام التجاري."
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
const SAFE_FALLBACK_SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://xfontat.com/</loc></url>
  <url><loc>https://xfontat.com/fonts</loc></url>
  <url><loc>https://xfontat.com/design-fonts</loc></url>
  <url><loc>https://xfontat.com/blog</loc></url>
  <url><loc>https://xfontat.com/about</loc></url>
  <url><loc>https://xfontat.com/contact</loc></url>
  <url><loc>https://xfontat.com/privacy</loc></url>
  <url><loc>https://xfontat.com/terms</loc></url>
</urlset>`;
let lastGoodSitemapXml: string | null = null;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

let cachedClientBootMarkup: string | null = null;

function getClientBootMarkup(): string {
  if (cachedClientBootMarkup) return cachedClientBootMarkup;
  if (process.env.NODE_ENV === "development") {
    cachedClientBootMarkup =
      `<script type="module">
import RefreshRuntime from "/@react-refresh";
RefreshRuntime.injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => (type) => type;
window.__vite_plugin_react_preamble_installed__ = true;
</script>
<script type="module" src="/@vite/client"></script>
<script type="module" src="/src/main.tsx"></script>`;
    return cachedClientBootMarkup;
  }

  const builtIndexPath = path.resolve(process.cwd(), "dist/public/index.html");
  const builtIndex = fs.readFileSync(builtIndexPath, "utf8");
  const styles = (builtIndex.match(/<link\b(?=[^>]*\brel=["']stylesheet["'])[^>]*>/gi) || [])
    .join("\n");
  const scripts = (builtIndex.match(/<script\b(?=[^>]*\btype=["']module["'])[^>]*><\/script>/gi) || [])
    .join("\n");
  if (!scripts) throw new Error(`No application module script found in ${builtIndexPath}`);

  cachedClientBootMarkup = `${styles}\n${scripts}`;
  return cachedClientBootMarkup;
}

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
    ? `<script type="application/ld+json">${JSON.stringify(Array.isArray(jsonLd) ? { "@context": "https://schema.org", "@graph": jsonLd } : jsonLd).replace(/</g, "\\u003c")}</script>`
    : '';
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeCanonical = escapeHtml(canonical);
  const safeH1 = escapeHtml(h1);
  const safeImage = escapeHtml(ogImage);
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="index, follow">
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="256x256" href="/favicon.png">
<link rel="shortcut icon" href="/favicon.ico">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap" rel="stylesheet">
<title>${safeTitle}</title>
<meta name="description" content="${safeDescription}">
<link rel="canonical" href="${safeCanonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:title" content="${safeTitle}">
<meta property="og:description" content="${safeDescription}">
<meta property="og:url" content="${safeCanonical}">
<meta property="og:image" content="${safeImage}">
<meta property="og:image:alt" content="${safeTitle}">
<meta property="og:locale" content="ar_AR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@xfontat">
<meta name="twitter:title" content="${safeTitle}">
<meta name="twitter:description" content="${safeDescription}">
<meta name="twitter:image" content="${safeImage}">
<meta name="twitter:image:alt" content="${safeTitle}">
<meta name="twitter:url" content="${safeCanonical}">
${jsonLdScript}
<style>
  body { margin: 0; color: #172033; background: #fff; font-family: Cairo, system-ui, sans-serif; }
  .seo-initial-shell { max-width: 72rem; margin: 0 auto; padding: 2rem 1rem; line-height: 1.8; }
  .seo-initial-shell h1 { font-size: clamp(1.7rem, 4vw, 2.5rem); line-height: 1.3; margin: 0 0 1.25rem; }
  .seo-initial-shell nav { display: flex; flex-wrap: wrap; gap: .6rem 1rem; margin-top: 2rem; }
  .seo-initial-shell a { color: #1769aa; }
</style>
</head>
<body>
<div id="root">
<main class="seo-initial-shell">
<h1>${safeH1}</h1>
${body}
<nav>
<a href="/">الرئيسية</a> |
<a href="/fonts/thuluth">خطوط الثلث</a> |
<a href="/fonts/diwani">خطوط الديواني</a> |
<a href="/fonts/ruqaa">خطوط الرقعة</a> |
<a href="/fonts/kufi">خطوط الكوفي</a> |
<a href="/fonts/naskh">خطوط النسخ</a> |
<a href="/fonts/tasmeem">خطوط التصميم</a> |
<a href="/fonts/graffiti">خطوط الغرافيتي</a> |
<a href="/fonts/photoshop">خطوط الفوتوشوب</a> |
<a href="/fonts/nastaliq">خطوط النستعليق</a> |
<a href="/design-fonts">خطوط التصميم الحديث</a> |
<a href="/about">من نحن</a> |
<a href="/blog">المدونة</a> |
<a href="/contact">اتصل بنا</a>
</nav>
</main>
</div>
${getClientBootMarkup()}
</body>
</html>`;
}

const KNOWN_ROUTE_PATTERNS = [
  /^\/$/,
  /^\/fonts$/,
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

  app.get("/font/:slug", async (req, res) => {
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
    const canonical = `https://xfontat.com/font/${req.params.slug}`;
    const title = `تحميل خط ${font.nameArabic} بصيغة ${font.fileFormat || 'TTF'} مجاناً | xfontat`;
    const desc = `حمّل خط ${font.nameArabic} (${font.name}) مجاناً بصيغة ${font.fileFormat || 'TTF'}. ${getCategoryLabel(font.category)} احترافية متاحة للتحميل المباشر.`;
    const isKnownOflLicense = /(?:SIL\s+)?(?:OFL|Open Font License)\s*1\.1/i.test(font.license || "");
    const licenseHtml = isKnownOflLicense
      ? `<h2>الترخيص والاستخدام</h2>
<p>نوع الترخيص: <a href="/fonts/licenses/OFL-1.1.txt">${escapeHtml(font.license || "SIL OFL 1.1")}</a></p>
<p>الاستخدام التجاري والتعديل: مسموحان وفق شروط ترخيص OFL 1.1.</p>
<p>راجع <a href="/fonts/licenses/OFL-1.1.txt">نص الترخيص الكامل</a> قبل الاستخدام التجاري.</p>`
      : `<h2>الترخيص والاستخدام</h2>
<p>نوع الترخيص: ${escapeHtml(font.license || "غير محدد في بياناتنا")}</p>
<p>السماح بالاستخدام التجاري أو التعديل غير مؤكد؛ راجع المصدر أو ملف الترخيص الأصلي قبل استخدام الخط.</p>`;
    const body = `
<p>${desc}</p>
<p>التصنيف: <a href="/fonts/${categoryToSlug[font.category] || font.category}">${escapeHtml(getCategoryLabel(font.category))}</a></p>
${font.designer ? `<p>المصمم: ${escapeHtml(font.designer)}</p>` : '<p>المصمم: غير محدد في بياناتنا.</p>'}
${font.sourceUrl ? `<p>المصدر: <a href="${escapeHtml(font.sourceUrl)}">عرض المصدر</a></p>` : '<p>المصدر: غير محدد في بياناتنا.</p>'}
${licenseHtml}
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
          { "@type": "ListItem", "position": 2, "name": getCategoryLabel(font.category), "item": `https://xfontat.com/fonts/${categoryToSlug[font.category] || font.category}` },
          { "@type": "ListItem", "position": 3, "name": font.nameArabic, "item": canonical },
        ]
      }
    ];
    res.send(botHTML(title, desc, canonical, `تحميل خط ${font.nameArabic} مجاناً`, body, jsonLd));
  });

  app.get("/fonts", (req, res) => {
    const categoryLinks = Object.entries(categoryToSlug).map(([category, slug]) => {
      const label = getCategoryLabel(category);
      return `<li><a href="/fonts/${slug}">${escapeHtml(label)}</a></li>`;
    }).join("\n");
    const title = "فهرس الخطوط العربية | xfontat";
    const description = "تصفح تصنيفات الخطوط العربية في xfontat، واختر نوع الخط المناسب لمشروعك ومعاينته قبل التحميل.";
    const body = `<p>${description}</p><h2>تصنيفات الخطوط العربية</h2><ul>${categoryLinks}</ul>`;
    return res.send(botHTML(
      title,
      description,
      "https://xfontat.com/fonts",
      "فهرس الخطوط العربية",
      body,
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": title,
        "description": description,
        "url": "https://xfontat.com/fonts",
        "inLanguage": "ar",
        "isPartOf": { "@type": "WebSite", "name": "xfontat", "url": "https://xfontat.com" },
      },
    ));
  });

  app.get("/fonts/:category", async (req, res) => {
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
    const fonts = await storage.getAllFonts();
    const catFonts = fonts.filter(f => f.category === arabicCat);
    const canonical = `https://xfontat.com/fonts/${req.params.category}`;
    const categoryLabel = getCategoryLabel(arabicCat);
    const title = `${categoryLabel} العربية - تحميل مجاني | xfontat`;
    const desc = `اكتشف مجموعة من ${categoryLabel} العربية. تحميل مجاني بصيغ TTF وOTF.`;
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
    const body = `<p>${desc}</p>${richContent}<h2>الخطوط المتاحة ضمن ${categoryLabel}</h2><ul>${links}</ul>`;
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

  app.get("/blog/:slug", async (req, res) => {
    const slug = req.params.slug;

    // Check static blog posts first
    const staticPost = staticBlogPosts.find(p => p.slug === slug);
    if (staticPost) {
      const canonical = `https://xfontat.com/blog/${slug}`;
      const contentHtml = markdownToHtml(staticPost.content || '');
      const relatedLinksHtml = await renderBlogInternalLinks(staticPost);
      const body = `<p>${staticPost.excerpt || ''}</p>${contentHtml}${relatedLinksHtml}`;
      const jsonLd = [
        {
          "@type": "Article",
          "headline": staticPost.title,
          "description": staticPost.excerpt,
          "url": canonical,
          "inLanguage": "ar",
          "author": { "@type": "Person", "name": staticPost.author },
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
    const canonical = `https://xfontat.com/blog/${slug}`;
    const contentHtml = markdownToHtml(post.content || '');
    const relatedLinksHtml = await renderBlogInternalLinks(post);
    const body = `<p>${post.excerpt || ''}</p>${contentHtml}${relatedLinksHtml}`;
    const jsonLd = [
      {
        "@type": "Article",
        "headline": post.title,
        "description": post.excerpt,
        "url": canonical,
        "inLanguage": "ar",
        "author": { "@type": "Person", "name": post.author || "فريق xfontat" },
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

  app.get("/blog", (req, res) => {
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

  app.get("/design-fonts", async (req, res) => {
    const fonts = await storage.getAllFonts();
    const designFonts = fonts.filter(f => f.category === 'تصميم' || f.category === 'رقعة' || f.category === 'كوفي');
    const canonical = 'https://xfontat.com/design-fonts';
    const title = 'خطوط عربية للتصميم الحديث - تحميل مجاني | xfontat';
    const desc = "اكتشف خطوطاً عربية عصرية للتصميم الجرافيكي والهوية البصرية ومنشورات التواصل الاجتماعي، مع تحميل مجاني.";
    const fontLinks = designFonts.slice(0, 50).map(f =>
      `<li><a href="/font/${generateSlug(f.name, f.fileName, f.category)}">${f.nameArabic}</a></li>`
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
    res.send(botHTML(title, desc, canonical, 'خطوط عربية للتصميم', body, jsonLd));
  });

  app.get("/youtube-thumbnail-maker", (req, res) => {

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

  app.get("/collection/:slug", async (req, res) => {
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

  app.get("/about", (req, res) => {
    const canonical = 'https://xfontat.com/about';
    const title = 'من نحن | xfontat — منصة مكتبة الخطوط العربية المجانية';
    const desc = 'تعرف على xfontat، منصة مكتبة الخطوط العربية المجانية التي توفر خطوطاً احترافية للمصممين والمطورين مع معاينة تفاعلية وتحميل مباشر وسهل.';
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
    res.send(botHTML(title, desc, canonical, 'من نحن', body, jsonLd));
  });

  app.get("/contact", (req, res) => {
    const canonical = 'https://xfontat.com/contact';
    const title = 'اتصل بنا | xfontat — دعم مكتبة الخطوط العربية والمساعدة';
    const desc = 'تواصل مع فريق xfontat للحصول على دعم مكتبة الخطوط العربية، إرسال الاقتراحات، والإبلاغ عن مشكلات التحميل أو الاستخدام وسنساعدك سريعاً.';
    const body = `
<p>${desc}</p>
<h2>طرق التواصل</h2>
<p>يمكنك مراسلتنا عبر <a href="mailto:info@xfontat.com">info@xfontat.com</a>، أو التواصل مع الدعم عبر <a href="mailto:support@xfontat.com">support@xfontat.com</a>.</p>
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
    res.send(botHTML(title, desc, canonical, 'تواصل معنا', body, jsonLd));
  });

  app.get("/privacy", (req, res) => {
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

  app.get("/terms", (req, res) => {
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

  app.get("/", async (req, res) => {
    const fonts = await storage.getAllFonts();
    const categories = Array.from(new Set(fonts.map(f => f.category)));
    const canonical = `https://xfontat.com/`;
    const title = "تحميل خطوط عربية مجانية | مكتبة xfontat";
    const desc = "تصفّح مكتبة xfontat للخطوط العربية المجانية: خطوط احترافية للتحميل بصيغ TTF وOTF، مع معاينة تفاعلية ومعلومات الترخيص والمصدر.";
    const catLinks = categories.map(c =>
      `<li><a href="/fonts/${categoryToSlug[c] || c}">${escapeHtml(getCategoryLabel(c))}</a></li>`
    ).join('\n');
    const fontLinks = fonts.slice(0, 120).map(f =>
      `<li><a href="/font/${generateSlug(f.name, f.fileName, f.category)}">${f.nameArabic}</a></li>`
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
<p>xfontat هي منصة عربية متخصصة في توفير مجموعة شاملة من الخطوط العربية الاحترافية في تصنيفات متنوعة. جميع الخطوط متاحة للتحميل الفوري بصيغتي TTF وOTF دون تسجيل أو اشتراك، مع ضرورة مراجعة ترخيص كل خط قبل الاستخدام التجاري. تتميز منصتنا بأداة المعاينة التفاعلية التي تتيح لك كتابة نصك الخاص ومعاينته بأي خط قبل التحميل.</p>
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
        { url: "/fonts", priority: "0.9", changefreq: "weekly" },
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
          lastmod: font.addedAt && Number.isFinite(new Date(font.addedAt).getTime())
            ? new Date(font.addedAt).toISOString()
            : undefined,
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
          lastmod: Number.isFinite(new Date(post.date).getTime())
            ? new Date(post.date).toISOString()
            : undefined,
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

      lastGoodSitemapXml = xml;
      res.status(200).type('application/xml; charset=utf-8').send(xml);
    } catch (error) {
      console.error("Failed to generate sitemap; serving the last valid sitemap or safe fallback.", error);
      res.status(200)
        .type('application/xml; charset=utf-8')
        .send(lastGoodSitemapXml || SAFE_FALLBACK_SITEMAP_XML);
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
