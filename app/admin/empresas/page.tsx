"use client";

import { useCallback, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
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
import { AdminEmpresa, AdminEmpresaUpdateRequest } from "@/types/admin";
import { CatalogsByType } from "@/types/search";
import { getCatalogosByType } from "@/lib/admin/adminCatalogos";
import {
  deleteEmpresa,
  getAdminEmpresaById,
  getAdminEmpresas,
  updateAdminEmpresa,
  updateEmpresaStatus,
} from "@/lib/admin/adminEmpresas";
import { getUserRolePermissions } from "@/lib/admin/adminPermissions";
import { CompanyProfileData } from "@/types/company";
import EmpresasTable from "./components/EmpresasTable";
import EmpresaEditDialog from "./components/EmpresaEditDialog";
import TablePagination from "@/components/shared/components/TablePagination";

export default function AdminEmpresasPage() {
  const { data: session } = useSession();
  const [dataState, setDataState] = useState({
    empresas: [] as AdminEmpresa[],
    totalItems: 0,
    loading: true,
  });
  const { empresas, totalItems, loading } = dataState;

  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("0");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [catalogState, setCatalogState] = useState({
    estadoOptions: [] as CatalogsByType[],
    condicionFiscalOptions: [] as CatalogsByType[],
    industriaOptions: [] as CatalogsByType[],
    cantidadEmpleadosOptions: [] as CatalogsByType[],
    ciudadOptions: [] as CatalogsByType[],
    generoOptions: [] as CatalogsByType[],
  });
  const { estadoOptions } = catalogState;
  const [permissionCodes, setPermissionCodes] = useState<Set<string>>(new Set());
  const [editOpen, setEditOpen] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<CompanyProfileData | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    const token = session?.user?.accessToken;
    Promise.all([
      getCatalogosByType("ESTADO_EMPRESA", token),
      getCatalogosByType("CONDICION_FISCAL", token),
      getCatalogosByType("INDUSTRIA", token),
      getCatalogosByType("CANTIDAD_EMPLEADOS", token),
      getCatalogosByType("CIUDAD", token),
      getCatalogosByType("GENERO", token),
    ]).then(([estados, condiciones, industrias, cantidades, ciudades, generos]) => {
      setCatalogState({
        estadoOptions: estados || [],
        condicionFiscalOptions: condiciones || [],
        industriaOptions: industrias || [],
        cantidadEmpleadosOptions: cantidades || [],
        ciudadOptions: ciudades || [],
        generoOptions: generos || [],
      });
    });
  }, [session]);

  useEffect(() => {
    if (!session?.user?.id) return;

    getUserRolePermissions(session.user.id, session.user.accessToken).then((response) => {
      const codes = response?.isSuccess
        ? response.data.permisos
            .map((permiso) => permiso.codigo)
            .filter((code): code is string => Boolean(code))
        : [];
      setPermissionCodes(new Set(codes));
    });
  }, [session]);

  const fetchEmpresas = useCallback(async () => {
      await Promise.resolve();
      setDataState((prev) => ({ ...prev, loading: true }));
      const response = await getAdminEmpresas(
        {
          pageSize,
          currentPage,
          searchQuery: search,
          idEstado: parseInt(estadoFilter),
        },
        session?.user?.accessToken,
      );
      if (response?.isSuccess) {
        setDataState({
          empresas: response.data.data,
          totalItems: response.data.totalItems,
          loading: false,
        });
      } else {
        setDataState((prev) => ({ ...prev, loading: false }));
        toast.error(response?.messages?.[0] ?? "No se pudieron cargar las empresas");
      }
    }, [currentPage, estadoFilter, pageSize, search, session?.user?.accessToken]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void fetchEmpresas();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [fetchEmpresas]);

  const hasPermission = (code: string) => permissionCodes.has(code);

  const handleEdit = async (idEmpresa: string) => {
    setEditOpen(true);
    setEditLoading(true);
    setSelectedEmpresa(null);

    const response = await getAdminEmpresaById(idEmpresa, session?.user?.accessToken);
    if (response?.isSuccess) {
      setSelectedEmpresa(response.data);
    } else {
      toast.error(response?.messages?.[0] ?? "No se pudo cargar la empresa");
      setEditOpen(false);
    }

    setEditLoading(false);
  };

  const handleSaveEmpresa = async (data: AdminEmpresaUpdateRequest) => {
    setEditSaving(true);
    const response = await updateAdminEmpresa(data, session?.user?.accessToken);
    setEditSaving(false);

    if (response?.isSuccess) {
      toast.success("Empresa actualizada correctamente");
      setEditOpen(false);
      setSelectedEmpresa(null);
      void fetchEmpresas();
    } else {
      toast.error(response?.messages?.[0] ?? "No se pudo actualizar la empresa");
    }
  };

  const handleSuspend = async (idEmpresa: string) => {
    const empresa = empresas.find((item) => item.idEmpresa === idEmpresa);
    const activar = empresa?.estado.toLowerCase() !== "activa";
    const target = estadoOptions.find((item) =>
      activar
        ? item.nombre.toLowerCase() === "activa"
        : item.nombre.toLowerCase() === "suspendida",
    );

    if (!target) {
      toast.error("No se encontró el estado requerido en el catálogo");
      return;
    }

    const res = await updateEmpresaStatus(
      { idEmpresa, nuevoEstado: target.idCatalogo },
      session?.user?.accessToken,
    );

    if (res?.isSuccess) {
      toast.success(`Empresa ${activar ? "activada" : "suspendida"} correctamente`);
      void fetchEmpresas();
    } else {
      toast.error(res?.messages?.[0] ?? "No se pudo actualizar la empresa");
    }
  };

  const handleDelete = async (idEmpresa: string) => {
    if (!window.confirm("¿Dar de baja esta empresa?")) return;

    const res = await deleteEmpresa(idEmpresa, session?.user?.accessToken);
    if (res?.isSuccess) {
      toast.success("Empresa dada de baja correctamente");
      void fetchEmpresas();
    } else {
      toast.error(res?.messages?.[0] ?? "No se pudo dar de baja la empresa");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6 flex items-center gap-3">
        <Building2 className="size-8 text-primary" />
        Gestionar Empresas
      </h1>

      {/* Filters */}
      <Card className="mb-6 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
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
            <SelectTrigger className="w-full lg:w-48">
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

        </div>
      </Card>

      <Card className="overflow-hidden">
        <EmpresasTable
          empresas={empresas}
          loading={loading}
          onEdit={handleEdit}
          onSuspend={handleSuspend}
          onDelete={handleDelete}
          canEdit={hasPermission("ADMIN_EMPRESAS_EDIT")}
          canChangeStatus={hasPermission("ADMIN_EMPRESAS_STATUS")}
          canDelete={hasPermission("ADMIN_EMPRESAS_DELETE")}
        />
        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          itemLabel="empresas"
          onPageChange={setCurrentPage}
          className="rounded-b-xl border-t border-zinc-100"
        />
      </Card>

      <EmpresaEditDialog
        key={selectedEmpresa?.idEmpresa ?? "empresa-edit-empty"}
        open={editOpen}
        empresa={selectedEmpresa}
        catalogs={catalogState}
        loading={editLoading}
        saving={editSaving}
        onOpenChange={setEditOpen}
        onSubmit={handleSaveEmpresa}
      />
    </div>
  );
}
