import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

type SpaMetadata = {
  title: string;
  description: string;
  canonical: string;
};

const SPA_METADATA: Record<string, SpaMetadata> = {
  "/": {
    title: "تحميل خطوط عربية مجانية — 907 خط عربي احترافي | xfontat",
    description: "مكتبة تضم 907 خطوط عربية احترافية في 9 تصنيفات: ثلث، ديواني، رقعة، كوفي، نسخ وتصميم. تحميل مجاني بصيغ TTF وOTF مع معاينة تفاعلية وبدون تسجيل.",
    canonical: "https://xfontat.com/",
  },
  "/about": {
    title: "من نحن | xfontat — منصة مكتبة الخطوط العربية المجانية",
    description: "تعرف على xfontat، منصة مكتبة الخطوط العربية المجانية التي توفر خطوطاً احترافية للمصممين والمطورين مع معاينة تفاعلية وتحميل مباشر وسهل.",
    canonical: "https://xfontat.com/about",
  },
  "/contact": {
    title: "اتصل بنا | xfontat — دعم مكتبة الخطوط العربية والمساعدة",
    description: "تواصل مع فريق xfontat للحصول على دعم مكتبة الخطوط العربية، إرسال الاقتراحات، والإبلاغ عن مشكلات التحميل أو الاستخدام وسنساعدك سريعاً.",
    canonical: "https://xfontat.com/contact",
  },
  "/privacy": {
    title: "سياسة الخصوصية | xfontat — حماية بيانات زوار مكتبة الخطوط",
    description: "اقرأ سياسة الخصوصية في xfontat وتعرف على البيانات التي نجمعها، وكيف نستخدمها ونحميها أثناء تصفح مكتبة الخطوط العربية وتحميلها بأمان.",
    canonical: "https://xfontat.com/privacy",
  },
  "/terms": {
    title: "شروط الاستخدام | xfontat — حقوق استخدام الخطوط العربية",
    description: "تعرف على شروط استخدام xfontat، وقواعد تحميل الخطوط العربية وحقوق استخدامها الشخصي أو التجاري وفق ترخيص كل خط والأنظمة المعمول بها.",
    canonical: "https://xfontat.com/terms",
  },
  "/youtube-thumbnail-maker": {
    title: "منشئ الصور المصغرة لليوتيوب بالذكاء الاصطناعي | xfontat",
    description: "أنشئ صوراً مصغرة احترافية لليوتيوب بالذكاء الاصطناعي مع دعم النص العربي واتجاه RTL، بمقاس 1280×720 ومعاينة جاهزة للنشر.",
    canonical: "https://xfontat.com/youtube-thumbnail-maker",
  },
};

function applySpaMetadata(template: string, pathName: string): string {
  const metadata = SPA_METADATA[pathName] || SPA_METADATA["/"];
  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${metadata.title}</title>`)
    .replace(/<meta name="title"[^>]*>/, `<meta name="title" content="${metadata.title}" />`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${metadata.description}" />`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${metadata.canonical}" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${metadata.canonical}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${metadata.title}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${metadata.description}" />`)
    .replace(/<meta name="twitter:url"[^>]*>/, `<meta name="twitter:url" content="${metadata.canonical}" />`)
    .replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${metadata.title}" />`)
    .replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${metadata.description}" />`);
}

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const pathname = new URL(url, "http://localhost").pathname;
      template = applySpaMetadata(template, pathname);
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath, {
    maxAge: "1y",
    setHeaders: (res, filePath) => {
      if (path.basename(filePath) === "index.html") {
        res.setHeader("Cache-Control", "no-cache");
      } else {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    },
  }));

  // fall through to index.html if the file doesn't exist
  app.use("*", async (req, res, next) => {
    try {
      const template = await fs.promises.readFile(path.resolve(distPath, "index.html"), "utf-8");
      const page = applySpaMetadata(template, req.path);
      res.status(200).set({ "Content-Type": "text/html" }).send(page);
    } catch (error) {
      next(error);
    }
  });
}
