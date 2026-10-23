import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { getCollectionBySlug } from "@/lib/collectionsData";
import { localizedCollections, localizedStaticPages } from "@/lib/localizedPagesContent";
import { englishCategories, englishHome, frenchCategories, frenchHome } from "@/lib/internationalContent";
import { blogPosts } from "@/lib/blogData";
import { fullBlogTranslations, localizedBlogPosts } from "@/lib/blogTranslations";
import { renderMarkdownToHtml } from "@shared/markdown";
import { generateFontFamily, loadFont } from "@/lib/fontLoader";
import { generateSlug } from "@/lib/slugify";
import { detectFontFamily, groupFontsByFamily } from "@/lib/fontFamily";
import { LocalizedFontRow } from "@/components/LocalizedFontRow";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  fontCharacterMap,
  getLocalizedFontWeightLabel,
  getLocalizedFontPageContent,
  localizedFontDetailCopy,
  type LocalizedFontDetailCopy,
} from "@/lib/localizedFontDetails";
import type { Font } from "@shared/schema";

function routeLanguagePath(path: string, locale: "en" | "fr") {
  return `/${locale}${path === "/" ? "" : path}`;
}

const categoryArticleKeywords: Record<string, string[]> = {
  "ثلث": ["ثلث", "خطوط عربية", "تصميم", "شعارات"],
  "ديواني": ["ديواني", "مزخرفة", "خطوط عربية"],
  "رقعة": ["رقعة", "خطوط عربية", "سوشال"],
  "كوفي": ["كوفي", "شعارات", "لوجو", "تصميم"],
  "نسخ": ["نسخ", "خطوط عربية", "فوتوشوب"],
  "تصميم": ["تصميم", "شعارات", "فوتوشوب", "سوشال"],
  "خطوط الحرة": ["غرافيتي", "خطوط حرة", "تصميم", "شعارات"],
  "فوتوشوب": ["فوتوشوب", "تصميم", "سوشال"],
  "نستعليق": ["نستعليق", "فارسي", "خطوط عربية"],
};

function LocalizedHeader({
  locale,
  path,
  searchQuery,
  onSearchChange,
  previewText,
  onPreviewTextChange,
  previewSize,
  onPreviewSizeChange,
  onSearchSubmit,
}: {
  locale: "en" | "fr";
  path: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  previewText: string;
  onPreviewTextChange: (value: string) => void;
  previewSize: number;
  onPreviewSizeChange: (value: number) => void;
  onSearchSubmit: () => void;
}) {
  const arabicPath = path;
  const categories = locale === "fr" ? frenchCategories : englishCategories;
  const designCategory = categories.find((item) => item.arabicCategory === "تصميم");
  const homeCopy = locale === "fr" ? frenchHome : englishHome;
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto px-3 py-3 md:px-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href={`/${locale}`} className="flex shrink-0 items-center hover:opacity-80" aria-label={`xfontat ${locale} home`}>
            <img src="/logo.png" alt="xfontat" className="h-8 w-auto md:h-10" />
          </Link>
          <nav className="hidden flex-wrap items-center gap-3 text-sm lg:flex" aria-label={homeCopy.mainNavigation}>
            <Link href={`/${locale}`}>{homeCopy.home}</Link>
            {categories.slice(0, 5).map((category) => (
              <Link key={category.slug} href={`/${locale}/fonts/${category.slug}`}>{category.name}</Link>
            ))}
            <Link href={`/${locale}/fonts/${designCategory?.slug || "tasmeem"}`}>{homeCopy.designFonts}</Link>
            <Link href={`/${locale}/blog`}>{homeCopy.blog}</Link>
          </nav>
          <div className="flex items-center gap-2 text-sm">
            <Link href={routeLanguagePath(path, "en")} hrefLang="en" className="rounded-md border px-2 py-2">EN</Link>
            <Link href={routeLanguagePath(path, "fr")} hrefLang="fr" className="rounded-md border px-2 py-2">FR</Link>
            <Link href={arabicPath} hrefLang="ar" className="rounded-md border px-2 py-2">العربية</Link>
            <ThemeToggle label={locale === "fr" ? "Changer le thème" : "Toggle theme"} />
          </div>
        </div>
        <form
          className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(180px,1fr)_minmax(180px,1fr)_240px_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            onSearchSubmit();
          }}
        >
          <label className="grid gap-1 text-xs font-medium">
            {homeCopy.searchLabel}
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={homeCopy.searchPlaceholder}
              className="h-10 rounded-md border bg-background px-3 text-base font-normal"
            />
          </label>
          <label className="grid gap-1 text-xs font-medium">
            {homeCopy.previewLabel}
            <input
              value={previewText}
              onChange={(event) => onPreviewTextChange(event.target.value)}
              placeholder={homeCopy.previewPlaceholder}
              dir="auto"
              className="h-10 rounded-md border bg-background px-3 text-base font-normal"
            />
          </label>
          <label className="grid gap-1 text-xs font-medium">
            <span className="flex items-center justify-between gap-3">
              <span>{homeCopy.previewSizeLabel}</span>
              <span className="text-xs text-muted-foreground">{previewSize}px</span>
            </span>
            <input
              type="range"
              min={16}
              max={72}
              step={2}
              value={previewSize}
              onChange={(event) => onPreviewSizeChange(Number(event.target.value))}
              aria-label={`${homeCopy.previewSizeLabel}: ${previewSize}px`}
              className="h-10 w-full accent-primary"
            />
          </label>
          <button type="submit" className="h-10 self-end rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
            {locale === "fr" ? "Rechercher" : "Search"}
          </button>
        </form>
      </div>
    </header>
  );
}

