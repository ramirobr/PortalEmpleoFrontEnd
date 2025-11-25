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

export default function EditProfile() {
  const schema = z.object({
    nombre: z
      .string()
      .min(3, "El nombre es obligatorio y debe tener al menos 3 caracteres."),
    genero: z.string().min(1, "El género es obligatorio."),
    telefono: z
      .string()
      .min(9, "El teléfono es obligatorio y debe tener al menos 9 dígitos."),
    formacion: z.string().min(1, "La formación es obligatoria."),
    idiomas: z
      .array(z.string())
      .min(1, "Debes seleccionar al menos un idioma."),
    salario: z.string().min(1, "El salario es obligatorio."),
    mostrar: z.string().min(1, "Este campo es obligatorio."),
    puesto: z.string().min(1, "El puesto es obligatorio."),
    nacimiento: z.string().min(1, "La fecha de nacimiento es obligatoria."),
    edad: z.string().min(1, "La edad es obligatoria."),
    email: z.string().email("El correo electrónico debe ser válido."),
    experiencia: z.string().min(1, "Este campo es obligatorio."),
    descripcion: z
      .string()
      .min(10, "La descripción debe tener al menos 10 caracteres."),
    imagen: z.any().optional(),
  });

  const form = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <section className="bg-white rounded-lg shadow p-8 mt-10">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">Editar Perfil</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(() => {})}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="col-span-2 flex flex-col items-center gap-2 mb-8">
            <img
              src="/profile.jpg"
              alt="Foto de perfil"
              className="w-24 h-24 rounded-full object-cover mb-2"
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
                    <input
                      id="imagen"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      aria-label="Buscar foto de perfil"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <label
                    htmlFor="imagen"
                    className="btn btn-primary"
                    aria-label="Buscar foto de perfil"
                  >
                    Buscar
                  </label>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-10">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="nombre">Nombre completo</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      id="nombre"
                      className=""
                      aria-label="Nombre completo"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="genero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="genero">Género</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      id="genero"
                      className=""
                      aria-label="Género"
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="Hombre">Hombre</option>
                      <option value="Mujer">Mujer</option>
                    </select>
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
                      className=""
                      aria-label="Teléfono"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="formacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="formacion">Formación</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      id="formacion"
                      className=""
                      aria-label="Formación"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="idiomas"
              render={({ field }) => {
                const options = [
                  "Inglés",
                  "Español",
                  "Chino",
                  "Alemán",
                  "Francés",
                ];
                const selected = field.value || [];
                return (
                  <FormItem>
                    <FormLabel htmlFor="idiomas">Idiomas</FormLabel>
                    <FormControl>
                      <div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {selected.map((idioma) => (
                            <span
                              key={idioma}
                              className="inline-flex items-center px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm"
                            >
                              {idioma}
                              <button
                                type="button"
                                className="ml-2 text-green-700 hover:text-red-600 focus:outline-none"
                                aria-label={`Quitar ${idioma}`}
                                onClick={() =>
                                  field.onChange(
                                    selected.filter((i) => i !== idioma)
                                  )
                                }
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <select
                          id="idiomas"
                          className="w-full"
                          aria-label="Idiomas"
                          value=""
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value && !selected.includes(value)) {
                              field.onChange([...selected, value]);
                            }
                          }}
                        >
                          <option value="">Agregar idioma...</option>
                          {options
                            .filter((opt) => !selected.includes(opt))
                            .map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                        </select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="mostrar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="mostrar">Mostrar mi perfil</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      id="mostrar"
                      className=""
                      aria-label="Mostrar mi perfil"
                    >
                      <option value="Mostrar">Mostrar</option>
                      <option value="Ocultar">Ocultar</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* ...existing fields... */}
          </div>
          <div className="flex flex-col gap-10">
            <FormField
              control={form.control}
              name="nacimiento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="nacimiento">
                    Fecha de nacimiento
                  </FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      id="nacimiento"
                      type="date"
                      className=""
                      aria-label="Fecha de nacimiento"
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="edad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="edad">Edad</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      id="edad"
                      className=""
                      aria-label="Edad"
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
                  <FormLabel htmlFor="email">Correo electrónico</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      id="email"
                      className=""
                      aria-label="Correo electrónico"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="experiencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="experiencia">
                    Tiempo de experiencia
                  </FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      id="experiencia"
                      className=""
                      aria-label="Tiempo de experiencia"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="salario">Salario ($)</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      id="salario"
                      className=""
                      aria-label="Salario"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="puesto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="puesto">Puesto</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      id="puesto"
                      className=""
                      aria-label="Puesto"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2 mt-8">
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="descripcion">Descripción</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      id="descripcion"
                      className=" w-full h-24"
                      aria-label="Descripción"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2 mt-4 flex gap-4 items-center">
            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
          </div>
        </form>
      </Form>
    </section>
  );
}
