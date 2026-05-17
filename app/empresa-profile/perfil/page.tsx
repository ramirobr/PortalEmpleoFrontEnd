import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getCompanyProfileById } from "@/lib/company/profile";
import { fetchCompanyProfileCatalogs } from "@/lib/company/formFields";
import CompanyProfileView from "./components/CompanyProfileView";

export default async function PerfilEmpresaPage() {
  const session = await auth();
  if (!session?.user?.idEmpresa) return;
  const [companyProfile, filters] = await Promise.all([
    getCompanyProfileById(session.user.idEmpresa, session.user.accessToken),
    fetchCompanyProfileCatalogs(),
  ]);

  if (!companyProfile) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold text-zinc-800">
          No se pudo cargar el perfil de la empresa
        </h1>
        <p className="text-zinc-500 mt-2">
          Por favor, intenta nuevamente más tarde.
        </p>
      </div>
    );
  }

  return <CompanyProfileView profile={companyProfile} filters={filters} />;
}
