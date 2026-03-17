"use client";
import { RecentJob } from "@/types/jobs";
import JobCard from "@/app/jobs/components/JobCard";

export type RecentJobsProps = {
  jobs?: RecentJob[];
  favJobsByUser?: RecentJob[];
};

const RecentJobs = ({ jobs, favJobsByUser }: RecentJobsProps) => {
  return (
    <section className="w-full  py-10 bg-gray-50 md:py-20">
      <div className="container">
        <h2 className="section-title">Trabajos Recientes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-6">
          {jobs?.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isFavorite={
                !!favJobsByUser?.find((favJob) => favJob.id === job.id)
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentJobs;
