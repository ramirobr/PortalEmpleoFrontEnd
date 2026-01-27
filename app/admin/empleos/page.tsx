"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Search, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminEmpleo } from "@/types/admin";
import { mockEmpleos } from "@/lib/admin/adminEmpleos";
import EmpleosTable from "./components/EmpleosTable";
import TablePagination from "@/components/shared/components/TablePagination";

export default function AdminEmpleosPage() {
  const { data: session } = useSession();
  const [empleos, setEmpleos] = useState<AdminEmpleo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch empleos (using mock data for now)
  useEffect(() => {
    const fetchEmpleos = async () => {
      setLoading(true);
      // TODO: Replace with real API call when available
      // const response = await getAdminEmpleos(
      //   { pageSize, currentPage, search, estado: estadoFilter },
      //   session?.user?.accessToken
      // );
      // if (response?.isSuccess) {
      //   setEmpleos(response.data.data);
      // }

      // Using mock data for development
      await new Promise((resolve) => setTimeout(resolve, 500));
      setEmpleos(mockEmpleos);
      setLoading(false);
    };

    fetchEmpleos();
  }, [session, currentPage, pageSize]);

  // Filter empleos based on search and filters
  const filteredEmpleos = useMemo(() => {
    return empleos.filter((empleo) => {
      const matchesSearch =
        search === "" ||
        empleo.titulo.toLowerCase().includes(search.toLowerCase()) ||
        empleo.empresa.nombre.toLowerCase().includes(search.toLowerCase());

      const matchesEstado =
        estadoFilter === "todos" ||
        empleo.estado.nombre.toLowerCase() === estadoFilter.toLowerCase();

      return matchesSearch && matchesEstado;
    });
  }, [empleos, search, estadoFilter]);

  // Paginate filtered results
  const paginatedEmpleos = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredEmpleos.slice(startIndex, startIndex + pageSize);
  }, [filteredEmpleos, currentPage, pageSize]);

  const totalItems = filteredEmpleos.length;

  const handleEdit = (idVacante: string) => {
    // TODO: Navigate to edit page or open modal
    console.log("Edit vacante:", idVacante);
  };

  const handleStatusChange = async (idVacante: string) => {
    // TODO: Implement with real API
    console.log("Change status vacante:", idVacante);
    setEmpleos((prev) =>
      prev.map((e) =>
        e.idVacante === idVacante
          ? {
              ...e,
              estado:
                e.estado.nombre === "Activo"
                  ? { id: 2, nombre: "Cerrado" }
                  : { id: 1, nombre: "Activo" },
            }
          : e,
      ),
    );
  };

  const handleDelete = async (idVacante: string) => {
    // TODO: Implement with real API and confirmation dialog
    console.log("Delete vacante:", idVacante);
    setEmpleos((prev) => prev.filter((e) => e.idVacante !== idVacante));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Briefcase className="w-8 h-8 text-primary" />
        Gestionar Empleos
      </h1>

      {/* Filters */}
      <Card className="mb-6 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por título o empresa..."
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
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="cerrado">Cerrado</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {/* Table */}
        <EmpleosTable
          empleos={paginatedEmpleos}
          loading={loading}
          onEdit={handleEdit}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          itemLabel="empleos"
          onPageChange={setCurrentPage}
          className="rounded-b-xl border-t border-gray-100"
        />
      </Card>
    </div>
  );
}
