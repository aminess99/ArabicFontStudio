import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { CategoryFilter } from "@/components/CategoryFilter";
import { HeroSection } from "@/components/HeroSection";
import { FontCard } from "@/components/FontCard";
import { FontPreviewModal } from "@/components/FontPreviewModal";
import { useToast } from "@/hooks/use-toast";
import type { Font } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedFont, setSelectedFont] = useState<Font | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
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

  const handlePreview = (font: Font) => {
    setSelectedFont(font);
    setIsPreviewOpen(true);
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
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <HeroSection searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <main className="container mx-auto px-4 py-8">
        {filteredFonts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              لم يتم العثور على خطوط تطابق البحث
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                {selectedCategory === "الكل" ? "جميع الخطوط" : `خطوط ${selectedCategory}`}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredFonts.length} خط متاح
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFonts.map((font) => (
                <FontCard
                  key={font.id}
                  {...font}
                  onPreview={() => handlePreview(font)}
                  onDownload={() => handleDownload(font)}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <FontPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        font={selectedFont}
        onDownload={() => selectedFont && handleDownload(selectedFont)}
      />
    </div>
  );
}
