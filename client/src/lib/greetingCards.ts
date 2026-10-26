// Greeting card templates. Each template draws its decoration as an SVG
// background (no text, so it rasterises identically everywhere) and lists
// text slots that the renderer paints on a canvas with fonts already loaded
// in the page. Preview and download share renderCard, so what visitors see
// is what they save.

export type CardSize = "square" | "story";
export const CARD_DIMENSIONS: Record<CardSize, { w: number; h: number }> = {
  square: { w: 1080, h: 1080 },
  story: { w: 1080, h: 1920 },
};

// SIL OFL fonts from the library, so cards are safe to share and reuse.
// Layla Ruqaa is left out: it drops medial meem (الرحمن renders as الرحن).
export const CARD_FONTS = [
  { id: "thuluth", label: "ثلث — ليلى", url: "/fonts/ثلث/Layla-Thuluth.ttf" },
  { id: "gulzar", label: "نستعليق — گلزار", url: "/fonts/نستعليق/Gulzar.ttf" },
  { id: "rakkas", label: "رقاص", url: "/fonts/تصميم/Rakkas.ttf" },
  { id: "katibeh", label: "كاتبة", url: "/fonts/تصميم/Katibeh.ttf" },
  { id: "jomhuria", label: "جمهورية", url: "/fonts/تصميم/Jomhuria.ttf" },
  { id: "reem", label: "ريم كوفي", url: "/fonts/كوفي/Reem-Kufi.ttf" },
] as const;
export type CardFontId = (typeof CARD_FONTS)[number]["id"];
const BODY_FONT = { id: "markazi", url: "/fonts/نسخ/Markazi-Text.ttf" };
const LABEL_FONT = { id: "reem", url: "/fonts/كوفي/Reem-Kufi.ttf" };

type Paint = string | string[]; // a colour, or gradient stops from top to bottom
type Slot = { y: number; size: number; paint: Paint };
type Layout = { message: Slot; name: Slot; from: Slot; note: Slot; footer: Slot; maxWidth: number };

export type CardTemplate = {
  id: string;
  label: string;
  background: (w: number, h: number) => string;
  layout: (w: number, h: number) => Layout;
};

// ---------- drawing helpers ----------

function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return value / 2147483647;
  };
}

function starField(count: number, color: string, w: number, maxY: number, seed: number, maxR = 1.8) {
  const rnd = seeded(seed);
  let out = "";
  for (let i = 0; i < count; i++) {
    out += `<circle cx="${(rnd() * w).toFixed(1)}" cy="${(rnd() * maxY).toFixed(1)}" r="${(0.6 + rnd() * maxR).toFixed(2)}" fill="${color}" opacity="${(0.3 + rnd() * 0.7).toFixed(2)}"/>`;
  }
  return out;
}

function sparkle(x: number, y: number, s: number, color: string) {
  return `<path d="M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z" fill="${color}"/>`;
}

let maskCount = 0;
function crescent(cx: number, cy: number, r: number, fill: string) {
  const id = `cm${maskCount++}`;
  return `<mask id="${id}"><rect x="${cx - r - 2}" y="${cy - r - 2}" width="${2 * r + 4}" height="${2 * r + 4}" fill="#fff"/><circle cx="${cx + r * 0.38}" cy="${cy - r * 0.18}" r="${r * 0.82}" fill="#000"/></mask><circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" mask="url(#${id})"/>`;
}

function lantern(x: number, rope: number, scale: number, gold: string) {
  return `<g transform="translate(${x},0)"><line x1="0" y1="0" x2="0" y2="${rope}" stroke="${gold}" stroke-width="2" opacity=".8"/><g transform="translate(0,${rope}) scale(${scale})">
<path d="M-14 0h28l6 14h-40z" fill="${gold}"/><path d="M-26 14h52l-8 70h-36z" fill="#f7c76a" fill-opacity=".22" stroke="${gold}" stroke-width="3"/>
<path d="M-26 14L0 84M26 14L0 84M-13 14L0 84M13 14L0 84" stroke="${gold}" stroke-width="2" opacity=".7"/><ellipse cx="0" cy="50" rx="10" ry="16" fill="#ffd98a" opacity=".9" filter="url(#glow)"/>
<path d="M-18 84h36l-6 12h-24z" fill="${gold}"/><circle cx="0" cy="104" r="5" fill="${gold}"/></g></g>`;
}

function mosque(w: number, h: number, base: number, fill: string) {
  return `<g fill="${fill}"><rect x="0" y="${base}" width="${w}" height="${h - base}"/>
<path d="M300 ${base}q0-120 120-150q120 30 120 150z"/><path d="M560 ${base}q0-90 90-110q90 20 90 110z"/><path d="M160 ${base}q0-70 70-85q70 15 70 85z"/><path d="M820 ${base}q0-60 60-70q60 10 60 70z"/>
<rect x="230" y="${base - 170}" width="20" height="170"/><path d="M226 ${base - 170}l14-34l14 34z"/><rect x="800" y="${base - 190}" width="22" height="190"/><path d="M796 ${base - 190}l15-38l15 38z"/></g>`;
}