function LocalizedFooter({ locale }: { locale: "en" | "fr" }) {
  const label = locale === "fr";
  return (
    <footer className="mt-12 border-t">
      <div className="container mx-auto flex flex-wrap gap-x-5 gap-y-3 px-4 py-6 text-sm text-muted-foreground">
        <Link href={`/${locale}/about`}>{label ? "À propos" : "About"}</Link>
        <Link href={`/${locale}/contact`}>{label ? "Contact" : "Contact"}</Link>
        <Link href={`/${locale}/privacy`}>{label ? "Confidentialité" : "Privacy"}</Link>
        <Link href={`/${locale}/terms`}>{label ? "Conditions" : "Terms"}</Link>
        <span>© {new Date().getFullYear()} xfontat</span>
      </div>
    </footer>
  );
}

function LocalizedFontVariantCard({
  font,
  locale,
  previewText,
  copy,
}: {
  font: Font;
  locale: "en" | "fr";
  previewText: string;
  copy: LocalizedFontDetailCopy;
}) {
  const [loaded, setLoaded] = useState(false);
  const family = generateFontFamily(font.name);
  const detailsPath = `/${locale}/font/${generateSlug(font.name, font.fileName, font.category)}`;

  useEffect(() => {
    let active = true;
    loadFont(family, font.fileUrl)
      .then(() => {
        if (active) setLoaded(true);
      })
      .catch(() => {
        if (active) setLoaded(false);
      });
    return () => {
      active = false;
    };
  }, [family, font.fileUrl]);

  return (
    <article className="rounded-lg border p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold">
            <Link href={detailsPath} className="hover:underline">{font.name}</Link>
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{getLocalizedFontWeightLabel(font.name, locale)}</p>
        </div>
        <span className="text-xs text-muted-foreground">{font.fileFormat || copy.notListed}</span>
      </div>
      <p
        className="mt-4 break-words rounded bg-muted/30 p-3 text-center text-2xl leading-relaxed"
        lang="ar"
        dir="rtl"
        style={{ fontFamily: loaded ? family : "inherit" }}
      >
        {previewText}
      </p>
      <a className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" href={font.fileUrl} download={font.fileName}>
        {copy.download}
      </a>
    </article>
  );
}

