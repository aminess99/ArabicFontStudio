import { storage } from "../storage";
import fs from "fs";
import path from "path";

const FONTS_DIR = path.join(process.cwd(), "client/public/fonts");

const categoryMap: Record<string, string> = {
  "ثلث": "ثلث",
  "ديواني": "ديواني",
  "رقعة": "رقعة",
  "كوفي": "كوفي",
  "نسخ": "نسخ",
};

const featuredFonts = new Set([
  "GE Thuluth Light",
  "Dthuluth",
  "51DW0SIN",
  "al kharashi diwani 1",
  "ArbFONTS AF Diwani Normal Traditional",
  "SH Roq'a 1",
  "Tasees Saudi",
  "DroidKufi Regular",
  "Noto Kufi Arabic",
  "Pen Kufi",
  "Kufigraph Font",
  "DroidNaskh Regular",
  "UthmanTN1 Ver07",
  "Mohammad Naskh",
  "FS NASKH AHRAM",
  "HSN Naskh",
  "Al Kharashi 58 Naskh",
]);

function cleanFontName(fileName: string): string {
  return fileName
    .replace(/\.(ttf|otf|woff|woff2)$/i, "")
    .replace(/[-_]/g, " ")
    .trim();
}

function getFileFormat(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  return ext.replace(".", "").toUpperCase();
}

export async function loadFonts() {
  console.log("🔄 Loading fonts from disk...");
  
  const categories = Object.keys(categoryMap);
  let totalFonts = 0;

  for (const category of categories) {
    const categoryPath = path.join(FONTS_DIR, category);
    
    if (!fs.existsSync(categoryPath)) {
      console.log(`⚠️  Category not found: ${category}`);
      continue;
    }

    const files = fs.readdirSync(categoryPath);
    const fontFiles = files.filter(file => 
      /\.(ttf|otf|woff|woff2)$/i.test(file)
    );

    console.log(`📁 ${category}: ${fontFiles.length} fonts`);

    for (const file of fontFiles) {
      const fontName = cleanFontName(file);
      const fileFormat = getFileFormat(file);
      const fileUrl = `/fonts/${category}/${file}`;
      const isFeatured = featuredFonts.has(fontName);

      await storage.createFont({
        name: fontName,
        nameArabic: fontName,
        description: `خط ${fontName} من فئة ${categoryMap[category]}`,
        designer: undefined,
        category: categoryMap[category],
        style: "عادي",
        fileUrl: fileUrl,
        fileName: file,
        fileFormat: fileFormat,
        featured: isFeatured,
      });

      totalFonts++;
    }
  }

  console.log(`✅ Successfully loaded ${totalFonts} fonts`);
  
  const allFonts = await storage.getAllFonts();
  console.log(`📊 Total fonts in storage: ${allFonts.length}`);
}
