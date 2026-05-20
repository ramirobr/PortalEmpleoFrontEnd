"use client";

import Footer from "@/components/shared/components/Footer";
import { fetchSignUpFields } from "@/lib/auth/signup";
import { fetchApi } from "@/lib/apiClient";
import { SignUpFieldsResponse } from "@/types/user";
import { CatalogsByType, CatalogsByTypeResponse } from "@/types/search";
import { useEffect, useState } from "react";
import EmailLayout from "./EmailLayout";
import EmailSignup from "./PostulantForm";

export default function Page() {
  const [state, setState] = useState({
    fields: null as SignUpFieldsResponse | null,
    loadingFields: true,
    ciudades: [] as CatalogsByType[],
    provincias: [] as CatalogsByType[],
  });
  const { fields, loadingFields, ciudades, provincias } = state;

  useEffect(() => {
    async function getFields() {
      try {
        const [fetchedFields, ciudadesRes, provinciasRes] = await Promise.all([
          fetchSignUpFields(),
          fetchApi<CatalogsByTypeResponse>("/Catalog/getAllCatalogsByType/CIUDAD"),
          fetchApi<CatalogsByTypeResponse>("/Catalog/getAllCatalogsByType/PROVINCIA"),
        ]);
        setState({
          fields: fetchedFields,
          ciudades: ciudadesRes?.data || [],
          provincias: provinciasRes?.data || [],
          loadingFields: false,
        });
      } catch (err) {
        setState((prev) => ({ ...prev, loadingFields: false }));
      }
    }
    getFields();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <EmailLayout>
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <EmailSignup fields={fields} loadingFields={loadingFields} ciudades={ciudades} provincias={provincias} />
        </main>
      </EmailLayout>
      <Footer />
    </div>
  );
}
