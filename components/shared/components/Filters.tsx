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
import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { PriceRange } from "@/components/shared/components/PriceRange";
import { useDebouncedValue } from "@/lib/hooks";
import { FiltersResponse } from "@/types/search";
import { addSpaces } from "@/lib/utils";
import { PremiumButton } from "./PremiumButton";
import { SearchAutocomplete } from "@/components/ui/search-autocomplete";

const PRICE_RANGE_MIN = 100;
const PRICE_RANGE_MAX = 20000;

type Props = {
  initialFilters: Record<string, string>;
  filters: FiltersResponse | undefined;
  isOpen?: boolean;
  onClose?: () => void;
};

function FiltersInner({
  initialFilters,
  filters,
  isOpen = false,
  onClose,
}: Props) {
  const { push } = useRouter();
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
    push("?" + p.toString(), { scroll: false });
  };

  const commitRange = ([a, b]: [number, number]) => {
    const p = new URLSearchParams(qs.toString());
    p.set("min", String(a));
    p.set("max", String(b));
    p.set("page", "1");
    push("?" + p.toString(), { scroll: false });
  };

  const clearAll = () => {
    push("?", { scroll: false });
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
        fixed inset-y-0 left-0 z-70 lg:z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-fit lg:min-w-[260px] lg:max-w-xs lg:shadow-none lg:bg-transparent overflow-y-auto lg:overflow-visible
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="lg:hidden flex justify-end p-4">
        <button onClick={onClose} aria-label="Cerrar filtros">
          <svg
            className="size-6"
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
      <div className="rounded-lg lg:shadow shadow-none p-6 flex flex-col gap-6 bg-white">
        <Input
          id="filter-search"
          aria-label="Buscar vacantes"
          placeholder="Buscar..."
          value={SearchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div>
          <span className="pb-5 block text-black font-bold">
            Rango salarial
          </span>
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
          <label htmlFor="filter-ciudad" className="text-black font-bold">Ciudad</label>
          <SearchAutocomplete<string>
            id="filter-ciudad"
            className="w-full mt-1"
            options={[
              { id: " ", label: "Todas" },
              ...(filters?.ciudad?.map((ciudad) => ({
                id: ciudad.idCatalogo.toString(),
                label: ciudad.nombre,
              })) ?? []),
            ]}
            value={current("ciudad", initialFilters.ciudad) || undefined}
            onChange={(v) => update("ciudad", v)}
            placeholder="Todas"
            searchPlaceholder="Buscar ciudad..."
          />
        </div>

        <div>
          <label htmlFor="filter-provincia" className="text-black font-bold">Provincia</label>
          <SearchAutocomplete<string>
            id="filter-provincia"
            className="w-full mt-1"
            options={[
              { id: " ", label: "Todas" },
              ...(filters?.provincia?.map((provincia) => ({
                id: provincia.idCatalogo.toString(),
                label: provincia.nombre,
              })) ?? []),
            ]}
            value={current("provincia", initialFilters.provincia) || undefined}
            onChange={(v) => update("provincia", v)}
            placeholder="Todas"
            searchPlaceholder="Buscar provincia..."
          />
        </div>

        <div>
          <label htmlFor="filter-fecha" className="text-black font-bold">Fecha</label>
          <Select
            value={current("fecha", initialFilters.fecha)}
            onValueChange={(v) => update("fecha", v)}
          >
            <SelectTrigger id="filter-fecha" className="w-full mt-1 max-w-[212px]">
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
          <label htmlFor="filter-experiencia" className="text-black font-bold">Experiencia</label>
          <Select
            value={current("experience", initialFilters.experiencia)}
            onValueChange={(v) => update("experience", v)}
          >
            <SelectTrigger id="filter-experiencia" className="w-full mt-1 max-w-[212px]">
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
          <label htmlFor="filter-empresa" className="text-black font-bold">Empresa</label>
          <SearchAutocomplete<string>
            id="filter-empresa"
            className="w-full mt-1"
            options={[
              { id: " ", label: "Todas" },
              ...(filters?.activeCompanies?.map((company) => ({
                id: company.idEmpresa,
                label: company.razonSocial,
              })) ?? []),
            ]}
            value={current("empresa", initialFilters.company) || undefined}
            onChange={(v) => update("empresa", v)}
            placeholder="Todas"
            searchPlaceholder="Buscar empresa..."
          />
        </div>

        <div>
          <label htmlFor="filter-modalidad" className="text-black font-bold">Modalidad</label>
          <Select
            value={current("modalidad", initialFilters.modalidad)}
            onValueChange={(v) => update("modalidad", v)}
          >
            <SelectTrigger id="filter-modalidad" className="w-full mt-1 max-w-[212px]">
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

        <div>
          <label htmlFor="filter-jornada" className="text-black font-bold">Jornada Laboral</label>
          <Select
            value={current("jornada", initialFilters.jornada)}
            onValueChange={(v) => update("jornada", v)}
          >
            <SelectTrigger id="filter-jornada" className="w-full mt-1 max-w-[212px]">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Todas</SelectItem>
              {filters?.tipo_empleo?.map((jornada) => (
                <SelectItem
                  key={jornada.idCatalogo}
                  value={jornada.idCatalogo.toString()}
                >
                  {addSpaces(jornada.nombre)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <PremiumButton
          type="button"
          className="w-full"
          onClick={clearAll}
        >
          Limpiar filtros
        </PremiumButton>
      </div>
    </aside>
  );
}

export function Filters(props: Props) {
  return (
    <Suspense fallback={null}>
      <FiltersInner {...props} />
    </Suspense>
  );
}
