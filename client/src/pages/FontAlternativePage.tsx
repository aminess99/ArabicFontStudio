import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Download } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqList, IntlShell } from "@/components/IntlShell";
import { Input } from "@/components/ui/input";
import {
  FONT_ALTERNATIVES, alternativeCopy, alternativePath, alternativesHubCopy, alternativesHubPath, altDisplayName,
  findAlternative, resolveAlternatives, type Locale, type ResolvedAlternative,
} from "@/lib/fontAlternatives";
import NotFound from "@/pages/not-found";
import type { Font } from "@shared/schema";

const UI = {
  ar: { home: "الرئيسية", sample: "اكتب نصاً للمعاينة", defaultText: "خط عربي جميل", page: "صفحة الخط", download: "تحميل", family: "كل الأوزان", faq: "أسئلة شائعة", others: "بدائل لخطوط أخرى", weights: "أوزان", original: "عن الخط الأصلي", picks: "الخطوط البديلة", note: "الخطوط البديلة منشورة بترخيص SIL Open Font License الذي يسمح بالاستخدام التجاري. التشابه تقريبي.", loading: "جارٍ التحميل", all: "كل البدائل" },
  en: { home: "Home", sample: "Type text to preview", defaultText: "خط عربي جميل", page: "Font page", download: "Download", family: "All weights", faq: "Frequently asked questions", others: "Alternatives to other fonts", weights: "weights", original: "About the original font", picks: "Alternative fonts", note: "The alternatives are published under the SIL Open Font License, which allows commercial use. The match is approximate.", loading: "Loading", all: "All alternatives" },
  fr: { home: "Accueil", sample: "Tapez un texte pour l'aperçu", defaultText: "خط عربي جميل", page: "Page de la police", download: "Télécharger", family: "Toutes les graisses", faq: "Questions fréquentes", others: "Alternatives à d'autres polices", weights: "graisses", original: "À propos de la police d'origine", picks: "Polices alternatives", note: "Les alternatives sont publiées sous licence SIL Open Font License, qui autorise l'usage commercial. La ressemblance est approximative.", loading: "Chargement", all: "Toutes les alternatives" },
} as const;

const fontPath = (locale: Locale, font: Font) => (locale === "ar" ? `/font/${font.slug}` : `/${locale}/font/${font.slug}`);

