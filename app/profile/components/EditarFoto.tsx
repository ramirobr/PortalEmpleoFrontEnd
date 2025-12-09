"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Trash from "@/components/shared/components/iconos/Trash";
import Pencil from "@/components/shared/components/iconos/Pencil";
import TituloSubrayado from "@/components/shared/tituloSubrayado";

export default function EditarFoto() {
  const schema = z.object({
    imagen: z.any().optional(),
  });

  const form = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <section className="bg-white rounded-lg shadow p-8 mt-10">
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
                  <FormLabel htmlFor="imagen" className="sr-only">
                    Imagen de perfil
                  </FormLabel>
                  <FormControl>
                    <div>
                      <input
                        id="imagen"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        aria-label="Buscar foto de perfil"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                      {/* Icono lápiz (editar) */}
                      <label
                        htmlFor="imagen"
                        className="absolute -bottom-4 right-1 bg-white rounded-full p-1 shadow-md cursor-pointer flex items-center justify-center"
                        aria-label="Cambiar foto de perfil"
                        style={{ width: "32px", height: "32px" }}
                      >
                        <Pencil
                          width={20}
                          height={20}
                          className="text-primary"
                        />
                      </label>
                      {/* Icono basurero (remover) */}
                      <button
                        type="button"
                        className="absolute -bottom-4 left-1 bg-white rounded-full p-1 shadow-md cursor-pointer flex items-center justify-center"
                        aria-label="Remover foto de perfil"
                        style={{ width: "32px", height: "32px" }}
                        onClick={() => field.onChange(undefined)}
                      >
                        <Trash
                          width={20}
                          height={20}
                          className="text-primary"
                        />
                      </button>
                    </div>
                  </FormControl>
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
    </section>
  );
}
