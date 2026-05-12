import { Suspense } from "react";
import { auth } from "@/auth";
import CandidatesContent from "./components/CandidatesContent";

type Props = {
  searchParams: Promise<Record<string, string>>;
};

export default async function BuscarCandidatosPage({ searchParams }: Props) {
  const session = await auth();
  const params = await searchParams;

  // Mock filters - in a real app, these would be fetched from the API
  const filtersItems = undefined;

  const filters = {
    page: params.page ?? "1",
    pageSize: params.pageSize ?? "10",
    q: params.q,
    edadMin: params.edadMin,
    edadMax: params.edadMax,
    aspiracionMin: params.aspiracionMin,
    aspiracionMax: params.aspiracionMax,
    experienciaMin: params.experienciaMin,
    experienciaMax: params.experienciaMax,
    provincia: params.provincia,
    ciudad: params.ciudad,
    nivelEducacion: params.nivelEducacion,
    preferenciaTurno: params.preferenciaTurno,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full bg-gradient-to-r from-primary to-primary/70 py-10 px-6 mb-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-white mb-1">
            Buscar Candidatos
          </h1>
          <p className="text-white/80">
            Encuentra el talento ideal para tu empresa
          </p>
        </div>
      </div>
      <div className="container mx-auto py-4">

        <Suspense>
          <CandidatesContent
            initialFilters={filters as Record<string, string>}
            filtersItems={filtersItems}
            token={session?.user.accessToken}
          />
        </Suspense>
      </div>
    </div>
  );
}
