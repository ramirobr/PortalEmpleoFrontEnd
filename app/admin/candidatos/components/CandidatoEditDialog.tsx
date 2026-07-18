"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Car, FileText, MapPin, Save, Shield, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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

// ---------- Schema ----------

const schema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  correoElectronico: z.string().email("Ingresa un correo válido"),
  idTipoDocumento: z.number().min(1, "Selecciona un tipo de documento"),
  numeroDocumento: z.string().min(1, "El número de documento es obligatorio"),
  fechaNacimiento: z.string().optional(),
  idGenero: z.number().optional(),
  idEstadoCivil: z.number().optional(),
  idTipoJornadaLaboral: z.number().optional(),
  idEstadoCuenta: z.number().min(1, "Selecciona un estado de cuenta"),
  nacionalidad: z.string().optional(),
  telefono: z.string().optional(),
  celular: z.string().optional(),
  idPais: z.number().optional(),
  idProvincia: z.number().optional(),
  idCiudad: z.number().optional(),
  direccion: z.string().optional(),
  movilidad: z.boolean(),
  licencia: z.boolean(),
  tipoLicencia: z.string().optional(),
  telefonoReferencia1: z.string().optional(),
  telefonoReferencia2: z.string().optional(),
  tieneDiscapacidad: z.boolean(),
  tipoDiscapacidad: z.string().optional(),
  porcentajeDiscapacidad: z.number().min(0).max(100).optional(),
});

type FormValues = z.infer<typeof schema>;

// ---------- Types ----------

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

// ---------- Helpers ----------

function toDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function toOptionalNumber(value?: number | null) {
  return value && value > 0 ? value : undefined;
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function buildDefaultValues(candidato: UserInfoData | null): FormValues {
  if (!candidato) {
    return {
      nombre: "", apellido: "", correoElectronico: "",
      idTipoDocumento: 0, numeroDocumento: "", fechaNacimiento: "",
      idGenero: undefined, idEstadoCivil: undefined, idTipoJornadaLaboral: undefined,
      idEstadoCuenta: 0, nacionalidad: "",
      telefono: "", celular: "", idPais: undefined, idProvincia: undefined, idCiudad: undefined,
      direccion: "", movilidad: false, licencia: false, tipoLicencia: "",
      telefonoReferencia1: "", telefonoReferencia2: "",
      tieneDiscapacidad: false, tipoDiscapacidad: "", porcentajeDiscapacidad: undefined,
    };
  }
  return {
    nombre: candidato.datosPersonales?.nombre ?? "",
    apellido: candidato.datosPersonales?.apellido ?? "",
    correoElectronico: candidato.datosContacto?.email ?? "",
    idTipoDocumento: candidato.datosPersonales?.idTipoDocumento ?? 0,
    numeroDocumento: candidato.datosPersonales?.numeroDocumento ?? "",
    fechaNacimiento: toDate(candidato.datosPersonales?.fechaNacimiento),
    idGenero: candidato.datosPersonales?.idGenero ?? undefined,
    idEstadoCivil: candidato.datosPersonales?.idEstadoCivil ?? undefined,
    idTipoJornadaLaboral: candidato.datosPersonales?.idTipoJornadaLaboral ?? undefined,
    idEstadoCuenta: candidato.idEstadoCuenta ?? 0,
    nacionalidad: candidato.datosPersonales?.nacionalidad ?? "",
    telefono: candidato.datosContacto?.telefono ?? "",
    celular: candidato.datosContacto?.celular ?? "",
    idPais: candidato.datosContacto?.idPais ?? undefined,
    idProvincia: candidato.datosContacto?.idProvincia ?? undefined,
    idCiudad: candidato.datosContacto?.idCiudad ?? undefined,
    direccion: candidato.datosContacto?.direccion ?? "",
    movilidad: Boolean(candidato.datosPersonales?.movilidad),
    licencia: Boolean(candidato.datosPersonales?.licencia),
    tipoLicencia: candidato.datosPersonales?.tipoLicencia?.join(", ") ?? "",
    telefonoReferencia1: candidato.datosPersonales?.telefonoReferencia1 ?? "",
    telefonoReferencia2: candidato.datosPersonales?.telefonoReferencia2 ?? "",
    tieneDiscapacidad: Boolean(candidato.datosPersonales?.tieneDiscapacidad),
    tipoDiscapacidad: candidato.datosPersonales?.tipoDiscapacidad ?? "",
    porcentajeDiscapacidad: candidato.datosPersonales?.porcentajeDiscapacidad ?? undefined,
  };
}

// ---------- Section header ----------

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-zinc-100 pb-3 mb-4">
      <span className="text-primary">{icon}</span>
      <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{title}</h3>
    </div>
  );
}

// ---------- Main Component ----------

