import { CompanyDashboardInfoResponse } from "@/types/company";
import { fetchApi } from "../apiClient";
import { GenericResponse } from "@/types/user";

export const getCompanyDashboardByUserId = async (idEmpresa: string, token?: string) => {
  const json = await fetchApi<CompanyDashboardInfoResponse>(`/Company/dashboard-info/${idEmpresa}`, {
    token
  });
  return json?.data;
};

export const marcarNotificacionEmpresaLeida = async (idNotificacion: string, token?: string) => {
  const json = await fetchApi<GenericResponse<null>>(`/NotificacionesEmpresa/marcarLeida/${idNotificacion}`, {
    method: "PUT",
    token
  });
  return json;
};
