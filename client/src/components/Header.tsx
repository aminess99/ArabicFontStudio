import { Search, Type } from "lucide-react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./ThemeToggle";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  previewText: string;
  onPreviewTextChange: (value: string) => void;
  fontSize: number;
  onFontSizeChange: (value: number) => void;
}

export function Header({ searchQuery, onSearchChange, previewText, onPreviewTextChange, fontSize, onFontSizeChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="border-b">
        <div className="container mx-auto px-3 md:px-4 py-2 md:py-3">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            <Link href="/" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity shrink-0" data-testid="link-home">
              <div className="flex h-9 md:h-10 w-9 md:w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <span className="text-lg md:text-xl font-bold">X</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-xl font-bold">xfontat</h1>
                <p className="text-xs text-muted-foreground">إكس فونتات</p>
              </div>
            </Link>

            <div className="relative flex-1 max-w-xs md:max-w-md">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground shrink-0" />
              <Input
                type="search"
                placeholder="ابحث..."
                className="pr-10 text-sm md:text-base"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                data-testid="input-search"
              />
            </div>

            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-3 md:px-4 py-2 md:py-3">
          <div className="space-y-3 md:space-y-0 md:flex md:items-center md:gap-3">
            <div className="flex-1 min-w-0 md:min-w-[200px]">
              <Input
                type="text"
                placeholder="نص المعاينة..."
                value={previewText}
                onChange={(e) => onPreviewTextChange(e.target.value)}
                data-testid="input-preview-text"
                className="bg-background text-sm md:text-base"
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

            <Select defaultValue="10">
              <SelectTrigger className="w-16 md:w-20 bg-background text-sm md:text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">الكل</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </header>
  );
}
