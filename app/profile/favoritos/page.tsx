import TituloSubrayado from "@/components/shared/tituloSubrayado";
import { Heart } from "lucide-react";
import { auth } from "@/auth";
import { getVacantesFavoritasByUser } from "@/lib/jobs/favorites";
import { fetchFilters } from "@/lib/search/getFilters";
import FavoritosContent from "./components/FavoritosContent";
import { Suspense } from "react";

export default async function FavoritosPage() {
  const session = await auth();
  if (!session) return;

  const [favoriteJobs, filtersItems] = await Promise.all([
    getVacantesFavoritasByUser(session.user),
    fetchFilters(),
  ]);

  return (
    <section>
      <TituloSubrayado>
        <Heart className="w-8 h-8" />
        Empleos Favoritos
      </TituloSubrayado>
      <Suspense fallback={<div>Cargando...</div>}>
        <FavoritosContent
          favoriteJobs={favoriteJobs || []}
          filtersItems={filtersItems}
        />
      </Suspense>
    </section>
  );
}
