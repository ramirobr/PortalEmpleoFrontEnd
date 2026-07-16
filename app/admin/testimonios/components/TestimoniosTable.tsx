"use client";
import Pill from "@/components/shared/components/Pill";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate, getInitials, normalizeImageSrc } from "@/lib/utils";
import { EstadoNombre, ESTADOS, TestimonialData } from "@/types/testimonials";
import {
  CheckCircle,
  Clock,
  Eye,
  MessageSquare,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";
import {
  AdminTableEmpty,
  AdminTableLoading,
} from "../../components/AdminTableStates";

interface TestimoniosTableProps {
  testimonios: TestimonialData[];
  loading: boolean;
  onView: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}

const getStatusClasses = (status: ESTADOS) => {
  switch (status) {
    case EstadoNombre.Publicado:
      return "text-green-600 bg-green-50";
    case EstadoNombre.EnRevision:
      return "text-yellow-600 bg-amber-100";
    case EstadoNombre.Rechazado:
      return "text-red-600 bg-red-50";
    default:
      return "text-slate-600 bg-zinc-50";
  }
};

const renderStars = (rating: number) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`size-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-zinc-200 text-slate-200"
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

export default function TestimoniosTable({
  testimonios,
  loading,
  onView,
  onApprove,
  onReject,
  onDelete,
}: TestimoniosTableProps) {

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
          <tr className="bg-zinc-50 border-b border-zinc-200">
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider"
            >
              Candidato
            </th>
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider"
            >
              Testimonio
            </th>
            <th
              scope="col"
              className="text-center py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider"
            >
              Calificación
            </th>
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider"
            >
              Fecha
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
          {testimonios.map((testimonio, index) => (
            <tr
              key={testimonio.idTestimonio}
              className={`border-b border-zinc-100 hover:bg-zinc-50 transition-colors ${
                index % 2 === 0 ? "bg-white" : "bg-zinc-50/30"
              }`}
            >
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10 border border-zinc-200">
                    <AvatarImage
                      src={normalizeImageSrc(testimonio.candidato.fotoUrl)}
                      alt={testimonio.candidato.nombreCompleto}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                      {getInitials(testimonio.candidato.nombreCompleto)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">
                      {testimonio.candidato.nombreCompleto}
                    </p>
                    <p className="text-xs text-slate-500">
                      {testimonio.cargo} - {testimonio.empresa}
                    </p>
                  </div>
                </div>
              </td>

              <td className="p-4 max-w-xs">
                <p className="text-sm text-slate-700 line-clamp-2">
                  {truncateText(testimonio.testimonioDetalle)}
                </p>
              </td>

              <td className="p-4 text-center">
                {renderStars(testimonio.calificacion)}
              </td>

              <td className="p-4">
                <div className="flex items-center gap-1 text-sm text-slate-600">
                  <Clock className="size-4" />
                  {formatDate(testimonio.fechaCreacion)}
                </div>
              </td>

              <td className="p-4 text-center">
                <Pill
                  variant="custom"
                  bgColor={
                    getStatusClasses(testimonio.estado.nombre).split(" ")[1]
                  }
                  textColor={
                    getStatusClasses(testimonio.estado.nombre).split(" ")[0]
                  }
                  className={`inline-flex ${getStatusClasses(testimonio.estado.nombre)}`}
                >
                  {testimonio.estado.nombre}
                </Pill>
              </td>

              <td className="p-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onView(testimonio.idTestimonio)}
                    className="p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                    title="Ver detalle"
                  >
                    <Eye className="size-4" />
                  </button>

                  {testimonio.estado.nombre === EstadoNombre.EnRevision && (
                    <button
                      onClick={() => onApprove(testimonio.idTestimonio)}
                      className="p-2 rounded-lg text-slate-500 hover:text-green-600 hover:bg-green-50 transition-colors cursor-pointer"
                      title="Aprobar testimonio"
                    >
                      <CheckCircle className="size-4" />
                    </button>
                  )}

                  {testimonio.estado.nombre !== EstadoNombre.Rechazado && (
                    <button
                      onClick={() => onReject(testimonio.idTestimonio)}
                      className="p-2 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
                      title="Rechazar testimonio"
                    >
                      <XCircle className="size-4" />
                    </button>
                  )}

                  <button
                    onClick={() => onDelete(testimonio.idTestimonio)}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Eliminar testimonio"
                  >
                    <Trash2 className="size-4" />
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
