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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Pill from "@/components/shared/components/Pill";
import { ActionButton } from "@/components/shared/components/ActionButton";
import {
  AdminTableEmpty,
  AdminTableLoading,
} from "../../components/AdminTableStates";

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
      case "activa":
        return "text-green-600 bg-green-50";
      case "cerrada":
        return "text-slate-600 bg-zinc-100";
      case "pendiente":
        return "text-yellow-600 bg-amber-100";
      default:
        return "text-slate-600 bg-zinc-50";
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
          <tr className="bg-zinc-50 border-b border-zinc-200">
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider"
            >
              Empleo
            </th>
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
              Fecha Publicación
            </th>
            <th
              scope="col"
              className="text-center py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider"
            >
              Postulantes
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
          {empleos.map((empleo) => (
            <tr
              key={empleo.idVacante}
              className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors"
            >
              {/* Empleo */}
              <td className="py-2 px-4">
                <div>
                  <p className="font-semibold text-slate-800">{empleo.tituloPuesto}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3" />
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
                  <Avatar className="size-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-zinc-200 text-slate-600 text-xs">
                      {empleo.empresa.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-slate-700">
                    {empleo.empresa}
                  </span>
                </div>
              </td>

              {/* Fecha Publicación */}
              <td className="py-2 px-4 text-slate-600">
                {empleo.fechaPublicacion}
              </td>

              {/* Postulantes */}
              <td className="py-2 px-4 text-center">
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                  <Users className="size-3" />
                  {empleo.postulantes}
                </div>
              </td>

              {/* Estado */}
              <td className="py-2 px-4">
                <div className="flex justify-center">
                  <Pill
                    variant="custom"
                    bgColor={getStatusClasses(empleo.estado)}
                    className="w-fit"
                    noButton
                  >
                    • {empleo.estado}
                  </Pill>
                </div>
              </td>

              {/* Acciones */}
              <td className="py-2 px-4">
                <div className="flex items-center justify-center gap-2">
                  <ActionButton
                    onClick={() => onEdit(empleo.idVacante)}
                    icon={<Pencil />}
                    title="Editar vacante"
                    aria-label={`Editar ${empleo.tituloPuesto}`}
                  />
                  <ActionButton
                    onClick={() => onStatusChange(empleo.idVacante)}
                    icon={empleo.estado === "Activa" ? <Ban /> : <CheckCircle />}
                    title={empleo.estado === "Activa" ? "Cerrar" : "Activar"}
                    aria-label={`${empleo.estado === "Activa" ? "Cerrar" : "Activar"} ${empleo.tituloPuesto}`}
                  />
                  <ActionButton
                    onClick={() => onDelete(empleo.idVacante)}
                    variant="danger"
                    icon={<Trash2 />}
                    title="Eliminar vacante"
                    aria-label={`Eliminar ${empleo.tituloPuesto}`}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
