"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AdminRole, RolePermiso } from "@/types/admin";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle } from "lucide-react";

const roleFormSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  descripcion: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(200, "La descripción no puede exceder 200 caracteres"),
  permisos: z.array(z.string()),
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: AdminRole | null;
  onSubmit: (data: RoleFormValues) => void;
  permisos: RolePermiso[];
}

export default function RoleFormDialog({
  open,
  onOpenChange,
  role,
  onSubmit,
  permisos,
}: RoleFormDialogProps) {
  const isEditing = !!role;
  const isSystemRole =
    !!role &&
    ["Administrador Sistema", "Administrador Empresa", "Administrador de empresa", "Postulante"].includes(
      role.nombre,
    );

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      permisos: [],
    },
  });
  const selectedPermisos = useWatch({
    control: form.control,
    name: "permisos",
  }) ?? [];

  // Reset form when dialog opens/closes or role changes
  useEffect(() => {
    if (open) {
      if (role) {
        form.reset({
          nombre: role.nombre,
          descripcion: role.descripcion,
          permisos: role.permisos.map((p) => p.idPermiso),
        });
      } else {
        form.reset({
          nombre: "",
          descripcion: "",
          permisos: [],
        });
      }
    }
  }, [open, role, form]);

  const handleSubmit = (data: RoleFormValues) => {
    onSubmit(data);
  };

  // Group permissions by module
  const permisosByModule = permisos.reduce(
    (acc, permiso) => {
      if (!acc[permiso.modulo]) {
        acc[permiso.modulo] = [];
      }
      acc[permiso.modulo].push(permiso);
      return acc;
    },
    {} as Record<string, RolePermiso[]>,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Rol" : "Crear Nuevo Rol"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica la información del rol y sus permisos."
              : "Completa la información para crear un nuevo rol en el sistema."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Role Name */}
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Rol</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Supervisor"
                      disabled={isSystemRole}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  {isSystemRole && (
                    <p className="text-xs text-slate-500">
                      Los roles del sistema conservan su nombre para no romper los accesos existentes.
                    </p>
                  )}
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe las responsabilidades y alcance de este rol..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Permissions */}
            <FormField
              control={form.control}
              name="permisos"
              render={() => (
                <FormItem>
                  <FormLabel>Permisos</FormLabel>
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="space-y-6">
                      {Object.entries(permisosByModule).map(
                        ([modulo, moduloPermisos]) => (
                          <div key={modulo}>
                            <div className="mb-2 flex items-center justify-between gap-3">
                              <h4 className="font-semibold text-sm text-slate-700">
                                {modulo}
                              </h4>
                              <button
                                type="button"
                                className="text-xs font-semibold text-primary hover:underline"
                                onClick={() => {
                                  const current = form.getValues("permisos");
                                  const moduleIds = moduloPermisos.map(
                                    (permiso) => permiso.idPermiso,
                                  );
                                  const hasAll = moduleIds.every((id) =>
                                    current.includes(id),
                                  );
                                  form.setValue(
                                    "permisos",
                                    hasAll
                                      ? current.filter(
                                          (id) => !moduleIds.includes(id),
                                        )
                                      : Array.from(
                                          new Set([...current, ...moduleIds]),
                                        ),
                                    { shouldDirty: true, shouldValidate: true },
                                  );
                                }}
                              >
                                {moduloPermisos.every((permiso) =>
                                  selectedPermisos.includes(permiso.idPermiso),
                                )
                                  ? "Quitar módulo"
                                  : "Seleccionar módulo"}
                              </button>
                            </div>
                            <div className="grid grid-cols-1 gap-2 ml-2">
                              {moduloPermisos.map((permiso) => (
                                <FormField
                                  key={permiso.idPermiso}
                                  control={form.control}
                                  name="permisos"
                                  render={({ field }) => (
                                    <FormItem className="flex items-start space-x-3 space-y-0">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(
                                            permiso.idPermiso,
                                          )}
                                          onCheckedChange={(checked) => {
                                            const current = field.value || [];
                                            if (checked) {
                                              field.onChange([
                                                ...current,
                                                permiso.idPermiso,
                                              ]);
                                            } else {
                                              field.onChange(
                                                current.filter(
                                                  (id) =>
                                                    id !== permiso.idPermiso,
                                                ),
                                              );
                                            }
                                          }}
                                        />
                                      </FormControl>
                                      <div className="space-y-0.5 leading-none">
                                        <FormLabel className="text-sm font-normal cursor-pointer">
                                          {permiso.nombre}
                                        </FormLabel>
                                        <p className="text-xs text-slate-500">
                                          {permiso.descripcion}
                                        </p>
                                      </div>
                                    </FormItem>
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                        ),
                      )}
                      {permisos.length === 0 && (
                        <div className="flex gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                          <AlertCircle className="mt-0.5 size-5 shrink-0" />
                          <div>
                            <p className="font-semibold">No hay permisos cargados</p>
                            <p className="mt-1">
                              Ejecuta el script SQL de seed de permisos para habilitar la asignación granular.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? "Guardar Cambios" : "Crear Rol"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
