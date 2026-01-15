import { Children } from "@/types/generic";
import EmpresaProfileLayout from "./EmpresaProfileLayout";

export default async function layout({ children }: Children) {
  // TODO: Add company-specific data fetching here
  // For example: const companyData = await getCompanyByUserId(session.user.accessToken);

  return <EmpresaProfileLayout>{children}</EmpresaProfileLayout>;
}
