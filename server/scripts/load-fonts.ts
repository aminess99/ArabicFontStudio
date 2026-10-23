import { storage } from "../storage";
import fs from "fs";
import path from "path";
import type { InsertFont } from "@shared/schema";
import {
  buildCleanFontSlugAssignments,
  generateLegacyFontSlug,
  generateLegacyNameSlug,
  getFontIdentity,
} from "../../client/src/lib/slugify";

const FONTS_DIR = path.join(process.cwd(), "client/public/fonts");
const PROVENANCE_PATH = path.join(process.cwd(), "server/data/font-provenance.json");

type FontProvenance = {
  name: string;
  nameArabic: string;
  description: string;
  designer: string | null;
  sourceUrl: string;
  license: string;
  licenseNotice: string;
  copyright: string | null;
  category: string;
  style: string;
  fileName: string;
  fileFormat: string;
};

function loadFontProvenance(): Map<string, FontProvenance> {
  if (!fs.existsSync(PROVENANCE_PATH)) {
    throw new Error(`Font provenance manifest not found: ${PROVENANCE_PATH}`);
  }

  const parsed: unknown = JSON.parse(fs.readFileSync(PROVENANCE_PATH, "utf8"));
  if (!Array.isArray(parsed)) {
    throw new Error(`Font provenance manifest must contain an array: ${PROVENANCE_PATH}`);
  }

  return new Map(
    (parsed as FontProvenance[]).map((entry) => [`${entry.category}/${entry.fileName}`, entry])
  );
}

const categoryMap: Record<string, string> = {
  "ثلث": "ثلث",
  "ديواني": "ديواني",
  "رقعة": "رقعة",
  "كوفي": "كوفي",
  "نسخ": "نسخ",
  "تصميم": "تصميم",
  "خطوط الحرة": "خطوط الحرة",
  "فوتوشوب": "فوتوشوب",
  "نستعليق": "نستعليق",
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
  const provenanceByFile = loadFontProvenance();
  const categories = Object.keys(categoryMap);
  const fontsToLoad: Array<InsertFont & { legacyHashedSlug: string; legacyNameSlug: string }> = [];

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
      const metadata = provenanceByFile.get(`${category}/${file}`);
      const fontName = metadata?.name ?? cleanFontName(file);
      const fileFormat = metadata?.fileFormat ?? getFileFormat(file);
      const fileUrl = `/fonts/${category}/${file}`;
      const isFeatured = featuredFonts.has(fontName);
      
      const filePath = path.join(categoryPath, file);
      const stats = fs.statSync(filePath);
      const addedAt = stats.mtime;

      const font: InsertFont = {
        name: fontName,
        nameArabic: metadata?.nameArabic ?? fontName,
        description: metadata?.description ?? `خط ${fontName} من فئة ${categoryMap[category]}`,
        designer: metadata?.designer ?? undefined,
        sourceUrl: metadata?.sourceUrl ?? null,
        license: metadata?.license ?? null,
        licenseNotice: metadata?.licenseNotice ?? null,
        copyright: metadata?.copyright ?? null,
        category: metadata?.category ?? categoryMap[category],
        style: metadata?.style ?? "عادي",
        fileUrl: fileUrl,
        fileName: file,
        fileFormat: fileFormat,
        featured: isFeatured,
        addedAt: addedAt,
      };
      fontsToLoad.push({
        ...font,
        legacyHashedSlug: generateLegacyFontSlug(fontName, file, font.category),
        legacyNameSlug: generateLegacyNameSlug(fontName),
      });
    }
  }

  const cleanSlugs = buildCleanFontSlugAssignments(fontsToLoad);
  const legacyNameCounts = new Map<string, number>();
  for (const font of fontsToLoad) {
    legacyNameCounts.set(font.legacyNameSlug, (legacyNameCounts.get(font.legacyNameSlug) || 0) + 1);
  }

  const inserts: InsertFont[] = fontsToLoad.map((font) => {
    const { legacyHashedSlug, legacyNameSlug, ...insertFont } = font;
    const identity = getFontIdentity(insertFont.category, insertFont.fileName);
    return {
      ...insertFont,
      slug: cleanSlugs.get(identity),
    };
  });
  const savedFonts = await storage.createFonts(inserts);
  const savedByIdentity = new Map(
    savedFonts.map((font) => [`${font.category}/${font.fileName}`, font]),
  );
  const aliases: Array<{ oldSlug: string; fontId: string }> = [];
  for (const font of fontsToLoad) {
    const savedFont = savedByIdentity.get(`${font.category}/${font.fileName}`);
    if (!savedFont) throw new Error(`Font was not returned after database upsert: ${font.category}/${font.fileName}`);
    aliases.push({ oldSlug: font.legacyHashedSlug, fontId: savedFont.id });
    if (legacyNameCounts.get(font.legacyNameSlug) === 1) {
      aliases.push({ oldSlug: font.legacyNameSlug, fontId: savedFont.id });
    }
  }
  await storage.addSlugAliases(aliases);

  const totalFonts = fontsToLoad.length;
  console.log(`✅ Successfully loaded ${totalFonts} fonts`);
  
  const allFonts = await storage.getAllFonts();
  console.log(`📊 Total fonts in storage: ${allFonts.length}`);
}
