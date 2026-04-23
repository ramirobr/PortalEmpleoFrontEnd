"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Search, UserCircle, Plus } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminUsuario } from "@/types/admin";
import {
  mockUsuarios,
  createUsuarioMock,
  updateUsuarioMock,
  toggleUsuarioStatusMock,
  deleteUsuarioMock,
  getMockUsuarios,
  UsuarioFormData,
} from "@/lib/admin/adminUsuarios";
import UsuariosTable from "./components/UsuariosTable";
import UsuarioWizard from "./components/UsuarioWizard";
import UsuarioForm from "./components/UsuarioForm";
import TablePagination from "@/components/shared/components/TablePagination";

export default function AdminUsuariosPage() {
  const { data: session } = useSession();
  const [usuarios, setUsuarios] = useState<AdminUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const [rolFilter, setRolFilter] = useState("todos");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Dialog states
  const [isWizardDialogOpen, setIsWizardDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<AdminUsuario | null>(null);
  const [wizardLoading, setWizardLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState<AdminUsuario | null>(null);

  // Fetch usuarios (using mock data for now)
  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      // TODO: Replace with real API call when available
      // const response = await getAdminUsuarios(
      //   { pageSize, currentPage, search, estado: estadoFilter, rol: rolFilter, tipoUsuario: tipoFilter },
      //   session?.user?.accessToken
      // );
      // if (response?.isSuccess) {
      //   setUsuarios(response.data.data);
      // }

      await new Promise((resolve) => setTimeout(resolve, 500));
      setUsuarios(getMockUsuarios());
      setLoading(false);
    };

    fetchUsuarios();
  }, [session, currentPage, pageSize]);

  // Filter usuarios based on search and filters
  const filteredUsuarios = useMemo(() => {
    return usuarios.filter((usuario) => {
      const matchesSearch =
        search === "" ||
        usuario.nombreCompleto.toLowerCase().includes(search.toLowerCase()) ||
        usuario.email.toLowerCase().includes(search.toLowerCase()) ||
        usuario.rol.nombre.toLowerCase().includes(search.toLowerCase());

      const matchesEstado =
        estadoFilter === "todos" ||
        usuario.estado.nombre.toLowerCase() === estadoFilter.toLowerCase();

      const matchesRol =
        rolFilter === "todos" ||
        usuario.rol.nombre.toLowerCase() === rolFilter.toLowerCase();

      const matchesTipo =
        tipoFilter === "todos" ||
        usuario.tipoUsuario.toLowerCase() === tipoFilter.toLowerCase();

      return matchesSearch && matchesEstado && matchesRol && matchesTipo;
    });
  }, [usuarios, search, estadoFilter, rolFilter, tipoFilter]);

  // Paginate filtered results
  const paginatedUsuarios = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsuarios.slice(startIndex, startIndex + pageSize);
  }, [filteredUsuarios, currentPage, pageSize]);

  const totalItems = filteredUsuarios.length;

  const handleEdit = (idUsuario: string) => {
    const usuario = usuarios.find((u) => u.idUsuario === idUsuario);
    if (usuario) {
      setEditingUsuario(usuario);
      setIsFormDialogOpen(true);
    }
  };

  const handleCreate = () => {
    setEditingUsuario(null);
    setIsWizardDialogOpen(true);
  };

  const handleWizardSubmit = async (data: UsuarioFormData) => {
    setWizardLoading(true);
    try {
      if (editingUsuario) {
        // Update existing user
        updateUsuarioMock(editingUsuario.idUsuario, data);
      } else {
        // Create new user
        createUsuarioMock(data);
      }
      // Refresh the list
      setUsuarios(getMockUsuarios());
      setIsWizardDialogOpen(false);
      setEditingUsuario(null);
    } catch (error) {
      console.error("Error saving usuario:", error);
    } finally {
      setWizardLoading(false);
    }
  };

  const handleWizardCancel = () => {
    setIsWizardDialogOpen(false);
    setEditingUsuario(null);
  };

  const handleFormSubmit = async (data: UsuarioFormData) => {
    setFormLoading(true);
    try {
      if (editingUsuario) {
        // Update existing user
        updateUsuarioMock(editingUsuario.idUsuario, data);
      }
      // Refresh the list
      setUsuarios(getMockUsuarios());
      setIsFormDialogOpen(false);
      setEditingUsuario(null);
    } catch (error) {
      console.error("Error saving usuario:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setIsFormDialogOpen(false);
    setEditingUsuario(null);
  };

  const handleToggleStatus = async (idUsuario: string) => {
    try {
      toggleUsuarioStatusMock(idUsuario);
      setUsuarios(getMockUsuarios());
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const handleDelete = (idUsuario: string) => {
    const usuario = usuarios.find((u) => u.idUsuario === idUsuario);
    if (usuario) {
      setUsuarioToDelete(usuario);
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (usuarioToDelete) {
      try {
        deleteUsuarioMock(usuarioToDelete.idUsuario);
        setUsuarios(getMockUsuarios());
        setDeleteDialogOpen(false);
        setUsuarioToDelete(null);
      } catch (error) {
        console.error("Error deleting usuario:", error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <UserCircle className="w-8 h-8 text-primary" />
          Gestionar Usuarios
        </h1>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleCreate}
        >
          <Plus className="w-4 h-4" />
          Nuevo usuario
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6 p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre, email o rol..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>

            {/* Estado */}
            <Select
              value={estadoFilter}
              onValueChange={(value) => {
                setEstadoFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
                <SelectItem value="suspendido">Suspendido</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
              </SelectContent>
            </Select>

            {/* Rol */}
            <Select
              value={rolFilter}
              onValueChange={(value) => {
                setRolFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los roles</SelectItem>
                <SelectItem value="administrador">Administrador</SelectItem>
                <SelectItem value="administrador empresa">
                  Administrador Empresa
                </SelectItem>
                <SelectItem value="postulante">Postulante</SelectItem>
                <SelectItem value="moderador">Moderador</SelectItem>
                <SelectItem value="soporte">Soporte</SelectItem>
              </SelectContent>
            </Select>

            {/* Tipo */}
            <Select
              value={tipoFilter}
              onValueChange={(value) => {
                setTipoFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="empresa">Empresa</SelectItem>
                <SelectItem value="candidato">Postulante</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <UsuariosTable
          usuarios={paginatedUsuarios}
          loading={loading}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />

        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          itemLabel="usuarios"
          onPageChange={setCurrentPage}
          className="rounded-b-xl border-t border-gray-100"
        />
      </Card>

      {/* Usuario Wizard Dialog */}
      <Dialog open={isWizardDialogOpen} onOpenChange={setIsWizardDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <UsuarioWizard
            onSubmit={handleWizardSubmit}
            onCancel={handleWizardCancel}
            loading={wizardLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUsuario ? "Editar Usuario" : "Crear Nuevo Usuario"}
            </DialogTitle>
          </DialogHeader>
          <UsuarioForm
            usuario={editingUsuario || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>¿Eliminar usuario?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Esta acción no se puede deshacer. Se eliminará permanentemente el
              usuario{" "}
              <strong>{usuarioToDelete?.nombreCompleto}</strong> y todos sus
              datos asociados.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
