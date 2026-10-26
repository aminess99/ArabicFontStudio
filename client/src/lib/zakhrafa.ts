// Text decoration ("zakhrafa") built from plain Unicode, so the output can be
// pasted anywhere: Arabic gets tatweel, diacritics and frames; Latin letters
// are mapped onto the Unicode styled alphabets.

const TATWEEL = "ـ";

// Letters that connect to the following letter; a tatweel after any other
// letter would float detached.
const JOINS_NEXT = new Set("بتثجحخسشصضطظعغفقكلمنهيئىپچگک");
const ARABIC_LETTER = /[ؠ-يٮ-ۓۺ-ۼ]/;

const MARK = /[\u064B-\u065F\u0670\u06D6-\u06ED]/;

// Inserts `filler` after every letter that connects to the next one, keeping
// any diacritics attached to their letter.
function stretch(text: string, filler: string): string {
  const chars = Array.from(text);
  let out = "";
  for (let i = 0; i < chars.length; i++) {
    out += chars[i];
    if (!JOINS_NEXT.has(chars[i])) continue;
    while (MARK.test(chars[i + 1] || "")) out += chars[++i];
    if (ARABIC_LETTER.test(chars[i + 1] || "")) out += filler;
  }
  return out;
}

// Appends a mark to every Arabic letter.
function markLetters(text: string, mark: string): string {
  return Array.from(text, (char) => (ARABIC_LETTER.test(char) ? char + mark : char)).join("");
}

function alternateMarks(text: string, marks: string[]): string {
  let letterIndex = 0;
  return Array.from(text, (char) => (ARABIC_LETTER.test(char) ? char + marks[letterIndex++ % marks.length] : char)).join("");
}

// Latin letters shifted into a Unicode styled alphabet. Some code points in
// those blocks are reserved because the letter already existed elsewhere.
function mapLatin(text: string, upperStart: number, lowerStart: number, digitStart?: number, holes: Record<string, string> = {}): string {
  return Array.from(text, (char) => {
    if (holes[char]) return holes[char];
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(upperStart + code - 65);
    if (code >= 97 && code <= 122) return String.fromCodePoint(lowerStart + code - 97);
    if (digitStart !== undefined && code >= 48 && code <= 57) return String.fromCodePoint(digitStart + code - 48);
    return char;
  }).join("");
}

function mapChars(text: string, from: string, to: string[]): string {
  return Array.from(text, (char) => {
    const index = from.indexOf(char);
    return index === -1 ? char : to[index];
  }).join("");
}

const LATIN = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SMALL_CAPS = Array.from("ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ");
const UPSIDE_DOWN = Array.from("ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz∀ꓭƆꓷƎℲ⅁HIſꓘ˥WNOԀῸꓤS⊥∩ΛMX⅄Z");

const SCRIPT_HOLES = { B: "ℬ", E: "ℰ", F: "ℱ", H: "ℋ", I: "ℐ", L: "ℒ", M: "ℳ", R: "ℛ", e: "ℯ", g: "ℊ", o: "ℴ" };
const FRAKTUR_HOLES = { C: "ℭ", H: "ℌ", I: "ℑ", R: "ℜ", Z: "ℨ" };
const DOUBLE_STRUCK_HOLES = { C: "ℂ", H: "ℍ", N: "ℕ", P: "ℙ", Q: "ℚ", R: "ℝ", Z: "ℤ" };
const ITALIC_HOLES = { h: "ℎ" };

function circled(text: string): string {
  return Array.from(text, (char) => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(0x24b6 + code - 65);
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x24d0 + code - 97);
    if (code >= 49 && code <= 57) return String.fromCodePoint(0x2460 + code - 49);
    if (char === "0") return "⓪";
    return char;
  }).join("");
}

function squared(text: string): string {
  return Array.from(text.toUpperCase(), (char) => {
    const code = char.charCodeAt(0);
    return code >= 65 && code <= 90 ? String.fromCodePoint(0x1f130 + code - 65) : char;
  }).join("");
}

function fullwidth(text: string): string {
  return Array.from(text, (char) => {
    const code = char.charCodeAt(0);
    return code >= 33 && code <= 126 ? String.fromCodePoint(code + 0xfee0) : char;
  }).join("");
}

function combineEach(text: string, mark: string): string {
  return Array.from(text, (char) => (char.trim() ? char + mark : char)).join("");
}

export type ZakhrafaStyle = {
  id: string;
  apply: (text: string) => string;
  // Only offered when the text contains this script.
  script: "arabic" | "latin" | "any";
};

const frame = (left: string, right: string) => (text: string) => `${left}${text}${right}`;

