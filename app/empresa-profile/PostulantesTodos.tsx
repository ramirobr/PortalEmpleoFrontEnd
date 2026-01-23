"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ApplicantCard from "@/components/shared/components/ApplicantCard";
import { fetchCandidatesList, type Candidate } from "@/lib/company/candidates";
import { CandidatosSearchFiltersResponse } from "@/types/company";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PostulantesTodosProps {
  filters: CandidatosSearchFiltersResponse | null;
}

export default function PostulantesTodos({ filters }: PostulantesTodosProps) {
  const { data: session } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [provincia, setProvincia] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [candidatos, setCandidatos] = useState<Candidate[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  // Load candidates on mount
  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const data = await fetchCandidatesList(
        {
          pageSize,
          currentPage,
          sortBy: "",
          sortDirection: "",
          idProvincia: provincia,
          idCiudad: ciudad,
          searchTermn: searchQuery,
        },
        session?.user.accessToken,
      );

      if (data) {
        setCandidatos(data.data);
        setTotalItems(data.totalItems);
      }
    } catch (error) {
      console.warn("Error loading candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = async () => {
    setCurrentPage(1);
    try {
      setLoading(true);
      const data = await fetchCandidatesList(
        {
          pageSize,
          currentPage: 1,
          sortBy: "",
          sortDirection: "",
          idProvincia: provincia,
          idCiudad: ciudad,
          searchTermn: searchQuery,
        },
        session?.user.accessToken,
      );

      if (data) {
        setCandidatos(data.data);
        setTotalItems(data.totalItems);
      }
    } catch (error) {
      console.warn("Error loading candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Top Search Bar */}

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Filter Panel (40%) */}
        <aside className="w-full md:w-[30%] bg-white p-6 rounded-lg shadow h-fit sticky top-4">
          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar postulantes..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">
            Filtros
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provincia
              </label>
              <Select
                value={provincia}
                onValueChange={(value) => {
                  setProvincia(value);
                  setCiudad("");
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  {filters?.provincia?.map((prov) => (
                    <SelectItem
                      key={prov.idCatalogo}
                      value={prov.idCatalogo.toString()}
                    >
                      {prov.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad
              </label>
              <Select
                value={ciudad}
                onValueChange={(value) => {
                  setCiudad(value);
                  setCurrentPage(1);
                }}
                disabled={!provincia}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
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

            <button
              onClick={handleApplyFilters}
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors mt-4 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Cargando..." : "Aplicar Filtros"}
            </button>
          </div>
        </aside>

        {/* List (60%) */}
        <div className="w-full md:w-[70%] flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Resultados ({totalItems})
          </h2>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <p className="text-gray-500">Cargando candidatos...</p>
            </div>
          ) : candidatos.length > 0 ? (
            candidatos.map((candidato) => (
              <ApplicantCard
                key={candidato.idUsuario}
                applicant={{
                  id: candidato.idUsuario,
                  name: candidato.nombreCompleto,
                  location: candidato.ubicacion,
                  salary: "",
                  skills: candidato.habilidades,
                  photo: candidato.fotografia,
                }}
              />
            ))
          ) : (
            <div className="flex justify-center items-center py-8">
              <p className="text-gray-500">No hay candidatos disponibles</p>
            </div>
          )}

          {/* Pagination Controls */}
          {totalItems > 0 && (
            <div className="flex justify-center mt-6 gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || loading}
                className="px-3 py-1 border rounded bg-white disabled:opacity-50 cursor-pointer"
              >
                Anterior
              </button>
              {Array.from(
                { length: Math.ceil(totalItems / pageSize) },
                (_, i) => i + 1,
              )
                .slice(
                  Math.max(0, currentPage - 3),
                  Math.min(Math.ceil(totalItems / pageSize), currentPage + 2),
                )
                .map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    disabled={loading}
                    className={`px-3 py-1 border rounded cursor-pointer ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              <button
                onClick={() =>
                  setCurrentPage(
                    Math.min(Math.ceil(totalItems / pageSize), currentPage + 1),
                  )
                }
                disabled={
                  currentPage >= Math.ceil(totalItems / pageSize) || loading
                }
                className="px-3 py-1 border rounded bg-white disabled:opacity-50 cursor-pointer"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
