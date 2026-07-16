import { PremiumButton } from "@/components/shared/components/PremiumButton";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatosPersonalesFieldsResponse, Educacion } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Trash2 } from "lucide-react";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { fileToBase64 } from "@/lib/utils";

const schema = z.object({
  titulo: z.string().min(1, "El título es obligatorio."),
  institucion: z.string().min(1, "La institución es obligatoria."),
  fechaInicio: z.date("La fecha de inicio es obligatoria."),
  fechaFin: z.date("La fecha de finalización es obligatoria."),
  periodo: z.string().min(1, "El periodo es obligatorio."),
  estaCursando: z.boolean(),
  idNivelEstudio: z.number().min(1, "Selecciona un nivel de estudio"),
  descripcion: z.string().min(1, "Descripcion es obligatoria."),
  documento: z
    .union([z.instanceof(File), z.string(), z.undefined()])
    .optional()
    .refine(
      (f) => {
        if (f instanceof File) return f.size <= 5 * 1024 * 1024;
        return true;
      },
      { message: "El archivo no debe exceder los 5MB." }
    )
    .refine(
      (f) => {
        if (f instanceof File)
          return ["application/pdf", "image/jpeg", "image/jpg", "image/png",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(f.type);
        return true;
      },
      { message: "Solo se permiten PDF, Word, JPG o PNG." }
    ),
});

export type EditarEducacionItemValues = z.infer<typeof schema>;

interface EditarEducacionItemProps {
  initialValues: Educacion | null;
  fields: DatosPersonalesFieldsResponse | null;
  onSave: (values: Educacion) => void;
  onCancel: () => void;
}

const EditarEducacionItem: React.FC<EditarEducacionItemProps> = ({
  initialValues,
  fields,
  onSave,
  onCancel,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<EditarEducacionItemValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      titulo: initialValues?.titulo ?? "",
      periodo: initialValues?.periodo ?? "",
      fechaInicio: initialValues?.fechaInicio
        ? new Date(initialValues.fechaInicio)
        : undefined,
      fechaFin: initialValues?.fechaFin
        ? new Date(initialValues.fechaFin)
        : undefined,
      institucion: initialValues?.institucion ?? "",
      estaCursando: initialValues?.estaCursando ?? false,
      idNivelEstudio: initialValues?.idNivelEstudio ?? 0,
      descripcion: initialValues?.descripcion ?? "",
      documento: initialValues?.documentoAdjunto ?? undefined,
    },
  });

  const onSubmit = async (data: EditarEducacionItemValues) => {
    let documentoAdjunto: string | undefined = undefined;
    if (data.documento instanceof File) {
      documentoAdjunto = await fileToBase64(data.documento);
    } else if (typeof data.documento === "string" && data.documento) {
      documentoAdjunto = data.documento;
    }

    onSave({
      ...data,
      fechaInicio: new Date(data.fechaInicio).toISOString(),
      fechaFin: new Date(data.fechaFin).toISOString(),
      id: "",
      orden: 0,
      documentoAdjunto,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        aria-label="Editar educación"
      >
        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="edit-titulo">Título</FormLabel>
              <FormControl>
                <Input {...field} id="edit-titulo" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="institucion"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="edit-institucion">Institución</FormLabel>
              <FormControl>
                <Input {...field} id="edit-institucion" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="editar-descripcion">Descripcion</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="editar-descripcion"
                  required
                  type="text"
                  value={field.value as string}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="fechaInicio"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="edit-fecha-inicio">
                  Fecha de inicio
                </FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value as Date}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fechaFin"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="edit-fecha-fin">
                  Fecha de finalización
                </FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value as Date}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="idNivelEstudio"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="nivel-estudio">Nivel de estudio</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(v) => field.onChange(parseInt(v))}
                    defaultValue={field.value?.toString()}
                  >
                    <SelectTrigger id="nivel-estudio">
                      <SelectValue placeholder="Seleccione un nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      {fields?.nivel_estudio?.map((nivel) => (
                        <SelectItem
                          key={nivel.idCatalogo}
                          value={nivel.idCatalogo.toString()}
                        >
                          {nivel.nombre}
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
            name="periodo"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="periodo">Periodo</FormLabel>
                <FormControl>
                  <Input {...field} id="periodo" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Documento adjunto */}
        <FormField
          control={form.control}
          name="documento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Documento de respaldo (opcional)</FormLabel>
              <FormControl>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="hidden"
                    ref={(el) => {
                      fileInputRef.current = el;
                      field.ref(el);
                    }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) field.onChange(file);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-secondary flex items-center gap-2 cursor-pointer text-sm"
                  >
                    <FileText className="size-4" />
                    {field.value instanceof File
                      ? field.value.name
                      : typeof field.value === "string" && field.value
                        ? "Documento cargado"
                        : "Subir documento"}
                  </button>
                  {field.value && (
                    <button
                      type="button"
                      onClick={() => {
                        field.onChange(undefined);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                      aria-label="Quitar documento"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                  {typeof field.value === "string" && field.value && (
                    <button
                      type="button"
                      onClick={() => {
                        const ext = field.value?.toString().startsWith("data:application/pdf") ? ".pdf" : ".jpg";
                        const a = document.createElement("a");
                        a.href = field.value as string;
                        a.download = `documento_titulo${ext}`;
                        a.click();
                      }}
                      className="text-sm text-primary underline cursor-pointer"
                    >
                      Descargar
                    </button>
                  )}
                </div>
              </FormControl>
              <p className="text-xs text-slate-500 mt-1">PDF, Word, JPG o PNG · máx. 5MB</p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 mt-4">
          <PremiumButton variant="outline" onClick={onCancel}>
            Cancelar
          </PremiumButton>
          <PremiumButton
            type="submit"
            variant="primary"
            isLoading={form.formState.isSubmitting}
          >
            Guardar
          </PremiumButton>
        </div>
      </form>
    </Form>
  );
};

export default EditarEducacionItem;
