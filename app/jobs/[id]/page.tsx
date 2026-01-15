import { fetchJobById } from "@/lib/jobs/job";
import JobDetails from "./JobDetails";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function JobDetailsPage({ params }: Props) {
  const { id } = await params;
  const job = await fetchJobById(id);

  if (!job) {
    return (
      <h1 className="text-2xl font-bold mb-4 text-red-600">
        Trabajo no encontrado
      </h1>
    );
  }

  return <JobDetails {...job} />;
}
