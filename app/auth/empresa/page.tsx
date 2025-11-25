"use client";

import Navbar from "../../../components/shared/components/Navbar";
import Footer from "../../../components/shared/components/Footer";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";

const CONDICIONES_FISCALES = [
  { value: "responsable", label: "Responsable Inscripto" },
  { value: "monotributo", label: "Monotributo" },
  { value: "exento", label: "Exento" },
];

const PROVINCIAS = [
  { value: "azuay", label: "Azuay" },
  { value: "bolivar", label: "Bolívar" },
  { value: "canar", label: "Cañar" },
  { value: "carchi", label: "Carchi" },
  { value: "chimborazo", label: "Chimborazo" },
  { value: "cotopaxi", label: "Cotopaxi" },
  { value: "el-oro", label: "El Oro" },
  { value: "esmeraldas", label: "Esmeraldas" },
  { value: "galapagos", label: "Galápagos" },
  { value: "guayas", label: "Guayas" },
  { value: "imbabura", label: "Imbabura" },
  { value: "loja", label: "Loja" },
  { value: "los-rios", label: "Los Ríos" },
  { value: "manabi", label: "Manabí" },
  { value: "morona-santiago", label: "Morona Santiago" },
  { value: "napo", label: "Napo" },
  { value: "orellana", label: "Orellana" },
  { value: "pastaza", label: "Pastaza" },
  { value: "pichincha", label: "Pichincha" },
  { value: "santa-elena", label: "Santa Elena" },
  { value: "santo-domingo", label: "Santo Domingo" },
  { value: "sucumbios", label: "Sucumbíos" },
  { value: "tungurahua", label: "Tungurahua" },
  { value: "zamora-chinchipe", label: "Zamora Chinchipe" },
];

const INDUSTRIAS = [
  { value: "tecnologia", label: "Tecnología" },
  { value: "salud", label: "Salud" },
  { value: "educacion", label: "Educación" },
  { value: "comercio", label: "Comercio" },
  { value: "servicios", label: "Servicios" },
  { value: "manufactura", label: "Manufactura" },
  { value: "finanzas", label: "Finanzas" },
  { value: "construccion", label: "Construcción" },
  { value: "agropecuaria", label: "Agropecuaria" },
  { value: "otra", label: "Otra" },
];

const EMPLEADOS = [
  { value: "1-10", label: "1-10" },
  { value: "11-50", label: "11-50" },
  { value: "51-200", label: "51-200" },
  { value: "201-500", label: "201-500" },
  { value: "500+", label: "500+" },
];

