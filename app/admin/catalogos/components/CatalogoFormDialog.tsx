"use client";

import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminCatalogo, CatalogoFormValues } from "@/types/admin";
import { ScrollArea } from "@/components/ui/scroll-area";

const catalogoSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "Máximo 100 caracteres"),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional(),
  tipoCatalogo: z
    .string()
    .min(1, "El tipo es requerido")
    .max(50, "Máximo 50 caracteres"),
  codigo: z.string().max(10, "Máximo 10 caracteres").optional(),
  valorEntero: z.coerce.number().int().optional(),
  valorCadena: z.string().max(200, "Máximo 200 caracteres").optional(),
  orden: z.coerce.number().int().min(1, "El orden debe ser al menos 1"),
  activo: z.boolean(),
  idCatalogoPadre: z.coerce.number().int().optional(),
});

interface CatalogoFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  catalogo: AdminCatalogo | null;
  catalogTypes: string[];
  allCatalogos: AdminCatalogo[];
  onSubmit: (data: CatalogoFormValues) => Promise<void>;
  isSubmitting: boolean;
}

const NO_PARENT_VALUE = "__none__";

export default function CatalogoFormDialog({
  open,
  onOpenChange,
  catalogo,
  catalogTypes,
  allCatalogos,
  onSubmit,
  isSubmitting,
}: CatalogoFormDialogProps) {
  const isEditing = !!catalogo;

  const form = useForm<CatalogoFormValues>({
    resolver: zodResolver(catalogoSchema) as Resolver<CatalogoFormValues>,
    defaultValues: {
      nombre: "",
      descripcion: "",
      tipoCatalogo: "",
      codigo: "",
      valorEntero: undefined,
      valorCadena: "",
      orden: 1,
      activo: true,
      idCatalogoPadre: undefined,
    },
  });

  const selectedType = form.watch("tipoCatalogo");

  // Possible parents: catalogs of same type that are not the current one
  const possibleParents = allCatalogos.filter(
    (c) =>
      c.tipoCatalogo === selectedType &&
      c.idCatalogo !== catalogo?.idCatalogo &&
      !c.idCatalogoPadre, // only top-level as parents
  );

  useEffect(() => {
    if (open) {
      if (catalogo) {
        form.reset({
          nombre: catalogo.nombre,
          descripcion: catalogo.descripcion ?? "",
          tipoCatalogo: catalogo.tipoCatalogo,
          codigo: catalogo.codigo ?? "",
          valorEntero: catalogo.valorEntero,
          valorCadena: catalogo.valorCadena ?? "",
          orden: catalogo.orden,
          activo: catalogo.activo,
          idCatalogoPadre: catalogo.idCatalogoPadre,
        });
      } else {
        form.reset({
          nombre: "",
          descripcion: "",
          tipoCatalogo: "",
          codigo: "",
          valorEntero: undefined,
          valorCadena: "",
          orden: 1,
          activo: true,
          idCatalogoPadre: undefined,
        });
      }
    }
  }, [open, catalogo, form]);

  const handleSubmit = async (data: CatalogoFormValues) => {
    await onSubmit({
      ...data,
      descripcion: data.descripcion || undefined,
      codigo: data.codigo || undefined,
      valorCadena: data.valorCadena || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Entrada de Catálogo" : "Nueva Entrada de Catálogo"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica la información de esta entrada del catálogo."
              : "Completa los campos para agregar una nueva entrada al catálogo del sistema."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <ScrollArea className="h-[460px] pr-4">
              <div className="space-y-5 pb-2">
                {/* Tipo de Catálogo */}
                <FormField
                  control={form.control}
                  name="tipoCatalogo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Catálogo</FormLabel>
                      {catalogTypes.length > 0 ? (
                        <Select
                          value={field.value}
                          onValueChange={(val) => {
                            field.onChange(val);
                            form.setValue("idCatalogoPadre", undefined);
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona o escribe un tipo..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {catalogTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <FormControl>
                          <Input
                            placeholder="Ej: INDUSTRIA, CIUDAD..."
                            {...field}
                          />
                        </FormControl>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Nombre */}
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Tecnología, Bogotá..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Descripción */}
                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Descripción{" "}
                        <span className="text-gray-400 font-normal">
                          (opcional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descripción breve de esta entrada..."
                          className="resize-none"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  {/* Código */}
                  <FormField
                    control={form.control}
                    name="codigo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Código{" "}
                          <span className="text-gray-400 font-normal">
                            (opcional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: TEC, ECU..."
                            className="font-mono"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Orden */}
                  <FormField
                    control={form.control}
                    name="orden"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Orden</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            placeholder="1"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Valor Entero */}
                  <FormField
                    control={form.control}
                    name="valorEntero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Valor Entero{" "}
                          <span className="text-gray-400 font-normal">
                            (opcional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value),
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Valor Cadena */}
                  <FormField
                    control={form.control}
                    name="valorCadena"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Valor Cadena{" "}
                          <span className="text-gray-400 font-normal">
                            (opcional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Valor texto..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Catálogo Padre */}
                {possibleParents.length > 0 && (
                  <FormField
                    control={form.control}
                    name="idCatalogoPadre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Catálogo Padre{" "}
                          <span className="text-gray-400 font-normal">
                            (opcional)
                          </span>
                        </FormLabel>
                        <Select
                          value={
                            field.value ? String(field.value) : NO_PARENT_VALUE
                          }
                          onValueChange={(val) =>
                            field.onChange(
                              val === NO_PARENT_VALUE ? undefined : Number(val),
                            )
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sin catálogo padre" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={NO_PARENT_VALUE}>
                              Sin padre (nivel raíz)
                            </SelectItem>
                            {possibleParents.map((parent) => (
                              <SelectItem
                                key={parent.idCatalogo}
                                value={String(parent.idCatalogo)}
                              >
                                {parent.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Activo */}
                <FormField
                  control={form.control}
                  name="activo"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <FormLabel className="text-base">Estado activo</FormLabel>
                        <p className="text-sm text-gray-500">
                          Las entradas inactivas no aparecen en los formularios
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Guardando..."
                  : isEditing
                    ? "Guardar Cambios"
                    : "Crear Entrada"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