function goldFrame(w: number, h: number, inset: number, gold: string, cornerFill: string) {
  const corners = [[inset, inset], [w - inset, inset], [inset, h - inset], [w - inset, h - inset]]
    .map(([x, y]) => `<g transform="translate(${x},${y}) rotate(45)"><rect x="-22" y="-22" width="44" height="44" fill="${cornerFill}" stroke="${gold}" stroke-width="3"/><rect x="-10" y="-10" width="20" height="20" fill="${gold}"/></g>`)
    .join("");
  return `<rect x="${inset}" y="${inset}" width="${w - 2 * inset}" height="${h - 2 * inset}" fill="none" stroke="${gold}" stroke-width="4"/><rect x="${inset + 20}" y="${inset + 20}" width="${w - 2 * inset - 40}" height="${h - 2 * inset - 40}" fill="none" stroke="${gold}" stroke-width="1.5"/>${corners}`;
}

function arch(cx: number, top: number, bottom: number, half: number, fill: string, stroke: string, width = 3) {
  const shoulder = top + half * 1.05;
  return `<path d="M${cx - half} ${bottom}V${shoulder}Q${cx - half} ${top + half * 0.25} ${cx} ${top}Q${cx + half} ${top + half * 0.25} ${cx + half} ${shoulder}V${bottom}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
}

function blobs(w: number, h: number, a: string, b: string) {
  return `<circle cx="${w * 0.85}" cy="${h * 0.15}" r="${w * 0.25}" fill="${a}" opacity=".55" filter="url(#soft)"/><circle cx="${w * 0.1}" cy="${h * 0.9}" r="${w * 0.28}" fill="${b}" opacity=".6" filter="url(#soft)"/>`;
}

function confetti(count: number, colors: string[], w: number, h: number, seed: number) {
  const rnd = seeded(seed);
  let out = "";
  for (let i = 0; i < count; i++) {
    const x = rnd() * w, y = rnd() * h, c = colors[i % colors.length], r = rnd() * 360;
    out += i % 3 === 0
      ? `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(4 + rnd() * 5).toFixed(1)}" fill="${c}" opacity=".85"/>`
      : `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${(8 + rnd() * 10).toFixed(0)}" height="5" rx="2" fill="${c}" opacity=".85" transform="rotate(${r.toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`;
  }
  return out;
}

function balloon(x: number, y: number, r: number, color: string) {
  return `<path d="M${x} ${y + r * 1.15}q-20 60 10 120t-6 120" stroke="${color}" stroke-width="2" fill="none" opacity=".6"/><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 1.18}" fill="${color}"/><ellipse cx="${x - r * 0.35}" cy="${y - r * 0.4}" rx="${r * 0.18}" ry="${r * 0.3}" fill="#fff" opacity=".35"/><path d="M${x - 8} ${y + r * 1.18}h16l-8 12z" fill="${color}"/>`;
}

function rings(cx: number, cy: number, r: number, gold: string) {
  return `<circle cx="${cx - r * 0.55}" cy="${cy}" r="${r}" fill="none" stroke="${gold}" stroke-width="${r * 0.18}"/><circle cx="${cx + r * 0.55}" cy="${cy}" r="${r}" fill="none" stroke="${gold}" stroke-width="${r * 0.18}"/>${sparkle(cx + r * 0.55, cy - r * 1.05, r * 0.35, "#fff")}`;
}

function flower(x: number, y: number, r: number, petal: string, center: string) {
  const petals = [0, 72, 144, 216, 288]
    .map((a) => `<ellipse cx="${x}" cy="${y - r * 0.55}" rx="${r * 0.38}" ry="${r * 0.6}" fill="${petal}" transform="rotate(${a} ${x} ${y})"/>`)
    .join("");
  return `${petals}<circle cx="${x}" cy="${y}" r="${r * 0.28}" fill="${center}"/>`;
}

function flowerCluster(x: number, y: number, petal: string, petal2: string, leaf: string) {
  return `<ellipse cx="${x + 40}" cy="${y + 30}" rx="40" ry="14" fill="${leaf}" transform="rotate(30 ${x + 40} ${y + 30})"/><ellipse cx="${x - 30}" cy="${y + 45}" rx="36" ry="12" fill="${leaf}" transform="rotate(-40 ${x - 30} ${y + 45})"/>${flower(x, y, 46, petal, "#f6d58e")}${flower(x + 60, y - 40, 30, petal2, "#f6d58e")}${flower(x - 55, y - 25, 26, petal2, "#f6d58e")}`;
}

function gradCap(cx: number, cy: number, s: number, color: string, tassel: string) {
  return `<path d="M${cx} ${cy - s * 0.5}L${cx + s} ${cy}L${cx} ${cy + s * 0.5}L${cx - s} ${cy}Z" fill="${color}"/><path d="M${cx - s * 0.6} ${cy + s * 0.2}v${s * 0.45}q${s * 0.6} ${s * 0.35} ${s * 1.2} 0v-${s * 0.45}" fill="${color}"/><path d="M${cx} ${cy}L${cx + s * 0.75} ${cy + s * 0.18}v${s * 0.6}" stroke="${tassel}" stroke-width="${s * 0.05}" fill="none"/><circle cx="${cx + s * 0.75}" cy="${cy + s * 0.82}" r="${s * 0.08}" fill="${tassel}"/>`;
}

