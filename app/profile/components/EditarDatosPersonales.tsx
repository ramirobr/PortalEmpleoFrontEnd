"use client";
import Loader from "@/components/shared/components/Loader";
import TituloSubrayado from "@/components/shared/tituloSubrayado";
import { Button } from "@/components/ui/button";
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
import { fetchPaises } from "@/lib/catalog/fetchPaises";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { validarCedulaEcuatoriana } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import Pencil from "@/components/shared/components/iconos/Pencil";
import Trash from "@/components/shared/components/iconos/Trash";
import { UserInfoData } from "@/types/profile";
import { DatosPersonalesFieldsResponse } from "@/types/user";

const estadoCivilOptions = [
  "Soltero/a",
  "Casado/a",
  "Divorciado/a",
  "Pareja de Hecho",
  "Viudo/a",
  "Unión Libre",
];
const generoOptions = ["Masculino", "Femenino", "Otro"];
const licenciaOptions = ["A", "A1", "B", "C", "D", "E", "E1", "F", "G"];

const schema = z.object({
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
  estadoCivil: z.string().min(1, "El estado civil es obligatorio."),
  tipoDocumento: z.string().min(1, "El tipo de documento es obligatorio."),
  cedula: z
    .string()
    .min(1, "Ingresa la cédula")
    .refine(validarCedulaEcuatoriana, {
      message: "Cédula ecuatoriana inválida.",
    }),
  genero: z.string().min(1, "El género es obligatorio."),
  movilidad: z.boolean().default(false),
  licencia: z.boolean().default(false),
  tipoLicencia: z.array(z.string()).optional(),
});

type EditarDatosPersonalesProps = {
  user: UserInfoData;
  fields: DatosPersonalesFieldsResponse | null;
};

export default function EditarDatosPersonales({
  user,
  fields,
}: EditarDatosPersonalesProps) {
  const [isEditing, setIsEditing] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: user?.datosPersonales.nombre,
      apellido: user?.datosPersonales.apellido,
      nacionalidad: user?.datosContacto.pais,
      nacimiento: new Date(user?.datosPersonales.fechaNacimiento),
      estadoCivil: "",
      tipoDocumento: user?.datosPersonales.tipoDocumento,
      cedula: user?.datosPersonales.numeroDocumento,
      genero: "",
      movilidad: false,
      licencia: false,
      tipoLicencia: [],
    },
  });

  const licenciaChecked = form.watch("licencia");

  const handleSubmit = (data: z.infer<typeof schema>) => {
    console.log("Datos guardados:", data);
    setIsEditing(false);
    // TODO: Aquí puedes agregar la lógica para enviar los datos al servidor
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset();
  };

  return (
    <Card className="px-6">
      <div className="flex justify-between items-center mb-10">
        <TituloSubrayado className="mb-0">Datos Personales</TituloSubrayado>
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="cursor-pointer"
            aria-label="Editar datos personales"
          >
            <Pencil width={25} height={25} className="text-primary" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCancel}
            className="cursor-pointer"
            aria-label="Cancelar edición"
          >
            <Trash width={25} height={25} className="text-primary" />
          </button>
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          aria-label="Formulario de datos personales"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <FormField
              control={form.control}
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
              control={form.control}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <FormField
              control={form.control}
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
              control={form.control}
              name="nacionalidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="nacionalidad">Nacionalidad</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString()}
                      disabled={!isEditing}
                    >
                      <SelectTrigger id="nacionalidad">
                        <SelectValue placeholder="Nacionalidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {fields?.pais?.map((pais) => (
                          <SelectItem key={pais.idCatalogo} value={pais.nombre}>
                            {pais.nombre}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <FormField
              control={form.control}
              name="estadoCivil"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="estadoCivil">Estado Civil</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString()}
                      disabled={!isEditing}
                    >
                      <SelectTrigger id="estadoCivil">
                        <SelectValue placeholder="Estado Civil" />
                      </SelectTrigger>
                      <SelectContent>
                        {estadoCivilOptions.map((estado) => (
                          <SelectItem key={estado} value={estado}>
                            {estado}
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
              control={form.control}
              name="genero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="genero">Género</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString()}
                      disabled={!isEditing}
                    >
                      <SelectTrigger id="genero">
                        <SelectValue placeholder="Género" />
                      </SelectTrigger>
                      <SelectContent>
                        {generoOptions.map((genero) => (
                          <SelectItem key={genero} value={genero}>
                            {genero}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <FormField
              control={form.control}
              name="tipoDocumento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="tipoDocumento">
                    Tipo de Documento
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString()}
                      disabled={!isEditing}
                    >
                      <SelectTrigger id="tipoDocumento">
                        <SelectValue placeholder="Tipo de Documento" />
                      </SelectTrigger>
                      <SelectContent>
                        {fields?.tipo_documento?.map((documento) => (
                          <SelectItem
                            key={documento.idCatalogo}
                            value={documento.nombre}
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
              control={form.control}
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
          {/* Fila 5: Movilidad Propia / Licencia de conducir */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <FormField
              control={form.control}
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
              control={form.control}
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
                control={form.control}
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
                                    (field.value || []).filter((v) => v !== opt)
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
          {isEditing && (
            <div className="col-span-2 mt-8 flex justify-end">
              <Button
                type="submit"
                aria-label="Guardar datos personales"
                disabled={!form.formState.isDirty}
              >
                Guardar
              </Button>
            </div>
          )}
        </form>
      </Form>
    </Card>
  );
}
