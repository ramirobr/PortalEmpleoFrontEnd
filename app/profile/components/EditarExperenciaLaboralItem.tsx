import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CatalogsByType } from "@/types/search";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  empresa: z.string().min(1, "La empresa es obligatoria."),
  puesto: z.string().min(1, "El puesto es obligatorio."),
  ciudad: z.string().min(1, "La ciudad es obligatoria."), //TODO: Missing
  fechaInicio: z.string().min(1, "La fecha de inicio es obligatoria."),
  fechaFin: z.string().min(1, "La fecha de finalización es obligatoria."),
  pais: z.string().min(1, "El país es obligatorio."),
  estaTrabajando: z.boolean(),
});

export type EditarExperenciaLaboralItemValues = z.infer<typeof schema>;

interface EditarExperenciaLaboralItemProps {
  pais: CatalogsByType[] | undefined;
  initialValues: EditarExperenciaLaboralItemValues;
  onSave: (values: EditarExperenciaLaboralItemValues) => void;
  onCancel: () => void;
}

//TODO: Missing integration
const EditarExperenciaLaboralItem: React.FC<
  EditarExperenciaLaboralItemProps
> = ({ initialValues, pais, onSave, onCancel }) => {
  const form = useForm<EditarExperenciaLaboralItemValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      empresa: initialValues.empresa || "",
      puesto: initialValues.puesto || "",
      fechaInicio: initialValues.fechaInicio || "",
      fechaFin: initialValues.fechaFin || "",
      pais: initialValues.pais || "",
      estaTrabajando: initialValues.estaTrabajando ?? false,
      ciudad: "",
    },
  });

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
          name="empresa"
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
        {/* <FormField<EditarExperenciaLaboralItemValues>
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
        /> */}
        <FormField<EditarExperenciaLaboralItemValues>
          control={form.control}
          name="puesto"
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
        <FormField<EditarExperenciaLaboralItemValues>
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
        <FormField<EditarExperenciaLaboralItemValues>
          control={form.control}
          name="pais"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="edit-pais">País</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString()}
                >
                  <SelectTrigger id="edit-pais">
                    <SelectValue placeholder="Seleccione un país" />
                  </SelectTrigger>
                  <SelectContent>
                    {pais?.map((pais) => (
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
        <FormField<EditarExperenciaLaboralItemValues>
          control={form.control}
          name="estaTrabajando"
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
