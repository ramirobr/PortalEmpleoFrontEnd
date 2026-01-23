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
  isOpen?: boolean;
  onClose?: () => void;
};

export function Filters({
  initialFilters,
  filters,
  isOpen = false,
  onClose,
}: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const initialMount = useRef(true);
  const qs = useMemo(() => new URLSearchParams(params.toString()), [params]);
  const [SearchQuery, setSearchQuery] = useState(
    qs.get("q") ?? initialFilters.q ?? "",
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
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-fit md:min-w-[260px] md:max-w-xs md:shadow-none md:bg-transparent overflow-y-auto md:overflow-visible
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="md:hidden flex justify-end p-4">
        <button onClick={onClose} aria-label="Cerrar filtros">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="rounded-lg md:shadow shadow-none p-6 flex flex-col gap-6 bg-white">
        <Input
          placeholder="Buscar..."
          value={SearchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div>
          <label className="pb-5 block text-black font-bold">
            Rango salarial
          </label>
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
          <label className="text-black font-bold">Ciudad</label>
          <Select
            value={current("ciudad", initialFilters.ciudad)}
            onValueChange={(v) => update("ciudad", v)}
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
          <label className="text-black font-bold">Provincia</label>
          <Select
            value={current("provincia", initialFilters.provincia)}
            onValueChange={(v) => update("provincia", v)}
          >
            <SelectTrigger className="w-full mt-1 max-w-[212px]">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Todas</SelectItem>
              {filters?.provincia?.map((provincia) => (
                <SelectItem
                  key={provincia.idCatalogo}
                  value={provincia.idCatalogo.toString()}
                >
                  {provincia.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-black font-bold">Fecha</label>
          <Select
            value={current("fecha", initialFilters.fecha)}
            onValueChange={(v) => update("fecha", v)}
          >
            <SelectTrigger className="w-full mt-1 max-w-[212px]">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              {filters?.filtro_fechas?.map((fecha) => (
                <SelectItem
                  key={fecha.idCatalogo}
                  value={fecha.idCatalogo.toString()}
                >
                  {addSpaces(fecha.nombre)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-black font-bold">Experiencia</label>
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
                <SelectItem
                  key={exp.idCatalogo}
                  value={exp.idCatalogo.toString()}
                >
                  {addSpaces(exp.nombre)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-black font-bold">Empresa</label>
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
          <label className="text-black font-bold">Modalidad</label>
          <Select
            value={current("modalidad", initialFilters.modalidad)}
            onValueChange={(v) => update("modalidad", v)}
          >
            <SelectTrigger className="w-full mt-1 max-w-[212px]">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Todas</SelectItem>
              {filters?.modalidad_trabajo?.map((modalidad) => (
                <SelectItem
                  key={modalidad.idCatalogo}
                  value={modalidad.idCatalogo.toString()}
                >
                  {addSpaces(modalidad.nombre)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <button
          type="button"
          className="btn btn-primary cursor-pointer"
          onClick={clearAll}
        >
          Limpiar filtros
        </button>
      </div>
    </aside>
  );
}
