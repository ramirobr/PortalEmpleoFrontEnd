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
import { CandidateSearchFiltersResponse } from "@/types/company";

const AGE_MIN = 18;
const AGE_MAX = 70;
const SALARY_MIN = 500;
const SALARY_MAX = 10000;
const EXPERIENCE_MIN = 0;
const EXPERIENCE_MAX = 30;

type Props = {
  initialFilters: Record<string, string>;
  filters: CandidateSearchFiltersResponse | undefined;
  isOpen?: boolean;
  onClose?: () => void;
};

// Mock data for education levels and shift preferences
const NIVELES_EDUCACION = [
  { id: "1", nombre: "Secundaria" },
  { id: "2", nombre: "Técnico" },
  { id: "3", nombre: "Universitario" },
  { id: "4", nombre: "Posgrado" },
];

const PREFERENCIAS_TURNO = [
  { id: "1", nombre: "Mañana" },
  { id: "2", nombre: "Tarde" },
  { id: "3", nombre: "Noche" },
  { id: "4", nombre: "Flexible" },
];

export function CandidateFilters({
  initialFilters,
  filters,
  isOpen = false,
  onClose,
}: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const initialMount = useRef(true);
  const qs = useMemo(() => new URLSearchParams(params.toString()), [params]);

  const [searchQuery, setSearchQuery] = useState(
    qs.get("q") ?? initialFilters.q ?? ""
  );
  const debounced = useDebouncedValue(searchQuery, 300);

  const [ageRange, setAgeRange] = useState<[number, number]>([
    Number(qs.get("edadMin") ?? initialFilters.edadMin ?? AGE_MIN),
    Number(qs.get("edadMax") ?? initialFilters.edadMax ?? AGE_MAX),
  ]);

  const [salaryRange, setSalaryRange] = useState<[number, number]>([
    Number(
      qs.get("aspiracionMin") ?? initialFilters.aspiracionMin ?? SALARY_MIN
    ),
    Number(
      qs.get("aspiracionMax") ?? initialFilters.aspiracionMax ?? SALARY_MAX
    ),
  ]);

  const [experienceRange, setExperienceRange] = useState<[number, number]>([
    Number(
      qs.get("experienciaMin") ?? initialFilters.experienciaMin ?? EXPERIENCE_MIN
    ),
    Number(
      qs.get("experienciaMax") ?? initialFilters.experienciaMax ?? EXPERIENCE_MAX
    ),
  ]);

  const current = (key: string, fallback: string) =>
    qs.get(key) ?? fallback ?? "";

  const update = (key: string, value: string) => {
    const p = new URLSearchParams(qs.toString());
    if (!value.trim() || value === " ") p.delete(key);
    else p.set(key, value.trim());
    p.set("page", "1");
    router.push("?" + p.toString(), { scroll: false });
  };

  const commitAgeRange = ([a, b]: [number, number]) => {
    const p = new URLSearchParams(qs.toString());
    if (a === AGE_MIN) p.delete("edadMin");
    else p.set("edadMin", String(a));
    if (b === AGE_MAX) p.delete("edadMax");
    else p.set("edadMax", String(b));
    p.set("page", "1");
    router.push("?" + p.toString(), { scroll: false });
  };

  const commitSalaryRange = ([a, b]: [number, number]) => {
    const p = new URLSearchParams(qs.toString());
    if (a === SALARY_MIN) p.delete("aspiracionMin");
    else p.set("aspiracionMin", String(a));
    if (b === SALARY_MAX) p.delete("aspiracionMax");
    else p.set("aspiracionMax", String(b));
    p.set("page", "1");
    router.push("?" + p.toString(), { scroll: false });
  };

  const commitExperienceRange = ([a, b]: [number, number]) => {
    const p = new URLSearchParams(qs.toString());
    if (a === EXPERIENCE_MIN) p.delete("experienciaMin");
    else p.set("experienciaMin", String(a));
    if (b === EXPERIENCE_MAX) p.delete("experienciaMax");
    else p.set("experienciaMax", String(b));
    p.set("page", "1");
    router.push("?" + p.toString(), { scroll: false });
  };

  const clearAll = () => {
    router.push("?", { scroll: false });
    setAgeRange([AGE_MIN, AGE_MAX]);
    setSalaryRange([SALARY_MIN, SALARY_MAX]);
    setExperienceRange([EXPERIENCE_MIN, EXPERIENCE_MAX]);
    setSearchQuery("");
  };

  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
    update("q", searchQuery);
  }, [debounced]);

  // Get unique provinces and cities from mock data
  const provincias = Array.from(
    new Set([
      "Pichincha",
      "Guayas",
      "Azuay",
      "Manabí",
      "Tungurahua",
      "Loja",
      "Chimborazo",
      "Imbabura",
      "Santo Domingo de los Tsáchilas",
      "El Oro",
    ])
  ).map((p, i) => ({ idCatalogo: i + 1, nombre: p }));

  const ciudades = Array.from(
    new Set([
      "Quito",
      "Guayaquil",
      "Cuenca",
      "Manta",
      "Ambato",
      "Loja",
      "Riobamba",
      "Ibarra",
      "Santo Domingo",
      "Machala",
      "Portoviejo",
    ])
  ).map((c, i) => ({ idCatalogo: i + 1, nombre: c }));

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
          placeholder="Buscar candidatos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div>
          <label className="pb-5 block text-black font-bold">
            Rango de edad
          </label>
          <PriceRange
            min={AGE_MIN}
            max={AGE_MAX}
            step={1}
            range={ageRange}
            setRange={setAgeRange}
            onCommit={commitAgeRange}
          />
        </div>

        <div>
          <label className="pb-5 block text-black font-bold">
            Aspiración salarial
          </label>
          <PriceRange
            min={SALARY_MIN}
            max={SALARY_MAX}
            step={100}
            range={salaryRange}
            setRange={setSalaryRange}
            onCommit={commitSalaryRange}
          />
        </div>

        <div>
          <label className="pb-5 block text-black font-bold">
            Años de experiencia
          </label>
          <PriceRange
            min={EXPERIENCE_MIN}
            max={EXPERIENCE_MAX}
            step={1}
            range={experienceRange}
            setRange={setExperienceRange}
            onCommit={commitExperienceRange}
          />
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
              {provincias.map((provincia) => (
                <SelectItem key={provincia.idCatalogo} value={provincia.nombre}>
                  {provincia.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              {ciudades.map((ciudad) => (
                <SelectItem key={ciudad.idCatalogo} value={ciudad.nombre}>
                  {ciudad.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-black font-bold">Nivel de educación</label>
          <Select
            value={current("nivelEducacion", initialFilters.nivelEducacion)}
            onValueChange={(v) => update("nivelEducacion", v)}
          >
            <SelectTrigger className="w-full mt-1 max-w-[212px]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Todos</SelectItem>
              {NIVELES_EDUCACION.map((nivel) => (
                <SelectItem key={nivel.id} value={nivel.nombre}>
                  {nivel.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-black font-bold">Preferencia de horario</label>
          <Select
            value={current("preferenciaTurno", initialFilters.preferenciaTurno)}
            onValueChange={(v) => update("preferenciaTurno", v)}
          >
            <SelectTrigger className="w-full mt-1 max-w-[212px]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Todos</SelectItem>
              {PREFERENCIAS_TURNO.map((turno) => (
                <SelectItem key={turno.id} value={turno.nombre}>
                  {turno.nombre}
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
