import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Download, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SEOHead } from "@/components/SEOHead";
import { ThemeToggle } from "@/components/ThemeToggle";
import { loadFont, generateFontFamily } from "@/lib/fontLoader";
import { generateSlug } from "@/lib/slugify";
import { useToast } from "@/hooks/use-toast";
import type { Font } from "@shared/schema";

const characterMap = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د'],
  ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'],
  ['ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ'],
  ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
];

export default function FontDetails() {
  const [match, params] = useRoute("/font/:slug");
  const slug = params?.slug;
  
  const [previewText, setPreviewText] = useState("أحب نفسك أولا");
  const [fontLoaded, setFontLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  const { data: fonts = [], isLoading } = useQuery<Font[]>({
    queryKey: ["/api/fonts"],
  });

  const font = fonts.find(f => generateSlug(f.name) === slug);
  const fontFamily = font ? generateFontFamily(font.name) : '';

  useEffect(() => {
    if (font) {
      setFontLoaded(false);
      loadFont(fontFamily, font.fileUrl)
        .then(() => setFontLoaded(true))
        .catch(() => setFontLoaded(true));
    }
  }, [font, fontFamily]);

  const handleDownload = () => {
    if (!font) return;
    const link = document.createElement("a");
    link.href = font.fileUrl;
    link.download = font.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "تم التحميل",
      description: `تم تحميل خط ${font.nameArabic} بنجاح`,
    });
  };

  if (!match) {
    return <div>صفحة غير موجودة</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!font) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">الخط غير موجود</h1>
          <Link href="/">
            <Button>العودة للرئيسية</Button>
          </Link>
        </div>
      </div>
    );
  }

  const fontSlug = generateSlug(font.name);

  const breadcrumbItems = [
    { label: 'الرئيسية', href: '/' },
    { label: font.category, href: `/fonts/${font.category}` },
    { label: font.nameArabic, href: `/font/${fontSlug}` }
  ];

  const seoTitle = `تحميل خط ${font.nameArabic} - ${font.name} | xfontat`;
  const seoDescription = `حمّل خط ${font.nameArabic} (${font.name}) مجاناً من فئة ${font.category}. خط عربي احترافي بصيغة ${font.fileFormat} للتصميم والطباعة.`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        path={`/font/${fontSlug}`}
      />

      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity" data-testid="link-home">
              <img src="/logo.png" alt="xfontat" className="h-8 md:h-10 w-auto" />
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb items={breadcrumbItems} />

          <div className="grid lg:grid-cols-3 gap-8 mt-6">
            <div className="lg:col-span-2">
              <h1 className="text-2xl md:text-3xl font-bold mb-2" data-testid="text-font-name">
                {font.nameArabic}
              </h1>
              <p className="text-muted-foreground mb-6">{font.name}</p>

              <div 
                className="text-4xl md:text-6xl leading-relaxed mb-6 p-6 bg-muted/30 rounded-lg min-h-[120px] flex items-center"
                style={{ fontFamily: fontLoaded ? fontFamily : 'inherit' }}
                data-testid="text-font-preview"
              >
                {fontLoaded ? previewText : "جاري تحميل الخط..."}
              </div>

              <div className="mb-6">
                <label className="text-sm text-muted-foreground mb-2 block">أدخل نص للمعاينة</label>
                <Input
                  type="text"
                  placeholder="اكتب نص للمعاينة..."
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  className="text-lg"
                  data-testid="input-preview-text"
                />
              </div>

              <div className="flex gap-3 mb-8">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white flex-1 md:flex-none text-base h-12"
                  onClick={handleDownload}
                  data-testid="button-download-font"
                >
                  <Download className="ml-2 h-5 w-5" />
                  تحميل الخط
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-12 w-12 ${isFavorite ? "text-red-500 border-red-500" : ""}`}
                  onClick={() => setIsFavorite(!isFavorite)}
                  data-testid="button-favorite"
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                </Button>
              </div>

              <div className="border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">معلومات الخط</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">اسم الخط:</span>
                    <span className="mr-2 font-medium">{font.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">الاسم العربي:</span>
                    <span className="mr-2 font-medium">{font.nameArabic}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">الفئة:</span>
                    <span className="mr-2 font-medium">{font.category}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">الصيغة:</span>
                    <span className="mr-2 font-medium">{font.fileFormat}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">النمط:</span>
                    <span className="mr-2 font-medium">{font.style}</span>
                  </div>
                  {font.designer && (
                    <div>
                      <span className="text-muted-foreground">المصمم:</span>
                      <span className="mr-2 font-medium">{font.designer}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">خريطة الأحرف</h2>
                <div className="space-y-2">
                  {characterMap.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex flex-wrap gap-1 justify-center">
                      {row.map((char, charIndex) => (
                        <div
                          key={charIndex}
                          className="w-8 h-8 md:w-10 md:h-10 border rounded flex items-center justify-center text-sm md:text-base"
                          style={{ fontFamily: fontLoaded ? fontFamily : 'inherit' }}
                        >
                          {char}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="border rounded-lg p-6 sticky top-24">
                <h3 className="text-lg font-bold mb-4">التصنيفات</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Link href={`/fonts/${font.category}`}>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm cursor-pointer hover:bg-primary/20">
                      {font.category}
                    </span>
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