function AltCard({ item, locale, text }: { item: ResolvedAlternative<Font>; locale: Locale; text: string }) {
  const ui = UI[locale];
  const familyName = `xf-alt-${item.font.id}`;
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const url = item.font.fileUrl.split("/").map((part) => encodeURIComponent(part)).join("/");
    new FontFace(familyName, `url("${url}")`).load()
      .then((face) => { document.fonts.add(face); if (!cancelled) setReady(true); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [item.font.fileUrl, familyName]);
  return (
    <li className="rounded-lg border bg-card p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold">{altDisplayName(item, locale)}{item.weights > 1 ? <span className="ms-2 text-sm font-normal text-muted-foreground">{item.weights} {ui.weights}</span> : null}</h3>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href={fontPath(locale, item.font)} className="rounded-md border px-3 py-1.5 hover:bg-muted">{ui.page}</Link>
          {item.familyPath && <Link href={item.familyPath} className="rounded-md border px-3 py-1.5 hover:bg-muted">{ui.family}</Link>}
          <a href={item.font.fileUrl} download={item.font.fileName} className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-primary-foreground hover:opacity-90">
            <Download className="h-4 w-4" aria-hidden="true" />{ui.download}
          </a>
        </div>
      </div>
      <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{item.blurb[locale]}</p>
      <p dir="rtl" lang="ar" className="min-h-[3.5rem] break-words text-3xl leading-relaxed md:text-4xl" style={{ fontFamily: ready ? `"${familyName}"` : "inherit", opacity: ready ? 1 : 0.4 }}>
        {text || ui.defaultText}
      </p>
    </li>
  );
}

export default function FontAlternativePage() {
  const [location] = useLocation();
  const locale: Locale = location.startsWith("/en/") ? "en" : location.startsWith("/fr/") ? "fr" : "ar";
  const parts = location.replace(/\/+$/, "").split("/");
  const slug = parts[parts.length - 2] === "alternative" ? decodeURIComponent(parts[parts.length - 1]) : "";
  const ui = UI[locale];
  const [text, setText] = useState("");
  const { data: fonts = [], isLoading } = useQuery<Font[]>({ queryKey: ["/api/fonts"] });
  const original = slug ? findAlternative(slug) : undefined;
  const items = useMemo(() => (original ? resolveAlternatives(original, fonts, locale) : []), [original, fonts, locale]);

  if (slug && !original) return <NotFound />;
  if (isLoading && original) return <div className="min-h-screen bg-background" aria-label={ui.loading} />;
  if (original && items.length === 0) return <NotFound />;

  const direction = locale === "ar" ? "rtl" : "ltr";
  const langs = (build: (lang: Locale) => string) => ({ ar: build("ar"), en: build("en"), fr: build("fr") });
  const path = original ? alternativePath(locale, original.slug) : alternativesHubPath(locale);
  const alternates = [
    ...(["ar", "en", "fr"] as const).map((lang) => ({ lang, href: `https://xfontat.com${original ? alternativePath(lang, original.slug) : alternativesHubPath(lang)}` })),
    { lang: "x-default", href: `https://xfontat.com${original ? alternativePath("ar", original.slug) : alternativesHubPath("ar")}` },
  ];
  const copy = original ? alternativeCopy(original, locale, items.length, items.map((item) => altDisplayName(item, locale))) : undefined;
  const hub = alternativesHubCopy(locale);
  const head = copy ?? hub;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", name: head.heading, description: head.description, url: `https://xfontat.com${path}`, inLanguage: locale },
      ...(copy ? [{ "@type": "FAQPage", mainEntity: copy.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }] : []),
    ],
  };
  const others = FONT_ALTERNATIVES.filter((item) => item.slug !== original?.slug);

  const body = (
    <div className="mx-auto max-w-5xl">
      <SEOHead title={head.title} description={head.description} path={path} schema={schema} lang={locale} direction={direction} exactAlternates={alternates} />
      <h1 className="mb-3 text-3xl font-bold md:text-4xl">{head.heading}</h1>
      <p className="mb-6 leading-loose text-muted-foreground">{head.intro}</p>
      {original ? (
        <>
          <label htmlFor="alt-text" className="mb-2 block text-sm font-medium">{ui.sample}</label>
          <Input id="alt-text" value={text} onChange={(event) => setText(event.target.value)} placeholder={ui.defaultText} dir="auto" maxLength={80} className="mb-6 max-w-xl text-lg" />
          <section aria-labelledby="alt-picks">
            <h2 id="alt-picks" className="mb-3 text-2xl font-semibold">{ui.picks}</h2>
            <ul className="space-y-3">{items.map((item) => <AltCard key={item.key} item={item} locale={locale} text={text} />)}</ul>
            <p className="mt-4 text-sm text-muted-foreground">{ui.note}</p>
          </section>
          <div className="mt-10 space-y-10">
            <FaqList heading={ui.faq} faqs={copy!.faqs} />
            <section>
              <h2 className="mb-3 text-2xl font-semibold">{ui.others}</h2>
              <ul className="flex flex-wrap gap-2">
                {others.map((item) => <li key={item.slug}><Link href={alternativePath(locale, item.slug)} className="inline-block rounded-full border px-3 py-1.5 text-sm hover:bg-muted">{locale === "ar" ? item.nameAr : item.name}</Link></li>)}
              </ul>
            </section>
            <p><Link href={alternativesHubPath(locale)} className="text-primary underline underline-offset-4">{ui.all}</Link></p>
          </div>
        </>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {FONT_ALTERNATIVES.map((item) => (
            <li key={item.slug} className="rounded-lg border bg-card p-4">
              <Link href={alternativePath(locale, item.slug)} className="font-semibold text-primary hover:underline">{locale === "ar" ? `${item.nameAr} (${item.name})` : item.name}</Link>
              <p className="mt-1 text-sm text-muted-foreground">{item.look[locale].split(/[.،]/)[0]}.</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  if (locale !== "ar") {
    return <IntlShell locale={locale} languages={langs((lang) => (original ? alternativePath(lang, original.slug) : alternativesHubPath(lang)))}>{body}</IntlShell>;
  }
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <Breadcrumb items={[{ label: ui.home, href: "/" }, ...(original ? [{ label: hub.heading, href: alternativesHubPath("ar") }] : []), { label: original ? `${original.nameAr}` : hub.heading, href: path }]} />
      <main className="container mx-auto flex-1 px-4 py-8">{body}</main>
      <Footer />
    </div>
  );
}
