import { useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { Copy } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { IntlShell, FaqList, SectionList } from "@/components/IntlShell";
import { CalligraphyGrid } from "@/components/CalligraphyGrid";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { arabicNames, findArabicName, getArabicName, namePath, relatedNames, NAME_PATHS } from "@/lib/arabicNames";
import { arabicPhrases, getArabicPhrase, phrasePath, PHRASE_PATHS } from "@/lib/arabicPhrases";
import { spellArabic } from "@/lib/arabicLetters";
import { nameContent, phraseContent, phraseLabel, type DetailContent } from "@/lib/intlContent";
import { namesHubCopy, phrasesHubCopy, toolAlternates, toolPaths } from "@/lib/intlTools";
import NotFound from "@/pages/not-found";

type Locale = "en" | "fr";

const UI = {
  en: {
    faq: "Frequently asked questions", home: "Home", letters: (word: string) => `How to write ${word} in Arabic, letter by letter`,
    lettersNote: "Arabic is read from right to left. Letters marked \"joins\" connect to the next letter; the others are followed by a small gap.",
    joins: "joins", calligraphy: (word: string) => `${word} in Arabic calligraphy`, calligraphyNote: "Each style is a real Arabic font under the SIL Open Font License. Download a transparent PNG for gifts, jewellery or a tattoo design.",
    download: "PNG", loading: "Loading", copy: "Copy Arabic", copied: "Copied", related: "Related names", morePhrases: "More Arabic words and phrases",
    tools: "More Arabic tools", search: "Search a name", searchPlaceholder: "Type a name, e.g. Sarah", female: "Girls' names", male: "Boys' names",
    noMatch: "Not in our list yet. Spell it with the Arabic font generator or the Arabic keyboard.", allNames: "All names", allPhrases: "All phrases",
    kinds: { religious: "Islamic expressions", greeting: "Greetings", word: "Words for tattoos and art" },
  },
  fr: {
    faq: "Questions fréquentes", home: "Accueil", letters: (word: string) => `Écrire ${word} en arabe, lettre par lettre`,
    lettersNote: "L'arabe se lit de droite à gauche. Les lettres marquées « se lie » rejoignent la suivante ; les autres sont suivies d'un petit espace.",
    joins: "se lie", calligraphy: (word: string) => `${word} en calligraphie arabe`, calligraphyNote: "Chaque style est une vraie police arabe sous licence SIL Open Font License. Téléchargez un PNG transparent pour un cadeau, un bijou ou un tatouage.",
    download: "PNG", loading: "Chargement", copy: "Copier l'arabe", copied: "Copié", related: "Prénoms proches", morePhrases: "Autres mots et expressions arabes",
    tools: "Autres outils arabes", search: "Chercher un prénom", searchPlaceholder: "Tapez un prénom, ex. Sarah", female: "Prénoms féminins", male: "Prénoms masculins",
    noMatch: "Pas encore dans notre liste. Écrivez-le avec le générateur de police arabe ou le clavier arabe.", allNames: "Tous les prénoms", allPhrases: "Toutes les expressions",
    kinds: { religious: "Expressions islamiques", greeting: "Salutations", word: "Mots pour tatouages et décoration" },
  },
} as const;

function useLocale(): Locale {
  const [location] = useLocation();
  return location.startsWith("/fr") ? "fr" : "en";
}

function ToolLinks({ locale }: { locale: Locale }) {
  const links = locale === "fr"
    ? [[toolPaths.keyboard.fr, "Clavier arabe en ligne"], [toolPaths.generator.fr, "Générateur de police arabe"], [toolPaths.tattoo.fr, "Polices arabes pour tatouage"], ["/fr", "Bibliothèque de polices arabes"]]
    : [[toolPaths.keyboard.en, "Online Arabic keyboard"], [toolPaths.generator.en, "Arabic font generator"], [toolPaths.tattoo.en, "Arabic tattoo fonts"], ["/en", "Arabic font library"]];
  return (
    <section>
      <h2 className="mb-3 text-2xl font-semibold">{UI[locale].tools}</h2>
      <ul className="flex flex-wrap gap-2">
        {links.map(([href, label]) => (
          <li key={href}><Link href={href!} className="inline-block rounded-full border px-4 py-2 text-sm hover:bg-muted">{label}</Link></li>
        ))}
      </ul>
    </section>
  );
}

function Breadcrumbs({ items }: { items: Array<[string, string?]> }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
      <ol className="flex flex-wrap gap-1">
        {items.map(([label, href], index) => (
          <li key={label} className="flex items-center gap-1">
            {index > 0 && <span aria-hidden="true">/</span>}
            {href ? <Link href={href} className="hover:text-foreground hover:underline">{label}</Link> : <span>{label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function breadcrumbSchema(items: Array<[string, string]>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], index) => ({ "@type": "ListItem", position: index + 1, name, item: `https://xfontat.com${path}` })),
  };
}

function faqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };
}

function DetailView({ locale, content, arabic, word, showLetters, fileName, children }: {
  locale: Locale;
  content: DetailContent;
  arabic: string;
  word: string;
  showLetters: boolean;
  fileName: string;
  children?: React.ReactNode;
}) {
  const ui = UI[locale];
  const { toast } = useToast();
  const letters = showLetters ? spellArabic(arabic, locale) : [];
  return (
    <>
      <h1 className="mb-3 text-3xl font-bold md:text-4xl">{content.heading}</h1>
      <p className="mb-6 max-w-3xl leading-relaxed text-muted-foreground">{content.intro}</p>

      <div className="mb-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="grid place-items-center rounded-xl border bg-card p-6 text-center">
          <p lang="ar" dir="rtl" className="text-6xl leading-tight md:text-7xl" style={{ fontFamily: "'Cairo', serif" }}>{arabic}</p>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(arabic).then(() => toast({ title: ui.copied }))}
            className="mt-4 inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
          >
            <Copy className="h-4 w-4" aria-hidden="true" /> {ui.copy}
          </button>
        </div>
        <dl className="grid content-start gap-x-4 gap-y-3 rounded-xl border p-5 text-sm sm:grid-cols-[auto_1fr]">
          {content.facts.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="font-medium text-muted-foreground">{label}</dt>
              <dd className="min-w-0" dir="auto">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {letters.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-2 text-2xl font-semibold">{ui.letters(word)}</h2>
          <p className="mb-4 text-sm text-muted-foreground">{ui.lettersNote}</p>
          <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {letters.map((letter, index) => (
              <li key={`${letter.char}-${index}`} className="flex items-center gap-3 rounded-lg border p-3">
                <span className="text-xs text-muted-foreground">{index + 1}</span>
                <span lang="ar" className="w-10 text-center text-3xl" style={{ fontFamily: "'Cairo', serif" }}>{letter.char}</span>
                <span className="min-w-0 text-sm">
                  <span className="font-medium">{letter.name}</span>
                  {index < letters.length - 1 && letter.joinsNext && <span className="ms-2 rounded bg-muted px-1.5 py-0.5 text-[10px]">{ui.joins}</span>}
                  <span className="block text-muted-foreground">{letter.sound}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="mb-10">
        <h2 className="mb-2 text-2xl font-semibold">{ui.calligraphy(word)}</h2>
        <p className="mb-4 text-sm text-muted-foreground">{ui.calligraphyNote}</p>
        <CalligraphyGrid text={arabic} fileName={fileName} labels={{ download: ui.download, loading: ui.loading }} />
      </section>

      <div className="space-y-10">
        <SectionList sections={content.sections} />
        <FaqList heading={ui.faq} faqs={content.faqs} />
        {children}
        <ToolLinks locale={locale} />
      </div>
    </>
  );
}

function NamesHub({ locale }: { locale: Locale }) {
  const ui = UI[locale];
  const copy = namesHubCopy[locale];
  const [query, setQuery] = useState("");
  const match = query.trim() ? findArabicName(query) : undefined;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? arabicNames.filter((name) => [name.latin, ...(name.aliases || [])].some((item) => item.toLowerCase().includes(q)) || name.arabic.includes(q)) : arabicNames;
    return [...list].sort((a, b) => a.latin.localeCompare(b.latin));
  }, [query]);
  const schema = useMemo(() => ({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", name: copy.heading, description: copy.description, url: `https://xfontat.com${copy.path}`, inLanguage: locale },
      breadcrumbSchema([[ui.home, `/${locale}`], [copy.heading, copy.path]]),
      faqSchema(copy.faqs),
    ],
  }), [copy, locale, ui.home]);
  return (
    <IntlShell locale={locale} languages={toolPaths.names}>
      <SEOHead title={copy.title} description={copy.description} path={copy.path} schema={schema} lang={locale} direction="ltr" exactAlternates={toolAlternates(toolPaths.names)} />
      <div className="mx-auto max-w-5xl">
        <Breadcrumbs items={[[ui.home, `/${locale}`], [copy.heading]]} />
        <h1 className="mb-3 text-3xl font-bold md:text-4xl">{copy.heading}</h1>
        <p className="mb-6 leading-relaxed text-muted-foreground">{copy.intro}</p>
        <label className="mb-2 block text-sm font-medium" htmlFor="name-search">{ui.search}</label>
        <Input id="name-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={ui.searchPlaceholder} className="mb-3 max-w-md text-base" />
        {match && (
          <p className="mb-4">
            <Link href={namePath(locale, match.slug)} className="text-lg font-semibold text-primary underline underline-offset-4">
              {match.latin} → <span lang="ar">{match.arabic}</span>
            </Link>
          </p>
        )}
        {query.trim() && filtered.length === 0 && !match && (
          <p className="mb-4 text-sm text-muted-foreground">
            {ui.noMatch}{" "}
            <Link href={`${toolPaths.generator[locale]}?text=${encodeURIComponent(query)}`} className="text-primary underline">→</Link>
          </p>
        )}
        {(["f", "m"] as const).map((gender) => {
          const list = filtered.filter((name) => name.gender === gender);
          if (list.length === 0) return null;
          return (
            <section key={gender} className="mb-8">
              <h2 className="mb-3 text-2xl font-semibold">{gender === "f" ? ui.female : ui.male}</h2>
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {list.map((name) => (
                  <li key={name.slug}>
                    <Link href={namePath(locale, name.slug)} className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2 hover:bg-muted">
                      <span className="truncate">{name.latin}</span>
                      <span lang="ar" className="text-lg" style={{ fontFamily: "'Cairo', serif" }}>{name.arabic}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
        <div className="mt-10 space-y-10">
          <SectionList sections={copy.sections} />
          <FaqList heading={ui.faq} faqs={copy.faqs} />
          <ToolLinks locale={locale} />
        </div>
      </div>
    </IntlShell>
  );
}

function NameDetail({ locale, slug }: { locale: Locale; slug: string }) {
  const ui = UI[locale];
  const name = getArabicName(slug);
  const content = useMemo(() => (name ? nameContent(name, locale) : null), [name, locale]);
  const schema = useMemo(() => content && name ? ({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", name: content.heading, description: content.description, url: `https://xfontat.com${namePath(locale, name.slug)}`, inLanguage: locale },
      breadcrumbSchema([[ui.home, `/${locale}`], [namesHubCopy[locale].heading, NAME_PATHS[locale]], [content.heading, namePath(locale, name.slug)]]),
      faqSchema(content.faqs),
    ],
  }) : undefined, [content, name, locale, ui.home]);
  if (!name || !content) return <NotFound />;
  const languages = { en: namePath("en", name.slug), fr: namePath("fr", name.slug) };
  return (
    <IntlShell locale={locale} languages={languages}>
      <SEOHead title={content.title} description={content.description} path={namePath(locale, name.slug)} schema={schema} lang={locale} direction="ltr" exactAlternates={toolAlternates(languages)} />
      <div className="mx-auto max-w-5xl">
        <Breadcrumbs items={[[ui.home, `/${locale}`], [namesHubCopy[locale].heading, NAME_PATHS[locale]], [name.latin]]} />
        <DetailView locale={locale} content={content} arabic={name.arabic} word={name.latin} showLetters fileName={`${name.slug}-in-arabic`}>
          <section>
            <h2 className="mb-3 text-2xl font-semibold">{ui.related}</h2>
            <ul className="flex flex-wrap gap-2">
              {relatedNames(name).map((item) => (
                <li key={item.slug}>
                  <Link href={namePath(locale, item.slug)} className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-muted">
                    {item.latin} <span lang="ar">{item.arabic}</span>
                  </Link>
                </li>
              ))}
              <li><Link href={NAME_PATHS[locale]} className="inline-block rounded-full border px-3 py-1.5 text-sm font-medium hover:bg-muted">{ui.allNames}</Link></li>
            </ul>
          </section>
        </DetailView>
      </div>
    </IntlShell>
  );
}

function PhrasesHub({ locale }: { locale: Locale }) {
  const ui = UI[locale];
  const copy = phrasesHubCopy[locale];
  const schema = useMemo(() => ({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", name: copy.heading, description: copy.description, url: `https://xfontat.com${copy.path}`, inLanguage: locale },
      breadcrumbSchema([[ui.home, `/${locale}`], [copy.heading, copy.path]]),
      faqSchema(copy.faqs),
    ],
  }), [copy, locale, ui.home]);
  return (
    <IntlShell locale={locale} languages={toolPaths.phrases}>
      <SEOHead title={copy.title} description={copy.description} path={copy.path} schema={schema} lang={locale} direction="ltr" exactAlternates={toolAlternates(toolPaths.phrases)} />
      <div className="mx-auto max-w-5xl">
        <Breadcrumbs items={[[ui.home, `/${locale}`], [copy.heading]]} />
        <h1 className="mb-3 text-3xl font-bold md:text-4xl">{copy.heading}</h1>
        <p className="mb-8 leading-relaxed text-muted-foreground">{copy.intro}</p>
        {(["religious", "greeting", "word"] as const).map((kind) => (
          <section key={kind} className="mb-8">
            <h2 className="mb-3 text-2xl font-semibold">{ui.kinds[kind]}</h2>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {arabicPhrases.filter((phrase) => phrase.kind === kind).map((phrase) => (
                <li key={phrase.slug}>
                  <Link href={phrasePath(locale, phrase.slug)} className="flex items-center justify-between gap-3 rounded-lg border px-4 py-3 hover:bg-muted">
                    <span className="min-w-0">
                      <span className="block font-medium">{phraseLabel(phrase, locale)}</span>
                      <span className="block truncate text-xs text-muted-foreground">{phrase[locale].meaning}</span>
                    </span>
                    <span lang="ar" dir="rtl" className="shrink-0 text-xl" style={{ fontFamily: "'Cairo', serif" }}>{phrase.arabic.split(" ").slice(0, 3).join(" ")}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <div className="mt-10 space-y-10">
          <SectionList sections={copy.sections} />
          <FaqList heading={ui.faq} faqs={copy.faqs} />
          <ToolLinks locale={locale} />
        </div>
      </div>
    </IntlShell>
  );
}

function PhraseDetail({ locale, slug }: { locale: Locale; slug: string }) {
  const ui = UI[locale];
  const phrase = getArabicPhrase(slug);
  const content = useMemo(() => (phrase ? phraseContent(phrase, locale) : null), [phrase, locale]);
  const schema = useMemo(() => content && phrase ? ({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", name: content.heading, description: content.description, url: `https://xfontat.com${phrasePath(locale, phrase.slug)}`, inLanguage: locale },
      breadcrumbSchema([[ui.home, `/${locale}`], [phrasesHubCopy[locale].heading, PHRASE_PATHS[locale]], [content.heading, phrasePath(locale, phrase.slug)]]),
      faqSchema(content.faqs),
    ],
  }) : undefined, [content, phrase, locale, ui.home]);
  if (!phrase || !content) return <NotFound />;
  const languages = { en: phrasePath("en", phrase.slug), fr: phrasePath("fr", phrase.slug) };
  const label = phraseLabel(phrase, locale);
  const others = arabicPhrases.filter((item) => item.slug !== phrase.slug).slice(0, 12);
  return (
    <IntlShell locale={locale} languages={languages}>
      <SEOHead title={content.title} description={content.description} path={phrasePath(locale, phrase.slug)} schema={schema} lang={locale} direction="ltr" exactAlternates={toolAlternates(languages)} />
      <div className="mx-auto max-w-5xl">
        <Breadcrumbs items={[[ui.home, `/${locale}`], [phrasesHubCopy[locale].heading, PHRASE_PATHS[locale]], [label]]} />
        <DetailView locale={locale} content={content} arabic={phrase.arabic} word={label} showLetters={!phrase.arabic.includes(" ")} fileName={`${phrase.slug}-in-arabic`}>
          <section>
            <h2 className="mb-3 text-2xl font-semibold">{ui.morePhrases}</h2>
            <ul className="flex flex-wrap gap-2">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link href={phrasePath(locale, item.slug)} className="inline-block rounded-full border px-3 py-1.5 text-sm hover:bg-muted">{phraseLabel(item, locale)}</Link>
                </li>
              ))}
              <li><Link href={PHRASE_PATHS[locale]} className="inline-block rounded-full border px-3 py-1.5 text-sm font-medium hover:bg-muted">{ui.allPhrases}</Link></li>
            </ul>
          </section>
        </DetailView>
      </div>
    </IntlShell>
  );
}

export function NamesPage() {
  const locale = useLocale();
  const [, enParams] = useRoute<{ slug: string }>(`${NAME_PATHS.en}/:slug`);
  const [, frParams] = useRoute<{ slug: string }>(`${NAME_PATHS.fr}/:slug`);
  const slug = (locale === "fr" ? frParams : enParams)?.slug;
  return slug ? <NameDetail locale={locale} slug={decodeURIComponent(slug)} /> : <NamesHub locale={locale} />;
}

export function PhrasesPage() {
  const locale = useLocale();
  const [, enParams] = useRoute<{ slug: string }>(`${PHRASE_PATHS.en}/:slug`);
  const [, frParams] = useRoute<{ slug: string }>(`${PHRASE_PATHS.fr}/:slug`);
  const slug = (locale === "fr" ? frParams : enParams)?.slug;
  return slug ? <PhraseDetail locale={locale} slug={decodeURIComponent(slug)} /> : <PhrasesHub locale={locale} />;
}
