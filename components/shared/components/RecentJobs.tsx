"use client";
import { RecentJob } from "@/types/jobs";
import RecentJobCard from "../../../app/jobs/components/RecentJobCard";

export type RecentJobsProps = {
  jobs: RecentJob[] | undefined;
};

const RecentJobs = ({ jobs }: RecentJobsProps) => {
  return (
    <section className="py-20">
      <div className="container">
        <h2 className="section-title">Trabajos Recientes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {jobs?.map((job) => (
            <RecentJobCard key={job.tituloPuesto} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentJobs;
