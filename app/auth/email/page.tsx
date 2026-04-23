"use client";

import Footer from "@/components/shared/components/Footer";
import { fetchSignUpFields } from "@/lib/auth/signup";
import { SignUpFieldsResponse } from "@/types/user";
import { useEffect, useState } from "react";
import EmailLayout from "./EmailLayout";
import EmailSignup from "./PostulantForm";

export default function Page() {
  const [fields, setFields] = useState<SignUpFieldsResponse | null>(null);
  const [loadingFields, setLoadingFields] = useState(true);

  useEffect(() => {
    async function getFields() {
      try {
        const fetchedFields = await fetchSignUpFields();
        setFields(fetchedFields);
      } finally {
        setLoadingFields(false);
      }
    }
    getFields();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <EmailLayout>
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <EmailSignup fields={fields} loadingFields={loadingFields} />
        </main>
      </EmailLayout>
      <Footer />
    </div>
  );
}
