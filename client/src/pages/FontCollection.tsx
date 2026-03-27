import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Header } from "@/components/Header";
import { FontListItem } from "@/components/FontListItem";
import { Pagination } from "@/components/Pagination";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useToast } from "@/hooks/use-toast";
import { createBreadcrumbSchema } from "@/lib/schemas";
import { getCollectionBySlug, collections } from "@/lib/collectionsData";
import type { Font } from "@shared/schema";

const FONTS_PER_PAGE = 15;

export default function FontCollection() {
  const [match, params] = useRoute("/collection/:slug");
  const slug = params?.slug;

  const [searchQuery, setSearchQuery] = useState("");
  const [previewText, setPreviewText] = useState("بسم الله الرحمن الرحيم");
  const [fontSize, setFontSize] = useState(48);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const collection = slug ? getCollectionBySlug(slug) : undefined;

  const { data: fonts = [], isLoading } = useQuery<Font[]>({
    queryKey: ["/api/fonts"],
  });

  const filteredFonts = fonts
    .filter(font => {
      const inCategory = collection?.categories.includes(font.category);
      const matchesSearch = !searchQuery ||
        font.nameArabic.includes(searchQuery) ||
        font.name.toLowerCase().includes(searchQuery.toLowerCase());
      return inCategory && matchesSearch;
    })
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());

  const totalPages = Math.ceil(filteredFonts.length / FONTS_PER_PAGE);
  const startIndex = (currentPage - 1) * FONTS_PER_PAGE;
  const currentFonts = filteredFonts.slice(startIndex, startIndex + FONTS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleToggleFavorite = (fontId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(fontId)) next.delete(fontId); else next.add(fontId);
      return next;
    });
  };

  const handleDownload = (font: Font) => {
    const link = document.createElement('a');
    link.href = font.fileUrl;
    link.download = font.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "جاري التحميل", description: `يتم الآن تحميل خط ${font.nameArabic}` });
  };

  if (!collection) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">المجموعة غير موجودة</h1>
        <Link href="/" data-testid="link-home-404"><span className="hover:underline">العودة للرئيسية</span></Link>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "الرئيسية", href: "/" },
    { label: collection.titleArabic, href: `/collection/${slug}` }
  ];

  const seoDescription = `${collection.description} - ${filteredFonts.length} خط عربي متاح للتحميل المجاني بصيغ TTF وOTF.`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      createBreadcrumbSchema([
        { name: "الرئيسية", url: "https://www.xfontat.com/" },
        { name: collection.titleArabic, url: `https://www.xfontat.com/collection/${slug}` }
      ]),
      {
        "@type": "CollectionPage",
        "name": collection.title,
        "description": seoDescription,
        "url": `https://www.xfontat.com/collection/${slug}`,
        "inLanguage": "ar",
        "numberOfItems": filteredFonts.length,
        "keywords": collection.keywords.join(", ")
      },
      {
        "@type": "FAQPage",
        "mainEntity": collection.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title={`${collection.title} | xfontat`}
        description={seoDescription}
        path={`/collection/${slug}`}
        schema={schema}
      />

      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        previewText={previewText}
        onPreviewTextChange={setPreviewText}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />

      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-3 md:px-4 pt-6 pb-2">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{collection.titleArabic}</h1>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
          {collection.longDescription}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {collection.useCases.map(uc => (
            <span key={uc} className="px-3 py-1 bg-muted text-sm rounded-md">{uc}</span>
          ))}
        </div>
      </div>

      <main className="flex-1 container mx-auto px-3 md:px-4 py-4 md:py-6">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل الخطوط...</p>
          </div>
        ) : filteredFonts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">لم يتم العثور على خطوط</p>
          </div>
        ) : (
          <>
            <div className="mb-3 md:mb-4 pb-3 border-b">
              <p className="text-xs md:text-sm text-muted-foreground">
                عرض {startIndex + 1} - {Math.min(startIndex + FONTS_PER_PAGE, filteredFonts.length)} من {filteredFonts.length} خط
              </p>
            </div>
            <div className="space-y-0">
              {currentFonts.map(font => (
                <FontListItem
                  key={font.id}
                  {...font}
                  previewText={previewText}
                  fontSize={fontSize}
                  onDownload={() => handleDownload(font)}
                  isFavorite={favorites.has(font.id)}
                  onToggleFavorite={() => handleToggleFavorite(font.id)}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            )}
          </>
        )}

        <div className="mt-12 border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">أسئلة شائعة عن {collection.titleArabic}</h2>
          <div className="space-y-4">
            {collection.faqs.map((faq, i) => (
              <div key={i} className="border-b last:border-0 pb-4 last:pb-0">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">تصفح مجموعات أخرى</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {collections.filter(c => c.slug !== slug).slice(0, 8).map(c => (
              <Link
                key={c.slug}
                href={`/collection/${c.slug}`}
                className="border rounded-lg p-3 hover-elevate text-center"
                data-testid={`link-other-collection-${c.slug}`}
              >
                <p className="text-sm font-medium">{c.titleArabic}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
