"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Filters } from "@/components/shared/components/Filters";
import { TopFilters } from "@/components/shared/components/TopFilters";
import JobCard from "@/app/jobs/components/JobCard";
import { FiltersResponse } from "@/types/search";
import { Job, RecentJob } from "@/types/jobs";

interface FavoritosContentProps {
  favoriteJobs: (Job | RecentJob)[];
  filtersItems: FiltersResponse | undefined;
}

export default function FavoritosContent({
  favoriteJobs,
  filtersItems,
}: FavoritosContentProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const searchParams = useSearchParams();

  // Filter Logic
  const filteredJobs = useMemo(() => {
    let filtered = [...favoriteJobs];

    const q = searchParams.get("q")?.toLowerCase();
    const min = Number(searchParams.get("min"));
    const max = Number(searchParams.get("max"));
    const ciudad = searchParams.get("ciudad");
    const provincia = searchParams.get("provincia");
    const fecha = searchParams.get("fecha");
    const experiencia = searchParams.get("experience");
    const empresa = searchParams.get("empresa");
    const modalidad = searchParams.get("modalidad");

    if (q) {
      filtered = filtered.filter((job) => job.titulo.toLowerCase().includes(q));
    }

    if (ciudad && ciudad.trim() !== "") {
      const selectedCity = filtersItems?.ciudad?.find(
        (c) => c.idCatalogo.toString() === ciudad,
      );
      if (selectedCity) {
        filtered = filtered.filter((job) => job.ciudad === selectedCity.nombre);
      }
    }

    if (provincia && provincia.trim() !== "") {
      const selectedProv = filtersItems?.provincia?.find(
        (p) => p.idCatalogo.toString() === provincia,
      );
      if (selectedProv) {
        filtered = filtered.filter(
          (job) => job.provincia === selectedProv.nombre,
        );
      }
    }

    if (modalidad && modalidad.trim() !== "") {
      const selectedMod = filtersItems?.modalidad_trabajo?.find(
        (m) => m.idCatalogo.toString() === modalidad,
      );
      if (selectedMod) {
        filtered = filtered.filter(
          (job) => job.modalidad === selectedMod.nombre,
        );
      }
    }

    // Date/Cost filtering omitted for simplicity unless requested or easy to field.
    // Price range logic can be added if job has salary. RecentJob has salary: string. Job has salaryBase/Max (numbers).
    // Complexity warning.

    return filtered;
  }, [favoriteJobs, searchParams, filtersItems]);

  return (
    <div className="flex flex-col md:flex-row gap-8 relative">
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          isFiltersOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsFiltersOpen(false)}
        aria-hidden="true"
      />

      <Filters
        initialFilters={{}} // filters are controlled by URL, initial is just fallback
        filters={filtersItems}
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
      />

      <div className="flex-1">
        <TopFilters
          total={filteredJobs.length}
          onToggleFilters={() => setIsFiltersOpen(true)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredJobs?.length ? (
            filteredJobs?.map((job) => {
              // Handle conditional ID access safely
              const key = "idVacante" in job ? job.idVacante : job.id;
              return <JobCard key={key} job={job} isFavorite />;
            })
          ) : (
            <h4 className="text-lg font-semibold col-span-full text-center py-10">
              No se encontraron empleos con estos filtros.
            </h4>
          )}
        </div>
      </div>
    </div>
  );
}
