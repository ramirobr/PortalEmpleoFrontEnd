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
import { Eye, Mail } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Footer from "../../../components/shared/components/Footer";
import Navbar from "../../../components/shared/components/Navbar";

const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "Contraseña requerida"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const next =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("next")
      : null;
  const { update } = useSession();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleMouseDown = () => setShowPassword(true);
  const handleMouseUp = () => setShowPassword(false);
  const handleClick = () => {
    setShowPassword(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowPassword(false), 2000);
  };

  async function onSubmit({ email, password }: LoginValues) {
    const res = await SignIn(email, password);
    if (res?.error) {
      toast.error("Credenciales inválidas");
      return;
    }

    form.reset();
    await update();
    router.push(next ?? "/");
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar showCompanyRegister={true} hideMainMenu={true} />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <h2 className="section-title">Ingresa a tu cuenta</h2>
        <Card className="w-full max-w-md p-6 flex flex-col gap-6 shadow-md">
          <CardContent className="flex flex-col gap-6">
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 w-full mb-2 text-black hover:text-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 48 48"
                className="w-5 h-5"
              >
                <g>
                  <path
                    fill="#4285F4"
                    d="M24 9.5c3.54 0 6.73 1.22 9.24 3.22l6.9-6.9C35.64 2.34 30.13 0 24 0 14.61 0 6.27 5.48 2.13 13.44l8.06 6.27C12.6 13.16 17.87 9.5 24 9.5z"
                  />
                  <path
                    fill="#34A853"
                    d="M46.1 24.55c0-1.56-.14-3.06-.39-4.5H24v9.05h12.45c-.54 2.9-2.17 5.36-4.62 7.02l7.18 5.59C43.73 37.13 46.1 31.33 46.1 24.55z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.19 28.71c-1.13-3.36-1.13-6.97 0-10.33l-8.06-6.27C.73 16.61 0 20.21 0 24c0 3.79.73 7.39 2.13 10.89l8.06-6.27z"
                  />
                  <path
                    fill="#EA4335"
                    d="M24 48c6.13 0 11.64-2.02 15.82-5.51l-7.18-5.59c-2.01 1.35-4.59 2.15-7.64 2.15-6.13 0-11.3-4.13-13.16-9.66l-8.06 6.27C6.27 42.52 14.61 48 24 48z"
                  />
                </g>
              </svg>
              Acceder con Google
            </Button>
            <Button
              variant="default"
              className="flex items-center justify-center gap-2 w-full mb-2 bg-[#2867B2] hover:bg-[#2867B2]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.327-.027-3.037-1.849-3.037-1.851 0-2.134 1.445-2.134 2.939v5.667h-3.554v-11.452h3.414v1.561h.049c.476-.9 1.637-1.849 3.37-1.849 3.602 0 4.267 2.369 4.267 5.455v6.285z" />
                <circle cx="5.337" cy="6.729" r="1.2" />
                <rect x="3.5" y="8.5" width="3.5" height="11.952" />
              </svg>
              Acceder con Linkedin
            </Button>
            <div className="flex items-center my-2">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="mx-2 text-gray-400">o</span>
              <div className="flex-1 border-t border-gray-300"></div>
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
                      <FormLabel>Email *</FormLabel>
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
                    <FormItem>
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

                <Link
                  href="/forgot-password"
                  className="text-primary font-semibold text-sm hover:underline"
                >
                  Olvidé mi contraseña
                </Link>

                <Button
                  type="submit"
                  className="w-full mt-2 flex items-center justify-center gap-2"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting && (
                    <span className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full" />
                  )}
                  Ingresar
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
