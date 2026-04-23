"use client";
import Loader from "@/components/shared/components/Loader";
import { useJobs } from "../hooks/useJobs";
import { JobList } from "./JobList";
import { Pagination } from "./Pagination";
import { TopFilters } from "@/components/shared/components/TopFilters";

type Props = {
  token?: string;
  onToggleFilters?: () => void;
  initialFilters?: Record<string, string>;
};

export default function Search({ token, onToggleFilters, initialFilters }: Props) {
  const { jobs, total, loading, pageSize } = useJobs(token, initialFilters);

  return (
    <div className="flex-1">
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader size={48} />
        </div>
      ) : (
        <>
          <TopFilters total={total} onToggleFilters={onToggleFilters} />
          <JobList jobs={jobs} />
          <Pagination total={total} pageSize={pageSize} />
        </>
      )}
    </div>
  );
}
