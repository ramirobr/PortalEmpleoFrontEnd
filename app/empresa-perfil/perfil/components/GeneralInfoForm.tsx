"use client";

import { useForm, UseFormReturn } from "react-hook-form";
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
import { SearchAutocomplete } from "@/components/ui/search-autocomplete";
import { CompanyProfileData, CompanyProfileFiltersResponse } from "@/types/company";
import { Pencil } from "lucide-react";
import { fetchApi } from "@/lib/apiClient";
import { toast } from "sonner";
import { useState } from "react";
import { normalizeWebsiteUrl } from "@/lib/url";
import { Textarea } from "@/components/ui/textarea";

const generalInfoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  razonSocial: z.string().min(1, "La razón social es requerida"),
  idCondicionFiscal: z.number().min(1, "Selecciona una condición fiscal"),
  numeroDocumento: z.string().min(1, "El número de documento es requerido"),
  idIndustria: z.number().min(1, "Selecciona una industria"),
  idCantidadEmpleados: z.number().min(1, "Selecciona la cantidad de empleados"),
  sitioWeb: z.string().optional(),
  idEstadoEmpresa: z.number().min(1, "Selecciona un estado"),
  tiempoOperacion: z.number().min(0).optional(),
  certificaciones: z.string().optional(),
  descripcion: z.string().max(1000, "Máximo 1000 caracteres").optional(),
});

type GeneralInfoFormData = z.infer<typeof generalInfoSchema>;

