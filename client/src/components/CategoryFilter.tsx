import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="border-b editorial-rule bg-background/60">
      <div className="container mx-auto px-4 md:px-8 py-3">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Button
            variant={selectedCategory === "الكل" ? "default" : "outline"}
            size="sm"
             className="text-xs md:text-sm whitespace-nowrap shrink-0 rounded-full px-4"
            onClick={() => onCategoryChange("الكل")}
            data-testid="button-category-all"
          >
            الكل
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
               className="text-xs md:text-sm whitespace-nowrap shrink-0 rounded-full px-4"
              onClick={() => onCategoryChange(category)}
              data-testid={`button-category-${category}`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
