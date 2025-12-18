"use client";
import React from "react";
import TituloSubrayado from "@/components/shared/tituloSubrayado";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil } from "@/components/shared/components/iconos/Pencil";
import { Trash } from "@/components/shared/components/iconos/Trash";
import Loader from "@/components/shared/components/Loader";
import { fetchDatosContacto } from "@/lib/catalog/fetchDatosContacto";
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

const EditarDatosContacto: React.FC = () => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      celular: "",
      telefono: "",
      email: "",
      direccion: "",
    },
  });

  React.useEffect(() => {
    setLoading(true);
    fetchDatosContacto()
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
    // TODO: Aquí puedes agregar la lógica para enviar los datos al servidor
    setIsEditing(false);
  };

  if (loading) {
    return <Loader className="py-8" />;
  }

  return (
    <section className="bg-white rounded-lg shadow p-8 mt-10">
      <div className="flex justify-between items-center mb-10">
        <TituloSubrayado>Datos de Contacto</TituloSubrayado>
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className=""
            aria-label="Editar datos de contacto"
          >
            <Pencil width={25} height={25} className="text-primary" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCancel}
            className=""
            aria-label="Cancelar edición"
          >
            <Trash width={25} height={25} className="text-primary" />
          </button>
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
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
                      disabled={!isEditing}
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
                      disabled={!isEditing}
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
                      disabled={!isEditing}
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
              className="btn btn-primary"
              aria-label="Guardar datos de contacto"
              tabIndex={0}
              role="button"
              disabled={!isEditing}
            >
              Guardar
            </button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default EditarDatosContacto;
