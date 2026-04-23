import { fetchAllCatalogsByType } from "@/lib/catalog/fetch";
import PostulacionesList from "./PostulacionesList";
import { Suspense } from "react";

export const metadata = {
  title: "Postulaciones | PortalEmpleo",
  description: "Lista de postulaciones con aprobar o rechazar por candidato",
};

export default async function PostulacionesPage() {
  const estados = await fetchAllCatalogsByType("ESTADO_APLICACION");

  return (
    <>
      <section className="mb-6 px-6 pt-6">
        <h1 className="text-3xl font-bold text-gray-900">Postulaciones</h1>
        <p className="text-gray-500 mt-1">
          Revisa las postulaciones por candidato, aprueba o rechaza según
          corresponda.
        </p>
      </section>
      <Suspense fallback={<div className="p-6">Cargando postulaciones...</div>}>
        <PostulacionesList estados={estados} />
      </Suspense>
    </>
  );
}
