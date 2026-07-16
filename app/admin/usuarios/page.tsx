"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Eye, EyeOff, KeyRound, Search, UserCircle, Plus } from "lucide-react";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminUsuario } from "@/types/admin";
import { CatalogsByType } from "@/types/search";
import { getCatalogosByType } from "@/lib/admin/adminCatalogos";
import {
  createAdminUsuario,
  createAdminEmpresa,
  createAdminPostulante,
  deleteUsuario,
  getAdminUsuarios,
  updateAdminUsuario,
  updateAdminUsuarioPassword,
  updateUsuarioStatus,
  UsuarioFormData,
} from "@/lib/admin/adminUsuarios";
import { getAdminRoles } from "@/lib/admin/adminRoles";
import UsuariosTable from "./components/UsuariosTable";
import UsuarioWizard, {
  UsuarioWizardSubmitData,
} from "./components/UsuarioWizard";
import UsuarioForm from "./components/UsuarioForm";
import TablePagination from "@/components/shared/components/TablePagination";

function ChangePasswordDialog({
  open,
  onOpenChange,
  usuario,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  loading,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  usuario: { nombreCompleto: string } | null;
  newPassword: string;
  setNewPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (fn: (v: boolean) => boolean) => void;
  loading: boolean;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="size-5 text-primary" />
            Cambiar contraseña
          </DialogTitle>
          <DialogDescription>
            Actualiza la contraseña de {usuario?.nombreCompleto}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Nueva contraseña</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nueva contraseña"
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword((v) => !v)}
                title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Confirmar contraseña</label>
            <Input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite la contraseña"
            />
          </div>
          <p className="text-xs leading-5 text-slate-500">
            Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancelar</Button>
          <Button onClick={onConfirm} disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar contraseña"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function UserFiltersCard({
  search,
  onSearchChange,
  estadoFilter,
  onEstadoChange,
  rolFilter,
  onRolChange,
  tipoFilter,
  onTipoChange,
  estadoOptions,
  roles,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  estadoFilter: string;
  onEstadoChange: (v: string) => void;
  rolFilter: string;
  onRolChange: (v: string) => void;
  tipoFilter: string;
  onTipoChange: (v: string) => void;
  estadoOptions: CatalogsByType[];
  roles: { idRol: string; nombre: string }[];
}) {
  return (
    <Card className="mb-6 p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre, email o rol..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={estadoFilter} onValueChange={onEstadoChange}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              {estadoOptions.map((item) => (
                <SelectItem key={item.idCatalogo} value={item.idCatalogo.toString()}>
                  {item.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={rolFilter} onValueChange={onRolChange}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role.idRol} value={role.nombre}>
                  {role.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={tipoFilter} onValueChange={onTipoChange}>
            <SelectTrigger className="w-full lg:w-40">
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
  );
}

function DeleteUserDialog({
  open,
  onOpenChange,
  usuario,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  usuario: AdminUsuario | null;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>¿Dar de baja usuario?</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-slate-600">
            Se cambiará el estado de <strong>{usuario?.nombreCompleto}</strong>{" "}
            para que deje de estar activo en el sistema.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Dar de baja
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminUsuariosPage() {
  const { data: session } = useSession();
  const [dataState, setDataState] = useState({
    usuarios: [] as AdminUsuario[],
    totalItems: 0,
    loading: true,
  });
  const { usuarios, totalItems, loading } = dataState;

  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const [rolFilter, setRolFilter] = useState("todos");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [estadoOptions, setEstadoOptions] = useState<CatalogsByType[]>([]);
  const [tipoDocumentoOptions, setTipoDocumentoOptions] = useState<CatalogsByType[]>([]);
  const [generoOptions, setGeneroOptions] = useState<CatalogsByType[]>([]);
  const [ciudadOptions, setCiudadOptions] = useState<CatalogsByType[]>([]);
  const [condicionFiscalOptions, setCondicionFiscalOptions] = useState<CatalogsByType[]>([]);
  const [industriaOptions, setIndustriaOptions] = useState<CatalogsByType[]>([]);
  const [cantidadEmpleadosOptions, setCantidadEmpleadosOptions] = useState<CatalogsByType[]>([]);
  const [roles, setRoles] = useState<{ idRol: string; nombre: string }[]>([]);

  const [isWizardDialogOpen, setIsWizardDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<AdminUsuario | null>(null);
  const [wizardLoading, setWizardLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState<AdminUsuario | null>(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [usuarioToChangePassword, setUsuarioToChangePassword] = useState<AdminUsuario | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = session?.user?.accessToken;
    Promise.all([
      getCatalogosByType("ESTADO_CUENTA", token),
      getCatalogosByType("TIPO_DOCUMENTO", token),
      getCatalogosByType("GENERO", token),
      getCatalogosByType("CIUDAD", token),
      getCatalogosByType("CONDICION_FISCAL", token),
      getCatalogosByType("INDUSTRIA", token),
      getCatalogosByType("CANTIDAD_EMPLEADOS", token),
      getAdminRoles({ pageSize: 100, currentPage: 1 }, token),
    ]).then(
      ([
        estados,
        tiposDocumento,
        generos,
        ciudades,
        condicionesFiscales,
        industrias,
        cantidadesEmpleados,
        rolesResponse,
      ]) => {
        setEstadoOptions(estados);
        setTipoDocumentoOptions(tiposDocumento);
        setGeneroOptions(generos);
        setCiudadOptions(ciudades);
        setCondicionFiscalOptions(condicionesFiscales);
        setIndustriaOptions(industrias);
        setCantidadEmpleadosOptions(cantidadesEmpleados);
        if (rolesResponse?.isSuccess) {
          setRoles(
            rolesResponse.data.data.map((role) => ({
              idRol: role.idRol,
              nombre: role.nombre,
            })),
          );
        }
      },
    );
  }, [session]);

  const fetchUsuarios = useCallback(async () => {
    await Promise.resolve();
    setDataState((prev) => ({ ...prev, loading: true }));
    const response = await getAdminUsuarios(
      {
        pageSize,
        currentPage,
        search,
        estado: estadoFilter === "todos" ? undefined : estadoFilter,
        rol: rolFilter,
        tipoUsuario: tipoFilter,
      },
      session?.user?.accessToken,
    );

    if (response?.isSuccess) {
      setDataState({
        usuarios: response.data.data,
        totalItems: response.data.totalItems,
        loading: false,
      });
    } else {
      setDataState((prev) => ({ ...prev, loading: false }));
      toast.error(response?.messages?.[0] ?? "No se pudieron cargar los usuarios");
    }
  }, [currentPage, estadoFilter, pageSize, rolFilter, search, session?.user?.accessToken, tipoFilter]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void fetchUsuarios();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [fetchUsuarios]);

  const handleEdit = (idUsuario: string) => {
    const usuario = usuarios.find((item) => item.idUsuario === idUsuario);
    if (usuario) {
      setEditingUsuario(usuario);
      setIsFormDialogOpen(true);
    }
  };

  const handleChangePassword = (idUsuario: string) => {
    const usuario = usuarios.find((item) => item.idUsuario === idUsuario);
    if (usuario) {
      setUsuarioToChangePassword(usuario);
      setNewPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setPasswordDialogOpen(true);
    }
  };

  const handleCreate = () => {
    setEditingUsuario(null);
    setIsWizardDialogOpen(true);
  };

  const handleWizardSubmit = async (payload: UsuarioWizardSubmitData) => {
    setWizardLoading(true);
    try {
      const response =
        payload.tipoUsuario === "candidato"
          ? await createAdminPostulante(payload.data, session?.user?.accessToken)
          : payload.tipoUsuario === "empresa"
            ? await createAdminEmpresa(payload.data, session?.user?.accessToken)
            : await createAdminUsuario(payload.data, session?.user?.accessToken);

      if (response?.isSuccess) {
        toast.success("Usuario creado correctamente");
        setIsWizardDialogOpen(false);
        fetchUsuarios();
      } else {
        toast.error(response?.messages?.[0] ?? "No se pudo crear el usuario");
      }
    } finally {
      setWizardLoading(false);
    }
  };

  const handleFormSubmit = async (data: UsuarioFormData) => {
    if (!editingUsuario) return;

    setFormLoading(true);
    try {
      const estado = estadoOptions.find(
        (item) => item.nombre.toLowerCase() === data.estado.toLowerCase(),
      );
      const response = await updateAdminUsuario(
        editingUsuario.idUsuario,
        {
          nombreCompleto: data.nombreCompleto,
          email: data.email,
          roles: data.roles,
          idEstadoCuenta: estado?.idCatalogo,
        },
        session?.user?.accessToken,
      );

      if (response?.isSuccess) {
        toast.success("Usuario actualizado correctamente");
        setIsFormDialogOpen(false);
        setEditingUsuario(null);
        fetchUsuarios();
      } else {
        toast.error(response?.messages?.[0] ?? "No se pudo actualizar el usuario");
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = async (idUsuario: string) => {
    const usuario = usuarios.find((item) => item.idUsuario === idUsuario);
    const activar = usuario?.estado.nombre.toLowerCase() !== "activa";
    const target = estadoOptions.find((item) =>
      activar
        ? item.nombre.toLowerCase() === "activa"
        : ["inactiva", "inactivo", "suspendida", "suspendido"].includes(
            item.nombre.toLowerCase(),
          ),
    );

    if (!target) {
      toast.error("No se encontró el estado requerido en el catálogo");
      return;
    }

    const response = await updateUsuarioStatus(
      idUsuario,
      target.idCatalogo,
      session?.user?.accessToken,
    );

    if (response?.isSuccess) {
      toast.success(`Usuario ${activar ? "activado" : "desactivado"} correctamente`);
      fetchUsuarios();
    } else {
      toast.error(response?.messages?.[0] ?? "No se pudo actualizar el usuario");
    }
  };

  const handleDelete = (idUsuario: string) => {
    const usuario = usuarios.find((item) => item.idUsuario === idUsuario);
    if (usuario) {
      setUsuarioToDelete(usuario);
      setDeleteDialogOpen(true);
    }
  };

  const confirmChangePassword = async () => {
    if (!usuarioToChangePassword) return;

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(
        newPassword,
      )
    ) {
      toast.error("La contraseña debe tener mayúscula, minúscula, número y carácter especial");
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await updateAdminUsuarioPassword(
        {
          idUsuario: usuarioToChangePassword.idUsuario,
          newPassword,
          confirmPassword,
        },
        session?.user?.accessToken,
      );

      if (response?.isSuccess) {
        toast.success("Contraseña actualizada correctamente");
        setPasswordDialogOpen(false);
        setUsuarioToChangePassword(null);
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(response?.messages?.[0] ?? "No se pudo actualizar la contraseña");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!usuarioToDelete) return;

    const response = await deleteUsuario(
      usuarioToDelete.idUsuario,
      session?.user?.accessToken,
    );

    if (response?.isSuccess) {
      toast.success("Usuario dado de baja correctamente");
      setDeleteDialogOpen(false);
      setUsuarioToDelete(null);
      fetchUsuarios();
    } else {
      toast.error(response?.messages?.[0] ?? "No se pudo dar de baja el usuario");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold flex items-center gap-3">
          <UserCircle className="size-8 text-primary" />
          Gestionar Usuarios
        </h1>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleCreate}
        >
          <Plus className="size-4" />
          Nuevo usuario
        </Button>
      </div>

      <UserFiltersCard
        search={search}
        onSearchChange={(v) => { setSearch(v); setCurrentPage(1); }}
        estadoFilter={estadoFilter}
        onEstadoChange={(v) => { setEstadoFilter(v); setCurrentPage(1); }}
        rolFilter={rolFilter}
        onRolChange={(v) => { setRolFilter(v); setCurrentPage(1); }}
        tipoFilter={tipoFilter}
        onTipoChange={(v) => { setTipoFilter(v); setCurrentPage(1); }}
        estadoOptions={estadoOptions}
        roles={roles}
      />

      <Card className="overflow-hidden">
        <UsuariosTable
          usuarios={usuarios}
          loading={loading}
          onEdit={handleEdit}
          onChangePassword={handleChangePassword}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />

        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          itemLabel="usuarios"
          onPageChange={setCurrentPage}
          className="rounded-b-xl border-t border-zinc-100"
        />
      </Card>

      <Dialog open={isWizardDialogOpen} onOpenChange={setIsWizardDialogOpen}>
        <DialogContent className="flex !h-[760px] !max-h-[92vh] !max-w-[calc(100%-2rem)] flex-col overflow-hidden gap-0 !bg-white p-0 sm:!max-w-4xl">
          <DialogHeader className="border-b border-zinc-100 bg-white px-6 py-5 pr-12">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <span className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Plus className="size-5" />
              </span>
              Crear nuevo usuario
            </DialogTitle>
            <DialogDescription>
              Selecciona el tipo de cuenta y completa solo los datos necesarios para crearla.
            </DialogDescription>
          </DialogHeader>
          <UsuarioWizard
            onSubmit={handleWizardSubmit}
            onCancel={() => setIsWizardDialogOpen(false)}
            loading={wizardLoading}
            tipoDocumentoOptions={tipoDocumentoOptions}
            generoOptions={generoOptions}
            ciudadOptions={ciudadOptions}
            condicionFiscalOptions={condicionFiscalOptions}
            industriaOptions={industriaOptions}
            cantidadEmpleadosOptions={cantidadEmpleadosOptions}
            roles={roles}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUsuario ? "Editar Usuario" : "Crear Nuevo Usuario"}
            </DialogTitle>
          </DialogHeader>
          <UsuarioForm
            usuario={editingUsuario || undefined}
            roles={roles}
            estadoOptions={estadoOptions}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormDialogOpen(false)}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>

      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        usuario={usuarioToDelete}
        onConfirm={confirmDelete}
      />

      <ChangePasswordDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
        usuario={usuarioToChangePassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        loading={passwordLoading}
        onConfirm={confirmChangePassword}
      />
    </div>
  );
}
