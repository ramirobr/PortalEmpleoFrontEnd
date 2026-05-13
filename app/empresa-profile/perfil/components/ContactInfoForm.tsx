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
import MapPicker from "@/components/ui/map-picker";
import { CompanyProfileData, CompanyProfileFiltersResponse } from "@/types/company";
import { Pencil, Search, X } from "lucide-react";
import { fetchApi } from "@/lib/apiClient";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

type GeocodeResult = {
  formatted_address: string;
  geometry: { location: { lat: number; lng: number } };
  address_components: Array<{ long_name: string; types: string[] }>;
};

async function reverseGeocode(lat: number, lng: number): Promise<GeocodeResult | null> {
  try {
    const res = await fetch(`${GEOCODE_URL}?latlng=${lat},${lng}&key=${API_KEY}&language=es`);
    const data = await res.json();
    return data.results?.[0] ?? null;
  } catch {
    return null;
  }
}

async function forwardGeocode(address: string): Promise<GeocodeResult | null> {
  try {
    const res = await fetch(`${GEOCODE_URL}?address=${encodeURIComponent(address)}&key=${API_KEY}&language=es`);
    const data = await res.json();
    return data.results?.[0] ?? null;
  } catch {
    return null;
  }
}

function extractLocality(components: Array<{ long_name: string; types: string[] }>): string | null {
  const priority = ["locality", "administrative_area_level_2", "sublocality_level_1", "sublocality"];
  for (const type of priority) {
    const comp = components.find((c) => c.types.includes(type));
    if (comp) return comp.long_name;
  }
  return null;
}

function findCityId(
  localityName: string,
  ciudades: Array<{ idCatalogo: number; nombre: string }>,
): number | null {
  const lower = localityName.toLowerCase();
  return ciudades.find((c) => c.nombre.toLowerCase() === lower)?.idCatalogo ?? null;
}

const contactInfoSchema = z.object({
  correoContacto: z.string().email("Correo electrónico inválido"),
  telefonoContacto: z.string().min(1, "El teléfono es requerido"),
  direccion: z.string().min(1, "La dirección es requerida"),
  idCiudad: z.number().min(1, "Selecciona una ciudad"),
  latitud: z.number().optional(),
  longitud: z.number().optional(),
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
  const [geocoding, setGeocoding] = useState(false);

  const form = useForm<ContactInfoFormData>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      correoContacto: companyData.correoContacto || "",
      telefonoContacto: companyData.telefonoContacto || "",
      direccion: companyData.direccion || "",
      idCiudad: companyData.ciudad?.id || 0,
      latitud: companyData.latitud ?? undefined,
      longitud: companyData.longitud ?? undefined,
    },
  });

  // Auto forward-geocode when opening without existing coords but with an address
  useEffect(() => {
    if (
      open &&
      !companyData.latitud &&
      companyData.direccion
    ) {
      handleForwardGeocode(companyData.direccion);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleMapClick = async (coords: { lat: number; lng: number }) => {
    form.setValue("latitud", coords.lat);
    form.setValue("longitud", coords.lng);

    setGeocoding(true);
    const result = await reverseGeocode(coords.lat, coords.lng);
    setGeocoding(false);

    if (result) {
      form.setValue("direccion", result.formatted_address);
      const locality = extractLocality(result.address_components);
      if (locality && filters?.ciudad) {
        const cityId = findCityId(locality, filters.ciudad);
        if (cityId) form.setValue("idCiudad", cityId);
      }
    }
  };

  const handleForwardGeocode = async (address?: string) => {
    const addr = address ?? form.getValues("direccion");
    if (!addr) return;
    setGeocoding(true);
    const result = await forwardGeocode(addr);
    setGeocoding(false);
    if (result) {
      form.setValue("latitud", result.geometry.location.lat);
      form.setValue("longitud", result.geometry.location.lng);
    } else {
      toast.error("No se encontró la dirección en el mapa");
    }
  };

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
          latitud: data.latitud,
          longitud: data.longitud,
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

  const latVal = form.watch("latitud");
  const lngVal = form.watch("longitud");
  const hasPin = latVal != null && lngVal != null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Información de Contacto</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">

          {/* Map */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label>
                Ubicación{" "}
                <span className="text-gray-400 font-normal text-xs">(haz clic en el mapa para marcar)</span>
              </Label>
              {hasPin && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-gray-500 gap-1"
                  onClick={() => {
                    form.setValue("latitud", undefined);
                    form.setValue("longitud", undefined);
                  }}
                >
                  <X className="h-3 w-3" /> Limpiar pin
                </Button>
              )}
            </div>
            <MapPicker
              value={hasPin ? { lat: latVal!, lng: lngVal! } : null}
              onChange={handleMapClick}
              className="w-full h-72 rounded-lg overflow-hidden border"
            />
            {hasPin && (
              <p className="text-xs text-gray-500">
                {geocoding ? "Buscando dirección..." : `Lat: ${latVal!.toFixed(6)}, Lng: ${lngVal!.toFixed(6)}`}
              </p>
            )}
          </div>

          {/* Dirección + Localizar */}
          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <div className="flex gap-2">
              <Input
                id="direccion"
                className="flex-1"
                {...form.register("direccion")}
                aria-invalid={!!form.formState.errors.direccion}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0 gap-1"
                disabled={geocoding}
                onClick={() => handleForwardGeocode()}
              >
                <Search className="h-4 w-4" />
                Localizar
              </Button>
            </div>
            {form.formState.errors.direccion && (
              <p className="text-sm text-red-500">
                {form.formState.errors.direccion.message}
              </p>
            )}
          </div>

          {/* Ciudad */}
          <div className="space-y-2">
            <Label htmlFor="ciudad">Ciudad</Label>
            <Select
              value={form.watch("idCiudad").toString()}
              onValueChange={(value) => form.setValue("idCiudad", parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una ciudad" />
              </SelectTrigger>
              <SelectContent>
                {filters?.ciudad?.map((ciudad) => (
                  <SelectItem key={ciudad.idCatalogo} value={ciudad.idCatalogo.toString()}>
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

          {/* Teléfono + Correo */}
          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <span className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full mr-2" />
              )}
              {form.formState.isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
