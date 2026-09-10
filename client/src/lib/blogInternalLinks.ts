import { collections, type CollectionData } from "./collectionsData";

const categoryTopics = [
  { category: "ثلث", slug: "thuluth", terms: ["ثلث", "زخرف", "دعوات", "زفاف", "مساجد"] },
  { category: "ديواني", slug: "diwani", terms: ["ديواني", "دعوات", "زفاف", "مناسبات", "فخم"] },
  { category: "رقعة", slug: "ruqaa", terms: ["رقعة", "سوشال", "تيك توك", "إنستقرام", "يومي"] },
  { category: "كوفي", slug: "kufi", terms: ["كوفي", "شعار", "شعارات", "هوية", "هندسي"] },
  { category: "نسخ", slug: "naskh", terms: ["نسخ", "كتب", "طباعة", "قراءة", "نصوص", "ويب", "مواقع"] },
  { category: "تصميم", slug: "tasmeem", terms: ["تصميم", "مصمم", "جرافيك", "إعلان", "رقمي", "فوتوشوب"] },
  { category: "فوتوشوب", slug: "photoshop", terms: ["فوتوشوب", "أدوبي", "إلستريتور", "تحميل", "تثبيت"] },
] as const;

const collectionTopics: Record<string, string[]> = {
  "khotot-lil-shiaarat": ["شعار", "شعارات", "لوجو", "هوية بصرية", "علامة تجارية"],
  "khotot-lil-tiktok": ["تيك توك", "إنستقرام", "ريلز", "سوشال ميديا"],
  "khotot-muzakhrafa": ["مزخرف", "زخرفة", "فني", "ثلث", "ديواني"],
  "khotot-lil-kotob": ["كتب", "كتاب", "مطبوعات", "نصوص طويلة", "قراءة"],
  "khotot-lil-photoshop": ["فوتوشوب", "إلستريتور", "أدوبي", "كانفا", "تثبيت"],
  "khotot-lil-youtubiyeen": ["يوتيوب", "صناع المحتوى", "مصغرة", "فيديو"],
  "khotot-lil-dawaat": ["دعوات", "زفاف", "مناسبات", "بطاقات تهنئة"],
  "khotot-bidoon-hoqooq": ["مجاني", "مجانية", "ترخيص", "حقوق", "تحميل"],
};

export interface BlogCategoryLink {
  category: string;
  slug: string;
  label: string;
}

export interface BlogInternalLinks {
  categories: BlogCategoryLink[];
  collections: CollectionData[];
}

export function getBlogInternalLinks(post: {
  title: string;
  excerpt?: string;
  content?: string;
  keywords?: string[];
}): BlogInternalLinks {
  const text = [
    post.title,
    post.excerpt || "",
    post.content || "",
    ...(post.keywords || []),
  ].join(" ").toLowerCase();

  const scoredCategories = categoryTopics
    .map(topic => ({
      topic,
      score: topic.terms.reduce((score, term) => score + (text.includes(term) ? 1 : 0), 0),
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ topic }) => ({
      category: topic.category,
      slug: topic.slug,
      label: `خطوط ${topic.category}`,
    }));

  const categories = scoredCategories.length > 0
    ? scoredCategories
    : [{ category: "تصميم", slug: "tasmeem", label: "خطوط تصميم عربية" }];

  const relevantCategoryNames = new Set(categories.map(item => item.category));
  const matchingCollections = collections
    .map(collection => ({
      collection,
      score: (collectionTopics[collection.slug] || []).reduce(
        (score, term) => score + (text.includes(term) ? 1 : 0),
        0,
      ),
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const aOverlap = a.collection.categories.filter(category => relevantCategoryNames.has(category)).length;
      const bOverlap = b.collection.categories.filter(category => relevantCategoryNames.has(category)).length;
      return bOverlap - aOverlap;
    })
    .slice(0, 2)
    .map(({ collection }) => collection);

  return {
    categories,
    collections: matchingCollections.length > 0
      ? matchingCollections
      : collections.filter(collection => collection.slug === "khotot-bidoon-hoqooq"),
  };
}