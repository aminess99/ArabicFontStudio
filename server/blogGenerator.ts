import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import cron from "node-cron";

const geminiApiKey =
  process.env.GEMINI_API_KEY || process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
const geminiBaseUrl =
  process.env.GEMINI_BASE_URL ||
  process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;
const ai = geminiApiKey
  ? new GoogleGenAI({
      apiKey: geminiApiKey,
      ...(geminiBaseUrl
        ? {
            httpOptions: {
              apiVersion: "",
              baseUrl: geminiBaseUrl,
            },
          }
        : {}),
    })
  : null;

const DEFAULT_DATA_FILE = path.join(
  process.cwd(),
  "server",
  "data",
  "generatedPosts.json",
);
const DATA_FILE = process.env.GENERATED_POSTS_FILE || DEFAULT_DATA_FILE;

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
  topic?: string;
  status?: "draft" | "published";
  quality?: QualityReport;
  editorialReview?: EditorialReview;
  sources?: Array<{ title: string; url: string }>;
  fontReferences?: string[];
}

interface QualityReport {
  passed: boolean;
  checkedAt: string;
  issues: string[];
  similarityScore: number;
}
function loadAllPosts(): GeneratedPost[] {
  try {
    if (!fs.existsSync(DATA_FILE) && DATA_FILE !== DEFAULT_DATA_FILE && fs.existsSync(DEFAULT_DATA_FILE)) {
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
      fs.copyFileSync(DEFAULT_DATA_FILE, DATA_FILE);
    }
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
  const usedTopics = new Set(existingPosts.map((post) => post.topic).filter(Boolean));
  return SEO_TOPICS.filter((topic) => {
    if (usedTopics.has(topic)) return false;
    const topicWords = normalizeWords(topic);
    return !existingPosts.some((post) => {
      const titleWords = normalizeWords(post.title);
      const matchedWords = Array.from(topicWords).filter((word) => titleWords.has(word)).length;
      return topicWords.size > 0 && matchedWords / topicWords.size >= 0.75;
    });
  });
}

function pickRandomTopics(topics: string[], count: number): string[] {
  const shuffled = [...topics].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function normalizeWords(value: string): Set<string> {
  return new Set(
    value
      .toLowerCase()
      .replace(/[^\u0600-\u06ffa-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 3),
  );
}
async function generateSinglePost(
  topic: string,
  existingPosts: GeneratedPost[],
): Promise<GeneratedPost | null> {
  if (!ai) {
    console.error("Gemini API key is not configured; skipping blog generation.");
    return null;
  }

  const prompt = `أنت كاتب محتوى SEO متخصص في الخطوط العربية. اكتب مقالاً احترافياً باللغة العربية عن الموضوع التالي:

الموضوع: ${topic}

متطلبات المقال:
- العنوان: جذاب ومحسّن لمحركات البحث، يحتوي على الكلمة المفتاحية الرئيسية
- المقتطف (excerpt): جملتان أو ثلاث تلخص المقال (100-150 كلمة)
- المحتوى: مقال كامل 1000-1200 كلمة مقسّم بعناوين H2 وH3 واضحة
- الكلمات المفتاحية: 5-7 كلمات مفتاحية مناسبة للبحث
- المعلومات: أضف معلومات عملية خاصة بالموضوع، ولا تستخدم ادعاءات أو أرقاماً غير موثقة
- المصادر: استشهد داخل المحتوى برابطين HTTPS موثوقين على الأقل، وثلاثة عند مناقشة ترخيص الخطوط أو الاستخدام التجاري
- الخطوط: اذكر خطين عربيين حقيقيين على الأقل بالاسم، ولا تدّعِ أن ترخيصهما مجاني دون مصدر رسمي
- التاريخ: لا تضع سنة في العنوان. عند الحاجة إلى سنة استخدم ${new Date().getUTCFullYear()} وتأكد أن المعلومة حديثة

اكتب الرد بصيغة JSON صارمة بالشكل التالي بدون أي نص خارج JSON:
{
  "title": "عنوان المقال",
  "excerpt": "المقتطف القصير",
  "content": "محتوى المقال الكامل بتنسيق Markdown",
  "keywords": ["كلمة1", "كلمة2", "كلمة3", "كلمة4", "كلمة5"],
  "sources": [{"title": "اسم المصدر", "url": "https://example.com/page"}],
  "fontReferences": ["اسم خط حقيقي", "اسم خط حقيقي آخر"]
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

    const parsed = JSON.parse(jsonMatch[0]) as GeneratedArticle;
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

    const quality = validateArticle(parsed, topic, existingPosts);
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
      topic,
      // Generated content is always a draft. Publication requires a completed
      // editorialReview checklist plus an explicit status change to "published".
      status: "draft",
      quality,
      sources: parsed.sources || [],
      fontReferences: parsed.fontReferences || [],
    };
  } catch (err) {
    console.error("Error generating post for topic:", topic, err);
    return null;
  }
}

export async function generateDailyPosts(): Promise<void> {
  if (generationInProgress) {
    console.log("📝 Blog generation already running; duplicate run skipped.");
    return;
  }
  generationInProgress = true;
  console.log("📝 Starting daily blog generation with Gemini...");

  try {
    const existing = loadAllPosts();
    const unusedTopics = getUnusedTopics(existing);

    if (unusedTopics.length === 0) {
      console.log("✅ All topics have been used; generation skipped to prevent recycled content.");
      return;
    }

    const selectedTopics = pickRandomTopics(unusedTopics, 2);
    console.log("📌 Topics selected:", selectedTopics);

    const newPosts: GeneratedPost[] = [];
    for (const topic of selectedTopics) {
      const post = await generateSinglePost(topic, [...existing, ...newPosts]);
      if (post) newPosts.push(post);
    }

    savePosts([...existing, ...newPosts]);
    const automatedPasses = newPosts.filter((post) => post.quality?.passed).length;
    console.log(
      `✅ Generated ${newPosts.length} private drafts; ${automatedPasses} passed automated checks and all still require editorial approval.`,
    );
  } finally {
    generationInProgress = false;
  }
}

export function getGeneratedPosts(): GeneratedPost[] {
  return loadAllPosts().filter(isPublishable);
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
    const existing = loadAllPosts();
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

let generationInProgress = false;

function validateArticle(
  article: GeneratedArticle,
  topic: string,
  existingPosts: GeneratedPost[],
): QualityReport {
  const issues: string[] = [];
  const currentYear = new Date().getUTCFullYear();
  const text = `${article.title} ${article.excerpt} ${article.content}`;
  const wordCount = article.content.trim().split(/\s+/).filter(Boolean).length;
  const sources = Array.isArray(article.sources) ? article.sources : [];
  const fonts = Array.isArray(article.fontReferences) ? article.fontReferences : [];
  const normalizeArabicDigits = (value: string) =>
    value.replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
  const titleYears: number[] = [];
  const yearPattern = /\b(20\d{2})\b/g;
  let yearMatch: RegExpExecArray | null;
  const normalizedTitle = normalizeArabicDigits(article.title || "");
  while ((yearMatch = yearPattern.exec(normalizedTitle)) !== null) {
    titleYears.push(Number(yearMatch[1]));
  }
  const sourceUrls = sources
    .map((source) => source?.url)
    .filter((url): url is string => typeof url === "string");
  const invalidSources = sourceUrls.filter((url) => {
    try {
      const parsed = new URL(url);
      const trustedHosts = [
        "fonts.google.com",
        "github.com",
        "adobe.com",
        "www.adobe.com",
        "microsoft.com",
        "www.microsoft.com",
        "w3.org",
        "www.w3.org",
        "unicode.org",
        "www.unicode.org",
      ];
      return parsed.protocol !== "https:" ||
        !trustedHosts.some((host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`));
    } catch {
      return true;
    }
  });
  const maxSimilarity = existingPosts.reduce(
    (max, post) => Math.max(max, similarity(article.content, post.content)),
    0,
  );

  if (!article.title?.trim() || !article.excerpt?.trim() || !article.content?.trim()) {
    issues.push("missing_required_content");
  }
  if (wordCount < 850) issues.push("article_too_short");
  if ((article.content.match(/^##\s+/gm) || []).length < 3) issues.push("insufficient_section_depth");
  if (!Array.isArray(article.keywords) || article.keywords.length < 5) issues.push("insufficient_keywords");
  if (sources.length < 2 || sourceUrls.length !== sources.length || invalidSources.length) {
    issues.push("missing_or_invalid_sources");
  }
  if (sourceUrls.some((url) => !article.content.includes(url))) issues.push("uncited_sources");
  if (fonts.length < 2 || fonts.some((font) => !article.content.includes(font))) {
    issues.push("missing_concrete_font_references");
  }
  if (titleYears.length) issues.push("year_in_title_requires_editorial_review");
  if (titleYears.some((year) => year > currentYear)) issues.push("future_date_reference");
  if (/(?:مجاني|رخصة|ترخيص|استخدام تجاري)/.test(article.content) && sources.length < 3) {
    issues.push("unsubstantiated_licensing_claim");
  }
  if (maxSimilarity >= 0.42) issues.push("substantially_similar_to_existing_post");
  if (existingPosts.some((post) => post.topic === topic)) issues.push("topic_already_used");

  return {
    passed: issues.length === 0,
    checkedAt: new Date().toISOString(),
    issues,
    similarityScore: Number(maxSimilarity.toFixed(3)),
  };
}

function isPublishable(post: GeneratedPost): boolean {
  const review = post.editorialReview;
  return post.status === "published" &&
    post.quality?.passed === true &&
    review?.decision === "approved" &&
    Boolean(review.reviewedAt && review.reviewer) &&
    review.originalityVerified &&
    review.factsVerified &&
    review.sourcesVerified &&
    review.datesVerified &&
    review.licensingVerified &&
    review.fontReferencesVerified;
}

interface EditorialReview {
  decision: "approved" | "rejected";
  reviewedAt: string;
  reviewer: string;
  originalityVerified: boolean;
  factsVerified: boolean;
  sourcesVerified: boolean;
  datesVerified: boolean;
  licensingVerified: boolean;
  fontReferencesVerified: boolean;
}

function similarity(a: string, b: string): number {
  const left = normalizeWords(a);
  const right = normalizeWords(b);
  if (!left.size || !right.size) return 0;
  const intersection = Array.from(left).filter((word) => right.has(word)).length;
  return intersection / (left.size + right.size - intersection);
}

interface GeneratedArticle {
  title: string;
  excerpt: string;
  content: string;
  keywords: string[];
  sources: Array<{ title: string; url: string }>;
  fontReferences: string[];
}
