import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { CategoryFilter } from "@/components/CategoryFilter";
import { FontListItem } from "@/components/FontListItem";
import { useToast } from "@/hooks/use-toast";
import type { Font } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [previewText, setPreviewText] = useState("بسم الله الرحمن الرحيم");
  const [fontSize, setFontSize] = useState(48);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const { data: fonts = [], isLoading } = useQuery<Font[]>({
    queryKey: ["/api/fonts"],
  });

  const categories = Array.from(new Set(fonts.map(font => font.category)));

  const filteredFonts = fonts.filter((font) => {
    const matchesSearch = 
      font.nameArabic.includes(searchQuery) || 
      font.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (font.designer && font.designer.includes(searchQuery)) ||
      (font.description && font.description.includes(searchQuery));
    const matchesCategory = selectedCategory === "الكل" || font.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
    <div className="min-h-screen bg-background">
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

      <main className="container mx-auto px-4 py-6">
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
                الخطوط 1 - {Math.min(filteredFonts.length, 10)} من {filteredFonts.length}
              </p>
            </div>
            
            <div className="space-y-0">
              {filteredFonts.slice(0, 10).map((font) => (
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
          </>
        )}
      </main>
    </div>
  );
}
