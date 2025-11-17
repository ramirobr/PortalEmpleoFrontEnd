"use client";
import React, { useEffect, useState } from "react";
import { apiFetch } from "../../lib/apiClient";
import RecentJobCard from "../../jobs/components/RecentJobCard";
import { Job } from "../../jobs/components/JobCard";

const RecentJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    apiFetch<any>("/api/jobs")
      .then((data) => {
        // Sort by postedDate descending and take the 8 most recent
        const sorted = data.jobs.sort(
          (a: Job, b: Job) =>
            new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
        );
        setJobs(sorted.slice(0, 8));
      })
      .catch(() => setJobs([]));
  }, []);

  return (
    <section className="py-20">
      <div className="container">
        <h2 className="section-title">Trabajos Recientes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {jobs.map((job) => (
            <RecentJobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentJobs;
