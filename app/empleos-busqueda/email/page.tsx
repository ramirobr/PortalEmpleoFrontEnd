import JobsContent from "../components/JobsContent";
import Footer from "@/components/shared/components/Footer";
import MainLayout from "@/components/shared/layout/MainLayout";
import Banner from "@/components/shared/components/Banner";

import { Suspense } from "react";
import { auth } from "@/auth";
import { fetchFilters } from "@/lib/search/getFilters";

type Props = {
  searchParams: Promise<Record<string, string>>;
};

export default async function PasanteEmailPage({ searchParams }: Props) {
  const session = await auth();
  const params = await searchParams;
  const filtersItems = await fetchFilters();
  
  const role = params.role;
  const filters: Record<string, string> = {
    page: params.page ?? "1",
    pageSize: params.pageSize ?? "10",
    q: params.q ?? "",
    fecha: params.fecha ?? "",
    modalidad: params.modalidad ?? "",
    provincia: params.provincia ?? "",
    ciudad: params.ciudad ?? "",
    empresa: params.empresa ?? "",
    experience: params.experience ?? "",
  };

  // Use searchTerm for specialized roles as catalog IDs are inconsistent in the database
  if (role === "pasante" && !filters.q) {
    filters.q = "pasante";
  } else if (role === "horas" && !filters.q) {
    filters.q = "horas";
  }

  return (
    <div className="min-h-screen">
      <MainLayout>
        <div className="mx-auto">
          <Banner />
          <section className="container py-20">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {role === "pasante" ? "Empleos para Pasantes" : 
                 role === "horas" ? "Trabajo por Horas" : 
                 "Búsqueda de Empleos"}
              </h1>
              <p className="text-gray-600">
                {role === "pasante" ? "Encuentra las mejores oportunidades para iniciar tu carrera profesional." : 
                 role === "horas" ? "Oportunidades flexibles ajustadas a tu tiempo." : 
                 "Explora todas nuestras vacantes disponibles."}
              </p>
            </div>

            <Suspense>
              <JobsContent
                initialFilters={filters}
                filtersItems={filtersItems}
                token={session?.user.accessToken}
              />
            </Suspense>
          </section>
        </div>
        <Footer />
      </MainLayout>
    </div>
  );
}
