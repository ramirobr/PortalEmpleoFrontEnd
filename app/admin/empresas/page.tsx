"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Search, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminEmpresa } from "@/types/admin";
import { mockEmpresas } from "@/lib/admin/adminEmpresas";
import EmpresasTable from "./components/EmpresasTable";
import TablePagination from "@/components/shared/components/TablePagination";

export default function AdminEmpresasPage() {
  const { data: session } = useSession();
  const [empresas, setEmpresas] = useState<AdminEmpresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const [planFilter, setPlanFilter] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch empresas (using mock data for now)
  useEffect(() => {
    const fetchEmpresas = async () => {
      setLoading(true);
      // TODO: Replace with real API call when available
      // const response = await getAdminEmpresas(
      //   { pageSize, currentPage, search, estado: estadoFilter, plan: planFilter },
      //   session?.user?.accessToken
      // );
      // if (response?.isSuccess) {
      //   setEmpresas(response.data.data);
      // }

      // Using mock data for development
      await new Promise((resolve) => setTimeout(resolve, 500));
      setEmpresas(mockEmpresas);
      setLoading(false);
    };

    fetchEmpresas();
  }, [session, currentPage, pageSize]);

  // Filter empresas based on search and filters
  const filteredEmpresas = useMemo(() => {
    return empresas.filter((empresa) => {
      const matchesSearch =
        search === "" ||
        empresa.nombreEmpresa.toLowerCase().includes(search.toLowerCase()) ||
        empresa.rut.toLowerCase().includes(search.toLowerCase());

      const matchesEstado =
        estadoFilter === "todos" ||
        empresa.estado.nombre.toLowerCase() === estadoFilter.toLowerCase();

      const matchesPlan =
        planFilter === "todos" ||
        empresa.plan.nombre.toLowerCase() === planFilter.toLowerCase();

      return matchesSearch && matchesEstado && matchesPlan;
    });
  }, [empresas, search, estadoFilter, planFilter]);

  // Paginate filtered results
  const paginatedEmpresas = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredEmpresas.slice(startIndex, startIndex + pageSize);
  }, [filteredEmpresas, currentPage, pageSize]);

  const totalItems = filteredEmpresas.length;

  const handleEdit = (idEmpresa: string) => {
    // TODO: Navigate to edit page or open modal
    console.log("Edit empresa:", idEmpresa);
  };

  const handleSuspend = async (idEmpresa: string) => {
    // TODO: Implement with real API
    console.log("Suspend empresa:", idEmpresa);
    // Update local state for demo
    setEmpresas((prev) =>
      prev.map((e) =>
        e.idEmpresa === idEmpresa
          ? {
              ...e,
              estado:
                e.estado.nombre === "Activo"
                  ? { id: 2, nombre: "Suspendido" }
                  : { id: 1, nombre: "Activo" },
            }
          : e,
      ),
    );
  };

  const handleDelete = async (idEmpresa: string) => {
    // TODO: Implement with real API and confirmation dialog
    console.log("Delete empresa:", idEmpresa);
    setEmpresas((prev) => prev.filter((e) => e.idEmpresa !== idEmpresa));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Building2 className="w-8 h-8 text-primary" />
        Gestionar Empresas
      </h1>

      {/* Filters */}
      <Card className="mb-6 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre o RUT..."
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
              <SelectItem value="suspendido">Suspendido</SelectItem>
            </SelectContent>
          </Select>

          {/* Plan Filter */}
          <Select
            value={planFilter}
            onValueChange={(value) => {
              setPlanFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los planes</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="básico">Básico</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {/* Table */}
        <EmpresasTable
          empresas={paginatedEmpresas}
          loading={loading}
          onEdit={handleEdit}
          onSuspend={handleSuspend}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          itemLabel="empresas"
          onPageChange={setCurrentPage}
          className="rounded-b-xl border-t border-gray-100"
        />
      </Card>
    </div>
  );
}
