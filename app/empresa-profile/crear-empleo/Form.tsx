"use client";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { fetchApi } from "@/lib/apiClient";
import { PlainStringDataMessage } from "@/types/user";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { CrearEmpleoFiltersResponse } from "@/types/company";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Job } from "@/types/jobs";
import { parseWeirdDate } from "@/lib/utils";

const crearEmpleoSchema = z
  .object({
    tituloPuesto: z.string().min(1, "Requerido"),
    descripcion: z.string().min(1, "Requerido"),
    requisitos: z.string().min(1, "Requerido"),
    idCiudad: z.number().min(1, "Selecciona ciudad"),
    idModalidadTrabajo: z.number().min(1, "Selecciona modalidad"),
    idExperiencia: z.number().min(1, "Selecciona experiencia"),
    idNivelEstudio: z.number().min(1, "Selecciona nivel"),
    fechaInicio: z.date("Requerido"),
    fechaCierre: z.date("Requerido"),
    salarioRange: z
      .tuple([z.number(), z.number()])
      .refine(([min, max]) => max >= min, {
        message: "El salario máximo debe ser mayor o igual al mínimo.",
      }),
  })
  .refine(
    (data) =>
      data.fechaCierre &&
      data.fechaInicio &&
      data.fechaCierre > data.fechaInicio,
    {
      path: ["fechaCierre"],
      message: "La fecha de cierre debe ser mayor que la fecha de inicio.",
    },
  );

type FormData = z.infer<typeof crearEmpleoSchema>;

type FormProps = {
  fields: CrearEmpleoFiltersResponse | null;
  initialValues?: Job;
};

