import { DatePicker } from "@/components/ui/date-picker";
import {
  fetchNivelesEducacion,
  NivelEducacion,
} from "@/lib/catalog/fetchNivelesEducacion";
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
  Titulo: z.string().min(1, "El título es obligatorio."),
  Institucion: z.string().min(1, "La institución es obligatoria."),
  Nivel: z.string().min(1, "El nivel es obligatorio."),
  Fecha: z.string().min(1, "La fecha es obligatoria."),
  Pais: z.string().min(1, "El país es obligatorio."),
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
  const [nivelOptions, setNivelOptions] = React.useState<NivelEducacion[]>([]);
  const [paises, setPaises] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    Promise.all([fetchNivelesEducacion(), fetchPaises()])
      .then(([niveles, countries]) => {
        setNivelOptions(niveles);
        setPaises(countries);
      })
      .finally(() => setLoading(false));
  }, []);

  const form = useForm<EditarEducacionItemValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  if (loading) {
    return <Loader className="py-8" />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSave)}
        className="space-y-4"
        aria-label="Editar educación"
      >
        <FormField
          control={form.control}
          name="Titulo"
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
          name="Institucion"
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
          name="Nivel"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="edit-nivel">Nivel</FormLabel>
              <FormControl>
                <select
                  {...field}
                  id="edit-nivel"
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Seleccione un nivel</option>
                  {nivelOptions.map((opt) => (
                    <option key={opt.key} value={opt.value}>
                      {opt.value}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Fecha"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="edit-fecha">Fecha</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value ? new Date(field.value) : undefined}
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
