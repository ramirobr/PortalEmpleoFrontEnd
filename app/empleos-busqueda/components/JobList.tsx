import { Job } from "@/types/jobs";
import { useRouter } from "next/navigation";
import JobCard from "@/app/jobs/components/JobCard";

interface Props {
  jobs: Job[];
}

export function JobList({ jobs }: Props) {
  const router = useRouter();

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {jobs?.map((job) => (
        <JobCard key={job.idVacante} job={job} />
      ))}
    </div>
  );
}
