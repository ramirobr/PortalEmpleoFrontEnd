"use client";

import { ArchivoUsuario, CarpetaUsuario } from "@/types/admin";
import { Download, MoveRight, Trash2, FileText } from "lucide-react";
import { ActionButton } from "@/components/shared/components/ActionButton";
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


function formatSimpleDate(dateStr?: string | Date) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("es-ES");
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
          <tr className="bg-zinc-50 border-b border-zinc-200">
            <th className="text-left py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="text-left py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="text-center py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Extensión
            </th>
            <th className="text-center py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Tamaño
            </th>
            <th className="text-left py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Carpeta
            </th>
            <th className="text-left py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Fecha
            </th>
            <th className="text-center py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {archivos.map((archivo) => (
            <tr
              key={archivo.idArchivoUsuario}
              className="hover:bg-zinc-50 transition-colors"
            >
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <FileText className="size-4 text-blue-600" />
                  </div>
                  <p className="font-medium text-slate-900 max-w-[200px] truncate">
                    {archivo.nombreArchivo}
                  </p>
                </div>
              </td>
              <td className="p-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium">
                  {archivo.tipoArchivo}
                </span>
              </td>
              <td className="p-4 text-center">
                {archivo.extension ? (
                  <span className="inline-flex items-center justify-center px-2.5 py-1 bg-zinc-100 text-slate-700 rounded-full text-xs font-mono uppercase">
                    {archivo.extension.replace(".", "")}
                  </span>
                ) : (
                  <span className="text-slate-400 text-sm">N/A</span>
                )}
              </td>
              <td className="p-4 text-center">
                <span className="text-sm text-slate-600">
                  {formatBytes(archivo.tamanoBytes)}
                </span>
              </td>
              <td className="p-4">
                {archivo.idCarpetaUsuario ? (
                  <span className="text-sm text-slate-600">
                    {carpetaMap[archivo.idCarpetaUsuario] ?? "Carpeta"}
                  </span>
                ) : (
                  <span className="text-slate-400 text-sm">Raíz</span>
                )}
              </td>
              <td className="p-4">
                <span className="text-sm text-slate-600" suppressHydrationWarning>
                  {formatSimpleDate(archivo.fechaCarga)}
                </span>
              </td>
              <td className="p-4">
                <div className="flex items-center justify-center gap-2">
                  <ActionButton
                    onClick={() => onDownload(archivo.idArchivoUsuario)}
                    icon={<Download />}
                    title="Descargar archivo"
                  />
                  <ActionButton
                    onClick={() => onMover(archivo)}
                    icon={<MoveRight />}
                    title="Mover archivo"
                  />
                  <ActionButton
                    onClick={() => onDelete(archivo.idArchivoUsuario)}
                    variant="danger"
                    icon={<Trash2 />}
                    title="Eliminar archivo"
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
