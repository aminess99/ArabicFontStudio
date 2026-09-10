import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Clipboard,
  Download,
  ImagePlus,
  LoaderCircle,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { SEOHead } from "@/components/SEOHead";

const styles = [
  {
    id: "mrbeast",
    label: "MrBeast Style",
    description: "وجه ضخم، تعبير مبالغ فيه، ألوان قوية، وعنصر كبير",
  },
  {
    id: "pewdiepie",
    label: "PewDiePie Style",
    description: "شخصية وخلفية بسيطة وتعبير كوميدي ونص قصير",
  },
  {
    id: "ksi",
    label: "KSI Style",
    description: "ألوان قوية وقصّات حادة وعناصر رياضية أو ترفيهية",
  },
  {
    id: "logan-paul",
    label: "Logan Paul Style",
    description: "صورة شخصية واضحة وخلفية مذهلة وعنصر يثير الفضول",
  },
  {
    id: "sidemen",
    label: "Sidemen Style",
    description: "عدة أشخاص وتعبيرات مختلفة وتكوين مزدحم منظم",
  },
  {
    id: "ali-abdaal",
    label: "Ali Abdaal Style",
    description: "تصميم نظيف جداً وشخصية واحدة ونص واضح",
  },
  {
    id: "casey-neistat",
    label: "Casey Neistat Style",
    description: "لقطة سينمائية واقعية وحركة وإحساس بالمغامرة",
  },
  {
    id: "ryan-trahan",
    label: "Ryan Trahan Style",
    description: "لقطة عفوية وموقف غريب أو مضحك وألوان طبيعية",
  },
  {
    id: "airrack",
    label: "Airrack Style",
    description: "مشهد ضخم جداً وشخص صغير نسبياً وتحدٍ واضح",
  },
  {
    id: "ishowspeed",
    label: "IShowSpeed Style",
    description: "تعبير شديد وZoom على الوجه وعناصر غريبة",
  },
] as const;

const youtubeThumbnailDescription =
  "منشئ صور مصغرة لليوتيوب بالذكاء الاصطناعي باللغة العربية. حوّل فكرة الفيديو إلى Thumbnail احترافي بمقاس 1280×720 مع عنوان عربي واضح وتصميم مناسب لرفع نسبة النقر.";

const youtubeThumbnailSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "منشئ الصور المصغرة لليوتيوب",
      alternateName: "AI YouTube Thumbnail Maker",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web",
      url: "https://xfontat.com/youtube-thumbnail-maker",
      description: youtubeThumbnailDescription,
      inLanguage: "ar",
      featureList: [
        "إنشاء صور مصغرة لليوتيوب بمقاس 1280×720",
        "دعم النصوص العربية واتجاه الكتابة من اليمين إلى اليسار",
        "رفع صورة شخصية أو منتج كعنصر رئيسي",
        "اختيار أسلوب بصري مناسب لمحتوى الفيديو",
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "كيف أصنع صورة مصغرة احترافية لليوتيوب؟",
          acceptedAnswer: {
            "@type": "Answer",
            text: "اكتب فكرة الفيديو أو عنوانه، اختر الأسلوب البصري، وأضف صورة الشخصية أو المنتج عند الحاجة، ثم أنشئ صورة مصغرة بمقاس 1280×720.",
          },
        },
        {
          "@type": "Question",
          name: "ما المقاس المناسب لصورة Thumbnail في يوتيوب؟",
          acceptedAnswer: {
            "@type": "Answer",
            text: "المقاس المستخدم هنا هو 1280×720 بنسبة 16:9، وهو مناسب لعرض الصور المصغرة على يوتيوب والأجهزة المختلفة.",
          },
        },
        {
          "@type": "Question",
          name: "هل يدعم منشئ الصور المصغرة الكتابة العربية؟",
          acceptedAnswer: {
            "@type": "Answer",
            text: "نعم، صُمم المنشئ لدعم العناوين العربية واتجاه الكتابة من اليمين إلى اليسار مع الحفاظ على النص الذي تدخله.",
          },
        },
      ],
    },
  ],
};

