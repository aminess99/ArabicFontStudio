import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { Check, Copy } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FaqList, IntlShell, SectionList } from "@/components/IntlShell";
import { SEOHead } from "@/components/SEOHead";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { decorate } from "@/lib/zakhrafa";
import { textToImagePage, toolFaqSchema, zakhrafaPage } from "@/lib/toolPages";
import { findIntlTool, toolAlternates, toolPaths, zakhrafaCopy, type IntlLocale } from "@/lib/intlTools";
import { SITE_ORIGIN, createBreadcrumbSchema } from "@/lib/schemas";

const UI = {
  ar: {
    home: "الرئيسية", examples: ["محمد", "سارة", "Ahmed", "نور"], label: "اكتب الاسم أو النص", placeholder: "اكتب اسمك هنا", examplesLabel: "أمثلة:",
    results: "النتائج", empty: "اكتب نصاً لتظهر الزخارف.", copied: "تم النسخ", copyFail: "تعذّر النسخ", copyFailHint: "حدّد النص وانسخه يدوياً.", copy: "نسخ",
    ctaBefore: "تريد اسمك بخط الرقعة أو الثلث أو الديواني؟", ctaTool: "اكتب اسمك بالخط العربي وحمّله صورة", ctaOr: "أو", ctaLibrary: "تصفّح مكتبة الخطوط العربية", faq: "أسئلة شائعة",
  },
  en: {
    home: "Home", examples: ["نور", "Sarah", "محمد", "Adam"], label: "Type a name or text", placeholder: "Type your name", examplesLabel: "Examples:",
    results: "Results", empty: "Type some text to see the styles.", copied: "Copied", copyFail: "Could not copy", copyFailHint: "Select the text and copy it by hand.", copy: "Copy",
    ctaBefore: "Want your name in real Arabic calligraphy such as Thuluth or Diwani?", ctaTool: "Write it in Arabic calligraphy and download a PNG", ctaOr: "or", ctaLibrary: "browse the Arabic font library", faq: "Frequently asked questions",
  },
  fr: {
    home: "Accueil", examples: ["نور", "Sarah", "محمد", "Adam"], label: "Tapez un prénom ou un texte", placeholder: "Tapez votre prénom", examplesLabel: "Exemples :",
    results: "Résultats", empty: "Tapez un texte pour voir les styles.", copied: "Copié", copyFail: "Copie impossible", copyFailHint: "Sélectionnez le texte et copiez-le à la main.", copy: "Copier",
    ctaBefore: "Vous voulez votre prénom en vraie calligraphie arabe, thuluth ou diwani ?", ctaTool: "Écrivez-le en calligraphie arabe et téléchargez un PNG", ctaOr: "ou", ctaLibrary: "parcourez la bibliothèque de polices arabes", faq: "Questions fréquentes",
  },
} satisfies Record<IntlLocale, Record<string, unknown>>;

export default function Zakhrafa() {
  const [location] = useLocation();
  const locale = findIntlTool(location)?.locale ?? "ar";
  const ui = UI[locale];
  const [text, setText] = useState(ui.examples[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();
  const results = useMemo(() => decorate(text), [text]);
  const page = locale === "ar" ? zakhrafaPage : zakhrafaCopy[locale];
  const homePath = locale === "ar" ? "/" : `/${locale}`;

  const schema = useMemo(() => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: page.heading,
        url: `${SITE_ORIGIN}${page.path}`,
        description: page.description,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        inLanguage: locale,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      toolFaqSchema(page),
      createBreadcrumbSchema([
        { name: ui.home, url: `${SITE_ORIGIN}${homePath}` },
        { name: page.heading, url: `${SITE_ORIGIN}${page.path}` },
      ]),
    ],
  }), [page, ui, locale, homePath]);

  const copy = async (id: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(id);
      setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1500);
      toast({ title: ui.copied, description: value });
    } catch {
      toast({ title: ui.copyFail, description: ui.copyFailHint, variant: "destructive" });
    }
  };

  const head = (
    <SEOHead
      title={page.title}
      description={page.description}
      path={page.path}
      schema={schema}
      lang={locale}
      direction={locale === "ar" ? "rtl" : "ltr"}
      exactAlternates={toolAlternates(toolPaths.zakhrafa)}
    />
  );
  const body = (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{page.heading}</h1>
      <p className="text-muted-foreground leading-loose mb-6">{page.intro}</p>

      <label htmlFor="zakhrafa-input" className="block text-sm font-medium mb-2">{ui.label}</label>
      <Input
        id="zakhrafa-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={ui.placeholder}
        maxLength={60}
        className="h-14 text-xl"
        dir="auto"
        data-testid="input-zakhrafa"
      />
      <div className="flex flex-wrap gap-2 mt-3 text-sm">
        <span className="text-muted-foreground">{ui.examplesLabel}</span>
        {ui.examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setText(example)}
            className="rounded-full border px-3 py-1 hover:bg-muted transition-colors"
          >
            {example}
          </button>
        ))}
      </div>

      <section aria-label={ui.results} className="mt-8">
        {results.length === 0 ? (
          <p className="text-muted-foreground">{ui.empty}</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {results.map((result) => (
              <li key={result.id}>
                <button
                  type="button"
                  onClick={() => copy(result.id, result.value)}
                  className="w-full flex items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3 text-start hover:border-primary transition-colors"
                  data-testid={`button-copy-${result.id}`}
                >
                  <span className="text-lg break-all" dir="auto">{result.value}</span>
                  {copiedId === result.id
                    ? <Check className="h-4 w-4 shrink-0 text-primary" aria-label={ui.copied} />
                    : <Copy className="h-4 w-4 shrink-0 text-muted-foreground" aria-label={ui.copy} />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-8 rounded-lg border bg-muted/40 p-5">
        <p className="leading-loose">
          {ui.ctaBefore}{" "}
          <Link href={toolPaths.generator[locale] ?? textToImagePage.path} className="text-primary underline underline-offset-4">
            {ui.ctaTool}
          </Link>
          {" "}{ui.ctaOr}{" "}
          <Link href={homePath} className="text-primary underline underline-offset-4">{ui.ctaLibrary}</Link>.
        </p>
      </div>

      <div className="mt-12 space-y-10">
        <SectionList sections={page.sections} />
        <FaqList heading={ui.faq} faqs={page.faqs} />
      </div>
    </div>
  );

  if (locale !== "ar") {
    return (
      <IntlShell locale={locale} languages={toolPaths.zakhrafa}>
        {head}
        {body}
      </IntlShell>
    );
  }
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {head}
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">{body}</main>
      <Footer />
    </div>
  );
}
