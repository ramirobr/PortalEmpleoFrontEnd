import React, { useState } from "react";
import JobList from "./JobList";
import JobListControls from "./JobListControls";
import type { Job } from "./JobCard";

import Pagination from "../../shared/components/Pagination";

interface JobListingProps {
  jobs: Job[];
  page: number;
  setPage: (p: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (n: number) => void;
  totalJobs: number;
  loading?: boolean;
}

const JobListing = ({
  jobs,
  page,
  setPage,
  itemsPerPage,
  setItemsPerPage,
  totalJobs,
  loading,
}: JobListingProps) => {
  const [sort, setSort] = useState("recent");

  // Sorting logic (stub, implement as needed)
  let sortedJobs = [...jobs];
  if (sort === "recent") {
    sortedJobs.sort(
      (a, b) =>
        new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
    );
  } else if (sort === "viewed") {
    // Add logic for 'Más Visto' if you have a 'views' field
  } else if (sort === "searched") {
    // Add logic for 'Más Buscado' if you have a 'searches' field
  }

  // Pagination logic
  const start = 0;
  const end = sortedJobs.length;
  // jobs already paginated by parent
  const paginatedJobs = sortedJobs.slice(start, end);
  const totalPages = Math.max(1, Math.ceil(totalJobs / itemsPerPage));

  return (
    <section className="flex-1 ">
      <JobListControls
        sort={sort}
        setSort={setSort}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={(n) => {
          setItemsPerPage(n);
          setPage(1);
        }}
        total={totalJobs}
      />
      <JobList jobs={paginatedJobs} />
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        loading={loading}
      />
    </section>
  );
};
export default JobListing;
// ...existing code from app/components/JobListing.tsx
