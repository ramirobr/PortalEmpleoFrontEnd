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
      <div className="mx-auto py-12 px-4 flex flex-col gap-8">
        <div className="container max-w-6xl">
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
      </div>
      <Footer />
    </MainLayout>
  );
}
