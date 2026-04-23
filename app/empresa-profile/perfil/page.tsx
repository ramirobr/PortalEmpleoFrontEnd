import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getCompanyProfileById } from "@/lib/company/profile";
import { fetchCompanyProfileCatalogs } from "@/lib/company/formFields";
import CompanyProfileView from "./components/CompanyProfileView";

export default async function PerfilEmpresaPage() {
  const session = await auth();
  if (!session?.user?.idEmpresa) return;
  const companyProfile = await getCompanyProfileById(
    session.user.idEmpresa,
    session.user.accessToken,
  );
  const filters = await fetchCompanyProfileCatalogs();

  if (!companyProfile) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-gray-800">
          No se pudo cargar el perfil de la empresa
        </h1>
        <p className="text-gray-500 mt-2">
          Por favor, intenta nuevamente más tarde.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">
        Perfil de Empresa
      </h1>
      <CompanyProfileView profile={companyProfile} filters={filters} />
    </div>
  );
}
