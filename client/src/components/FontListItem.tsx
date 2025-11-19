import { useEffect, useState } from "react";
import { Download, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadFont, generateFontFamily } from "@/lib/fontLoader";

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
    <div className="border-b py-6" data-testid={`font-item-${name}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm text-muted-foreground">
              {nameArabic}
            </h3>
            {designer && (
              <span className="text-xs text-muted-foreground">
                +{designer.split(' ').length}
              </span>
            )}
          </div>
          
          <div 
            className="text-4xl leading-relaxed break-words"
            style={{ 
              fontFamily: fontLoaded ? fontFamily : 'inherit',
              fontSize: `${fontSize}px`,
              lineHeight: 1.5
            }}
            data-testid={`text-preview-${name}`}
          >
            {fontLoaded ? previewText : "جاري التحميل..."}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className={isFavorite ? "text-red-500" : ""}
            onClick={onToggleFavorite}
            data-testid={`button-favorite-${name}`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
          
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={onDownload}
            data-testid={`button-download-${name}`}
          >
            <Download className="ml-2 h-4 w-4" />
            تحميل
          </Button>
        </div>
      </div>
    </div>
  );
}
