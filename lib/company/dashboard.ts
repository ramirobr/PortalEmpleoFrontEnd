import { CompanyDashboardInfoResponse } from "@/types/company";
import { fetchApi } from "../apiClient";

export const getCompanyDashboardByUserId = async (idEmpresa: string, token?: string) => {
  const json = await fetchApi<CompanyDashboardInfoResponse>(`/Company/dashboard-info/${idEmpresa}`, {
    token
  });
  return json?.data;
};
