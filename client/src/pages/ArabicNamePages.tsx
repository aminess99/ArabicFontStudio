import { useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { Check, Copy } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqList, SectionList } from "@/components/IntlShell";
import { CalligraphyGrid } from "@/components/CalligraphyGrid";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { arabicNames, findArabicName, getArabicName, namePath, relatedNames, NAME_PATHS } from "@/lib/arabicNames";
import { arabicPhrases, getArabicPhrase, phrasePath, PHRASE_PATHS } from "@/lib/arabicPhrases";
import { nameContentAr, nameMeaningAr, phraseContentAr, phraseDisplayLatin, phraseTransliteration } from "@/lib/arContent";
import { phraseTextAr } from "@/lib/arabicPhrasesAr";
import { decorate } from "@/lib/zakhrafa";
import type { DetailContent } from "@/lib/intlContent";
import { namesHubCopy, phrasesHubCopy, toolAlternates, toolPaths } from "@/lib/intlTools";
import NotFound from "@/pages/not-found";

const ORIGIN = "https://xfontat.com";

function pageSchema(type: string, content: { heading: string; description: string }, path: string, crumbs: Array<[string, string]>, faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": type, name: content.heading, description: content.description, url: `${ORIGIN}${path}`, inLanguage: "ar" },
      { "@type": "BreadcrumbList", itemListElement: crumbs.map(([name, href], index) => ({ "@type": "ListItem", position: index + 1, name, item: `${ORIGIN}${href}` })) },
      { "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
    ],
  };
}

function Shell({ crumbs, children }: { crumbs: Array<{ label: string; href: string }>; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <Breadcrumb items={crumbs} />
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

function ToolLinks() {
  const links: Array<[string, string]> = [
    [toolPaths.zakhrafa.ar!, "زخرفة الأسماء"],
    [toolPaths.generator.ar!, "كتابة الاسم بالخط العربي صورة"],
    [toolPaths.tattoo.ar!, "خطوط تاتو عربية"],
    [toolPaths.keyboard.ar!, "كيبورد عربي اونلاين"],
    ["/", "مكتبة الخطوط العربية"],
  ];
  return (
    <section>
      <h2 className="mb-3 text-2xl font-semibold">أدوات أخرى</h2>
      <ul className="flex flex-wrap gap-2">
        {links.map(([href, label]) => (
          <li key={href}><Link href={href} className="inline-block rounded-full border px-4 py-2 text-sm hover:bg-muted">{label}</Link></li>
        ))}
      </ul>
    </section>
  );
}

// Ready-made decorated forms of the text, copied on tap.
function DecoratedList({ texts, heading }: { texts: string[]; heading: string }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState<string | null>(null);
  const items = useMemo(() => texts.flatMap((text) => decorate(text).slice(0, 8)), [texts]);
  const copy = (value: string) => {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(value);
      toast({ title: "تم النسخ", description: value });
      setTimeout(() => setCopied((current) => (current === value ? null : current)), 1500);
    });
  };
  return (
    <section className="mb-10">
      <h2 className="mb-2 text-2xl font-semibold">{heading}</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        اضغط على أي شكل لنسخه. لمزيد من الأشكال استخدم <Link href={toolPaths.zakhrafa.ar!} className="text-primary underline underline-offset-4">أداة زخرفة الأسماء</Link>.
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.value}>
            <button type="button" onClick={() => copy(item.value)} className="flex w-full items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3 text-start hover:border-primary">
              <span className="break-all text-lg" dir="auto">{item.value}</span>
              {copied === item.value ? <Check className="h-4 w-4 shrink-0 text-primary" aria-label="تم النسخ" /> : <Copy className="h-4 w-4 shrink-0 text-muted-foreground" aria-label="نسخ" />}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DetailView({ content, arabic, latin, word, fileName, children }: {
  content: DetailContent;
  arabic: string;
  latin: string;
  word: string;
  fileName: string;
  children?: React.ReactNode;
}) {
  const { toast } = useToast();
  return (
    <>
      <h1 className="mb-3 text-3xl font-bold md:text-4xl">{content.heading}</h1>
      <p className="mb-6 max-w-3xl leading-loose text-muted-foreground">{content.intro}</p>

      <div className="mb-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="grid place-items-center rounded-xl border bg-card p-6 text-center">
          <p dir="ltr" className="text-5xl font-bold leading-tight md:text-6xl">{latin}</p>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(latin).then(() => toast({ title: "تم النسخ", description: latin }))}
            className="mt-4 inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
          >
            <Copy className="h-4 w-4" aria-hidden="true" /> نسخ الكتابة الإنجليزية
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

      <section className="mb-10">
        <h2 className="mb-2 text-2xl font-semibold">{word} بالخط العربي</h2>
        <p className="mb-4 text-sm text-muted-foreground">كل شكل خط عربي حقيقي منشور بترخيص SIL Open Font License. حمّل صورة PNG شفافة للهدايا أو القلادات أو التصاميم.</p>
        <CalligraphyGrid text={arabic} fileName={fileName} labels={{ download: "PNG", loading: "جارٍ التحميل" }} />
      </section>

      <DecoratedList texts={[arabic, latin]} heading={`زخرفة ${word}`} />

      <div className="space-y-10">
        <SectionList sections={content.sections} />
        <FaqList heading="أسئلة شائعة" faqs={content.faqs} />
        {children}
        <ToolLinks />
      </div>
    </>
  );
}

