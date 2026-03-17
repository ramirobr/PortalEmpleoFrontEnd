"use client";

import { AdminEmpresa } from "@/types/admin";
import { Pencil, Ban, CheckCircle, Trash2, Building2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Pill from "@/components/shared/components/Pill";
import {
  AdminTableEmpty,
  AdminTableLoading,
} from "../../components/AdminTableStates";
import { formatDate } from "@/lib/utils";

interface EmpresasTableProps {
  empresas: AdminEmpresa[];
  loading: boolean;
  onEdit: (idEmpresa: string) => void;
  onSuspend: (idEmpresa: string) => void;
  onDelete: (idEmpresa: string) => void;
}

export default function EmpresasTable({
  empresas,
  loading,
  onEdit,
  onSuspend,
  onDelete,
}: EmpresasTableProps) {

  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case "activo":
        return "text-green-600 bg-green-50";
      case "suspendido":
        return "text-orange-600 bg-orange-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getPlanClasses = (plan: string) => {
    switch (plan.toLowerCase()) {
      case "premium":
        return "text-teal-600 bg-teal-50";
      case "básico":
        return "text-teal-600 bg-teal-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

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
          <tr className="bg-gray-50 border-b border-gray-200">
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              Empresa
            </th>
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              Fecha Registro
            </th>
            <th
              scope="col"
              className="text-center py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              Ofertas Activas
            </th>
            <th
              scope="col"
              className="text-center py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              Plan / Estatus
            </th>
            <th
              scope="col"
              className="text-center py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {empresas.map((empresa) => (
            <tr
              key={empresa.idEmpresa}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              {/* Empresa */}
              <td className="py-2 px-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 rounded-lg">
                    <AvatarImage
                      src={empresa.logoUrl}
                      alt={empresa.nombreEmpresa}
                    />
                    <AvatarFallback className="rounded-lg bg-gray-200 text-gray-600 text-xs">
                      {empresa.nombreEmpresa.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {empresa.nombreEmpresa}
                    </p>
                    <p className="text-sm text-gray-500">{empresa.rut}</p>
                  </div>
                </div>
              </td>

              {/* Fecha Registro */}
              <td className="py-2 px-4 text-gray-600">
                {formatDate(empresa.fechaRegistro)}
              </td>

              {/* Ofertas Activas */}
              <td className="py-2 px-4 text-center">
                <span className="font-semibold text-gray-700">
                  {empresa.ofertasActivas}
                </span>
              </td>

              {/* Plan / Estatus */}
              <td className="py-2 px-4">
                <div className="flex flex-col items-center gap-2">
                  <Pill
                    variant="custom"
                    bgColor={getPlanClasses(empresa.plan.nombre)}
                    className="w-fit"
                    noButton
                  >
                    • {empresa.plan.nombre}
                  </Pill>
                  {empresa.estado.nombre === "Suspendido" && (
                    <Pill
                      variant="custom"
                      bgColor={getStatusClasses(empresa.estado.nombre)}
                      className="w-fit"
                      noButton
                    >
                      • {empresa.estado.nombre}
                    </Pill>
                  )}
                </div>
              </td>

              {/* Acciones */}
              <td className="py-2 px-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(empresa.idEmpresa)}
                    className="p-2 bg-sky-50 text-teal-600 rounded-full hover:bg-teal-600 hover:text-white transition-colors cursor-pointer"
                    aria-label={`Editar ${empresa.nombreEmpresa}`}
                    title="Editar empresa"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSuspend(empresa.idEmpresa)}
                    className="p-2 bg-sky-50 text-teal-600 rounded-full hover:bg-teal-600 hover:text-white transition-colors cursor-pointer"
                    aria-label={`${empresa.estado.nombre === "Activo" ? "Suspender" : "Activar"} ${empresa.nombreEmpresa}`}
                    title={
                      empresa.estado.nombre === "Activo"
                        ? "Suspender"
                        : "Activar"
                    }
                  >
                    {empresa.estado.nombre === "Activo" ? (
                      <Ban className="w-3 h-3" />
                    ) : (
                      <CheckCircle className="w-3 h-3" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(empresa.idEmpresa)}
                    className="p-2 bg-sky-50 text-teal-600 rounded-full hover:bg-teal-600 hover:text-white transition-colors cursor-pointer"
                    aria-label={`Eliminar ${empresa.nombreEmpresa}`}
                    title="Eliminar empresa"
                  >
                    <Trash2 className="w-3 h-3" />
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
