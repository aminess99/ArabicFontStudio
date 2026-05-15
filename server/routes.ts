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
<a href="/fonts/nastaliq">خطوط النستعليق</a>
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
    const links = catFonts.slice(0, 50).map(f =>
      `<li><a href="/font/${generateSlug(f.name)}">${f.nameArabic} - ${f.name}</a></li>`
    ).join('\n');
    const body = `<p>${desc}</p><ul>${links}</ul>`;
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
    const fontLinks = fonts.slice(0, 100).map(f =>
      `<li><a href="/font/${generateSlug(f.name)}">${f.nameArabic}</a></li>`
    ).join('\n');
    const body = `<p>${desc}</p><h2>التصنيفات</h2><ul>${catLinks}</ul><h2>الخطوط</h2><ul>${fontLinks}</ul>`;
    res.send(botHTML(title, desc, canonical, 'مكتبة الخطوط العربية المجانية', body));
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
