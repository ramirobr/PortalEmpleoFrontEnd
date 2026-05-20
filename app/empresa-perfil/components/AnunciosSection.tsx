import { PremiumButton } from "@/components/shared/components/PremiumButton";
import { Megaphone, Plus, Search } from "lucide-react";

interface AnunciosSectionProps {
  ofertasCount: number;
}

export default function AnunciosSection({ ofertasCount }: AnunciosSectionProps) {
  return (
    <section className="space-y-6" aria-labelledby="anuncios-title">
      <h2 id="anuncios-title" className="text-xl font-semibold text-slate-900 flex items-center gap-2">
        <Megaphone className="size-5 text-primary" />
        Gestión de Ofertas
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Mis Anuncios card */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all p-6 flex flex-col gap-4 group">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Megaphone className="size-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">
                Mis Anuncios ({ofertasCount})
              </h3>
              <p className="text-sm text-slate-500">
                Gestiona tus vacantes publicadas
              </p>
            </div>
          </div>
          <PremiumButton
            href="/empresa-perfil/empleos"
            variant="outline"
            className="mt-auto w-full"
          >
            Ver mis anuncios
          </PremiumButton>
        </div>

        {/* Crear Nuevo Anuncio card */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all p-6 flex flex-col gap-4 group">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="size-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">
                Nuevo Anuncio
              </h3>
              <p className="text-sm text-slate-500">
                Publica una nueva oferta laboral
              </p>
            </div>
          </div>
          <PremiumButton
            href="/empresa-perfil/crear-empleo"
            variant="primary"
            icon={<Plus className="size-4" />}
            className="mt-auto w-full"
          >
            Crear ahora
          </PremiumButton>
        </div>
      </div>

      {/* Primary Action */}
      <PremiumButton
        href="/empresa-perfil/buscar-candidatos"
        variant="secondary"
        size="lg"
        icon={<Search className="size-4" />}
        className="w-full"
      >
        ¡Busca Candidatos Ahora!
      </PremiumButton>
    </section>
  );
}
