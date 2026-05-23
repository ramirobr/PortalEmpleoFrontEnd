"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PremiumButton } from "./PremiumButton";

interface Props {
  total: number;
  onToggleFilters?: () => void;
  entityName?: string;
}

function TopFiltersInner({
  total,
  onToggleFilters,
  entityName = "empleos",
}: Props) {
  const params = useSearchParams();
  const { push } = useRouter();

  const update = (k: string, v: string) => {
    const p = new URLSearchParams(params.toString());
    p.set(k, v);
    p.set("page", "1");
    push("?" + p.toString(), { scroll: false });
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start">
      <div className="flex justify-between w-full lg:w-auto items-center mb-3 lg:mb-0">
        <p className="text-3xl font-extrabold text-primary mb-1">
          {total} {entityName} encontrados
        </p>
        <PremiumButton
          onClick={onToggleFilters}
          className="lg:hidden"
          size="sm"
          icon={
            <svg
              className="size-4"
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
          }
        >
          Filtrar
        </PremiumButton>
      </div>
      <div className="flex items-center gap-4 pb-6 justify-between lg:justify-end w-full lg:w-auto">
        <span className="hidden lg:block">Ordenar por:</span>
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
        <span className="hidden lg:block">Items por página:</span>
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

export function TopFilters(props: Props) {
  return (
    <Suspense fallback={null}>
      <TopFiltersInner {...props} />
    </Suspense>
  );
}
