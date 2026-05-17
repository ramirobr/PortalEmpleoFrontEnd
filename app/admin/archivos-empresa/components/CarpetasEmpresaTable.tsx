"use client";

import { CarpetaEmpresa } from "@/types/admin";
import { Pencil, Trash2, FolderOpen } from "lucide-react";
import {
  AdminTableEmpty,
  AdminTableLoading,
} from "../../components/AdminTableStates";

interface CarpetasEmpresaTableProps {
  carpetas: CarpetaEmpresa[];
  loading: boolean;
  onEdit: (carpeta: CarpetaEmpresa) => void;
  onDelete: (idCarpeta: string) => void;
}

export default function CarpetasEmpresaTable({
  carpetas,
  loading,
  onEdit,
  onDelete,
}: CarpetasEmpresaTableProps) {
  if (loading) {
    return <AdminTableLoading message="Cargando carpetas..." />;
  }

  if (carpetas.length === 0) {
    return (
      <AdminTableEmpty
        icon={FolderOpen}
        title="No hay carpetas"
        description="Esta empresa no tiene carpetas. Crea la primera para organizar sus archivos."
      />
    );
  }

  const parentMap = Object.fromEntries(
    carpetas.map((c) => [c.idCarpetaEmpresa, c.nombreCarpeta]),
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-zinc-50 border-b border-zinc-200">
            <th className="text-left py-5 px-4 text-sm font-semibold text-zinc-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="text-left py-5 px-4 text-sm font-semibold text-zinc-500 uppercase tracking-wider">
              Descripción
            </th>
            <th className="text-left py-5 px-4 text-sm font-semibold text-zinc-500 uppercase tracking-wider">
              Carpeta Padre
            </th>
            <th className="text-left py-5 px-4 text-sm font-semibold text-zinc-500 uppercase tracking-wider">
              Fecha Creación
            </th>
            <th className="text-center py-5 px-4 text-sm font-semibold text-zinc-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {carpetas.map((carpeta) => (
            <tr
              key={carpeta.idCarpetaEmpresa}
              className="hover:bg-zinc-50 transition-colors"
            >
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-yellow-50 flex items-center justify-center shrink-0">
                    <FolderOpen className="size-4 text-yellow-600" />
                  </div>
                  <p className="font-semibold text-zinc-900">
                    {carpeta.nombreCarpeta}
                  </p>
                </div>
              </td>
              <td className="p-4">
                <p className="text-sm text-zinc-600 max-w-xs truncate">
                  {carpeta.descripcion || (
                    <span className="text-zinc-400 italic">Sin descripción</span>
                  )}
                </p>
              </td>
              <td className="p-4">
                {carpeta.idCarpetaPadre ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 text-xs">
                    <FolderOpen className="size-3" />
                    {parentMap[carpeta.idCarpetaPadre] ?? "Carpeta padre"}
                  </span>
                ) : (
                  <span className="text-zinc-400 text-sm">Raíz</span>
                )}
              </td>
              <td className="p-4">
                <span className="text-sm text-zinc-600">
                  {new Date(carpeta.fechaCreacion).toLocaleDateString("es-ES")}
                </span>
              </td>
              <td className="p-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit(carpeta)}
                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                    title="Editar carpeta"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    onClick={() => onDelete(carpeta.idCarpetaEmpresa)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    title="Eliminar carpeta"
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
