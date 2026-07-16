"use client";

import { PremiumButton } from "@/components/shared/components/PremiumButton";
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
import { SearchAutocomplete } from "@/components/ui/search-autocomplete";
import { fetchApi } from "@/lib/apiClient";
import { DatosPersonalesFieldsResponse, UserInfoData } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Pencil, Phone, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useRef } from "react";
import { useForm, type Control } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { fileToBase64 } from "@/lib/utils";

const docValidator = z
  .union([z.string(), z.instanceof(File)])
  .optional()
  .refine(
    (file) => { if (!(file instanceof File)) return true; return file.size <= 5 * 1024 * 1024; },
    { message: "El archivo no debe exceder los 5MB." },
  )
  .refine(
    (file) => {
      if (!(file instanceof File)) return true;
      return [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type);
    },
    { message: "Solo se permiten archivos PDF o Word (.docx)." },
  );

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
        return file.size <= 5 * 1024 * 1024;
      },
      { message: "El archivo no debe exceder los 5MB." },
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
  documentoAntecedentes: docValidator,
  documentoIESS: docValidator,
});

type ContactoFormValues = z.infer<typeof schema>;

type EditarDatosContactoProps = {
  user: UserInfoData;
  fields: DatosPersonalesFieldsResponse | null;
};

function ContactoBasicFields({
  control,
  isEditing,
  fields,
}: {
  control: Control<ContactoFormValues>;
  isEditing: boolean;
  fields: DatosPersonalesFieldsResponse | null;
}) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <FormField
          control={control}
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
          control={control}
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <FormField
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
          name="idCiudad"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="Ciudad">Ciudad</FormLabel>
              <FormControl>
                <SearchAutocomplete<number>
                  options={
                    fields?.ciudad?.map((c) => ({
                      id: c.idCatalogo,
                      label: c.nombre,
                    })) ?? []
                  }
                  value={field.value || undefined}
                  onChange={(id) => field.onChange(id)}
                  placeholder="Selecciona una ciudad"
                  searchPlaceholder="Buscar ciudad..."
                  disabled={!isEditing}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
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
    </>
  );
}

