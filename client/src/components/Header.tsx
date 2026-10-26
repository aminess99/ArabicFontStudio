import { Search, Type } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./ThemeToggle";
import { Slider } from "@/components/ui/slider";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  previewText: string;
  onPreviewTextChange: (value: string) => void;
  fontSize: number;
  onFontSizeChange: (value: number) => void;
}

export function Header({ searchQuery, onSearchChange, previewText, onPreviewTextChange, fontSize, onFontSizeChange }: HeaderProps) {
  const [location] = useLocation();
  const englishPath = location === "/" ? "/en" : `/en${location}`;
  const frenchPath = location === "/" ? "/fr" : `/fr${location}`;
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="border-b">
        <div className="container mx-auto px-3 md:px-4 py-2 md:py-3">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity shrink-0" data-testid="link-home">
              <img 
                src="/logo.png" 
                alt="xfontat - إكس فونتات" 
                className="h-8 md:h-10 w-auto"
              />
            </Link>

            <nav className="hidden md:flex items-center gap-4 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-nav-home">
                الرئيسية
              </Link>
              <Link href="/design-fonts" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-nav-design">
                خطوط التصميم
              </Link>
              <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-nav-blog">
                المدونة
              </Link>
              <Link href="/arabic-text-to-image" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-nav-text-to-image">
                اكتب اسمك بالخط
              </Link>
              <Link href="/zakhrafa" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-nav-zakhrafa">
                زخرفة
              </Link>
            </nav>

            <div className="relative flex-1 max-w-xs md:max-w-md">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground shrink-0" aria-hidden="true" />
              <label htmlFor="header-font-search" className="sr-only">البحث عن خط</label>
              <Input
                id="header-font-search"
                type="search"
                placeholder="ابحث عن خط..."
                className="pr-10 text-sm md:text-base"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                data-testid="input-search"
              />
            </div>

            <div className="flex shrink-0 gap-1">
              <a
                href={englishPath}
                hrefLang="en"
                className="rounded-md border px-2 py-2 text-xs md:text-sm hover:bg-muted"
                data-testid="link-language-english"
              >
                EN
              </a>
              <a
                href={frenchPath}
                hrefLang="fr"
                className="rounded-md border px-2 py-2 text-xs md:text-sm hover:bg-muted"
                data-testid="link-language-french"
              >
                FR
              </a>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="bg-muted/30">
        <div className="container mx-auto px-3 md:px-4 py-2 md:py-3">
          <div className="space-y-3 md:space-y-0 md:flex md:items-center md:gap-3">
            <div className="flex-1 min-w-0 md:min-w-[200px]">
              <label htmlFor="header-preview-text" className="sr-only">نص معاينة الخطوط</label>
              <Input
                id="header-preview-text"
                type="text"
                placeholder="نص المعاينة..."
                value={previewText}
                onChange={(e) => onPreviewTextChange(e.target.value)}
                data-testid="input-preview-text"
                className="bg-background text-sm md:text-base"
              />
            </div>

            <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
              <Type className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
              <div className="flex-1 md:w-32">
                <Slider
                  value={[fontSize]}
                  onValueChange={(value) => onFontSizeChange(value[0])}
                  min={16}
                  max={72}
                  step={2}
                  aria-label={`حجم خط المعاينة: ${fontSize} بكسل`}
                  data-testid="slider-font-size-header"
                />
              </div>
              <span className="text-xs md:text-sm text-muted-foreground shrink-0 min-w-[2.5rem]">{fontSize}px</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
