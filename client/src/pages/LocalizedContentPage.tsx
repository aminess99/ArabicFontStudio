import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SEOHead } from "@/components/SEOHead";
import { getCollectionBySlug } from "@/lib/collectionsData";
import { localizedCollections, localizedStaticPages } from "@/lib/localizedPagesContent";
import { englishCategories, frenchCategories } from "@/lib/internationalContent";
import { blogPosts } from "@/lib/blogData";
import { fullBlogTranslations, localizedBlogPosts } from "@/lib/blogTranslations";
import { renderMarkdownToHtml } from "@shared/markdown";
import { generateFontFamily, loadFont } from "@/lib/fontLoader";
import type { Font } from "@shared/schema";

function categoryLabel(locale: "en" | "fr", arabicCategory: string) {
  const categories = locale === "fr" ? frenchCategories : englishCategories;
  return categories.find((category) => category.arabicCategory === arabicCategory)?.name || arabicCategory;
}

function routeLanguagePath(path: string, locale: "en" | "fr") {
  return `/${locale}${path === "/" ? "" : path}`;
}

function LocalizedHeader({ locale, path }: { locale: "en" | "fr"; path: string }) {
  const otherLocale = locale === "en" ? "fr" : "en";
  const arabicPath = path;
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href={`/${locale}`} className="text-xl font-bold">xfontat</Link>
        <nav className="flex flex-wrap gap-4 text-sm" aria-label={locale === "fr" ? "Navigation principale" : "Main navigation"}>
          <Link href={`/${locale}`}>{locale === "fr" ? "Accueil" : "Home"}</Link>
          <Link href={`/${locale}/fonts/kufi`}>Kufi</Link>
          <Link href={`/${locale}/fonts/naskh`}>Naskh</Link>
          <Link href={`/${locale}/blog`}>{locale === "fr" ? "Blog" : "Blog"}</Link>
        </nav>
        <div className="flex gap-2 text-sm">
          <Link href={routeLanguagePath(path, otherLocale)} hrefLang={otherLocale} className="rounded-md border px-2 py-2">
            {otherLocale.toUpperCase()}
          </Link>
          <Link href={arabicPath} hrefLang="ar" className="rounded-md border px-2 py-2">العربية</Link>
        </div>
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

function FontFileLink({ font, locale }: { font: Font; locale: "en" | "fr" }) {
  const label = locale === "fr";
  return (
    <article className="flex flex-wrap items-center justify-between gap-4 border-b py-4">
      <div>
        <h2 className="font-semibold">{font.name}</h2>
        <p className="text-sm text-muted-foreground" lang="ar" dir="rtl">{font.nameArabic}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {label ? "Format" : "Format"}: {font.fileFormat || "—"}
          {" · "}
          {label ? "Licence" : "License"}: {font.license || font.licenseNotice || (label ? "à vérifier à la source" : "check the source")}
        </p>
      </div>
      <a className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" href={font.fileUrl} download={font.fileName}>
        {label ? "Télécharger" : "Download"}
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

  const { data: font, isLoading: fontLoading } = useQuery<Font>({
    queryKey: [`/api/fonts/by-slug/${fontSlug}`],
    enabled: Boolean(fontSlug),
    retry: false,
  });
  const { data: collectionFonts = [], isLoading: collectionLoading } = useQuery<Font[]>({
    queryKey: [`/api/fonts?categories=${categoriesParam}`],
    enabled: Boolean(categoriesParam),
  });

  useEffect(() => {
    if (font) loadFont(generateFontFamily(font.name), font.fileUrl);
  }, [font]);

  const canonicalPath = routeLanguagePath(rawPath, locale);
  const arabicPath = rawPath;
  const currentLabel = locale === "fr";
  const alternates = [
    { lang: "en", href: `https://xfontat.com${routeLanguagePath(rawPath, "en")}` },
    { lang: "fr", href: `https://xfontat.com${routeLanguagePath(rawPath, "fr")}` },
    { lang: "ar", href: `https://xfontat.com${arabicPath}` },
  ];

  let title = staticPage?.title || (currentLabel ? "xfontat" : "xfontat");
  let description = staticPage?.description || "";
  if (font) {
    title = `${font.name} — ${currentLabel ? "police arabe" : "Arabic font"} | xfontat`;
    description = currentLabel
      ? `Prévisualisez ${font.name}, consultez son format et sa licence, puis téléchargez le fichier.`
      : `Preview ${font.name}, review its format and license, and download the file.`;
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

  const schema = {
    "@context": "https://schema.org",
    "@type": font ? "CreativeWork" : "WebPage",
    name: title,
    description,
    url: `https://xfontat.com${canonicalPath}`,
    inLanguage: locale,
  };

  const pageTitle = staticPage?.title;
  const contactForm = staticPage && "form" in staticPage ? staticPage.form : [];
  const notFound = !fontSlug && !collectionSlug && !staticPage && !isDesign && !isBlogIndex && !(blogPost && localizedBlogPost);

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
      <LocalizedHeader locale={locale} path={rawPath} />
      <main className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
        {fontSlug ? (
          fontLoading ? <p>{currentLabel ? "Chargement…" : "Loading…"}</p> : !font ? (
            <section><h1 className="text-3xl font-bold">{currentLabel ? "Police introuvable" : "Font not found"}</h1><Link className="mt-4 inline-block underline" href={`/${locale}`}>{currentLabel ? "Retour à l’accueil" : "Return home"}</Link></section>
          ) : (
            <article>
              <nav className="mb-5 text-sm text-muted-foreground">
                <Link href={`/${locale}`}>{currentLabel ? "Accueil" : "Home"}</Link>
                {" / "}
                <Link href={`/${locale}/fonts/${englishCategories.find((item) => item.arabicCategory === font.category)?.slug || "kufi"}`}>
                  {categoryLabel(locale, font.category)}
                </Link>
              </nav>
              <h1 className="text-3xl font-bold">{font.name}</h1>
              <p className="mt-1 text-muted-foreground" lang="ar" dir="rtl">{font.nameArabic}</p>
              <label className="mt-7 grid gap-2 text-sm font-medium">
                {currentLabel ? "Texte de prévisualisation" : "Preview text"}
                <input className="rounded-md border bg-background px-3 py-2" value={previewText} onChange={(event) => setPreviewText(event.target.value)} dir="auto" />
              </label>
              <p
                className="my-8 rounded-lg bg-muted/40 p-6 text-4xl leading-relaxed"
                lang="ar"
                dir="rtl"
                style={{ fontFamily: generateFontFamily(font.name) }}
              >
                {previewText}
              </p>
              <dl className="grid gap-4 rounded-lg border p-5 sm:grid-cols-2">
                <div><dt className="text-sm text-muted-foreground">{currentLabel ? "Catégorie" : "Category"}</dt><dd>{categoryLabel(locale, font.category)}</dd></div>
                <div><dt className="text-sm text-muted-foreground">{currentLabel ? "Format" : "Format"}</dt><dd>{font.fileFormat || "—"}</dd></div>
                <div><dt className="text-sm text-muted-foreground">{currentLabel ? "Designer" : "Designer"}</dt><dd>{font.designer || "—"}</dd></div>
                <div><dt className="text-sm text-muted-foreground">{currentLabel ? "Licence" : "License"}</dt><dd>{font.license || font.licenseNotice || (currentLabel ? "Consultez la source" : "Check the source")}</dd></div>
                {font.sourceUrl && <div><dt className="text-sm text-muted-foreground">{currentLabel ? "Source" : "Source"}</dt><dd><a className="underline" href={font.sourceUrl} target="_blank" rel="noreferrer">{currentLabel ? "Consulter la source" : "View source"}</a></dd></div>}
              </dl>
              <a className="mt-6 inline-flex rounded-md bg-primary px-5 py-3 font-medium text-primary-foreground" href={font.fileUrl} download={font.fileName}>
                {currentLabel ? "Télécharger le fichier" : "Download file"}
              </a>
            </article>
          )
        ) : translatedCollection && collectionData ? (
          <section>
            <h1 className="text-3xl font-bold">{translatedCollection.title}</h1>
            <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">{translatedCollection.description}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {translatedCollection.useCases.map((use) => <li key={use} className="rounded-md bg-muted px-3 py-1 text-sm">{use}</li>)}
            </ul>
            <div className="mt-7">
              {collectionLoading ? <p>{currentLabel ? "Chargement des fichiers…" : "Loading font files…"}</p> : collectionFonts.map((item) => <FontFileLink key={item.id} font={item} locale={locale} />)}
            </div>
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
