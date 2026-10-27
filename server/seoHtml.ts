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
import { arabicCategoryMeta, categoryContent, categoryDescriptions, categoryUseCases } from "../client/src/lib/arabicCategoryContent";
import { getLocalizedFontPageContent } from "../client/src/lib/localizedFontDetails";
import { textToImagePage, toolFaqSchema, zakhrafaPage, type ToolPageCopy } from "../client/src/lib/toolPages";
import {
  findIntlTool,
  localeSwitchPath,
  generatorCopy,
  keyboardCopy,
  zakhrafaCopy,
  namesHubCopy,
  phrasesHubCopy,
  tattooCopy,
  toolPaths,
  type IntlLocale,
} from "../client/src/lib/intlTools";
import { arabicNames, getArabicName, namePath, relatedNames, NAME_PATHS } from "../client/src/lib/arabicNames";
import { arabicPhrases, getArabicPhrase, phrasePath, PHRASE_PATHS } from "../client/src/lib/arabicPhrases";
import { spellArabic } from "../client/src/lib/arabicLetters";
import { arabicFontDescription, getFontProfile, profileDescription } from "../client/src/lib/fontProfiles";
import { blogPostPath, blogSeo, localizedBlogSlug, originalBlogSlug } from "../client/src/lib/blogSlugs";
import { nameContent, phraseContent, phraseLabel, type DetailContent } from "../client/src/lib/intlContent";
import { OCCASIONS, getOccasion } from "../client/src/lib/greetingCards";
import { CARD_PATHS, cardOccasionPath, cardsHubCopy, localizeOccasion, parseCardPath, type CardLocale } from "../client/src/lib/greetingCardsIntl";
import * as home from "../client/src/lib/homeContent";
import { howToPosts } from "../client/src/lib/howToPosts";
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
  // Defaults to path; set when another page holds the same content.
  canonicalPath?: string;
  // schema.org nodes for this page, emitted as one @graph in <head>.
  jsonLd?: object[];
  // Data the client reads on first render (see client/src/lib/bootData.ts),
  // so it does not redraw the page once an API request returns.
  bootData?: Record<string, unknown>;
};

function breadcrumbNode(items: Array<[string, string]>): object {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, itemPath], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: `${SITE_ORIGIN}${itemPath}`,
    })),
  };
}

