import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { FontListItem } from "@/components/FontListItem";
import { Pagination } from "@/components/Pagination";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { useToast } from "@/hooks/use-toast";
import { groupFontsByFamily } from "@/lib/fontFamily";
import { createCollectionPageSchema, createItemListSchema, SITE_ORIGIN } from "@/lib/schemas";
import type { Font } from "@shared/schema";

const FONTS_PER_PAGE = 15;

export default function DesignFonts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [previewText, setPreviewText] = useState("بسم الله الرحمن الرحيم");
  const [fontSize, setFontSize] = useState(48);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const { data: fonts = [], isLoading } = useQuery<Font[]>({
    queryKey: ["/api/fonts?category=%D8%AA%D8%B5%D9%85%D9%8A%D9%85"],
  });

  const filteredFonts = fonts
    .filter((font) => {
      const matchesSearch = 
        font.nameArabic.includes(searchQuery) || 
        font.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (font.designer && font.designer.includes(searchQuery)) ||
        (font.description && font.description.includes(searchQuery));
      
      return matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.addedAt).getTime();
      const dateB = new Date(b.addedAt).getTime();
      return dateB - dateA;
    });

  const groupedFonts = useMemo(() => groupFontsByFamily(filteredFonts), [filteredFonts.length, searchQuery]);

  const totalPages = Math.ceil(groupedFonts.length / FONTS_PER_PAGE);
  const startIndex = (currentPage - 1) * FONTS_PER_PAGE;
  const endIndex = startIndex + FONTS_PER_PAGE;
  const currentGroups = groupedFonts.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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
        name: `خطوط التصميم العربية الاحترافية | xfontat`,
        description: `مجموعة من خطوط التصميم الاحترافية للاستخدام في المشاريع الإبداعية`,
        url: `${SITE_ORIGIN}/design-fonts`,
        numberOfItems: fonts.length
      }),
      createItemListSchema(fonts)
    ]
  } : undefined;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead 
        title="خطوط التصميم العربية الاحترافية | xfontat"
        description="استكشف مجموعة واسعة من خطوط التصميم العربية الاحترافية. خطوط عربية حديثة ومميزة للمشاريع الإبداعية والتصميمات الاحترافية. تحميل مجاني بصيغ متعددة."
        path="/design-fonts"
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

      <div className="border-b bg-background py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">خطوط التصميم</h1>
          <p className="text-sm text-muted-foreground mt-1">
            مجموعة من الخطوط الاحترافية المناسبة للتصميم والإبداع ({fonts.length} خط)
          </p>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6">
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
        ) : filteredFonts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">لا توجد خطوط مطابقة للبحث</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground" data-testid="text-font-count">
                عائلات الخطوط {startIndex + 1} - {Math.min(endIndex, groupedFonts.length)} من {groupedFonts.length}
                {groupedFonts.length < filteredFonts.length && (
                  <span className="mr-1">({filteredFonts.length} خط إجمالاً)</span>
                )}
              </p>
            </div>

            <div className="space-y-0">
              {currentGroups.map((group) => (
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
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
