import { useEffect, useState } from "react";
import { Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { loadFont, generateFontFamily } from "@/lib/fontLoader";

interface FontCardProps {
  id: string;
  name: string;
  nameArabic: string;
  designer?: string | null;
  category: string;
  style: string;
  fileFormat: string;
  fileUrl: string;
  onPreview: () => void;
  onDownload: () => void;
}

export function FontCard({
  name,
  nameArabic,
  designer,
  category,
  style,
  fileFormat,
  fileUrl,
  onPreview,
  onDownload,
}: FontCardProps) {
  const [fontLoaded, setFontLoaded] = useState(false);
  const fontFamily = generateFontFamily(name);

  useEffect(() => {
    loadFont(fontFamily, fileUrl).then(() => {
      setFontLoaded(true);
    });
  }, [fontFamily, fileUrl]);

  return (
    <Card className="hover-elevate transition-all" data-testid={`card-font-${name}`}>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{nameArabic}</h3>
            <p className="text-sm text-muted-foreground">{name}</p>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {fileFormat}
          </Badge>
        </div>
        <div 
          className="min-h-24 flex items-center justify-center rounded-md bg-muted/30 p-4 text-center"
          style={{ fontFamily: fontLoaded ? fontFamily : 'inherit' }}
        >
          <p className="text-2xl" data-testid={`text-preview-${name}`}>
            {fontLoaded ? "الخط العربي" : "جاري التحميل..."}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{category}</Badge>
          <Badge variant="outline">{style}</Badge>
          {designer && (
            <Badge variant="outline" className="text-xs">
              {designer}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={onPreview}
          data-testid={`button-preview-${name}`}
        >
          <Eye className="ml-2 h-4 w-4" />
          معاينة
        </Button>
        <Button
          size="sm"
          className="flex-1"
          onClick={onDownload}
          data-testid={`button-download-${name}`}
        >
          <Download className="ml-2 h-4 w-4" />
          تحميل
        </Button>
      </CardFooter>
    </Card>
  );
}