function faqNode(faqs: Array<{ question: string; answer: string }>): object {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

function faqHtml(heading: string, faqs: Array<{ question: string; answer: string }>): string {
  if (faqs.length === 0) return "";
  return `<section><h2>${escapeHtml(heading)}</h2>${faqs.map((faq) => `<h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p>`).join("")}</section>`;
}

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

const MAX_TITLE_LENGTH = 65;

// Search results truncate long titles; drop the brand suffix first.
export function fitTitle(title: string): string {
  return title.length > MAX_TITLE_LENGTH ? title.replace(/\s*\|\s*xfontat$/, "") : title;
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

// Mirrors Home.tsx section by section, using the same shared copy.
function resolveArabicHome(fonts: Font[]): SeoPage {
  const unique = fonts.filter((font) => !font.duplicateOf);
  const counts = new Map<string, number>();
  for (const font of unique) counts.set(font.category, (counts.get(font.category) || 0) + 1);
  const stats = { total: unique.length, categories: Array.from(counts, ([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count) };
  const latest = unique.slice(0, 8);
  const list = (items: string[]) => `<ul>${items.join("")}</ul>`;
  const link = (href: string, label: string, extra = "") => `<li><a href="${escapeHtml(href)}">${escapeHtml(label)}</a>${extra ? ` — ${escapeHtml(extra)}` : ""}</li>`;
  const categoryLinks = englishCategories
    .filter((category) => counts.get(category.arabicCategory))
    .map((category) => link(getCategoryPath("ar", category.slug), `خطوط ${category.arabicCategory}`, `${counts.get(category.arabicCategory)} خطاً`));
  const bodyHtml = [
    `<p>${escapeHtml(home.homeIntro(stats))}</p>`,
    `<section><h2>تصنيفات الخطوط العربية</h2>${list(categoryLinks)}</section>`,
    `<section><h2>${escapeHtml(home.homeTools.heading)}</h2>${list(home.homeTools.items.map((tool) => link(tool.href, tool.title, tool.text)))}</section>`,
    `<section><h2>${escapeHtml(home.homeLatestHeading)}</h2>${list(latest.map((font) => link(getFontPath("ar", font), `خط ${font.nameArabic}`, `${font.category}، أضيف ${dateToIso(font.addedAt)?.slice(0, 10) || ""}`)))}</section>`,
    `<section><h2>${escapeHtml(home.homeAbout.heading)}</h2>${home.homeAbout.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}<h3>${escapeHtml(home.homeAbout.whyHeading)}</h3>${list(home.homeAbout.why.map((item) => `<li><strong>${escapeHtml(item.title)}:</strong> ${escapeHtml(item.desc)}</li>`))}</section>`,
    `<section><h2>${escapeHtml(home.homeChoose.heading)}</h2>${home.homeChoose.items.map((item) => `<h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.content)}</p>`).join("")}</section>`,
    `<section><h2>${escapeHtml(home.homeCategoryGuide.heading)}</h2><p>${escapeHtml(home.homeCategoryGuide.intro)}</p>${list(home.homeCategoryGuide.items.map((item) => `<li><strong>${escapeHtml(item.name)}:</strong> ${escapeHtml(item.desc)}</li>`))}</section>`,
    `<section><h2>${escapeHtml(home.homeCollections.heading)}</h2>${list(home.homeCollections.items.map((item) => link(`/collection/${item.slug}`, item.name, item.desc)))}</section>`,
    `<section><h2>${escapeHtml(home.homeGuidesHeading)}</h2>${list(howToPosts.map((post) => link(`/blog/${post.slug}`, post.title)))}</section>`,
    faqHtml("الأسئلة الشائعة", home.homeFaqs),
  ].join("");
  return {
    locale: "ar",
    path: "/",
    title: home.homeTitle,
    description: home.homeDescription,
    heading: home.homeHeading,
    imagePath: "/og-image.png",
    bodyHtml,
    bootData: { homeStats: stats },
    alternates: pageAlternates("/"),
    jsonLd: [
      {
        "@type": "CollectionPage",
        name: home.homeHeading,
        description: home.homeDescription,
        url: `${SITE_ORIGIN}/`,
        inLanguage: "ar",
        numberOfItems: stats.total,
      },
      {
        "@type": "ItemList",
        name: home.homeLatestHeading,
        itemListElement: latest.map((font, index) => ({ "@type": "ListItem", position: index + 1, name: font.nameArabic, url: `${SITE_ORIGIN}${getFontPath("ar", font)}` })),
      },
      faqNode(home.homeFaqs),
    ],
  };
}

function resolveHome(locale: Locale, fonts: Font[]): SeoPage {
  if (locale === "ar") return resolveArabicHome(fonts);
  const copy = localizedHomeText(locale);
  const categories = englishCategories.map((category) => (
    `<li><a href="${escapeHtml(getCategoryPath(locale, category.slug))}">${escapeHtml(categoryLabel(locale, category.slug))}</a></li>`
  )).join("");
  const collectionLinks = collections.map((collection) => {
    const localized = localizedCollections[locale][collection.slug];
    if (!localized) return "";
    const label = localized.title;
    return `<li><a href="${escapeHtml(pathForLocale(locale, `/collection/${collection.slug}`))}">${escapeHtml(label)}</a></li>`;
  }).join("");
  const featuredFonts = fonts.filter((font) => !font.duplicateOf).slice(0, 20);
  const full = locale === "fr" ? frenchHome : englishHome;
  const bodyHtml = [
    `<p>${escapeHtml(copy.intro)}</p>`,
    `<section><h2>${escapeHtml(full.toolsHeading)}</h2><ul>${full.tools.map((tool) => `<li><a href="${escapeHtml(tool.href)}">${escapeHtml(tool.title)}</a>: ${escapeHtml(tool.description)}</li>`).join("")}</ul></section>`,
    `<section><h2>${escapeHtml(full.aboutHeading)}</h2><p>${escapeHtml(full.about)}</p></section>`,
    `<section><h2>${escapeHtml(full.licenseHeading)}</h2><p>${escapeHtml(full.license)}</p></section>`,
    `<section><h2>${escapeHtml(full.benefitsHeading)}</h2><ul>${full.benefits.map((item) => `<li><strong>${escapeHtml(item.title)}</strong>: ${escapeHtml(item.description)}</li>`).join("")}</ul></section>`,
    `<section><h2>${escapeHtml(full.projectGuidesHeading)}</h2>${full.projectGuides.map((guide) => `<h3>${escapeHtml(guide.title)}</h3><p>${escapeHtml(guide.description)}</p>`).join("")}</section>`,
    `<section><h2>${escapeHtml(copy.browse)}</h2><ul>${categories}</ul></section>`,
    `<section><h2>${escapeHtml(copy.collections)}</h2><ul>${collectionLinks}</ul></section>`,
    `<section><h2>${escapeHtml(locale === "fr" ? "Polices à découvrir" : "Fonts to explore")}</h2>${fontLinkList(featuredFonts, locale)}</section>`,
    faqHtml(full.faqHeading, full.faqs),
  ].join("");
  return {
    locale,
    path: pathForLocale(locale, "/"),
    title: copy.title,
    description: copy.description,
    heading: copy.heading,
    bodyHtml,
    alternates: pageAlternates("/"),
    jsonLd: [
      { "@type": "CollectionPage", name: copy.heading, description: copy.description, url: `${SITE_ORIGIN}${pathForLocale(locale, "/")}`, inLanguage: locale },
      faqNode(full.faqs),
    ],
  };
}

function resolveCategory(locale: Locale, slug: string, fonts: Font[]): SeoPage | null {
  const category = englishCategories.find((item) => item.slug === slug);
  if (!category) return null;
  const categoryFonts = fonts.filter((font) => font.category === category.arabicCategory && !font.duplicateOf);
  const localizedCategory = locale === "fr"
    ? frenchCategories.find((item) => item.slug === slug)
    : category;
  const arabicMeta = arabicCategoryMeta[category.arabicCategory];
  const heading = locale === "ar" ? arabicMeta?.heading || category.arabicCategory : localizedCategory?.heading || localizedCategory?.name || category.name;
  const title = locale === "ar"
    ? arabicMeta?.title || `${category.arabicCategory} - خطوط عربية للتحميل والمعاينة | xfontat`
    : localizedCategory?.title || `${heading} Arabic Fonts | xfontat`;
  const description = locale === "ar"
    ? arabicMeta?.description || `تصفح ملفات الخطوط العربية ضمن تصنيف ${category.arabicCategory}. عاين النص وراجع صيغة كل ملف وترخيصه ومصدره.`
    : localizedCategory?.description || `Browse ${heading} Arabic font files, preview sample text, and check each file’s format and license.`;
  const intro = locale === "ar"
    ? `تضم هذه الصفحة ${categoryFonts.length} ملفاً مصنفاً ضمن ${category.arabicCategory}. تختلف أشكال الحروف والتوافق والتراخيص بحسب الملف، لذلك راجع التفاصيل قبل الاستخدام.`
    : localizedCategory?.intro || description;
  const guide = locale === "ar" ? categoryContent[category.arabicCategory] : undefined;
  const guideHtml = guide
    ? `<p>${escapeHtml(guide.intro)}</p><section><h2>نبذة عن ${escapeHtml(category.arabicCategory)}</h2><p>${escapeHtml(guide.history)}</p></section><section><h2>نصائح الاستخدام</h2><p>${escapeHtml(guide.usageTips)}</p></section>`
    : (localizedCategory?.guide || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
  const faqs = locale === "ar"
    ? (guide ? [{ question: `أسئلة عن خط ${category.arabicCategory}`, answer: guide.faq }] : [])
    : (locale === "fr" ? frenchCategories.find((item) => item.slug === slug)?.faqs : category.faqs) || [];
  const home = locale === "fr" ? "Accueil" : locale === "en" ? "Home" : "الرئيسية";
  return {
    locale,
    path: pathForLocale(locale, `/fonts/${slug}`),
    title,
    description,
    heading,
    bodyHtml: `<p>${escapeHtml(intro)}</p>${guideHtml}<p><a href="${escapeHtml(pathForLocale(locale, "/"))}">${escapeHtml(home)}</a></p><section><h2>${escapeHtml(locale === "fr" ? "Fichiers de police de cette catégorie" : locale === "en" ? "Font files in this category" : "ملفات الخطوط في هذا التصنيف")}</h2>${fontLinkList(categoryFonts, locale)}</section>${faqHtml(locale === "fr" ? "Questions fréquentes" : locale === "en" ? "Frequently asked questions" : "أسئلة شائعة", faqs)}`,
    alternates: pageAlternates(`/fonts/${slug}`),
    jsonLd: [
      breadcrumbNode([[home, pathForLocale(locale, "/")], [heading, pathForLocale(locale, `/fonts/${slug}`)]]),
      {
        "@type": "CollectionPage",
        name: heading,
        description,
        url: `${SITE_ORIGIN}${pathForLocale(locale, `/fonts/${slug}`)}`,
        numberOfItems: categoryFonts.length,
      },
      ...(faqs.length ? [faqNode(faqs)] : []),
    ],
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
    bodyHtml: [
      `<p>${escapeHtml(bodyIntro)}</p>`,
      locale === "ar" && collection.callout ? `<p>${escapeHtml(collection.callout.text)} <a href="${escapeHtml(collection.callout.href)}">${escapeHtml(collection.callout.label)}</a></p>` : "",
      locale === "ar" && collection.guide ? `<section><h2>${escapeHtml(collection.guide.heading)}</h2><ol>${collection.guide.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>${collection.guide.note ? `<p>${escapeHtml(collection.guide.note)}</p>` : ""}</section>` : "",
      `<section><h2>${escapeHtml(locale === "fr" ? "Styles associés" : locale === "en" ? "Related styles" : "التصنيفات المرتبطة")}</h2><ul>${categoryLinks}</ul></section>`,
      `<section><h2>${escapeHtml(locale === "fr" ? "Fichiers de police de la collection" : locale === "en" ? "Font files in this collection" : "ملفات الخطوط في المجموعة")}</h2>${fontLinkList(collectionFonts, locale)}</section>`,
      locale === "ar" ? faqHtml("أسئلة شائعة", collection.faqs) : "",
    ].join(""),
    noindex: !availableTranslation,
    // Collections without English and French versions only list Arabic.
    alternates: localizedCollections.en[slug] || localizedCollections.fr[slug]
      ? pageAlternates(`/collection/${slug}`)
      : { ar: `${SITE_ORIGIN}/collection/${slug}`, "x-default": `${SITE_ORIGIN}/collection/${slug}` },
    jsonLd: locale === "ar" ? [
      breadcrumbNode([["الرئيسية", "/"], [collection.titleArabic, `/collection/${slug}`]]),
      faqNode(collection.faqs),
      ...(collection.guide ? [{
        "@type": "HowTo",
        name: collection.guide.heading,
        step: collection.guide.steps.map((text, index) => ({ "@type": "HowToStep", position: index + 1, text })),
      }] : []),
    ] : undefined,
  };
}

function resolveFont(locale: Locale, font: Font, fonts: Font[]): SeoPage {
  const categorySlug = englishCategories.find((item) => item.arabicCategory === font.category)?.slug;
  const category = categoryLabel(locale, categorySlug || font.category);
  // Duplicate copies share the primary's name, so qualify them by category.
  const qualifier = font.duplicateOf ? ` (${category})` : "";
  // English and French use the same title and description as the React page.
  const localizedMeta = locale === "ar" ? null : getLocalizedFontPageContent(font, locale);
  const title = locale === "ar"
    ? `تحميل خط ${font.nameArabic}${qualifier} مجاناً | xfontat`
    : localizedMeta!.title;
  const profile = font.duplicateOf ? undefined : getFontProfile(font.slug);
  const description = locale === "ar"
    ? arabicFontDescription(font)
    : (locale === "en" && !font.duplicateOf && profileDescription(font.slug, "en")) || localizedMeta!.description;
  const heading = locale === "ar"
    ? `تحميل خط ${font.nameArabic}`
    : locale === "fr"
      ? `Télécharger la police arabe ${font.name}`
      : `Download ${font.name} Arabic Font`;
  const t = (ar: string, en: string, fr: string) => (locale === "ar" ? ar : locale === "fr" ? fr : en);
  const localized = locale === "ar" ? null : getLocalizedFontPageContent(font, locale);
  const useCases = locale === "ar" ? categoryUseCases[font.category] || [] : localized!.useCases;

  // Answer-first: the opening sentence says what the font is and what it suits.
  const summary = locale === "ar"
    ? `${font.nameArabic} خط عربي من تصنيف ${font.category} بصيغة ${font.fileFormat}${font.designer ? ` من تصميم ${font.designer}` : ""}. ${categoryDescriptions[font.category] || ""}${useCases.length ? ` يناسب ${useCases.join("، ")}.` : ""}`
    : localized!.summary;
  const licenseAnswer = font.license
    ? t(`يُنشر خط ${font.nameArabic} بترخيص ${font.license}. اقرأ نص الترخيص قبل الاستخدام التجاري.`,
      `${font.name} is published under the ${font.license}. Read the license text before commercial use.`,
      `${font.name} est publiée sous licence ${font.license}. Lisez la licence avant tout usage commercial.`)
    : t(`لم يُتحقق من ترخيص خط ${font.nameArabic} بعد. راجع المصمم أو المصدر الأصلي قبل أي استخدام تجاري.`,
      `The license of ${font.name} has not been verified yet. Check with the designer or original source before commercial use.`,
      `La licence de ${font.name} n’a pas encore été vérifiée. Renseignez-vous auprès du créateur ou de la source avant tout usage commercial.`);
  const faqs = [
    {
      question: t(`ما هو خط ${font.nameArabic}؟`, `What is ${font.name}?`, `Qu’est-ce que ${font.name} ?`),
      answer: summary,
    },
    {
      question: t(`هل خط ${font.nameArabic} مجاني للاستخدام التجاري؟`, `Is ${font.name} free for commercial use?`, `${font.name} est-elle gratuite pour un usage commercial ?`),
      answer: licenseAnswer,
    },
    {
      question: t(`كيف أثبت خط ${font.nameArabic}؟`, `How do I install ${font.name}?`, `Comment installer ${font.name} ?`),
      answer: t(
        `حمّل ملف ${font.fileFormat}، ثم على ويندوز انقر عليه بزر الفأرة الأيمن واختر تثبيت، وعلى الماك انقر عليه مرتين واضغط Install في Font Book، ثم أعد فتح البرنامج.`,
        `Download the ${font.fileFormat} file. On Windows, right-click it and choose Install; on macOS, double-click it and click Install in Font Book. Then restart your design app.`,
        `Téléchargez le fichier ${font.fileFormat}. Sous Windows, faites un clic droit puis Installer ; sous macOS, double-cliquez puis Installer dans Livre des polices. Relancez ensuite votre logiciel.`,
      ),
    },
    ...(locale === "ar" ? [] : localized!.faqs),
  ];
  const details = [
    [t("التصنيف", "Category", "Catégorie"), category],
    [t("الصيغة", "Format", "Format"), font.fileFormat],
    [t("المصمم", "Designer", "Créateur"), font.designer],
    [t("الترخيص", "License", "Licence"), font.license || t("غير موثق", "Not verified", "Non vérifiée")],
  ].filter((item) => item[1]);
  const related = fonts
    .filter((item) => item.category === font.category && item.id !== font.id && !item.duplicateOf)
    .slice(0, 8);
  const primaryPath = getFontPath(locale, font.duplicateOf ? { ...font, slug: font.duplicateOf } : font);
  const sourceLink = font.sourceUrl
    ? `<p><a href="${escapeHtml(font.sourceUrl)}" rel="nofollow noopener noreferrer">${escapeHtml(t("عرض المصدر", "View source", "Consulter la source"))}</a></p>`
    : "";
  const categoryLink = categorySlug
    ? `<p><a href="${escapeHtml(getCategoryPath(locale, categorySlug))}">${escapeHtml(t("تصفح هذا التصنيف", "Browse this category", "Parcourir la catégorie"))}: ${escapeHtml(category)}</a></p>`
    : "";
  const toolLink = locale === "ar"
    ? `<p><a href="/arabic-text-to-image?font=${encodeURIComponent(font.duplicateOf || font.slug)}">اكتب اسمك بخط ${escapeHtml(font.nameArabic)} وحمّله صورة</a></p>`
    : "";
  const previewSlug = generateLegacyFontSlug(font.name, font.fileName, font.category);
  const previewFile = path.join(process.cwd(), "client/public/font-previews", `${previewSlug}.webp`);
  const imagePath = fs.existsSync(previewFile) ? `/font-previews/${previewSlug}.webp` : "/og-image.png";
  const pagePath = getFontPath(locale, font);
  const profileText = profile && locale !== "fr" ? profile[locale] : undefined;
  const bodyHtml = [
    profileText ? `<section><h2>${escapeHtml(locale === "ar" ? `عن خط ${font.nameArabic}` : `About ${font.name}`)}</h2>${profileText.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</section>` : "",
    `<p>${escapeHtml(summary)}</p>`,
    `<dl>${details.map(([label, value]) => `<dt>${escapeHtml(label!)}</dt><dd>${escapeHtml(value!)}</dd>`).join("")}</dl>`,
    useCases.length ? `<section><h2>${escapeHtml(t("استخدامات الخط", "Suggested uses", "Usages suggérés"))}</h2><ul>${useCases.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>` : "",
    `<p><a href="${escapeHtml(font.fileUrl)}" download="${escapeHtml(font.fileName)}">${escapeHtml(t("تحميل الملف", "Download file", "Télécharger le fichier"))}</a></p>`,
    toolLink,
    categoryLink,
    sourceLink,
    faqHtml(t("أسئلة شائعة", "Frequently asked questions", "Questions fréquentes"), faqs),
    related.length ? `<section><h2>${escapeHtml(t("خطوط مشابهة", "Similar fonts", "Polices similaires"))}</h2>${fontLinkList(related, locale)}</section>` : "",
  ].join("");
  return {
    locale,
    path: pagePath,
    title,
    description,
    heading,
    imagePath,
    bodyHtml,
    alternates: pageAlternates(`/font/${font.duplicateOf || font.slug}`),
    canonicalPath: font.duplicateOf ? primaryPath : undefined,
    jsonLd: [
      breadcrumbNode([
        [t("الرئيسية", "Home", "Accueil"), pathForLocale(locale, "/")],
        ...(categorySlug ? [[category, getCategoryPath(locale, categorySlug)] as [string, string]] : []),
        [locale === "ar" ? font.nameArabic : font.name, primaryPath],
      ]),
      {
        "@type": "CreativeWork",
        name: locale === "ar" ? font.nameArabic : font.name,
        alternateName: font.name,
        description: summary,
        url: `${SITE_ORIGIN}${primaryPath}`,
        image: `${SITE_ORIGIN}${imagePath}`,
        encodingFormat: font.fileFormat,
        genre: category,
        inLanguage: "ar",
        isAccessibleForFree: true,
        ...(font.designer ? { creator: { "@type": "Person", name: font.designer } } : {}),
        ...(font.license ? { license: font.license } : {}),
      },
      faqNode(faqs),
    ],
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
  author?: string;
  keywords?: string[];
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
    `<li><a href="${escapeHtml(blogPostPath(locale, post.slug))}">${escapeHtml(post.label)}</a><p>${escapeHtml(post.excerpt)}</p></li>`
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

function articleJsonLd(post: BlogPost, locale: Locale, headline: string, description: string, articlePath: string): object[] {
  const blogPath = pathForLocale(locale, "/blog");
  return [
    breadcrumbNode([
      [locale === "fr" ? "Accueil" : locale === "en" ? "Home" : "الرئيسية", pathForLocale(locale, "/")],
      [locale === "fr" ? "Blog" : locale === "en" ? "Blog" : "المدونة", blogPath],
      [headline, articlePath],
    ]),
    {
      "@type": "Article",
      headline,
      description,
      url: `${SITE_ORIGIN}${articlePath}`,
      mainEntityOfPage: `${SITE_ORIGIN}${articlePath}`,
      inLanguage: locale,
      ...(post.dateISO ? { datePublished: post.dateISO } : {}),
      ...(post.dateModified || post.dateISO ? { dateModified: post.dateModified || post.dateISO } : {}),
      author: { "@type": post.author && post.author !== "فريق xfontat" ? "Person" : "Organization", name: post.author || "xfontat" },
      publisher: { "@type": "Organization", name: "xfontat", logo: { "@type": "ImageObject", url: `${SITE_ORIGIN}/logo.png` } },
      ...(post.keywords?.length ? { keywords: post.keywords.join(", ") } : {}),
    },
  ];
}

function blogAlternates(slug: string): SeoPage["alternates"] {
  return {
    ar: `${SITE_ORIGIN}/blog/${slug}`,
    en: `${SITE_ORIGIN}${blogPostPath("en", slug)}`,
    fr: `${SITE_ORIGIN}${blogPostPath("fr", slug)}`,
    "x-default": `${SITE_ORIGIN}/blog/${slug}`,
  };
}

function resolveBlogArticle(locale: Locale, requestedSlug: string, posts: BlogPost[]): SeoPage | null {
  const slug = locale === "ar" ? requestedSlug : originalBlogSlug(locale, requestedSlug);
  const post = posts.find((item) => item.slug === slug);
  if (post && locale !== "ar" && requestedSlug !== localizedBlogSlug(locale, slug)) {
    throw Object.assign(new Error("Blog slug alias"), { status: 301, location: blogPostPath(locale, slug) });
  }
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
      alternates: blogAlternates(slug),
      jsonLd: articleJsonLd(post, "ar", title, description, `/blog/${slug}`),
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
      path: blogPostPath(locale, slug),
      title,
      description,
      heading: title,
      noindex: true,
      bodyHtml: `<p>${escapeHtml(description)}</p><p><a href="/blog/${slug}">${escapeHtml(locale === "fr" ? "Lire l’article en arabe" : "Read the Arabic article")}</a></p>`,
      alternates: blogAlternates(slug),
    };
  }
  return {
    locale,
    path: blogPostPath(locale, slug),
    title: `${blogSeo(locale, slug, translation.title, "").title} | xfontat`,
    description: blogSeo(locale, slug, translation.title, translation.excerpt || translation.title).description,
    heading: translation.title,
    bodyHtml: `${renderMarkdownLite(translation.content)}<p><a href="${escapeHtml(pathForLocale(locale, "/blog"))}">${escapeHtml(locale === "fr" ? "Tous les articles" : "All articles")}</a></p>`,
    alternates: blogAlternates(slug),
    jsonLd: articleJsonLd(post, locale, translation.title, translation.excerpt || translation.title, blogPostPath(locale, slug)),
  };
}

function resolveToolPage(tool: ToolPageCopy): SeoPage {
  const url = `${SITE_ORIGIN}${tool.path}`;
  const sections = tool.sections
    .map((section) => `<section><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.body)}</p></section>`)
    .join("");
  const faqs = tool.faqs
    .map((faq) => `<h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p>`)
    .join("");
  const related = [zakhrafaPage, textToImagePage]
    .filter((item) => item !== tool)
    .map((item) => `<li><a href="${escapeHtml(item.path)}">${escapeHtml(item.heading)}</a></li>`)
    .join("") + `<li><a href="${toolPaths.keyboard.ar}">${escapeHtml(keyboardCopy.ar.heading)}</a></li>`;
  return {
    locale: "ar",
    path: tool.path,
    title: tool.title,
    description: tool.description,
    heading: tool.heading,
    bodyHtml: `<p>${escapeHtml(tool.intro)}</p>${sections}<section><h2>أسئلة شائعة</h2>${faqs}</section><ul>${related}<li><a href="/">مكتبة الخطوط العربية</a></li></ul>`
      ,
    alternates: intlAlternates(tool === textToImagePage ? toolPaths.generator : toolPaths.zakhrafa),
    jsonLd: [
      breadcrumbNode([["الرئيسية", "/"], [tool.heading, tool.path]]),
      {
        "@type": "WebApplication",
        name: tool.heading,
        url,
        description: tool.description,
        applicationCategory: "DesignApplication",
        operatingSystem: "Web",
        inLanguage: "ar",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      toolFaqSchema(tool),
    ],
  };
}

// Greeting card hub and occasion pages, in Arabic, English and French.
function cardAlternates(slug?: string): SeoPage["alternates"] {
  const path = (locale: CardLocale) => (slug ? cardOccasionPath(locale, slug) : CARD_PATHS[locale]);
  return { ar: `${SITE_ORIGIN}${path("ar")}`, en: `${SITE_ORIGIN}${path("en")}`, fr: `${SITE_ORIGIN}${path("fr")}`, "x-default": `${SITE_ORIGIN}${path("ar")}` };
}

function resolveCardsPage(locale: CardLocale, slug?: string): SeoPage | null {
  const hub = cardsHubCopy[locale];
  const faqHeading = locale === "ar" ? "أسئلة شائعة" : locale === "fr" ? "Questions fréquentes" : "Frequently asked questions";
  const cardsFor = (name: string) => (locale === "ar" ? `بطاقات تهنئة ${name}` : locale === "fr" ? `Cartes ${name}` : `${name} cards`);
  const occasionLinks = (current?: string) => `<ul>${OCCASIONS.filter((item) => item.slug !== current).map((item) => `<li><a href="${cardOccasionPath(locale, item.slug)}">${escapeHtml(cardsFor(localizeOccasion(item, locale).name))}</a></li>`).join("")}</ul>`;
  if (!slug) {
    const url = `${SITE_ORIGIN}${CARD_PATHS[locale]}`;
    return {
      locale,
      path: CARD_PATHS[locale],
      title: hub.title,
      description: hub.description,
      heading: hub.heading,
      bodyHtml: `<p>${escapeHtml(hub.intro)}</p><section><h2>${locale === "ar" ? "المناسبات" : locale === "fr" ? "Occasions" : "Occasions"}</h2>${occasionLinks()}</section>${faqHtml(faqHeading, hub.faqs)}`,
      alternates: cardAlternates(),
      jsonLd: [
        breadcrumbNode([homeCrumb(locale), [hub.heading, CARD_PATHS[locale]]]),
        { "@type": "CollectionPage", name: hub.heading, description: hub.description, url, inLanguage: locale },
        faqNode(hub.faqs),
      ],
    };
  }
  const base = getOccasion(slug);
  if (!base) return null;
  const occasion = localizeOccasion(base, locale);
  const path = cardOccasionPath(locale, occasion.slug);
  const url = `${SITE_ORIGIN}${path}`;
  const sizes = locale === "ar"
    ? `القوالب المتاحة: ${occasion.templates.map((template) => template.label).join("، ")}. المقاسات: مربع 1080×1080 وستوري 1080×1920. الخطوط منشورة بترخيص SIL Open Font License.`
    : locale === "fr"
      ? "Formats : carré 1080×1080 et story 1080×1920. Les polices sont publiées sous licence SIL Open Font License."
      : "Sizes: square 1080×1080 and story 1080×1920. The fonts are published under the SIL Open Font License.";
  const greetingsHeading = locale === "ar" ? `عبارات تهنئة ${occasion.name}` : locale === "fr" ? `Vœux en arabe : ${occasion.name}` : `${occasion.name} greetings in Arabic`;
  const otherHeading = locale === "ar" ? "بطاقات لمناسبات أخرى" : locale === "fr" ? "Cartes pour d'autres occasions" : "Cards for other occasions";
  return {
    locale,
    path,
    title: occasion.title,
    description: occasion.description,
    heading: occasion.heading,
    bodyHtml: [
      `<p>${escapeHtml(occasion.intro)}</p>`,
      `<p>${escapeHtml(sizes)}</p>`,
      `<section><h2>${escapeHtml(greetingsHeading)}</h2><ul>${occasion.greetings.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>`,
      faqHtml(faqHeading, occasion.faqs),
      `<section><h2>${escapeHtml(otherHeading)}</h2>${occasionLinks(occasion.slug)}</section>`,
    ].join(""),
    alternates: cardAlternates(occasion.slug),
    jsonLd: [
      breadcrumbNode([homeCrumb(locale), [hub.heading, CARD_PATHS[locale]], [occasion.heading, path]]),
      { "@type": "WebApplication", name: occasion.heading, description: occasion.description, url, applicationCategory: "DesignApplication", operatingSystem: "Web", inLanguage: locale, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
      faqNode(occasion.faqs),
    ],
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
  const card = locale === "ar" ? parseCardPath(pagePath) : undefined;
  if (card) return resolveCardsPage("ar", card.slug);
  const tool = [zakhrafaPage, textToImagePage].find((item) => item.path === pagePath);
  // English and French versions of these tools live at their own paths.
  if (tool) return locale === "ar" ? resolveToolPage(tool) : null;
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

// Tools and guides with their own path in each language (see intlTools.ts).
function intlAlternates(paths: Partial<Record<IntlLocale, string>>): SeoPage["alternates"] {
  const alternates: SeoPage["alternates"] = {};
  for (const [lang, toolPath] of Object.entries(paths) as Array<[IntlLocale, string]>) alternates[lang] = `${SITE_ORIGIN}${toolPath}`;
  alternates["x-default"] = `${SITE_ORIGIN}${paths.ar || paths.en}`;
  return alternates;
}

function sectionsHtml(sections: Array<{ heading: string; body: string }>): string {
  return sections.map((section) => `<section><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.body)}</p></section>`).join("");
}

function linkListHtml(links: Array<[string, string]>): string {
  return `<ul>${links.map(([href, label]) => `<li><a href="${escapeHtml(href)}">${escapeHtml(label)}</a></li>`).join("")}</ul>`;
}

function intlToolLinks(locale: "en" | "fr"): Array<[string, string]> {
  return locale === "fr"
    ? [[toolPaths.keyboard.fr!, "Clavier arabe en ligne"], [toolPaths.names.fr!, "Prénoms en arabe"], [toolPaths.generator.fr!, "Générateur de police arabe"], [toolPaths.zakhrafa.fr!, "Écriture arabe stylée"], [CARD_PATHS.fr, "Cartes de vœux arabes"], [toolPaths.tattoo.fr!, "Polices arabes pour tatouage"], [toolPaths.phrases.fr!, "Mots et expressions arabes"], ["/fr", "Bibliothèque de polices arabes"]]
    : [[toolPaths.keyboard.en!, "Online Arabic keyboard"], [toolPaths.names.en!, "Names in Arabic"], [toolPaths.generator.en!, "Arabic font generator"], [toolPaths.zakhrafa.en!, "Arabic fancy text"], [CARD_PATHS.en, "Arabic greeting cards"], [toolPaths.tattoo.en!, "Arabic tattoo fonts"], [toolPaths.phrases.en!, "Arabic words and phrases"], ["/en", "Arabic font library"]];
}

function webAppNode(name: string, description: string, url: string, locale: IntlLocale): object {
  return { "@type": "WebApplication", name, description, url, applicationCategory: "DesignApplication", operatingSystem: "Web", inLanguage: locale, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } };
}

function homeCrumb(locale: IntlLocale): [string, string] {
  return locale === "ar" ? ["الرئيسية", "/"] : locale === "fr" ? ["Accueil", "/fr"] : ["Home", "/en"];
}

function resolveIntlToolPage(id: "keyboard" | "generator" | "zakhrafa" | "tattoo", locale: IntlLocale): SeoPage | null {
  const copy = id === "keyboard" ? keyboardCopy[locale]
    : locale === "ar" ? null
    : id === "generator" ? generatorCopy[locale] : id === "zakhrafa" ? zakhrafaCopy[locale] : tattooCopy[locale];
  if (!copy) return null;
  const faqHeading = locale === "ar" ? "أسئلة شائعة" : locale === "fr" ? "Questions fréquentes" : "Frequently asked questions";
  const related = locale === "ar"
    ? linkListHtml([[textToImagePage.path, textToImagePage.heading], [zakhrafaPage.path, zakhrafaPage.heading], ["/", "مكتبة الخطوط العربية"]])
    : linkListHtml(intlToolLinks(locale).filter(([href]) => href !== copy.path));
  const extra = id === "tattoo" && locale !== "ar"
    ? `<section><h2>${locale === "fr" ? "Mots arabes populaires en tatouage" : "Popular Arabic tattoo words"}</h2>${linkListHtml(arabicPhrases.filter((phrase) => phrase.kind === "word").map((phrase) => [phrasePath(locale, phrase.slug), `${phraseLabel(phrase, locale)} — ${phrase.arabic}`]))}</section>`
    : "";
  return {
    locale,
    path: copy.path,
    title: copy.title,
    description: copy.description,
    heading: copy.heading,
    bodyHtml: `<p>${escapeHtml(copy.intro)}</p>${sectionsHtml(copy.sections)}${extra}${faqHtml(faqHeading, copy.faqs)}${related}`,
    alternates: intlAlternates(toolPaths[id]),
    jsonLd: [
      breadcrumbNode([homeCrumb(locale), [copy.heading, copy.path]]),
      webAppNode(copy.heading, copy.description, `${SITE_ORIGIN}${copy.path}`, locale),
      toolFaqSchema(copy),
    ],
  };
}

function detailHtml(locale: "en" | "fr", content: DetailContent, arabic: string, word: string, showLetters: boolean): string {
  const facts = `<dl>${content.facts.map(([label, value]) => `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd>`).join("")}</dl>`;
  const letters = showLetters ? spellArabic(arabic, locale) : [];
  const lettersHtml = letters.length
    ? `<section><h2>${escapeHtml(locale === "fr" ? `Écrire ${word} en arabe, lettre par lettre` : `How to write ${word} in Arabic, letter by letter`)}</h2><ol>${letters.map((letter) => `<li><span lang="ar">${escapeHtml(letter.char)}</span> ${escapeHtml(letter.name)}: ${escapeHtml(letter.sound)}</li>`).join("")}</ol></section>`
    : "";
  const calligraphy = `<section><h2>${escapeHtml(locale === "fr" ? `${word} en calligraphie arabe` : `${word} in Arabic calligraphy`)}</h2><p>${escapeHtml(locale === "fr"
    ? `${word} (${arabic}) en thuluth, nastaliq, coufique, naskh et polices décoratives, à télécharger en PNG transparent.`
    : `${word} (${arabic}) in Thuluth, Nastaliq, Kufi, Naskh and display fonts, each downloadable as a transparent PNG.`)}</p></section>`;
  const faqHeading = locale === "fr" ? "Questions fréquentes" : "Frequently asked questions";
  return `<p>${escapeHtml(content.intro)}</p><p lang="ar" dir="rtl">${escapeHtml(arabic)}</p>${facts}${lettersHtml}${calligraphy}${sectionsHtml(content.sections)}${faqHtml(faqHeading, content.faqs)}`;
}

function resolveNamesPage(locale: "en" | "fr", slug?: string): SeoPage | null {
  const hub = namesHubCopy[locale];
  if (!slug) {
    const list = (gender: "f" | "m") => linkListHtml(arabicNames.filter((name) => name.gender === gender).sort((a, b) => a.latin.localeCompare(b.latin)).map((name) => [namePath(locale, name.slug), `${name.latin} — ${name.arabic}`]));
    const faqHeading = locale === "fr" ? "Questions fréquentes" : "Frequently asked questions";
    return {
      locale,
      path: hub.path,
      title: hub.title,
      description: hub.description,
      heading: hub.heading,
      bodyHtml: `<p>${escapeHtml(hub.intro)}</p><section><h2>${locale === "fr" ? "Prénoms féminins" : "Girls' names"}</h2>${list("f")}</section><section><h2>${locale === "fr" ? "Prénoms masculins" : "Boys' names"}</h2>${list("m")}</section>${sectionsHtml(hub.sections)}${faqHtml(faqHeading, hub.faqs)}${linkListHtml(intlToolLinks(locale))}`,
      alternates: intlAlternates(toolPaths.names),
      jsonLd: [
        breadcrumbNode([homeCrumb(locale), [hub.heading, hub.path]]),
        { "@type": "CollectionPage", name: hub.heading, description: hub.description, url: `${SITE_ORIGIN}${hub.path}`, inLanguage: locale },
        faqNode(hub.faqs),
      ],
    };
  }
  const name = getArabicName(slug);
  if (!name) return null;
  const content = nameContent(name, locale);
  const pagePath = namePath(locale, name.slug);
  const related = `<section><h2>${locale === "fr" ? "Prénoms proches" : "Related names"}</h2>${linkListHtml(relatedNames(name).map((item) => [namePath(locale, item.slug), `${item.latin} — ${item.arabic}`]))}</section>`;
  return {
    locale,
    path: pagePath,
    title: content.title,
    description: content.description,
    heading: content.heading,
    bodyHtml: `${detailHtml(locale, content, name.arabic, name.latin, true)}${related}${linkListHtml(intlToolLinks(locale))}`,
    alternates: intlAlternates({ en: namePath("en", name.slug), fr: namePath("fr", name.slug) }),
    jsonLd: [
      breadcrumbNode([homeCrumb(locale), [hub.heading, NAME_PATHS[locale]], [content.heading, pagePath]]),
      { "@type": "WebPage", name: content.heading, description: content.description, url: `${SITE_ORIGIN}${pagePath}`, inLanguage: locale },
      faqNode(content.faqs),
    ],
  };
}

function resolvePhrasesPage(locale: "en" | "fr", slug?: string): SeoPage | null {
  const hub = phrasesHubCopy[locale];
  const faqHeading = locale === "fr" ? "Questions fréquentes" : "Frequently asked questions";
  if (!slug) {
    return {
      locale,
      path: hub.path,
      title: hub.title,
      description: hub.description,
      heading: hub.heading,
      bodyHtml: `<p>${escapeHtml(hub.intro)}</p>${linkListHtml(arabicPhrases.map((phrase) => [phrasePath(locale, phrase.slug), `${phraseLabel(phrase, locale)} — ${phrase.arabic}: ${phrase[locale].meaning}`]))}${sectionsHtml(hub.sections)}${faqHtml(faqHeading, hub.faqs)}${linkListHtml(intlToolLinks(locale))}`,
      alternates: intlAlternates(toolPaths.phrases),
      jsonLd: [
        breadcrumbNode([homeCrumb(locale), [hub.heading, hub.path]]),
        { "@type": "CollectionPage", name: hub.heading, description: hub.description, url: `${SITE_ORIGIN}${hub.path}`, inLanguage: locale },
        faqNode(hub.faqs),
      ],
    };
  }
  const phrase = getArabicPhrase(slug);
  if (!phrase) return null;
  const content = phraseContent(phrase, locale);
  const pagePath = phrasePath(locale, phrase.slug);
  const label = phraseLabel(phrase, locale);
  const others = `<section><h2>${locale === "fr" ? "Autres mots et expressions arabes" : "More Arabic words and phrases"}</h2>${linkListHtml(arabicPhrases.filter((item) => item.slug !== phrase.slug).slice(0, 12).map((item) => [phrasePath(locale, item.slug), phraseLabel(item, locale)]))}</section>`;
  return {
    locale,
    path: pagePath,
    title: content.title,
    description: content.description,
    heading: content.heading,
    bodyHtml: `${detailHtml(locale, content, phrase.arabic, label, !phrase.arabic.includes(" "))}${others}${linkListHtml(intlToolLinks(locale))}`,
    alternates: intlAlternates({ en: phrasePath("en", phrase.slug), fr: phrasePath("fr", phrase.slug) }),
    jsonLd: [
      breadcrumbNode([homeCrumb(locale), [hub.heading, PHRASE_PATHS[locale]], [content.heading, pagePath]]),
      { "@type": "WebPage", name: content.heading, description: content.description, url: `${SITE_ORIGIN}${pagePath}`, inLanguage: locale },
      faqNode(content.faqs),
    ],
  };
}

function resolveIntlPage(pathname: string): SeoPage | null | undefined {
  const tool = findIntlTool(pathname);
  if (tool && (tool.id === "keyboard" || tool.id === "tattoo" || ((tool.id === "generator" || tool.id === "zakhrafa") && tool.locale !== "ar"))) {
    return resolveIntlToolPage(tool.id, tool.locale);
  }
  const card = parseCardPath(pathname);
  if (card && card.locale !== "ar") return resolveCardsPage(card.locale, card.slug);
  for (const locale of ["en", "fr"] as const) {
    if (pathname === NAME_PATHS[locale]) return resolveNamesPage(locale);
    if (pathname.startsWith(`${NAME_PATHS[locale]}/`)) return resolveNamesPage(locale, decodeURIComponent(pathname.slice(NAME_PATHS[locale].length + 1)));
    if (pathname === PHRASE_PATHS[locale]) return resolvePhrasesPage(locale);
    if (pathname.startsWith(`${PHRASE_PATHS[locale]}/`)) return resolvePhrasesPage(locale, decodeURIComponent(pathname.slice(PHRASE_PATHS[locale].length + 1)));
  }
  return undefined;
}

// Style page for a removed font, guessed from words in its old slug.
const REMOVED_FONT_STYLES: Array<[RegExp, string]> = [
  [/diwan|diwany/, "diwani"],
  [/thuluth|thulth|suls/, "thuluth"],
  [/roqa|ruqaa|ruqa|rikaa|rika/, "ruqaa"],
  [/naskh/, "naskh"],
  [/kufi|kufic/, "kufi"],
  [/nastaliq|nastaligh/, "nastaliq"],
  [/hand|free/, "graffiti"],
];

function removedFontTarget(locale: Locale, slug: string): string {
  const style = REMOVED_FONT_STYLES.find(([pattern]) => pattern.test(slug))?.[1];
  return style ? getCategoryPath(locale, style) : pathForLocale(locale, "/");
}

async function resolvePage(pathname: string): Promise<SeoPage | null> {
  const intlPage = resolveIntlPage(normalizePath(pathname));
  if (intlPage !== undefined) return intlPage;
  const { locale, pagePath } = getLocaleAndPath(pathname);
  const fonts = await storage.getAllFonts();
  const posts = getAllBlogPosts();

  if (pagePath === "/") return resolveHome(locale, fonts);

  const fontMatch = /^\/font\/([^/]+)$/.exec(pagePath);
  if (fontMatch) {
    const requestedSlug = decodeURIComponent(fontMatch[1]);
    const font = await storage.getFontBySlug(requestedSlug);
    // Fonts removed from the library keep their search traffic by sending
    // visitors to the closest style page instead of a 404.
    if (!font) throw Object.assign(new Error("Removed font"), { status: 301, location: removedFontTarget(locale, requestedSlug) });
    if (requestedSlug !== font.slug) {
      throw Object.assign(new Error("Font slug alias"), {
        status: 301,
        location: getFontPath(locale, font),
      });
    }
    return resolveFont(locale, font, fonts);
  }

  const categoryMatch = /^\/fonts\/([^/]+)$/.exec(pagePath);
  if (categoryMatch) return resolveCategory(locale, decodeURIComponent(categoryMatch[1]), fonts);

  const collectionMatch = /^\/collection\/([^/]+)$/.exec(pagePath);
  if (collectionMatch) return resolveCollection(locale, decodeURIComponent(collectionMatch[1]), fonts);

  if (pagePath === "/blog") return resolveBlogIndex(locale, posts);
  const blogMatch = /^\/blog\/([^/]+)$/.exec(pagePath);
  if (blogMatch) {
    const article = resolveBlogArticle(locale, decodeURIComponent(blogMatch[1]), posts);
    // Old auto-generated articles ("gen-…") were removed; send them to the blog.
    if (!article && blogMatch[1].startsWith("gen-")) {
      throw Object.assign(new Error("Removed article"), { status: 301, location: pathForLocale(locale, "/blog") });
    }
    return article;
  }

  // Category URLs from the first version of the site: /category/نسخ.
  const legacyCategory = /^\/category\/([^/]+)$/.exec(pagePath);
  if (legacyCategory) {
    const category = englishCategories.find((item) => item.arabicCategory === decodeURIComponent(legacyCategory[1]));
    if (category) throw Object.assign(new Error("Legacy category"), { status: 301, location: getCategoryPath(locale, category.slug) });
  }

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
  const canonical = `${SITE_ORIGIN}${page.canonicalPath || page.path}`;
  const image = `${SITE_ORIGIN}${page.imagePath || "/og-image.png"}`;
  const localeTag = page.locale === "ar" ? "ar_AR" : page.locale === "fr" ? "fr_FR" : "en_US";
  let html = await loadIndexTemplate();

  page = { ...page, title: fitTitle(page.title) };
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
  if (page.jsonLd?.length) {
    // data-schema="page" lets SEOHead replace it once React renders.
    const graph = JSON.stringify({ "@context": "https://schema.org", "@graph": page.jsonLd }).replace(/</g, "\\u003c");
    html = html.replace("</head>", `<script type="application/ld+json" data-schema="page">${graph}</script></head>`);
  }
  if (page.bootData) {
    const data = JSON.stringify(page.bootData).replace(/</g, "\\u003c");
    html = html.replace("</head>", `<script id="boot-data" type="application/json">${data}</script></head>`);
  }
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
    if (font.duplicateOf) continue;
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
      add(blogPostPath("en", post.slug), lastmod);
    }
    if (fullBlogTranslations[post.slug]?.fr?.content?.trim()) {
      add(blogPostPath("fr", post.slug), lastmod);
    }
  }

  for (const tool of [zakhrafaPage, textToImagePage]) {
    add(tool.path, sourceLastmod("client/src/lib/toolPages.ts"));
  }
  const intlLastmod = sourceLastmod("client/src/lib/intlTools.ts");
  for (const paths of Object.values(toolPaths)) {
    for (const toolPath of Object.values(paths)) {
      if (toolPath !== textToImagePage.path) add(toolPath, intlLastmod);
    }
  }
  const namesLastmod = sourceLastmod("client/src/lib/arabicNames.ts", "client/src/lib/intlContent.ts");
  for (const name of arabicNames) {
    add(namePath("en", name.slug), namesLastmod);
    add(namePath("fr", name.slug), namesLastmod);
  }
  const phrasesLastmod = sourceLastmod("client/src/lib/arabicPhrases.ts", "client/src/lib/intlContent.ts");
  for (const phrase of arabicPhrases) {
    add(phrasePath("en", phrase.slug), phrasesLastmod);
    add(phrasePath("fr", phrase.slug), phrasesLastmod);
  }
  const cardsLastmod = sourceLastmod("client/src/lib/greetingCards.ts", "client/src/lib/greetingCardsIntl.ts");
  for (const locale of ["ar", "en", "fr"] as const) {
    add(CARD_PATHS[locale], cardsLastmod);
    for (const occasion of OCCASIONS) add(cardOccasionPath(locale, occasion.slug), cardsLastmod);
  }
  const thumbnailLastmod = sourceLastmod("client/src/pages/YouTubeThumbnailStudio.tsx");
  add("/youtube-thumbnail-maker", thumbnailLastmod);
  add("/en/youtube-thumbnail-maker", thumbnailLastmod);
  add("/fr/youtube-thumbnail-maker", thumbnailLastmod);

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

// Plain-text site guide for AI assistants (llmstxt.org).
async function renderLlmsTxt(res: Response): Promise<void> {
  const fonts = (await storage.getAllFonts()).filter((font) => !font.duplicateOf);
  const categories = englishCategories
    .map((category) => ({ category, count: fonts.filter((font) => font.category === category.arabicCategory).length }))
    .filter(({ count }) => count > 0)
    .map(({ category, count }) => `- [${category.name} (${category.arabicCategory})](${SITE_ORIGIN}/fonts/${category.slug}): ${count} fonts. ${categoryDescriptions[category.arabicCategory] || ""}`);
  const guides = staticBlogPosts.map((post) => `- [${post.title}](${SITE_ORIGIN}/blog/${post.slug}): ${post.excerpt}`);
  const tools = [zakhrafaPage, textToImagePage].map((tool) => `- [${tool.heading}](${SITE_ORIGIN}${tool.path}): ${tool.description}`);
  const body = [
    "# xfontat",
    "",
    `> xfontat (إكس فونتات) is a free library of ${fonts.length} Arabic font files for browsing, live text preview and download, organised by calligraphic style. The interface is in Arabic, with English and French versions at /en and /fr.`,
    "",
    "Each font page lists the file format, category, designer and license when known. Many files have no verified license, so the site tells users to check the original source before commercial use.",
    "",
    "## Font categories",
    ...categories,
    "",
    "## Free tools",
    ...tools,
    `- [منشئ صور يوتيوب المصغرة](${SITE_ORIGIN}/youtube-thumbnail-maker): AI YouTube thumbnail maker with Arabic titles.`,
    `- [${cardsHubCopy.ar.heading}](${SITE_ORIGIN}${CARD_PATHS.ar}): ${cardsHubCopy.ar.description}`,
    `- [${cardsHubCopy.en.heading}](${SITE_ORIGIN}${CARD_PATHS.en}): ${cardsHubCopy.en.description}`,
    `- [${zakhrafaCopy.en.heading}](${SITE_ORIGIN}${zakhrafaCopy.en.path}): ${zakhrafaCopy.en.description}`,
    `- [${keyboardCopy.ar.heading}](${SITE_ORIGIN}${keyboardCopy.ar.path}): ${keyboardCopy.ar.description}`,
    `- [${keyboardCopy.en.heading}](${SITE_ORIGIN}${keyboardCopy.en.path}): ${keyboardCopy.en.description}`,
    `- [${generatorCopy.en.heading}](${SITE_ORIGIN}${generatorCopy.en.path}): ${generatorCopy.en.description}`,
    `- [${tattooCopy.en.heading}](${SITE_ORIGIN}${tattooCopy.en.path}): ${tattooCopy.en.description}`,
    `- [${namesHubCopy.en.heading}](${SITE_ORIGIN}${namesHubCopy.en.path}): ${namesHubCopy.en.description}`,
    `- [${phrasesHubCopy.en.heading}](${SITE_ORIGIN}${phrasesHubCopy.en.path}): ${phrasesHubCopy.en.description}`,
    ...OCCASIONS.map((occasion) => `  - [${occasion.heading}](${SITE_ORIGIN}${cardOccasionPath("ar", occasion.slug)})`),
    "",
    "## Guides",
    ...guides,
    "",
    "## Optional",
    `- [English directory](${SITE_ORIGIN}/en)`,
    `- [Version française](${SITE_ORIGIN}/fr)`,
    `- [Sitemap](${SITE_ORIGIN}/sitemap.xml)`,
    `- [About](${SITE_ORIGIN}/about)`,
    "",
  ].join("\n");
  res.type("text/plain; charset=utf-8").send(body);
}

export function registerSeoHtmlRoute(app: Express): void {
  app.get("/llms.txt", async (_req: Request, res: Response) => {
    try {
      await renderLlmsTxt(res);
    } catch (error) {
      console.error("llms.txt generation failed:", error);
      res.status(500).type("text").send("Unable to generate llms.txt.");
    }
  });

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
      // An Arabic page path under /en or /fr (e.g. /en/keyboard) goes to that
      // page's English or French version, or to the language home page.
      const localized = pathname.match(/^\/(en|fr)(\/.+)$/);
      if (localized) {
        const target = localeSwitchPath(localized[1] as "en" | "fr", localized[2]);
        if (target !== pathname && (await resolvePage(target))) return res.redirect(301, target);
      }
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
