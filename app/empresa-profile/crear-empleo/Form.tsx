"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fetchApi } from "@/lib/apiClient";
import { parseWeirdDate } from "@/lib/utils";
import { CrearEmpleoFiltersResponse } from "@/types/company";
import { Job } from "@/types/jobs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import BannerSelector from "./BannerSelector";
import { useState } from "react";
import { SearchAutocomplete } from "@/components/ui/search-autocomplete";

const INICIO_LABORES_OPTIONS = [
  "Inmediato",
  "En una semana",
  "En dos semanas",
  "Fecha específica",
] as const;

const REQUISITOS_PREDEFINIDOS = [
  "Buena presencia",
  "Comunicativo/a",
  "Proactividad",
  "Responsabilidad",
  "Trabajo en equipo",
  "Puntualidad",
];

const crearEmpleoSchema = z
  .object({
    tituloPuesto: z.string().min(1, "Requerido"),
    descripcion: z.string().min(1, "Requerido"),
    requisitos: z.string().optional(),
    idCiudad: z.number().min(1, "Selecciona ciudad"),
    idModalidadTrabajo: z.number().min(1, "Selecciona modalidad"),
    idExperiencia: z.number().min(1, "Selecciona experiencia"),
    idNivelEstudio: z.number().min(1, "Selecciona nivel"),
    idTipoJornadaLaboral: z.number().optional(),
    fechaInicio: z.date("Requerido"),
    fechaCierre: z.date("Requerido"),
    salarioRange: z
      .tuple([z.number(), z.number()])
      .refine(([min, max]) => max >= min, {
        message: "El salario máximo debe ser mayor o igual al mínimo.",
      }),
    idArchivoEmpresa: z.string().optional(),
    inicioLabores: z.enum(INICIO_LABORES_OPTIONS).optional(),
    fechaInicioLabores: z.date().optional(),
    conExperiencia: z.boolean(),
    aniosExperiencia: z.number().min(0).max(50).optional(),
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
  )
  .refine(
    (data) =>
      data.inicioLabores !== "Fecha específica" || !!data.fechaInicioLabores,
    {
      path: ["fechaInicioLabores"],
      message: "Selecciona la fecha de inicio de labores.",
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
  const [selectedBannerBase64, setSelectedBannerBase64] = useState<string | null>(
    null
  );
  const [selectedRequisitos, setSelectedRequisitos] = useState<string[]>(() => {
    if (!initialValues?.requisitos) return [];
    return initialValues.requisitos.split("\n").filter((r) => REQUISITOS_PREDEFINIDOS.includes(r));
  });

  const toggleRequisito = (req: string) => {
    setSelectedRequisitos((prev) =>
      prev.includes(req) ? prev.filter((r) => r !== req) : [...prev, req]
    );
  };

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
      idTipoJornadaLaboral: initialValues?.idTipoJornadaLaboral,
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
      idArchivoEmpresa: initialValues?.idArchivoEmpresa || "",
      inicioLabores: (INICIO_LABORES_OPTIONS as readonly string[]).includes(initialValues?.inicioLabores ?? "")
        ? (initialValues!.inicioLabores as typeof INICIO_LABORES_OPTIONS[number])
        : undefined,
      fechaInicioLabores: undefined,
      conExperiencia: initialValues?.aniosExperiencia != null,
      aniosExperiencia: initialValues?.aniosExperiencia ?? undefined,
    },
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  const watchedInicioLabores = watch("inicioLabores");
  const watchedConExperiencia = watch("conExperiencia");

  const onSubmit = async (values: FormData) => {
    if (!session?.user?.idEmpresa) {
      toast.error(
        "No se pudo obtener la información de la empresa. Por favor, inicia sesión nuevamente.",
      );
      return;
    }

    const allRequisitos = [
      ...selectedRequisitos,
      ...(values.requisitos ? [values.requisitos] : []),
    ]
      .filter(Boolean)
      .join("\n");

    const payload = {
      idEmpresa: session.user.idEmpresa,
      tituloPuesto: values.tituloPuesto,
      descripcion: values.descripcion,
      requisitos: allRequisitos || values.requisitos,
      salarioBase: values.salarioRange[0],
      salarioMaximo: values.salarioRange[1],
      fechaInicio: values.fechaInicio.toISOString(),
      fechaCierre: values.fechaCierre.toISOString(),
      idModalidadTrabajo: Number(values.idModalidadTrabajo),
      idCiudad: Number(values.idCiudad),
      idNivelEstudio: Number(values.idNivelEstudio),
      idExperiencia: Number(values.idExperiencia),
      ...(values.idTipoJornadaLaboral && { idTipoJornadaLaboral: Number(values.idTipoJornadaLaboral) }),
      ...(values.idArchivoEmpresa && {
        idArchivoEmpresa: values.idArchivoEmpresa,
      }),
      ...(values.inicioLabores && { inicioLabores: values.inicioLabores }),
      ...(values.fechaInicioLabores && {
        fechaInicioLabores: values.fechaInicioLabores.toISOString(),
      }),
      ...(values.conExperiencia && { conExperiencia: values.conExperiencia }),
      ...(values.aniosExperiencia !== undefined && {
        aniosExperiencia: values.aniosExperiencia,
      }),
    };

    const response = await fetchApi(
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
    setSelectedRequisitos([]);
    reset({
      tituloPuesto: "",
      descripcion: "",
      requisitos: "",
      idCiudad: undefined,
      idModalidadTrabajo: undefined,
      idExperiencia: undefined,
      idNivelEstudio: undefined,
      idTipoJornadaLaboral: undefined,
      fechaInicio: new Date(),
      fechaCierre: undefined,
      salarioRange: [800, 2500],
      inicioLabores: undefined,
      fechaInicioLabores: undefined,
      conExperiencia: false,
      aniosExperiencia: undefined,
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Title */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-zinc-700 mb-1">
            Título del Empleo
          </label>
          <Input
            placeholder="Ej. Desarrollador Senior React"
            className="bg-zinc-50 border-zinc-200 focus:bg-white transition-colors"
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
          <label className="block text-sm font-semibold text-zinc-700 mb-1">
            Ciudad
          </label>
          <Controller
            name="idCiudad"
            control={control}
            render={({ field }) => (
              <SearchAutocomplete<number>
                options={
                  fields?.ciudad?.map((c) => ({
                    id: c.idCatalogo,
                    label: c.nombre,
                  })) ?? []
                }
                value={field.value || undefined}
                onChange={(id) => field.onChange(id)}
                placeholder="Seleccionar Ciudad"
              />
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
          <label className="block text-sm font-semibold text-zinc-700 mb-1">
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
                <SelectTrigger className="bg-zinc-50 border-zinc-200">
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

        {/* Jornada Laboral */}
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-1">
            Jornada Laboral
          </label>
          <Controller
            name="idTipoJornadaLaboral"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value ? String(field.value) : ""}
              >
                <SelectTrigger className="bg-zinc-50 border-zinc-200">
                  <SelectValue placeholder="Seleccionar Jornada" />
                </SelectTrigger>
                <SelectContent>
                  {fields?.tipo_empleo?.map((jornada) => (
                    <SelectItem
                      key={jornada.idCatalogo}
                      value={String(jornada.idCatalogo)}
                    >
                      {jornada.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-1">
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
                <SelectTrigger className="bg-zinc-50 border-zinc-200">
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
          <label className="block text-sm font-semibold text-zinc-700 mb-1">
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
                <SelectTrigger className="bg-zinc-50 border-zinc-200">
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
          <label className="block text-sm font-semibold text-zinc-700 mb-1">
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
          <label className="block text-sm font-semibold text-zinc-700 mb-1">
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
        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-zinc-700 mb-2">
            Rango Salarial Mensual (USD)
          </label>
          <Controller
            name="salarioRange"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs text-zinc-500 mb-1 block">Mínimo</label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Ej: 800"
                    value={field.value?.[0] ?? ""}
                    onChange={(e) =>
                      field.onChange([Number(e.target.value), field.value?.[1] ?? 0])
                    }
                    className="bg-zinc-50 border-zinc-200"
                  />
                </div>
                <span className="mt-5 text-zinc-400 font-bold">—</span>
                <div className="flex-1">
                  <label className="text-xs text-zinc-500 mb-1 block">Máximo</label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Ej: 1500"
                    value={field.value?.[1] ?? ""}
                    onChange={(e) =>
                      field.onChange([field.value?.[0] ?? 0, Number(e.target.value)])
                    }
                    className="bg-zinc-50 border-zinc-200"
                  />
                </div>
              </div>
            )}
          />
          {errors.salarioRange && (
            <p className="text-sm text-red-600 mt-1">
              {errors.salarioRange.message as string}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-zinc-700 mb-1">
            Descripción del Puesto
          </label>
          <Textarea
            placeholder="Describe de forma clara las responsabilidades del puesto."
            className="min-h-[200px] bg-zinc-50 border-zinc-200 focus:bg-white transition-colors"
            {...register("descripcion")}
          />
          {errors.descripcion && (
            <p className="text-sm text-red-600 mt-1">
              {errors.descripcion.message}
            </p>
          )}
        </div>

        {/* Inicio de Labores */}
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-1">
            Inicio de Labores
          </label>
          <Controller
            name="inicioLabores"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value ?? ""}
              >
                <SelectTrigger className="bg-zinc-50 border-zinc-200">
                  <SelectValue placeholder="Seleccionar inicio" />
                </SelectTrigger>
                <SelectContent>
                  {INICIO_LABORES_OPTIONS.map((op) => (
                    <SelectItem key={op} value={op}>
                      {op}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {watchedInicioLabores === "Fecha específica" && (
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">
              Fecha de Inicio de Labores
            </label>
            <Controller
              name="fechaInicioLabores"
              control={control}
              render={({ field }) => (
                <DatePicker value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.fechaInicioLabores && (
              <p className="text-sm text-red-600 mt-1">
                {errors.fechaInicioLabores.message}
              </p>
            )}
          </div>
        )}

        {/* Experiencia Requerida */}
        <div className="lg:col-span-2 flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 cursor-pointer select-none">
            <Controller
              name="conExperiencia"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(v) => field.onChange(v === true)}
                />
              )}
            />
            Requiere experiencia previa
          </label>
          {watchedConExperiencia && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-zinc-600 whitespace-nowrap">
                Años de experiencia:
              </label>
              <Controller
                name="aniosExperiencia"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    min={0}
                    max={50}
                    placeholder="Ej: 2"
                    className="w-24 bg-zinc-50 border-zinc-200"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                  />
                )}
              />
            </div>
          )}
        </div>

        {/* Requirements */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-zinc-700 mb-2">
            Requisitos
          </label>
          <div className="mb-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {REQUISITOS_PREDEFINIDOS.map((req) => (
              <label
                key={req}
                className="flex items-center gap-2 text-sm cursor-pointer select-none"
              >
                <Checkbox
                  checked={selectedRequisitos.includes(req)}
                  onCheckedChange={() => toggleRequisito(req)}
                />
                {req}
              </label>
            ))}
          </div>
          <Textarea
            placeholder="Agrega requisitos adicionales del puesto (opcional)."
            className="min-h-[120px] bg-zinc-50 border-zinc-200 focus:bg-white transition-colors"
            {...register("requisitos")}
          />
          {errors.requisitos && (
            <p className="text-sm text-red-600 mt-1">
              {errors.requisitos.message}
            </p>
          )}
        </div>

        {/* Banner Selector */}
        <div className="lg:col-span-2">
          <Controller
            name="idArchivoEmpresa"
            control={control}
            render={({ field }) => (
              <BannerSelector
                idEmpresa={session?.user?.idEmpresa || ""}
                selectedArchivos={field.value}
                onSelectArchivo={(idArchivo, base64Data) => {
                  field.onChange(idArchivo);
                  setSelectedBannerBase64(base64Data || null);
                }}
              />
            )}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-zinc-100">
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
            <span className="animate-spin size-4 border-2 border-t-transparent rounded-full" />
          )}
          {isEditMode ? "Actualizar " : "Publicar "}
        </Button>
      </div>
    </form>
  );
}
