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

      const now = new Date().toISOString();

      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

      [...staticPages, ...categoryPages, ...fontPages].forEach((page: any) => {
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
