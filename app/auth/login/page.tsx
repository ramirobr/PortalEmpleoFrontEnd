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
import { SignIn } from "@/lib/auth/signin";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  Mail,
  LockKeyholeOpen,
  ArrowRight,
  UserRoundPlus,
  Building2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { ROLES } from "@/types/auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Footer from "../../../components/shared/components/Footer";
import Navbar from "../../../components/shared/components/Navbar";
import AsideMenu, {
  NavLink,
} from "../../../components/shared/components/AsideMenu";

const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "Contraseña requerida"),
});

export type LoginValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const { status, update } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push(next ?? "/");
    }
  }, [status, router, next]);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

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

  const handleMouseDown = () => setShowPassword(true);
  const handleMouseUp = () => setShowPassword(false);
  const handleClick = () => {
    setShowPassword(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowPassword(false), 2000);
  };

  async function onSubmit({ email, password }: LoginValues) {
    try {
      const res = await SignIn(email, password);
      if (res?.error) {
        toast.error("Credenciales inválidas");
        return;
      }

      form.reset();
      const session = await update();
      const userRole = session?.user?.role;
      switch (userRole) {
        case ROLES.AdministradorSistema:
          router.push("/admin");
          break;
        case ROLES.AdministradorEmpresa:
          router.push("/empresa-profile");
          break;
        case ROLES.Postulante:
          router.push("/profile");
          break;
        default:
          router.push(next ?? "/");
      }
    } catch {
      toast.error("Credenciales inválidas");
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
              <LockKeyholeOpen className="w-7 h-" />
            </div>
            <div className="text-center mb-5">
              <h2 className="text-black text-2xl font-bold ">
                Bienvenido de nuevo
              </h2>
              <p className="mt-2 text-gray-600">
                Inicia sesión para gestionar tus candidaturas
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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="mt-5">
                      <FormLabel>Contraseña *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Ingresa tu contraseña"
                            className="pr-10"
                          />

                          <button
                            type="button"
                            aria-label={
                              showPassword
                                ? "Ocultar contraseña"
                                : "Mostrar contraseña"
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
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

                <Link
                  href="/auth/forgot-password"
                  className="mt-3 text-center text-primary font-semibold text-sm hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>

                <Button
                  type="submit"
                  className="w-full btn btn-primary text-lg"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting && (
                    <span className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full mr-2" />
                  )}
                  Iniciar Sesión
                  <ArrowRight className="ml-2" />
                </Button>

                <div className="text-center text-sm">
                  ¿No tienes cuenta?{" "}
                  <Link
                    href="/auth/email"
                    className="text-primary font-semibold underline"
                  >
                    Regístrate como candidato
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

import { Suspense } from "react";
import Loader from "@/components/shared/components/Loader";

export default function LoginPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader size={48} />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
