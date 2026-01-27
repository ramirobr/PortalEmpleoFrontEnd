"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
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
import { AdminRole } from "@/types/admin";
import { mockRoles } from "@/lib/admin/adminRoles";
import RolesTable from "./components/RolesTable";
import RoleFormDialog from "./components/RoleFormDialog";
import TablePagination from "@/components/shared/components/TablePagination";

export default function AdminRolesPage() {
  const { data: session } = useSession();
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<AdminRole | null>(null);

  // Fetch roles (using mock data for now)
  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      // TODO: Replace with real API call when available
      // const response = await getAdminRoles(
      //   { pageSize, currentPage, search, estado: estadoFilter },
      //   session?.user?.accessToken
      // );
      // if (response?.isSuccess) {
      //   setRoles(response.data.data);
      // }

      // Using mock data for development
      await new Promise((resolve) => setTimeout(resolve, 500));
      setRoles(mockRoles);
      setLoading(false);
    };

    fetchRoles();
  }, [session, currentPage, pageSize]);

  // Filter roles based on search and filters
  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const matchesSearch =
        search === "" ||
        role.nombre.toLowerCase().includes(search.toLowerCase()) ||
        role.descripcion.toLowerCase().includes(search.toLowerCase());

      const matchesEstado =
        estadoFilter === "todos" ||
        role.estado.nombre.toLowerCase() === estadoFilter.toLowerCase();

      return matchesSearch && matchesEstado;
    });
  }, [roles, search, estadoFilter]);

  // Paginate filtered results
  const paginatedRoles = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredRoles.slice(startIndex, startIndex + pageSize);
  }, [filteredRoles, currentPage, pageSize]);

  const totalItems = filteredRoles.length;

  const handleCreate = () => {
    setEditingRole(null);
    setIsFormOpen(true);
  };

  const handleEdit = (idRol: string) => {
    const role = roles.find((r) => r.idRol === idRol);
    if (role) {
      setEditingRole(role);
      setIsFormOpen(true);
    }
  };

  const handleToggleStatus = async (idRol: string) => {
    // TODO: Implement with real API
    console.log("Toggle status for role:", idRol);
    // Update local state for demo
    setRoles((prev) =>
      prev.map((r) =>
        r.idRol === idRol
          ? {
              ...r,
              estado:
                r.estado.nombre === "Activo"
                  ? { id: 2, nombre: "Inactivo" }
                  : { id: 1, nombre: "Activo" },
            }
          : r,
      ),
    );
  };

  const handleDelete = async (idRol: string) => {
    // TODO: Implement with real API and confirmation dialog
    console.log("Delete role:", idRol);
    setRoles((prev) => prev.filter((r) => r.idRol !== idRol));
  };

  const handleFormSubmit = async (data: {
    nombre: string;
    descripcion: string;
    permisos: string[];
  }) => {
    // TODO: Implement with real API
    console.log("Form submitted:", data);

    if (editingRole) {
      // Update existing role
      setRoles((prev) =>
        prev.map((r) =>
          r.idRol === editingRole.idRol
            ? {
                ...r,
                nombre: data.nombre,
                descripcion: data.descripcion,
                fechaActualizacion: new Date().toISOString().split("T")[0],
              }
            : r,
        ),
      );
    } else {
      // Create new role
      const newRole: AdminRole = {
        idRol: Date.now().toString(),
        nombre: data.nombre,
        descripcion: data.descripcion,
        permisos: [],
        fechaCreacion: new Date().toISOString().split("T")[0],
        fechaActualizacion: new Date().toISOString().split("T")[0],
        usuariosAsignados: 0,
        estado: { id: 1, nombre: "Activo" },
      };
      setRoles((prev) => [newRole, ...prev]);
    }

    setIsFormOpen(false);
    setEditingRole(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          Gestionar Roles
        </h1>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Rol
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
              <SelectItem value="inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {/* Table */}
        <RolesTable
          roles={paginatedRoles}
          loading={loading}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          itemLabel="roles"
          onPageChange={setCurrentPage}
          className="rounded-b-xl border-t border-gray-100"
        />
      </Card>

      {/* Role Form Dialog */}
      <RoleFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        role={editingRole}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
