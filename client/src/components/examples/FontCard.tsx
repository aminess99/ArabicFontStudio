import { FontCard } from "../FontCard";

export default function FontCardExample() {
  return (
    <div className="p-6 bg-background">
      <div className="max-w-sm">
        <FontCard
          id="1"
          name="Cairo"
          nameArabic="القاهرة"
          designer="محمد غالب"
          category="حديث"
          style="عادي"
          fileFormat="TTF"
          fileUrl="/fonts/نسخ/Cairo.ttf"
          onPreview={() => console.log("Preview clicked")}
          onDownload={() => console.log("Download clicked")}
        />
      </div>
    </div>
  );
}
