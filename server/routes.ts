import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFontSchema } from "@shared/schema";
import { getGeneratedPosts } from "./blogGenerator";

const categoryToSlug: Record<string, string> = {
  "ثلث": "thuluth",
  "ديواني": "diwani",
  "رقعة": "ruqaa",
  "كوفي": "kufi",
  "نسخ": "naskh",
  "تصميم": "tasmeem",
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

const BOT_AGENTS = ['googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 'yandexbot', 'facebot', 'ia_archiver', 'ahrefsbot', 'semrushbot', 'mj12bot'];

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

function botHTML(title: string, description: string, canonical: string, h1: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="index, follow">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
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
<a href="/about">من نحن</a> |
<a href="/blog">المدونة</a>
</nav>
</body>
</html>`;
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
    res.send(botHTML(title, desc, canonical, font.nameArabic, body));
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
    res.send(botHTML(title, desc, canonical, `خطوط ${arabicCat}`, body));
  });

  app.get("/blog/:slug", async (req, res, next) => {
    if (!isBot(req.headers['user-agent'] || '')) return next();
    const posts = getGeneratedPosts();
    const post = posts.find(p => p.slug === req.params.slug);
    if (!post) return next();
    const canonical = `https://xfontat.com/blog/${req.params.slug}`;
    const body = `<p>${post.excerpt || ''}</p><div>${post.content || ''}</div>`;
    res.send(botHTML(post.title, post.excerpt || post.title, canonical, post.title, body));
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
    res.send(botHTML(title, desc, canonical, 'مكتبة الخطوط العربية المجانية - xfontat', body));
  });

  app.get("/api/fonts", async (req, res) => {
    try {
      const fonts = await storage.getAllFonts();
      res.json(fonts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fonts" });
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

      const blogPosts = [
        { slug: "daleel-ikhtiyar-alkhat-alarabi", date: "2025-11-21" },
        { slug: "alfarq-bayn-thuluth-kufi-ruqaa", date: "2025-11-20" },
        { slug: "best-practices-arabic-fonts-digital-design", date: "2025-11-19" },
        { slug: "how-to-download-use-arabic-fonts", date: "2025-11-18" },
        { slug: "ethical-use-arabic-fonts", date: "2025-11-17" },
        { slug: "afdal-10-khotot-arabiya-lil-tasmeem", date: "2025-11-16" },
        { slug: "khotot-arabiya-lil-photoshop-majanan", date: "2025-11-15" },
        { slug: "khotot-arabiya-lil-shiaarat-wal-logos", date: "2025-11-14" },
        { slug: "khotot-arabiya-muzakhrafa-lil-tasmeem", date: "2025-11-13" },
        { slug: "khotot-arabiya-lil-social-media", date: "2025-11-12" },
        { slug: "khotot-arabiya-lil-youtubiyeen", date: "2026-03-15" },
        { slug: "khotot-arabiya-lil-kotob-wal-matbooaat", date: "2026-03-16" },
        { slug: "khotot-arabiya-lil-dawaat-wal-munasabaat", date: "2026-03-17" },
        { slug: "khotot-arabiya-lil-alamat-al-tijariya", date: "2026-03-18" },
        { slug: "khotot-arabiya-lil-wosham", date: "2026-03-19" },
        { slug: "khotot-arabiya-lil-mawaqi-wal-tatbeeqat", date: "2026-03-20" },
      ];
      const blogPages = blogPosts.map(post => ({
        url: `/blog/${post.slug}`,
        priority: "0.6",
        changefreq: "monthly",
        lastmod: new Date(post.date).toISOString(),
      }));

      const collectionSlugs = [
        "khotot-lil-shiaarat",
        "khotot-lil-tiktok",
        "khotot-muzakhrafa",
        "khotot-lil-kotob",
        "khotot-lil-photoshop",
        "khotot-lil-youtubiyeen",
        "khotot-lil-dawaat",
        "khotot-bidoon-hoqooq",
      ];
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

  const httpServer = createServer(app);

  return httpServer;
}
