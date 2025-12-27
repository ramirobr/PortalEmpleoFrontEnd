"use client";
import React from "react";
import TituloSubrayado from "@/components/shared/tituloSubrayado";
import Loader from "@/components/shared/components/Loader";
import { fetchResumenProfesional } from "@/lib/catalog/fetchResumenProfesional";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil } from "@/components/shared/components/iconos/Pencil";
import { Trash } from "@/components/shared/components/iconos/Trash";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";

const schema = z.object({
  Resumen: z.string().min(1, "El resumen es obligatorio."),
  sueldo: z.string().min(1, "El sueldo es obligatorio."),
});

export default function EditarResumen() {
  const [isEditing, setIsEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      Resumen: "",
      sueldo: "",
    },
  });

  React.useEffect(() => {
    setLoading(true);
    fetchResumenProfesional()
      .then((data) => {
        if (data) {
          form.reset(data);
        }
      })
      .finally(() => setLoading(false));
  }, [form]);

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const handleSubmit = (data: z.infer<typeof schema>) => {
    console.log("Datos guardados:", data);
    setIsEditing(false);
  };

  if (loading) {
    return <Loader className="py-8" />;
  }

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
              name="Resumen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="text-lg font-bold mb-4"
                    htmlFor="resumen"
                  >
                    Resumen
                  </FormLabel>
                  <FormControl>
                    <textarea
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
              name="sueldo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="text-lg font-bold mb-4"
                    htmlFor="sueldo"
                  >
                    Sueldo deseado ($)
                  </FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      id="sueldo"
                      aria-label="Sueldo deseado"
                      placeholder="1300"
                      type="text"
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2 mt-8 flex justify-end">
            <button
              type="submit"
              className="btn btn-primary cursor-pointer"
              aria-label="Guardar resumen profesional"
              tabIndex={0}
              role="button"
              disabled={!isEditing}
            >
              Guardar
            </button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
