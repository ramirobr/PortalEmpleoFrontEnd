import Footer from "../../../components/shared/components/Footer";
import CompanyForm from "./CompanyForm";
import { fetchFormFields } from "@/lib/company/formFields";
import CompanyLayout from "./CompanyLayout";

export default async function CompanyRegister() {
  const formFields = await fetchFormFields();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <CompanyLayout>
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <CompanyForm fields={formFields} />
        </main>
      </CompanyLayout>
      <Footer />
    </div>
  );
}
