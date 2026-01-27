"use client";

import { AdminCandidato } from "@/types/admin";
import { Eye, Ban, CheckCircle, Trash2, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Pill from "@/components/shared/components/Pill";
import {
  AdminTableEmpty,
  AdminTableLoading,
} from "../../components/AdminTableStates";

interface CandidatosTableProps {
  candidatos: AdminCandidato[];
  loading: boolean;
  onView: (idUsuario: string) => void;
  onSuspend: (idUsuario: string) => void;
  onDelete: (idUsuario: string) => void;
}

export default function CandidatosTable({
  candidatos,
  loading,
  onView,
  onSuspend,
  onDelete,
}: CandidatosTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case "activo":
        return "text-green-600 bg-green-50";
      case "suspendido":
        return "text-orange-600 bg-orange-50";
      case "pendiente":
        return "text-yellow-600 bg-amber-100";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return <AdminTableLoading message="Cargando candidatos..." />;
  }

  if (candidatos.length === 0) {
    return (
      <AdminTableEmpty
        icon={Users}
        title="No se encontraron candidatos"
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
              Candidato
            </th>
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              Contacto
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
              Aplicaciones
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
          {candidatos.map((candidato) => (
            <tr
              key={candidato.idUsuario}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              {/* Candidato */}
              <td className="py-2 px-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={candidato.fotoUrl}
                      alt={candidato.nombreCompleto}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {getInitials(candidato.nombreCompleto)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {candidato.nombreCompleto}
                    </p>
                    <p className="text-sm text-gray-500">
                      {candidato.ubicacion}
                    </p>
                  </div>
                </div>
              </td>

              {/* Contacto */}
              <td className="py-2 px-4">
                <div>
                  <p className="text-gray-800">{candidato.email}</p>
                  <p className="text-sm text-gray-500">{candidato.telefono}</p>
                </div>
              </td>

              {/* Fecha Registro */}
              <td className="py-2 px-4 text-gray-600">
                {formatDate(candidato.fechaRegistro)}
              </td>

              {/* Aplicaciones */}
              <td className="py-2 px-4 text-center">
                <span className="font-semibold text-gray-700">
                  {candidato.totalAplicaciones}
                </span>
              </td>

              {/* Estado */}
              <td className="py-2 px-4">
                <div className="flex justify-center">
                  <Pill
                    variant="custom"
                    bgColor={getStatusClasses(candidato.estado.nombre)}
                    className="w-fit"
                    noButton
                  >
                    • {candidato.estado.nombre}
                  </Pill>
                </div>
              </td>

              {/* Acciones */}
              <td className="py-2 px-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => onView(candidato.idUsuario)}
                    className="p-2 bg-sky-50 text-teal-600 rounded-full hover:bg-teal-600 hover:text-white transition-colors cursor-pointer"
                    aria-label={`Ver perfil de ${candidato.nombreCompleto}`}
                    title="Ver perfil"
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSuspend(candidato.idUsuario)}
                    className="p-2 bg-sky-50 text-teal-600 rounded-full hover:bg-teal-600 hover:text-white transition-colors cursor-pointer"
                    aria-label={`${candidato.estado.nombre === "Activo" ? "Suspender" : "Activar"} ${candidato.nombreCompleto}`}
                    title={
                      candidato.estado.nombre === "Activo"
                        ? "Suspender"
                        : "Activar"
                    }
                  >
                    {candidato.estado.nombre === "Activo" ? (
                      <Ban className="w-3 h-3" />
                    ) : (
                      <CheckCircle className="w-3 h-3" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(candidato.idUsuario)}
                    className="p-2 bg-sky-50 text-teal-600 rounded-full hover:bg-teal-600 hover:text-white transition-colors cursor-pointer"
                    aria-label={`Eliminar ${candidato.nombreCompleto}`}
                    title="Eliminar candidato"
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