function GeneralInfoFormFields({
  form,
  filters,
}: {
  form: UseFormReturn<GeneralInfoFormData>;
  filters: CompanyProfileFiltersResponse | null;
}) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre de la empresa</Label>
        <Input
          id="nombre"
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
        <Label htmlFor="razonSocial">Razón social</Label>
        <Input
          id="razonSocial"
          {...form.register("razonSocial")}
          aria-invalid={!!form.formState.errors.razonSocial}
        />
        {form.formState.errors.razonSocial && (
          <p className="text-sm text-red-500">
            {form.formState.errors.razonSocial.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="numeroDocumento">Número de documento</Label>
        <Input
          id="numeroDocumento"
          {...form.register("numeroDocumento")}
          aria-invalid={!!form.formState.errors.numeroDocumento}
        />
        {form.formState.errors.numeroDocumento && (
          <p className="text-sm text-red-500">
            {form.formState.errors.numeroDocumento.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="condicionFiscal">Condición fiscal</Label>
        <Select
          value={form.watch("idCondicionFiscal").toString()}
          onValueChange={(value) =>
            form.setValue("idCondicionFiscal", parseInt(value))
          }
        >
          <SelectTrigger id="condicionFiscal">
            <SelectValue placeholder="Selecciona una condición fiscal" />
          </SelectTrigger>
          <SelectContent>
            {filters?.condicion_fiscal?.map((opt) => (
              <SelectItem
                key={opt.idCatalogo}
                value={opt.idCatalogo.toString()}
              >
                {opt.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.idCondicionFiscal && (
          <p className="text-sm text-red-500">
            {form.formState.errors.idCondicionFiscal.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="industria">Industria</Label>
        <SearchAutocomplete<number>
          id="industria"
          options={
            filters?.industria?.map((opt) => ({
              id: opt.idCatalogo,
              label: opt.nombre,
            })) ?? []
          }
          value={form.watch("idIndustria") || undefined}
          onChange={(value) => form.setValue("idIndustria", value)}
          placeholder="Selecciona una industria"
          searchPlaceholder="Buscar industria..."
        />
        {form.formState.errors.idIndustria && (
          <p className="text-sm text-red-500">
            {form.formState.errors.idIndustria.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cantidadEmpleados">Cantidad de empleados</Label>
        <Select
          value={form.watch("idCantidadEmpleados").toString()}
          onValueChange={(value) =>
            form.setValue("idCantidadEmpleados", parseInt(value))
          }
        >
          <SelectTrigger id="cantidadEmpleados">
            <SelectValue placeholder="Selecciona una opción" />
          </SelectTrigger>
          <SelectContent>
            {filters?.cantidad_empleados?.map((opt) => (
              <SelectItem
                key={opt.idCatalogo}
                value={opt.idCatalogo.toString()}
              >
                {opt.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.idCantidadEmpleados && (
          <p className="text-sm text-red-500">
            {form.formState.errors.idCantidadEmpleados.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sitioWeb">Sitio web</Label>
        <Input
          id="sitioWeb"
          {...form.register("sitioWeb")}
          placeholder="https://"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tiempoOperacion">Años de operación</Label>
        <Input
          id="tiempoOperacion"
          type="number"
          min={0}
          {...form.register("tiempoOperacion", { valueAsNumber: true })}
          placeholder="Opcional"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="certificaciones">Certificaciones</Label>
        <Input
          id="certificaciones"
          {...form.register("certificaciones")}
          placeholder="Opcional"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="estado">Estado de la empresa</Label>
        <Select
          value={form.watch("idEstadoEmpresa").toString()}
          onValueChange={(value) =>
            form.setValue("idEstadoEmpresa", parseInt(value))
          }
        >
          <SelectTrigger id="estado">
            <SelectValue placeholder="Selecciona un estado" />
          </SelectTrigger>
          <SelectContent>
            {filters?.estado_empresa?.map((estado) => (
              <SelectItem
                key={estado.idCatalogo}
                value={estado.idCatalogo.toString()}
              >
                {estado.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.idEstadoEmpresa && (
          <p className="text-sm text-red-500">
            {form.formState.errors.idEstadoEmpresa.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción de la empresa</Label>
        <Textarea
          id="descripcion"
          {...form.register("descripcion")}
          placeholder="Describe la empresa, su actividad económica y principales líneas de negocio..."
          rows={4}
        />
        {form.formState.errors.descripcion && (
          <p className="text-sm text-red-500">
            {form.formState.errors.descripcion.message}
          </p>
        )}
      </div>
    </>
  );
}

interface GeneralInfoFormProps {
  companyData: CompanyProfileData;
  filters: CompanyProfileFiltersResponse | null;
  accessToken?: string;
  onSuccess: (updatedData: Partial<CompanyProfileData>) => void;
}

export function GeneralInfoForm({
  companyData,
  filters,
  accessToken,
  onSuccess,
}: GeneralInfoFormProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<GeneralInfoFormData>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      nombre: companyData.nombre,
      razonSocial: companyData.razonSocial,
      idCondicionFiscal: companyData.condicionFiscal?.id || 0,
      numeroDocumento: companyData.numeroDocumento || "",
      idIndustria: companyData.industria?.id || 0,
      idCantidadEmpleados: companyData.cantidadEmpleados?.id || 0,
      sitioWeb: companyData.sitioWeb || "",
      idEstadoEmpresa: companyData.estado?.id || 0,
      tiempoOperacion: companyData.tiempoOperacion ?? undefined,
      certificaciones: companyData.certificaciones || "",
      descripcion: companyData.descripcion || "",
    },
  });

  const onSubmit = async (data: GeneralInfoFormData) => {
    try {
      const sitioWeb = normalizeWebsiteUrl(data.sitioWeb);

      const response = await fetchApi(`/Company/update-general-info`, {
        method: "PUT",
        body: {
          idEmpresa: companyData.idEmpresa,
          ...data,
          sitioWeb,
          descripcion: data.descripcion || undefined,
        },
        token: accessToken,
      });

      if (response) {
        const selectedEstado = filters?.estado_empresa?.find(
          (e) => e.idCatalogo === data.idEstadoEmpresa,
        );
        const selectedCondicionFiscal = filters?.condicion_fiscal?.find(
          (e) => e.idCatalogo === data.idCondicionFiscal,
        );
        const selectedIndustria = filters?.industria?.find(
          (e) => e.idCatalogo === data.idIndustria,
        );
        const selectedCantidadEmpleados = filters?.cantidad_empleados?.find(
          (e) => e.idCatalogo === data.idCantidadEmpleados,
        );

        onSuccess({
          nombre: data.nombre,
          razonSocial: data.razonSocial,
          numeroDocumento: data.numeroDocumento,
          sitioWeb,
          tiempoOperacion: data.tiempoOperacion,
          certificaciones: data.certificaciones,
          descripcion: data.descripcion || undefined,
          estado: selectedEstado
            ? { id: selectedEstado.idCatalogo, nombre: selectedEstado.nombre }
            : companyData.estado,
          condicionFiscal: selectedCondicionFiscal
            ? {
                id: selectedCondicionFiscal.idCatalogo,
                nombre: selectedCondicionFiscal.nombre,
              }
            : companyData.condicionFiscal,
          industria: selectedIndustria
            ? {
                id: selectedIndustria.idCatalogo,
                nombre: selectedIndustria.nombre,
              }
            : companyData.industria,
          cantidadEmpleados: selectedCantidadEmpleados
            ? {
                id: selectedCantidadEmpleados.idCatalogo,
                nombre: selectedCantidadEmpleados.nombre,
              }
            : companyData.cantidadEmpleados,
        });

        setOpen(false);
        toast.success("Información actualizada correctamente");
      }
    } catch {
      toast.error("Error al actualizar la información");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="size-8 p-0">
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Información General</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <GeneralInfoFormFields form={form} filters={filters} />

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
                <span className="animate-spin size-4 border-2 border-t-transparent rounded-full mr-2" />
              )}
              {form.formState.isSubmitting ? "Guardando" : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
