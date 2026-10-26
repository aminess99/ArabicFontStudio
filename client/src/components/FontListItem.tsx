import { useEffect, useState, useRef } from "react";
import { Download, Heart, Layers } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { loadFont, generateFontFamily } from "@/lib/fontLoader";
import { getCanonicalFontSlug } from "@/lib/slugify";

interface FontListItemProps {
  id: string;
  name: string;
  nameArabic: string;
  designer?: string | null;
  category: string;
  fileUrl: string;
  fileName: string;
  slug?: string | null;
  previewText: string;
  fontSize: number;
  onDownload: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  variantCount?: number;
}

export function FontListItem({
  id,
  name,
  nameArabic,
  designer,
  category,
  fileUrl,
  fileName,
  slug,
  previewText,
  fontSize,
  onDownload,
  isFavorite = false,
  onToggleFavorite,
  variantCount = 1,
}: FontListItemProps) {
  const [fontLoaded, setFontLoaded] = useState(false);
  const fontFamily = generateFontFamily(name);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    setFontLoaded(false);
    loadFont(fontFamily, fileUrl)
      .then(() => {
        setTimeout(() => {
          setFontLoaded(true);
        }, 300);
      })
      .catch(() => {
        setTimeout(() => {
          setFontLoaded(true);
        }, 500);
      });
  }, [isVisible, fontFamily, fileUrl]);

  const fontPath = `/font/${getCanonicalFontSlug({ slug, name, fileName, category })}`;

  return (
    <div ref={containerRef} className="border-b py-4 md:py-6" data-testid={`font-item-${name}`}>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 md:mb-3 flex-wrap">
            <h3 className="text-sm md:text-base font-semibold truncate">
              <Link href={fontPath} className="hover:text-primary transition-colors">{nameArabic}</Link>
            </h3>
            <Badge variant="outline" className="text-xs shrink-0 font-normal text-muted-foreground">{category}</Badge>
            {variantCount > 1 && (
              <Badge variant="secondary" className="text-xs gap-1 shrink-0">
                <Layers className="w-3 h-3" />
                {variantCount} أوزان
              </Badge>
            )}
          </div>
          
          <Link
            href={fontPath}
            aria-label={`معاينة خط ${nameArabic}`}
            className="block leading-relaxed break-words hover:opacity-80 transition-opacity"
            style={{ 
              fontFamily: fontLoaded ? fontFamily : 'inherit',
              fontSize: window.innerWidth < 768 ? `${Math.min(fontSize, 36)}px` : `${fontSize}px`,
              lineHeight: 1.5
            }}
            data-testid={`text-preview-${name}`}
          >
            {previewText}
          </Link>
          {designer && <p className="text-xs text-muted-foreground mt-2">تصميم: {designer}</p>}
        </div>

        <div className="flex items-center gap-2 md:gap-3 shrink-0 w-full md:w-auto">
          <Button
            variant="ghost"
            size="icon"
            className={`h-11 w-11 ${isFavorite ? "text-red-500" : ""}`}
            onClick={onToggleFavorite}
            aria-label={isFavorite ? `إزالة خط ${nameArabic} من المفضلة` : `إضافة خط ${nameArabic} إلى المفضلة`}
            aria-pressed={isFavorite}
            data-testid={`button-favorite-${name}`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} aria-hidden="true" />
          </Button>
          
          {/* Outline so a page of rows is not a wall of orange buttons. */}
          <Button asChild variant="outline" className="h-11 flex-1 md:flex-none hover:bg-primary hover:text-primary-foreground hover:border-primary">
            <Link
              href={fontPath}
              data-testid={`button-download-${name}`}
            >
              <Download className="ml-2 h-4 w-4" />
              تحميل الخط
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
