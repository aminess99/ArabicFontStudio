import { useState } from "react";
import { CategoryFilter } from "../CategoryFilter";

export default function CategoryFilterExample() {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const categories = ["كوفي", "نسخ", "ديواني", "حديث", "تقليدي"];

  return (
    <div className="min-h-screen bg-background">
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
    </div>
  );
}
