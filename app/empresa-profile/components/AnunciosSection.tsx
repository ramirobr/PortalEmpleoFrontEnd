import Link from "next/link";
import { Megaphone, Plus } from "lucide-react";

interface AnunciosSectionProps {
  ofertasCount: number;
}

export default function AnunciosSection({ ofertasCount }: AnunciosSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Postulantes Recomendados para ti</h2>

      {/* Two action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Mis Anuncios card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-secondary-container/10 flex items-center justify-center">
              <Megaphone className="size-5 text-secondary-container" />
            </div>
            <h3 className="font-bold text-gray-800 text-base">
              Mis Anuncios ({ofertasCount})
            </h3>
          </div>
          <p className="text-sm text-gray-500">
            Gestiona las ofertas de empleo existentes
          </p>
          <Link
            href="/empresa-profile/empleos"
            className="mt-auto inline-flex items-center justify-center px-4 py-2 border-2 border-primary text-primary font-bold text-xs uppercase rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            Gestiona las ofertas de empleo
          </Link>
        </div>

        {/* Crear Nuevo Anuncio card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-secondary-container/10 flex items-center justify-center">
              <Plus className="size-5 text-secondary-container" />
            </div>
            <h3 className="font-bold text-gray-800 text-base">
              + Crear Nuevo Anuncio
            </h3>
          </div>
          <p className="text-sm text-gray-500">
            Agregar una Nueva Oferta de Empleo
          </p>
          <Link
            href="/empresa-profile/crear-empleo"
            className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-deep text-white font-bold text-xs uppercase rounded-lg transition-colors"
          >
            <Plus className="size-3.5" />
            Crear Nuevo Anuncio
          </Link>
        </div>
      </div>

      {/* CTA button */}
      <Link
        href="/empresa-profile/buscar-candidatos"
        className="flex items-center justify-center w-full py-3.5 bg-primary hover:bg-primary-deep text-white font-bold text-sm uppercase rounded-xl transition-colors shadow-md hover:shadow-lg"
      >
        ¡Busca Candidatos Ahora!
      </Link>
    </section>
  );
}
