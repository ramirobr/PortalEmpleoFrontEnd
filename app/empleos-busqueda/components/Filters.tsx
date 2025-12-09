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
import { useEffect, useMemo, useRef, useState } from "react";
import { PriceRange } from "@/components/shared/components/PriceRange";
import { useDebouncedValue } from "@/lib/hooks";
import { FiltersResponse } from "@/types/search";
import { addSpaces } from "@/lib/utils";

const PRICE_RANGE_MIN = 100;
const PRICE_RANGE_MAX = 20000;

type Props = {
  initialFilters: Record<string, string>;
  filters: FiltersResponse | undefined;
};

export function Filters({ initialFilters, filters }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const initialMount = useRef(true);
  const qs = useMemo(() => new URLSearchParams(params.toString()), [params]);
  const [SearchQuery, setSearchQuery] = useState(
    qs.get("q") ?? initialFilters.q ?? ""
  );
  const debounced = useDebouncedValue(SearchQuery, 300);
  const [range, setRange] = useState<[number, number]>([
    Number(qs.get("min") ?? initialFilters.min ?? PRICE_RANGE_MIN),
    Number(qs.get("max") ?? initialFilters.max ?? PRICE_RANGE_MAX),
  ]);

  const current = (key: string, fallback: string) =>
    qs.get(key) ?? fallback ?? "";

  const update = (key: string, value: string) => {
    const p = new URLSearchParams(qs.toString());
    if (!value.trim()) p.delete(key);
    else p.set(key, value.trim());
    p.set("page", "1");
    router.push("?" + p.toString(), { scroll: false });
  };

  const commitRange = ([a, b]: [number, number]) => {
    const p = new URLSearchParams(qs.toString());
    p.set("min", String(a));
    p.set("max", String(b));
    p.set("page", "1");
    router.push("?" + p.toString(), { scroll: false });
  };

  const clearAll = () => {
    router.push("?", { scroll: false });
    setRange([PRICE_RANGE_MIN, PRICE_RANGE_MAX]);
    setSearchQuery("");
  };

  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
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
            value={current("ubicacion", initialFilters.ubicacion)}
            onValueChange={(v) => update("ubicacion", v)}
          >
            <SelectTrigger className="w-full mt-1 max-w-[212px]">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Todas</SelectItem>
              {filters?.ciudad?.map((ciudad) => (
                <SelectItem
                  key={ciudad.idCatalogo}
                  value={ciudad.idCatalogo.toString()}
                >
                  {ciudad.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label>Fecha</label>
          <Select
            value={current("fecha", initialFilters.fecha)}
            onValueChange={(v) => update("fecha", v)}
          >
            <SelectTrigger className="w-full mt-1 max-w-[212px]">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              {filters?.filtroFechas?.map((fecha) => (
                <SelectItem key={fecha.valor} value={fecha.valor.toString()}>
                  {addSpaces(fecha.nombre)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label>Experiencia</label>
          <Select
            value={current("experience", initialFilters.experiencia)}
            onValueChange={(v) => update("experience", v)}
          >
            <SelectTrigger className="w-full mt-1 max-w-[212px]">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Todas</SelectItem>
              {filters?.experiencia?.map((exp) => (
                <SelectItem key={exp.valor} value={exp.valor.toString()}>
                  {addSpaces(exp.nombre)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label>Empresa</label>
          <Select
            value={current("empresa", initialFilters.company)}
            onValueChange={(v) => update("empresa", v)}
          >
            <SelectTrigger className="w-full mt-1 max-w-[212px]">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Todas</SelectItem>
              {filters?.activeCompanies?.map((company) => (
                <SelectItem key={company.idEmpresa} value={company.idEmpresa}>
                  {company.razonSocial}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label>Modalidad</label>
          <Select
            value={current("modalidad", initialFilters.modalidad)}
            onValueChange={(v) => update("modalidad", v)}
          >
            <SelectTrigger className="w-full mt-1 max-w-[212px]">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Todas</SelectItem>
              {filters?.modalidadTrabajo?.map((modalidad) => (
                <SelectItem
                  key={modalidad.valor}
                  value={modalidad.valor.toString()}
                >
                  {addSpaces(modalidad.nombre)}
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
