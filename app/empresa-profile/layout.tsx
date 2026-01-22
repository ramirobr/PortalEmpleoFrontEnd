import { Children } from "@/types/generic";
import EmpresaProfileLayout from "./EmpresaProfileLayout";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function layout({ children }: Children) {
  const session = await auth();
  if (!session) redirect("/auth/login");
  return <EmpresaProfileLayout>{children}</EmpresaProfileLayout>;
}