function cloud(x: number, y: number, s: number, color: string) {
  return `<g fill="${color}"><circle cx="${x}" cy="${y}" r="${s * 0.5}"/><circle cx="${x + s * 0.55}" cy="${y - s * 0.2}" r="${s * 0.6}"/><circle cx="${x + s * 1.15}" cy="${y}" r="${s * 0.45}"/><rect x="${x}" y="${y}" width="${s * 1.15}" height="${s * 0.45}"/></g>`;
}

function svg(w: number, h: number, body: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>
<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter>
<pattern id="star8" width="90" height="90" patternUnits="userSpaceOnUse"><g fill="none" stroke="#e2b25a" stroke-width="1.4" opacity=".35"><rect x="25" y="25" width="40" height="40"/><rect x="25" y="25" width="40" height="40" transform="rotate(45 45 45)"/><circle cx="45" cy="45" r="6"/><path d="M0 45h12M78 45h12M45 0v12M45 78v12"/></g></pattern>
<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbe7a1"/><stop offset=".45" stop-color="#e2b25a"/><stop offset="1" stop-color="#b8862f"/></linearGradient>
</defs>${body}</svg>`;
}

const GOLD: string[] = ["#fbe7a1", "#e2b25a", "#b8862f"];

// Text block centred on `centre` (a fraction of the height), spaced for size.
function blockLayout(h: number, centre: number, paints: { message: Paint; name: Paint; from: Paint; note: Paint; footer: Paint }, story: boolean, scale = 1): Layout {
  const c = h * centre;
  const gap = story ? 1.15 : 1;
  return {
    message: { y: c - 40 * gap, size: 132 * scale, paint: paints.message },
    name: { y: c + 130 * gap, size: 150 * scale, paint: paints.name },
    from: { y: c + 222 * gap, size: 38, paint: paints.from },
    note: { y: c + 284 * gap, size: 34, paint: paints.note },
    footer: { y: h - 34, size: 22, paint: paints.footer },
    maxWidth: 820,
  };
}

// ---------- template styles ----------

type NightOptions = { bg: [string, string, string]; accent: string; lanterns?: boolean; mosque?: boolean; confetti?: string[]; seed: number };
function nightStyle(id: string, label: string, o: NightOptions): CardTemplate {
  return {
    id,
    label,
    background: (w, h) => svg(w, h, `
<radialGradient id="bg" cx=".7" cy=".2" r="1"><stop offset="0" stop-color="${o.bg[0]}"/><stop offset=".55" stop-color="${o.bg[1]}"/><stop offset="1" stop-color="${o.bg[2]}"/></radialGradient>
<rect width="${w}" height="${h}" fill="url(#bg)"/>${starField(h > w ? 220 : 140, "#fff", w, h * 0.65, o.seed)}
${o.confetti ? confetti(60, o.confetti, w, h * 0.7, o.seed + 3) : ""}
<circle cx="800" cy="230" r="150" fill="#ffd98a" opacity=".12" filter="url(#soft)"/>${crescent(800, 220, 110, "url(#gold)")}
${sparkle(680, 170, 16, "#fbe7a1")}${sparkle(905, 350, 10, "#fbe7a1")}
${o.lanterns ? lantern(150, h > w ? 300 : 170, 1, o.accent) + lantern(250, h > w ? 180 : 90, 0.8, o.accent) + lantern(345, h > w ? 380 : 230, 0.7, o.accent) : ""}
${o.mosque ? mosque(w, h, h - 180, o.bg[2]) : ""}`),
    layout: (w, h) => blockLayout(h, h > w ? 0.5 : 0.53, { message: GOLD, name: "#ffffff", from: "#d7def2", note: "#e2b25a", footer: "rgba(255,255,255,.45)" }, h > w),
  };
}

type FrameOptions = { bg: [string, string]; cornerFill: string; motif: "crescent" | "rings" | "cap" | "star"; seed: number };
function frameStyle(id: string, label: string, o: FrameOptions): CardTemplate {
  const motif = (cx: number, cy: number) => o.motif === "crescent"
    ? crescent(cx, cy, 42, "url(#gold)") + sparkle(cx + 48, cy - 26, 9, "#fbe7a1")
    : o.motif === "rings" ? rings(cx, cy, 34, "url(#gold)")
      : o.motif === "cap" ? gradCap(cx, cy, 60, "url(#gold)", "#fbe7a1")
        : sparkle(cx, cy, 40, "url(#gold)") + sparkle(cx - 60, cy + 20, 14, "#fbe7a1") + sparkle(cx + 60, cy + 20, 14, "#fbe7a1");
  return {
    id,
    label,
    background: (w, h) => {
      const top = h > w ? 380 : 170;
      return svg(w, h, `
<radialGradient id="bg" cx=".5" cy=".45" r=".8"><stop offset="0" stop-color="${o.bg[0]}"/><stop offset="1" stop-color="${o.bg[1]}"/></radialGradient>
<rect width="${w}" height="${h}" fill="url(#bg)"/><rect width="${w}" height="${h}" fill="url(#star8)"/>${goldFrame(w, h, 60, "url(#gold)", o.cornerFill)}
${arch(w / 2, top, h - (h > w ? 360 : 180), 240, o.bg[1], "url(#gold)")}${arch(w / 2, top + 40, h - (h > w ? 360 : 180), 210, "none", "url(#gold)", 1.2)}
${motif(w / 2, top + 125)}<path d="M${w / 2 - 130} ${h * (h > w ? 0.5 : 0.53) + 25}h260" stroke="url(#gold)" stroke-width="2"/>`);
    },
    layout: (w, h) => {
      const l = blockLayout(h, h > w ? 0.5 : 0.53, { message: GOLD, name: "#ffffff", from: "#e7efe6", note: "#e2b25a", footer: "rgba(226,178,90,.65)" }, h > w, 0.86);
      return { ...l, maxWidth: 430, footer: { ...l.footer, y: h - 100 } };
    },
  };
}

type SoftOptions = { bg: string; blobA: string; blobB: string; ink: string; accent: string; motif: "crescent" | "rings" | "balloons" | "cap" | "stars"; seed: number };
function softStyle(id: string, label: string, o: SoftOptions): CardTemplate {
  const motif = (w: number, h: number) => {
    switch (o.motif) {
      case "crescent": return crescent(760, h > w ? 300 : 170, 50, o.accent) + sparkle(690, h > w ? 260 : 150, 12, o.accent) + sparkle(850, h > w ? 380 : 250, 8, o.accent);
      case "rings": return rings(w / 2, h > w ? 470 : 285, 30, o.accent);
      case "balloons": return balloon(200, h > w ? 300 : 200, 55, o.accent) + balloon(880, h > w ? 360 : 230, 45, o.blobB);
      case "cap": return gradCap(w / 2, h > w ? 470 : 285, 54, o.ink, o.accent);
      default: return sparkle(w / 2, h > w ? 470 : 285, 26, o.accent) + sparkle(w / 2 - 50, h > w ? 490 : 305, 10, o.accent) + sparkle(w / 2 + 50, h > w ? 490 : 305, 10, o.accent);
    }
  };
  return {
    id,
    label,
    background: (w, h) => svg(w, h, `<rect width="${w}" height="${h}" fill="${o.bg}"/>${blobs(w, h, o.blobA, o.blobB)}
${arch(w / 2, h > w ? 380 : 190, h - (h > w ? 380 : 140), 240, "#fffaf2", o.accent)}${motif(w, h)}`),
    layout: (w, h) => {
      const l = blockLayout(h, h > w ? 0.52 : 0.55, { message: o.ink, name: o.accent, from: "#6b625a", note: "#8a8178", footer: "rgba(47,42,38,.4)" }, h > w, 0.86);
      return { ...l, maxWidth: 430 };
    },
  };
}

type FestiveOptions = { bg: [string, string]; colors: string[]; ink: string; nameInk: string; motif: "balloons" | "cap" | "confetti"; seed: number; dark?: boolean };
function festiveStyle(id: string, label: string, o: FestiveOptions): CardTemplate {
  return {
    id,
    label,
    background: (w, h) => svg(w, h, `
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.bg[0]}"/><stop offset="1" stop-color="${o.bg[1]}"/></linearGradient>
<rect width="${w}" height="${h}" fill="url(#bg)"/>${confetti(h > w ? 160 : 110, o.colors, w, h, o.seed)}
${o.motif === "balloons" ? balloon(170, h > w ? 330 : 220, 70, o.colors[0]) + balloon(300, h > w ? 250 : 150, 55, o.colors[1]) + balloon(900, h > w ? 300 : 200, 64, o.colors[2]) : ""}
${o.motif === "cap" ? gradCap(w / 2, h > w ? 500 : 250, 90, o.dark ? "url(#gold)" : o.ink, o.colors[0]) : ""}`),
    layout: (w, h) => blockLayout(h, h > w ? 0.55 : 0.6, { message: o.dark ? GOLD : o.ink, name: o.nameInk, from: o.dark ? "#d7def2" : "#5c5560", note: o.dark ? "#e2b25a" : "#857d88", footer: o.dark ? "rgba(255,255,255,.45)" : "rgba(40,30,50,.4)" }, h > w),
  };
}

type PastelOptions = { bg: [string, string]; cloud: string; ink: string; nameInk: string; flowers?: [string, string, string]; motif?: "rings" | "stars"; seed: number };
function pastelStyle(id: string, label: string, o: PastelOptions): CardTemplate {
  return {
    id,
    label,
    background: (w, h) => svg(w, h, `
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.bg[0]}"/><stop offset="1" stop-color="${o.bg[1]}"/></linearGradient>
<rect width="${w}" height="${h}" fill="url(#bg)"/>${starField(40, "#ffffff", w, h * 0.5, o.seed, 3)}
${o.flowers ? flowerCluster(130, 140, o.flowers[0], o.flowers[1], o.flowers[2]) + flowerCluster(w - 140, h - 150, o.flowers[0], o.flowers[1], o.flowers[2]) : cloud(90, 200, 120, o.cloud) + cloud(760, 130, 150, o.cloud) + cloud(820, h - 90, 120, o.cloud)}
${o.motif === "rings" ? rings(w / 2, h > w ? 520 : 270, 40, "url(#gold)") : sparkle(w / 2, h > w ? 520 : 270, 30, "#f6c15a") + sparkle(w / 2 - 60, h > w ? 545 : 295, 12, "#f6c15a") + sparkle(w / 2 + 60, h > w ? 545 : 295, 12, "#f6c15a")}`),
    layout: (w, h) => blockLayout(h, h > w ? 0.55 : 0.58, { message: o.ink, name: o.nameInk, from: "#5f5a66", note: "#8a8494", footer: "rgba(40,30,50,.4)" }, h > w),
  };
}

// ---------- occasions ----------

export type Occasion = {
  slug: string;
  name: string; // short, for menus
  title: string; // <title>
  heading: string;
  description: string;
  intro: string;
  messages: string[]; // headline phrases that fit on the card
  defaultNote: string;
  greetings: string[]; // longer phrases listed on the page
  faqs: Array<{ question: string; answer: string }>;
  templates: CardTemplate[];
  defaultFont: CardFontId;
};

const commonFaqs = (occasion: string) => [
  { question: `كيف أصمم بطاقة تهنئة ${occasion} باسمي؟`, answer: "اختر قالباً، واكتب الاسم واسم المرسل إن أردت، ثم اختر العبارة والخط واضغط تحميل البطاقة." },
  { question: "هل البطاقات مجانية؟", answer: "نعم، الأداة مجانية بالكامل، وتعمل في المتصفح دون تسجيل، ولا يُرسل الاسم إلى أي خادم." },
  { question: "ما مقاس البطاقة؟", answer: "مربع 1080×1080 مناسب لواتساب وإنستغرام، أو ستوري 1080×1920 مناسب للحالات والقصص." },
];

export const OCCASIONS: Occasion[] = [
  {
    slug: "ramadan",
    name: "رمضان",
    title: "بطاقة تهنئة رمضان باسمك 2027 — تصميم مجاني | xfontat",
    heading: "بطاقات تهنئة رمضان باسمك",
    description: "صمّم بطاقة تهنئة بشهر رمضان باسمك أو باسم من تحب بخط عربي جميل، وحمّلها صورة لواتساب وإنستغرام أو شاركها مباشرة.",
    intro: "اكتب اسمك أو اسم من تهنئه، واختر قالباً وخطاً عربياً، لتحصل على بطاقة رمضانية جاهزة للمشاركة في ثوانٍ.",
    messages: ["رمضان كريم", "رمضان مبارك", "مبارك عليكم الشهر", "أهلاً رمضان"],
    defaultNote: "تقبّل الله منا ومنكم صالح الأعمال",
    greetings: [
      "رمضان كريم، أعاده الله عليكم بالخير واليمن والبركات.",
      "مبارك عليكم الشهر، تقبّل الله صيامكم وقيامكم.",
      "أسأل الله أن يبلغك رمضان وأنت في أتم صحة وعافية.",
      "كل عام وأنتم إلى الله أقرب، رمضان مبارك.",
    ],
    faqs: commonFaqs("رمضان"),
    defaultFont: "thuluth",
    templates: [
      nightStyle("ramadan-night", "ليلة رمضانية", { bg: ["#1d3366", "#0c1838", "#050a1c"], accent: "#e2b25a", lanterns: true, mosque: true, seed: 7 }),
      frameStyle("ramadan-emerald", "زخرفة ذهبية", { bg: ["#145c47", "#062a20"], cornerFill: "#062a20", motif: "crescent", seed: 3 }),
      softStyle("ramadan-soft", "عصري هادئ", { bg: "#f6efe4", blobA: "#f2c9a8", blobB: "#bcd3c0", ink: "#2f2a26", accent: "#c4704f", motif: "crescent", seed: 5 }),
    ],
  },
  {
    slug: "eid-al-fitr",
    name: "عيد الفطر",
    title: "تهنئة عيد الفطر باسمك — بطاقات مجانية | xfontat",
    heading: "بطاقات تهنئة عيد الفطر باسمك",
    description: "بطاقات تهنئة بعيد الفطر المبارك باسمك وبخطوط عربية فاخرة، جاهزة للتحميل والمشاركة على واتساب وإنستغرام.",
    intro: "هنّئ أهلك وأصدقاءك بعيد الفطر ببطاقة تحمل أسماءهم، واختر بين القوالب الكلاسيكية والعصرية.",
    messages: ["عيد مبارك", "عيد سعيد", "عيدكم مبارك", "كل عام وأنتم بخير"],
    defaultNote: "تقبّل الله منا ومنكم",
    greetings: [
      "عيد مبارك، وكل عام وأنتم بخير وصحة وسعادة.",
      "تقبّل الله منا ومنكم الصيام والقيام، وعيدكم سعيد.",
      "أعاده الله عليكم بالفرح والمسرات، عيد فطر مبارك.",
      "من العايدين الفايزين، وكل عام وأنتم بألف خير.",
    ],
    faqs: commonFaqs("عيد الفطر"),
    defaultFont: "thuluth",
    templates: [
      nightStyle("fitr-night", "ليلة العيد", { bg: ["#3b2a6b", "#1d1440", "#0d0822"], accent: "#e2b25a", mosque: true, confetti: ["#fbe7a1", "#e2b25a", "#ffffff"], seed: 11 }),
      frameStyle("fitr-royal", "ملكي ذهبي", { bg: ["#6b1d3a", "#33081a"], cornerFill: "#33081a", motif: "star", seed: 13 }),
      softStyle("fitr-soft", "عصري هادئ", { bg: "#f7f1ea", blobA: "#f5c6c6", blobB: "#c8d8ef", ink: "#2f2a26", accent: "#b85c6e", motif: "stars", seed: 17 }),
    ],
  },
  {
    slug: "eid-al-adha",
    name: "عيد الأضحى",
    title: "تهنئة عيد الأضحى بالاسم — بطاقات مجانية | xfontat",
    heading: "بطاقات تهنئة عيد الأضحى بالاسم",
    description: "صمّم بطاقة تهنئة بعيد الأضحى المبارك باسمك أو باسم من تحب بخط عربي، وحمّلها صورة جاهزة للمشاركة.",
    intro: "بطاقات عيد الأضحى بقوالب إسلامية وعصرية، تكتب فيها الاسم والعبارة وتحمّلها بجودة عالية.",
    messages: ["عيد أضحى مبارك", "عيدكم مبارك", "كل عام وأنتم بخير", "عيد سعيد"],
    defaultNote: "تقبّل الله طاعتكم وضحاياكم",
    greetings: [
      "عيد أضحى مبارك، أعاده الله عليكم بالخير والبركات.",
      "تقبّل الله منا ومنكم صالح الأعمال، وكل عام وأنتم بخير.",
      "نسأل الله أن يكتب لكم حج بيته الحرام، عيدكم مبارك.",
      "كل عام وأنتم إلى الله أقرب، عيد أضحى سعيد.",
    ],
    faqs: commonFaqs("عيد الأضحى"),
    defaultFont: "thuluth",
    templates: [
      frameStyle("adha-emerald", "زخرفة ذهبية", { bg: ["#0f4d5c", "#04232b"], cornerFill: "#04232b", motif: "crescent", seed: 19 }),
      nightStyle("adha-night", "ليلة العيد", { bg: ["#1b4d4a", "#0b2826", "#041514"], accent: "#e2b25a", lanterns: true, mosque: true, seed: 23 }),
      softStyle("adha-soft", "عصري هادئ", { bg: "#f4efe6", blobA: "#e8d3a8", blobB: "#b9d1cf", ink: "#2f2a26", accent: "#2e7d74", motif: "crescent", seed: 29 }),
    ],
  },
  {
    slug: "hijri-new-year",
    name: "رأس السنة الهجرية",
    title: "تهنئة رأس السنة الهجرية بالاسم — بطاقات مجانية | xfontat",
    heading: "بطاقات تهنئة رأس السنة الهجرية",
    description: "بطاقات تهنئة بالعام الهجري الجديد باسمك وبخطوط عربية، جاهزة للتحميل والمشاركة.",
    intro: "استقبل العام الهجري الجديد ببطاقة تهنئة تحمل اسمك أو اسم من تحب.",
    messages: ["عام هجري سعيد", "كل عام وأنتم بخير", "سنة هجرية مباركة"],
    defaultNote: "جعله الله عام خير وبركة",
    greetings: [
      "كل عام وأنتم بخير بمناسبة العام الهجري الجديد.",
      "أسأل الله أن يجعله عام خير وبركة عليكم.",
      "عام هجري سعيد، أعاده الله علينا وعليكم باليمن والبركات.",
    ],
    faqs: commonFaqs("رأس السنة الهجرية"),
    defaultFont: "katibeh",
    templates: [
      nightStyle("hijri-night", "هلال جديد", { bg: ["#22305e", "#101934", "#070c1d"], accent: "#e2b25a", seed: 31 }),
      frameStyle("hijri-emerald", "زخرفة ذهبية", { bg: ["#145c47", "#062a20"], cornerFill: "#062a20", motif: "crescent", seed: 37 }),
      softStyle("hijri-soft", "عصري هادئ", { bg: "#f6efe4", blobA: "#f2d6a8", blobB: "#c9d6e8", ink: "#2f2a26", accent: "#8a5a2b", motif: "crescent", seed: 41 }),
    ],
  },
  {
    slug: "wedding",
    name: "الزواج",
    title: "بطاقة تهنئة زواج باسم العروسين — تصميم مجاني | xfontat",
    heading: "بطاقات تهنئة بالزواج باسم العروسين",
    description: "صمّم بطاقة تهنئة بالزواج تحمل اسم العروسين بخط عربي أنيق، وحمّلها صورة للمشاركة.",
    intro: "اكتب اسم العروسين، مثل «أحمد وسارة»، واختر قالباً أنيقاً لتهنئتهما بالزواج.",
    messages: ["بارك الله لكما", "ألف مبروك", "زواج مبارك", "بالرفاء والبنين"],
    defaultNote: "وجمع بينكما في خير",
    greetings: [
      "بارك الله لكما وبارك عليكما وجمع بينكما في خير.",
      "ألف مبروك الزواج، وعقبال الذرية الصالحة.",
      "أسأل الله أن يملأ حياتكما بالمودة والرحمة.",
    ],
    faqs: commonFaqs("الزواج"),
    defaultFont: "gulzar",
    templates: [
      pastelStyle("wedding-blush", "ورود ناعمة", { bg: ["#fbe9ea", "#f4d3d6"], cloud: "#fff", ink: "#7a3b4a", nameInk: "#b2546a", flowers: ["#f2a7b5", "#f7c9d1", "#8fb59a"], motif: "rings", seed: 43 }),
      frameStyle("wedding-gold", "ذهبي فاخر", { bg: ["#24324f", "#0e1527"], cornerFill: "#0e1527", motif: "rings", seed: 47 }),
      softStyle("wedding-soft", "عصري بسيط", { bg: "#f7f2ec", blobA: "#f1cfc4", blobB: "#d7e2d3", ink: "#2f2a26", accent: "#b07b4f", motif: "rings", seed: 53 }),
    ],
  },
  {
    slug: "newborn",
    name: "المولود الجديد",
    title: "تهنئة مولود جديد باسمه — بطاقات مجانية | xfontat",
    heading: "بطاقات تهنئة بالمولود الجديد باسمه",
    description: "بطاقات تهنئة بالمولود الجديد تحمل اسمه بخط عربي جميل، بألوان للأولاد والبنات، جاهزة للتحميل.",
    intro: "اكتب اسم المولود واختر قالباً بألوان هادئة لتهنئة الأهل بقدومه.",
    messages: ["مبارك المولود", "أهلاً بالمولود", "بورك لكم في الموهوب"],
    defaultNote: "جعله الله من مواليد السعادة",
    greetings: [
      "بورك لكم في الموهوب، وشكرتم الواهب، وبلغ أشده ورُزقتم برّه.",
      "مبارك المولود، جعله الله قرة عين لكم.",
      "الحمد لله على سلامة الأم، ومبارك قدوم المولود.",
    ],
    faqs: commonFaqs("المولود"),
    defaultFont: "katibeh",
    templates: [
      pastelStyle("newborn-blue", "سماء زرقاء", { bg: ["#dcecfb", "#bcd9f3"], cloud: "#ffffff", ink: "#2c4a6e", nameInk: "#3d78b8", seed: 59 }),
      pastelStyle("newborn-pink", "وردي ناعم", { bg: ["#fde8ee", "#f7cfdb"], cloud: "#ffffff", ink: "#7a3b56", nameInk: "#c0567e", seed: 61 }),
      softStyle("newborn-soft", "عصري هادئ", { bg: "#f6f1e8", blobA: "#f6d9a8", blobB: "#cfe3d4", ink: "#2f2a26", accent: "#c08a3e", motif: "stars", seed: 67 }),
    ],
  },
  {
    slug: "graduation",
    name: "التخرج",
    title: "تهنئة تخرج باسمك — بطاقات مجانية | xfontat",
    heading: "بطاقات تهنئة بالتخرج باسمك",
    description: "صمّم بطاقة تهنئة بالتخرج باسم الخريج أو الخريجة بخط عربي، وحمّلها صورة للمشاركة.",
    intro: "احتفل بنجاح الخريج ببطاقة تحمل اسمه وعبارة تهنئة مميزة.",
    messages: ["مبروك التخرج", "ألف مبروك النجاح", "إلى الأمام دائماً"],
    defaultNote: "وعقبال أعلى المراتب",
    greetings: [
      "مبروك التخرج، وعقبال أعلى المراتب.",
      "ألف مبروك النجاح، فخورون بك دائماً.",
      "بداية رحلة جديدة، نتمنى لك التوفيق والنجاح.",
    ],
    faqs: commonFaqs("التخرج"),
    defaultFont: "rakkas",
    templates: [
      festiveStyle("grad-navy", "كحلي ذهبي", { bg: ["#16244a", "#0a1228"], colors: ["#e2b25a", "#fbe7a1", "#ffffff"], ink: "#16244a", nameInk: "#ffffff", motif: "cap", seed: 71, dark: true }),
      frameStyle("grad-emerald", "إطار ذهبي", { bg: ["#145c47", "#062a20"], cornerFill: "#062a20", motif: "cap", seed: 73 }),
      softStyle("grad-soft", "عصري هادئ", { bg: "#f4f1ea", blobA: "#cfdcf0", blobB: "#f2d6a8", ink: "#1f2a44", accent: "#c08a3e", motif: "cap", seed: 79 }),
    ],
  },
  {
    slug: "birthday",
    name: "عيد الميلاد",
    title: "بطاقة عيد ميلاد بالاسم — تصميم مجاني | xfontat",
    heading: "بطاقات تهنئة بعيد الميلاد بالاسم",
    description: "بطاقات عيد ميلاد بالاسم بخطوط عربية وألوان مبهجة، جاهزة للتحميل والمشاركة.",
    intro: "اكتب اسم صاحب المناسبة، واختر قالباً مبهجاً لتهنئته بعيد ميلاده.",
    messages: ["عيد ميلاد سعيد", "كل عام وأنت بخير", "سنة حلوة"],
    defaultNote: "وعقبال مئة عام",
    greetings: [
      "عيد ميلاد سعيد، وكل عام وأنت بخير.",
      "أتمنى لك سنة مليئة بالفرح والنجاح.",
      "كل عام وأنت أجمل، وعقبال مئة عام.",
    ],
    faqs: commonFaqs("عيد الميلاد"),
    defaultFont: "rakkas",
    templates: [
      festiveStyle("bday-party", "حفلة", { bg: ["#2b1745", "#14091f"], colors: ["#f472b6", "#facc15", "#60a5fa", "#34d399"], ink: "#2b1745", nameInk: "#ffffff", motif: "balloons", seed: 83, dark: true }),
      festiveStyle("bday-light", "بالونات", { bg: ["#fff7ed", "#fde7d4"], colors: ["#f87171", "#60a5fa", "#fbbf24", "#a78bfa"], ink: "#3b2a4a", nameInk: "#e1576b", motif: "balloons", seed: 89 }),
      softStyle("bday-soft", "عصري هادئ", { bg: "#f7f2ec", blobA: "#f5c6c6", blobB: "#cde3f2", ink: "#2f2a26", accent: "#d06a6a", motif: "balloons", seed: 97 }),
    ],
  },
];

export function getOccasion(slug: string) {
  return OCCASIONS.find((occasion) => occasion.slug === slug);
}

// ---------- rendering ----------

const fontFamily = (id: string) => `xf-card-${id}`;
const fontLoads = new Map<string, Promise<void>>();

export function loadCardFont(id: string): Promise<void> {
  const font = [...CARD_FONTS, BODY_FONT, LABEL_FONT].find((item) => item.id === id);
  if (!font) return Promise.resolve();
  if (!fontLoads.has(id)) {
    const url = font.url.split("/").map((part) => encodeURIComponent(part)).join("/");
    fontLoads.set(id, new FontFace(fontFamily(id), `url("${url}")`).load().then((face) => {
      document.fonts.add(face);
    }));
  }
  return fontLoads.get(id)!;
}

const backgroundCache = new Map<string, Promise<HTMLImageElement>>();
function loadBackground(template: CardTemplate, w: number, h: number) {
  const key = `${template.id}-${w}x${h}`;
  if (!backgroundCache.has(key)) {
    backgroundCache.set(key, new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(template.background(w, h))}`;
    }));
  }
  return backgroundCache.get(key)!;
}

