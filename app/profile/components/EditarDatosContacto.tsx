"use client";
import TituloSubrayado from "@/components/shared/tituloSubrayado";
import Loader from "@/components/shared/components/Loader";
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
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Pencil from "@/components/shared/components/iconos/Pencil";
import Trash from "@/components/shared/components/iconos/Trash";
import { DatosContacto } from "@/types/profile";

const schema = z.object({
  celular: z.string().min(1, "El celular debe tener al menos 10 dígitos."),
  telefono: z
    .string()
    .min(7, "El celular debe tener al menos 10 dígitos.")
    .max(14, "El celular no debe exceder 14 caracteres."),
  email: z.email("El email no es válido.").min(1, "El email es obligatorio."),
  direccion: z.string().min(1, "La dirección es obligatoria."),
});

type EditarDatosContactoProps = {
  datosContacto: DatosContacto;
};

export default function EditarDatosContacto({
  datosContacto,
}: EditarDatosContactoProps) {
  const [loading, setLoading] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    // Simulating data fetching
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      //TODO: Include proper country code or just remove
      celular: `+593${datosContacto.phoneNumber}`,
      telefono: "",
      email: datosContacto.email,
      direccion: datosContacto.address,
    },
  });

  const handleSubmit = (data: z.infer<typeof schema>) => {
    console.log({ data });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset();
  };

  if (loading) {
    return <Loader className="py-8" />;
  }

  return (
    <Card className="px-6">
      <div className="flex justify-between items-center mb-10">
        <TituloSubrayado className="mb-0">Datos de Contacto</TituloSubrayado>
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="cursor-pointer"
            aria-label="Editar datos de contacto"
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
          className=""
          aria-label="Formulario de datos de contacto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <FormField
              control={form.control}
              name="celular"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="celular">Celular</FormLabel>
                  <FormControl>
                    <PhoneInput
                      defaultCountry="EC"
                      placeholder="2375293123"
                      value={field.value}
                      onChange={field.onChange}
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
                    <Input
                      type="text"
                      id="telefono"
                      inputMode="tel"
                      placeholder="+593 2375293"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/\D/g, ""))
                      }
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Email"
                      disabled={!isEditing}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="direccion">Dirección</FormLabel>
                  <FormControl>
                    <Input
                      id="direccion"
                      type="email"
                      autoComplete="street-address"
                      placeholder="Av. Siempre Viva 123"
                      disabled={!isEditing}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {isEditing && (
            <div className="col-span-2 mt-8 flex justify-end">
              <Button
                type="submit"
                aria-label="Guardar datos de contacto"
                disabled={!form.formState.isDirty}
              >
                Guardar
              </Button>
            </div>
          )}
        </form>
      </Form>
    </Card>
  );
}
