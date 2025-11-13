import React from "react";

interface FiltersProps {
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
}

export default function Filters({
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
}: FiltersProps) {
  // Extract unique Ecuador provinces from companyLocation (e.g., "Quito, Ecuador" -> "Quito")
  const provinceSet = new Set<string>();
  jobs.forEach((job) => {
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
          }}
        >
          Limpiar filtros
        </button>
      </div>
    </aside>
  );
}
