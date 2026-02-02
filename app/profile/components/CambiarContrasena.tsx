"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Check, Eye, Save, X } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { fetchApi } from "@/lib/apiClient";
import { GenericResponse } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useState } from "react";

const schema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es obligatoria."),
    newPassword: z
      .string()
      .min(8, "La nueva contraseña debe tener al menos 8 caracteres."),
    confirmNewPassword: z.string().min(1, "Confirma la nueva contraseña."),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmNewPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof schema>;

export default function CambiarContrasena() {
  const { data: session } = useSession();

  // Show/hide password states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onChange",
  });

  // Watch password fields for real-time validation
  const currentPassword = form.watch("currentPassword");
  const newPassword = form.watch("newPassword");
  const confirmNewPassword = form.watch("confirmNewPassword");

  // Field enablement
  const isCurrentPasswordFilled = currentPassword.length > 0;
  const showRequirements = newPassword.length > 0;

  // Validation checks
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const passwordsMatch =
    newPassword.length > 0 &&
    confirmNewPassword.length > 0 &&
    newPassword === confirmNewPassword;

  const handleSubmit = async (values: ChangePasswordFormValues) => {
    const email = session?.user?.email;
    if (!email) {
      toast.error("No se encontró la sesión. Inicia sesión de nuevo.");
      return;
    }

    const res = await fetchApi<GenericResponse<null>>(
      "/Authorization/change-password",
      {
        method: "POST",
        token: session?.user?.accessToken,
        body: {
          email,
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
      },
    );

    if (!res?.isSuccess) {
      toast.error(
        res?.messages?.[0] ??
          "Error al cambiar la contraseña. Intenta de nuevo.",
      );
      return;
    }

    toast.success("Contraseña actualizada correctamente.");
    form.reset();
  };

  return (
    <>
      <Card className="p-6 max-w-4xlbg-card text-card-foreground rounded-xl border w-full max-w-md p-6 flex flex-col gap-6 shadow-md">
        <div className="px-6 flex flex-col gap-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary m-auto">
            <KeyRound className="w-6 h-6 text-primary" />
          </div>
          <div className="text-center mb-5">
            <h2 className="text-black text-2xl font-bold ">
              Cambiar contraseña
            </h2>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-6"
              aria-label="Formulario para cambiar contraseña"
            >
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="currentPassword">
                      Contraseña actual
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="Ingresa tu contraseña actual"
                          className="pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          aria-label={
                            showCurrentPassword
                              ? "Ocultar contraseña"
                              : "Mostrar contraseña"
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
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
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="newPassword">
                      Nueva contraseña
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="Mínimo 8 caracteres"
                          disabled={!isCurrentPasswordFilled}
                          className="pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          aria-label={
                            showNewPassword
                              ? "Ocultar contraseña"
                              : "Mostrar contraseña"
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer disabled:cursor-not-allowed"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          disabled={!isCurrentPasswordFilled}
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
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="confirmNewPassword">
                      Confirmar nueva contraseña
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="confirmNewPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="Repite la nueva contraseña"
                          disabled={!isCurrentPasswordFilled}
                          className="pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          aria-label={
                            showConfirmPassword
                              ? "Ocultar contraseña"
                              : "Mostrar contraseña"
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer disabled:cursor-not-allowed"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          disabled={!isCurrentPasswordFilled}
                        >
                          <Eye aria-hidden="true" />
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="w-full btn btn-primary text-lg"
                  disabled={
                    form.formState.isSubmitting ||
                    !hasMinLength ||
                    !hasUppercase ||
                    !hasLowercase ||
                    !hasNumber ||
                    !passwordsMatch
                  }
                >
                  {form.formState.isSubmitting && (
                    <span className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full" />
                  )}
                  Guardar contraseña
                  <Save />
                </Button>
              </div>
            </form>
          </Form>

          {showRequirements && (
            <div className="flex flex-col" id="requirements">
              <h3 className="text-lg font-semibold text-primary mb-4">
                Requisitos de la contraseña
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  {hasMinLength ? (
                    <Check
                      className="w-4 h-4 text-green-600"
                      aria-hidden="true"
                    />
                  ) : (
                    <X className="w-4 h-4 text-red-500" aria-hidden="true" />
                  )}
                  <span
                    className={hasMinLength ? "text-green-600" : "text-red-500"}
                  >
                    Mínimo 8 caracteres
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  {hasUppercase ? (
                    <Check
                      className="w-4 h-4 text-green-600"
                      aria-hidden="true"
                    />
                  ) : (
                    <X className="w-4 h-4 text-red-500" aria-hidden="true" />
                  )}
                  <span
                    className={hasUppercase ? "text-green-600" : "text-red-500"}
                  >
                    Al menos una letra mayúscula
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  {hasLowercase ? (
                    <Check
                      className="w-4 h-4 text-green-600"
                      aria-hidden="true"
                    />
                  ) : (
                    <X className="w-4 h-4 text-red-500" aria-hidden="true" />
                  )}
                  <span
                    className={hasLowercase ? "text-green-600" : "text-red-500"}
                  >
                    Al menos una letra minúscula
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  {hasNumber ? (
                    <Check
                      className="w-4 h-4 text-green-600"
                      aria-hidden="true"
                    />
                  ) : (
                    <X className="w-4 h-4 text-red-500" aria-hidden="true" />
                  )}
                  <span
                    className={hasNumber ? "text-green-600" : "text-red-500"}
                  >
                    Al menos un número
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  {passwordsMatch ? (
                    <Check
                      className="w-4 h-4 text-green-600"
                      aria-hidden="true"
                    />
                  ) : (
                    <X className="w-4 h-4 text-red-500" aria-hidden="true" />
                  )}
                  <span
                    className={
                      passwordsMatch ? "text-green-600" : "text-red-500"
                    }
                  >
                    Las contraseñas deben coincidir
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </Card>
      <Link
        href="/"
        className="flex items-center gap-6 text-primary font-bold mt-8 hover:underline"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver al Inicio
      </Link>
    </>
  );
}
