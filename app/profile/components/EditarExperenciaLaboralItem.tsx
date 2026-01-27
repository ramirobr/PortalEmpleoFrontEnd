import { Button } from "@/components/ui/button";
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
import {
  DatosPersonalesFieldsResponse,
  ExperienciaLaboral,
} from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z
  .object({
    empresa: z.string().min(1, "La empresa es obligatoria."),
    puesto: z.string().min(1, "El puesto es obligatorio."),
    fechaInicio: z.date({ error: "La fecha de inicio es obligatoria." }),
    fechaFin: z
      .date({ error: "La fecha de finalización es obligatoria." })
      .optional(),
    idPais: z.number().min(1, "Selecciona un pais"),
    idCiudad: z.number().min(1, "Selecciona una ciudad"),
    descripcion: z.string().min(1, "Descripcion es obligatoria."),
    sector: z.string().min(1, "Sector es obligatorio."),
    idTipoEmpleo: z.number().min(1, "Selecciona un tipo de empleo"),
    trabajoActual: z.boolean(),
  })
  .refine((data) => data.trabajoActual || data.fechaFin, {
    message:
      "La fecha de finalización es obligatoria si no trabaja actualmente.",
    path: ["fechaFin"],
  });

export type EditarExperenciaLaboralItemValues = z.infer<typeof schema>;

interface EditarExperenciaLaboralItemProps {
  fields: DatosPersonalesFieldsResponse | null;
  initialValues: ExperienciaLaboral | null;
  onSave: (values: ExperienciaLaboral) => void;
  onCancel: () => void;
}

const EditarExperenciaLaboralItem: React.FC<
  EditarExperenciaLaboralItemProps
> = ({ initialValues, fields, onSave, onCancel }) => {
  const form = useForm<EditarExperenciaLaboralItemValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      empresa: initialValues?.empresa || "",
      puesto: initialValues?.puesto || "",
      fechaInicio: initialValues?.fechaInicio
        ? new Date(initialValues.fechaInicio)
        : undefined,
      fechaFin: initialValues?.fechaFin
        ? new Date(initialValues.fechaFin)
        : undefined,
      idPais: initialValues?.idPais || 0,
      idCiudad: initialValues?.idCiudad || 0,
      trabajoActual: initialValues?.estaTrabajando ?? false,
      descripcion: initialValues?.descripcion || "",
      sector: initialValues?.sector || "",
      idTipoEmpleo: initialValues?.idTipoEmpleo ?? 0,
    },
  });

  const trabajoActual = form.watch("trabajoActual");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) =>
          onSave({
            ...data,
            fechaInicio: new Date(data.fechaInicio).toISOString(),
            fechaFin: data.fechaFin
              ? new Date(data.fechaFin).toISOString()
              : "",
            estaTrabajando: data.trabajoActual,
          } as unknown as ExperienciaLaboral),
        )}
        className="space-y-5"
        aria-label="Editar experiencia laboral"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField<EditarExperenciaLaboralItemValues>
            control={form.control}
            name="empresa"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="edit-empresa">Empresa</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="edit-empresa"
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
            name="puesto"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="editar-puesto">Puesto</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="editar-puesto"
                    required
                    type="text"
                    value={field.value as string}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField<EditarExperenciaLaboralItemValues>
          control={form.control}
          name="fechaInicio"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="edit-fecha-inicio">Fecha de inicio</FormLabel>
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
        <FormField<EditarExperenciaLaboralItemValues>
          control={form.control}
          name="fechaFin"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="edit-fecha-fin">
                Fecha de finalización
              </FormLabel>
              <FormField<EditarExperenciaLaboralItemValues>
                control={form.control}
                name="trabajoActual"
                render={({ field: trabajoField }) => (
                  <div className="flex items-center gap-2 mb-2">
                    <Checkbox
                      id="trabajo-actual"
                      checked={Boolean(trabajoField.value)}
                      onCheckedChange={trabajoField.onChange}
                    />
                    <Label
                      htmlFor="trabajo-actual"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Al presente
                    </Label>
                  </div>
                )}
              />
              {!trabajoActual && (
                <FormControl>
                  <DatePicker
                    value={field.value as Date}
                    onChange={field.onChange}
                  />
                </FormControl>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField<EditarExperenciaLaboralItemValues>
            control={form.control}
            name="idPais"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="edit-pais">País</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(v) => form.setValue("idPais", parseInt(v))}
                    defaultValue={field.value?.toString()}
                  >
                    <SelectTrigger id="edit-pais">
                      <SelectValue placeholder="Seleccione un país" />
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
          <FormField<EditarExperenciaLaboralItemValues>
            control={form.control}
            name="idCiudad"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="edit-ciudad">Ciudad</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(v) =>
                      form.setValue("idCiudad", parseInt(v))
                    }
                    defaultValue={field.value?.toString()}
                  >
                    <SelectTrigger id="edit-ciudad">
                      <SelectValue placeholder="Seleccione una ciudad" />
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField<EditarExperenciaLaboralItemValues>
            control={form.control}
            name="idTipoEmpleo"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="edit-tipo-empleo">Tipo de empleo</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(v) =>
                      form.setValue("idTipoEmpleo", parseInt(v))
                    }
                    defaultValue={field.value?.toString()}
                  >
                    <SelectTrigger id="edit-tipo-empleo">
                      <SelectValue placeholder="Seleccione un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {fields?.tipo_empleo?.map((empleo) => (
                        <SelectItem
                          key={empleo.idCatalogo}
                          value={empleo.idCatalogo.toString()}
                        >
                          {empleo.nombre}
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
            name="sector"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="editar-sector">Sector</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="editar-sector"
                    required
                    type="text"
                    value={field.value as string}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField<EditarExperenciaLaboralItemValues>
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

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onCancel}>
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

export default EditarExperenciaLaboralItem;
