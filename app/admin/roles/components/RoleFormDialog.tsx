"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { mockPermisos } from "@/lib/admin/adminRoles";
import { ScrollArea } from "@/components/ui/scroll-area";

const roleFormSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  descripcion: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(200, "La descripción no puede exceder 200 caracteres"),
  permisos: z.array(z.string()).min(1, "Selecciona al menos un permiso"),
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: AdminRole | null;
  onSubmit: (data: RoleFormValues) => void;
}

export default function RoleFormDialog({
  open,
  onOpenChange,
  role,
  onSubmit,
}: RoleFormDialogProps) {
  const [permisos, setPermisos] = useState<RolePermiso[]>([]);
  const isEditing = !!role;

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      permisos: [],
    },
  });

  // Load permissions
  useEffect(() => {
    // TODO: Fetch from API when available
    setPermisos(mockPermisos);
  }, []);

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
                    <Input placeholder="Ej: Supervisor" {...field} />
                  </FormControl>
                  <FormMessage />
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
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">
                              {modulo}
                            </h4>
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
                                        <p className="text-xs text-gray-500">
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
