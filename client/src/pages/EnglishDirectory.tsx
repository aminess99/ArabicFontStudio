import { useEffect, useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SEOHead } from "@/components/SEOHead";
import { LocalizedFontRow } from "@/components/LocalizedFontRow";
import { LocalizedMobileMenu } from "@/components/LocalizedMobileMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getCanonicalFontSlug } from "@/lib/slugify";
import { localizedCollections } from "@/lib/localizedPagesContent";
import { groupFontsByFamily } from "@/lib/fontFamily";
import {
  englishCategories,
  englishHome,
  frenchCategories,
  frenchHome,
} from "@/lib/internationalContent";
import type { Font } from "@shared/schema";

const PAGE_SIZE = 15;

export default function EnglishDirectory() {
  const pathname = typeof window === "undefined" ? "/en" : window.location.pathname;
  const locale = pathname === "/fr" || pathname.startsWith("/fr/") ? "fr" : "en";
  const isFrench = locale === "fr";
  const homeCopy = isFrench ? frenchHome : englishHome;
  const categories = isFrench ? frenchCategories : englishCategories;
  const designCategory = categories.find((item) => item.arabicCategory === "تصميم");
  const [, englishCategoryParams] = useRoute("/en/fonts/:category");
  const [, frenchCategoryParams] = useRoute("/fr/fonts/:category");
  const categorySlug = englishCategoryParams?.category || frenchCategoryParams?.category;
  const category = categories.find((item) => item.slug === categorySlug);
  const invalidCategory = Boolean(categorySlug && !category);
  const [search, setSearch] = useState(() => (
    typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("q") || ""
  ));
  const [previewText, setPreviewText] = useState("بسم الله الرحمن الرحيم");
  const [previewSize, setPreviewSize] = useState(48);
  const [showPreviewTools, setShowPreviewTools] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, categorySlug]);

  const fontQueryPath = category
    ? `/api/fonts?category=${encodeURIComponent(category.arabicCategory)}`
    : "/api/fonts";
  const { data: allFonts = [], isLoading, isError, refetch } = useQuery<Font[]>({
    queryKey: [fontQueryPath],
    enabled: !invalidCategory,
  });

  const fonts = useMemo(
    () => allFonts
      .filter((font) => {
        if (!search.trim()) return true;
        const needle = search.trim().toLowerCase();
        return font.name.toLowerCase().includes(needle)
          || font.nameArabic.includes(search.trim())
          || Boolean(font.designer?.toLowerCase().includes(needle));
      })
      .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()),
    [allFonts, search],
  );
  const groupedFonts = useMemo(() => groupFontsByFamily(fonts), [fonts]);
  const total = groupedFonts.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentGroups = groupedFonts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const title = category?.title ?? homeCopy.title;
  const description = category?.description ?? homeCopy.description;
  const path = category ? `/${locale}/fonts/${category.slug}` : `/${locale}`;
  const arabicPath = category ? `/fonts/${category.slug}` : "/";
  const heading = category?.name ?? homeCopy.heading;
  const intro = category?.intro ?? homeCopy.intro;
  const faqs = category?.faqs ?? homeCopy.faqs;
  const homeCollectionEntries = Object.entries(localizedCollections[locale]);
  const alternates = [
    { lang: "en", href: `https://xfontat.com/${category ? `en/fonts/${category.slug}` : "en"}` },
    { lang: "fr", href: `https://xfontat.com/${category ? `fr/fonts/${category.slug}` : "fr"}` },
    { lang: "ar", href: `https://xfontat.com${arabicPath}` },
    { lang: "x-default", href: `https://xfontat.com${arabicPath}` },
  ];

  const schema = invalidCategory
    ? undefined
    : category
      ? {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: heading,
          description,
          url: `https://xfontat.com${path}`,
          inLanguage: locale,
          numberOfItems: total,
        }
      : {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              name: "xfontat",
              url: `https://xfontat.com/${locale}`,
              description: homeCopy.description,
              inLanguage: locale,
            },
            {
              "@type": "CollectionPage",
              name: homeCopy.title,
              description: homeCopy.description,
              url: `https://xfontat.com/${locale}`,
              inLanguage: locale,
              numberOfItems: total,
            },
            {
              "@type": "ItemList",
              itemListElement: currentGroups.map((group, index) => ({
                "@type": "ListItem",
                position: index + 1 + (page - 1) * PAGE_SIZE,
                url: `https://xfontat.com/${locale}/font/${getCanonicalFontSlug(group.primary)}`,
                name: group.family,
              })),
            },
            {
              "@type": "FAQPage",
              mainEntity: homeCopy.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            },
          ],
        };

  const toggleFavorite = (fontId: string) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(fontId)) next.delete(fontId);
      else next.add(fontId);
      return next;
    });
  };

  if (invalidCategory) {
    return (
      <main className="min-h-screen bg-background px-4 py-20 text-center" dir="ltr">
        <SEOHead
          title={isFrench ? "Catégorie introuvable | xfontat" : "Category not found | xfontat"}
          description={isFrench ? "La catégorie demandée est introuvable." : "The requested Arabic font category was not found."}
          path={`/${locale}/fonts/${categorySlug}`}
          lang={locale}
          direction="ltr"
        />
        <h1 className="text-3xl font-bold">{isFrench ? "Catégorie introuvable" : "Category not found"}</h1>
        <Link href={`/${locale}`} className="mt-5 inline-block underline underline-offset-4">
          {isFrench ? "Retour à la bibliothèque" : "Return to the font directory"}
        </Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground" dir="ltr">
      <SEOHead
        title={title}
        description={description}
        path={path}
        schema={schema}
        lang={locale}
        direction="ltr"
        alternates={alternates}
      />

      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-3 py-3 md:px-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <LocalizedMobileMenu
                locale={locale}
                links={[
                  { href: `/${locale}`, label: homeCopy.home },
                  ...categories.map((item) => ({ href: `/${locale}/fonts/${item.slug}`, label: item.name })),
                  { href: `/${locale}/blog`, label: homeCopy.blog },
                ]}
              />
              <Link href={`/${locale}`} className="flex shrink-0 items-center hover:opacity-80" aria-label={`xfontat ${locale} home`}>
                <img src="/logo.png" alt="xfontat" className="h-8 w-auto md:h-10" />
              </Link>
            </div>
            <nav className="hidden items-center gap-3 text-sm lg:flex" aria-label={homeCopy.mainNavigation}>
              <Link href={`/${locale}`} className="hover:underline">{homeCopy.home}</Link>
              {categories.slice(0, 5).map((item) => (
                <Link key={item.slug} href={`/${locale}/fonts/${item.slug}`} className="hover:underline">
                  {item.name}
                </Link>
              ))}
              <Link href={`/${locale}/fonts/${designCategory?.slug || "tasmeem"}`} className="hover:underline">{homeCopy.designFonts}</Link>
              <Link href={`/${locale}/blog`} className="hover:underline">{homeCopy.blog}</Link>
            </nav>
            <div className="flex items-center gap-2 text-sm">
              <Link href={category ? `/en/fonts/${category.slug}` : "/en"} hrefLang="en" className="rounded-md border px-2 py-2 hover:bg-muted">EN</Link>
              <Link href={category ? `/fr/fonts/${category.slug}` : "/fr"} hrefLang="fr" className="rounded-md border px-2 py-2 hover:bg-muted">FR</Link>
              <Link href={arabicPath} hrefLang="ar" className="rounded-md border px-2 py-2 hover:bg-muted">{homeCopy.language}</Link>
              <ThemeToggle label={isFrench ? "Changer le thème" : "Toggle theme"} />
            </div>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(180px,1fr)_minmax(180px,1fr)_240px]">
            {/* Preview controls fold away on phones so the font list starts near the top. */}
            <label className="order-1 grid gap-1 text-xs font-medium sm:order-none">
              {homeCopy.searchLabel}
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={homeCopy.searchPlaceholder}
                className="h-10 rounded-md border bg-background px-3 text-base font-normal"
                data-testid="english-font-search"
              />
            </label>
            <button
              type="button"
              onClick={() => setShowPreviewTools((value) => !value)}
              aria-expanded={showPreviewTools}
              className="order-2 text-start text-xs text-muted-foreground underline underline-offset-4 sm:hidden"
            >
              {isFrench ? "Options de prévisualisation" : "Preview options"}
            </button>
            <label className={`order-3 ${showPreviewTools ? "grid" : "hidden"} gap-1 text-xs font-medium sm:order-none sm:grid`}>
              {homeCopy.previewLabel}
              <input
                type="text"
                value={previewText}
                onChange={(event) => setPreviewText(event.target.value)}
                placeholder={homeCopy.previewPlaceholder}
                className="h-10 rounded-md border bg-background px-3 text-base font-normal"
                dir="auto"
                data-testid="english-font-preview"
              />
            </label>
            <label className={`order-4 ${showPreviewTools ? "grid" : "hidden"} gap-1 text-xs font-medium sm:order-none sm:grid`}>
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
                onChange={(event) => setPreviewSize(Number(event.target.value))}
                aria-label={`${homeCopy.previewSizeLabel}: ${previewSize}px`}
                className="h-10 w-full accent-primary"
                data-testid="international-preview-size"
              />
            </label>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-10">
        <nav className="mb-5 flex flex-wrap gap-2" aria-label={homeCopy.allCategories}>
          {categories.map((item) => (
            <Link
              key={item.slug}
              href={`/${locale}/fonts/${item.slug}`}
              className={`rounded-full border px-3 py-1.5 text-sm hover:bg-muted ${
                item.slug === category?.slug ? "border-primary bg-muted" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <section className="border-b pb-6">
          <h1 className="text-3xl font-bold md:text-4xl">{heading}</h1>
          <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">{intro}</p>
          {category && (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Common uses">
              {category.uses.map((use) => (
                <li key={use} className="rounded-md bg-muted px-3 py-1 text-sm">{use}</li>
              ))}
            </ul>
          )}
        </section>

        {!category && (
          <section className="grid gap-6 border-b py-7 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold">{homeCopy.aboutHeading}</h2>
              <p className="mt-2 leading-7 text-muted-foreground">{homeCopy.about}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{homeCopy.licenseHeading}</h2>
              <p className="mt-2 leading-7 text-muted-foreground">{homeCopy.license}</p>
            </div>
          </section>
        )}

        <section aria-live="polite">
          {isLoading ? (
            <p className="py-10 text-center text-muted-foreground">{homeCopy.loading}</p>
          ) : isError ? (
            <div className="py-10 text-center">
              <p className="text-muted-foreground">{homeCopy.error}</p>
              <button className="mt-3 underline underline-offset-4" onClick={() => refetch()}>
                {homeCopy.retry}
              </button>
            </div>
          ) : fonts.length === 0 ? (
            <p className="py-10 text-center text-muted-foreground">{homeCopy.noResults}</p>
          ) : (
            <>
              <p className="border-b py-3 text-sm text-muted-foreground">
                {isFrench
                  ? `Affichage ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} sur ${total} ${homeCopy.familyCountLabel(total)} (${fonts.length} ${homeCopy.fileCountLabel(fonts.length)})`
                  : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} of ${total} ${homeCopy.familyCountLabel(total)} (${fonts.length} ${homeCopy.fileCountLabel(fonts.length)})`}
              </p>
              {currentGroups.map((group) => (
                <LocalizedFontRow
                  key={group.primary.id}
                  font={group.primary}
                  previewText={previewText}
                  previewSize={previewSize}
                  variantCount={group.variants.length}
                  isFavorite={favorites.has(group.primary.id)}
                  onToggleFavorite={() => toggleFavorite(group.primary.id)}
                  copy={homeCopy}
                  locale={locale}
                />
              ))}
              {totalPages > 1 && (
                <nav className="flex items-center justify-center gap-4 py-7" aria-label="Pagination">
                  <button
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page <= 1}
                    className="rounded-md border px-4 py-2 disabled:opacity-50"
                  >
                    {homeCopy.previous}
                  </button>
                  <span className="text-sm text-muted-foreground">{isFrench ? "Page" : "Page"} {page} {isFrench ? "sur" : "of"} {totalPages}</span>
                  <button
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    disabled={page >= totalPages}
                    className="rounded-md border px-4 py-2 disabled:opacity-50"
                  >
                    {homeCopy.next}
                  </button>
                </nav>
              )}
            </>
          )}
        </section>

        {!category && (
          <>
            <section className="mt-10 border-t pt-8">
              <h2 className="text-2xl font-bold">{homeCopy.benefitsHeading}</h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {homeCopy.benefits.map((item) => (
                  <li key={item.title} className="rounded-lg border p-5">
                    <span className="mb-3 block h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-10 border-t pt-8">
              <h2 className="text-2xl font-bold">{homeCopy.projectGuidesHeading}</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {homeCopy.projectGuides.map((guide) => (
                  <article key={guide.title} className="rounded-lg border p-5">
                    <h3 className="font-semibold">{guide.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{guide.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-10 border-t pt-8">
              <h2 className="text-2xl font-bold">{homeCopy.categoryGuideHeading}</h2>
              <p className="mt-2 max-w-3xl leading-7 text-muted-foreground">{homeCopy.categoryGuideIntro}</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/${locale}/fonts/${item.slug}`}
                    className="rounded-lg border p-5 transition-colors hover:bg-muted/40"
                  >
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.intro}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {item.uses.slice(0, 3).map((use) => (
                        <li key={use} className="rounded-md bg-muted px-2 py-1 text-xs">{use}</li>
                      ))}
                    </ul>
                  </Link>
                ))}
              </div>
            </section>

            <section className="mt-10 border-t pt-8">
              <h2 className="text-2xl font-bold">{homeCopy.collectionsHeading}</h2>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {homeCollectionEntries.map(([slug, collection]) => (
                  <Link
                    key={slug}
                    href={`/${locale}/collection/${slug}`}
                    className="rounded-lg border p-4 text-center transition-colors hover:bg-muted/40"
                  >
                    <h3 className="font-semibold">{collection.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{collection.description}</p>
                    <ul className="mt-3 flex flex-wrap justify-center gap-2">
                      {collection.useCases.slice(0, 3).map((use) => (
                        <li key={use} className="rounded-md bg-muted px-2 py-1 text-xs">{use}</li>
                      ))}
                    </ul>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

        <section className="mt-10 border-t pt-8">
          <h2 className="text-2xl font-bold">{category ? (isFrench ? `À propos des polices arabes ${category.name}` : `About ${category.name} Arabic fonts`) : homeCopy.faqHeading}</h2>
          <div className="mt-5 space-y-5">
            {faqs.map((faq) => (
              <article key={faq.question}>
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="mt-1 leading-7 text-muted-foreground">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t">
        <div className="container mx-auto flex flex-wrap gap-x-5 gap-y-3 px-4 py-6 text-sm text-muted-foreground">
          <Link href={`/${locale}/about`}>{homeCopy.footerAbout}</Link>
          <Link href={`/${locale}/contact`}>{homeCopy.footerContact}</Link>
          <Link href={`/${locale}/privacy`}>{homeCopy.footerPrivacy}</Link>
          <Link href={`/${locale}/terms`}>{homeCopy.footerTerms}</Link>
          <span>© {new Date().getFullYear()} xfontat</span>
        </div>
      </footer>
    </div>
  );
}
