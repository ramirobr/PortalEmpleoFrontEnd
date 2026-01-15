"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SignIn } from "@/lib/auth/signin";
import { CompanySignUp } from "@/lib/auth/signup";
import { addSpaces } from "@/lib/utils";
import { FormFieldsResponse } from "@/types/company";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const schema = z
  .object({
    nombreEmpresa: z.string().min(1, "Nombre de la empresa requerido"),
    razonSocial: z.string().min(1, "Razón social requerida"),
    idCondicionFiscal: z.number().min(1, "Selecciona una condición fiscal"),
    documento: z
      .string()
      .min(1, "Documento requerido")
      .regex(/^\d+$/, "Documento solo debe contener números"),
    idCiudad: z.number().min(1, "Selecciona una ciudad"),
    calle: z.string().min(1, "Calle requerida"),
    numeroCasa: z.string().min(1, "Número Casa requerido"),
    codigoPostal: z
      .string()
      .min(1, "Código postal requerido")
      .regex(/^\d+$/, "Código postal solo debe contener números"),
    telefono: z.string().min(1, "Ingresa un teléfono válido"),
    idIndustria: z.number().min(1, "Selecciona una industria"),
    idCantidadEmpleados: z.number().min(1, "Selecciona cantidad de empleados"),
    sitioWeb: z.url("Ingresa una URL válida").optional().or(z.literal("")),
    nombres: z.string().min(1, "Nombre requerido"),
    apellidos: z.string().min(1, "Apellido requerido"),
    idGenero: z.number().optional(),
    email: z.email("Email inválido"),
    password: z.string().min(7, "La contraseña debe tener mínimo 7 caracteres"),
    repeatPassword: z
      .string()
      .min(7, "La contraseña debe tener mínimo 7 caracteres"),
    aceptaTerminoCondiciones: z
      .boolean()
      .refine((v) => v === true, "Debes aceptar los términos"),
    quieroRecibirNewsLetter: z.boolean(),
    quieroParticiparEncuestas: z.boolean(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    path: ["repeatPassword"],
    message: "Las contraseñas no coinciden",
  });

type FormValues = z.infer<typeof schema>;

type CompanyFormProps = {
  fields: FormFieldsResponse | null;
};

export default function CompanyForm({ fields }: CompanyFormProps) {
  const router = useRouter();
  const { update } = useSession();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombreEmpresa: "",
      razonSocial: "",
      idCondicionFiscal: 0,
      documento: "",
      idCiudad: 0,
      calle: "",
      numeroCasa: "",
      codigoPostal: "",
      telefono: "",
      idIndustria: 0,
      idCantidadEmpleados: 0,
      sitioWeb: "",
      nombres: "",
      apellidos: "",
      idGenero: 0,
      email: "",
      password: "",
      repeatPassword: "",
      aceptaTerminoCondiciones: true,
      quieroRecibirNewsLetter: true,
      quieroParticiparEncuestas: true,
    },
    mode: "onBlur",
  });

  async function onSubmit(formData: FormValues) {
    const registerRes = await CompanySignUp({
      ...formData,
      sitioWeb: formData.sitioWeb || "",
    });

    if (registerRes?.isSuccess) {
      const res = await SignIn(formData.email, formData.password);
      if (res?.error) {
        toast.error("Credenciales inválidas");
        return;
      }
      form.reset();
      await update();
      router.push("/");
    } else {
      toast.error(registerRes?.messages.join("\n"));
    }
  }

  return (
    <Card className="w-full max-w-2xl px-6 mt-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
          autoComplete="off"
        >
          <fieldset className="border-0 p-0">
            <legend className="sr-only">Datos de la empresa</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombreEmpresa"
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
                name="idCondicionFiscal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="condicion-fiscal">
                      Condición fiscal <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(v) =>
                          form.setValue("idCondicionFiscal", parseInt(v))
                        }
                        defaultValue={field.value?.toString()}
                      >
                        <SelectTrigger id="condicion-fiscal">
                          <SelectValue placeholder="Seleccione una opción" />
                        </SelectTrigger>
                        <SelectContent>
                          {fields?.condicionFiscal?.map((condicion) => (
                            <SelectItem
                              key={condicion.idCatalogo}
                              value={condicion.idCatalogo.toString()}
                            >
                              {condicion.nombre}
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
                name="idCiudad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="ciudad">
                      Ciudad <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(v) =>
                          form.setValue("idCiudad", parseInt(v))
                        }
                        defaultValue={field.value?.toString()}
                      >
                        <SelectTrigger id="ciudad">
                          <SelectValue placeholder="Seleccione una opción" />
                        </SelectTrigger>
                        <SelectContent>
                          {fields?.ciudad?.map((ciudad) => (
                            <SelectItem
                              key={ciudad.idCatalogo}
                              value={ciudad.idCatalogo.toString()}
                            >
                              {ciudad.nombre}
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
                name="numeroCasa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="numeroCasa">
                      Numero Casa <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input id="numeroCasa" {...field} />
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
                      <Input
                        type="text"
                        id="telefono"
                        inputMode="tel"
                        placeholder="2375293123"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(e.target.value.replace(/\D/g, ""))
                        }
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
                name="idIndustria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="industria">
                      Industria <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(v) =>
                          form.setValue("idIndustria", parseInt(v))
                        }
                        defaultValue={field.value?.toString()}
                      >
                        <SelectTrigger id="industria">
                          <SelectValue placeholder="Seleccione una opción" />
                        </SelectTrigger>
                        <SelectContent>
                          {fields?.industria?.map((industria) => (
                            <SelectItem
                              key={industria.idCatalogo}
                              value={industria.idCatalogo.toString()}
                            >
                              {industria.nombre}
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
                name="idCantidadEmpleados"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="empleados">
                      Cantidad de empleados{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(v) =>
                          form.setValue("idCantidadEmpleados", parseInt(v))
                        }
                        defaultValue={field.value?.toString()}
                      >
                        <SelectTrigger id="empleados">
                          <SelectValue placeholder="Seleccione una opción" />
                        </SelectTrigger>
                        <SelectContent>
                          {fields?.cantidadEmpleados?.map((cantidad) => (
                            <SelectItem
                              key={cantidad.idCatalogo}
                              value={cantidad.idCatalogo.toString()}
                            >
                              {addSpaces(cantidad.nombre)}
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
                name="sitioWeb"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="sitioWeb">Sitio Web</FormLabel>
                    <FormControl>
                      <Input
                        id="sitioWeb"
                        placeholder="https://www.ejemplo.com"
                        {...field}
                      />
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
                name="nombres"
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
                name="apellidos"
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
                name="idGenero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="idGenero">
                      Genero{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(v) =>
                          form.setValue("idGenero", parseInt(v))
                        }
                        defaultValue={field.value?.toString()}
                      >
                        <SelectTrigger id="idgenero">
                          <SelectValue placeholder="Seleccione una opción" />
                        </SelectTrigger>
                        <SelectContent>
                          {fields?.genero?.map((genero) => (
                            <SelectItem
                              key={genero.idCatalogo}
                              value={genero.idCatalogo.toString()}
                            >
                              {addSpaces(genero.nombre)}
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
                name="email"
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
                      Repetir contraseña <span className="text-red-500">*</span>
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
              name="aceptaTerminoCondiciones"
              render={({ field }) => (
                <FormItem className="flex items-start gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(v) =>
                        form.setValue("aceptaTerminoCondiciones", v === true)
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
              name="quieroRecibirNewsLetter"
              render={({ field }) => (
                <FormItem className="flex items-start gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(v) =>
                        form.setValue("quieroRecibirNewsLetter", v === true)
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
              name="quieroParticiparEncuestas"
              render={({ field }) => (
                <FormItem className="flex items-start gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(v) =>
                        form.setValue("quieroParticiparEncuestas", v === true)
                      }
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    Quiero participar en encuestas y pruebas piloto para ayudar
                    a mejorar la plataforma.
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <span className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full" />
            )}
            Crear cuenta empresa
          </Button>

          <div className="text-center text-sm">
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
    </Card>
  );
}
