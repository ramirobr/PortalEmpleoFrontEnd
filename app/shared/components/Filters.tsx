import React from "react";
import * as Slider from "@radix-ui/react-slider";

export interface FiltersProps {
  search: string;
  setSearch: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  date: string;
  setDate: (v: string) => void;
  experience: string;
  setExperience: (v: string) => void;
  company: string;
  setCompany: (v: string) => void;
  mode: string;
  setMode: (v: string) => void;
  jobs: any[];
  filters: any;
  salaryRange?: [number, number];
  setSalaryRange?: (range: [number, number]) => void;
}

export default function Filters(props: FiltersProps) {
  const {
    search,
    setSearch,
    location,
    setLocation,
    date,
    setDate,
    experience,
    setExperience,
    company,
    setCompany,
    mode,
    setMode,
    jobs,
    filters,
    salaryRange = [450, 7000],
    setSalaryRange = () => {},
  } = props;

  // Extract unique Ecuador provinces from companyLocation (e.g., "Quito, Ecuador" -> "Quito")
  const provinceSet = new Set<string>();
  jobs.forEach((job: any) => {
    if (typeof job.companyLocation === "string") {
      const [province] = job.companyLocation.split(",");
      if (province) provinceSet.add(province.trim());
    }
  });
  const provinces = Array.from(provinceSet).sort();

  return (
    <aside className="sticky top-8 h-fit min-w-[260px] max-w-xs flex flex-col gap-6">
      <div className="rounded-lg shadow p-6 flex flex-col gap-4">
        <label htmlFor="search-input" className="sr-only">
          Buscar
        </label>
        <input
          id="search-input"
          type="text"
          placeholder="Buscar..."
          aria-label="Buscar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded focus:outline-none focus:ring"
        />
      </div>
      <div className="rounded-lg shadow p-6 flex flex-col gap-4">
        <label htmlFor="salary-slider" className="font-semibold text-sm mb-2">
          Rango salarial (USD)
        </label>
        <div className="flex flex-col gap-2">
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-6"
            min={1200}
            max={4500}
            step={100}
            value={salaryRange}
            onValueChange={(val) => setSalaryRange([val[0], val[1]])}
            aria-label="Rango salarial"
          >
            <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
              <Slider.Range className="absolute bg-blue-500 rounded-full h-2" />
            </Slider.Track>
            <Slider.Thumb className="block w-5 h-5 bg-white border border-blue-500 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <Slider.Thumb className="block w-5 h-5 bg-white border border-blue-500 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </Slider.Root>
          {/* Removed duplicate function signature and destructuring block */}
        </div>

        <label htmlFor="location-select" className="sr-only">
          Ubicación
        </label>
        <select
          id="location-select"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="px-4 py-2 border rounded focus:outline-none focus:ring"
          title="Ubicación"
        >
          <option value="">Todas las ubicaciones</option>
          {provinces.map((prov) => (
            <option key={prov} value={prov}>
              {prov}
            </option>
          ))}
        </select>

        <label htmlFor="date-select" className="sr-only">
          Fecha
        </label>
        <select
          id="date-select"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-4 py-2 border rounded focus:outline-none focus:ring"
          title="Fecha"
        >
          <option value="">Todas las fechas</option>
          {filters?.dates?.map((opt: { label: string; value: string }) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <label htmlFor="experience-select" className="sr-only">
          Experiencia
        </label>
        <select
          id="experience-select"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="px-4 py-2 border rounded focus:outline-none focus:ring"
          title="Experiencia"
        >
          <option value="">Todas las experiencias</option>
          {filters?.experience?.map((opt: { label: string; value: string }) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <label htmlFor="company-select" className="sr-only">
          Empresa
        </label>
        <select
          id="company-select"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="px-4 py-2 border rounded focus:outline-none focus:ring"
          title="Empresa"
        >
          <option value="">Todas las empresas</option>
          {filters?.companies?.map((c: string) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label htmlFor="mode-select" className="sr-only">
          Modalidad
        </label>
        <select
          id="mode-select"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="px-4 py-2 border rounded focus:outline-none focus:ring"
          title="Modalidad"
        >
          <option value="">Todas las modalidades</option>
          {filters?.modes?.map((opt: { label: string; value: string }) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setSearch("");
            setLocation("");
            setDate("");
            setExperience("");
            setCompany("");
            setMode("");
            setSalaryRange([1200, 4500]);
          }}
        >
          Limpiar filtros
        </button>
      </div>
    </aside>
  );
}
