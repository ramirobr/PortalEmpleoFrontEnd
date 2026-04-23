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
} from "lucide-react";
import Pill from "@/components/shared/components/Pill";
import {
  AdminTableEmpty,
  AdminTableLoading,
} from "../../components/AdminTableStates";
import { formatDate, getInitials } from "@/lib/utils";

interface UsuariosTableProps {
  usuarios: AdminUsuario[];
  loading: boolean;
  onEdit: (idUsuario: string) => void;
  onToggleStatus: (idUsuario: string) => void;
  onDelete: (idUsuario: string) => void;
}

function TipoUsuarioIcon({ tipo }: { tipo: AdminUsuario["tipoUsuario"] }) {
  switch (tipo) {
    case "admin":
      return <Shield className="w-5 h-5 text-primary" />;
    case "empresa":
      return <Building2 className="w-5 h-5 text-blue-600" />;
    case "candidato":
    default:
      return <User className="w-5 h-5 text-teal-600" />;
  }
}

export default function UsuariosTable({
  usuarios,
  loading,
  onEdit,
  onToggleStatus,
  onDelete,
}: UsuariosTableProps) {
  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case "activo":
        return "text-green-600 bg-green-50";
      case "inactivo":
        return "text-gray-600 bg-gray-100";
      case "suspendido":
        return "text-orange-600 bg-orange-50";
      case "pendiente":
        return "text-yellow-600 bg-amber-100";
      default:
        return "text-gray-600 bg-gray-50";
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
          <tr className="bg-gray-50 border-b border-gray-200">
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              Usuario
            </th>
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              Rol / Tipo
            </th>
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              Registro
            </th>
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              Último acceso
            </th>
            <th
              scope="col"
              className="text-center py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              Estado
            </th>
            <th
              scope="col"
              className="text-center py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {usuarios.map((usuario) => (
            <tr
              key={usuario.idUsuario}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    {getInitials(usuario.nombreCompleto)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {usuario.nombreCompleto}
                    </p>
                    <span className="text-xs text-gray-500 inline-flex items-center gap-1">
                      <TipoUsuarioIcon tipo={usuario.tipoUsuario} />
                      {getTipoLabel(usuario.tipoUsuario)}
                    </span>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4 text-sm text-gray-600">
                {usuario.email}
              </td>
              <td className="py-4 px-4">
                <Pill
                  variant="custom"
                  className={usuario.tipoUsuario === "admin" ? "text-primary bg-primary/10" : "text-gray-700 bg-gray-100"}
                  noButton
                >
                  {usuario.rol.nombre}
                </Pill>
              </td>
              <td className="py-4 px-4 text-sm text-gray-500">
                {formatDate(usuario.fechaRegistro)}
              </td>
              <td className="py-4 px-4 text-sm text-gray-500">
                {usuario.ultimoAcceso
                  ? formatDate(usuario.ultimoAcceso)
                  : "—"}
              </td>
              <td className="py-4 px-4 text-center">
                <Pill
                  variant="custom"
                  bgColor={getStatusClasses(usuario.estado.nombre)}
                  className="w-fit"
                  noButton
                >
                  • {usuario.estado.nombre}
                </Pill>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(usuario.idUsuario)}
                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                    title="Editar usuario"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleStatus(usuario.idUsuario)}
                    className={`p-2 rounded-lg transition-colors ${
                      usuario.estado.nombre === "Activo"
                        ? "hover:bg-orange-50 text-orange-600"
                        : "hover:bg-green-50 text-green-600"
                    }`}
                    title={
                      usuario.estado.nombre === "Activo"
                        ? "Desactivar"
                        : "Activar"
                    }
                  >
                    <Power className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(usuario.idUsuario)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    title="Eliminar usuario"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
