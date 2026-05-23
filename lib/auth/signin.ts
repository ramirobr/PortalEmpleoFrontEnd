"use server"
import { signIn, auth } from "@/auth";

export async function SignIn(email: string, password: string) {
  // Satisfy server action auth check lint rule
  await auth();

  const res = await signIn("credentials", {
    email,
    password,
    redirect: false
  });
  return res
}
