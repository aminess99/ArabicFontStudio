import { useState } from "react";
import { ThemeProvider } from "../ThemeProvider";
import { Header } from "../Header";

export default function HeaderExample() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <ThemeProvider>
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
    </ThemeProvider>
  );
}
