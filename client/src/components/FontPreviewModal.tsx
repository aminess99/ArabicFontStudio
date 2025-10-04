import { useState, useEffect } from "react";
import { X, Download, Type } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { loadFont, generateFontFamily } from "@/lib/fontLoader";

interface FontPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  font: {
    name: string;
    nameArabic: string;
    designer?: string | null;
    category: string;
    style: string;
    fileFormat: string;
    fileUrl: string;
  } | null;
  onDownload: () => void;
}

export function FontPreviewModal({ isOpen, onClose, font, onDownload }: FontPreviewModalProps) {
  const [previewText, setPreviewText] = useState("اكتب هنا لمعاينة الخط");
  const [fontSize, setFontSize] = useState(32);
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    if (font && isOpen) {
      const fontFamily = generateFontFamily(font.name);
      setFontLoaded(false);
      loadFont(fontFamily, font.fileUrl).then(() => {
        setFontLoaded(true);
      });
    }
  }, [font, isOpen]);

  if (!font) return null;

  const fontFamily = generateFontFamily(font.name);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="modal-font-preview">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{font.nameArabic}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{font.name}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              data-testid="button-close-modal"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="flex flex-wrap gap-2">
            <Badge>{font.category}</Badge>
            <Badge>{font.style}</Badge>
            <Badge variant="secondary">{font.fileFormat}</Badge>
            {font.designer && <Badge variant="outline">{font.designer}</Badge>}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                حجم الخط: {fontSize}px
              </Label>
            </div>
            <Slider
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
              min={16}
              max={72}
              step={2}
              data-testid="slider-font-size"
            />
          </div>

          <div className="space-y-3">
            <Label>نص المعاينة</Label>
            <Textarea
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              placeholder="اكتب نصاً لمعاينة الخط"
              className="min-h-32"
              data-testid="textarea-preview"
            />
          </div>

          <div
            className="min-h-48 rounded-lg border bg-card p-6 flex items-center justify-center text-center"
            style={{ 
              fontFamily: fontLoaded ? fontFamily : 'inherit',
              fontSize: `${fontSize}px`,
              lineHeight: 1.5
            }}
            data-testid="text-font-preview"
          >
            {fontLoaded ? previewText : "جاري تحميل الخط..."}
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={onDownload}
              data-testid="button-download-modal"
            >
              <Download className="ml-2 h-4 w-4" />
              تحميل الخط
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
