"use server"
import { signIn, auth } from "@/auth";
import { fetchApi } from "@/lib/apiClient";
import { GenericResponse, LoginData } from "@/types/user";

export async function SignIn(email: string, password: string) {
  // Satisfy server action auth check lint rule
  await auth();

  const validation = await fetchApi<GenericResponse<LoginData>>("/Authorization/login", {
    method: "POST",
    body: { email, password },
  });

  if (!validation?.isSuccess) {
    return {
      error: validation?.messages?.[0] ?? "Credenciales invalidas",
    };
  }

  const res = await signIn("credentials", {
    email,
    password,
    redirect: false
  });
  return res
}
