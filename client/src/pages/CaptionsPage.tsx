import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Check, Copy, Image as ImageIcon } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqList, IntlShell } from "@/components/IntlShell";
import { CAPTION_PAGES, captionImageHref, captionPath, findCaptionPage, type Locale } from "@/lib/captions";
import NotFound from "@/pages/not-found";

const UI = {
  ar: { home: "الرئيسية", copy: "نسخ", copied: "تم النسخ", image: "حمّله صورة", more: "كابشنات أخرى", faq: "أسئلة شائعة", count: "جملة" },
  en: { home: "Home", copy: "Copy", copied: "Copied", image: "Make image", more: "More captions", faq: "Frequently asked questions", count: "captions" },
  fr: { home: "Accueil", copy: "Copier", copied: "Copié", image: "Créer l'image", more: "Autres légendes", faq: "Questions fréquentes", count: "légendes" },
} as const;

function CaptionRow({ text, locale }: { text: string; locale: Locale }) {
  const ui = UI[locale];
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch {
      // Clipboard can be blocked; the text stays selectable.
    }
  };
  return (
    <li className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <p dir="rtl" lang="ar" className="text-xl leading-relaxed">{text}</p>
      <div className="flex shrink-0 gap-2 text-sm">
        <button type="button" onClick={copy} className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 hover:bg-muted">
          {done ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
          {done ? ui.copied : ui.copy}
        </button>
        <Link href={captionImageHref(locale, text)} className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-primary-foreground hover:opacity-90">
          <ImageIcon className="h-4 w-4" aria-hidden="true" />{ui.image}
        </Link>
      </div>
    </li>
  );
}

export default function CaptionsPage() {
  const [location] = useLocation();
  const locale: Locale = location.startsWith("/en/") ? "en" : location.startsWith("/fr/") ? "fr" : "ar";
  const parts = location.replace(/\/+$/, "").split("/");
  const slug = parts[parts.length - 2] === "captions" ? decodeURIComponent(parts[parts.length - 1]) : "";
  const page = findCaptionPage(slug);
  const ui = UI[locale];
  if (!page) return <NotFound />;

  const path = captionPath(locale, page.slug);
  const alternates = [
    ...(["ar", "en", "fr"] as const).map((lang) => ({ lang, href: `https://xfontat.com${captionPath(lang, page.slug)}` })),
    { lang: "x-default", href: `https://xfontat.com${captionPath("ar", page.slug)}` },
  ];
  const faqs = page.faqs[locale];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", name: page.heading[locale], description: page.description[locale], url: `https://xfontat.com${path}`, inLanguage: locale },
      { "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
    ],
  };
  const others = CAPTION_PAGES.filter((item) => item.slug !== page.slug);

  const body = (
    <div className="mx-auto max-w-4xl">
      <SEOHead title={page.title[locale]} description={page.description[locale]} path={path} schema={schema} lang={locale} direction={locale === "ar" ? "rtl" : "ltr"} exactAlternates={alternates} />
      <h1 className="mb-3 text-3xl font-bold md:text-4xl">{page.heading[locale]}</h1>
      <p className="mb-6 leading-loose text-muted-foreground">{page.intro[locale]}</p>
      <p className="mb-3 text-sm text-muted-foreground">{page.captions.length} {ui.count}</p>
      <ul className="space-y-3">{page.captions.map((text) => <CaptionRow key={text} text={text} locale={locale} />)}</ul>
      <div className="mt-10 space-y-10">
        <FaqList heading={ui.faq} faqs={faqs} />
        <section>
          <h2 className="mb-3 text-2xl font-semibold">{ui.more}</h2>
          <ul className="flex flex-wrap gap-2">
            {others.map((item) => <li key={item.slug}><Link href={captionPath(locale, item.slug)} className="inline-block rounded-full border px-3 py-1.5 text-sm hover:bg-muted">{item.name[locale]}</Link></li>)}
          </ul>
        </section>
      </div>
    </div>
  );

  if (locale !== "ar") {
    return <IntlShell locale={locale} languages={{ ar: captionPath("ar", page.slug), en: captionPath("en", page.slug), fr: captionPath("fr", page.slug) }}>{body}</IntlShell>;
  }
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <Breadcrumb items={[{ label: ui.home, href: "/" }, ...(page.slug ? [{ label: CAPTION_PAGES[0].name.ar, href: captionPath("ar", "") }] : []), { label: page.name.ar, href: path }]} />
      <main className="container mx-auto flex-1 px-4 py-8">{body}</main>
      <Footer />
    </div>
  );
}
