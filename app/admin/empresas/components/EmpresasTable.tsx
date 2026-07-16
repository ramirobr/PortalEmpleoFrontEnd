"use client";

import { AdminEmpresa } from "@/types/admin";
import { Pencil, Ban, CheckCircle, Trash2, Building2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Pill from "@/components/shared/components/Pill";
import { ActionButton } from "@/components/shared/components/ActionButton";
import {
  AdminTableEmpty,
  AdminTableLoading,
} from "../../components/AdminTableStates";

interface EmpresasTableProps {
  empresas: AdminEmpresa[];
  loading: boolean;
  onEdit: (idEmpresa: string) => void;
  onSuspend: (idEmpresa: string) => void;
  onDelete: (idEmpresa: string) => void;
  canEdit: boolean;
  canChangeStatus: boolean;
  canDelete: boolean;
}

const getStatusClasses = (status: string) => {
  switch (status.toLowerCase()) {
    case "activa":
    case "activo":
      return "text-green-600 bg-green-50";
    case "suspendido":
    case "suspendida":
      return "text-orange-600 bg-orange-50";
    default:
      return "text-slate-600 bg-zinc-50";
  }
};

export default function EmpresasTable({
  empresas,
  loading,
  onEdit,
  onSuspend,
  onDelete,
  canEdit,
  canChangeStatus,
  canDelete,
}: EmpresasTableProps) {

  if (loading) {
    return <AdminTableLoading message="Cargando empresas..." />;
  }

  if (empresas.length === 0) {
    return (
      <AdminTableEmpty
        icon={Building2}
        title="No se encontraron empresas"
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
              Empresa
            </th>
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider"
            >
              Fecha Registro
            </th>
            <th
              scope="col"
              className="text-center py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider"
            >
              Ofertas Activas
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
        <tbody>
          {empresas.map((empresa) => (
            <tr
              key={empresa.idEmpresa}
              className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors"
            >
              {/* Empresa */}
              <td className="py-2 px-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-zinc-200 text-slate-600 text-xs">
                      {empresa.nombreEmpresa.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {empresa.nombreEmpresa}
                    </p>
                    <p className="text-sm text-slate-500">{empresa.numeroDocumento}</p>
                  </div>
                </div>
              </td>

              {/* Fecha Registro */}
              <td className="py-2 px-4 text-slate-600">
                {empresa.fechaRegistro}
              </td>

              {/* Ofertas Activas */}
              <td className="py-2 px-4 text-center">
                <span className="font-semibold text-slate-700">
                  {empresa.ofertasActivas}
                </span>
              </td>

              {/* Estado */}
              <td className="py-2 px-4">
                <div className="flex justify-center">
                  <Pill
                    variant="custom"
                    bgColor={getStatusClasses(empresa.estado)}
                    className="w-fit"
                    noButton
                  >
                    • {empresa.estado}
                  </Pill>
                </div>
              </td>

              {/* Acciones */}
              <td className="py-2 px-4">
                <div className="flex items-center justify-center gap-2">
                  {canEdit && (
                    <ActionButton
                      onClick={() => onEdit(empresa.idEmpresa)}
                      icon={<Pencil />}
                      title="Editar empresa"
                      aria-label={`Editar ${empresa.nombreEmpresa}`}
                    />
                  )}
                  {canChangeStatus && (
                    <ActionButton
                      onClick={() => onSuspend(empresa.idEmpresa)}
                      icon={empresa.estado.toLowerCase() === "activa" ? <Ban /> : <CheckCircle />}
                      title={empresa.estado.toLowerCase() === "activa" ? "Suspender" : "Activar"}
                      aria-label={`${empresa.estado.toLowerCase() === "activa" ? "Suspender" : "Activar"} ${empresa.nombreEmpresa}`}
                    />
                  )}
                  {canDelete && (
                    <ActionButton
                      onClick={() => onDelete(empresa.idEmpresa)}
                      variant="danger"
                      icon={<Trash2 />}
                      title="Eliminar empresa"
                      aria-label={`Eliminar ${empresa.nombreEmpresa}`}
                    />
                  )}
                  {!canEdit && !canChangeStatus && !canDelete && (
                    <span className="text-sm text-slate-400">Sin permisos</span>
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
