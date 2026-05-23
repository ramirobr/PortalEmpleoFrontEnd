import { fetchJobById } from "@/lib/jobs/job";
import JobDetails from "./JobDetails";
import { IdProp } from "@/types/generic";
import MainLayout from "@/components/shared/layout/MainLayout";
import Footer from "@/components/shared/components/Footer";
import Banner from "@/components/shared/components/Banner";

export default async function JobDetailsPage({ params }: IdProp) {
  const { id } = await params;
  const job = await fetchJobById(id);

  // Construir la URL del banner desde base64
  const bannerSrc = job?.bannerEmpresa
    ? job.bannerEmpresa.startsWith("data:")
      ? job.bannerEmpresa
      : `data:image/png;base64,${job.bannerEmpresa}`
    : null;

  return (
    <MainLayout>
      <Banner title="Detalle de la Oferta" source={bannerSrc ?? undefined} alt={`Banner para ${job?.titulo}`} />
      <div className="py-24 bg-slate-50">
        {job ? (
          <JobDetails {...job} />
        ) : (
          <div className="h-[50vh]">
            <h1 className="text-2xl font-semibold mb-4 text-red-600">
              Trabajo no encontrado
            </h1>
          </div>
        )}
      </div>
      <Footer />
    </MainLayout>
  );
}
