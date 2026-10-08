import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { CategoryFilter } from "@/components/CategoryFilter";
import { FontListItem } from "@/components/FontListItem";
import { Pagination } from "@/components/Pagination";
import { Footer } from "@/components/Footer";
import { FAQ } from "@/components/FAQ";
import { SEOHead } from "@/components/SEOHead";
import { useToast } from "@/hooks/use-toast";
import { groupFontsByFamily } from "@/lib/fontFamily";
import { getCategorySlug } from "@/lib/categorySlug";
import { createCollectionPageSchema, createItemListSchema, createFAQSchema, createBreadcrumbSchema, SITE_ORIGIN } from "@/lib/schemas";
import type { Font } from "@shared/schema";

const FONTS_PER_PAGE = 15;

interface PagedFontResponse {
  data: Font[];
  total: number;
  page: number;
  limit: number;
}

const KNOWN_CATEGORIES = ["ثلث", "ديواني", "رقعة", "كوفي", "نسخ", "تصميم", "خطوط الحرة", "فوتوشوب", "نستعليق"];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [previewText, setPreviewText] = useState("بسم الله الرحمن الرحيم");
  const [fontSize, setFontSize] = useState(48);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const queryParams = new URLSearchParams({ page: String(currentPage), limit: String(FONTS_PER_PAGE) });
  if (searchQuery) queryParams.set("q", searchQuery);

  const { data: pagedData, isLoading } = useQuery<PagedFontResponse>({
    queryKey: [`/api/fonts?${queryParams.toString()}`],
  });

  const fonts = pagedData?.data ?? [];
  const totalItems = pagedData?.total ?? 0;
  const totalPages = Math.ceil(totalItems / FONTS_PER_PAGE);
  const homeTitle = "تحميل خطوط عربية مجانية | مكتبة xfontat";
  const homeDescription = "تصفّح الخطوط العربية على xfontat، واطّلع على الصيغ المتاحة والترخيص ومعلومات المصدر في صفحة كل خط.";

  const groupedFonts = useMemo(() => groupFontsByFamily(fonts), [fonts]);

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

  const schema = fonts.length > 0 ? {
    "@context": "https://schema.org",
    "@graph": [
      createCollectionPageSchema({
        name: "xfontat - مكتبة الخطوط العربية",
        description: "تصفح الخطوط العربية، واطّلع على الصيغة والترخيص ومعلومات المصدر في صفحة كل خط.",
        url: SITE_ORIGIN,
        numberOfItems: fonts.length
      }),
      createItemListSchema(fonts),
      createFAQSchema()
    ]
  } : undefined;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead 
        title={homeTitle}
        description={homeDescription}
        path="/"
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
      <CategoryFilter
        categories={KNOWN_CATEGORIES}
        selectedCategory={selectedCategory}
        onCategoryChange={(cat) => {
          if (cat === "الكل") {
            setSelectedCategory(cat);
          } else {
            window.location.href = `/fonts/${getCategorySlug(cat)}`;
          }
        }}
      />

      <section className="container mx-auto px-3 md:px-4 pt-6 pb-2">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">مكتبة خطوط عربية مجانية للتحميل الفوري</h1>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          مرحباً بك في xfontat. تصفّح خطوطاً عربية من تصنيفات متعددة، واطّلع على الصيغ والترخيص في صفحة كل خط قبل تنزيله أو استخدامه في مشروعك.
        </p>
      </section>

      <main className="flex-1 container mx-auto px-3 md:px-4 py-4 md:py-6">
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
        ) : groupedFonts.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <p className="text-base md:text-lg text-muted-foreground">
              لم يتم العثور على خطوط تطابق البحث
            </p>
          </div>
        ) : (
          <>
            <div className="mb-3 md:mb-4 pb-3 border-b">
              <p className="text-xs md:text-sm text-muted-foreground">
                تصفّح الخطوط العربية المتاحة
              </p>
            </div>

            <div className="space-y-0">
              {groupedFonts.map((group) => (
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
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </main>

      {/* Educational content about Arabic typography */}
      <section className="container mx-auto px-3 md:px-4 py-10 border-t">
        <h2 className="text-2xl font-bold mb-6">ما هو الخط العربي وما أهميته للمصمم؟</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-muted-foreground leading-loose mb-4">
              الخط العربي نظام كتابة وفن بصري تطورت أساليبه عبر قرون وفي سياقات متعددة. يُكتب من اليمين إلى اليسار، وتتغير أشكال كثير من حروفه بحسب موقعها في الكلمة.
            </p>
            <p className="text-muted-foreground leading-loose">
              اختيار الخط قرار تصميمي يرتبط بطبيعة النص والجمهور والوسيط. جرّب الخط على المحتوى الحقيقي، وتحقق من وضوحه ودعمه للحروف والتشكيل قبل اعتماده.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">لماذا تختار xfontat؟</h3>
            <ul className="space-y-3">
              {[
                { title: "تصنيفات متنوعة", desc: "استكشف مجموعات من الخطوط العربية بأساليب مختلفة" },
                { title: "تنزيل الخطوط", desc: "تحقق من الصيغ المتاحة والترخيص في صفحة كل خط" },
                { title: "معاينة مباشرة", desc: "اكتب نصك الخاص وشاهده بأي خط قبل التحميل" },
                { title: "توافق حسب الصيغة", desc: "تحقق من دعم نظامك وبرنامجك لصيغة الخط قبل استخدامه" },
                { title: "معلومات لكل خط", desc: "راجع تفاصيل الملف ومصدره وترخيصه قبل الاستخدام" },
              ].map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                  <span className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">{item.title}:</strong> {item.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-3 md:px-4 py-10 border-t">
        <h2 className="text-2xl font-bold mb-6">كيف تختار الخط العربي المناسب لمشروعك؟</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: "للشعارات والهوية البصرية",
              content: "جرّب الكوفي الهندسي أو الثلث أو غيرهما على اسم العلامة بالحجم الفعلي. قارن وضوح الحروف وسهولة استخدامها في النسخ الصغيرة قبل الاختيار."
            },
            {
              title: "لمنشورات السوشال ميديا",
              content: "اختبر وضوح الخط على شاشة هاتف وبالحجم الذي سيظهر به المنشور. اضبط الوزن والتباين بما يناسب الخلفية والنص."
            },
            {
              title: "للكتب والمحتوى الطويل",
              content: "قارن بين الخطوط التي تدعم الحروف والتشكيل المطلوبين. اضبط حجم النص وتباعد الأسطر على صفحات فعلية، ثم اختبر القراءة على الأجهزة المستهدفة."
            },
            {
              title: "للدعوات والمناسبات",
              content: "يمكن تجربة الديواني أو الثلث للعناوين الزخرفية. تأكد من بقاء الاسم والتاريخ واضحين، ولا تستخدم زخارف تحجب المعلومات المهمة."
            },
            {
              title: "للمحتوى الديني والقرآني",
              content: "تحقق من دعم الخط للحروف والتشكيل المطلوبين، وراجع النص مع مصدر موثوق أو مختص قبل نشر محتوى ديني أو قرآني."
            },
            {
              title: "للفوتوشوب والتصميم الجرافيكي",
              content: "تحقق من أن إصدار البرنامج يدعم العربية واتجاه الكتابة، ثم جرّب الخط داخل الملف النهائي قبل تسليم التصميم."
            }
          ].map((item, i) => (
            <div key={i} className="border rounded-lg p-5">
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-3 md:px-4 py-10 border-t">
        <h2 className="text-2xl font-bold mb-2">أصناف الخطوط العربية: دليل سريع</h2>
        <p className="text-muted-foreground mb-6">الخط العربي يضم مدارس متعددة تختلف في تاريخها وأسلوبها واستخداماتها. إليك نظرة سريعة على الأصناف الرئيسية:</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "خط الثلث", desc: "أسلوب زخرفي يمكن تجربته في العناوين واللوحات" },
            { name: "خط الديواني", desc: "أسلوب انسيابي قد يناسب الدعوات والعناوين الزخرفية" },
            { name: "خط الرقعة", desc: "أسلوب مختصر يمكن تجربته في الكتابة والعناوين القصيرة" },
            { name: "خط الكوفي", desc: "أساليب ذات بناء هندسي مناسب للتجربة في الشعارات" },
            { name: "خط النسخ", desc: "أسلوب شائع في النصوص المطبوعة؛ اختبر وضوح كل خط وحجمه" },
            { name: "خطوط التصميم", desc: "خطوط بأساليب متنوعة للمشروعات البصرية" },
            { name: "خطوط الحرة", desc: "أساليب تعبيرية تصلح للتجربة في العناوين والملصقات" },
            { name: "خطوط الفوتوشوب", desc: "خطوط يمكن تجربتها في برامج التصميم التي تدعم صيغها" },
            { name: "خط النستعليق", desc: "أسلوب يرتبط بالخط الفارسي ويمكن تجربته في العناوين والزخرفة" },
          ].map((item, i) => (
            <div key={i} className="border rounded-lg p-4">
              <p className="font-semibold text-sm mb-1">{item.name}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-3 md:px-4 py-8">
        <h2 className="text-xl font-bold mb-4">تصفح الخطوط حسب الاستخدام</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: "خطوط للشعارات", slug: "khotot-lil-shiaarat", desc: "كوفي وتصميم" },
            { name: "خطوط للتيك توك", slug: "khotot-lil-tiktok", desc: "رقعة وتصميم" },
            { name: "خطوط مزخرفة", slug: "khotot-muzakhrafa", desc: "ثلث وديواني" },
            { name: "خطوط للكتب", slug: "khotot-lil-kotob", desc: "نسخ كلاسيكية" },
            { name: "خطوط للفوتوشوب", slug: "khotot-lil-photoshop", desc: "فوتوشوب وإلستريتور" },
            { name: "خطوط لليوتيوبرز", slug: "khotot-lil-youtubiyeen", desc: "كوفي ورقعة" },
            { name: "خطوط للدعوات", slug: "khotot-lil-dawaat", desc: "ثلث وديواني" },
            { name: "خطوط مجانية", slug: "khotot-bidoon-hoqooq", desc: "جميع الفئات" },
          ].map(col => (
            <Link
              key={col.slug}
              href={`/collection/${col.slug}`}
              className="border rounded-lg p-4 hover-elevate text-center block"
              data-testid={`link-home-collection-${col.slug}`}
            >
              <p className="font-semibold text-sm">{col.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{col.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <FAQ />
      <Footer />
    </div>
  );
}