export type CardContent = {
  message: string;
  name: string;
  from: string;
  note: string;
  messageFont: CardFontId;
  nameFont: CardFontId;
};

function paintFor(ctx: CanvasRenderingContext2D, paint: Paint, y: number, size: number) {
  if (typeof paint === "string") return paint;
  const gradient = ctx.createLinearGradient(0, y - size * 0.8, 0, y + size * 0.3);
  paint.forEach((stop, index) => gradient.addColorStop(index / (paint.length - 1), stop));
  return gradient;
}

function drawText(ctx: CanvasRenderingContext2D, text: string, x: number, slot: Slot, family: string, maxWidth: number) {
  if (!text.trim()) return;
  let size = slot.size;
  ctx.font = `${size}px "${family}", serif`;
  // Shrink long names and phrases to fit instead of overflowing the frame.
  while (ctx.measureText(text).width > maxWidth && size > 18) {
    size -= 4;
    ctx.font = `${size}px "${family}", serif`;
  }
  ctx.fillStyle = paintFor(ctx, slot.paint, slot.y, size);
  ctx.fillText(text, x, slot.y);
}

// isCurrent lets a caller drop a render that a newer one has overtaken while
// fonts or the background were loading.
export async function renderCard(canvas: HTMLCanvasElement, template: CardTemplate, content: CardContent, size: CardSize, isCurrent: () => boolean = () => true) {
  const { w, h } = CARD_DIMENSIONS[size];
  await Promise.all([loadCardFont(content.messageFont), loadCardFont(content.nameFont), loadCardFont(BODY_FONT.id), loadCardFont(LABEL_FONT.id)]);
  const background = await loadBackground(template, w, h);
  if (!isCurrent()) return;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(background, 0, 0, w, h);
  const layout = template.layout(w, h);
  ctx.direction = "rtl";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const x = w / 2;
  drawText(ctx, content.message, x, layout.message, fontFamily(content.messageFont), layout.maxWidth);
  drawText(ctx, content.name, x, layout.name, fontFamily(content.nameFont), layout.maxWidth);
  drawText(ctx, content.from, x, layout.from, fontFamily(BODY_FONT.id), layout.maxWidth);
  drawText(ctx, content.note, x, layout.note, fontFamily(BODY_FONT.id), layout.maxWidth);
  ctx.direction = "ltr";
  drawText(ctx, "xfontat.com", x, layout.footer, fontFamily(LABEL_FONT.id), layout.maxWidth);
}

