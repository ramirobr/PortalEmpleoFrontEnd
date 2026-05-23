"use client";

import { AdminUsuario } from "@/types/admin";
import {
  UserCircle,
  Pencil,
  Power,
  Trash2,
  Shield,
  Building2,
  User,
  KeyRound,
} from "lucide-react";
import Pill from "@/components/shared/components/Pill";
import { ActionButton } from "@/components/shared/components/ActionButton";
import {
  AdminTableEmpty,
  AdminTableLoading,
} from "../../components/AdminTableStates";
import { formatDate, getInitials } from "@/lib/utils";

interface UsuariosTableProps {
  usuarios: AdminUsuario[];
  loading: boolean;
  onEdit: (idUsuario: string) => void;
  onChangePassword: (idUsuario: string) => void;
  onToggleStatus: (idUsuario: string) => void;
  onDelete: (idUsuario: string) => void;
}

function TipoUsuarioIcon({ tipo }: { tipo: AdminUsuario["tipoUsuario"] }) {
  switch (tipo) {
    case "admin":
      return <Shield className="size-5 text-primary" />;
    case "empresa":
      return <Building2 className="size-5 text-blue-600" />;
    case "candidato":
    default:
      return <User className="size-5 text-teal-600" />;
  }
}

export default function UsuariosTable({
  usuarios,
  loading,
  onEdit,
  onChangePassword,
  onToggleStatus,
  onDelete,
}: UsuariosTableProps) {
  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case "activo":
        return "text-green-600 bg-green-50";
      case "inactivo":
        return "text-slate-600 bg-zinc-100";
      case "suspendido":
        return "text-orange-600 bg-orange-50";
      case "pendiente":
        return "text-yellow-600 bg-amber-100";
      default:
        return "text-slate-600 bg-zinc-50";
    }
  };

  const getTipoLabel = (tipo: AdminUsuario["tipoUsuario"]) => {
    switch (tipo) {
      case "admin":
        return "Administrador";
      case "empresa":
        return "Empresa";
      case "candidato":
        return "Postulante";
      default:
        return tipo;
    }
  };

  if (loading) {
    return <AdminTableLoading message="Cargando usuarios..." />;
  }

  if (usuarios.length === 0) {
    return (
      <AdminTableEmpty
        icon={UserCircle}
        title="No se encontraron usuarios"
        description="Intenta ajustar los filtros de búsqueda"
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-zinc-50 border-b border-zinc-200">
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider"
            >
              Usuario
            </th>
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider"
            >
              Rol / Tipo
            </th>
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider"
            >
              Registro
            </th>
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider"
            >
              Último acceso
            </th>
            <th
              scope="col"
              className="text-center py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider"
            >
              Estado
            </th>
            <th
              scope="col"
              className="text-center py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {usuarios.map((usuario) => {
            const roles = usuario.roles?.length ? usuario.roles : [usuario.rol];

            return (
            <tr
              key={usuario.idUsuario}
              className="hover:bg-zinc-50 transition-colors"
            >
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    {getInitials(usuario.nombreCompleto)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {usuario.nombreCompleto}
                    </p>
                    <span className="text-xs text-slate-500 inline-flex items-center gap-1">
                      <TipoUsuarioIcon tipo={usuario.tipoUsuario} />
                      {getTipoLabel(usuario.tipoUsuario)}
                    </span>
                  </div>
                </div>
              </td>
              <td className="p-4 text-sm text-slate-600">
                {usuario.email}
              </td>
              <td className="p-4">
                <div className="flex max-w-xs flex-wrap gap-1.5">
                  {roles.map((role) => (
                    <Pill
                      key={role.idRol || role.nombre}
                      variant="custom"
                      className={usuario.tipoUsuario === "admin" ? "text-primary bg-primary/10" : "text-slate-700 bg-zinc-100"}
                      noButton
                    >
                      {role.nombre}
                    </Pill>
                  ))}
                </div>
              </td>
              <td className="p-4 text-sm text-slate-500">
                {formatDate(usuario.fechaRegistro)}
              </td>
              <td className="p-4 text-sm text-slate-500">
                {usuario.ultimoAcceso
                  ? formatDate(usuario.ultimoAcceso)
                  : "—"}
              </td>
              <td className="p-4 text-center">
                <Pill
                  variant="custom"
                  bgColor={getStatusClasses(usuario.estado.nombre)}
                  className="w-fit"
                  noButton
                >
                  • {usuario.estado.nombre}
                </Pill>
              </td>
              <td className="p-4">
                <div className="flex items-center justify-center gap-2">
                  <ActionButton
                    onClick={() => onEdit(usuario.idUsuario)}
                    icon={<Pencil />}
                    title="Editar usuario"
                  />
                  <ActionButton
                    onClick={() => onChangePassword(usuario.idUsuario)}
                    icon={<KeyRound />}
                    variant="warning"
                    title="Cambiar contraseña"
                  />
                  <ActionButton
                    onClick={() => onToggleStatus(usuario.idUsuario)}
                    icon={<Power />}
                    title={usuario.estado.nombre === "Activo" ? "Desactivar" : "Activar"}
                  />
                  <ActionButton
                    onClick={() => onDelete(usuario.idUsuario)}
                    variant="danger"
                    icon={<Trash2 />}
                    title="Eliminar usuario"
                  />
                </div>
              </td>
            </tr>
          );
          })}
        </tbody>
      </table>
    </div>
  );
}