const schema = z
  .object({
    companyName: z.string().min(1, "Nombre de la empresa requerido"),
    razonSocial: z.string().min(1, "Razón social requerida"),
    condicionFiscal: z.string().min(1, "Selecciona una condición fiscal"),
    documento: z
      .string()
      .min(1, "Documento requerido")
      .regex(/^\d+$/, "Documento solo debe contener números"),
    provincia: z.string().min(1, "Selecciona una provincia"),
    calle: z.string().min(1, "Calle requerida"),
    numero: z
      .string()
      .min(1, "Número requerido")
      .regex(/^\d+$/, "Número solo debe contener números"),
    codigoPostal: z
      .string()
      .min(1, "Código postal requerido")
      .regex(/^\d+$/, "Código postal solo debe contener números"),
    telefono: z
      .string()
      .regex(/^\d{9}$/, "Teléfono debe tener 9 dígitos sin espacios"),
    industria: z.string().min(1, "Selecciona una industria"),
    empleados: z.string().min(1, "Selecciona cantidad de empleados"),
    nombre: z.string().min(1, "Nombre requerido"),
    apellido: z.string().min(1, "Apellido requerido"),
    emailUsuario: z.string().email("Email inválido"),
    password: z.string().min(7, "La contraseña debe tener mínimo 7 caracteres"),
    repeatPassword: z
      .string()
      .min(7, "Repetir contraseña debe tener mínimo 7 caracteres"),
    terms: z.boolean().refine((v) => v === true, "Debes aceptar los términos"),
    newsletter: z.boolean().optional(),
    encuestas: z.boolean().optional(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    path: ["repeatPassword"],
    message: "Las contraseñas no coinciden",
  });

type FormValues = z.infer<typeof schema>;

export default function CompanyRegister() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: "",
      razonSocial: "",
      condicionFiscal: "",
      documento: "",
      provincia: "",
      calle: "",
      numero: "",
      codigoPostal: "",
      telefono: "",
      industria: "",
      empleados: "",
      nombre: "",
      apellido: "",
      emailUsuario: "",
      password: "",
      repeatPassword: "",
      terms: false,
      newsletter: false,
      encuestas: false,
    },
    mode: "onBlur",
  });

  async function onSubmit(values: FormValues) {
    console.log("submit", values);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar
        showCompanyRegister={false}
        hideMainMenu={true}
        showBuscarEmpleos={true}
      />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-primary mb-4">
          Registra tu empresa
        </h1>
        <p className="text-xs text-gray-600 mb-2">
          Todos los campos con <span className="text-red-500">*</span> son
          obligatorios.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-3xl bg-white rounded-lg p-6 flex flex-col gap-6 shadow-md"
            autoComplete="off"
          >
            <fieldset className="border-0 p-0">
              <legend className="sr-only">Datos de la empresa</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="company-name">
                        Nombre de la empresa{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input id="company-name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="razonSocial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="razon-social">
                        Razón social <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input id="razon-social" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="condicionFiscal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="condicion-fiscal">
                        Condición fiscal <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(v) =>
                            form.setValue("condicionFiscal", v)
                          }
                          defaultValue={field.value}
                        >
                          <SelectTrigger id="condicion-fiscal">
                            <SelectValue placeholder="Seleccione una opción" />
                          </SelectTrigger>
                          <SelectContent>
                            {CONDICIONES_FISCALES.map((c) => (
                              <SelectItem key={c.value} value={c.value}>
                                {c.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="documento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="documento">
                        Documento <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="documento"
                          placeholder="Ingresar solo números, sin guiones."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="provincia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="provincia">
                        Provincia <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(v) => form.setValue("provincia", v)}
                          defaultValue={field.value}
                        >
                          <SelectTrigger id="provincia">
                            <SelectValue placeholder="Seleccione una opción" />
                          </SelectTrigger>
                          <SelectContent>
                            {PROVINCIAS.map((p) => (
                              <SelectItem key={p.value} value={p.value}>
                                {p.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="calle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="calle">
                        Calle <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input id="calle" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numero"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="numero">
                        Numero <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input id="numero" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="codigoPostal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="codigo-postal">
                        Codigo Postal <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input id="codigo-postal" {...field} />
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
                      <FormLabel htmlFor="telefono">
                        Teléfono <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <PhoneInput
                          id="telefono"
                          defaultCountry="EC"
                          value={form.watch("telefono")}
                          onChange={(v) => form.setValue("telefono", v)}
                        />
                      </FormControl>
                      <span className="text-xs text-gray-500 ml-2">
                        Ej. 991234567
                      </span>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="industria">
                        Industria <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(v) => form.setValue("industria", v)}
                          defaultValue={field.value}
                        >
                          <SelectTrigger id="industria">
                            <SelectValue placeholder="Seleccione una opción" />
                          </SelectTrigger>
                          <SelectContent>
                            {INDUSTRIAS.map((it) => (
                              <SelectItem key={it.value} value={it.value}>
                                {it.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="empleados"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="empleados">
                        Cantidad de empleados{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(v) => form.setValue("empleados", v)}
                          defaultValue={field.value}
                        >
                          <SelectTrigger id="empleados">
                            <SelectValue placeholder="Seleccione una opción" />
                          </SelectTrigger>
                          <SelectContent>
                            {EMPLEADOS.map((e) => (
                              <SelectItem key={e.value} value={e.value}>
                                {e.label}
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
            </fieldset>

            <fieldset className="border-0 p-0">
              <legend className="sr-only">Información de usuario</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="nombre">
                        Nombre(s) <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input id="nombre" {...field} />
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
                      <FormLabel htmlFor="apellido">
                        Apellido(s) <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input id="apellido" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emailUsuario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email-usuario">
                        Email <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input id="email-usuario" type="email" {...field} />
                      </FormControl>
                      <span className="text-xs text-gray-500">
                        A este mail se van a enviar las facturas de compra.
                      </span>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">
                        Contraseña <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          {...field}
                          minLength={7}
                        />
                      </FormControl>
                      <span className="text-xs text-gray-500 block mt-1">
                        Debe tener 7 dígitos como mínima.
                      </span>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="repeatPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="repeat-password">
                        Repetir contraseña{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="repeat-password"
                          type="password"
                          {...field}
                          minLength={7}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </fieldset>

            <div className="flex flex-col gap-2 mt-2">
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(v) =>
                          form.setValue("terms", v === true)
                        }
                      />
                    </FormControl>
                    <div className="text-sm">
                      Acepto los{" "}
                      <Link
                        href="/terms"
                        className="text-primary font-semibold underline"
                      >
                        Términos y Condiciones
                      </Link>
                      ,{" "}
                      <Link
                        href="/privacy"
                        className="text-primary font-semibold underline"
                      >
                        Política de Privacidad
                      </Link>
                      ,{" "}
                      <Link
                        href="/contract"
                        className="text-primary font-semibold underline"
                      >
                        Condiciones de contratación
                      </Link>
                      ,{" "}
                      <Link
                        href="/cookies"
                        className="text-primary font-semibold underline"
                      >
                        Política de Cookies
                      </Link>
                      ,{" "}
                      <Link
                        href="/help"
                        className="text-primary font-semibold underline"
                      >
                        Solicitud de Ayuda
                      </Link>
                      .<span className="text-red-500">*</span>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newsletter"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(v) =>
                          form.setValue("newsletter", v === true)
                        }
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Quiero recibir newsletters con novedades, promociones y
                      actualizaciones.
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="encuestas"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(v) =>
                          form.setValue("encuestas", v === true)
                        }
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Quiero participar en encuestas y pruebas piloto para
                      ayudar a mejorar la plataforma.
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-4"
              disabled={form.formState.isSubmitting}
            >
              Crear cuenta empresa
            </Button>

            <div className="text-center mt-4 text-sm">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/auth/login"
                className="text-primary font-semibold underline"
              >
                Ingresa a tu cuenta empresa
              </Link>
            </div>
          </form>
        </Form>
      </main>
      <Footer />
    </div>
  );
}
