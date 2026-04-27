"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TablePaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  itemLabel?: string; // "empresas" | "candidatos" | "usuarios" etc.
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  className?: string;
  showInfo?: boolean;
}

export default function TablePagination({
  currentPage,
  pageSize,
  totalItems,
  itemLabel = "items",
  onPageChange,
  onPageSizeChange,
  className = "",
  showInfo = true,
}: TablePaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalItems === 0 || totalPages <= 1) {
    return null;
  }

  // Common button classes
  const buttonBaseClass =
    "min-w-[40px] h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all border cursor-pointer active:scale-95";
  const activeClass = "bg-primary text-white border-primary shadow-sm"; 
  const inactiveClass =
    "bg-white text-gray-700 border-gray-100 hover:border-primary/30 hover:text-primary";
  const navButtonClass =
    "px-5 py-2 h-10 flex items-center justify-center rounded-xl border border-gray-100 text-sm font-medium text-gray-700 bg-white hover:border-primary/30 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-95 uppercase tracking-wider";

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center gap-4 px-6 py-5 bg-white transition-all",
        showInfo ? "justify-between" : "justify-center",
        className
      )}
    >
      {/* Items info */}
      {showInfo && (
        <div className="text-sm text-gray-500 order-2 sm:order-1 h-10 flex items-center">
          <span>
            Mostrando{" "}
            <span className="font-medium text-gray-900">
              {startItem} - {endItem}
            </span>{" "}
            de <span className="font-medium text-gray-900">{totalItems}</span> {itemLabel}
          </span>
        </div>
      )}

      {/* Page navigation */}
      <div className={cn("flex items-center gap-2 order-1 sm:order-2 flex-wrap justify-center")}>
        {/* Previous button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={navButtonClass}
        >
          Anterior
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) =>
            typeof page === "number" ? (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`${buttonBaseClass} ${
                  currentPage === page ? activeClass : inactiveClass
                }`}
              >
                {page}
              </button>
            ) : (
              <span
                key={`ellipsis-${index}`}
                className="w-10 h-10 flex items-center justify-center text-gray-400 font-medium"
              >
                {page}
              </span>
            ),
          )}
        </div>

        {/* Next button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={navButtonClass}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
