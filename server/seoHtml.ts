import fs from "fs";
import path from "path";
import type { Express, Request, Response, NextFunction } from "express";
import type { Font } from "@shared/schema";
import {
  englishCategories,
  englishHome,
  frenchCategories,
  frenchHome,
} from "../client/src/lib/internationalContent";
import {
  localizedCollections,
  localizedStaticPages,
} from "../client/src/lib/localizedPagesContent";
import { collections } from "../client/src/lib/collectionsData";
import { blogPosts as staticBlogPosts } from "../client/src/lib/blogData";
import { fullBlogTranslations, localizedBlogPosts } from "../client/src/lib/blogTranslations";
import { generateLegacyFontSlug } from "../client/src/lib/slugify";
import { getGeneratedPosts } from "./blogGenerator";
import { storage } from "./storage";
import { transformSeoHtml } from "./vite";

const SITE_ORIGIN = "https://xfontat.com";
type Locale = "ar" | "en" | "fr";
type SeoPage = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  heading: string;
  bodyHtml: string;
  imagePath?: string;
  noindex?: boolean;
  alternates?: Partial<Record<Locale | "x-default", string>>;
};

const arabicStaticCopy: Record<"about" | "contact" | "privacy" | "terms", {
  title: string;
  description: string;
  heading: string;
  intro: string;
}> = {
  about: {
    title: "من نحن | xfontat",
    description: "تعرف على xfontat، مكتبة الخطوط العربية التي تساعدك على تصفح الخطوط ومعاينتها ومراجعة تفاصيل كل ملف.",
    heading: "من نحن",
    intro: "تساعد xfontat المصممين والمطورين على استكشاف ملفات الخطوط العربية ومعاينة النصوص ومراجعة الصيغة والترخيص والمصدر قبل الاستخدام.",
  },
  contact: {
    title: "اتصل بنا | xfontat",
    description: "تواصل مع فريق xfontat للاستفسارات أو الاقتراحات أو الإبلاغ عن مشكلة في صفحات الخطوط.",
    heading: "اتصل بنا",
    intro: "يمكنك التواصل معنا بشأن معلومات الخطوط أو اقتراح تحسينات للموقع. راجع تفاصيل الملف ومصدره عند الإبلاغ عن مشكلة.",
  },
  privacy: {
    title: "سياسة الخصوصية | xfontat",
    description: "اقرأ سياسة الخصوصية الخاصة بموقع xfontat وكيفية التعامل مع بيانات الاستخدام.",
    heading: "سياسة الخصوصية",
    intro: "نوضح في هذه الصفحة المعلومات المتعلقة باستخدام الموقع والبيانات التي قد تُجمع لتحسين الخدمة. لا تشارك معلومات حساسة عبر الموقع.",
  },
  terms: {
    title: "شروط الاستخدام | xfontat",
    description: "راجع شروط استخدام موقع xfontat وتحقق من ترخيص كل ملف خط قبل استخدامه أو إعادة توزيعه.",
    heading: "شروط الاستخدام",
    intro: "تختلف حقوق استخدام الخطوط بحسب الملف ومصدره. راجع الترخيص الأصلي لكل خط قبل الاستخدام التجاري أو إعادة التوزيع.",
  },
};

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizePath(pathname: string): string {
  const withoutTrailingSlashes = pathname.replace(/\/+$/, "");
  return withoutTrailingSlashes || "/";
}

function getLocaleAndPath(pathname: string): { locale: Locale; pagePath: string } {
  const normalized = normalizePath(pathname);
  if (normalized === "/en" || normalized.startsWith("/en/")) {
    return { locale: "en", pagePath: normalized.slice(3) || "/" };
  }
  if (normalized === "/fr" || normalized.startsWith("/fr/")) {
    return { locale: "fr", pagePath: normalized.slice(3) || "/" };
  }
  return { locale: "ar", pagePath: normalized };
}

function pathForLocale(locale: Locale, pagePath: string): string {
  if (locale === "ar") return pagePath;
  return pagePath === "/" ? `/${locale}` : `/${locale}${pagePath}`;
}

function pageAlternates(pagePath: string): SeoPage["alternates"] {
  return {
    ar: `${SITE_ORIGIN}${pagePath}`,
    en: `${SITE_ORIGIN}${pathForLocale("en", pagePath)}`,
    fr: `${SITE_ORIGIN}${pathForLocale("fr", pagePath)}`,
    "x-default": `${SITE_ORIGIN}${pagePath}`,
  };
}

function categoryLabel(locale: Locale, slug: string): string {
  const category = englishCategories.find((item) => item.slug === slug);
  if (!category) return slug;
  if (locale === "en") return category.name;
  if (locale === "fr") {
    return frenchCategories.find((item) => item.slug === slug)?.name || category.name;
  }
  return category.arabicCategory;
}

function getFontPath(locale: Locale, font: Font): string {
  return pathForLocale(locale, `/font/${font.slug}`);
}

