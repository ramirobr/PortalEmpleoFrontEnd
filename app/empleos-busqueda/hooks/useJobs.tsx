"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/apiClient";
import { GetAllJobsResponse } from "@/types/jobs";

const getNumericParam = (n: string | null | undefined) => {
  const num = Number(n);
  return !n || isNaN(num) ? undefined : num;
};

export function useJobs(token?: string, initialFilters?: Record<string, string>) {
  const searchParams = useSearchParams();
  const [jobsData, setJobsData] = useState<GetAllJobsResponse["data"] | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const pageSize = Number(searchParams.get("pageSize") ?? initialFilters?.pageSize ?? 10);
  const currentPage = Number(searchParams.get("page") ?? initialFilters?.page ?? 1);
  const searchTerm = searchParams.get("q") || initialFilters?.q || undefined;
  const salarioMinimo = getNumericParam(searchParams.get("min") ?? initialFilters?.min ?? null);
  const salarioMaximo = getNumericParam(searchParams.get("max") ?? initialFilters?.max ?? null);
  const provincia = getNumericParam(searchParams.get("provincia") ?? initialFilters?.provincia ?? null);
  const ciudad = getNumericParam(searchParams.get("ciudad") ?? initialFilters?.ciudad ?? null);
  const fechas = getNumericParam(searchParams.get("fecha") ?? initialFilters?.fecha ?? null);
  const modalidad = getNumericParam(searchParams.get("modalidad") ?? initialFilters?.modalidad ?? null);
  const empresa = searchParams.get("empresa") || initialFilters?.empresa || undefined;
  const experience = getNumericParam(searchParams.get("experience") ?? initialFilters?.experience ?? null);
  const role = searchParams.get("role") ?? initialFilters?.role ?? undefined;

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);

      const params = {
        pageSize,
        currentPage,
        searchTerm,
        salarioMinimo,
        salarioMaximo,
        idEmpresa: empresa,
        idProvincia: provincia,
        idCiudad: ciudad,
        idExperiencia: experience,
        idModalidadTrabajo: modalidad,
        idFiltroFechas: fechas,
      };

      try {
        const data = await fetchApi<GetAllJobsResponse>("/Jobs/getAll", {
          method: "POST",
          body: params,
          signal: controller.signal,
          token,
        });
        if (data?.isSuccess && data.data) {
          setJobsData(data.data);
        }
      } catch (e: unknown) {
        if (e instanceof Error && e.name !== "AbortError") console.warn(e);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort("aborted");
  }, [
    pageSize,
    currentPage,
    searchTerm,
    salarioMinimo,
    salarioMaximo,
    provincia,
    ciudad,
    fechas,
    modalidad,
    empresa,
    experience,
    token,
    role,
  ]);

  return {
    jobs: jobsData?.data ?? [],
    total: jobsData?.totalItems ?? 0,
    pageSize,
    currentPage,
    searchTerm,
    salarioMinimo,
    salarioMaximo,
    loading,
  };
}
