"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Mail } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import Footer from "../../../components/shared/components/Footer";
import Navbar from "../../../components/shared/components/Navbar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SignUp } from "@/lib/auth/signup";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SignIn } from "@/lib/auth/signin";

const signupSchema = z
  .object({
    nombres: z.string().min(1, "Nombre requerido"),
    apellidos: z.string().min(1, "Apellido requerido"),
    tipoDocumento: z.string().min(1, "Selecciona un tipo de documento"),
    documento: z.string().min(1, "Ingresa un número"),
    telefono: z.string().min(1, "Ingresa un teléfono válido"),
    fechaNacimiento: z.date({
      error: "Selecciona una fecha",
    }),
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
  });

type FormValues = z.infer<typeof signupSchema>;

export default function EmailSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      nombres: "",
      apellidos: "",
      tipoDocumento: "",
      documento: "",
      telefono: "",
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
    const { fechaNacimiento, ...data } = formData;
    const signUpData = {
      telefonoMobil: "",
      fechaNacimiento: fechaNacimiento.toISOString(),
      ...data,
    };
    const registerRes = await SignUp(signUpData);

    if (registerRes.isSuccess) {
      const res = await SignIn(data.email, data.password);
      if (res?.error) {
        toast.error("Credenciales inválidas");
        return null;
      }
      form.reset();
      router.push("/");
    } else {
      const hasError = Object.keys(registerRes.messages).length;
      if (hasError) {
        toast.error(registerRes.messages[0]);
        console.warn("Errores:", registerRes.messages);
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar showCompanyRegister hideMainMenu />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <h2 className="section-title">
          Crea tu cuenta y encuentra tu empleo ideal
        </h2>

        <Card className="w-full max-w-2xl">
          <CardContent className="p-6 flex flex-col gap-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      name="tipoDocumento"
                      render={({ field }) => (
                        <FormItem className="w-full md:w-1/2">
                          <FormLabel>Tipo de documento *</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Cedula">Cédula</SelectItem>
                                <SelectItem value="pasaporte">
                                  Pasaporte
                                </SelectItem>
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
                          <FormLabel>Número *</FormLabel>
                          <FormControl>
                            <Input placeholder="Número" {...field} />
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
                          <FormLabel>Teléfono celular *</FormLabel>
                          <FormControl>
                            <PhoneInput
                              defaultCountry="EC"
                              value={field.value}
                              onChange={field.onChange}
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
                  </div>

                  <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-4">
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
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
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
                            Acepto recibir novedades, promociones y
                            actualizaciones.
                          </span>
                        </label>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full mt-2"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting && (
                    <span className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full" />
                  )}
                  Crear cuenta
                </Button>
              </form>
            </Form>

            <div className="text-center mt-4 text-sm">
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
      </main>
      <Footer />
    </div>
  );
}
