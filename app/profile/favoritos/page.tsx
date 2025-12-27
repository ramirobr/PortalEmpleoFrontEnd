import RecentJobCard from "@/app/jobs/components/RecentJobCard";
import { auth } from "@/auth";
import TituloSubrayado from "@/components/shared/tituloSubrayado";
import { fetchFavoriteJobs } from "@/lib/jobs/favorites";

export default async function FavoritosPage() {
  const session = await auth();
  const favoriteJobs = (await fetchFavoriteJobs()) ?? [];

  return (
    <section>
      <TituloSubrayado>Empleos Favoritos</TituloSubrayado>
      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {favoriteJobs.map((job) => (
          <RecentJobCard key={job.id} job={job} session={session} />
        ))}
      </div>
    </section>
  );
}
