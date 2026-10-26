import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Copy, Delete, Languages, Search, Trash2, Type } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { IntlShell, FaqList, SectionList } from "@/components/IntlShell";
import { CalligraphyGrid } from "@/components/CalligraphyGrid";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { findIntlTool, keyboardCopy, toolAlternates, toolPaths, type IntlLocale } from "@/lib/intlTools";
import { toolFaqSchema } from "@/lib/toolPages";

// Standard Arabic (101) layout, keyed by physical key: [normal, shifted].
const LAYOUT: Array<Array<[string, string, string]>> = [
  [["Backquote", "ذ", "ّ"], ["KeyQ", "ض", "َ"], ["KeyW", "ص", "ً"], ["KeyE", "ث", "ُ"], ["KeyR", "ق", "ٌ"], ["KeyT", "ف", "لإ"], ["KeyY", "غ", "إ"], ["KeyU", "ع", "‘"], ["KeyI", "ه", "÷"], ["KeyO", "خ", "×"], ["KeyP", "ح", "؛"], ["BracketLeft", "ج", "<"], ["BracketRight", "د", ">"]],
  [["KeyA", "ش", "ِ"], ["KeyS", "س", "ٍ"], ["KeyD", "ي", "]"], ["KeyF", "ب", "["], ["KeyG", "ل", "لأ"], ["KeyH", "ا", "أ"], ["KeyJ", "ت", "ـ"], ["KeyK", "ن", "،"], ["KeyL", "م", "/"], ["Semicolon", "ك", ":"], ["Quote", "ط", "\""]],
  [["KeyZ", "ئ", "~"], ["KeyX", "ء", "ْ"], ["KeyC", "ؤ", "}"], ["KeyV", "ر", "{"], ["KeyB", "لا", "لآ"], ["KeyN", "ى", "آ"], ["KeyM", "ة", "’"], ["Comma", "و", ","], ["Period", "ز", "."], ["Slash", "ظ", "؟"]],
];
const BY_CODE = new Map(LAYOUT.flat().map(([code, normal, shifted]) => [code, [normal, shifted] as const]));

const MARKS: Array<[string, string, string]> = [
  ["َ", "fatha", "فتحة"], ["ُ", "damma", "ضمة"], ["ِ", "kasra", "كسرة"], ["ْ", "sukun", "سكون"], ["ّ", "shadda", "شدة"],
  ["ً", "-an", "تنوين"], ["ٌ", "-un", "تنوين"], ["ٍ", "-in", "تنوين"],
];
const EXTRA = ["أ", "إ", "آ", "ؤ", "ئ", "ء", "ة", "ى", "؟", "،"];

// Phonetic typing, including the digits used in Arabizi chat (3 = ع, 7 = ح).
// Short "a" and "e" are not written inside a word, as in Arabic spelling;
// doubling them ("aa", "ee") gives the long vowel.
const PHONETIC: Record<string, string> = {
  b: "ب", t: "ت", j: "ج", h: "ه", x: "خ", d: "د", r: "ر", z: "ز", s: "س", f: "ف", q: "ق",
  k: "ك", l: "ل", m: "م", n: "ن", w: "و", y: "ي", i: "ي", u: "و", o: "و", g: "غ", p: "ب", v: "ف", c: "ك",
  S: "ص", D: "ض", T: "ط", Z: "ظ", H: "ح", A: "ع", E: "ع", Y: "ى",
  "2": "ء", "3": "ع", "5": "خ", "6": "ط", "7": "ح", "8": "ق", "9": "ص", "?": "؟", ",": "،", ";": "؛",
};
// Two-letter sounds: the letter before an "h" is replaced.
const DIGRAPHS: Record<string, string> = { "س": "ش", "ت": "ث", "ك": "خ", "د": "ذ" };
const PHONETIC_HINT: Array<[string, string]> = [
  ["sh", "ش"], ["kh", "خ"], ["th", "ث"], ["dh", "ذ"], ["3", "ع"], ["7", "ح"], ["2", "ء"], ["S", "ص"], ["D", "ض"], ["T", "ط"], ["Z", "ظ"], ["H", "ح"],
];
const SHORT_VOWELS: Record<string, string> = { a: "ا", e: "ي" };
const isWordStart = (before: string) => before === "" || /[\s\n.,،؟!?]$/.test(before);

