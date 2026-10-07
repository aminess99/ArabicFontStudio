import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Download, Heart, Monitor, Apple, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SEOHead } from "@/components/SEOHead";
import { ThemeToggle } from "@/components/ThemeToggle";
import { loadFont, generateFontFamily } from "@/lib/fontLoader";
import { generateSlug } from "@/lib/slugify";
import { getCategorySlug } from "@/lib/categorySlug";
import { detectFontFamily, getWeightLabel } from "@/lib/fontFamily";
import { createBreadcrumbSchema, SITE_ORIGIN } from "@/lib/schemas";
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
  "خطوط الحرة": "خط عربي حر وغرافيتي ذو طابع تعبيري، مناسب للعناوين والملصقات والشعارات والتصاميم الإبداعية.",
  "فوتوشوب": "خط احترافي متوافق مع جميع برامج التصميم مثل فوتوشوب وإلستريتور، مناسب للتصاميم الاحترافية والمشاريع الإبداعية.",
  "نستعليق": "خط نستعليق عربي وفارسي انسيابي مناسب للشعر والمخطوطات والعناوين والتصاميم الراقية.",
};

const categoryUseCases: Record<string, string[]> = {
  "ثلث": ["العناوين الفخمة", "التصاميم الإسلامية", "الشعارات التراثية", "أغلفة الكتب"],
  "ديواني": ["دعوات الزفاف", "المناسبات الرسمية", "الشهادات", "التصاميم الفنية"],
  "رقعة": ["التصاميم العصرية", "المحتوى الرقمي", "السوشال ميديا", "العناوين"],
  "كوفي": ["الشعارات", "الهوية البصرية", "التطبيقات", "المواقع الإلكترونية"],
  "نسخ": ["الكتب والمطبوعات", "المقالات", "المحتوى التعليمي", "التقارير"],
  "تصميم": ["الإعلانات", "البوسترات", "السوشال ميديا", "الهوية البصرية"],
  "خطوط الحرة": ["العناوين", "الغرافيتي", "الملصقات", "الشعارات"],
  "فوتوشوب": ["تصاميم الفوتوشوب", "الإعلانات الرقمية", "البنرات", "منشورات السوشال ميديا"],
  "نستعليق": ["الشعر", "المخطوطات", "الأغلفة", "التصاميم الراقية"],
};

function getRelatedBlogPosts(category: string) {
  const categoryKeywords: Record<string, string[]> = {
    "ثلث": ["ثلث", "خطوط عربية", "تصميم", "شعارات"],
    "ديواني": ["ديواني", "مزخرفة", "خطوط عربية"],
    "رقعة": ["رقعة", "خطوط عربية", "سوشال"],
    "كوفي": ["كوفي", "شعارات", "لوجو", "تصميم"],
    "نسخ": ["نسخ", "خطوط عربية", "فوتوشوب"],
    "تصميم": ["تصميم", "شعارات", "فوتوشوب", "سوشال"],
    "خطوط الحرة": ["غرافيتي", "خطوط حرة", "تصميم", "شعارات"],
    "فوتوشوب": ["فوتوشوب", "تصميم", "سوشال"],
    "نستعليق": ["نستعليق", "فارسي", "خطوط عربية"],
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

function FamilyVariantCard({ variant }: { variant: Font }) {
  const [loaded, setLoaded] = useState(false);
  const fontFam = generateFontFamily(variant.name);

  useEffect(() => {
    loadFont(fontFam, variant.fileUrl)
      .then(() => setLoaded(true))
      .catch(() => setLoaded(true));
  }, [fontFam, variant.fileUrl]);

  const { toast } = useToast();

  const handleDl = () => {
    const link = document.createElement('a');
    link.href = variant.fileUrl;
    link.download = variant.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "جاري التحميل", description: `يتم الآن تحميل خط ${variant.nameArabic}` });
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <Link href={`/font/${generateSlug(variant.name, variant.fileName, variant.category)}`}>
            <h3 className="text-sm font-medium truncate hover:underline">{variant.nameArabic}</h3>
          </Link>
          <p className="text-xs text-muted-foreground truncate">{variant.name}</p>
        </div>
        <Badge variant="secondary" className="shrink-0">{getWeightLabel(variant.name)}</Badge>
      </div>
      <div
        className="text-xl mb-3 leading-relaxed truncate"
        style={{ fontFamily: loaded ? fontFam : 'inherit', direction: 'rtl' }}
      >
        بسم الله الرحمن الرحيم
      </div>
      <Button size="sm" onClick={handleDl} className="w-full" data-testid={`button-download-variant-${variant.id}`}>
        <Download className="ml-2 h-3 w-3" />
        تحميل الخط مجاناً
      </Button>
    </div>
  );
}

