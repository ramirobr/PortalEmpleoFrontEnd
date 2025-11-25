"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { filters } from "@/lib/mocks/jobs.json";
import { PriceRange } from "@/components/shared/components/PriceRange";
import { useDebouncedValue } from "@/lib/hooks";

const PRICE_RANGE_MIN = 100;
const PRICE_RANGE_MAX = 5000;

export function Filters() {
  const router = useRouter();
  const params = useSearchParams();
  const qs = useMemo(() => new URLSearchParams(params.toString()), [params]);
  const [SearchQuery, setSearchQuery] = useState(qs.get("q") ?? "");
  const debounced = useDebouncedValue(SearchQuery, 300);
  const [range, setRange] = useState<[number, number]>([
    Number(params.get("min") ?? PRICE_RANGE_MIN),
    Number(params.get("max") ?? PRICE_RANGE_MAX),
  ]);

  const update = (key: string, value: string) => {
    const p = new URLSearchParams(qs.toString());
    if (!value.trim()) p.delete(key);
    else p.set(key, value.trim());
    p.set("page", "1");
    router.push("?" + p.toString(), { scroll: false });
  };

  function commitRange([a, b]: [number, number]) {
    const p = new URLSearchParams(params.toString());
    p.set("min", String(a));
    p.set("max", String(b));
    p.set("page", "1");
    router.push("?" + p.toString(), { scroll: false });
  }

  const clearAll = () => {
    router.push("?", { scroll: false });
    setRange([PRICE_RANGE_MIN, PRICE_RANGE_MAX]);
    setSearchQuery("");
  };

  useEffect(() => {
    update("q", SearchQuery);
  }, [debounced]);

  return (
    <aside className="sticky top-8 h-fit min-w-[260px] max-w-xs flex flex-col gap-6">
      <div className="rounded-lg shadow p-6 flex flex-col gap-4">
        <Input
          placeholder="Buscar..."
          value={SearchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-lg shadow p-6 flex flex-col gap-4">
        <div>
          <label className="pb-5 block">Rango salarial</label>
          <PriceRange
            min={PRICE_RANGE_MIN}
            max={PRICE_RANGE_MAX}
            step={100}
            range={range}
            setRange={setRange}
            onCommit={commitRange}
          />
        </div>

        <div>
          <label>Ubicación</label>
          <Select
            value={qs.get("location") ?? ""}
            onValueChange={(v) => update("location", v)}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Todas</SelectItem>
              <SelectItem value="Remoto">Remoto</SelectItem>
              <SelectItem value="Presencial">Presencial</SelectItem>
              <SelectItem value="Híbrido">Híbrido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label>Fecha</label>
          <Select
            value={qs.get("date") ?? ""}
            onValueChange={(v) => update("date", v)}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Todas</SelectItem>
              {filters.dates.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label>Experiencia</label>
          <Select
            value={qs.get("experience") ?? ""}
            onValueChange={(v) => update("experience", v)}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Todas</SelectItem>
              {filters.experience.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label>Empresa</label>
          <Select
            value={qs.get("company") ?? ""}
            onValueChange={(v) => update("company", v)}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Todas</SelectItem>
              {filters.companies.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label>Modalidad</label>
          <Select
            value={qs.get("mode") ?? ""}
            onValueChange={(v) => update("mode", v)}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Todas</SelectItem>
              {filters.modes.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <button type="button" className="btn btn-primary" onClick={clearAll}>
          Limpiar filtros
        </button>
      </div>
    </aside>
  );
}
