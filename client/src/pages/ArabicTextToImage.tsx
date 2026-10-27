import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Download, Loader2 } from "lucide-react";
import type { Font } from "@shared/schema";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { IntlShell, FaqList, SectionList } from "@/components/IntlShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { textToImagePage, toolFaqSchema, zakhrafaPage } from "@/lib/toolPages";
import { findIntlTool, generatorCopy, ruqaaCopy, toolAlternates, toolPaths, type IntlLocale } from "@/lib/intlTools";
import { findArabicName, namePath } from "@/lib/arabicNames";
import { englishCategories, frenchCategories } from "@/lib/internationalContent";
import { SITE_ORIGIN, createBreadcrumbSchema } from "@/lib/schemas";
import { getCanonicalFontSlug } from "@/lib/slugify";

const CATEGORIES = ["الكل", "ثلث", "ديواني", "رقعة", "كوفي", "نسخ", "نستعليق", "تصميم", "فوتوشوب", "خطوط الحرة"];

const UI: Record<IntlLocale, {
  text: string; style: string; font: string; searchFont: string; loadingFonts: string; choose: string; fonts: string; size: string;
  color: string; background: string; transparent: string; download: string; loadError: string; loadingFont: string; preview: string;
  fontLabel: string; licence: string; faq: string; all: string; use: string; defaultText: string;
}> = {
  ar: {
    text: "النص", style: "نوع الخط", font: "الخط", searchFont: "ابحث باسم الخط", loadingFonts: "جارٍ تحميل الخطوط...", choose: "اختر خطاً",
    fonts: "خط", size: "الحجم", color: "لون النص", background: "الخلفية", transparent: "خلفية شفافة", download: "تحميل الصورة PNG",
    loadError: "تعذّر تحميل ملف هذا الخط، اختر خطاً آخر.", loadingFont: "جارٍ تحميل الخط", preview: "معاينة الصورة", fontLabel: "الخط:",
    licence: "— راجع ترخيصه قبل الاستخدام التجاري.", faq: "أسئلة شائعة", all: "الكل", use: "استخدم", defaultText: "محمد",
  },
  en: {
    text: "Text (Arabic, or a first name in English)", style: "Calligraphy style", font: "Font", searchFont: "Search fonts by name", loadingFonts: "Loading fonts...", choose: "Choose a font",
    fonts: "fonts", size: "Size", color: "Text colour", background: "Background", transparent: "Transparent background", download: "Download PNG",
    loadError: "This font file could not be loaded. Please choose another font.", loadingFont: "Loading font", preview: "Image preview", fontLabel: "Font:",
    licence: "— check its licence before commercial use.", faq: "Frequently asked questions", all: "All", use: "Use the Arabic spelling", defaultText: "سلام",
  },
  fr: {
    text: "Texte (en arabe, ou un prénom en français)", style: "Style de calligraphie", font: "Police", searchFont: "Chercher une police", loadingFonts: "Chargement des polices...", choose: "Choisir une police",
    fonts: "polices", size: "Taille", color: "Couleur du texte", background: "Fond", transparent: "Fond transparent", download: "Télécharger le PNG",
    loadError: "Impossible de charger cette police. Choisissez-en une autre.", loadingFont: "Chargement de la police", preview: "Aperçu de l'image", fontLabel: "Police :",
    licence: "— vérifiez sa licence avant un usage commercial.", faq: "Questions fréquentes", all: "Toutes", use: "Utiliser l'orthographe arabe", defaultText: "سلام",
  },
};
const PADDING = 48;
const loadedFaces = new Map<string, Promise<string>>();

// Registers the font file under a family name private to this tool.
function loadFontFace(font: Font): Promise<string> {
  const family = `xf-tool-${font.id}`;
  if (!loadedFaces.has(family)) {
    const url = font.fileUrl.split("/").map((part) => encodeURIComponent(part)).join("/");
    loadedFaces.set(family, new FontFace(family, `url("${url}")`).load().then((face) => {
      document.fonts.add(face);
      return family;
    }));
  }
  return loadedFaces.get(family)!;
}

function drawText(canvas: HTMLCanvasElement, text: string, family: string, size: number, color: string, background: string | null) {
  const ctx = canvas.getContext("2d")!;
  const lines = text.split("\n").map((line) => line.trim() || " ");
  const font = `${size}px "${family}", sans-serif`;
  ctx.font = font;
  const metrics = lines.map((line) => ctx.measureText(line));
  const lineHeight = Math.ceil(size * 1.6);
  canvas.width = Math.max(200, Math.ceil(Math.max(...metrics.map((m) => m.width))) + PADDING * 2);
  canvas.height = lineHeight * lines.length + PADDING * 2;

  // Resizing the canvas resets its state.
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.direction = "rtl";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  lines.forEach((line, index) => {
    ctx.fillText(line, canvas.width / 2, PADDING + lineHeight * index + lineHeight / 2);
  });
}

