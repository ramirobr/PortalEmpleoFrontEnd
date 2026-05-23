"use client";

import { useMemo, useState } from "react";
import { Save } from "lucide-react";
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
import { AdminEmpresaUpdateRequest } from "@/types/admin";
import { CompanyProfileData } from "@/types/company";
import { CatalogsByType } from "@/types/search";

type EmpresaFormState = {
  nombre: string;
  razonSocial: string;
  idCondicionFiscal: string;
  numeroDocumento: string;
  idIndustria: string;
  idCantidadEmpleados: string;
  sitioWeb: string;
  idEstadoEmpresa: string;
  tiempoOperacion: string;
  certificaciones: string;
  correoContacto: string;
  telefonoContacto: string;
  direccion: string;
  idCiudad: string;
  latitud: string;
  longitud: string;
  nombreAdministrador: string;
  apellidoAdministrador: string;
  correoAdministrador: string;
  telefonoAdministrador: string;
  telefonoMovilAdministrador: string;
  idGeneroAdministrador: string;
};

type CatalogState = {
  estadoOptions: CatalogsByType[];
  condicionFiscalOptions: CatalogsByType[];
  industriaOptions: CatalogsByType[];
  cantidadEmpleadosOptions: CatalogsByType[];
  ciudadOptions: CatalogsByType[];
  generoOptions: CatalogsByType[];
};

interface EmpresaEditDialogProps {
  open: boolean;
  empresa: CompanyProfileData | null;
  catalogs: CatalogState;
  loading: boolean;
  saving: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AdminEmpresaUpdateRequest) => Promise<void>;
}

const emptyForm: EmpresaFormState = {
  nombre: "",
  razonSocial: "",
  idCondicionFiscal: "0",
  numeroDocumento: "",
  idIndustria: "0",
  idCantidadEmpleados: "0",
  sitioWeb: "",
  idEstadoEmpresa: "0",
  tiempoOperacion: "",
  certificaciones: "",
  correoContacto: "",
  telefonoContacto: "",
  direccion: "",
  idCiudad: "0",
  latitud: "",
  longitud: "",
  nombreAdministrador: "",
  apellidoAdministrador: "",
  correoAdministrador: "",
  telefonoAdministrador: "",
  telefonoMovilAdministrador: "",
  idGeneroAdministrador: "0",
};

function toSelectValue(value?: number | null) {
  return value ? value.toString() : "0";
}