function getCategoryPath(locale: Locale, slug: string): string {
  return pathForLocale(locale, `/fonts/${slug}`);
}

function fontLinkList(fonts: Font[], locale: Locale): string {
  if (fonts.length === 0) {
    const message = locale === "fr"
      ? "Aucun fichier de police n’est actuellement répertorié dans cette catégorie."
      : locale === "en"
        ? "No font files are currently listed in this category."
        : "لا توجد ملفات خطوط مدرجة حالياً في هذا التصنيف.";
    return `<p>${escapeHtml(message)}</p>`;
  }
  return `<ul>${fonts.map((font) =>
    `<li><a href="${escapeHtml(getFontPath(locale, font))}">${escapeHtml(font.nameArabic)} — <span lang="en" dir="ltr">${escapeHtml(font.name)}</span></a></li>`
  ).join("")}</ul>`;
}

function localizedHomeText(locale: Locale): {
  title: string; description: string; heading: string; intro: string; browse: string; collections: string;
} {
  if (locale === "en") {
    return {
      title: englishHome.title,
      description: englishHome.description,
      heading: englishHome.heading,
      intro: englishHome.intro,
      browse: "Browse Arabic typography",
      collections: "Browse fonts by project",
    };
  }
  if (locale === "fr") {
    return {
      title: frenchHome.title,
      description: frenchHome.description,
      heading: frenchHome.heading,
      intro: frenchHome.intro,
      browse: "Explorer les styles de polices arabes",
      collections: "Parcourir les polices par projet",
    };
  }
  return {
    title: "خطوط عربية للتحميل والمعاينة | xfontat",
    description: "تصفح الخطوط العربية حسب التصنيف، وعاين النصوص، وراجع صيغة كل ملف وترخيصه ومصدره قبل الاستخدام.",
    heading: "تصفح الخطوط العربية وعاينها",
    intro: "استكشف ملفات الخطوط العربية حسب الأسلوب، واكتب نصك لمعاينته، ثم راجع صيغة الملف والترخيص والمصدر قبل استخدامه.",
    browse: "استكشف تصنيفات الخطوط العربية",
    collections: "تصفح الخطوط حسب الاستخدام",
  };
}

function resolveHome(locale: Locale, fonts: Font[]): SeoPage {
  const copy = localizedHomeText(locale);
  const categories = englishCategories.map((category) => (
    `<li><a href="${escapeHtml(getCategoryPath(locale, category.slug))}">${escapeHtml(categoryLabel(locale, category.slug))}</a></li>`
  )).join("");
  const collectionLinks = collections.map((collection) => {
    const localized = locale === "ar" ? null : localizedCollections[locale][collection.slug];
    if (locale !== "ar" && !localized) return "";
    const label = localized?.title || collection.titleArabic;
    return `<li><a href="${escapeHtml(pathForLocale(locale, `/collection/${collection.slug}`))}">${escapeHtml(label)}</a></li>`;
  }).join("");
  const featuredFonts = fonts.slice(0, 20);
  const bodyHtml = [
    `<p>${escapeHtml(copy.intro)}</p>`,
    `<section><h2>${escapeHtml(copy.browse)}</h2><ul>${categories}</ul></section>`,
    `<section><h2>${escapeHtml(copy.collections)}</h2><ul>${collectionLinks}</ul></section>`,
    `<section><h2>${escapeHtml(locale === "fr" ? "Polices à découvrir" : locale === "en" ? "Fonts to explore" : "خطوط مقترحة للتصفح")}</h2>${fontLinkList(featuredFonts, locale)}</section>`,
  ].join("");
  return {
    locale,
    path: pathForLocale(locale, "/"),
    title: copy.title,
    description: copy.description,
    heading: copy.heading,
    bodyHtml,
    alternates: pageAlternates("/"),
  };
}

function resolveCategory(locale: Locale, slug: string, fonts: Font[]): SeoPage | null {
  const category = englishCategories.find((item) => item.slug === slug);
  if (!category) return null;
  const categoryFonts = fonts.filter((font) => font.category === category.arabicCategory);
  const localizedCategory = locale === "fr"
    ? frenchCategories.find((item) => item.slug === slug)
    : category;
  const heading = locale === "ar" ? category.arabicCategory : localizedCategory?.name || category.name;
  const title = locale === "ar"
    ? `${category.arabicCategory} - خطوط عربية للتحميل والمعاينة | xfontat`
    : localizedCategory?.title || `${heading} Arabic Fonts | xfontat`;
  const description = locale === "ar"
    ? `تصفح ملفات الخطوط العربية ضمن تصنيف ${category.arabicCategory}. عاين النص وراجع صيغة كل ملف وترخيصه ومصدره.`
    : localizedCategory?.description || `Browse ${heading} Arabic font files, preview sample text, and check each file’s format and license.`;
  const intro = locale === "ar"
    ? `تضم هذه الصفحة ${categoryFonts.length} ملفاً مصنفاً ضمن ${category.arabicCategory}. تختلف أشكال الحروف والتوافق والتراخيص بحسب الملف، لذلك راجع التفاصيل قبل الاستخدام.`
    : localizedCategory?.intro || description;
  return {
    locale,
    path: pathForLocale(locale, `/fonts/${slug}`),
    title,
    description,
    heading,
    bodyHtml: `<p>${escapeHtml(intro)}</p><p><a href="${escapeHtml(pathForLocale(locale, "/"))}">${escapeHtml(locale === "fr" ? "Accueil" : locale === "en" ? "Home" : "الرئيسية")}</a></p><section><h2>${escapeHtml(locale === "fr" ? "Fichiers de police de cette catégorie" : locale === "en" ? "Font files in this category" : "ملفات الخطوط في هذا التصنيف")}</h2>${fontLinkList(categoryFonts, locale)}</section>`,
    alternates: pageAlternates(`/fonts/${slug}`),
  };
}

