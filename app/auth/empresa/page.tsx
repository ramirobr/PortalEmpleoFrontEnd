import Footer from "../../../components/shared/components/Footer";
import CompanyForm from "./CompanyForm";
import { fetchFormFields } from "@/lib/company/formFields";
import CompanyLayout from "./CompanyLayout";

export default async function CompanyRegister() {
  const formFields = await fetchFormFields();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CompanyLayout>
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-primary mb-4">
            Registra tu empresa
          </h1>
          <p className="text-xs text-gray-600 mb-2">
            Todos los campos con <span className="text-red-500">*</span> son
            obligatorios.
          </p>
          <CompanyForm fields={formFields} />
        </main>
      </CompanyLayout>
      <Footer />
    </div>
  );
}
