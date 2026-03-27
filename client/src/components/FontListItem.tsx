import { useEffect, useState } from "react";
import { Download, Heart, Layers } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { loadFont, generateFontFamily } from "@/lib/fontLoader";
import { generateSlug } from "@/lib/slugify";

interface FontListItemProps {
  id: string;
  name: string;
  nameArabic: string;
  designer?: string | null;
  category: string;
  fileUrl: string;
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
  fileUrl,
  previewText,
  fontSize,
  onDownload,
  isFavorite = false,
  onToggleFavorite,
  variantCount = 1,
}: FontListItemProps) {
  const [fontLoaded, setFontLoaded] = useState(false);
  const fontFamily = generateFontFamily(name);

  useEffect(() => {
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
  }, [fontFamily, fileUrl]);

  return (
    <div className="border-b py-4 md:py-6" data-testid={`font-item-${name}`}>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 md:mb-3 flex-wrap">
            <h3 className="text-xs md:text-sm text-muted-foreground truncate">
              {nameArabic}
            </h3>
            {variantCount > 1 && (
              <Badge variant="secondary" className="text-xs gap-1 shrink-0">
                <Layers className="w-3 h-3" />
                {variantCount} أوزان
              </Badge>
            )}
          </div>
          
          <div 
            className="leading-relaxed break-words"
            style={{ 
              fontFamily: fontLoaded ? fontFamily : 'inherit',
              fontSize: window.innerWidth < 768 ? `${Math.min(fontSize, 36)}px` : `${fontSize}px`,
              lineHeight: 1.5
            }}
            data-testid={`text-preview-${name}`}
          >
            {fontLoaded ? previewText : "جاري التحميل..."}
          </div>
          <h2 className="text-xs text-muted-foreground mt-2" aria-label={`تحميل خط ${nameArabic} مجاناً`}>
            تحميل خط {nameArabic} مجاناً
          </h2>
        </div>

        <div className="flex items-center gap-2 md:gap-3 shrink-0 w-full md:w-auto">
          <Button
            variant="ghost"
            size="icon"
            className={isFavorite ? "text-red-500" : ""}
            onClick={onToggleFavorite}
            data-testid={`button-favorite-${name}`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
          
          <Button asChild className="flex-1 md:flex-none">
            <Link
              href={`/font/${generateSlug(name)}`}
              data-testid={`button-download-${name}`}
            >
              <Download className="ml-2 h-4 w-4" />
              {variantCount > 1 ? "عرض الأوزان" : "تحميل"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
