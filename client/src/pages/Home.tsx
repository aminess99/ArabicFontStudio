import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { CategoryFilter } from "@/components/CategoryFilter";
import { FontListItem } from "@/components/FontListItem";
import { Pagination } from "@/components/Pagination";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import type { Font } from "@shared/schema";

const FONTS_PER_PAGE = 15;

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [previewText, setPreviewText] = useState("بسم الله الرحمن الرحيم");
  const [fontSize, setFontSize] = useState(48);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const { data: fonts = [], isLoading } = useQuery<Font[]>({
    queryKey: ["/api/fonts"],
  });

  const categories = Array.from(new Set(fonts.map(font => font.category)));

  const filteredFonts = fonts
    .filter((font) => {
      const matchesSearch = 
        font.nameArabic.includes(searchQuery) || 
        font.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (font.designer && font.designer.includes(searchQuery)) ||
        (font.description && font.description.includes(searchQuery));
      
      let matchesCategory = true;
      if (selectedCategory === "الكل") {
        matchesCategory = true;
      } else {
        matchesCategory = font.category === selectedCategory;
      }
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const dateA = new Date(a.addedAt).getTime();
      const dateB = new Date(b.addedAt).getTime();
      return dateB - dateA;
    });

  const totalPages = Math.ceil(filteredFonts.length / FONTS_PER_PAGE);
  const startIndex = (currentPage - 1) * FONTS_PER_PAGE;
  const endIndex = startIndex + FONTS_PER_PAGE;
  const currentFonts = filteredFonts.slice(startIndex, endIndex);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل الخطوط...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery}
        previewText={previewText}
        onPreviewTextChange={setPreviewText}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <main className="flex-1 container mx-auto px-4 py-6">
        {filteredFonts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              لم يتم العثور على خطوط تطابق البحث
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 pb-3 border-b">
              <p className="text-sm text-muted-foreground">
                الخطوط {startIndex + 1} - {Math.min(endIndex, filteredFonts.length)} من {filteredFonts.length}
              </p>
            </div>
            
            <div className="space-y-0">
              {currentFonts.map((font) => (
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
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
