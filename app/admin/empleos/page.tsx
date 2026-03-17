"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
import { CatalogsByType, CatalogsByTypeResponse } from "@/types/search";
import { getAdminEmpleos } from "@/lib/admin/adminEmpleos";
import { fetchApi } from "@/lib/apiClient";
import EmpleosTable from "./components/EmpleosTable";
import TablePagination from "@/components/shared/components/TablePagination";

export default function AdminEmpleosPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [empleos, setEmpleos] = useState<AdminEmpleo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("0");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [estadosVacante, setEstadosVacante] = useState<CatalogsByType[]>([]);

  // Fetch estados de vacante catalog
  useEffect(() => {
    const fetchEstados = async () => {
      const response = await fetchApi<CatalogsByTypeResponse>(
        "/Catalog/getAllCatalogsByType/ESTADO_VACANTE",
      );
      if (response?.isSuccess && response.data) {
        setEstadosVacante(response.data);
      }
    };
    fetchEstados();
  }, []);

  // Fetch empleos from real API
  useEffect(() => {
    const fetchEmpleos = async () => {
      setLoading(true);
      const response = await getAdminEmpleos(
        {
          pageSize,
          currentPage,
          searchQuery: search,
          idEstado: parseInt(estadoFilter, 10),
        },
        session?.user?.accessToken,
      );
      if (response?.isSuccess) {
        setEmpleos(response.data.data);
        setTotalItems(response.data.totalItems);
      }
      setLoading(false);
    };

    fetchEmpleos();
  }, [session, currentPage, pageSize, search, estadoFilter]);

  const handleEdit = (idVacante: string) => {
    router.push(`/admin/empleos/${idVacante}`);
  };

  const handleStatusChange = async (idVacante: string) => {
    // TODO: Implement with real API
    console.log("Change status vacante:", idVacante);
    setEmpleos((prev) =>
      prev.map((e) =>
        e.idVacante === idVacante
          ? {
              ...e,
              estado: e.estado === "Activa" ? "Cerrada" : "Activa",
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
              <SelectItem value="0">Todos los estados</SelectItem>
              {estadosVacante.map((estado) => (
                <SelectItem
                  key={estado.idCatalogo}
                  value={estado.idCatalogo.toString()}
                >
                  {estado.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {/* Table */}
        <EmpleosTable
          empleos={empleos}
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
