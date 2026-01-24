import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getCompanyProfileById } from "@/lib/company/profile";
import { fetchAllCatalogsByType } from "@/lib/catalog/fetch";
import CompanyProfileView from "./components/CompanyProfileView";

export default async function PerfilEmpresaPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/auth/login");
  }
  
  if (!session.user.idEmpresa) {
    redirect("/auth/login");
  }

  const [companyProfile, estadoOptions, condicionFiscalOptions, industriaOptions, cantidadEmpleadosOptions, ciudadOptions, generoOptions] = await Promise.all([
    getCompanyProfileById(session.user.idEmpresa, session.user.accessToken),
    fetchAllCatalogsByType("ESTADO_EMPRESA"),
    fetchAllCatalogsByType("CONDICION_FISCAL"),
    fetchAllCatalogsByType("INDUSTRIA"),
    fetchAllCatalogsByType("CANTIDAD_EMPLEADOS"),
    fetchAllCatalogsByType("CIUDAD"),
    fetchAllCatalogsByType("GENERO"),
  ]);

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
      <h1 className="text-3xl font-bold text-primary mb-6">Perfil de Empresa</h1>
      <CompanyProfileView
        profile={companyProfile}
        estadoOptions={estadoOptions}
        condicionFiscalOptions={condicionFiscalOptions}
        industriaOptions={industriaOptions}
        cantidadEmpleadosOptions={cantidadEmpleadosOptions}
        ciudadOptions={ciudadOptions}
        generoOptions={generoOptions}
      />
    </div>
  );
}
