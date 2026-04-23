"use client";

import { ArchivoUsuario, CarpetaUsuario } from "@/types/admin";
import { Download, MoveRight, Trash2, FileText } from "lucide-react";
import {
  AdminTableEmpty,
  AdminTableLoading,
} from "../../components/AdminTableStates";

interface ArchivosCandidatoTableProps {
  archivos: ArchivoUsuario[];
  carpetas: CarpetaUsuario[];
  loading: boolean;
  onDownload: (idArchivo: string) => void;
  onMover: (archivo: ArchivoUsuario) => void;
  onDelete: (idArchivo: string) => void;
}

function formatBytes(bytes?: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ArchivosCandidatoTable({
  archivos,
  carpetas,
  loading,
  onDownload,
  onMover,
  onDelete,
}: ArchivosCandidatoTableProps) {
  if (loading) {
    return <AdminTableLoading message="Cargando archivos..." />;
  }

  if (archivos.length === 0) {
    return (
      <AdminTableEmpty
        icon={FileText}
        title="No hay archivos"
        description="No se encontraron archivos en esta ubicación."
      />
    );
  }

  const carpetaMap = Object.fromEntries(
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
              Tipo
            </th>
            <th className="text-center py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Extensión
            </th>
            <th className="text-center py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Tamaño
            </th>
            <th className="text-left py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Carpeta
            </th>
            <th className="text-left py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th className="text-center py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {archivos.map((archivo) => (
            <tr
              key={archivo.idArchivoUsuario}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="font-medium text-gray-900 max-w-[200px] truncate">
                    {archivo.nombreArchivo}
                  </p>
                </div>
              </td>
              <td className="py-4 px-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium">
                  {archivo.tipoArchivo}
                </span>
              </td>
              <td className="py-4 px-4 text-center">
                {archivo.extension ? (
                  <span className="inline-flex items-center justify-center px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-mono uppercase">
                    {archivo.extension.replace(".", "")}
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm">—</span>
                )}
              </td>
              <td className="py-4 px-4 text-center">
                <span className="text-sm text-gray-600">
                  {formatBytes(archivo.tamanoBytes)}
                </span>
              </td>
              <td className="py-4 px-4">
                {archivo.idCarpetaUsuario ? (
                  <span className="text-sm text-gray-600">
                    {carpetaMap[archivo.idCarpetaUsuario] ?? "Carpeta"}
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm">Raíz</span>
                )}
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-gray-600">
                  {new Date(archivo.fechaCarga).toLocaleDateString("es-ES")}
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onDownload(archivo.idArchivoUsuario)}
                    className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                    title="Descargar archivo"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onMover(archivo)}
                    className="p-2 rounded-lg hover:bg-orange-50 text-orange-600 transition-colors"
                    title="Mover archivo"
                  >
                    <MoveRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(archivo.idArchivoUsuario)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    title="Eliminar archivo"
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
