import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function HeroSection({ searchQuery, onSearchChange }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            مكتبة الخطوط العربية الاحترافية
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            اكتشف، عاين، وحمّل أجمل الخطوط العربية بصيغ متعددة
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="ابحث عن الخط المثالي..."
              className="h-14 pr-12 text-lg"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              data-testid="input-hero-search"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