function ContactoDocumentFields({
  control,
  isEditing,
}: {
  control: Control<ContactoFormValues>;
  isEditing: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const antecedentesRef = useRef<HTMLInputElement | null>(null);
  const iessRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <div
        id="planillaServicio"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        <FormField
          control={control}
          name="planillaServicio"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel htmlFor="planillaServicioInput">
                <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
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
                    <div className="flex items-center gap-3 text-slate-600 italic">
                      {field.value && typeof field.value === "string" ? (
                        <>
                          <span className="flex items-center gap-2 text-primary font-medium not-italic">
                            <FileText width={20} height={20} />
                            Archivo cargado (JPG/PDF)
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const dataUrl = field.value as string;
                              const ext = dataUrl.startsWith("data:application/pdf")
                                ? ".pdf"
                                : ".jpg";
                              const a = document.createElement("a");
                              a.href = dataUrl;
                              a.download = `planilla_servicio${ext}`;
                              a.click();
                            }}
                            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 underline cursor-pointer not-italic"
                            aria-label="Descargar planilla de servicio básico"
                          >
                            Descargar
                          </button>
                        </>
                      ) : (
                        "No se ha cargado ningún archivo"
                      )}
                    </div>
                  )}
                </div>
              </FormControl>
              <div className="text-[12px] text-slate-500 mt-1">
                Límite: 5MB (JPG o PDF)
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Documento antecedentes penales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <FormField
          control={control}
          name="documentoAntecedentes"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
                  <FileText width={25} height={25} className="text-primary" />
                  Antecedentes Penales
                </h2>
              </FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  {isEditing ? (
                    <>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        ref={(el) => { antecedentesRef.current = el; field.ref(el); }}
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) field.onChange(f); }}
                      />
                      <button type="button" onClick={() => antecedentesRef.current?.click()}
                        className="btn btn-secondary flex items-center gap-2 cursor-pointer">
                        <FileText width={20} height={20} />
                        {field.value instanceof File ? field.value.name : "Subir documento"}
                      </button>
                      {field.value && (
                        <button type="button"
                          onClick={() => { field.onChange(""); if (antecedentesRef.current) antecedentesRef.current.value = ""; }}
                          className="text-red-500 hover:text-red-700 cursor-pointer" aria-label="Quitar documento">
                          <Trash2 width={20} height={20} />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-3 italic text-slate-600">
                      {field.value && typeof field.value === "string" ? (
                        <>
                          <span className="flex items-center gap-2 text-primary font-medium not-italic">
                            <FileText width={20} height={20} /> Documento cargado
                          </span>
                          <button type="button"
                            onClick={() => { const a = document.createElement("a"); a.href = field.value as string; a.download = "antecedentes_penales.pdf"; a.click(); }}
                            className="text-sm font-medium text-primary hover:text-primary/80 underline cursor-pointer not-italic">
                            Descargar
                          </button>
                        </>
                      ) : "No se ha cargado ningún documento"}
                    </div>
                  )}
                </div>
              </FormControl>
              <div className="text-[12px] text-slate-500 mt-1">Límite: 5MB (PDF o Word)</div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Documento IESS */}
        <FormField
          control={control}
          name="documentoIESS"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
                  <FileText width={25} height={25} className="text-primary" />
                  Validación IESS
                </h2>
              </FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  {isEditing ? (
                    <>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        ref={(el) => { iessRef.current = el; field.ref(el); }}
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) field.onChange(f); }}
                      />
                      <button type="button" onClick={() => iessRef.current?.click()}
                        className="btn btn-secondary flex items-center gap-2 cursor-pointer">
                        <FileText width={20} height={20} />
                        {field.value instanceof File ? field.value.name : "Subir documento"}
                      </button>
                      {field.value && (
                        <button type="button"
                          onClick={() => { field.onChange(""); if (iessRef.current) iessRef.current.value = ""; }}
                          className="text-red-500 hover:text-red-700 cursor-pointer" aria-label="Quitar documento">
                          <Trash2 width={20} height={20} />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-3 italic text-slate-600">
                      {field.value && typeof field.value === "string" ? (
                        <>
                          <span className="flex items-center gap-2 text-primary font-medium not-italic">
                            <FileText width={20} height={20} /> Documento cargado
                          </span>
                          <button type="button"
                            onClick={() => { const a = document.createElement("a"); a.href = field.value as string; a.download = "validacion_iess.pdf"; a.click(); }}
                            className="text-sm font-medium text-primary hover:text-primary/80 underline cursor-pointer not-italic">
                            Descargar
                          </button>
                        </>
                      ) : "No se ha cargado ningún documento"}
                    </div>
                  )}
                </div>
              </FormControl>
              <div className="text-[12px] text-slate-500 mt-1">Límite: 5MB (PDF o Word)</div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}

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
      documentoAntecedentes: user.datosContacto.documentoAntecedentes ?? "",
      documentoIESS: user.datosContacto.documentoIESS ?? "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    // Convertir archivos a base64 primero para poder reutilizarlos en el reset
    const planillaServicio = data.planillaServicio instanceof File
      ? await fileToBase64(data.planillaServicio)
      : (data.planillaServicio ?? "");
    const documentoAntecedentes = data.documentoAntecedentes instanceof File
      ? await fileToBase64(data.documentoAntecedentes)
      : (data.documentoAntecedentes ?? "");
    const documentoIESS = data.documentoIESS instanceof File
      ? await fileToBase64(data.documentoIESS)
      : (data.documentoIESS ?? "");

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
      planillaServicio,
      documentoAntecedentes,
      documentoIESS,
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
    toast.success("Datos actualizados correctamente");
    // Resetear con los valores base64 para que el modo vista muestre los documentos
    form.reset({
      ...data,
      planillaServicio,
      documentoAntecedentes,
      documentoIESS,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset();
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
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
          <ContactoBasicFields control={form.control} isEditing={isEditing} fields={fields} />
          <ContactoDocumentFields control={form.control} isEditing={isEditing} />

          {isEditing && (
            <div className="col-span-2 mt-8 flex justify-end">
              <PremiumButton
                type="submit"
                variant="primary"
                aria-label="Guardar datos de contacto"
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
