"use client";
import { AdminBlog, EstadoBlogNombre, ESTADOS_BLOG } from "@/types/blog";
import { Clock, Edit2, Eye, FileText, Trash2 } from "lucide-react";
import {
  AdminTableEmpty,
  AdminTableLoading,
} from "../../components/AdminTableStates";

interface BlogsTableProps {
  blogs: AdminBlog[];
  loading: boolean;
  onView: (blog: AdminBlog) => void;
  onEdit: (blog: AdminBlog) => void;
  onDelete: (idBlog: string) => void;
  onChangeStatus: (idBlog: string, currentStatus: string) => void;
}

function getStatusClasses(nombre: string) {
  switch (nombre) {
    case EstadoBlogNombre.Publicado:
      return "text-green-600 bg-green-50";
    case EstadoBlogNombre.Borrador:
      return "text-yellow-600 bg-amber-100";
    case EstadoBlogNombre.Archivado:
      return "text-zinc-500 bg-zinc-100";
    default:
      return "text-zinc-600 bg-zinc-50";
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("es-EC", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogsTable({
  blogs,
  loading,
  onView,
  onEdit,
  onDelete,
  onChangeStatus,
}: BlogsTableProps) {
  if (loading) {
    return <AdminTableLoading message="Cargando blogs..." />;
  }

  if (blogs.length === 0) {
    return (
      <AdminTableEmpty
        icon={FileText}
        title="No se encontraron blogs"
        description="Crea tu primer artículo con el botón de arriba"
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-zinc-50 border-b border-zinc-200">
            {["Título", "Slug", "Estado", "Creado", "Publicado", "Acciones"].map(
              (col) => (
                <th
                  key={col}
                  scope="col"
                  className="text-left py-5 px-4 text-sm font-semibold text-zinc-500 uppercase tracking-wider"
                >
                  {col}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog, index) => (
            <tr
              key={blog.idBlog}
              className={`border-b border-zinc-100 hover:bg-zinc-50 transition-colors ${
                index % 2 === 0 ? "bg-white" : "bg-zinc-50/30"
              }`}
            >
              <td className="p-4 max-w-xs">
                <p className="font-medium text-zinc-900 text-sm line-clamp-2">
                  {blog.titulo}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">
                  {blog.resumen}
                </p>
              </td>

              <td className="p-4">
                <code className="text-xs text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                  {blog.slug}
                </code>
              </td>

              <td className="p-4">
                <span
                  className={`inline-flex text-xs font-semibold px-2 py-1 rounded-full ${getStatusClasses(blog.estado.nombre)}`}
                >
                  {blog.estado.nombre}
                </span>
              </td>

              <td className="p-4">
                <div className="flex items-center gap-1 text-sm text-zinc-600">
                  <Clock className="size-3.5" />
                  {formatDate(blog.fechaCreacion)}
                </div>
              </td>

              <td className="p-4">
                <span className="text-sm text-zinc-600">
                  {blog.fechaPublicacion ? formatDate(blog.fechaPublicacion) : "-"}
                </span>
              </td>

              <td className="p-4">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onView(blog)}
                    className="p-2 rounded-lg text-zinc-500 hover:text-primary hover:bg-primary/10 transition-colors"
                    title="Ver artículo"
                  >
                    <Eye className="size-4" />
                  </button>
                  <button
                    onClick={() => onEdit(blog)}
                    className="p-2 rounded-lg text-zinc-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="size-4" />
                  </button>
                  <button
                    onClick={() => onDelete(blog.idBlog)}
                    className="p-2 rounded-lg text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Eliminar"
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
