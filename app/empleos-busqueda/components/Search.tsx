"use client";
import { useSearchParams } from "next/navigation";
import { useJobs } from "../lib/useJobs";
import { JobList } from "./JobList";
import { TopFilters } from "./TopFilters";
import Loader from "@/components/shared/components/Loader";
import { Pagination } from "./Pagination";

export default function Search() {
  const params = useSearchParams();
  const searchParams = new URLSearchParams(params.toString());
  const { jobs, total, limit, page, loading } = useJobs(searchParams);

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
          <Pagination total={total} limit={limit} page={page} />
        </>
      )}
    </div>
  );
}
