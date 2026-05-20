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
import { useEffect, useReducer, useRef } from "react";

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

// ==================== REDUCER ESTADOS ====================

interface BlogFormState {
  form: BlogFormData;
  loading: boolean;
}

type BlogFormAction =
  | { type: "RESET"; payload: { initialData: AdminBlog | null | undefined } }
  | { type: "UPDATE_FIELD"; field: keyof BlogFormData; value: any }
  | { type: "SET_TITLE"; titulo: string; slugManual: boolean }
  | { type: "SET_LOADING"; loading: boolean };

const initialState: BlogFormState = {
  form: {
    titulo: "",
    slug: "",
    resumen: "",
    contenido: "",
    imagenUrl: "",
    idEstadoBlog: undefined,
    publicarInmediatamente: false,
  },
  loading: false,
};

function blogFormReducer(state: BlogFormState, action: BlogFormAction): BlogFormState {
  switch (action.type) {
    case "RESET": {
      const data = action.payload.initialData;
      if (data) {
        return {
          ...state,
          loading: false,
          form: {
            titulo: data.titulo,
            slug: data.slug,
            resumen: data.resumen,
            contenido: data.contenido,
            imagenUrl: data.imagenUrl ?? "",
            idEstadoBlog: data.estado.id,
            publicarInmediatamente: false,
          },
        };
      }
      return {
        ...state,
        loading: false,
        form: {
          titulo: "",
          slug: "",
          resumen: "",
          contenido: "",
          imagenUrl: "",
          idEstadoBlog: undefined,
          publicarInmediatamente: false,
        },
      };
    }
    case "UPDATE_FIELD":
      return {
        ...state,
        form: {
          ...state.form,
          [action.field]: action.value,
        },
      };
    case "SET_TITLE":
      return {
        ...state,
        form: {
          ...state.form,
          titulo: action.titulo,
          slug: action.slugManual ? state.form.slug : slugify(action.titulo),
        },
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.loading,
      };
    default:
      return state;
  }
}

export default function BlogFormDialog({
  open,
  onClose,
  onSubmit,
  initialData,
  estadoOptions,
}: BlogFormDialogProps) {
  const isEditing = !!initialData;
  const [state, dispatch] = useReducer(blogFormReducer, initialState);
  const slugManual = useRef(false);

  useEffect(() => {
    dispatch({ type: "RESET", payload: { initialData } });
    if (initialData) {
      slugManual.current = true;
    } else {
      slugManual.current = false;
    }
  }, [initialData, open]);

  const handleTituloChange = (titulo: string) => {
    dispatch({ type: "SET_TITLE", titulo, slugManual: slugManual.current });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SET_LOADING", loading: true });
    try {
      await onSubmit(state.form);
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
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
            <label htmlFor="blog-titulo" className="text-sm font-medium text-slate-700 mb-1 block">
              Título *
            </label>
            <Input
              id="blog-titulo"
              required
              value={state.form.titulo}
              onChange={(e) => handleTituloChange(e.target.value)}
              placeholder="Título del artículo"
              maxLength={200}
            />
          </div>

          <div>
            <label htmlFor="blog-slug" className="text-sm font-medium text-slate-700 mb-1 block">
              Slug *{" "}
              <span className="text-xs text-slate-400">(URL del artículo)</span>
            </label>
            <Input
              id="blog-slug"
              required
              value={state.form.slug}
              onChange={(e) => {
                slugManual.current = true;
                dispatch({ type: "UPDATE_FIELD", field: "slug", value: e.target.value });
              }}
              placeholder="mi-articulo"
              maxLength={200}
              className="font-mono text-sm"
            />
          </div>

          <div>
            <label htmlFor="blog-resumen" className="text-sm font-medium text-slate-700 mb-1 block">
              Resumen *{" "}
              <span className="text-xs text-slate-400">(máx 500 caracteres)</span>
            </label>
            <textarea
              id="blog-resumen"
              required
              value={state.form.resumen}
              onChange={(e) =>
                dispatch({ type: "UPDATE_FIELD", field: "resumen", value: e.target.value })
              }
              placeholder="Descripción breve del artículo..."
              maxLength={500}
              rows={3}
              className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
            <p className="text-xs text-slate-400 text-right">
              {state.form.resumen.length}/500
            </p>
          </div>

          <div>
            <label htmlFor="blog-imagenUrl" className="text-sm font-medium text-slate-700 mb-1 block">
              URL de imagen
            </label>
            <Input
              id="blog-imagenUrl"
              value={state.form.imagenUrl}
              onChange={(e) =>
                dispatch({ type: "UPDATE_FIELD", field: "imagenUrl", value: e.target.value })
              }
              placeholder="https://ejemplo.com/imagen.jpg"
              type="url"
            />
          </div>

          <div>
            <label htmlFor="blog-contenido" className="text-sm font-medium text-slate-700 mb-1 block">
              Contenido *
            </label>
            <textarea
              id="blog-contenido"
              required
              value={state.form.contenido}
              onChange={(e) =>
                dispatch({ type: "UPDATE_FIELD", field: "contenido", value: e.target.value })
              }
              placeholder="Escribe el contenido completo del artículo..."
              maxLength={10000}
              rows={12}
              className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
            />
            <p className="text-xs text-slate-400 text-right">
              {state.form.contenido.length}/10000
            </p>
          </div>

          {isEditing && estadoOptions.length > 0 && (
            <div>
              <label htmlFor="blog-estado" className="text-sm font-medium text-slate-700 mb-1 block">
                Estado
              </label>
              <Select
                value={state.form.idEstadoBlog?.toString()}
                onValueChange={(v) =>
                  dispatch({ type: "UPDATE_FIELD", field: "idEstadoBlog", value: parseInt(v) })
                }
              >
                <SelectTrigger id="blog-estado">
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
                checked={state.form.publicarInmediatamente}
                onChange={(e) =>
                  dispatch({ type: "UPDATE_FIELD", field: "publicarInmediatamente", value: e.target.checked })
                }
                className="size-4 accent-primary"
              />
              <span className="text-sm text-slate-700">
                Publicar inmediatamente
              </span>
            </label>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={state.loading}>
              {state.loading ? "Guardando…" : isEditing ? "Guardar cambios" : "Crear artículo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
