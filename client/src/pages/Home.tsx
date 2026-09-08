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

  const groupedFonts = useMemo(() => groupFontsByFamily(fonts), [fonts]);

  const startIndex = (currentPage - 1) * FONTS_PER_PAGE;

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
        description: "مكتبة شاملة من الخطوط العربية الاحترافية - ثلث، ديواني، رقعة، كوفي، نسخ، تصميم",
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
        title="xfontat | تحميل خطوط عربية مجانية - ثلث، ديواني، كوفي، نسخ، رقعة"
        description="اكتشف مكتبة شاملة من الخطوط العربية الاحترافية بأنماط متنوعة: الثلث، الديواني، الكوفي، النسخ، الرقعة، والتصميم. حمّل خطوط عربية مجانية بصيغ TTF وOTF لمشاريعك التصميمية."
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
        <h1 className="text-2xl md:text-3xl font-bold mb-2">مكتبة الخطوط العربية المجانية</h1>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          مرحباً بك في xfontat، أكبر مكتبة خطوط عربية مجانية على الإنترنت. تصفّح مجموعة واسعة من الخطوط العربية الاحترافية من فئات متنوعة تشمل خطوط الثلث، الديواني، الرقعة، الكوفي، النسخ، التصميم، والفوتوشوب. جميع الخطوط متاحة للتحميل المجاني بصيغ TTF وOTF لاستخدامها في مشاريعك التصميمية والطباعية.
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
                عرض {startIndex + 1} - {startIndex + groupedFonts.length} من {totalItems} خط
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
              الخط العربي فن بصري راقٍ يجمع بين الجمال الجمالي والوظيفة التواصلية. نشأ منذ أكثر من أربعة عشر قرناً وتطور عبر حضارات متعاقبة لينتج لنا اليوم مدرسة خطية فريدة لا مثيل لها في تنوعها وثرائها. يختلف الخط العربي عن الخط اللاتيني في كونه يُكتب من اليمين إلى اليسار، وفي أن الحرف العربي يغيّر شكله بحسب موقعه في الكلمة (بداية، وسط، نهاية)، مما يمنحه ديناميكية بصرية استثنائية.
            </p>
            <p className="text-muted-foreground leading-loose">
              للمصمم العربي، اختيار الخط المناسب ليس مجرد قرار جمالي بل هو قرار استراتيجي يحدد هوية المشروع وطابعه ورسالته. خط الثلث يوحي بالأصالة والروحانية، بينما خط الكوفي الهندسي يُشعّ بالحداثة والجرأة. النسخ يُقرأ بسهولة في النصوص الطويلة، والديواني يُضفي رقياً على المناسبات الاحتفالية.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">لماذا تختار xfontat؟</h3>
            <ul className="space-y-3">
              {[
                { title: "مكتبة خطوط شاملة", desc: "مكتبة مجانية تضم تسعة أصناف رئيسية" },
                { title: "تحميل فوري مجاني", desc: "جميع الخطوط بصيغتي TTF وOTF متاحة بدون تسجيل" },
                { title: "معاينة مباشرة", desc: "اكتب نصك الخاص وشاهده بأي خط قبل التحميل" },
                { title: "متوافقة مع كل البرامج", desc: "Photoshop وIllustrator وWord وكل تطبيقات التصميم" },
                { title: "تحديثات مستمرة", desc: "نضيف خطوطاً جديدة بانتظام لمواكبة احتياجاتك" },
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
              content: "اختر خط الكوفي الهندسي إذا أردت طابعاً حديثاً جريئاً، أو خط الثلث إذا أردت إبراز الأصالة والعراقة. تجنب خطوط النسخ في الشعارات لأنها تفتقر إلى الشخصية المميزة."
            },
            {
              title: "لمنشورات السوشال ميديا",
              content: "خطوط الرقعة والتصميم الحديثة هي الأنسب لأنها جذابة بصرياً وتُقرأ بسرعة على الشاشات الصغيرة. اختر الخط الذهبي والأوزان العريضة للمنشورات التسويقية."
            },
            {
              title: "للكتب والمحتوى الطويل",
              content: "خط النسخ هو الخيار الأمثل لأي نص طويل. اختر وزناً خفيفاً أو عادياً وتباعداً سخياً بين الأسطر (1.8 على الأقل) لضمان أعلى مستوى من الراحة في القراءة."
            },
            {
              title: "للدعوات والمناسبات",
              content: "خط الديواني هو الملك هنا. يمنح الدعوات طابعاً فاخراً لا مثيل له. استخدمه مع الألوان الذهبية والفضية والتصاميم الزخرفية الأنيقة."
            },
            {
              title: "للمحتوى الديني والقرآني",
              content: "خط النسخ المحقق أو خط الثلث المناسبان لهذا الغرض. تأكد من أن الخط يدعم التشكيل الكامل (الحركات) لضمان الدقة في الكتابة القرآنية."
            },
            {
              title: "للفوتوشوب والتصميم الجرافيكي",
              content: "استخدم خطوط فئة الفوتوشوب المُحسَّنة خصيصاً للعمل مع برامج Adobe. تحقق من دعم الخط لميزة World-Ready Composer للكتابة العربية الصحيحة."
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
            { name: "خط الثلث", count: "14 خطاً", desc: "أجمل الخطوط وأكثرها تعقيداً، للمساجد والتصاميم الراقية" },
            { name: "خط الديواني", count: "21 خطاً", desc: "أصله ديوان السلطان العثماني، مثالي للدعوات والمناسبات" },
            { name: "خط الرقعة", count: "24 خطاً", desc: "الأكثر استخداماً في الحياة اليومية والمحتوى الرقمي" },
            { name: "خط الكوفي", count: "27 خطاً", desc: "أقدم الخطوط العربية، هندسي وعصري في آنٍ واحد" },
            { name: "خط النسخ", count: "132 خطاً", desc: "عماد الطباعة والنشر، الأوضح للنصوص الطويلة" },
            { name: "خطوط التصميم", count: "357 خطاً", desc: "تنوع إبداعي هائل للمصممين المعاصرين" },
            { name: "خطوط الحرة", count: "200 خطاً", desc: "خطوط غرافيتي وزخرفية جريئة للعناوين والتصاميم" },
            { name: "خطوط الفوتوشوب", count: "202 خطاً", desc: "مُحسَّنة خصيصاً لبرامج Adobe التصميمية" },
            { name: "خط النستعليق", count: "11 خطاً", desc: "عروس الخطوط الفارسية، للشعر والأدب الرفيع" },
          ].map((item, i) => (
            <div key={i} className="border rounded-lg p-4">
              <p className="font-semibold text-sm mb-1">{item.name}</p>
              <p className="text-xs text-primary mb-2">{item.count}</p>
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
