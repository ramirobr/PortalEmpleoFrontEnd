import Footer from "@/components/shared/components/Footer";
import { fetchSignUpFields } from "@/lib/auth/signup";
import EmailLayout from "./EmailLayout";
import EmailSignup from "./PostulantForm";

export default async function page() {
  const fields = await fetchSignUpFields();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <EmailLayout>
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <h2 className="section-title">
            Crea tu cuenta y encuentra tu empleo ideal
          </h2>
          <EmailSignup fields={fields} />
        </main>
      </EmailLayout>
      <Footer />
    </div>
  );
}
