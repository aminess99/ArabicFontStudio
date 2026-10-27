import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { readBootData } from "@/lib/bootData";
import { Link } from "wouter";
import { ToolTiles, type ToolTile } from "@/components/ToolTiles";
import { Header } from "@/components/Header";
import { CategoryFilter } from "@/components/CategoryFilter";
import { FontListItem } from "@/components/FontListItem";
import { Pagination } from "@/components/Pagination";
import { Footer } from "@/components/Footer";
import { FAQ } from "@/components/FAQ";
import { SEOHead } from "@/components/SEOHead";
import { useToast } from "@/hooks/use-toast";
import { groupFontsByFamily } from "@/lib/fontFamily";
import { getCategorySlug } from "@/lib/categorySlug";
import { getCanonicalFontSlug } from "@/lib/slugify";
import { howToPosts } from "@/lib/howToPosts";
import {
  homeAbout,
  homeCategoryGuide,
  homeChoose,
  homeCollections,
  homeDescription,
  homeGuidesHeading,
  homeHeading,
  homeIntro,
  homeLatestHeading,
  homeTitle,
  type HomeStats,
} from "@/lib/homeContent";
import { createCollectionPageSchema, createItemListSchema, createFAQSchema, createBreadcrumbSchema, SITE_ORIGIN } from "@/lib/schemas";
import type { Font } from "@shared/schema";

const FONTS_PER_PAGE = 15;

interface PagedFontResponse {
  data: Font[];
  total: number;
  page: number;
  limit: number;
}

const KNOWN_CATEGORIES = ["ثلث", "ديواني", "رقعة", "كوفي", "نسخ", "تصميم", "خطوط الحرة", "فوتوشوب", "نستعليق"];

const TOOL_CARDS: ToolTile[] = [
  { href: "/arabic-text-to-image", icon: "generator", title: "اكتب اسمك بالخط العربي", text: "اختر خطاً من المكتبة وحمّل النص صورة PNG." },
  { href: "/tahnia", icon: "cards", title: "بطاقات تهنئة باسمك", text: "رمضان والعيد والزواج والمولود بخطوط عربية جميلة." },
  { href: "/zakhrafa", icon: "zakhrafa", title: "زخرفة الأسماء", text: "أشكال مزخرفة جاهزة للنسخ في الألعاب ووسائل التواصل." },
  { href: "/keyboard", icon: "keyboard", title: "كيبورد عربي اونلاين", text: "اكتب بالعربي من أي جهاز مع التشكيل، ثم انسخ النص." },
  { href: "/asmaa", icon: "names", title: "أسماء بالإنجليزي", text: "كتابة الأسماء بالإنجليزي مع معناها وزخرفتها." },
  { href: "/khotot-tattoo", icon: "tattoo", title: "خطوط تاتو عربية", text: "عاين كتابة الوشم بخطوط الثلث والديواني والكوفي." },
];

