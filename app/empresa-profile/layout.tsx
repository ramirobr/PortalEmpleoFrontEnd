import { Children } from "@/types/generic";
import EmpresaProfileLayout from "./EmpresaProfileLayout";

export default async function layout({ children }: Children) {
  return <EmpresaProfileLayout>{children}</EmpresaProfileLayout>;
}
