import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import cron from "node-cron";

const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

const DATA_FILE = path.join(process.cwd(), "server", "data", "generatedPosts.json");

export interface GeneratedPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  dateISO: string;
  dateModified: string;
  readTime: number;
  keywords: string[];
  generated: true;
}

function loadPosts(): GeneratedPost[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const posts = JSON.parse(raw) as Array<Omit<GeneratedPost, "dateModified"> & { dateModified?: string }>;
    return posts.map((post) => ({
      ...post,
      // Legacy records predate dateModified; their publication date is the
      // truthful last-modified date until a later edit is recorded.
      dateModified: post.dateModified || post.dateISO,
    }));
  } catch {
    return [];
  }
}

function savePosts(posts: GeneratedPost[]): void {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), "utf-8");
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    + "-" + Date.now();
}

const SEO_TOPICS = [
  "أفضل خطوط عربية للمطاعم والمقاهي وتصميم القوائم",
  "خطوط عربية للألعاب الإلكترونية وواجهات المستخدم",
  "تاريخ الخط العربي عبر العصور من الكوفي للحديث",
  "خطوط عربية للطب والرعاية الصحية والمستشفيات",
  "كيف تختار الخط المناسب لموقعك العربي على الإنترنت",
  "أفضل خطوط عربية للشهادات والدبلومات والجوائز",
  "خطوط عربية للرياضة والفعاليات والبطولات",
  "خطوط عربية لتصميم الملابس والأزياء والموضة",
  "أفضل خطوط عربية للتعليم الإلكتروني ومنصات التعلم",
  "خطوط عربية للإعلام والتلفزيون والبرامج",
  "الفرق بين الخط العربي الكلاسيكي والحديث",
  "خطوط عربية للسياحة والفنادق وبطاقات الترحيب",
  "أفضل خطوط عربية لقطاع العقارات والإعلانات",
  "خطوط عربية للطاقة والشركات الصناعية",
  "كيفية تثبيت الخطوط العربية على ويندوز وماك",
  "أفضل خطوط عربية للبنوك والمؤسسات المالية",
  "خطوط عربية للأطفال والتعليم الابتدائي",
  "أفضل خطوط عربية لتصميم علب المنتجات والتغليف",
  "خطوط عربية للأفلام والمسلسلات والمحتوى المرئي",
  "أفضل خطوط عربية للطباعة على القمصان والهدايا",
  "كيف تستخدم الخطوط العربية في تصميم الجرائد والمجلات",
  "أفضل خطوط عربية لعروض PowerPoint والمقدمات",
  "خطوط عربية للفن الرقمي والتصوير الفوتوغرافي",
  "كيف تجمع بين خطين عربيين في نفس التصميم",
  "أفضل خطوط عربية للمناهج الدراسية والكتب التعليمية",
  "خطوط عربية للديكور الداخلي واللوحات الجدارية",
  "أفضل خطوط عربية لتطبيقات التواصل الاجتماعي",
  "دور الخط العربي في الهوية الثقافية والحضارية",
  "خطوط عربية للإعلانات الخارجية واللافتات",
  "أفضل خطوط عربية لقطاع التكنولوجيا والشركات الناشئة",
];

function getUnusedTopics(existingPosts: GeneratedPost[]): string[] {
  const usedTitles = new Set(existingPosts.map((p) => p.title.slice(0, 20)));
  return SEO_TOPICS.filter((t) => !usedTitles.has(t.slice(0, 20)));
}

function pickRandomTopics(topics: string[], count: number): string[] {
  const shuffled = [...topics].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

async function generateSinglePost(topic: string): Promise<GeneratedPost | null> {
  const prompt = `أنت كاتب محتوى SEO متخصص في الخطوط العربية. اكتب مقالاً احترافياً باللغة العربية عن الموضوع التالي:

الموضوع: ${topic}

متطلبات المقال:
- العنوان: جذاب ومحسّن لمحركات البحث، يحتوي على الكلمة المفتاحية الرئيسية
- المقتطف (excerpt): جملتان أو ثلاث تلخص المقال (100-150 كلمة)
- المحتوى: مقال كامل 1000-1200 كلمة مقسّم بعناوين H2 وH3 واضحة
- الكلمات المفتاحية: 5-7 كلمات مفتاحية مناسبة للبحث

اكتب الرد بصيغة JSON صارمة بالشكل التالي بدون أي نص خارج JSON:
{
  "title": "عنوان المقال",
  "excerpt": "المقتطف القصير",
  "content": "محتوى المقال الكامل بتنسيق Markdown",
  "keywords": ["كلمة1", "كلمة2", "كلمة3", "كلمة4", "كلمة5"]
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { maxOutputTokens: 4096, temperature: 0.8 },
    });

    const text = response.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in Gemini response");
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const now = new Date();
    const dateISO = now.toISOString().split("T")[0];
    const dateArabic = now.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const wordCount = parsed.content.split(/\s+/).length;
    const readTime = Math.max(3, Math.ceil(wordCount / 200));

    const slugBase = parsed.title
      .toLowerCase()
      .replace(/[^\u0600-\u06FFa-z0-9\s]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60);

    return {
      slug: `gen-${slugBase}-${Date.now()}`,
      title: parsed.title,
      excerpt: parsed.excerpt,
      content: parsed.content,
      author: "فريق xfontat",
      date: dateArabic,
      dateISO,
      dateModified: dateISO,
      readTime,
      keywords: parsed.keywords || [],
      generated: true,
    };
  } catch (err) {
    console.error("Error generating post for topic:", topic, err);
    return null;
  }
}

export async function generateDailyPosts(): Promise<void> {
  console.log("📝 Starting daily blog generation with Gemini...");

  const existing = loadPosts();
  const unusedTopics = getUnusedTopics(existing);

  if (unusedTopics.length === 0) {
    console.log("✅ All topics used, recycling...");
    const topics = pickRandomTopics(SEO_TOPICS, 2);
    const results = await Promise.allSettled(topics.map(generateSinglePost));
    const newPosts = results
      .filter((r) => r.status === "fulfilled" && r.value)
      .map((r) => (r as PromiseFulfilledResult<GeneratedPost>).value);
    savePosts([...existing, ...newPosts]);
    console.log(`✅ Generated ${newPosts.length} posts`);
    return;
  }

  const selectedTopics = pickRandomTopics(unusedTopics, 2);
  console.log("📌 Topics selected:", selectedTopics);

  const results = await Promise.allSettled(selectedTopics.map(generateSinglePost));
  const newPosts = results
    .filter((r) => r.status === "fulfilled" && r.value)
    .map((r) => (r as PromiseFulfilledResult<GeneratedPost>).value);

  savePosts([...existing, ...newPosts]);
  console.log(`✅ Generated ${newPosts.length} new posts. Total: ${existing.length + newPosts.length}`);
}

export function getGeneratedPosts(): GeneratedPost[] {
  return loadPosts();
}

export function startBlogCron(): void {
  console.log("⏰ Blog auto-generator scheduled: 2 articles/day");

  // Run at 8:00 AM and 8:00 PM server time every day
  cron.schedule("0 8,20 * * *", async () => {
    try {
      await generateDailyPosts();
    } catch (err) {
      console.error("❌ Cron job failed:", err);
    }
  });

  // Also run once on startup after a 30s delay (to avoid blocking startup)
  setTimeout(async () => {
    const existing = loadPosts();
    if (existing.length === 0) {
      console.log("🚀 First run: generating initial posts...");
      try {
        await generateDailyPosts();
      } catch (err) {
        console.error("❌ Initial generation failed:", err);
      }
    }
  }, 30000);
}
