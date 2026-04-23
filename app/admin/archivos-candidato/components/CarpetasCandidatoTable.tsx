"use client";

import { CarpetaUsuario } from "@/types/admin";
import { Pencil, Trash2, FolderOpen } from "lucide-react";
import {
  AdminTableEmpty,
  AdminTableLoading,
} from "../../components/AdminTableStates";

interface CarpetasCandidatoTableProps {
  carpetas: CarpetaUsuario[];
  loading: boolean;
  onEdit: (carpeta: CarpetaUsuario) => void;
  onDelete: (idCarpeta: string) => void;
}

export default function CarpetasCandidatoTable({
  carpetas,
  loading,
  onEdit,
  onDelete,
}: CarpetasCandidatoTableProps) {
  if (loading) {
    return <AdminTableLoading message="Cargando carpetas..." />;
  }

  if (carpetas.length === 0) {
    return (
      <AdminTableEmpty
        icon={FolderOpen}
        title="No hay carpetas"
        description="Este candidato no tiene carpetas. Crea la primera para organizar sus archivos."
      />
    );
  }

  const parentMap = Object.fromEntries(
    carpetas.map((c) => [c.idCarpetaUsuario, c.nombreCarpeta]),
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="text-left py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Descripción
            </th>
            <th className="text-left py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Carpeta Padre
            </th>
            <th className="text-left py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Fecha Creación
            </th>
            <th className="text-center py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {carpetas.map((carpeta) => (
            <tr
              key={carpeta.idCarpetaUsuario}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-yellow-50 flex items-center justify-center shrink-0">
                    <FolderOpen className="w-4 h-4 text-yellow-600" />
                  </div>
                  <p className="font-semibold text-gray-900">
                    {carpeta.nombreCarpeta}
                  </p>
                </div>
              </td>
              <td className="py-4 px-4">
                <p className="text-sm text-gray-600 max-w-xs truncate">
                  {carpeta.descripcion || (
                    <span className="text-gray-400 italic">Sin descripción</span>
                  )}
                </p>
              </td>
              <td className="py-4 px-4">
                {carpeta.idCarpetaPadre ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs">
                    <FolderOpen className="w-3 h-3" />
                    {parentMap[carpeta.idCarpetaPadre] ?? "Carpeta padre"}
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm">Raíz</span>
                )}
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-gray-600">
                  {new Date(carpeta.fechaCreacion).toLocaleDateString("es-ES")}
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit(carpeta)}
                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                    title="Editar carpeta"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(carpeta.idCarpetaUsuario)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    title="Eliminar carpeta"
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
