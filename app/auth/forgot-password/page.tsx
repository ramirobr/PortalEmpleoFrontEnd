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
  MailCheck,
} from "lucide-react";
import Link from "next/link";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentToEmail, setSentToEmail] = useState("");

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

      setSentToEmail(email);
      setEmailSent(true);
    } catch {
      toast.error("Ocurrió un error inesperado. Intenta nuevamente.");
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-50">
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
              <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <MailCheck className="size-9" />
              </div>

              <div>
                <h2 className="text-black text-2xl font-semibold mb-2">
                  Revisa tu correo
                </h2>
                <p className="text-zinc-600">
                  Enviamos las instrucciones para restablecer tu contraseña a{" "}
                  <span className="font-semibold text-primary">{sentToEmail}</span>.
                  El enlace expira en {60} minutos.
                </p>
              </div>

              <p className="text-sm text-zinc-500">
                ¿No recibiste el correo? Revisa tu carpeta de spam o{" "}
                <button
                  type="button"
                  className="text-primary font-semibold hover:underline"
                  onClick={() => {
                    setEmailSent(false);
                    setSentToEmail("");
                  }}
                >
                  intenta con otro correo
                </button>
                .
              </p>

              <Link href="/auth/login" className="w-full">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="size-4 mr-2" />
                  Volver al inicio de sesión
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
    <div className="min-h-screen flex flex-col bg-zinc-50">
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
            <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center text-primary m-auto">
              <KeyRound className="size-7" />
            </div>

            <div className="text-center mb-2">
              <h2 className="text-black text-2xl font-semibold">
                ¿Olvidaste tu contraseña?
              </h2>
              <p className="mt-2 text-slate-600">
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
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
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
                    <span className="animate-spin size-4 border-2 border-t-transparent rounded-full mr-2" />
                  )}
                  Enviar instrucciones
                  <ArrowRight className="ml-2" />
                </Button>

                <Link
                  href="/auth/login"
                  className="mt-3 text-center text-primary font-semibold text-sm hover:underline flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="size-4" />
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
