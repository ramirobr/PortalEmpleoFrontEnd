"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AdminBlog } from "@/types/blog";
import { CheckCircle2, FileText, ImageIcon, Link2, Loader2, Save, Send } from "lucide-react";
import { useEffect, useMemo, useReducer, useRef } from "react";

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
  | {
      type: "UPDATE_FIELD";
      field: keyof BlogFormData;
      value: BlogFormData[keyof BlogFormData];
    }
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

function BlogPreviewCard({
  titulo,
  resumen,
  imagenUrl,
  slug,
}: {
  titulo: string;
  resumen: string;
  imagenUrl: string;
  slug: string;
}) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-900">Vista previa</h3>
      <div className="mt-4 overflow-hidden rounded-md border border-zinc-100">
        {imagenUrl ? (
          <div
            aria-label="Vista previa de imagen"
            className="h-32 bg-zinc-100 bg-cover bg-center"
            style={{ backgroundImage: `url("${imagenUrl}")` }}
          />
        ) : (
          <div className="flex h-32 items-center justify-center bg-zinc-100 text-slate-400">
            <ImageIcon className="size-8" />
          </div>
        )}
        <div className="space-y-2 bg-white p-4">
          <p className="line-clamp-2 text-base font-semibold text-slate-900">
            {titulo || "Título del artículo"}
          </p>
          <p className="line-clamp-3 text-sm text-slate-500">
            {resumen || "El resumen aparecerá aquí mientras editas."}
          </p>
          <code className="block truncate rounded bg-zinc-50 px-2 py-1 text-xs text-slate-500">
            /blog/{slug || "slug-del-articulo"}
          </code>
        </div>
      </div>
    </section>
  );
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
  const currentStatus = useMemo(() => {
    if (!isEditing) {
      return state.form.publicarInmediatamente ? "Publicado al guardar" : "Borrador";
    }

    return estadoOptions.find((estado) => estado.id === state.form.idEstadoBlog)?.nombre ?? "Sin estado";
  }, [estadoOptions, isEditing, state.form.idEstadoBlog, state.form.publicarInmediatamente]);

  const resumenRemaining = 500 - state.form.resumen.length;
  const contenidoWords = state.form.contenido
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

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
      <DialogContent className="max-h-[92vh] overflow-hidden p-0 sm:max-w-6xl">
        <DialogHeader>
          <div className="border-b border-zinc-100 px-6 py-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2 text-2xl">
                  <FileText className="size-5 text-primary" />
                  {isEditing ? "Editar artículo" : "Nuevo artículo"}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Ajusta el contenido, la URL pública y el estado editorial del blog.
                </DialogDescription>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <CheckCircle2 className="size-4" />
                {currentStatus}
              </span>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex max-h-[calc(92vh-92px)] flex-col">
          <div className="grid flex-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-6 px-6 py-6">
              <section className="space-y-4">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
                  <div className="space-y-2">
                    <Label htmlFor="blog-titulo">Título</Label>
                    <Input
                      id="blog-titulo"
                      required
                      value={state.form.titulo}
                      onChange={(e) => handleTituloChange(e.target.value)}
                      placeholder="Título del artículo"
                      maxLength={200}
                      className="h-11 text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="blog-slug">Slug</Label>
                    <div className="relative">
                      <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="blog-slug"
                        required
                        value={state.form.slug}
                        onChange={(e) => {
                          slugManual.current = true;
                          dispatch({
                            type: "UPDATE_FIELD",
                            field: "slug",
                            value: e.target.value,
                          });
                        }}
                        placeholder="mi-articulo"
                        maxLength={200}
                        className="h-11 pl-9 font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="blog-resumen">Resumen</Label>
                    <span
                      className={`text-xs ${resumenRemaining < 50 ? "text-amber-600" : "text-slate-400"}`}
                    >
                      {resumenRemaining} disponibles
                    </span>
                  </div>
                  <Textarea
                    id="blog-resumen"
                    required
                    value={state.form.resumen}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_FIELD",
                        field: "resumen",
                        value: e.target.value,
                      })
                    }
                    placeholder="Descripción breve del artículo..."
                    maxLength={500}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blog-imagenUrl">Imagen principal</Label>
                  <div className="relative">
                    <ImageIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="blog-imagenUrl"
                      value={state.form.imagenUrl}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_FIELD",
                          field: "imagenUrl",
                          value: e.target.value,
                        })
                      }
                      placeholder="https://ejemplo.com/imagen.jpg"
                      type="url"
                      className="h-11 pl-9"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="blog-contenido">Contenido</Label>
                  <span className="text-xs text-slate-400">
                    {contenidoWords} palabras · {state.form.contenido.length}/10000
                  </span>
                </div>
                <Textarea
                  id="blog-contenido"
                  required
                  value={state.form.contenido}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_FIELD",
                      field: "contenido",
                      value: e.target.value,
                    })
                  }
                  placeholder="Escribe el contenido completo del artículo..."
                  maxLength={10000}
                  rows={16}
                  className="min-h-80 resize-y leading-6"
                />
              </section>
            </div>

            <aside className="border-t border-zinc-100 bg-zinc-50/60 px-6 py-6 lg:border-l lg:border-t-0">
              <div className="sticky top-0 space-y-5">
                <section className="rounded-lg border border-zinc-200 bg-white p-4">
                  <h3 className="text-sm font-semibold text-slate-900">Publicación</h3>
                  <div className="mt-4 space-y-4">
                    {isEditing && estadoOptions.length > 0 ? (
                      <div className="space-y-2">
                        <Label htmlFor="blog-estado">Estado</Label>
                        <Select
                          value={state.form.idEstadoBlog?.toString()}
                          onValueChange={(v) =>
                            dispatch({
                              type: "UPDATE_FIELD",
                              field: "idEstadoBlog",
                              value: parseInt(v),
                            })
                          }
                        >
                          <SelectTrigger id="blog-estado">
                            <SelectValue placeholder="Selecciona estado" />
                          </SelectTrigger>
                          <SelectContent>
                            {estadoOptions.map((estado) => (
                              <SelectItem key={estado.id} value={estado.id.toString()}>
                                {estado.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <label className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 p-3">
                        <span className="text-sm font-medium text-slate-700">
                          Publicar al crear
                        </span>
                        <input
                          type="checkbox"
                          checked={state.form.publicarInmediatamente}
                          onChange={(e) =>
                            dispatch({
                              type: "UPDATE_FIELD",
                              field: "publicarInmediatamente",
                              value: e.target.checked,
                            })
                          }
                          className="size-4 accent-primary"
                        />
                      </label>
                    )}

                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="rounded-md bg-zinc-50 px-3 py-2">
                        <p className="text-lg font-semibold text-slate-900">
                          {state.form.resumen.length}
                        </p>
                        <p className="text-xs text-slate-500">Resumen</p>
                      </div>
                      <div className="rounded-md bg-zinc-50 px-3 py-2">
                        <p className="text-lg font-semibold text-slate-900">
                          {contenidoWords}
                        </p>
                        <p className="text-xs text-slate-500">Palabras</p>
                      </div>
                    </div>
                  </div>
                </section>

                <BlogPreviewCard
                  titulo={state.form.titulo}
                  resumen={state.form.resumen}
                  imagenUrl={state.form.imagenUrl}
                  slug={state.form.slug}
                />
              </div>
            </aside>
          </div>

          <DialogFooter className="border-t border-zinc-100 bg-white px-6 py-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={state.loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={state.loading}>
              {state.loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : isEditing ? (
                <Save className="size-4" />
              ) : (
                <Send className="size-4" />
              )}
              {state.loading ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear artículo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
