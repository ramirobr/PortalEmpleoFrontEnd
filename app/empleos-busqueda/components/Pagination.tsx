"use client";
import { useRouter, useSearchParams } from "next/navigation";
import TablePagination from "@/components/shared/components/TablePagination";

interface Props {
  total: number;
  pageSize?: number;
}

export function Pagination({ total, pageSize = 10 }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const page = Number(params.get("page") ?? 1);

  const handlePageChange = (p: number) => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set("page", String(p));
    router.push("?" + newParams.toString(), { scroll: false });
  };

  return (
    <div className="py-12">
      <TablePagination
        currentPage={page}
        pageSize={pageSize}
        totalItems={total}
        onPageChange={handlePageChange}
        showInfo={false}
        className="bg-transparent border-none"
      />
    </div>
  );
}
