import { Search, Type } from "lucide-react";
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
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <span className="text-xl font-bold">خ</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">مكتبة الخطوط</h1>
                <p className="text-xs text-muted-foreground">Arabic Fonts Library</p>
              </div>
            </div>

            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="ابحث عن خط..."
                className="pr-10"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                data-testid="input-search"
              />
            </div>

            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="bg-muted/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Input
                type="text"
                placeholder="اكتب نصك هنا للمعاينة..."
                value={previewText}
                onChange={(e) => onPreviewTextChange(e.target.value)}
                data-testid="input-preview-text"
                className="bg-background"
              />
            </div>

            <div className="flex items-center gap-2">
              <Type className="h-4 w-4 text-muted-foreground" />
              <div className="w-32">
                <Slider
                  value={[fontSize]}
                  onValueChange={(value) => onFontSizeChange(value[0])}
                  min={16}
                  max={72}
                  step={2}
                  data-testid="slider-font-size-header"
                />
              </div>
              <span className="text-sm text-muted-foreground min-w-[3rem]">{fontSize}px</span>
            </div>

            <Select defaultValue="10">
              <SelectTrigger className="w-20 bg-background">
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
