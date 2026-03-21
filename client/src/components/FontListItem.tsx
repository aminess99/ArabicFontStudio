import { useEffect, useState } from "react";
import { Download, Heart } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
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
          <div className="flex items-center gap-2 mb-2 md:mb-3">
            <h3 className="text-xs md:text-sm text-muted-foreground truncate">
              {nameArabic}
            </h3>
            {designer && (
              <span className="text-xs text-muted-foreground shrink-0">
                +{designer.split(' ').length}
              </span>
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
        </div>

        <div className="flex items-center gap-2 md:gap-3 shrink-0 w-full md:w-auto">
          <Button
            variant="ghost"
            size="icon"
            className={`${isFavorite ? "text-red-500" : ""} h-9 w-9 md:h-10 md:w-10`}
            onClick={onToggleFavorite}
            data-testid={`button-favorite-${name}`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
          
          <Link 
            href={`/font/${generateSlug(name)}`}
            className="bg-green-600 hover:bg-green-700 text-white flex-1 md:flex-none text-sm md:text-base h-9 md:h-10 px-4 rounded-md flex items-center justify-center"
            data-testid={`button-download-${name}`}
          >
            <Download className="ml-2 h-4 w-4" />
            تحميل
          </Link>
        </div>
      </div>
    </div>
  );
}
