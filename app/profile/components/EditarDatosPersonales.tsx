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
import TituloSubrayado from "@/components/shared/tituloSubrayado";

import paises from "@/lib/paises.json";

const estadoCivilOptions = [
  "Soltero/a",
  "Casado/a",
  "Divorciado/a",
  "Pareja de Hecho",
  "Viudo/a",
  "Unión Libre",
];
const tipoDocumentoOptions = ["Cedula", "Pasaporte"];
const generoOptions = ["Masculino", "Femenino", "Otro"];
const licenciaOptions = ["A", "A1", "B", "C", "D", "E", "E1", "F", "G"];

function validarCedulaEcuatoriana(value: string) {
  if (!/^[0-9]{10}$/.test(value)) return false;
  // Validación básica de cédula ecuatoriana
  const province = parseInt(value.substring(0, 2), 10);
  if (province < 1 || province > 24) return false;
  const thirdDigit = parseInt(value[2], 10);
  if (thirdDigit > 6) return false;
  let total = 0;
  for (let i = 0; i < 9; i++) {
    let num = parseInt(value[i], 10);
    if (i % 2 === 0) {
      num *= 2;
      if (num > 9) num -= 9;
    }
    total += num;
  }
  let checkDigit = total % 10 ? 10 - (total % 10) : 0;
  return checkDigit === parseInt(value[9], 10);
}

const schema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre es obligatorio y debe tener al menos 3 caracteres.")
    .default("Juan"),
  apellido: z
    .string()
    .min(3, "El apellido es obligatorio y debe tener al menos 3 caracteres.")
    .default("Anaya"),
  nacionalidad: z
    .string()
    .min(1, "La nacionalidad es obligatoria.")
    .default("Ecuatoriana"),
  nacimiento: z
    .string()
    .min(1, "La fecha de nacimiento es obligatoria.")
    .default("1982-12-16"),
  estadoCivil: z
    .string()
    .min(1, "El estado civil es obligatorio.")
    .default("Soltero/a"),
  tipoDocumento: z
    .string()
    .min(1, "El tipo de documento es obligatorio.")
    .default("Cedula"),
  cedula: z
    .string()
    .min(10, "La cédula debe tener 10 dígitos.")
    .max(10, "La cédula debe tener 10 dígitos.")
    .refine(validarCedulaEcuatoriana, {
      message: "Cédula ecuatoriana inválida.",
    }),
  genero: z.string().min(1, "El género es obligatorio.").default("Masculino"),
  movilidad: z.boolean().default(false),
  licencia: z.boolean().default(false),
  tipoLicencia: z.array(z.string()).optional(),
});

export default function EditarDatosPersonales() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: "Juan",
      apellido: "Anaya",
      nacionalidad: "Ecuatoriana",
      nacimiento: "1982-12-16",
      estadoCivil: "Soltero/a",
      tipoDocumento: "Cedula",
      cedula: "",
      genero: "Masculino",
      movilidad: false,
      licencia: false,
      tipoLicencia: [],
    },
  });

  const licenciaChecked = form.watch("licencia");

  return (
    <section className="bg-white rounded-lg shadow p-8 mt-10">
      <TituloSubrayado>Datos Personales</TituloSubrayado>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            /* handle submit */
          })}
          className="grid grid-cols-1 gap-6"
          aria-label="Formulario de datos personales"
        >
          {/* Fila 1: Nombre / Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="nombre">Nombre</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      id="nombre"
                      aria-label="Nombre"
                      autoComplete="given-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apellido"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="apellido">Apellido</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      id="apellido"
                      aria-label="Apellido"
                      autoComplete="family-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Fila 2: Fecha de Nacimiento / Nacionalidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
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
                      aria-label="Fecha de nacimiento"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nacionalidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="nacionalidad">Nacionalidad</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      id="nacionalidad"
                      aria-label="Nacionalidad"
                    >
                      {paises.map((pais) => (
                        <option key={pais} value={pais}>
                          {pais}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Fila 3: Estado Civil / Género */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <FormField
              control={form.control}
              name="estadoCivil"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="estadoCivil">Estado Civil</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      id="estadoCivil"
                      aria-label="Estado Civil"
                    >
                      {estadoCivilOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
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
                    <select {...field} id="genero" aria-label="Género">
                      {generoOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Fila 4: Tipo de Documento / Número de Cédula */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <FormField
              control={form.control}
              name="tipoDocumento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="tipoDocumento">
                    Tipo de Documento
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      id="tipoDocumento"
                      aria-label="Tipo de Documento"
                    >
                      {tipoDocumentoOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cedula"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="cedula">Número de Cédula</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      id="cedula"
                      aria-label="Número de Cédula"
                      maxLength={10}
                      minLength={10}
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Fila 5: Movilidad Propia / Licencia de conducir */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <FormField
              control={form.control}
              name="movilidad"
              render={({ field }) => (
                <FormItem className="block">
                  <FormLabel htmlFor="movilidad">Movilidad Propia</FormLabel>
                  <FormControl>
                    <input
                      type="checkbox"
                      {...field}
                      id="movilidad"
                      aria-label="Movilidad Propia"
                      checked={field.value}
                      value={undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="licencia"
              render={({ field }) => (
                <FormItem className="block">
                  <FormLabel htmlFor="licencia" className="mr-2">
                    Poseo Licencia de Conducir
                  </FormLabel>
                  <FormControl>
                    <input
                      type="checkbox"
                      {...field}
                      id="licencia"
                      aria-label="Poseo Licencia de Conducir"
                      checked={field.value}
                      value={undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Fila 6: Tipo de Licencia (100%) */}
          {licenciaChecked && (
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="tipoLicencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Licencia</FormLabel>
                    <FormControl>
                      <div
                        role="group"
                        aria-label="Tipo de Licencia"
                        className="flex flex-row flex-wrap gap-5"
                      >
                        {licenciaOptions.map((opt) => (
                          <label
                            key={opt}
                            className="flex items-center gap-2"
                            htmlFor={`tipoLicencia-${opt}`}
                          >
                            <input
                              type="checkbox"
                              id={`tipoLicencia-${opt}`}
                              value={opt}
                              checked={field.value?.includes(opt) || false}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  field.onChange([...(field.value || []), opt]);
                                } else {
                                  field.onChange(
                                    (field.value || []).filter((v) => v !== opt)
                                  );
                                }
                              }}
                              aria-label={`Licencia tipo ${opt}`}
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          <div className="col-span-2 mt-8 flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              aria-label="Guardar datos personales"
              tabIndex={0}
              role="button"
            >
              Guardar
            </button>
          </div>
        </form>
      </Form>
    </section>
  );
}
