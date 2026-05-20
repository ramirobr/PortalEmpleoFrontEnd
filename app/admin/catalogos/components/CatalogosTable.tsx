"use client";

import { AdminCatalogo } from "@/types/admin";
import { Pencil, Trash2, Power, BookOpen } from "lucide-react";
import Pill from "@/components/shared/components/Pill";
import { ActionButton } from "@/components/shared/components/ActionButton";
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
          <tr className="bg-zinc-50 border-b border-zinc-200">
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider"
            >
              Nombre
            </th>
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider"
            >
              Tipo
            </th>
            <th
              scope="col"
              className="text-left py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider"
            >
              Descripción
            </th>
            <th
              scope="col"
              className="text-center py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider"
            >
              Código
            </th>
            <th
              scope="col"
              className="text-center py-5 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider"
            >
              Orden
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
        <tbody className="divide-y divide-zinc-100">
          {catalogos.map((catalogo) => (
            <tr
              key={catalogo.idCatalogo}
              className="hover:bg-zinc-50 transition-colors"
            >
              {/* Nombre */}
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <BookOpen className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {catalogo.nombre}
                    </p>
                    {catalogo.idCatalogoPadre && (
                      <span className="text-xs text-slate-400">
                        Subcategoría de #{catalogo.idCatalogoPadre}
                      </span>
                    )}
                  </div>
                </div>
              </td>

              {/* Tipo */}
              <td className="p-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                  {catalogo.tipoCatalogo}
                </span>
              </td>

              {/* Descripción */}
              <td className="p-4">
                <p className="text-sm text-slate-600 max-w-xs truncate">
                  {catalogo.descripcion || (
                    <span className="text-slate-400 italic">Sin descripción</span>
                  )}
                </p>
              </td>

              {/* Código */}
              <td className="p-4 text-center">
                {catalogo.codigo ? (
                  <span className="inline-flex items-center justify-center px-3 py-1 bg-zinc-100 text-slate-700 rounded-full text-xs font-mono">
                    {catalogo.codigo}
                  </span>
                ) : (
                  <span className="text-slate-400 text-sm">N/A</span>
                )}
              </td>

              {/* Orden */}
              <td className="p-4 text-center">
                <span className="inline-flex items-center justify-center size-8 rounded-full bg-zinc-100 text-slate-700 text-sm font-medium">
                  {catalogo.orden}
                </span>
              </td>

              {/* Estado */}
              <td className="p-4 text-center">
                <Pill
                  className={
                    catalogo.activo
                      ? "text-green-600 bg-green-50"
                      : "text-slate-600 bg-zinc-100"
                  }
                >
                  {catalogo.activo ? "Activo" : "Inactivo"}
                </Pill>
              </td>

              {/* Acciones */}
              <td className="p-4">
                <div className="flex items-center justify-center gap-2">
                  <ActionButton
                    onClick={() => onEdit(catalogo.idCatalogo)}
                    icon={<Pencil />}
                    title="Editar entrada"
                  />
                  <ActionButton
                    onClick={() => onToggleStatus(catalogo.idCatalogo)}
                    icon={<Power />}
                    title={catalogo.activo ? "Desactivar" : "Activar"}
                  />
                  <ActionButton
                    onClick={() => onDelete(catalogo.idCatalogo)}
                    variant="danger"
                    icon={<Trash2 />}
                    title="Eliminar entrada"
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
