import { GetLastEightJobsResponse } from "@/types/jobs";
import { fetchApi } from "../apiClient";

export async function fetchRecentJobs() {
  const json = await fetchApi<GetLastEightJobsResponse>("/Jobs/getLastEightJobs");
  return json?.data;
}