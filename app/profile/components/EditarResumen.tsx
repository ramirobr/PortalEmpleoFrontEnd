"use client";
import { Pencil } from "@/components/shared/components/iconos/Pencil";
import { Trash } from "@/components/shared/components/iconos/Trash";
import TituloSubrayado from "@/components/shared/tituloSubrayado";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/context/authStore";
import { fetchApi } from "@/lib/apiClient";
import {
  Curriculum,
  DatosPersonalesFieldsResponse,
  PlainStringDataMessage,
} from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  resumenProfesional: z.string().min(1, "El resumen es obligatorio."),
  idDisponibilidad: z.number().min(1, "Selecciona disponibilidad."),
});

type EditarResumenProps = {
  curriculum: Curriculum | undefined;
  fields: DatosPersonalesFieldsResponse | null;
};

export default function EditarResumen({
  curriculum,
  fields,
}: EditarResumenProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const idCurriculum = useAuthStore((s) => s.idCurriculum);
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      resumenProfesional: curriculum?.resumenProfesional ?? "",
      idDisponibilidad: curriculum?.idDisponibilidad || 0,
    },
  });

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    const body = {
      ...data,
      idCurriculum,
      resumenProfesional: data.resumenProfesional,
      idDisponibilidad: data.idDisponibilidad,
      esPrincipal: true,
    };

    const res = await fetchApi<PlainStringDataMessage>("/Curriculum/guardar", {
      method: "POST",
      token: session?.user.accessToken,
      body,
    });
    if (!res || !res.isSuccess) {
      toast.error("Error guardando resumen");
      return;
    }
    toast.success(res?.data);
    setIsEditing(false);
  };

  return (
    <Card className="px-6">
      <div className="flex justify-between items-center mb-10">
        <TituloSubrayado className="mb-0">Resumen Profesional</TituloSubrayado>
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="cursor-pointer"
            aria-label="Editar resumen profesional"
          >
            <Pencil width={25} height={25} className="text-primary" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCancel}
            className="cursor-pointer"
            aria-label="Cancelar edición"
          >
            <Trash width={25} height={25} className="text-primary" />
          </button>
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid grid-cols-1"
          aria-label="Formulario de resumen profesional"
        >
          <div className="grid grid-cols-1 gap-6 mb-4">
            <FormField
              control={form.control}
              name="resumenProfesional"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="text-lg font-bold mb-4"
                    htmlFor="resumen"
                  >
                    Resumen
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id="resumen"
                      aria-label="Resumen"
                      placeholder="Descripción profesional"
                      disabled={!isEditing}
                      rows={5}
                      className="w-full border rounded px-3 py-2 min-h-28"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="idDisponibilidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="disponibilidad">Disponibilidad</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(v) =>
                        form.setValue("idDisponibilidad", parseInt(v))
                      }
                      defaultValue={field.value?.toString()}
                    >
                      <SelectTrigger id="disponibilidad">
                        <SelectValue placeholder="Seleccione disponibilidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {fields?.disponibilidad?.map((disponibilidad) => (
                          <SelectItem
                            key={disponibilidad.idCatalogo}
                            value={disponibilidad.idCatalogo.toString()}
                          >
                            {disponibilidad.nombre}
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
          <div className="col-span-2 mt-8 flex justify-end">
            <Button
              type="submit"
              aria-label="Guardar resumen profesional"
              disabled={!isEditing || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <span className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full" />
              )}
              Guardar
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