export const zakhrafaStyles: ZakhrafaStyle[] = [
  // Arabic letter decoration
  { id: "tatweel", script: "arabic", apply: (t) => stretch(t, TATWEEL) },
  { id: "tatweel-long", script: "arabic", apply: (t) => stretch(t, TATWEEL.repeat(3)) },
  { id: "shadda", script: "arabic", apply: (t) => stretch(markLetters(t, "ّ"), TATWEEL) },
  { id: "fatha-shadda", script: "arabic", apply: (t) => stretch(markLetters(t, "َّ"), TATWEEL) },
  { id: "tanween", script: "arabic", apply: (t) => stretch(markLetters(t, "ً"), TATWEEL) },
  { id: "mixed-harakat", script: "arabic", apply: (t) => stretch(alternateMarks(t, ["َ", "ُ", "ِ", "ّ"]), TATWEEL) },
  { id: "sukun", script: "arabic", apply: (t) => stretch(markLetters(t, "ْ"), TATWEEL) },
  { id: "hearts", script: "arabic", apply: (t) => `♡ ${stretch(t, TATWEEL)} ♡` },
  { id: "persian-frame", script: "arabic", apply: (t) => `ﮩ٨ـ${stretch(t, TATWEEL)}ـ٨ﮩ` },
  { id: "dotted-frame", script: "arabic", apply: (t) => `۝ ${stretch(markLetters(t, "ّ"), TATWEEL)} ۝` },
  { id: "flower-harakat", script: "arabic", apply: (t) => `✿ ${stretch(alternateMarks(t, ["َ", "ّ"]), TATWEEL)} ✿` },

  // Latin styled alphabets
  { id: "bold", script: "latin", apply: (t) => mapLatin(t, 0x1d400, 0x1d41a, 0x1d7ce) },
  { id: "italic", script: "latin", apply: (t) => mapLatin(t, 0x1d434, 0x1d44e, undefined, ITALIC_HOLES) },
  { id: "bold-italic", script: "latin", apply: (t) => mapLatin(t, 0x1d468, 0x1d482) },
  { id: "script", script: "latin", apply: (t) => mapLatin(t, 0x1d49c, 0x1d4b6, undefined, SCRIPT_HOLES) },
  { id: "bold-script", script: "latin", apply: (t) => mapLatin(t, 0x1d4d0, 0x1d4ea) },
  { id: "fraktur", script: "latin", apply: (t) => mapLatin(t, 0x1d504, 0x1d51e, undefined, FRAKTUR_HOLES) },
  { id: "bold-fraktur", script: "latin", apply: (t) => mapLatin(t, 0x1d56c, 0x1d586) },
  { id: "double-struck", script: "latin", apply: (t) => mapLatin(t, 0x1d538, 0x1d552, 0x1d7d8, DOUBLE_STRUCK_HOLES) },
  { id: "sans-bold", script: "latin", apply: (t) => mapLatin(t, 0x1d5d4, 0x1d5ee, 0x1d7ec) },
  { id: "monospace", script: "latin", apply: (t) => mapLatin(t, 0x1d670, 0x1d68a, 0x1d7f6) },
  { id: "circled", script: "latin", apply: circled },
  { id: "squared", script: "latin", apply: squared },
  { id: "small-caps", script: "latin", apply: (t) => mapChars(t, LATIN, SMALL_CAPS) },
  { id: "fullwidth", script: "latin", apply: fullwidth },
  { id: "upside-down", script: "latin", apply: (t) => Array.from(mapChars(t, LATIN, UPSIDE_DOWN)).reverse().join("") },
  { id: "strike", script: "latin", apply: (t) => combineEach(t, "̶") },
  { id: "underline", script: "latin", apply: (t) => combineEach(t, "̲") },

  // Frames that suit any script
  { id: "royal", script: "any", apply: frame("꧁༒☬ ", " ☬༒꧂") },
  { id: "crown", script: "any", apply: frame("♔ ", " ♔") },
  { id: "stars", script: "any", apply: frame("★彡 ", " 彡★") },
  { id: "lightning", script: "any", apply: frame("⚡ ", " ⚡") },
  { id: "corner-brackets", script: "any", apply: frame("『", "』") },
  { id: "lenticular", script: "any", apply: frame("【", "】") },
  { id: "tibetan", script: "any", apply: frame("༺ ", " ༻") },
  { id: "hieroglyph", script: "any", apply: frame("𓆩 ", " 𓆪") },
  { id: "sparkles", script: "any", apply: frame("✨ ", " ✨") },
  { id: "flowers", script: "any", apply: frame("❀ ", " ❀") },
  { id: "dove", script: "any", apply: frame("🕊 ", " 🕊") },
  { id: "swords", script: "any", apply: frame("⚔ ", " ⚔") },
  { id: "wings", script: "any", apply: frame("꧁ ", " ꧂") },
  { id: "infinity", script: "any", apply: frame("∞ ", " ∞") },
  { id: "music", script: "any", apply: frame("♫ ", " ♫") },
  { id: "moon", script: "any", apply: frame("☾ ", " ☽") },
];

const HAS_ARABIC = /[؀-ۿ]/;
const HAS_LATIN = /[A-Za-z]/;

export function decorate(text: string): Array<{ id: string; value: string }> {
  const input = text.trim();
  if (!input) return [];
  const arabic = HAS_ARABIC.test(input);
  const latin = HAS_LATIN.test(input);
  const seen = new Set<string>([input]);
  const results: Array<{ id: string; value: string }> = [];
  for (const style of zakhrafaStyles) {
    if ((style.script === "arabic" && !arabic) || (style.script === "latin" && !latin)) continue;
    const value = style.apply(input);
    if (seen.has(value)) continue;
    seen.add(value);
    results.push({ id: style.id, value });
  }
  // Frames around the first decorated Arabic form give the popular combined styles.
  if (arabic) {
    const base = stretch(markLetters(input, "ّ"), TATWEEL);
    for (const style of zakhrafaStyles.filter((s) => s.script === "any").slice(0, 6)) {
      const value = style.apply(base);
      if (!seen.has(value)) {
        seen.add(value);
        results.push({ id: `${style.id}-decorated`, value });
      }
    }
  }
  return results;
}