export default function CrearEmpleoForm({ fields, initialValues }: FormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const isEditMode = !!initialValues;

  const form = useForm<FormData>({
    resolver: zodResolver(crearEmpleoSchema),
    defaultValues: {
      tituloPuesto: initialValues?.titulo ?? "",
      descripcion: initialValues?.descripcion ?? "",
      requisitos: initialValues?.requisitos ?? "",
      idCiudad: initialValues?.idCiudad,
      idModalidadTrabajo: initialValues?.idModalidad,
      idExperiencia: initialValues?.idExperiencia,
      idNivelEstudio: initialValues?.idNivelEstudio,
      fechaInicio: initialValues?.fechaPublicacion
        ? parseWeirdDate(initialValues.fechaPublicacion)
        : new Date(),
      fechaCierre: initialValues?.fechaCierre
        ? parseWeirdDate(initialValues.fechaCierre)
        : undefined,
      salarioRange: [
        initialValues?.salarioBase ?? 800,
        initialValues?.salarioMaximo ?? 2500,
      ] as [number, number],
    },
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = form;

  const salarioRange = watch("salarioRange");

  const onSubmit = async (values: FormData) => {
    if (!session?.user?.idEmpresa) {
      toast.error(
        "No se pudo obtener la información de la empresa. Por favor, inicia sesión nuevamente.",
      );
      return;
    }

    const payload = {
      idEmpresa: session.user.idEmpresa,
      tituloPuesto: values.tituloPuesto,
      descripcion: values.descripcion,
      requisitos: values.requisitos,
      salarioBase: values.salarioRange[0],
      salarioMaximo: values.salarioRange[1],
      fechaInicio: values.fechaInicio.toISOString(),
      fechaCierre: values.fechaCierre.toISOString(),
      idModalidadTrabajo: Number(values.idModalidadTrabajo),
      idCiudad: Number(values.idCiudad),
      idNivelEstudio: Number(values.idNivelEstudio),
      idExperiencia: Number(values.idExperiencia),
    };

    const response = await fetchApi<PlainStringDataMessage>(
      isEditMode
        ? "/Jobs/updateJob/" + initialValues.idVacante
        : "/Jobs/addVacante",
      {
        method: isEditMode ? "PUT" : "POST",
        body: payload,
        token: session.user.accessToken,
      },
    );

    if (response?.isSuccess) {
      toast.success(
        `¡Empleo ${isEditMode ? "editado" : "publicado"} exitosamente!`,
      );
      handleCancel();
      router.push("/empresa-profile/empleos");
    } else {
      toast.error(
        response?.messages?.join("\n") ||
          `Hubo un problema al ${isEditMode ? "editar" : "publicar"} el empleo. Intenta nuevamente.`,
      );
    }
  };

  const handleCancel = () => {
    if (isEditMode) {
      router.push("/empresa-profile/empleos");
      return;
    }
    reset({
      tituloPuesto: "",
      descripcion: "",
      requisitos: "",
      idCiudad: undefined,
      idModalidadTrabajo: undefined,
      idExperiencia: undefined,
      idNivelEstudio: undefined,
      fechaInicio: new Date(),
      fechaCierre: undefined,
      salarioRange: [800, 2500],
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Título del Empleo
          </label>
          <Input
            placeholder="Ej. Desarrollador Senior React"
            className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            {...register("tituloPuesto")}
          />
          {errors.tituloPuesto && (
            <p className="text-sm text-red-600 mt-1">
              {errors.tituloPuesto.message}
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Ciudad
          </label>
          <Controller
            name="idCiudad"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value ? String(field.value) : ""}
              >
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Seleccionar Ciudad" />
                </SelectTrigger>
                <SelectContent>
                  {fields?.ciudad?.map((city) => (
                    <SelectItem
                      key={city.idCatalogo}
                      value={String(city.idCatalogo)}
                    >
                      {city.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.idCiudad && (
            <p className="text-sm text-red-600 mt-1">
              {errors.idCiudad.message}
            </p>
          )}
        </div>

        {/* Modality */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Modalidad
          </label>
          <Controller
            name="idModalidadTrabajo"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value ? String(field.value) : ""}
              >
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Seleccionar Modalidad" />
                </SelectTrigger>
                <SelectContent>
                  {fields?.modalidad_trabajo?.map((modality) => (
                    <SelectItem
                      key={modality.idCatalogo}
                      value={String(modality.idCatalogo)}
                    >
                      {modality.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.idModalidadTrabajo && (
            <p className="text-sm text-red-600 mt-1">
              {errors.idModalidadTrabajo.message}
            </p>
          )}
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Experiencia
          </label>
          <Controller
            name="idExperiencia"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value ? String(field.value) : ""}
              >
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Seleccionar experiencia" />
                </SelectTrigger>
                <SelectContent>
                  {fields?.experiencia?.map((exp) => (
                    <SelectItem
                      key={exp.idCatalogo}
                      value={String(exp.idCatalogo)}
                    >
                      {exp.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.idExperiencia && (
            <p className="text-sm text-red-600 mt-1">
              {errors.idExperiencia.message}
            </p>
          )}
        </div>

        {/* Education Level */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Nivel de Estudio
          </label>
          <Controller
            name="idNivelEstudio"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value ? String(field.value) : ""}
              >
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Seleccionar nivel" />
                </SelectTrigger>
                <SelectContent>
                  {fields?.nivel_estudio?.map((level) => (
                    <SelectItem
                      key={level.idCatalogo}
                      value={String(level.idCatalogo)}
                    >
                      {level.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.idNivelEstudio && (
            <p className="text-sm text-red-600 mt-1">
              {errors.idNivelEstudio.message}
            </p>
          )}
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Fecha de Inicio
          </label>
          <Controller
            name="fechaInicio"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={(d) => field.onChange(d ?? field.value)}
              />
            )}
          />
          {errors.fechaInicio && (
            <p className="text-sm text-red-600 mt-1">
              {errors.fechaInicio.message}
            </p>
          )}
        </div>

        {/* Closing Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Fecha de Cierre
          </label>
          <Controller
            name="fechaCierre"
            control={control}
            render={({ field }) => (
              <DatePicker value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.fechaCierre && (
            <p className="text-sm text-red-600 mt-1">
              {errors.fechaCierre.message}
            </p>
          )}
        </div>

        {/* Salary */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Rango Salarial (Mensual): ${salarioRange?.[0] ?? 0} - $
            {salarioRange?.[1] ?? 0}
          </label>
          <Controller
            name="salarioRange"
            control={control}
            render={({ field }) => (
              <Slider
                min={400}
                max={5000}
                step={50}
                value={field.value}
                onValueChange={field.onChange}
                className="py-4"
              />
            )}
          />
          {errors.salarioRange && (
            <p className="text-sm text-red-600 mt-1">
              {errors.salarioRange.message as string}
            </p>
          )}
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>$400</span>
            <span>$5000+</span>
          </div>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Descripción del Puesto
          </label>
          <Textarea
            placeholder="Describe de forma clara las responsabilidades del puesto."
            className="min-h-[200px] bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            {...register("descripcion")}
          />
          {errors.descripcion && (
            <p className="text-sm text-red-600 mt-1">
              {errors.descripcion.message}
            </p>
          )}
        </div>

        {/* Requirements */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Requisitos
          </label>
          <Textarea
            placeholder="Describe de forma clara los requisitos del puesto."
            className="min-h-[200px] bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            {...register("requisitos")}
          />
          {errors.requisitos && (
            <p className="text-sm text-red-600 mt-1">
              {errors.requisitos.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
        <Button
          variant="outline"
          type="button"
          className="cursor-pointer"
          onClick={handleCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-white min-w-[150px] cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <span className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full" />
          )}
          {isEditMode ? "Actualizar " : "Publicar "}
        </Button>
      </div>
    </form>
  );
}
