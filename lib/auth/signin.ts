"use server"
import { signIn } from "@/auth";

export async function SignIn(email: string, password: string) {
  const res = await signIn("credentials", {
    email,
    password,
    redirect: false
  });
  return res
}
