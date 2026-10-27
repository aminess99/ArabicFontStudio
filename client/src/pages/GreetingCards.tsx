import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Download, Loader2, Share2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Breadcrumb } from "@/components/Breadcrumb";
import { IntlShell } from "@/components/IntlShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { SITE_ORIGIN, createBreadcrumbSchema } from "@/lib/schemas";
import {
  CARD_FONTS,
  CARDS_HUB,
  OCCASIONS,
  getOccasion,
  renderCard,
  type CardContent,
  type CardFontId,
  type CardSize,
  type CardTemplate,
  type Occasion,
} from "@/lib/greetingCards";
import {
  CARD_PATHS,
  CARD_UI,
  cardFontLabel,
  cardOccasionPath,
  cardsHubCopy,
  localizeOccasion,
  parseCardPath,
  templateLabel,
  type CardLocale,
} from "@/lib/greetingCardsIntl";

const CUSTOM = "__custom";

function faqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };
}

// A rendered card scaled down by CSS; used for the sample gallery and hub tiles.
function CardThumbnail({ template, content, size = "square", className = "" }: { template: CardTemplate; content: CardContent; size?: CardSize; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    if (ref.current) renderCard(ref.current, template, content, size, () => !cancelled).then(() => { if (!cancelled) setReady(true); }).catch(() => {});
    return () => { cancelled = true; };
  }, [template, content, size]);
  return (
    <div className={`relative overflow-hidden rounded-md bg-muted ${size === "story" ? "aspect-[9/16]" : "aspect-square"} ${className}`}>
      <canvas ref={ref} className={`h-full w-full transition-opacity ${ready ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
      {!ready && <Loader2 className="absolute inset-0 m-auto h-5 w-5 animate-spin text-muted-foreground" aria-hidden="true" />}
    </div>
  );
}

const homePath = (locale: CardLocale) => (locale === "ar" ? "/" : `/${locale}`);

function sampleContent(occasion: Occasion, locale: CardLocale): CardContent {
  const ui = CARD_UI[locale];
  return {
    message: occasion.messages[0],
    name: occasion.slug === "wedding" ? ui.couple : ui.yourName,
    from: "",
    note: occasion.defaultNote,
    messageFont: occasion.defaultFont,
    nameFont: "rakkas",
  };
}

function OccasionNav({ current, locale }: { current?: string; locale: CardLocale }) {
  return (
    <nav aria-label={CARD_UI[locale].occasions} className="flex gap-2 overflow-x-auto pb-1">
      {OCCASIONS.map((item) => localizeOccasion(item, locale)).map((occasion) => (
        <Link
          key={occasion.slug}
          href={cardOccasionPath(locale, occasion.slug)}
          aria-current={occasion.slug === current ? "page" : undefined}
          className={`h-10 shrink-0 whitespace-nowrap rounded-full border px-4 text-sm leading-10 transition-colors ${occasion.slug === current ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"}`}
        >
          {occasion.name}
        </Link>
      ))}
    </nav>
  );
}

// hreflang links for a card page: the hub or one occasion in every language.
function cardAlternates(slug?: string) {
  const path = (locale: CardLocale) => (slug ? cardOccasionPath(locale, slug) : CARD_PATHS[locale]);
  return [
    ...(["ar", "en", "fr"] as const).map((lang) => ({ lang, href: `${SITE_ORIGIN}${path(lang)}` })),
    { lang: "x-default", href: `${SITE_ORIGIN}${path("ar")}` },
  ];
}