export default function CandidatoEditDialog({
  open,
  candidato,
  catalogs,
  loading,
  saving,
  onOpenChange,
  onSubmit,
}: CandidatoEditDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: buildDefaultValues(candidato),
  });

  // Local state for document files (kept outside RHF to avoid large base64 in form state)
  const [docFiles, setDocFiles] = useState<{
    planillaServicio?: string;
    documentoAntecedentes?: string;
    documentoIESS?: string;
  }>({});

  // Reset when candidato changes (opening dialog for different candidates)
  useEffect(() => {
    form.reset(buildDefaultValues(candidato));
    setDocFiles({});
  }, [candidato]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileChange = async (
    key: "planillaServicio" | "documentoAntecedentes" | "documentoIESS",
    file: File | null,
  ) => {
    if (!file) {
      setDocFiles((prev) => ({ ...prev, [key]: undefined }));
      return;
    }
    const base64 = await fileToBase64(file);
    setDocFiles((prev) => ({ ...prev, [key]: base64 }));
  };

  const watchLicencia = form.watch("licencia");
  const watchDiscapacidad = form.watch("tieneDiscapacidad");

  const title = candidato
    ? `Editar ${candidato.datosPersonales.nombre} ${candidato.datosPersonales.apellido}`
    : "Editar candidato";

  const handleSubmit = async (values: FormValues) => {
    if (!candidato) return;

    const tipoLicencia = values.tipoLicencia
      ? values.tipoLicencia.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    await onSubmit({
      idUsuario: candidato.userId,
      nombre: values.nombre.trim(),
      apellido: values.apellido.trim(),
      correoElectronico: values.correoElectronico.trim(),
      telefono: values.telefono?.trim() || undefined,
      celular: values.celular?.trim() || undefined,
      idTipoDocumento: values.idTipoDocumento,
      numeroDocumento: values.numeroDocumento.trim(),
      fechaNacimiento: values.fechaNacimiento || undefined,
      nacionalidad: values.nacionalidad?.trim() || undefined,
      direccion: values.direccion?.trim() || undefined,
      idPais: toOptionalNumber(values.idPais),
      idProvincia: toOptionalNumber(values.idProvincia),
      idCiudad: toOptionalNumber(values.idCiudad),
      idEstadoCuenta: values.idEstadoCuenta,
      idGenero: toOptionalNumber(values.idGenero),
      idEstadoCivil: toOptionalNumber(values.idEstadoCivil),
      movilidad: values.movilidad,
      licencia: values.licencia,
      tipoLicencia: values.licencia ? tipoLicencia : [],
      idTipoJornadaLaboral: toOptionalNumber(values.idTipoJornadaLaboral),
      telefonoReferencia1: values.telefonoReferencia1?.trim() || undefined,
      telefonoReferencia2: values.telefonoReferencia2?.trim() || undefined,
      tieneDiscapacidad: values.tieneDiscapacidad,
      tipoDiscapacidad: values.tieneDiscapacidad
        ? (values.tipoDiscapacidad?.trim() || undefined)
        : undefined,
      porcentajeDiscapacidad: values.tieneDiscapacidad
        ? values.porcentajeDiscapacidad
        : undefined,
      planillaServicio: docFiles.planillaServicio,
      documentoAntecedentes: docFiles.documentoAntecedentes,
      documentoIESS: docFiles.documentoIESS,
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
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(handleSubmit)}>

              {/* Sección 1: Datos de identidad */}
              <div>
                <SectionHeader icon={<UserRound className="size-4" />} title="Datos de identidad" />
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField control={form.control} name="nombre" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="apellido" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="correoElectronico" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl><Input type="email" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="idTipoDocumento" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de documento</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(Number(v))}
                        value={field.value ? String(field.value) : ""}
                      >
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Selecciona tipo" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {catalogs.tipoDocumentoOptions.map((item) => (
                            <SelectItem key={item.idCatalogo} value={String(item.idCatalogo)}>
                              {item.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="numeroDocumento" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de documento</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="fechaNacimiento" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de nacimiento</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="nacionalidad" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nacionalidad</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              {/* Sección 2: Cuenta y perfil */}
              <div>
                <SectionHeader icon={<Shield className="size-4" />} title="Cuenta y perfil" />
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField control={form.control} name="idEstadoCuenta" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado de cuenta</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(Number(v))}
                        value={field.value ? String(field.value) : ""}
                      >
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Selecciona estado" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {catalogs.estadoOptions.map((item) => (
                            <SelectItem key={item.idCatalogo} value={String(item.idCatalogo)}>
                              {item.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="idGenero" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Género</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(v !== "0" ? Number(v) : undefined)}
                        value={field.value ? String(field.value) : "0"}
                      >
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Selecciona género" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Sin especificar</SelectItem>
                          {catalogs.generoOptions.map((item) => (
                            <SelectItem key={item.idCatalogo} value={String(item.idCatalogo)}>
                              {item.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="idEstadoCivil" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado civil</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(v !== "0" ? Number(v) : undefined)}
                        value={field.value ? String(field.value) : "0"}
                      >
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Selecciona estado civil" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Sin especificar</SelectItem>
                          {catalogs.estadoCivilOptions.map((item) => (
                            <SelectItem key={item.idCatalogo} value={String(item.idCatalogo)}>
                              {item.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="idTipoJornadaLaboral" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de jornada laboral</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(v !== "0" ? Number(v) : undefined)}
                        value={field.value ? String(field.value) : "0"}
                      >
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Selecciona tipo" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Sin especificar</SelectItem>
                          {catalogs.tipoEmpleoOptions.map((item) => (
                            <SelectItem key={item.idCatalogo} value={String(item.idCatalogo)}>
                              {item.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              {/* Sección 3: Contacto y ubicación */}
              <div>
                <SectionHeader icon={<MapPin className="size-4" />} title="Contacto y ubicación" />
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField control={form.control} name="celular" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Celular</FormLabel>
                      <FormControl><Input type="tel" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="telefono" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl><Input type="tel" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="idPais" render={({ field }) => (
                    <FormItem>
                      <FormLabel>País</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(v !== "0" ? Number(v) : undefined)}
                        value={field.value ? String(field.value) : "0"}
                      >
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Selecciona país" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Sin especificar</SelectItem>
                          {catalogs.paisOptions.map((item) => (
                            <SelectItem key={item.idCatalogo} value={String(item.idCatalogo)}>
                              {item.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="idProvincia" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provincia</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(v !== "0" ? Number(v) : undefined)}
                        value={field.value ? String(field.value) : "0"}
                      >
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Selecciona provincia" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Sin especificar</SelectItem>
                          {catalogs.provinciaOptions.map((item) => (
                            <SelectItem key={item.idCatalogo} value={String(item.idCatalogo)}>
                              {item.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="idCiudad" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(v !== "0" ? Number(v) : undefined)}
                        value={field.value ? String(field.value) : "0"}
                      >
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Selecciona ciudad" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Sin especificar</SelectItem>
                          {catalogs.ciudadOptions.map((item) => (
                            <SelectItem key={item.idCatalogo} value={String(item.idCatalogo)}>
                              {item.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="direccion" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              {/* Sección 4: Movilidad y referencias */}
              <div>
                <SectionHeader icon={<Car className="size-4" />} title="Movilidad y referencias" />
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField control={form.control} name="movilidad" render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">Movilidad propia</FormLabel>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="licencia" render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">Posee licencia de conducir</FormLabel>
                    </FormItem>
                  )} />
                  {watchLicencia && (
                    <FormField control={form.control} name="tipoLicencia" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Tipos de licencia (separados por coma)</FormLabel>
                        <FormControl><Input placeholder="Ej. B, C" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}
                  <FormField control={form.control} name="telefonoReferencia1" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono referencia 1</FormLabel>
                      <FormControl><Input type="tel" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="telefonoReferencia2" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono referencia 2</FormLabel>
                      <FormControl><Input type="tel" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              {/* Sección 5: Discapacidad */}
              <div>
                <SectionHeader icon={<UserRound className="size-4" />} title="Discapacidad" />
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField control={form.control} name="tieneDiscapacidad" render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0 md:col-span-2">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">Tiene discapacidad</FormLabel>
                    </FormItem>
                  )} />
                  {watchDiscapacidad && (
                    <>
                      <FormField control={form.control} name="tipoDiscapacidad" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de discapacidad</FormLabel>
                          <FormControl><Input placeholder="Ej. Visual, Motriz..." {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="porcentajeDiscapacidad" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Porcentaje (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              placeholder="0-100"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </>
                  )}
                </div>
              </div>

              {/* Sección 6: Documentos */}
              <div>
                <SectionHeader icon={<FileText className="size-4" />} title="Documentos" />
                <div className="space-y-4">
                  {(
                    [
                      { key: "planillaServicio", label: "Planilla de servicio básico", existing: candidato?.datosContacto?.planillaServicio },
                      { key: "documentoAntecedentes", label: "Documento de antecedentes", existing: candidato?.datosContacto?.documentoAntecedentes },
                      { key: "documentoIESS", label: "Documento IESS", existing: candidato?.datosContacto?.documentoIESS },
                    ] as const
                  ).map(({ key, label, existing }) => (
                    <div key={key} className="grid gap-1">
                      <p className="text-sm font-medium text-slate-700">{label}</p>
                      {existing && !docFiles[key] && (
                        <p className="text-xs text-green-600 mb-1">✓ Archivo cargado actualmente</p>
                      )}
                      {docFiles[key] && (
                        <p className="text-xs text-primary mb-1">✓ Nuevo archivo seleccionado</p>
                      )}
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="cursor-pointer"
                        onChange={(e) => handleFileChange(key, e.target.files?.[0] ?? null)}
                      />
                    </div>
                  ))}
                </div>
              </div>

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
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
