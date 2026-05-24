"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, CircleAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchApi } from "@/lib/apiClient";
import { GenericResponse } from "@/types/user";

type ActivationState = "loading" | "success" | "error";

export default function ActivarEmpresaPage() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<ActivationState>("loading");
  const [message, setMessage] = useState("Validando enlace de activacion...");

  useEffect(() => {
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email || !token) {
      setState("error");
      setMessage("El enlace de activacion no es valido.");
      return;
    }

    const activateCompany = async () => {
      const response = await fetchApi<GenericResponse<{ message: string }>>(
        `/Company/activate-company?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`,
      );

      if (response?.isSuccess) {
        setState("success");
        setMessage(response.data?.message ?? response.messages?.[0] ?? "Empresa activada correctamente.");
        return;
      }

      setState("error");
      setMessage(response?.messages?.[0] ?? "No se pudo activar la empresa.");
    };

    activateCompany();
  }, [searchParams]);

  const isSuccess = state === "success";

  return (
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-md">
        <CardContent className="p-8 text-center space-y-6">
          <div className="mx-auto size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            {state === "loading" ? (
              <Loader2 className="size-7 animate-spin" />
            ) : isSuccess ? (
              <CheckCircle2 className="size-7" />
            ) : (
              <CircleAlert className="size-7 text-secondary" />
            )}
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-slate-950">
              {state === "loading"
                ? "Activando empresa"
                : isSuccess
                  ? "Empresa activada"
                  : "No se pudo activar"}
            </h1>
            <p className="text-sm leading-6 text-slate-600">{message}</p>
          </div>

          <Button asChild className="w-full" disabled={state === "loading"}>
            <Link href="/auth/login">Ir al inicio de sesion</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
