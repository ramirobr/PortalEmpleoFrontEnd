"use client";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  total: number;
  pageSize?: number;
}

export function Pagination({ total, pageSize = 10 }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const page = Number(params.get("page") ?? 1);
  const totalPages = Math.ceil(total / pageSize);

  const go = (p: number) => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set("page", String(p));
    router.push("?" + newParams.toString(), { scroll: false });
  };

  const getPages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (page >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 py-20">
      <button
        disabled={page <= 1}
        onClick={() => go(page - 1)}
        className="px-4 h-10 flex items-center justify-center rounded-lg border border-gray-600 text-primary font-bold hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-sm"
      >
        « Anterior
      </button>

      <div className="flex items-center gap-2">
        {getPages().map((p, idx) =>
          p === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-10 h-10 flex items-center justify-center text-gray-400 font-bold"
            >
              ...
            </span>
          ) : (
            <button
              key={`page-${p}`}
              onClick={() => go(Number(p))}
              className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all text-sm ${
                page === p
                  ? "bg-primary text-white border border-primary shadow-md shadow-primary/20 cursor-default"
                  : "bg-white border border-gray-600 text-primary hover:border-primary/30 hover:bg-gray-50 cursor-pointer"
              }`}
            >
              {p}
            </button>
          ),
        )}
      </div>

      <button
        disabled={page >= totalPages}
        onClick={() => go(page + 1)}
        className="px-4 h-10 flex items-center justify-center rounded-lg border border-gray-600 text-primary font-bold hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-sm"
      >
        Siguiente »
      </button>
    </div>
  );
}
