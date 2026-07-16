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
import { AdminCandidatoUpdateRequest } from "@/types/admin";
import { CatalogsByType } from "@/types/search";
import { UserInfoData } from "@/types/user";

type CandidatoFormState = {
  nombre: string;
  apellido: string;
  correoElectronico: string;
  telefono: string;
  celular: string;
  idTipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento: string;
  nacionalidad: string;
  direccion: string;
  idPais: string;
  idProvincia: string;
  idCiudad: string;
  idEstadoCuenta: string;
  idGenero: string;
  idEstadoCivil: string;
  idTipoJornadaLaboral: string;
  movilidad: boolean;
  licencia: boolean;
  tipoLicencia: string;
  telefonoReferencia1: string;
  telefonoReferencia2: string;
};

type CatalogState = {
  estadoOptions: CatalogsByType[];
  tipoDocumentoOptions: CatalogsByType[];
  generoOptions: CatalogsByType[];
  estadoCivilOptions: CatalogsByType[];
  tipoEmpleoOptions: CatalogsByType[];
  paisOptions: CatalogsByType[];
  provinciaOptions: CatalogsByType[];
  ciudadOptions: CatalogsByType[];
};

interface CandidatoEditDialogProps {
  open: boolean;
  candidato: UserInfoData | null;
  catalogs: CatalogState;
  loading: boolean;
  saving: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AdminCandidatoUpdateRequest) => Promise<void>;
}

const emptyForm: CandidatoFormState = {
  nombre: "",
  apellido: "",
  correoElectronico: "",
  telefono: "",
  celular: "",
  idTipoDocumento: "0",
  numeroDocumento: "",
  fechaNacimiento: "",
  nacionalidad: "",
  direccion: "",
  idPais: "0",
  idProvincia: "0",
  idCiudad: "0",
  idEstadoCuenta: "0",
  idGenero: "0",
  idEstadoCivil: "0",
  idTipoJornadaLaboral: "0",
  movilidad: false,
  licencia: false,
  tipoLicencia: "",
  telefonoReferencia1: "",
  telefonoReferencia2: "",
};

function toSelectValue(value?: number | null) {
  return value ? value.toString() : "0";
}

