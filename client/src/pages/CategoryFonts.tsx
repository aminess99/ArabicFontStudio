import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { getCategoryFromSlug, getCategorySlug } from "@/lib/categorySlug";
import { Header } from "@/components/Header";
import { CategoryFilter } from "@/components/CategoryFilter";
import { FontListItem } from "@/components/FontListItem";
import { Pagination } from "@/components/Pagination";
import { Footer } from "@/components/Footer";
import { FAQ } from "@/components/FAQ";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SEOHead } from "@/components/SEOHead";
import { CategoryContent } from "@/components/CategoryContent";
import { useToast } from "@/hooks/use-toast";
import { groupFontsByFamily } from "@/lib/fontFamily";

import { createCollectionPageSchema, createItemListSchema, createFAQSchema, createBreadcrumbSchema, SITE_ORIGIN } from "@/lib/schemas";
import type { Font } from "@shared/schema";

const FONTS_PER_PAGE = 15;

const categoryMeta: Record<string, { title: string; description: string; arabicName: string }> = {
  'ثلث': {
    title: 'خطوط ثلث عربية احترافية - تحميل مجاني | xfontat',
    description: 'استكشف مجموعة من خطوط الثلث العربية الأصيلة والاحترافية. خطوط فنية تقليدية مناسبة للعناوين والديكورات. حمل خطوط ثلث بصيغ TTF و OTF مجاناً.',
    arabicName: 'خطوط الثلث'
  },
  'ديواني': {
    title: 'خطوط ديواني عربية - تحميل خطوط ديوانية احترافية | xfontat',
    description: 'مجموعة متنوعة من خطوط الديواني والديواني الشرقي. خطوط فاخرة وجميلة للدعوات والتصاميم الفنية. حمل خطوط ديواني مجاناً بصيغ متعددة.',
    arabicName: 'خطوط الديواني'
  },
  'رقعة': {
    title: 'خطوط رقعة عربية - تحميل خطوط رقعة احترافية | xfontat',
    description: 'خطوط رقعة أصلية وحديثة للكتابة والنصوص الطويلة. خطوط واضحة وسهلة القراءة مناسبة للمستندات والمنشورات. حمل خطوط رقعة مجاناً.',
    arabicName: 'خطوط الرقعة'
  },
  'كوفي': {
    title: 'خطوط كوفي عربية - خطوط جيومترية احترافية | xfontat',
    description: 'مجموعة من خطوط الكوفي المربعة والهندسية. خطوط حديثة وعصرية مناسبة للتصاميم المعاصرة والشعارات. حمل خطوط كوفي بجودة عالية.',
    arabicName: 'خطوط الكوفي'
  },
  'نسخ': {
    title: 'خطوط نسخ عربية - خطوط نسخ احترافية للطباعة | xfontat',
    description: 'خطوط النسخ الكلاسيكية والحديثة. خطوط عملية وجميلة للكتب والمجلات والمستندات الرسمية. حمل خطوط نسخ عربية مجاناً.',
    arabicName: 'خطوط النسخ'
  },
  'تصميم': {
    title: 'خطوط تصميم عربية - خطوط احترافية للمصممين | xfontat',
    description: 'مجموعة كبيرة من خطوط التصميم الحديثة والاحترافية. خطوط متنوعة لجميع احتياجات التصميم والإعلانات. حمل خطوط تصميم عربية بجودة عالية.',
    arabicName: 'خطوط التصميم'
  },
  'فوتوشوب': {
    title: 'خطوط فوتوشوب عربية - أفضل 100 خط للتصميم | xfontat',
    description: 'أفضل مجموعة من خطوط الفوتوشوب العربية الاحترافية. خطوط مميزة للتصاميم والإعلانات ومشاريع الجرافيك. حمل خطوط فوتوشوب بصيغ TTF و OTF مجاناً.',
    arabicName: 'خطوط الفوتوشوب'
  },
  'نستعليق': {
    title: 'خطوط نستعليق عربية وفارسية - تحميل مجاني | xfontat',
    description: 'مجموعة من خطوط النستعليق الأصيلة الفارسية والأردية. خطوط الخط الفارسي الكلاسيكي ذات الجمال الفريد المناسبة للتصاميم الراقية والمخطوطات. تحميل مجاناً.',
    arabicName: 'خطوط النستعليق'
  }
};

