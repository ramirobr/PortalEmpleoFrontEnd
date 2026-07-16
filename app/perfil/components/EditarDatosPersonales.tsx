"use client";

import { PremiumButton } from "@/components/shared/components/PremiumButton";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { fetchApi } from "@/lib/apiClient";
import { validarCedulaEcuatoriana } from "@/lib/utils";
import { DatosPersonalesFieldsResponse, UserInfoData } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash2, UserRound } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";
import { useForm, type Control } from "react-hook-form";
import { useAuthStore } from "@/context/authStore";
import { toast } from "sonner";
import { z } from "zod";

const licenciaOptions = ["A", "A1", "B", "C", "D", "E", "E1", "F", "G"];

const schema = z
  .object({
    nombre: z
      .string()
      .min(3, "El nombre es obligatorio y debe tener al menos 3 caracteres."),
    apellido: z
      .string()
      .min(3, "El apellido es obligatorio y debe tener al menos 3 caracteres."),
    nacionalidad: z.string().min(1, "La nacionalidad es obligatoria."),
    nacimiento: z.date({
      message: "La fecha de nacimiento es obligatoria.",
    }),
    idTipoDocumento: z.number().min(1, "Selecciona un tipo de documento"),
    idTipoUsuario: z.number().optional(),
    cedula: z.string().min(1, "Ingresa la cédula"),
    idGenero: z.number().min(1, "Selecciona un género"),
    movilidad: z.boolean().default(false),
    licencia: z.boolean().default(false),
    tipoLicencia: z.array(z.string()).optional(),
    idEstadoCivil: z.number().optional(),
    idTipoJornadaLaboral: z.number().optional(),
    telefonoReferencia1: z.string().optional(),
    telefonoReferencia2: z.string().optional(),
    expectativaSalarial: z.string().optional(),
    tieneDiscapacidad: z.boolean().optional(),
    tipoDiscapacidad: z.string().optional(),
    porcentajeDiscapacidad: z.coerce.number().min(0).max(100).optional(),
    medioContactoPreferido: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const CEDULA = 3580;
    if (data.idTipoDocumento === CEDULA) {
      if (!validarCedulaEcuatoriana(data.cedula)) {
        ctx.addIssue({
          path: ["cedula"],
          message: "Cédula inválida.",
          code: "custom",
        });
      }
    }
  });

type PersonalesFormValues = z.input<typeof schema>;

type EditarDatosPersonalesProps = {
  user: UserInfoData;
  fields: DatosPersonalesFieldsResponse | null;
};

