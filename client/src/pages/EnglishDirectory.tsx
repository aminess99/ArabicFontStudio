import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SEOHead } from "@/components/SEOHead";
import { generateFontFamily, loadFont } from "@/lib/fontLoader";
import { englishCategories, englishHome, getEnglishCategory } from "@/lib/internationalContent";
import type { Font } from "@shared/schema";

const PAGE_SIZE = 15;

interface PagedFontResponse {
  data: Font[];
  total: number;
  page: number;
  limit: number;
}

function FontFileRow({ font, previewText }: { font: Font; previewText: string }) {
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
          <h2 className="font-semibold break-words">{font.name || font.nameArabic}</h2>
          {font.nameArabic && (
            <p className="text-sm text-muted-foreground mt-1" lang="ar" dir="rtl">
              {font.nameArabic}
            </p>
          )}
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
              License: {license || englishHome.licenseUnknown}
            </span>
            {font.sourceUrl && (
              <a
                href={font.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                {englishHome.source}
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
          {englishHome.download}
        </a>
      </div>
    </article>
  );
}

export default function EnglishDirectory() {
  const [, categoryParams] = useRoute("/en/fonts/:category");
  const categorySlug = categoryParams?.category;
  const category = getEnglishCategory(categorySlug);
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
  const title = category?.title ?? englishHome.title;
  const description = category?.description ?? englishHome.description;
  const path = category ? `/en/fonts/${category.slug}` : "/en";
  const arabicPath = category ? `/fonts/${category.slug}` : "/";
  const heading = category?.name ?? englishHome.heading;
  const intro = category?.intro ?? englishHome.intro;
  const faqs = category?.faqs ?? englishHome.faqs;
  const alternates = [
    { lang: "en", href: `https://xfontat.com${path}` },
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
        inLanguage: "en",
        ...(category && data ? { numberOfItems: total } : {}),
      };

  if (invalidCategory) {
    return (
      <main className="min-h-screen bg-background px-4 py-20 text-center" dir="ltr">
        <SEOHead
          title="Category not found | xfontat"
          description="The requested Arabic font category was not found."
          path={`/en/fonts/${categorySlug}`}
          lang="en"
          direction="ltr"
        />
        <h1 className="text-3xl font-bold">Category not found</h1>
        <Link href="/en" className="mt-5 inline-block underline underline-offset-4">
          Return to the English font directory
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
        lang="en"
        direction="ltr"
        alternates={alternates}
      />

      <header className="border-b bg-background">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link href="/en" className="text-xl font-bold tracking-tight" aria-label="xfontat English home">
            xfontat
          </Link>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm" aria-label="Font styles">
            <Link href="/en" className="hover:underline">{englishHome.home}</Link>
            {englishCategories.slice(0, 5).map((item) => (
              <Link key={item.slug} href={`/en/fonts/${item.slug}`} className="hover:underline">
                {item.name}
              </Link>
            ))}
          </nav>
          <Link
            href={arabicPath}
            hrefLang="ar"
            className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
          >
            {englishHome.language}
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-10">
        <nav className="mb-5 flex flex-wrap gap-2" aria-label={englishHome.allCategories}>
          {englishCategories.map((item) => (
            <Link
              key={item.slug}
              href={`/en/fonts/${item.slug}`}
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
              <h2 className="text-xl font-semibold">{englishHome.aboutHeading}</h2>
              <p className="mt-2 leading-7 text-muted-foreground">{englishHome.about}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{englishHome.licenseHeading}</h2>
              <p className="mt-2 leading-7 text-muted-foreground">{englishHome.license}</p>
            </div>
          </section>
        )}

        <section className="py-6" aria-label="Search and preview">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              {englishHome.searchLabel}
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={englishHome.searchPlaceholder}
                className="h-11 rounded-md border bg-background px-3 text-base font-normal"
                data-testid="english-font-search"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              {englishHome.previewLabel}
              <input
                type="text"
                value={previewText}
                onChange={(event) => setPreviewText(event.target.value)}
                placeholder={englishHome.previewPlaceholder}
                className="h-11 rounded-md border bg-background px-3 text-base font-normal"
                dir="auto"
                data-testid="english-font-preview"
              />
            </label>
          </div>
        </section>

        <section aria-live="polite">
          {isLoading ? (
            <p className="py-10 text-center text-muted-foreground">{englishHome.loading}</p>
          ) : isError ? (
            <div className="py-10 text-center">
              <p className="text-muted-foreground">{englishHome.error}</p>
              <button className="mt-3 underline underline-offset-4" onClick={() => refetch()}>
                {englishHome.retry}
              </button>
            </div>
          ) : fonts.length === 0 ? (
            <p className="py-10 text-center text-muted-foreground">{englishHome.noResults}</p>
          ) : (
            <>
              <p className="border-b py-3 text-sm text-muted-foreground">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total} {englishHome.results}
              </p>
              {fonts.map((font) => (
                <FontFileRow key={font.id} font={font} previewText={previewText} />
              ))}
              {totalPages > 1 && (
                <nav className="flex items-center justify-center gap-4 py-7" aria-label="Pagination">
                  <button
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page <= 1}
                    className="rounded-md border px-4 py-2 disabled:opacity-50"
                  >
                    {englishHome.previous}
                  </button>
                  <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
                  <button
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    disabled={page >= totalPages}
                    className="rounded-md border px-4 py-2 disabled:opacity-50"
                  >
                    {englishHome.next}
                  </button>
                </nav>
              )}
            </>
          )}
        </section>

        <section className="mt-10 border-t pt-8">
          <h2 className="text-2xl font-bold">{category ? `About ${category.name} Arabic fonts` : "Common questions about Arabic fonts"}</h2>
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