export default function Home() {
  // ?q= comes from the header search on other pages.
  const [searchQuery, setSearchQuery] = useState(() => new URLSearchParams(window.location.search).get("q") ?? "");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [previewText, setPreviewText] = useState("بسم الله الرحمن الرحيم");
  const [fontSize, setFontSize] = useState(48);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const queryParams = new URLSearchParams({ page: String(currentPage), limit: String(FONTS_PER_PAGE) });
  if (searchQuery) queryParams.set("q", searchQuery);

  const { data: pagedData, isLoading } = useQuery<PagedFontResponse>({
    queryKey: [`/api/fonts?${queryParams.toString()}`],
  });

  const fonts = pagedData?.data ?? [];
  const totalItems = pagedData?.total ?? 0;
  const totalPages = Math.ceil(totalItems / FONTS_PER_PAGE);
  const { data: summary } = useQuery<HomeStats & { latest: Font[] }>({ queryKey: ["/api/home-summary"] });
  // The server embeds the counts so the intro does not change length after load.
  const bootStats = useMemo(() => readBootData<HomeStats>("homeStats"), []);

  const groupedFonts = useMemo(() => groupFontsByFamily(fonts), [fonts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const handleToggleFavorite = (fontId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(fontId)) {
        newFavorites.delete(fontId);
      } else {
        newFavorites.add(fontId);
      }
      return newFavorites;
    });
  };

  const handleDownload = (font: Font) => {
    const link = document.createElement('a');
    link.href = font.fileUrl;
    link.download = font.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "جاري التحميل",
      description: `يتم الآن تحميل خط ${font.nameArabic}`,
    });
  };

  const schema = fonts.length > 0 ? {
    "@context": "https://schema.org",
    "@graph": [
      createCollectionPageSchema({
        name: homeHeading,
        description: homeDescription,
        url: SITE_ORIGIN,
        numberOfItems: fonts.length
      }),
      createItemListSchema(fonts),
      createFAQSchema()
    ]
  } : undefined;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead 
        title={homeTitle}
        description={homeDescription}
        path="/"
        schema={schema}
        alternates={[
          { lang: "ar", href: "https://xfontat.com/" },
          { lang: "en", href: "https://xfontat.com/en" },
          { lang: "x-default", href: "https://xfontat.com/" },
        ]}
      />
      <Header 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery}
        previewText={previewText}
        onPreviewTextChange={setPreviewText}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />
      <CategoryFilter
        categories={KNOWN_CATEGORIES}
        selectedCategory={selectedCategory}
        onCategoryChange={(cat) => {
          if (cat === "الكل") {
            setSelectedCategory(cat);
          } else {
            window.location.href = `/fonts/${getCategorySlug(cat)}`;
          }
        }}
      />

      <section className="container mx-auto px-3 md:px-4 pt-6 pb-2">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{homeHeading}</h1>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{homeIntro(summary ?? bootStats)}</p>
        {!searchQuery && (
          <ToolTiles tools={TOOL_CARDS} />
        )}
      </section>

      <main className="flex-1 container mx-auto px-3 md:px-4 py-4 md:py-6">
        {isLoading ? (
          <div className="space-y-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border-b py-4 md:py-6 animate-pulse">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="h-3 bg-muted rounded w-24 mb-3"></div>
                    <div className="h-10 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-40"></div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="h-9 w-9 bg-muted rounded"></div>
                    <div className="h-9 w-32 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : groupedFonts.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <p className="text-base md:text-lg text-muted-foreground">
              لم يتم العثور على خطوط تطابق البحث
            </p>
          </div>
        ) : (
          <>
            <div className="mb-3 md:mb-4 pb-3 border-b">
              <p className="text-xs md:text-sm text-muted-foreground">
                تصفّح الخطوط العربية المتاحة
              </p>
            </div>

            <div className="space-y-0">
              {groupedFonts.map((group) => (
                <FontListItem
                  key={group.primary.id}
                  {...group.primary}
                  previewText={previewText}
                  fontSize={fontSize}
                  onDownload={() => handleDownload(group.primary)}
                  isFavorite={favorites.has(group.primary.id)}
                  onToggleFavorite={() => handleToggleFavorite(group.primary.id)}
                  variantCount={group.variants.length}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </main>

      {summary?.latest?.length ? (
        <section className="container mx-auto px-3 md:px-4 py-10 border-t">
          <h2 className="text-2xl font-bold mb-6">{homeLatestHeading}</h2>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {summary.latest.map((font) => (
              <li key={font.id}>
                <Link href={`/font/${getCanonicalFontSlug(font)}`} className="block h-full rounded-lg border p-4 transition-colors hover:border-primary" data-testid={`link-latest-${font.slug}`}>
                  <span className="block font-semibold truncate">{font.nameArabic}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {font.category} · <time dateTime={new Date(font.addedAt).toISOString()}>{new Date(font.addedAt).toLocaleDateString("ar", { year: "numeric", month: "long", day: "numeric" })}</time>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Educational content about Arabic typography; copy shared with the SSR page. */}
      <section className="container mx-auto px-3 md:px-4 py-10 border-t">
        <h2 className="text-2xl font-bold mb-6">{homeAbout.heading}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            {homeAbout.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-muted-foreground leading-loose mb-4">{paragraph}</p>
            ))}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">{homeAbout.whyHeading}</h3>
            <ul className="space-y-3">
              {homeAbout.why.map((item) => (
                <li key={item.title} className="flex gap-3 items-start">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                  <span className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">{item.title}:</strong> {item.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-3 md:px-4 py-10 border-t">
        <h2 className="text-2xl font-bold mb-6">{homeChoose.heading}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {homeChoose.items.map((item) => (
            <div key={item.title} className="border rounded-lg p-5">
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-3 md:px-4 py-10 border-t">
        <h2 className="text-2xl font-bold mb-2">{homeCategoryGuide.heading}</h2>
        <p className="text-muted-foreground mb-6">{homeCategoryGuide.intro}</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {homeCategoryGuide.items.map((item) => (
            <div key={item.name} className="border rounded-lg p-4">
              <p className="font-semibold text-sm mb-1">{item.name}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-3 md:px-4 py-8">
        <h2 className="text-xl font-bold mb-4">{homeCollections.heading}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {homeCollections.items.map(col => (
            <Link
              key={col.slug}
              href={`/collection/${col.slug}`}
              className="border rounded-lg p-4 hover-elevate text-center block"
              data-testid={`link-home-collection-${col.slug}`}
            >
              <p className="font-semibold text-sm">{col.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{col.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-3 md:px-4 py-8 border-t">
        <h2 className="text-xl font-bold mb-4">{homeGuidesHeading}</h2>
        <ul className="grid gap-3 md:grid-cols-3">
          {howToPosts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="block h-full rounded-lg border p-4 transition-colors hover:border-primary">
                <span className="block font-semibold leading-relaxed">{post.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <FAQ />
      <Footer />
    </div>
  );
}
