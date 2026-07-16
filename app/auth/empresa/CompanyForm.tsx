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
import { SearchAutocomplete } from "@/components/ui/search-autocomplete";
import MapPicker from "@/components/ui/map-picker";
import { CompanySignUp } from "@/lib/auth/signup";
import { addSpaces } from "@/lib/utils";
import { FormFieldsResponse } from "@/types/company";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Building2, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const schema = z
  .object({
    nombreEmpresa: z.string().min(1, "Nombre de la empresa requerido"),
    razonSocial: z.string().min(1, "Razón social requerida"),
    idCondicionFiscal: z.number().min(1, "Selecciona un tipo de contribuyente"),
    documento: z
      .string()
      .min(1, "Documento requerido")
      .regex(/^\d+$/, "Documento solo debe contener números"),
    idCiudad: z.number().min(1, "Selecciona una ciudad"),
    calle: z.string().min(1, "Calle requerida"),
    numeroCasa: z.string().min(1, "Nomenclatura requerida"),
    codigoPostal: z
      .string()
      .min(1, "Código postal requerido")
      .regex(/^\d+$/, "Código postal solo debe contener números"),
    telefono: z.string().min(1, "Ingresa un teléfono válido"),
    idIndustria: z.number().min(1, "Selecciona una industria"),
    idCantidadEmpleados: z.number().min(1, "Selecciona cantidad de empleados"),
    sitioWeb: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val ||
          /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+([/?#]\S*)?$/.test(
            val
          ),
        { message: "Ingresa una URL válida (ej: www.miweb.com)" }
      ),
    nombres: z.string().min(1, "Nombre requerido"),
    apellidos: z.string().min(1, "Apellido requerido"),
    idGenero: z.number().optional(),
    email: z.email("Email inválido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener mínimo 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
        "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&#). No se permiten espacios."
      ),
    repeatPassword: z
      .string()
      .min(8, "La contraseña debe tener mínimo 8 caracteres"),
    aceptaTerminoCondiciones: z
      .boolean()
      .refine((v) => v === true, "Debes aceptar los términos"),
    quieroRecibirNewsLetter: z.boolean(),
    quieroParticiparEncuestas: z.boolean(),
    latitud: z.number().optional(),
    longitud: z.number().optional(),
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
  const { push } = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const passwordTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const repeatPasswordTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePasswordToggle = (field: "password" | "repeat") => {
    if (field === "password") {
      setShowPassword(true);
      if (passwordTimeoutRef.current) clearTimeout(passwordTimeoutRef.current);
      passwordTimeoutRef.current = setTimeout(() => setShowPassword(false), 2000);
    } else {
      setShowRepeatPassword(true);
      if (repeatPasswordTimeoutRef.current) clearTimeout(repeatPasswordTimeoutRef.current);
      repeatPasswordTimeoutRef.current = setTimeout(() => setShowRepeatPassword(false), 2000);
    }
  };
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
      latitud: undefined,
      longitud: undefined,
    },
    mode: "onBlur",
  });

  async function onSubmit(formData: FormValues) {
    const registerRes = await CompanySignUp({
      ...formData,
      sitioWeb: formData.sitioWeb || "",
    });

    if (registerRes?.isSuccess) {
      form.reset();
      toast.success(registerRes.messages?.[0] ?? "Empresa registrada. Revisa tu correo para activarla.");
      push("/auth/login");
    } else {
      toast.error(registerRes?.messages.join("\n"));
    }
  }

  return (
    <Card className="w-full max-w-2xl px-6 mt-4">
      <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center text-primary m-auto">
        <Building2 />
      </div>
      <div className="text-center mb-5">
        <h2 className="text-black text-2xl font-semibold ">Registra tu empresa</h2>
        <p className="mt-2">Encuentra el mejor talento para tu equipo</p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
          autoComplete="off"
        >
          <fieldset className="border-0 p-0">
            <legend className="sr-only">Datos de la empresa</legend>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 gap-y-8">
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
                      Tipo de Contribuyente{" "}
                      <span className="text-red-500">*</span>
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
                          {fields?.condicion_fiscal?.map((condicion) => (
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
                      <SearchAutocomplete<number>
                        options={
                          fields?.ciudad?.map((c) => ({
                            id: c.idCatalogo,
                            label: c.nombre,
                          })) ?? []
                        }
                        value={field.value || undefined}
                        onChange={(id) => form.setValue("idCiudad", id)}
                        placeholder="Seleccione una ciudad"
                      />
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
                      Nomenclatura <span className="text-red-500">*</span>
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

              <FormItem className="lg:col-span-2">
                <FormLabel>
                  Ubicación en el mapa{" "}
                  <span className="text-slate-400 font-normal">(opcional)</span>
                </FormLabel>
                <FormControl>
                  <MapPicker
                    value={
                      form.watch("latitud") != null && form.watch("longitud") != null
                        ? { lat: form.watch("latitud")!, lng: form.watch("longitud")! }
                        : null
                    }
                    onChange={(coords) => {
                      form.setValue("latitud", coords.lat);
                      form.setValue("longitud", coords.lng);
                    }}
                  />
                </FormControl>
                {(form.watch("latitud") != null) && (
                  <p className="text-xs text-slate-500 mt-1">
                    Lat: {form.watch("latitud")?.toFixed(6)}, Lng: {form.watch("longitud")?.toFixed(6)}
                  </p>
                )}
              </FormItem>

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
                    <span className="text-xs text-slate-500 ml-2">
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
                      <SearchAutocomplete<number>
                        options={
                          fields?.industria?.map((i) => ({
                            id: i.idCatalogo,
                            label: i.nombre,
                          })) ?? []
                        }
                        value={field.value || undefined}
                        onChange={(id) => form.setValue("idIndustria", id)}
                        placeholder="Seleccione una industria"
                      />
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
                          {fields?.cantidad_empleados?.map((cantidad) => (
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
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-zinc-200" />
              <span className="text-sm font-semibold text-slate-600 whitespace-nowrap">
                Datos de contacto del responsable del registro
              </span>
              <div className="h-px flex-1 bg-zinc-200" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 gap-y-8">
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
                      Genero <span className="text-red-500">*</span>
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
                    <span className="text-xs text-slate-500">
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
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          className="pr-10"
                          {...field}
                          minLength={7}
                        />
                        <button
                          type="button"
                          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-slate-400 cursor-pointer"
                          onMouseDown={() => setShowPassword(true)}
                          onMouseUp={() => setShowPassword(false)}
                          onMouseLeave={() => setShowPassword(false)}
                          onClick={() => handlePasswordToggle("password")}
                        >
                          <Eye aria-hidden="true" />
                        </button>
                      </div>
                    </FormControl>
                    <span className="text-xs text-slate-500 block mt-1">
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
                      <div className="relative">
                        <Input
                          id="repeat-password"
                          type={showRepeatPassword ? "text" : "password"}
                          className="pr-10"
                          {...field}
                          minLength={7}
                        />
                        <button
                          type="button"
                          aria-label={showRepeatPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-slate-400 cursor-pointer"
                          onMouseDown={() => setShowRepeatPassword(true)}
                          onMouseUp={() => setShowRepeatPassword(false)}
                          onMouseLeave={() => setShowRepeatPassword(false)}
                          onClick={() => handlePasswordToggle("repeat")}
                        >
                          <Eye aria-hidden="true" />
                        </button>
                      </div>
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
                      href="/terminos"
                      className="text-primary font-semibold underline"
                    >
                      Términos y Condiciones
                    </Link>
                    ,{" "}
                    <Link
                      href="/privacidad"
                      className="text-primary font-semibold underline"
                    >
                      Política de Privacidad
                    </Link>
                    ,{" "}
                    <Link
                      href="/contrato"
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
                      href="/ayuda"
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

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="btn btn-primary text-lg"
          >
            {form.formState.isSubmitting && (
              <span className="animate-spin size-4 border-2 border-t-transparent rounded-full" />
            )}
            Crear cuenta empresa
            <ArrowRight />
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
