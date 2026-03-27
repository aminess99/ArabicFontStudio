import type { Font } from "@shared/schema";

const WEIGHT_WORDS = [
  "ExtraBold", "ExtraLight", "UltraLight", "SemiBold", "DemiBold",
  "BoldItalic", "BoldSlanted", "BoldOblique",
  "LightItalic", "LightSlanted",
  "Bold", "Light", "Regular", "Medium", "Black", "Thin",
  "Heavy", "Italic", "Roman", "Book", "Plain", "Normal", "Fat",
  "Condensed", "Expanded", "Wide", "Narrow", "Oblique", "Slanted",
];

export function detectFontFamily(fontName: string): string {
  let family = fontName;

  // Strip trailing version/revision codes like " 1F", " 2B", " A", " 8", " 20" (1-3 hex chars)
  family = family.replace(/\s+[0-9A-Fa-f]{1,3}$/, "").trim();

  // Strip patterns like " 45Light", " 55Roman" (number + weight)
  family = family.replace(/\s+\d+[A-Za-z]+$/, "").trim();

  // Iteratively strip trailing weight words (handles "Extra Bold", "Semi Bold")
  let changed = true;
  while (changed) {
    changed = false;
    for (const weight of WEIGHT_WORDS) {
      const regex = new RegExp(`[\\s\\-_]${weight}$`, "i");
      const next = family.replace(regex, "").trim();
      if (next !== family && next.length > 0) {
        family = next;
        changed = true;
        break;
      }
    }
  }

  return family.trim() || fontName;
}

export function getWeightLabel(fontName: string, family?: string): string {
  const resolvedFamily = family ?? detectFontFamily(fontName);
  const raw = fontName.replace(new RegExp(`^${resolvedFamily.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i"), "").trim().replace(/^[-_\s]+/, "").trim();
  if (!raw) return "عادي";

  const map: Record<string, string> = {
    regular: "عادي",
    normal: "عادي",
    roman: "عادي",
    plain: "عادي",
    medium: "متوسط",
    bold: "عريض",
    black: "أسود",
    heavy: "ثقيل",
    thin: "رفيع",
    light: "خفيف",
    extralight: "خفيف جداً",
    ultralight: "خفيف جداً",
    semibold: "شبه عريض",
    demibold: "شبه عريض",
    extrabold: "عريض جداً",
    italic: "مائل",
    condensed: "مضغوط",
    fat: "سميك",
  };

  return map[raw.toLowerCase()] || raw;
}

export interface FontGroup {
  family: string;
  primary: Font;
  variants: Font[];
}

export function groupFontsByFamily(fonts: Font[]): FontGroup[] {
  const familyMap = new Map<string, Font[]>();

  for (const font of fonts) {
    const family = detectFontFamily(font.name);
    if (!familyMap.has(family)) familyMap.set(family, []);
    familyMap.get(family)!.push(font);
  }

  const groups: FontGroup[] = [];

  Array.from(familyMap.entries()).forEach(([family, variants]) => {
    const primary: Font =
      variants.find((v: Font) => /regular/i.test(v.name)) ||
      variants.find((v: Font) => /medium/i.test(v.name)) ||
      variants.find((v: Font) => /roman/i.test(v.name)) ||
      variants[0];

    const order = ["regular", "normal", "roman", "plain", "light", "extralight", "thin", "medium", "semibold", "bold", "extrabold", "heavy", "black", "fat"];
    const sorted = [...variants].sort((a: Font, b: Font) => {
      const ai = order.findIndex((w) => a.name.toLowerCase().includes(w));
      const bi = order.findIndex((w) => b.name.toLowerCase().includes(w));
      if (ai === -1 && bi === -1) return a.name.localeCompare(b.name);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

    groups.push({ family, primary, variants: sorted });
  });

  return groups;
}
