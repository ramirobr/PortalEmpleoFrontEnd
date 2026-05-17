"use client";
import TablePagination from "@/components/shared/components/TablePagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createBlog,
  deleteBlog,
  getAdminBlogs,
  getBlogCounters,
  updateBlog,
} from "@/lib/admin/adminBlogs";
import { AdminBlog, BlogCounters } from "@/types/blog";
import { CatalogsByType } from "@/types/search";
import { FileText, Plus, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import BlogFormDialog, { BlogFormData } from "./BlogFormDialog";
import BlogsTable from "./BlogsTable";

interface AdminBlogsClientProps {
  counters?: BlogCounters;
  estados: CatalogsByType[];
}

export default function AdminBlogsClient({
  counters: initialCounters,
  estados,
}: AdminBlogsClientProps) {
  const { data: session } = useSession();
  const [, startTransition] = useTransition();
  const router = useRouter();
  const params = useSearchParams();

  const currentPage = parseInt(params.get("page") || "1");
  const pageSize = parseInt(params.get("pageSize") || "10");
  const searchQuery = params.get("search") || "";
  const estadoFilter = params.get("estado") || "todos";

  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [counters, setCounters] = useState<BlogCounters | undefined>(initialCounters);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<AdminBlog | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<AdminBlog | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  const fetchCounters = async () => {
    const res = await getBlogCounters(session?.user.accessToken);
    if (res?.data) setCounters(res.data);
  };

  useEffect(() => {
    fetchCounters();
  }, [session]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const selectedEstado = estados.find(
          (e) => e.nombre.toLowerCase() === estadoFilter.toLowerCase(),
        );
        const response = await getAdminBlogs(
          {
            pageSize,
            currentPage,
            search: searchQuery,
            estadoId: selectedEstado?.idCatalogo,
          },
          session?.user.accessToken,
        );
        if (response?.data) {
          setBlogs(response.data.data ?? []);
          setTotalItems(response.data.totalItems ?? 0);
        }
      } catch {
        console.error("Error fetching blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, pageSize, searchQuery, estadoFilter, session, refetchTrigger]);

  const updateUrlParams = (updates: Record<string, string>) => {
    startTransition(() => {
      const newParams = new URLSearchParams(params);
      Object.entries(updates).forEach(([key, value]) => {
        if (value) newParams.set(key, value);
        else newParams.delete(key);
      });
      router.push(`?${newParams.toString()}`, { scroll: false });
    });
  };

  const handleCreate = async (data: BlogFormData) => {
    const res = await createBlog(
      {
        titulo: data.titulo,
        slug: data.slug,
        resumen: data.resumen,
        contenido: data.contenido,
        imagenUrl: data.imagenUrl || undefined,
        publicarInmediatamente: data.publicarInmediatamente,
      },
      session?.user.accessToken,
    );
    if (res?.isSuccess) {
      toast.success("Artículo creado correctamente");
      setIsFormOpen(false);
      setRefetchTrigger((p) => p + 1);
      fetchCounters();
    } else {
      toast.error(res?.messages?.[0] || "Error al crear el artículo");
    }
  };

  const handleEdit = async (data: BlogFormData) => {
    if (!editingBlog) return;
    const res = await updateBlog(
      {
        idBlog: editingBlog.idBlog,
        titulo: data.titulo,
        slug: data.slug,
        resumen: data.resumen,
        contenido: data.contenido,
        imagenUrl: data.imagenUrl || undefined,
        idEstadoBlog: data.idEstadoBlog,
      },
      session?.user.accessToken,
    );
    if (res?.isSuccess) {
      toast.success("Artículo actualizado correctamente");
      setIsFormOpen(false);
      setEditingBlog(null);
      setRefetchTrigger((p) => p + 1);
      fetchCounters();
    } else {
      toast.error(res?.messages?.[0] || "Error al actualizar el artículo");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;
    const res = await deleteBlog(blogToDelete, session?.user.accessToken);
    if (res?.isSuccess) {
      toast.success("Artículo eliminado correctamente");
      setRefetchTrigger((p) => p + 1);
      fetchCounters();
    } else {
      toast.error(res?.messages?.[0] || "Error al eliminar el artículo");
    }
    setIsDeleteConfirmOpen(false);
    setBlogToDelete(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold flex items-center gap-3">
          <FileText className="size-8 text-primary" />
          Gestionar Blogs
        </h1>
        <Button
          onClick={() => {
            setEditingBlog(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="size-4" />
          Nuevo artículo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-zinc-900">
            {counters?.totalBlogs ?? 0}
          </p>
          <p className="text-sm text-zinc-500">Total</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {counters?.totalBlogsPublicados ?? 0}
          </p>
          <p className="text-sm text-zinc-500">Publicados</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {counters?.totalBlogsBorrador ?? 0}
          </p>
          <p className="text-sm text-zinc-500">Borradores</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-zinc-500">
            {counters?.totalBlogsArchivados ?? 0}
          </p>
          <p className="text-sm text-zinc-500">Archivados</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <form
            className="relative flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              updateUrlParams({ search: fd.get("search") as string, page: "1" });
            }}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <Input
              name="search"
              defaultValue={searchQuery}
              placeholder="Buscar por título o resumen..."
              className="pl-9"
            />
          </form>
          <Select
            value={estadoFilter}
            onValueChange={(v) => updateUrlParams({ estado: v, page: "1" })}
          >
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {estados.map((e) => (
                <SelectItem key={e.idCatalogo} value={e.nombre.toLowerCase()}>
                  {e.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <BlogsTable
          blogs={blogs}
          loading={loading}
          onView={(blog) => {
            setSelectedBlog(blog);
            setIsViewOpen(true);
          }}
          onEdit={(blog) => {
            setEditingBlog(blog);
            setIsFormOpen(true);
          }}
          onDelete={(id) => {
            setBlogToDelete(id);
            setIsDeleteConfirmOpen(true);
          }}
          onChangeStatus={() => {}}
        />
        {totalItems > 0 && (
          <div className="p-4 border-t">
            <TablePagination
              currentPage={currentPage}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={(page) =>
                updateUrlParams({ page: page.toString() })
              }
            />
          </div>
        )}
      </Card>

      {/* Create / Edit Dialog */}
      <BlogFormDialog
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingBlog(null);
        }}
        onSubmit={editingBlog ? handleEdit : handleCreate}
        initialData={editingBlog}
        estadoOptions={estados.map((e) => ({ id: e.idCatalogo, nombre: e.nombre }))}
      />

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedBlog?.titulo}</DialogTitle>
            <DialogDescription>{selectedBlog?.resumen}</DialogDescription>
          </DialogHeader>
          {selectedBlog && (
            <div className="space-y-4 text-sm text-zinc-700">
              <div>
                <span className="font-semibold">Slug: </span>
                <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs">
                  {selectedBlog.slug}
                </code>
              </div>
              {selectedBlog.imagenUrl && (
                <div>
                  <span className="font-semibold">Imagen: </span>
                  <a
                    href={selectedBlog.imagenUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline text-xs"
                  >
                    {selectedBlog.imagenUrl}
                  </a>
                </div>
              )}
              <div className="whitespace-pre-line border rounded-lg p-4 bg-zinc-50 max-h-72 overflow-y-auto text-sm leading-relaxed">
                {selectedBlog.contenido}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. ¿Estás seguro de que deseas
              eliminar este artículo?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
