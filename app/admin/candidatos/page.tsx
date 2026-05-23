"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { AdminCandidato, AdminCandidatoUpdateRequest } from "@/types/admin";
import { UserInfoData } from "@/types/user";
import { CatalogsByType } from "@/types/search";
import { getCatalogosByType } from "@/lib/admin/adminCatalogos";
import {
  deleteCandidato,
  getAdminCandidatoById,
  getAdminCandidatos,
  updateAdminCandidato,
  updateCandidatoStatus,
} from "@/lib/admin/adminCandidatos";
import { getUserRolePermissions } from "@/lib/admin/adminPermissions";
import CandidatosTable from "./components/CandidatosTable";
import CandidatoEditDialog from "./components/CandidatoEditDialog";
import TablePagination from "@/components/shared/components/TablePagination";

export default function AdminCandidatosPage() {
  const { data: session } = useSession();
  const { push } = useRouter();
  const [dataState, setDataState] = useState({
    candidatos: [] as AdminCandidato[],
    totalItems: 0,
    loading: true,
  });
  const { candidatos, totalItems, loading } = dataState;

  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("0");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [catalogState, setCatalogState] = useState({
    estadoOptions: [] as CatalogsByType[],
    tipoDocumentoOptions: [] as CatalogsByType[],
    generoOptions: [] as CatalogsByType[],
    estadoCivilOptions: [] as CatalogsByType[],
    tipoEmpleoOptions: [] as CatalogsByType[],
    paisOptions: [] as CatalogsByType[],
    provinciaOptions: [] as CatalogsByType[],
    ciudadOptions: [] as CatalogsByType[],
  });
  const { estadoOptions } = catalogState;
  const [permissionCodes, setPermissionCodes] = useState<Set<string>>(new Set());
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCandidato, setSelectedCandidato] = useState<UserInfoData | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    const token = session?.user?.accessToken;
    Promise.all([
      getCatalogosByType("ESTADO_CUENTA", token),
      getCatalogosByType("TIPO_DOCUMENTO", token),
      getCatalogosByType("GENERO", token),
      getCatalogosByType("ESTADO_CIVIL", token),
      getCatalogosByType("TIPO_EMPLEO", token),
      getCatalogosByType("PAIS", token),
      getCatalogosByType("PROVINCIA", token),
      getCatalogosByType("CIUDAD", token),
    ]).then(
      ([
        estados,
        tiposDocumento,
        generos,
        estadosCivil,
        tiposEmpleo,
        paises,
        provincias,
        ciudades,
      ]) => {
        setCatalogState({
          estadoOptions: estados || [],
          tipoDocumentoOptions: tiposDocumento || [],
          generoOptions: generos || [],
          estadoCivilOptions: estadosCivil || [],
          tipoEmpleoOptions: tiposEmpleo || [],
          paisOptions: paises || [],
          provinciaOptions: provincias || [],
          ciudadOptions: ciudades || [],
        });
      },
    );
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

  const fetchCandidatos = useCallback(async () => {
    await Promise.resolve();
    setDataState((prev) => ({ ...prev, loading: true }));
    const response = await getAdminCandidatos(
      {
        pageSize,
        currentPage,
        search,
        estado: estadoFilter === "0" ? undefined : estadoFilter,
      },
      session?.user?.accessToken,
    );

    if (response?.isSuccess) {
      setDataState({
        candidatos: response.data.data,
        totalItems: response.data.totalItems,
        loading: false,
      });
    } else {
      setDataState((prev) => ({ ...prev, loading: false }));
      toast.error(response?.messages?.[0] ?? "No se pudieron cargar los candidatos");
    }
  }, [currentPage, estadoFilter, pageSize, search, session?.user?.accessToken]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void fetchCandidatos();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [fetchCandidatos]);

  const hasPermission = (code: string) => permissionCodes.has(code);

  const handleView = (idUsuario: string) => {
    push(`/admin/candidatos/${idUsuario}`);
  };

  const handleEdit = async (idUsuario: string) => {
    setEditOpen(true);
    setEditLoading(true);
    setSelectedCandidato(null);

    const response = await getAdminCandidatoById(idUsuario, session?.user?.accessToken);
    if (response?.isSuccess) {
      setSelectedCandidato(response.data);
    } else {
      toast.error(response?.messages?.[0] ?? "No se pudo cargar el candidato");
      setEditOpen(false);
    }

    setEditLoading(false);
  };

  const handleSaveCandidato = async (data: AdminCandidatoUpdateRequest) => {
    setEditSaving(true);
    const response = await updateAdminCandidato(data, session?.user?.accessToken);
    setEditSaving(false);

    if (response?.isSuccess) {
      toast.success("Candidato actualizado correctamente");
      setEditOpen(false);
      setSelectedCandidato(null);
      void fetchCandidatos();
    } else {
      toast.error(response?.messages?.[0] ?? "No se pudo actualizar el candidato");
    }
  };

  const handleSuspend = async (idUsuario: string) => {
    const candidato = candidatos.find((item) => item.idUsuario === idUsuario);
    const activar = candidato?.estado.nombre.toLowerCase() !== "activa";
    const target = estadoOptions.find((item) =>
      activar
        ? item.nombre.toLowerCase() === "activa"
        : ["suspendida", "suspendido", "inactiva", "inactivo"].includes(
            item.nombre.toLowerCase(),
          ),
    );

    if (!target) {
      toast.error("No se encontró el estado requerido en el catálogo");
      return;
    }

    const res = await updateCandidatoStatus(
      idUsuario,
      target.idCatalogo,
      session?.user?.accessToken,
    );

    if (res?.isSuccess) {
      toast.success(`Candidato ${activar ? "activado" : "suspendido"} correctamente`);
      void fetchCandidatos();
    } else {
      toast.error(res?.messages?.[0] ?? "No se pudo actualizar el candidato");
    }
  };

  const handleDelete = async (idUsuario: string) => {
    if (!window.confirm("¿Dar de baja este candidato?")) return;

    const res = await deleteCandidato(idUsuario, session?.user?.accessToken);
    if (res?.isSuccess) {
      toast.success("Candidato dado de baja correctamente");
      void fetchCandidatos();
    } else {
      toast.error(res?.messages?.[0] ?? "No se pudo dar de baja el candidato");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6 flex items-center gap-3">
        <Users className="size-8 text-primary" />
        Gestionar Candidatos
      </h1>

      <Card className="mb-6 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
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
        <CandidatosTable
          candidatos={candidatos}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onSuspend={handleSuspend}
          onDelete={handleDelete}
          canEdit={hasPermission("ADMIN_CANDIDATOS_EDIT")}
          canChangeStatus={hasPermission("ADMIN_CANDIDATOS_STATUS")}
          canDelete={hasPermission("ADMIN_CANDIDATOS_DELETE")}
        />

        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          itemLabel="candidatos"
          onPageChange={setCurrentPage}
          className="rounded-b-xl border-t border-zinc-100"
        />
      </Card>

      <CandidatoEditDialog
        key={selectedCandidato?.userId ?? "candidato-edit-empty"}
        open={editOpen}
        candidato={selectedCandidato}
        catalogs={catalogState}
        loading={editLoading}
        saving={editSaving}
        onOpenChange={setEditOpen}
        onSubmit={handleSaveCandidato}
      />
    </div>
  );
}
