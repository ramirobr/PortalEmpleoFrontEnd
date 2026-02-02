"use client";

import { AdminEmpleo } from "@/types/admin";
import {
  Pencil,
  Ban,
  CheckCircle,
  Trash2,
  Briefcase,
  MapPin,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Pill from "@/components/shared/components/Pill";
import {
  AdminTableEmpty,
  AdminTableLoading,
} from "../../components/AdminTableStates";
import { formatDate } from "@/lib/utils";

interface EmpleosTableProps {
  empleos: AdminEmpleo[];
  loading: boolean;
  onEdit: (idVacante: string) => void;
  onStatusChange: (idVacante: string) => void;
  onDelete: (idVacante: string) => void;
}

export default function EmpleosTable({
  empleos,
  loading,
  onEdit,
  onStatusChange,
  onDelete,
}: EmpleosTableProps) {

  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case "activo":
        return "text-green-600 bg-green-50";
      case "cerrado":
        return "text-gray-600 bg-gray-100";
      case "pendiente":
        return "text-yellow-600 bg-amber-100";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (loading) {
    return <AdminTableLoading message="Cargando empleos..." />;
  }

  if (empleos.length === 0) {
    return (
      <AdminTableEmpty
        icon={Briefcase}
        title="No se encontraron empleos"
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
              Empleo
            </th>
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
              Fecha Publicación
            </th>
            <th
              scope="col"
              className="text-center py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              Postulantes
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
        <tbody>
          {empleos.map((empleo) => (
            <tr
              key={empleo.idVacante}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              {/* Empleo */}
              <td className="py-2 px-4">
                <div>
                  <p className="font-semibold text-gray-800">{empleo.titulo}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {empleo.ubicacion}
                    </span>
                    <span>•</span>
                    <span>{empleo.modalidad}</span>
                  </div>
                </div>
              </td>

              {/* Empresa */}
              <td className="py-2 px-4">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8 rounded-lg">
                    <AvatarImage
                      src={empleo.empresa.logoUrl}
                      alt={empleo.empresa.nombre}
                    />
                    <AvatarFallback className="rounded-lg bg-gray-200 text-gray-600 text-xs">
                      {empleo.empresa.nombre.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-700">
                    {empleo.empresa.nombre}
                  </span>
                </div>
              </td>

              {/* Fecha Publicación */}
              <td className="py-2 px-4 text-gray-600">
                {formatDate(empleo.fechaPublicacion)}
              </td>

              {/* Postulantes */}
              <td className="py-2 px-4 text-center">
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                  <Users className="w-3 h-3" />
                  {empleo.postulantes}
                </div>
              </td>

              {/* Estado */}
              <td className="py-2 px-4">
                <div className="flex justify-center">
                  <Pill
                    variant="custom"
                    bgColor={getStatusClasses(empleo.estado.nombre)}
                    className="w-fit"
                    noButton
                  >
                    • {empleo.estado.nombre}
                  </Pill>
                </div>
              </td>

              {/* Acciones */}
              <td className="py-2 px-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(empleo.idVacante)}
                    className="p-2 bg-sky-50 text-teal-600 rounded-full hover:bg-teal-600 hover:text-white transition-colors cursor-pointer"
                    aria-label={`Editar ${empleo.titulo}`}
                    title="Editar vacante"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onStatusChange(empleo.idVacante)}
                    className="p-2 bg-sky-50 text-teal-600 rounded-full hover:bg-teal-600 hover:text-white transition-colors cursor-pointer"
                    aria-label={`${empleo.estado.nombre === "Activo" ? "Cerrar" : "Activar"} ${empleo.titulo}`}
                    title={
                      empleo.estado.nombre === "Activo" ? "Cerrar" : "Activar"
                    }
                  >
                    {empleo.estado.nombre === "Activo" ? (
                      <Ban className="w-3 h-3" />
                    ) : (
                      <CheckCircle className="w-3 h-3" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(empleo.idVacante)}
                    className="p-2 bg-sky-50 text-teal-600 rounded-full hover:bg-teal-600 hover:text-white transition-colors cursor-pointer"
                    aria-label={`Eliminar ${empleo.titulo}`}
                    title="Eliminar vacante"
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
