import RecentJobCard from "@/app/jobs/components/RecentJobCard";
import { auth } from "@/auth";
import TituloSubrayado from "@/components/shared/tituloSubrayado";
import { getVacantesFavoritasByUser } from "@/lib/jobs/favorites";

export default async function FavoritosPage() {
  const session = await auth();
  if (!session) return;
  const favoriteJobs = await getVacantesFavoritasByUser(session.user);

  return (
    <section>
      <TituloSubrayado>Empleos Favoritos</TituloSubrayado>
      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {favoriteJobs?.length ? (
          favoriteJobs?.map((job) => (
            <RecentJobCard key={job.id} job={job} isFav />
          ))
        ) : (
          <h4 className="text-lg font-semibold">No hay empleos favoritos</h4>
        )}
      </div>
    </section>
  );
}