type Mode = "layout" | "phonetic" | "off";

const UI: Record<IntlLocale, {
  placeholder: string; modes: Record<Mode, string>; modeLabel: string; shift: string; space: string; marks: string;
  copy: string; copied: string; clear: string; search: string; translate: string; generator: string; preview: string;
  previewHeading: string; download: string; loading: string; faq: string; related: string; chars: string; vowelNote: string;
}> = {
  ar: {
    placeholder: "اكتب هنا...", modeLabel: "طريقة الكتابة بلوحة مفاتيحك",
    modes: { layout: "ترتيب عربي", phonetic: "صوتي (بالحروف اللاتينية)", off: "بدون تحويل" },
    shift: "Shift", space: "مسافة", marks: "الحركات", copy: "نسخ", copied: "تم نسخ النص", clear: "مسح", search: "بحث جوجل",
    translate: "ترجمة", generator: "تحميل كصورة", preview: "عاين النص بالخطوط العربية", previewHeading: "النص بالخطوط العربية",
    download: "PNG", loading: "جارٍ التحميل", faq: "أسئلة شائعة", related: "أدوات أخرى", chars: "حرف",
    vowelNote: "اكتب aa للألف داخل الكلمة، وee أو i للياء.",
  },
  en: {
    placeholder: "Type here...", modeLabel: "Your keyboard types",
    modes: { layout: "Arabic layout", phonetic: "Phonetic (by sound)", off: "Normal letters" },
    shift: "Shift", space: "Space", marks: "Vowel marks", copy: "Copy", copied: "Text copied", clear: "Clear", search: "Google",
    translate: "Translate", generator: "Download as image", preview: "Preview in Arabic calligraphy", previewHeading: "Your text in Arabic calligraphy",
    download: "PNG", loading: "Loading", faq: "Frequently asked questions", related: "More Arabic tools", chars: "characters",
    vowelNote: "Short vowels are not written in Arabic: type aa for ا and ee or i for ي inside a word (salaam → سلام).",
  },
  fr: {
    placeholder: "Écrivez ici...", modeLabel: "Votre clavier tape",
    modes: { layout: "Disposition arabe", phonetic: "Phonétique (au son)", off: "Lettres normales" },
    shift: "Maj", space: "Espace", marks: "Voyelles", copy: "Copier", copied: "Texte copié", clear: "Effacer", search: "Google",
    translate: "Traduire", generator: "Télécharger en image", preview: "Prévisualiser en calligraphie arabe", previewHeading: "Votre texte en calligraphie arabe",
    download: "PNG", loading: "Chargement", faq: "Questions fréquentes", related: "Autres outils arabes", chars: "caractères",
    vowelNote: "Les voyelles brèves ne s'écrivent pas : tapez aa pour ا et ee ou i pour ي dans un mot (salaam → سلام).",
  },
};

