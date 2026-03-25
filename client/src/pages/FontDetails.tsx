import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Download, Heart, Monitor, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SEOHead } from "@/components/SEOHead";
import { ThemeToggle } from "@/components/ThemeToggle";
import { loadFont, generateFontFamily } from "@/lib/fontLoader";
import { generateSlug } from "@/lib/slugify";
import { createBreadcrumbSchema } from "@/lib/schemas";
import { blogPosts } from "@/lib/blogData";
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

const categoryDescriptions: Record<string, string> = {
  "ثلث": "خط الثلث من أجمل الخطوط العربية الكلاسيكية، يتميز بزخرفته الأنيقة ويُستخدم في العناوين والنصوص الدينية والتصاميم الفاخرة.",
  "ديواني": "خط الديواني خط عربي تقليدي يتميز بانحناءاته الأنيقة وزخارفه الجميلة، مثالي للدعوات والمناسبات الرسمية والتصاميم الفنية.",
  "رقعة": "خط الرقعة من أكثر الخطوط العربية استخداماً في الكتابة اليومية، يتميز بالبساطة والوضوح ويناسب التصاميم العصرية.",
  "كوفي": "خط الكوفي خط عربي هندسي عصري، يتميز بزواياه الحادة وتصميمه النظيف، مثالي للشعارات والهوية البصرية والتصاميم الحديثة.",
  "نسخ": "خط النسخ من أوضح الخطوط العربية وأسهلها قراءة، يُستخدم في الكتب والمطبوعات والمحتوى الرقمي والنصوص الطويلة.",
  "تصميم": "خط تصميمي حديث واحترافي، يناسب الإعلانات والبوسترات والتصاميم الإبداعية ومشاريع الهوية البصرية.",
  "فوتوشوب": "خط احترافي متوافق مع جميع برامج التصميم مثل فوتوشوب وإلستريتور، مناسب للتصاميم الاحترافية والمشاريع الإبداعية.",
};

const categoryUseCases: Record<string, string[]> = {
  "ثلث": ["العناوين الفخمة", "التصاميم الإسلامية", "الشعارات التراثية", "أغلفة الكتب"],
  "ديواني": ["دعوات الزفاف", "المناسبات الرسمية", "الشهادات", "التصاميم الفنية"],
  "رقعة": ["التصاميم العصرية", "المحتوى الرقمي", "السوشال ميديا", "العناوين"],
  "كوفي": ["الشعارات", "الهوية البصرية", "التطبيقات", "المواقع الإلكترونية"],
  "نسخ": ["الكتب والمطبوعات", "المقالات", "المحتوى التعليمي", "التقارير"],
  "تصميم": ["الإعلانات", "البوسترات", "السوشال ميديا", "الهوية البصرية"],
  "فوتوشوب": ["تصاميم الفوتوشوب", "الإعلانات الرقمية", "البنرات", "منشورات السوشال ميديا"],
};

function getRelatedBlogPosts(category: string) {
  const categoryKeywords: Record<string, string[]> = {
    "ثلث": ["ثلث", "خطوط عربية", "تصميم", "شعارات"],
    "ديواني": ["ديواني", "مزخرفة", "خطوط عربية"],
    "رقعة": ["رقعة", "خطوط عربية", "سوشال"],
    "كوفي": ["كوفي", "شعارات", "لوجو", "تصميم"],
    "نسخ": ["نسخ", "خطوط عربية", "فوتوشوب"],
    "تصميم": ["تصميم", "شعارات", "فوتوشوب", "سوشال"],
    "فوتوشوب": ["فوتوشوب", "تصميم", "سوشال"],
  };
  const keywords = categoryKeywords[category] || ["خطوط عربية"];
  return blogPosts
    .filter(post =>
      keywords.some(kw =>
        post.title.includes(kw) || post.keywords.some(pk => pk.includes(kw))
      )
    )
    .slice(0, 3);
}

