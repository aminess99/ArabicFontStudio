import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { IntlShell, FaqList, SectionList } from "@/components/IntlShell";
import { CalligraphyGrid } from "@/components/CalligraphyGrid";
import { Input } from "@/components/ui/input";
import { findArabicName, namePath, NAME_PATHS } from "@/lib/arabicNames";
import { arabicPhrases, phrasePath } from "@/lib/arabicPhrases";
import { phraseLabel } from "@/lib/intlContent";
import { tattooCopy, toolAlternates, toolPaths } from "@/lib/intlTools";
import { toolFaqSchema } from "@/lib/toolPages";

const UI = {
  en: {
    label: "Your tattoo text (Arabic, or a first name in English)", use: "Use", ideas: "Popular Arabic tattoo words",
    names: "Find your name in Arabic", keyboard: "Type Arabic with the online keyboard", faq: "Frequently asked questions",
    download: "PNG", loading: "Loading", latinHint: "Arabic tattoos need Arabic letters. Type in Arabic, pick a word below, or look up a name.",
  },
  fr: {
    label: "Texte du tatouage (en arabe, ou un prénom en français)", use: "Utiliser", ideas: "Mots arabes populaires en tatouage",
    names: "Trouver son prénom en arabe", keyboard: "Écrire en arabe avec le clavier en ligne", faq: "Questions fréquentes",
    download: "PNG", loading: "Chargement", latinHint: "Un tatouage arabe s'écrit en lettres arabes. Tapez en arabe, choisissez un mot ci-dessous ou cherchez un prénom.",
  },
} as const;

export default function TattooFonts() {
  const [location] = useLocation();
  const locale = location.startsWith("/fr") ? "fr" : "en";
  const copy = tattooCopy[locale];
  const ui = UI[locale];
  const [text, setText] = useState("صبر");
  const isLatin = /[A-Za-z]/.test(text);
  const suggestion = isLatin ? findArabicName(text) : undefined;
  const shown = isLatin ? (suggestion?.arabic ?? "") : text.trim().slice(0, 40);
  const words = arabicPhrases.filter((phrase) => phrase.kind === "word");

  const schema = useMemo(() => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: copy.heading,
        url: `https://xfontat.com${copy.path}`,
        description: copy.description,
        applicationCategory: "DesignApplication",
        operatingSystem: "Web",
        inLanguage: locale,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      toolFaqSchema(copy),
    ],
  }), [copy, locale]);

  return (
    <IntlShell locale={locale} languages={toolPaths.tattoo}>
      <SEOHead title={copy.title} description={copy.description} path={copy.path} schema={schema} lang={locale} direction="ltr" exactAlternates={toolAlternates(toolPaths.tattoo)} />
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-3 text-3xl font-bold md:text-4xl">{copy.heading}</h1>
        <p className="mb-6 leading-relaxed text-muted-foreground">{copy.intro}</p>

        <label htmlFor="tattoo-text" className="mb-2 block text-sm font-medium">{ui.label}</label>
        <Input id="tattoo-text" value={text} onChange={(event) => setText(event.target.value)} dir="auto" maxLength={60} className="mb-2 max-w-xl text-xl" />
        {isLatin && (
          <p className="mb-4 text-sm">
            {suggestion ? (
              <button type="button" onClick={() => setText(suggestion.arabic)} className="text-primary underline underline-offset-4">
                {ui.use} <span lang="ar">{suggestion.arabic}</span> ({suggestion.latin})
              </button>
            ) : (
              <span className="text-muted-foreground">{ui.latinHint}</span>
            )}
          </p>
        )}
        <div className="mb-3 flex flex-wrap gap-2">
          {words.slice(0, 10).map((phrase) => (
            <button key={phrase.slug} type="button" onClick={() => setText(phrase.arabic)} className="rounded-full border px-3 py-1 text-sm hover:bg-muted">
              {phraseLabel(phrase, locale)} <span lang="ar">{phrase.arabic}</span>
            </button>
          ))}
        </div>
        <p className="mb-6 text-sm">
          <Link href={NAME_PATHS[locale]} className="text-primary underline underline-offset-4">{ui.names}</Link>
          {" · "}
          <Link href={toolPaths.keyboard[locale]!} className="text-primary underline underline-offset-4">{ui.keyboard}</Link>
        </p>

        {shown && <CalligraphyGrid text={shown} fileName="arabic-tattoo" labels={{ download: ui.download, loading: ui.loading }} />}

        <div className="mt-12 space-y-10">
          <SectionList sections={copy.sections} />
          <section>
            <h2 className="mb-3 text-2xl font-semibold">{ui.ideas}</h2>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {words.map((phrase) => (
                <li key={phrase.slug}>
                  <Link href={phrasePath(locale, phrase.slug)} className="flex items-center justify-between gap-3 rounded-lg border px-4 py-2 hover:bg-muted">
                    <span>{phraseLabel(phrase, locale)}</span>
                    <span lang="ar" className="text-lg">{phrase.arabic}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <FaqList heading={ui.faq} faqs={copy.faqs} />
          {suggestion && (
            <p><Link href={namePath(locale, suggestion.slug)} className="text-primary underline">{suggestion.latin} →</Link></p>
          )}
        </div>
      </div>
    </IntlShell>
  );
}
