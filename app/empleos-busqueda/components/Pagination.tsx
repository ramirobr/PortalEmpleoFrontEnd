"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Props {
  total: number;
  limit: number;
  page: number;
}

export function Pagination({ total, limit, page }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const totalPages = Math.ceil(total / limit);

  const go = (p: number) => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set("page", String(p));
    router.push("?" + newParams.toString());
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 p-4">
      <Button
        variant="outline"
        disabled={page <= 1}
        onClick={() => go(page - 1)}
      >
        Anterior
      </Button>

      <div className="px-3">{page} / {totalPages}</div>

      <Button
        variant="outline"
        disabled={page >= totalPages}
        onClick={() => go(page + 1)}
      >
        Siguiente
      </Button>
    </div>
  );
}
