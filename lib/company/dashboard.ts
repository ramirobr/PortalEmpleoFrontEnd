import { CompanyDashboardInfoResponse } from "@/types/company";
import { User } from "next-auth";
import { fetchApi } from "../apiClient";

export const getCompanyDashboardByUserId = async (user: User) => {
  const json = await fetchApi<CompanyDashboardInfoResponse>(`/Company/dashboard-info/${user.id}`, {
    token: user.accessToken
  });
  return json?.data;
};
