import { useState, useEffect } from "react";
import { Download, Heart } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { loadFont, generateFontFamily } from "@/lib/fontLoader";

interface SimilarFontItemProps {
  id: number | string;
  name: string;
  nameArabic: string;
  fileUrl: string;
  previewText: string;
}

export function SimilarFontItem({ id, name, nameArabic, fileUrl, previewText }: SimilarFontItemProps) {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const fontFamily = generateFontFamily(name);

  useEffect(() => {
    setFontLoaded(false);
    loadFont(fontFamily, fileUrl)
      .then(() => setFontLoaded(true))
      .catch(() => setFontLoaded(true));
  }, [fontFamily, fileUrl]);

  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-left">
          <p className="font-medium text-sm">{nameArabic}</p>
          <p className="text-xs text-muted-foreground">{name}</p>
        </div>
      </div>
      
      <div 
        className="text-2xl md:text-3xl leading-relaxed mb-4 text-center py-3"
        style={{ fontFamily: fontLoaded ? fontFamily : 'inherit' }}
      >
        {fontLoaded ? previewText : "جاري التحميل..."}
      </div>

      <div className="flex items-center gap-2">
        <Link 
          href={`/font/${id}`}
          className="bg-green-600 hover:bg-green-700 text-white text-sm h-9 px-4 rounded-md flex items-center justify-center"
        >
          <Download className="ml-2 h-4 w-4" />
          تحميل
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className={`h-9 w-9 ${isFavorite ? "text-red-500" : ""}`}
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
        </Button>
      </div>
    </div>
  );
}
