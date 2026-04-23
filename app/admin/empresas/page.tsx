"use client";

import { useState, useEffect } from "react";
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
import { CatalogsByType } from "@/types/search";
import { getCatalogosByType } from "@/lib/admin/adminCatalogos";
import { getAdminEmpresas } from "@/lib/admin/adminEmpresas";
import EmpresasTable from "./components/EmpresasTable";
import TablePagination from "@/components/shared/components/TablePagination";

export default function AdminEmpresasPage() {
  const { data: session } = useSession();
  const [empresas, setEmpresas] = useState<AdminEmpresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("0");
  const [planFilter, setPlanFilter] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [estadoOptions, setEstadoOptions] = useState<CatalogsByType[]>([]);
  const [planOptions, setPlanOptions] = useState<CatalogsByType[]>([]);

  useEffect(() => {
    const token = session?.user?.accessToken;
    getCatalogosByType("ESTADO_EMPRESA", token).then(setEstadoOptions);
    getCatalogosByType("PLAN_EMPRESA", token).then(setPlanOptions);
  }, [session]);

  useEffect(() => {
    const fetchEmpresas = async () => {
      setLoading(true);
      const response = await getAdminEmpresas(
        {
          pageSize,
          currentPage,
          searchQuery: search,
          idEstado: parseInt(estadoFilter),
          plan: planFilter === "todos" ? "" : planFilter,
        },
        session?.user?.accessToken,
      );
      if (response?.isSuccess) {
        setEmpresas(response.data.data);
        setTotalItems(response.data.totalItems);
      }
      setLoading(false);
    };

    fetchEmpresas();
  }, [session, currentPage, pageSize, search, estadoFilter, planFilter]);

  const handleEdit = (idEmpresa: string) => {
    console.log("Edit empresa:", idEmpresa);
  };

  const handleSuspend = async (idEmpresa: string) => {
    console.log("Suspend empresa:", idEmpresa);
  };

  const handleDelete = async (idEmpresa: string) => {
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
              <SelectItem value="0">Todos los estados</SelectItem>
              {estadoOptions.map((item) => (
                <SelectItem key={item.idCatalogo} value={item.idCatalogo.toString()}>
                  {item.nombre}
                </SelectItem>
              ))}
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
              {planOptions.map((item) => (
                <SelectItem key={item.idCatalogo} value={item.nombre}>
                  {item.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <EmpresasTable
          empresas={empresas}
          loading={loading}
          onEdit={handleEdit}
          onSuspend={handleSuspend}
          onDelete={handleDelete}
        />
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
