import { useState } from "react";
import { Header } from "@/components/Header";
import { CategoryFilter } from "@/components/CategoryFilter";
import { HeroSection } from "@/components/HeroSection";
import { FontCard } from "@/components/FontCard";
import { FontPreviewModal } from "@/components/FontPreviewModal";
import { useToast } from "@/hooks/use-toast";

//todo: remove mock functionality - replace with API data
const mockFonts = [
  {
    id: "1",
    name: "Cairo",
    nameArabic: "القاهرة",
    designer: "محمد غالب",
    category: "حديث",
    style: "عادي",
    fileFormat: "TTF",
    fileUrl: "#",
    fileName: "cairo.ttf"
  },
  {
    id: "2",
    name: "Amiri",
    nameArabic: "الأميري",
    designer: "خالد حسني",
    category: "نسخ",
    style: "تقليدي",
    fileFormat: "OTF",
    fileUrl: "#",
    fileName: "amiri.otf"
  },
  {
    id: "3",
    name: "Kufi",
    nameArabic: "الكوفي",
    designer: "أحمد سعيد",
    category: "كوفي",
    style: "سميك",
    fileFormat: "WOFF",
    fileUrl: "#",
    fileName: "kufi.woff"
  },
  {
    id: "4",
    name: "Diwani",
    nameArabic: "الديواني",
    designer: "فاطمة علي",
    category: "ديواني",
    style: "خفيف",
    fileFormat: "TTF",
    fileUrl: "#",
    fileName: "diwani.ttf"
  },
  {
    id: "5",
    name: "Naskh Pro",
    nameArabic: "النسخ برو",
    designer: "عمر خالد",
    category: "نسخ",
    style: "عادي",
    fileFormat: "OTF",
    fileUrl: "#",
    fileName: "naskh-pro.otf"
  },
  {
    id: "6",
    name: "Modern Arabic",
    nameArabic: "العربي الحديث",
    designer: "سارة محمد",
    category: "حديث",
    style: "سميك",
    fileFormat: "WOFF",
    fileUrl: "#",
    fileName: "modern-arabic.woff"
  },
  {
    id: "7",
    name: "Traditional",
    nameArabic: "التقليدي",
    designer: "يوسف أحمد",
    category: "تقليدي",
    style: "عادي",
    fileFormat: "TTF",
    fileUrl: "#",
    fileName: "traditional.ttf"
  },
  {
    id: "8",
    name: "Elegant Kufi",
    nameArabic: "الكوفي الأنيق",
    designer: "ليلى حسن",
    category: "كوفي",
    style: "خفيف",
    fileFormat: "OTF",
    fileUrl: "#",
    fileName: "elegant-kufi.otf"
  }
];

const categories = ["كوفي", "نسخ", "ديواني", "حديث", "تقليدي"];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedFont, setSelectedFont] = useState<typeof mockFonts[0] | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();

  const filteredFonts = mockFonts.filter((font) => {
    const matchesSearch = 
      font.nameArabic.includes(searchQuery) || 
      font.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (font.designer && font.designer.includes(searchQuery));
    const matchesCategory = selectedCategory === "الكل" || font.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePreview = (font: typeof mockFonts[0]) => {
    setSelectedFont(font);
    setIsPreviewOpen(true);
  };

  const handleDownload = (font: typeof mockFonts[0]) => {
    //todo: remove mock functionality - implement real download
    toast({
      title: "جاري التحميل",
      description: `يتم الآن تحميل خط ${font.nameArabic}`,
    });
    console.log("Downloading font:", font.name);
  };

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