export default function LocalizedContentPage() {
  const pathname = typeof window === "undefined" ? "/en/about" : window.location.pathname;
  const locale: "en" | "fr" = pathname.startsWith("/fr/") || pathname === "/fr" ? "fr" : "en";
  const rawPath = pathname.replace(/^\/(en|fr)(?=\/|$)/, "") || "/";
  const fontSlug = rawPath.match(/^\/font\/([^/]+)$/)?.[1];
  const collectionSlug = rawPath.match(/^\/collection\/([^/]+)$/)?.[1];
  const blogSlug = rawPath.match(/^\/blog\/([^/]+)$/)?.[1];
  const isBlogIndex = rawPath === "/blog";
  const blogPost = blogSlug ? blogPosts.find((post) => post.slug === blogSlug) : undefined;
  const summaryBlogPost = blogSlug ? localizedBlogPosts[locale][blogSlug] : undefined;
  const fullTranslation = blogSlug ? fullBlogTranslations[blogSlug]?.[locale] : undefined;
  const localizedBlogPost = fullTranslation
    ? { ...fullTranslation, summary: fullTranslation.excerpt }
    : summaryBlogPost;
  const localizedBlogContent = fullTranslation?.content || summaryBlogPost?.summary || "";
  const isDesign = rawPath === "/design-fonts";
  const staticPageKey = rawPath.slice(1) as "about" | "contact" | "privacy" | "terms";
  const staticPage = ["about", "contact", "privacy", "terms"].includes(staticPageKey)
    ? localizedStaticPages[locale][staticPageKey]
    : undefined;
  const collectionData = collectionSlug ? getCollectionBySlug(collectionSlug) : undefined;
  const translatedCollection = collectionSlug ? localizedCollections[locale][collectionSlug] : undefined;
  const categoriesParam = collectionData?.categories.map((category) => encodeURIComponent(category)).join(",") || "";
  const [previewText, setPreviewText] = useState("بسم الله الرحمن الرحيم");
  const [previewSize, setPreviewSize] = useState(48);
  const [searchQuery, setSearchQuery] = useState("");
  const [collectionPage, setCollectionPage] = useState(1);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const { data: font, isLoading: fontLoading } = useQuery<Font>({
    queryKey: [`/api/fonts/by-slug/${fontSlug}`],
    enabled: Boolean(fontSlug),
    retry: false,
  });
  const { data: collectionFonts = [], isLoading: collectionLoading } = useQuery<Font[]>({
    queryKey: [`/api/fonts?categories=${categoriesParam}`],
    enabled: Boolean(categoriesParam),
  });
  const { data: sameCategoryFonts = [] } = useQuery<Font[]>({
    queryKey: [`/api/fonts?category=${encodeURIComponent(font?.category || "")}`],
    enabled: Boolean(font?.category),
  });

  const filteredCollectionFonts = useMemo(
    () => collectionFonts
      .filter((item) => !searchQuery.trim()
        || item.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
        || item.nameArabic.includes(searchQuery.trim())
        || Boolean(item.designer?.toLowerCase().includes(searchQuery.trim().toLowerCase())))
      .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()),
    [collectionFonts, searchQuery],
  );
  const groupedCollectionFonts = useMemo(() => groupFontsByFamily(filteredCollectionFonts), [filteredCollectionFonts]);
  const collectionPageSize = 15;
  const collectionPageCount = Math.ceil(groupedCollectionFonts.length / collectionPageSize);
  const currentCollectionGroups = groupedCollectionFonts.slice(
    (collectionPage - 1) * collectionPageSize,
    collectionPage * collectionPageSize,
  );

  useEffect(() => {
    setCollectionPage(1);
  }, [searchQuery, collectionSlug]);

  useEffect(() => {
    if (font) loadFont(generateFontFamily(font.name), font.fileUrl);
  }, [font]);

  const canonicalPath = routeLanguagePath(rawPath, locale);
  const arabicPath = rawPath;
  const currentLabel = locale === "fr";
  const homeCopy = currentLabel ? frenchHome : englishHome;
  const fontLabels = localizedFontDetailCopy[locale];
  const localizedFont = font ? getLocalizedFontPageContent(font, locale) : undefined;
  const fontFamily = font ? detectFontFamily(font.name) : "";
  const familyVariants = font
    ? sameCategoryFonts.filter((item) => item.id !== font.id && detectFontFamily(item.name) === fontFamily)
    : [];
  const relatedFonts = font
    ? sameCategoryFonts.filter((item) => item.id !== font.id && detectFontFamily(item.name) !== fontFamily).slice(0, 6)
    : [];
  const articleKeywords = font ? (categoryArticleKeywords[font.category] || ["خطوط عربية"]) : [];
  const relatedArticles = font
    ? blogPosts
      .filter((post) => articleKeywords.some((keyword) => post.title.includes(keyword) || post.keywords.some((item) => item.includes(keyword))))
      .slice(0, 3)
      .flatMap((post) => {
        const translation = fullBlogTranslations[post.slug]?.[locale] || localizedBlogPosts[locale][post.slug];
        return translation ? [{ slug: post.slug, title: translation.title, excerpt: translation.excerpt }] : [];
      })
    : [];
  const pageCategories = locale === "fr" ? frenchCategories : englishCategories;
  const collectionFaqs = translatedCollection && collectionData
    ? currentLabel
      ? [
          {
            question: `Comment choisir une police dans « ${translatedCollection.title} » ?`,
            answer: "Prévisualisez le texte exact à sa taille prévue et vérifiez sa lisibilité. Consultez la fiche du fichier avant de le choisir.",
          },
          {
            question: "Puis-je utiliser ces polices à des fins commerciales ?",
            answer: "Les droits d’utilisation varient selon chaque fichier. Consultez sa licence et sa source avant tout usage commercial ou redistribution.",
          },
          {
            question: "Quels formats de fichiers sont disponibles ?",
            answer: "Les formats varient d’un fichier à l’autre. Consultez la fiche de chaque police pour vérifier son format et sa compatibilité.",
          },
        ]
      : [
          {
            question: `How should I choose a font from “${translatedCollection.title}”?`,
            answer: "Preview the exact text at its intended size and check readability. Review the individual file page before choosing a font.",
          },
          {
            question: "Can I use these fonts commercially?",
            answer: "Usage rights vary by file. Check its license and source before commercial use or redistribution.",
          },
          {
            question: "Which file formats are available?",
            answer: "Formats vary by file. Open each font’s detail page to check its format and compatibility.",
          },
        ]
    : [];
  const alternates = [
    { lang: "en", href: `https://xfontat.com${routeLanguagePath(rawPath, "en")}` },
    { lang: "fr", href: `https://xfontat.com${routeLanguagePath(rawPath, "fr")}` },
    { lang: "ar", href: `https://xfontat.com${arabicPath}` },
  ];

  let title = staticPage?.title || (currentLabel ? "xfontat" : "xfontat");
  let description = staticPage?.description || "";
  if (font && localizedFont) {
    title = localizedFont.title;
    description = localizedFont.description;
  } else if (translatedCollection) {
    title = `${translatedCollection.title} | xfontat`;
    description = translatedCollection.description;
  } else if (isDesign) {
    title = currentLabel ? "Polices arabes de design | xfontat" : "Arabic design fonts | xfontat";
    description = currentLabel
      ? "Parcourez les fichiers de polices arabes de la catégorie design et vérifiez leurs détails."
      : "Browse Arabic font files in the design category and review their details.";
  } else if (isBlogIndex) {
    title = currentLabel ? "Conseils sur les polices arabes | xfontat" : "Arabic font guides | xfontat";
    description = currentLabel
      ? "Guides pratiques pour choisir et utiliser des polices arabes dans vos projets."
      : "Practical guides to choosing and using Arabic fonts in your projects.";
  } else if (blogPost && localizedBlogPost) {
    title = `${localizedBlogPost.title} | xfontat`;
    description = localizedBlogPost.excerpt;
  }

  const schema = font && localizedFont
    ? {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "CreativeWork",
            name: font.name,
            alternateName: font.nameArabic,
            description,
            url: `https://xfontat.com${canonicalPath}`,
            inLanguage: locale,
            genre: localizedFont.categoryName,
            encodingFormat: font.fileFormat || undefined,
            isBasedOn: font.sourceUrl || undefined,
            contentUrl: `https://xfontat.com${font.fileUrl}`,
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: currentLabel ? "Accueil" : "Home",
                item: `https://xfontat.com/${locale}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: localizedFont.categoryName,
                item: `https://xfontat.com/${locale}/fonts/${localizedFont.category?.slug || "kufi"}`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: font.name,
                item: `https://xfontat.com${canonicalPath}`,
              },
            ],
          },
          ...(familyVariants.length ? [{
            "@type": "ItemList",
            name: fontLabels.variantsHeading,
            numberOfItems: familyVariants.length,
            itemListElement: familyVariants.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: `${item.name} — ${getLocalizedFontWeightLabel(item.name, locale)}`,
              url: `https://xfontat.com/${locale}/font/${generateSlug(item.name, item.fileName, item.category)}`,
            })),
          }] : []),
          ...(relatedFonts.length ? [{
            "@type": "ItemList",
            name: fontLabels.relatedHeading,
            numberOfItems: relatedFonts.length,
            itemListElement: relatedFonts.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name,
              url: `https://xfontat.com/${locale}/font/${generateSlug(item.name, item.fileName, item.category)}`,
            })),
          }] : []),
          {
            "@type": "FAQPage",
            mainEntity: localizedFont.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          },
          ...(relatedArticles.length ? [{
            "@type": "ItemList",
            name: fontLabels.relatedArticlesHeading,
            numberOfItems: relatedArticles.length,
            itemListElement: relatedArticles.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.title,
              url: `https://xfontat.com/${locale}/blog/${item.slug}`,
            })),
          }] : []),
        ],
      }
    : translatedCollection && collectionData
      ? {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              name: translatedCollection.title,
              description: translatedCollection.description,
              url: `https://xfontat.com${canonicalPath}`,
              inLanguage: locale,
              numberOfItems: groupedCollectionFonts.length,
              keywords: collectionData.keywords.join(", "),
            },
            {
              "@type": "ItemList",
              name: translatedCollection.title,
              numberOfItems: groupedCollectionFonts.length,
              itemListElement: groupedCollectionFonts.map((group, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: group.family,
                url: `https://xfontat.com/${locale}/font/${generateSlug(group.primary.name, group.primary.fileName, group.primary.category)}`,
              })),
            },
            {
              "@type": "FAQPage",
              mainEntity: collectionFaqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            },
          ],
        }
    : {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title,
        description,
        url: `https://xfontat.com${canonicalPath}`,
        inLanguage: locale,
      };

  const pageTitle = staticPage?.title;
  const contactForm = staticPage && "form" in staticPage ? staticPage.form : [];
  const notFound = !fontSlug && !collectionSlug && !staticPage && !isDesign && !isBlogIndex && !(blogPost && localizedBlogPost);
  const handleLocalizedSearchSubmit = () => {
    if (collectionSlug) return;
    const query = searchQuery.trim();
    window.location.assign(`/${locale}${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir="ltr">
      <SEOHead
        title={title}
        description={description}
        path={canonicalPath}
        schema={schema}
        lang={locale}
        direction="ltr"
        alternates={alternates}
      />
      <LocalizedHeader
        locale={locale}
        path={rawPath}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        previewText={previewText}
        onPreviewTextChange={setPreviewText}
        previewSize={previewSize}
        onPreviewSizeChange={setPreviewSize}
        onSearchSubmit={handleLocalizedSearchSubmit}
      />
      <main className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
        {fontSlug ? (
          fontLoading ? <p>{currentLabel ? "Chargement…" : "Loading…"}</p> : !font ? (
            <section><h1 className="text-3xl font-bold">{currentLabel ? "Police introuvable" : "Font not found"}</h1><Link className="mt-4 inline-block underline" href={`/${locale}`}>{currentLabel ? "Retour à l’accueil" : "Return home"}</Link></section>
          ) : (
            <article>
              <nav className="mb-5 text-sm text-muted-foreground" aria-label={currentLabel ? "Fil d’Ariane" : "Breadcrumb"}>
                <Link href={`/${locale}`}>{currentLabel ? "Accueil" : "Home"}</Link>
                {" / "}
                <Link href={`/${locale}/fonts/${localizedFont?.category?.slug || "kufi"}`}>
                  {localizedFont?.categoryName}
                </Link>
                {" / "}
                <span aria-current="page">{font.name}</span>
              </nav>
              <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h1 className="text-3xl font-bold">{fontLabels.heading(font.name)}</h1>
                      <p className="mt-2 text-lg text-muted-foreground" lang="ar" dir="rtl">{font.nameArabic}</p>
                    </div>
                    <button
                      type="button"
                      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border ${favorites.has(font.id) ? "text-rose-500" : "text-muted-foreground"}`}
                      onClick={() => setFavorites((current) => {
                        const next = new Set(current);
                        if (next.has(font.id)) next.delete(font.id);
                        else next.add(font.id);
                        return next;
                      })}
                      aria-label={favorites.has(font.id) ? fontLabels.removeFavorite : fontLabels.addFavorite}
                      aria-pressed={favorites.has(font.id)}
                    >
                      <Heart className={`h-5 w-5 ${favorites.has(font.id) ? "fill-current" : ""}`} aria-hidden="true" />
                    </button>
                  </div>

              <section className="mt-6 rounded-lg border bg-muted/20 p-5" aria-labelledby="font-about-heading">
                <h2 id="font-about-heading" className="text-xl font-semibold">{fontLabels.aboutHeading}</h2>
                <p className="mt-3 max-w-3xl leading-7">{localizedFont?.summary}</p>
                <p className="mt-3 max-w-3xl leading-7">{localizedFont?.categoryDescription}</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {fontLabels.softwareCompatibility}
                </p>
              </section>

              <section className="mt-7" aria-labelledby="font-preview-heading">
                <h2 id="font-preview-heading" className="text-xl font-semibold">{fontLabels.previewSizesHeading}</h2>
                <p
                  className="mt-4 rounded-lg bg-muted/40 p-5 text-4xl leading-relaxed sm:text-5xl"
                  lang="ar"
                  dir="rtl"
                  style={{ fontFamily: generateFontFamily(font.name), fontSize: `${previewSize}px`, lineHeight: 1.6 }}
                >
                  {previewText}
                </p>
                <label className="mt-4 grid gap-2 text-sm font-medium" htmlFor="localized-font-preview">
                  {fontLabels.previewLabel}
                  <input
                    id="localized-font-preview"
                    className="rounded-md border bg-background px-3 py-2"
                    placeholder={fontLabels.previewPlaceholder}
                    value={previewText}
                    onChange={(event) => setPreviewText(event.target.value)}
                    dir="auto"
                  />
                </label>
                <div className="mt-6 grid gap-5 rounded-lg border p-5">
                  {[48, 32, 20, 14].map((size, index) => (
                    <div key={size}>
                      <p className="mb-1 text-xs text-muted-foreground">{fontLabels.previewSizeLabels[index]} ({size}px)</p>
                      <p
                        className="break-words leading-relaxed"
                        lang="ar"
                        dir="rtl"
                        style={{ fontFamily: generateFontFamily(font.name), fontSize: `${size}px`, lineHeight: 1.6 }}
                      >
                        {previewText}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-8 rounded-lg border p-5 sm:p-6" aria-labelledby="font-details-heading">
                <h2 id="font-details-heading" className="text-xl font-semibold">{fontLabels.detailsHeading}</h2>
                <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                  <div><dt className="text-sm text-muted-foreground">{fontLabels.nameLabel}</dt><dd className="mt-1 font-medium">{font.name}</dd></div>
                  <div><dt className="text-sm text-muted-foreground">{fontLabels.arabicNameLabel}</dt><dd className="mt-1 font-medium" lang="ar" dir="rtl">{font.nameArabic}</dd></div>
                  <div>
                    <dt className="text-sm text-muted-foreground">{fontLabels.categoryLabel}</dt>
                    <dd className="mt-1 font-medium"><Link className="underline underline-offset-4" href={`/${locale}/fonts/${localizedFont?.category?.slug || "kufi"}`}>{localizedFont?.categoryName}</Link></dd>
                  </div>
                  <div><dt className="text-sm text-muted-foreground">{fontLabels.formatLabel}</dt><dd className="mt-1 font-medium">{font.fileFormat || fontLabels.notListed}</dd></div>
                  <div><dt className="text-sm text-muted-foreground">{fontLabels.styleLabel}</dt><dd className="mt-1 font-medium">{localizedFont?.style || fontLabels.notListed}</dd></div>
                  {font.designer && <div><dt className="text-sm text-muted-foreground">{fontLabels.designerLabel}</dt><dd className="mt-1 font-medium">{font.designer}</dd></div>}
                  {font.license && (
                    <div className="sm:col-span-2">
                      <dt className="text-sm text-muted-foreground">{fontLabels.licenseLabel}</dt>
                      <dd className="mt-1 font-medium">{font.license}</dd>
                    </div>
                  )}
                  {font.copyright && <div className="sm:col-span-2"><dt className="text-sm text-muted-foreground">{fontLabels.copyrightLabel}</dt><dd className="mt-1">{font.copyright}</dd></div>}
                  {font.sourceUrl && (
                    <div>
                      <dt className="text-sm text-muted-foreground">{fontLabels.sourceLabel}</dt>
                      <dd className="mt-1"><a className="underline underline-offset-4" href={font.sourceUrl} target="_blank" rel="noopener noreferrer">{fontLabels.sourceLabel}</a></dd>
                    </div>
                  )}
                  {font.licenseNotice && (
                    <div className="sm:col-span-2 border-t pt-4">
                      <h3 className="font-semibold">{fontLabels.licenseNoticeHeading}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{fontLabels.licenseNoticeIntro}</p>
                      <details className="mt-3 rounded-md border p-3">
                        <summary className="cursor-pointer text-sm font-medium">{fontLabels.licenseNoticeHeading}</summary>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed" lang="ar">{font.licenseNotice}</p>
                      </details>
                    </div>
                  )}
                </dl>
              </section>

              <a className="mt-6 inline-flex rounded-md bg-primary px-5 py-3 font-medium text-primary-foreground" href={font.fileUrl} download={font.fileName}>
                {fontLabels.download}
              </a>

              {localizedFont?.useCases.length ? (
                <section className="mt-8 rounded-lg border p-5 sm:p-6" aria-labelledby="font-uses-heading">
                  <h2 id="font-uses-heading" className="text-xl font-semibold">{fontLabels.usesHeading}</h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {localizedFont.useCases.map((useCase) => <li key={useCase} className="rounded-md bg-muted px-3 py-1.5 text-sm">{useCase}</li>)}
                  </ul>
                </section>
              ) : null}

              <section className="mt-8 rounded-lg border p-5 sm:p-6" aria-labelledby="font-install-heading">
                <h2 id="font-install-heading" className="text-xl font-semibold">{fontLabels.installHeading}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{fontLabels.installIntro}</p>
                <div className="mt-5 grid gap-6 sm:grid-cols-2">
                  <div>
                    <h3 className="font-semibold">{fontLabels.windowsHeading}</h3>
                    <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                      {fontLabels.installSteps.windows.map((step) => <li key={step}>{step}</li>)}
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold">{fontLabels.macHeading}</h3>
                    <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                      {fontLabels.installSteps.mac.map((step) => <li key={step}>{step}</li>)}
                    </ol>
                  </div>
                </div>
              </section>

              <section className="mt-8 rounded-lg border p-5 sm:p-6" aria-labelledby="font-character-map-heading">
                <h2 id="font-character-map-heading" className="text-xl font-semibold">{fontLabels.characterMapHeading}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{fontLabels.characterMapIntro}</p>
                <div className="mt-5 space-y-2">
                  {fontCharacterMap.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex flex-wrap justify-center gap-1">
                      {row.map((character, characterIndex) => (
                        <span
                          key={`${rowIndex}-${characterIndex}`}
                          className="flex h-9 w-9 items-center justify-center rounded border text-sm"
                          lang={/[ء-ي]/.test(character) ? "ar" : "en"}
                          dir={/[ء-ي]/.test(character) ? "rtl" : "ltr"}
                          style={{ fontFamily: generateFontFamily(font.name) }}
                        >
                          {character}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
                <figure className="mt-6 border-t pt-5">
                  <figcaption className="mb-3 text-center text-sm font-medium">{fontLabels.characterMapImageCaption}</figcaption>
                  <img
                    src={`/font-previews/${generateSlug(font.name, font.fileName, font.category)}.webp`}
                    alt={fontLabels.characterMapImageAlt(font.name)}
                    width={1400}
                    height={760}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full rounded-md border bg-white"
                  />
                </figure>
              </section>

              {localizedFont?.faqs.length ? (
                <section className="mt-8 rounded-lg border p-5 sm:p-6" aria-labelledby="font-faq-heading">
                  <h2 id="font-faq-heading" className="text-xl font-semibold">{fontLabels.categoryFaqHeading}</h2>
                  <div className="mt-4 space-y-5">
                    {localizedFont.faqs.map((faq) => (
                      <div key={faq.question}>
                        <h3 className="font-medium">{faq.question}</h3>
                        <p className="mt-1 leading-7 text-muted-foreground">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {familyVariants.length > 0 && (
                <section className="mt-8 rounded-lg border p-5 sm:p-6" aria-labelledby="family-variants-heading">
                  <h2 id="family-variants-heading" className="text-xl font-semibold">{fontLabels.variantsHeading}</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {familyVariants.map((variant) => (
                      <LocalizedFontVariantCard
                        key={variant.id}
                        font={variant}
                        locale={locale}
                        previewText={previewText}
                        copy={fontLabels}
                      />
                    ))}
                  </div>
                </section>
              )}

              {relatedFonts.length > 0 && (
                <section className="mt-8 rounded-lg border p-5 sm:p-6" aria-labelledby="related-fonts-heading">
                  <h2 id="related-fonts-heading" className="text-xl font-semibold">{fontLabels.relatedHeading}</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {relatedFonts.map((item) => (
                      <Link
                        key={item.id}
                        href={`/${locale}/font/${generateSlug(item.name, item.fileName, item.category)}`}
                        className="rounded-md border p-4 hover:bg-muted/50"
                      >
                        <span className="block font-medium">{item.name}</span>
                        <span className="mt-1 block text-sm text-muted-foreground" lang="ar" dir="rtl">{item.nameArabic}</span>
                        <span className="mt-2 block text-xs text-muted-foreground">{item.fileFormat || fontLabels.notListed}</span>
                      </Link>
                    ))}
                  </div>
                  {localizedFont?.category?.slug && (
                    <Link className="mt-4 inline-block text-sm underline underline-offset-4" href={`/${locale}/fonts/${localizedFont.category.slug}`}>
                      {fontLabels.browseCategory(localizedFont.categoryName)}
                    </Link>
                  )}
                </section>
              )}
              {relatedArticles.length > 0 && (
                <section className="mt-8 rounded-lg border p-5 sm:p-6" aria-labelledby="related-articles-heading">
                  <h2 id="related-articles-heading" className="text-xl font-semibold">{fontLabels.relatedArticlesHeading}</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {relatedArticles.map((article) => (
                      <article key={article.slug} className="rounded-md border p-4">
                        <h3 className="font-medium">
                          <Link className="hover:underline" href={`/${locale}/blog/${article.slug}`}>{article.title}</Link>
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{article.excerpt}</p>
                      </article>
                    ))}
                  </div>
                </section>
              )}
                </div>
                <aside className="self-start space-y-5 lg:sticky lg:top-40">
                  <section className="rounded-lg border p-5" aria-labelledby="font-sidebar-heading">
                    <h2 id="font-sidebar-heading" className="text-lg font-semibold">{fontLabels.sidebarHeading}</h2>
                    <dl className="mt-4 space-y-3 text-sm">
                      <div><dt className="text-muted-foreground">{fontLabels.categoryLabel}</dt><dd className="mt-1 font-medium">{localizedFont?.categoryName}</dd></div>
                      <div><dt className="text-muted-foreground">{fontLabels.formatLabel}</dt><dd className="mt-1 font-medium">{font.fileFormat || fontLabels.notListed}</dd></div>
                      <div><dt className="text-muted-foreground">{fontLabels.styleLabel}</dt><dd className="mt-1 font-medium">{localizedFont?.style || fontLabels.notListed}</dd></div>
                      {font.designer && <div><dt className="text-muted-foreground">{fontLabels.designerLabel}</dt><dd className="mt-1 font-medium">{font.designer}</dd></div>}
                      {font.license && <div><dt className="text-muted-foreground">{fontLabels.licenseLabel}</dt><dd className="mt-1 font-medium">{font.license}</dd></div>}
                      {font.sourceUrl && <div><dt className="text-muted-foreground">{fontLabels.sourceLabel}</dt><dd className="mt-1"><a className="underline underline-offset-4" href={font.sourceUrl} target="_blank" rel="noopener noreferrer">{fontLabels.sourceLabel}</a></dd></div>}
                    </dl>
                    <a className="mt-5 inline-flex w-full justify-center rounded-md bg-primary px-4 py-3 font-medium text-primary-foreground" href={font.fileUrl} download={font.fileName}>
                      {fontLabels.download}
                    </a>
                  </section>
                  <section className="rounded-lg border p-5" aria-labelledby="font-categories-heading">
                    <h2 id="font-categories-heading" className="text-lg font-semibold">{fontLabels.categoriesHeading}</h2>
                    <ul className="mt-4 space-y-2 text-sm">
                      {pageCategories.map((item) => (
                        <li key={item.slug}>
                          <Link
                            className={`hover:underline ${item.arabicCategory === font.category ? "font-semibold text-primary" : "text-muted-foreground"}`}
                            href={`/${locale}/fonts/${item.slug}`}
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                </aside>
              </div>
            </article>
          )
        ) : translatedCollection && collectionData ? (
          <section>
            <nav className="mb-5 text-sm text-muted-foreground" aria-label={currentLabel ? "Fil d’Ariane" : "Breadcrumb"}>
              <Link href={`/${locale}`}>{currentLabel ? "Accueil" : "Home"}</Link>
              {" / "}
              <span aria-current="page">{translatedCollection.title}</span>
            </nav>
            <h1 className="text-3xl font-bold">{translatedCollection.title}</h1>
            <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">{translatedCollection.description}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {translatedCollection.useCases.map((use) => <li key={use} className="rounded-md bg-muted px-3 py-1 text-sm">{use}</li>)}
            </ul>
            {collectionLoading ? (
              <p className="py-10 text-center text-muted-foreground">{currentLabel ? "Chargement des fichiers…" : "Loading font files…"}</p>
            ) : groupedCollectionFonts.length === 0 ? (
              <p className="py-10 text-center text-muted-foreground">{homeCopy.noResults}</p>
            ) : (
              <>
                <p className="border-b py-3 text-sm text-muted-foreground">
                  {currentLabel
                    ? `Familles de polices ${(collectionPage - 1) * collectionPageSize + 1}–${Math.min(collectionPage * collectionPageSize, groupedCollectionFonts.length)} sur ${groupedCollectionFonts.length} ${homeCopy.familyCountLabel(groupedCollectionFonts.length)} (${filteredCollectionFonts.length} ${homeCopy.fileCountLabel(filteredCollectionFonts.length)})`
                    : `Showing font families ${(collectionPage - 1) * collectionPageSize + 1}–${Math.min(collectionPage * collectionPageSize, groupedCollectionFonts.length)} of ${groupedCollectionFonts.length} ${homeCopy.familyCountLabel(groupedCollectionFonts.length)} (${filteredCollectionFonts.length} ${homeCopy.fileCountLabel(filteredCollectionFonts.length)})`}
                </p>
                <div aria-live="polite">
                  {currentCollectionGroups.map((group) => (
                    <LocalizedFontRow
                      key={group.primary.id}
                      font={group.primary}
                      previewText={previewText}
                      previewSize={previewSize}
                      variantCount={group.variants.length}
                      isFavorite={favorites.has(group.primary.id)}
                      onToggleFavorite={() => setFavorites((current) => {
                        const next = new Set(current);
                        if (next.has(group.primary.id)) next.delete(group.primary.id);
                        else next.add(group.primary.id);
                        return next;
                      })}
                      copy={homeCopy}
                      locale={locale}
                    />
                  ))}
                </div>
                {collectionPageCount > 1 && (
                  <nav className="flex items-center justify-center gap-4 py-7" aria-label={currentLabel ? "Pagination" : "Pagination"}>
                    <button
                      onClick={() => setCollectionPage((page) => Math.max(1, page - 1))}
                      disabled={collectionPage <= 1}
                      className="rounded-md border px-4 py-2 disabled:opacity-50"
                    >
                      {homeCopy.previous}
                    </button>
                    <span className="text-sm text-muted-foreground">
                      {currentLabel ? "Page" : "Page"} {collectionPage} {currentLabel ? "sur" : "of"} {collectionPageCount}
                    </span>
                    <button
                      onClick={() => setCollectionPage((page) => Math.min(collectionPageCount, page + 1))}
                      disabled={collectionPage >= collectionPageCount}
                      className="rounded-md border px-4 py-2 disabled:opacity-50"
                    >
                      {homeCopy.next}
                    </button>
                  </nav>
                )}
              </>
            )}
            <section className="mt-12 rounded-lg border p-6">
              <h2 className="text-xl font-bold">{currentLabel ? `Questions fréquentes sur ${translatedCollection.title}` : `Common questions about ${translatedCollection.title}`}</h2>
              <div className="mt-4 space-y-5">
                {collectionFaqs.map((faq) => (
                  <article key={faq.question}>
                    <h3 className="font-semibold">{faq.question}</h3>
                    <p className="mt-1 leading-7 text-muted-foreground">{faq.answer}</p>
                  </article>
                ))}
              </div>
            </section>
            <section className="mt-8">
              <h2 className="text-xl font-bold">{currentLabel ? "Parcourir d’autres collections" : "Browse other collections"}</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                {Object.entries(localizedCollections[locale])
                  .filter(([slug]) => slug !== collectionSlug)
                  .slice(0, 8)
                  .map(([slug, item]) => (
                    <Link key={slug} href={`/${locale}/collection/${slug}`} className="rounded-lg border p-3 text-center hover:bg-muted">
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  ))}
              </div>
            </section>
          </section>
        ) : isDesign ? (
          <section>
            <h1 className="text-3xl font-bold">{currentLabel ? "Polices arabes de design" : "Arabic design fonts"}</h1>
            <p className="mt-3 leading-7 text-muted-foreground">{description}</p>
            <Link className="mt-5 inline-block rounded-md border px-4 py-2" href={`/${locale}/fonts/tasmeem`}>
              {currentLabel ? "Parcourir les polices de design" : "Browse design fonts"}
            </Link>
          </section>
        ) : isBlogIndex ? (
          <section>
            <h1 className="text-3xl font-bold">{currentLabel ? "Guides sur les polices arabes" : "Arabic font guides"}</h1>
            <p className="mt-3 text-muted-foreground">
              {currentLabel ? "Conseils pratiques pour comparer les fichiers, les formats et les licences." : "Practical guidance for comparing font files, formats, and licenses."}
            </p>
            <div className="mt-7 space-y-4">
              {blogPosts.map((post) => {
                const translation = fullBlogTranslations[post.slug]?.[locale] || localizedBlogPosts[locale][post.slug];
                if (!translation) return null;
                return (
                  <article key={post.slug} className="rounded-lg border p-5">
                    <h2 className="text-xl font-semibold">
                      <Link className="hover:underline" href={`/${locale}/blog/${post.slug}`}>{translation.title}</Link>
                    </h2>
                    <p className="mt-2 leading-7 text-muted-foreground">{translation.excerpt}</p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", day: "numeric" }).format(new Date(post.dateISO))}
                      {" · "}{post.readTime} {currentLabel ? "min de lecture" : "min read"}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>
        ) : blogPost && localizedBlogPost ? (
          <article>
            <h1 className="text-3xl font-bold">{localizedBlogPost.title}</h1>
            <p className="mt-3 text-lg text-muted-foreground">{localizedBlogPost.excerpt}</p>
            <div
              className="prose prose-neutral mt-8 max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(
                localizedBlogContent
              ) }}
            />
            <Link className="mt-8 inline-block underline underline-offset-4" href={`/blog/${blogPost.slug}`} hrefLang="ar">
              {currentLabel ? "Consulter la version arabe" : "View the Arabic version"}
            </Link>
          </article>
        ) : staticPage ? (
          <article>
            <h1 className="text-3xl font-bold">{pageTitle}</h1>
            <p className="mt-3 leading-7 text-muted-foreground">{staticPage.description}</p>
            {"intro" in staticPage ? (
              <>
                <h2 className="mt-6 text-xl font-semibold">{staticPage.heading}</h2>
                <p className="mt-3 leading-7">{staticPage.intro}</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {["info@xfontat.com", "support@xfontat.com", "suggestions@xfontat.com"].map((email, index) => (
                    <a className="rounded-lg border p-4 hover:bg-muted" href={`mailto:${email}`} key={email}>
                      <span className="block font-semibold">{currentLabel ? ["Informations", "Assistance", "Suggestions"][index] : ["Information", "Support", "Suggestions"][index]}</span>
                      <span className="mt-1 block break-all text-sm text-muted-foreground">{email}</span>
                    </a>
                  ))}
                </div>
                <div className="mt-8 rounded-lg border bg-muted/30 p-6">
                  <h2 className="text-xl font-semibold">{contactForm[0]}</h2>
                  <div className="mt-5 space-y-4">
                    <div>
                      <label htmlFor="localized-contact-name" className="mb-2 block text-sm font-medium">{contactForm[1]}</label>
                      <input id="localized-contact-name" type="text" placeholder={contactForm[2]} className="w-full rounded-lg border bg-background px-4 py-2" />
                    </div>
                    <div>
                      <label htmlFor="localized-contact-email" className="mb-2 block text-sm font-medium">{contactForm[3]}</label>
                      <input id="localized-contact-email" type="email" placeholder={contactForm[4]} className="w-full rounded-lg border bg-background px-4 py-2" />
                    </div>
                    <div>
                      <label htmlFor="localized-contact-subject" className="mb-2 block text-sm font-medium">{contactForm[5]}</label>
                      <input id="localized-contact-subject" type="text" placeholder={contactForm[6]} className="w-full rounded-lg border bg-background px-4 py-2" />
                    </div>
                    <div>
                      <label htmlFor="localized-contact-message" className="mb-2 block text-sm font-medium">{contactForm[7]}</label>
                      <textarea id="localized-contact-message" placeholder={contactForm[8]} className="min-h-36 w-full rounded-lg border bg-background px-4 py-2" />
                    </div>
                    <button type="button" className="w-full rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground">{contactForm[9]}</button>
                    <p className="text-center text-sm text-muted-foreground">{contactForm[10]}</p>
                  </div>
                </div>
              </>
            ) : staticPage.sections?.map((section) => (
              <section className="mt-8" key={section.heading}>
                <h2 className="text-xl font-semibold">{section.heading}</h2>
                {(section.paragraphs ?? section.body ?? []).map((paragraph) => (
                  <p key={paragraph} className="mt-3 leading-7 text-muted-foreground">{paragraph}</p>
                ))}
                {section.items && (
                  <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
                    {section.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                )}
              </section>
            ))}
          </article>
        ) : notFound ? (
          <section><h1 className="text-3xl font-bold">{currentLabel ? "Page introuvable" : "Page not found"}</h1><Link className="mt-4 inline-block underline" href={`/${locale}`}>{currentLabel ? "Retour à l’accueil" : "Return home"}</Link></section>
        ) : null}
      </main>
      <LocalizedFooter locale={locale} />
    </div>
  );
}
