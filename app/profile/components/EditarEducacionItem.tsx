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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatosPersonalesFieldsResponse, Educacion } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  titulo: z.string().min(1, "El título es obligatorio."),
  institucion: z.string().min(1, "La institución es obligatoria."),
  fechaInicio: z.date("La fecha de inicio es obligatoria."),
  fechaFin: z.date("La fecha de finalización es obligatoria."),
  periodo: z.string().min(1, "El periodo es obligatorio."),
  estaCursando: z.boolean(),
  idNivelEstudio: z.number().min(1, "Selecciona un nivel de estudio"),
  descripcion: z.string().min(1, "Descripcion es obligatoria."),
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
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) =>
          onSave({
            ...data,
            fechaInicio: new Date(data.fechaInicio).toISOString(),
            fechaFin: new Date(data.fechaFin).toISOString(),
            id: "",
            orden: 0,
          })
        )}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="idNivelEstudio"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="nivel-estudio">Nivel de estudio</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(v) =>
                      form.setValue("idNivelEstudio", parseInt(v))
                    }
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

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <span className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full" />
            )}
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditarEducacionItem;