function PersonalesIdentityFields({
  control,
  isEditing,
  fields,
}: {
  control: Control<PersonalesFormValues>;
  isEditing: boolean;
  fields: DatosPersonalesFieldsResponse | null;
}) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <FormField
          control={control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="nombre">Nombre</FormLabel>
              <FormControl>
                <Input
                  id="nombre"
                  autoComplete="given-name"
                  disabled={!isEditing}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="apellido"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="apellido">Apellido</FormLabel>
              <FormControl>
                <Input
                  id="apellido"
                  autoComplete="family-name"
                  disabled={!isEditing}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
        <FormField
          control={control}
          name="nacimiento"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="nacimiento">
                Fecha de nacimiento
              </FormLabel>
              <FormControl>
                <DatePicker
                  id="nacimiento"
                  value={field.value}
                  onChange={field.onChange}
                  disabled={!isEditing}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="nacionalidad"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="nacionalidad">Nacionalidad</FormLabel>
              <FormControl>
                <Input id="nacionalidad" disabled={!isEditing} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
        <FormField
          control={control}
          name="idEstadoCivil"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="idEstadoCivil">Estado Civil</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                  disabled={!isEditing}
                >
                  <SelectTrigger id="estadoCivil">
                    <SelectValue placeholder="Estado Civil" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields?.estado_civil?.map((estadoCivil) => (
                      <SelectItem
                        key={estadoCivil.idCatalogo}
                        value={estadoCivil.idCatalogo.toString()}
                      >
                        {estadoCivil.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="idTipoJornadaLaboral"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="idTipoJornadaLaboral">Tipo de jornada laboral</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(value ? Number(value) : undefined)}
                  value={field.value ? String(field.value) : ""}
                  disabled={!isEditing}
                >
                  <SelectTrigger id="idTipoJornadaLaboral">
                    <SelectValue placeholder="Tipo de jornada" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields?.tipo_empleo?.map((jornada) => (
                      <SelectItem
                        key={jornada.idCatalogo}
                        value={jornada.idCatalogo.toString()}
                      >
                        {jornada.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
        <FormField
          control={control}
          name="idGenero"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="genero">Género</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : ""}
                  disabled={!isEditing}
                >
                  <SelectTrigger id="genero">
                    <SelectValue placeholder="Género" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields?.genero?.map((genero) => (
                      <SelectItem
                        key={genero.idCatalogo}
                        value={genero.idCatalogo.toString()}
                      >
                        {genero.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
        <FormField
          control={control}
          name="idTipoDocumento"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="idTipoDocumento">
                Tipo de Documento
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : ""}
                  disabled={!isEditing}
                >
                  <SelectTrigger id="idTipoDocumento">
                    <SelectValue placeholder="Tipo de Documento" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields?.tipo_documento?.map((documento) => (
                      <SelectItem
                        key={documento.idCatalogo}
                        value={documento.idCatalogo.toString()}
                      >
                        {documento.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="cedula"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="cedula">Número de Cédula</FormLabel>
              <FormControl>
                <Input
                  id="cedula"
                  placeholder="Cédula"
                  maxLength={10}
                  minLength={10}
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  disabled={!isEditing}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}

function PersonalesAdditionalFields({
  control,
  isEditing,
  licenciaChecked,
}: {
  control: Control<PersonalesFormValues>;
  isEditing: boolean;
  licenciaChecked: boolean | undefined;
}) {
  return (
    <>
      {/* Fila 5: Movilidad Propia / Licencia de conducir */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <FormField
          control={control}
          name="movilidad"
          render={({ field }) => (
            <FormItem className="block">
              <FormLabel htmlFor="movilidad">Movilidad Propia</FormLabel>
              <FormControl>
                <Checkbox
                  id="movilidad"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={!isEditing}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="licencia"
          render={({ field }) => (
            <FormItem className="block">
              <FormLabel htmlFor="licencia" className="mr-2">
                Poseo Licencia de Conducir
              </FormLabel>
              <FormControl>
                <Checkbox
                  id="licencia"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={!isEditing}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {licenciaChecked && (
        <div className="col-span-2">
          <FormField
            control={control}
            name="tipoLicencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Licencia</FormLabel>
                <FormControl>
                  <div
                    role="group"
                    aria-label="Tipo de Licencia"
                    className="flex flex-row flex-wrap gap-5"
                  >
                    {licenciaOptions.map((opt) => (
                      <div className="flex items-center gap-2" key={opt}>
                        <Checkbox
                          id={`tipoLicencia-${opt}`}
                          value={opt}
                          checked={field.value?.includes(opt) || false}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange([...(field.value || []), opt]);
                            } else {
                              field.onChange(
                                (field.value || []).filter(
                                  (v) => v !== opt,
                                ),
                              );
                            }
                          }}
                          disabled={!isEditing}
                          aria-label={`Licencia tipo ${opt}`}
                        />
                        <Label
                          htmlFor={`tipoLicencia-${opt}`}
                          className="mb-0"
                        >
                          {opt}
                        </Label>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4 mt-4">
        <FormField
          control={control}
          name="telefonoReferencia1"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="telefonoReferencia1">Teléfono de referencia 1</FormLabel>
              <FormControl>
                <Input id="telefonoReferencia1" disabled={!isEditing} placeholder="Opcional" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="telefonoReferencia2"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="telefonoReferencia2">Teléfono de referencia 2</FormLabel>
              <FormControl>
                <Input id="telefonoReferencia2" disabled={!isEditing} placeholder="Opcional" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {/* Aspiración salarial y preferencia de contacto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4 mt-4">
        <FormField
          control={control}
          name="expectativaSalarial"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="expectativaSalarial">Aspiración salarial</FormLabel>
              <FormControl>
                <Input
                  id="expectativaSalarial"
                  disabled={!isEditing}
                  placeholder="Ej: $800 - $1200 mensuales"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="medioContactoPreferido"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="medioContactoPreferido">Medio de contacto preferido</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                  disabled={!isEditing}
                >
                  <SelectTrigger id="medioContactoPreferido">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Llamada telefónica">Llamada telefónica</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="Correo electrónico">Correo electrónico</SelectItem>
                    <SelectItem value="Mensajería interna">Mensajería interna</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}

export default function EditarDatosPersonales({
  user,
  fields,
}: EditarDatosPersonalesProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: user.datosPersonales.nombre,
      apellido: user.datosPersonales.apellido,
      nacionalidad: user.datosPersonales.nacionalidad ?? "",
      nacimiento: new Date(user.datosPersonales.fechaNacimiento),
      idTipoDocumento: user.datosPersonales.idTipoDocumento,
      cedula: user.datosPersonales.numeroDocumento,
      idGenero: user.datosPersonales.idGenero,
      movilidad: user.datosPersonales.movilidad,
      licencia: user.datosPersonales.licencia,
      tipoLicencia: user.datosPersonales.tipoLicencia,
      idEstadoCivil: user.datosPersonales.idEstadoCivil,
      idTipoJornadaLaboral: user.datosPersonales.idTipoJornadaLaboral,
      telefonoReferencia1: user.datosPersonales.telefonoReferencia1 ?? "",
      telefonoReferencia2: user.datosPersonales.telefonoReferencia2 ?? "",
      expectativaSalarial: user.datosPersonales.expectativaSalarial ?? "",
      tieneDiscapacidad: user.datosPersonales.tieneDiscapacidad ?? false,
      tipoDiscapacidad: user.datosPersonales.tipoDiscapacidad ?? "",
      porcentajeDiscapacidad: user.datosPersonales.porcentajeDiscapacidad ?? undefined,
      medioContactoPreferido: user.datosPersonales.medioContactoPreferido ?? "",
    },
  });

  const licenciaChecked = form.watch("licencia");
  const handleSubmit = async (data: z.infer<typeof schema>) => {
    const { genero: _, ...datosPersonales } = user.datosPersonales;
    const { email, ...datosContacto } = user.datosContacto;
    const body = {
      ...datosPersonales,
      ...datosContacto,
      nombre: data.nombre,
      apellido: data.apellido,
      idTipoDocumento: data.idTipoDocumento,
      idGenero: data.idGenero,
      numeroDocumento: data.cedula,
      nacionalidad: data.nacionalidad,
      fechaNacimiento: data.nacimiento.toISOString(),
      idUsuario: session?.user.id,
      idTipoUsuario: data.idTipoUsuario || user.datosPersonales.idTipoUsuario,
      idEmpresa: null,
      idEstadoCuenta: user.idEstadoCuenta,
      correoElectronico: email,
      movilidad: data.movilidad,
      licencia: data.licencia,
      idEstadoCivil: data.idEstadoCivil,
      tipoLicencia: data.tipoLicencia,
      idTipoJornadaLaboral: data.idTipoJornadaLaboral,
      telefonoReferencia1: data.telefonoReferencia1,
      telefonoReferencia2: data.telefonoReferencia2,
      expectativaSalarial: data.expectativaSalarial || undefined,
      tieneDiscapacidad: data.tieneDiscapacidad,
      tipoDiscapacidad: data.tipoDiscapacidad || undefined,
      porcentajeDiscapacidad: data.porcentajeDiscapacidad ?? undefined,
      medioContactoPreferido: data.medioContactoPreferido || undefined,
    };

    const res = await fetchApi("/User/update-user", {
      method: "PUT",
      token: session?.user.accessToken,
      body,
    });
    if (!res?.isSuccess) {
      toast.error("Error actualizando datos personales");
      return;
    }
    const setFullName = useAuthStore.getState().setFullName;
    setFullName(`${data.nombre} ${data.apellido}`);
    toast.success(res?.data || "Datos personales actualizados");
    form.reset(data);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset();
  };

  return (
    <Card id="datosPersonales" className="p-6">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
          <UserRound width={25} height={25} className="text-primary" />
          Información personal
        </h2>
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="cursor-pointer"
            aria-label="Editar datos personales"
          >
            <Pencil width={20} height={20} className="text-primary" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCancel}
            className="cursor-pointer"
            aria-label="Cancelar edición"
          >
            <Trash2 width={20} height={20} className="text-primary" />
          </button>
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          aria-label="Formulario de datos personales"
        >
          <PersonalesIdentityFields control={form.control} isEditing={isEditing} fields={fields} />
          <PersonalesAdditionalFields control={form.control} isEditing={isEditing} licenciaChecked={licenciaChecked} />
          {/* Discapacidad */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
            <FormField
              control={form.control}
              name="tieneDiscapacidad"
              render={({ field }) => (
                <FormItem className="block">
                  <FormLabel htmlFor="tieneDiscapacidad" className="mr-2">
                    Persona con discapacidad
                  </FormLabel>
                  <FormControl>
                    <Checkbox
                      id="tieneDiscapacidad"
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {form.watch("tieneDiscapacidad") && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
              <FormField
                control={form.control}
                name="tipoDiscapacidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="tipoDiscapacidad">Tipo de discapacidad</FormLabel>
                    <FormControl>
                      <Input
                        id="tipoDiscapacidad"
                        disabled={!isEditing}
                        placeholder="Ej: Visual, Auditiva, Motriz..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="porcentajeDiscapacidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="porcentajeDiscapacidad">Porcentaje de discapacidad (%)</FormLabel>
                    <FormControl>
                      <Input
                        id="porcentajeDiscapacidad"
                        type="number"
                        min={0}
                        max={100}
                        disabled={!isEditing}
                        placeholder="Ej: 30"
                        value={field.value !== undefined ? String(field.value) : ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          {isEditing && (
            <div className="col-span-2 mt-8 flex justify-end">
              <PremiumButton
                type="submit"
                variant="primary"
                aria-label="Guardar datos personales"
                isLoading={form.formState.isSubmitting}
              >
                Guardar
              </PremiumButton>
            </div>
          )}
        </form>
      </Form>
    </Card>
  );
}
