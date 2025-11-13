import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const Pagination = ({
  page,
  totalPages,
  onPageChange,
  loading,
}: PaginationProps) => {
  // Calculate visible page numbers (up to 3)
  let startPage = Math.max(1, page - 1);
  let endPage = Math.min(totalPages, startPage + 2);
  if (endPage - startPage < 2) startPage = Math.max(1, endPage - 2);
  const pages = [];
  for (let p = startPage; p <= endPage; p++) {
    pages.push(p);
  }

  return (
    <nav
      aria-label="Paginación de empleos"
      className="flex gap-2 justify-center mt-8"
    >
      <button
        className={`w-10 h-10 rounded-full bg-white shadow text-lg flex items-center justify-center cursor-pointer ${
          page === 1 ? "text-gray-400" : "hover:bg-gray-100"
        }`}
        onClick={() => onPageChange(1)}
        disabled={page === 1 || loading}
        aria-label="Primera página"
      >
        «
      </button>
      {pages.map((p) => (
        <button
          key={p}
          className={`w-10 h-10 rounded-full shadow flex items-center transition cursor-pointer justify-center text-lg hover:bg-secondary  hover:text-white ${
            p === page
              ? "bg-primary text-white font-bold "
              : "bg-white text-gray-700 "
          }`}
          onClick={() => onPageChange(p)}
          aria-current={p === page ? "page" : undefined}
          aria-label={`Página ${p}`}
          disabled={loading}
        >
          {p}
        </button>
      ))}
      <button
        className={`w-10 h-10 rounded-full bg-white shadow text-lg flex items-center justify-center cursor-pointer ${
          page === totalPages ? "text-gray-400" : "hover:bg-gray-100"
        }`}
        onClick={() => onPageChange(totalPages)}
        disabled={page === totalPages || loading}
        aria-label="Última página"
      >
        »
      </button>
    </nav>
  );
};
export default Pagination;
