"use client";

import { AdminCatalogo } from "@/types/admin";
import { Pencil, Trash2, Power, BookOpen } from "lucide-react";
import Pill from "@/components/shared/components/Pill";
import {
  AdminTableEmpty,
  AdminTableLoading,
} from "../../components/AdminTableStates";

interface CatalogosTableProps {
  catalogos: AdminCatalogo[];
  loading: boolean;
  onEdit: (idCatalogo: number) => void;
  onToggleStatus: (idCatalogo: number) => void;
  onDelete: (idCatalogo: number) => void;
}

export default function CatalogosTable({
  catalogos,
  loading,
  onEdit,
  onToggleStatus,
  onDelete,
}: CatalogosTableProps) {
  if (loading) {
    return <AdminTableLoading message="Cargando catálogos..." />;
  }

  if (catalogos.length === 0) {
    return (
      <AdminTableEmpty
        icon={BookOpen}
        title="No se encontraron entradas"
        description="Intenta ajustar los filtros de búsqueda o crea una nueva entrada de catálogo"
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
              Nombre
            </th>
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              Tipo
            </th>
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              Descripción
            </th>
            <th
              scope="col"
              className="text-center py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              Código
            </th>
            <th
              scope="col"
              className="text-center py-5 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              Orden
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
        <tbody className="divide-y divide-gray-100">
          {catalogos.map((catalogo) => (
            <tr
              key={catalogo.idCatalogo}
              className="hover:bg-gray-50 transition-colors"
            >
              {/* Nombre */}
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {catalogo.nombre}
                    </p>
                    {catalogo.idCatalogoPadre && (
                      <span className="text-xs text-gray-400">
                        Subcategoría de #{catalogo.idCatalogoPadre}
                      </span>
                    )}
                  </div>
                </div>
              </td>

              {/* Tipo */}
              <td className="py-4 px-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                  {catalogo.tipoCatalogo}
                </span>
              </td>

              {/* Descripción */}
              <td className="py-4 px-4">
                <p className="text-sm text-gray-600 max-w-xs truncate">
                  {catalogo.descripcion || (
                    <span className="text-gray-400 italic">Sin descripción</span>
                  )}
                </p>
              </td>

              {/* Código */}
              <td className="py-4 px-4 text-center">
                {catalogo.codigo ? (
                  <span className="inline-flex items-center justify-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-mono">
                    {catalogo.codigo}
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm">—</span>
                )}
              </td>

              {/* Orden */}
              <td className="py-4 px-4 text-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                  {catalogo.orden}
                </span>
              </td>

              {/* Estado */}
              <td className="py-4 px-4 text-center">
                <Pill
                  className={
                    catalogo.activo
                      ? "text-green-600 bg-green-50"
                      : "text-gray-600 bg-gray-100"
                  }
                >
                  {catalogo.activo ? "Activo" : "Inactivo"}
                </Pill>
              </td>

              {/* Acciones */}
              <td className="py-4 px-4">
                <div className="flex items-center justify-center gap-2">
                  {/* Editar */}
                  <button
                    onClick={() => onEdit(catalogo.idCatalogo)}
                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                    title="Editar entrada"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  {/* Activar/Desactivar */}
                  <button
                    onClick={() => onToggleStatus(catalogo.idCatalogo)}
                    className={`p-2 rounded-lg transition-colors ${
                      catalogo.activo
                        ? "hover:bg-orange-50 text-orange-600"
                        : "hover:bg-green-50 text-green-600"
                    }`}
                    title={catalogo.activo ? "Desactivar" : "Activar"}
                  >
                    <Power className="w-4 h-4" />
                  </button>

                  {/* Eliminar */}
                  <button
                    onClick={() => onDelete(catalogo.idCatalogo)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    title="Eliminar entrada"
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
