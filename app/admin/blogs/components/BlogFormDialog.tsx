"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { AdminBlog } from "@/types/blog";
import { useEffect, useState } from "react";

interface BlogFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BlogFormData) => Promise<void>;
  initialData?: AdminBlog | null;
  estadoOptions: { id: number; nombre: string }[];
}

export interface BlogFormData {
  titulo: string;
  slug: string;
  resumen: string;
  contenido: string;
  imagenUrl: string;
  idEstadoBlog?: number;
  publicarInmediatamente: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function BlogFormDialog({
  open,
  onClose,
  onSubmit,
  initialData,
  estadoOptions,
}: BlogFormDialogProps) {
  const isEditing = !!initialData;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<BlogFormData>({
    titulo: "",
    slug: "",
    resumen: "",
    contenido: "",
    imagenUrl: "",
    idEstadoBlog: undefined,
    publicarInmediatamente: false,
  });
  const [slugManual, setSlugManual] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        titulo: initialData.titulo,
        slug: initialData.slug,
        resumen: initialData.resumen,
        contenido: initialData.contenido,
        imagenUrl: initialData.imagenUrl ?? "",
        idEstadoBlog: initialData.estado.id,
        publicarInmediatamente: false,
      });
      setSlugManual(true);
    } else {
      setForm({
        titulo: "",
        slug: "",
        resumen: "",
        contenido: "",
        imagenUrl: "",
        idEstadoBlog: undefined,
        publicarInmediatamente: false,
      });
      setSlugManual(false);
    }
  }, [initialData, open]);

  const handleTituloChange = (titulo: string) => {
    setForm((prev) => ({
      ...prev,
      titulo,
      slug: slugManual ? prev.slug : slugify(titulo),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar artículo" : "Nuevo artículo"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Título *
            </label>
            <Input
              required
              value={form.titulo}
              onChange={(e) => handleTituloChange(e.target.value)}
              placeholder="Título del artículo"
              maxLength={200}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Slug *{" "}
              <span className="text-xs text-gray-400">(URL del artículo)</span>
            </label>
            <Input
              required
              value={form.slug}
              onChange={(e) => {
                setSlugManual(true);
                setForm((prev) => ({ ...prev, slug: e.target.value }));
              }}
              placeholder="mi-articulo"
              maxLength={200}
              className="font-mono text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Resumen *{" "}
              <span className="text-xs text-gray-400">(máx 500 caracteres)</span>
            </label>
            <textarea
              required
              value={form.resumen}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, resumen: e.target.value }))
              }
              placeholder="Descripción breve del artículo..."
              maxLength={500}
              rows={3}
              className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
            <p className="text-xs text-gray-400 text-right">
              {form.resumen.length}/500
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              URL de imagen
            </label>
            <Input
              value={form.imagenUrl}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, imagenUrl: e.target.value }))
              }
              placeholder="https://ejemplo.com/imagen.jpg"
              type="url"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Contenido *
            </label>
            <textarea
              required
              value={form.contenido}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, contenido: e.target.value }))
              }
              placeholder="Escribe el contenido completo del artículo..."
              maxLength={10000}
              rows={12}
              className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
            />
            <p className="text-xs text-gray-400 text-right">
              {form.contenido.length}/10000
            </p>
          </div>

          {isEditing && estadoOptions.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Estado
              </label>
              <Select
                value={form.idEstadoBlog?.toString()}
                onValueChange={(v) =>
                  setForm((prev) => ({
                    ...prev,
                    idEstadoBlog: parseInt(v),
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona estado" />
                </SelectTrigger>
                <SelectContent>
                  {estadoOptions.map((e) => (
                    <SelectItem key={e.id} value={e.id.toString()}>
                      {e.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {!isEditing && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.publicarInmediatamente}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    publicarInmediatamente: e.target.checked,
                  }))
                }
                className="size-4 accent-primary"
              />
              <span className="text-sm text-gray-700">
                Publicar inmediatamente
              </span>
            </label>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear artículo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
