import { fetchJobById } from "@/lib/jobs/job";
import JobDetails from "./JobDetails";
import { IdProp } from "@/types/generic";
import MainLayout from "@/components/shared/layout/MainLayout";
import Footer from "@/components/shared/components/Footer";
import Banner from "@/components/shared/components/Banner";

export default async function JobDetailsPage({ params }: IdProp) {
  const { id } = await params;
  const job = await fetchJobById(id);

  return (
    <MainLayout>
      <Banner />
      <div className="py-24 bg-gray-50">
        {job ? (
          <JobDetails {...job} />
        ) : (
          <div className="h-[50vh]">
            <h1 className="text-2xl font-bold mb-4 text-red-600">
              Trabajo no encontrado
            </h1>
          </div>
        )}
      </div>
      <Footer />
    </MainLayout>
  );
}
