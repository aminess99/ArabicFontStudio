import { useState } from "react";
import { Menu } from "lucide-react";
import { Link } from "wouter";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Navigation sheet for the English and French headers, whose nav is hidden
// below the lg breakpoint.
export function LocalizedMobileMenu({ locale, links }: { locale: "en" | "fr"; links: Array<{ href: string; label: string }> }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-md hover:bg-muted lg:hidden"
          aria-label={locale === "fr" ? "Ouvrir le menu" : "Open menu"}
          data-testid="button-localized-menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72" dir="ltr">
        <SheetTitle className="mb-6">Menu</SheetTitle>
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-md px-3 py-3 text-base hover:bg-muted">
              {link.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
