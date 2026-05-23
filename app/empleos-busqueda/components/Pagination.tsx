"use client";
import { useRouter, useSearchParams } from "next/navigation";
import TablePagination from "@/components/shared/components/TablePagination";
import { Suspense } from "react";

interface Props {
  total: number;
  pageSize?: number;
}

function PaginationInner({ total, pageSize = 10 }: Props) {
  const { push } = useRouter();
  const params = useSearchParams();
  const page = Number(params.get("page") ?? 1);

  const handlePageChange = (p: number) => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set("page", String(p));
    push("?" + newParams.toString(), { scroll: false });
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

export function Pagination(props: Props) {
  return (
    <Suspense fallback={null}>
      <PaginationInner {...props} />
    </Suspense>
  );
}
