"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
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
import { SignUp } from "@/lib/auth/signup";
import { validarCedulaEcuatoriana } from "@/lib/utils";
import { SignUpFieldsResponse } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, UserRoundPlus, Mail, ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const signupSchema = z
  .object({
    nombres: z.string().min(1, "Nombre requerido"),
    apellidos: z.string().min(1, "Apellido requerido"),
    idTipoDocumento: z.number().min(1, "Selecciona un tipo de documento"),
    documento: z.string().min(1, "Ingresa la cédula"),
    idGenero: z.number().min(1, "Selecciona un género"),
    telefono: z.string().min(1, "Ingresa un teléfono válido"),
    telefonoMobil: z
      .string()
      .min(7, "El celular debe tener al menos 10 dígitos.")
      .max(14, "El celular no debe exceder 14 caracteres."),
    fechaNacimiento: z.date("Selecciona una fecha"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Repite la contraseña"),
    email: z.email("Email inválido"),
    aceptaCondicionesUso: z
      .boolean()
      .refine((v) => v === true, "Debes aceptar las condiciones"),
    aceptaPoliticaPrivacidad: z
      .boolean()
      .refine((v) => v === true, "Debes aceptar la política"),
    aceptaNotificaciones: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
  .superRefine((data, ctx) => {
    const CEDULA = 3580;
    if (data.idTipoDocumento === CEDULA) {
      if (!validarCedulaEcuatoriana(data.documento)) {
        ctx.addIssue({
          path: ["documento"],
          message: "Cédula inválida.",
          code: "custom",
        });
      }
    }
  });

type FormValues = z.infer<typeof signupSchema>;

type CompanyFormProps = {
  fields: SignUpFieldsResponse | null;
};

export default function EmailSignup({ fields }: CompanyFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const { update } = useSession();
  const form = useForm<FormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      nombres: "",
      apellidos: "",
      idTipoDocumento: 0,
      idGenero: 0,
      documento: "",
      telefono: "",
      telefonoMobil: "",
      password: "",
      confirmPassword: "",
      email: "",
      fechaNacimiento: undefined,
      aceptaCondicionesUso: false,
      aceptaPoliticaPrivacidad: false,
      aceptaNotificaciones: false,
    },
  });

  const handleMouseDown = () => setShowPassword(true);
  const handleMouseUp = () => setShowPassword(false);
  const handleClick = () => {
    setShowPassword(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowPassword(false), 2000);
  };

  async function onSubmit(formData: FormValues) {
    const { fechaNacimiento, confirmPassword: _, ...data } = formData;
    const signUpData = {
      fechaNacimiento: fechaNacimiento.toISOString(),
      ...data,
    };
    const registerRes = await SignUp(signUpData);

    if (registerRes?.isSuccess) {
      const res = await SignIn(data.email, data.password);
      if (res?.error) {
        toast.error("Credenciales inválidas");
        return;
      }
      form.reset();
      await update();
      router.push("/");
    }
    if (!registerRes) {
      toast.error("Error durante registro");
      return;
    }

    const hasError = Object.keys(registerRes?.messages ?? []).length;
    if (hasError) {
      toast.error(registerRes.messages[0]);
      console.warn("Errores:", registerRes.messages);
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardContent className="px-6 flex flex-col gap-6">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary m-auto">
          <UserRoundPlus />
        </div>
        <div className="text-center mb-5">
          <h2 className="text-black text-2xl font-bold ">Crea tu cuenta</h2>
          <p className="mt-2">Únete a nuestra comunidad de profesionales</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-8">
              <FormField
                control={form.control}
                name="nombres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre(s) *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresa tu nombre" {...field} />
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
                    <FormLabel>Apellido(s) *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresa tu apellido" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="idTipoDocumento"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/2">
                      <FormLabel htmlFor="documento">
                        Tipo de documento *
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value ? String(field.value) : ""}
                        >
                          <SelectTrigger id="documento">
                            <SelectValue placeholder="Tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {fields?.tipo_documento?.map((tipo) => (
                              <SelectItem
                                key={tipo.idCatalogo}
                                value={tipo.idCatalogo.toString()}
                              >
                                {tipo.nombre}
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
                    <FormItem className="w-full md:w-1/2">
                      <FormLabel>Documento *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Documento"
                          maxLength={10}
                          minLength={10}
                          inputMode="numeric"
                          pattern="[0-9]{10}"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/2">
                      <FormLabel htmlFor="telefono">Teléfono *</FormLabel>
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
                  name="telefonoMobil"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/2">
                      <FormLabel htmlFor="telefonoMobil">
                        Teléfono Móvil
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          id="telefonoMobil"
                          inputMode="tel"
                          placeholder="+593 2375293"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(e.target.value.replace(/\D/g, ""))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="fechaNacimiento"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-2 w-full md:w-1/2">
                      <FormLabel>Fecha de nacimiento *</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/2">
                      <FormLabel>Contraseña *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Ingresa tu contraseña"
                            className="pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            aria-label={
                              showPassword
                                ? "Ocultar contraseña"
                                : "Mostrar contraseña"
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onClick={handleClick}
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

              <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-2 w-full md:w-1/2">
                      <FormLabel>Repetir contraseña *</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Repite tu contraseña"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="idGenero"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/2">
                      <FormLabel htmlFor="genero">Género *</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value ? String(field.value) : ""}
                        >
                          <SelectTrigger id="genero">
                            <SelectValue placeholder="Género" />
                          </SelectTrigger>
                          <SelectContent>
                            {fields?.genero?.map((genero) => (
                              <SelectItem
                                key={genero.idCatalogo}
                                value={genero.idCatalogo.toString()}
                              >
                                {genero.nombre}
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
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full col-span-1 md:col-span-2">
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          type="email"
                          placeholder="Ingresa tu email"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="aceptaCondicionesUso"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <span className="text-sm">
                        Acepto las{" "}
                        <Link
                          href="/terms"
                          className="text-primary font-semibold underline"
                        >
                          Condiciones de uso
                        </Link>{" "}
                        *
                      </span>
                    </label>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aceptaPoliticaPrivacidad"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <span className="text-sm">
                        He leído y comprendo la{" "}
                        <Link
                          href="/privacy"
                          className="text-primary font-semibold underline"
                        >
                          Política de protección de datos personales y
                          privacidad
                        </Link>{" "}
                        *
                      </span>
                    </label>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aceptaNotificaciones"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <span className="text-sm">
                        Acepto recibir novedades, promociones y actualizaciones.
                      </span>
                    </label>
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full btn btn-primary text-lg"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <span className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full" />
              )}
              Crear cuenta
              <ArrowRight />
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/auth/login"
            className="text-primary font-semibold underline"
          >
            Ingresa a como candidato
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