function resolveCollection(locale: Locale, slug: string, fonts: Font[]): SeoPage | null {
  const collection = collections.find((item) => item.slug === slug);
  if (!collection) return null;
  const localized = locale === "ar" ? null : localizedCollections[locale][slug];
  const availableTranslation = locale === "ar" || Boolean(localized);
  const title = localized?.title || collection.title;
  const description = localized?.description || collection.description;
  const collectionFonts = fonts.filter((font) => collection.categories.includes(font.category));
  const bodyIntro = locale === "ar" ? collection.longDescription : localized?.description || description;
  const categoryLinks = collection.categories.map((categoryName) => {
    const category = englishCategories.find((item) => item.arabicCategory === categoryName);
    if (!category) return "";
    return `<li><a href="${escapeHtml(getCategoryPath(locale, category.slug))}">${escapeHtml(categoryLabel(locale, category.slug))}</a></li>`;
  }).join("");
  return {
    locale,
    path: pathForLocale(locale, `/collection/${slug}`),
    title: `${title} | xfontat`,
    description,
    heading: title,
    bodyHtml: `<p>${escapeHtml(bodyIntro)}</p><section><h2>${escapeHtml(locale === "fr" ? "Styles associés" : locale === "en" ? "Related styles" : "التصنيفات المرتبطة")}</h2><ul>${categoryLinks}</ul></section><section><h2>${escapeHtml(locale === "fr" ? "Fichiers de police de la collection" : locale === "en" ? "Font files in this collection" : "ملفات الخطوط في المجموعة")}</h2>${fontLinkList(collectionFonts, locale)}</section>`,
    noindex: !availableTranslation,
    alternates: pageAlternates(`/collection/${slug}`),
  };
}

function resolveFont(locale: Locale, font: Font): SeoPage {
  const category = categoryLabel(locale, englishCategories.find((item) => item.arabicCategory === font.category)?.slug || font.category);
  const title = locale === "ar"
    ? `${font.nameArabic} - تحميل الخط العربي | xfontat`
    : locale === "fr"
      ? `Télécharger la police arabe ${font.name} | xfontat`
      : `Download ${font.name} Arabic Font | xfontat`;
  const description = locale === "ar"
    ? `حمّل خط ${font.nameArabic} بصيغة ${font.fileFormat}. راجع التصنيف والمصمم والترخيص والمصدر قبل استخدام ملف الخط.`
    : locale === "fr"
      ? `Téléchargez le fichier de police arabe ${font.name} au format ${font.fileFormat}. Consultez sa catégorie, son créateur, sa licence et sa source avant utilisation.`
      : `Download the ${font.name} Arabic font file in ${font.fileFormat} format. Review its category, designer, license, and source before use.`;
  const heading = locale === "ar"
    ? `تحميل خط ${font.nameArabic}`
    : locale === "fr"
      ? `Télécharger la police arabe ${font.name}`
      : `Download ${font.name} Arabic Font`;
  const details = [
    [locale === "fr" ? "Catégorie" : locale === "en" ? "Category" : "التصنيف", category],
    [locale === "fr" ? "Format" : locale === "en" ? "Format" : "الصيغة", font.fileFormat],
    [locale === "fr" ? "Créateur" : locale === "en" ? "Designer" : "المصمم", font.designer],
    [locale === "fr" ? "Licence" : locale === "en" ? "License" : "الترخيص", font.license],
  ].filter((item) => item[1]);
  const categorySlug = englishCategories.find((item) => item.arabicCategory === font.category)?.slug;
  const sourceLink = font.sourceUrl
    ? `<p><a href="${escapeHtml(font.sourceUrl)}" rel="nofollow noopener noreferrer">${escapeHtml(locale === "fr" ? "Consulter la source" : locale === "en" ? "View source" : "عرض المصدر")}</a></p>`
    : "";
  const detailsHtml = details.map(([label, value]) => `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd>`).join("");
  const categoryLink = categorySlug
    ? `<p><a href="${escapeHtml(getCategoryPath(locale, categorySlug))}">${escapeHtml(locale === "fr" ? "Parcourir la catégorie" : locale === "en" ? "Browse this category" : "تصفح هذا التصنيف")}: ${escapeHtml(category)}</a></p>`
    : "";
  const downloadText = locale === "fr" ? "Télécharger le fichier" : locale === "en" ? "Download file" : "تحميل الملف";
  const previewSlug = generateLegacyFontSlug(font.name, font.fileName, font.category);
  const previewFile = path.join(process.cwd(), "client/public/font-previews", `${previewSlug}.webp`);
  const imagePath = fs.existsSync(previewFile) ? `/font-previews/${previewSlug}.webp` : "/logo.png";
  return {
    locale,
    path: getFontPath(locale, font),
    title,
    description,
    heading,
    imagePath,
    bodyHtml: `<p>${escapeHtml(description)}</p><dl>${detailsHtml}</dl>${categoryLink}${sourceLink}<p><a href="${escapeHtml(font.fileUrl)}" download="${escapeHtml(font.fileName)}">${escapeHtml(downloadText)}</a></p>`,
    alternates: pageAlternates(`/font/${font.slug}`),
  };
}

