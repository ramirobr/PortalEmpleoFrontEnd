import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  titulo: z.string().min(1, "El título es obligatorio."),
  institucion: z.string().min(1, "La institución es obligatoria."),
  fechaInicio: z.string().min(1, "La fecha de inicio es obligatoria."),
  fechaFin: z.string().min(1, "La fecha de finalización es obligatoria."),
  periodo: z.string().min(1, "El país es obligatorio."),
  estaCursando: z.boolean(),
});

export type EditarEducacionItemValues = z.infer<typeof schema>;

interface EditarEducacionItemProps {
  initialValues: EditarEducacionItemValues;
  onSave: (values: EditarEducacionItemValues) => void;
  onCancel: () => void;
}

const EditarEducacionItem: React.FC<EditarEducacionItemProps> = ({
  initialValues,
  onSave,
  onCancel,
}) => {
  const form = useForm<EditarEducacionItemValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSave)}
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
                <input
                  {...field}
                  id="edit-titulo"
                  className="w-full border rounded px-3 py-2"
                  required
                />
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
                <input
                  {...field}
                  id="edit-institucion"
                  className="w-full border rounded px-3 py-2"
                  required
                />
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
                <input
                  {...field}
                  id="periodo"
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fechaInicio"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="edit-fecha-inicio">Fecha de inicio</FormLabel>
              <FormControl>
                <DatePicker
                  value={
                    typeof field.value === "string" && field.value
                      ? new Date(field.value)
                      : undefined
                  }
                  onChange={(date) => {
                    field.onChange(
                      date ? date.toISOString().split("T")[0] : ""
                    );
                  }}
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
                  value={
                    typeof field.value === "string" && field.value
                      ? new Date(field.value)
                      : undefined
                  }
                  onChange={(date) => {
                    field.onChange(
                      date ? date.toISOString().split("T")[0] : ""
                    );
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark"
          >
            Guardar
          </button>
        </div>
      </form>
    </Form>
  );
};

export default EditarEducacionItem;
