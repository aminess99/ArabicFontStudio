import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFontSchema } from "@shared/schema";

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

export async function registerRoutes(app: Express): Promise<Server> {
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
      const baseUrl = "https://www.xfontat.com";

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
        url: `/fonts/${encodeURIComponent(cat)}`,
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
    const baseUrl = "https://www.xfontat.com";

    const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml`;

    res.header('Content-Type', 'text/plain');
    res.send(robotsTxt);
  });

  const httpServer = createServer(app);

  return httpServer;
}
