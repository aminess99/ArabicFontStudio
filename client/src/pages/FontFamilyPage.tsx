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
import { englishCategories, frenchCategories } from "@/lib/internationalContent";
import { buildFontFamilies, familyCopy, familyPath, familyTitleName, weightLabel, type FontFamilyGroup } from "@/lib/fontFamilies";
import NotFound from "@/pages/not-found";
import type { Font } from "@shared/schema";

type Locale = "ar" | "en" | "fr";

const UI = {
  ar: { home: "الرئيسية", sample: "اكتب نصاً للمعاينة", defaultText: "بسم الله الرحمن الرحيم", page: "صفحة الخط", download: "تحميل", weights: "الأوزان", category: "تصفح هذا التصنيف", others: "عائلات خطوط أخرى", faq: "أسئلة شائعة", loading: "جارٍ التحميل" },
  en: { home: "Home", sample: "Type text to preview", defaultText: "خط عربي جميل", page: "Font page", download: "Download", weights: "Weights", category: "Browse this category", others: "Other font families", faq: "Frequently asked questions", loading: "Loading" },
  fr: { home: "Accueil", sample: "Tapez un texte pour l'aperçu", defaultText: "خط عربي جميل", page: "Page de la police", download: "Télécharger", weights: "Graisses", category: "Parcourir la catégorie", others: "Autres familles de polices", faq: "Questions fréquentes", loading: "Chargement" },
} as const;

const fontPath = (locale: Locale, font: Font) => (locale === "ar" ? `/font/${font.slug}` : `/${locale}/font/${font.slug}`);
const categoryPath = (locale: Locale, slug: string) => (locale === "ar" ? `/fonts/${slug}` : `/${locale}/fonts/${slug}`);

function WeightCard({ font, family, locale, text }: { font: Font; family: FontFamilyGroup<Font>; locale: Locale; text: string }) {
  const ui = UI[locale];
  const familyName = `xf-family-${font.id}`;
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const url = font.fileUrl.split("/").map((part) => encodeURIComponent(part)).join("/");
    new FontFace(familyName, `url("${url}")`).load()
      .then((face) => { document.fonts.add(face); if (!cancelled) setReady(true); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [font.fileUrl, familyName]);
  return (
    <li className="rounded-lg border bg-card p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <Link href={fontPath(locale, font)} className="font-semibold hover:text-primary hover:underline">
          {locale === "ar" ? `${family.nameArabic} ${weightLabel(font, family)}` : font.name}
        </Link>
        <div className="flex gap-2 text-sm">
          <Link href={fontPath(locale, font)} className="rounded-md border px-3 py-1.5 hover:bg-muted">{ui.page}</Link>
          <a href={font.fileUrl} download={font.fileName} className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-primary-foreground hover:opacity-90">
            <Download className="h-4 w-4" aria-hidden="true" />{ui.download}
          </a>
        </div>
      </div>
      <p dir="rtl" lang="ar" className="min-h-[3.5rem] break-words text-3xl leading-relaxed md:text-4xl" style={{ fontFamily: ready ? `"${familyName}"` : "inherit", opacity: ready ? 1 : 0.4 }}>
        {text || ui.defaultText}
      </p>
    </li>
  );
}

export default function FontFamilyPage() {
  const [location] = useLocation();
  const locale: Locale = location.startsWith("/en/") ? "en" : location.startsWith("/fr/") ? "fr" : "ar";
  const slug = decodeURIComponent(location.replace(/\/+$/, "").split("/").pop() || "");
  const ui = UI[locale];
  const [text, setText] = useState("");
  const { data: fonts = [], isLoading } = useQuery<Font[]>({ queryKey: ["/api/fonts"] });
  const families = useMemo(() => buildFontFamilies(fonts), [fonts]);
  const family = families.find((item) => item.slug === slug);

  if (isLoading) return <div className="min-h-screen bg-background" aria-label={ui.loading} />;
  if (!family) return <NotFound />;

  const categories = locale === "fr" ? frenchCategories : englishCategories;
  const categoryInfo = englishCategories.find((item) => item.arabicCategory === family.category);
  const categoryName = locale === "ar" ? family.category : categories.find((item) => item.slug === categoryInfo?.slug)?.name || categoryInfo?.name || family.category;
  const copy = familyCopy(family, locale, categoryName);
  const path = familyPath(locale, family.slug);
  const others = families.filter((item) => item.slug !== family.slug && item.category === family.category).slice(0, 10);
  const alternates = [
    ...(["ar", "en", "fr"] as const).map((lang) => ({ lang, href: `https://xfontat.com${familyPath(lang, family.slug)}` })),
    { lang: "x-default", href: `https://xfontat.com${familyPath("ar", family.slug)}` },
  ];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", name: copy.heading, description: copy.description, url: `https://xfontat.com${path}`, inLanguage: locale },
      { "@type": "FAQPage", mainEntity: copy.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
    ],
  };

  const body = (
    <div className="mx-auto max-w-5xl">
      <SEOHead title={copy.title} description={copy.description} path={path} schema={schema} lang={locale} direction={locale === "ar" ? "rtl" : "ltr"} exactAlternates={alternates} />
      <h1 className="mb-3 text-3xl font-bold md:text-4xl">{copy.heading}</h1>
      <p className="mb-6 leading-loose text-muted-foreground">{copy.intro}</p>
      <label htmlFor="family-text" className="mb-2 block text-sm font-medium">{ui.sample}</label>
      <Input id="family-text" value={text} onChange={(event) => setText(event.target.value)} placeholder={ui.defaultText} dir="auto" maxLength={80} className="mb-6 max-w-xl text-lg" />
      <section aria-labelledby="weights-heading">
        <h2 id="weights-heading" className="mb-3 text-2xl font-semibold">{ui.weights}</h2>
        <ul className="space-y-3">
          {family.fonts.map((font) => <WeightCard key={font.id} font={font} family={family} locale={locale} text={text} />)}
        </ul>
      </section>
      {categoryInfo && (
        <p className="mt-6"><Link href={categoryPath(locale, categoryInfo.slug)} className="text-primary underline underline-offset-4">{ui.category}: {categoryName}</Link></p>
      )}
      <div className="mt-10 space-y-10">
        <FaqList heading={ui.faq} faqs={copy.faqs} />
        {others.length > 0 && (
          <section>
            <h2 className="mb-3 text-2xl font-semibold">{ui.others}</h2>
            <ul className="flex flex-wrap gap-2">
              {others.map((item) => (
                <li key={item.slug}><Link href={familyPath(locale, item.slug)} className="inline-block rounded-full border px-3 py-1.5 text-sm hover:bg-muted">{locale === "ar" ? familyTitleName(item) : item.name}</Link></li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );

  if (locale !== "ar") {
    return <IntlShell locale={locale} languages={{ ar: familyPath("ar", family.slug), en: familyPath("en", family.slug), fr: familyPath("fr", family.slug) }}>{body}</IntlShell>;
  }
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <Breadcrumb items={[{ label: ui.home, href: "/" }, ...(categoryInfo ? [{ label: family.category, href: categoryPath("ar", categoryInfo.slug) }] : []), { label: familyTitleName(family), href: path }]} />
      <main className="container mx-auto flex-1 px-4 py-8">{body}</main>
      <Footer />
    </div>
  );
}
