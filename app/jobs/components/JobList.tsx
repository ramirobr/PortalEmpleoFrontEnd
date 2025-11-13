import JobCard from "./JobCard";
import type { Job } from "./JobCard";

const JobList = ({ jobs }: { jobs: Job[] }) => {
  return (
    <div className="grid gap-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};
export default JobList;
// ...existing code from app/components/JobList.tsx
