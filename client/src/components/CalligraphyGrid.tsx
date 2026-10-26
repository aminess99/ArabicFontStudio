import { useEffect, useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { CALLIGRAPHY_FONTS } from "@/lib/intlTools";

type CalligraphyFont = (typeof CALLIGRAPHY_FONTS)[number];

const faces = new Map<string, Promise<string>>();

function loadFace(font: CalligraphyFont): Promise<string> {
  const family = `xf-cal-${font.slug}`;
  if (!faces.has(family)) {
    const url = font.url.split("/").map((part) => encodeURIComponent(part)).join("/");
    faces.set(family, new FontFace(family, `url("${url}")`).load().then((face) => {
      document.fonts.add(face);
      return family;
    }));
  }
  return faces.get(family)!;
}

// Draws the text centred with padding.
function draw(canvas: HTMLCanvasElement, text: string, family: string, color: string, background: string | null) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const size = 120;
  const font = `${size}px "${family}"`;
  ctx.font = font;
  const width = Math.ceil(ctx.measureText(text).width);
  canvas.width = Math.max(320, width + size);
  canvas.height = Math.ceil(size * 2.1);
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.direction = "rtl";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

function FontTile({ font, text, fileName, labels }: {
  font: CalligraphyFont;
  text: string;
  fileName: string;
  labels: { download: string; loading: string };
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [family, setFamily] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadFace(font).then((loaded) => !cancelled && setFamily(loaded)).catch(() => !cancelled && setFailed(true));
    return () => { cancelled = true; };
  }, [font]);

  useEffect(() => {
    if (family && canvasRef.current) draw(canvasRef.current, text || " ", family, "#111111", "#ffffff");
  }, [family, text]);

  const download = () => {
    if (!family) return;
    const canvas = document.createElement("canvas");
    draw(canvas, text, family, "#000000", null);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${fileName}-${font.slug}.png`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    }, "image/png");
  };

  if (failed) return null;
  return (
    <figure className="overflow-hidden rounded-lg border bg-card">
      <div className="grid h-[150px] place-items-center bg-white p-2">
        {!family && <Loader2 className="h-6 w-6 animate-spin text-neutral-400" aria-label={labels.loading} />}
        <canvas ref={canvasRef} className={`h-auto max-h-[140px] w-full object-contain ${family ? "" : "hidden"}`} role="img" aria-label={`${text} — ${font.style}`} />
      </div>
      <figcaption className="flex items-center justify-between gap-2 border-t px-3 py-2 text-sm">
        <span className="min-w-0 truncate"><span className="font-medium">{font.style}</span> <span className="text-muted-foreground">· {font.slug.replace(/-/g, " ")}</span></span>
        <button type="button" onClick={download} disabled={!family} className="inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-muted disabled:opacity-50">
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          {labels.download}
        </button>
      </figcaption>
    </figure>
  );
}

export function CalligraphyGrid({ text, fileName, labels }: {
  text: string;
  fileName: string;
  labels: { download: string; loading: string };
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CALLIGRAPHY_FONTS.map((font) => (
        <FontTile key={font.slug} font={font} text={text} fileName={fileName} labels={labels} />
      ))}
    </div>
  );
}
