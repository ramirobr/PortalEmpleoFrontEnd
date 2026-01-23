"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/apiClient";
import { GetAllJobsResponse } from "@/types/jobs";

const getNumericParam = (n: string | null) =>
  isNaN(Number(n)) || n === null ? undefined : Number(n);

export function useJobs(token?: string) {
  const searchParams = useSearchParams();
  const [jobsData, setJobsData] = useState<GetAllJobsResponse["data"] | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const pageSize = Number(searchParams.get("pageSize") ?? 10);
  const currentPage = Number(searchParams.get("page") ?? 1);
  const searchTerm = searchParams.get("q") ?? undefined;
  const salarioMinimo = getNumericParam(searchParams.get("min"));
  const salarioMaximo = getNumericParam(searchParams.get("max"));
  const provincia = getNumericParam(searchParams.get("provincia"));
  const ciudad = getNumericParam(searchParams.get("ciudad"));
  const fechas = getNumericParam(searchParams.get("fecha"));
  const modalidad = getNumericParam(searchParams.get("modalidad"));
  const empresa = searchParams.get("empresa") ?? undefined;
  const experience = getNumericParam(searchParams.get("experience"));

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
        data?.isSuccess && setJobsData(data.data);
      } catch (e: any) {
        if (e.name !== "AbortError") console.warn(e);
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