export default function FontDetails() {
  const [match, params] = useRoute("/font/:slug");
  const slug = params?.slug;
  
  const [previewText, setPreviewText] = useState("بسم الله الرحمن الرحيم");
  const [fontLoaded, setFontLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  const { data: font, isLoading } = useQuery<Font | null>({
    queryKey: [`/api/fonts/by-slug/${slug}`],
    enabled: !!slug,
  });

  const { data: categoryFonts = [] } = useQuery<Font[]>({
    queryKey: [`/api/fonts?category=${encodeURIComponent(font?.category ?? '')}`],
    enabled: !!font?.category,
  });

  const fontFamily = font ? generateFontFamily(font.name) : '';
  const characterMapPreview = font
    ? {
        src: `/font-previews/${generateSlug(font.name, font.fileName, font.category)}.webp`,
        label: `خريطة حروف خط ${font.nameArabic || font.name} مع علامة مائية من xfontat.com`,
      }
    : undefined;

  const familyVariants = useMemo(() => {
    if (!font) return [];
    const familyName = detectFontFamily(font.name);
    return categoryFonts.filter(f => detectFontFamily(f.name) === familyName && f.id !== font.id);
  }, [font?.id, font?.name, categoryFonts]);

  const relatedFonts = useMemo(() => {
    if (!font) return [];
    const familyName = detectFontFamily(font.name);
    return categoryFonts
      .filter(f => f.id !== font.id && detectFontFamily(f.name) !== familyName)
      .sort(() => 0.5 - Math.random())
      .slice(0, 6);
  }, [font?.id, font?.name, categoryFonts]);

  const STATIC_CATEGORIES = ["ثلث", "ديواني", "رقعة", "كوفي", "نسخ", "تصميم", "خطوط الحرة", "فوتوشوب", "نستعليق"];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  useEffect(() => {
    let cancelled = false;

    if (font) {
      setFontLoaded(false);
      loadFont(fontFamily, font.fileUrl)
        .then(() => {
          if (!cancelled) setFontLoaded(true);
        })
        .catch(() => {
          if (!cancelled) setFontLoaded(true);
        });
    }

    return () => {
      cancelled = true;
    };
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
      <div className="min-h-screen bg-background flex flex-col">
        <div className="border-b p-4 flex items-center justify-between">
          <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
        </div>
        <div className="container mx-auto px-4 py-6 space-y-6 animate-pulse">
          <div className="h-4 bg-muted rounded w-64"></div>
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-24 bg-muted rounded w-full"></div>
          <div className="h-10 bg-muted rounded w-40"></div>
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

  const fontSlug = generateSlug(font.name, font.fileName, font.category);
  const categoryDesc = categoryDescriptions[font.category] || "خط عربي احترافي مناسب للتصميم والطباعة.";
  const useCases = categoryUseCases[font.category] || ["التصميم", "الطباعة"];
  const relatedArticles = getRelatedBlogPosts(font.category);

  const breadcrumbItems = [
    { label: 'الرئيسية', href: '/' },
    { label: font.category, href: `/fonts/${getCategorySlug(font.category)}` },
    { label: font.nameArabic, href: `/font/${fontSlug}` }
  ];

  const seoTitle = `تحميل خط ${font.nameArabic} مجاناً - ${font.name} | xfontat`;
  const seoDescription = `حمّل خط ${font.nameArabic} (${font.name}) مجاناً بصيغة ${font.fileFormat}. خط عربي من فئة ${font.category} مناسب لـ${useCases.slice(0, 3).join(" و")}. معاينة مباشرة وتحميل فوري من مكتبة xfontat.`;

  const fontPageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      createBreadcrumbSchema([
        { name: "الرئيسية", url: `${SITE_ORIGIN}/` },
        { name: font.category, url: `${SITE_ORIGIN}/fonts/${getCategorySlug(font.category)}` },
        { name: font.nameArabic, url: `${SITE_ORIGIN}/font/${fontSlug}` }
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
        "downloadUrl": `${SITE_ORIGIN}${font.fileUrl}`,
        "url": `${SITE_ORIGIN}/font/${fontSlug}`
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
                {previewText}
              </div>

              <div className="mb-6">
                <label htmlFor="font-details-preview-text" className="text-sm text-muted-foreground mb-2 block">أدخل نص للمعاينة</label>
                <Input
                  id="font-details-preview-text"
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
                        {previewText}
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
                  aria-label={isFavorite ? `إزالة خط ${font.nameArabic} من المفضلة` : `إضافة خط ${font.nameArabic} إلى المفضلة`}
                  aria-pressed={isFavorite}
                  data-testid="button-favorite"
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} aria-hidden="true" />
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
                    <Link href={`/fonts/${getCategorySlug(font.category)}`} className="mr-2 font-medium hover:underline" data-testid="link-info-category">
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
                  {font.license && (
                    <div className="col-span-2 border-t pt-4">
                      <h3 className="font-semibold mb-2">ملاحظات الترخيص والمصدر</h3>
                      <p>
                        <span className="text-muted-foreground">الترخيص:</span>
                        <a
                          className="mr-2 font-medium underline underline-offset-4"
                          href="/fonts/licenses/OFL-1.1.txt"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {font.license}
                        </a>
                      </p>
                      {font.copyright && (
                        <p className="mt-1">
                          <span className="text-muted-foreground">حقوق النشر:</span>
                          <span className="mr-2">{font.copyright}</span>
                        </p>
                      )}
                      {font.sourceUrl && (
                        <p className="mt-1">
                          <span className="text-muted-foreground">صفحة المصدر:</span>
                          <a
                            className="mr-2 underline underline-offset-4"
                            href={font.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            arbfonts.com
                          </a>
                        </p>
                      )}
                      {font.licenseNotice && (
                        <details className="mt-3 rounded-md border p-3">
                          <summary className="cursor-pointer font-medium">ملاحظة الترخيص من المصدر</summary>
                          <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
                            {font.licenseNotice}
                          </p>
                        </details>
                      )}
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
                {characterMapPreview && (
                  <figure className="mt-6 border-t pt-6">
                    <figcaption className="text-sm font-medium mb-3 text-center">
                      معاينة مصورة للحروف والأرقام
                    </figcaption>
                    <img
                      src={characterMapPreview.src}
                      alt={characterMapPreview.label}
                      width={1400}
                      height={760}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto rounded-md border bg-white"
                    />
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      صورة تجريبية توضح شكل الحروف بهذا الخط
                    </p>
                  </figure>
                )}
              </div>

              {familyVariants.length > 0 && (
                <div className="border rounded-lg p-6 mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Layers className="w-5 h-5 text-muted-foreground" />
                    <h2 className="text-xl font-bold">أوزان الخط ({familyVariants.length + 1} أوزان)</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="border rounded-lg p-4 bg-muted/30">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <h3 className="text-sm font-medium truncate">{font.nameArabic}</h3>
                          <p className="text-xs text-muted-foreground truncate">{font.name}</p>
                        </div>
                        <Badge variant="secondary" className="shrink-0">{getWeightLabel(font.name)}</Badge>
                      </div>
                      <Button
                        size="sm"
                        onClick={handleDownload}
                        className="w-full mt-2"
                        data-testid="button-download-current-variant"
                      >
                        <Download className="ml-2 h-3 w-3" />
                        تحميل الخط مجاناً
                      </Button>
                    </div>
                    {familyVariants.map((variant) => (
                      <FamilyVariantCard key={variant.id} variant={variant} />
                    ))}
                  </div>
                </div>
              )}

              {relatedFonts.length > 0 && (
                <div className="border rounded-lg p-6 mb-8">
                  <h2 className="text-xl font-bold mb-4">خطوط مشابهة من فئة {font.category}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {relatedFonts.map((relFont) => (
                      <Link
                        key={relFont.id}
                        href={`/font/${generateSlug(relFont.name, relFont.fileName, relFont.category)}`}
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
                      href={`/fonts/${getCategorySlug(font.category)}`}
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
                  <Link href={`/fonts/${getCategorySlug(font.category)}`} data-testid="link-font-category">
                    <span className="px-3 py-1 bg-muted text-foreground rounded-md text-sm cursor-pointer hover:bg-muted/80">
                      {font.category}
                    </span>
                  </Link>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-3">تصفح الفئات</h3>
                  <div className="flex flex-wrap gap-2">
                    {STATIC_CATEGORIES.filter(c => c !== font.category).map(cat => (
                      <Link key={cat} href={`/fonts/${getCategorySlug(cat)}`} data-testid={`link-category-${cat}`}>
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
