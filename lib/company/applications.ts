"server only"
import { fetchApi } from "../apiClient";
import type { GetAplicacionesByEmpresaResponse } from "@/types/company";
import type { GenericResponse } from "@/types/user";

export interface GetAplicacionesByEmpresaParams {
  pageSize: number;
  currentPage: number;
  sortBy: string;
  sortDirection: string;
  searchTerm: string;
  idEmpresa: string;
  idEstadoAplicacion: number;
  idVacante?: string | null;
}

export async function fetchAplicacionesByEmpresa(
  params: GetAplicacionesByEmpresaParams,
  token: string
): Promise<GetAplicacionesByEmpresaResponse | null> {
  const data = await fetchApi<GenericResponse<GetAplicacionesByEmpresaResponse>>(
    '/Jobs/getAplicacionesByEmpresa',
    {
      method: 'POST',
      body: params,
      token,
    }
  );
  return data?.data || null;
}

export async function updateAplicacionEstado(
  idAplicacion: string,
  idEstadoAplicacion: number,
  token: string
): Promise<boolean> {
  const data = await fetchApi<GenericResponse<boolean>>(
    `/Aplicacion/${idAplicacion}/estado/${idEstadoAplicacion}`,
    {
      method: 'PUT',
      token,
    }
  );
  return data?.data || false;
}