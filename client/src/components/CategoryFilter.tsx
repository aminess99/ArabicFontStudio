import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="border-b bg-background">
      <div className="container mx-auto px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Button
            variant={selectedCategory === "الكل" ? "default" : "outline"}
            size="sm"
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
