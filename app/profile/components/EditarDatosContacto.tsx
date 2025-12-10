"use client";
import React from "react";
import TituloSubrayado from "@/components/shared/tituloSubrayado";
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

const schema = z.object({
  celular: z
    .string()
    .min(10, "El celular debe tener al menos 10 dígitos.")
    .max(14, "El celular no debe exceder 14 caracteres.")
    .default("+593 087379078"),
  telefono: z
    .string()
    .min(7, "El teléfono debe tener al menos 7 dígitos.")
    .max(14, "El teléfono no debe exceder 14 caracteres.")
    .default("+593 2375293"),
  email: z
    .string()
    .email("El email no es válido.")
    .min(1, "El email es obligatorio.")
    .default("janaya@gmail.com"),
  direccion: z.string().min(1, "La dirección es obligatoria.").default(""),
});
const defaultValues = {
  celular: "+593 087379078",
  telefono: "+593 2375293",
  email: "janaya@gmail.com",
  direccion: "",
};

const EditarDatosContacto: React.FC = () => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <section className="bg-white rounded-lg shadow p-8 mt-10">
      <TituloSubrayado>Datos de Contacto</TituloSubrayado>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {})}
          className="grid grid-cols-1 gap-6"
          aria-label="Formulario de datos de contacto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <FormField
              control={form.control}
              name="celular"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="celular">Celular</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      id="celular"
                      aria-label="Celular"
                      autoComplete="tel"
                      placeholder="+593 087379078"
                      pattern="\+593 [0-9]{9}"
                      inputMode="tel"
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="telefono">Teléfono</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      id="telefono"
                      aria-label="Teléfono"
                      autoComplete="tel"
                      placeholder="+593 2375293"
                      pattern="\+593 [0-9]{9}"
                      inputMode="tel"
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      id="email"
                      aria-label="Email"
                      autoComplete="email"
                      placeholder="janaya@gmail.com"
                      type="email"
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 mb-4">
            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="direccion">Dirección</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      id="direccion"
                      aria-label="Dirección"
                      autoComplete="street-address"
                      placeholder="Av. Siempre Viva 123"
                      type="text"
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </section>
  );
};

export default EditarDatosContacto;