function renderStaticSections(sections: unknown): string {
  if (!Array.isArray(sections)) return "";
  return sections.map((section) => {
    if (!section || typeof section !== "object") return "";
    const item = section as Record<string, unknown>;
    const heading = item.heading ? `<h2>${escapeHtml(item.heading)}</h2>` : "";
    const bodies = Array.isArray(item.body)
      ? item.body.map((body) => `<p>${escapeHtml(body)}</p>`).join("")
      : "";
    const items = Array.isArray(item.items)
      ? `<ul>${item.items.map((entry) => `<li>${escapeHtml(entry)}</li>`).join("")}</ul>`
      : "";
    return `<section>${heading}${bodies}${items}</section>`;
  }).join("");
}

function resolveStaticPage(locale: Locale, key: "about" | "contact" | "privacy" | "terms"): SeoPage {
  if (locale === "ar") {
    const page = arabicStaticCopy[key];
    return {
      locale,
      path: pathForLocale(locale, `/${key}`),
      title: page.title,
      description: page.description,
      heading: page.heading,
      bodyHtml: `<p>${escapeHtml(page.intro)}</p><p><a href="/">${escapeHtml("العودة إلى تصفح الخطوط العربية")}</a></p>`,
      alternates: pageAlternates(`/${key}`),
    };
  }
  const localizedPage = localizedStaticPages[locale][key] as unknown as Record<string, unknown>;
  const title = String(localizedPage.title || key);
  const description = String(localizedPage.description || title);
  const heading = String(localizedPage.heading || title);
  const pageTitle = /xfontat/i.test(title) ? title : `${title} | xfontat`;
  const intro = localizedPage.intro ? `<p>${escapeHtml(localizedPage.intro)}</p>` : "";
  const extraForm = Array.isArray(localizedPage.form)
    ? `<ul>${localizedPage.form.map((entry) => `<li>${escapeHtml(entry)}</li>`).join("")}</ul>`
    : "";
  const homeLink = locale === "fr" ? "Retour à l’accueil" : "Return to the home page";
  return {
    locale,
    path: pathForLocale(locale, `/${key}`),
    title: pageTitle,
    description,
    heading,
    bodyHtml: `${intro}${renderStaticSections(localizedPage.sections)}${extraForm}<p><a href="${escapeHtml(pathForLocale(locale, "/"))}">${escapeHtml(homeLink)}</a></p>`,
    alternates: pageAlternates(`/${key}`),
  };
}

type BlogPost = {
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  dateISO?: string;
  dateModified?: string;
};

function getAllBlogPosts(): BlogPost[] {
  const generated = getGeneratedPosts() as BlogPost[];
  const postsBySlug = new Map<string, BlogPost>();
  for (const post of [...staticBlogPosts, ...generated]) {
    if (post?.slug && !postsBySlug.has(post.slug)) postsBySlug.set(post.slug, post);
  }
  return Array.from(postsBySlug.values());
}

function translatedBlogPost(slug: string, locale: "en" | "fr") {
  const full = fullBlogTranslations[slug]?.[locale];
  if (!full?.content?.trim()) return null;
  const short = localizedBlogPosts[locale][slug];
  return {
    title: full.title || short?.title || slug,
    excerpt: full.excerpt || short?.excerpt || short?.summary || "",
    content: full.content,
  };
}

function renderMarkdownLite(markdown: string): string {
  const blocks: string[] = [];
  let listItems: string[] = [];
  const flushList = () => {
    if (listItems.length) {
      blocks.push(`<ul>${listItems.join("")}</ul>`);
      listItems = [];
    }
  };
  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      listItems.push(`<li>${escapeHtml(line.replace(/^[-*]\s+/, ""))}</li>`);
      continue;
    }
    flushList();
    const headingMatch = /^(#{1,3})\s+(.+)$/.exec(line);
    if (headingMatch) {
      const level = Math.min(3, headingMatch[1].length + 1);
      blocks.push(`<h${level}>${escapeHtml(headingMatch[2])}</h${level}>`);
    } else {
      blocks.push(`<p>${escapeHtml(line).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</p>`);
    }
  }
  flushList();
  return blocks.join("");
}

