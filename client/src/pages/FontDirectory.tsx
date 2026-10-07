import { useState } from "react";
import { Link } from "wouter";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SEOHead } from "@/components/SEOHead";

const categories = [
  { label: "خطوط الثلث", slug: "thuluth", category: "ثلث" },
  { label: "خطوط الديواني", slug: "diwani", category: "ديواني" },
  { label: "خطوط الرقعة", slug: "ruqaa", category: "رقعة" },
  { label: "خطوط الكوفي", slug: "kufi", category: "كوفي" },
  { label: "خطوط النسخ", slug: "naskh", category: "نسخ" },
  { label: "خطوط التصميم", slug: "tasmeem", category: "تصميم" },
  { label: "خطوط الغرافيتي", slug: "graffiti", category: "الغرافيتي" },
  { label: "خطوط الفوتوشوب", slug: "photoshop", category: "فوتوشوب" },
  { label: "خطوط النستعليق", slug: "nastaliq", category: "نستعليق" },
];

export default function FontDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [previewText, setPreviewText] = useState("الخط العربي");
  const [fontSize, setFontSize] = useState(32);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="فهرس الخطوط العربية | xfontat"
        description="تصفح تصنيفات الخطوط العربية في xfontat، واختر نوع الخط المناسب لمشروعك ومعاينته قبل التحميل."
        path="/fonts"
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "فهرس الخطوط العربية",
          description: "فهرس تصنيفات الخطوط العربية في xfontat.",
          url: "https://xfontat.com/fonts",
          inLanguage: "ar",
        }}
      />
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        previewText={previewText}
        onPreviewTextChange={setPreviewText}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />
      <main className="container mx-auto w-full flex-1 px-4 py-8">
        <nav aria-label="مسار الصفحة" className="mb-5 text-sm text-muted-foreground">
          <Link href="/">الرئيسية</Link>
          <span className="mx-2">/</span>
          <span aria-current="page">فهرس الخطوط</span>
        </nav>
        <h1 className="mb-3 text-3xl font-bold">فهرس الخطوط العربية</h1>
        <p className="mb-8 max-w-3xl leading-7 text-muted-foreground">
          اختر تصنيفاً لتصفح الخطوط المتاحة فيه، وراجع ترخيص كل خط قبل استخدامه تجارياً.
        </p>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/fonts/${category.slug}`}
                className="block rounded-xl border bg-card p-5 transition-colors hover:bg-muted/50"
              >
                <h2 className="text-lg font-semibold">{category.label}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  تصفح خطوط {category.category} ومعاينتها قبل التحميل.
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
