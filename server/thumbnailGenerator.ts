import type { Express, Request, Response } from "express";
import { generateImage } from "./replit_integrations/image";

export const thumbnailStyles = {
  "viral-challenge": {
    label: "Viral challenge",
    arabicLabel: "تحدّي فيروسي",
    description: "High-energy creator thumbnail with dramatic scale, emotion, and instant curiosity.",
  },
  cinematic: {
    label: "Cinematic story",
    arabicLabel: "قصة سينمائية",
    description: "Moody film lighting, rich depth, atmospheric subject separation, and a strong narrative moment.",
  },
  "tech-review": {
    label: "Tech review",
    arabicLabel: "مراجعة تقنية",
    description: "Premium product lighting, crisp detail, clean futuristic geometry, and a polished studio finish.",
  },
  "gaming-reaction": {
    label: "Gaming reaction",
    arabicLabel: "ردّة فعل ألعاب",
    description: "Electric color, expressive energy, sharp action framing, and a playful competitive mood.",
  },
  "luxury-lifestyle": {
    label: "Luxury lifestyle",
    arabicLabel: "أسلوب فاخر",
    description: "Editorial luxury, controlled highlights, premium materials, and aspirational composition.",
  },
  "science-experiment": {
    label: "Science experiment",
    arabicLabel: "تجربة علمية",
    description: "Curious discovery, controlled experiment lighting, surprising visual evidence, and clarity.",
  },
  "breaking-news": {
    label: "Breaking news",
    arabicLabel: "خبر عاجل",
    description: "Urgent editorial framing, strong subject hierarchy, bold contrast, and credible newsroom energy.",
  },
  "fitness-transformation": {
    label: "Transformation",
    arabicLabel: "تحوّل ولياقة",
    description: "Before-and-after storytelling, powerful human energy, clear contrast, and motivating momentum.",
  },
  "food-sensation": {
    label: "Food sensation",
    arabicLabel: "تجربة طعام",
    description: "Appetizing close-up, rich texture, warm color, expressive reaction, and irresistible detail.",
  },
  "podcast-authority": {
    label: "Podcast authority",
    arabicLabel: "حوار مؤثر",
    description: "Confident portraiture, intimate studio light, editorial restraint, and thoughtful authority.",
  },
} as const;

type ThumbnailStyleId = keyof typeof thumbnailStyles;

const requestWindows = new Map<string, { startedAt: number; count: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 8;

function getClientKey(req: Request): string {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string") return forwardedFor.split(",")[0].trim();
  return req.ip || "unknown";
}

function isStyleId(value: unknown): value is ThumbnailStyleId {
  return typeof value === "string" && value in thumbnailStyles;
}

export function buildThumbnailPrompt(idea: string, styleId: ThumbnailStyleId): string {
  const style = thumbnailStyles[styleId];

  return [
    "Create a professional YouTube thumbnail background in a 1280x720 landscape composition.",
    `Video concept from the creator: "${idea}"`,
    `Visual direction: ${style.label}. ${style.description}`,
    "Make one clear hero subject the first thing the eye sees. Use an exaggerated but believable visual moment, strong foreground/background separation, cinematic lighting, vivid controlled color, and a composition that reads instantly at small size.",
    "Design for an Arabic-speaking YouTube audience. Reserve generous clean negative space on the right side for a later Arabic HTML title overlay, and keep the main subject away from that text-safe area.",
    "Do not render any readable words, letters, numbers, logos, watermarks, UI, fake Arabic text, or gibberish inside the image. The final Arabic title will be placed programmatically after generation.",
    "Avoid clutter, generic stock-photo composition, tiny details, duplicate subjects, distorted hands, and low-contrast shadows. Output only the finished thumbnail artwork.",
  ].join("\n");
}

export function registerThumbnailRoutes(app: Express): void {
  app.post("/api/thumbnail/generate", async (req: Request, res: Response) => {
    const idea = typeof req.body?.idea === "string" ? req.body.idea.trim() : "";
    const styleId = req.body?.style;

    if (idea.length < 4) {
      return res.status(400).json({ error: "اكتب فكرة أو عنواناً أطول قليلاً." });
    }

    if (idea.length > 600) {
      return res.status(400).json({ error: "الفكرة طويلة جداً. اختصرها إلى 600 حرف." });
    }

    if (!isStyleId(styleId)) {
      return res.status(400).json({ error: "اختر أسلوباً صحيحاً للصورة المصغرة." });
    }

    const clientKey = getClientKey(req);
    const now = Date.now();
    const current = requestWindows.get(clientKey);
    const windowState =
      !current || now - current.startedAt >= WINDOW_MS
        ? { startedAt: now, count: 0 }
        : current;

    if (windowState.count >= MAX_REQUESTS_PER_WINDOW) {
      return res.status(429).json({
        error: "وصلت إلى الحد المؤقت للتجارب. حاول مجدداً بعد دقائق.",
      });
    }

    windowState.count += 1;
    requestWindows.set(clientKey, windowState);

    const prompt = buildThumbnailPrompt(idea, styleId);

    try {
      const image = await generateImage(prompt);
      return res.json({
        image,
        prompt,
        style: thumbnailStyles[styleId],
        overlayText: idea,
      });
    } catch (error) {
      console.error("Thumbnail generation failed:", error);
      return res.status(502).json({
        error: "تعذر إنشاء الصورة الآن. جرّب مرة أخرى بعد قليل.",
      });
    }
  });
}