type StyleId = (typeof styles)[number]["id"];

type GenerationResult = {
  image: string;
  prompt: string;
  timings?: {
    promptMs: number;
    imageMs: number;
    totalMs: number;
  };
  style: {
    label: string;
    arabicLabel: string;
  };
};

function formatDuration(milliseconds: number): string {
  const seconds = Math.max(0, Math.round(milliseconds / 1000));
  if (seconds < 60) return `${seconds} ث`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes} د ${String(seconds % 60).padStart(2, "0")} ث`;
}

type WorkspacePreviewProps = {
  result: GenerationResult | null;
  isGenerating: boolean;
  elapsedMs: number;
  style: (typeof styles)[number];
  copied: boolean;
  onGenerate: () => void;
  onCopy: () => void;
};

function WorkspacePreview({
  result,
  isGenerating,
  elapsedMs,
  style,
  copied,
  onGenerate,
  onCopy,
}: WorkspacePreviewProps) {
  return (
    <div className="order-2 rounded-[26px] border border-white/[.09] bg-[#111918]/90 p-4 shadow-2xl shadow-black/20 backdrop-blur sm:p-6">
      <div className="mb-5 flex items-center justify-between border-b border-white/[.08] pb-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#65f2c0]/15 text-xs text-[#65f2c0]">
            2
          </span>
          مساحة النتيجة
        </div>
        <span className="font-mono text-[10px] text-[#566760]">
          WORKSPACE / 16:9
        </span>
      </div>

      {isGenerating ? (
        <div className="grid min-h-[420px] place-items-center rounded-3xl border border-white/[.08] bg-[#0b1110] text-[#8da198]">
          <div className="text-center">
            <LoaderCircle
              size={34}
              className="mx-auto mb-3 animate-spin text-[#65f2c0]"
            />
            <p className="text-sm">نولّد الصورة المصغرة الآن…</p>
            <p className="mt-2 font-mono text-[11px] text-[#65f2c0]">
              الوقت المنقضي: {formatDuration(elapsedMs)}
            </p>
          </div>
        </div>
      ) : result ? (
        <div className="grid gap-4 xl:grid-cols-[1.18fr_.82fr]">
          <div className="relative aspect-video overflow-hidden rounded-3xl border border-white/[.1] bg-[#101615] shadow-2xl">
            <img
              src={result.image}
              alt={`صورة مصغرة بأسلوب ${result.style.arabicLabel}`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="rounded-3xl border border-white/[.08] bg-[#0b1110] p-4">
            {result.timings && (
              <div className="mb-4 grid grid-cols-3 gap-2 rounded-2xl border border-[#65f2c0]/15 bg-[#65f2c0]/[.05] p-3 text-center">
                <div>
                  <p className="font-mono text-sm text-[#65f2c0]">
                    {formatDuration(result.timings.promptMs)}
                  </p>
                  <p className="mt-1 text-[10px] text-[#81948a]">prompt</p>
                </div>
                <div>
                  <p className="font-mono text-sm text-[#65f2c0]">
                    {formatDuration(result.timings.imageMs)}
                  </p>
                  <p className="mt-1 text-[10px] text-[#81948a]">الصورة</p>
                </div>
                <div>
                  <p className="font-mono text-sm text-[#65f2c0]">
                    {formatDuration(result.timings.totalMs)}
                  </p>
                  <p className="mt-1 text-[10px] text-[#81948a]">الإجمالي</p>
                </div>
              </div>
            )}
            <p className="text-xs uppercase tracking-[.15em] text-[#65f2c0]">
              جاهزة للنشر
            </p>
            <p className="mt-3 line-clamp-6 whitespace-pre-wrap text-xs leading-6 text-[#9aaca3]">
              {result.prompt}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <a
                href={result.image}
                download="xfontat-youtube-thumbnail.png"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#65f2c0] px-3 py-3 text-xs font-semibold text-[#07100d] transition hover:bg-[#7af6cb]"
              >
                <Download size={14} />
                تحميل الصورة
              </a>
              <button
                type="button"
                onClick={onGenerate}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-3 text-xs text-[#d5e1da] transition hover:border-[#65f2c0]/40"
              >
                <RotateCcw size={14} />
                إعادة التوليد
              </button>
            </div>
            <button
              type="button"
              onClick={onCopy}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-3 text-xs text-[#aebfb6] transition hover:border-white/20"
            >
              {copied ? <Check size={14} /> : <Clipboard size={14} />}
              {copied ? "تم نسخ prompt" : "نسخ prompt"}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid min-h-[420px] place-items-center rounded-3xl border border-dashed border-white/[.12] bg-[#0b1110] p-8 text-center">
          <div>
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#65f2c0]/10 text-[#65f2c0]">
              <Sparkles size={27} />
            </div>
            <h2 className="mt-5 text-xl font-medium text-[#e9f5ee]">
              صورتك المصغرة ستظهر هنا
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#81948a]">
              اكتب فكرة الفيديو، اختر الأسلوب، ثم اضغط إنشاء لتحصل على Thumbnail
              جاهز لليوتيوب.
            </p>
            <p className="mt-4 text-[11px] text-[#64766d]">
              الأسلوب الحالي: {style.label}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2 text-[10px] text-[#71837a]">
              <span className="rounded-full border border-white/[.08] px-3 py-2">
                1280×720
              </span>
              <span className="rounded-full border border-white/[.08] px-3 py-2">
                16:9
              </span>
              <span className="rounded-full border border-white/[.08] px-3 py-2">
                عربي RTL
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function createPreviewPrompt(idea: string, style: (typeof styles)[number]) {
  return [
    "إنشاء صورة مصغرة احترافية لليوتيوب بمقاس 1280×720.",
    `فكرة الفيديو: ${idea || "اكتب فكرة الفيديو هنا"}`,
    `الأسلوب: ${style.label} — ${style.description}.`,
    `لقطة بصرية واحدة واضحة، موضوع رئيسي قوي، إضاءة سينمائية، وتباين عالٍ. اكتب هذا العنوان العربي داخل الصورة بخط كبير وواضح: «${idea || "اكتب فكرة الفيديو هنا"}»`,
    "استخدم قواعد تغليف صور صناع المحتوى كمرجع عام فقط، بدون نسخ وجه المشهور أو شعاره أو هويته أو تكوين صورته حرفياً.",
    "لا تضف أي كلمات أو شعارات أو علامات مائية أخرى. يجب أن يكون العنوان العربي هو النص الوحيد داخل الصورة.",
  ].join("\n");
}

export default function YouTubeThumbnailStudio() {
  const [idea, setIdea] = useState("كيف تختار الخط العربي المناسب؟");
  const [selectedStyle, setSelectedStyle] = useState<StyleId>("mrbeast");
  const [stylesOpen, setStylesOpen] = useState(false);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [heroImageName, setHeroImageName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [copied, setCopied] = useState(false);

  const style = styles.find((item) => item.id === selectedStyle) ?? styles[0];
  const previewPrompt = useMemo(
    () => createPreviewPrompt(idea, style),
    [idea, style],
  );

  useEffect(() => {
    if (!isGenerating) return;

    const startedAt = performance.now();
    setElapsedMs(0);
    const timer = window.setInterval(() => {
      setElapsedMs(performance.now() - startedAt);
    }, 250);

    return () => window.clearInterval(timer);
  }, [isGenerating]);

  async function generateThumbnail() {
    setIsGenerating(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/thumbnail/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, style: selectedStyle, heroImage }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "تعذر إنشاء الصورة.");
      }

      setResult(data);
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : "تعذر إنشاء الصورة الآن.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function handleHeroImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setError("اختر صورة بصيغة PNG أو JPG أو WebP.");
      return;
    }

    if (file.size > 6 * 1024 * 1024) {
      setError("حجم صورة البطل كبير. اختر صورة أصغر من 6MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setHeroImage(reader.result);
        setHeroImageName(file.name);
        setError("");
      }
    };
    reader.onerror = () => setError("تعذر قراءة الصورة. جرّب صورة أخرى.");
    reader.readAsDataURL(file);
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(result?.prompt ?? previewPrompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <>
      <SEOHead
        title="منشئ الصور المصغرة لليوتيوب بالذكاء الاصطناعي | xfontat"
        description={youtubeThumbnailDescription}
        path="/youtube-thumbnail-maker"
        schema={youtubeThumbnailSchema}
      />
      <main
        dir="rtl"
        className="min-h-screen overflow-hidden bg-[#070b0b] text-[#eef6f0]"
      >
      <div className="pointer-events-none fixed inset-0 opacity-30 [background-image:linear-gradient(rgba(132,255,211,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(132,255,211,.05)_1px,transparent_1px)] [background-size:44px_44px]" />
      <header className="relative z-10 mx-auto flex max-w-[1240px] items-center justify-between border-b border-white/[.07] px-5 py-5 sm:px-9">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#65f2c0] text-[#08100e]">
            <Sparkles size={17} />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight">
              xfontat<span className="text-[#65f2c0]">.</span>
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#6f8179]">
              thumbnail studio
            </p>
          </div>
        </div>
        <span className="rounded-full border border-[#65f2c0]/20 bg-[#65f2c0]/[.06] px-3 py-2 text-[10px] text-[#65f2c0]">
          مساحة العمل
        </span>
      </header>

      <section className="relative z-10 mx-auto grid max-w-[1240px] gap-8 px-5 pb-14 pt-8 sm:px-9 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start lg:pt-10">
        <WorkspacePreview
          result={result}
          isGenerating={isGenerating}
          elapsedMs={elapsedMs}
          style={style}
          copied={copied}
          onGenerate={generateThumbnail}
          onCopy={copyPrompt}
        />

        <div className="order-1 rounded-[26px] border border-white/[.09] bg-[#111918]/90 p-4 shadow-2xl shadow-black/20 backdrop-blur sm:p-6">
          <div className="mb-5 flex items-center justify-between border-b border-white/[.08] pb-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#65f2c0]/15 text-xs text-[#65f2c0]">
                1
              </span>
              ابدأ من فكرة الفيديو
            </div>
            <span className="font-mono text-[10px] text-[#566760]">
              THUMBNAIL / 16:9
            </span>
          </div>

          <label htmlFor="thumbnail-idea" className="mb-2 block text-[11px] font-medium uppercase tracking-[.14em] text-[#82958c]">
            ماذا سيشاهد الجمهور؟
          </label>
          <textarea
            id="thumbnail-idea"
            value={idea}
            onChange={(event) => setIdea(event.target.value)}
            dir="rtl"
            className="h-28 w-full resize-none rounded-2xl border border-white/10 bg-[#0a100f] p-4 text-lg leading-8 text-[#f0f7f2] outline-none transition focus:border-[#65f2c0]/60"
            placeholder="مثال: جربت أرخص ميكروفون لمدة 30 يوماً"
          />

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">أضف الشخصية أو المنتج</p>
                <p className="mt-1 text-xs text-[#71837a]">
                  صورة شخص أو منتج تريد أن يظهر كعنصر رئيسي
                </p>
              </div>
              <span className="rounded-full border border-white/[.08] px-2.5 py-1 text-[10px] text-[#71837a]">
                اختياري
              </span>
            </div>

            <input
              id="hero-image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleHeroImage}
              className="sr-only"
            />
            {heroImage ? (
              <div className="flex items-center gap-3 rounded-2xl border border-[#65f2c0]/30 bg-[#65f2c0]/[.06] p-3">
                <img
                  src={heroImage}
                  alt="معاينة بطل الصورة"
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-[#eafff4]">
                    {heroImageName}
                  </p>
                  <p className="mt-1 text-[11px] text-[#81948a]">
                    سيستخدمها الذكاء الاصطناعي كبطل للمشهد
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="حذف صورة البطل"
                  onClick={() => {
                    setHeroImage(null);
                    setHeroImageName("");
                  }}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#81948a] transition hover:bg-white/[.08] hover:text-white"
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <label
                htmlFor="hero-image"
                className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-white/[.14] bg-[#0b1110] p-4 transition hover:border-[#65f2c0]/50 hover:bg-[#65f2c0]/[.04]"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[.06] text-[#65f2c0]">
                  <ImagePlus size={19} />
                </span>
                <span>
                  <span className="block text-sm text-[#d9e8df]">
                    ارفع صورة البطل
                  </span>
                  <span className="mt-1 block text-[11px] text-[#71837a]">
                    PNG أو JPG أو WebP — حتى 6MB
                  </span>
                </span>
              </label>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">اختر أسلوب الصورة</p>
              <p className="mt-1 text-xs text-[#71837a]">
                10 ستايلات مستوحاة من تغليف صور صناع المحتوى
              </p>
            </div>
            <span className="rounded-full bg-white/[.05] px-2.5 py-1 font-mono text-[10px] text-[#8ea59a]">
              {styles.length} styles
            </span>
          </div>

          <div className="relative mt-4">
            <button
              type="button"
              aria-expanded={stylesOpen}
              aria-haspopup="listbox"
              onClick={() => setStylesOpen((open) => !open)}
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-right transition ${
                stylesOpen
                  ? "border-[#65f2c0]/70 bg-[#65f2c0]/10"
                  : "border-white/[.1] bg-[#0b1110] hover:border-white/20"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#65f2c0]/15 text-xs font-bold text-[#65f2c0]">
                  {styles.findIndex((item) => item.id === selectedStyle) + 1}
                </span>
                <span>
                  <span className="block text-sm font-medium text-[#eafff4]">
                    {style.label}
                  </span>
                  <span className="mt-1 block text-[11px] text-[#81948a]">
                    {style.description}
                  </span>
                </span>
              </span>
              <ChevronDown
                size={18}
                className={`text-[#65f2c0] transition ${
                  stylesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {stylesOpen && (
              <div
                role="listbox"
                aria-label="اختيار ستايل المشاهير"
                className="absolute inset-x-0 top-[calc(100%+8px)] z-20 max-h-[340px] overflow-y-auto rounded-2xl border border-white/[.12] bg-[#111918] p-2 shadow-2xl shadow-black/50"
              >
                <p className="px-3 py-2 text-[10px] uppercase tracking-[.14em] text-[#64766d]">
                  اختر أسلوب المشاهير
                </p>
                <div className="grid gap-1 sm:grid-cols-2">
                  {styles.map((item) => {
                    const isSelected = selectedStyle === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setSelectedStyle(item.id);
                          setStylesOpen(false);
                        }}
                        className={`rounded-xl p-3 text-right transition ${
                          isSelected
                            ? "bg-[#65f2c0]/10 text-[#eafff4]"
                            : "text-[#81948a] hover:bg-white/[.05] hover:text-[#eafff4]"
                        }`}
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium">{item.label}</span>
                          {isSelected && (
                            <Check
                              size={14}
                              className="shrink-0 text-[#65f2c0]"
                            />
                          )}
                        </span>
                        <span className="mt-1 block text-[10px] leading-5 opacity-70">
                          {item.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <p className="mt-3 text-[11px] leading-5 text-[#64766d]">
            هذه مراجع بصرية عامة وليست نسخاً لوجوه المشاهير أو شعاراتهم؛ سيتم
            بناء تكوين أصلي لكل فكرة.
          </p>

          <details className="group mt-5 rounded-2xl border border-white/[.08] bg-[#0b1110]">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-xs text-[#a2b3aa]">
              <span>شاهد الـ prompt الاحترافي قبل التوليد</span>
              <span className="text-[#65f2c0] transition group-open:rotate-180">⌄</span>
            </summary>
            <div className="border-t border-white/[.08] p-3">
              <p className="whitespace-pre-wrap rounded-xl bg-black/20 p-3 text-xs leading-6 text-[#8da198]">
                {previewPrompt}
              </p>
            </div>
          </details>

          {error && (
            <div className="mt-4 rounded-xl border border-red-300/20 bg-red-400/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={generateThumbnail}
            disabled={isGenerating || idea.trim().length < 4}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#65f2c0] py-4 text-sm font-semibold text-[#07100d] transition hover:-translate-y-0.5 hover:bg-[#7af6cb] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <LoaderCircle size={17} className="animate-spin" />
                نكتب الـ prompt ونبني المشهد… {formatDuration(elapsedMs)}
              </>
            ) : (
              <>
                <Sparkles size={17} />
                حوّل الفكرة وولّد الصورة
                <ArrowLeft size={16} />
              </>
            )}
          </button>
        </div>
      </section>

        <section
          aria-labelledby="youtube-thumbnail-seo-title"
          className="relative z-10 mx-auto max-w-[1240px] px-5 pb-20 sm:px-9"
        >
          <div className="rounded-[28px] border border-white/[.08] bg-[#0d1513]/90 p-6 sm:p-9">
            <p className="mb-3 text-[10px] uppercase tracking-[.2em] text-[#65f2c0]">
              YouTube Thumbnail Maker بالعربي
            </p>
            <h2
              id="youtube-thumbnail-seo-title"
              className="max-w-3xl text-2xl font-semibold leading-[1.4] tracking-tight sm:text-3xl"
            >
              منشئ الصور المصغرة لليوتيوب بالذكاء الاصطناعي
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-[#9aaca3]">
              أنشئ صورة مصغّرة احترافية لليوتيوب من فكرة بسيطة. يساعدك xfontat
              على تحويل عنوان الفيديو إلى تصميم Thumbnail واضح وجذاب بمقاس
              1280×720، مع دعم العناوين العربية، الألوان المتباينة، وترتيب
              بصري يجعل موضوع الفيديو مفهوماً من النظرة الأولى.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <article className="rounded-2xl border border-white/[.07] bg-black/15 p-5">
                <h3 className="text-sm font-medium text-[#e9f5ee]">
                  صورة مصغرة واضحة وقابلة للنقر
                </h3>
                <p className="mt-2 text-xs leading-7 text-[#81948a]">
                  تكوين بسيط، عنصر رئيسي واضح، وتباين قوي يساعد المشاهد على
                  فهم موضوع الفيديو بسرعة من نتائج البحث والاقتراحات.
                </p>
              </article>
              <article className="rounded-2xl border border-white/[.07] bg-black/15 p-5">
                <h3 className="text-sm font-medium text-[#e9f5ee]">
                  دعم كامل للخط العربي
                </h3>
                <p className="mt-2 text-xs leading-7 text-[#81948a]">
                  أضف عنوان الفيديو بالعربية، وسيحافظ التصميم على اتجاه النص
                  من اليمين إلى اليسار مع إبقائه مقروءاً على الهاتف.
                </p>
              </article>
              <article className="rounded-2xl border border-white/[.07] bg-black/15 p-5">
                <h3 className="text-sm font-medium text-[#e9f5ee]">
                  تصميم مرتبط بفكرة الفيديو
                </h3>
                <p className="mt-2 text-xs leading-7 text-[#81948a]">
                  لا يضيف كلمات عشوائية أو شعارات مضللة؛ بل يربط المشهد بعنوان
                  الفيديو ليساعد على تحسين الصلة ورفع فرصة النقر.
                </p>
              </article>
            </div>

            <div className="mt-9 grid gap-8 border-t border-white/[.08] pt-8 lg:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-[#e9f5ee]">
                  كيف تنشئ Thumbnail مناسبة لفيديو يوتيوب؟
                </h3>
                <ol className="mt-4 space-y-3 text-sm leading-7 text-[#9aaca3]">
                  <li>
                    <span className="ml-2 font-mono text-[#65f2c0]">01</span>
                    اكتب فكرة الفيديو أو عنوانه الأساسي بوضوح.
                  </li>
                  <li>
                    <span className="ml-2 font-mono text-[#65f2c0]">02</span>
                    أضف صورة الشخصية أو المنتج إذا كان جزءاً مهماً من المحتوى.
                  </li>
                  <li>
                    <span className="ml-2 font-mono text-[#65f2c0]">03</span>
                    اختر أسلوباً مناسباً لمجال القناة والجمهور المستهدف.
                  </li>
                  <li>
                    <span className="ml-2 font-mono text-[#65f2c0]">04</span>
                    راجع الصورة وتأكد من وضوحها قبل استخدامها على يوتيوب.
                  </li>
                </ol>
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#e9f5ee]">
                  هل الصورة المصغرة تحسن SEO لليوتيوب؟
                </h3>
                <p className="mt-4 text-sm leading-8 text-[#9aaca3]">
                  الصورة المصغرة لا تستبدل عنوان الفيديو أو وصفه أو الكلمات
                  المفتاحية، لكنها تساعد على تحسين الصلة البصرية ورفع نسبة
                  النقر عندما تعكس محتوى الفيديو بصدق. لذلك يجمع هذا المنشئ
                  بين عنوان عربي واضح ومشهد مرتبط بفكرة الفيديو، بدلاً من
                  استخدام Clickbait مضلل.
                </p>
              </div>
            </div>

            <div className="mt-9 border-t border-white/[.08] pt-8">
              <h3 className="text-lg font-medium text-[#e9f5ee]">
                أسئلة شائعة عن صور YouTube المصغرة
              </h3>
              <div className="mt-4 grid gap-3">
                <details className="rounded-2xl border border-white/[.07] bg-black/15 p-4">
                  <summary className="cursor-pointer text-sm text-[#dcebe2]">
                    كيف أصنع صورة مصغرة احترافية لليوتيوب؟
                  </summary>
                  <p className="mt-3 text-xs leading-7 text-[#81948a]">
                    اكتب فكرة الفيديو، اختر الأسلوب البصري، وأضف صورة الشخصية
                    أو المنتج عند الحاجة، ثم أنشئ الصورة بمقاس 1280×720.
                  </p>
                </details>
                <details className="rounded-2xl border border-white/[.07] bg-black/15 p-4">
                  <summary className="cursor-pointer text-sm text-[#dcebe2]">
                    ما المقاس المناسب لصورة Thumbnail في يوتيوب؟
                  </summary>
                  <p className="mt-3 text-xs leading-7 text-[#81948a]">
                    المقاس المناسب هنا هو 1280×720 بنسبة 16:9، ليظهر جيداً على
                    الهاتف والكمبيوتر وصفحات الاقتراحات.
                  </p>
                </details>
                <details className="rounded-2xl border border-white/[.07] bg-black/15 p-4">
                  <summary className="cursor-pointer text-sm text-[#dcebe2]">
                    هل يدعم المنشئ العناوين العربية؟
                  </summary>
                  <p className="mt-3 text-xs leading-7 text-[#81948a]">
                    نعم، يدعم النص العربي واتجاه الكتابة من اليمين إلى اليسار
                    ويحافظ على العنوان الذي تدخله داخل التصميم.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}