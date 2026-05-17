"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Search, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminCandidato } from "@/types/admin";
import { mockCandidatos } from "@/lib/admin/adminCandidatos";
import CandidatosTable from "./components/CandidatosTable";
import TablePagination from "@/components/shared/components/TablePagination";

export default function AdminCandidatosPage() {
  const { data: session } = useSession();
  const [candidatos, setCandidatos] = useState<AdminCandidato[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch candidatos (using mock data for now)
  useEffect(() => {
    let cancelled = false;
    let timerId: ReturnType<typeof setTimeout>;
    const fetchCandidatos = async () => {
      setLoading(true);
      await new Promise<void>((resolve) => {
        timerId = setTimeout(resolve, 500);
      });
      if (cancelled) return;
      setCandidatos(mockCandidatos);
      setLoading(false);
    };

    fetchCandidatos();
    return () => {
      cancelled = true;
      clearTimeout(timerId);
    };
  }, [session, currentPage, pageSize]);

  // Filter candidatos based on search and filters
  const filteredCandidatos = useMemo(() => {
    return candidatos.filter((candidato) => {
      const matchesSearch =
        search === "" ||
        candidato.nombreCompleto.toLowerCase().includes(search.toLowerCase()) ||
        candidato.email.toLowerCase().includes(search.toLowerCase());

      const matchesEstado =
        estadoFilter === "todos" ||
        candidato.estado.nombre.toLowerCase() === estadoFilter.toLowerCase();

      return matchesSearch && matchesEstado;
    });
  }, [candidatos, search, estadoFilter]);

  // Paginate filtered results
  const paginatedCandidatos = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredCandidatos.slice(startIndex, startIndex + pageSize);
  }, [filteredCandidatos, currentPage, pageSize]);

  const totalItems = filteredCandidatos.length;

  const handleView = (idUsuario: string) => {
    // TODO: Navigate to candidato profile
    console.log("View candidato:", idUsuario);
  };

  const handleSuspend = async (idUsuario: string) => {
    // TODO: Implement with real API
    console.log("Suspend candidato:", idUsuario);
    setCandidatos((prev) =>
      prev.map((c) =>
        c.idUsuario === idUsuario
          ? {
              ...c,
              estado:
                c.estado.nombre === "Activo"
                  ? { id: 2, nombre: "Suspendido" }
                  : { id: 1, nombre: "Activo" },
            }
          : c,
      ),
    );
  };

  const handleDelete = async (idUsuario: string) => {
    // TODO: Implement with real API and confirmation dialog
    console.log("Delete candidato:", idUsuario);
    setCandidatos((prev) => prev.filter((c) => c.idUsuario !== idUsuario));
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6 flex items-center gap-3">
        <Users className="size-8 text-primary" />
        Gestionar Candidatos
      </h1>

      {/* Filters */}
      <Card className="mb-6 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          {/* Estado Filter */}
          <Select
            value={estadoFilter}
            onValueChange={(value) => {
              setEstadoFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="suspendido">Suspendido</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {/* Table */}
        <CandidatosTable
          candidatos={paginatedCandidatos}
          loading={loading}
          onView={handleView}
          onSuspend={handleSuspend}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          itemLabel="candidatos"
          onPageChange={setCurrentPage}
          className="rounded-b-xl border-t border-zinc-100"
        />
      </Card>
    </div>
  );
}