function toOptionalNumber(value: string) {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function buildForm(empresa: CompanyProfileData | null): EmpresaFormState {
  if (!empresa) return emptyForm;

  return {
    nombre: empresa.nombre ?? "",
    razonSocial: empresa.razonSocial ?? "",
    idCondicionFiscal: toSelectValue(empresa.condicionFiscal?.id),
    numeroDocumento: empresa.numeroDocumento ?? "",
    idIndustria: toSelectValue(empresa.industria?.id),
    idCantidadEmpleados: toSelectValue(empresa.cantidadEmpleados?.id),
    sitioWeb: empresa.sitioWeb ?? "",
    idEstadoEmpresa: toSelectValue(empresa.estado?.id),
    tiempoOperacion: empresa.tiempoOperacion?.toString() ?? "",
    certificaciones: empresa.certificaciones ?? "",
    correoContacto: empresa.correoContacto ?? "",
    telefonoContacto: empresa.telefonoContacto ?? "",
    direccion: empresa.direccion ?? "",
    idCiudad: toSelectValue(empresa.ciudad?.id),
    latitud: empresa.latitud?.toString() ?? "",
    longitud: empresa.longitud?.toString() ?? "",
    nombreAdministrador: empresa.usuarioAdministrador?.nombre ?? "",
    apellidoAdministrador: empresa.usuarioAdministrador?.apellido ?? "",
    correoAdministrador: empresa.usuarioAdministrador?.correoElectronico ?? "",
    telefonoAdministrador: empresa.usuarioAdministrador?.telefono ?? "",
    telefonoMovilAdministrador: empresa.usuarioAdministrador?.telefonoMovil ?? "",
    idGeneroAdministrador: toSelectValue(empresa.usuarioAdministrador?.genero?.id),
  };
}

export default function EmpresaEditDialog({
  open,
  empresa,
  catalogs,
  loading,
  saving,
  onOpenChange,
  onSubmit,
}: EmpresaEditDialogProps) {
  const [form, setForm] = useState<EmpresaFormState>(() => buildForm(empresa));

  const hasAdminUser = Boolean(empresa?.usuarioAdministrador?.idUsuario);
  const title = useMemo(
    () => (empresa ? `Editar ${empresa.nombre}` : "Editar empresa"),
    [empresa],
  );

  const updateField = (field: keyof EmpresaFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!empresa) return;

    await onSubmit({
      idEmpresa: empresa.idEmpresa,
      nombre: form.nombre.trim(),
      razonSocial: form.razonSocial.trim(),
      idCondicionFiscal: Number(form.idCondicionFiscal),
      numeroDocumento: form.numeroDocumento.trim(),
      idIndustria: Number(form.idIndustria),
      idCantidadEmpleados: Number(form.idCantidadEmpleados),
      sitioWeb: form.sitioWeb.trim() || undefined,
      idEstadoEmpresa: Number(form.idEstadoEmpresa),
      tiempoOperacion: toOptionalNumber(form.tiempoOperacion),
      certificaciones: form.certificaciones.trim() || undefined,
      correoContacto: form.correoContacto.trim(),
      telefonoContacto: form.telefonoContacto.trim() || undefined,
      direccion: form.direccion.trim(),
      idCiudad: Number(form.idCiudad),
      latitud: toOptionalNumber(form.latitud),
      longitud: toOptionalNumber(form.longitud),
      idUsuarioAdministrador: empresa.usuarioAdministrador?.idUsuario,
      nombreAdministrador: form.nombreAdministrador.trim() || undefined,
      apellidoAdministrador: form.apellidoAdministrador.trim() || undefined,
      correoAdministrador: form.correoAdministrador.trim() || undefined,
      telefonoAdministrador: form.telefonoAdministrador.trim() || undefined,
      telefonoMovilAdministrador: form.telefonoMovilAdministrador.trim() || undefined,
      idGeneroAdministrador: Number(form.idGeneroAdministrador) || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Actualiza los datos administrativos de la empresa seleccionada.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-10 text-center text-sm text-slate-500">
            Cargando información de la empresa...
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <section className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="empresa-nombre">Nombre comercial</Label>
                <Input
                  id="empresa-nombre"
                  value={form.nombre}
                  onChange={(event) => updateField("nombre", event.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="empresa-razon-social">Razón social</Label>
                <Input
                  id="empresa-razon-social"
                  value={form.razonSocial}
                  onChange={(event) => updateField("razonSocial", event.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="empresa-documento">Número de documento</Label>
                <Input
                  id="empresa-documento"
                  value={form.numeroDocumento}
                  onChange={(event) => updateField("numeroDocumento", event.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Estado</Label>
                <Select
                  value={form.idEstadoEmpresa}
                  onValueChange={(value) => updateField("idEstadoEmpresa", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {catalogs.estadoOptions.map((item) => (
                      <SelectItem key={item.idCatalogo} value={item.idCatalogo.toString()}>
                        {item.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Condición fiscal</Label>
                <Select
                  value={form.idCondicionFiscal}
                  onValueChange={(value) => updateField("idCondicionFiscal", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona condición fiscal" />
                  </SelectTrigger>
                  <SelectContent>
                    {catalogs.condicionFiscalOptions.map((item) => (
                      <SelectItem key={item.idCatalogo} value={item.idCatalogo.toString()}>
                        {item.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Industria</Label>
                <Select
                  value={form.idIndustria}
                  onValueChange={(value) => updateField("idIndustria", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona industria" />
                  </SelectTrigger>
                  <SelectContent>
                    {catalogs.industriaOptions.map((item) => (
                      <SelectItem key={item.idCatalogo} value={item.idCatalogo.toString()}>
                        {item.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Cantidad de empleados</Label>
                <Select
                  value={form.idCantidadEmpleados}
                  onValueChange={(value) => updateField("idCantidadEmpleados", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona cantidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {catalogs.cantidadEmpleadosOptions.map((item) => (
                      <SelectItem key={item.idCatalogo} value={item.idCatalogo.toString()}>
                        {item.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="empresa-sitio">Sitio web</Label>
                <Input
                  id="empresa-sitio"
                  value={form.sitioWeb}
                  onChange={(event) => updateField("sitioWeb", event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="empresa-tiempo">Tiempo de operación</Label>
                <Input
                  id="empresa-tiempo"
                  type="number"
                  min={0}
                  value={form.tiempoOperacion}
                  onChange={(event) => updateField("tiempoOperacion", event.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="empresa-certificaciones">Certificaciones</Label>
                <Textarea
                  id="empresa-certificaciones"
                  value={form.certificaciones}
                  onChange={(event) => updateField("certificaciones", event.target.value)}
                />
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="empresa-correo">Correo de contacto</Label>
                <Input
                  id="empresa-correo"
                  type="email"
                  value={form.correoContacto}
                  onChange={(event) => updateField("correoContacto", event.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="empresa-telefono">Teléfono de contacto</Label>
                <Input
                  id="empresa-telefono"
                  value={form.telefonoContacto}
                  onChange={(event) => updateField("telefonoContacto", event.target.value)}
                />
              </div>
              <div>
                <Label>Ciudad</Label>
                <Select
                  value={form.idCiudad}
                  onValueChange={(value) => updateField("idCiudad", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona ciudad" />
                  </SelectTrigger>
                  <SelectContent>
                    {catalogs.ciudadOptions.map((item) => (
                      <SelectItem key={item.idCatalogo} value={item.idCatalogo.toString()}>
                        {item.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="empresa-direccion">Dirección</Label>
                <Input
                  id="empresa-direccion"
                  value={form.direccion}
                  onChange={(event) => updateField("direccion", event.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="empresa-latitud">Latitud</Label>
                <Input
                  id="empresa-latitud"
                  type="number"
                  step="any"
                  value={form.latitud}
                  onChange={(event) => updateField("latitud", event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="empresa-longitud">Longitud</Label>
                <Input
                  id="empresa-longitud"
                  type="number"
                  step="any"
                  value={form.longitud}
                  onChange={(event) => updateField("longitud", event.target.value)}
                />
              </div>
            </section>

            {hasAdminUser && (
              <section className="grid gap-4 border-t border-zinc-100 pt-6 md:grid-cols-2">
                <div>
                  <Label htmlFor="empresa-admin-nombre">Nombre administrador</Label>
                  <Input
                    id="empresa-admin-nombre"
                    value={form.nombreAdministrador}
                    onChange={(event) => updateField("nombreAdministrador", event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="empresa-admin-apellido">Apellido administrador</Label>
                  <Input
                    id="empresa-admin-apellido"
                    value={form.apellidoAdministrador}
                    onChange={(event) => updateField("apellidoAdministrador", event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="empresa-admin-correo">Correo administrador</Label>
                  <Input
                    id="empresa-admin-correo"
                    type="email"
                    value={form.correoAdministrador}
                    onChange={(event) => updateField("correoAdministrador", event.target.value)}
                  />
                </div>
                <div>
                  <Label>Género</Label>
                  <Select
                    value={form.idGeneroAdministrador}
                    onValueChange={(value) => updateField("idGeneroAdministrador", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona género" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Sin especificar</SelectItem>
                      {catalogs.generoOptions.map((item) => (
                        <SelectItem key={item.idCatalogo} value={item.idCatalogo.toString()}>
                          {item.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="empresa-admin-telefono">Teléfono</Label>
                  <Input
                    id="empresa-admin-telefono"
                    value={form.telefonoAdministrador}
                    onChange={(event) => updateField("telefonoAdministrador", event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="empresa-admin-movil">Teléfono móvil</Label>
                  <Input
                    id="empresa-admin-movil"
                    value={form.telefonoMovilAdministrador}
                    onChange={(event) =>
                      updateField("telefonoMovilAdministrador", event.target.value)
                    }
                  />
                </div>
              </section>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                <Save className="size-4" />
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
