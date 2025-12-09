import { auth } from "@/auth";
import { fetchApi } from "../apiClient";
import { ActiveCompaniesResponse } from "@/types/search";

export async function fetchActiveCompanies() {
  const session = await auth()
  const json = await fetchApi<ActiveCompaniesResponse>("/Company/getActiveCompanies", {
    token: session?.user.accessToken
  });
  return json?.data;
}