export default function ArabicTextToImage() {
  const [location] = useLocation();
  const route = findIntlTool(location);
  const locale = route?.locale ?? "ar";
  // The Ruqaa page is the same tool opened on Ruqaa fonts.
  const toolId = route?.id === "ruqaa" ? "ruqaa" : "generator";
  const page = toolId === "ruqaa" ? ruqaaCopy[locale] : locale === "ar" ? textToImagePage : generatorCopy[locale];
  const ui = UI[locale];
  const categoryLabels = useMemo(() => {
    const list = locale === "fr" ? frenchCategories : englishCategories;
    const short: Record<string, string> = locale === "fr"
      ? { "تصميم": "Décoratives", "فوتوشوب": "Photoshop", "خطوط الحرة": "Libres" }
      : { "تصميم": "Display", "فوتوشوب": "Photoshop", "خطوط الحرة": "Freehand" };
    return new Map(list.map((item) => [item.arabicCategory, short[item.arabicCategory] || item.name]));
  }, [locale]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState(() => {
    const requested = typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("text");
    if (!requested?.trim()) return ui.defaultText;
    // A name passed in Latin letters opens with its Arabic spelling.
    return (/[A-Za-z]/.test(requested) && findArabicName(requested)?.arabic) || requested.slice(0, 120);
  });
  const latinName = /[A-Za-z]/.test(text) ? findArabicName(text) : undefined;
  const [category, setCategory] = useState(toolId === "ruqaa" ? "رقعة" : "ثلث");
  const [search, setSearch] = useState("");
  const [fontId, setFontId] = useState<string | null>(null);
  const [size, setSize] = useState(96);
  const [color, setColor] = useState("#111111");
  const [transparent, setTransparent] = useState(false);
  const [background, setBackground] = useState("#ffffff");
  const [family, setFamily] = useState<string | null>(null);
  const [fontError, setFontError] = useState(false);

  const { data: allFonts = [], isLoading } = useQuery<Font[]>({ queryKey: ["/api/fonts"] });
  const fonts = useMemo(() => allFonts.filter((font) => !font.duplicateOf), [allFonts]);

  // ?font=<slug> preselects a font, used by the links on font pages.
  useEffect(() => {
    if (!fonts.length || fontId) return;
    const requested = new URLSearchParams(window.location.search).get("font");
    const initial = fonts.find((font) => font.slug === requested)
      || fonts.find((font) => font.category === category);
    if (initial) {
      setFontId(initial.id);
      setCategory(initial.category);
    }
  }, [fonts, fontId, category]);

  const visibleFonts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return fonts.filter((font) =>
      (category === "الكل" || font.category === category)
      && (!query || font.name.toLowerCase().includes(query) || font.nameArabic.includes(query)),
    );
  }, [fonts, category, search]);

  const selectedFont = fonts.find((font) => font.id === fontId);

  useEffect(() => {
    if (!selectedFont) return;
    let cancelled = false;
    setFamily(null);
    setFontError(false);
    loadFontFace(selectedFont)
      .then((loaded) => { if (!cancelled) setFamily(loaded); })
      .catch(() => { if (!cancelled) setFontError(true); });
    return () => { cancelled = true; };
  }, [selectedFont]);

  useEffect(() => {
    if (canvasRef.current && family) {
      drawText(canvasRef.current, text || " ", family, size, color, transparent ? null : background);
    }
  }, [text, family, size, color, transparent, background]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedFont) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `xfontat-${getCanonicalFontSlug(selectedFont)}.png`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    }, "image/png");
  };

  const schema = useMemo(() => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: page.heading,
        url: `${SITE_ORIGIN}${page.path}`,
        description: page.description,
        applicationCategory: "DesignApplication",
        operatingSystem: "Web",
        inLanguage: locale,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      toolFaqSchema(page),
      createBreadcrumbSchema([
        { name: locale === "ar" ? "الرئيسية" : locale === "fr" ? "Accueil" : "Home", url: `${SITE_ORIGIN}${locale === "ar" ? "/" : `/${locale}`}` },
        { name: page.heading, url: `${SITE_ORIGIN}${page.path}` },
      ]),
    ],
  }), [page, locale]);
  const fontPath = (font: Font) => `${locale === "ar" ? "" : `/${locale}`}/font/${getCanonicalFontSlug(font)}`;

  const tool = (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <div className="space-y-5">
        <div>
          <label htmlFor="tti-text" className="block text-sm font-medium mb-2">{ui.text}</label>
          <Textarea id="tti-text" value={text} onChange={(event) => setText(event.target.value)} rows={3} maxLength={120} dir="auto" className="text-lg" data-testid="input-tti-text" />
          {latinName && (
            <button type="button" onClick={() => setText(latinName.arabic)} className="mt-2 text-sm text-primary underline underline-offset-4">
              {ui.use}: <span lang="ar">{latinName.arabic}</span> ({latinName.latin})
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{ui.style}</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => { setCategory(item); setSearch(""); }}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${category === item ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}
              >
                {locale === "ar" ? item : item === "الكل" ? ui.all : categoryLabels.get(item) || item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="tti-search" className="block text-sm font-medium mb-2">{ui.font}</label>
          <Input id="tti-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={ui.searchFont} className="mb-2" />
          <Select value={fontId ?? undefined} onValueChange={setFontId}>
            <SelectTrigger data-testid="select-tti-font">
              <SelectValue placeholder={isLoading ? ui.loadingFonts : ui.choose} />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {visibleFonts.slice(0, 300).map((font) => (
                <SelectItem key={font.id} value={font.id}>{locale === "ar" ? font.nameArabic : font.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">{visibleFonts.length} {ui.fonts}</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{ui.size}: {size}</label>
          <Slider value={[size]} min={32} max={200} step={4} onValueChange={([value]) => setSize(value)} />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            {ui.color}
            <input type="color" value={color} onChange={(event) => setColor(event.target.value)} className="h-9 w-12 cursor-pointer rounded border" />
          </label>
          <label className="flex items-center gap-2 text-sm">
            {ui.background}
            <input type="color" value={background} disabled={transparent} onChange={(event) => setBackground(event.target.value)} className="h-9 w-12 cursor-pointer rounded border disabled:opacity-40" />
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={transparent} onChange={(event) => setTransparent(event.target.checked)} />
          {ui.transparent}
        </label>

        <Button onClick={download} disabled={!family} className="w-full" data-testid="button-tti-download">
          <Download className="h-4 w-4 me-2" />
          {ui.download}
        </Button>
      </div>

      <div className="min-w-0">
        <div
          className="min-h-[280px] rounded-lg border overflow-auto grid place-items-center p-4"
          style={{ backgroundImage: "repeating-conic-gradient(#e5e7eb 0% 25%, #ffffff 0% 50%)", backgroundSize: "20px 20px" }}
        >
          {fontError ? (
            <p className="text-destructive">{ui.loadError}</p>
          ) : !family ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-label={ui.loadingFont} />
          ) : null}
          <canvas ref={canvasRef} className={`max-w-full h-auto ${family && !fontError ? "" : "hidden"}`} aria-label={ui.preview} />
        </div>
        {selectedFont && (
          <p className="text-sm text-muted-foreground mt-3">
            {ui.fontLabel}{" "}
            <Link href={fontPath(selectedFont)} className="text-primary underline underline-offset-4">
              {locale === "ar" ? selectedFont.nameArabic : selectedFont.name}
            </Link>
            {" "}{ui.licence}
          </p>
        )}
      </div>
    </div>
  );

  const head = (
    <SEOHead
      title={page.title}
      description={page.description}
      path={page.path}
      schema={schema}
      lang={locale}
      direction={locale === "ar" ? "rtl" : "ltr"}
      exactAlternates={toolAlternates(toolPaths[toolId])}
    />
  );

  if (locale !== "ar") {
    const links = locale === "fr"
      ? [[toolPaths.keyboard.fr!, "Clavier arabe"], [toolPaths.names.fr!, "Prénoms en arabe"], [toolPaths.tattoo.fr!, "Polices pour tatouage"]]
      : [[toolPaths.keyboard.en!, "Arabic keyboard"], [toolPaths.names.en!, "Names in Arabic"], [toolPaths.tattoo.en!, "Arabic tattoo fonts"]];
    return (
      <IntlShell locale={locale} languages={toolPaths[toolId]}>
        {head}
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{page.heading}</h1>
          <p className="text-muted-foreground leading-relaxed mb-8">{page.intro}</p>
          {tool}
          <ul className="mt-8 flex flex-wrap gap-2">
            {latinName && <li><Link href={namePath(locale, latinName.slug)} className="inline-block rounded-full border px-4 py-2 text-sm hover:bg-muted">{latinName.latin} →</Link></li>}
            {links.map(([href, label]) => (
              <li key={href}><Link href={href} className="inline-block rounded-full border px-4 py-2 text-sm hover:bg-muted">{label}</Link></li>
            ))}
          </ul>
          <div className="mt-12 space-y-10">
            <SectionList sections={page.sections} />
            <FaqList heading={ui.faq} faqs={page.faqs} />
          </div>
        </div>
      </IntlShell>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {head}
      <Header />

      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{page.heading}</h1>
          <p className="text-muted-foreground leading-loose mb-8">{page.intro}</p>

          {tool}

          <div className="mt-8 rounded-lg border bg-muted/40 p-5">
            <p className="leading-loose">
              تريد اسماً مزخرفاً تنسخه وتلصقه في الألعاب ووسائل التواصل؟{" "}
              <Link href={zakhrafaPage.path} className="text-primary underline underline-offset-4">جرّب أداة زخرفة الأسماء</Link>.
              {" "}أو اكتب بالعربية من أي جهاز عبر{" "}
              <Link href={toolPaths.keyboard.ar!} className="text-primary underline underline-offset-4">الكيبورد العربي</Link>.
            </p>
          </div>

          <div className="mt-12 space-y-10">
            {page.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-semibold mb-3">{section.heading}</h2>
                <p className="text-muted-foreground leading-loose">{section.body}</p>
              </section>
            ))}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{ui.faq}</h2>
              <div className="space-y-5">
                {page.faqs.map((faq) => (
                  <div key={faq.question}>
                    <h3 className="font-semibold mb-1">{faq.question}</h3>
                    <p className="text-muted-foreground leading-loose">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
