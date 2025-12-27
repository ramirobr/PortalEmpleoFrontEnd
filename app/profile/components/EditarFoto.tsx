"use client";
import Pencil from "@/components/shared/components/iconos/Pencil";
import Trash from "@/components/shared/components/iconos/Trash";
import Loader from "@/components/shared/components/Loader";
import TituloSubrayado from "@/components/shared/tituloSubrayado";
import { Card } from "@/components/ui/card";
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

export default function EditarFoto() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulating data fetching
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const schema = z.object({
    imagen: z.any().optional(),
  });

  const form = useForm({
    resolver: zodResolver(schema),
  });

  if (loading) {
    return <Loader className="py-8" />;
  }

  return (
    <Card className="px-6">
      <TituloSubrayado>Editar foto de perfil</TituloSubrayado>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(() => {})}
          className="flex flex-col items-center"
        >
          <div className="relative w-24 h-24 mb-2">
            <img
              src={
                form.watch("imagen")
                  ? URL.createObjectURL(form.watch("imagen"))
                  : "/profile.jpg"
              }
              alt="Foto de perfil"
              className="w-24 h-24 rounded-full object-cover"
            />
            <FormField
              control={form.control}
              name="imagen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Imagen de perfil</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        aria-label="Buscar foto de perfil"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                        ref={field.ref}
                        // We rely on the generated id from FormItem/FormControl
                      />
                    </FormControl>
                    {/* Icono lápiz (editar) */}
                    <button
                      type="button"
                      className="absolute -bottom-4 right-1 bg-white rounded-full p-1 shadow-md cursor-pointer flex items-center justify-center w-8 h-8"
                      aria-label="Cambiar foto de perfil"
                      onClick={() => {
                        const input = document.querySelector(
                          'input[type="file"][aria-label="Buscar foto de perfil"]'
                        ) as HTMLInputElement;
                        input?.click();
                      }}
                    >
                      <Pencil width={20} height={20} className="text-primary" />
                    </button>
                    {/* Icono basurero (remover) */}
                    <button
                      type="button"
                      className="absolute -bottom-4 left-1 bg-white rounded-full p-1 shadow-md cursor-pointer flex items-center justify-center"
                      aria-label="Remover foto de perfil"
                      style={{ width: "32px", height: "32px" }}
                      onClick={() => field.onChange(undefined)}
                    >
                      <Trash width={20} height={20} className="text-primary" />
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-10 flex gap-4 items-end">
            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
