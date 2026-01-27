"use client";

import { AdminTestimonio } from "@/types/admin";
import {
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  MessageSquare,
  Star,
  Clock,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Pill from "@/components/shared/components/Pill";
import {
  AdminTableEmpty,
  AdminTableLoading,
} from "../../components/AdminTableStates";

interface TestimoniosTableProps {
  testimonios: AdminTestimonio[];
  loading: boolean;
  onView: (idTestimonio: string) => void;
  onApprove: (idTestimonio: string) => void;
  onReject: (idTestimonio: string) => void;
  onDelete: (idTestimonio: string) => void;
}

export default function TestimoniosTable({
  testimonios,
  loading,
  onView,
  onApprove,
  onReject,
  onDelete,
}: TestimoniosTableProps) {
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
      case "aprobado":
        return "text-green-600 bg-green-50";
      case "pendiente":
        return "text-yellow-600 bg-amber-100";
      case "rechazado":
        return "text-red-600 bg-red-50";
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

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return <AdminTableLoading message="Cargando testimonios..." />;
  }

  if (testimonios.length === 0) {
    return (
      <AdminTableEmpty
        icon={MessageSquare}
        title="No se encontraron testimonios"
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
              Testimonio
            </th>
            <th
              scope="col"
              className="text-center py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              Calificación
            </th>
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              Fecha
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
          {testimonios.map((testimonio, index) => (
            <tr
              key={testimonio.idTestimonio}
              className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
              }`}
            >
              {/* Candidato */}
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border border-gray-200">
                    <AvatarImage
                      src={testimonio.candidato.fotoUrl}
                      alt={testimonio.candidato.nombreCompleto}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                      {getInitials(testimonio.candidato.nombreCompleto)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {testimonio.candidato.nombreCompleto}
                    </p>
                    <p className="text-xs text-gray-500">
                      {testimonio.cargo} - {testimonio.empresa}
                    </p>
                  </div>
                </div>
              </td>

              {/* Testimonio */}
              <td className="py-4 px-4 max-w-xs">
                <p className="text-sm text-gray-700 line-clamp-2">
                  {truncateText(testimonio.testimonioDetalle)}
                </p>
              </td>

              {/* Calificación */}
              <td className="py-4 px-4 text-center">
                {renderStars(testimonio.calificacion)}
              </td>

              {/* Fecha */}
              <td className="py-4 px-4">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  {formatDate(testimonio.fechaCreacion)}
                </div>
              </td>

              {/* Estado */}
              <td className="py-4 px-4 text-center">
                <Pill
                  variant="custom"
                  bgColor={getStatusClasses(testimonio.estado.nombre).split(" ")[1]}
                  textColor={getStatusClasses(testimonio.estado.nombre).split(" ")[0]}
                  className={`inline-flex ${getStatusClasses(testimonio.estado.nombre)}`}
                >
                  {testimonio.estado.nombre}
                </Pill>
              </td>

              {/* Acciones */}
              <td className="py-4 px-4">
                <div className="flex items-center justify-center gap-2">
                  {/* Ver detalle */}
                  <button
                    onClick={() => onView(testimonio.idTestimonio)}
                    className="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors"
                    title="Ver detalle"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Aprobar (solo si está pendiente) */}
                  {testimonio.estado.nombre.toLowerCase() === "pendiente" && (
                    <button
                      onClick={() => onApprove(testimonio.idTestimonio)}
                      className="p-2 rounded-lg text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors"
                      title="Aprobar testimonio"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}

                  {/* Rechazar (solo si está pendiente o aprobado) */}
                  {testimonio.estado.nombre.toLowerCase() !== "rechazado" && (
                    <button
                      onClick={() => onReject(testimonio.idTestimonio)}
                      className="p-2 rounded-lg text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                      title="Rechazar testimonio"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}

                  {/* Eliminar */}
                  <button
                    onClick={() => onDelete(testimonio.idTestimonio)}
                    className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Eliminar testimonio"
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
