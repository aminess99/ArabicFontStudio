import { useState } from "react";
import { FontPreviewModal } from "../FontPreviewModal";
import { Button } from "@/components/ui/button";

export default function FontPreviewModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  const font = {
    name: "Cairo",
    nameArabic: "القاهرة",
    designer: "محمد غالب",
    category: "حديث",
    style: "عادي",
    fileFormat: "TTF",
    fileUrl: "/fonts/نسخ/Cairo.ttf"
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <Button onClick={() => setIsOpen(true)}>فتح المعاينة</Button>
      <FontPreviewModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        font={font}
        onDownload={() => console.log("Download clicked")}
      />
    </div>
  );
}
