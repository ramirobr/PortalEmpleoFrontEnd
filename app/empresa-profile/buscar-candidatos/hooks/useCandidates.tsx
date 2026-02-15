"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CandidateSearchResult } from "@/types/company";
import mockCandidates from "@/lib/mocks/candidates.json";

const getNumericParam = (n: string | null) =>
  isNaN(Number(n)) || n === null ? undefined : Number(n);

export function useCandidates(token?: string) {
  const searchParams = useSearchParams();
  const [candidates, setCandidates] = useState<CandidateSearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const pageSize = Number(searchParams.get("pageSize") ?? 10);
  const currentPage = Number(searchParams.get("page") ?? 1);
  const searchTerm = searchParams.get("q")?.toLowerCase() ?? undefined;
  const edadMinima = getNumericParam(searchParams.get("edadMin"));
  const edadMaxima = getNumericParam(searchParams.get("edadMax"));
  const aspiracionMin = getNumericParam(searchParams.get("aspiracionMin"));
  const aspiracionMax = getNumericParam(searchParams.get("aspiracionMax"));
  const experienciaMin = getNumericParam(searchParams.get("experienciaMin"));
  const experienciaMax = getNumericParam(searchParams.get("experienciaMax"));
  const provincia = searchParams.get("provincia") ?? undefined;
  const ciudad = searchParams.get("ciudad") ?? undefined;
  const nivelEducacion = searchParams.get("nivelEducacion") ?? undefined;
  const preferenciaTurno = searchParams.get("preferenciaTurno") ?? undefined;

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Filter candidates based on search params
        let filtered = mockCandidates as CandidateSearchResult[];

        // Search term filter (search in name and skills)
        if (searchTerm) {
          filtered = filtered.filter(
            (c) =>
              c.nombreCompleto.toLowerCase().includes(searchTerm) ||
              c.habilidades.some((h) => h.toLowerCase().includes(searchTerm))
          );
        }

        // Age filter
        if (edadMinima !== undefined) {
          filtered = filtered.filter((c) => c.edad >= edadMinima);
        }
        if (edadMaxima !== undefined) {
          filtered = filtered.filter((c) => c.edad <= edadMaxima);
        }

        // Salary filter
        if (aspiracionMin !== undefined) {
          filtered = filtered.filter((c) => c.aspiracionSalarial >= aspiracionMin);
        }
        if (aspiracionMax !== undefined) {
          filtered = filtered.filter((c) => c.aspiracionSalarial <= aspiracionMax);
        }

        // Experience filter
        if (experienciaMin !== undefined) {
          filtered = filtered.filter((c) => c.aniosExperiencia >= experienciaMin);
        }
        if (experienciaMax !== undefined) {
          filtered = filtered.filter((c) => c.aniosExperiencia <= experienciaMax);
        }

        // Province filter
        if (provincia) {
          filtered = filtered.filter((c) => c.provincia === provincia);
        }

        // City filter
        if (ciudad) {
          filtered = filtered.filter((c) => c.ciudad === ciudad);
        }

        // Education level filter
        if (nivelEducacion) {
          filtered = filtered.filter((c) => c.nivelEducacion === nivelEducacion);
        }

        // Shift preference filter
        if (preferenciaTurno) {
          filtered = filtered.filter((c) => c.preferenciaTurno === preferenciaTurno);
        }

        // Calculate pagination
        const totalItems = filtered.length;
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = filtered.slice(startIndex, endIndex);

        setTotal(totalItems);
        setCandidates(paginatedData);
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
    edadMinima,
    edadMaxima,
    aspiracionMin,
    aspiracionMax,
    experienciaMin,
    experienciaMax,
    provincia,
    ciudad,
    nivelEducacion,
    preferenciaTurno,
    token,
  ]);

  return {
    candidates,
    total,
    loading,
  };
}