function resolveBlogIndex(locale: Locale, posts: BlogPost[]): SeoPage {
  const translatedPosts = locale === "ar"
    ? posts.map((post) => ({ ...post, label: post.title, excerpt: post.excerpt || "" }))
    : posts.flatMap((post) => {
      const translation = translatedBlogPost(post.slug, locale);
      return translation ? [{ ...post, label: translation.title, excerpt: translation.excerpt }] : [];
    });
  const heading = locale === "fr" ? "Articles sur les polices arabes" : locale === "en" ? "Arabic font articles" : "مقالات عن الخطوط العربية";
  const title = locale === "fr" ? "Blog sur les polices arabes | xfontat" : locale === "en" ? "Arabic Font Blog | xfontat" : "مدونة الخطوط العربية | xfontat";
  const description = locale === "fr"
    ? "Guides pratiques sur les polices arabes, les formats de fichiers, les licences et la typographie numérique."
    : locale === "en"
      ? "Practical guides to Arabic fonts, file formats, font licenses, and digital typography."
      : "اقرأ مقالات عملية عن الخطوط العربية وصيغ الملفات والتراخيص والطباعة الرقمية.";
  const list = translatedPosts.map((post) =>
    `<li><a href="${escapeHtml(pathForLocale(locale, `/blog/${post.slug}`))}">${escapeHtml(post.label)}</a><p>${escapeHtml(post.excerpt)}</p></li>`
  ).join("");
  return {
    locale,
    path: pathForLocale(locale, "/blog"),
    title,
    description,
    heading,
    bodyHtml: `<p>${escapeHtml(description)}</p><ul>${list}</ul>`,
    alternates: pageAlternates("/blog"),
  };
}

function resolveBlogArticle(locale: Locale, slug: string, posts: BlogPost[]): SeoPage | null {
  const post = posts.find((item) => item.slug === slug);
  if (!post) return null;
  if (locale === "ar") {
    const title = post.title;
    const description = post.excerpt || title;
    return {
      locale,
      path: `/blog/${slug}`,
      title: `${title} | xfontat`,
      description,
      heading: title,
      bodyHtml: `${renderMarkdownLite(post.content || description)}<p><a href="/blog">جميع المقالات</a></p>`,
      alternates: pageAlternates(`/blog/${slug}`),
    };
  }
  const translation = translatedBlogPost(slug, locale);
  if (!translation) {
    const title = locale === "fr" ? "Article non traduit | xfontat" : "Article not translated | xfontat";
    const description = locale === "fr"
      ? "Cet article n’est pas encore disponible dans cette langue."
      : "This article is not yet available in this language.";
    return {
      locale,
      path: pathForLocale(locale, `/blog/${slug}`),
      title,
      description,
      heading: title,
      noindex: true,
      bodyHtml: `<p>${escapeHtml(description)}</p><p><a href="/blog/${slug}">${escapeHtml(locale === "fr" ? "Lire l’article en arabe" : "Read the Arabic article")}</a></p>`,
      alternates: pageAlternates(`/blog/${slug}`),
    };
  }
  return {
    locale,
    path: pathForLocale(locale, `/blog/${slug}`),
    title: `${translation.title} | xfontat`,
    description: translation.excerpt || translation.title,
    heading: translation.title,
    bodyHtml: `${renderMarkdownLite(translation.content)}<p><a href="${escapeHtml(pathForLocale(locale, "/blog"))}">${escapeHtml(locale === "fr" ? "Tous les articles" : "All articles")}</a></p>`,
    alternates: pageAlternates(`/blog/${slug}`),
  };
}

