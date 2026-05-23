"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Search, Shield, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminRole, RolePermiso } from "@/types/admin";
import {
  createRole,
  deleteRole,
  getAdminRoles,
  getPermisos,
  updateRole,
  updateRoleStatus,
} from "@/lib/admin/adminRoles";
import RolesTable from "./components/RolesTable";
import RoleFormDialog from "./components/RoleFormDialog";
import TablePagination from "@/components/shared/components/TablePagination";

export default function AdminRolesPage() {
  const { data: session } = useSession();
  const [dataState, setDataState] = useState({
    roles: [] as AdminRole[],
    totalItems: 0,
    loading: true,
  });
  const { roles, totalItems, loading } = dataState;

  const [permisos, setPermisos] = useState<RolePermiso[]>([]);
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<AdminRole | null>(null);

  useEffect(() => {
    getPermisos(session?.user?.accessToken).then((response) => {
      if (response?.isSuccess) setPermisos(response.data);
    });
  }, [session]);

  const fetchRoles = useCallback(async () => {
    await Promise.resolve();
    setDataState((prev) => ({ ...prev, loading: true }));
    const response = await getAdminRoles(
      {
        pageSize,
        currentPage,
        search,
        estado: estadoFilter === "todos" ? undefined : estadoFilter,
      },
      session?.user?.accessToken,
    );

    if (response?.isSuccess) {
      setDataState({
        roles: response.data.data,
        totalItems: response.data.totalItems,
        loading: false,
      });
    } else {
      setDataState((prev) => ({ ...prev, loading: false }));
      toast.error(response?.messages?.[0] ?? "No se pudieron cargar los roles");
    }
  }, [currentPage, estadoFilter, pageSize, search, session?.user?.accessToken]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void fetchRoles();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [fetchRoles]);

  const handleCreate = () => {
    setEditingRole(null);
    setIsFormOpen(true);
  };

  const handleEdit = (idRol: string) => {
    const role = roles.find((item) => item.idRol === idRol);
    if (role) {
      setEditingRole(role);
      setIsFormOpen(true);
    }
  };

  const handleToggleStatus = async (idRol: string) => {
    const role = roles.find((item) => item.idRol === idRol);
    if (role && ["Administrador Sistema", "Administrador Empresa", "Administrador de empresa", "Postulante"].includes(role.nombre)) {
      toast.error("No se puede desactivar un rol del sistema");
      return;
    }

    const nextEstado = role?.estado.nombre === "Activo" ? 2 : 1;
    const response = await updateRoleStatus(
      idRol,
      nextEstado,
      session?.user?.accessToken,
    );

    if (response?.isSuccess) {
      toast.success("Estado del rol actualizado");
      fetchRoles();
    } else {
      toast.error(response?.messages?.[0] ?? "No se pudo actualizar el rol");
    }
  };

  const handleDelete = async (idRol: string) => {
    const role = roles.find((item) => item.idRol === idRol);
    if (role && ["Administrador Sistema", "Administrador Empresa", "Administrador de empresa", "Postulante"].includes(role.nombre)) {
      toast.error("No se puede eliminar un rol del sistema");
      return;
    }

    if (!window.confirm("¿Eliminar este rol?")) return;

    const response = await deleteRole(idRol, session?.user?.accessToken);
    if (response?.isSuccess) {
      toast.success("Rol eliminado correctamente");
      fetchRoles();
    } else {
      toast.error(response?.messages?.[0] ?? "No se pudo eliminar el rol");
    }
  };

  const handleFormSubmit = async (data: {
    nombre: string;
    descripcion: string;
    permisos: string[];
  }) => {
    const response = editingRole
      ? await updateRole(
          { ...data, idRol: editingRole.idRol },
          session?.user?.accessToken,
        )
      : await createRole(data, session?.user?.accessToken);

    if (response?.isSuccess) {
      toast.success(editingRole ? "Rol actualizado correctamente" : "Rol creado correctamente");
      setIsFormOpen(false);
      setEditingRole(null);
      fetchRoles();
    } else {
      toast.error(response?.messages?.[0] ?? "No se pudo guardar el rol");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold flex items-center gap-3">
          <Shield className="size-8 text-primary" />
          Gestionar Roles
        </h1>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="size-4" />
          Nuevo Rol
        </Button>
      </div>

      <Card className="mb-6 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre o descripción..."
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
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <RolesTable
          roles={roles}
          loading={loading}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />

        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          itemLabel="roles"
          onPageChange={setCurrentPage}
          className="rounded-b-xl border-t border-zinc-100"
        />
      </Card>

      <RoleFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        role={editingRole}
        permisos={permisos}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
