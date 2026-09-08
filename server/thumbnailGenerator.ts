import type { Express, Request, Response } from "express";
import { refineThumbnailPrompt } from "./openrouterPrompt";
import { generateThumbnailImage } from "./openrouterImage";

export const thumbnailStyles = {
  mrbeast: {
    label: "MrBeast Style",
    arabicLabel: "MrBeast Style",
    description: "Huge generic human face, exaggerated expression, saturated colors, and one oversized visual object.",
  },
  pewdiepie: {
    label: "PewDiePie Style",
    arabicLabel: "PewDiePie Style",
    description: "One generic creator or character, simple background, comedic expression, and a short headline-safe composition.",
  },
  ksi: {
    label: "KSI Style",
    arabicLabel: "KSI Style",
    description: "Bold saturated colors, sharp cuts, a strong generic expression, and sports or entertainment elements.",
  },
  "logan-paul": {
    label: "Logan Paul Style",
    arabicLabel: "Logan Paul Style",
    description: "Clear generic personality portrait, luxurious or spectacular background, and one curiosity-driving object.",
  },
  sidemen: {
    label: "Sidemen Style",
    arabicLabel: "Sidemen Style",
    description: "Several generic people, varied expressions, a busy but organized composition, and strong colors.",
  },
  "ali-abdaal": {
    label: "Ali Abdaal Style",
    arabicLabel: "Ali Abdaal Style",
    description: "Very clean design, one generic person, simple background, and clear text-safe space.",
  },
  "casey-neistat": {
    label: "Casey Neistat Style",
    arabicLabel: "Casey Neistat Style",
    description: "Realistic cinematic action frame, visible motion, a strong sense of story, and adventure.",
  },
  "ryan-trahan": {
    label: "Ryan Trahan Style",
    arabicLabel: "Ryan Trahan Style",
    description: "Candid-looking moment, strange or funny situation, natural colors, and curiosity.",
  },
  airrack: {
    label: "Airrack Style",
    arabicLabel: "Airrack Style",
    description: "A huge spectacle, a relatively small generic person, and a clear feeling of adventure and challenge.",
  },
  ishowspeed: {
    label: "IShowSpeed Style",
    arabicLabel: "IShowSpeed Style",
    description: "Extremely intense generic expression, a face zoom, funny or strange elements, and high contrast.",
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
    `Design for an Arabic-speaking YouTube audience. Render this locked Arabic headline inside the image: "${idea}". Copy it character by character with no spelling changes, translation, paraphrase, missing letters, extra letters, or invented glyphs. Preserve correct right-to-left Arabic shaping, and wrap or resize the headline if needed instead of changing its text.`,
    "Use the requested creator-thumbnail conventions as a broad visual reference only. Do not depict, imitate, reconstruct, or identify any real creator's face, body, voice, logo, branding, signature marks, or exact thumbnail composition. Use generic people and original visual elements.",
    "Do not add unrelated words, logos, watermarks, UI, fake extra text, or gibberish. The supplied Arabic headline must be the only text in the artwork.",
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

    try {
      const startedAt = Date.now();
      const basePrompt = buildThumbnailPrompt(idea, styleId);
      const refined = await refineThumbnailPrompt({
        idea,
        styleLabel: thumbnailStyles[styleId].label,
        styleDescription: thumbnailStyles[styleId].description,
        basePrompt,
      });
      const promptCompletedAt = Date.now();
      const imagePrompt = [
        refined.prompt,
        "=== LOCKED ARABIC HEADLINE — COPY EXACTLY ===",
        idea,
        "=== END LOCKED ARABIC HEADLINE ===",
        "Text accuracy is the highest priority. Copy the locked headline character by character, preserving every Arabic letter, word order, space, punctuation mark, and diacritic. Use correct right-to-left connected Arabic shaping. If it does not fit, wrap it or reduce the font size; never alter, translate, shorten, omit, or invent any character. Do not add any other text.",
      ].join("\n\n");
      const image = await generateThumbnailImage(imagePrompt);
      const completedAt = Date.now();
      return res.json({
        image,
        prompt: imagePrompt,
        creativeDirection: refined.creativeDirection,
        promptModel: "google/gemini-3.7-flash via OpenRouter",
        imageModel: "google/gemini-3.1-flash-image-preview (Nano Banana 2) via OpenRouter",
        timings: {
          promptMs: promptCompletedAt - startedAt,
          imageMs: completedAt - promptCompletedAt,
          totalMs: completedAt - startedAt,
        },
        style: thumbnailStyles[styleId],
      });
    } catch (error) {
      console.error("Thumbnail generation failed:", error);
      return res.status(502).json({
        error: "تعذر إنشاء الصورة الآن. جرّب مرة أخرى بعد قليل.",
      });
    }
  });
}