export const CARDS_HUB = {
  path: "/tahnia",
  title: "بطاقات تهنئة باسمك — رمضان والعيد والزواج والمولود | xfontat",
  heading: "بطاقات تهنئة باسمك",
  description: "صمّم بطاقات تهنئة مجانية باسمك بخطوط عربية جميلة لرمضان والعيد والزواج والمولود والتخرج وعيد الميلاد، وحمّلها صورة أو شاركها على واتساب.",
  intro: "اختر المناسبة، ثم القالب، واكتب الاسم لتحصل على بطاقة تهنئة جاهزة بمقاس واتساب وإنستغرام أو بمقاس الستوري.",
  faqs: [
    { question: "هل بطاقات التهنئة مجانية؟", answer: "نعم، كل البطاقات مجانية وتعمل في المتصفح دون تسجيل، ولا يُرسل الاسم الذي تكتبه إلى أي خادم." },
    { question: "هل يمكنني استخدام البطاقة تجارياً؟", answer: "الخطوط المستخدمة في البطاقات منشورة بترخيص SIL Open Font License الذي يسمح بالاستخدام التجاري، والرسومات من تصميم xfontat." },
    { question: "كيف أرسل البطاقة على واتساب؟", answer: "على الجوال اضغط زر المشاركة واختر واتساب، أو حمّل الصورة ثم أرسلها من المعرض." },
  ],
};

export function occasionPath(slug: string) {
  return `${CARDS_HUB.path}/${slug}`;
}
