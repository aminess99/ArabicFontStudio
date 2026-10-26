import { useState } from "react";
import { Menu, Search, Type } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";

// Every prop is optional: pages that list fonts pass the search and preview
// controls; other pages get the same header, with search sending the visitor
// to the home page results and no preview bar.
interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  previewText?: string;
  onPreviewTextChange?: (value: string) => void;
  fontSize?: number;
  onFontSizeChange?: (value: number) => void;
}

const NAV_LINKS = [
  { href: "/", label: "الرئيسية", testId: "home" },
  { href: "/design-fonts", label: "خطوط التصميم", testId: "design" },
  { href: "/arabic-text-to-image", label: "اكتب اسمك بالخط", testId: "text-to-image" },
  { href: "/zakhrafa", label: "زخرفة", testId: "zakhrafa" },
  { href: "/blog", label: "المدونة", testId: "blog" },
];

function isActive(location: string, href: string) {
  return href === "/" ? location === "/" : location === href || location.startsWith(`${href}/`);
}

export function Header({ searchQuery, onSearchChange, previewText, onPreviewTextChange, fontSize = 48, onFontSizeChange }: HeaderProps) {
  const [location, navigate] = useLocation();
  const [localQuery, setLocalQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const englishPath = location === "/" ? "/en" : `/en${location}`;
  const frenchPath = location === "/" ? "/fr" : `/fr${location}`;
  const query = onSearchChange ? searchQuery ?? "" : localQuery;
  const showPreview = Boolean(onPreviewTextChange);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!onSearchChange && localQuery.trim()) navigate(`/?q=${encodeURIComponent(localQuery.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className={showPreview ? "border-b" : ""}>
        <div className="container mx-auto px-3 md:px-4 py-2 md:py-3">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="md:hidden grid h-10 w-10 shrink-0 place-items-center rounded-md hover:bg-muted"
                  aria-label="فتح القائمة"
                  data-testid="button-mobile-menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetTitle className="mb-6">القائمة</SheetTitle>
                <nav className="flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`rounded-md px-3 py-3 text-base hover:bg-muted ${isActive(location, link.href) ? "bg-muted font-semibold" : ""}`}
                      data-testid={`link-mobile-nav-${link.testId}`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="mt-4 flex gap-2 border-t pt-4">
                    <a href={englishPath} hrefLang="en" className="rounded-md border px-4 py-2 text-sm hover:bg-muted">English</a>
                    <a href={frenchPath} hrefLang="fr" className="rounded-md border px-4 py-2 text-sm hover:bg-muted">Français</a>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity shrink-0" data-testid="link-home">
              <img src="/logo.png" alt="xfontat - إكس فونتات" className="h-8 md:h-10 w-auto" />
            </Link>

            <nav className="hidden md:flex items-center gap-4 text-sm">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(location, link.href) ? "page" : undefined}
                  className={isActive(location, link.href) ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground transition-colors"}
                  data-testid={`link-nav-${link.testId}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <form role="search" onSubmit={submitSearch} className="relative flex-1 max-w-xs md:max-w-md">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground shrink-0" aria-hidden="true" />
              <label htmlFor="header-font-search" className="sr-only">البحث عن خط</label>
              <Input
                id="header-font-search"
                type="search"
                placeholder="ابحث عن خط..."
                className="h-10 pr-10 text-sm md:text-base"
                value={query}
                onChange={(e) => (onSearchChange ? onSearchChange(e.target.value) : setLocalQuery(e.target.value))}
                data-testid="input-search"
              />
            </form>

            <div className="hidden sm:flex shrink-0 gap-1">
              <a href={englishPath} hrefLang="en" className="grid h-10 min-w-10 place-items-center rounded-md border px-2 text-xs md:text-sm hover:bg-muted" data-testid="link-language-english">
                EN
              </a>
              <a href={frenchPath} hrefLang="fr" className="grid h-10 min-w-10 place-items-center rounded-md border px-2 text-xs md:text-sm hover:bg-muted" data-testid="link-language-french">
                FR
              </a>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="bg-muted/30">
          <div className="container mx-auto px-3 md:px-4 py-2 md:py-3">
            <div className="space-y-3 md:space-y-0 md:flex md:items-center md:gap-3">
              <div className="flex-1 min-w-0 md:min-w-[200px]">
                <label htmlFor="header-preview-text" className="sr-only">نص معاينة الخطوط</label>
                <Input
                  id="header-preview-text"
                  type="text"
                  placeholder="اكتب نصاً لمعاينته بكل الخطوط..."
                  value={previewText ?? ""}
                  onChange={(e) => onPreviewTextChange?.(e.target.value)}
                  data-testid="input-preview-text"
                  className="h-10 bg-background text-sm md:text-base"
                />
              </div>

              {onFontSizeChange && (
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
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