function KeyboardTool({ locale }: { locale: IntlLocale }) {
  const ui = UI[locale];
  const { toast } = useToast();
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const [shift, setShift] = useState(false);
  const [mode, setMode] = useState<Mode>(locale === "ar" ? "layout" : "phonetic");
  const [showPreview, setShowPreview] = useState(false);
  const caret = useRef<number | null>(null);
  const lastKey = useRef("");

  // Restores the caret right after React writes the new value, before the next key.
  useLayoutEffect(() => {
    const area = areaRef.current;
    if (area && caret.current !== null) {
      area.focus();
      area.setSelectionRange(caret.current, caret.current);
      caret.current = null;
    }
  }, [text]);

  // Inserts at the caret, optionally replacing characters before it.
  const insert = (value: string, replaceBefore = 0) => {
    const area = areaRef.current;
    const current = area ? area.value : text;
    const start = area ? area.selectionStart - replaceBefore : current.length;
    const end = area ? area.selectionEnd : current.length;
    caret.current = start + value.length;
    setText(current.slice(0, start) + value + current.slice(end));
  };

  const backspace = () => {
    const area = areaRef.current;
    const current = area ? area.value : text;
    const start = area?.selectionStart ?? current.length;
    const end = area?.selectionEnd ?? current.length;
    if (start !== end) return insert("");
    if (start === 0) return;
    // Remove a whole character, including surrogate pairs.
    const before = Array.from(current.slice(0, start));
    before.pop();
    const head = before.join("");
    caret.current = head.length;
    setText(head + current.slice(end));
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (mode === "off" || event.ctrlKey || event.metaKey || event.altKey) return;
    if (mode === "layout") {
      const keys = BY_CODE.get(event.code);
      if (!keys) return;
      event.preventDefault();
      insert(keys[event.shiftKey ? 1 : 0]);
      return;
    }
    const area = event.currentTarget;
    const previousKey = lastKey.current;
    lastKey.current = event.key;
    const vowel = SHORT_VOWELS[event.key];
    if (vowel) {
      event.preventDefault();
      const before = area.value.slice(0, area.selectionStart);
      if (isWordStart(before)) insert(event.key === "a" ? "ا" : "إ");
      else if (previousKey === event.key) insert(vowel);
      lastKey.current = previousKey === event.key ? "" : event.key;
      return;
    }
    if (event.key === "h" && area.selectionStart === area.selectionEnd) {
      const previous = area.value[area.selectionStart - 1];
      if (DIGRAPHS[previous]) {
        event.preventDefault();
        insert(DIGRAPHS[previous], 1);
        return;
      }
    }
    const letter = PHONETIC[event.key];
    if (letter) {
      event.preventDefault();
      insert(letter);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: ui.copied });
    } catch {
      areaRef.current?.select();
    }
  };

  const generatorPath = toolPaths.generator[locale]!;
  // Buttons keep the caret in the text box.
  const keep = (event: React.MouseEvent) => event.preventDefault();
  const keyClass = "h-11 min-w-0 rounded-md border bg-card px-0 text-lg shadow-sm hover:bg-muted active:translate-y-px sm:text-xl";

  return (
    <div className="space-y-4">
      <textarea
        ref={areaRef}
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={onKeyDown}
        dir="rtl"
        lang="ar"
        rows={4}
        placeholder={ui.placeholder}
        className="w-full rounded-lg border bg-background p-4 text-2xl leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary"
        style={{ fontFamily: "'Noto Naskh Arabic', 'Cairo', serif" }}
        aria-label={ui.placeholder}
        data-testid="keyboard-text"
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" size="sm" onClick={copy} disabled={!text}><Copy className="me-1 h-4 w-4" />{ui.copy}</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => setText("")} disabled={!text}><Trash2 className="me-1 h-4 w-4" />{ui.clear}</Button>
        <Button type="button" size="sm" variant="outline" asChild disabled={!text}>
          <a href={`https://www.google.com/search?q=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer"><Search className="me-1 h-4 w-4" />{ui.search}</a>
        </Button>
        <Button type="button" size="sm" variant="outline" asChild>
          <a href={`https://translate.google.com/?sl=ar&tl=${locale === "ar" ? "en" : locale}&text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer"><Languages className="me-1 h-4 w-4" />{ui.translate}</a>
        </Button>
        <Button type="button" size="sm" variant="outline" asChild>
          <Link href={`${generatorPath}?text=${encodeURIComponent(text)}`}><Type className="me-1 h-4 w-4" />{ui.generator}</Link>
        </Button>
        <span className="ms-auto text-xs text-muted-foreground">{Array.from(text).length} {ui.chars}</span>
      </div>

      <fieldset className="flex flex-wrap items-center gap-2 text-sm">
        <legend className="sr-only">{ui.modeLabel}</legend>
        <span className="text-muted-foreground">{ui.modeLabel}:</span>
        {(Object.keys(ui.modes) as Mode[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMode(item)}
            aria-pressed={mode === item}
            className={`rounded-full border px-3 py-1 ${mode === item ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"}`}
          >
            {ui.modes[item]}
          </button>
        ))}
      </fieldset>
      {mode === "phonetic" && (
        <div className="space-y-1 text-xs text-muted-foreground">
          <ul className="flex flex-wrap gap-1.5">
            {PHONETIC_HINT.map(([latin, arabic]) => (
              <li key={latin} dir="ltr" className="rounded border px-1.5 py-0.5">
                <span className="font-mono">{latin}</span> = <span lang="ar" className="text-sm text-foreground">{arabic}</span>
              </li>
            ))}
          </ul>
          <p><bdi>{ui.vowelNote}</bdi></p>
        </div>
      )}

      <div className="-mx-2 rounded-xl border bg-muted/30 p-1 sm:mx-0 sm:p-3" dir="ltr" data-testid="keyboard-keys">
        <div className="space-y-1.5">
          {LAYOUT.map((row, index) => (
            <div key={index} className="grid gap-0.5 sm:gap-1.5" style={{ gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`, paddingInline: `${index * 2}%` }}>
              {row.map(([code, normal, shifted]) => (
                <button key={code} type="button" onMouseDown={keep} onClick={() => { insert(shift ? shifted : normal); setShift(false); }} className={keyClass} dir="rtl">
                  {shift ? shifted : normal}
                </button>
              ))}
            </div>
          ))}
          <div className="grid grid-cols-[1fr_3fr_1fr] gap-1 sm:gap-1.5">
            <button type="button" onMouseDown={keep} onClick={() => setShift((value) => !value)} aria-pressed={shift} className={`${keyClass} text-sm ${shift ? "bg-primary text-primary-foreground" : ""}`}>{ui.shift}</button>
            <button type="button" onMouseDown={keep} onClick={() => insert(" ")} className={`${keyClass} text-sm`}>{ui.space}</button>
            <button type="button" onMouseDown={keep} onClick={backspace} className={`${keyClass} grid place-items-center`} aria-label="Backspace"><Delete className="h-5 w-5" /></button>
          </div>
        </div>
        <p className="mt-3 mb-1 text-xs font-medium text-muted-foreground">{ui.marks}</p>
        <div className="grid grid-cols-6 gap-1 sm:grid-cols-9 lg:grid-cols-[repeat(18,minmax(0,1fr))]">
          {MARKS.map(([mark, name, arabicName]) => (
            <button key={name} type="button" onMouseDown={keep} onClick={() => insert(mark)} className={`${keyClass} flex flex-col items-center justify-center leading-none`} title={locale === "ar" ? arabicName : name}>
              <span>ـ{mark}</span>
              <span className="text-[9px] text-muted-foreground">{locale === "ar" ? arabicName : name}</span>
            </button>
          ))}
          {EXTRA.map((char) => (
            <button key={char} type="button" onMouseDown={keep} onClick={() => insert(char)} className={keyClass}>{char}</button>
          ))}
        </div>
      </div>

      <div>
        {!showPreview ? (
          <Button type="button" variant="secondary" onClick={() => setShowPreview(true)} disabled={!text.trim()}>{ui.preview}</Button>
        ) : (
          <section>
            <h2 className="mb-4 text-xl font-semibold">{ui.previewHeading}</h2>
            <CalligraphyGrid text={text.trim().slice(0, 60)} fileName="xfontat-arabic" labels={{ download: ui.download, loading: ui.loading }} />
          </section>
        )}
      </div>
    </div>
  );
}

export default function ArabicKeyboard() {
  const [location] = useLocation();
  const locale = findIntlTool(location)?.locale ?? "ar";
  const copy = keyboardCopy[locale];
  const ui = UI[locale];
  const alternates = toolAlternates(toolPaths.keyboard);
  const schema = useMemo(() => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: copy.heading,
        url: `https://xfontat.com${copy.path}`,
        description: copy.description,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        inLanguage: locale,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      toolFaqSchema(copy),
    ],
  }), [copy, locale]);

  const head = (
    <SEOHead
      title={copy.title}
      description={copy.description}
      path={copy.path}
      schema={schema}
      lang={locale}
      direction={locale === "ar" ? "rtl" : "ltr"}
      exactAlternates={alternates}
    />
  );
  const body = (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-3 text-3xl font-bold md:text-4xl">{copy.heading}</h1>
      <p className="mb-6 leading-relaxed text-muted-foreground">{copy.intro}</p>
      <KeyboardTool locale={locale} />
      <div className="mt-12 space-y-10">
        <SectionList sections={copy.sections} />
        <FaqList heading={ui.faq} faqs={copy.faqs} />
      </div>
    </div>
  );

  if (locale === "ar") {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        {head}
        <Header />
        <main className="container mx-auto flex-1 px-4 py-8 md:py-10">{body}</main>
        <Footer />
      </div>
    );
  }
  return (
    <IntlShell locale={locale} languages={toolPaths.keyboard}>
      {head}
      {body}
    </IntlShell>
  );
}
