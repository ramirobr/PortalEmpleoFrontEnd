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
import { forgotPassword } from "@/lib/auth/forgot-password";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  LockKeyholeOpen,
  UserRoundPlus,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Footer from "@/components/shared/components/Footer";
import Navbar from "@/components/shared/components/Navbar";
import AsideMenu, {
  NavLink,
} from "@/components/shared/components/AsideMenu";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit({ email }: ForgotPasswordValues) {
    try {
      const res = await forgotPassword(email);

      if (!res || !res.isSuccess) {
        toast.error(
          res?.messages?.[0] ||
            "Error al enviar la solicitud. Intenta nuevamente."
        );
        return;
      }

      // Guardamos el token y email en la URL para la siguiente página
      const params = new URLSearchParams({
        email: email,
        token: res.data.resetToken,
      });

      toast.success(res.data.message || "Se ha enviado un correo con las instrucciones");
      router.push(`/auth/reset-password?${params.toString()}`);
    } catch {
      toast.error("Ocurrió un error inesperado. Intenta nuevamente.");
    }
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
              <KeyRound className="w-7 h-7" />
            </div>

            <div className="text-center mb-2">
              <h2 className="text-black text-2xl font-bold">
                ¿Olvidaste tu contraseña?
              </h2>
              <p className="mt-2 text-gray-600">
                No te preocupes, ingresa tu correo electrónico y te enviaremos
                las instrucciones para restablecerla.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="Ingresa tu email"
                            className="pl-10"
                          />
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
                  Enviar instrucciones
                  <ArrowRight className="ml-2" />
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
