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
import { CarpetaEmpresa, CarpetaFormValues } from "@/types/admin";

const schema = z.object({
  nombreCarpeta: z
    .string()
    .min(1, "El nombre es requerido")
    .max(200, "Máximo 200 caracteres"),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional(),
  idCarpetaPadre: z.string().optional(),
});

const NO_PARENT = "__root__";

interface CarpetaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  carpeta: CarpetaEmpresa | null;
  carpetas: CarpetaEmpresa[];
  onSubmit: (data: CarpetaFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export default function CarpetaFormDialog({
  open,
  onOpenChange,
  carpeta,
  carpetas,
  onSubmit,
  isSubmitting,
}: CarpetaFormDialogProps) {
  const isEditing = !!carpeta;

  const form = useForm<CarpetaFormValues>({
    resolver: zodResolver(schema) as Resolver<CarpetaFormValues>,
    defaultValues: { nombreCarpeta: "", descripcion: "", idCarpetaPadre: undefined },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        nombreCarpeta: carpeta?.nombreCarpeta ?? "",
        descripcion: carpeta?.descripcion ?? "",
        idCarpetaPadre: carpeta?.idCarpetaPadre ?? undefined,
      });
    }
  }, [open, carpeta, form]);

  const possibleParents = carpetas.filter(
    (c) => c.idCarpetaEmpresa !== carpeta?.idCarpetaEmpresa,
  );

  const handleSubmit = async (data: CarpetaFormValues) => {
    await onSubmit({
      ...data,
      descripcion: data.descripcion || undefined,
      idCarpetaPadre:
        data.idCarpetaPadre === NO_PARENT ? undefined : data.idCarpetaPadre,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Carpeta" : "Nueva Carpeta"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica el nombre o descripción de esta carpeta."
              : "Crea una nueva carpeta para organizar tus archivos."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="space-y-5 py-2">
              <FormField
                control={form.control}
                name="nombreCarpeta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Contratos, Facturas..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Descripción{" "}
                      <span className="text-zinc-400 font-normal">(opcional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descripción breve..."
                        className="resize-none"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isEditing && possibleParents.length > 0 && (
                <FormField
                  control={form.control}
                  name="idCarpetaPadre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Subcarpeta de{" "}
                        <span className="text-zinc-400 font-normal">(opcional)</span>
                      </FormLabel>
                      <Select
                        value={field.value ?? NO_PARENT}
                        onValueChange={(val) =>
                          field.onChange(val === NO_PARENT ? undefined : val)
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sin carpeta padre" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={NO_PARENT}>
                            Sin carpeta padre
                          </SelectItem>
                          {possibleParents.map((c) => (
                            <SelectItem key={c.idCarpetaEmpresa} value={c.idCarpetaEmpresa}>
                              {c.nombreCarpeta}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
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
                {isSubmitting ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Carpeta"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
