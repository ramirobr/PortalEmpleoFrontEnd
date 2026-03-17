"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { CompanyProfileData, CompanyProfileFiltersResponse } from "@/types/company";
import { Pencil } from "lucide-react";
import { fetchApi } from "@/lib/apiClient";
import { toast } from "sonner";
import { useState } from "react";

const adminInfoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  apellido: z.string().min(1, "El apellido es requerido"),
  correoElectronico: z.string().email("Correo electrónico inválido"),
  telefono: z.string().min(1, "El teléfono es requerido"),
  telefonoMovil: z.string().optional(),
  idGenero: z.number().min(1, "Selecciona un género"),
});

type AdminInfoFormData = z.infer<typeof adminInfoSchema>;

interface AdminInfoFormProps {
  companyData: CompanyProfileData;
  filters: CompanyProfileFiltersResponse | null;
  accessToken?: string;
  onSuccess: (updatedData: Partial<CompanyProfileData>) => void;
}

export function AdminInfoForm({
  companyData,
  filters,
  accessToken,
  onSuccess,
}: AdminInfoFormProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<AdminInfoFormData>({
    resolver: zodResolver(adminInfoSchema),
    defaultValues: {
      nombre: companyData.usuarioAdministrador?.nombre || "",
      apellido: companyData.usuarioAdministrador?.apellido || "",
      correoElectronico:
        companyData.usuarioAdministrador?.correoElectronico || "",
      telefono: companyData.usuarioAdministrador?.telefono || "",
      telefonoMovil: companyData.usuarioAdministrador?.telefonoMovil || "",
      idGenero: companyData.usuarioAdministrador?.genero?.id || 0,
    },
  });

  const onSubmit = async (data: AdminInfoFormData) => {
    try {
      const response = await fetchApi(`/Company/update-admin-user`, {
        method: "PUT",
        body: {
          idUsuario: companyData.usuarioAdministrador?.idUsuario,
          ...data,
        },
        token: accessToken,
      });

      if (response) {
        const selectedGenero = filters?.genero?.find(
          (g) => g.idCatalogo === data.idGenero,
        );

        onSuccess({
          usuarioAdministrador: companyData.usuarioAdministrador
            ? {
                ...companyData.usuarioAdministrador,
                nombre: data.nombre,
                apellido: data.apellido,
                nombreCompleto: `${data.nombre} ${data.apellido}`,
                correoElectronico: data.correoElectronico,
                telefono: data.telefono,
                telefonoMovil: data.telefonoMovil,
                genero: selectedGenero
                  ? {
                      id: selectedGenero.idCatalogo,
                      nombre: selectedGenero.nombre,
                    }
                  : companyData.usuarioAdministrador.genero,
              }
            : undefined,
        });

        setOpen(false);
        toast.success("Administrador actualizado correctamente");
      }
    } catch {
      toast.error("Error al actualizar el administrador");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Usuario Administrador</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adminNombre">Nombre</Label>
              <Input
                id="adminNombre"
                {...form.register("nombre")}
                aria-invalid={!!form.formState.errors.nombre}
              />
              {form.formState.errors.nombre && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.nombre.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminApellido">Apellido</Label>
              <Input
                id="adminApellido"
                {...form.register("apellido")}
                aria-invalid={!!form.formState.errors.apellido}
              />
              {form.formState.errors.apellido && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.apellido.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminCorreo">Correo electrónico</Label>
            <Input
              id="adminCorreo"
              type="email"
              {...form.register("correoElectronico")}
              aria-invalid={!!form.formState.errors.correoElectronico}
            />
            {form.formState.errors.correoElectronico && (
              <p className="text-sm text-red-500">
                {form.formState.errors.correoElectronico.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adminTelefono">Teléfono</Label>
              <Input
                id="adminTelefono"
                {...form.register("telefono")}
                aria-invalid={!!form.formState.errors.telefono}
              />
              {form.formState.errors.telefono && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.telefono.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminTelefonoMovil">Teléfono móvil</Label>
              <Input
                id="adminTelefonoMovil"
                {...form.register("telefonoMovil")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminGenero">Género</Label>
            <Select
              value={form.watch("idGenero").toString()}
              onValueChange={(value) =>
                form.setValue("idGenero", parseInt(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un género" />
              </SelectTrigger>
              <SelectContent>
                {filters?.genero?.map((genero) => (
                  <SelectItem
                    key={genero.idCatalogo}
                    value={genero.idCatalogo.toString()}
                  >
                    {genero.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.idGenero && (
              <p className="text-sm text-red-500">
                {form.formState.errors.idGenero.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <span className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full mr-2" />
              )}
              {form.formState.isSubmitting ? "Guardando" : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