function toDateInput(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function toOptionalNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function buildForm(candidato: UserInfoData | null): CandidatoFormState {
  if (!candidato) return emptyForm;

  return {
    nombre: candidato.datosPersonales?.nombre ?? "",
    apellido: candidato.datosPersonales?.apellido ?? "",
    correoElectronico: candidato.datosContacto?.email ?? "",
    telefono: candidato.datosContacto?.telefono ?? "",
    celular: candidato.datosContacto?.celular ?? "",
    idTipoDocumento: toSelectValue(candidato.datosPersonales?.idTipoDocumento),
    numeroDocumento: candidato.datosPersonales?.numeroDocumento ?? "",
    fechaNacimiento: toDateInput(candidato.datosPersonales?.fechaNacimiento),
    nacionalidad: candidato.datosPersonales?.nacionalidad ?? "",
    direccion: candidato.datosContacto?.direccion ?? "",
    idPais: toSelectValue(candidato.datosContacto?.idPais),
    idProvincia: toSelectValue(candidato.datosContacto?.idProvincia),
    idCiudad: toSelectValue(candidato.datosContacto?.idCiudad),
    idEstadoCuenta: toSelectValue(candidato.idEstadoCuenta),
    idGenero: toSelectValue(candidato.datosPersonales?.idGenero),
    idEstadoCivil: toSelectValue(candidato.datosPersonales?.idEstadoCivil),
    idTipoJornadaLaboral: toSelectValue(candidato.datosPersonales?.idTipoJornadaLaboral),
    movilidad: Boolean(candidato.datosPersonales?.movilidad),
    licencia: Boolean(candidato.datosPersonales?.licencia),
    tipoLicencia: candidato.datosPersonales?.tipoLicencia?.join(", ") ?? "",
    telefonoReferencia1: candidato.datosPersonales?.telefonoReferencia1 ?? "",
    telefonoReferencia2: candidato.datosPersonales?.telefonoReferencia2 ?? "",
  };
}

function CandidatoLocationSection({
  form,
  catalogs,
  onUpdate,
}: {
  form: CandidatoFormState;
  catalogs: CatalogState;
  onUpdate: (field: keyof CandidatoFormState, value: string) => void;
}) {
  return (
    <section className="grid gap-4 border-t border-zinc-100 pt-6 md:grid-cols-2">
      <div>
        <Label htmlFor="candidato-celular">Celular</Label>
        <Input
          id="candidato-celular"
          value={form.celular}
          onChange={(event) => onUpdate("celular", event.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="candidato-telefono">Teléfono</Label>
        <Input
          id="candidato-telefono"
          value={form.telefono}
          onChange={(event) => onUpdate("telefono", event.target.value)}
        />
      </div>
      <div>
        <Label>País</Label>
        <Select value={form.idPais} onValueChange={(value) => onUpdate("idPais", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona país" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Sin especificar</SelectItem>
            {catalogs.paisOptions.map((item) => (
              <SelectItem key={item.idCatalogo} value={item.idCatalogo.toString()}>
                {item.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Provincia</Label>
        <Select
          value={form.idProvincia}
          onValueChange={(value) => onUpdate("idProvincia", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona provincia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Sin especificar</SelectItem>
            {catalogs.provinciaOptions.map((item) => (
              <SelectItem key={item.idCatalogo} value={item.idCatalogo.toString()}>
                {item.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Ciudad</Label>
        <Select
          value={form.idCiudad}
          onValueChange={(value) => onUpdate("idCiudad", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona ciudad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Sin especificar</SelectItem>
            {catalogs.ciudadOptions.map((item) => (
              <SelectItem key={item.idCatalogo} value={item.idCatalogo.toString()}>
                {item.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="candidato-direccion">Dirección</Label>
        <Input
          id="candidato-direccion"
          value={form.direccion}
          onChange={(event) => onUpdate("direccion", event.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="candidato-nacionalidad">Nacionalidad</Label>
        <Input
          id="candidato-nacionalidad"
          value={form.nacionalidad}
          onChange={(event) => onUpdate("nacionalidad", event.target.value)}
        />
      </div>
    </section>
  );
}

function CandidatoMobilitySection({
  form,
  onUpdate,
}: {
  form: CandidatoFormState;
  onUpdate: (field: keyof CandidatoFormState, value: string | boolean) => void;
}) {
  return (
    <section className="grid gap-4 border-t border-zinc-100 pt-6 md:grid-cols-2">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={form.movilidad}
          onChange={(event) => onUpdate("movilidad", event.target.checked)}
        />
        Movilidad propia
      </label>
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={form.licencia}
          onChange={(event) => onUpdate("licencia", event.target.checked)}
        />
        Posee licencia
      </label>
      {form.licencia && (
        <div className="md:col-span-2">
          <Label htmlFor="candidato-licencias">Tipos de licencia</Label>
          <Input
            id="candidato-licencias"
            value={form.tipoLicencia}
            onChange={(event) => onUpdate("tipoLicencia", event.target.value)}
            placeholder="Ej. B, C"
          />
        </div>
      )}
      <div>
        <Label htmlFor="candidato-ref1">Teléfono referencia 1</Label>
        <Input
          id="candidato-ref1"
          value={form.telefonoReferencia1}
          onChange={(event) => onUpdate("telefonoReferencia1", event.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="candidato-ref2">Teléfono referencia 2</Label>
        <Input
          id="candidato-ref2"
          value={form.telefonoReferencia2}
          onChange={(event) => onUpdate("telefonoReferencia2", event.target.value)}
        />
      </div>
    </section>
  );
}

export default function CandidatoEditDialog({
  open,
  candidato,
  catalogs,
  loading,
  saving,
  onOpenChange,
  onSubmit,
}: CandidatoEditDialogProps) {
  const [form, setForm] = useState<CandidatoFormState>(() => buildForm(candidato));

  const title = useMemo(() => {
    if (!candidato) return "Editar candidato";
    return `Editar ${candidato.datosPersonales.nombre} ${candidato.datosPersonales.apellido}`;
  }, [candidato]);

  const updateField = (field: keyof CandidatoFormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!candidato) return;

    const tipoLicencia = form.tipoLicencia
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    await onSubmit({
      idUsuario: candidato.userId,
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      correoElectronico: form.correoElectronico.trim(),
      telefono: form.telefono.trim() || undefined,
      celular: form.celular.trim() || undefined,
      idTipoDocumento: Number(form.idTipoDocumento),
      numeroDocumento: form.numeroDocumento.trim(),
      fechaNacimiento: form.fechaNacimiento || undefined,
      nacionalidad: form.nacionalidad.trim() || undefined,
      direccion: form.direccion.trim() || undefined,
      idPais: toOptionalNumber(form.idPais),
      idProvincia: toOptionalNumber(form.idProvincia),
      idCiudad: toOptionalNumber(form.idCiudad),
      idEstadoCuenta: Number(form.idEstadoCuenta),
      idGenero: toOptionalNumber(form.idGenero),
      idEstadoCivil: toOptionalNumber(form.idEstadoCivil),
      movilidad: form.movilidad,
      licencia: form.licencia,
      tipoLicencia: form.licencia ? tipoLicencia : [],
      idTipoJornadaLaboral: toOptionalNumber(form.idTipoJornadaLaboral),
      telefonoReferencia1: form.telefonoReferencia1.trim() || undefined,
      telefonoReferencia2: form.telefonoReferencia2.trim() || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Actualiza los datos administrativos del candidato seleccionado.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-10 text-center text-sm text-slate-500">
            Cargando información del candidato...
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <section className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="candidato-nombre">Nombre</Label>
                <Input
                  id="candidato-nombre"
                  value={form.nombre}
                  onChange={(event) => updateField("nombre", event.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="candidato-apellido">Apellido</Label>
                <Input
                  id="candidato-apellido"
                  value={form.apellido}
                  onChange={(event) => updateField("apellido", event.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="candidato-email">Correo electrónico</Label>
                <Input
                  id="candidato-email"
                  type="email"
                  value={form.correoElectronico}
                  onChange={(event) => updateField("correoElectronico", event.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Estado</Label>
                <Select
                  value={form.idEstadoCuenta}
                  onValueChange={(value) => updateField("idEstadoCuenta", value)}
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
                <Label>Tipo de documento</Label>
                <Select
                  value={form.idTipoDocumento}
                  onValueChange={(value) => updateField("idTipoDocumento", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {catalogs.tipoDocumentoOptions.map((item) => (
                      <SelectItem key={item.idCatalogo} value={item.idCatalogo.toString()}>
                        {item.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="candidato-documento">Número de documento</Label>
                <Input
                  id="candidato-documento"
                  value={form.numeroDocumento}
                  onChange={(event) => updateField("numeroDocumento", event.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="candidato-nacimiento">Fecha de nacimiento</Label>
                <Input
                  id="candidato-nacimiento"
                  type="date"
                  value={form.fechaNacimiento}
                  onChange={(event) => updateField("fechaNacimiento", event.target.value)}
                />
              </div>
              <div>
                <Label>Género</Label>
                <Select
                  value={form.idGenero}
                  onValueChange={(value) => updateField("idGenero", value)}
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
                <Label>Estado civil</Label>
                <Select
                  value={form.idEstadoCivil}
                  onValueChange={(value) => updateField("idEstadoCivil", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona estado civil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sin especificar</SelectItem>
                    {catalogs.estadoCivilOptions.map((item) => (
                      <SelectItem key={item.idCatalogo} value={item.idCatalogo.toString()}>
                        {item.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tipo de empleo</Label>
                <Select
                  value={form.idTipoJornadaLaboral}
                  onValueChange={(value) => updateField("idTipoJornadaLaboral", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sin especificar</SelectItem>
                    {catalogs.tipoEmpleoOptions.map((item) => (
                      <SelectItem key={item.idCatalogo} value={item.idCatalogo.toString()}>
                        {item.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </section>

            <CandidatoLocationSection
              form={form}
              catalogs={catalogs}
              onUpdate={updateField}
            />

            <CandidatoMobilitySection form={form} onUpdate={updateField} />

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
