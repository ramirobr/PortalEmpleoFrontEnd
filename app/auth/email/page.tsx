"use client";

import Navbar from "../../shared/components/Navbar";
import Footer from "../../shared/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Mail, Eye } from "lucide-react";
import React, { useState, useRef } from "react";
import { PhoneInput } from "@/components/ui/phone-input";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signupSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  apellido: z.string().min(1, "Apellido requerido"),
  tipoDoc: z.string().min(1, "Selecciona un tipo de documento"),
  numDoc: z.string().min(1, "Ingresa un número"),
  telefono: z.string().min(1, "Ingresa un teléfono válido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  email: z.string().email("Email inválido"),
  terms: z.boolean().refine((v) => v === true, "Debes aceptar las condiciones"),
});

type FormValues = z.infer<typeof signupSchema>;

export default function EmailSignup() {
  const form = useForm<FormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      tipoDoc: "",
      numDoc: "",
      telefono: "",
      password: "",
      email: "",
      terms: false,
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseDown = () => {
    setShowPassword(true);
  };
  const handleMouseUp = () => {
    setShowPassword(false);
  };
  const handleClick = () => {
    setShowPassword(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowPassword(false);
    }, 2000);
  };

  function onSubmit(data: FormValues) {
    console.log({ data });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar showAuthLinks={false} showCompanyRegister hideMainMenu />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <h2 className="section-title">
          Crea tu cuenta y encuentra tu empleo ideal
        </h2>

        <Card className="w-full max-w-2xl">
          <CardContent className="p-6 flex flex-col gap-6">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre(s) *</Label>
                  <Input
                    id="nombre"
                    {...form.register("nombre")}
                    placeholder="Ingresa tu nombre"
                  />
                  <p className="text-red-500 text-xs">
                    {form.formState.errors.nombre?.message}
                  </p>
                </div>

                <div>
                  <Label htmlFor="apellido">Apellido(s) *</Label>
                  <Input
                    id="apellido"
                    {...form.register("apellido")}
                    placeholder="Ingresa tu apellido"
                  />
                  <p className="text-red-500 text-xs">
                    {form.formState.errors.apellido?.message}
                  </p>
                </div>

                <div className="col-span-1 md:col-span-2 flex gap-4">
                  <div className="w-1/2">
                    <Label>Tipo de documento</Label>
                    <Select onValueChange={(v) => form.setValue("tipoDoc", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent popover="auto">
                        <SelectItem value="cedula">Cédula</SelectItem>
                        <SelectItem value="pasaporte">Pasaporte</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-red-500 text-xs">
                      {form.formState.errors.tipoDoc?.message}
                    </p>
                  </div>

                  <div className="w-1/2">
                    <Label htmlFor="num-doc">Número</Label>
                    <Input
                      id="num-doc"
                      {...form.register("numDoc")}
                      placeholder="Número"
                    />
                    <p className="text-red-500 text-xs">
                      {form.formState.errors.numDoc?.message}
                    </p>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 flex gap-4">
                  <div className="w-1/2">
                    <Label htmlFor="telefono">Teléfono celular *</Label>
                    <PhoneInput
                      defaultCountry="EC"
                      value={form.watch("telefono")}
                      onChange={(v) => form.setValue("telefono", v)}
                    />
                    <span className="text-xs text-gray-500 ml-2">
                      Ej. 991234567
                    </span>
                    <p className="text-red-500 text-xs">
                      {form.formState.errors.telefono?.message}
                    </p>
                  </div>

                  <div className="w-1/2">
                    <Label htmlFor="password">Contraseña *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...form.register("password")}
                        placeholder="Ingresa tu contraseña"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        tabIndex={0}
                        aria-label={
                          showPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 bg-transparent border-none p-0 cursor-pointer"
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onClick={handleClick}
                      >
                        <Eye aria-hidden="true" />
                      </button>
                    </div>
                    <p className="text-red-500 text-xs">
                      {form.formState.errors.password?.message}
                    </p>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      {...form.register("email")}
                      placeholder="Ingresa tu email"
                      className="pl-10"
                    />
                  </div>
                  <p className="text-red-500 text-xs">
                    {form.formState.errors.email?.message}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={form.watch("terms")}
                    onCheckedChange={(v) => form.setValue("terms", v === true)}
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
                <p className="text-red-500 text-xs">
                  {form.formState.errors.terms?.message}
                </p>

                <label className="flex items-center gap-2">
                  <Checkbox />
                  <span className="text-sm">
                    He leído y comprendo la{" "}
                    <Link
                      href="/privacy"
                      className="text-primary font-semibold underline"
                    >
                      Política de protección de datos personales y privacidad
                    </Link>
                  </span>
                </label>

                <label className="flex items-center gap-2">
                  <Checkbox />
                  <span className="text-sm">
                    Acepto recibir novedades, promociones y actualizaciones.
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full mt-2"
                disabled={form.formState.isSubmitting}
              >
                Crear cuenta
              </Button>
            </form>

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
