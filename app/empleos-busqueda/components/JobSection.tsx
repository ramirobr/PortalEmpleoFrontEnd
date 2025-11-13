import JobListing from "../../jobs/components/JobListing";
import type { Job } from "../types";

interface JobSectionProps {
  jobs: Job[];
  page: number;
  setPage: (p: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (n: number) => void;
  totalJobs: number;
  loading: boolean;
}

export default function JobSection(props: JobSectionProps) {
  return <JobListing {...props} />;
}