export default function FontDetails() {
  const [match, params] = useRoute("/font/:slug");
  const slug = params?.slug;
  
  const [previewText, setPreviewText] = useState("بسم الله الرحمن الرحيم");
  const [fontLoaded, setFontLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  const { data: fonts = [], isLoading } = useQuery<Font[]>({
    queryKey: ["/api/fonts"],
  });

  const font = fonts.find(f => generateSlug(f.name) === slug);
  const fontFamily = font ? generateFontFamily(font.name) : '';

  const relatedFonts = useMemo(() => {
    if (!font) return [];
    return fonts
      .filter(f => f.category === font.category && f.id !== font.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 6);
  }, [font?.id, font?.category, fonts.length]);

  const allCategories = useMemo(() => {
    return Array.from(new Set(fonts.map(f => f.category)));
  }, [fonts.length]);

  useEffect(() => {
    if (font) {
      setFontLoaded(false);
      loadFont(fontFamily, font.fileUrl)
        .then(() => {
          setTimeout(() => setFontLoaded(true), 300);
        })
        .catch(() => {
          setTimeout(() => setFontLoaded(true), 500);
        });
    }
  }, [font?.id, fontFamily, font?.fileUrl]);

  const handleDownload = () => {
    if (!font) return;
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
          <p className="text-muted-foreground">جاري تحميل الخط...</p>
        </div>
      </div>
    );
  }

  if (!font) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">الخط غير موجود</h1>
        <div className="flex gap-3">
          <Link href="/" data-testid="link-home-404">
            <Button variant="outline">العودة للرئيسية</Button>
          </Link>
        </div>
      </div>
    );
  }

  const fontSlug = generateSlug(font.name);
  const categoryDesc = categoryDescriptions[font.category] || "خط عربي احترافي مناسب للتصميم والطباعة.";
  const useCases = categoryUseCases[font.category] || ["التصميم", "الطباعة"];
  const relatedArticles = getRelatedBlogPosts(font.category);

  const breadcrumbItems = [
    { label: 'الرئيسية', href: '/' },
    { label: font.category, href: `/fonts/${font.category}` },
    { label: font.nameArabic, href: `/font/${fontSlug}` }
  ];

  const seoTitle = `تحميل خط ${font.nameArabic} مجاناً - ${font.name} | xfontat`;
  const seoDescription = `حمّل خط ${font.nameArabic} (${font.name}) مجاناً بصيغة ${font.fileFormat}. خط عربي من فئة ${font.category} مناسب لـ${useCases.slice(0, 3).join(" و")}. معاينة مباشرة وتحميل فوري من مكتبة xfontat.`;

  const fontPageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      createBreadcrumbSchema([
        { name: "الرئيسية", url: "https://www.xfontat.com/" },
        { name: font.category, url: `https://www.xfontat.com/fonts/${font.category}` },
        { name: font.nameArabic, url: `https://www.xfontat.com/font/${fontSlug}` }
      ]),
      {
        "@type": "SoftwareApplication",
        "name": `${font.nameArabic} - ${font.name}`,
        "description": seoDescription,
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Windows, macOS, Linux",
        "fileFormat": font.fileFormat,
        "inLanguage": "ar",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "downloadUrl": `https://www.xfontat.com${font.fileUrl}`,
        "url": `https://www.xfontat.com/font/${fontSlug}`
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `كيف أحمل خط ${font.nameArabic}؟`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `اضغط على زر "تحميل الخط" في صفحة الخط على موقع xfontat. سيتم تحميل ملف بصيغة ${font.fileFormat} مباشرة على جهازك.`
            }
          },
          {
            "@type": "Question",
            "name": `هل خط ${font.nameArabic} مجاني؟`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `نعم، خط ${font.nameArabic} متاح للتحميل المجاني من مكتبة xfontat لاستخدامه في مشاريعك التصميمية والطباعية.`
            }
          },
          {
            "@type": "Question",
            "name": `ما هي استخدامات خط ${font.nameArabic}؟`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `خط ${font.nameArabic} من فئة ${font.category} ومناسب لـ${useCases.join("، ")}. ${categoryDesc}`
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        path={`/font/${fontSlug}`}
        schema={fontPageSchema}
      />

      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity shrink-0" data-testid="link-home">
              <img src="/logo.png" alt="xfontat" className="h-8 md:h-10 w-auto" />
            </Link>
            <nav className="hidden md:flex items-center gap-4 text-sm flex-1">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-nav-home">الرئيسية</Link>
              <Link href="/design-fonts" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-nav-design">خطوط التصميم</Link>
              <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-nav-blog">المدونة</Link>
            </nav>
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
                تحميل خط {font.nameArabic} مجاناً
              </h1>
              <p className="text-muted-foreground mb-4">{font.name} - خط {font.category} عربي احترافي</p>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {categoryDesc} يتوفر خط {font.nameArabic} بصيغة {font.fileFormat} وهو مناسب لـ{useCases.join("، ")}.
              </p>

              <div 
                className="text-4xl md:text-6xl leading-relaxed mb-4 p-6 bg-muted/30 rounded-lg min-h-[120px] flex items-center"
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

              <div className="border rounded-lg p-6 mb-8">
                <h2 className="text-lg font-bold mb-4">معاينة بأحجام مختلفة</h2>
                <div className="space-y-4">
                  {[{ label: "عنوان رئيسي", size: 48 }, { label: "عنوان فرعي", size: 32 }, { label: "نص عادي", size: 20 }, { label: "نص صغير", size: 14 }].map(({ label, size }) => (
                    <div key={size}>
                      <span className="text-xs text-muted-foreground mb-1 block">{label} ({size}px)</span>
                      <div
                        className="leading-relaxed break-words"
                        style={{ fontFamily: fontLoaded ? fontFamily : 'inherit', fontSize: `${size}px`, lineHeight: 1.6 }}
                        data-testid={`text-size-preview-${size}`}
                      >
                        {fontLoaded ? previewText : "جاري التحميل..."}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mb-8">
                <Button
                  size="lg"
                  className="flex-1 md:flex-none text-base"
                  onClick={handleDownload}
                  data-testid="button-download-font"
                >
                  <Download className="ml-2 h-5 w-5" />
                  تحميل خط {font.nameArabic}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={isFavorite ? "text-red-500 border-red-500" : ""}
                  onClick={() => setIsFavorite(!isFavorite)}
                  data-testid="button-favorite"
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                </Button>
              </div>

              <div className="border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">معلومات خط {font.nameArabic}</h2>
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
                    <Link href={`/fonts/${font.category}`} className="mr-2 font-medium hover:underline" data-testid="link-info-category">
                      {font.category}
                    </Link>
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
                  <div>
                    <span className="text-muted-foreground">السعر:</span>
                    <span className="mr-2 font-medium text-green-600 dark:text-green-400">مجاني</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">التوافق:</span>
                    <span className="mr-2 font-medium">ويندوز، ماك، لينكس</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">استخدامات خط {font.nameArabic}</h2>
                <div className="flex flex-wrap gap-2">
                  {useCases.map((useCase) => (
                    <span key={useCase} className="px-3 py-1.5 bg-muted text-sm rounded-md">
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">كيفية تثبيت خط {font.nameArabic}</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-medium">التثبيت على ويندوز</h3>
                    </div>
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside mr-6">
                      <li>حمّل الخط بالضغط على زر "تحميل الخط" أعلاه</li>
                      <li>افتح ملف الخط ({font.fileFormat})</li>
                      <li>اضغط على زر "Install" في النافذة التي تظهر</li>
                      <li>الخط جاهز للاستخدام في جميع البرامج</li>
                    </ol>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Apple className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-medium">التثبيت على ماك</h3>
                    </div>
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside mr-6">
                      <li>حمّل الخط بالضغط على زر "تحميل الخط" أعلاه</li>
                      <li>انقر مرتين على ملف الخط ({font.fileFormat})</li>
                      <li>اضغط "Install Font" في تطبيق Font Book</li>
                      <li>الخط جاهز للاستخدام في جميع البرامج</li>
                    </ol>
                  </div>
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
                          className="w-8 h-8 md:w-10 md:h-10 border rounded-md flex items-center justify-center text-sm md:text-base"
                          style={{ fontFamily: fontLoaded ? fontFamily : 'inherit' }}
                        >
                          {char}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {relatedFonts.length > 0 && (
                <div className="border rounded-lg p-6 mb-8">
                  <h2 className="text-xl font-bold mb-4">خطوط مشابهة من فئة {font.category}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {relatedFonts.map((relFont) => (
                      <Link
                        key={relFont.id}
                        href={`/font/${generateSlug(relFont.name)}`}
                        className="border rounded-lg p-4 hover-elevate transition-all block"
                        data-testid={`link-related-font-${relFont.id}`}
                      >
                        <h3 className="text-sm font-medium mb-1 truncate">{relFont.nameArabic}</h3>
                        <p className="text-xs text-muted-foreground truncate">{relFont.name}</p>
                        <span className="text-xs text-muted-foreground mt-2 inline-block">{relFont.fileFormat}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Link
                      href={`/fonts/${font.category}`}
                      className="text-sm text-foreground hover:underline"
                      data-testid="link-view-all-category"
                    >
                      عرض جميع خطوط {font.category}
                    </Link>
                  </div>
                </div>
              )}

              {relatedArticles.length > 0 && (
                <div className="border rounded-lg p-6 mb-8">
                  <h2 className="text-xl font-bold mb-4">مقالات ذات صلة</h2>
                  <div className="space-y-3">
                    {relatedArticles.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/blog/${article.slug}`}
                        className="block border rounded-lg p-4 hover-elevate transition-all"
                        data-testid={`link-related-article-${article.slug}`}
                      >
                        <h3 className="text-sm font-medium mb-1">{article.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{article.excerpt}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="border rounded-lg p-6 sticky top-24 space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-3">فئة الخط</h3>
                  <Link href={`/fonts/${font.category}`} data-testid="link-font-category">
                    <span className="px-3 py-1 bg-muted text-foreground rounded-md text-sm cursor-pointer hover:bg-muted/80">
                      {font.category}
                    </span>
                  </Link>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-3">تصفح الفئات</h3>
                  <div className="flex flex-wrap gap-2">
                    {allCategories.filter(c => c !== font.category).map(cat => (
                      <Link key={cat} href={`/fonts/${cat}`} data-testid={`link-category-${cat}`}>
                        <span className="px-3 py-1 bg-muted/50 text-muted-foreground rounded-md text-sm cursor-pointer hover:bg-muted">
                          {cat}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleDownload}
                    data-testid="button-sidebar-download"
                  >
                    <Download className="ml-2 h-5 w-5" />
                    تحميل مجاني
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    صيغة {font.fileFormat} - متوافق مع جميع الأنظمة
                  </p>
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
