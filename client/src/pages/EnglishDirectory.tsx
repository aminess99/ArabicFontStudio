import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SEOHead } from "@/components/SEOHead";
import { generateFontFamily, loadFont } from "@/lib/fontLoader";
import { generateSlug } from "@/lib/slugify";
import {
  englishCategories,
  englishHome,
  frenchCategories,
  frenchHome,
} from "@/lib/internationalContent";
import type { Font } from "@shared/schema";

const PAGE_SIZE = 15;

interface PagedFontResponse {
  data: Font[];
  total: number;
  page: number;
  limit: number;
}

function FontFileRow({
  font,
  previewText,
  copy,
  locale,
}: {
  font: Font;
  previewText: string;
  copy: typeof englishHome;
  locale: "en" | "fr";
}) {
  const [fontLoaded, setFontLoaded] = useState(false);
  const fontFamily = generateFontFamily(font.name);

  useEffect(() => {
    let active = true;
    loadFont(fontFamily, font.fileUrl)
      .then(() => {
        if (active) setFontLoaded(true);
      })
      .catch(() => {
        if (active) setFontLoaded(false);
      });
    return () => {
      active = false;
    };
  }, [fontFamily, font.fileUrl]);

  const license = font.licenseNotice || font.license;
  const format = font.fileFormat || font.fileName.split(".").pop()?.toUpperCase();

  return (
    <article className="border-b py-5" data-testid={`international-font-${font.id}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold break-words">
            <Link
              href={`/${locale}/font/${generateSlug(font.name, font.fileName, font.category)}`}
              className="hover:underline underline-offset-4"
            >
              {font.name || font.nameArabic}
            </Link>
          </h2>
          {font.nameArabic && (
            <p className="text-sm text-muted-foreground mt-1" lang="ar" dir="rtl">
              {font.nameArabic}
            </p>
          )}
          <Link
            href={`/${locale}/font/${generateSlug(font.name, font.fileName, font.category)}`}
            className="mt-2 inline-block text-sm text-primary underline underline-offset-4"
          >
            {locale === "fr" ? "Voir la fiche de la police" : "View font details"}
          </Link>
          <p
            className="break-words leading-relaxed mt-3"
            style={{
              fontFamily: fontLoaded ? fontFamily : "inherit",
              fontSize: "clamp(1.6rem, 4vw, 2.5rem)",
            }}
            lang="ar"
            dir="rtl"
          >
            {previewText}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {format && <span>Format: {format}</span>}
            <span>
              {copy.licenseLabel}: {license || copy.licenseUnknown}
            </span>
            {font.sourceUrl && (
              <a
                href={font.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                {copy.source}
              </a>
            )}
          </div>
        </div>
        <a
          href={font.fileUrl}
          download={font.fileName}
          className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          data-testid={`international-download-${font.id}`}
        >
          {copy.download}
        </a>
      </div>
    </article>
  );
}

export default function EnglishDirectory() {
  const pathname = typeof window === "undefined" ? "/en" : window.location.pathname;
  const locale = pathname === "/fr" || pathname.startsWith("/fr/") ? "fr" : "en";
  const isFrench = locale === "fr";
  const homeCopy = isFrench ? frenchHome : englishHome;
  const categories = isFrench ? frenchCategories : englishCategories;
  const [, englishCategoryParams] = useRoute("/en/fonts/:category");
  const [, frenchCategoryParams] = useRoute("/fr/fonts/:category");
  const categorySlug = englishCategoryParams?.category || frenchCategoryParams?.category;
  const category = categories.find((item) => item.slug === categorySlug);
  const invalidCategory = Boolean(categorySlug && !category);
  const [search, setSearch] = useState("");
  const [previewText, setPreviewText] = useState("بسم الله الرحمن الرحيم");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, categorySlug]);

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(PAGE_SIZE),
  });
  if (category) queryParams.set("category", category.arabicCategory);
  if (search.trim()) queryParams.set("q", search.trim());

  const { data, isLoading, isError, refetch } = useQuery<PagedFontResponse>({
    queryKey: [`/api/fonts?${queryParams.toString()}`],
    enabled: !invalidCategory,
  });

  const fonts = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const title = category?.title ?? homeCopy.title;
  const description = category?.description ?? homeCopy.description;
  const path = category ? `/${locale}/fonts/${category.slug}` : `/${locale}`;
  const arabicPath = category ? `/fonts/${category.slug}` : "/";
  const heading = category?.name ?? homeCopy.heading;
  const intro = category?.intro ?? homeCopy.intro;
  const faqs = category?.faqs ?? homeCopy.faqs;
  const alternates = [
    { lang: "en", href: `https://xfontat.com/${category ? `en/fonts/${category.slug}` : "en"}` },
    { lang: "fr", href: `https://xfontat.com/${category ? `fr/fonts/${category.slug}` : "fr"}` },
    { lang: "ar", href: `https://xfontat.com${arabicPath}` },
    { lang: "x-default", href: `https://xfontat.com${arabicPath}` },
  ];

  const schema = invalidCategory
    ? undefined
    : {
        "@context": "https://schema.org",
        "@type": category ? "CollectionPage" : "WebPage",
        name: heading,
        description,
        url: `https://xfontat.com${path}`,
        inLanguage: locale,
        ...(category && data ? { numberOfItems: total } : {}),
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

      <header className="border-b bg-background">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link href={`/${locale}`} className="text-xl font-bold tracking-tight" aria-label={`xfontat ${locale} home`}>
            xfontat
          </Link>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm" aria-label="Font styles">
            <Link href={`/${locale}`} className="hover:underline">{homeCopy.home}</Link>
            {categories.slice(0, 5).map((item) => (
              <Link key={item.slug} href={`/${locale}/fonts/${item.slug}`} className="hover:underline">
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="flex gap-2 text-sm">
            <Link href={category ? `/en/fonts/${category.slug}` : "/en"} hrefLang="en" className="rounded-md border px-2 py-2 hover:bg-muted">EN</Link>
            <Link href={category ? `/fr/fonts/${category.slug}` : "/fr"} hrefLang="fr" className="rounded-md border px-2 py-2 hover:bg-muted">FR</Link>
            <Link href={arabicPath} hrefLang="ar" className="rounded-md border px-2 py-2 hover:bg-muted">{homeCopy.language}</Link>
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

        <section className="py-6" aria-label="Search and preview">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              {homeCopy.searchLabel}
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={homeCopy.searchPlaceholder}
                className="h-11 rounded-md border bg-background px-3 text-base font-normal"
                data-testid="english-font-search"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              {homeCopy.previewLabel}
              <input
                type="text"
                value={previewText}
                onChange={(event) => setPreviewText(event.target.value)}
                placeholder={homeCopy.previewPlaceholder}
                className="h-11 rounded-md border bg-background px-3 text-base font-normal"
                dir="auto"
                data-testid="english-font-preview"
              />
            </label>
          </div>
        </section>

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
                {isFrench ? "Résultats" : "Showing"} {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} {isFrench ? "sur" : "of"} {total} {homeCopy.results}
              </p>
              {fonts.map((font) => (
                <FontFileRow key={font.id} font={font} previewText={previewText} copy={homeCopy} locale={locale} />
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
    </div>
  );
}
