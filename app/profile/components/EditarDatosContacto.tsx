"use client";

import { Card } from "@/components/ui/card";
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
import { fetchApi } from "@/lib/apiClient";
import { DatosPersonalesFieldsResponse, UserInfoData } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Pencil, Phone, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { fileToBase64 } from "@/lib/utils";

const schema = z.object({
  celular: z.string().min(1, "El celular debe tener al menos 10 dígitos."),
  telefono: z
    .string()
    .min(7, "El celular debe tener al menos 10 dígitos.")
    .max(14, "El celular no debe exceder 14 caracteres."),
  email: z.email("El email no es válido.").min(1, "El email es obligatorio."),
  direccion: z.string().min(1, "La dirección es obligatoria."),
  idPais: z.number().min(1, "Selecciona un pais"),
  idCiudad: z.number().min(1, "Selecciona una ciudad"),
  idProvincia: z.number().min(1, "Selecciona una provincia"),
  planillaServicio: z
    .union([z.string(), z.instanceof(File)])
    .optional()
    .refine(
      (file) => {
        if (!(file instanceof File)) return true;
        return file.size <= 100 * 1024;
      },
      { message: "El archivo no debe exceder los 100kb." },
    )
    .refine(
      (file) => {
        if (!(file instanceof File)) return true;
        return ["image/jpeg", "image/jpg", "application/pdf"].includes(
          file.type,
        );
      },
      { message: "Solo se permiten archivos JPG o PDF." },
    ),
});

type EditarDatosContactoProps = {
  user: UserInfoData;
  fields: DatosPersonalesFieldsResponse | null;
};

export default function EditarDatosContacto({
  user,
  fields,
}: EditarDatosContactoProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      celular: user.datosContacto.celular ?? "",
      telefono: user.datosContacto.telefono ?? "",
      email: user.datosContacto.email,
      direccion: user.datosContacto.direccion ?? "",
      idCiudad: user.datosContacto.idCiudad,
      idPais: user.datosContacto.idPais,
      idProvincia: user.datosContacto.idProvincia,
      planillaServicio: user.datosContacto.planillaServicio ?? "",
    },
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    const body = {
      ...user.datosPersonales,
      telefono: data.telefono,
      celular: data.celular,
      correoElectronico: data.email,
      direccion: data.direccion,
      idPais: data.idPais,
      idCiudad: data.idCiudad,
      idProvincia: data.idProvincia,
      idUsuario: session?.user.id,
      idTipoUsuario: user.datosPersonales.idTipoUsuario,
      idEstadoCuenta: user.idEstadoCuenta,
      idEmpresa: null,
      planillaServicio:
        data.planillaServicio instanceof File
          ? await fileToBase64(data.planillaServicio)
          : data.planillaServicio,
    };
    const res = await fetchApi("/User/update-user", {
      method: "PUT",
      token: session?.user.accessToken,
      body,
    });
    if (!res?.isSuccess) {
      toast.error("Error actualizando datos de contacto");
      return;
    }
    toast.success(res?.data || "Datos actualizados correctamente");
    form.reset(data);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset();
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Phone width={25} height={25} className="text-primary" />
          Información de contacto
        </h2>
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="cursor-pointer"
            aria-label="Editar datos de contacto"
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
          className=""
          aria-label="Formulario de datos de contacto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <FormField
              control={form.control}
              name="celular"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="celular">Celular</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      id="celular"
                      inputMode="tel"
                      placeholder="+593 987654321"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/\D/g, ""))
                      }
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="telefono">Teléfono</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      id="telefono"
                      inputMode="tel"
                      placeholder="+593 2375293"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/\D/g, ""))
                      }
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Email"
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
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="direccion">Dirección</FormLabel>
                  <FormControl>
                    <Input
                      id="direccion"
                      autoComplete="street-address"
                      placeholder="Av. Siempre Viva 123"
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
              name="idPais"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="Pais">País</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? String(field.value) : ""}
                      disabled={!isEditing}
                    >
                      <SelectTrigger id="Pais">
                        <SelectValue placeholder="Pais" />
                      </SelectTrigger>
                      <SelectContent>
                        {fields?.pais?.map((pais) => (
                          <SelectItem
                            key={pais.idCatalogo}
                            value={pais.idCatalogo.toString()}
                          >
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
            <FormField
              control={form.control}
              name="idCiudad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="Ciudad">Ciudad</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? String(field.value) : ""}
                      disabled={!isEditing}
                    >
                      <SelectTrigger id="Ciudad">
                        <SelectValue placeholder="Ciudad" />
                      </SelectTrigger>
                      <SelectContent>
                        {fields?.ciudad?.map((ciudad) => (
                          <SelectItem
                            key={ciudad.idCatalogo}
                            value={ciudad.idCatalogo.toString()}
                          >
                            {ciudad.nombre}
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
              name="idProvincia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="Provincia">Provincia</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? String(field.value) : ""}
                      disabled={!isEditing}
                    >
                      <SelectTrigger id="Provincia">
                        <SelectValue placeholder="Provincia" />
                      </SelectTrigger>
                      <SelectContent>
                        {fields?.provincia?.map((provincia) => (
                          <SelectItem
                            key={provincia.idCatalogo}
                            value={provincia.idCatalogo.toString()}
                          >
                            {provincia.nombre}
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

          <div
            id="planillaServicio"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          >
            <FormField
              control={form.control}
              name="planillaServicio"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel htmlFor="planillaServicioInput">
                    <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                      <FileText
                        width={25}
                        height={25}
                        className="text-primary"
                      />
                      Planilla de Servicio Basico
                    </h2>
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      {isEditing ? (
                        <>
                          <input
                            type="file"
                            id="planillaServicioInput"
                            accept=".jpg,.jpeg,.pdf"
                            className="hidden"
                            title="Subir planilla de servicio básico"
                            placeholder="Subir archivo"
                            ref={(el) => {
                              fileInputRef.current = el;
                              field.ref(el);
                            }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                field.onChange(file);
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="btn btn-secondary flex items-center gap-2 cursor-pointer"
                          >
                            <FileText width={20} height={20} />
                            {field.value instanceof File
                              ? field.value.name
                              : "Subir archivo"}
                          </button>
                          {field.value && (
                            <button
                              type="button"
                              onClick={() => {
                                field.onChange("");
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = "";
                                }
                              }}
                              className="text-red-500 hover:text-red-700 cursor-pointer"
                              aria-label="Eliminar archivo"
                            >
                              <Trash2 width={20} height={20} />
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-600 italic">
                          {field.value ? (
                            <span className="flex items-center gap-2 text-primary font-medium non-italic">
                              <FileText width={20} height={20} />
                              Archivo cargado (JPG/PDF)
                            </span>
                          ) : (
                            "No se ha cargado ningún archivo"
                          )}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <div className="text-[12px] text-gray-500 mt-1">
                    Límite: 100kb (JPG o PDF)
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {isEditing && (
            <div className="col-span-2 mt-8 flex justify-end">
              <button
                className="btn btn-primary"
                type="submit"
                aria-label="Guardar datos de contacto"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <span className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full mr-2" />
                )}
                Guardar
              </button>
            </div>
          )}
        </form>
      </Form>
    </Card>
  );
}
