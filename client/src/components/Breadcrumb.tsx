import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className="border-b bg-background">
      <div className="container mx-auto px-3 md:px-4 py-2">
        <ol className="flex items-center gap-1 md:gap-2 text-xs md:text-sm" dir="rtl">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-1 md:gap-2">
              <Link 
                href={item.href}
                className="text-primary hover:text-primary/80 transition-colors truncate"
                data-testid={`breadcrumb-link-${index}`}
              >
                {item.label}
              </Link>
              {index < items.length - 1 && (
                <ChevronLeft className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
