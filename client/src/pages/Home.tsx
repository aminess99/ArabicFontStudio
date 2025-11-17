import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { FontListItem } from "@/components/FontListItem";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Font } from "@shared/schema";

export default function Home() {
  const [previewText, setPreviewText] = useState("بسم الله الرحمن الرحيم");
  const [fontSize, setFontSize] = useState(48);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const { data: fonts = [], isLoading } = useQuery<Font[]>({
    queryKey: ["/api/fonts"],
  });

  const featuredFonts = fonts.filter(font => font.featured);

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
        searchQuery=""
        onSearchChange={() => {}}
        previewText={previewText}
        onPreviewTextChange={setPreviewText}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">الخطوط المميزة</h2>
              <p className="text-muted-foreground">
                تصفح مجموعتنا المختارة من أفضل الخطوط العربية
              </p>
            </div>
            <Link href="/fonts">
              <Button variant="outline" data-testid="button-view-all">
                عرض جميع الخطوط
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {featuredFonts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              لا توجد خطوط مميزة حالياً
            </p>
          </div>
        ) : (
          <div className="space-y-0 border rounded-md">
            {featuredFonts.map((font) => (
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
        )}

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            هل تبحث عن المزيد من الخطوط؟
          </p>
          <Link href="/fonts">
            <Button size="lg" data-testid="button-browse-all">
              تصفح جميع الخطوط ({fonts.length} خط)
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
