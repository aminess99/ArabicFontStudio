import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Heart } from "lucide-react";
import { generateFontFamily, loadFont } from "@/lib/fontLoader";
import { generateSlug } from "@/lib/slugify";
import type { InternationalHomeCopy } from "@/lib/internationalContent";
import type { Font } from "@shared/schema";

export interface LocalizedFontRowProps {
  font: Font;
  previewText: string;
  previewSize: number;
  variantCount?: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  copy: InternationalHomeCopy;
  locale: "en" | "fr";
}

export function LocalizedFontRow({
  font,
  previewText,
  previewSize,
  variantCount = 1,
  isFavorite,
  onToggleFavorite,
  copy,
  locale,
}: LocalizedFontRowProps) {
  const [fontLoaded, setFontLoaded] = useState(false);
  const fontFamily = generateFontFamily(font.name);

  useEffect(() => {
    let active = true;
    loadFont(fontFamily, font.fileUrl)
      .then(() => {
        if (active) setFontLoaded(true);
      })
      .catch(() => {
        if (active) setFontLoaded(false);
      });
    return () => {
      active = false;
    };
  }, [fontFamily, font.fileUrl]);

  const format = font.fileFormat || font.fileName.split(".").pop()?.toUpperCase();
  const detailsPath = `/${locale}/font/${generateSlug(font.name, font.fileName, font.category)}`;

  return (
    <article className="border-b py-5" data-testid={`international-font-${font.id}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold break-words">
              <Link href={detailsPath} className="hover:underline underline-offset-4">
                {font.name || font.nameArabic}
              </Link>
            </h2>
            {variantCount > 1 && (
              <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                {variantCount} {copy.variantCountLabel(variantCount)}
              </span>
            )}
          </div>
          {font.nameArabic && (
            <p className="mt-1 text-sm text-muted-foreground" lang="ar" dir="rtl">
              {font.nameArabic}
            </p>
          )}
          <Link href={detailsPath} className="mt-2 inline-block text-sm text-primary underline underline-offset-4">
            {copy.viewDetails}
          </Link>
          <p
            className="mt-3 break-words leading-relaxed"
            style={{
              fontFamily: fontLoaded ? fontFamily : "inherit",
              fontSize: `clamp(16px, 9vw, ${previewSize}px)`,
            }}
            lang="ar"
            dir="rtl"
          >
            {previewText}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {format && <span>{copy.formatLabel}: {format}</span>}
            <span>{copy.licenseLabel}: {font.license || copy.licenseUnknown}</span>
            {font.sourceUrl && (
              <a
                href={font.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                {copy.source}
              </a>
            )}
          </div>
        </div>
        <div className="flex w-full shrink-0 items-center gap-2 md:w-auto">
          <button
            type="button"
            onClick={onToggleFavorite}
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border ${isFavorite ? "text-rose-500" : "text-muted-foreground"}`}
            aria-label={isFavorite ? copy.favoriteRemove : copy.favoriteAdd}
            aria-pressed={isFavorite}
            data-testid={`international-favorite-${font.id}`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} aria-hidden="true" />
          </button>
          <Link
            href={detailsPath}
            className="inline-flex min-h-10 flex-1 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 md:flex-none"
            data-testid={`international-download-${font.id}`}
          >
            {copy.download}
          </Link>
        </div>
      </div>
    </article>
  );
}
