"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/auth/forgot-password";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  Lock,
  ShieldCheck,
  ArrowLeft,
  CheckCircle,
  LockKeyholeOpen,
  UserRoundPlus,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Footer from "@/components/shared/components/Footer";
import Navbar from "@/components/shared/components/Navbar";
import AsideMenu, {
  NavLink,
} from "@/components/shared/components/AsideMenu";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[a-z]/, "Debe contener al menos una minúscula")
      .regex(/[0-9]/, "Debe contener al menos un número")
      .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const confirmTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const authLinks: NavLink[] = [
    {
      name: "Ingresar",
      href: "/auth/login",
      icon: <LockKeyholeOpen />,
    },
    {
      name: "Crear cuenta",
      href: "/auth/email",
      icon: <UserRoundPlus />,
    },
    {
      name: "Regístrate como empresa",
      href: "/auth/empresa",
      icon: <Building2 />,
    },
  ];

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Funciones para mostrar/ocultar contraseña
  const handleMouseDown = (field: "password" | "confirm") => {
    if (field === "password") setShowPassword(true);
    else setShowConfirmPassword(true);
  };

  const handleMouseUp = (field: "password" | "confirm") => {
    if (field === "password") setShowPassword(false);
    else setShowConfirmPassword(false);
  };

  const handleClick = (field: "password" | "confirm") => {
    if (field === "password") {
      setShowPassword(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShowPassword(false), 2000);
    } else {
      setShowConfirmPassword(true);
      if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);
      confirmTimeoutRef.current = setTimeout(
        () => setShowConfirmPassword(false),
        2000
      );
    }
  };

  // Verificar si tenemos los parámetros necesarios
  if (!email || !token) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar
          showCompanyRegister={true}
          onHamburgerClick={toggleMobileMenu}
          isAsideOpen={isMobileMenuOpen}
        />
        <AsideMenu
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
          side="left"
          className="w-1/2 max-w-sm"
          links={authLinks}
        />
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md p-6 flex flex-col gap-6 shadow-md">
            <CardContent className="flex flex-col gap-6 items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                <ShieldCheck className="w-10 h-10" />
              </div>

              <div>
                <h2 className="text-black text-2xl font-bold mb-2">
                  Enlace inválido
                </h2>
                <p className="text-gray-600">
                  El enlace para restablecer tu contraseña es inválido o ha
                  expirado. Por favor, solicita uno nuevo.
                </p>
              </div>

              <Link href="/auth/forgot-password" className="w-full mt-4">
                <Button className="w-full">Solicitar nuevo enlace</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  async function onSubmit({ newPassword, confirmPassword }: ResetPasswordValues) {
    try {
      const res = await resetPassword({
        email: email!,
        token: token!,
        newPassword,
        confirmPassword,
      });

      if (!res || !res.isSuccess) {
        toast.error(
          res?.messages?.[0] ||
            "Error al restablecer la contraseña. Intenta nuevamente."
        );
        return;
      }

      setIsSuccess(true);
      toast.success("¡Contraseña restablecida exitosamente!");

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch {
      toast.error("Ocurrió un error inesperado. Intenta nuevamente.");
    }
  }

  // Pantalla de éxito
  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar
          showCompanyRegister={true}
          onHamburgerClick={toggleMobileMenu}
          isAsideOpen={isMobileMenuOpen}
        />
        <AsideMenu
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
          side="left"
          className="w-1/2 max-w-sm"
          links={authLinks}
        />
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md p-6 flex flex-col gap-6 shadow-md">
            <CardContent className="flex flex-col gap-6 items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h2 className="text-black text-2xl font-bold mb-2">
                  ¡Contraseña actualizada!
                </h2>
                <p className="text-gray-600">
                  Tu contraseña ha sido restablecida exitosamente. Serás
                  redirigido al inicio de sesión en unos segundos.
                </p>
              </div>

              <Link href="/auth/login" className="w-full mt-4">
                <Button className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Ir al inicio de sesión
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar
        showCompanyRegister={true}
        onHamburgerClick={toggleMobileMenu}
        isAsideOpen={isMobileMenuOpen}
      />
      <AsideMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        side="left"
        className="w-1/2 max-w-sm"
        links={authLinks}
      />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md p-6 flex flex-col gap-6 shadow-md">
          <CardContent className="flex flex-col gap-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary m-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div className="text-center mb-2">
              <h2 className="text-black text-2xl font-bold">
                Crea una nueva contraseña
              </h2>
              <p className="mt-2 text-gray-600">
                Ingresa tu nueva contraseña para la cuenta asociada a{" "}
                <span className="font-semibold text-primary">{email}</span>
              </p>
            </div>

            {/* Requisitos de contraseña */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <p className="font-semibold mb-2">Tu contraseña debe tener:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Al menos 8 caracteres</li>
                <li>Una letra mayúscula</li>
                <li>Una letra minúscula</li>
                <li>Un número</li>
                <li>Un carácter especial (!@#$%^&*)</li>
              </ul>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nueva contraseña *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Ingresa tu nueva contraseña"
                            className="pl-10 pr-10"
                          />
                          <button
                            type="button"
                            aria-label={
                              showPassword
                                ? "Ocultar contraseña"
                                : "Mostrar contraseña"
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                            onMouseDown={() => handleMouseDown("password")}
                            onMouseUp={() => handleMouseUp("password")}
                            onMouseLeave={() => handleMouseUp("password")}
                            onClick={() => handleClick("password")}
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
                    <FormItem>
                      <FormLabel>Confirmar contraseña *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirma tu nueva contraseña"
                            className="pl-10 pr-10"
                          />
                          <button
                            type="button"
                            aria-label={
                              showConfirmPassword
                                ? "Ocultar contraseña"
                                : "Mostrar contraseña"
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                            onMouseDown={() => handleMouseDown("confirm")}
                            onMouseUp={() => handleMouseUp("confirm")}
                            onMouseLeave={() => handleMouseUp("confirm")}
                            onClick={() => handleClick("confirm")}
                          >
                            <Eye aria-hidden="true" />
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full btn btn-primary text-lg mt-4"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting && (
                    <span className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full mr-2" />
                  )}
                  Restablecer contraseña
                </Button>

                <Link
                  href="/auth/login"
                  className="mt-3 text-center text-primary font-semibold text-sm hover:underline flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver al inicio de sesión
                </Link>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <span className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