function NamesHub() {
  const copy = namesHubCopy.ar;
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? arabicNames.filter((name) => name.arabic.includes(q) || [name.latin, ...(name.aliases || [])].some((item) => item.toLowerCase().includes(q)))
      : arabicNames;
    return [...list].sort((a, b) => a.arabic.localeCompare(b.arabic, "ar"));
  }, [query]);
  const match = query.trim() && /[A-Za-z]/.test(query) ? findArabicName(query) : undefined;
  const schema = useMemo(() => pageSchema("CollectionPage", copy, copy.path, [["الرئيسية", "/"], [copy.heading, copy.path]], copy.faqs), [copy]);
  return (
    <Shell crumbs={[{ label: "الرئيسية", href: "/" }, { label: copy.heading, href: copy.path }]}>
      <SEOHead title={copy.title} description={copy.description} path={copy.path} schema={schema} exactAlternates={toolAlternates(toolPaths.names, "en")} />
      <h1 className="mb-3 text-3xl font-bold md:text-4xl">{copy.heading}</h1>
      <p className="mb-6 leading-loose text-muted-foreground">{copy.intro}</p>
      <label className="mb-2 block text-sm font-medium" htmlFor="name-search">ابحث عن اسم</label>
      <Input id="name-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="اكتب الاسم بالعربي أو بالإنجليزي" className="mb-3 max-w-md text-base" />
      {match && (
        <p className="mb-4"><Link href={namePath("ar", match.slug)} className="text-lg font-semibold text-primary underline underline-offset-4">{match.arabic} ← {match.latin}</Link></p>
      )}
      {query.trim() && filtered.length === 0 && !match && (
        <p className="mb-4 text-sm text-muted-foreground">الاسم غير موجود في القائمة بعد. جرّب كتابته بطريقة أخرى.</p>
      )}
      {(["f", "m"] as const).map((gender) => {
        const list = filtered.filter((name) => name.gender === gender);
        if (list.length === 0) return null;
        return (
          <section key={gender} className="mb-8">
            <h2 className="mb-3 text-2xl font-semibold">{gender === "f" ? "أسماء بنات" : "أسماء أولاد"}</h2>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {list.map((name) => (
                <li key={name.slug}>
                  <Link href={namePath("ar", name.slug)} className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2 hover:bg-muted">
                    <span className="truncate text-lg">{name.arabic}</span>
                    <span dir="ltr" className="text-sm text-muted-foreground">{name.latin}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      <div className="mt-10 space-y-10">
        <SectionList sections={copy.sections} />
        <FaqList heading="أسئلة شائعة" faqs={copy.faqs} />
        <ToolLinks />
      </div>
    </Shell>
  );
}

function NameDetail({ slug }: { slug: string }) {
  const name = getArabicName(slug);
  const content = useMemo(() => (name ? nameContentAr(name) : null), [name]);
  const path = name ? namePath("ar", name.slug) : "";
  const schema = useMemo(() => (content ? pageSchema("WebPage", content, path, [["الرئيسية", "/"], [namesHubCopy.ar.heading, NAME_PATHS.ar], [content.heading, path]], content.faqs) : undefined), [content, path]);
  if (!name || !content) return <NotFound />;
  const languages = { ar: path, en: namePath("en", name.slug), fr: namePath("fr", name.slug) };
  return (
    <Shell crumbs={[{ label: "الرئيسية", href: "/" }, { label: namesHubCopy.ar.heading, href: NAME_PATHS.ar }, { label: name.arabic, href: path }]}>
      <SEOHead title={content.title} description={content.description} path={path} schema={schema} exactAlternates={toolAlternates(languages, "en")} />
      <DetailView content={content} arabic={name.arabic} latin={name.latin} word={`اسم ${name.arabic}`} fileName={`${name.slug}-arabic-calligraphy`}>
        <section>
          <h2 className="mb-3 text-2xl font-semibold">أسماء قريبة</h2>
          <ul className="flex flex-wrap gap-2">
            {relatedNames(name).map((item) => (
              <li key={item.slug}>
                <Link href={namePath("ar", item.slug)} className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-muted" title={nameMeaningAr(item)}>
                  {item.arabic} <span dir="ltr" className="text-muted-foreground">{item.latin}</span>
                </Link>
              </li>
            ))}
            <li><Link href={NAME_PATHS.ar} className="inline-block rounded-full border px-3 py-1.5 text-sm font-medium hover:bg-muted">كل الأسماء</Link></li>
          </ul>
        </section>
      </DetailView>
    </Shell>
  );
}

const KIND_LABELS = { religious: "أذكار وعبارات إسلامية", greeting: "تحيات وتهاني", word: "كلمات للوشم واللوحات" } as const;

function PhrasesHub() {
  const copy = phrasesHubCopy.ar;
  const schema = useMemo(() => pageSchema("CollectionPage", copy, copy.path, [["الرئيسية", "/"], [copy.heading, copy.path]], copy.faqs), [copy]);
  return (
    <Shell crumbs={[{ label: "الرئيسية", href: "/" }, { label: copy.heading, href: copy.path }]}>
      <SEOHead title={copy.title} description={copy.description} path={copy.path} schema={schema} exactAlternates={toolAlternates(toolPaths.phrases, "en")} />
      <h1 className="mb-3 text-3xl font-bold md:text-4xl">{copy.heading}</h1>
      <p className="mb-8 leading-loose text-muted-foreground">{copy.intro}</p>
      {(["religious", "greeting", "word"] as const).map((kind) => (
        <section key={kind} className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">{KIND_LABELS[kind]}</h2>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {arabicPhrases.filter((phrase) => phrase.kind === kind).map((phrase) => (
              <li key={phrase.slug}>
                <Link href={phrasePath("ar", phrase.slug)} className="flex items-center justify-between gap-3 rounded-lg border px-4 py-3 hover:bg-muted">
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{phrase.arabic}</span>
                    <span className="block truncate text-xs text-muted-foreground">{phraseTextAr[phrase.slug]?.english}</span>
                  </span>
                  <span dir="ltr" className="shrink-0 text-sm text-muted-foreground">{phraseTransliteration(phrase)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <div className="mt-10 space-y-10">
        <SectionList sections={copy.sections} />
        <FaqList heading="أسئلة شائعة" faqs={copy.faqs} />
        <ToolLinks />
      </div>
    </Shell>
  );
}

function PhraseDetail({ slug }: { slug: string }) {
  const phrase = getArabicPhrase(slug);
  const content = useMemo(() => (phrase ? phraseContentAr(phrase) : null), [phrase]);
  const path = phrase ? phrasePath("ar", phrase.slug) : "";
  const schema = useMemo(() => (content ? pageSchema("WebPage", content, path, [["الرئيسية", "/"], [phrasesHubCopy.ar.heading, PHRASE_PATHS.ar], [content.heading, path]], content.faqs) : undefined), [content, path]);
  if (!phrase || !content) return <NotFound />;
  const languages = { ar: path, en: phrasePath("en", phrase.slug), fr: phrasePath("fr", phrase.slug) };
  const others = arabicPhrases.filter((item) => item.slug !== phrase.slug).slice(0, 12);
  return (
    <Shell crumbs={[{ label: "الرئيسية", href: "/" }, { label: phrasesHubCopy.ar.heading, href: PHRASE_PATHS.ar }, { label: phrase.arabic, href: path }]}>
      <SEOHead title={content.title} description={content.description} path={path} schema={schema} exactAlternates={toolAlternates(languages, "en")} />
      <DetailView content={content} arabic={phrase.arabic} latin={phraseDisplayLatin(phrase)} word={phrase.arabic} fileName={`${phrase.slug}-arabic-calligraphy`}>
        <section>
          <h2 className="mb-3 text-2xl font-semibold">عبارات أخرى</h2>
          <ul className="flex flex-wrap gap-2">
            {others.map((item) => (
              <li key={item.slug}><Link href={phrasePath("ar", item.slug)} className="inline-block rounded-full border px-3 py-1.5 text-sm hover:bg-muted">{item.arabic}</Link></li>
            ))}
            <li><Link href={PHRASE_PATHS.ar} className="inline-block rounded-full border px-3 py-1.5 text-sm font-medium hover:bg-muted">كل العبارات</Link></li>
          </ul>
        </section>
      </DetailView>
    </Shell>
  );
}

export function ArNamesPage() {
  const [, params] = useRoute<{ slug: string }>(`${NAME_PATHS.ar}/:slug`);
  return params?.slug ? <NameDetail slug={decodeURIComponent(params.slug)} /> : <NamesHub />;
}

export function ArPhrasesPage() {
  const [, params] = useRoute<{ slug: string }>(`${PHRASE_PATHS.ar}/:slug`);
  return params?.slug ? <PhraseDetail slug={decodeURIComponent(params.slug)} /> : <PhrasesHub />;
}
