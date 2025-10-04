import { useState } from "react";
import { HeroSection } from "../HeroSection";

export default function HeroSectionExample() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <HeroSection searchQuery={searchQuery} onSearchChange={setSearchQuery} />
    </div>
  );
}