function resolveUtilityPage(locale: Locale, pagePath: string, fonts: Font[]): SeoPage | null {
  if (pagePath === "/design-fonts") {
    const title = locale === "fr" ? "Polices arabes pour le design | xfontat" : locale === "en" ? "Arabic Design Fonts | xfontat" : "خطوط عربية للتصميم | xfontat";
    const description = locale === "fr" ? "Parcourez les fichiers de polices arabes classés pour les projets de design." : locale === "en" ? "Browse Arabic font files grouped for design projects and review each file’s format and license." : "تصفح الخطوط العربية المناسبة لمشاريع التصميم وراجع صيغة كل ملف وترخيصه.";
    const designFonts = fonts.filter((font) => ["تصميم", "فوتوشوب"].includes(font.category));
    return {
      locale,
      path: pathForLocale(locale, pagePath),
      title,
      description,
      heading: locale === "fr" ? "Polices arabes pour le design" : locale === "en" ? "Arabic design fonts" : "خطوط عربية للتصميم",
      bodyHtml: `<p>${escapeHtml(description)}</p>${fontLinkList(designFonts, locale)}`,
      alternates: pageAlternates(pagePath),
    };
  }
  if (pagePath === "/youtube-thumbnail-maker") {
    const title = locale === "fr" ? "Créateur de miniatures YouTube | xfontat" : locale === "en" ? "YouTube Thumbnail Maker | xfontat" : "منشئ صور يوتيوب المصغرة | xfontat";
    const description = locale === "fr" ? "Créez des miniatures YouTube et prévisualisez des titres en arabe." : locale === "en" ? "Create YouTube thumbnails and preview Arabic titles in the intended layout." : "أنشئ صوراً مصغرة لليوتيوب وعاين العناوين العربية ضمن التصميم.";
    return {
      locale,
      path: pathForLocale(locale, pagePath),
      title,
      description,
      heading: title.replace(" | xfontat", ""),
      bodyHtml: `<p>${escapeHtml(description)}</p><p><a href="${escapeHtml(pathForLocale(locale, "/"))}">${escapeHtml(locale === "fr" ? "Parcourir les polices arabes" : locale === "en" ? "Browse Arabic fonts" : "تصفح الخطوط العربية")}</a></p>`,
      alternates: pageAlternates(pagePath),
    };
  }
  return null;
}

async function resolvePage(pathname: string): Promise<SeoPage | null> {
  const { locale, pagePath } = getLocaleAndPath(pathname);
  const fonts = await storage.getAllFonts();
  const posts = getAllBlogPosts();

  if (pagePath === "/") return resolveHome(locale, fonts);

  const fontMatch = /^\/font\/([^/]+)$/.exec(pagePath);
  if (fontMatch) {
    const requestedSlug = decodeURIComponent(fontMatch[1]);
    const font = await storage.getFontBySlug(requestedSlug);
    if (!font) return null;
    if (requestedSlug !== font.slug) {
      throw Object.assign(new Error("Font slug alias"), {
        status: 301,
        location: getFontPath(locale, font),
      });
    }
    return resolveFont(locale, font);
  }

  const categoryMatch = /^\/fonts\/([^/]+)$/.exec(pagePath);
  if (categoryMatch) return resolveCategory(locale, decodeURIComponent(categoryMatch[1]), fonts);

  const collectionMatch = /^\/collection\/([^/]+)$/.exec(pagePath);
  if (collectionMatch) return resolveCollection(locale, decodeURIComponent(collectionMatch[1]), fonts);

  if (pagePath === "/blog") return resolveBlogIndex(locale, posts);
  const blogMatch = /^\/blog\/([^/]+)$/.exec(pagePath);
  if (blogMatch) return resolveBlogArticle(locale, decodeURIComponent(blogMatch[1]), posts);

  if (["/about", "/contact", "/privacy", "/terms"].includes(pagePath)) {
    return resolveStaticPage(locale, pagePath.slice(1) as "about" | "contact" | "privacy" | "terms");
  }

  return resolveUtilityPage(locale, pagePath, fonts);
}

