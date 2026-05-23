import { fetchAllCatalogsByType } from "@/lib/catalog/fetch";
import { LoadingState } from "@/components/shared/components/LoadingState";
import { PremiumPageHeader } from "../components/PremiumPageHeader";
import PostulacionesList from "./PostulacionesList";
import { Suspense } from "react";

export const metadata = {
  title: "Postulaciones | PortalEmpleo",
  description: "Lista de postulaciones con aprobar o rechazar por candidato",
};

export default async function PostulacionesPage() {
  const estados = await fetchAllCatalogsByType("ESTADO_APLICACION");

  return (
    <div className="py-6">
      <PremiumPageHeader
        title="Postulaciones"
        description="Gestiona todos los candidatos que han aplicado a tus vacantes activas. Filtra por estado o vacante específica para agilizar tu proceso de selección."
      />
      <Suspense
        fallback={
          <LoadingState message="Cargando postulaciones..." className="py-12" />
        }
      >
        <PostulacionesList estados={estados} />
      </Suspense>
    </div>
  );
}
