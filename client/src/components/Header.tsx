import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
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
    </header>
  );
}
