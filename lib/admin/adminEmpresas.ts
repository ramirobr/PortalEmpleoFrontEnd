import { fetchApi } from "@/lib/apiClient";
import {
  AdminEmpresasParams,
  AdminEmpresaUpdateRequest,
  DeleteEmpresaResponse,
  GetAdminEmpresaResponse,
  GetAdminEmpresasResponse,
  UpdateEmpresaStatusRequest,
  UpdateAdminEmpresaResponse,
  UpdateEmpresaStatusResponse,
} from "@/types/admin";

/**
 * Fetch paginated list of empresas for admin management
 */
export async function getAdminEmpresas(
  params: AdminEmpresasParams,
  token?: string,
): Promise<GetAdminEmpresasResponse | null> {
  return fetchApi<GetAdminEmpresasResponse>("/Admin/empresas", {
    method: "POST",
    token,
    body: {
      pageSize: params.pageSize,
      currentPage: params.currentPage,
      sortBy: params.sortBy ?? "",
      sortDirection: params.sortDirection ?? "",
      searchQuery: params.searchQuery ?? "",
      idEstado: params.idEstado ?? 0,
      plan: params.plan ?? "",
    },
  });
}

export async function getAdminEmpresaById(
  idEmpresa: string,
  token?: string,
): Promise<GetAdminEmpresaResponse | null> {
  return fetchApi<GetAdminEmpresaResponse>(`/Admin/empresas/${idEmpresa}`, {
    token,
  });
}

export async function updateAdminEmpresa(
  request: AdminEmpresaUpdateRequest,
  token?: string,
): Promise<UpdateAdminEmpresaResponse | null> {
  return fetchApi<UpdateAdminEmpresaResponse>(`/Admin/empresas/${request.idEmpresa}`, {
    method: "PUT",
    token,
    body: request,
  });
}

/**
 * Update empresa status (activate/suspend)
 */
export async function updateEmpresaStatus(
  request: UpdateEmpresaStatusRequest,
  token?: string,
): Promise<UpdateEmpresaStatusResponse | null> {
  return fetchApi<UpdateEmpresaStatusResponse>(
    `/Admin/empresas/${request.idEmpresa}/estado/${request.nuevoEstado}`,
    {
      method: "PUT",
      token,
    },
  );
}

/**
 * Delete an empresa
 */
export async function deleteEmpresa(
  idEmpresa: string,
  token?: string,
): Promise<DeleteEmpresaResponse | null> {
  return fetchApi<DeleteEmpresaResponse>(`/Admin/empresas/${idEmpresa}`, {
    method: "DELETE",
    token,
  });
}
