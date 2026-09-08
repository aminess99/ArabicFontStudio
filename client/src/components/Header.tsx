import { Search, Type, SlidersHorizontal } from "lucide-react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./ThemeToggle";
import { Slider } from "@/components/ui/slider";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  previewText?: string;
  onPreviewTextChange?: (value: string) => void;
  fontSize?: number;
  onFontSizeChange?: (value: number) => void;
}

export function Header({
  searchQuery,
  onSearchChange,
  previewText = "بسم الله الرحمن الرحيم",
  onPreviewTextChange = () => undefined,
  fontSize = 48,
  onFontSizeChange = () => undefined,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b editorial-rule bg-background/95 backdrop-blur-md">
      <div>
        <div className="container mx-auto px-4 md:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity shrink-0" data-testid="link-home">
              <img 
                src="/logo.png" 
                alt="xfontat - إكس فونتات" 
                className="h-7 md:h-9 w-auto"
              />
            </Link>

             <nav className="hidden lg:flex items-center gap-5 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-nav-home">
                الرئيسية
              </Link>
              <Link href="/design-fonts" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-nav-design">
                خطوط التصميم
              </Link>
              <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-nav-blog">
                المدونة
              </Link>
            </nav>

             <div className="relative flex-1 max-w-xs md:max-w-lg">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground shrink-0" />
              <Input
                type="search"
                placeholder="ابحث عن خط..."
                 className="pr-10 text-sm md:text-base rounded-none border-0 border-b border-foreground/20 bg-transparent focus-visible:ring-0 focus-visible:border-primary"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                data-testid="input-search"
              />
            </div>

             <div className="flex items-center gap-1">
               <span className="hidden sm:block editorial-kicker">TYPE LIBRARY</span>
               <ThemeToggle />
             </div>
          </div>
        </div>
      </div>

       <div className="bg-muted/45 border-t editorial-rule">
         <div className="container mx-auto px-4 md:px-8 py-3">
          <div className="space-y-3 md:space-y-0 md:flex md:items-center md:gap-3">
             <div className="hidden md:flex items-center gap-2 editorial-kicker shrink-0"><SlidersHorizontal className="h-3.5 w-3.5" /> معاينة</div>
            <div className="flex-1 min-w-0 md:min-w-[200px]">
              <Input
                type="text"
                placeholder="نص المعاينة..."
                value={previewText}
                onChange={(e) => onPreviewTextChange(e.target.value)}
                data-testid="input-preview-text"
                 className="bg-background/60 text-sm md:text-base rounded-sm border-foreground/15"
              />
            </div>

            <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
              <Type className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 md:w-32">
                <Slider
                  value={[fontSize]}
                  onValueChange={(value) => onFontSizeChange(value[0])}
                  min={16}
                  max={72}
                  step={2}
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