function replaceMeta(html: string, attribute: "name" | "property", key: string, content: string): string {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`<meta\\b(?=[^>]*\\b${attribute}\\s*=\\s*["']${escapedKey}["'])[^>]*>`, "i");
  const tag = `<meta ${attribute}="${escapeHtml(key)}" content="${escapeHtml(content)}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace(/<\/head>/i, `  ${tag}\n</head>`);
}

function setLink(html: string, rel: string, href: string): string {
  const escapedRel = rel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`<link\\b(?=[^>]*\\brel\\s*=\\s*["']${escapedRel}["'])[^>]*>`, "i");
  const tag = `<link rel="${escapeHtml(rel)}" href="${escapeHtml(href)}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace(/<\/head>/i, `  ${tag}\n</head>`);
}

function injectAlternates(html: string, alternates: SeoPage["alternates"]): string {
  html = html.replace(/<link\b(?=[^>]*\brel\s*=\s*["']alternate["'])[^>]*>/gi, "");
  const links = (["ar", "en", "fr", "x-default"] as const)
    .filter((lang) => alternates?.[lang])
    .map((lang) => `<link rel="alternate" hreflang="${lang}" href="${escapeHtml(alternates![lang]!)}" data-seo-alternate="true" />`)
    .join("\n  ");
  return html.replace(/<\/head>/i, `  ${links}\n</head>`);
}

function injectHtmlAttributes(html: string, locale: Locale): string {
  return html.replace(/<html\b([^>]*)>/i, (_match, originalAttributes: string) => {
    let attributes = originalAttributes
      .replace(/\s+lang=(["']).*?\1/i, "")
      .replace(/\s+dir=(["']).*?\1/i, "");
    attributes += ` lang="${locale}" dir="${locale === "ar" ? "rtl" : "ltr"}"`;
    return `<html${attributes}>`;
  });
}

function injectRootFallback(html: string, page: SeoPage): string {
  const direction = page.locale === "ar" ? "rtl" : "ltr";
  const content = `<main lang="${page.locale}" dir="${direction}" data-seo-fallback="true"><h1>${escapeHtml(page.heading)}</h1>${page.bodyHtml}</main>`;
  return html.replace(/<div\s+id=["']root["'][^>]*>[\s\S]*?<\/div>/i, `<div id="root">${content}</div>`);
}

async function loadIndexTemplate(): Promise<string> {
  const sourceIndex = path.resolve(process.cwd(), "client/index.html");
  const builtIndex = path.resolve(process.cwd(), "dist/public/index.html");
  const candidates = process.env.NODE_ENV === "production"
    ? [builtIndex, sourceIndex]
    : [sourceIndex, builtIndex];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return fs.promises.readFile(candidate, "utf8");
  }
  throw new Error("Unable to locate the client index.html template.");
}

async function renderPage(req: Request, res: Response, page: SeoPage, status = 200) {
  const canonical = `${SITE_ORIGIN}${page.path}`;
  const image = `${SITE_ORIGIN}${page.imagePath || "/logo.png"}`;
  const localeTag = page.locale === "ar" ? "ar_AR" : page.locale === "fr" ? "fr_FR" : "en_US";
  let html = await loadIndexTemplate();

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`);
  html = injectHtmlAttributes(html, page.locale);
  html = setLink(html, "canonical", canonical);
  html = replaceMeta(html, "name", "title", page.title);
  html = replaceMeta(html, "name", "description", page.description);
  html = replaceMeta(html, "name", "robots", page.noindex || status === 404 ? "noindex,follow" : "index,follow");
  html = replaceMeta(html, "property", "og:title", page.title);
  html = replaceMeta(html, "property", "og:description", page.description);
  html = replaceMeta(html, "property", "og:url", canonical);
  html = replaceMeta(html, "property", "og:image", image);
  html = replaceMeta(html, "property", "og:type", page.path.startsWith("/blog/") ? "article" : "website");
  html = replaceMeta(html, "property", "og:locale", localeTag);
  html = replaceMeta(html, "property", "og:site_name", "xfontat");
  html = replaceMeta(html, "name", "twitter:card", "summary_large_image");
  html = replaceMeta(html, "name", "twitter:title", page.title);
  html = replaceMeta(html, "name", "twitter:description", page.description);
  html = replaceMeta(html, "name", "twitter:url", canonical);
  html = replaceMeta(html, "name", "twitter:image", image);
  html = injectAlternates(html, page.alternates);
  html = injectRootFallback(html, page);
  const transformed = await transformSeoHtml(req.originalUrl, html);
  res.setHeader("X-Robots-Tag", page.noindex || status === 404 ? "noindex, follow" : "index, follow");
  res.status(status).type("html").send(transformed);
}

function notFoundPage(pathname: string): SeoPage {
  const { locale } = getLocaleAndPath(pathname);
  const isFrench = locale === "fr";
  const isEnglish = locale === "en";
  const title = isFrench ? "Page introuvable | xfontat" : isEnglish ? "Page not found | xfontat" : "الصفحة غير موجودة | xfontat";
  const description = isFrench ? "La page demandée est introuvable." : isEnglish ? "The requested page could not be found." : "تعذر العثور على الصفحة المطلوبة.";
  const home = pathForLocale(locale, "/");
  return {
    locale,
    path: normalizePath(pathname),
    title,
    description,
    heading: title.replace(" | xfontat", ""),
    noindex: true,
    bodyHtml: `<p>${escapeHtml(description)}</p><p><a href="${escapeHtml(home)}">${escapeHtml(isFrench ? "Retour à l’accueil" : isEnglish ? "Return home" : "العودة إلى الصفحة الرئيسية")}</a></p>`,
  };
}

function isInfrastructureOrAssetPath(pathname: string): boolean {
  return pathname.startsWith("/api/")
    || pathname === "/api"
    || pathname === "/sitemap.xml"
    || pathname === "/robots.txt"
    || pathname.startsWith("/__preview")
    || pathname.startsWith("/@")
    || pathname.startsWith("/src/")
    || pathname.startsWith("/node_modules/")
    || pathname.startsWith("/assets/");
}

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function dateToIso(value: unknown): string | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function newestDate(values: Array<unknown>): string | undefined {
  const dates = values.map(dateToIso).filter((date): date is string => Boolean(date));
  return dates.sort().at(-1);
}

function sourceLastmod(...relativePaths: string[]): string | undefined {
  const candidates = relativePaths.map((relativePath) => path.resolve(process.cwd(), relativePath));
  candidates.push(path.resolve(process.cwd(), "dist/public/index.html"));
  const dates = candidates.flatMap((candidate) => {
    try {
      return [fs.statSync(candidate).mtime];
    } catch {
      return [];
    }
  });
  return newestDate(dates);
}

