import { fetchApi } from "@/lib/apiClient";
import {
  AdminEmpresasParams,
  DeleteEmpresaResponse,
  GetAdminEmpresasResponse,
  UpdateEmpresaStatusRequest,
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

/**
 * Update empresa status (activate/suspend)
 */
export async function updateEmpresaStatus(
  request: UpdateEmpresaStatusRequest,
  token?: string,
): Promise<UpdateEmpresaStatusResponse | null> {
  return fetchApi<UpdateEmpresaStatusResponse>("/Admin/empresa/status", {
    method: "PUT",
    token,
    body: request,
  });
}

/**
 * Delete an empresa
 */
export async function deleteEmpresa(
  idEmpresa: string,
  token?: string,
): Promise<DeleteEmpresaResponse | null> {
  return fetchApi<DeleteEmpresaResponse>(`/Admin/empresa/${idEmpresa}`, {
    method: "DELETE",
    token,
  });
}
