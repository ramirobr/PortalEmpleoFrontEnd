import { auth } from "@/auth";
import { Children } from "@/types/generic";
import { redirect } from "next/navigation";

export default async function layout({ children }: Children) {
  const session = await auth();
  if (session) redirect("/");
  return children;
}
