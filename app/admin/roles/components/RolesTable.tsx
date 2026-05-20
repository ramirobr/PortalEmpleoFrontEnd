"use client";

import { AdminRole } from "@/types/admin";
import { Pencil, Power, Trash2, Shield, Users } from "lucide-react";
import Pill from "@/components/shared/components/Pill";
import { ActionButton } from "@/components/shared/components/ActionButton";
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
        return "text-slate-600 bg-zinc-100";
      default:
        return "text-slate-600 bg-zinc-50";
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
          <tr className="bg-zinc-50 border-b border-zinc-200">
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider"
            >
              Rol
            </th>
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider"
            >
              Descripción
            </th>
            <th
              scope="col"
              className="text-center py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider"
            >
              Permisos
            </th>
            <th
              scope="col"
              className="text-center py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider"
            >
              Usuarios
            </th>
            <th
              scope="col"
              className="text-center py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider"
            >
              Estado
            </th>
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider"
            >
              Última Actualización
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
          {roles.map((role) => (
            <tr key={role.idRol} className="hover:bg-zinc-50 transition-colors">
              {/* Role Name */}
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{role.nombre}</p>
                    {isSystemRole(role.nombre) && (
                      <span className="text-xs text-slate-500">
                        Rol del sistema
                      </span>
                    )}
                  </div>
                </div>
              </td>

              {/* Description */}
              <td className="p-4">
                <p className="text-sm text-slate-600 max-w-xs truncate">
                  {role.descripcion}
                </p>
              </td>

              {/* Permissions Count */}
              <td className="p-4 text-center">
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
              <td className="p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 text-slate-600">
                  <Users className="size-4" />
                  <span className="font-medium">{role.usuariosAsignados}</span>
                </div>
              </td>

              {/* Status */}
              <td className="p-4 text-center">
                <Pill className={getStatusClasses(role.estado.nombre)}>
                  {role.estado.nombre}
                </Pill>
              </td>

              {/* Last Updated */}
              <td className="p-4 text-sm text-slate-500">
                {formatDate(role.fechaActualizacion)}
              </td>

              {/* Actions */}
              <td className="p-4">
                <div className="flex items-center justify-center gap-2">
                  <ActionButton
                    onClick={() => onEdit(role.idRol)}
                    icon={<Pencil />}
                    title="Editar rol"
                  />
                  <ActionButton
                    onClick={() => onToggleStatus(role.idRol)}
                    icon={<Power />}
                    title={role.estado.nombre === "Activo" ? "Desactivar rol" : "Activar rol"}
                  />
                  {!isSystemRole(role.nombre) && (
                    <ActionButton
                      onClick={() => onDelete(role.idRol)}
                      variant="danger"
                      icon={<Trash2 />}
                      title="Eliminar rol"
                    />
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