function Hub({ locale }: { locale: CardLocale }) {
  const hub = cardsHubCopy[locale];
  const ui = CARD_UI[locale];
  const schema = useMemo(() => ({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", name: hub.heading, url: `${SITE_ORIGIN}${CARD_PATHS[locale]}`, description: hub.description, inLanguage: locale },
      faqSchema(hub.faqs),
      createBreadcrumbSchema([{ name: ui.home, url: `${SITE_ORIGIN}${homePath(locale)}` }, { name: hub.heading, url: `${SITE_ORIGIN}${CARD_PATHS[locale]}` }]),
    ],
  }), [hub, ui, locale]);
  return (
    <>
      <SEOHead title={hub.title} description={hub.description} path={CARD_PATHS[locale]} schema={schema} lang={locale} direction={locale === "ar" ? "rtl" : "ltr"} exactAlternates={cardAlternates()} />
      <h1 className="text-3xl md:text-4xl font-bold mb-3">{hub.heading}</h1>
      <p className="text-muted-foreground leading-loose mb-8">{hub.intro}</p>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {OCCASIONS.map((item) => localizeOccasion(item, locale)).map((occasion) => (
          <li key={occasion.slug}>
            <Link href={cardOccasionPath(locale, occasion.slug)} className="group block" data-testid={`link-occasion-${occasion.slug}`}>
              <CardThumbnail template={occasion.templates[0]} content={sampleContent(occasion, locale)} className="border transition-colors group-hover:border-primary" />
              <span className="mt-2 block font-semibold group-hover:text-primary transition-colors">{ui.cardsFor(occasion.name)}</span>
            </Link>
          </li>
        ))}
      </ul>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">{ui.faq}</h2>
        <div className="space-y-5">
          {hub.faqs.map((faq) => (
            <div key={faq.question}>
              <h3 className="font-semibold mb-1">{faq.question}</h3>
              <p className="text-muted-foreground leading-loose">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function Designer({ occasion, locale }: { occasion: Occasion; locale: CardLocale }) {
  const ui = CARD_UI[locale];
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [templateId, setTemplateId] = useState(occasion.templates[0].id);
  const [name, setName] = useState(occasion.slug === "wedding" ? ui.couple : "");
  const [from, setFrom] = useState("");
  const [messageChoice, setMessageChoice] = useState(occasion.messages[0]);
  const [customMessage, setCustomMessage] = useState("");
  const [note, setNote] = useState(occasion.defaultNote);
  const [messageFont, setMessageFont] = useState<CardFontId>(occasion.defaultFont);
  const [nameFont, setNameFont] = useState<CardFontId>("rakkas");
  const [size, setSize] = useState<CardSize>("square");
  const [rendering, setRendering] = useState(true);
  const [canShareFiles, setCanShareFiles] = useState(false);

  // Each occasion page is its own route; reset when switching between them.
  useEffect(() => {
    setTemplateId(occasion.templates[0].id);
    setMessageChoice(occasion.messages[0]);
    setNote(occasion.defaultNote);
    setMessageFont(occasion.defaultFont);
  }, [occasion]);

  useEffect(() => {
    const probe = new File([""], "card.png", { type: "image/png" });
    setCanShareFiles(typeof navigator !== "undefined" && !!navigator.canShare?.({ files: [probe] }));
  }, []);

  const template = occasion.templates.find((item) => item.id === templateId) || occasion.templates[0];
  const content: CardContent = useMemo(() => ({
    message: messageChoice === CUSTOM ? customMessage : messageChoice,
    name: name.trim() || ui.yourName,
    from: from.trim(),
    note: note.trim(),
    messageFont,
    nameFont,
  }), [messageChoice, customMessage, name, from, note, messageFont, nameFont, ui]);
  const galleryContent = useMemo(() => ({ ...content, from: "" }), [content]);

  useEffect(() => {
    if (!canvasRef.current) return;
    let cancelled = false;
    setRendering(true);
    renderCard(canvasRef.current, template, content, size, () => !cancelled)
      .then(() => { if (!cancelled) setRendering(false); })
      .catch(() => { if (!cancelled) toast({ title: ui.renderError, description: ui.renderErrorHint, variant: "destructive" }); });
    return () => { cancelled = true; };
  }, [template, content, size, toast, ui]);

  const fileName = `xfontat-${occasion.slug}-${size}.png`;
  const toBlob = () => new Promise<Blob | null>((resolve) => canvasRef.current?.toBlob(resolve, "image/png"));

  const download = async () => {
    const blob = await toBlob();
    if (!blob) return;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };

  const share = async () => {
    const blob = await toBlob();
    if (!blob) return;
    try {
      await navigator.share({ files: [new File([blob], fileName, { type: "image/png" })], title: occasion.heading });
    } catch {
      // The visitor closed the share sheet.
    }
  };

  const pagePath = cardOccasionPath(locale, occasion.slug);
  const hub = cardsHubCopy[locale];
  const schema = useMemo(() => ({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebApplication", name: occasion.heading, url: `${SITE_ORIGIN}${pagePath}`, description: occasion.description, applicationCategory: "DesignApplication", operatingSystem: "Web", inLanguage: locale, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
      faqSchema(occasion.faqs),
      createBreadcrumbSchema([
        { name: ui.home, url: `${SITE_ORIGIN}${homePath(locale)}` },
        { name: hub.heading, url: `${SITE_ORIGIN}${CARD_PATHS[locale]}` },
        { name: occasion.heading, url: `${SITE_ORIGIN}${pagePath}` },
      ]),
    ],
  }), [occasion, pagePath, locale, ui, hub]);

  return (
    <>
      <SEOHead title={occasion.title} description={occasion.description} path={pagePath} schema={schema} lang={locale} direction={locale === "ar" ? "rtl" : "ltr"} exactAlternates={cardAlternates(occasion.slug)} />
      <h1 className="text-3xl md:text-4xl font-bold mb-3">{occasion.heading}</h1>
      <p className="text-muted-foreground leading-loose mb-5">{occasion.intro}</p>
      <OccasionNav current={occasion.slug} locale={locale} />

      <section aria-labelledby="gallery-heading" className="mt-6">
        <h2 id="gallery-heading" className="text-lg font-semibold mb-3">{ui.chooseTemplate}</h2>
        <ul className="grid grid-cols-3 gap-3 md:max-w-xl">
          {occasion.templates.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setTemplateId(item.id)}
                aria-pressed={item.id === template.id}
                className={`block w-full rounded-lg border-2 p-1 text-center transition-colors ${item.id === template.id ? "border-primary" : "border-transparent hover:border-muted-foreground/40"}`}
                data-testid={`button-template-${item.id}`}
              >
                <CardThumbnail template={item} content={galleryContent} />
                <span className="mt-1 block text-xs sm:text-sm">{templateLabel(item.id, item.label, locale)}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[340px_1fr]">
        <div className="space-y-5">
          <div>
            <label htmlFor="card-name" className="block text-sm font-medium mb-2">{occasion.slug === "wedding" ? ui.coupleNames : ui.name}</label>
            <Input id="card-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={40} placeholder={ui.namePlaceholder} className="h-11 text-lg" data-testid="input-card-name" />
          </div>
          <div>
            <label htmlFor="card-from" className="block text-sm font-medium mb-2">{ui.from}</label>
            <Input id="card-from" value={from} onChange={(event) => setFrom(event.target.value)} maxLength={50} placeholder={ui.fromPlaceholder} className="h-11" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{ui.message}</label>
            <Select value={messageChoice} onValueChange={setMessageChoice}>
              <SelectTrigger className="h-11" data-testid="select-card-message"><SelectValue /></SelectTrigger>
              <SelectContent>
                {occasion.messages.map((message) => <SelectItem key={message} value={message}>{message}</SelectItem>)}
                <SelectItem value={CUSTOM}>{ui.otherMessage}</SelectItem>
              </SelectContent>
            </Select>
            {messageChoice === CUSTOM && (
              <Input value={customMessage} onChange={(event) => setCustomMessage(event.target.value)} maxLength={30} placeholder={ui.customPlaceholder} className="mt-2 h-11" />
            )}
          </div>
          <div>
            <label htmlFor="card-note" className="block text-sm font-medium mb-2">{ui.note}</label>
            <Input id="card-note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={60} className="h-11" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2">{ui.messageFont}</label>
              <Select value={messageFont} onValueChange={(value) => setMessageFont(value as CardFontId)}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>{CARD_FONTS.map((font) => <SelectItem key={font.id} value={font.id}>{cardFontLabel(font.id, font.label, locale)}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{ui.nameFont}</label>
              <Select value={nameFont} onValueChange={(value) => setNameFont(value as CardFontId)}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>{CARD_FONTS.map((font) => <SelectItem key={font.id} value={font.id}>{cardFontLabel(font.id, font.label, locale)}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <span className="block text-sm font-medium mb-2">{ui.size}</span>
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={ui.size}>
              {([["square", ui.square], ["story", ui.story]] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={size === value}
                  onClick={() => setSize(value)}
                  className={`min-h-11 rounded-md border px-3 py-2 text-sm transition-colors ${size === value ? "border-primary bg-primary/10 font-semibold" : "hover:bg-muted"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={download} disabled={rendering} className="h-11 flex-1" data-testid="button-card-download">
              <Download className="me-2 h-4 w-4" />
              {ui.download}
            </Button>
            {canShareFiles && (
              <Button onClick={share} disabled={rendering} variant="outline" className="h-11" data-testid="button-card-share">
                <Share2 className="me-2 h-4 w-4" />
                {ui.share}
              </Button>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-24 self-start">
          <div className={`relative mx-auto overflow-hidden rounded-lg border shadow-sm ${size === "story" ? "max-w-[340px] aspect-[9/16]" : "max-w-[560px] aspect-square"}`}>
            <canvas ref={canvasRef} className="h-full w-full" aria-label={ui.preview(occasion.heading)} />
            {rendering && <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-spin text-muted-foreground" aria-hidden="true" />}
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">{ui.greetings(occasion.name)}</h2>
        <ul className="space-y-3">
          {occasion.greetings.map((greeting) => (
            <li key={greeting} className="rounded-lg border bg-card p-4 leading-loose" dir="auto">{greeting}</li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">{ui.faq}</h2>
        <div className="space-y-5">
          {occasion.faqs.map((faq) => (
            <div key={faq.question}>
              <h3 className="font-semibold mb-1">{faq.question}</h3>
              <p className="text-muted-foreground leading-loose">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">{ui.other}</h2>
        <OccasionNav current={occasion.slug} locale={locale} />
      </section>
    </>
  );
}

export default function GreetingCards() {
  const [location] = useLocation();
  const parsed = parseCardPath(location.replace(/\/+$/, "")) ?? { locale: "ar" as const };
  const { locale, slug } = parsed;
  const ui = CARD_UI[locale];
  const base = slug ? getOccasion(slug) : undefined;
  const occasion = base ? localizeOccasion(base, locale) : undefined;
  const content = (
    <div className="max-w-6xl mx-auto">
      {slug && !occasion ? (
        <p className="text-muted-foreground">{ui.notFound} <Link href={CARD_PATHS[locale]} className="text-primary underline">{ui.allCards}</Link></p>
      ) : occasion ? (
        <Designer occasion={occasion} locale={locale} />
      ) : (
        <Hub locale={locale} />
      )}
    </div>
  );

  if (locale !== "ar") {
    const languages = {
      ar: slug ? cardOccasionPath("ar", slug) : CARD_PATHS.ar,
      en: slug ? cardOccasionPath("en", slug) : CARD_PATHS.en,
      fr: slug ? cardOccasionPath("fr", slug) : CARD_PATHS.fr,
    };
    return <IntlShell locale={locale} languages={languages}>{content}</IntlShell>;
  }

  const breadcrumbItems = [
    { label: ui.home, href: "/" },
    { label: ui.cards, href: CARDS_HUB.path },
    ...(occasion ? [{ label: occasion.name, href: cardOccasionPath("ar", occasion.slug) }] : []),
  ];
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      <main className="flex-1 container mx-auto px-4 py-8">{content}</main>
      <Footer />
    </div>
  );
}
