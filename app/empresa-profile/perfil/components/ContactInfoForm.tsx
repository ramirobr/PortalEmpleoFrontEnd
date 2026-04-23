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

const contactInfoSchema = z.object({
  correoContacto: z.string().email("Correo electrónico inválido"),
  telefonoContacto: z.string().min(1, "El teléfono es requerido"),
  direccion: z.string().min(1, "La dirección es requerida"),
  idCiudad: z.number().min(1, "Selecciona una ciudad"),
});

type ContactInfoFormData = z.infer<typeof contactInfoSchema>;

interface ContactInfoFormProps {
  companyData: CompanyProfileData;
  filters: CompanyProfileFiltersResponse | null;
  accessToken?: string;
  onSuccess: (updatedData: Partial<CompanyProfileData>) => void;
}

export function ContactInfoForm({
  companyData,
  filters,
  accessToken,
  onSuccess,
}: ContactInfoFormProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<ContactInfoFormData>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      correoContacto: companyData.correoContacto || "",
      telefonoContacto: companyData.telefonoContacto || "",
      direccion: companyData.direccion || "",
      idCiudad: companyData.ciudad?.id || 0,
    },
  });

  const onSubmit = async (data: ContactInfoFormData) => {
    try {
      const response = await fetchApi(`/Company/update-contact-info`, {
        method: "PUT",
        body: {
          idEmpresa: companyData.idEmpresa,
          ...data,
        },
        token: accessToken,
      });

      if (response) {
        const selectedCiudad = filters?.ciudad?.find(
          (c) => c.idCatalogo === data.idCiudad,
        );

        onSuccess({
          correoContacto: data.correoContacto,
          telefonoContacto: data.telefonoContacto,
          direccion: data.direccion,
          ciudad: selectedCiudad
            ? { id: selectedCiudad.idCatalogo, nombre: selectedCiudad.nombre }
            : companyData.ciudad,
        });

        setOpen(false);
        toast.success("Contacto actualizado correctamente");
      }
    } catch {
      toast.error("Error al actualizar el contacto");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Información de Contacto</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="correoContacto">Correo de contacto</Label>
            <Input
              id="correoContacto"
              type="email"
              {...form.register("correoContacto")}
              aria-invalid={!!form.formState.errors.correoContacto}
            />
            {form.formState.errors.correoContacto && (
              <p className="text-sm text-red-500">
                {form.formState.errors.correoContacto.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefonoContacto">Teléfono</Label>
            <Input
              id="telefonoContacto"
              {...form.register("telefonoContacto")}
              aria-invalid={!!form.formState.errors.telefonoContacto}
            />
            {form.formState.errors.telefonoContacto && (
              <p className="text-sm text-red-500">
                {form.formState.errors.telefonoContacto.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              {...form.register("direccion")}
              aria-invalid={!!form.formState.errors.direccion}
            />
            {form.formState.errors.direccion && (
              <p className="text-sm text-red-500">
                {form.formState.errors.direccion.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ciudad">Ciudad</Label>
            <Select
              value={form.watch("idCiudad").toString()}
              onValueChange={(value) =>
                form.setValue("idCiudad", parseInt(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una ciudad" />
              </SelectTrigger>
              <SelectContent>
                {filters?.ciudad?.map((ciudad) => (
                  <SelectItem
                    key={ciudad.idCatalogo}
                    value={ciudad.idCatalogo.toString()}
                  >
                    {ciudad.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.idCiudad && (
              <p className="text-sm text-red-500">
                {form.formState.errors.idCiudad.message}
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
