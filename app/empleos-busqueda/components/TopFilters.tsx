"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  total: number;
}

export function TopFilters({ total }: Props) {
  const params = useSearchParams();
  const router = useRouter();

  const update = (k: string, v: string) => {
    const p = new URLSearchParams(params.toString());
    p.set(k, v);
    p.set("page", "1");
    router.push("?" + p.toString(), { scroll: false });
  };

  return (
    <div className="flex justify-between items-center">
      <span className="font-bold text-lg ">{total} empleos encontrados</span>
      <div className="flex items-center gap-4 p-4">
        <label>Ordenar por:</label>
        <Select
          defaultValue={params.get("sort") ?? "recent"}
          onValueChange={(v) => update("sort", v)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Reciente</SelectItem>
            <SelectItem value="oldest">Antiguo</SelectItem>
          </SelectContent>
        </Select>
        <label>Items por página:</label>
        <Select
          defaultValue={params.get("pageSize") ?? "10"}
          onValueChange={(v) => update("pageSize", v)}
        >
          <SelectTrigger className="w-20">
            <SelectValue placeholder="Items" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
