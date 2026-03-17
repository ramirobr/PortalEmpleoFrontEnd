import { CompanyProfileResponse } from "@/types/company";
import { GenericResponse } from "@/types/user";
import { fetchApi } from "../apiClient";

export type CompanyLogoResponse = GenericResponse<string>;

export const getCompanyProfileById = async (idEmpresa: string, token?: string) => {
  const json = await fetchApi<CompanyProfileResponse>(`/Company/getCompanyById/${idEmpresa}`, {
    token
  });
  return json?.data;
};

export const getCompanyLogo = async (idEmpresa: string, token?: string) => {
  const json = await fetchApi<CompanyLogoResponse>(`/Company/logo/${idEmpresa}`, {
    token
  });
  return json?.data;
};
