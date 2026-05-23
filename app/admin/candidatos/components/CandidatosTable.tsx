"use client";

import { AdminCandidato } from "@/types/admin";
import { Eye, Ban, CheckCircle, Trash2, Users, Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Pill from "@/components/shared/components/Pill";
import { ActionButton } from "@/components/shared/components/ActionButton";
import {
  AdminTableEmpty,
  AdminTableLoading,
} from "../../components/AdminTableStates";
import { formatDate, getInitials, normalizeImageSrc } from "@/lib/utils";

interface CandidatosTableProps {
  candidatos: AdminCandidato[];
  loading: boolean;
  onView: (idUsuario: string) => void;
  onEdit: (idUsuario: string) => void;
  onSuspend: (idUsuario: string) => void;
  onDelete: (idUsuario: string) => void;
  canEdit: boolean;
  canChangeStatus: boolean;
  canDelete: boolean;
}

export default function CandidatosTable({
  candidatos,
  loading,
  onView,
  onEdit,
  onSuspend,
  onDelete,
  canEdit,
  canChangeStatus,
  canDelete,
}: CandidatosTableProps) {
  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case "activo":
      case "activa":
        return "text-green-600 bg-green-50";
      case "suspendido":
      case "suspendida":
        return "text-orange-600 bg-orange-50";
      case "pendiente":
        return "text-yellow-600 bg-amber-100";
      default:
        return "text-slate-600 bg-zinc-50";
    }
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
              Contacto
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
              Aplicaciones
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
          {candidatos.map((candidato) => {
            const isActive = ["activo", "activa"].includes(
              candidato.estado.nombre.toLowerCase(),
            );

            return (
            <tr
              key={candidato.idUsuario}
              className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors"
            >
              {/* Candidato */}
              <td className="py-2 px-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage
                      src={normalizeImageSrc(candidato.fotoUrl)}
                      alt={candidato.nombreCompleto}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {getInitials(candidato.nombreCompleto)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {candidato.nombreCompleto}
                    </p>
                    <p className="text-sm text-slate-500">
                      {candidato.ubicacion}
                    </p>
                  </div>
                </div>
              </td>

              {/* Contacto */}
              <td className="py-2 px-4">
                <div>
                  <p className="text-slate-800">{candidato.email}</p>
                  <p className="text-sm text-slate-500">{candidato.telefono}</p>
                </div>
              </td>

              {/* Fecha Registro */}
              <td className="py-2 px-4 text-slate-600">
                {formatDate(candidato.fechaRegistro)}
              </td>

              {/* Aplicaciones */}
              <td className="py-2 px-4 text-center">
                <span className="font-semibold text-slate-700">
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
                  <ActionButton
                    onClick={() => onView(candidato.idUsuario)}
                    icon={<Eye />}
                    title="Ver perfil"
                    aria-label={`Ver perfil de ${candidato.nombreCompleto}`}
                  />
                  {canEdit && (
                    <ActionButton
                      onClick={() => onEdit(candidato.idUsuario)}
                      icon={<Pencil />}
                      title="Editar candidato"
                      aria-label={`Editar ${candidato.nombreCompleto}`}
                    />
                  )}
                  {canChangeStatus && (
                    <ActionButton
                      onClick={() => onSuspend(candidato.idUsuario)}
                      icon={
                        isActive ? (
                          <Ban />
                        ) : (
                          <CheckCircle />
                        )
                      }
                      title={isActive ? "Suspender" : "Activar"}
                      aria-label={`${isActive ? "Suspender" : "Activar"} ${candidato.nombreCompleto}`}
                    />
                  )}
                  {canDelete && (
                    <ActionButton
                      onClick={() => onDelete(candidato.idUsuario)}
                      variant="danger"
                      icon={<Trash2 />}
                      title="Eliminar candidato"
                      aria-label={`Eliminar ${candidato.nombreCompleto}`}
                    />
                  )}
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
