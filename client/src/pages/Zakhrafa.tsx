import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Check, Copy } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { decorate } from "@/lib/zakhrafa";
import { textToImagePage, toolFaqSchema, zakhrafaPage } from "@/lib/toolPages";
import { SITE_ORIGIN, createBreadcrumbSchema } from "@/lib/schemas";

const EXAMPLES = ["محمد", "سارة", "Ahmed", "نور"];

export default function Zakhrafa() {
  const [text, setText] = useState("محمد");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();
  const results = useMemo(() => decorate(text), [text]);
  const page = zakhrafaPage;

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
        inLanguage: "ar",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      toolFaqSchema(page),
      createBreadcrumbSchema([
        { name: "الرئيسية", url: `${SITE_ORIGIN}/` },
        { name: page.heading, url: `${SITE_ORIGIN}${page.path}` },
      ]),
    ],
  }), [page]);

  const copy = async (id: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(id);
      setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1500);
      toast({ title: "تم النسخ", description: value });
    } catch {
      toast({ title: "تعذّر النسخ", description: "حدّد النص وانسخه يدوياً.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title={page.title} description={page.description} path={page.path} schema={schema} localized={false} />
      <Header
        searchQuery=""
        onSearchChange={() => {}}
        previewText=""
        onPreviewTextChange={() => {}}
        fontSize={48}
        onFontSizeChange={() => {}}
      />

      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{page.heading}</h1>
          <p className="text-muted-foreground leading-loose mb-6">{page.intro}</p>

          <label htmlFor="zakhrafa-input" className="block text-sm font-medium mb-2">اكتب الاسم أو النص</label>
          <Input
            id="zakhrafa-input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="اكتب اسمك هنا"
            maxLength={60}
            className="h-14 text-xl"
            data-testid="input-zakhrafa"
          />
          <div className="flex flex-wrap gap-2 mt-3 text-sm">
            <span className="text-muted-foreground">أمثلة:</span>
            {EXAMPLES.map((example) => (
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

          <section aria-label="النتائج" className="mt-8">
            {results.length === 0 ? (
              <p className="text-muted-foreground">اكتب نصاً لتظهر الزخارف.</p>
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
                        ? <Check className="h-4 w-4 shrink-0 text-primary" aria-label="تم النسخ" />
                        : <Copy className="h-4 w-4 shrink-0 text-muted-foreground" aria-label="نسخ" />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="mt-8 rounded-lg border bg-muted/40 p-5">
            <p className="leading-loose">
              تريد اسمك بخط عربي حقيقي مثل الثلث أو الديواني؟{" "}
              <Link href={textToImagePage.path} className="text-primary underline underline-offset-4">
                اكتب اسمك بالخط العربي وحمّله صورة
              </Link>
              {" "}أو{" "}
              <Link href="/" className="text-primary underline underline-offset-4">تصفّح مكتبة الخطوط العربية</Link>.
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
              <h2 className="text-2xl font-semibold mb-4">أسئلة شائعة</h2>
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
