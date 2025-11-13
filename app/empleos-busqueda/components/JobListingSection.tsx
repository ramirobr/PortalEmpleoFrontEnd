import JobListing from "../../jobs/components/JobListing";
import type { Job } from "../types";

interface JobListingSectionProps {
  jobs: Job[];
  page: number;
  setPage: (p: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (n: number) => void;
  totalJobs: number;
  loading: boolean;
}

export default function JobListingSection(props: JobListingSectionProps) {
  return <JobListing {...props} />;
}
