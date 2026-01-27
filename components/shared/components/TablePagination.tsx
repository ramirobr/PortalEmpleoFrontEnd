"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TablePaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  itemLabel?: string; // "empresas" | "candidatos" | "usuarios" etc.
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void; // Optional now as it wasn't used in the footer design
  className?: string;
}

export default function TablePagination({
  currentPage,
  pageSize,
  totalItems,
  itemLabel = "items",
  onPageChange,
  onPageSizeChange,
  className = "",
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

  if (totalItems === 0) {
    return null;
  }

  // Common button classes
  const buttonBaseClass =
    "min-w-[40px] h-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors border cursor-pointer";
  const activeClass = "bg-[#14b8a6] text-white border-[#14b8a6]"; // Turquoise
  const inactiveClass =
    "bg-white text-gray-700 border-gray-200 hover:bg-gray-50";
  const navButtonClass =
    "px-4 py-2 rounded-md border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer";

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-gray-50 border-t border-gray-200 mt-4 ${className}`}
    >
      {/* Items info */}
      <div className="text-sm text-gray-500 order-2 sm:order-1 h-10 flex items-center">
        <span>
          Mostrando{" "}
          <span className="font-semibold">
            {startItem} - {endItem}
          </span>{" "}
          de <span className="font-semibold">{totalItems}</span> {itemLabel}
        </span>
      </div>

      {/* Page navigation */}
      <div className="flex items-center gap-2 order-1 sm:order-2">
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
                className="w-10 h-10 flex items-center justify-center text-gray-400"
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
