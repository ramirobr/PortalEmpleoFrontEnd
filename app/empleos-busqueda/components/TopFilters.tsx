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
  onToggleFilters?: () => void;
}

export function TopFilters({ total, onToggleFilters }: Props) {
  const params = useSearchParams();
  const router = useRouter();

  const update = (k: string, v: string) => {
    const p = new URLSearchParams(params.toString());
    p.set(k, v);
    p.set("page", "1");
    router.push("?" + p.toString(), { scroll: false });
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start">
      <div className="flex justify-between w-full md:w-auto items-center mb-3 md:mb-0">
        <p className="font-bold text-lg">{total} empleos encontrados</p>
        <button
          onClick={onToggleFilters}
          className="md:hidden flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded text-sm font-medium"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          Filtrar
        </button>
      </div>
      <div className="flex items-center gap-4 pb-6 justify-between md:justify-end w-full md:w-auto">
        <label className="hidden md:block">Ordenar por:</label>
        <Select
          defaultValue={params.get("sort") ?? "recent"}
          onValueChange={(v) => update("sort", v)}
        >
          <SelectTrigger className="w-[120px] !bg-white">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Reciente</SelectItem>
            <SelectItem value="oldest">Antiguo</SelectItem>
          </SelectContent>
        </Select>
        <label className="hidden md:block">Items por página:</label>
        <Select
          defaultValue={params.get("pageSize") ?? "10"}
          onValueChange={(v) => update("pageSize", v)}
        >
          <SelectTrigger className="w-20 !bg-white">
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
