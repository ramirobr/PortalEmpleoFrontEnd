"use client";
import Loader from "@/components/shared/components/Loader";
import { useJobs } from "../hooks/useJobs";
import { JobList } from "./JobList";
import { Pagination } from "./Pagination";
import { TopFilters } from "./TopFilters";

type Props = {
  token?: string;
};

export default function Search({ token }: Props) {
  const { jobs, total, loading } = useJobs(token);

  return (
    <div className="flex-1">
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader size={48} />
        </div>
      ) : (
        <>
          <TopFilters total={total} />
          <JobList jobs={jobs} />
          {/* <Pagination total={total} /> */}
        </>
      )}
    </div>
  );
}
