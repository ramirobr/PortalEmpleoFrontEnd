"use client";

import { AdminRole } from "@/types/admin";
import { Pencil, Power, Trash2, Shield, Users } from "lucide-react";
import Pill from "@/components/shared/components/Pill";
import {
  AdminTableEmpty,
  AdminTableLoading,
} from "../../components/AdminTableStates";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate } from "@/lib/utils";

interface RolesTableProps {
  roles: AdminRole[];
  loading: boolean;
  onEdit: (idRol: string) => void;
  onToggleStatus: (idRol: string) => void;
  onDelete: (idRol: string) => void;
}

export default function RolesTable({
  roles,
  loading,
  onEdit,
  onToggleStatus,
  onDelete,
}: RolesTableProps) {
  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case "activo":
        return "text-green-600 bg-green-50";
      case "inactivo":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // Check if role is a system role (cannot be deleted)
  const isSystemRole = (nombre: string) => {
    const systemRoles = [
      "Administrador",
      "Administrador Empresa",
      "Postulante",
    ];
    return systemRoles.includes(nombre);
  };

  if (loading) {
    return <AdminTableLoading message="Cargando roles..." />;
  }

  if (roles.length === 0) {
    return (
      <AdminTableEmpty
        icon={Shield}
        title="No se encontraron roles"
        description="Intenta ajustar los filtros de búsqueda o crea un nuevo rol"
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
              Rol
            </th>
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              Descripción
            </th>
            <th
              scope="col"
              className="text-center py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              Permisos
            </th>
            <th
              scope="col"
              className="text-center py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              Usuarios
            </th>
            <th
              scope="col"
              className="text-center py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              Estado
            </th>
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              Última Actualización
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
          {roles.map((role) => (
            <tr key={role.idRol} className="hover:bg-gray-50 transition-colors">
              {/* Role Name */}
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{role.nombre}</p>
                    {isSystemRole(role.nombre) && (
                      <span className="text-xs text-gray-500">
                        Rol del sistema
                      </span>
                    )}
                  </div>
                </div>
              </td>

              {/* Description */}
              <td className="py-4 px-4">
                <p className="text-sm text-gray-600 max-w-xs truncate">
                  {role.descripcion}
                </p>
              </td>

              {/* Permissions Count */}
              <td className="py-4 px-4 text-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center justify-center px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium cursor-help">
                        {role.permisos.length}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-semibold mb-1">Permisos asignados:</p>
                      <ul className="text-xs space-y-0.5">
                        {role.permisos.slice(0, 5).map((p) => (
                          <li key={p.idPermiso}>• {p.nombre}</li>
                        ))}
                        {role.permisos.length > 5 && (
                          <li>... y {role.permisos.length - 5} más</li>
                        )}
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </td>

              {/* Users Count */}
              <td className="py-4 px-4 text-center">
                <div className="flex items-center justify-center gap-1.5 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">{role.usuariosAsignados}</span>
                </div>
              </td>

              {/* Status */}
              <td className="py-4 px-4 text-center">
                <Pill className={getStatusClasses(role.estado.nombre)}>
                  {role.estado.nombre}
                </Pill>
              </td>

              {/* Last Updated */}
              <td className="py-4 px-4 text-sm text-gray-500">
                {formatDate(role.fechaActualizacion)}
              </td>

              {/* Actions */}
              <td className="py-4 px-4">
                <div className="flex items-center justify-center gap-2">
                  {/* Edit */}
                  <button
                    onClick={() => onEdit(role.idRol)}
                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                    title="Editar rol"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  {/* Toggle Status */}
                  <button
                    onClick={() => onToggleStatus(role.idRol)}
                    className={`p-2 rounded-lg transition-colors ${
                      role.estado.nombre === "Activo"
                        ? "hover:bg-orange-50 text-orange-600"
                        : "hover:bg-green-50 text-green-600"
                    }`}
                    title={
                      role.estado.nombre === "Activo"
                        ? "Desactivar rol"
                        : "Activar rol"
                    }
                  >
                    <Power className="w-4 h-4" />
                  </button>

                  {/* Delete - Only for non-system roles */}
                  {!isSystemRole(role.nombre) && (
                    <button
                      onClick={() => onDelete(role.idRol)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                      title="Eliminar rol"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
