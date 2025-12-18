import { DatePicker } from "@/components/ui/date-picker";
import { fetchPaises } from "@/lib/catalog/fetchPaises";
import Loader from "@/components/shared/components/Loader";
import React from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  Empresa: z.string().min(1, "La empresa es obligatoria."),
  Titulo: z.string().min(1, "El título es obligatorio."),
  Puesto: z.string().min(1, "El puesto es obligatorio."),
  Institucion: z.string().min(1, "La institución es obligatoria."),
  Nivel: z.string().min(1, "El nivel es obligatorio."),
  FechaInicio: z.string().min(1, "La fecha de inicio es obligatoria."),
  FechaFin: z.string().min(1, "La fecha de finalización es obligatoria."),
  Pais: z.string().min(1, "El país es obligatorio."),
  Actual: z.boolean(),
});

export type EditarExperenciaLaboralItemValues = z.infer<typeof schema>;

interface EditarExperenciaLaboralItemProps {
  initialValues: EditarExperenciaLaboralItemValues;
  onSave: (values: EditarExperenciaLaboralItemValues) => void;
  onCancel: () => void;
}

const EditarExperenciaLaboralItem: React.FC<
  EditarExperenciaLaboralItemProps
> = ({ initialValues, onSave, onCancel }) => {
  const [paises, setPaises] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    fetchPaises()
      .then(setPaises)
      .finally(() => setLoading(false));
  }, []);

  const form = useForm<EditarExperenciaLaboralItemValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      Empresa: initialValues.Empresa || "",
      Titulo: initialValues.Titulo || "",
      Puesto: initialValues.Puesto || "",
      Institucion: initialValues.Institucion || "",
      Nivel: initialValues.Nivel || "",
      FechaInicio: initialValues.FechaInicio || "",
      FechaFin: initialValues.FechaFin || "",
      Pais: initialValues.Pais || "",
      Actual: initialValues.Actual ?? false,
    },
  });

  if (loading) {
    return <Loader className="py-8" />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data: EditarExperenciaLaboralItemValues) =>
          onSave(data)
        )}
        className="space-y-4"
        aria-label="Editar experiencia laboral"
      >
        <FormField<EditarExperenciaLaboralItemValues>
          control={form.control}
          name="Empresa"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="edit-empresa">Empresa</FormLabel>
              <FormControl>
                <input
                  {...field}
                  id="edit-empresa"
                  className="w-full border rounded px-3 py-2"
                  required
                  type="text"
                  value={field.value as string}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField<EditarExperenciaLaboralItemValues>
          control={form.control}
          name="Titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="editar-titulo">
                Actividad de la empresa
              </FormLabel>
              <FormControl>
                <input
                  {...field}
                  id="editar-titulo"
                  className="w-full border rounded px-3 py-2"
                  required
                  type="text"
                  value={field.value as string}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField<EditarExperenciaLaboralItemValues>
          control={form.control}
          name="Puesto"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="editar-puesto">Puesto</FormLabel>
              <FormControl>
                <input
                  {...field}
                  id="editar-puesto"
                  className="w-full border rounded px-3 py-2"
                  required
                  type="text"
                  value={field.value as string}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField<EditarExperenciaLaboralItemValues>
          control={form.control}
          name="FechaInicio"
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
        <FormField<EditarExperenciaLaboralItemValues>
          control={form.control}
          name="FechaFin"
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
        <FormField<EditarExperenciaLaboralItemValues>
          control={form.control}
          name="Pais"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="edit-pais">País</FormLabel>
              <FormControl>
                <select
                  {...field}
                  id="edit-pais"
                  className="w-full border rounded px-3 py-2"
                  required
                  value={field.value as string}
                >
                  <option value="">Seleccione un país</option>
                  {paises.map((pais) => (
                    <option key={pais} value={pais}>
                      {pais}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField<EditarExperenciaLaboralItemValues>
          control={form.control}
          name="Actual"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormControl>
                  <input
                    type="checkbox"
                    id="edit-actual"
                    checked={Boolean(field.value)}
                    onChange={field.onChange}
                    className="w-4 h-4 cursor-pointer"
                    title="Al presente"
                  />
                </FormControl>
                <FormLabel
                  htmlFor="edit-actual"
                  className="cursor-pointer mb-0"
                >
                  Al presente
                </FormLabel>
              </div>
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

export default EditarExperenciaLaboralItem;
