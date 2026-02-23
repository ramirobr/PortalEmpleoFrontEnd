"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CandidateSearchResult } from "@/types/company";
import { searchCandidates } from "@/lib/company/candidates";

const getNumericParam = (n: string | null) =>
  isNaN(Number(n)) || n === null ? undefined : Number(n);

export function useCandidates(token?: string) {
  const searchParams = useSearchParams();
  const [candidates, setCandidates] = useState<CandidateSearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const pageSize = Number(searchParams.get("pageSize") ?? 10);
  const currentPage = Number(searchParams.get("page") ?? 1);
  const searchTerm = searchParams.get("q") ?? undefined;
  const edadMinima = getNumericParam(searchParams.get("edadMin"));
  const edadMaxima = getNumericParam(searchParams.get("edadMax"));
  const salarioMinimoEsperado = getNumericParam(searchParams.get("aspiracionMin"));
  const salarioMaximoEsperado = getNumericParam(searchParams.get("aspiracionMax"));
  const aniosExperienciaMin = getNumericParam(searchParams.get("experienciaMin"));
  const aniosExperienciaMax = getNumericParam(searchParams.get("experienciaMax"));
  const provincia = searchParams.get("provincia") ?? undefined;
  const ciudad = searchParams.get("ciudad") ?? undefined;
  const nivelEducacion = searchParams.get("nivelEducacion") ?? undefined;

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);

      try {
        const result = await searchCandidates(
          {
            pageSize,
            currentPage,
            searchTerm,
            edadMinima: edadMinima ?? null,
            edadMaxima: edadMaxima ?? null,
            salarioMinimoEsperado: salarioMinimoEsperado ?? null,
            salarioMaximoEsperado: salarioMaximoEsperado ?? null,
            aniosExperienciaMin: aniosExperienciaMin ?? null,
            aniosExperienciaMax: aniosExperienciaMax ?? null,
            // Aquí necesitarías convertir nombres a IDs si estás usando catálogos
            // Por ahora dejamos estos como 0 hasta que se implemente la conversión
            idProvincia: 0,
            idCiudad: 0,
            idNivelEstudio: 0,
          },
          token
        );

        if (result) {
          setTotal(result.totalItems);
          setCandidates(result.data);
        } else {
          setTotal(0);
          setCandidates([]);
        }
      } catch (e: unknown) {
        if (e instanceof Error && e.name !== "AbortError") {
          console.error("Error loading candidates:", e);
        }
        setTotal(0);
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [
    pageSize,
    currentPage,
    searchTerm,
    edadMinima,
    edadMaxima,
    salarioMinimoEsperado,
    salarioMaximoEsperado,
    aniosExperienciaMin,
    aniosExperienciaMax,
    provincia,
    ciudad,
    nivelEducacion,
    token,
  ]);

  return {
    candidates,
    total,
    loading,
  };
}
