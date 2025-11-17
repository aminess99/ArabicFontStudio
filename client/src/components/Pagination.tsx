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
    <div className="flex items-center justify-center gap-2 py-8" dir="ltr">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="min-w-[100px] bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500 disabled:opacity-50 disabled:bg-emerald-500"
        data-testid="button-next-page"
      >
        التالي
        <ChevronLeft className="h-4 w-4 mr-1" />
      </Button>

      {pageNumbers.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
          className={`min-w-[50px] ${
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
        className="min-w-[100px] disabled:opacity-50"
        data-testid="button-prev-page"
      >
        <ChevronRight className="h-4 w-4 ml-1" />
        السابق
      </Button>
    </div>
  );
}
