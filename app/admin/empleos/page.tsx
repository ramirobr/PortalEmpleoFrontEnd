"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { CatalogsByType } from "@/types/search";
import {
  deleteEmpleo,
  getAdminEmpleos,
  updateEmpleoStatus,
} from "@/lib/admin/adminEmpleos";
import { getCatalogosByType } from "@/lib/admin/adminCatalogos";
import EmpleosTable from "./components/EmpleosTable";
import TablePagination from "@/components/shared/components/TablePagination";

export default function AdminEmpleosPage() {
  const { data: session } = useSession();
  const { push } = useRouter();
  const [data, setData] = useState({
    empleos: [] as AdminEmpleo[],
    totalItems: 0,
    loading: true,
  });
  const { empleos, loading, totalItems } = data;

  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("0");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [estadosVacante, setEstadosVacante] = useState<CatalogsByType[]>([]);

  // Fetch estados de vacante catalog
  useEffect(() => {
    const fetchEstados = async () => {
      const response = await getCatalogosByType(
        "ESTADO_VACANTE",
        session?.user?.accessToken,
      );
      setEstadosVacante(response);
    };
    fetchEstados();
  }, [session]);

  // Fetch empleos from real API
  const fetchEmpleos = async () => {
      await Promise.resolve();
      setData(prev => ({ ...prev, loading: true }));
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
        setData({
          empleos: response.data.data,
          totalItems: response.data.totalItems,
          loading: false,
        });
      } else {
        setData(prev => ({ ...prev, loading: false }));
        toast.error(response?.messages?.[0] ?? "No se pudieron cargar los empleos");
      }
    };

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void fetchEmpleos();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [session, currentPage, pageSize, search, estadoFilter]);

  const handleEdit = (idVacante: string) => {
    push(`/admin/empleos/${idVacante}`);
  };

  const handleStatusChange = async (idVacante: string) => {
    const empleo = empleos.find((item) => item.idVacante === idVacante);
    const activar = empleo?.estado.toLowerCase() !== "activa";
    const target = estadosVacante.find((item) =>
      activar
        ? item.nombre.toLowerCase() === "activa"
        : item.nombre.toLowerCase() === "cerrada",
    );

    if (!target) {
      toast.error("No se encontró el estado requerido en el catálogo");
      return;
    }

    const res = await updateEmpleoStatus(
      idVacante,
      target.idCatalogo,
      session?.user?.accessToken,
    );

    if (res?.isSuccess) {
      toast.success(`Vacante ${activar ? "activada" : "cerrada"} correctamente`);
      fetchEmpleos();
    } else {
      toast.error(res?.messages?.[0] ?? "No se pudo actualizar la vacante");
    }
  };

  const handleDelete = async (idVacante: string) => {
    if (!window.confirm("¿Eliminar esta vacante?")) return;

    const res = await deleteEmpleo(idVacante, session?.user?.accessToken);
    if (res?.isSuccess) {
      toast.success("Vacante eliminada correctamente");
      fetchEmpleos();
    } else {
      toast.error(res?.messages?.[0] ?? "No se pudo eliminar la vacante");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6 flex items-center gap-3">
        <Briefcase className="size-8 text-primary" />
        Gestionar Empleos
      </h1>

      {/* Filters */}
      <Card className="mb-6 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
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
            <SelectTrigger className="w-full lg:w-48">
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
          className="rounded-b-xl border-t border-zinc-100"
        />
      </Card>
    </div>
  );
}