async function renderDynamicSitemap(res: Response): Promise<void> {
  const fonts = await storage.getAllFonts();
  const posts = getAllBlogPosts();
  const entries = new Map<string, string | undefined>();
  const add = (urlPath: string, lastmod?: string) => entries.set(urlPath, lastmod);
  const allFontsLastmod = newestDate(fonts.map((font) => font.addedAt));
  const homeLastmod = allFontsLastmod || sourceLastmod("client/src/lib/internationalContent.ts");

  add("/", homeLastmod);
  add("/en", homeLastmod);
  add("/fr", homeLastmod);

  for (const category of englishCategories) {
    const categoryFonts = fonts.filter((font) => font.category === category.arabicCategory);
    if (categoryFonts.length === 0) continue;
    const lastmod = newestDate(categoryFonts.map((font) => font.addedAt))
      || sourceLastmod("client/src/lib/internationalContent.ts");
    add(`/fonts/${category.slug}`, lastmod);
    add(`/en/fonts/${category.slug}`, lastmod);
    if (frenchCategories.some((item) => item.slug === category.slug)) {
      add(`/fr/fonts/${category.slug}`, lastmod);
    }
  }

  for (const collection of collections) {
    const localizedFonts = fonts.filter((font) => collection.categories.includes(font.category));
    if (localizedFonts.length === 0) continue;
    const lastmod = newestDate(localizedFonts.map((font) => font.addedAt))
      || sourceLastmod("client/src/lib/collectionsData.ts", "client/src/lib/localizedPagesContent.ts");
    add(`/collection/${collection.slug}`, lastmod);
    if (localizedCollections.en[collection.slug]) add(`/en/collection/${collection.slug}`, lastmod);
    if (localizedCollections.fr[collection.slug]) add(`/fr/collection/${collection.slug}`, lastmod);
  }

  for (const font of fonts) {
    const cleanPath = `/font/${font.slug}`;
    const lastmod = dateToIso(font.addedAt);
    add(cleanPath, lastmod);
    add(`/en${cleanPath}`, lastmod);
    add(`/fr${cleanPath}`, lastmod);
  }

  const blogLastmod = newestDate(posts.map((post) => post.dateModified || post.dateISO))
    || sourceLastmod("client/src/lib/blogData.ts");
  add("/blog", blogLastmod);
  add("/en/blog", blogLastmod);
  add("/fr/blog", blogLastmod);
  for (const post of posts) {
    const lastmod = dateToIso(post.dateModified || post.dateISO);
    add(`/blog/${post.slug}`, lastmod);
    if (fullBlogTranslations[post.slug]?.en?.content?.trim()) {
      add(`/en/blog/${post.slug}`, lastmod);
    }
    if (fullBlogTranslations[post.slug]?.fr?.content?.trim()) {
      add(`/fr/blog/${post.slug}`, lastmod);
    }
  }

  const staticPagePaths = [
    { path: "/about", source: "client/src/pages/About.tsx" },
    { path: "/contact", source: "client/src/pages/Contact.tsx" },
    { path: "/privacy", source: "client/src/pages/Privacy.tsx" },
    { path: "/terms", source: "client/src/pages/Terms.tsx" },
  ];
  for (const page of staticPagePaths) {
    const lastmod = sourceLastmod(page.source, "client/src/lib/localizedPagesContent.ts");
    add(page.path, lastmod);
    add(`/en${page.path}`, lastmod);
    add(`/fr${page.path}`, lastmod);
  }

  const urlNodes = Array.from(entries.entries()).map(([urlPath, lastmod]) => {
    const lastmodNode = lastmod ? `\n    <lastmod>${xmlEscape(lastmod)}</lastmod>` : "";
    return `  <url>\n    <loc>${xmlEscape(`${SITE_ORIGIN}${urlPath}`)}</loc>${lastmodNode}\n  </url>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlNodes.join("\n")}\n</urlset>`;
  res.type("application/xml").send(xml);
}

export function registerSeoHtmlRoute(app: Express): void {
  app.get("/sitemap.xml", async (_req: Request, res: Response) => {
    try {
      await renderDynamicSitemap(res);
    } catch (error) {
      console.error("Sitemap generation failed:", error);
      res.status(500).type("text").send("Unable to generate sitemap.");
    }
  });

  app.get("*", async (req: Request, res: Response, next: NextFunction) => {
    const pathname = normalizePath(req.path);
    if (isInfrastructureOrAssetPath(pathname)) return next();

    try {
      const page = await resolvePage(pathname);
      if (page) return await renderPage(req, res, page);
      return await renderPage(req, res, notFoundPage(pathname), 404);
    } catch (error) {
      const redirect = error as { status?: number; location?: string };
      if (redirect.status === 301 && redirect.location) {
        return res.redirect(301, redirect.location);
      }
      console.error("SEO HTML route failed:", error);
      return res.status(500).type("text").send("Unable to render page metadata.");
    }
  });
}
