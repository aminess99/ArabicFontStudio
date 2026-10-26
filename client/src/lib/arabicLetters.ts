// Names and sound hints for Arabic letters, used to explain how a name or
// phrase is spelled on the "in Arabic" pages.

type Letter = { name: string; en: string; fr: string };

const LETTERS: Record<string, Letter> = {
  "ا": { name: "Alif", en: "long \"a\" as in \"father\"", fr: "« a » long comme dans « âme »" },
  "أ": { name: "Alif with hamza", en: "a short \"a\" or \"u\" sound with a light catch", fr: "« a » ou « ou » bref, avec un léger coup de glotte" },
  "إ": { name: "Alif with hamza below", en: "short \"i\" at the start of a word", fr: "« i » bref en début de mot" },
  "آ": { name: "Alif madda", en: "long \"aa\"", fr: "« â » long" },
  "ب": { name: "Ba", en: "\"b\" as in \"boy\"", fr: "« b » comme dans « bon »" },
  "ت": { name: "Ta", en: "\"t\" as in \"tea\"", fr: "« t » comme dans « table »" },
  "ث": { name: "Tha", en: "\"th\" as in \"think\"", fr: "« th » anglais de « think »" },
  "ج": { name: "Jim", en: "\"j\" as in \"jam\"", fr: "« dj » comme dans « djinn »" },
  "ح": { name: "Ha", en: "a breathy \"h\" from the throat", fr: "« h » soufflé du fond de la gorge" },
  "خ": { name: "Kha", en: "\"kh\" as in Scottish \"loch\"", fr: "« kh » proche de la jota espagnole" },
  "د": { name: "Dal", en: "\"d\" as in \"day\"", fr: "« d » comme dans « dos »" },
  "ذ": { name: "Dhal", en: "\"th\" as in \"this\"", fr: "« th » anglais de « this »" },
  "ر": { name: "Ra", en: "a rolled \"r\"", fr: "« r » roulé" },
  "ز": { name: "Zay", en: "\"z\" as in \"zoo\"", fr: "« z » comme dans « zoo »" },
  "س": { name: "Sin", en: "\"s\" as in \"sun\"", fr: "« s » comme dans « sel »" },
  "ش": { name: "Shin", en: "\"sh\" as in \"ship\"", fr: "« ch » comme dans « chat »" },
  "ص": { name: "Sad", en: "a heavy \"s\"", fr: "« s » emphatique" },
  "ض": { name: "Dad", en: "a heavy \"d\"", fr: "« d » emphatique" },
  "ط": { name: "Ta (heavy)", en: "a heavy \"t\"", fr: "« t » emphatique" },
  "ظ": { name: "Za (heavy)", en: "a heavy \"th\" as in \"this\"", fr: "« dh » emphatique" },
  "ع": { name: "Ayn", en: "a deep throat sound with no English equivalent", fr: "son guttural profond, sans équivalent en français" },
  "غ": { name: "Ghayn", en: "a gargled \"gh\", like a French \"r\"", fr: "« gh » proche du « r » français" },
  "ف": { name: "Fa", en: "\"f\" as in \"fun\"", fr: "« f » comme dans « feu »" },
  "ق": { name: "Qaf", en: "a \"k\" made further back in the throat", fr: "« q » prononcé au fond de la gorge" },
  "ك": { name: "Kaf", en: "\"k\" as in \"kite\"", fr: "« k » comme dans « kilo »" },
  "ل": { name: "Lam", en: "\"l\" as in \"love\"", fr: "« l » comme dans « lune »" },
  "م": { name: "Mim", en: "\"m\" as in \"moon\"", fr: "« m » comme dans « mer »" },
  "ن": { name: "Nun", en: "\"n\" as in \"night\"", fr: "« n » comme dans « nuit »" },
  "ه": { name: "Ha", en: "\"h\" as in \"hat\"", fr: "« h » aspiré" },
  "ة": { name: "Ta marbuta", en: "a soft \"a\" or \"ah\" at the end of a word", fr: "« a » final adouci" },
  "و": { name: "Waw", en: "\"w\", or a long \"oo\"", fr: "« w », ou « ou » long" },
  "ؤ": { name: "Waw with hamza", en: "a glottal catch carried on waw", fr: "coup de glotte porté par le waw" },
  "ي": { name: "Ya", en: "\"y\", or a long \"ee\"", fr: "« y », ou « i » long" },
  "ى": { name: "Alif maqsura", en: "long \"a\" at the end of a word", fr: "« a » long en fin de mot" },
  "ئ": { name: "Ya with hamza", en: "a glottal catch carried on ya", fr: "coup de glotte porté par le ya" },
  "ء": { name: "Hamza", en: "a glottal stop, as in \"uh-oh\"", fr: "coup de glotte, comme une courte pause" },
};

// Letters that never join to the letter after them.
const NON_JOINING = new Set(["ا", "أ", "إ", "آ", "د", "ذ", "ر", "ز", "و", "ؤ", "ة", "ى", "ء"]);

export type LetterPart = { char: string; name: string; sound: string; joinsNext: boolean };

export function spellArabic(text: string, locale: "en" | "fr"): LetterPart[] {
  return Array.from(text)
    .filter((char) => LETTERS[char])
    .map((char) => ({
      char,
      name: LETTERS[char].name,
      sound: LETTERS[char][locale],
      joinsNext: !NON_JOINING.has(char),
    }));
}
