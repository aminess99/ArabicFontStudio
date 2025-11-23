import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= maxVisible; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 3) {
        for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 3; i <= currentPage + 3; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 py-6 md:py-8 flex-wrap" dir="rtl">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500 disabled:opacity-50 disabled:bg-emerald-500 text-xs md:text-sm h-8 md:h-9"
        data-testid="button-next-page"
      >
        التالي
      </Button>

      {pageNumbers.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
          className={`h-8 md:h-9 min-w-[2.5rem] md:min-w-[3rem] text-xs md:text-sm ${
            currentPage === page
              ? "bg-black dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-white"
              : "bg-white dark:bg-background text-foreground"
          }`}
          data-testid={`button-page-${page}`}
        >
          {page.toString().padStart(2, '0')}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="disabled:opacity-50 text-xs md:text-sm h-8 md:h-9"
        data-testid="button-prev-page"
      >
        السابق
      </Button>
    </div>
  );
}
