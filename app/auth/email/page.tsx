"use client";

import Footer from "@/components/shared/components/Footer";
import { fetchSignUpFields } from "@/lib/auth/signup";
import { SignUpFieldsResponse } from "@/types/user";
import { useEffect, useState } from "react";
import EmailLayout from "./EmailLayout";
import EmailSignup from "./PostulantForm";

export default function Page() {
  const [fields, setFields] = useState<SignUpFieldsResponse | null>(null);

  useEffect(() => {
    async function getFields() {
      const fetchedFields = await fetchSignUpFields();
      setFields(fetchedFields);
    }
    getFields();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <EmailLayout>
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <EmailSignup fields={fields} />
        </main>
      </EmailLayout>
      <Footer />
    </div>
  );
}
