import Footer from "@/components/shared/components/Footer";
import Navbar from "@/components/shared/components/Navbar";
import { fetchAllCatalogsByType } from "@/lib/catalog/fetch";
import EmailSignup from "./PostulantForm";

export default async function page() {
  const tipoDoc = await fetchAllCatalogsByType("TIPO_DOCUMENTO");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar showCompanyRegister hideMainMenu />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <h2 className="section-title">
          Crea tu cuenta y encuentra tu empleo ideal
        </h2>
        <EmailSignup tipoDoc={tipoDoc} />
      </main>
      <Footer />
    </div>
  );
}