export default function CategoryFonts() {
  const [match, params] = useRoute("/fonts/:category");
  const categorySlug = params?.category as string | undefined;
  const arabicCategory = categorySlug ? getCategoryFromSlug(categorySlug) : undefined;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [previewText, setPreviewText] = useState("بسم الله الرحمن الرحيم");
  const [fontSize, setFontSize] = useState(48);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const { data: fonts = [], isLoading } = useQuery<Font[]>({
    queryKey: ["/api/fonts"],
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categorySlug]);

  if (!match || !categorySlug || !arabicCategory || !categoryMeta[arabicCategory]) {
    return <div>صفحة غير موجودة</div>;
  }

  const categoryData = categoryMeta[arabicCategory];
  const categories = Array.from(new Set(fonts.map(font => font.category)));

  const filteredFonts = fonts
    .filter((font) => {
      const matchesSearch = 
        font.nameArabic.includes(searchQuery) || 
        font.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (font.designer && font.designer.includes(searchQuery));
      
      return matchesSearch && font.category === arabicCategory;
    })
    .sort((a, b) => {
      const dateA = new Date(a.addedAt).getTime();
      const dateB = new Date(b.addedAt).getTime();
      return dateB - dateA;
    });

  const groupedFonts = useMemo(() => groupFontsByFamily(filteredFonts), [filteredFonts.length, searchQuery, categorySlug]);

  const totalPages = Math.ceil(groupedFonts.length / FONTS_PER_PAGE);
  const startIndex = (currentPage - 1) * FONTS_PER_PAGE;
  const endIndex = startIndex + FONTS_PER_PAGE;
  const currentGroups = groupedFonts.slice(startIndex, endIndex);

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

  const schema = filteredFonts.length > 0 ? {
    "@context": "https://schema.org",
    "@graph": [
      createBreadcrumbSchema([
        { name: "الرئيسية", url: `${SITE_ORIGIN}/` },
        { name: categoryData.arabicName, url: `${SITE_ORIGIN}/fonts/${categorySlug}` }
      ]),
      createCollectionPageSchema({
        name: categoryData.arabicName,
        description: categoryData.description,
        url: `${SITE_ORIGIN}/fonts/${categorySlug}`,
        numberOfItems: filteredFonts.length
      }),
      createItemListSchema(filteredFonts),
      createFAQSchema()
    ]
  } : undefined;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead 
        title={categoryData.title}
        description={categoryData.description}
        path={`/fonts/${categorySlug}`}
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
      
      <Breadcrumb 
        items={[
          { label: "الرئيسية", href: "/" },
          { label: categoryData.arabicName, href: `/fonts/${categorySlug}` }
        ]}
      />

      <CategoryFilter
        categories={categories}
        selectedCategory={arabicCategory}
        onCategoryChange={(cat) => {
          if (cat === "الكل") {
            window.location.href = "/";
          } else {
            window.location.href = `/fonts/${getCategorySlug(cat)}`;
          }
        }}
      />

      <main className="flex-1 container mx-auto px-3 md:px-4 py-4 md:py-6">
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{categoryData.arabicName}</h1>
          <p className="text-sm md:text-base text-muted-foreground">{categoryData.description}</p>
        </div>

        {filteredFonts.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <p className="text-base md:text-lg text-muted-foreground">
              لم يتم العثور على خطوط تطابق البحث
            </p>
          </div>
        ) : (
          <>
            <div className="mb-3 md:mb-4 pb-3 border-b">
              <p className="text-xs md:text-sm text-muted-foreground">
                عائلات الخطوط {startIndex + 1} - {Math.min(endIndex, groupedFonts.length)} من {groupedFonts.length}
                {groupedFonts.length < filteredFonts.length && (
                  <span className="mr-1">({filteredFonts.length} خط إجمالاً)</span>
                )}
              </p>
            </div>

            <div className="space-y-0">
              {currentGroups.map((group) => (
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

      <div className="container mx-auto px-3 md:px-4">
        <CategoryContent category={arabicCategory} />
      </div>

      <FAQ />
      <Footer />
    </div>
  );
}
